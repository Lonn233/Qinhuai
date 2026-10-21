import test from 'node:test';
import assert from 'node:assert/strict';
import {BOOK_CHAPTERS} from '../craft-book.js';
import {STAGES} from '../config.mjs';
test('craft book covers every process once, in actual gameplay order',()=>{
 assert.deepEqual(BOOK_CHAPTERS.map(c=>c.id),STAGES.map(c=>c.id));
 for(const [i,c] of BOOK_CHAPTERS.entries()){assert.equal(c.number,i+1);assert.ok(c.materials&&c.location&&c.note,c.id);assert.equal(c.steps.length,3);assert.ok(c.steps.every(s=>s.length>12));}
});
test('craft book explains spatial E actions, time compression and the two cuts',()=>{
 for(const id of ['paper_dye','leaf_dye']){const c=BOOK_CHAPTERS.find(c=>c.id===id),text=c.steps.join('');assert.match(text,/松开鼠标/);assert.match(text,/染盘附近/);assert.match(text,/阴干架附近/);assert.match(text,/废料桶附近/);assert.match(c.note,/20 倍速/);assert.match(c.note,/不是.*统一/);}
 const first=BOOK_CHAPTERS.find(c=>c.id==='paper_cutting');assert.match(first.steps.join(''),/不要裁成花瓣/);
 assert.ok(BOOK_CHAPTERS.find(c=>c.id==='frame_binding').steps.some(s=>s.includes('自动')));
});
