import assert from 'node:assert/strict';
import {test} from 'node:test';
import {PRESETS,readSaved,NUMERIC_CONTROLS,COLOR_CONTROLS} from './profiles.mjs';
import {SPILL_DEFAULTS,SPILL_STORAGE,normalizeSpill} from './spill-profiles.mjs';
import {captureStudy,restoreStudy,hasSavedSpill,readStudyDraft,saveStudyDraft,CURRENT_STUDIES_KEY} from './study-state.mjs';
import {readSpillState,readSpill,saveSpill} from './spill-controls.js';

const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};};
const base={...PRESETS[2],brightness:0,eave:0,roof:0,facade:0,window:0,sign:0,color:'#123456',roofColor:'#654321',facadeColor:'#abcdef',windowColor:'#fedcba',exposure:1.13,ambient:0,moon:0};
const spill=normalizeSpill({preset:'broad',intensity:0,horizontal:1.23,down:1.97,up:.21,falloff:1.65,color:'#9abcde',surface:'walls',region:'custom',centerX:0,centerZ:72,width:43,depth:61,minHeight:0,maxHeight:88,edge:19});
const current={spillSettings:{...SPILL_DEFAULTS},softSpillEnabled:true,enabled:true};

test('named schemes round-trip every base, environment, color, spill and switch field',()=>{
 const snapshot=captureStudy(base,spill,false,false,'pavilion');
 const [saved]=readSaved(JSON.stringify({version:1,items:[{...snapshot,key:'complete',label:'Complete'}]}));
 assert.ok(saved);assert.ok(hasSavedSpill(saved));
 const restored=restoreStudy(saved,current);
 for(const [key] of [...NUMERIC_CONTROLS,...COLOR_CONTROLS])assert.equal(restored.settings[key],base[key],key);
 assert.deepEqual(restored.spillSettings,spill);
 assert.deepEqual(Object.keys(restored.spillSettings).sort(),Object.keys(SPILL_DEFAULTS).sort());
 assert.equal(restored.enabled,false);assert.equal(restored.softSpillEnabled,false);
 assert.equal('softSpill' in restored.settings,false);assert.equal('lightEnabled' in restored.settings,false);
});

test('schemes capture independent state and restoring never mutates saved data',()=>{
 const a=captureStudy(base,spill,true,true,'pavilion');
 const b=captureStudy({...base,color:'#111111'},{...spill,intensity:1.1},false,false,'pavilion');
 const original=JSON.stringify(a);
 b.softSpill.settings.width=10;
 const restored=restoreStudy(a,current);restored.spillSettings.depth=15;restored.settings.color='#222222';
 assert.equal(JSON.stringify(a),original);assert.equal(a.softSpill.settings.width,43);assert.equal(a.softSpill.enabled,true);
});

test('legacy schemes retain live spill settings and switches instead of erasing them',()=>{
 const [legacy]=readSaved(JSON.stringify({version:1,items:[{...PRESETS[0],key:'legacy',label:'Old'}]}));
 const active={spillSettings:spill,softSpillEnabled:true,enabled:false};
 const restored=restoreStudy(legacy,active);
 assert.equal(hasSavedSpill(legacy),false);assert.deepEqual(restored.spillSettings,spill);
 assert.notEqual(restored.spillSettings,spill);assert.equal(restored.softSpillEnabled,true);assert.equal(restored.enabled,false);
 for(const bad of [null,{}, {softSpill:{settings:null}},{softSpill:{settings:[]}}])assert.equal(hasSavedSpill(bad),false);
});

test('current drafts are isolated per building and survive serialization/reload',()=>{
 const storage=memory();
 const pavilion=captureStudy(base,spill,true,false,'pavilion');
 const matou=captureStudy(PRESETS[5],SPILL_DEFAULTS,false,true,'matou');
 assert.equal(saveStudyDraft('pavilion',pavilion,storage),true);
 assert.equal(saveStudyDraft('matou',matou,storage),true);
 assert.deepEqual(readStudyDraft('pavilion',storage),pavilion);
 assert.deepEqual(readStudyDraft('matou',storage),matou);
 assert.equal(readStudyDraft('temple',storage),null);
 const reloaded=memory();reloaded.setItem(CURRENT_STUDIES_KEY,storage.getItem(CURRENT_STUDIES_KEY));
 assert.deepEqual(readStudyDraft('pavilion',reloaded),pavilion);
 assert.equal(saveStudyDraft('__proto__',pavilion,storage),false);
});

test('corrupt or unavailable draft storage is handled without a false success',()=>{
 const storage=memory(),snapshot=captureStudy(base,spill,true,true,'pavilion');
 for(const raw of ['broken','null','[]','{"version":99}','{"version":1,"buildings":[]}']){
  storage.setItem(CURRENT_STUDIES_KEY,raw);assert.equal(readStudyDraft('pavilion',storage),null);
  assert.equal(saveStudyDraft('pavilion',snapshot,storage),true);assert.deepEqual(readStudyDraft('pavilion',storage),snapshot);
 }
 storage.setItem(CURRENT_STUDIES_KEY,JSON.stringify({version:1,buildings:{pavilion:{...snapshot,brightness:99}}}));
 assert.equal(readStudyDraft('pavilion',storage),null);
 const denied={getItem(){throw new Error('denied');},setItem(){throw new Error('denied');}};
 assert.equal(readStudyDraft('pavilion',denied),null);assert.equal(saveStudyDraft('pavilion',snapshot,denied),false);
});

test('independent spill saves migrate legacy values and persist on/off without losing other buildings',()=>{
 const previous=Object.getOwnPropertyDescriptor(globalThis,'localStorage'),storage=memory();
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:storage});
 try{
  storage.setItem(SPILL_STORAGE,JSON.stringify({pavilion:spill,matou:{...SPILL_DEFAULTS,intensity:.12}}));
  assert.deepEqual(readSpill('pavilion'),spill);assert.equal(readSpillState('pavilion').enabled,false);
  assert.equal(saveSpill('pavilion',spill,true),true);assert.equal(readSpillState('pavilion').enabled,true);
  assert.equal(saveSpill('pavilion',{...spill,intensity:.9}),true);assert.equal(readSpillState('pavilion').enabled,true);
  assert.equal(saveSpill('pavilion',spill,false),true);assert.equal(readSpillState('pavilion').enabled,false);
  assert.equal(readSpill('matou').intensity,.12);
  storage.setItem(SPILL_STORAGE,'broken');assert.deepEqual(readSpillState('pavilion'),{settings:SPILL_DEFAULTS,enabled:false});
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('denied');}});
  assert.equal(saveSpill('pavilion',spill,true),false);assert.deepEqual(readSpillState('pavilion'),{settings:SPILL_DEFAULTS,enabled:false});
 }finally{if(previous)Object.defineProperty(globalThis,'localStorage',previous);else delete globalThis.localStorage;}
});

test('full named schemes and drafts retain customized window exterior spill through reload',async()=>{
 const {normalizeSurfaceSpill}=await import('./surface-spill-profiles.mjs');
 const {normalizeWindowLight}=await import('./window-light.mjs');
 const surface=normalizeSurfaceSpill({window:{enabled:true,intensity:3.2,distance:18,angle:135,azimuth:22,elevation:-38,softness:.94,shadows:false}}),window=normalizeWindowLight({color:'#326bff',brightness:2.15});
 const snapshot=captureStudy(PRESETS[0],spill,true,true,'matou',window,surface);
 const [saved]=readSaved(JSON.stringify({version:1,items:[{...snapshot,key:'window-exterior',label:'完整窗户外溢'}]}));
 const restored=restoreStudy(saved,current);assert.deepEqual(restored.surfaceSpill,surface);assert.deepEqual(restored.windowLight,window);
 const storage=memory();assert.ok(saveStudyDraft('matou',saved,storage));const draft=readStudyDraft('matou',storage);assert.deepEqual(restoreStudy(draft,current).surfaceSpill,surface);assert.deepEqual(restoreStudy(draft,current).windowLight,window);
});
