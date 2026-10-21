import test from 'node:test';
import assert from 'node:assert/strict';
import {Handwork,SOURCE,TARGET,completesOnRelease} from '../interaction-model.mjs';
function move(h,a,b){assert.ok(h.down(a));for(let i=1;i<=30;i++)h.move({x:a.x+(b.x-a.x)*i/30,y:a.y+(b.y-a.y)*i/30},.03);}
for(const stage of ['top_flower_assembly','pod_assembly']){
 test(stage+' attaches on release without rotation or second hold',()=>{const h=new Handwork(stage);move(h,SOURCE,{x:TARGET.x+.2,y:TARGET.y});assert.equal(h.ready,false);assert.equal(h.evidence(),null);h.up();assert.equal(h.ready,true);assert.equal(h.placed,true);assert.deepEqual(h.position,TARGET);assert.equal(h.angle,0);assert.ok(h.evidence());});
 test(stage+' rejects distant release and permits retry',()=>{const h=new Handwork(stage);move(h,SOURCE,{x:-.1,y:.2});h.up();assert.equal(h.ready,false);assert.equal(h.placed,false);assert.equal(h.evidence(),null);move(h,h.position,TARGET);h.up();assert.ok(h.evidence());});
 test(stage+' cancel does not attach',()=>{const h=new Handwork(stage);move(h,SOURCE,TARGET);h.cancelGesture();h.up();assert.equal(h.placed,false);assert.equal(h.evidence(),null);});
}
for(const stage of ['flower_making','pod_making'])test(stage+' requires shaped material and released pointer',()=>{const h=new Handwork(stage);assert.ok(completesOnRelease(stage));move(h,h.grip,{x:1.065,y:.55});assert.equal(h.evidence(),null);h.up();assert.ok(h.evidence());});
test('machine press and lighting installation retain their existing interactions',()=>{for(const stage of ['petal_pressing','leaf_pressing','light_installation']){assert.equal(completesOnRelease(stage),false);const h=new Handwork(stage);h.rotate(.4);move(h,SOURCE,TARGET);h.up();assert.equal(h.placed,true);assert.equal(h.ready,false);assert.equal(h.evidence(),null);}});

test('fast flower and seedpod drags still reach the socket',()=>{for(const stage of ['top_flower_assembly','pod_assembly']){const h=new Handwork(stage);assert.ok(h.down(SOURCE));h.move(TARGET,.016);h.up();assert.ok(h.evidence());}});
