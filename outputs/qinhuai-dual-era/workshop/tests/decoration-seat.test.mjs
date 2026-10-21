import test from 'node:test';
import assert from 'node:assert/strict';
import {attachmentOrientation,DECORATION_STAGES,isSeatedAssembly,LINING_TOLERANCE,liningOrientation} from '../lining-orientation.mjs';
test('only lining, petal, calyx and lotus-leaf placement share the seated workbench',()=>{
 for(const id of ['lining_upper','lining_lower',...DECORATION_STAGES])assert.equal(isSeatedAssembly(id),true);
 for(const id of ['bamboo_prep','frame_assembly','petal_shaping','petal_pressing','top_flower_assembly',undefined])assert.equal(isSeatedAssembly(id),false);
});
test('all three staggered petal layers and twelve calyx leaves require the same ±12 degree facing gate',()=>{
 for(let layer=0;layer<3;layer++)for(let i=0;i<12;i++){
 const azimuth=i*Math.PI/6+(layer%2)*Math.PI/12;
 for(const camera of [-2.8,0,1.2])for(const turns of [-3,0,3]){
 const rotation=camera-azimuth+turns*Math.PI*2;
 assert.ok(attachmentOrientation(azimuth,rotation,camera).aligned);
 for(const sign of [-1,1]){
 assert.ok(attachmentOrientation(azimuth,rotation+sign*LINING_TOLERANCE,camera).aligned);
 assert.equal(attachmentOrientation(azimuth,rotation+sign*(LINING_TOLERANCE+.001),camera).aligned,false);
 }
 }
 }
});
test('lining facing math remains identical to shared attachment gate',()=>{
 for(let i=0;i<6;i++)for(const rotation of [-4,0,3.5])assert.deepEqual(liningOrientation(i,rotation),attachmentOrientation((i+.5)*Math.PI/3,rotation));
});
