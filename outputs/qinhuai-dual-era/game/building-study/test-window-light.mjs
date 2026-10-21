import assert from 'node:assert/strict';
import {test} from 'node:test';
import {PRESETS,readSaved} from './profiles.mjs';
import {captureStudy,restoreStudy,readStudyDraft,saveStudyDraft} from './study-state.mjs';
import {SPILL_DEFAULTS} from './spill-profiles.mjs';
import {WINDOW_LIGHT_DEFAULTS,normalizeWindowLight} from './window-light.mjs';
const current={spillSettings:{...SPILL_DEFAULTS},softSpillEnabled:true,enabled:true};
const custom={enabled:false,brightness:3.25,color:'#abcdef',directional:true,distance:9,sourceDistance:2,angle:87,azimuth:-21,elevation:13,softness:.42};
test('complete saves round-trip all window controls without modifying base or spill',()=>{
 const s=captureStudy(PRESETS[0],SPILL_DEFAULTS,true,true,'matou',custom);
 const [saved]=readSaved(JSON.stringify({version:1,items:[{...s,key:'new',label:'Windows'}]}));
 const restored=restoreStudy(saved,current);
 assert.deepEqual(restored.windowLight,custom);
 assert.deepEqual(restored.spillSettings,SPILL_DEFAULTS);
 for(const key of Object.keys(PRESETS[0]))assert.deepEqual(restored.settings[key],PRESETS[0][key]);
 restored.windowLight.brightness=7;assert.equal(saved.windowLight.brightness,3.25);
});
test('all six old presets and malformed optional window fields retain valid saved schemes',()=>{
 for(const p of PRESETS)for(const field of [undefined,null,[],{brightness:'bad',color:'bad',angle:NaN}]){
  const old={...p,key:p.id,label:p.name,windowLight:field};
  const [saved]=readSaved(JSON.stringify({version:1,items:[old]}));assert.ok(saved);
  assert.deepEqual(restoreStudy(saved,current).windowLight,WINDOW_LIGHT_DEFAULTS);
 }
});
test('append a new save preserves every existing record and its unknown extension fields',()=>{
 const old=PRESETS.map(p=>({...p,key:p.id,label:p.name,futureExtension:{keep:true}}));
 const next=[...readSaved(JSON.stringify({version:1,items:old})),{...captureStudy(PRESETS[0],SPILL_DEFAULTS,true,true,'matou',custom),key:'new',label:'New'}];
 const loaded=readSaved(JSON.stringify({version:1,items:next}));
 assert.equal(loaded.length,7);assert.deepEqual(loaded.slice(0,6),old);
});
test('per-building drafts preserve independent window settings',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 saveStudyDraft('matou',captureStudy(PRESETS[0],SPILL_DEFAULTS,true,true,'matou',custom),storage);
 saveStudyDraft('pavilion',captureStudy(PRESETS[1],SPILL_DEFAULTS,false,true,'pavilion'),storage);
 assert.deepEqual(restoreStudy(readStudyDraft('matou',storage),current).windowLight,custom);
 assert.deepEqual(restoreStudy(readStudyDraft('pavilion',storage),current).windowLight,WINDOW_LIGHT_DEFAULTS);
});
test('normalization clamps valid numbers and safely defaults corrupt values',()=>{
 const p=normalizeWindowLight({brightness:100,distance:-1,angle:Infinity,azimuth:-100,color:'#AABBCC',enabled:'false'});
 assert.equal(p.brightness,10);assert.equal(p.distance,.3);assert.equal(p.angle,110);assert.equal(p.azimuth,-70);assert.equal(p.color,'#aabbcc');assert.equal(p.enabled,true);
});
