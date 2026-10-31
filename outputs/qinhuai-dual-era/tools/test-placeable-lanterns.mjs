import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {PLACED_LANTERN_KEY,PLACEABLE_LANTERNS,MAX_PLACED_LANTERNS,normalizePlacedLanterns,readPlacedLanterns,savePlacedLanterns,migratePlacedLanternLighting} from '../import-placeable-lantern-settings.mjs';
import {LANTERN_LIGHT_KEY,readLanternRecord,saveLantern} from '../import-lantern-settings.mjs';
import {SCENE_KEYS} from '../main-scene-persistence.mjs';
const require=createRequire(import.meta.url),{KEYS,createSceneStore}=require('../game/main-scene-store.cjs');
const item=(id='one',kind='column',extra={})=>({id,kind,...extra});
test('invalid saved data is inert; normalization bounds numbers and rejects duplicate/unknown types',()=>{
 assert.deepEqual(normalizePlacedLanterns(null),{version:1,instances:[]});
 assert.deepEqual(normalizePlacedLanterns({version:2,instances:[item()]}).instances,[]);
 const result=normalizePlacedLanterns({version:1,instances:[item('one','column',{x:Infinity,y:-20000,rx:40000,scale:0}),item('one'),item('two','bad'),null,item('three','pink',{z:'1'})]}).instances;
 assert.equal(result.length,2);assert.equal(result[0].x,0);assert.equal(result[0].y,-10000);assert.equal(result[0].rx,36000);assert.equal(result[0].scale,.05);assert.equal(result[1].z,0);assert.equal(result[1].scale,1);
 assert.equal(normalizePlacedLanterns({version:1,instances:Array.from({length:600},(_,i)=>item(String(i)))}).instances.length,MAX_PLACED_LANTERNS);
});
test('read is non-destructive and placements use their own save key',()=>{
 const values=new Map([['existing-light-preset','untouched']]);let writes=0;
 const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>{writes++;values.set(k,v);}};
 assert.equal(readPlacedLanterns(storage).instances.length,0);assert.equal(writes,0);
 const record={version:1,instances:[item('one','drum',{x:3,ry:90})]};assert.equal(savePlacedLanterns(storage,record),true);
 assert.deepEqual(readPlacedLanterns(storage),normalizePlacedLanterns(record));assert.equal(values.get('existing-light-preset'),'untouched');
 values.set(PLACED_LANTERN_KEY,'bad');assert.equal(readPlacedLanterns(storage).instances.length,0);assert.equal(values.get(PLACED_LANTERN_KEY),'bad');
 assert.equal(savePlacedLanterns({setItem(){throw Error('quota');}},record),false);
});
test('new placements omit lighting; explicit legacy values remain readable and bounded',()=>{
 const shared={enabled:false,brightness:99,inheritColor:false,color:'#FF0099',spill:{enabled:true,intensity:-1,distance:Infinity,color:'bad'}};
 const result=normalizePlacedLanterns({version:1,instances:[item('old'),item('a','pink',{lighting:shared}),item('b','pink',{lighting:shared})]}).instances;
 assert.equal(result[0].lighting,undefined);
 assert.equal(result[1].lighting.enabled,false);assert.equal(result[1].lighting.brightness,8);assert.equal(result[1].lighting.color,'#ff0099');
 assert.equal(result[1].lighting.spill.intensity,0);assert.equal(result[1].lighting.spill.distance,4);assert.equal(result[1].lighting.spill.color,'#ffcf87');
 result[1].lighting.spill.distance=9;assert.equal(result[2].lighting.spill.distance,4);assert.equal(shared.spill.distance,Infinity);
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 savePlacedLanterns(storage,{version:1,instances:result});assert.deepEqual(readPlacedLanterns(storage).instances,result);
});
test('legacy lighting migrates per kind once without overwriting shared settings or placements',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 migratePlacedLanternLighting(storage);assert.equal(values.has(LANTERN_LIGHT_KEY),false);
 savePlacedLanterns(storage,{version:1,instances:[item('a','pink',{lighting:{brightness:2}}),item('b','pink',{lighting:{brightness:3}}),item('c','column',{lighting:{brightness:.2}}),item('d','drum')]});
 saveLantern(storage,'column',{brightness:1.5});const before=values.get(PLACED_LANTERN_KEY);
 const result=migratePlacedLanternLighting(storage);assert.equal(result.groups.pink.brightness,2);assert.equal(result.groups.column.brightness,1.5);assert.equal(result.groups.drum,undefined);
 assert.equal(values.get(PLACED_LANTERN_KEY),before);const shared=values.get(LANTERN_LIGHT_KEY);migratePlacedLanternLighting(storage);assert.equal(values.get(LANTERN_LIGHT_KEY),shared);
 assert.deepEqual(readLanternRecord(storage).groups,result.groups);
});
test('client and disk store allow the placement key and round trip all transforms',async()=>{
 assert.ok(SCENE_KEYS.includes(PLACED_LANTERN_KEY));assert.ok(KEYS.has(PLACED_LANTERN_KEY));
 const {mkdtemp}=await import('node:fs/promises'),os=await import('node:os'),path=await import('node:path');
 const dir=await mkdtemp(path.join(os.tmpdir(),'qinhuai-placed-unit-')),store=createSceneStore(dir);
 const raw=JSON.stringify(normalizePlacedLanterns({version:1,instances:[item('one','rack',{x:1,y:2,z:3,rx:10,ry:20,rz:30,scale:2})]}));
 await store.patch([{key:PLACED_LANTERN_KEY,before:null,after:raw}]);assert.equal((await createSceneStore(dir).read()).entries[PLACED_LANTERN_KEY],raw);
});
test('all catalog GLBs contain geometry; four new assets retain 5% and leave sources unchanged',async()=>{
 const audits=JSON.parse(await readFile(new URL('../assets/placeable-lanterns/audit.json',import.meta.url),'utf8'));
 assert.equal(audits.length,4);
 for(const config of PLACEABLE_LANTERNS){
  const audit=audits.find(a=>a.kind===config.id),glb=await readFile(new URL('../'+config.url,import.meta.url));
  assert.equal(glb.toString('utf8',0,4),'glTF');const json=JSON.parse(glb.toString('utf8',20,20+glb.readUInt32LE(12)));
  let triangles=0;for(const mesh of json.meshes)for(const p of mesh.primitives)triangles+=json.accessors[p.indices??p.attributes.POSITION].count/3;
  assert.ok(triangles>0,config.id+' has triangles');
  if(audit){
   assert.equal(triangles,audit.after);assert.ok(Math.abs(triangles/audit.before-.05)<.00001);
   assert.ok(json.images?.length>0);assert.ok(json.meshes.every(m=>m.primitives.every(p=>p.attributes.TEXCOORD_0!==undefined)));
   assert.equal(createHash('sha256').update(await readFile(audit.source)).digest('hex'),audit.sourceSha256);
  }
 }
});
