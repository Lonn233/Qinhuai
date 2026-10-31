import {defaultTuning} from './defaults.cjs';
import {SIZE_SPECS,validSize,formatMeters,sizeLabel} from './dimensions.cjs';
const STORAGE_KEY='qinhuai.lantern-light-studies.v1';
const CACHE_KEY='qinhuai.lantern-light-studies.file-cache.v1';
const API='/api/lantern-presets';
export function readSaved(raw,lanternIds,presetNames){
 try{
  const data=JSON.parse(raw);if(data?.version!==1||!Array.isArray(data.items))return [];
  const seen=new Set();return data.items.filter(p=>{
   if(!p||typeof p.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(p.id)||seen.has(p.id)||!lanternIds.includes(p.lanternId)||!presetNames.includes(p.base)||typeof p.name!=='string'||!p.name.trim()||p.name.length>40||!Number.isFinite(p.power)||p.power<0||p.power>5||typeof p.color!=='string'||!/^#[0-9a-f]{6}$/i.test(p.color))return false;
   if(p.sizeMeters!==undefined&&!validSize(p.lanternId,p.sizeMeters))return false;
   seen.add(p.id);return true;
  }).slice(0,500).map(({id,lanternId,base,name,power,color,sizeMeters})=>({id,lanternId,base,name,power,color,...(sizeMeters===undefined?{}:{sizeMeters})}));
 }catch{return [];}
}
export function createTuner({presets,lanterns,onChange}){
 const $=id=>document.getElementById(id),states=new Map(),lanternIds=lanterns.map(l=>l.id),presetNames=presets.map(p=>p.name);
 let currentId=null,items=[],legacy=[],online=false,busy=false,lastRefresh=0;
 const notify=text=>{$('tuning-message').textContent=text;};
 const setStorage=(text,status)=>{$('storage-status').textContent=text;$('storage-status').dataset.state=status;};
 const decode=raw=>readSaved(raw,lanternIds,presetNames);
 try{legacy=decode(localStorage.getItem(STORAGE_KEY));items=decode(localStorage.getItem(CACHE_KEY));for(const p of legacy)if(!items.some(s=>s.id===p.id))items.push(p);}catch{/* Browser storage is optional; the file API is authoritative. */}
 function state(){return states.get(currentId);}
 function actions(){document.querySelector('.save-button').disabled=busy||!online;$('retry-storage').disabled=busy;}
 async function request(path='',options={}){
  const response=await fetch(API+path,{...options,cache:'no-store',headers:options.body?{'Content-Type':'application/json'}:undefined,signal:AbortSignal.timeout(10000)});
  const data=await response.json().catch(()=>null);
  if(!response.ok)throw Error(data?.error||'文件存储服务未就绪，请启动新版预览服务。');
  if(data?.version!==1||!Array.isArray(data.items))throw Error('文件存储服务返回了无效数据。');
  return data;
 }
 function accept(data){
  items=decode(JSON.stringify(data));online=true;
  // Cache is only an offline preview; never automatically re-import it after deletion.
  try{localStorage.setItem(CACHE_KEY,JSON.stringify({version:1,items}));}catch{}
  for(const s of states.values())if(s.savedId&&!items.some(p=>p.id===s.savedId)){s.savedId=null;s.name=null;}
  setStorage(data.recovered?'已连接 · 从上一版备份恢复':'已连接 · 光色与尺寸保存到文件','online');
  renderSaved();
 }
 async function refresh(){
  if(busy)return;busy=true;actions();setStorage('正在连接文件存储…','pending');
  try{
   let data=await request();
   if(legacy.length){data=await request('/import',{method:'POST',body:JSON.stringify({items:legacy})});}
   accept(data);notify(data.imported>0?'已将 '+data.imported+' 个旧浏览器方案迁移到项目文件。':'文件存储已连接；调节后点击「另存为我的灯效」保存。');
  }catch(e){online=false;setStorage('未连接 · 请启动服务或重试','offline');notify(e.message+' 当前光色仍可预览，尚未写入文件。');}
  finally{busy=false;lastRefresh=Date.now();actions();renderSaved();}
 }
 async function mutate(path,options,onSuccess){
  if(busy||!online)return;busy=true;actions();renderSaved();setStorage('正在写入项目文件…','pending');
  try{const data=await request(path,options);accept(data);onSuccess();}
  catch(e){online=false;setStorage('保存未确认 · 请重试连接','offline');notify(e.message+' 未确认写入，请保留当前调节并重试连接。');}
  finally{busy=false;actions();renderSaved();}
 }
 function sync(preserveSizeInput=false){
  const s=state();if(!s)return;
  $('brightness').value=Math.round(s.power*100);$('brightness-value').textContent=Math.round(s.power*100)+'%';
  $('light-color').value=s.color;$('color-hex').value=s.color.toUpperCase();$('color-hex').removeAttribute('aria-invalid');
  const spec=SIZE_SPECS[currentId];
  $('size-label').textContent='模型'+spec.label;
  for(const id of ['model-size','model-size-number']){const input=$(id);input.min=spec.min;input.max=spec.max;input.step=spec.step;if(!(preserveSizeInput&&id==='model-size-number'))input.value=s.sizeMeters;input.removeAttribute('aria-invalid');}
  $('size-value').textContent=formatMeters(s.sizeMeters)+' m';
  $('size-range').textContent=formatMeters(spec.min)+'–'+formatMeters(spec.max)+' m';
  $('size-initial').textContent='初始 '+sizeLabel(currentId)+(spec.initial<1?' / '+Math.round(spec.initial*100)+' cm':'');
  $('tuning-base').textContent='基于 · '+presets[s.index].name;onChange({...s});renderSaved();
 }
 function renderSaved(){
  const list=$('saved-effects');list.replaceChildren();const matching=items.filter(p=>p.lanternId===currentId);$('saved-count').textContent=matching.length;
  if(!matching.length){const empty=document.createElement('p');empty.className='saved-empty';empty.textContent=online?'这盏灯还没有方案。调好后点击「另存为我的灯效」。':'等待文件存储连接；如有浏览器旧方案，将尝试迁移。';list.append(empty);return;}
  matching.forEach(p=>{
   const row=document.createElement('div');row.className='saved-effect'+(state()?.savedId===p.id?' selected':'');
   const apply=document.createElement('button');apply.type='button';apply.className='apply-saved';apply.disabled=$('tuning-controls').disabled;apply.setAttribute('aria-pressed',String(state()?.savedId===p.id));
   const swatch=document.createElement('span');swatch.className='saved-swatch';swatch.style.backgroundColor=p.color;
   const copy=document.createElement('span');copy.className='saved-copy';const name=document.createElement('strong');name.textContent=p.name;const detail=document.createElement('small');detail.textContent=sizeLabel(p.lanternId,p.sizeMeters??SIZE_SPECS[p.lanternId].initial)+' · '+Math.round(p.power*100)+'% · '+p.color.toUpperCase()+' · '+p.base+(p.sizeMeters===undefined?' · 初始尺寸':'');copy.append(name,detail);apply.append(swatch,copy);
   apply.addEventListener('click',()=>{states.set(currentId,{index:presets.findIndex(base=>base.name===p.base),power:p.power,color:p.color,sizeMeters:p.sizeMeters??SIZE_SPECS[currentId].initial,savedId:p.id,custom:true,name:p.name});sync();notify('已应用「'+p.name+'」。');});
   const remove=document.createElement('button');remove.type='button';remove.className='delete-saved';remove.textContent='删除';remove.setAttribute('aria-label','删除方案 '+p.name);remove.disabled=$('tuning-controls').disabled||busy||!online;
   remove.addEventListener('click',()=>mutate('/'+encodeURIComponent(p.id),{method:'DELETE'},()=>{sync();notify('已从项目文件删除「'+p.name+'」，当前预览保留。');}));
   row.append(apply,remove);list.append(row);
  });
 }
 function change(values){const s=state();if(!s||$('tuning-controls').disabled)return;Object.assign(s,values,{savedId:null,name:null,custom:true});sync();notify(online?'正在预览自定义光色，点击「另存为我的灯效」写入文件。':'正在预览；文件存储未连接，当前调节尚未保存。');}
 function changeSize(value,preserveInput=false){const s=state();if(!s||$('tuning-controls').disabled)return;if(!validSize(currentId,value)){$('model-size-number').setAttribute('aria-invalid','true');notify('请输入 '+$('size-range').textContent+' 范围内的尺寸；模型保留上一次有效大小。');return;}
  Object.assign(s,{sizeMeters:value,savedId:null,name:null});sync(preserveInput);notify('尺寸已实时更新；重置视角可完整查看，另存方案会同时保存尺寸和光色。');}
 $('model-size').addEventListener('input',e=>changeSize(e.target.valueAsNumber));
 $('model-size-number').addEventListener('input',e=>changeSize(e.target.valueAsNumber,true));
 $('model-size-number').addEventListener('blur',()=>sync());
 $('reset-size').addEventListener('click',()=>changeSize(SIZE_SPECS[currentId].initial));
 $('brightness').addEventListener('input',e=>change({power:Number(e.target.value)/100}));
 $('light-color').addEventListener('input',e=>change({color:e.target.value}));
 $('color-hex').addEventListener('input',e=>{if(/^#[0-9a-f]{6}$/i.test(e.target.value))change({color:e.target.value.toLowerCase()});else{e.target.setAttribute('aria-invalid','true');notify('请输入完整的颜色值，例如 #FFDDAA。');}});
 $('color-hex').addEventListener('blur',()=>{if($('color-hex').getAttribute('aria-invalid')){$('color-hex').value=state()?.color.toUpperCase()||'#FFFFFF';$('color-hex').removeAttribute('aria-invalid');notify('未应用无效颜色，已保留上一次光色。');}});
 $('restore-default').addEventListener('click',()=>{const sizeMeters=state().sizeMeters;states.set(currentId,{...defaultTuning(currentId,presets),sizeMeters});sync();notify('已恢复这盏灯的默认自定义光色，当前尺寸保留。');});
 $('reset-tuning').addEventListener('click',()=>{activate(currentId,state().index,true);notify('已恢复当前基础灯效。');});
 $('save-tuning').addEventListener('submit',e=>{
  e.preventDefault();const s=state();if(!s||$('tuning-controls').disabled||busy||!online)return;
  const id=currentId,inputName=$('tuning-name').value,name=inputName.trim()||(lanterns.find(l=>l.id===id).name+' · '+sizeLabel(id,s.sizeMeters)+' · '+Math.round(s.power*100)+'%');
  const item={id:crypto.randomUUID(),lanternId:id,base:presets[s.index].name,name,power:s.power,color:s.color,sizeMeters:s.sizeMeters};
  mutate('',{method:'POST',body:JSON.stringify(item)},()=>{
   // A model/preset switch or another slider change during the request must not overwrite the new draft.
   if(states.get(id)===s&&s.power===item.power&&s.color===item.color&&s.sizeMeters===item.sizeMeters)Object.assign(s,{savedId:item.id,name});
   if(currentId===id&&$('tuning-name').value===inputName)$('tuning-name').value='';
   document.querySelector('.saved-library').open=true;sync();notify('「'+name+'」已写入项目文件（含尺寸与光色）；清除浏览器数据后仍可读取。');
  });
 });
 $('retry-storage').addEventListener('click',refresh);
 window.addEventListener('focus',()=>{if(Date.now()-lastRefresh>1500)refresh();});
 function activate(id,index,reset=false){
  const changed=currentId!==id;currentId=id;if(changed)$('tuning-name').value='';
  if(reset)states.set(id,{index,power:presets[index].power,color:presets[index].color,sizeMeters:states.get(id)?.sizeMeters??SIZE_SPECS[id].initial,savedId:null,name:null,custom:false});
  else if(!states.has(id))states.set(id,defaultTuning(id,presets));
  sync();if($('storage-status').dataset.state!=='offline')notify(online?'调节实时生效，另存后写入项目文件。':'正在预览；请确认下方文件存储连接状态。');
 }
 function setEnabled(enabled){$('tuning-controls').disabled=!enabled;actions();renderSaved();}
 void refresh();
 return {activate,setEnabled,getAll:()=>Object.fromEntries(lanternIds.map(id=>[id,{...(states.get(id)||defaultTuning(id,presets))}])),get current(){return state()?{...state()}:null;}};
}
