import test from 'node:test';
import assert from 'node:assert/strict';
import {CutProcess,DyeProcess,PressProcess,PAPER_STAGES} from '../paper-process.mjs';
import {Workflow,currentStage,validateState,restoreState} from '../workflow.mjs';
import {STAGES} from '../config.mjs';
const toStage=id=>{const w=new Workflow();while(currentStage(w.state).id!==id)assert.ok(w.skipStage(10000).ok);return w;};
test('paper sequence separates first square cut and post-press silhouette cuts',()=>{
 const ids=STAGES.map(s=>s.id);assert.deepEqual(ids.filter(id=>PAPER_STAGES.includes(id)||id==='paper_drying'),['paper_cutting','paper_dye','leaf_dye','paper_drying','petal_pressing','leaf_pressing','petal_cutting','leaf_cutting']);
 const w=toStage('petal_cutting');assert.ok(w.state.papers.every(p=>p.status==='pressed'));assert.ok(w.state.leaves.every(p=>p.status==='pressed'));assert.equal(w.act('string').ok,false);assert.ok(w.act('dye').ok);assert.equal(w.state.papers.filter(p=>p.status==='trimmed').length,6);assert.ok(validateState(w.state));
});
for(const kind of ['square','petal','leaf'])test(kind+' cutting pauses off path and resumes from the last checkpoint without resetting',()=>{
 const p=new CutProcess(kind);assert.equal(p.down({x:2,y:2}),false);assert.ok(p.down(p.points[0]));for(const q of p.points.slice(1,12))p.move(q);const next=p.next;
 p.move({x:2,y:2});assert.equal(p.failed,false);assert.equal(p.next,next);p.up();assert.equal(p.next,next);assert.ok(p.down(p.points[next]));for(const q of p.points.slice(next))p.move(q);p.up();assert.ok(p.ready);assert.equal(p.failed,false);
});
for(const kind of ['square','petal','leaf'])test(kind+' can be cut with individual left clicks, without any drag',()=>{
 const p=new CutProcess(kind);let clicks=0;while(!p.ready&&clicks++<100){assert.ok(p.down(p.points[p.next]));p.up();}assert.ok(p.ready);assert.ok(clicks>8);
});
test('dye requires explicit start/lift, pointer release never changes phase, simulated timing gates hanging',()=>{
 const p=new DyeProcess();assert.equal(p.ready,false);p.take();p.release();assert.equal(p.phase,'held');p.tick(.05);assert.equal(p.seconds,0);
 assert.ok(p.immerse(.8));assert.equal(p.immerse(.8),false);for(let i=0;i<64;i++)p.tick(.05);assert.ok(p.simulatedSeconds>=60);p.release();assert.equal(p.phase,'dipping');assert.equal(p.ready,false);
 assert.ok(p.liftOut());for(let i=0;i<22;i++)p.tick(.05);assert.equal(p.phase,'review');assert.ok(p.ready);const seconds=p.seconds;p.tick(.05);assert.equal(p.seconds,seconds);
 assert.ok(p.immerse(.8));for(let i=0;i<65;i++)p.tick(.05);p.liftOut();for(let i=0;i<22;i++)p.tick(.05);assert.equal(p.ready,false);p.reset();assert.ok(p.take());assert.equal(p.dose,0);assert.equal(p.seconds,0);
});
test('short immersion can be continued without resetting its timer or gradient',()=>{const p=new DyeProcess();p.take();p.immerse();for(let i=0;i<20;i++)p.tick(.05);p.liftOut();for(let i=0;i<22;i++)p.tick(.05);assert.equal(p.ready,false);const dose=p.dose;assert.ok(p.immerse());assert.equal(p.dose,dose);for(let i=0;i<45;i++)p.tick(.05);p.liftOut();for(let i=0;i<22;i++)p.tick(.05);assert.ok(p.ready);});
test('roller runs full cycle, rejects repeated starts and stops automatically',()=>{
 const p=new PressProcess();p.tick(1);assert.equal(p.progress,0);assert.ok(p.start());assert.equal(p.start(),false);for(let i=0;i<100;i++)p.tick(.05);assert.equal(p.phase,'running');for(let i=0;i<12;i++)p.tick(.05);assert.equal(p.phase,'done');assert.equal(p.progress,1);const r=p.rotation;p.tick(.05);assert.equal(p.rotation,r);
});
test('discard is undoable and does not consume a successful batch; dye profile persists through drying/press/cut',()=>{
 const w=toStage('paper_dye'),before=structuredClone(w.state);assert.ok(w.discardDye());assert.equal(w.state.dyeWaste,1);assert.equal(w.state.counts.paper_dye,0);assert.ok(w.undo());assert.deepEqual(w.state,before);assert.ok(w.redo());
 assert.ok(w.act('dye',10000,{mode:'dye',quality:1,dose:.72,depth:.64,curve:0,oval:0,angle:0,distance:1}).ok);
 while(currentStage(w.state).id!=='petal_cutting')assert.ok(w.skipStage(10000).ok);
 assert.ok(w.act('dye').ok);assert.equal(w.state.papers[0].dyeDose,.72);assert.equal(w.state.papers[0].dyeDepth,.64);assert.deepEqual(restoreState(w.state),w.state);assert.equal(w.discardDye(),false);
});
test('pre-paper-revision saves at shaping reopen on contour cutting, late saves preserve work',()=>{
 for(const id of ['petal_shaping','petal_assembly','final_inspection']){
  const w=toStage(id),s=structuredClone(w.state);delete s.paperRevision;delete s.dyeWaste;delete s.counts.petal_cutting;delete s.counts.leaf_cutting;s.stage=STAGES.filter(s=>!['petal_cutting','leaf_cutting'].includes(s.id)).findIndex(s=>s.id===id);for(const p of [...s.papers,...s.leaves])if(p.status==='trimmed')p.status='pressed';
  assert.ok(validateState(s));const restored=restoreState(s);assert.ok(restored);assert.equal(currentStage(restored).id,id==='petal_shaping'?'petal_cutting':id);assert.equal(restored.counts.petal_cutting,id==='petal_shaping'?0:6);assert.equal(restored.actions,s.actions);
 }
});
for(const kind of ['square','petal','leaf']){
 test(kind+' cutting accepts a 0.07 offset from the outline',()=>{
  const p=new CutProcess(kind),offset=q=>({x:q.x+.07,y:q.y});
  assert.ok(p.down(offset(p.points[0])));
  for(const q of p.points.slice(1))p.move(offset(q));p.up();assert.ok(p.ready);assert.equal(p.failed,false);
 });
 test(kind+' cutting tolerates sparse mouse events along the contour',()=>{
  const p=new CutProcess(kind);p.down(p.points[0]);
  for(let i=3;i<p.points.length;i+=3)p.move(p.points[i]);p.move(p.points.at(-1));p.up();assert.ok(p.ready);assert.equal(p.failed,false);
 });
 test(kind+' cutting still rejects a shortcut through the middle',()=>{
  const p=new CutProcess(kind);p.down(p.points[0]);for(const q of p.points.slice(1,9))p.move(q);const n=p.next;p.move({x:0,y:0});assert.equal(p.failed,false);assert.equal(p.next,n);assert.equal(p.ready,false);
 });
}
test('larger cutting start handle accepts an imprecise grab',()=>{const p=new CutProcess('square');assert.ok(p.down({x:p.points[0].x-.10,y:p.points[0].y}));p.move(p.points[0]);for(const q of p.points.slice(1))p.move(q);p.up();assert.ok(p.ready);});
