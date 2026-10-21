import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import * as THREE from 'three';
import {normalizeWindowLight,windowFloorSettings,updateWindowFloor,windowFloorForRule} from './window-light.mjs';
import {normalizeSurfaceSpill,surfaceFloorSettings,updateSurfaceFloor,SURFACE_ZONES} from './surface-spill-profiles.mjs';
import {captureStudy,restoreStudy,saveStudyDraft,readStudyDraft} from './study-state.mjs';
import {normalizeManualScheme,writeManualLibrary,readManualLibrary} from './manual-spill-profiles.mjs';
import {createSurfaceSpill} from './surface-spill.js';
import {PRESETS,readSaved} from './profiles.mjs';
import {SPILL_DEFAULTS} from './spill-profiles.mjs';

const floors=['first','second'];
const windowState=()=>updateWindowFloor(updateWindowFloor({brightness:1.2,color:'#cc8844'},'first',{color:'#ee4422',brightness:2.3,directional:true,distance:8,sourceDistance:1.1,angle:85,azimuth:-25,elevation:-15,softness:.3}),'second',{color:'#3377dd',brightness:.7,directional:true,distance:12,sourceDistance:2.8,angle:135,azimuth:35,elevation:20,softness:.9});
const spillState=()=>normalizeSurfaceSpill({window:updateSurfaceFloor(updateSurfaceFloor({enabled:false},'first',{enabled:true,intensity:2.4,distance:9,angle:90,azimuth:-20,elevation:-30,softness:.4,shadows:false}),'second',{enabled:true,intensity:.8,distance:18,angle:145,azimuth:30,elevation:15,softness:.95,shadows:true})});

test('old shared window and spill settings migrate to visually identical independent floors',()=>{
 const w=normalizeWindowLight({enabled:false,brightness:2.5,color:'#123456',directional:true,angle:80});
 for(const key of floors)assert.deepEqual(windowFloorSettings(w,key),w);
 const changed=updateWindowFloor(w,'first',{enabled:true,color:'#ff3300'});
 assert.deepEqual(changed.floors.second,w);assert.equal(changed.floors.first.color,'#ff3300');assert.equal(w.floors,undefined);
 const s={enabled:true,intensity:2,distance:17};assert.deepEqual(surfaceFloorSettings(s,'first'),surfaceFloorSettings(s,'second'));
 const split=updateSurfaceFloor(s,'second',{distance:5});assert.equal(split.floors.first.distance,17);assert.equal(split.floors.second.distance,5);
});
test('floor parameters are independently clamped and copies never alias saved state',()=>{
 const w=normalizeWindowLight({color:'#aabbcc',floors:{first:{brightness:900,color:'bad',angle:NaN},second:{brightness:.3,color:'#010203'}}});
 assert.equal(w.floors.first.brightness,10);assert.equal(w.floors.first.color,null);assert.equal(w.floors.first.angle,110);assert.equal(w.floors.second.brightness,.3);
 const clone=normalizeWindowLight(w);clone.floors.second.color='#ffffff';assert.equal(w.floors.second.color,'#010203');
 const s=normalizeSurfaceSpill({window:{floors:{first:{distance:100,softness:-1},second:{intensity:3}}}});assert.equal(s.window.floors.first.distance,30);assert.equal(s.window.floors.first.softness,0);assert.equal(s.window.floors.second.intensity,3);
});
test('real Matou window rules are assigned to floors by measured height',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../../assets/building-study/matou/manifest.json',import.meta.url),'utf8'));
 const rules=manifest.rules.filter(r=>r.role==='window');assert.equal(rules.length,2);
 const assigned=Object.fromEntries(rules.map(r=>[r.node,windowFloorForRule(r,manifest)]));assert.equal(assigned.FuziTemple0707,'first');assert.equal(assigned.FuziTemple0706,'second');
 assert.equal(windowFloorForRule({},{rules:[]}), 'first');
});
test('full named schemes, drafts and exterior Save As preserve every parameter on both floors',()=>{
 const windowLight=windowState(),surfaceSpill=spillState(),current={building:'matou',spillSettings:SPILL_DEFAULTS,softSpillEnabled:false,enabled:true};
 const snapshot=captureStudy(PRESETS[0],SPILL_DEFAULTS,true,true,'matou',windowLight,surfaceSpill);
 const named=readSaved(JSON.stringify({version:1,items:[{...snapshot,key:'floor-save',label:'Both floors'}]}));
 const restored=restoreStudy(named[0],current);assert.deepEqual(restored.windowLight,windowLight);assert.deepEqual(restored.surfaceSpill,surfaceSpill);
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 assert.ok(saveStudyDraft('matou',snapshot,storage));assert.deepEqual(restoreStudy(readStudyDraft('matou',storage),current).windowLight,windowLight);
 const manual=normalizeManualScheme({key:'floor-spill',label:'Floor exterior',state:{points:[]},windowLight,surfaceSpill});
 assert.ok(writeManualLibrary('matou',[manual],storage));const [loaded]=readManualLibrary('matou',storage);assert.deepEqual(loaded.windowLight,windowLight);assert.deepEqual(loaded.surfaceSpill,surfaceSpill);
 loaded.surfaceSpill.window.floors.second.intensity=0;assert.equal(surfaceSpill.window.floors.second.intensity,.8);
});
function fixture(){
 const scene=new THREE.Scene(),root=new THREE.Group(),rules=[];scene.add(root);
 for(const [i,y]of [1,3].entries()){
  const mat=new THREE.MeshStandardMaterial();mat.name='window'+i;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,.7),mat);mesh.position.y=y;mesh.name='panel'+i;root.add(mesh);
  rules.push({node:mesh.name,material:mat.name,role:'window',bounds:{min:[-.5,y-.35,0],max:[.5,y+.35,0]}});
 }
 return createSurfaceSpill(scene,root,null,{shadowMap:{enabled:false}},{rules},new Map(),new Map(),'matou');
}
test('exterior shader sources use per-floor colors, gain, distance, cone, aim, shadows and switches',()=>{
 const layer=fixture(),w=windowState(),s=spillState(),base={...PRESETS[0],window:1,brightness:1};
 layer.configure(s,base,w,true);const count=layer.sources.length,data=layer.uniforms.dsSources.value.image.data;assert.equal(count,2);
 for(const [i,src]of layer.sources.entries()){
  const state=s.window.floors[src.floor],win=w.floors[src.floor];assert.equal(src.active,true);assert.equal(src.shadow,state.shadows);assert.equal(src.angle,state.angle);
  assert.ok(Math.abs(data[i*4+3]-state.intensity*win.brightness*2.5)<1e-5);
  const actualColor=Array.from(data.slice(count*8+i*4,count*8+i*4+3)),expectedColor=new THREE.Color(win.color).toArray();actualColor.forEach((v,k)=>assert.ok(Math.abs(v-expectedColor[k])<1e-5));
  assert.ok(Math.abs(data[count*8+i*4+3]-state.distance*.53/1.65)<1e-5);
  assert.equal(data[count*12+i*4+1],state.shadows?1:0);
 }
 const upper=layer.sources.findIndex(x=>x.floor==='second'),before=Array.from(data.slice(count*8+upper*4,count*8+upper*4+4));
 layer.configure(s,base,updateWindowFloor(w,'first',{enabled:false}),true);
 assert.equal(layer.sources.find(x=>x.floor==='first').active,false);assert.equal(layer.sources.find(x=>x.floor==='second').active,true);assert.equal(layer.stats.lights,1);assert.deepEqual(Array.from(data.slice(count*8+upper*4,count*8+upper*4+4)),before);
 layer.configure({...s,window:updateSurfaceFloor(s.window,'second',{enabled:false})},base,w,true);assert.equal(layer.stats.lights,1);assert.equal(layer.sources.find(x=>x.floor==='first').active,true);assert.equal(layer.sources.find(x=>x.floor==='second').active,false);
 layer.configure(s,base,w,false);assert.equal(layer.stats.active,false);layer.dispose();
});
test('editing either storey never mutates other floor, shared base, or unrelated surface zones',()=>{
 const w=windowState(),s=spillState(),previous=structuredClone({w,s});
 const nw=updateWindowFloor(w,'first',{brightness:9}),ns=normalizeSurfaceSpill({...s,window:updateSurfaceFloor(s.window,'first',{intensity:7})});
 assert.deepEqual(nw.floors.second,w.floors.second);assert.deepEqual(ns.window.floors.second,s.window.floors.second);
 for(const key of Object.keys(SURFACE_ZONES).filter(k=>k!=='window'))assert.deepEqual(ns[key],s[key]);assert.deepEqual({w,s},previous);
});
