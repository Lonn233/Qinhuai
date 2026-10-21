import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {BUILDING_LIGHT_KEY,normalizeBuilding,readBuildingLights,writeBuildingLight} from '../import-building-controls.mjs';
import {BuildingLightAdjustments} from '../import-building-lighting.js';
test('additive per-building settings preserve other buildings, unknown data and named presets',()=>{
 const original={version:1,future:17,buildings:{a:{future:'keep',brightness:0,parts:{window:{future:42,brightness:0}}},b:{brightness:2}},presets:[{id:'legacy',name:'旧收藏'}]};
 const data=new Map([[BUILDING_LIGHT_KEY,JSON.stringify(original)],['qinhuai.building-light-studies.v1','original-study']]);const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 const a=normalizeBuilding(original.buildings.a);assert.equal(a.brightness,0);assert.equal(a.parts.window.brightness,0);assert.equal(a.parts.window.future,42);
 assert.equal(writeBuildingLight(storage,'a',a,{id:'new',name:'另存'}),true);const saved=readBuildingLights(storage);assert.equal(saved.future,17);assert.equal(saved.buildings.a.future,'keep');assert.deepEqual(saved.buildings.b,original.buildings.b);assert.equal(saved.presets.length,2);assert.equal(data.get('qinhuai.building-light-studies.v1'),'original-study');
});
test('shared temple geometry has separate region uniforms, identity defaults, zero switches and composed shaders',()=>{
 const buildings=[{id:'front',rect:[0,0,5,5],nodes:['shared'],tiles:[9]},{id:'rear',rect:[0,6,5,10],nodes:['shared'],tiles:[9]}];
 const env={buildings},rig=new BuildingLightAdjustments(env),material=new THREE.MeshStandardMaterial();let originalCalled=false;
 material.onBeforeCompile=s=>{originalCalled=true;s.fragmentShader=s.fragmentShader.replace('#include <emissivemap_fragment>','vec3 bsRoofLight=vec3(1.); vec3 bsEaveLight=vec3(1.); totalEmissiveRadiance=(bsRoofLight+bsEaveLight);');};
 rig.patch(material,buildings,'roof');rig.apply();assert.deepEqual(rig.getUniform('front','roof').value.toArray(),[1,1,1,0]);
 rig.setSettings('front',{parts:{roof:{enabled:false},eave:{inheritColor:false,color:'#ff0000',brightness:2}}});assert.equal(rig.getUniform('front','roof').value.x,0);assert.deepEqual(rig.getUniform('front','eave').value.toArray(),[2,0,0,1]);assert.equal(rig.getUniform('rear','roof').value.x,1);
 const shader={uniforms:{},vertexShader:'#include <project_vertex>',fragmentShader:'#include <emissivemap_fragment>\n#include <lights_fragment_begin>'};material.onBeforeCompile(shader);assert.ok(originalCalled);assert.match(shader.fragmentShader,/qhBuildingAdjust\(bsRoofLight,false\)/);assert.match(shader.fragmentShader,/vQhBuildingWorld.z>=6.00000/);assert.strictEqual(shader.uniforms.qhBuilding0,rig.getUniform('front','roof'));
 rig.dispose();material.dispose();
});

test('inherited spill follows adjusted source components while the original source stays intact',async()=>{
 const {environmentSourceLight}=await import('../import-environment-spill.js');const source={style:'matou'},state={matou:{brightness:1,window:1,eave:0,trimColor:'#ff0000',windowColor:'#ff0000'}};
 const before=JSON.stringify(state),light=environmentSourceLight(source,state,{parts:{trim:{enabled:false},window:{inheritColor:false,color:'#0000ff',brightness:2}}});assert.equal(light.color.r,0);assert.equal(light.color.b,1);assert.equal(light.energy,.44);assert.equal(JSON.stringify(state),before);assert.equal(environmentSourceLight(source,state,{enabled:false}).energy,0);
});
