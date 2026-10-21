import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,readdir} from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';import {createRequire} from 'node:module';
import {planSync,SCENE_KEYS} from '../../main-scene-persistence.mjs';
const require=createRequire(import.meta.url),{createSceneStore,KEYS}=require('../main-scene-store.cjs'),{createServer}=require('../serve.cjs');
const A=SCENE_KEYS[0],B=SCENE_KEYS[1],C=SCENE_KEYS[2];
const folder=()=>mkdtemp(path.join(os.tmpdir(),'qinhuai-scene-test-'));
test('client/server allowlists agree',()=>assert.deepEqual(new Set(SCENE_KEYS),KEYS));
test('Chrome raw data, zero values, colors, unknown fields and named presets survive restart',async()=>{
 const dir=await folder(),store=createSceneStore(dir),entries={[A]:'{ "version":1,"settings":{"exposure":0.71,"future":true}}',[B]:'{"version":1,"buildings":{"one":{"color":"#aaffee","intensity":0},"future-id":{"x":7}}}',[C]:'{"version":1,"items":[{"name":"我的收藏","extension":42}]}'};
 const result=await store.adopt(entries,0,'Chrome test');assert.deepEqual(result.entries,entries);
 assert.deepEqual((await createSceneStore(dir).read()).entries,entries);
 const snapshot=JSON.parse(await readFile(path.join(dir,'chrome-setting-snapshots',result.snapshot),'utf8'));assert.deepEqual(snapshot.entries,entries);
 assert.equal((await store.adopt(entries,1,'repeat')).revision,1);assert.equal((await readdir(path.join(dir,'chrome-setting-snapshots'))).length,1);
});
test('additive adoption never removes unrelated settings; stale replacement rejected and snapshotted',async()=>{
 const store=createSceneStore(await folder());await store.adopt({[A]:'old',[C]:'presets'},0);const next=await store.adopt({[A]:'chrome'},1);assert.equal(next.entries[C],'presets');
 await assert.rejects(store.adopt({[A]:'stale'},1),e=>e.status===409);assert.equal((await store.read()).entries[A],'chrome');
});
test('serialized CAS keeps independent edits and rejects stale same-key edits atomically',async()=>{
 const store=createSceneStore(await folder());await store.adopt({[A]:'a',[B]:'b'},0);
 await Promise.all([store.patch([{key:A,before:'a',after:'a1'}]),store.patch([{key:B,before:'b',after:'b1'}])]);
 await assert.rejects(store.patch([{key:A,before:'a',after:'stale'},{key:B,before:'b1',after:'must-not-write'}]),e=>e.status===409);
 assert.deepEqual((await store.read()).entries,{[A]:'a1',[B]:'b1'});
 assert.equal((await store.patch([{key:A,before:'a',after:'a1'}])).revision,3,'duplicate retry is idempotent');
});
test('atomic backup restores corrupt primary without deleting corrupt original',async()=>{
 const dir=await folder(),store=createSceneStore(dir);await store.adopt({[A]:'original'},0);await store.patch([{key:A,before:'original',after:'updated'}]);await writeFile(store.file,'broken');
 const recovered=await createSceneStore(dir).read();assert.equal(recovered.entries[A],'original');assert.equal(recovered.recovered,true);assert.ok((await readdir(dir)).some(n=>n.includes('.corrupt-')));
 assert.ok(!(await readdir(dir)).some(n=>n.endsWith('.tmp')));
});
test('unreadable files fail closed rather than saving defaults',async()=>{
 const dir=await folder();await writeFile(path.join(dir,'main-scene-settings.json'),'bad');const store=createSceneStore(dir);
 await assert.rejects(store.read(),e=>e.status===503);await assert.rejects(store.patch([{key:A,before:null,after:'defaults'}]),e=>e.status===503);assert.equal(await readFile(store.file,'utf8'),'bad');
});
test('empty migration never overwrites existing data and private key input rejected',async()=>{
 const store=createSceneStore(await folder());await store.adopt({[A]:'current'},0);assert.equal((await store.adopt({},1)).entries[A],'current');
 await assert.rejects(store.patch([{key:'password',before:null,after:'no'}]),e=>e.status===400);await assert.rejects(store.adopt({[A]:null},1),e=>e.status===400);
});
test('migration planner distinguishes restore, local unsynced edits, server edits and conflict',()=>{
 assert.deepEqual(planSync({}, {[A]:'disk'},null).restore,{[A]:'disk'});
 assert.equal(planSync({[A]:'chrome'},{},null).changes[0].after,'chrome');
 assert.deepEqual(planSync({[A]:'chrome'},{[A]:'disk'},null).conflicts,[A]);
 assert.equal(planSync({[A]:'edit'},{[A]:'old'},{[A]:'old'}).changes[0].after,'edit');
 assert.deepEqual(planSync({[A]:'old'},{[A]:'new'},{[A]:'old'}).restore,{[A]:'new'});
 assert.deepEqual(planSync({[A]:'same'},{[A]:'same'},null),{changes:[],restore:{},conflicts:[]});
});
test('HTTP is same-origin only, JSON only, private files forbidden, existing preset endpoint compatible',async t=>{
 const server=createServer({dataDir:await folder()});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>{server.close();server.closeAllConnections();});const base='http://127.0.0.1:'+server.address().port;
 assert.equal((await fetch(base+'/api/main-scene-settings')).status,200);
 assert.equal((await fetch(base+'/api/main-scene-settings',{headers:{Origin:'https://evil.example'}})).status,403);
 assert.equal((await fetch(base+'/api/main-scene-settings',{method:'PATCH',body:'{}'})).status,415);
 assert.equal((await fetch(base+'/api/main-scene-settings',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({changes:[{key:A,before:null,after:'Chrome'}]})})).status,200);
 assert.equal((await fetch(base+'/.local-data/main-scene-settings.json')).status,403);
 assert.equal((await fetch(base+'/api/lantern-presets')).status,200);
});
test('two server instances sharing the folder reread disk under a process lock',async()=>{
 const dir=await folder(),first=createSceneStore(dir),second=createSceneStore(dir);
 await first.adopt({[A]:'a',[B]:'b'},0);await second.read();
 await Promise.all([first.patch([{key:A,before:'a',after:'one'}]),second.patch([{key:B,before:'b',after:'two'}])]);
 assert.deepEqual((await createSceneStore(dir).read()).entries,{[A]:'one',[B]:'two'});
});

test('sidecar permits configured local origins only, including JSON preflight',async t=>{
 const {createStorageServer}=require('../scene-storage-server.cjs');
 const allowed='http://127.0.0.1:4180';
 const server=createStorageServer({dataDir:await folder(),allowedOrigins:[allowed]});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 t.after(()=>{server.close();server.closeAllConnections();});
 const base='http://127.0.0.1:'+server.address().port+'/api/main-scene-settings';
 const preflight=await fetch(base,{method:'OPTIONS',headers:{Origin:allowed,'Access-Control-Request-Method':'PATCH','Access-Control-Request-Headers':'content-type'}});
 assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),allowed);
 const save=await fetch(base,{method:'PATCH',headers:{Origin:allowed,'Content-Type':'application/json'},body:JSON.stringify({changes:[{key:A,before:null,after:'local Chrome'}]})});
 assert.equal(save.status,200);assert.equal(save.headers.get('access-control-allow-origin'),allowed);
 assert.equal((await save.json()).entries[A],'local Chrome');
 const denied=await fetch(base,{headers:{Origin:'https://evil.example'}});
 assert.equal(denied.status,403);assert.equal(denied.headers.get('access-control-allow-origin'),null);
 assert.equal((await fetch(base,{headers:{Origin:'http://127.0.0.1:9999'}})).status,403);
});
