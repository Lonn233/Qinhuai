import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ImportNightLighting} from '../import-night-lighting.js';
import {PAVILION_STUDY_NODES,TEMPLE_SAVED_LABEL} from '../import-temple-study.js';
import {PRESETS,STORAGE_KEY} from '../game/building-study/profiles.mjs';
const root=new URL('../',import.meta.url);
const layout=JSON.parse(fs.readFileSync(new URL('assets/qinhuai-modern-import/night/layout.json',root),'utf8'));
const bytes=fs.readFileSync(new URL('assets/qinhuai-modern-import/tiles/tile-10.glb',root));
const size=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+size));
// Decode actual source geometry/transforms but omit browser-only image decoding.
for(const m of doc.materials){const name=m.name;Object.keys(m).forEach(k=>delete m[k]);m.name=name;}
delete doc.images;delete doc.textures;delete doc.samplers;
const indices=doc.nodes.map((n,i)=>PAVILION_STUDY_NODES.has(n.name)?i:-1).filter(i=>i>=0);
assert.equal(indices.length,3);doc.scenes=[{nodes:indices}];doc.scene=0;
const j=Buffer.from(JSON.stringify(doc)),n=Math.ceil(j.length/4)*4;
const data=Buffer.alloc(20+n+bytes.length-20-size,0x20);bytes.copy(data,0,0,12);data.writeUInt32LE(data.length,8);data.writeUInt32LE(n,12);data.writeUInt32LE(0x4e4f534a,16);j.copy(data,20);bytes.copy(data,20+n,20+size);
const {scene}=await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),'');scene.updateMatrixWorld(true);
const before=new Map();scene.traverse(m=>{if(m.isMesh)before.set(m,{geometry:m.geometry,matrix:m.matrixWorld.clone(),material:m.material});});
const saved={...PRESETS[0],key:'fixture-user-save',label:TEMPLE_SAVED_LABEL,brightness:1.42,eave:3.16,roof:.095,facade:.18,color:'#f3a029',roofColor:'#bd6c27'};
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem(key){assert.equal(key,STORAGE_KEY);return JSON.stringify({version:1,items:[saved]});}}});
const rig=new ImportNightLighting(new THREE.Scene());rig.layout=layout;
const info=layout.surfaceFields.FuziTemple0876;
const fieldBytes=fs.readFileSync(new URL('assets/qinhuai-modern-import/night/'+info.file,root));assert.equal(fieldBytes.length,info.bytes);assert.ok(info.eaveSegments>0);
const texture=new THREE.Data3DTexture(new Uint8Array(fieldBytes),...info.size);rig.surfaceFields.set('FuziTemple0876',{info,texture});
rig.registerTile(10,scene);assert.equal(rig.pavilionStudies.length,3);assert.equal(rig.templeStudies.length,0);
let roofCount=0;
for(const study of rig.pavilionStudies){
 assert.deepEqual(study.lighting.uniforms.levels.value.toArray(),[saved.eave,saved.roof,saved.facade,saved.window].map(x=>x*saved.brightness));
 assert.ok(study.lighting.uniforms.tint.value.equals(new THREE.Color(saved.color)));assert.ok(study.lighting.uniforms.roofTint.value.equals(new THREE.Color(saved.roofColor)));
 for(const mat of study.lighting.materials){
  const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};mat.onBeforeCompile(shader);
  assert.ok(shader.fragmentShader.includes('float bsRegion(vec3 p){return 2.;}'));
  if(shader.uniforms.bsField){roofCount++;assert.equal(shader.uniforms.bsField.value,texture);assert.deepEqual(shader.uniforms.bsMin.value.toArray(),info.min);}
 }
}
assert.equal(roofCount,1);
assert.ok(!rig.root.getObjectByName('魁星阁·南侧洗檐'));assert.ok(!rig.root.getObjectByName('魁星阁·北侧洗檐'));assert.ok(rig.root.getObjectByName('东岸商铺暖光'));
for(const night of [true,false,true,false]){rig.setEnabled(night);for(const b of rig.bindings)assert.equal(b.mesh.material,night?b.night:b.day);}
saved.roofColor='#923d21';saved.eave=1.7;rig.refreshTempleStudy();for(const study of rig.pavilionStudies){assert.equal(study.lighting.uniforms.levels.value.x,1.7*saved.brightness);assert.ok(study.lighting.uniforms.roofTint.value.equals(new THREE.Color(saved.roofColor)));}
rig.registerTile(10,scene);assert.equal(rig.pavilionStudies.length,3);
delete globalThis.localStorage;rig.refreshTempleStudy();
assert.equal(rig.templeSelection.source,'project');assert.equal(rig.pavilionSelection.source,'default');
for(const study of rig.pavilionStudies){
 assert.deepEqual(study.lighting.uniforms.levels.value.toArray(),[PRESETS[0].eave,PRESETS[0].roof,PRESETS[0].facade,PRESETS[0].window]);
 assert.ok(study.lighting.uniforms.tint.value.equals(new THREE.Color(PRESETS[0].color)),'courtyard recovery must not recolor the pavilion');
}
rig.dispose();for(const [mesh,old] of before){assert.equal(mesh.material,old.material);assert.equal(mesh.geometry,old.geometry);assert.ok(mesh.matrixWorld.equals(old.matrix));}
delete globalThis.localStorage;
console.log(JSON.stringify({pavilionNodes:3,sourceEaveSegments:info.eaveSegments,savedParameterBinding:true,regionalExclusionsDisabled:true,oldWashRemoved:true,dayNightAndDisposeRestore:true,geometryUnchanged:true,browserGPUVerified:false},null,2));
