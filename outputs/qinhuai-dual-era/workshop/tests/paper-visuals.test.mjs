import test from 'node:test';
import assert from 'node:assert/strict';
import {makePaper,colorPaper,makePress} from '../paper-visuals.js';
test('bath and rack use the identical dye gradient with a nearly white top and darker bottom',()=>{
 for(const leaf of [false,true]){
  const profile={leaf,dose:.8,depth:.72},sheet=makePaper(profile),rack=makePaper(profile),raw=makePaper({dose:0});
  assert.deepEqual(sheet.geometry.attributes.color.array,rack.geometry.attributes.color.array);
  const uv=sheet.geometry.attributes.uv,c=sheet.geometry.attributes.color,r=raw.geometry.attributes.color;let top=-1,bottom=-1;
  for(let i=0;i<uv.count;i++){if(uv.getY(i)===1)top=i;if(uv.getY(i)===0)bottom=i;}
  assert.ok(top>=0&&bottom>=0);assert.equal(c.getX(top),r.getX(top));assert.ok(c.getY(bottom)<c.getY(top)*.7);assert.ok(c.getX(bottom)+c.getY(bottom)+c.getZ(bottom)<c.getX(top)+c.getY(top)+c.getZ(top));
  colorPaper(rack.geometry,profile);assert.deepEqual(sheet.geometry.attributes.color.array,rack.geometry.attributes.color.array);
  for(const p of [sheet,rack,raw]){p.geometry.dispose();p.material.dispose();}
 }
});
test('press winding begins empty, winds with rotating rollers and removes loose supply at the end',()=>{
 const p=makePress();assert.equal(p.winding.geometry.drawRange.count,0);p.update(.5,Math.PI);assert.equal(p.winding.geometry.drawRange.count,300);assert.equal(p.rollers[0].rotation.x,Math.PI);assert.equal(p.winding.rotation.x,-Math.PI);assert.ok(p.supply.visible);p.update(1,Math.PI*12);assert.equal(p.winding.geometry.drawRange.count,601);assert.equal(p.supply.visible,false);
});
