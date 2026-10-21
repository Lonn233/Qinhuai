import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {BRIDGE_BUILDING,BRIDGE_PARTS,BRIDGE_NODES,BRIDGE_ID} from '../import-bridge-config.mjs';
import {collectEnvironmentBuildings} from '../import-environment-sources.mjs';
import {environmentFocusBounds} from '../import-environment-focus.mjs';
import {BuildingLightAdjustments} from '../import-building-lighting.js';
import {bridgeNightMaterial} from '../import-bridge-lighting.js';
import {environmentSourceLight} from '../import-environment-spill.js';
test('bridge catalog has a stable unique identity and frames the submerged piers',()=>{
 const layout={tiles:{'tile-09':{materials:[],bounds:{}}}},buildings=collectEnvironmentBuildings(layout);
 assert.equal(buildings.filter(b=>b.id===BRIDGE_ID).length,1);assert.equal(Object.keys(BRIDGE_NODES).length,9);
 const bounds=environmentFocusBounds(BRIDGE_BUILDING,layout);assert.equal(bounds.min[1],10.82);assert.equal(bounds.max[1],12.28);
 const rig=new BuildingLightAdjustments({buildings,layout});assert.deepEqual(rig.getParts(BRIDGE_ID),BRIDGE_PARTS.map(p=>p[0]));
});
test('bridge wash composes with per-part controls and preserves original textures and daytime material',()=>{
 const original=new THREE.MeshStandardMaterial({color:'#998877',map:new THREE.Texture()});
 const night=bridgeNightMaterial(original,'bridgeRail'),rig=new BuildingLightAdjustments({buildings:[BRIDGE_BUILDING]});
 rig.patch(night,[BRIDGE_BUILDING],'bridgeRail');rig.setSettings(BRIDGE_ID,{parts:{bridgeRail:{enabled:false}}});
 assert.strictEqual(night.map,original.map);assert.equal(original.emissive.getHex(),0);assert.equal(original.userData.bridgePhotoPreset,undefined);
 const shader={uniforms:{},vertexShader:THREE.ShaderLib.standard.vertexShader,fragmentShader:THREE.ShaderLib.standard.fragmentShader};night.onBeforeCompile(shader);
 assert.match(shader.fragmentShader,/bridgeStone/);assert.match(shader.fragmentShader,/qhBuildingAdjust/);assert.equal(shader.uniforms.qhBuilding0.value.x,0);assert.equal(rig.getUniform(BRIDGE_ID,'bridgeBody').value.x,1);
 rig.dispose();night.dispose();original.map.dispose();original.dispose();
});
test('bridge environment spill follows active part colors and the building master switch',()=>{
 const off=Object.fromEntries(BRIDGE_PARTS.map(([id])=>[id,{enabled:false}]));
 const light=environmentSourceLight(BRIDGE_BUILDING,{}, {parts:{...off,bridgeArch:{enabled:true,inheritColor:false,color:'#0000ff'}}});
 assert.equal(light.color.r,0);assert.equal(light.color.b,1);assert.ok(light.energy>0);assert.equal(environmentSourceLight(BRIDGE_BUILDING,{}, {enabled:false}).energy,0);
});
