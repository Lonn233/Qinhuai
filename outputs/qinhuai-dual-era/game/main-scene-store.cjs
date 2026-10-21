const fs = require('node:fs/promises');
const path = require('node:path');
const {randomUUID, createHash} = require('node:crypto');
// Raw strings deliberately preserve old schemas, named presets and unknown fields.
const KEYS = new Set([
 'qinhuai.map-light-controls.v1','qinhuai.building-environment.v1',
 'qinhuai.building-light-studies.v1','qinhuai.building-light-current.v1',
 'qinhuai.building-manual-spill.v1','qinhuai-building-soft-spill-v2',
 'qinhuai.red-lantern-light.v1','qinhuai.lantern-light-studies.v1',
 'qinhuai.lantern-light-studies.file-cache.v1',
 'qinhuai:main-map:toolbar-collapsed:v1','qinhuai.dragon-wall-light.v1','qinhuai.main-building-lights.v1'
]);
const MAX_BYTES=4*1024*1024;
const fail=(message,status=400)=>Object.assign(new Error(message),{status});
function entries(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw fail('设置快照格式无效');
 for(const [key,text] of Object.entries(value))if(!KEYS.has(key)||typeof text!=='string'||Buffer.byteLength(text)>1024*1024)throw fail('包含不支持的设置或内容过大');
 if(Buffer.byteLength(JSON.stringify(value))>MAX_BYTES)throw fail('设置快照过大',413);
 return {...value};
}
function parse(raw){const d=JSON.parse(raw);if(d.version!==1||!Number.isSafeInteger(d.revision)||d.revision<0||typeof d.updatedAt!=='string')throw Error('Invalid scene settings');entries(d.entries);return d;}
async function atomicWrite(file,value){
 const tmp=file+'.'+randomUUID()+'.tmp';
 try {const h=await fs.open(tmp,'wx');try{await h.writeFile(JSON.stringify(value,null,2)+'\n');await h.sync();}finally{await h.close();}await fs.rename(tmp,file);}
 finally{await fs.unlink(tmp).catch(()=>{});}
}
function createSceneStore(directory){
 const file=path.join(directory,'main-scene-settings.json'),backup=file+'.bak',history=path.join(directory,'main-scene-history'),browserDir=path.join(directory,'chrome-setting-snapshots');
 let data,queue=Promise.resolve(),recovered=false;
 async function withFileLock(fn){
  await fs.mkdir(directory,{recursive:true});
  const lock=path.join(directory,'main-scene-settings.lock'),deadline=Date.now()+4000;
  let handle;
  while(!handle){
   try{
    handle=await fs.open(lock,'wx');
    try{await handle.writeFile(JSON.stringify({pid:process.pid}));}
    catch(error){await handle.close().catch(()=>{});handle=null;await fs.unlink(lock).catch(()=>{});throw error;}
   }
   catch(e){
    if(e.code!=='EEXIST')throw e;
    let stale=false;
    try{const owner=JSON.parse(await fs.readFile(lock,'utf8'));if(Number.isInteger(owner.pid)&&owner.pid>0){try{process.kill(owner.pid,0);}catch(error){stale=error.code==='ESRCH';}}}
    catch{try{stale=Date.now()-(await fs.stat(lock)).mtimeMs>30000;}catch{}}
    if(stale){await fs.unlink(lock).catch(()=>{});continue;}
    if(Date.now()>deadline)throw fail('其他进程正在保存，请稍后重试。',503);
    await new Promise(resolve=>setTimeout(resolve,35));
   }
  }
  try{data=null;return await fn();}finally{try{await handle.close();}finally{await fs.unlink(lock).catch(()=>{});}}
 }
 const locked=fn=>{const next=queue.then(()=>withFileLock(fn));queue=next.catch(()=>{});return next;};
 const reply=extra=>({...structuredClone(data),storage:'file',recovered,...extra});
 async function load(){
  if(data)return;
  await fs.mkdir(directory,{recursive:true});
  let primaryError;
  try{data=parse(await fs.readFile(file,'utf8'));return;}catch(e){primaryError=e;}
  const candidates=[backup];
  try{for(const name of (await fs.readdir(history)).filter(n=>n.endsWith('.json')).sort().reverse())candidates.push(path.join(history,name));}catch(e){if(e.code!=='ENOENT')throw e;}
  for(const candidate of candidates){
   let saved;try{saved=parse(await fs.readFile(candidate,'utf8'));}catch{continue;}
   if(primaryError.code!=='ENOENT')await fs.copyFile(file,file+'.corrupt-'+Date.now());
   await atomicWrite(file,saved);data=saved;recovered=true;return;
  }
  const backupExists=await fs.stat(backup).then(()=>true,()=>false);
  if(primaryError.code!=='ENOENT'||backupExists||candidates.length>1)throw fail('主场景文件损坏，未覆盖原文件；请从浏览器快照或历史备份恢复。',503);
  data={version:1,revision:0,updatedAt:'',entries:{}};
 }
 async function commit(nextEntries){
  entries(nextEntries);
  if(JSON.stringify(nextEntries)===JSON.stringify(data.entries))return;
  const next={version:1,revision:data.revision+1,updatedAt:new Date().toISOString(),entries:nextEntries};
  await fs.mkdir(history,{recursive:true});
  if(data.revision){await atomicWrite(backup,data);await atomicWrite(path.join(history,String(data.revision).padStart(12,'0')+'.json'),data);}
  await atomicWrite(file,next);data=next;
  // Last 60 complete revisions; original Chrome snapshots are never rotated.
  try{const names=(await fs.readdir(history)).filter(n=>/^\d{12}\.json$/.test(n)).sort();for(const name of names.slice(0,-60))await fs.unlink(path.join(history,name));}catch{/* A cleanup failure must not misreport a successful save. */}
 }
 async function snapshot(raw,source='browser'){
  const saved=entries(raw),keys=Object.keys(saved).sort();
  if(!keys.length)return null;
  const canonical=Object.fromEntries(keys.map(k=>[k,saved[k]]));
  const hash=createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
  const name=hash+'.json',target=path.join(browserDir,name);
  await fs.mkdir(browserDir,{recursive:true});
  if(!await fs.stat(target).then(()=>true,()=>false))await atomicWrite(target,{version:1,capturedAt:new Date().toISOString(),source:String(source).slice(0,100),entries:canonical});
  return name;
 }
 return {file,
  read:()=>locked(async()=>{await load();return reply();}),
  backup:(raw,source)=>locked(async()=>({snapshot:await snapshot(raw,source),keys:Object.keys(raw).length})),
  adopt:(raw,revision,source)=>locked(async()=>{const values=entries(raw);const name=await snapshot(values,source);await load();if(revision!==data.revision)throw Object.assign(fail('其他页面刚保存了设置，请重试，不会覆盖任一版本。',409),{current:reply()});await commit({...data.entries,...values});return reply({snapshot:name});}),
  patch:(changes)=>locked(async()=>{
   if(!Array.isArray(changes)||changes.length>KEYS.size)throw fail('修改列表无效');
   const seen=new Set();for(const c of changes){if(!c||!KEYS.has(c.key)||seen.has(c.key)||(c.before!==null&&typeof c.before!=='string'))throw fail('修改字段无效');entries({[c.key]:c.after});seen.add(c.key);}
   await load();const conflicts=changes.filter(c=>(data.entries[c.key]??null)!==c.before&&data.entries[c.key]!==c.after).map(c=>c.key);
   if(conflicts.length)throw Object.assign(fail('检测到不同版本：两份设置均保留，请选择以本浏览器版本另存。',409),{current:reply(),conflicts});
   await commit({...data.entries,...Object.fromEntries(changes.map(c=>[c.key,c.after]))});return reply();
  })
 };
}
function createSceneAPI(store,{allowedOrigins=[]}={}){return async(req,res,pathname)=>{
 const base='/api/main-scene-settings';if(pathname!==base&&!pathname.startsWith(base+'/'))return false;
 const cors=allowedOrigins.includes(req.headers.origin)?{'Access-Control-Allow-Origin':req.headers.origin,'Vary':'Origin'}:{};
 const send=(status,value)=>{res.writeHead(status,{...cors,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));};
 try{
  const host=req.headers.host||'';
  if(!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)||(req.headers.origin&&req.headers.origin!=='http://'+host&&!allowedOrigins.includes(req.headers.origin))||req.headers['sec-fetch-site']==='cross-site')throw fail('只允许本机同源页面保存设置。',403);
  if(req.method==='OPTIONS'&&allowedOrigins.includes(req.headers.origin)){res.writeHead(204,{...cors,'Access-Control-Allow-Methods':'GET, POST, PATCH','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}).end();return true;}
  if(req.method==='GET'&&pathname===base){send(200,await store.read());return true;}
  if(!['POST','PATCH'].includes(req.method))throw fail('不支持此操作',405);
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))throw fail('需要 JSON 请求',415);
  const chunks=[];let length=0;for await(const chunk of req){length+=chunk.length;if(length>MAX_BYTES+65536)throw fail('请求过大',413);chunks.push(chunk);}
  let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw fail('JSON 无效');}
  if(pathname===base&&req.method==='PATCH')send(200,await store.patch(body.changes));
  else if(pathname===base+'/backup'&&req.method==='POST')send(200,await store.backup(body.entries,body.source));
  else if(pathname===base+'/adopt-browser'&&req.method==='POST')send(200,await store.adopt(body.entries,body.revision,body.source));
  else throw fail('未找到此操作',404);
 }catch(e){send(e.status||503,{error:e.status?e.message:'磁盘保存失败；未确认保存，请保留浏览器并重试。',...(e.current?{current:e.current,conflicts:e.conflicts}: {})});}
 return true;
};}
module.exports={createSceneStore,createSceneAPI,KEYS};
