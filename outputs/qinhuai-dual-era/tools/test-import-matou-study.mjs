import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ImportNightLighting} from '../import-night-lighting.js';
import {MATOU_GROUPS,MATOU_STUDY_NODES,PROJECT_MATOU_STUDY,resolveMatouStudy,retainedMatouFixtureSegments} from '../import-matou-study.js';
import {STORAGE_KEY} from '../game/building-study/profiles.mjs';
const root=new URL('../',import.meta.url),base=new URL('assets/qinhuai-modern-import/night/matou-ma61/',root);
const manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',base)));
const layout=JSON.parse(fs.readFileSync(new URL('assets/qinhuai-modern-import/night/layout.json',root)));
const saved=JSON.parse(fs.readFileSync(new URL('assets/building-study/matou/ma61-lighting.json',root))).items[0];
assert.equal(saved.label,'马61');assert.equal(saved.key,'af0d683e-8b31-4105-a464-658556871d6a');
assert.deepEqual(PROJECT_MATOU_STUDY,saved);assert.deepEqual(resolveMatouStudy(null).settings,saved);
assert.equal(saved.trimColor,'#ffffff');assert.equal(saved.windowColor,'#ffa200');assert.equal(saved.softSpill.settings.intensity,1.14);
assert.equal(MATOU_GROUPS.length,9);assert.equal(MATOU_STUDY_NODES.size,69);
for(const name of ['FuziTemple0870','FuziTemple0874','FuziTemple0876','FuziTemple0923','FuziTemple0932','FuziTemple0887','FuziTemple0891','FuziTemple0718','FuziTemple0768','FuziTemple0997','FuziTemple1032','FuziTemple1081','FuziTemple1138'])assert.ok(!MATOU_STUDY_NODES.has(name),name+' must not change');
let library=JSON.stringify({version:1,items:[{...saved,key:'wrong-building',building:'pavilion'}]});
const storage={getItem(key){assert.equal(key,STORAGE_KEY);return library;},setItem(){assert.fail('Never rewrite user library');}};
assert.equal(resolveMatouStudy(storage).source,'project');
library=JSON.stringify({version:1,items:[{...saved,key:'live',brightness:1.87}]});
assert.equal(resolveMatouStudy(storage).settings.brightness,1.87);
assert.equal(resolveMatouStudy({getItem(){throw Error('blocked storage');}}).source,'project');
const scene=new THREE.Scene(),rig=new ImportNightLighting(scene);rig.layout=layout;
let releases=0;
for(const group of MATOU_GROUPS){
 const info=JSON.parse(fs.readFileSync(new URL(group.softSpill,base)));
 const data=fs.readFileSync(new URL(`${group.id}/${info.file}`,base));
 assert.equal(data.length,info.bytes);assert.equal(data.length,info.size.reduce((a,b)=>a*b,8));
 const audit=JSON.parse(fs.readFileSync(new URL(`${group.id}/eave-path-audit.json`,base)));
 assert.equal(audit.accepted.length,info.eaveSegments);
 if(group.minX!==null)assert.ok(audit.accepted.flat().every(p=>p[0]>=group.minX-1e-6));
 const texture=new THREE.Data3DTexture(new Uint16Array(4),1,1,1);texture.addEventListener('dispose',()=>releases++);
 rig.matouFields.set(group.id,{info,texture});
}
for(const name of Object.keys(layout.windowMasks))rig.masks.set(name,new THREE.Texture());
const original=new Map();
for(const tile of [5,6,9,10]){
 const bytes=fs.readFileSync(new URL(`assets/qinhuai-modern-import/tiles/tile-${String(tile).padStart(2,'0')}.glb`,root));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),manifest.sourceHashes[`tile-${String(tile).padStart(2,'0')}`]);
 // Decode original geometry in Node; only texture decoding is substituted.
 const length=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+length));
 for(const material of doc.materials){const name=material.name;Object.keys(material).forEach(k=>delete material[k]);material.name=name;}
 delete doc.images;delete doc.textures;delete doc.samplers;
 const j=Buffer.from(JSON.stringify(doc)),padded=Math.ceil(j.length/4)*4;
 const test=Buffer.alloc(20+padded+bytes.length-20-length,0x20);bytes.copy(test,0,0,12);test.writeUInt32LE(test.length,8);test.writeUInt32LE(padded,12);test.writeUInt32LE(0x4e4f534a,16);j.copy(test,20);bytes.copy(test,20+padded,20+length);
 const gltf=await new GLTFLoader().parseAsync(test.buffer.slice(test.byteOffset,test.byteOffset+test.byteLength),'');
 scene.add(gltf.scene);gltf.scene.updateMatrixWorld(true);
 gltf.scene.traverse(mesh=>{if(mesh.isMesh)original.set(mesh,{material:mesh.material,geometry:mesh.geometry,matrix:mesh.matrixWorld.clone()});});
 rig.registerTile(tile,gltf.scene);
}
assert.equal(rig.matouStudies.length,69);
assert.deepEqual(new Set(rig.matouStudies.map(s=>s.group)),new Set(MATOU_GROUPS.map(g=>g.id)));
assert.equal(rig.matouSelection.source,'project');
let mixed=0,preservedTriangles=0;
for(const study of rig.matouStudies){
 assert.equal(study.lighting.uniforms.trimTint.value.getHexString(),'ffffff');
 assert.equal(study.lighting.uniforms.windowTint.value.getHexString(),'ffa200');
 assert.equal(study.lighting.uniforms.levels.value.w,5);
 assert.equal(study.spill.active.value,1.14);
 assert.deepEqual(study.spill.settings,saved.softSpill.settings);
 for(const mat of study.spill.materials){
  const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};mat.onBeforeCompile(shader);
  assert.equal(shader.uniforms.bsTrimTint,study.lighting.uniforms.trimTint);assert.equal(shader.uniforms.ssActive,study.spill.active);
  assert.equal(shader.uniforms.ssField.value,rig.matouFields.get(study.group).texture);
  assert.ok(!shader.fragmentShader.includes('bsLocalBounce'));
 }
 if(study.nightGeometry!==study.dayGeometry){
  mixed++;preservedTriangles+=study.nightGeometry.userData.matouPartition.preservedTriangles;
  assert.deepEqual(study.nightGeometry.attributes.position.array,study.dayGeometry.attributes.position.array);
  assert.equal(study.nightGeometry.index.count,study.dayGeometry.index.count);
  // The same exact triangles occur once: reordering is solely for material groups.
  const triangles=g=>{const a=g.index.array,out=[];for(let i=0;i<a.length;i+=3)out.push(`${a[i]},${a[i+1]},${a[i+2]}`);return out.sort();};
  assert.deepEqual(triangles(study.nightGeometry),triangles(study.dayGeometry));
 }
}
assert.ok(mixed>0);assert.ok(preservedTriangles>0);
const untouched={node:'FuziTemple0932',segments:[1,2,3,4,5,6]};assert.equal(retainedMatouFixtureSegments(untouched),untouched.segments);
assert.deepEqual(retainedMatouFixtureSegments({node:'FuziTemple0700',segments:[1,2,3,4,5,6]}),[]);
assert.deepEqual(retainedMatouFixtureSegments({node:'FuziTemple0847',segments:[10,14,-5,20,14,-5]}),[10,14,-5,13,14,-5]);
for(let i=0;i<5;i++){
 rig.setEnabled(true);for(const b of rig.bindings){assert.equal(b.mesh.material,b.night);if(b.nightGeometry)assert.equal(b.mesh.geometry,b.nightGeometry);}
 rig.setEnabled(false);for(const [mesh,prior] of original){assert.equal(mesh.material,prior.material);assert.equal(mesh.geometry,prior.geometry);assert.ok(mesh.matrixWorld.equals(prior.matrix));}
}
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:storage});
library=JSON.stringify({version:1,items:[{...saved,lightEnabled:false,softSpill:{...saved.softSpill,enabled:true}}]});rig.refreshTempleStudy();
assert.equal(rig.matouSelection.source,'browser');assert.ok(rig.matouStudies.every(s=>s.spill.active.value===0&&s.lighting.uniforms.levels.value.length()===0));
library=JSON.stringify({version:1,items:[{...saved,softSpill:{enabled:false,settings:{...saved.softSpill.settings,intensity:0}}}]});rig.refreshTempleStudy();
assert.ok(rig.matouStudies.every(s=>s.spill.active.value===0&&s.spill.settings.intensity===0&&s.lighting.uniforms.levels.value.w===5));
delete globalThis.localStorage;rig.refreshTempleStudy();assert.ok(rig.matouStudies.every(s=>s.spill.active.value===1.14));
rig.dispose();rig.dispose();assert.equal(releases,9,'shared local fields released once, not once per material');
for(const [mesh,prior] of original){assert.equal(mesh.material,prior.material);assert.equal(mesh.geometry,prior.geometry);}
console.log(JSON.stringify({passed:true,scheme:'马61',groups:9,nodes:69,bothBanks:true,exactSavedColorsAndSpill:true,mixedMeshes: mixed,preservedNonMatouTriangles:preservedTriangles,sourceGeometryUnchanged:true,dayNightAndStorageRefresh:true,fieldDisposals:releases},null,2));
