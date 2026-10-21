import test from 'node:test';
import assert from 'node:assert/strict';
import defaults from '../lion-study/defaults.cjs';
import {arrangeExhibits,walkStep,EYE_HEIGHT,WALK_RADIUS} from '../lion-study/walk-layout.mjs';
const {DEFAULT_LIGHTS,defaultTuning}=defaults;
const presets=[...new Set(Object.values(DEFAULT_LIGHTS).map(p=>p.base))].map(name=>({name}));
const models=[{id:'mountain',size:{x:13,z:11.93,y:9.87}},{id:'lion',size:{x:1.78,z:2.5,y:2.03}},{id:'fish',size:{x:.627,z:.8,y:.337}},{id:'crane',size:{x:.271,z:.271,y:.5}},{id:'lotus',size:{x:.6,z:.573,y:.248}}];
test('The five defaults are the user saved colour schemes, not generic presets',()=>{
 assert.deepEqual(Object.fromEntries(Object.entries(DEFAULT_LIGHTS).map(([id,p])=>[id,[p.power,p.color]])),{lion:[.71,'#fffaf2'],mountain:[1.12,'#fffbf5'],fish:[.53,'#fffcf6'],crane:[1.12,'#fffbf5'],lotus:[1.35,'#fffdf8']});
 for(const id of Object.keys(DEFAULT_LIGHTS)){const a=defaultTuning(id,presets),b=defaultTuning(id,presets);assert.equal(presets[a.index].name,DEFAULT_LIGHTS[id].base);assert.equal(a.custom,true);a.power=0;assert.notEqual(a.power,b.power);}
 assert.equal(defaultTuning('mountain',presets).sizeMeters,13);assert.throws(()=>defaultTuning('bad',presets));
});
test('Five exhibits have separate footprints and human scale plinths',()=>{
 const l=arrangeExhibits(models);assert.equal(l.stations.length,5);assert.equal(EYE_HEIGHT,1.65);
 for(let i=0;i<l.colliders.length;i++)for(let j=i+1;j<l.colliders.length;j++){
  const a=l.colliders[i],b=l.colliders[j];assert.ok(a.maxX+WALK_RADIUS<b.minX||b.maxX+WALK_RADIUS<a.minX||a.maxZ+WALK_RADIUS<b.minZ||b.maxZ+WALK_RADIUS<a.minZ);
 }
 assert.equal(l.stations.find(s=>s.id==='mountain').lift,0);assert.equal(l.stations.find(s=>s.id==='crane').lift,1);
});
test('Movement cannot tunnel through plinths and stays inside the promenade',()=>{
 const b={minX:-10,maxX:10,minZ:-10,maxZ:10},obstacles=[{minX:-1,maxX:1,minZ:-1,maxZ:1}];
 let p=walkStep({x:0,z:-5},0,100,b,obstacles);assert.ok(p.z<=-1-WALK_RADIUS);assert.equal(p.x,0);
 p=walkStep({x:5,z:0},100,100,b,obstacles);assert.equal(p.x,10-WALK_RADIUS);assert.equal(p.z,10-WALK_RADIUS);
 p=walkStep({x:0,z:-1.3},3,3,b,obstacles);assert.ok(p.x>2.9);assert.ok(p.z<2);
});
test('Largest allowed models retain a clear route and fit within the site',()=>{
 const large=models.map(m=>({...m,size:Object.fromEntries(Object.entries(m.size).map(([k,v])=>[k,v*(m.id==='mountain'?30/13:3)]))}));
 const l=arrangeExhibits(large);for(const box of l.colliders){assert.ok(box.minX>l.bounds.minX);assert.ok(box.maxX<l.bounds.maxX);assert.ok(box.minZ>l.bounds.minZ);assert.ok(box.maxZ<l.bounds.maxZ);}
});
