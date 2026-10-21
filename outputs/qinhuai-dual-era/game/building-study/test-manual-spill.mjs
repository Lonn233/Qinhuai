import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {MANUAL_PRESETS,MAX_MANUAL_POINTS,normalizeManualSpill,createManualPoint,applyManualPreset,readManualLibrary,writeManualLibrary,MANUAL_SPILL_KEY} from './manual-spill-profiles.mjs';
import {createManualSpillLayer,MANUAL_WORLD_PER_METRE} from './manual-spill.js';
import {captureStudy,restoreStudy} from './study-state.mjs';
import {PRESETS,readSaved} from './profiles.mjs';
import {SPILL_DEFAULTS} from './spill-profiles.mjs';
const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};};
test('exactly four real spill presets retain placement and identity',()=>{
 assert.equal(MANUAL_PRESETS.length,4);
 for(const p of MANUAL_PRESETS){const s=applyManualPreset({id:'a',position:[1,2,3],normal:[0,0,2],name:'檐角'},p.id);assert.equal(s.preset,p.id);assert.deepEqual(s.position,[1,2,3]);assert.deepEqual(s.normal,[0,0,1]);assert.equal(s.name,'檐角');}
});
test('clamps point parameters, protects IDs, deep copies snapshots',()=>{
 const raw={enabled:true,points:Array.from({length:10},(_,i)=>({id:'same',position:[NaN,i,Infinity],intensity:999,distance:-3,color:'bad',normal:[0,0,0]}))};
 const s=normalizeManualSpill(raw);assert.equal(s.points.length,MAX_MANUAL_POINTS);assert.equal(new Set(s.points.map(p=>p.id)).size,MAX_MANUAL_POINTS);assert.deepEqual(s.points[0].position,[0,0,0]);assert.equal(s.points[0].intensity,12);assert.equal(s.points[0].distance,.5);assert.equal(s.points[0].color,'#e3a659');s.points[0].position[1]=9;assert.notEqual(raw.points[0].position[1],9);
});
test('named save-as schemes preserve independent per-building snapshots',()=>{
 const storage=memory(),point=createManualPoint([1,2,3],[0,-1,0],'wide','first');const state=normalizeManualSpill({enabled:true,selectedId:point.id,points:[point]});
 assert.ok(writeManualLibrary('matou',[{key:'one',label:'檐下方案',state},{key:'two',label:'另一方案',state:{...state,enabled:false}}],storage));
 assert.equal(readManualLibrary('matou',storage).length,2);assert.equal(readManualLibrary('pavilion',storage).length,0);assert.ok(readManualLibrary('matou',storage)[0].state.enabled);
 assert.ok(writeManualLibrary('pavilion',[{key:'p',label:'塔',state}],storage));assert.equal(readManualLibrary('matou',storage).length,2);assert.equal(writeManualLibrary('__proto__',[],storage),false);
 storage.setItem(MANUAL_SPILL_KEY,'broken');assert.deepEqual(readManualLibrary('matou',storage),[]);assert.ok(writeManualLibrary('matou',[{key:'recovery',label:'修复',state}],storage));
 assert.equal(writeManualLibrary('matou',[],{getItem(){throw Error();},setItem(){throw Error();}}),false);
});
test('full study schemes round-trip manual points without changing base lights',()=>{
 const manual=normalizeManualSpill({enabled:true,points:[createManualPoint([1,2,3],[0,0,1],'wash','a')]});
 const snapshot=captureStudy(PRESETS[0],SPILL_DEFAULTS,false,true,'matou',undefined,undefined,manual);
 const [saved]=readSaved(JSON.stringify({version:1,items:[{...snapshot,key:'full',label:'完整方案'}]}));
 const state=restoreStudy(saved,{spillSettings:SPILL_DEFAULTS,manualSpill:normalizeManualSpill(),softSpillEnabled:false,enabled:true});assert.deepEqual(state.manualSpill,manual);assert.equal(state.settings.color,PRESETS[0].color);assert.equal('manualSpill' in state.settings,false);
});
test('native lights respect switches and shadow limit, preserve geometry/materials and dispose',()=>{
 const oldWindow=globalThis.window;globalThis.window=new EventTarget();
 const scene=new THREE.Scene(),model=new THREE.Group(),mesh=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial()),floor=new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.MeshStandardMaterial());model.add(mesh);scene.add(model,floor);
 const geometry=mesh.geometry,material=mesh.material;const renderer={shadowMap:{enabled:false,type:THREE.PCFShadowMap}},canvas=new EventTarget();canvas.classList={toggle(){},remove(){}};canvas.getBoundingClientRect=()=>({left:0,top:0,width:100,height:100});const camera=new THREE.PerspectiveCamera();camera.position.set(0,0,5);
 const layer=createManualSpillLayer(scene,model,floor,renderer,camera,canvas);const points=MANUAL_PRESETS.map((p,i)=>({...createManualPoint([i,0,0],[0,0,1],p.id,'p'+i),shadows:true}));layer.configure({enabled:true,points});
 assert.equal(layer.stats.active,4);assert.equal(layer.stats.shadowLights,2);assert.equal(layer.lights.get('p1').distance,points[1].distance*MANUAL_WORLD_PER_METRE);assert.equal(mesh.geometry,geometry);assert.equal(mesh.material,material);assert.equal(model.children.length,1);
 layer.configure({enabled:true,points},false);assert.equal(layer.stats.active,0);assert.equal(renderer.shadowMap.enabled,false);assert.equal(mesh.castShadow,false);layer.configure({enabled:true,points:[points[0]]});assert.equal(layer.lights.size,1);
 layer.dispose();assert.equal(scene.getObjectByName('study-manual-spill'),undefined);assert.equal(mesh.material,material);assert.equal(renderer.shadowMap.enabled,false);assert.equal(renderer.shadowMap.type,THREE.PCFShadowMap);globalThis.window=oldWindow;
});

test('world-space manual points are not transferred across buildings in full schemes',()=>{
 const savedManual=normalizeManualSpill({enabled:true,points:[createManualPoint([1,2,3],[0,0,1],'eave','from-temple')]});
 const currentManual=normalizeManualSpill({enabled:true,points:[createManualPoint([4,5,6],[0,1,0],'wide','own-matou')]});
 const snapshot=captureStudy(PRESETS[0],SPILL_DEFAULTS,false,true,'temple',undefined,undefined,savedManual);
 const state=restoreStudy(snapshot,{building:'matou',spillSettings:SPILL_DEFAULTS,manualSpill:currentManual,softSpillEnabled:false,enabled:true});
 assert.deepEqual(state.manualSpill,currentManual);
 assert.deepEqual(restoreStudy(snapshot,{building:'temple',manualSpill:currentManual}).manualSpill,savedManual);
});

test('denied browser localStorage getters cannot crash the manual editor',()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('SecurityError');}});
 try{assert.deepEqual(readManualLibrary('matou'),[]);assert.equal(writeManualLibrary('matou',[]),false);}
 finally{if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else delete globalThis.localStorage;}
});

test('external spill save-as includes window illumination and all regional spill parameters',async()=>{
 const {normalizeSurfaceSpill}=await import('./surface-spill-profiles.mjs');
 const {normalizeWindowLight}=await import('./window-light.mjs');
 const storage=memory(),state=normalizeManualSpill({enabled:true,points:[createManualPoint([1,2,3],[0,0,1],'wide','window-side')]}),surfaceSpill=normalizeSurfaceSpill({window:{enabled:true,intensity:3.2,distance:18,angle:135,azimuth:22,elevation:-38,softness:.94,shadows:false}}),windowLight=normalizeWindowLight({color:'#326bff',brightness:2.15,directional:true,distance:7.5,sourceDistance:2.2,angle:95,azimuth:12,elevation:-15,softness:.82});
 const scheme={key:'with-windows',label:'窗户外溢',state,surfaceSpill,windowLight};
 assert.ok(writeManualLibrary('matou',[scheme],storage));
 const [saved]=readManualLibrary('matou',storage);assert.deepEqual(saved,scheme);
 const reloaded=memory();reloaded.setItem(MANUAL_SPILL_KEY,storage.getItem(MANUAL_SPILL_KEY));assert.deepEqual(readManualLibrary('matou',reloaded),[scheme]);
 saved.surfaceSpill.window.distance=2;saved.windowLight.color='#ff0000';saved.state.points[0].intensity=0;
 assert.deepEqual(readManualLibrary('matou',storage),[scheme]);
});

test('legacy point-only schemes remain point-only and deleting preserves linked spill in remaining schemes',async()=>{
 const {normalizeSurfaceSpill}=await import('./surface-spill-profiles.mjs');
 const storage=memory(),state=normalizeManualSpill(),legacy={key:'old',label:'旧点位',state},linked={key:'new',label:'含窗户',state,surfaceSpill:normalizeSurfaceSpill({window:{enabled:true,distance:16}})};
 assert.ok(writeManualLibrary('matou',[legacy,linked],storage));
 assert.deepEqual(readManualLibrary('matou',storage)[0],legacy);assert.equal('windowLight' in readManualLibrary('matou',storage)[0],false);assert.equal('surfaceSpill' in readManualLibrary('matou',storage)[0],false);
 assert.ok(writeManualLibrary('pavilion',[legacy],storage));
 assert.ok(writeManualLibrary('matou',readManualLibrary('matou',storage).filter(s=>s.key!=='old'),storage));assert.deepEqual(readManualLibrary('matou',storage),[linked]);assert.deepEqual(readManualLibrary('pavilion',storage),[legacy]);
});
