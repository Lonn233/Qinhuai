import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createBuildingLighting} from './lighting.js';
import {PRESETS} from './profiles.mjs';
import validator from '../../tools/asset-deps/node_modules/gltf-validator/index.js';
const root=new URL('../../',import.meta.url),assets=new URL('assets/building-study/pavilion/',root);
const bytes=fs.readFileSync(new URL('pavilion.glb',assets));
const validation=await validator.validateBytes(new Uint8Array(bytes),{maxIssues:30});
assert.equal(validation.issues.numErrors,0,JSON.stringify(validation.issues));
const manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',assets)));
const size=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+size));
assert.equal(doc.nodes.length,9);assert.equal(doc.images.length,5);assert.equal(manifest.triangles,61898);
assert.deepEqual(doc.nodes.map(n=>n.name).sort(),Array.from({length:9},(_,i)=>'FuziTemple087'+i));
assert.deepEqual(manifest.rules.map(r=>r.role).sort(),['roof','templeFacade','templeFacade'].sort());
assert.equal(manifest.fields.FuziTemple0876.eaveSegments,66);
// Compare source geometry/UV/index buffers byte-for-byte; world coordinates retained.
const source=fs.readFileSync(new URL('assets/qinhuai-modern-import/tiles/tile-10.glb',root));
const sourceSize=source.readUInt32LE(12),sourceDoc=JSON.parse(source.subarray(20,20+sourceSize));
function accessorBytes(glb,json,offset,id){const a=json.accessors[id],v=json.bufferViews[a.bufferView];return glb.subarray(offset+(v.byteOffset||0),offset+(v.byteOffset||0)+v.byteLength);}
for(const node of doc.nodes){const original=sourceDoc.nodes.find(n=>n.name===node.name);assert.ok(original);const a=doc.meshes[node.mesh],b=sourceDoc.meshes[original.mesh];assert.equal(a.primitives.length,b.primitives.length);a.primitives.forEach((p,i)=>{for(const key of Object.keys(p.attributes)){assert.deepEqual(accessorBytes(bytes,doc,28+size,p.attributes[key]),accessorBytes(source,sourceDoc,28+sourceSize,b.primitives[i].attributes[key]));}assert.deepEqual(accessorBytes(bytes,doc,28+size,p.indices),accessorBytes(source,sourceDoc,28+sourceSize,b.primitives[i].indices));});}
for(const image of doc.images){const v=doc.bufferViews[image.bufferView],blob=bytes.subarray(28+size+(v.byteOffset||0),28+size+(v.byteOffset||0)+v.byteLength);assert.ok(source.includes(blob),'Original image bytes must be preserved');}
// CPU material binding, not a browser GPU render.
for(const m of doc.materials){const name=m.name;Object.keys(m).forEach(k=>delete m[k]);m.name=name;}
delete doc.images;delete doc.textures;delete doc.samplers;
const j=Buffer.from(JSON.stringify(doc)),n=Math.ceil(j.length/4)*4;
const test=Buffer.alloc(20+n+bytes.length-20-size,0x20);bytes.copy(test,0,0,12);test.writeUInt32LE(test.length,8);test.writeUInt32LE(n,12);test.writeUInt32LE(0x4e4f534a,16);j.copy(test,20);bytes.copy(test,20+n,20+size);
const {scene}=await new GLTFLoader().parseAsync(test.buffer.slice(test.byteOffset,test.byteOffset+test.byteLength),'');
const originals=new Map();scene.traverse(m=>{if(m.isMesh)originals.set(m,m.material);});
const fields=new Map();for(const [name,info] of Object.entries(manifest.fields)){const data=fs.readFileSync(new URL(info.file,assets));assert.equal(data.length,info.size.reduce((a,b)=>a*b,1));fields.set(name,{info,texture:new THREE.Data3DTexture(data,...info.size)});}
const light=createBuildingLighting(scene,manifest,fields,new Map(),{regionalPolicy:false});assert.equal(light.roofCount,1);
for(const preset of PRESETS){light.apply(preset);assert.equal(light.uniforms.levels.value.x,preset.eave*preset.brightness);assert.equal(light.uniforms.roofTint.value.getHexString(),new THREE.Color(preset.roofColor).getHexString());light.apply(preset,false);assert.equal(light.uniforms.levels.value.length(),0);}
const roof=scene.getObjectByName('FuziTemple0876'),shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};
const material=Array.isArray(roof.material)?roof.material[0]:roof.material;material.onBeforeCompile(shader);assert.ok(shader.fragmentShader.includes('float bsRegion(vec3 p){return 2.;}'));
let disposed=0;for(const [mesh,original] of originals){if(mesh.material!==original){for(const m of Array.isArray(mesh.material)?mesh.material:[mesh.material])m.addEventListener('dispose',()=>disposed++);}}light.dispose();assert.equal(disposed,3);for(const [mesh,original] of originals)mesh.material=original;for(const field of fields.values())field.texture.dispose();
const page=fs.readFileSync(new URL('building-light-study.html',root),'utf8');assert.ok(page.includes('value="pavilion"'));assert.match(page,/study\.bundle\.js\?v=[^"\s]+/);
console.log(JSON.stringify({asset:manifest.file,meshes:manifest.meshes,triangles:manifest.triangles,bytes:manifest.bytes,images:manifest.images,validator:validation.issues,sourceGeometryAndTexturesPreserved:true,sixPresets:true,independentColors:true,regionalPolicyDisabled:true,lightToggleAndDisposal:true,browserGPUVerified:false},null,2));
