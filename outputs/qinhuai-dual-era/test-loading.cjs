const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {createHash}=require('node:crypto');
const {gzipSync,createGunzip}=require('node:zlib');
const {once}=require('node:events');

const moduleReady=import('data:text/javascript;base64,'+fs.readFileSync(path.join(__dirname,'embedded-assets.js')).toString('base64'));
function mockAsset(bytes,{id='TEST',gzip=false,chunkSize=31,expected=bytes.length}={}){
 const encoded=gzip?gzipSync(bytes):bytes,blocks=[];
 const holder={dataset:{encoding:gzip?'gzip':'raw',bytes:String(expected)},removed:false,
  get childElementCount(){return blocks.length;},get firstElementChild(){return blocks[0]||null;},remove(){this.removed=true;blocks.length=0;}};
 for(let i=0;i<encoded.length;i+=chunkSize){
  const block={textContent:encoded.subarray(i,i+chunkSize).toString('base64'),remove(){assert.equal(blocks[0],this);blocks.shift();}};
  blocks.push(block);
 }
 global.document={getElementById:key=>key==='asset-'+id?holder:null};
 return holder;
}
test('raw data blocks round-trip with independently padded base64 and UI yields',async()=>{
 const {readEmbeddedAsset}=await moduleReady;
 const bytes=Buffer.from('秦淮 bridge data '.repeat(10000));
 const holder=mockAsset(bytes,{chunkSize:4093});let timerRan=false;const progress=[];
 setTimeout(()=>{timerRan=true;},0);
 const result=await readEmbeddedAsset('TEST',p=>progress.push(p));
 assert.deepEqual(Buffer.from(result),bytes);assert.ok(holder.removed);assert.ok(timerRan);
 assert.equal(progress.at(-1),1);assert.ok(progress.every((p,i)=>!i||p>progress[i-1]));
});
test('gzip data streams decompress to the original bytes',async()=>{
 const {readEmbeddedAsset}=await moduleReady,bytes=Buffer.from('pavilion-water-lotus '.repeat(5000));
 const holder=mockAsset(bytes,{gzip:true,chunkSize:17});
 assert.deepEqual(Buffer.from(await readEmbeddedAsset('TEST')),bytes);assert.ok(holder.removed);
});
test('missing, corrupt and truncated assets fail visibly instead of hanging',async()=>{
 const {readEmbeddedAsset}=await moduleReady;
 global.document={getElementById:()=>null};await assert.rejects(readEmbeddedAsset('MISSING'),/缺少/);
 let holder=mockAsset(Buffer.from('bridge'),{expected:100});await assert.rejects(readEmbeddedAsset('TEST'),/不完整/);assert.ok(holder.removed);
 holder=mockAsset(Buffer.from('bridge'));holder.firstElementChild.textContent='!invalid!';
 await assert.rejects(readEmbeddedAsset('TEST'));assert.ok(holder.removed);
 holder=mockAsset(Buffer.from('not gzip'));holder.dataset.encoding='gzip';
 await assert.rejects(readEmbeddedAsset('TEST'));assert.ok(holder.removed);
});
test('unsupported native decompression produces an actionable error',async()=>{
 const {readEmbeddedAsset}=await moduleReady;mockAsset(Buffer.from('pavilion'),{gzip:true});
 const original=global.DecompressionStream;global.DecompressionStream=undefined;
 try{await assert.rejects(readEmbeddedAsset('TEST'),/新版 Chrome 或 Edge/);}finally{global.DecompressionStream=original;}
});
test('asset queue is sequential and survives synchronous and asynchronous failures',async()=>{
 const {runAssetQueue}=await moduleReady;const visited=[],errors=[];let running=0,maxRunning=0;
 const result=await runAssetQueue([
  {id:'first',label:'first',run:async()=>{visited.push('first');running++;maxRunning=Math.max(maxRunning,running);await new Promise(r=>setTimeout(r,5));running--;}},
  {id:'sync',label:'sync',run:()=>{visited.push('sync');throw new Error('sync failed');}},
  {id:'async',label:'async',run:async()=>{visited.push('async');throw new Error('async failed');}},
  {id:'last',label:'last',run:async()=>{visited.push('last');running++;maxRunning=Math.max(maxRunning,running);running--;}}
 ],{onError:task=>errors.push(task.id)});
 assert.deepEqual(visited,['first','sync','async','last']);assert.deepEqual(errors,['sync','async']);assert.equal(maxRunning,1);assert.equal(result.length,2);
});
async function hashFile(file){const hash=createHash('sha256');for await(const chunk of fs.createReadStream(file))hash.update(chunk);return hash.digest('hex');}
test('startup UI shows real errors, does not overwrite them, and releases the overlay on success',()=>{
 const html=fs.readFileSync(path.join(__dirname,'page-template.html'),'utf8');
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const setup=()=>{
  const elements=new Map(),handlers=new Map(),timers=new Map();let nextTimer=0;
  for(const id of ['loading','loading-message','loading-retry','asset-status','asset-message','asset-retry']){
   const classes=new Set(),strong={textContent:''};
   elements.set(id,{textContent:'',hidden:true,removed:false,querySelector:()=>strong,remove(){this.removed=true;},classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c)}});
  }
  const window={};vm.runInNewContext(script,{window,document:{getElementById:id=>elements.get(id)},location:{reload(){}},console:{error(){}},addEventListener:(type,fn)=>handlers.set(type,fn),setTimeout:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)});
  return {boot:window.__QINHUAI_BOOT__,elements,handlers,timers};
 };
 const failed=setup();failed.handlers.get('error')({error:new Error('real startup failure')});
 assert.equal(failed.elements.get('loading-message').textContent,'real startup failure');
 assert.equal(failed.elements.get('loading-retry').hidden,false);assert.equal(failed.timers.size,0);
 failed.boot.update('later progress');assert.equal(failed.elements.get('loading-message').textContent,'real startup failure');
 const ready=setup();ready.boot.ready();assert.ok(ready.elements.get('loading').classList.contains('done'));
 ready.handlers.get('unhandledrejection')({reason:new Error('background model failed')});
 assert.equal(ready.elements.get('asset-message').textContent,'background model failed');
 assert.equal(ready.elements.get('asset-retry').hidden,false);
 ready.boot.complete();for(const callback of ready.timers.values())callback();
 assert.equal(ready.elements.get('asset-status').hidden,false);assert.equal(ready.elements.get('asset-message').textContent,'background model failed');
});
async function* readLines(file){
 // Unlike readline's event queue, this propagates backpressure while gunzip
 // and hashes are awaited, so a 300 MB HTML is never retained all at once.
 let pending='';
 for await(const chunk of fs.createReadStream(file,{encoding:'utf8'})){
  pending+=chunk;let end;
  while((end=pending.indexOf('\n'))!==-1){const line=pending.slice(0,end).replace(/\r$/,'');pending=pending.slice(end+1);yield line;}
 }
 if(pending)yield pending.replace(/\r$/,'');
}
test('built offline HTML has small executable scripts and exact selected GLB payloads',async()=>{
 const files={BRIDGE:'qiao.glb',PAVILION:'Meshy_AI_kuixingge_1016044736_texture.glb',LOTUS_ONE:'hehua_1.glb',LOTUS_MAIN:'hehua-main.glb'};
 const level=process.env.QINHUAI_TEST_PILOT_LEVEL;if(level){assert.ok(['LOD0','LOD1','LOD2'].includes(level));files.PAVILION='assets/kuixing-pilot/export/kuixing_'+level+'.glb';}
 const lines=readLines(process.env.QINHUAI_TEST_HTML||path.join(__dirname,'index.html'));
 let asset=null,script=null,scriptCount=0,maxScript=0,chunks=0,mainSeen=false;const verified=[];
 for await(const line of lines){
  const start=line.match(/^<div hidden id="asset-([A-Z_]+)" data-encoding="(raw|gzip)" data-bytes="(\d+)">$/);
  if(start){
   assert.ok(mainSeen,'Executable startup must precede model payloads');
   asset={id:start[1],encoding:start[2],expected:Number(start[3]),bytes:0,hash:createHash('sha256'),chunks:0};
   if(asset.encoding==='gzip'){
    asset.inflater=createGunzip();const current=asset;
    asset.done=new Promise((resolve,reject)=>{asset.inflater.on('data',data=>{current.bytes+=data.length;current.hash.update(data);});asset.inflater.on('end',resolve);asset.inflater.on('error',reject);});
   }
   continue;
  }
  if(asset){
   if(line==='</div>'){
    if(asset.inflater){asset.inflater.end();await asset.done;}
    assert.equal(asset.bytes,asset.expected,asset.id+' decompressed size');
    assert.equal(asset.hash.digest('hex'),await hashFile(path.join(__dirname,files[asset.id])),asset.id+' original SHA-256');
    verified.push(asset.id);asset=null;continue;
   }
   const block=line.match(/^<script type="application\/octet-stream">([A-Za-z0-9+/=]+)<\/script>$/);
   assert.ok(block,'Only inert base64 data is allowed inside an asset');assert.ok(block[1].length<=262144);
   const decoded=Buffer.from(block[1],'base64');chunks++;asset.chunks++;
   if(asset.inflater){if(!asset.inflater.write(decoded))await once(asset.inflater,'drain');}
   else{asset.bytes+=decoded.length;asset.hash.update(decoded);}
   continue;
  }
  if(line.startsWith('<script>'))script=line.slice('<script>'.length);
  else if(script!==null)script+='\n'+line;
  if(script!==null&&script.endsWith('</script>')){
   script=script.slice(0,-'</script>'.length);new vm.Script(script);
   assert.ok(script.length<3*1024*1024,'Executable script must not contain huge GLB literals');
   assert.ok(!/__\w+_GLB__|__SCRIPT__|__ASSETS__/.test(script),'No unresolved build placeholders');
   maxScript=Math.max(maxScript,script.length);scriptCount++;mainSeen=scriptCount>=2;script=null;
  }
 }
 assert.equal(script,null);assert.equal(asset,null);assert.equal(scriptCount,2);assert.deepEqual(verified,Object.keys(files));
 console.log('Verified',verified.length,'unchanged GLBs;',chunks,'inert blocks; largest executable',maxScript,'characters');
});
