import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {SURFACE_ZONES,normalizeSurfaceSpill,sourceLevel} from './surface-spill-profiles.mjs';
import {createSurfaceSpill} from './surface-spill.js';
import {PRESETS,readSaved} from './profiles.mjs';
import {captureStudy,restoreStudy,readStudyDraft,saveStudyDraft} from './study-state.mjs';
import {SPILL_DEFAULTS} from './spill-profiles.mjs';
import {WINDOW_LIGHT_DEFAULTS} from './window-light.mjs';
const current={spillSettings:SPILL_DEFAULTS,softSpillEnabled:false,enabled:true};
test('old schemes default every extra spill off; all zones round-trip without touching old records',()=>{
 const old={...PRESETS[0],key:'old',label:'收藏',other:{keep:true}};const states=normalizeSurfaceSpill();for(const [i,key] of Object.keys(states).entries())states[key]={...states[key],enabled:true,intensity:i+.5,distance:i+5,azimuth:i*10,shadows:i%2===0};
 const snapshot=captureStudy(PRESETS[0],SPILL_DEFAULTS,true,true,'matou',WINDOW_LIGHT_DEFAULTS,states);
 const saved=readSaved(JSON.stringify({version:1,items:[old,{...snapshot,key:'new',label:'外溢'}]}));assert.deepEqual(saved[0],old);assert.deepEqual(restoreStudy(saved[1],current).surfaceSpill,states);assert.deepEqual(restoreStudy(saved[0],current).surfaceSpill,normalizeSurfaceSpill());assert.equal('surfaceSpill' in restoreStudy(saved[1],current).settings,false);
});
test('each zone clamps malformed values without inheriting another zone',()=>{const result=normalizeSurfaceSpill({window:{distance:999,intensity:-1,enabled:true,angle:NaN},roof:{enabled:'true'}});assert.equal(result.window.distance,30);assert.equal(result.window.intensity,0);assert.equal(result.window.angle,120);assert.equal(result.roof.enabled,false);assert.notEqual(result.window,result.roof);});
test('distributed sources cover every window, obey switches, and restore original materials',()=>{
 const scene=new THREE.Scene(),root=new THREE.Group(),rules=[];scene.add(root);const material=new THREE.MeshStandardMaterial();material.name='window';for(let i=0;i<20;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.4,.4),material);m.position.set(i,1,0);m.name='w'+i;root.add(m);rules.push({node:m.name,material:'window',role:'window'});}const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshStandardMaterial());scene.add(floor);const renderer={shadowMap:{enabled:false}};const layer=createSurfaceSpill(scene,root,floor,renderer,{rules},new Map(),new Map(),'matou');
 const states=normalizeSurfaceSpill({window:{enabled:true,distance:12}});layer.configure(states,PRESETS[4],WINDOW_LIGHT_DEFAULTS,true);assert.equal(layer.stats.lights,20);assert.equal(scene.getObjectByName('建筑分区环境投光'),layer.group);assert.equal(renderer.shadowMap.enabled,false);assert.equal(floor.receiveShadow,false);assert.equal(layer.sources.filter(s=>s.zone==='window').length,20);assert.notEqual(root.children[0].material,material);assert.equal(root.children[0].material.map,material.map);assert.equal(material.onBeforeCompile.toString().includes('dsIrradiance'),false);
 layer.configure(states,PRESETS[4],{...WINDOW_LIGHT_DEFAULTS,enabled:false},true);assert.equal(layer.stats.lights,0);assert.equal(renderer.shadowMap.enabled,false);assert.equal(floor.receiveShadow,false);
 layer.configure(states,PRESETS[4],WINDOW_LIGHT_DEFAULTS,false);assert.equal(layer.stats.active,false);layer.configure(states,PRESETS[4],WINDOW_LIGHT_DEFAULTS,true);layer.dispose();assert.equal(scene.getObjectByName('建筑分区环境投光'),undefined);assert.equal(renderer.shadowMap.enabled,false);assert.equal(root.children[0].castShadow,false);assert.equal(root.children[0].material,material);layer.dispose();
});

test('per-building external-light drafts survive switching without inheriting another building',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 const a=normalizeSurfaceSpill({window:{enabled:true,distance:15},trim:{enabled:true,azimuth:33}});
 const b=normalizeSurfaceSpill({sign:{enabled:true,angle:70}});
 for(const [building,state] of [['matou',a],['temple',b]])saveStudyDraft(building,captureStudy(PRESETS[0],SPILL_DEFAULTS,false,true,building,WINDOW_LIGHT_DEFAULTS,state),storage);
 assert.deepEqual(restoreStudy(readStudyDraft('matou',storage),current).surfaceSpill,a);assert.deepEqual(restoreStudy(readStudyDraft('temple',storage),current).surfaceSpill,b);
});
