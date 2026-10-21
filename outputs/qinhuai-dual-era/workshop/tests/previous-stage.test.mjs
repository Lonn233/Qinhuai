import test from 'node:test';
import assert from 'node:assert/strict';
import {Workflow,currentStage,validateState,cloneState,updateDrying,backpackInventory} from '../workflow.mjs';
import {STAGES,CONFIG} from '../config.mjs';
const now=100000;
const visible=STAGES.filter(s=>!s.automatic);
function at(id){const w=new Workflow();while(currentStage(w.state).id!==id)assert.ok(w.skipStage(now).ok);return w;}
for(let i=1;i<visible.length;i++)test(`previous stage survives reload and can advance again: ${visible[i].id}`,()=>{
 const w=new Workflow(at(visible[i].id).state),before=cloneState(w.state);
 assert.equal(w.history.length,0);assert.ok(w.previousStage(now).ok);
 assert.equal(currentStage(w.state).id,visible[i-1].id);assert.equal(w.state.counts[visible[i-1].id],0);
 assert.ok(validateState(w.state));assert.deepEqual(new Workflow(w.state).state,w.state);
 const backed=cloneState(w.state);assert.ok(w.undo());assert.deepEqual(w.state,before);assert.ok(w.redo());assert.deepEqual(w.state,backed);
 assert.ok(w.skipStage(now).ok);assert.equal(currentStage(w.state).id,visible[i].id);assert.ok(validateState(w.state));
});
test('first stage has no previous stage and leaves history untouched',()=>{const w=new Workflow(),before=cloneState(w.state);assert.equal(w.previousStage(now).ok,false);assert.deepEqual(w.state,before);assert.equal(w.history.length,0);});
test('partial work is cleared and materials restored, including drying timer',()=>{
 const w=at('petal_pressing');assert.ok(w.act('press',now).ok);assert.ok(w.previousStage(now).ok);
 assert.equal(currentStage(w.state).id,'paper_drying');assert.equal(w.state.counts.petal_pressing,0);
 assert.ok([...w.state.papers,...w.state.leaves].every(p=>p.status==='wet'&&p.readyAt===now+CONFIG.dryDuration));
 updateDrying(w.state,now+CONFIG.dryDuration-1);assert.equal(currentStage(w.state).id,'paper_drying');
 updateDrying(w.state,now+CONFIG.dryDuration);assert.equal(currentStage(w.state).id,'petal_pressing');assert.ok(validateState(w.state));
});
test('ring identity, strip choice and dye appearance survive earlier completed stages',()=>{
 const w=new Workflow();for(const [ringType,strip] of [[2,8],[0,6],[1,4]])assert.ok(w.act('bamboo',now,{mode:'bend',quality:1,curve:1,oval:0,dose:0,angle:0,distance:0,ringType,strip}).ok);
 while(currentStage(w.state).id!=='petal_cutting')assert.ok(w.skipStage(now).ok);
 w.state.papers.forEach(p=>{p.dyeDose=.61;p.dyeDepth=.73;});assert.ok(w.previousStage(now).ok);
 assert.deepEqual(w.state.frameItems.madeRings,[2,0,1]);assert.deepEqual(w.state.frameItems.usedStrips,[8,6,4]);
 assert.equal(w.state.handwork['bamboo_prep:0'].ringType,2);assert.ok(w.state.papers.every(p=>p.dyeDose===.61&&p.dyeDepth===.73));assert.ok(validateState(w.state));
});
test('returning to assembly restores rings and removes attached frame; returning again clears rings',()=>{
 const w=at('lining_upper');
 for(const id of ['lining_lower','frame_short_binding','frame_assembly']){assert.ok(w.previousStage(now).ok);assert.equal(currentStage(w.state).id,id);}
 assert.deepEqual(w.state.frameItems.placedRings,[]);assert.equal(w.state.counts.frame_binding,0);
 assert.deepEqual(backpackInventory(w.state),{largeRing:1,mouthRing:1,waistRing:1,cutPaper:0,dyedPaper:0});
 assert.ok(w.previousStage(now).ok);assert.equal(currentStage(w.state).id,'bamboo_prep');assert.deepEqual(w.state.frameItems.usedStrips,[]);
});
test('finished lantern returns to final inspection and can finish again',()=>{
 const w=at('final_inspection');assert.ok(w.skipStage(now).ok);assert.ok(w.state.complete);assert.ok(w.previousStage(now).ok);
 assert.equal(currentStage(w.state).id,'final_inspection');assert.equal(w.state.complete,false);assert.equal(w.state.lit,false);assert.ok(validateState(w.state));
 assert.ok(w.skipStage(now).ok);assert.ok(w.state.complete);
});
