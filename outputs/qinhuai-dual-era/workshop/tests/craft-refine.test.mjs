import test from 'node:test';
import assert from 'node:assert/strict';
import {ManualPressProcess} from '../manual-press-process.mjs';
import {makeManualPress} from '../manual-press-visuals.js';
import {makePaper,addVeins} from '../paper-visuals.js';
import {makeScissors} from '../scissors.js';
const tick=(p,v,n=30)=>{for(let i=0;i<n;i++){p.tick(.05);v.update(p);}};
test('manual mold restores vertically as one piece, removes thread, then extracts square paper',()=>{
 const p=new ManualPressProcess(),v=makeManualPress({dose:.8});v.update(p);p.place();tick(p,v);p.fit();tick(p,v);p.wind(1);p.stand();tick(p,v);
 for(let i=0;i<8;i++){p.hammer();tick(p,v);}const rig=v.root.getObjectByName('manual-mold'),x=rig.children.map(c=>c.position.x);assert.ok(rig.scale.y<.8);
 p.restore();tick(p,v);assert.equal(rig.scale.y,1);assert.deepEqual(rig.children.map(c=>c.position.x),x);assert.ok(v.root.getObjectByName('manual-cotton-winding').geometry.drawRange.count>0);
 p.unthread();tick(p,v);assert.equal(v.root.getObjectByName('manual-cotton-winding').geometry.drawRange.count,0);assert.notEqual(p.phase,'done');
 p.removePaper();tick(p,v);assert.equal(p.phase,'done');assert.equal(v.paper.geometry.type,'PlaneGeometry');assert.ok(v.paper.getObjectByName('square-embossed-veins').visible);assert.deepEqual(rig.children.map(c=>c.position.x),x);
});
test('pressed square veins run across paper without converging into a petal silhouette',()=>{
 const p=makePaper(),v=addVeins(p,false,true);for(const line of v.children){const a=line.geometry.attributes.position;assert.ok(a.getY(0)<-.34);assert.ok(a.getY(a.count-1)>.34);assert.ok(Math.abs(a.getX(0)-a.getX(a.count-1))<.001);}assert.ok(v.children[0].geometry.attributes.position.getX(0)<-.2);
});
test('scissors have paired articulated blades, finger loops and a pivot',()=>{
 const s=makeScissors();assert.equal(s.name,'craft-scissors');const blades=[];s.traverse(o=>{if(o.geometry?.type==='ExtrudeGeometry')blades.push(o);});assert.equal(blades.length,2);s.userData.setOpening(0);const a=blades[0].parent.rotation.z;s.userData.setOpening(1);assert.notEqual(blades[0].parent.rotation.z,a);
});
