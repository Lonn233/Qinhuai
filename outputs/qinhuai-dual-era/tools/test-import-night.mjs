import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { ImportNightLighting, TEMPLE_WASH, CENTRAL_TEMPLE_WASH, GATE_WASH, GATE_LIGHT_PRESETS, GATE_UNLIT_ROOF_NODES, TEMPLE_FOCUS } from '../import-night-lighting.js';
import { TEMPLE_STUDY_NODES, PAVILION_STUDY_NODES } from '../import-temple-study.js';
import {MATOU_GROUPS,matouGroupForNode,retainedMatouFixtureSegments} from '../import-matou-study.js';
const project = new URL('../', import.meta.url);
async function fileHash(url) {
  const hash = crypto.createHash('sha256');
  for await (const chunk of fs.createReadStream(url)) hash.update(chunk);
  return hash.digest('hex');
}
const layout = JSON.parse(fs.readFileSync(new URL('assets/qinhuai-modern-import/night/layout.json', project), 'utf8'));
const scene = new THREE.Scene(), rig = new ImportNightLighting(scene);
rig.layout = layout;
// prepare() normally provides these; the CPU harness bypasses network loading.
for (const group of MATOU_GROUPS) {
 const info=JSON.parse(fs.readFileSync(new URL(`assets/qinhuai-modern-import/night/matou-ma61/${group.softSpill}`,project)));
 rig.matouFields.set(group.id,{info,texture:new THREE.Data3DTexture(new Uint16Array(4),1,1,1)});
}
for(const name of Object.keys(layout.windowMasks))rig.masks.set(name,new THREE.Texture());
assert.equal(layout.version, 2);
let volumeBytes = 0, fieldDisposals = 0;
for (const [name, info] of Object.entries(layout.surfaceFields)) {
  assert.equal(info.size.length, 3);
  assert.ok(info.size.every(size => Number.isInteger(size) && size > 1 && size <= 280));
  assert.ok(info.min.every((value, axis) => Number.isFinite(value) && value < info.max[axis]));
  const data = new Uint8Array(fs.readFileSync(new URL(`assets/qinhuai-modern-import/night/${info.file}`, project)));
  assert.equal(data.length, info.bytes);
  assert.equal(data.length, info.size.reduce((a, b) => a * b, 1));
  assert.ok(data.some(value => value <= 2), `${name} has a near-dark falloff outside the eave wash`);
  assert.ok(data.some(value => value >= 240), `${name} has a bright eave core`);
  assert.ok(data.some(value => value > 32 && value < 200), `${name} has a soft transition`);
  assert.ok(info.eaveSegments > 0);
  const texture = new THREE.Data3DTexture(data, ...info.size);
  texture.addEventListener('dispose', () => fieldDisposals++);
  rig.surfaceFields.set(name, { info, texture });
  volumeBytes += data.length;
}
rig.stats.volumeBytes = volumeBytes;
assert.equal(rig.surfaceFields.size, 18);
assert.equal(volumeBytes, 15760092);
const original = new Map();
const sourceMap = new THREE.Texture();
const sourceMaterial = new THREE.MeshStandardMaterial({ color: 0x181716, map: sourceMap, roughness: .86 });
sourceMaterial.name = 'Temple source fixture';
const sourceColor = sourceMaterial.color.clone();
const sourceCompile = sourceMaterial.onBeforeCompile;
for (const [role, profile] of Object.entries(CENTRAL_TEMPLE_WASH)) {
  const rule = { role, zone: 'temple', node: `test-${role}`, bounds: { min: [-5, 12, -40], max: [5, 17, -30] } };
  const night = rig.materialFor(sourceMaterial, rule);
  assert.notEqual(night, sourceMaterial);
  assert.equal(night.map, sourceMap, 'surface wash reuses the source texture');
  assert.equal(night.emissiveMap, sourceMap);
  assert.equal(night.roughness, sourceMaterial.roughness);
  assert.equal(night.emissiveIntensity, profile.energy);
  assert.equal(night, rig.materialFor(sourceMaterial, rule), 'night material cache is stable');
  const shader = { uniforms: {}, vertexShader: '#include <project_vertex>', fragmentShader: '#include <emissivemap_fragment>' };
  night.onBeforeCompile(shader);
  assert.deepEqual(shader.uniforms.qhWashRange.value.toArray(), [12, 17]);
  assert.deepEqual(shader.uniforms.qhWashTexture.value.toArray(), [profile.floor, profile.relief]);
  assert.match(shader.vertexShader, /vQhWashPosition = \(modelMatrix \* qhWashPosition\).xyz/);
  assert.match(shader.fragmentShader, /inverseTransformDirection\(normal, viewMatrix\)/);
  assert.match(shader.fragmentShader, /qhResponse \* qhAlbedoTint/, 'source albedo preserves texture hue and shadows');
  assert.doesNotMatch(shader.fragmentShader, /#include <emissivemap_fragment>/);
  const other = rig.materialFor(sourceMaterial, { ...rule, node: `other-${role}`, bounds: { min: [0, 20, 0], max: [1, 25, 1] } });
  assert.notEqual(other, night, 'per-building height uniforms are isolated');
  assert.equal(other.customProgramCacheKey(), night.customProgramCacheKey(), 'height uniforms share one shader program');
  const otherShader = { uniforms: {}, vertexShader: '#include <project_vertex>', fragmentShader: '#include <emissivemap_fragment>' };
  other.onBeforeCompile(otherShader);
  assert.deepEqual(otherShader.uniforms.qhWashRange.value.toArray(), [20, 25]);
}
const background = rig.materialFor(sourceMaterial, { role: 'roof', zone: 'background', node: 'background' });
assert.equal(background.userData.templeSurfaceWash, undefined, 'surrounding city has no temple wash');
assert.equal(background.onBeforeCompile, sourceCompile);
assert.equal(sourceMaterial.onBeforeCompile, sourceCompile);
assert.equal(sourceMaterial.map, sourceMap);
assert.ok(sourceMaterial.color.equals(sourceColor));
assert.equal(sourceMaterial.emissiveIntensity, 1);
assert.equal(sourceMaterial.emissive.getHex(), 0);
const wrappedMaterials = [];
for (const [name, field] of rig.surfaceFields) {
  const data = Object.values(layout.tiles).find(tile => tile.materials.some(rule => rule.node === name));
  const rule = data.materials.find(rule => rule.node === name && rule.role === 'roof');
  assert.ok(rule, `${name} has a source roof binding`);
  assert.ok(!data.fixtures.some(fixture => fixture.node === name), `${name} has no narrow roof-strip fixtures`);
  const material = rig.materialFor(sourceMaterial, { ...rule, bounds: data.bounds[name] });
  if (GATE_UNLIT_ROOF_NODES.has(name)) {
    assert.equal(material, sourceMaterial, name + ' keeps the original non-emissive source material');
    assert.equal(material.emissive.getHex(), 0);
    assert.equal(material.onBeforeCompile, sourceCompile);
    continue;
  }
  const shader = { uniforms: {}, vertexShader: '#include <project_vertex>', fragmentShader: '#include <emissivemap_fragment>' };
  material.onBeforeCompile(shader);
  assert.equal(material.map, sourceMap);
  assert.equal(material.customProgramCacheKey(), `qinhuai-temple-wash-v6-${['FuziTemple0340','FuziTemple0341','FuziTemple0360','FuziTemple0361'].includes(name) ? 'gate' : 'building'}-${material.userData.templeSurfaceWash.albedoAware ? 'albedo' : 'legacy'}-wrap-${rule.zone === 'temple' ? 'focused' : 'full'}`);
  assert.equal(material.userData.roofWrap.node, name);
  assert.equal(shader.uniforms.qhWrapField.value, field.texture);
  assert.deepEqual(shader.uniforms.qhWrapMin.value.toArray(), field.info.min);
  const profile = ['FuziTemple0340','FuziTemple0341','FuziTemple0360','FuziTemple0361'].includes(name) ? GATE_WASH.roof : material.userData.templeFocus && !material.userData.templeFocus.peripheral ? CENTRAL_TEMPLE_WASH.roof : TEMPLE_WASH.roof;
  assert.deepEqual(shader.uniforms.qhWrapEnergy.value.toArray(), [profile.center, profile.edge]);
  assert.equal(shader.uniforms.qhWrapPower.value, profile.wrapPower ?? 1);
  assert.match(shader.fragmentShader, /uniform highp sampler3D qhWrapField/);
  assert.match(shader.fragmentShader, /texture\(qhWrapField, clamp\(qhWrapUv/);
  wrappedMaterials.push(material);
}
assert.equal(new Set(wrappedMaterials).size, 16, 'shared source materials retain separate roof fields');
assert.ok(background.emissiveIntensity < wrappedMaterials[0].emissiveIntensity / 10, 'background roofs remain subordinate');
const templeRules = Object.values(layout.tiles).flatMap(tile => tile.materials).filter(rule => ['templeFacade', 'templeTrim'].includes(rule.role));
assert.equal(new Set(templeRules.map(rule => rule.node)).size, 13);
assert.ok(templeRules.every(rule => rule.zone === 'temple'));
function focusedMaterial(node, role) {
  const tile = Object.values(layout.tiles).find(data => data.materials.some(rule => rule.node === node && (!role || rule.role === role)));
  assert.ok(tile, `${node} has a material binding`);
  const rule = tile.materials.find(rule => rule.node === node && (!role || rule.role === role));
  const material = rig.materialFor(sourceMaterial, { ...rule, bounds: tile.bounds[node] });
  const shader = {
    uniforms: {}, vertexShader: '#include <project_vertex>',
    fragmentShader: '#include <emissivemap_fragment>\n#include <lights_fragment_begin>',
  };
  material.onBeforeCompile(shader);
  return { material, shader };
}
for (const node of ['FuziTemple1087', 'FuziTemple1080']) {
  const { material, shader } = focusedMaterial(node, 'roof');
  assert.deepEqual(shader.uniforms.qhFocusBounds.value.toArray(), [...TEMPLE_FOCUS.min, ...TEMPLE_FOCUS.max]);
  assert.deepEqual(shader.uniforms.qhFocusStrength.value.toArray(), [TEMPLE_FOCUS.roofOutside, 1, TEMPLE_FOCUS.softness]);
  assert.equal(material.userData.templeFocus.peripheral, false);
  assert.equal(material.emissiveIntensity, CENTRAL_TEMPLE_WASH.roof.energy);
  assert.ok(CENTRAL_TEMPLE_WASH.roof.center < TEMPLE_WASH.roof.center);
  assert.ok(CENTRAL_TEMPLE_WASH.roof.edge < TEMPLE_WASH.roof.edge);
  assert.match(shader.vertexShader, /vQhFocusPosition = \(modelMatrix \* qhFocusPosition\).xyz/);
  assert.match(shader.fragmentShader, /smoothstep\(vec2\(0.0\)/);
  assert.match(shader.fragmentShader, /totalEmissiveRadiance \*= qhTempleFocus\(\)/);
}
for (const node of ['FuziTemple0751', 'FuziTemple1093']) {
  const { material, shader } = focusedMaterial(node, 'roof');
  assert.equal(material.userData.templeFocus.peripheral, true);
  assert.equal(shader.uniforms.qhFocusStrength.value.y, 0);
  assert.equal(material.emissiveIntensity, TEMPLE_WASH.roof.energy, 'peripheral profile stays unchanged');
}
const innerWindow = focusedMaterial('FuziTemple1094', 'window');
const outerWindow = focusedMaterial('FuziTemple0753', 'window');
assert.equal(innerWindow.shader.uniforms.qhFocusBounds.value.x, -13.35);
assert.equal(innerWindow.shader.uniforms.qhFocusStrength.value.x, TEMPLE_FOCUS.windowOutside);
assert.equal(outerWindow.shader.uniforms.qhFocusStrength.value.y, 0);
assert.notEqual(innerWindow.material, outerWindow.material, 'scoped windows do not share per-node uniforms');
for (const node of ['FuziTemple0876', 'FuziTemple0340', 'FuziTemple0341', 'FuziTemple0360', 'FuziTemple0361']) {
  const { material, shader } = focusedMaterial(node);
  assert.equal(material.userData.templeFocus, undefined, `${node} landmark stays outside courtyard masking`);
  assert.equal(shader.uniforms.qhFocusStrength, undefined);
  if (material.userData.templeSurfaceWash) assert.equal(material.emissiveIntensity, node === 'FuziTemple0876' ? TEMPLE_WASH.roof.energy : GATE_WASH.roof.energy, 'pavilion unchanged; gate subdued');
}
// Gate overrides cannot bleed into other signs sharing the original material.
for (const [node, role, energy] of [['FuziTemple0336', 'gateWood', GATE_LIGHT_PRESETS.gold.wood], ['FuziTemple0338', 'sign', GATE_LIGHT_PRESETS.gold.sign], ['FuziTemple0339', 'sign', GATE_LIGHT_PRESETS.gold.sign], ['FuziTemple0362', 'sign', GATE_LIGHT_PRESETS.gold.sign]]) {
  const gate = focusedMaterial(node, role).material;
  const other = rig.materialFor(sourceMaterial, { node: 'other-sign', role, zone: 'waterfront' });
  assert.notEqual(gate, other);
  assert.equal(gate.emissiveIntensity, energy);
  assert.ok(gate.emissiveIntensity < other.emissiveIntensity);
  assert.equal(gate.map, sourceMap);
}
for (const profile of [CENTRAL_TEMPLE_WASH.roof, GATE_WASH.roof]) {
  const response = luma => (profile.floor + (1 - profile.floor) * Math.pow(luma, profile.relief)) * Math.min(1.3, luma / Math.max(luma, .025));
  assert.equal(response(0), 0, 'black texels remain unlit');
  assert.ok(response(.01) < response(.2) * .25, 'dark crevices retain contrast');
  assert.ok(profile.floor < .1 && profile.wrapPower > 1, 'no broad bright emission floor');
}
function tileObject(id) {
  const data = layout.tiles[`tile-${String(id).padStart(2,'0')}`];
  const group = new THREE.Group();
  const names = new Set([...data.fixtures.map(f=>f.node), ...data.materials.map(f=>f.node), ...MATOU_GROUPS.filter(g=>g.tile===id).flatMap(g=>g.nodes)]);
  for (const name of names) {
    const rule = data.materials.find(f=>f.node===name) || matouGroupForNode(name)?.rules.find(r=>r.node===name);
    const mat = new THREE.MeshStandardMaterial({ color: 0x556677 });
    mat.name = rule?.material || 'SourceOriginal';
    mat.polygonOffset = true; mat.polygonOffsetFactor = -1;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), mat); mesh.name=name;
    mesh.position.set(1,2,3); if(matouGroupForNode(name)){const b=data.bounds[name];mesh.position.set(...b.min.map((v,i)=>(v+b.max[i])/2));} original.set(mesh,{material:mat,geometry:mesh.geometry,matrix:mesh.matrix.clone(),position:mesh.position.clone()});
    group.add(mesh);
  }
  return group;
}
rig.registerTile(9,tileObject(9));
assert.equal(rig.root.visible,false);
assert.equal(rig.stats.boats,10);
rig.setEnabled(true);
assert.equal(rig.root.visible,true);
assert.ok(rig.bindings.every(b=>b.mesh.material===b.night));
const firstCount=rig.stats.segments;
rig.registerTile(9,rig.tiles.get(9));assert.equal(rig.stats.segments,firstCount,'idempotent tile attachment');
rig.registerTile(10,tileObject(10));
assert.equal(rig.stats.boats,14,'late-loaded boats lit immediately');
assert.equal(rig.stats.washLights,3,'temple and pavilion use material light fields, not duplicate spotlights');
assert.equal(rig.root.getObjectByName('天下文枢·牌匾洗亮').intensity,GATE_LIGHT_PRESETS.gold.spot);
assert.ok(rig.bindings.every(b=>b.mesh.material===b.night));
rig.registerTile(5,tileObject(5));
rig.registerTile(6,tileObject(6));
assert.equal(rig.stats.tiles,4);
assert.equal(rig.stats.materialBindings,[9,10,5,6].reduce((sum,id)=>sum+new Set([...layout.tiles[`tile-${String(id).padStart(2,'0')}`].materials.map(r=>r.node),...MATOU_GROUPS.filter(g=>g.tile===id).flatMap(g=>g.nodes)]).size,0));
const studyNodes = new Set([...TEMPLE_STUDY_NODES, ...PAVILION_STUDY_NODES]);
const activeTiles = [9, 10, 5, 6].map(id => layout.tiles[`tile-${String(id).padStart(2, '0')}`]);
const activeFixtures = data => data.fixtures.filter(f => !studyNodes.has(f.node)).map(f=>({...f,segments:retainedMatouFixtureSegments(f)})).filter(f=>f.segments.length);
const expectedSegments = activeTiles.flatMap(activeFixtures).reduce((sum, f) => sum + f.segments.length / 6, 0);
const expectedBatches = activeTiles.reduce((sum, data) => sum + new Set(activeFixtures(data).map(f => f.kind)).size, 0);
assert.equal(rig.templeStudies.length, 26, 'courtyard uses the shared study shader');
assert.equal(rig.pavilionStudies.length, 3, 'pavilion uses the shared study shader');
assert.equal(rig.stats.wrappedRoofs,6, 'remaining roofs use the legacy wrap; study roofs are counted separately');
assert.equal(rig.stats.batches,expectedBatches);
assert.equal(rig.stats.segments,expectedSegments, 'study buildings must not receive duplicate fixture geometry');
assert.ok(rig.bindings.every(b=>b.mesh.material===b.night));
rig.setVisibility({wireframe:true});assert.equal(rig.root.visible,false);
rig.setVisibility({wireframe:false});assert.equal(rig.root.visible,true);
rig.setVisibility({modelVisible:false});assert.equal(rig.root.visible,false);
rig.setEnabled(false);
assert.ok(rig.bindings.every(b=>b.mesh.material===b.day),'day restores exact material instances');
for (const [mesh,source] of original) {
  assert.equal(mesh.geometry,source.geometry);assert.ok(mesh.position.equals(source.position));
  assert.equal(mesh.material,source.material);assert.equal(mesh.material.polygonOffsetFactor,-1);
}
rig.setVisibility({modelVisible:true});
for(let i=0;i<20;i++){rig.setEnabled(true);rig.setEnabled(false);}
assert.equal(rig.stats.boats,14); assert.equal(rig.stats.segments,expectedSegments);
// Compiled uniforms update in place: no extra material/geometry per selection.
const gateRoof = focusedMaterial('FuziTemple0340', 'roof');
const unaffected = [...rig.materialCache.values()].filter(m => !rig.gateMaterials.has(m)).map(m => [m, m.emissiveIntensity, m.emissive.getHex()]);
const cachedCount = rig.materialCache.size;
const gateVersion = gateRoof.material.version;
const gateProgram = gateRoof.material.customProgramCacheKey();
const fixtureStats = JSON.stringify(rig.stats);
assert.match(gateRoof.shader.fragmentShader, /smoothstep\(\.02, \.55, qhNormal.y\)/);
assert.match(gateRoof.shader.fragmentShader, /qhAlbedoLuma \/ 0.22/);
assert.equal(Object.keys(GATE_LIGHT_PRESETS).length, 4);
for (let repeat = 0; repeat < 4; repeat++) for (const [name, preset] of Object.entries(GATE_LIGHT_PRESETS)) {
  assert.equal(rig.setGatePreset(name), name);
  assert.equal(gateRoof.material.emissiveIntensity, preset.roof.energy);
  assert.equal(gateRoof.material.emissive.getHex(), preset.roof.color);
  assert.deepEqual(gateRoof.shader.uniforms.qhWrapEnergy.value.toArray(), [preset.roof.center, preset.roof.edge]);
  assert.equal(gateRoof.shader.uniforms.qhWrapPower.value, preset.roof.wrapPower);
  assert.equal(gateRoof.shader.uniforms.qhGateUnderside.value, preset.roof.underside);
  assert.ok(preset.roof.underside < .02, 'downward-facing roof gets under 2% of upward-facing wash');
  assert.equal(rig.root.getObjectByName('天下文枢·牌匾洗亮').intensity, preset.spot);
  assert.equal(gateRoof.material.version, gateVersion, 'selection does not recompile material');
  assert.equal(gateRoof.material.customProgramCacheKey(), gateProgram);
  assert.equal(rig.materialCache.size, cachedCount);
  assert.equal(JSON.stringify(rig.stats), fixtureStats);
  for (const node of ['FuziTemple0341', 'FuziTemple0360']) {
    const binding = rig.bindings.find(b => b.mesh.name === node);
    assert.equal(binding.night, binding.day, node + ' stays non-emissive in every preset');
    assert.equal(binding.night.emissive.getHex(), 0);
    assert.equal(rig.gateMaterials.has(binding.night), false);
  }
  for (const [m, intensity, color] of unaffected) { assert.equal(m.emissiveIntensity, intensity); assert.equal(m.emissive.getHex(), color); }
}
// Materials first encountered after choosing D inherit D, including shader uniforms.
const lateSource = sourceMaterial.clone();
const gateTile = layout.tiles['tile-09'];
const lateRule = gateTile.materials.find(r => r.node === 'FuziTemple0361' && r.role === 'roof');
const late = rig.materialFor(lateSource, { ...lateRule, bounds: gateTile.bounds[lateRule.node] });
assert.equal(late.emissiveIntensity, GATE_LIGHT_PRESETS.amber.roof.energy);
const lateShader = { uniforms: {}, vertexShader: '#include <project_vertex>', fragmentShader: '#include <emissivemap_fragment>' };
late.onBeforeCompile(lateShader);
assert.equal(lateShader.uniforms.qhWrapPower, rig.gateUniforms.power);
assert.equal(rig.setGatePreset('unknown'), 'gold');
assert.equal(rig.setGatePreset('__proto__'), 'gold');
assert.equal(late.emissiveIntensity, GATE_LIGHT_PRESETS.gold.roof.energy);
lateSource.dispose();
let total=0;
for (const [tile,data] of Object.entries(layout.tiles)) {
  for(const f of data.fixtures){
    assert.equal(f.segments.length%6,0);assert.ok(f.segments.every(Number.isFinite));total+=f.segments.length/6;
    const bounds=data.bounds[f.node];assert.ok(bounds);
    for(let i=0;i<f.segments.length;i+=3)for(let axis=0;axis<3;axis++)assert.ok(f.segments[i+axis]>=bounds.min[axis]-.2&&f.segments[i+axis]<=bounds.max[axis]+.2,`${f.node} lamp stays on source boundary`);
  }
}
assert.ok(total<8000,'light strips stay under geometry budget');
for(const [file,hash] of Object.entries(layout.sourceHashes)) {
  const bytes=fs.readFileSync(new URL(`assets/qinhuai-modern-import/tiles/${file}`,project));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),hash);
}
const baseline=JSON.parse(fs.readFileSync(new URL('../../../work/night-lighting-audit/baseline-hashes.json',import.meta.url),'utf8'));
const baselineDifferences=[];
for(const file of ['index.html','model-source.js','pilot-LOD2-lite.html',...Object.keys(baseline).filter(x=>x.endsWith('.glb'))]) {
 const hash=await fileHash(new URL(file,project));if(hash!==baseline[file]) baselineDifferences.push({file,expected:baseline[file],actual:hash});
}
const viewer=fs.readFileSync(new URL('qinhuai-modern-import.js',project),'utf8');
// Exercise the viewer's actual selector without a browser/GPU.
const gateButtons = Object.keys(GATE_LIGHT_PRESETS).map(key => ({ dataset: { gateLight: key }, classList: { toggle(name, value) { this[name] = value; } }, setAttribute(name, value) { this[name] = value; } }));
const gateDescription = { textContent: '' };
const selectorContext = { nightLighting: rig, GATE_LIGHT_PRESETS, URL,
  document: { querySelectorAll() { return gateButtons; }, querySelector() { return gateDescription; } },
  location: { href: 'http://127.0.0.1:4173/qinhuai-modern-import.html?time=night&view=gateDetail' },
  history: { state: null, replaceState(state, title, url) { this.url = String(url); } },
};
vm.createContext(selectorContext);
vm.runInContext(viewer.slice(viewer.indexOf('function setGateLighting('), viewer.indexOf("\nsetGateLighting(query")), selectorContext);
for (const key of Object.keys(GATE_LIGHT_PRESETS)) {
  selectorContext.setGateLighting(key);
  assert.equal(gateButtons.filter(b => b['aria-pressed'] === 'true').length, 1);
  assert.equal(gateButtons.find(b => b['aria-pressed'] === 'true').dataset.gateLight, key);
  assert.equal(gateDescription.textContent, GATE_LIGHT_PRESETS[key].description);
  const selectedUrl = new URL(selectorContext.history.url);
  assert.equal(selectedUrl.searchParams.get('gateLight'), key);
  assert.equal(selectedUrl.searchParams.get('view'), 'gateDetail');
}
selectorContext.setGateLighting('invalid');
assert.equal(rig.gatePreset, 'gold');


// Exercise the viewer's actual walking functions, including source GLB surfaces.
// This is geometry/state verification, not a browser screenshot or GPU test.
const walkCamera = new THREE.PerspectiveCamera(55, 1, .05, 3000);
walkCamera.position.set(13, 29, -14);
const initialWalkPose = walkCamera.position.clone();
const buttons = new Map();
const fakeDocument = { querySelector(selector) {
  if (!buttons.has(selector)) buttons.set(selector, { pressed: null, classList: { toggle() {} }, setAttribute(key, value) { this[key] = value; } });
  return buttons.get(selector);
} };
const walkState = {
  THREE, camera: walkCamera, keys: new Set(), velocity: new THREE.Vector3(),
  direction: new THREE.Vector3(), controlMode: 'orbit', cameraRevision: 0,
  modelRoot: new THREE.Group(), document: fakeDocument, setStatus() {},
  orbit: { enabled: true, enableDamping: true, target: new THREE.Vector3(-5.5, 14, -38), update() {} },
  firstPerson: { isLocked: false, unlock() { this.isLocked = false; },
    moveRight(distance) { walkCamera.position.x += distance; },
    moveForward(distance) { walkCamera.position.z -= distance; } },
};
vm.createContext(walkState);
const extractFunction = (start, end) => viewer.slice(viewer.indexOf(start), viewer.indexOf(end, viewer.indexOf(start)));
vm.runInContext(
  extractFunction('const WALK =', 'let totalBytes =') +
  extractFunction('function switchControl(mode)', 'async function loadManifest()') +
  extractFunction('function updateFirstPerson(delta)', 'function updatePerf(now)') +
  ';this.walkAPI = { registerWalkable, groundAt, switchControl, updateFirstPerson, clearMovement, WALK, WALKABLE_NODES, walkableMeshes, walkObstacles, isWalkBlocked };', walkState);
const walk = walkState.walkAPI;
const walkSourceNodes = new Set();
const importManifest = JSON.parse(fs.readFileSync(new URL('assets/qinhuai-modern-import/manifest.json', project), 'utf8'));
for (const tile of importManifest.tiles) {
  const bytes = fs.readFileSync(new URL('assets/qinhuai-modern-import/' + tile.file, project));
  const jsonLength = bytes.readUInt32LE(12);
  const doc = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8'));
  const retained = new Set();
  const keep = index => { retained.add(index); for (const child of doc.nodes[index].children || []) keep(child); };
  doc.nodes.forEach((node, index) => { if (walk.WALKABLE_NODES.has(node.name)) { walkSourceNodes.add(node.name); keep(index); } });
  if (!retained.size) continue;
  // Parse only walkable source geometry; omit materials to avoid DOM/image loading.
  // Original GLBs are never changed. Transforms, vertices and indices are retained.
  doc.nodes.forEach((node, index) => { if (!retained.has(index)) delete node.mesh; });
  doc.materials = (doc.materials || []).map(() => ({}));
  delete doc.images; delete doc.textures; delete doc.samplers;
  const json = Buffer.from(JSON.stringify(doc));
  const paddedLength = Math.ceil(json.length / 4) * 4;
  const tail = bytes.subarray(20 + jsonLength);
  const sanitized = Buffer.alloc(20 + paddedLength + tail.length, 0x20);
  bytes.copy(sanitized, 0, 0, 12); sanitized.writeUInt32LE(sanitized.length, 8);
  sanitized.writeUInt32LE(paddedLength, 12); sanitized.writeUInt32LE(0x4e4f534a, 16);
  json.copy(sanitized, 20); tail.copy(sanitized, 20 + paddedLength);
  const gltf = await new GLTFLoader().parseAsync(sanitized.buffer.slice(sanitized.byteOffset, sanitized.byteOffset + sanitized.byteLength), '');
  walk.registerWalkable(gltf.scene);
}
assert.equal(walkSourceNodes.size, walk.WALKABLE_NODES.size, 'all configured walk surfaces exist in the source GLBs');
const sourceFloor = walk.groundAt(-5, -29, 11.864055);
assert.ok(sourceFloor !== null && Math.abs(sourceFloor - 11.864055) < .02, 'spawn sits on the actual courtyard pavement');
assert.equal(walk.groundAt(-5, -29, sourceFloor + 3), null, 'ground search cannot snap from a roof to the ground');
walk.switchControl('firstPerson');
assert.equal(walkState.controlMode, 'firstPerson');
assert.equal(buttons.get('#firstPersonMode')['aria-pressed'], 'true');
assert.equal(walkState.orbit.enabled, false);
assert.ok(Math.abs(walkCamera.position.y - sourceFloor - walk.WALK.eyeHeight) < 1e-6);
walkState.firstPerson.isLocked = true; walkState.keys.add('KeyW');
const walkingStart = walkCamera.position.clone();
for (let i = 0; i < 60; i++) walk.updateFirstPerson(1 / 60);
assert.ok(walkingStart.distanceTo(walkCamera.position) > .2, 'W moves across actual source courtyard');
assert.ok(walkingStart.distanceTo(walkCamera.position) < 1.3, 'walking uses normalized scene scale');
walk.clearMovement(); const releasedPosition = walkCamera.position.clone(); walk.updateFirstPerson(.05);
assert.ok(walkCamera.position.equals(releasedPosition), 'release stops drifting');
walkState.firstPerson.isLocked = false; walkState.keys.add('KeyW'); walk.updateFirstPerson(.05);
assert.ok(walkCamera.position.equals(releasedPosition), 'unlocked pointer stops motion');
const eventHandlers = new Map();
walkState.window = { addEventListener(type, handler) { eventHandlers.set(type, handler); } };
walkState.document.addEventListener = (type, handler) => eventHandlers.set(type, handler);
vm.runInContext(extractFunction("window.addEventListener('keydown'", "renderer.domElement.addEventListener('click'"), walkState);
let prevented = 0;
const movementKey = { code: 'KeyW', target: { closest: () => false }, preventDefault() { prevented++; } };
walk.clearMovement();
eventHandlers.get('keydown')(movementKey);
assert.equal(walkState.keys.size, 0, 'unlocked view does not capture WASD');
walkState.firstPerson.isLocked = true;
eventHandlers.get('keydown')({ ...movementKey, target: { closest: () => true } });
assert.equal(walkState.keys.size, 0, 'form inputs keep their keys');
eventHandlers.get('keydown')(movementKey);
assert.ok(walkState.keys.has('KeyW'));
assert.equal(prevented, 1);
eventHandlers.get('blur')();
assert.equal(walkState.keys.size, 0, 'losing window focus clears held movement');
walk.switchControl('orbit');
eventHandlers.get('keydown')(movementKey);
assert.equal(walkState.keys.size, 0, 'orbit view keeps ordinary keyboard behavior');
assert.ok(walkCamera.position.equals(initialWalkPose), 'orbit camera pose is restored');
assert.equal(buttons.get('#firstPersonMode')['aria-pressed'], 'false');
// Small constructed surfaces test forbidden drops and upward steps.
for (const entry of walk.walkableMeshes) { entry.mesh.geometry.dispose(); for (const mat of [].concat(entry.mesh.material)) mat.dispose(); }
walk.walkableMeshes.length = 0;
const sparseBuilding = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
sparseBuilding.name = 'building facade';
const sparseVertices = new Float32Array([
  -2, 0, -1, 2, 0, -1, 2, 2, -1, -2, 0, -1, 2, 2, -1, -2, 2, -1,
  -2, 0, 1, 2, 0, 1, 2, 2, 1, -2, 0, 1, 2, 2, 1, -2, 2, 1,
]);
sparseBuilding.geometry.setAttribute('position', new THREE.BufferAttribute(sparseVertices, 3));
sparseBuilding.geometry.computeVertexNormals();
const sparseRoot = new THREE.Group(); sparseRoot.add(sparseBuilding); sparseRoot.updateWorldMatrix(true, true);
walk.walkObstacles.push({ mesh: sparseBuilding, bounds: new THREE.Box3().setFromObject(sparseBuilding) });
assert.equal(walk.isWalkBlocked(0, -.1, 0, .1, 0), false, 'open passage inside an irregular building AABB stays walkable');
sparseBuilding.geometry.dispose(); sparseBuilding.material.dispose(); walk.walkObstacles.length = 0;
const wall = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
wall.name = 'building facade'; wall.position.y = 1; wall.position.z = 0;
const wallRoot = new THREE.Group(); wallRoot.add(wall); wallRoot.updateWorldMatrix(true, true);
walk.walkObstacles.push({ mesh: wall, bounds: new THREE.Box3().setFromObject(wall) });
assert.equal(walk.isWalkBlocked(0, -.1, 0, .1, 0), true, 'actual facade triangles still block walking');
walk.walkObstacles.length = 0; wall.geometry.dispose(); wall.material.dispose();
const testFloor = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial());
testFloor.name = 'FuziTemple1082'; testFloor.rotation.x = -Math.PI / 2;
const testFloorRoot = new THREE.Group(); testFloorRoot.add(testFloor); walk.registerWalkable(testFloorRoot);
assert.equal(walk.groundAt(0, 0, 0), 0);
assert.equal(walk.groundAt(0, 0, -.5), null, 'high step is blocked');
assert.equal(walk.groundAt(0, 0, .6), null, 'large drop is blocked');
walkState.controlMode = 'firstPerson'; walkState.firstPerson.isLocked = true;
walkCamera.position.set(.99, walk.WALK.eyeHeight, 0); walk.clearMovement(); walkState.keys.add('KeyD');
walk.updateFirstPerson(.05);
assert.equal(walkCamera.position.x, .99, 'unloaded/unsupported ground blocks movement');
testFloor.geometry.dispose(); testFloor.material.dispose();
console.log(JSON.stringify({ firstPersonGeometryTests: true, sourceWalkSurfaces: [...walkSourceNodes], sourceSpawnFloor: sourceFloor, preciseBuildingCollision: true, groundStepsAndEdges: true, orbitRestored: true }, null, 2));

assert.equal((viewer.match(/new OutputPass\(/g)||[]).length,1);
assert.match(viewer,/timeOfDay === 'night' && !document.querySelector\('#wireframe'\).checked/);
rig.dispose();rig.dispose();assert.equal(rig.root.parent,null);
assert.equal(fieldDisposals,18,'each roof field is released exactly once');
assert.equal(rig.surfaceFields.size,0);
sourceMaterial.dispose(); sourceMap.dispose();
assert.ok([...original].every(([mesh,x])=>mesh.material===x.material));
console.log(JSON.stringify({runtimePassed:true,courtyardScopedEmission:true,pavilionStudyIntegrated:true,gateFourPresets:true,gateUndersideSuppressed:true,albedoAwareAmberWash:true,templeSurfaceWash:true,continuousRoofWrap:true,gateBackingAndDisplacedRidgesUnlit:true,wrappedRoofs:rig.stats.wrappedRoofs,volumeBytes,fieldDisposals,sourceTexturePreserved:true,perNodeWashBounds:true,sourceGlbsUnchanged:true,mainFilesMatchBaseline:baselineDifferences.length===0,baselineDifferences,dayMaterialRestoration:true,lateTileNightLighting:true,repeatedToggleStable:true,wireframeAndHide:true,outputPasses:1,lightSegments:expectedSegments,addedTriangles:expectedSegments*10,boats:14,shadowlessWashLights:rig.stats.washLights},null,2));

// Do not silently bless concurrent source edits: the full regression still fails.
// --runtime-only checks this feature while reporting unrelated baseline changes.
if (!process.argv.includes('--runtime-only')) assert.deepEqual(baselineDifferences,[], 'Files outside the night-viewer scope differ from the captured baseline; inspect without overwriting them.');
