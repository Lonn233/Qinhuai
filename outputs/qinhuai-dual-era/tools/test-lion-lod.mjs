import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as THREE from 'three';
import {ImportFestivalLanterns} from '../import-festival-lanterns.js';
import {LION_LOD_SPEC as spec,selectLionLod,decodeLionLodData} from '../import-lion-lod.mjs';
import {meshLanternEmitters,LanternLighting} from '../import-lantern-lighting.js';
import {normalizeLantern} from '../import-lantern-settings.mjs';
const source=fs.readFileSync(new URL('../game/assets/lion.glb',import.meta.url));
const len=source.readUInt32LE(12),doc=JSON.parse(source.subarray(20,20+len)),bin=source.subarray(28+len);
function read(id){const a=doc.accessors[id],v=doc.bufferViews[a.bufferView],Type={5126:Float32Array,5123:Uint16Array,5125:Uint32Array}[a.componentType],width={SCALAR:1,VEC2:2,VEC3:3}[a.type],out=new Type(a.count*width),b=Type.BYTES_PER_ELEMENT;for(let i=0;i<a.count;i++){const start=(v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||width*b);new Uint8Array(out.buffer,i*width*b,width*b).set(bin.subarray(start,start+width*b));}return new THREE.BufferAttribute(out,width);}
function load(){const scene=new THREE.Group(),p=doc.meshes[0].primitives[0],g=new THREE.BufferGeometry();for(const [name,key] of [['position','POSITION'],['normal','NORMAL'],['uv','TEXCOORD_0']])g.setAttribute(name,read(p.attributes[key]));g.setIndex(read(p.indices));scene.add(new THREE.Mesh(g,new THREE.MeshStandardMaterial()));return Promise.resolve({scene});}
function indices(){const b=fs.readFileSync(new URL('../assets/qinhuai-modern-import/festival/lion-lods.bin',import.meta.url));return decodeLionLodData(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));}
async function setup(extra={}){const layer=new ImportFestivalLanterns(new THREE.Group(),{load,loadLionLods:async()=>indices(),...extra});await layer.registerTile(9);return layer;}
test('lion assets match high-detail near model and audited budgets',()=>{assert.equal(crypto.createHash('sha256').update(source).digest('hex'),spec.sourceSha256);assert.deepEqual(spec.levels.map(l=>l.triangles),[89996,8999,1500]);for(const part of indices())assert.ok(part.index.every(i=>i<part.position.length/3));});
test('LOD hysteresis prevents threshold oscillation and handles teleport',()=>{assert.equal(selectLionLod(.1),0);assert.equal(selectLionLod(.09,0),0);assert.equal(selectLionLod(.087,0),1);assert.equal(selectLionLod(.11,1),1);assert.equal(selectLionLod(.113,1),0);assert.equal(selectLionLod(.001,0),2);assert.equal(selectLionLod(.5,2),0);assert.equal(selectLionLod(.034,1),1);assert.equal(selectLionLod(.030,1),2);});
test('per-lion packing shares textures/materials, keeps six stable spill sources and saved colors',async()=>{
 const layer=await setup(),entry=layer.entries.get('lion'),camera=new THREE.PerspectiveCamera(60,1,.01,1000),before=meshLanternEmitters([entry.batches[0].mesh]);
 layer.lightControls={lion:normalizeLantern({brightness:1.3,inheritColor:false,color:'#efae77',spill:{enabled:true,color:'#123456'}})};layer.setState({night:true});
 const control=JSON.stringify(layer.lightControls);assert.equal(before.length,6);
 for(const {mesh} of entry.lod.batches){assert.equal(mesh.material,entry.parts[0].material);assert.ok(mesh.geometry.attributes.uv);assert.equal(mesh.material.map,entry.parts[0].material.map);}
 for(const [z,expected] of [[-19,null],[-8,1],[100,2],[-19,null]]){
  camera.position.set(-8.7,12.1,z);entry.lod.nextUpdate=-Infinity;layer.update(1,camera);
  assert.equal(entry.lod.stats.counts.reduce((a,b)=>a+b,0),6);
  if(expected!==null)assert.equal(entry.lod.stats.counts[expected],6);
  assert.deepEqual(LanternLighting.prototype.sources.call({festival:layer},'lion'),before);
  for(const {mesh} of entry.lod.batches)assert.equal(mesh.visible,mesh.count>0);
 }
 layer.lightControls.lion.modelVisible=false;layer.setState();
 for(const z of [100,-19]){camera.position.set(-8.7,12.1,z);entry.lod.nextUpdate=-Infinity;layer.update(2,camera);assert.ok(entry.batches.every(b=>!b.mesh.visible),'hidden lions stay hidden through LOD changes');}
 assert.equal(entry.uniforms.uClothPower.value,0);layer.lightControls.lion.modelVisible=true;layer.setState();
 assert.ok(entry.lod.batches.some(b=>b.mesh.visible),'show restores active LOD without camera movement');
 const changes=entry.lod.changes;layer.update(1.01,camera);assert.equal(entry.lod.changes,changes);
 assert.equal(JSON.stringify(layer.lightControls),control);assert.equal(entry.uniforms.uClothTint.value.getHexString(),'efae77');assert.equal(entry.uniforms.uClothPower.value,entry.tuning.power*1.3);
 layer.setState({wireframe:true});assert.equal(entry.uniforms.uClothPower.value,0);assert.ok(entry.lod.batches.every(b=>b.mesh.material.wireframe));layer.setState({wireframe:false,night:false});assert.equal(entry.uniforms.uClothPower.value,0);
 let disposed=0;for(const {mesh} of entry.lod.batches)mesh.addEventListener('dispose',()=>disposed++);layer.dispose();assert.equal(disposed,3);assert.equal(layer.root.parent,null);
});
test('unavailable extra indices retain original lions and disposal during loading is safe',async()=>{
 const layer=await setup({loadLionLods:async()=>{throw Error('offline');}});assert.equal(layer.stats.lamps,7);assert.match(layer.stats.lionLodError,/offline/);assert.equal(layer.stats.lionLod,null);layer.dispose();
 let release;const late=new ImportFestivalLanterns(new THREE.Group(),{load,loadLionLods:()=>new Promise(r=>release=r)}),pending=late.registerTile(9);
 while(!release)await new Promise(r=>setImmediate(r));late.dispose();release(indices());await pending;assert.equal(late.entries.size,0);assert.equal(late.root.children.length,0);
});

