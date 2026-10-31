const fs = require('node:fs/promises');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
const {validSize} = require('./lion-study/dimensions.cjs');
const LANTERNS = new Set(['lion','mountain','fish','crane','lotus']);
const BASES = new Set(['原色微光','均匀柔光','暖纱透光','立体漫光','柔晕夜灯','柔彩透亮','盈彩明灯','通体彩光','盛景辉光']);
const MAX_ITEMS = 500;
function failure(message,status=400){return Object.assign(new Error(message),{status});}
function validId(id){return typeof id==='string' && /^[a-zA-Z0-9_-]{1,80}$/.test(id);}
function validate(item){
 if(!item || !validId(item.id) || !LANTERNS.has(item.lanternId) || !BASES.has(item.base) || typeof item.name!=='string' || !item.name.trim() || item.name.length>40 || !Number.isFinite(item.power) || item.power<0 || item.power>5 || typeof item.color!=='string' || !/^#[0-9a-f]{6}$/i.test(item.color))throw failure('方案格式无效，请检查名称、亮度和颜色。');
 if(item.sizeMeters!==undefined&&!validSize(item.lanternId,item.sizeMeters))throw failure('模型尺寸超出可调范围，请检查米制尺寸。');
 const {id,lanternId,base,name,power,color}=item;
 return {id,lanternId,base,name:name.trim(),power,color:color.toLowerCase(),...(item.sizeMeters===undefined?{}:{sizeMeters:item.sizeMeters})};
}
function parseFile(raw){
 const data=JSON.parse(raw);
 if(data?.version!==1 || !Array.isArray(data.items) || data.items.length>MAX_ITEMS || !Array.isArray(data.deletedIds) || !data.deletedIds.every(validId))throw Error('Invalid preset file');
 const items=data.items.map(validate), ids=new Set(items.map(p=>p.id));
 if(ids.size!==items.length || data.deletedIds.some(id=>ids.has(id)))throw Error('Conflicting preset IDs');
 return {version:1,items,deletedIds:[...new Set(data.deletedIds)]};
}
async function atomicWrite(file,text){
 const temp=file+'.'+randomUUID()+'.tmp';
 try{const handle=await fs.open(temp,'wx');try{await handle.writeFile(text,'utf8');await handle.sync();}finally{await handle.close();}await fs.rename(temp,file);}
 finally{await fs.unlink(temp).catch(()=>{});}
}
function createPresetStore(directory){
 const file=path.join(directory,'lantern-presets.json'),backup=file+'.bak';let data=null,queue=Promise.resolve(),recovered=false;
 async function load(){
  if(data)return data;
  await fs.mkdir(directory,{recursive:true});
  let primaryError;
  try{data=parseFile(await fs.readFile(file,'utf8'));return data;}catch(e){primaryError=e;}
  try{
   const restored=parseFile(await fs.readFile(backup,'utf8'));
   if(primaryError.code!=='ENOENT')await fs.copyFile(file,file+'.corrupt-'+Date.now());
   await atomicWrite(file,JSON.stringify(restored,null,2)+'\n');data=restored;recovered=true;return data;
  }catch(e){
   if(primaryError.code==='ENOENT' && e.code==='ENOENT'){
    const empty={version:1,items:[],deletedIds:[]};await atomicWrite(file,JSON.stringify(empty,null,2)+'\n');data=empty;return data;
   }
   throw failure('配色文件无法读取，已保留原文件；请检查 .local-data 中的主文件和备份。',503);
  }
 }
 function locked(action){const next=queue.then(action);queue=next.catch(()=>{});return next;}
 async function commit(next){
  // Retain the last validated version. Never acknowledge a save before its atomic rename.
  await atomicWrite(backup,JSON.stringify(data,null,2)+'\n');
  await atomicWrite(file,JSON.stringify(next,null,2)+'\n');data=next;
 }
 function response(extra={}){return {version:1,items:data.items.map(p=>({...p})),storage:'file',recovered,...extra};}
 return {
  file,
  list:()=>locked(async()=>{await load();return response();}),
  add:(raw)=>locked(async()=>{const item=validate(raw);await load();const old=data.items.find(p=>p.id===item.id);
   if(old){if(JSON.stringify(old)!==JSON.stringify(item))throw failure('方案编号已存在，请另存为新方案。',409);return response();}
   if(data.deletedIds.includes(item.id))throw failure('此方案已删除，请另存为新方案。',409);
   if(data.items.length>=MAX_ITEMS)throw failure('已保存 500 个方案，请先删除不需要的方案。',409);
   await commit({...data,items:[...data.items,item]});return response();}),
  import:(raw)=>locked(async()=>{
   if(!Array.isArray(raw)||raw.length>MAX_ITEMS)throw failure('迁移数据格式无效。');const candidates=raw.map(validate);await load();
   const occupied=new Set([...data.items.map(p=>p.id),...data.deletedIds]),added=[];
   for(const item of candidates){if(!occupied.has(item.id)){added.push(item);occupied.add(item.id);}}
   if(data.items.length+added.length>MAX_ITEMS)throw failure('迁移后超过 500 个方案，请先整理已存方案。',409);
   if(added.length)await commit({...data,items:[...data.items,...added]});return response({imported:added.length});
  }),
  remove:(id)=>locked(async()=>{if(!validId(id))throw failure('方案编号无效。');await load();
   if(data.items.some(p=>p.id===id))await commit({...data,items:data.items.filter(p=>p.id!==id),deletedIds:[...data.deletedIds,id]});
   return response();})
 };
}
function send(res,status,body){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body));}
async function bodyJSON(req){
 if(!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']||''))throw failure('需要 application/json 请求。',415);
 let length=0;const chunks=[];for await(const chunk of req){length+=chunk.length;if(length>256*1024)throw failure('请求内容过大。',413);chunks.push(chunk);}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw failure('JSON 格式无效。');}
}
function createPresetAPI(store){return async(req,res,pathname)=>{
 const base='/api/lantern-presets';if(pathname!==base&&!pathname.startsWith(base+'/'))return false;
 try{
  const host=req.headers.host||'';
  if(!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) || (req.headers.origin && req.headers.origin!=='http://'+host) || req.headers['sec-fetch-site']==='cross-site')throw failure('只允许同源本地页面访问。',403);
  if(pathname===base && req.method==='GET')send(res,200,await store.list());
  else if(pathname===base && req.method==='POST')send(res,201,await store.add(await bodyJSON(req)));
  else if(pathname===base+'/import' && req.method==='POST'){const body=await bodyJSON(req);send(res,200,await store.import(body.items));}
  else if(pathname.startsWith(base+'/')&&pathname!==base+'/import'&&req.method==='DELETE')send(res,200,await store.remove(pathname.slice(base.length+1)));
  else send(res,405,{error:'不支持此操作。'});
 }catch(error){console.error('[配色存储]',error.message);send(res,error.status||503,{error:error.status?error.message:'配色文件写入失败，请检查磁盘空间和目录权限；本次未确认保存。'});}
 return true;
};}
module.exports={createPresetStore,createPresetAPI,validate};
