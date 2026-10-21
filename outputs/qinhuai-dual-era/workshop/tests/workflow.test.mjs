import test from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG, STAGES, PAPER_IDS } from '../config.mjs';
import { createState, currentStage, applyAction as rawAction, applyGlue, applyRingPlacement, updateDrying, makeFinishedState, migrateLegacyState, restoreState, validateState, Workflow, progress } from '../workflow.mjs';
function applyAction(s,tool,now){const stage=currentStage(s);if(stage.id==='frame_assembly')for(let i=0;i<3;i++)applyRingPlacement(s,i);const lining=stage.id.startsWith('lining_'),panel=s.counts[stage.id];if(lining)applyGlue(s,stage.id,panel);return rawAction(s,tool,now,lining?{panel}:null);}
test('fresh state is valid; wrong tools never advance',()=>{const s=createState();assert.ok(validateState(s));assert.equal(applyAction(s,'light').ok,false);assert.equal(s.counts.bamboo_prep,0);});
test('complete all eight phases and 24 manual steps; preserve unique paper identities',()=>{const s=createState();let now=10000;assert.equal(STAGES.filter(s=>!s.automatic).length,24);while(!s.complete){if(currentStage(s).id==='paper_drying'){assert.equal(applyAction(s,'press',now).ok,false);now+=CONFIG.dryDuration;updateDrying(s,now);}else assert.ok(applyAction(s,currentStage(s).tool,now).ok);assert.ok(validateState(s));}assert.equal(progress(s),100);assert.deepEqual(s.papers.map(p=>p.id),PAPER_IDS);assert.ok(s.papers.every(p=>p.status==='installed'));assert.equal(s.counts.frame_binding*3,36);});
test('wet paper is not allowed into the press',()=>{const s=createState();while(currentStage(s).id!=='paper_drying')assert.ok(applyAction(s,currentStage(s).tool,10000).ok);assert.equal(updateDrying(s,10000),false);assert.equal(applyAction(s,'press',10000).ok,false);assert.equal(s.counts.petal_pressing,0);assert.equal(updateDrying(s,13500),true);assert.equal(currentStage(s).id,'petal_pressing');});
test('undo, redo, branch and stage-reset maintain valid data',()=>{const w=new Workflow();w.act('bamboo');w.act('bamboo');assert.ok(w.undo());assert.equal(w.state.counts.bamboo_prep,1);assert.ok(w.redo());assert.equal(w.state.counts.bamboo_prep,2);w.undo();w.act('bamboo');assert.equal(w.future.length,0);assert.ok(w.resetStage());assert.equal(w.state.counts.bamboo_prep,0);assert.ok(validateState(w.state));});
test('reject corrupt or inconsistent saves',()=>{for(const bad of [null,{}, {...createState(),stage:999},{...createState(),papers:[]},{...createState(),lit:true}])assert.equal(validateState(bad),false);const s=makeFinishedState();s.papers[0].id='other-id';assert.equal(validateState(s),false);const w=new Workflow({version:2});assert.ok(validateState(w.state));});
test('preview includes every component but is unlit by default',()=>{const s=makeFinishedState();assert.equal(s.complete,true);assert.equal(s.lit,false);assert.ok(STAGES.every(stage=>s.counts[stage.id]===stage.total));});

test('malformed paper records are rejected without throwing',()=>{for(const value of [null,undefined,17,'paper']){const s=createState();s.papers[0]=value;assert.equal(validateState(s),false);}});

function advanceTo(id){const s=createState();let now=10000;while(currentStage(s).id!==id){if(currentStage(s).id==='paper_drying'){now+=CONFIG.dryDuration;updateDrying(s,now);}else assert.ok(applyAction(s,currentStage(s).tool,now).ok);}return s;}
test('test skip completes exactly one manual stage and preserves materials through the full chain',()=>{
 const w=new Workflow(),visited=[];
 while(!w.state.complete){
  const stage=currentStage(w.state),before=structuredClone(w.state),history=w.history.length;
  visited.push(stage.id);assert.ok(w.skipStage(10000).ok,stage.id);
  assert.equal(w.state.counts[stage.id],stage.total);assert.equal(w.history.length,history+1);assert.ok(validateState(w.state),stage.id);
  assert.deepEqual(restoreState(JSON.parse(JSON.stringify(w.state))),w.state);
  if(!w.state.complete)assert.equal(w.state.counts[currentStage(w.state).id],0);
  const after=structuredClone(w.state);assert.ok(w.undo());assert.deepEqual(w.state,before);assert.ok(w.redo());assert.deepEqual(w.state,after);
 }
 assert.deepEqual(visited,STAGES.filter(s=>!s.automatic).map(s=>s.id));assert.equal(progress(w.state),100);assert.equal(w.state.lit,true);
 assert.ok(w.state.papers.every(p=>p.status==='installed'));assert.deepEqual(w.state.papers.map(p=>p.id),PAPER_IDS);
 const before=structuredClone(w.state),history=w.history.length;assert.equal(w.skipStage().ok,false);assert.deepEqual(w.state,before);assert.equal(w.history.length,history);
});
test('skip preserves partial bamboo identities and starts a new undo branch',()=>{
 const w=new Workflow(),evidence={mode:'bend',strip:9,quality:1,curve:1,oval:0,dose:0,angle:0,distance:0};
 assert.ok(w.act('bamboo',10000,evidence).ok);const before=structuredClone(w.state);
 assert.ok(w.skipStage(10000).ok);assert.deepEqual(w.state.frameItems.usedStrips,[9,0,1]);assert.deepEqual(w.state.frameItems.placedRings,[]);
 assert.ok(w.undo());assert.deepEqual(w.state,before);assert.ok(w.skipStage(10000).ok);assert.equal(w.future.length,0);assert.equal(w.redo(),false);
});
test('skip assembles only missing rings and ribs with immediate per-rib binding',()=>{
 const w=new Workflow(advanceTo('frame_assembly'));assert.ok(w.installRing(2));assert.ok(w.installRing(0));
 assert.ok(w.skipStage(10000).ok);assert.deepEqual(w.state.frameItems.placedRings,[2,0,1]);assert.equal(w.state.counts.frame_assembly,12);assert.equal(w.state.counts.frame_binding,12);
  assert.equal(currentStage(w.state).id,'frame_short_binding');assert.deepEqual(w.state.lining.lining_upper,{glued:[],installed:[]});
 assert.ok(w.undo());assert.ok(w.installRing(1));assert.ok(w.act('bamboo',10000).ok);const before=structuredClone(w.state);
 assert.ok(w.skipStage(10000).ok);assert.ok(validateState(w.state));assert.ok(w.undo());assert.deepEqual(w.state,before);
});
test('skip finishes nonsequential lining without duplicating panels and undoes atomically',()=>{
 const w=new Workflow(advanceTo('lining_upper')),evidence={mode:'paper',panel:4,quality:1,curve:0,oval:0,dose:1,angle:0,distance:1};
 assert.ok(w.glue('lining_upper',4));assert.ok(w.glue('lining_upper',1));assert.ok(w.act('paste',10000,evidence).ok);const before=structuredClone(w.state);
 assert.ok(w.skipStage(10000).ok);assert.equal(currentStage(w.state).id,'paper_cutting');assert.equal(new Set(w.state.lining.lining_upper.installed).size,6);
 assert.deepEqual(w.state.handwork,before.handwork);assert.ok(validateState(w.state));assert.ok(w.undo());assert.deepEqual(w.state,before);
});
test('skip drying fast-forwards the remaining wait but does not press any paper',()=>{
 const w=new Workflow(advanceTo('paper_drying')),before=structuredClone(w.state);assert.ok(w.state.papers.some(p=>p.status==='wet'));
 assert.ok(w.skipStage(10000).ok);assert.equal(currentStage(w.state).id,'petal_pressing');assert.equal(w.state.counts.petal_pressing,0);
 assert.ok([...w.state.papers,...w.state.leaves].every(p=>p.status==='dry'));assert.ok(validateState(w.state));assert.ok(w.undo());assert.deepEqual(w.state,before);
});
test('each installed rib is bound immediately and no batch-binding stage remains',()=>{
 const s=advanceTo('frame_assembly');for(let i=0;i<3;i++)assert.ok(applyRingPlacement(s,i));
 for(let i=1;i<=12;i++){assert.ok(rawAction(s,'bamboo').ok);assert.equal(s.counts.frame_binding,i);assert.equal(s.counts.frame_assembly,i);assert.ok(validateState(s));}
 assert.equal(currentStage(s).id,'frame_short_binding');
});
test('lining rejects unglued, invalid and duplicate panels without consuming paper',()=>{
 const s=advanceTo('lining_upper'),before=JSON.stringify(s);
 for(const evidence of [null,{}, {panel:-1},{panel:6},{panel:1.5},{panel:0}])assert.equal(rawAction(s,'paste',20000,evidence).ok,false);
 assert.equal(JSON.stringify(s),before);assert.equal(applyGlue(s,'lining_lower',0),false);
 assert.ok(applyGlue(s,'lining_upper',4));assert.equal(applyGlue(s,'lining_upper',4),false);
 assert.ok(rawAction(s,'paste',20000,{panel:4}).ok);assert.equal(rawAction(s,'paste',20000,{panel:4}).ok,false);
 assert.equal(s.counts.lining_upper,1);assert.deepEqual(s.lining.lining_upper.installed,[4]);assert.ok(validateState(s));
});
test('glue and paper are separate undoable operations, including nonsequential panels and reload',()=>{
 const w=new Workflow(advanceTo('lining_upper')),evidence=panel=>({mode:'paper',panel,quality:1,curve:0,oval:0,dose:1,angle:0,distance:1});
 assert.ok(w.glue('lining_upper',4));assert.ok(w.glue('lining_upper',1));assert.ok(w.act('paste',20000,evidence(4)).ok);
 assert.ok(w.undo());assert.deepEqual(w.state.lining.lining_upper,{glued:[4,1],installed:[]});
 assert.ok(w.undo());assert.deepEqual(w.state.lining.lining_upper.glued,[4]);assert.ok(w.redo());assert.ok(w.redo());
 assert.ok(w.act('paste',20000,evidence(1)).ok);assert.ok(validateState(w.state));
 const loaded=new Workflow(JSON.parse(JSON.stringify(w.state)));assert.deepEqual(loaded.state,w.state);assert.deepEqual(loaded.state.lining.lining_upper.installed,[4,1]);
});
test('older v2 saves migrate partial ribs, old binding and existing paper without mutation',()=>{
 const partial=advanceTo('frame_assembly');applyAction(partial,'bamboo',20000);
 const assembly=oldSave(partial);assembly.counts.frame_binding=0;
 const binding=oldSave(advanceTo('frame_short_binding'));binding.stage=2;binding.counts.frame_binding=5;
 const red=advanceTo('lining_upper');applyAction(red,'paste',20000);const paper=oldSave(red);
 for(const s of [assembly,binding,paper]){delete s.craftRevision;delete s.lining;const before=JSON.stringify(s);assert.ok(validateState(s));const w=new Workflow(s);assert.ok(validateState(w.state));assert.equal(w.state.counts.frame_binding,w.state.counts.frame_assembly);assert.equal(JSON.stringify(s),before);assert.notEqual(currentStage(w.state).id,'frame_binding');assert.equal(w.state.lining.lining_upper.installed.length,0);}
});
test('corrupt glue and installed-panel records are rejected',()=>{
 for(const corrupt of [s=>s.lining.lining_upper=null,s=>s.lining.lining_upper.glued=[0,0],s=>s.lining.lining_upper.glued=[6],s=>s.lining.lining_upper.glued=[null],s=>s.lining.lining_lower.glued=[0],s=>{s.lining.lining_upper.installed=[0];s.counts.lining_upper=1;}]){const s=advanceTo('lining_upper');corrupt(s);assert.equal(validateState(s),false);}
});
test('contour cutting cannot substitute for shaping; both paper families retain identities',()=>{
 const s=advanceTo('petal_shaping');assert.ok(s.papers.every(p=>p.status==='trimmed'));assert.ok(s.leaves.every(p=>p.status==='trimmed'));
 assert.equal(applyAction(s,'paste',20000).ok,false);assert.equal(s.counts.petal_assembly,0);
 applyAction(s,'string',20000);assert.equal(s.papers.filter(p=>p.status==='formed').length,6);assert.ok(validateState(s));
 const done=makeFinishedState();assert.ok(done.leaves.every(p=>p.status==='installed'));assert.equal(new Set(done.leaves.map(p=>p.id)).size,14);
});
test('drying waits for the last green sheet, including after undo and redo',()=>{
 const s=advanceTo('paper_drying');s.leaves.at(-1).readyAt=19000;assert.ok(updateDrying(s,15000));assert.equal(currentStage(s).id,'paper_drying');assert.equal(applyAction(s,'press',15000).ok,false);
 updateDrying(s,19000);assert.equal(currentStage(s).id,'petal_pressing');assert.ok(validateState(s));
 const w=new Workflow(s);w.act('press',19000);w.undo();assert.ok(w.state.papers.every(p=>p.status==='dry'));w.redo();assert.equal(w.state.papers.filter(p=>p.status==='pressed').length,6);assert.ok(validateState(w.state));
});
test('reject malformed leaves, skipped lining, and shaped paper without shaping work',()=>{
 for(const corrupt of [s=>s.leaves[0]=null,s=>s.counts.lining_upper=0,s=>s.papers[0].status='pressed']){const s=makeFinishedState();corrupt(s);assert.equal(validateState(s),false);}
 const s=advanceTo('petal_shaping');s.papers[0].status='formed';assert.equal(validateState(s),false);
});
test('legacy migration keeps only compatible frame progress and never completes new steps',()=>{
 const old={version:1,stage:10,counts:{bamboo_prep:3,frame_assembly:12,frame_binding:12},papers:PAPER_IDS.map(id=>({id,status:'installed'}))};
 const migrated=migrateLegacyState(old);assert.ok(validateState(migrated));assert.equal(currentStage(migrated).id,'frame_short_binding');assert.equal(migrated.counts.lining_upper,0);assert.ok(migrated.papers.every(p=>p.status==='raw'));assert.equal(old.papers[0].status,'installed');
 const partial={...old,stage:1,counts:{bamboo_prep:3,frame_assembly:5,frame_binding:0}};assert.equal(migrateLegacyState(partial).counts.frame_assembly,5);assert.equal(migrateLegacyState({...old,counts:{...old.counts,frame_binding:99}}),null);
});

const oldStageIds=['bamboo_prep','frame_assembly','frame_binding','frame_inspection','lining_upper','lining_lower','paper_cutting','paper_dye','leaf_dye','paper_drying','petal_pressing','leaf_pressing','vein_inspection','petal_shaping','petal_assembly','calyx_assembly','flower_making','top_flower_assembly','pod_making','pod_assembly','lotus_leaf_assembly','hanging_assembly','connection_inspection','light_installation','final_inspection'];
const retiredTotals={frame_inspection:3,vein_inspection:1,connection_inspection:3};
function oldSave(state){
 const s=structuredClone(state),id=currentStage(state).id;
 delete s.processRevision;delete s.workflowRevision;delete s.paperRevision;delete s.dyeWaste;delete s.counts.frame_short_binding;delete s.counts.petal_cutting;delete s.counts.leaf_cutting;
 delete s.frameItems.shortStrips;delete s.frameItems.shortBinding;
 for(const p of [...s.papers,...s.leaves])if(p.status==='trimmed')p.status='pressed';
 s.stage=oldStageIds.indexOf(id==='frame_short_binding'?'frame_inspection':id==='petal_cutting'?'petal_shaping':id);
 // Historical saves installed red first. Construct that schema, not a current
 // white-first state with only its numeric index changed.
 if(id==='lining_upper'){s.counts.lining_lower=0;s.lining.lining_lower={glued:[],installed:[]};}
 if(id==='lining_lower'){s.counts.lining_upper=6;s.lining.lining_upper={glued:[0,1,2,3,4,5],installed:[0,1,2,3,4,5]};}
 for(const [id,total] of Object.entries(retiredTotals))s.counts[id]=oldStageIds.indexOf(id)<s.stage?total:0;
 return s;
}
test('only final lantern inspection remains and every retired boundary advances directly',()=>{
 assert.deepEqual(STAGES.filter(s=>s.id.includes('inspection')).map(s=>s.id),['final_inspection']);
 for(const [before,after] of [['frame_assembly','frame_short_binding'],['leaf_pressing','petal_cutting'],['hanging_assembly','light_installation']]){
  const w=new Workflow(advanceTo(before)),total=currentStage(w.state).total;
  for(let i=0;i<total;i++){
   if(before==='frame_assembly')for(let ring=0;ring<3;ring++)w.installRing(ring);
   assert.ok(w.act(currentStage(w.state).tool,20000).ok);
  }
  assert.equal(currentStage(w.state).id,after);assert.ok(w.undo());assert.equal(currentStage(w.state).id,before);assert.ok(w.redo());assert.equal(currentStage(w.state).id,after);assert.ok(validateState(w.state));
 }
 const w=new Workflow(advanceTo('final_inspection'));assert.equal(w.state.complete,false);assert.ok(w.act('light',20000).ok);assert.equal(w.state.complete,true);assert.equal(w.state.lit,true);
});
test('old numeric stage indexes migrate at every active step without losing material progress',()=>{
 for(const stage of STAGES.filter(s=>!s.automatic&&!['petal_cutting','leaf_cutting'].includes(s.id))){
  const expected=advanceTo(stage.id==='petal_shaping'?'petal_cutting':stage.id==='lining_upper'?'lining_lower':stage.id),old=oldSave(advanceTo(stage.id)),before=JSON.stringify(old);
  expected.actions=old.actions;assert.ok(validateState(old),stage.id);assert.deepEqual(restoreState(old),expected,stage.id);assert.equal(JSON.stringify(old),before);
 }
 const done=makeFinishedState();assert.deepEqual(restoreState(oldSave(done)),done);
});
test('partial retired inspections skip ahead and discard only retired evidence',()=>{
 const evidence={mode:'inspect',quality:1,curve:0,oval:0,dose:0,angle:0,distance:0};
 for(const [id,next] of [['frame_inspection','frame_short_binding'],['vein_inspection','petal_cutting'],['connection_inspection','light_installation']]){
  for(let count=0;count<retiredTotals[id];count++){
   const expected=advanceTo(next),old=oldSave(expected);old.stage=oldStageIds.indexOf(id);old.counts[id]=count;
   old.handwork={'bamboo_prep:0':{...evidence,mode:'bend'}};
   for(let i=0;i<count;i++)old.handwork[id+':'+i]={...evidence};
   const restored=restoreState(old);assert.ok(restored,id);assert.equal(currentStage(restored).id,next);assert.deepEqual(restored.papers,expected.papers);assert.deepEqual(restored.lining,expected.lining);assert.deepEqual(restored.handwork,{'bamboo_prep:0':{...evidence,mode:'bend'}});assert.equal(id in restored.counts,false);assert.deepEqual(restoreState(restored),restored);
  }
 }
});
test('pre-binding-revision saves migrate using the old stage order before removing inspections',()=>{
 const old=oldSave(advanceTo('frame_short_binding'));delete old.craftRevision;delete old.lining;old.stage=2;old.counts.frame_binding=5;old.counts.frame_inspection=0;
 const restored=restoreState(old);assert.ok(restored);assert.equal(currentStage(restored).id,'frame_short_binding');assert.equal(restored.counts.frame_binding,12);assert.deepEqual(restored.lining.lining_upper,{glued:[],installed:[]});
});
test('migration rejects invalid revision, skipped stages and corrupt retired evidence',()=>{
 const badSaves=[{...createState(),workflowRevision:2},{...oldSave(advanceTo('lining_upper')),stage:999}];
 const skipped=oldSave(advanceTo('petal_shaping'));skipped.counts.leaf_pressing=0;badSaves.push(skipped);
 const retired=oldSave(advanceTo('lining_upper'));retired.counts.frame_inspection=99;badSaves.push(retired);
 const evidence=oldSave(advanceTo('lining_upper'));evidence.handwork={'frame_inspection:0':{mode:'inspect'}};badSaves.push(evidence);
 for(const bad of badSaves){assert.equal(restoreState(bad),null);assert.deepEqual(new Workflow(bad).state,createState());}
});

test('legacy saves migrate short strips and migrate petal shape evidence only',()=>{
 const s=oldSave(advanceTo('frame_short_binding'));
 assert.ok(validateState(s));const restored=restoreState(s);assert.ok(restored);assert.deepEqual(restored.frameItems.shortStrips,[]);assert.equal(currentStage(restored).id,'frame_short_binding');
 const petal=oldSave(advanceTo('top_flower_assembly')),evidence={mode:'shape',quality:.9,curve:.61,oval:0,dose:0,angle:0,distance:1};
 petal.handwork={'petal_shaping:0':{...evidence},'flower_making:0':{...evidence}};
 assert.ok(validateState(petal));const upgraded=restoreState(petal);assert.ok(upgraded);
 assert.deepEqual(upgraded.handwork['petal_shaping:0'],{...evidence,formed:true,edgePinched:true,wireFixed:true});
 assert.deepEqual(upgraded.handwork['flower_making:0'],evidence);assert.deepEqual(restoreState(upgraded),upgraded);
});
