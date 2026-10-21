import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import validator from './asset-deps/node_modules/gltf-validator/index.js';
import {ImportNightLighting} from '../import-night-lighting.js';
import {PRESETS,STORAGE_KEY} from '../game/building-study/profiles.mjs';
import {resolveTempleStudy,TEMPLE_SAVED_LABEL,PROJECT_TEMPLE_STUDY} from '../import-temple-study.js';
import {REGION_GLSL} from '../game/building-study/regions.mjs';
const root=new URL('../',import.meta.url),assets=new URL('assets/building-study/temple/',root);
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
const day=new Map();scene.updateMatrixWorld(true);scene.traverse(m=>{if(m.isMesh)day.set(m,{material:m.material,geometry:m.geometry,matrix:m.matrixWorld.clone()});});
const custom={...PRESETS[0],label:TEMPLE_SAVED_LABEL,key:'user-saved-test',brightness:1.73,eave:4.12,roof:.075,color:'#d98f22',roofColor:'#c67b35'};
const memory={getItem(key){assert.equal(key,STORAGE_KEY);return JSON.stringify({version:1,items:[custom]});}};
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:memory});
assert.deepEqual(resolveTempleStudy(memory).settings,custom);
assert.equal(resolveTempleStudy(memory).source,'browser');
assert.equal(PROJECT_TEMPLE_STUDY.key,'55229ada-69a0-4c20-b5ac-a511f50ed49a');
assert.equal(PROJECT_TEMPLE_STUDY.color,'#ff957a');
assert.equal(PROJECT_TEMPLE_STUDY.roofColor,'#e09a45');
assert.equal(PROJECT_TEMPLE_STUDY.brightness,2.07);
assert.equal(PROJECT_TEMPLE_STUDY.eave,5);
assert.equal(PROJECT_TEMPLE_STUDY.roof,.42);
assert.equal(resolveTempleStudy(null).saved,true);
assert.equal(resolveTempleStudy(null).source,'project');
assert.deepEqual(resolveTempleStudy(null).settings,PROJECT_TEMPLE_STUDY);
assert.ok(resolveTempleStudy(null).settings.brightness>0);
assert.match(resolveTempleStudy(null).label,/项目备份/);
assert.equal(resolveTempleStudy({getItem(){throw new Error('denied');}}).source,'project');
assert.equal(resolveTempleStudy({getItem(){return '{bad';}}).source,'project');
assert.equal(resolveTempleStudy({getItem(){return JSON.stringify({version:1,items:[{...custom,label:'another'}]});}}).source,'project');
const newer={...custom,key:'newer',roof:.125};
assert.equal(resolveTempleStudy({getItem(){return JSON.stringify({version:1,items:[{...custom,brightness:0}]});}}).settings.brightness,0,'explicit saved blackout is preserved');
for(const storage of [{getItem(){throw new Error('denied');}},{getItem(){return '{bad';}},{getItem(){return JSON.stringify({version:1,items:[{...custom,label:'another'}]});}}]){
 assert.deepEqual(resolveTempleStudy(storage).settings,PROJECT_TEMPLE_STUDY);
 assert.deepEqual(resolveTempleStudy(storage,{useProjectSaved:false}).settings,PRESETS[0],'pavilion default must not change');
}
assert.deepEqual(resolveTempleStudy(memory,{useProjectSaved:false}).settings,custom,'pavilion keeps its existing browser-save priority');
const mutable=resolveTempleStudy(null);mutable.settings.color='#000000';
assert.equal(resolveTempleStudy(null).settings.color,'#ff957a','project snapshot is not mutated by callers');
assert.equal(resolveTempleStudy({getItem(){return JSON.stringify({version:1,items:[custom,newer]});}}).key,'newer');
const rig=new ImportNightLighting(new THREE.Scene());
rig.layout=JSON.parse(fs.readFileSync(new URL('assets/qinhuai-modern-import/night/layout.json',root),'utf8'));
for(const [name,info] of Object.entries(manifest.fields)){
 const city=rig.layout.surfaceFields[name];for(const key of ['min','max','size'])assert.deepEqual(city[key],info[key]);
 rig.surfaceFields.set(name,{info:city,texture:new THREE.Data3DTexture()});
}
for(const name of Object.keys(manifest.masks))rig.masks.set(name,new THREE.Texture());
rig.registerTile(9,scene);rig.registerTile(10,scene);
assert.equal(rig.templePreset,'reference');assert.equal(rig.templeStudies.length,manifest.rules.length);
for(const study of rig.templeStudies){
 assert.deepEqual(study.lighting.uniforms.levels.value.toArray(),[custom.eave,custom.roof,custom.facade,custom.window].map(v=>v*custom.brightness));
 for(const m of study.lighting.materials){const sh={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};m.onBeforeCompile(sh);assert.ok(sh.fragmentShader.includes(REGION_GLSL));}
}
for(const state of [true,false,true,false]){
 rig.setEnabled(state);
 for(const b of rig.bindings)assert.equal(b.mesh.material,state?b.night:b.day);
 for(const [mesh,prior] of day){assert.equal(mesh.geometry,prior.geometry);assert.ok(mesh.matrixWorld.equals(prior.matrix));if(!state)assert.equal(mesh.material,prior.material);}
}
const gate=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial());gate.name='FuziTemple0340';
const a=rig.materialFor(gate.material,{node:gate.name,role:'roof',zone:'temple'});rig.setGatePreset('soft');assert.equal(rig.gatePreset,'soft');assert.equal(rig.templePreset,'reference');
assert.ok(!rig.root.getObjectByName('大成殿·前殿暖光'));assert.ok(!rig.root.getObjectByName('后殿·屋顶层次'));assert.ok(rig.root.getObjectByName('天下文枢·牌匾洗亮'));
const studyCount=rig.templeStudies.length;rig.registerTile(9,scene);assert.equal(rig.templeStudies.length,studyCount);
assert.equal(rig.templeSelection.key,custom.key);
for(const study of rig.templeStudies){assert.ok(study.lighting.uniforms.tint.value.equals(new THREE.Color(custom.color)));assert.ok(study.lighting.uniforms.roofTint.value.equals(new THREE.Color(custom.roofColor)));}
memory.getItem=()=>JSON.stringify({version:1,items:[newer]});rig.refreshTempleStudy();
assert.equal(rig.templeSelection.key,'newer');for(const study of rig.templeStudies)assert.equal(study.lighting.uniforms.levels.value.y,newer.roof*newer.brightness);
memory.getItem=()=>null;rig.refreshTempleStudy();
assert.equal(rig.templeSelection.source,'project');
assert.equal(rig.pavilionSelection.source,'default');
for(const study of rig.templeStudies){
 assert.deepEqual(study.lighting.uniforms.levels.value.toArray(),[PROJECT_TEMPLE_STUDY.eave,PROJECT_TEMPLE_STUDY.roof,PROJECT_TEMPLE_STUDY.facade,PROJECT_TEMPLE_STUDY.window].map(v=>v*PROJECT_TEMPLE_STUDY.brightness));
 assert.ok(study.lighting.uniforms.tint.value.equals(new THREE.Color(PROJECT_TEMPLE_STUDY.color)));
 assert.ok(study.lighting.uniforms.roofTint.value.equals(new THREE.Color(PROJECT_TEMPLE_STUDY.roofColor)));
}
rig.dispose();delete globalThis.localStorage;for(const [mesh,prior] of day)assert.equal(mesh.material,prior.material);
console.log(JSON.stringify({preset:TEMPLE_SAVED_LABEL,savedValuesVerified:true,bindings:studyCount,dayNightRestore:true,geometryUnchanged:true,regionalPolicy:true,gateIndependent:true,duplicateWashRemoved:true,browserGPUVerified:false},null,2));
