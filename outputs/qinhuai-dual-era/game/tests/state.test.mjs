import test from 'node:test';
import assert from 'node:assert/strict';
import {GameState,SAVE_KEY,STATES,normalizeAnswer,isWalkable,resolveMovement} from '../state.mjs';
import {LANTERNS,RIDDLES,LOCATIONS} from '../data.mjs';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};};
test('five real models, unique points and consistent puzzle bindings',()=>{assert.equal(LANTERNS.length,5);assert.equal(new Set(LOCATIONS.map(x=>x.id)).size,5);for(const r of RIDDLES){assert.ok(LANTERNS.some(x=>x.id===r.unlockLanternId));assert.ok(LOCATIONS.some(x=>x.id===r.locationId));assert.ok(r.acceptedAnswers.length);}});
test('wrong and empty answers never unlock; correct answers persist exactly once',()=>{const storage=memory(),s=new GameState(storage);s.openRiddle(RIDDLES[0].id);assert.equal(s.answer('').reason,'empty');assert.equal(s.answer('错误').reason,'incorrect');assert.equal(s.unlocked.size,0);assert.equal(s.answer('　山　').ok,true);assert.equal(s.unlocked.size,1);assert.equal(s.mode,STATES.FEEDBACK);assert.equal(s.answer('山').reason,'inactive');s.close();s.openRiddle(RIDDLES[0].id);assert.equal(s.mode,STATES.FEEDBACK);const reloaded=new GameState(storage);assert.equal(reloaded.unlocked.size,1);assert.equal(reloaded.solved.size,1);});
test('all configured answers work and alternate scripts are accepted',()=>{for(const r of RIDDLES)for(const answer of r.acceptedAnswers){const s=new GameState(memory());s.openRiddle(r.id);assert.ok(s.answer('　'+answer+' ').ok);assert.ok(s.unlocked.has(r.unlockLanternId));}assert.equal(normalizeAnswer(' ＡＢＣ　'),'abc');});
test('panels are mutually exclusive; no answer can be submitted from catalog',()=>{const s=new GameState(memory());s.openRiddle(RIDDLES[2].id);s.openCatalog();assert.equal(s.mode,STATES.CATALOG);assert.equal(s.activeRiddle,null);assert.equal(s.answer('金鱼').reason,'inactive');s.close();assert.equal(s.mode,STATES.EXPLORING);});
test('corrupt, unavailable, outdated and unknown storage is safe',()=>{for(const raw of ['{bad','null','{"version":0,"solved":["riddle-lion"]}','{"version":1,"solved":["unknown"]}']){const s=new GameState({getItem:()=>raw});assert.equal(s.unlocked.size,0);}const s=new GameState({getItem(){throw Error('private');},setItem(){throw Error('full');}});s.openRiddle(RIDDLES[1].id);assert.ok(s.answer('狮子').ok);assert.equal(s.unlocked.size,1);assert.ok(s.storageWarning);});
test('playable ground is bounded, exhibits block only their bodies, no frame tunnelling',()=>{
 assert.ok(isWalkable(-11,-7.1));
 assert.equal(isWalkable(0,8),false);
 assert.equal(isWalkable(0,-100),false);
 assert.equal(isWalkable(-15.2,-.15),false);
 // The open paving in front of the mountain exhibit and the gaps between
 // adjacent exhibits remain available for first-person movement.
 assert.ok(isWalkable(-15.2,-2.35));
 assert.ok(isWalkable(-10.2,-1.1));
 assert.ok(isWalkable(-.8,-1.1));
 const p=resolveMovement({x:-15.2,z:-7},0,100);
 assert.ok(p.z< -1.9);
 assert.ok(isWalkable(p.x,p.z));
 const q=resolveMovement({x:0,z:-8},200,0);
 assert.ok(q.x<18);
 assert.ok(isWalkable(q.x,q.z));
});

test("absent browser storage is explicitly marked session-only",()=>{const s=new GameState(undefined);assert.ok(s.storageWarning);s.openRiddle(RIDDLES[0].id);assert.ok(s.answer("山").ok);assert.equal(s.unlocked.size,1);});
