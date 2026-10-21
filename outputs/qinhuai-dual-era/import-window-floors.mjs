// Keep the two original floor boundaries stable for existing saved presets.
export const WINDOW_FLOOR_BUILDINGS=new Set(['building-FuziTemple0780','building-FuziTemple0751']);
const measuredSplits=new Map();
export function setWindowFloorSplit(node,split){if(Number.isFinite(split))measuredSplits.set(node,split);}
export const WINDOW_FLOORS=[['first','一层'],['second','二层']];
export const hasWindowFloors=id=>typeof id==='string'&&id.length>0;
// Measured gaps between window rows in tile-10, in imported world coordinates.
// 0753 has a lower second storey than the other meshes in the same block.
export const windowFloorSplit=node=>measuredSplits.get(node)??(node==='FuziTemple0753'?13:13.3);
export const windowFloorAt=(node,y)=>y<windowFloorSplit(node)?'first':'second';
const object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
const finite=(v,d,min,max)=>typeof v==='number'&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):d;
const color=(v,d)=>/^#[a-f0-9]{6}$/i.test(v)?v:d;
export const FLOOR_SPILL_FIELDS=[
 ['intensity','窗光外溢强度',0,3,.05,.2],
 ['distance','外溢照射距离',0,30,.1,4],
 ['decayDistance','外溢衰减距离',0,15,.1,4],
 ['angle','外溢展开角度',10,160,1,35],
 ['feather','外溢边缘柔和度',0,1,.01,.7],
];
export function normalizeWindowFloors(value,environment={}){
 const out={...object(value)};
 for(const [id] of WINDOW_FLOORS){
  const f=object(out[id]),s=object(f.spill);
  const spill={...s,enabled:typeof s.enabled==='boolean'?s.enabled:environment.enabled!==false,inheritColor:typeof s.inheritColor==='boolean'?s.inheritColor:environment.inheritColor!==false,color:color(s.color,color(environment.color,'#ffba70'))};
  // Floor cone angles stay independent of the general environment layer.
  for(const [key,,min,max,,fallback] of FLOOR_SPILL_FIELDS)spill[key]=finite(s[key],key==='angle'?fallback:finite(environment[key],fallback,min,max),min,max);
  out[id]={...f,enabled:f.enabled!==false,brightness:finite(f.brightness,1,0,4),inheritColor:f.inheritColor!==false,color:color(f.color,'#ffba70'),spill};
 }
 return out;
}
export function mountWindowFloorControls(host,{read,commit}){
 const syncs=[],sections=new Map();
 const notice=document.createElement('p');notice.className='hint';notice.id='buildingWindowAvailability';host.append(notice);
 function check(section,id,label,get,set){const row=document.createElement('label');row.className='environment-check';row.innerHTML=`<input type="checkbox" id="${id}">${label}`;section.append(row);const el=row.firstElementChild;syncs.push(()=>el.checked=get());el.onchange=()=>{set(el.checked);commit();};}
 function slider(section,id,label,min,max,step,get,set){const row=document.createElement('div');row.className='map-light-field';row.innerHTML=`<label for="${id}">${label}</label><div class="map-light-value"><input id="${id}-value" aria-label="${label}数值" type="number" min="${min}" max="${max}" step="${step}"></div><input id="${id}" aria-label="${label}" type="range" min="${min}" max="${max}" step="${step}">`;section.append(row);for(const el of row.querySelectorAll('input')){syncs.push(()=>el.value=get());el.oninput=()=>{if(Number.isFinite(el.valueAsNumber)){set(el.valueAsNumber);commit();}};}}
 function picker(section,id,label,get,set){const row=document.createElement('div');row.className='environment-color-row';row.innerHTML=`<label for="${id}-color">${label}</label><input id="${id}-color" aria-label="${label}" type="color"><input id="${id}-hex" aria-label="${label}颜色值" maxlength="7">`;section.append(row);const input=row.children[1],hex=row.children[2];syncs.push(()=>input.value=hex.value=get());input.oninput=()=>{set(input.value);commit();};hex.onchange=()=>{if(/^#[a-f0-9]{6}$/i.test(hex.value)){set(hex.value);commit();}else sync();};}
 for(const [floor,label] of WINDOW_FLOORS){
  const section=document.createElement('details');section.className='map-light-group';section.id='building-window-floor-'+floor;section.innerHTML=`<summary>${label}窗户 · 本体与透光外溢</summary><p class="hint">仅调节${label}窗户，保留原有窗格纹理。外溢颜色可独立设置；建筑总控与原窗户亮度倍率继续生效。</p>`;host.append(section);sections.set(floor,section);
  const get=()=>read()[floor],prefix='window-'+floor;
  check(section,prefix+'-enabled','启用'+label+'窗户灯光',()=>get().enabled,v=>get().enabled=v);
  slider(section,prefix+'-brightness','窗户亮度倍率',0,4,.05,()=>get().brightness,v=>get().brightness=v);
  check(section,prefix+'-inherit','沿用原窗户灯光颜色',()=>get().inheritColor,v=>get().inheritColor=v);
  picker(section,prefix,'窗户灯光颜色',()=>get().color,v=>{get().color=v;get().inheritColor=false;});
  const sub=document.createElement('details');sub.className='map-light-group';sub.id=prefix+'-spill';sub.innerHTML='<summary>本层窗户 · 透光外溢</summary>';section.append(sub);
  check(sub,prefix+'-spill-enabled','启用本层窗光外溢',()=>get().spill.enabled,v=>get().spill.enabled=v);
  check(sub,prefix+'-spill-inherit','外溢跟随本层窗户光色',()=>get().spill.inheritColor,v=>get().spill.inheritColor=v);
  picker(sub,prefix+'-spill','窗户透光外溢颜色',()=>get().spill.color,v=>{get().spill.color=v;get().spill.inheritColor=false;});
  for(const [key,title,min,max,step] of FLOOR_SPILL_FIELDS)slider(sub,prefix+'-spill-'+key,title,min,max,step,()=>get().spill[key],v=>get().spill[key]=v);
 }
 function sync(){for(const fn of syncs)fn();}
 return {sync,setAvailability(info){
  notice.textContent=!info?.loaded?'窗户位置随建筑模型加载后显示。':!info.total?'该建筑模型未识别到独立窗户表面；保留已有照明，窗户外溢暂不可用。':'按实际窗户位置向地面、墙面与周边物件投光；各层颜色和外溢可分别另存。';
  for(const [floor,section] of sections){const count=info?.[floor]||0;section.querySelector('summary').textContent=(floor==='first'?'一层':'二层及以上')+'窗户 · 本体与透光外溢'+(info?.loaded&&!count?'（无窗户）':'');for(const input of section.querySelectorAll('input'))input.disabled=!count;}
 }};
}
