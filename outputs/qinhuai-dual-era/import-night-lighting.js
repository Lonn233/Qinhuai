import {DRAGON_NODES} from './import-dragon-lighting.js';
import {attachBridgeLighting} from './import-bridge-lighting.js';
import {BRIDGE_NODES} from './import-bridge-config.mjs';
import {BuildingLightAdjustments} from './import-building-lighting.js';
import * as THREE from 'three';
import {ImportEnvironmentSpill} from './import-environment-spill.js';
import {ImportWaterReflections} from './import-water-reflections.js';
import {normalizeMapLights} from './import-light-controls.mjs';
import {MATOU_GROUPS,matouGroupForNode,attachMatouStudy,readMatouStudy,loadMatouField,retainedMatouFixtureSegments} from './import-matou-study.js';
import {attachTempleStudy,TEMPLE_STUDY_NODES,readTempleStudy,attachPavilionStudy,PAVILION_STUDY_NODES} from './import-temple-study.js';

// Additive night installation for the IMPORT VIEWER ONLY. No source GLB changes.
// Paths are measured in source-world coordinates by build_import_night_layout.py.
export const NIGHT_STYLE = Object.freeze({
  pavilion: { color: 0xffa931, energy: 4.4, radius: .013 },
  gate:     { color: 0xffa535, energy: 3.8, radius: .012 },
  temple:   { color: 0xffa32a, energy: 3.8, radius: .011 },
  eave:     { color: 0xffba6a, energy: 2.6, radius: .009 },
  distant:  { color: 0xffce99, energy: .65, radius: .007 },
  boat:     { color: 0xffaa30, energy: 4.7, radius: .014 },
  cool:     { color: 0x63ccde, energy: 1.25, radius: .007 },
  ridge:    { color: 0xffb34e, energy: 1.7, radius: .008 },
});
const LAYOUT_URL = new URL('./assets/qinhuai-modern-import/night/layout.json', import.meta.url);
const UP = new THREE.Vector3(0, 1, 0);

// Local, night-only floodlight approximation. Do not lift the albedo or global
// exposure: dark roof textures otherwise extinguish a conventional emissiveMap.
// The original maps, normals, roughness and daytime materials remain untouched.
export const TEMPLE_WASH = Object.freeze({
  roof:         { color: 0xffbc5f, energy: 1.0, floor: .52, relief: .62, center: .22, edge: 3.0 },
  templeFacade: { color: 0xff9e40, energy: .65, floor: .12, relief: .65 },
  templeTrim:   { color: 0xffb14a, energy: .78, floor: .18, relief: .60 },
});
// Central courtyard: amber eaves with dark, albedo-sensitive tile recesses.
// Keep the pavilion and peripheral profile above unchanged.
export const CENTRAL_TEMPLE_WASH = Object.freeze({
  roof:         { color: 0xe09a45, energy: .70, floor: .08, relief: .90, center: .12, edge: 1.80, wrapPower: 1.4, albedoAware: true },
  templeFacade: { color: 0xd98b3d, energy: .38, floor: .04, relief: .95, albedoAware: true },
  templeTrim:   { color: 0xe5a04b, energy: .48, floor: .06, relief: .90, albedoAware: true },
});
// Four gate-only options share geometry, textures and compiled shaders.
export const GATE_LIGHT_PRESETS = Object.freeze({
  gold: { label: 'A · 金檐暗瓦', description: '亮金檐口，暗瓦面；檐底保留阴影。', roof: { color: 0xffb52e, energy: 1.10, floor: 0, relief: .72, center: .012, edge: 2.2, wrapPower: 2.1, underside: .012, albedoAware: true }, sign: .85, wood: .11, spot: 22 },
  corners: { label: 'B · 檐角聚光', description: '缩窄柔光，突出飞檐与檐角，屋面明暗更强。', roof: { color: 0xffb92f, energy: 1.35, floor: 0, relief: .68, center: .004, edge: 2.6, wrapPower: 3.3, underside: .006, albedoAware: true }, sign: .76, wood: .08, spot: 18 },
  soft: { label: 'C · 金光渐染', description: '金色柔光向上侧瓦面扩散，檐底仍暗。', roof: { color: 0xffbe45, energy: 1.05, floor: 0, relief: .80, center: .028, edge: 2.0, wrapPower: 1.35, underside: .018, albedoAware: true }, sign: .95, wood: .14, spot: 24 },
  amber: { label: 'D · 浓金层次', description: '偏浓的琥珀金，保留瓦片亮点和深色瓦缝。', roof: { color: 0xff9f18, energy: 1.25, floor: 0, relief: 1.0, center: .008, edge: 2.4, wrapPower: 2.5, underside: .008, albedoAware: true }, sign: .82, wood: .10, spot: 20 },
});
// Verified against tile-09 in isolated front/top Blender views:
// 0341 is the backing/wood structure; 0360 holds side-ridge ornaments.
// Their alignment and missing wood bitmap are repaired separately on load.
// Keep the existing emission exclusions; illuminate the tiles and main ridge only.
export const GATE_UNLIT_ROOF_NODES = new Set(['FuziTemple0341', 'FuziTemple0360']);
export const GATE_WASH = Object.freeze({ roof: GATE_LIGHT_PRESETS.gold.roof });
const GATE_NODES = new Set([
  'FuziTemple0336', 'FuziTemple0338', 'FuziTemple0339', 'FuziTemple0362',
  'FuziTemple0340', 'FuziTemple0341', 'FuziTemple0360', 'FuziTemple0361',
]);
// Merged roofs span the courtyard and outside wings. Scope emission in world space.
export const TEMPLE_FOCUS = Object.freeze({
  min: Object.freeze([-14.65, -57.15]),
  max: Object.freeze([2.85, -23.15]),
  softness: .28,
  roofOutside: .025,
  windowOutside: .24,
});
const UNSCOPED_LANDMARKS = new Set([
  'FuziTemple0876', 'FuziTemple0340', 'FuziTemple0341',
  'FuziTemple0360', 'FuziTemple0361',
]);
const PERIPHERAL_TEMPLE_NODES = new Set([
  'FuziTemple0331', 'FuziTemple0751', 'FuziTemple0752',
  'FuziTemple0753', 'FuziTemple0754', 'FuziTemple1093',
]);
function templeScope(rule) {
  if (rule.zone !== 'temple' || UNSCOPED_LANDMARKS.has(rule.node)) return null;
  return {
    outside: rule.role === 'window' || rule.role === 'sign'
      ? TEMPLE_FOCUS.windowOutside : TEMPLE_FOCUS.roofOutside,
    peripheral: PERIPHERAL_TEMPLE_NODES.has(rule.node),
    minX: ['FuziTemple1094', 'FuziTemple1095'].includes(rule.node)
      ? -13.35 : TEMPLE_FOCUS.min[0],
  };
}
function installTempleScope(shader, scope) {
  shader.uniforms.qhFocusBounds = {
    value: new THREE.Vector4(scope.minX, TEMPLE_FOCUS.min[1], ...TEMPLE_FOCUS.max),
  };
  shader.uniforms.qhFocusStrength = {
    value: new THREE.Vector3(scope.outside, scope.peripheral ? 0 : 1, TEMPLE_FOCUS.softness),
  };
  shader.vertexShader = 'varying vec3 vQhFocusPosition;\n' + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
    #include <project_vertex>
    vec4 qhFocusPosition = vec4(transformed, 1.0);
    #ifdef USE_INSTANCING
      qhFocusPosition = instanceMatrix * qhFocusPosition;
    #endif
    vQhFocusPosition = (modelMatrix * qhFocusPosition).xyz;
  `);
  shader.fragmentShader = `varying vec3 vQhFocusPosition;
    uniform vec4 qhFocusBounds;
    uniform vec3 qhFocusStrength;
    float qhTempleFocus() {
      vec2 p = vQhFocusPosition.xz;
      vec2 edge = min(p - qhFocusBounds.xy, qhFocusBounds.zw - p);
      vec2 inside = smoothstep(vec2(0.0), vec2(qhFocusStrength.z), edge);
      return mix(qhFocusStrength.x, 1.0, inside.x * inside.y * qhFocusStrength.y);
    }\n` + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', `
    totalEmissiveRadiance *= qhTempleFocus();
    #include <lights_fragment_begin>
  `);
}
function installTempleWash(material, rule, field, gateUniforms) {
  const bounds = rule.bounds;
  const scope = templeScope(rule);
  const profile = GATE_NODES.has(rule.node) && GATE_WASH[rule.role]
    ? GATE_WASH[rule.role]
    : scope && !scope.peripheral ? CENTRAL_TEMPLE_WASH[rule.role] : TEMPLE_WASH[rule.role];
  material.emissive.setHex(profile.color);
  material.emissiveIntensity = profile.energy;
  material.userData.templeSurfaceWash = { role: rule.role, node: rule.node, ...profile };
  if (scope) material.userData.templeFocus = { ...scope };
  const roof = rule.role === 'roof';
  const wrap = roof && !!field;
  const gateRoof = wrap && GATE_NODES.has(rule.node);
  if (wrap) material.userData.roofWrap = { node: rule.node, ...field.info };
  material.onBeforeCompile = shader => {
    shader.uniforms.qhWashRange = { value: new THREE.Vector2(bounds?.min[1] ?? 12, bounds?.max[1] ?? 16) };
    shader.uniforms.qhWashTexture = { value: new THREE.Vector2(profile.floor, profile.relief) };
    if (wrap) {
      shader.uniforms.qhWrapField = { value: field.texture };
      shader.uniforms.qhWrapWorldToSource = { value: rule.washWorldToSource
        ? new THREE.Matrix4().fromArray(rule.washWorldToSource) : new THREE.Matrix4() };
      shader.uniforms.qhWrapMin = { value: new THREE.Vector3().fromArray(field.info.min) };
      shader.uniforms.qhWrapSize = { value: new THREE.Vector3().fromArray(field.info.max).sub(shader.uniforms.qhWrapMin.value) };
      shader.uniforms.qhWrapEnergy = { value: new THREE.Vector2(profile.center, profile.edge) };
      shader.uniforms.qhWrapPower = { value: profile.wrapPower ?? 1 };
    }
    if (gateRoof) {
      shader.uniforms.qhWashTexture = gateUniforms.texture;
      shader.uniforms.qhWrapEnergy = gateUniforms.energy;
      shader.uniforms.qhWrapPower = gateUniforms.power;
      shader.uniforms.qhGateUnderside = gateUniforms.underside;
    }
    shader.vertexShader = 'varying vec3 vQhWashPosition;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
      #include <project_vertex>
      vec4 qhWashPosition = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        qhWashPosition = instanceMatrix * qhWashPosition;
      #endif
      vQhWashPosition = (modelMatrix * qhWashPosition).xyz;
    `);
    shader.fragmentShader = `varying vec3 vQhWashPosition;
      uniform vec2 qhWashRange;
      uniform vec2 qhWashTexture;
      ${gateRoof ? 'uniform float qhGateUnderside;' : ''}
      ${wrap ? `uniform highp sampler3D qhWrapField;
        uniform mat4 qhWrapWorldToSource;
        uniform vec3 qhWrapMin;
        uniform vec3 qhWrapSize;
        uniform vec2 qhWrapEnergy;
        uniform float qhWrapPower;` : ''}\n` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
      ${profile.albedoAware ? `
        // Preserve original material hue and dark tile recesses.
        vec3 qhAlbedo = max(diffuseColor.rgb, vec3(0.0));
        float qhAlbedoLuma = dot(qhAlbedo, vec3(.2126, .7152, .0722));
        vec3 qhAlbedoTint = clamp(qhAlbedo / max(qhAlbedoLuma, .025), vec3(0.0), vec3(1.3));
        float qhResponse = mix(qhWashTexture.x, 1.0,
          pow(clamp(qhAlbedoLuma / ${gateRoof ? '0.22' : '1.0'}, 0.0, 1.0), qhWashTexture.y));
        totalEmissiveRadiance *= qhResponse * qhAlbedoTint;
      ` : `
      #ifdef USE_EMISSIVEMAP
        vec4 qhEmissiveTexel = texture2D(emissiveMap, vEmissiveMapUv);
        #ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
          qhEmissiveTexel = sRGBTransferEOTF(qhEmissiveTexel);
        #endif
        float qhLuma = dot(qhEmissiveTexel.rgb, vec3(.2126, .7152, .0722));
        totalEmissiveRadiance *= mix(qhWashTexture.x, 1.0,
          pow(clamp(qhLuma, 0.0, 1.0), qhWashTexture.y));
      #else
        // Untextured beams/plaster must not become solid luminous panels.
        totalEmissiveRadiance *= ${wrap ? '1.0' : '.42'};
      #endif
      `}
      vec3 qhNormal = normalize(inverseTransformDirection(normal, viewMatrix));
      float qhHeight = clamp((vQhWashPosition.y - qhWashRange.x) /
        max(qhWashRange.y - qhWashRange.x, .25), 0.0, 1.0);
      ${wrap ? `
        // A continuous 3D distance field follows curved eaves and each roof tier.
        // Light lives on the original tiles: no occluded line fixtures or beads.
        vec3 qhFieldPosition = (qhWrapWorldToSource * vec4(vQhWashPosition, 1.0)).xyz;
        vec3 qhWrapUv = (qhFieldPosition - qhWrapMin) / qhWrapSize;
        float qhWrap = texture(qhWrapField, clamp(qhWrapUv, 0.0, 1.0)).r;
        float qhSurface = ${gateRoof
          ? 'mix(qhGateUnderside, 1.0, smoothstep(.02, .55, qhNormal.y))'
          : 'mix(.48, 1.0, smoothstep(-.45, .52, qhNormal.y))'};
        float qhFalloff = qhWrapEnergy.x + qhWrapEnergy.y * pow(qhWrap, qhWrapPower);
        float qhAspect = .94 + .06 * abs(qhNormal.z);
      ` : roof ? `
        // Eaves remain brightest; underside is shaded, roof slopes softly lit.
        float qhSurface = mix(.24, 1.0, smoothstep(-.12, .72, qhNormal.y));
        float qhFalloff = mix(1.08, .77, smoothstep(.12, .95, qhHeight));
        float qhAspect = .87 + .13 * abs(dot(qhNormal, normalize(vec3(.45, .65, .6))));
      ` : `
        // Soft upward façade wash. Keep foundations and soffits comparatively dark.
        float qhSurface = mix(.28, 1.0, smoothstep(-.55, .05, qhNormal.y));
        float qhFalloff = mix(.46, 1.0, smoothstep(.04, .68, qhHeight));
        float qhAspect = .79 + .21 * abs(qhNormal.z);
      `}
      totalEmissiveRadiance *= qhSurface * qhFalloff * qhAspect;
    `);
    if (scope) installTempleScope(shader, scope);
  };
  // Bounds are uniforms; only roof vs façade changes the shader program.
  material.customProgramCacheKey = () => `qinhuai-temple-wash-v6-${gateRoof ? 'gate' : 'building'}-${profile.albedoAware ? 'albedo' : 'legacy'}-${wrap ? 'wrap' : roof ? 'roof' : 'facade'}-${scope ? 'focused' : 'full'}`;
}

/** One lazy installation, shared geometries/materials, no real-time shadow lights. */
export class ImportNightLighting {
  constructor(scene) {
    this.root = new THREE.Group();
    this.root.name = 'Import viewer / removable night fixtures';
    this.root.userData.excludeFromExport = true;
    this.root.visible = false;
    scene.add(this.root);
    this.waterReflections = new ImportWaterReflections(this.root);
    this.environmentSpill = new ImportEnvironmentSpill();
    this.buildingAdjustments = new BuildingLightAdjustments(this.environmentSpill);
    this.enabled = false;
    this.mapLightSettings = normalizeMapLights();
    this.modelVisible = true;
    this.wireframe = false;
    this.tiles = new Map();
    this.attached = new Set();
    this.bindings = [];
    this.bridgeMaterials = [];
    this.templeStudies = [];
    this.pavilionStudies = [];
    this.matouStudies = [];
    this.matouFields = new Map();
    this.matouSelection = readMatouStudy();
    this.templeSelection = readTempleStudy();
    // Restoring the courtyard favorite must not recolor the separate pavilion.
    this.pavilionSelection = readTempleStudy({useProjectSaved:false});
    this.templePreset = this.templeSelection.settings.id;
    this.masks = new Map();
    this.surfaceFields = new Map();
    this.materialCache = new Map();
    this.gateMaterials = new Map();
    this.gatePreset = 'gold';
    this.gateUniforms = {
      texture: { value: new THREE.Vector2() }, energy: { value: new THREE.Vector2() },
      power: { value: 1 }, underside: { value: .01 },
    };
    this.setGatePreset('gold');
    this.fixtureMaterials = new Map();
    this.maskVariants = new Map();
    this.geometry = new THREE.CylinderGeometry(1, 1, 1, 5, 1, true);
    this.layout = null;
    this.pending = null;
    this.disposed = false;
    this.buildingAdjustments.onChange=()=>this.applyMapLightSettings();
    this.stats = { tiles: 0, segments: 0, batches: 0, boats: 0, washLights: 0, materialBindings: 0, wrappedRoofs: 0, volumeBytes: 0 };
  }
  async prepare() {
    if (this.disposed) return;
    if (this.layout) return;
    if (!this.pending) this.pending = (async () => {
      const response = await fetch(LAYOUT_URL);
      if (!response.ok) throw new Error(`夜景灯位文件 HTTP ${response.status}`);
      const layout = await response.json();
      const loader = new THREE.TextureLoader();
      const maskJobs = Object.entries(layout.windowMasks).map(async ([name, file]) => {
        const map = await loader.loadAsync(new URL(file, LAYOUT_URL).href);
        map.colorSpace = THREE.NoColorSpace;
        return { kind: 'mask', name, resource: map };
      });
      const fieldJobs = Object.entries(layout.surfaceFields || {}).map(async ([name, info]) => {
        const result = await fetch(new URL(info.file, LAYOUT_URL));
        if (!result.ok) throw new Error(`${name} roof field HTTP ${result.status}`);
        const data = new Uint8Array(await result.arrayBuffer());
        if (data.length !== info.size.reduce((a, b) => a * b, 1)) throw new Error(`${name} roof field size mismatch`);
        const texture = new THREE.Data3DTexture(data, ...info.size);
        texture.format = THREE.RedFormat; texture.type = THREE.UnsignedByteType;
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.wrapS = texture.wrapT = texture.wrapR = THREE.ClampToEdgeWrapping;
        texture.unpackAlignment = 1; texture.generateMipmaps = false;
        texture.colorSpace = THREE.NoColorSpace; texture.needsUpdate = true;
        return { kind: 'field', name, info, resource: texture };
      });
      // Wait for every load before cleanup, including late successes after failure.
      const matouJobs = MATOU_GROUPS.map(async group => {
        const field = await loadMatouField(group);
        return {kind: 'matouField', name: group.id, info: field.info, resource: field.texture};
      });
      const results = await Promise.allSettled([...maskJobs, ...fieldJobs, ...matouJobs]);
      const failed = results.find(result => result.status === 'rejected');
      if (this.disposed || failed) {
        for (const result of results) if (result.status === 'fulfilled') result.value.resource.dispose();
        if (failed && !this.disposed) throw failed.reason;
        return;
      }
      for (const { value } of results) {
        if (value.kind === 'mask') this.masks.set(value.name, value.resource);
        else if (value.kind === 'matouField') this.matouFields.set(value.name, {info: value.info, texture: value.resource});
        else this.surfaceFields.set(value.name, { info: value.info, texture: value.resource });
      }
      this.stats.volumeBytes = [...this.surfaceFields.values(), ...this.matouFields.values()].reduce((sum, field) => sum + field.info.bytes, 0);
      this.layout = layout;
      this.environmentSpill.configure(layout);
      for (const [id, object] of this.tiles) this.attachTile(id, object);
    })().catch(error => { this.pending = null; throw error; });
    return this.pending;
  }
  registerTile(id, object) {
    if (this.disposed) return;
    this.tiles.set(id, object);
    this.waterReflections.registerWaterTile(id);
    if (this.layout) this.attachTile(id, object);
  }
  materialFor(original, rule) {
    if (rule.role === 'roof' && GATE_UNLIT_ROOF_NODES.has(rule.node)) return original;
    // Landmark roof wash is independent of shared background roof materials.
    const landmarkRoof = rule.role === 'roof' && rule.node === 'FuziTemple0876';
    const field = rule.role === 'roof' ? this.surfaceFields.get(rule.node) : null;
    const templeWash = !!field || rule.zone === 'temple' && !!TEMPLE_WASH[rule.role];
    const scope = templeScope(rule);
    const key = `${rule.node}:${original.uuid}:${rule.role}:${rule.zone}:${landmarkRoof}:${templeWash || scope || GATE_NODES.has(rule.node) ? rule.node : ''}`;
    if (this.materialCache.has(key)) return this.materialCache.get(key);
    const mat = original.clone();
    mat.name = `${original.name} / night ${rule.role}`;
    mat.userData.buildingLightRole=rule.role;
    const zone = rule.zone === 'background' ? .24 : 1;
    if (mat.emissive) {
      mat.emissive.setHex(0xffba70);
      mat.emissiveMap = original.map || null;
      const strength = { roof: .15, window: 2.4, sign: 1.25, boatCabin: .38,
        boatTrim: .8, pavilionWood: .28, gateWood: .25 };
      mat.emissiveIntensity = (strength[rule.role] || .1) * zone;
      if (rule.role === 'roof') {
        mat.emissive.setHex(0xffa631);
        // Reference: the pavilion and temple roofs carry golden wash;
        // surrounding streets stay dark. Original albedo still modulates it.
        mat.emissiveIntensity = landmarkRoof ? .65 : rule.zone === 'temple' ? .62 : .15 * zone;
      }
      if (GATE_NODES.has(rule.node) && ['gateWood', 'sign'].includes(rule.role)) {
        mat.emissive.setHex(rule.role === 'sign' ? 0xe8b16a : 0xce853c);
        mat.emissiveIntensity = rule.role === 'sign' ? .55 : .09;
      }
      if (rule.role === 'boatTrim' && original.name === 'FuziTemple0067') {
        mat.emissive.setHex(0xffae4c);
        mat.emissiveIntensity = 1.8;
      }
      if (rule.role === 'window' && original.map && this.masks.has(original.name)) {
        const maskKey = original.map.uuid;
        if (!this.maskVariants.has(maskKey)) {
          const mask = this.masks.get(original.name).clone();
          mask.flipY = original.map.flipY;
          mask.channel = original.map.channel;
          mask.wrapS = original.map.wrapS; mask.wrapT = original.map.wrapT;
          mask.repeat.copy(original.map.repeat); mask.offset.copy(original.map.offset);
          mask.center.copy(original.map.center); mask.rotation = original.map.rotation;
          mask.matrixAutoUpdate = original.map.matrixAutoUpdate;
          mask.matrix.copy(original.map.matrix); mask.needsUpdate = true;
          this.maskVariants.set(maskKey, mask);
        }
        mat.emissiveMap = this.maskVariants.get(maskKey);
      }
    }
    if (templeWash && mat.emissive) installTempleWash(mat, rule, field, this.gateUniforms);
    else if (scope && mat.emissive) {
      mat.userData.templeFocus = { ...scope };
      mat.onBeforeCompile = shader => installTempleScope(shader, scope);
      mat.customProgramCacheKey = () => 'qinhuai-temple-emission-scope-v1';
    }
    if (GATE_NODES.has(rule.node) && mat.emissive) {
      this.gateMaterials.set(mat, rule.role);
      this.applyGateMaterial(mat, rule.role);
    }
    this.materialCache.set(key, mat);
    return mat;
  }
  attachTile(id, object) {
    if (!this.layout || this.attached.has(id)) return;
    const tile = this.layout.tiles[`tile-${String(id).padStart(2, '0')}`];
    if (!tile) return;
    const group = new THREE.Group(); group.name = `Night / tile-${id}`;
    const byName = new Map();
    object.traverse(mesh => { if (mesh.isMesh) byName.set(mesh.name, mesh); });
    const rules = new Map();
    for (const rule of tile.materials) {
      if(BRIDGE_NODES[rule.node])continue;
      if (!rules.has(rule.node)) rules.set(rule.node, []);
      rules.get(rule.node).push(rule);
    }
    // Coping and white-wall nodes are absent from the generic night rules.
    // Include only audited nodes on this tile, never all users of their material.
    for (const target of MATOU_GROUPS.filter(target => target.tile === Number(id))) {
      for (const name of target.nodes) if (!rules.has(name)) rules.set(name, []);
    }
    for (const [name, meshRules] of rules) {
      const mesh = byName.get(name); if (!mesh) continue;
      const matouGroup = matouGroupForNode(name);
      if (matouGroup && matouGroup.tile === Number(id)) {
        let fallbackMaterial = mesh.material;
        if (matouGroup.minX !== null) {
          const originals = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const fallback = originals.map(mat => {
            const rule = meshRules.find(rule => rule.material === mat.name);
            return rule ? this.materialFor(mat, {...rule, bounds: tile.bounds[name]}) : mat;
          });
          fallbackMaterial = Array.isArray(mesh.material) ? fallback : fallback[0];
        }
        const study = attachMatouStudy(mesh, this.masks, this.matouFields.get(matouGroup.id), this.matouSelection.settings, {fallbackMaterial});
        this.matouStudies.push(study);
        this.bindings.push({mesh, day: study.day, night: study.night, dayGeometry: study.dayGeometry, nightGeometry: study.nightGeometry});
        if (this.enabled) { mesh.material = study.night; mesh.geometry = study.nightGeometry; }
        continue;
      }
      if (PAVILION_STUDY_NODES.has(name)) {
        const study = attachPavilionStudy(mesh, meshRules, tile.bounds[name], this.surfaceFields, this.pavilionSelection.settings);
        this.pavilionStudies.push(study);
        this.bindings.push({mesh, day: study.day, night: study.night});
        if (this.enabled) mesh.material = study.night;
        continue;
      }
      if (TEMPLE_STUDY_NODES.has(name)) {
        const study = attachTempleStudy(mesh, this.surfaceFields, this.masks, this.templeSelection.settings);
        this.templeStudies.push(study);
        this.bindings.push({mesh, day: study.day, night: study.night});
        if (this.enabled) mesh.material = study.night;
        continue;
      }
      const day = mesh.material;
      const mats = Array.isArray(day) ? day : [day];
      const night = mats.map(mat => {
        const rule = meshRules.find(r => r.material === mat.name);
        return rule ? this.materialFor(mat, { ...rule, bounds: tile.bounds[name], washWorldToSource: mesh.userData.gateRoofRepair?.worldToSource }) : mat;
      });
      this.bindings.push({ mesh, day, night: Array.isArray(day) ? night : night[0] });
      if (this.enabled) mesh.material = Array.isArray(day) ? night : night[0];
    }
    if(Number(id)===9)this.bridgeMaterials.push(...attachBridgeLighting(byName,this.bindings,this.enabled));
    const batches = new Map();
    for (const fixture of tile.fixtures) {
      // Retire the original architectural outline tubes. Boat fittings are independent.
      if (fixture.kind !== 'boat') continue;
      // A missing source node must not leave floating lights after an asset revision.
      if (!byName.has(fixture.node) || TEMPLE_STUDY_NODES.has(fixture.node) || PAVILION_STUDY_NODES.has(fixture.node)) continue;
      const retained = retainedMatouFixtureSegments(fixture);
      if (!retained.length) continue;
      if (!batches.has(fixture.kind)) batches.set(fixture.kind, []);
      batches.get(fixture.kind).push(...retained);
    }
    const matrix = new THREE.Matrix4(), q = new THREE.Quaternion();
    const start = new THREE.Vector3(), end = new THREE.Vector3(), center = new THREE.Vector3();
    const direction = new THREE.Vector3(), scale = new THREE.Vector3();
    for (const [kind, segments] of batches) {
      const style = NIGHT_STYLE[kind]; if (!style) continue;
      if (!this.fixtureMaterials.has(kind)) this.fixtureMaterials.set(kind,
        new THREE.MeshBasicMaterial({ color: new THREE.Color(style.color).multiplyScalar(style.energy), fog: true }));
      const count = segments.length / 6;
      const instanced = new THREE.InstancedMesh(this.geometry, this.fixtureMaterials.get(kind), count);
      instanced.name = `Source-aligned ${kind} lights / tile-${id}`;
      instanced.userData.nightFixture = true;
      instanced.castShadow = false; instanced.receiveShadow = false;
      for (let i = 0; i < count; i++) {
        start.fromArray(segments, i * 6); end.fromArray(segments, i * 6 + 3);
        direction.subVectors(end, start); const length = direction.length();
        q.setFromUnitVectors(UP, direction.normalize());
        center.addVectors(start, end).multiplyScalar(.5);
        scale.set(style.radius, length + .008, style.radius);
        matrix.compose(center, q, scale); instanced.setMatrixAt(i, matrix);
      }
      instanced.instanceMatrix.needsUpdate = true;
      instanced.computeBoundingSphere(); group.add(instanced);
      this.stats.segments += count; this.stats.batches++;
    }
    this.addWashLights(group, id);
    this.root.add(group); this.attached.add(id);
    this.stats.tiles = this.attached.size;
    this.waterReflections.attachTile(id,tile,byName);
    this.environmentSpill.configure(this.layout);
    this.environmentSpill.attachTile(id,object,tile,new Set([...rules.keys(),...Object.keys(BRIDGE_NODES),...Object.keys(DRAGON_NODES)]));
    this.stats.boats += tile.boats.length;
    this.stats.materialBindings = this.bindings.length;
    this.stats.wrappedRoofs = new Set(this.bindings.filter(binding =>
      (Array.isArray(binding.night) ? binding.night : [binding.night]).some(mat => mat.userData.roofWrap)
    ).map(binding => binding.mesh.name)).size;
    this.buildingAdjustments.attach(this.bindings,group,id);
    this.environmentSpill.attachBindings(this.bindings);
    this.applyMapLightSettings();
    this.syncVisibility();
  }
  addWashLights(group, id) {
    // Distances are local model units. Seven shadowless spots, not hundreds of
    // point lights: warm roof/façade wash without another full-scene shadow pass.
    const specs = id === 10 ? [
      ['魁星阁·南侧洗檐',[9.3,12.0,-4.6],[11.27,14.65,-6.82],42,9,.65],
      ['魁星阁·北侧洗檐',[13.2,12.1,-8.9],[11.27,14.9,-6.82],38,9,.68],
      ['东岸商铺暖光',[22,12.1,-3],[22,14,-10],90,16,.95],
    ] : id === 9 ? [
      ['天下文枢·牌匾洗亮',[-5.2,12.05,-11.0],[-5.24,14.15,-13.46],18,8,.85],
      ['大成殿·前殿暖光',[-10.4,12.1,-29],[-5.5,13.55,-34],80,16,.82],
      ['后殿·屋顶层次',[.1,12.1,-40],[-5.5,14.15,-44],85,16,.82],
      ['西岸商铺暖光',[-21,12.1,-5.5],[-23,14,-11],90,16,.95],
    ] : [];
    for (const [name, position, target, intensity, distance, angle] of specs) {
      // Superseded by the trial preset: avoid duplicate wash on the scoped courtyard.
      if (name === '大成殿·前殿暖光' || name === '后殿·屋顶层次' || name === '魁星阁·南侧洗檐' || name === '魁星阁·北侧洗檐') continue;
      const light = new THREE.SpotLight(0xffaa55, intensity, distance, angle, .85, 2);
      if (name === '天下文枢·牌匾洗亮') light.intensity = GATE_LIGHT_PRESETS[this.gatePreset].spot;
      light.userData.mapLightBase = {intensity, distance, angle};
      light.name = name; light.position.fromArray(position);
      light.target.position.fromArray(target); light.castShadow = false;
      group.add(light, light.target); this.stats.washLights++;
    }
  }
  applyGateMaterial(material, role) {
    const preset = GATE_LIGHT_PRESETS[this.gatePreset];
    if (role === 'roof') {
      material.emissive.setHex(preset.roof.color);
      material.emissiveIntensity = preset.roof.energy;
      if (material.userData.templeSurfaceWash) Object.assign(material.userData.templeSurfaceWash, preset.roof);
    } else if (role === 'sign' || role === 'gateWood') {
      material.emissive.setHex(role === 'sign' ? 0xffcb83 : 0xd99a48);
      material.emissiveIntensity = role === 'sign' ? preset.sign : preset.wood;
    }
  }
  setGatePreset(name) {
    this.gatePreset = Object.hasOwn(GATE_LIGHT_PRESETS, name) ? name : 'gold';
    const preset = GATE_LIGHT_PRESETS[this.gatePreset];
    const roof = preset.roof;
    this.gateUniforms.texture.value.set(roof.floor, roof.relief);
    this.gateUniforms.energy.value.set(roof.center, roof.edge);
    this.gateUniforms.power.value = roof.wrapPower;
    this.gateUniforms.underside.value = roof.underside;
    for (const [material, role] of this.gateMaterials) this.applyGateMaterial(material, role);
    const light = this.root.getObjectByName('天下文枢·牌匾洗亮');
    if (light) { light.intensity = preset.spot * this.mapLightSettings.washIntensity; this.buildingAdjustments.applyWashLight(light); }
    this.updateEnvironmentSources();
    return this.gatePreset;
  }
  refreshTempleStudy() {
    this.templeSelection = readTempleStudy();
    this.matouSelection = readMatouStudy();
    this.pavilionSelection = readTempleStudy({useProjectSaved:false});
    this.templePreset = this.templeSelection.settings.id;
    this.applyMapLightSettings();
    return this.templeSelection;
  }
  setMapLightSettings(settings) {
    this.mapLightSettings = normalizeMapLights(settings);
    this.applyMapLightSettings();
  }
  applyMapLightSettings() {
    const p = this.mapLightSettings;
    this.updateEnvironmentSources();
    this.waterReflections.apply(p,{matou:this.matouSelection.settings,pavilion:this.pavilionSelection.settings,styles:NIGHT_STYLE,buildingAdjustments:this.buildingAdjustments.saved});
    // Always restore the study source first: repeated slider input must not compound.
    for (const [studies, selection] of [[this.templeStudies,this.templeSelection],[this.pavilionStudies,this.pavilionSelection]]) {
      for (const study of studies) {
        study.lighting.apply(selection.settings);
        // The roof shader uses width as a falloff exponent (inverse visible width).
        study.lighting.uniforms.width.value /= p.eaveWidth;
      }
    }
    for (const study of this.matouStudies) {
      study.apply(this.matouSelection.settings);
      study.spill.active.value *= p.spillIntensity;
      study.spill.parameters.spread.value.multiply(new THREE.Vector3(p.spillHorizontal,p.spillUp,p.spillDown));
      study.spill.parameters.falloff.value *= p.spillFalloff;
    }
    this.root.traverse(light => {
      const base = light.userData.mapLightBase;
      if (!base || !light.isSpotLight) return;
      light.intensity = (light.name === '天下文枢·牌匾洗亮' ? GATE_LIGHT_PRESETS[this.gatePreset].spot : base.intensity) * p.washIntensity;
      light.distance = base.distance * p.washDistance;
      light.angle = Math.min(Math.PI / 2, base.angle * p.washAngle);
      light.penumbra = p.washPenumbra;
      this.buildingAdjustments.applyWashLight(light);
    });
  }
  updateEnvironmentSources() {
    this.environmentSpill.setSources({temple:this.templeSelection.settings,pavilion:this.pavilionSelection.settings,matou:this.matouSelection.settings,gate:GATE_LIGHT_PRESETS[this.gatePreset],styles:NIGHT_STYLE});
  }
  update(time) { if(this.enabled){this.waterReflections.update(time);this.environmentSpill.update();} }
  setWaterVisible(visible) { this.waterReflections.setWaterVisible(visible); }
  setEnabled(enabled) {
    this.enabled = !!enabled;
    for (const binding of this.bindings) {
      binding.mesh.material = enabled ? binding.night : binding.day;
      if (binding.dayGeometry) binding.mesh.geometry = enabled ? binding.nightGeometry : binding.dayGeometry;
    }
    this.syncVisibility();
  }
  setVisibility({ modelVisible = this.modelVisible, wireframe = this.wireframe } = {}) {
    this.modelVisible = modelVisible; this.wireframe = wireframe; this.syncVisibility();
  }
  syncVisibility() { this.root.visible = this.enabled && this.modelVisible && !this.wireframe; this.environmentSpill.setState({night:this.enabled,modelVisible:this.modelVisible,wireframe:this.wireframe}); }
  dispose() {
    if (this.disposed) return;
    this.setEnabled(false); this.disposed = true;
    this.environmentSpill.dispose();
    this.buildingAdjustments.dispose();
    for(const material of this.bridgeMaterials)material.dispose();
    this.bridgeMaterials.length=0;
    this.waterReflections.dispose();
    this.root.traverse(object => { if (object.isInstancedMesh) object.dispose(); });
    this.root.removeFromParent(); this.root.clear(); this.geometry.dispose();
    for (const study of this.templeStudies) study.dispose();
    this.templeStudies.length = 0;
    for (const study of this.pavilionStudies) study.dispose();
    this.pavilionStudies.length = 0;
    for (const study of this.matouStudies) study.dispose();
    this.matouStudies.length = 0;
    for (const field of this.matouFields.values()) field.texture.dispose();
    this.matouFields.clear();
    for (const mat of this.materialCache.values()) mat.dispose();
    for (const mat of this.fixtureMaterials.values()) mat.dispose();
    for (const map of this.maskVariants.values()) map.dispose();
    for (const map of this.masks.values()) map.dispose();
    for (const field of this.surfaceFields.values()) field.texture.dispose();
    this.surfaceFields.clear(); this.masks.clear(); this.gateMaterials.clear();
    this.tiles.clear(); this.bindings.length = 0;
  }
}
