import test from 'node:test';
import assert from 'node:assert/strict';
import {liningOrientation,LINING_TOLERANCE,wrapAngle} from '../lining-orientation.mjs';
test('each of six lining panels must face the viewer before processing',()=>{
 for(let panel=0;panel<6;panel++){
  const rotation=-(panel+.5)*Math.PI/3;
  assert.equal(liningOrientation(panel,rotation).aligned,true);
  assert.equal(liningOrientation(panel,rotation+Math.PI).aligned,false);
  assert.equal(liningOrientation(panel,rotation+Math.PI/3).aligned,false);
 }
});
test('lining angle tolerance includes ±12 degrees but rejects outside',()=>{
 const base=-Math.PI/6;
 for(const sign of [-1,1]){
  assert.equal(liningOrientation(0,base+sign*LINING_TOLERANCE).aligned,true);
  assert.equal(liningOrientation(0,base+sign*(LINING_TOLERANCE+.001)).aligned,false);
 }
});
test('lining orientation accounts for camera azimuth and repeated full turns',()=>{
 for(const camera of [-2.8,0,1.2])for(let turns=-4;turns<=4;turns++){
  const rotation=camera-2.5*Math.PI/3+turns*2*Math.PI;
  assert.equal(liningOrientation(2,rotation,camera).aligned,true);
 }
 assert.ok(Math.abs(wrapAngle(2*Math.PI+.2)-.2)<1e-9);
});
