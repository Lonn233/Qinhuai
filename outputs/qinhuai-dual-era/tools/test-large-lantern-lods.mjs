import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as THREE from 'three';
import {LARGE_LANTERN_LODS as specs,decodeLargeLanternLods,selectLargeLanternLod,SingleLanternLod} from '../import-large-lantern-lod.mjs';
import {ImportFestivalLanterns} from '../import-festival-lanterns.js';
import {meshLanternEmitters} from '../import-lantern-lighting.js';
import {ImportRenderVisibility} from '../import-render-visibility.js';
function data(kind){const b=fs.readFileSync(new URL('../assets/large-lantern-lods/'+specs[kind].geometryFile,import.meta.url));return decodeLargeLanternLods(kind,b.buffer.slice(b.byteOffset,b.byteOffset+b.length));}
function source(kind){
 const b=fs.readFileSync(new URL('../'+specs[kind].source,import.meta.url));assert.equal(crypto.createHash('sha256').update(b).digest('hex'),specs[kind].sourceSha256);
 const len=b.readUInt32LE(12),j=JSON.parse(b.subarray(20,20+len)),bin=b.subarray(28+len),p=j.meshes[0].primitives[0],g=new THREE.BufferGeometry();
 const read=id=>{const a=j.accessors[id],v=j.bufferViews[a.bufferView],T={5126:Float32Array,5125:Uint32Array,5123:Uint16Array}[a.componentType],w={SCALAR:1,VEC2:2,VEC3:3}[a.type],out=new T(a.count*w);new Uint8Array(out.buffer).set(bin.subarray((v.byteOffset||0)+(a.byteOffset||0),(v.byteOffset||0)+(a.byteOffset||0)+out.byteLength));return new THREE.BufferAttribute(out,w);};
 for(const [name,key] of [['position','POSITION'],['normal','NORMAL'],['uv','TEXCOORD_0']])g.setAttribute(name,read(p.attributes[key]));g.setIndex(read(p.indices));return g;
}
for(const kind of Object.keys(specs))test(kind+': real assets, three tiers, stable spill/material/transform/culling',()=>{
 const g=source(kind);g.computeBoundingBox();const size=g.boundingBox.getSize(new THREE.Vector3()),center=g.boundingBox.getCenter(new THREE.Vector3()),scale=1/(kind==='gongming'?size.x:Math.max(size.x,size.z));
 g.applyMatrix4(new THREE.Matrix4().makeScale(scale,scale,scale).multiply(new THREE.Matrix4().makeTranslation(-center.x,-g.boundingBox.min.y,-center.z)));
 const parent=new THREE.Group(),mat=new THREE.MeshStandardMaterial({map:new THREE.Texture()}),mesh=new THREE.InstancedMesh(g,mat,1);mesh.setMatrixAt(0,new THREE.Matrix4().makeScale(3,3,3));parent.add(mesh);
 const resources=new Set([g]),lod=new SingleLanternLod(kind,mesh,data(kind),resources),before=meshLanternEmitters([mesh]),camera=new THREE.PerspectiveCamera(60,1,.01,1000),visibility=new ImportRenderVisibility();assert.equal(visibility.register(parent),1);
 const snapshot=Array.from(mesh.instanceMatrix.array);for(const [z,expected] of [[3,0],[40,1],[200,2],[3,0]]){camera.position.set(0,1,z);lod.nextUpdate=-Infinity;lod.update(camera,1);assert.equal(lod.level,expected);assert.equal(mesh.geometry.index.count/3,specs[kind].levels[expected].triangles);assert.equal(mesh.material,mat);assert.deepEqual(Array.from(mesh.instanceMatrix.array),snapshot);assert.deepEqual(meshLanternEmitters([mesh]),before);}
 assert.equal(selectLargeLanternLod(.09,0,specs[kind]),0);assert.equal(selectLargeLanternLod(.11,1,specs[kind]),1);
 // Wrapper visibility is never overwritten by a LOD change.
 visibility.update(new THREE.Vector3(100,0,100),1);assert.equal(mesh.parent.visible,false);lod.update(camera,2);assert.equal(mesh.parent.visible,false);
 assert.throws(()=>decodeLargeLanternLods(kind,new ArrayBuffer(4)));visibility.dispose();for(const r of resources)r.dispose();mesh.dispose();mat.map.dispose();mat.dispose();
});
test('mountain layer keeps editable size/rotation, colors and failed-load fallback',async()=>{
 const load=async kind=>({scene:new THREE.Group().add(new THREE.Mesh(kind==='mountain'?source(kind):new THREE.BoxGeometry(),new THREE.MeshStandardMaterial()))});
 const layer=new ImportFestivalLanterns(new THREE.Group(),{load,loadLargeLods:async()=>data('mountain')});await layer.registerTile(9);const e=layer.entries.get('mountain');assert.ok(e.largeLod);layer.setState({night:true});const power=e.uniforms.uClothPower.value,camera=new THREE.PerspectiveCamera(60,1,.01,10000);
 for(const z of [0,1000,0]){camera.position.set(0,12,z);e.largeLod.nextUpdate=-Infinity;layer.update(1,camera);}layer.setMountain({sizeMeters:14,rotation:45});e.largeLod.nextUpdate=-Infinity;layer.update(2,camera);assert.deepEqual(layer.mountain,{sizeMeters:14,rotation:45});assert.equal(e.uniforms.uClothPower.value,power);assert.equal(meshLanternEmitters([e.batches[0].mesh]).length,1);layer.setState({wireframe:true});assert.ok(e.largeLod.geometries.every(g=>g===e.batches[0].mesh.geometry||e.resources.has(g)));assert.equal(e.batches[0].mesh.material.wireframe,true);
 let disposed=0;e.largeLod.geometries.forEach(g=>g.addEventListener('dispose',()=>disposed++));layer.dispose();assert.equal(disposed,3);
 const fallback=new ImportFestivalLanterns(new THREE.Group(),{load,loadLargeLods:async()=>{throw Error('offline');}});await fallback.registerTile(9);assert.equal(fallback.stats.mountainLod,null);assert.match(fallback.stats.mountainLodError,/offline/);assert.equal(fallback.entries.get('mountain').batches[0].mesh.geometry.index.count/3,110000);fallback.dispose();
});
