export const RED_LANTERN_KEY='qinhuai.red-lantern-light.v1';
export const RED_LANTERN_DEFAULTS=Object.freeze({enabled:true,brightness:.85,temperature:2800,spillRange:1.25,halo:.35,lightEaves:true,lightWalls:true});
export function normalizeRedLantern(value={}){
 const out={...RED_LANTERN_DEFAULTS};
 for(const key of ['enabled','lightEaves','lightWalls'])if(typeof value[key]==='boolean')out[key]=value[key];
 for(const [key,min,max] of [['brightness',0,6],['temperature',1800,6500],['spillRange',.3,3],['halo',0,1.5]]){const n=Number(value[key]);if(value[key]!=null&&Number.isFinite(n))out[key]=Math.max(min,Math.min(max,n));}
 return out;
}
export function readRedLantern(){try{return normalizeRedLantern(JSON.parse(localStorage.getItem(RED_LANTERN_KEY)||'{}'));}catch{return {...RED_LANTERN_DEFAULTS};}}
export function saveRedLantern(settings){try{localStorage.setItem(RED_LANTERN_KEY,JSON.stringify(normalizeRedLantern(settings)));return true;}catch{return false;}}
// Approximate Planckian white, multiplied by the painted fabric rather than replacing it.
export function temperatureRGB(kelvin){const t=kelvin/100,clamp=v=>Math.max(0,Math.min(255,v))/255;return [clamp(t<=66?255:329.698727446*(t-60)**-.1332047592),clamp(t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*(t-60)**-.0755148492),clamp(t>=66?255:t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307)];}
export function mountRedLanternControls(host,onChange){
 host.innerHTML=`<details class="red-lantern-panel" open><summary>红灯笼光效 <span>独立叠加</span></summary><p class="red-help">仅临水马头墙的悬挂灯笼；参数同步到主地图。</p><label class="red-switch" for="red-enabled">启用红灯笼光效<input id="red-enabled" type="checkbox" role="switch"></label><div class="red-sliders"></div><label class="red-switch" for="red-eaves">照亮房檐<input id="red-eaves" type="checkbox" role="switch"></label><label class="red-switch" for="red-walls">照亮墙面<input id="red-walls" type="checkbox" role="switch"></label><button type="button" id="red-reset">恢复红灯笼默认效果</button><p id="red-state" role="status" class="red-help"></p></details>`;
 const inputs=new Map();let current=readRedLantern(),available=true;
 const status=host.querySelector('#red-state');
 const update=patch=>{current=normalizeRedLantern({...current,...patch});const ok=saveRedLantern(current);sync(current,available);onChange(current);if(!ok)status.textContent='浏览器存储不可用；本次调整仍生效，但刷新后无法保留。';};
 for(const [key,id] of [['enabled','red-enabled'],['lightEaves','red-eaves'],['lightWalls','red-walls']]){const input=host.querySelector('#'+id);inputs.set(key,input);input.addEventListener('change',()=>update({[key]:input.checked}));}
 for(const [key,label,min,max,step,unit] of [['brightness','灯体亮度',0,6,.05,'×'],['temperature','色温',1800,6500,100,' K'],['spillRange','外溢范围',.3,3,.05,' m'],['halo','光晕强度',0,1.5,.05,'×']]){
  const row=document.createElement('div');row.className='red-slider';row.innerHTML=`<label for="red-${key}">${label}<output></output></label><div class="red-inputs"><input id="red-${key}" type="range" min="${min}" max="${max}" step="${step}"><input type="number" aria-label="${label}数值" min="${min}" max="${max}" step="${step}"></div>`;
  const [range,number]=row.querySelectorAll('input');inputs.set(key,{range,number,output:row.querySelector('output'),unit});range.oninput=()=>update({[key]:range.valueAsNumber});number.onchange=()=>{if(Number.isFinite(number.valueAsNumber))update({[key]:number.valueAsNumber});else sync(current,available);};host.querySelector('.red-sliders').append(row);
 }
 function sync(value,isAvailable=available){current=normalizeRedLantern(value);available=isAvailable;host.querySelector('#red-reset').disabled=!available;for(const [key,input] of inputs){if(input.range){input.range.value=input.number.value=current[key];input.output.textContent=(key==='temperature'?current[key]:current[key].toFixed(2))+input.unit;input.range.disabled=input.number.disabled=!available||!current.enabled;}else{input.checked=current[key];input.disabled=!available||(key!=='enabled'&&!current.enabled);}}status.textContent=!available?'选择“马头墙民居”后可预览和调节。':current.enabled?'灯体、光晕与檐墙反照独立叠加；自动保留本次设置。':'光效已关闭，保留红灯笼实体。';}
 host.querySelector('#red-reset').onclick=()=>update(RED_LANTERN_DEFAULTS);sync(current);return {sync,get settings(){return {...current};}};
}
