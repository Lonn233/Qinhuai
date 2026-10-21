import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {PRESETS,STORAGE_KEY,readSaved,validSettings,NUMERIC_CONTROLS,extraDefaults} from './profiles.mjs';
import {applyEnvironment} from './environment.mjs';
import {createBuildingLighting} from './lighting.js';
import {buildingRegion,corridorEaveMask,REGION_GLSL} from './regions.mjs';
import validator from '../../tools/asset-deps/node_modules/gltf-validator/index.js';
const root=new URL('../../',import.meta.url),assets=new URL('assets/building-study/temple/',root);
const bytes=fs.readFileSync(new URL('temple.glb',assets));
const validation=await validator.validateBytes(new Uint8Array(bytes),{maxIssues:30});
assert.equal(validation.issues.numErrors,0,JSON.stringify(validation.issues));
const manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',assets)));
const size=bytes.readUInt32LE(12),original=JSON.parse(bytes.subarray(20,20+size));
assert.equal(original.nodes.length,55);assert.equal(original.images.length,24);
for(const n of original.nodes)assert.ok(/^FuziTemple(10[7-9]\d|11[01]\d|112[0-4])$/.test(n.name));
const doc=structuredClone(original);
// Browser texture decoding is not available in this CPU fixture. Keep material
// names, geometry and transforms intact, and substitute texture handles below.
for(const m of doc.materials){const name=m.name;Object.keys(m).forEach(k=>delete m[k]);m.name=name;}
delete doc.images;delete doc.textures;delete doc.samplers;
const j=Buffer.from(JSON.stringify(doc)),n=Math.ceil(j.length/4)*4;
const test=Buffer.alloc(20+n+bytes.length-20-size,0x20);bytes.copy(test,0,0,12);test.writeUInt32LE(test.length,8);test.writeUInt32LE(n,12);test.writeUInt32LE(0x4e4f534a,16);j.copy(test,20);bytes.copy(test,20+n,20+size);
const {scene}=await new GLTFLoader().parseAsync(test.buffer.slice(test.byteOffset,test.byteOffset+test.byteLength),'');
scene.updateMatrixWorld(true);const before=new Map();scene.traverse(o=>{if(o.isMesh)before.set(o.name,{geometry:o.geometry,matrix:o.matrixWorld.clone(),material:o.material});});
const fields=new Map();for(const [name,info] of Object.entries(manifest.fields)){const data=fs.readFileSync(new URL(info.file,assets));assert.equal(data.length,info.size.reduce((a,b)=>a*b,1));fields.set(name,{info,texture:new THREE.Data3DTexture(data,...info.size)});}
for(const file of Object.values(manifest.masks))assert.ok(fs.statSync(new URL(file,assets)).size>0);
const light=createBuildingLighting(scene,manifest,fields,new Map());assert.ok(light.roofCount>=5);
for(const p of PRESETS){assert.ok(validSettings(p));light.apply(p);assert.equal(light.uniforms.levels.value.x,p.eave);light.apply(p,false);assert.equal(light.uniforms.levels.value.length(),0);}
// Overall dimming must preserve all zone ratios and the eave falloff.
for(const p of PRESETS){
 assert.equal(p.brightness,1);
 for(const brightness of [0,.5,1,2.5]){
  light.apply({...p,brightness});
  assert.deepEqual(light.uniforms.levels.value.toArray(),[p.eave,p.roof,p.facade,p.window].map(v=>v*brightness));
  assert.equal(light.uniforms.width.value,p.width);
  light.apply({...p,brightness},false);assert.equal(light.uniforms.levels.value.length(),0);
 }
}
const brightnessRecord={...PRESETS[0],key:'brightness',label:'自定亮度',brightness:.65};
assert.equal(readSaved(JSON.stringify({version:1,items:[brightnessRecord]}))[0].brightness,.65);
const legacy={...brightnessRecord};delete legacy.brightness;
assert.equal(readSaved(JSON.stringify({version:1,items:[legacy]}))[0].brightness,1);
for(const brightness of [-1,2.51,null,'1',Infinity]){
 assert.equal(validSettings({...brightnessRecord,brightness}),false);
 assert.deepEqual(readSaved(JSON.stringify({version:1,items:[{...brightnessRecord,brightness}]})),[]);
}
assert.deepEqual(readSaved(JSON.stringify({version:1,items:[null]})),[]);
// All added material controls are bound to live uniforms, not UI-only values.
const tuned={...PRESETS[0],brightness:1.4,ridgeGain:2.3,underside:.12,transition:.7,textureContrast:1.4,textureRetention:.3,sign:1.2,facadeColor:'#e28030',windowColor:'#ffcf85',exposure:1.1,ambient:.7,moon:1.2,bloomRadius:.9,bloomThreshold:1.8};
assert.ok(validSettings(tuned));light.apply(tuned);
assert.deepEqual(light.uniforms.shape.value.toArray(),[2.3,.12,.7,1.4]);
assert.equal(light.uniforms.sign.value,1.2*1.4);assert.equal(light.uniforms.retention.value,.3);
assert.ok(light.uniforms.facadeTint.value.equals(new THREE.Color(tuned.facadeColor)));
assert.ok(light.uniforms.windowTint.value.equals(new THREE.Color(tuned.windowColor)));
light.apply({...tuned,window:0});assert.equal(light.uniforms.sign.value,1.2*1.4);
light.apply(tuned,false);assert.equal(light.uniforms.sign.value,0);assert.equal(light.uniforms.levels.value.length(),0);
const preview={renderer:{},bloom:{},ambientLight:new THREE.HemisphereLight(),moonLight:new THREE.DirectionalLight()};
applyEnvironment(tuned,preview);
assert.equal(preview.renderer.toneMappingExposure,1.1);assert.equal(preview.ambientLight.intensity,.7);assert.equal(preview.moonLight.intensity,1.2);
assert.deepEqual(preview.bloom,{strength:tuned.bloom,radius:.9,threshold:1.8});
applyEnvironment(tuned,preview,false);assert.equal(preview.bloom.strength,0);assert.equal(preview.ambientLight.intensity,.7);
const savedTuned={...tuned,key:'extended',label:'建筑分区'};
assert.deepEqual(readSaved(JSON.stringify({version:1,items:[savedTuned]})),[savedTuned]);
const oldSettings={...PRESETS[0],key:'old',label:'旧建筑方案'};
for(const key of Object.keys(extraDefaults(oldSettings)))delete oldSettings[key];
const migrated=readSaved(JSON.stringify({version:1,items:[oldSettings]}))[0];
assert.ok(validSettings(migrated));assert.equal(migrated.facadeColor,oldSettings.color);assert.equal(migrated.sign,oldSettings.window*.55);assert.equal(migrated.underside,0);
for(const [key,,min,max] of NUMERIC_CONTROLS){
 for(const value of [min,max])assert.ok(validSettings({...tuned,[key]:value}));
 for(const value of [min-1,max+1,null,'1'])assert.equal(validSettings({...tuned,[key]:value}),false);
}
assert.equal(validSettings({...tuned,windowColor:'bad-color'}),false);
// Roof wash and eave contours have independent colors; older saves retain both.
for(const p of PRESETS)assert.equal(p.roofColor,p.color);
const split={...PRESETS[0],color:'#ff9b26',roofColor:'#607eaa'};
light.apply(split);
assert.ok(light.uniforms.tint.value.equals(new THREE.Color(split.color)));
assert.ok(light.uniforms.roofTint.value.equals(new THREE.Color(split.roofColor)));
const eaveTint=light.uniforms.tint.value.clone();
light.apply({...split,roofColor:'#aa8844'});assert.ok(light.uniforms.tint.value.equals(eaveTint));
const roofTint=light.uniforms.roofTint.value.clone();
light.apply({...split,roofColor:'#aa8844',color:'#ff4422'});assert.ok(light.uniforms.roofTint.value.equals(roofTint));
const splitSaved={...split,key:'split',label:'檐口金色屋面冷色'};
assert.deepEqual(readSaved(JSON.stringify({version:1,items:[splitSaved]})),[splitSaved]);
const oldColorSave={...splitSaved};delete oldColorSave.roofColor;
assert.equal(readSaved(JSON.stringify({version:1,items:[oldColorSave]}))[0].roofColor,oldColorSave.color);
assert.equal(validSettings({...split,roofColor:'invalid'}),false);
let roofShaders=0;
for(const m of light.materials){
 const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};m.onBeforeCompile(shader);
 if(shader.fragmentShader.includes('vec3 bsRoofLight=')){
  roofShaders++;assert.equal(shader.uniforms.bsRoofTint,light.uniforms.roofTint);assert.equal(shader.uniforms.bsTint,light.uniforms.tint);
  assert.ok(shader.fragmentShader.includes('bsRoofTint*bsLevels.y*bsTop'));
  assert.ok(shader.fragmentShader.includes('bsTint*bsContour*(bsTop+bsBottom)'));
 }
}
assert.equal(roofShaders,light.roofCount);
scene.traverse(o=>{if(!o.isMesh)return;assert.equal(o.geometry,before.get(o.name).geometry);assert.ok(o.matrixWorld.equals(before.get(o.name).matrix));});
for(const mat of light.materials){const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};mat.onBeforeCompile(shader);assert.ok(shader.fragmentShader.includes('bsAlbedo'));assert.ok(shader.vertexShader.includes('vBsWorld='));assert.ok(!shader.fragmentShader.includes('undefined'));}
assert.notEqual(STORAGE_KEY,'qinhuai.lantern-light-studies.v1');
assert.deepEqual(readSaved('{'),[]);assert.deepEqual(readSaved(JSON.stringify({version:1,items:[{...PRESETS[0],key:'1',label:'test',eave:Infinity}]})),[]);
const record={...PRESETS[0],key:'one',label:'建筑金檐'};assert.equal(readSaved(JSON.stringify({version:1,items:[record,record]})).length,1);
const lantern=fs.readFileSync(new URL('lion-light-study.html',root),'utf8');assert.ok(lantern.includes('building-light-study.html'));assert.ok(lantern.includes('study.bundle.js'));
// Spatial policies target parts of merged source meshes, across all presets.
for(const [x,z] of [[-14,-31],[-14,-38],[-16,-54],[3,-31],[5,-45],[3,-54]])assert.equal(buildingRegion(x,z),'unlit');
for(const [x,z] of [[-11.6,-31],[1,-31]])assert.equal(buildingRegion(x,z),'eave-only');
for(const [x,z] of [[-5.6,-38],[-5.6,-26],[-5.6,-54],[-11,-46],[0,-46]])assert.equal(buildingRegion(x,z),'normal');
for(const x of [-12.44,-10.76,.22,1.9])assert.equal(corridorEaveMask(x,-31),1);
for(const x of [-11.6,1])assert.equal(corridorEaveMask(x,-31),0);
assert.equal(corridorEaveMask(-5.6,-38),0);
assert.ok(!REGION_GLSL.includes('--')); // Negative bounds must not become GLSL decrement tokens.
for(const preset of PRESETS){
 light.apply({...preset,brightness:2.5});
 for(const material of light.materials){
  const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};material.onBeforeCompile(shader);
  assert.ok(shader.fragmentShader.includes(REGION_GLSL));
  assert.ok(shader.fragmentShader.includes('float bsPolicy=bsRegion(vBsWorld)'));
  if(shader.fragmentShader.includes('vec3 bsRoofLight=')){
   assert.ok(shader.fragmentShader.includes('bsRoofLight=vec3(0.)'));
   assert.ok(shader.fragmentShader.includes('bsTint*bsLevels.x*bsCorridorEave(vBsWorld)*bsTop'));
   assert.ok(shader.fragmentShader.includes('if(bsPolicy==0.)totalEmissiveRadiance=vec3(0.)'));
  }else assert.ok(shader.fragmentShader.includes('if(bsPolicy==0.||bsPolicy==1.)totalEmissiveRadiance=vec3(0.)'));
 }
}
const result={asset:{meshes:manifest.meshes,triangles:manifest.triangles,bytes:manifest.bytes,images:manifest.images,roofFields:fields.size},validator:{errors:validation.issues.numErrors,warnings:validation.issues.numWarnings,messages:validation.issues.messages},presets:PRESETS.map(p=>p.name),geometryUnchanged:true,separateStorage:true,brightnessMultiplierVerified:true,legacyBrightnessMigrationVerified:true,extendedControlsVerified:true,independentRoofEaveColorsVerified:true,numericControlCount:NUMERIC_CONTROLS.length,regionalLightingPolicyVerified:true,corridorEavesOnlyVerified:true,browserGPUVerified:false};
fs.writeFileSync(new URL('verification.json',import.meta.url),JSON.stringify(result,null,2));console.log(JSON.stringify({...result,validator:{errors:validation.issues.numErrors,warnings:validation.issues.numWarnings}},null,2));
