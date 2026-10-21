import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { repairGateRoof, GATE_ROOF_CORRECTIONS, disposeGateRoofRepair } from '../import-gate-roof-repair.js';
import { ImportNightLighting } from '../import-night-lighting.js';
const root = new URL('../', import.meta.url);
const bytes = fs.readFileSync(new URL('assets/qinhuai-modern-import/tiles/tile-09.glb', root));
const n = bytes.readUInt32LE(12), doc = JSON.parse(bytes.subarray(20, 20+n));
const names = new Set([...Object.keys(GATE_ROOF_CORRECTIONS), 'FuziTemple0336']);
for (const node of doc.nodes) if (!names.has(node.name)) delete node.mesh;
for (const mat of doc.materials) { const name = mat.name; for (const k of Object.keys(mat)) delete mat[k]; mat.name = name; }
delete doc.images; delete doc.textures; delete doc.samplers;
const json = Buffer.from(JSON.stringify(doc)), size = Math.ceil(json.length / 4)*4;
const buffer = Buffer.alloc(20+size+bytes.length-20-n, 0x20);
bytes.copy(buffer,0,0,12);buffer.writeUInt32LE(buffer.length,8);buffer.writeUInt32LE(size,12);buffer.writeUInt32LE(0x4e4f534a,16);json.copy(buffer,20);bytes.copy(buffer,20+size,20+n);
const gltf = await new GLTFLoader().parseAsync(buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength), '');
const model = gltf.scene;model.updateWorldMatrix(true,true);
const hash = array => crypto.createHash('sha256').update(Buffer.from(array.buffer,array.byteOffset,array.byteLength)).digest('hex');
const before = new Map();
model.traverse(mesh => { if (mesh.isMesh) before.set(mesh.name, { matrix:mesh.matrix.clone(), position:hash(mesh.geometry.attributes.position.array), uv:hash(mesh.geometry.attributes.uv.array), material:mesh.material }); });
await assert.rejects(repairGateRoof(model,{loadTexture:async()=>{throw new Error('fixture texture unavailable');}}));
for (const name of names) assert.ok(model.getObjectByName(name).matrix.equals(before.get(name).matrix), 'asset failure is atomic');
const bitmap = new THREE.Texture();
const result = await repairGateRoof(model,{loadTexture:async()=>bitmap});
assert.equal(result.nodes.length,4);
for (const name of names) {
 const mesh=model.getObjectByName(name),initial=before.get(name);
 assert.equal(hash(mesh.geometry.attributes.position.array),initial.position,'source vertex buffer preserved');
 assert.equal(hash(mesh.geometry.attributes.uv.array),initial.uv,'UV binding preserved');
 if (name==='FuziTemple0336') {assert.ok(mesh.matrix.equals(initial.matrix));assert.equal(mesh.material,initial.material);continue;}
 assert.equal(mesh.matrixAutoUpdate,false,'affine correction must never be decomposed to TRS');
 const expected=new THREE.Matrix4().fromArray(GATE_ROOF_CORRECTIONS[name]).multiply(initial.matrix);
 assert.ok(mesh.matrix.elements.every((v,i)=>Math.abs(v-expected.elements[i])<1e-8));
 const vertex=new THREE.Vector3().fromBufferAttribute(mesh.geometry.attributes.position,0);
 const oldPosition=vertex.clone().applyMatrix4(initial.matrix);
 const lookup=vertex.clone().applyMatrix4(mesh.matrixWorld).applyMatrix4(new THREE.Matrix4().fromArray(mesh.userData.gateRoofRepair.worldToSource));
 assert.ok(lookup.distanceTo(oldPosition)<1e-6,'field lookup follows corrected roof without regenerating fields');
}
const backing=model.getObjectByName('FuziTemple0341');
assert.equal(backing.material.map,bitmap);assert.equal(before.get(backing.name).material.map,null);
const bounds={};
for(const name of Object.keys(GATE_ROOF_CORRECTIONS)){
 const mesh=model.getObjectByName(name);const b=new THREE.Box3().setFromObject(mesh,true),c=b.getCenter(new THREE.Vector3());
 bounds[name]={min:b.min.toArray(),max:b.max.toArray()};
 assert.ok(Math.abs(c.x+5.2431355)<.04 && Math.abs(c.z+13.4591407)<.04,'roof centers align with pillar frame');
}
assert.equal(await repairGateRoof(model,{loadTexture:()=>{throw new Error('should be cached');}}),result);
const scene=new THREE.Scene();scene.add(model);const lighting=new ImportNightLighting(scene);
lighting.layout=JSON.parse(fs.readFileSync(new URL('assets/qinhuai-modern-import/night/layout.json',root)));
for(const [name,info] of Object.entries(lighting.layout.surfaceFields))lighting.surfaceFields.set(name,{info,texture:new THREE.Data3DTexture(new Uint8Array([0]),1,1,1)});
lighting.registerTile(9,model);lighting.setEnabled(true);
for(const name of ['FuziTemple0340','FuziTemple0361']){
 const mesh=model.getObjectByName(name),shader={uniforms:{},vertexShader:'#include <project_vertex>',fragmentShader:'#include <emissivemap_fragment>'};
 mesh.material.onBeforeCompile(shader);
 assert.deepEqual(shader.uniforms.qhWrapWorldToSource.value.toArray(),mesh.userData.gateRoofRepair.worldToSource);
 assert.match(shader.fragmentShader,/qhWrapWorldToSource \* vec4\(vQhWashPosition/);
}
for(const preset of ['gold','corners','soft','amber'])assert.equal(lighting.setGatePreset(preset),preset);
lighting.setEnabled(false);assert.equal(backing.material.map,bitmap,'day mode keeps repaired bitmap');
lighting.dispose();disposeGateRoofRepair();bitmap.dispose();
console.log(JSON.stringify({passed:true,correctedNodes:result.nodes,bounds,geometryAndUVBuffersPreserved:true,nightFieldRegistration:true,textureFailureAtomic:true,browserGPUChecked:false},null,2));
