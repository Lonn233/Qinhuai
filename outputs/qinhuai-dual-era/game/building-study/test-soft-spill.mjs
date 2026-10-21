import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {createSoftSpill} from './soft-spill.js';
import {SPILL_PRESETS,SPILL_CONTROLS,SPILL_REGION_CONTROLS,normalizeSpill,spillPreset,SPILL_STORAGE} from './spill-profiles.mjs';
const root=new THREE.Group(),geometry=new THREE.BoxGeometry(),map=new THREE.Texture();
const original=new THREE.MeshStandardMaterial({map,color:'#456789',roughness:.76,metalness:.08});
let hookCalls=0;original.onBeforeCompile=shader=>{hookCalls++;shader.uniforms.originalLight={value:1.25};};
original.customProgramCacheKey=()=> 'existing-light-v1';
const mesh=new THREE.Mesh(geometry,original);mesh.name='test-eave';root.add(mesh);
const texture=new THREE.Data3DTexture(new Uint8Array(8),2,2,2);
const layer=createSoftSpill(root,{rules:[{node:mesh.name,role:'roof'}]},{texture,info:{size:[2,2,2],min:[0,0,0],max:[1,1,1]}});
const wrapped=mesh.material;
assert.notEqual(wrapped,original);assert.equal(wrapped.map,map);assert.equal(wrapped.roughness,original.roughness);assert.equal(wrapped.metalness,original.metalness);assert.equal(wrapped.color.getHex(),original.color.getHex());assert.equal(mesh.geometry,geometry);assert.equal(root.children.length,1);
const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};wrapped.onBeforeCompile(shader);assert.equal(hookCalls,1);assert.equal(shader.uniforms.originalLight.value,1.25);assert.equal(shader.uniforms.ssActive,layer.active);assert.ok(wrapped.customProgramCacheKey().startsWith('existing-light-v1'));assert.ok(shader.fragmentShader.includes('ssFacing'));assert.ok(shader.fragmentShader.includes('#include <opaque_fragment>'));
assert.equal(layer.active.value,0);layer.apply(true);assert.equal(layer.active.value,.42);layer.apply(true,false);assert.equal(layer.active.value,0);layer.apply(true,true);assert.equal(layer.active.value,.42);layer.apply(false);assert.equal(layer.active.value,0);
let layerDisposals=0,fieldDisposals=0,originalDisposals=0,mapDisposals=0;wrapped.addEventListener('dispose',()=>layerDisposals++);texture.addEventListener('dispose',()=>fieldDisposals++);original.addEventListener('dispose',()=>originalDisposals++);map.addEventListener('dispose',()=>mapDisposals++);layer.dispose();assert.equal(mesh.material,original);assert.equal(layerDisposals,1);assert.equal(fieldDisposals,1);assert.equal(originalDisposals,0);assert.equal(mapDisposals,0);
const assets=new URL('../../assets/building-study/',import.meta.url);
for(const building of ['temple','pavilion','matou']){const manifest=JSON.parse(fs.readFileSync(new URL(building+'/soft-spill.json',assets)));const bytes=fs.readFileSync(new URL(building+'/'+manifest.file,assets));assert.equal(bytes.length,manifest.size.reduce((a,b)=>a*b,1));}
assert.equal(SPILL_PRESETS.length,6);assert.equal(SPILL_CONTROLS.length,6);assert.equal(SPILL_REGION_CONTROLS.length,6);assert.ok(SPILL_STORAGE.includes('soft-spill'));
assert.equal(normalizeSpill({horizontal:99,intensity:-3,color:'bad',surface:'bad'}).horizontal,1.5);assert.equal(normalizeSpill({intensity:-3}).intensity,0);assert.equal(normalizeSpill({minHeight:90,maxHeight:10}).minHeight,10);
const volume=new THREE.Data3DTexture(new Uint16Array(32),2,2,2);const layer2=createSoftSpill(root,{rules:[]},{texture:volume,info:{encoding:'offset-rgba16f',min:[-2,0,-2],max:[2,4,2],modelMin:[-2,0,-2],modelMax:[2,4,2]}});
for(const preset of SPILL_PRESETS){const config=spillPreset(preset.id);layer2.configure(config);layer2.apply(true);assert.equal(layer2.active.value,config.intensity);assert.equal(layer2.parameters.spread.value.x,config.horizontal);}
layer2.configure({region:'custom',centerX:25,centerZ:50,width:50,depth:100,minHeight:25,maxHeight:75});assert.deepEqual(layer2.parameters.regionMin.value.toArray(),[-2,1,-2]);assert.deepEqual(layer2.parameters.regionMax.value.toArray(),[0,3,2]);assert.equal(layer2.parameters.regionOn.value,1);
layer2.configure({region:'all',minHeight:0,maxHeight:100});assert.equal(layer2.parameters.regionOn.value,0);const shader2={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};mesh.material.onBeforeCompile(shader2);assert.ok(shader2.fragmentShader.includes('ssVertical'));assert.equal(shader2.uniforms.ssSpread,layer2.parameters.spread);layer2.dispose();assert.equal(mesh.material,original);
for(const building of ['temple','pavilion','matou']){const manifest=JSON.parse(fs.readFileSync(new URL(building+'/soft-spill-v2.json',assets)));const bytes=fs.readFileSync(new URL(building+'/'+manifest.file,assets));assert.equal(manifest.encoding,'offset-rgba16f');assert.equal(bytes.length,manifest.size.reduce((a,b)=>a*b,8));assert.equal(bytes.length,manifest.bytes);}
console.log(JSON.stringify({liveSpread:true,customRegion:true,sixSpillPresets:true,separateStorage:true,halfFloatAssetsValid:true,defaultOff:true,independentUniform:true,originalShaderChained:true,geometryAndMapsPreserved:true,masterSwitchRespected:true,disposalRestoresOriginal:true,fieldAssetsValid:true,browserGPUVerified:false},null,2));
geometry.dispose();original.dispose();map.dispose();
