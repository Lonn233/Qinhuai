import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeGateGround,gateGroundWeight,GATE_GROUND_PRESET} from '../import-gate-ground.mjs';
import {normalizeBuilding,writeBuildingLight,readBuildingLights,BUILDING_LIGHT_KEY} from '../import-building-controls.mjs';
import {ImportEnvironmentSpill} from '../import-environment-spill.js';
test('reference pool illuminates the open center and feathers to zero with independent position and rotation',()=>{
 const p=normalizeGateGround();assert.equal(gateGroundWeight(-5.24,-13.46,p),1);assert.equal(gateGroundWeight(-5.24+p.width/2,-13.46,p),0);
 assert.ok(gateGroundWeight(-4,-13.46,p)>gateGroundWeight(-2,-13.46,p));
 const shift=normalizeGateGround({offsetX:-2,offsetZ:1,rotation:90});assert.equal(gateGroundWeight(-7.24,-12.46,shift),1);
 assert.ok(Math.abs(gateGroundWeight(-5.24+1,-13.46,p)-gateGroundWeight(-7.24,-12.46+1,shift))<1e-12);
 for(const patch of [{enabled:false},{width:0},{depth:0},{intensity:0}])assert.equal(gateGroundWeight(-5.24,-13.46,normalizeGateGround(patch)),0);
});
test('projection settings preserve unknowns and zero values without mutating old presets on read',()=>{
 const original={future:{value:1},parts:{eave:{brightness:.4}},groundProjection:{future:'keep',intensity:0,enabled:false,offsetX:-2,color:'#223344'}};
 const before=JSON.stringify(original),s=normalizeBuilding(original);assert.equal(JSON.stringify(original),before);assert.equal(s.groundProjection.intensity,0);assert.equal(s.groundProjection.future,'keep');assert.equal(s.groundProjection.enabled,false);assert.equal(s.groundProjection.offsetX,-2);
 assert.equal(normalizeBuilding({brightness:.5}).groundProjection,undefined);
 const entries=new Map([[BUILDING_LIGHT_KEY,JSON.stringify({version:1,future:7,buildings:{bridge:{brightness:.6}},presets:[{id:'old',building:'gate',settings:{brightness:.8}}]})]]),storage={getItem:k=>entries.get(k),setItem:(k,v)=>entries.set(k,v)};
 writeBuildingLight(storage,'gate',s,{id:'new',name:'灯下'});const result=readBuildingLights(storage);assert.equal(result.future,7);assert.equal(result.buildings.bridge.brightness,.6);assert.equal(result.presets.length,2);assert.equal(result.presets[0].settings.groundProjection,undefined);assert.equal(result.presets[1].settings.groundProjection.intensity,0);
 assert.equal(normalizeGateGround({intensity:NaN,width:Infinity,offsetX:-999,color:'invalid'}).offsetX,-8);assert.equal(normalizeGateGround(null).color,GATE_GROUND_PRESET.color);
});
test('ground atlas adds center illumination independently of perimeter spill and obeys day/night and master',()=>{
 const rig=new ImportEnvironmentSpill();rig.configure({tiles:{'tile-09':{bounds:{FuziTemple0336:{min:[-8,12,-14],max:[-2,15,-13]}},materials:[]}}});rig.buildings=rig.buildings.filter(b=>b.id==='gate');rig.loaded.add(9);rig.setSettings('gate',{enabled:false});rig.setState({night:true});rig.update();
 const sum=()=>rig.accum.reduce((a,b)=>a+b,0);assert.ok(sum()>0);
 rig.buildingAdjustments={gate:{groundProjection:{enabled:false}}};rig.dirty=true;rig.update();assert.equal(sum(),0);
 rig.buildingAdjustments={gate:{enabled:false}};rig.dirty=true;rig.update();assert.equal(sum(),0);
 rig.buildingAdjustments={gate:{groundProjection:{color:'#0000ff'}}};rig.dirty=true;rig.update();assert.ok(sum()>0);for(let i=0;i<rig.accum.length;i+=3){assert.equal(rig.accum[i],0);assert.equal(rig.accum[i+1],0);}
 rig.setState({night:false});assert.equal(rig.uniforms.envActive.value,0);rig.dispose();
});
