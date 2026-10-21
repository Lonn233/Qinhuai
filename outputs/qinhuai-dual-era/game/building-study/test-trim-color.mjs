import assert from 'node:assert/strict';
import test from 'node:test';
import {PRESETS,COLOR_CONTROLS,normalizeSettings,validSettings,readSaved,STORAGE_KEY} from './profiles.mjs';
import {captureStudy,restoreStudy,saveStudyDraft,readStudyDraft} from './study-state.mjs';
import {SPILL_DEFAULTS} from './spill-profiles.mjs';

test('wall-top coping and window colors are independent validated settings',()=>{
 assert.ok(COLOR_CONTROLS.some(([key])=>key==='trimColor'));
 const settings={...PRESETS[0],trimColor:'#ff0000',windowColor:'#0000ff'};
 assert.ok(validSettings(settings));
 assert.equal(validSettings({...settings,trimColor:'not-a-color'}),false);
 const snapshot=captureStudy(settings,{...SPILL_DEFAULTS,intensity:1.2},true,true,'matou');
 const saved=readSaved(JSON.stringify({version:1,items:[{...snapshot,key:'trim-test',label:'Independent colors'}]}));
 assert.equal(saved.length,1);
 assert.equal(saved[0].trimColor,'#ff0000');assert.equal(saved[0].windowColor,'#0000ff');
 const current={spillSettings:SPILL_DEFAULTS,softSpillEnabled:false,enabled:false};
 const restored=restoreStudy(saved[0],current);
 assert.equal(restored.settings.trimColor,'#ff0000');assert.equal(restored.settings.windowColor,'#0000ff');
 assert.deepEqual(restored.spillSettings,snapshot.softSpill.settings);assert.equal(restored.softSpillEnabled,true);
 const store=new Map(),storage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)};
 assert.equal(saveStudyDraft('matou',snapshot,storage),true);
 const other=captureStudy({...PRESETS[1],trimColor:'#00ff00'},SPILL_DEFAULTS,false,true,'pavilion');
 assert.equal(saveStudyDraft('pavilion',other,storage),true);
 assert.deepEqual(readStudyDraft('matou',storage),snapshot);
});

test('legacy schemes and drafts inherit the previous window tint without losing any saved fields',()=>{
 const legacy=captureStudy({...PRESETS[0],windowColor:'#918273'},SPILL_DEFAULTS,true,false,'matou');
 delete legacy.trimColor;
 const serialized=JSON.stringify(legacy);
 const migrated=normalizeSettings(legacy);
 assert.equal(migrated.trimColor,'#918273');assert.equal(migrated.windowColor,'#918273');
 assert.equal(JSON.stringify(legacy),serialized);
 const saved=readSaved(JSON.stringify({version:1,items:[{...legacy,key:'old',label:'Legacy'}]}));
 assert.equal(saved[0].trimColor,'#918273');assert.deepEqual(saved[0].softSpill,legacy.softSpill);
 const restored=restoreStudy(legacy,{spillSettings:SPILL_DEFAULTS,softSpillEnabled:false,enabled:true});
 assert.equal(restored.settings.trimColor,'#918273');assert.equal(restored.enabled,false);assert.equal(restored.softSpillEnabled,true);
 const oldest={...legacy};delete oldest.windowColor;
 assert.equal(normalizeSettings(oldest).trimColor,oldest.color);
 assert.equal(STORAGE_KEY,'qinhuai.building-light-studies.v1');
});
