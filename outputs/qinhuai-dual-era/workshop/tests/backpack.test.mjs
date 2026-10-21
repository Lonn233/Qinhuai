import test from 'node:test';
import assert from 'node:assert/strict';
import {Workflow,backpackInventory,dyedPaperStock,currentStage,restoreState,makeFinishedState} from '../workflow.mjs';
const stock=w=>backpackInventory(w.state);
function advance(w,id){while(currentStage(w.state).id!==id)assert.ok(w.skipStage().ok);}
test('backpack rings are produced individually and consumed at installation; undo/redo restores stock',()=>{
 const w=new Workflow();assert.deepEqual(Object.values(stock(w)),[0,0,0,0,0]);
 w.act('bamboo');assert.deepEqual(Object.values(stock(w)),[1,0,0,0,0]);
 w.skipStage();assert.deepEqual(Object.values(stock(w)),[1,1,1,0,0]);
 w.installRing(0);assert.equal(stock(w).largeRing,0);w.undo();assert.equal(stock(w).largeRing,1);w.redo();assert.equal(stock(w).largeRing,0);
 assert.deepEqual(backpackInventory(restoreState(JSON.parse(JSON.stringify(w.state)))),stock(w));
});
test('paper inventory transfers between cut and dyed stock without duplication',()=>{
 const w=new Workflow();advance(w,'paper_cutting');w.skipStage();assert.equal(stock(w).cutPaper,50);
 w.act(currentStage(w.state).tool);assert.equal(stock(w).cutPaper,44);assert.equal(stock(w).dyedPaper,1);
 advance(w,'petal_cutting');assert.equal(stock(w).cutPaper,0);assert.equal(stock(w).dyedPaper,8);
 w.act(currentStage(w.state).tool);assert.equal(stock(w).cutPaper,6);assert.equal(stock(w).dyedPaper,7);
 advance(w,'petal_assembly');assert.equal(stock(w).cutPaper,50);w.act(currentStage(w.state).tool);assert.equal(stock(w).cutPaper,49);
 assert.deepEqual(Object.values(backpackInventory(makeFinishedState())),[0,0,0,0,0]);
});

test('dyed stock follows visible pink/green batches through discard, drying, pressing and restore',()=>{
 const w=new Workflow();advance(w,'paper_dye');assert.equal(stock(w).dyedPaper,0);
 w.discardDye();assert.equal(stock(w).dyedPaper,0);
 w.act(currentStage(w.state).tool);assert.deepEqual(dyedPaperStock(w.state),{pink:1,green:0});
 w.undo();assert.equal(stock(w).dyedPaper,0);w.redo();assert.equal(stock(w).dyedPaper,1);
 advance(w,'leaf_dye');assert.equal(stock(w).dyedPaper,6);
 w.act(currentStage(w.state).tool);assert.deepEqual(dyedPaperStock(w.state),{pink:6,green:1});
 advance(w,'petal_pressing');assert.equal(stock(w).dyedPaper,8);
 w.act(currentStage(w.state).tool);assert.equal(stock(w).dyedPaper,8);
 advance(w,'petal_cutting');assert.equal(stock(w).dyedPaper,8);
 assert.equal(backpackInventory(restoreState(JSON.parse(JSON.stringify(w.state)))).dyedPaper,8);
 advance(w,'leaf_cutting');assert.deepEqual(dyedPaperStock(w.state),{pink:0,green:2});
 w.act(currentStage(w.state).tool);assert.equal(stock(w).dyedPaper,1);
 w.act(currentStage(w.state).tool);assert.equal(stock(w).dyedPaper,0);
});
