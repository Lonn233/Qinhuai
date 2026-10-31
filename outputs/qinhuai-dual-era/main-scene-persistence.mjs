// A raw, version-preserving bridge. No defaults are written or sent to the server.
export const SCENE_KEYS = [
 'qinhuai.map-light-controls.v1','qinhuai.building-environment.v1',
 'qinhuai.building-light-studies.v1','qinhuai.building-light-current.v1',
 'qinhuai.building-manual-spill.v1','qinhuai-building-soft-spill-v2',
 'qinhuai.red-lantern-light.v1','qinhuai.lantern-light-studies.v1',
 'qinhuai.lantern-light-studies.file-cache.v1','qinhuai:main-map:toolbar-collapsed:v1','qinhuai.dragon-wall-light.v1','qinhuai.main-building-lights.v1','qinhuai.main-lantern-lights.v1','qinhuai.scene-lantern-placements.v1'
];
const API='/api/main-scene-settings',META='qinhuai.main-scene-file-sync.v1';
const labels=['地图光效','逐建筑外溢 / 颜色','建筑收藏预设','建筑当前参数','手动外溢另存','建筑柔光','红灯笼','花灯旧收藏','花灯文件缓存','菜单展开状态','龙墙分区灯光及方案','主地图逐建筑灯效及方案','主地图花灯与挂灯光效及方案','场景新增灯具及摆位'];
export function readSceneSnapshot(storage){const out={};for(const key of SCENE_KEYS){const raw=storage.getItem(key);if(raw!==null)out[key]=raw;}return out;}
export function planSync(local,remote,baseline){
 const changes=[],restore={},conflicts=[];
 for(const key of SCENE_KEYS){
  const l=local[key],r=remote[key],b=baseline?.[key];
  if(l===r)continue;
  if(l===undefined){if(r!==undefined)restore[key]=r;continue;}
  if(r===undefined||b===r)changes.push({key,before:r??null,after:l});
  else if(b!==undefined&&l===b)restore[key]=r;
  else conflicts.push(key);
 }
 return {changes,restore,conflicts};
}
export function mountScenePersistence({host=document.querySelector('#scenePersistence'),captureOnly=false}={}){
 if(!host)return {ready:Promise.resolve()};
 host.innerHTML=`<div class="scene-save-heading">本机文件存档 <span id="sceneSaveBadge">连接中</span></div><p id="sceneSaveStatus" role="status" aria-live="polite">先保护本浏览器现有设置，不写入默认值…</p><div class="scene-save-actions"><button type="button" id="sceneSaveNow">立即保存</button><button type="button" id="sceneSaveExport">导出备份</button><button type="button" id="sceneSaveAdopt" hidden>保留两份，并采用本浏览器设置</button></div><p class="hint scene-save-note">主地图参数、外溢颜色、建筑 / 花灯收藏原样保存；不会删除原预设。</p>`;
 const status=host.querySelector('#sceneSaveStatus'),badge=host.querySelector('#sceneSaveBadge'),adoptButton=host.querySelector('#sceneSaveAdopt');
 let endpoint=API;
 let storage,baseline=null,revision=0,busy=false,timer,stopped=false,initialized=false,backupFingerprint='',lastSeen='',unconfirmed=false,conflict=false,failed=false;
 try{storage=window.localStorage;const journal=JSON.parse(storage.getItem(META)||'null');if(journal?.version===1&&journal.entries)baseline=journal.entries;}catch{}
 function state(kind,message){host.dataset.state=kind;badge.textContent={saving:'保存中',saved:'已写入文件',error:'尚未存盘',conflict:'版本待确认',empty:'未发现设置'}[kind]||'待保存';status.textContent=message;adoptButton.hidden=kind!=='conflict';failed=kind==='error';conflict=kind==='conflict';}
 function snapshot(){if(!storage)throw Error('此浏览器不允许读取本地设置。请在原 Chrome 普通窗口打开此页。');return readSceneSnapshot(storage);}
 function journal(){try{storage.setItem(META,JSON.stringify({version:1,entries:baseline,revision}));}catch{/* Raw settings remain in their original keys; the disk copy is already safe. */}}
 async function request(url=API,options={}){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),5000);
  try{const res=await fetch(url.replace(API,endpoint),{...options,headers:{'Content-Type':'application/json',...options.headers},cache:'no-store',signal:controller.signal});if(res.status===404&&endpoint===API&&['127.0.0.1','localhost'].includes(location.hostname)){endpoint=location.protocol+'//'+location.hostname+':4186'+API;return request(url,options);}
   let data;try{data=await res.json();}catch{throw Error('后端未启动或版本过旧，请保留 Chrome 设置并重试。');}if(!res.ok)throw Object.assign(Error(data.error||'保存失败'),{data,status:res.status});return data;}
  finally{clearTimeout(timeout);}
 }
 const post=(path,body)=>request(API+path,{method:'POST',body:JSON.stringify(body)});
 async function protect(local){const fingerprint=JSON.stringify(local);if(fingerprint===backupFingerprint||!Object.keys(local).length)return;await post('/backup',{entries:local,source:captureOnly?'Chrome current settings capture':'Main map browser snapshot'});backupFingerprint=fingerprint;}
 function restore(values,original){
  for(const [key,value] of Object.entries(values)){
   // Never replace a slider edit made while a network request was in flight.
   if(storage.getItem(key)!==(original[key]??null))continue;
   storage.setItem(key,value);
   window.dispatchEvent(new StorageEvent('storage',{key,newValue:value,oldValue:original[key]??null,storageArea:storage}));
  }
 }
 async function sync({adopt=false}={}){
  if(busy||stopped)return;busy=true;unconfirmed=true;
  try{
   const local=snapshot();state('saving','正在把浏览器当前设置写入本机文件…');
   // Archive the exact original before reading/restoring anything from disk.
   if(!initialized||adopt)await protect(local);
   const remote=await request();revision=remote.revision;
   let result;
   if(adopt){result=await post('/adopt-browser',{entries:local,revision,source:'User selected current browser settings'});}
   else {
    const plan=planSync(local,remote.entries,baseline);
    // The dedicated Chrome capture must not modify the user's existing local values.
    if(captureOnly)for(const key of Object.keys(plan.restore))if(local[key]!==undefined){plan.conflicts.push(key);delete plan.restore[key];}
    if(plan.conflicts.length){await protect(local);state('conflict','浏览器原样快照已备份；它与文件版本不同。未覆盖任何参数，请选择下方按钮采用当前浏览器设置。');return;}
    if(!captureOnly)restore(plan.restore,local);
    result=plan.changes.length?await request(API,{method:'PATCH',body:JSON.stringify({changes:plan.changes})}):remote;
   }
   baseline=result.entries;revision=result.revision;journal();initialized=true;unconfirmed=false;
   const keys=Object.keys(snapshot());
   if(!keys.length){state('empty',captureOnly?'这个浏览器 / 地址下没有项目设置。请在调好参数的 Chrome 中，用完全相同的主机名和端口打开此页。未上传默认值，未更改文件存档。':'暂无已调参数，不会写入默认值；开始调节后自动存档。');}
   else state('saved',`${captureOnly?'本浏览器现有设置已保护':'已保存到本机文件'} · ${keys.length} 类 · ${result.updatedAt?new Date(result.updatedAt).toLocaleTimeString('zh-CN'):'暂无参数'}${result.recovered?' · 已从备份恢复':''}`);
   lastSeen=JSON.stringify(snapshot());
   // Changes during the request must not be mistaken for acknowledged values.
   if(SCENE_KEYS.some(k=>snapshot()[k]!==undefined&&snapshot()[k]!==baseline[k]))schedule();
  }catch(e){
   if(e.status===409){await protect(snapshot()).catch(()=>{});state('conflict','另一页面保存了不同版本。当前浏览器设置保留，未覆盖文件；可以保留两份并采用本浏览器版本。');}
   else state('error',`${e.name==='AbortError'?'后端暂未响应':e.message} 本次尚未确认存盘；请保留浏览器，连接恢复后会重试。`);
  }finally{busy=false;}
 }
 function observe(){try{const now=JSON.stringify(snapshot());if(now!==lastSeen){lastSeen=now;unconfirmed=true;return true;}}catch{}return false;}
 function schedule(){clearTimeout(timer);timer=setTimeout(()=>sync(),500);}
 function changed(){if(observe()){if(!busy)state('saving','参数已保留在浏览器，正在等待写入文件…');schedule();}}
 const ready=sync();
 const interval=setInterval(()=>{if(observe()||failed||(!initialized&&!conflict))schedule();},2000);
 const inputChanged=()=>queueMicrotask(changed);
 window.addEventListener('storage',changed);window.addEventListener('online',schedule);
 document.addEventListener('input',inputChanged);document.addEventListener('change',inputChanged);
 const leave=event=>{observe();if(unconfirmed){event.preventDefault();event.returnValue='';}};
 window.addEventListener('beforeunload',leave);
 const visibility=()=>{if(document.visibilityState==='hidden'&&(observe()||unconfirmed))sync();};
 document.addEventListener('visibilitychange',visibility);
 host.querySelector('#sceneSaveNow').onclick=()=>sync();
 adoptButton.onclick=()=>sync({adopt:true});
 host.querySelector('#sceneSaveExport').onclick=()=>{
  try{const data={version:1,exportedAt:new Date().toISOString(),entries:snapshot()},url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='秦淮-Chrome当前设置-'+Date.now()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){state('error',e.message);}
 };
 if(captureOnly){const list=document.querySelector('#capturedKeys');if(list){try{const current=snapshot();list.textContent=SCENE_KEYS.filter(k=>current[k]!==undefined).map(k=>labels[SCENE_KEYS.indexOf(k)]).join(' · ')||'未检测到项目参数';}catch{}}}
 return {ready,flush:()=>sync(),get status(){return {revision,unconfirmed,initialized,state:host.dataset.state};},dispose(){stopped=true;clearInterval(interval);clearTimeout(timer);window.removeEventListener('storage',changed);window.removeEventListener('online',schedule);window.removeEventListener('beforeunload',leave);document.removeEventListener('input',inputChanged);document.removeEventListener('change',inputChanged);document.removeEventListener('visibilitychange',visibility);}};
}
