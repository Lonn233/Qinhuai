import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import {createBuildingLighting} from './lighting.js';
import {windowMaskReference} from './window-light.mjs';
import {PRESETS} from './profiles.mjs';
function fixture(mode='matou'){
 const root=new THREE.Group(),rules=[],masks=new Map();
 for(const [name,pixel,color,y] of [['upper',144,0xff7a12,2],['lower',220,0xffeedd,0]]){
  const material=new THREE.MeshStandardMaterial({color});material.name=name;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(3,1),material);mesh.name=name;mesh.position.y=y;root.add(mesh);
  rules.push({node:name,material:name,role:'window',bounds:{min:[-1,y-.5,0],max:[1,y+.5,0]}});
  masks.set(name,new THREE.DataTexture(new Uint8Array([0,pixel,pixel,0]),4,1,THREE.RedFormat));
 }
 const lighting=createBuildingLighting(root,{rules},new Map(),masks,{mode,regionalPolicy:false});
 const shaders=root.children.map(mesh=>{const shader={uniforms:{},vertexShader:'#include <project_vertex>',fragmentShader:'#include <emissivemap_fragment>'};mesh.material.onBeforeCompile(shader);return shader;});
 return {root,lighting,shaders};
}
test('different storey masks normalize lit panes without lighting opaque frames',()=>{
 assert.equal(windowMaskReference({data:new Uint8Array([0,144,144,0]),width:4,height:1}),144/255);
 assert.equal(windowMaskReference({data:new Uint8Array([0,220,220,0]),width:4,height:1}),220/255);
 assert.equal(windowMaskReference(null),1);
 assert.equal(windowMaskReference({data:new Uint8Array(4),width:4,height:1}),1);
});
test('legacy shared settings initialize both Matou storeys with independent uniform bindings',()=>{
 const {lighting,shaders}=fixture();lighting.apply(PRESETS[0]);
 for(const key of ['wlState','wlColor','wlBeam','wlAim'])assert.notEqual(shaders[0].uniforms[key],shaders[1].uniforms[key],key);
 for(const key of ['bsLevels','bsWindowTint'])assert.equal(shaders[0].uniforms[key],shaders[1].uniforms[key],key);
 for(const color of ['#284cff','#e8327a','#66bb88']){
  lighting.configureWindows({color,brightness:2.5,directional:true,angle:65,enabled:true});
  for(const shader of shaders){assert.equal(shader.uniforms.wlColor.value.getHexString(),color.slice(1));assert.equal(shader.uniforms.wlState.value.y,2.5);assert.equal(shader.uniforms.wlState.value.z,1);assert.equal(shader.uniforms.wlState.value.w,1);assert.ok(shader.fragmentShader.includes('bsWindowMask/=max(bsWindowMaskMean,.08)'));}
 }
 lighting.configureWindows({enabled:false});for(const shader of shaders)assert.equal(shader.uniforms.wlState.value.x,0);
 lighting.configureWindows({color:null});for(const shader of shaders)assert.equal(shader.uniforms.wlState.value.w,0);
 lighting.dispose();
});
test('each Matou storey uses its own color, gain, toggle and directional parameters',()=>{
 const {lighting,shaders}=fixture();
 lighting.configureWindows({floors:{first:{enabled:true,color:'#ff3210',brightness:3,directional:false,distance:5,sourceDistance:1,angle:80,azimuth:-20,elevation:-10,softness:.2},second:{enabled:false,color:'#1234ff',brightness:.5,directional:true,distance:11,sourceDistance:3,angle:120,azimuth:30,elevation:20,softness:.8}}});
 const [upper,lower]=shaders.map(s=>s.uniforms);
 assert.equal(lower.wlColor.value.getHexString(),'ff3210');assert.equal(upper.wlColor.value.getHexString(),'1234ff');
 assert.deepEqual(lower.wlState.value.toArray(),[1,3,0,1]);assert.deepEqual(upper.wlState.value.toArray(),[0,.5,1,1]);
 assert.deepEqual(lower.wlBeam.value.toArray(),[5,1,80*Math.PI/360,.2]);assert.deepEqual(upper.wlBeam.value.toArray(),[11,3,120*Math.PI/360,.8]);
 assert.deepEqual(lower.wlAim.value.toArray(),[-20*Math.PI/180,-10*Math.PI/180]);assert.deepEqual(upper.wlAim.value.toArray(),[30*Math.PI/180,20*Math.PI/180]);
 lighting.dispose();
});
test('pane normalization gives equal emission for both floors while keeping different masks',()=>{
 const {lighting,shaders}=fixture();
 const levels=shaders.map((s,i)=>(i?220:144)/255/s.uniforms.bsWindowMaskMean.value);
 assert.equal(levels[0],levels[1]);assert.notEqual(shaders[0].uniforms.bsMask.value,shaders[1].uniforms.bsMask.value);
 lighting.dispose();
});
test('other building modes retain their existing textured emission',()=>{
 for(const mode of ['temple','pavilion']){const {lighting,shaders}=fixture(mode);for(const s of shaders){assert.equal(s.uniforms.bsWindowMaskMean,undefined);assert.ok(s.fragmentShader.includes('totalEmissiveRadiance=bsAlbedo*mix(bsWindowTint,wlColor,wlState.w)'));}lighting.dispose();}
});
test('window spill reads live study colors and levels even when base emissive is black',()=>{
 const {root,lighting}=fixture();lighting.apply({...PRESETS[0],window:2,brightness:1.5});
 lighting.configureWindows({floors:{first:{enabled:true,color:'#ff3311',brightness:2},second:{enabled:false,color:'#2255ff'}}});
 const [upper,lower]=root.children.map(mesh=>mesh.material);
 assert.equal(lower.emissive.getHex(),0);assert.equal(lower.userData.windowSource().color.getHexString(),'ff3311');assert.ok(Math.abs(lower.userData.windowSource().energy-1.32)<1e-6);assert.equal(upper.userData.windowSource().energy,0);
 lighting.configureWindows({enabled:true,color:'#88ccff',brightness:1});assert.equal(lower.userData.windowSource().color.getHexString(),'88ccff');
 lighting.dispose();
});
