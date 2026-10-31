import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,readdir,rm} from 'node:fs/promises';
import os from 'node:os';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
import {readSaved} from '../lion-study/tuning.js';
const require=createRequire(import.meta.url);
const {createPresetStore}=require('../preset-store.cjs');
const {createServer}=require('../serve.cjs');
const sample=(id,extra={})=>({id,lanternId:'mountain',base:'柔彩透亮',name:'灯山 · 测试',power:1.04,color:'#ffe6bb',...extra});
async function folder(t){const dir=await mkdtemp(path.join(os.tmpdir(),'qinhuai-presets-test-'));t.after(()=>rm(dir,{recursive:true,force:true}));return dir;}
test('atomic persistence survives restart and concurrent writes do not lose records',async t=>{
 const dir=await folder(t),store=createPresetStore(dir);
 await Promise.all(Array.from({length:12},(_,i)=>store.add(sample('preset-'+i))));
 const reloaded=await createPresetStore(dir).list();assert.equal(reloaded.items.length,12);
 const file=JSON.parse(await readFile(store.file,'utf8'));assert.equal(file.items.length,12);
 assert.equal(JSON.parse(await readFile(store.file+'.bak','utf8')).items.length,11);
 assert.equal((await readdir(dir)).some(f=>f.endsWith('.tmp')),false);
});
test('legacy migration is additive, idempotent and cannot resurrect deleted records',async t=>{
 const store=createPresetStore(await folder(t));await store.add(sample('server'));
 assert.equal((await store.import([sample('legacy'),sample('legacy')])).imported,1);
 assert.equal((await store.import([sample('legacy')])).imported,0);
 await store.remove('legacy');assert.equal((await store.import([sample('legacy')])).items.length,1);
 const reloaded=createPresetStore(path.dirname(store.file));assert.equal((await reloaded.import([sample('legacy')])).imported,0);
});
test('invalid input and duplicate IDs do not overwrite a saved file',async t=>{
 const store=createPresetStore(await folder(t));await store.add(sample('valid'));const before=await readFile(store.file,'utf8');
 for(const input of [sample('bad',{power:5.01}),sample('bad',{color:'red'}),sample('bad',{lanternId:'unknown'}),sample('bad',{name:''}),sample('../escape'),sample('bad',{base:'unknown'}),sample('bad',{power:'1'})])await assert.rejects(store.add(input));
 await assert.rejects(store.add(sample('valid',{power:2})),{status:409});
 assert.equal(await readFile(store.file,'utf8'),before);
});
test('corrupt primary recovers previous version without destroying damaged original',async t=>{
 const dir=await folder(t),store=createPresetStore(dir);await store.add(sample('one'));await store.add(sample('two'));
 await writeFile(store.file,'broken');const recovered=await createPresetStore(dir).list();assert.equal(recovered.recovered,true);assert.equal(recovered.items[0].id,'one');
 const name=(await readdir(dir)).find(f=>f.includes('.corrupt-'));assert.equal(await readFile(path.join(dir,name),'utf8'),'broken');
});
test('unrecoverable file stays untouched and is not replaced with empty data',async t=>{
 const dir=await folder(t),file=path.join(dir,'lantern-presets.json');await writeFile(file,'broken');
 await assert.rejects(createPresetStore(dir).add(sample('new')),{status:503});assert.equal(await readFile(file,'utf8'),'broken');
});
test('disk failure is reported and no success or in-memory-only record is returned',async t=>{
 const dir=await folder(t),store=createPresetStore(dir);await store.add(sample('one'));
 await rm(dir,{recursive:true,force:true});await assert.rejects(store.add(sample('two')));
 assert.equal((await store.list()).items.length,1);
});
test('HTTP API validates origin/body and protects private files while serving existing pages',async t=>{
 const dir=await folder(t),server=createServer({dataDir:dir});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const base='http://127.0.0.1:'+server.address().port, endpoint=base+'/api/lantern-presets';
 let response=await fetch(endpoint);assert.equal(response.status,200);assert.equal((await response.json()).storage,'file');
 const post=(body,headers={})=>fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
 response=await post(sample('http',{power:5}));assert.equal(response.status,201);
 assert.equal((await fetch(endpoint).then(r=>r.json())).items.length,1);
 assert.equal((await post(sample('attack'),{Origin:'https://evil.invalid'})).status,403);
 assert.equal(await new Promise((resolve,reject)=>{http.get(endpoint,{headers:{Host:'evil.invalid'}},res=>{res.resume();resolve(res.statusCode);}).on('error',reject);}),403);
 assert.equal((await fetch(endpoint,{method:'POST',body:'{}'})).status,415);
 assert.equal((await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:'broken'})).status,400);
 assert.equal((await post(sample('bad',{color:'#xyz123'}))).status,400);
 assert.equal((await fetch(base+'/.local-data/lantern-presets.json')).status,403);
 assert.equal((await fetch(base+'/lion-light-study.html')).status,200);
 assert.equal((await fetch(base+'/building-light-study.html')).status,200);
 assert.equal((await fetch(endpoint+'/http',{method:'DELETE'})).status,200);
 assert.equal((await fetch(endpoint).then(r=>r.json())).items.length,0);
});
test('doubled brightness maximum survives file and client preset reload',async t=>{
 const dir=await folder(t),store=createPresetStore(dir);
 await store.add(sample('maximum',{power:5}));
 const data=await createPresetStore(dir).list();
 assert.equal(data.items[0].power,5);
 const parsed=readSaved(JSON.stringify({version:1,items:data.items}),['mountain'],['柔彩透亮']);
 assert.equal(parsed[0].power,5);
 assert.deepEqual(readSaved(JSON.stringify({version:1,items:[sample('invalid',{power:5.01})]}),['mountain'],['柔彩透亮']),[]);
 await assert.rejects(store.add(sample('invalid',{power:5.01})));
});
test('physical dimensions persist while legacy presets stay unchanged',async t=>{
 const dir=await folder(t),store=createPresetStore(dir),old=sample('legacy-size');
 await store.add(old);await store.add(sample('new-size',{sizeMeters:13}));
 const reloaded=await createPresetStore(dir).list();
 assert.deepEqual(reloaded.items[0],old);assert.equal(reloaded.items[1].sizeMeters,13);
 await store.add(sample('small-size',{lanternId:'crane',sizeMeters:.5}));
 assert.equal((await createPresetStore(dir).list()).items[2].sizeMeters,.5);
 for(const value of [null,-1,0,31,NaN,'13'])await assert.rejects(store.add(sample('invalid-size',{sizeMeters:value})));
 const before=await readFile(store.file,'utf8');
 await assert.rejects(store.add(sample('new-size',{sizeMeters:14})),{status:409});
 assert.equal(await readFile(store.file,'utf8'),before);
});
