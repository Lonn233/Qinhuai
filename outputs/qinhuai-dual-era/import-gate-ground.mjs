// Measured main gate center in imported world coordinates. Values use map units.
export const GATE_GROUND_PRESET=Object.freeze({enabled:true,intensity:3.1,color:'#ffb85c',width:7.8,depth:5.8,offsetX:0,offsetZ:0,rotation:0,softness:.65});
export const GATE_GROUND_FIELDS=[
 ['intensity','地面光亮度',0,6,.05],['width','横向照亮宽度',0,16,.1],['depth','前后照亮范围',0,16,.1],
 ['offsetX','左右位置偏移',-8,8,.1],['offsetZ','前后位置偏移',-8,8,.1],['rotation','光区旋转角度',-90,90,1],['softness','边缘柔和度',.1,1,.05],
];
export function normalizeGateGround(value={}){
 if(!value||typeof value!=='object'||Array.isArray(value))value={};
 const out={...GATE_GROUND_PRESET,...value,enabled:value.enabled!==false,color:/^#[a-f0-9]{6}$/i.test(value.color)?value.color:GATE_GROUND_PRESET.color};
 for(const [id,,min,max] of GATE_GROUND_FIELDS)out[id]=typeof value[id]==='number'&&Number.isFinite(value[id])?Math.max(min,Math.min(max,value[id])):GATE_GROUND_PRESET[id];
 return out;
}
export function gateGroundWeight(x,z,p){
 if(!p.enabled||p.width<=0||p.depth<=0||p.intensity<=0)return 0;
 const a=p.rotation*Math.PI/180,dx=x-(-5.24+p.offsetX),dz=z-(-13.46+p.offsetZ);
 const u=(dx*Math.cos(a)+dz*Math.sin(a))/(p.width/2),v=(-dx*Math.sin(a)+dz*Math.cos(a))/(p.depth/2),r=Math.hypot(u,v);
 if(r>=1)return 0;
 const t=Math.max(0,Math.min(1,(r-(1-p.softness))/p.softness));
 return Math.exp(-1.1*r*r)*(1-t*t*(3-2*t));
}
export function mountGateGroundControls(host,{read,commit}){
 host.innerHTML='<summary>牌坊正下方 · 地面暖光</summary><p class="hint">参考图预设：金色光铺满门下通道，向四周柔和衰减。独立照亮现有地砖；可随本建筑另存方案。</p><label class="environment-check"><input id="gate-ground-enabled" type="checkbox">启用门下地面照明</label><div class="environment-color-row"><label for="gate-ground-color">地面光颜色</label><input id="gate-ground-color" type="color"><input id="gate-ground-hex" aria-label="地面光颜色值" maxlength="7"></div>';
 const $=id=>host.querySelector('#'+id),fields=[];
 for(const [key,label,min,max,step] of GATE_GROUND_FIELDS){
  const row=document.createElement('div');row.className='map-light-field';row.innerHTML=`<label for="gate-ground-${key}">${label}</label><div class="map-light-value"><input id="gate-ground-${key}-value" aria-label="${label}数值" type="number" min="${min}" max="${max}" step="${step}"></div><input id="gate-ground-${key}" aria-label="${label}" type="range" min="${min}" max="${max}" step="${step}">`;host.append(row);
  for(const el of row.querySelectorAll('input')){fields.push([el,key]);el.oninput=()=>{if(Number.isFinite(el.valueAsNumber))commit({...read(),[key]:el.valueAsNumber});};}
 }
 $('gate-ground-enabled').onchange=e=>commit({...read(),enabled:e.target.checked});
 $('gate-ground-color').oninput=e=>commit({...read(),color:e.target.value});
 $('gate-ground-hex').onchange=e=>{if(/^#[a-f0-9]{6}$/i.test(e.target.value))commit({...read(),color:e.target.value});else sync();};
 const reset=document.createElement('button');reset.id='gate-ground-preset';reset.type='button';reset.textContent='应用参考图 · 门下暖金';reset.onclick=()=>commit({...read(),...GATE_GROUND_PRESET});host.append(reset);
 function sync(){const p=normalizeGateGround(read());$('gate-ground-enabled').checked=p.enabled;$('gate-ground-color').value=$('gate-ground-hex').value=p.color;for(const [el,key] of fields)el.value=p[key];}
 return {sync};
}
