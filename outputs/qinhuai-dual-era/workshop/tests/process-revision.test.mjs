import test from 'node:test';
import assert from 'node:assert/strict';
import {Workflow,currentStage,restoreState,validateState,cloneState} from '../workflow.mjs';

function at(id){const w=new Workflow();while(currentStage(w.state).id!==id)assert.ok(w.skipStage().ok);return w;}
test('each short strip is consumed once and survives save, undo and redo',()=>{
 const w=at('frame_short_binding');
 for(const [i,strip] of [18,16,17].entries()){
  assert.ok(w.act('string',Date.now(),{mode:'place',quality:1,strip}).ok);
  assert.equal(w.state.frameItems.shortBinding,i+1);
  assert.deepEqual(restoreState(cloneState(w.state)),w.state);
  const done=cloneState(w.state);assert.ok(w.undo());assert.equal(w.state.counts.frame_short_binding,i);assert.ok(w.redo());assert.deepEqual(w.state,done);
  if(i<2){const before=cloneState(w.state);assert.equal(w.act('string',Date.now(),{strip}).ok,false);assert.deepEqual(w.state,before);}
 }
 assert.equal(currentStage(w.state).id,'lining_lower');
 assert.ok(w.skipStage().ok);assert.equal(currentStage(w.state).id,'lining_upper');
});
test('corrupt explicit short-strip records and future process revisions are rejected',()=>{
 const w=at('frame_short_binding');assert.ok(w.act('string',Date.now(),{mode:'place',quality:1,strip:16}).ok);
 for(const corrupt of [s=>s.frameItems.shortStrips=[16,16],s=>s.frameItems.shortStrips=[19],s=>s.frameItems.shortBinding=0,s=>s.processRevision=2]){
  const s=cloneState(w.state);corrupt(s);assert.equal(validateState(s),false);assert.equal(restoreState(s),null);
 }
});
test('handwork evidence cannot claim a future unfinished petal',()=>{
 const s=at('petal_shaping').state;
 s.handwork={'petal_shaping:0':{mode:'shape',quality:1,formed:true,edgePinched:true,wireFixed:true}};
 assert.equal(restoreState(s),null);
});
