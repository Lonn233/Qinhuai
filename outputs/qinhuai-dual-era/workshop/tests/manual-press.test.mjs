import test from 'node:test';
import assert from 'node:assert/strict';
import {ManualPressProcess} from '../manual-press-process.mjs';
const tick=(p,n=30)=>{for(let i=0;i<n;i++)p.tick(.05);};
test('manual pressing gates all eight steps and commits only once',()=>{
 const p=new ManualPressProcess();assert.equal(p.extract(),false);assert.equal(p.hammer(),false);assert.equal(p.stand(),false);
 assert.ok(p.place());assert.equal(p.place(),false);tick(p);assert.equal(p.phase,'loaded');assert.equal(p.wind(1),false);assert.equal(p.winding,0);tick(p);assert.equal(p.phase,'loaded');assert.ok(p.fit());assert.equal(p.fit(),false);assert.equal(p.wind(1),false);tick(p,10);assert.equal(p.phase,'fitting');assert.ok(p.adherence>0&&p.adherence<1);assert.equal(p.wind(1),false);assert.equal(p.winding,0);tick(p);assert.equal(p.adherence,1);assert.equal(p.phase,'winding');
 assert.equal(p.wind(NaN),false);assert.equal(p.wind(-1),false);p.wind(.4);tick(p);assert.equal(p.winding,.4);assert.equal(p.stand(),false);p.wind(.6);assert.equal(p.phase,'wrapped');
 assert.ok(p.stand());assert.equal(p.hammer(),false);tick(p);assert.equal(p.phase,'hammering');
 for(let i=0;i<8;i++){assert.ok(p.hammer());assert.equal(p.hammer(),false);tick(p);assert.equal(p.hits,i+1);}
 assert.equal(p.phase,'compressed');assert.equal(p.extract(),false);assert.equal(p.unthread(),false);assert.equal(p.removePaper(),false);assert.ok(p.restore());assert.equal(p.unthread(),false);tick(p);assert.equal(p.phase,'restored');assert.equal(p.removePaper(),false);assert.ok(p.unthread());tick(p);assert.equal(p.phase,'unthreaded');assert.ok(p.removePaper());assert.equal(p.extract(),false);tick(p);assert.equal(p.phase,'done');assert.equal(p.progress,1);assert.ok(p.extract());assert.equal(p.extract(),false);
});
test('new manual round resets wrapping, compression and phase',()=>{
 const old=new ManualPressProcess();old.place();tick(old);old.fit();tick(old);old.wind(.6);
 const fresh=new ManualPressProcess();assert.equal(fresh.phase,'idle');assert.equal(fresh.winding,0);assert.equal(fresh.adherence,0);assert.equal(fresh.compression,0);assert.equal(fresh.hits,0);assert.equal(old.winding,.6);
});
