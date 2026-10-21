export const MAP_LIGHT_STORAGE_KEY = 'qinhuai.map-light-controls.v1';
export const MAP_LIGHT_GROUPS = [
  {id:'bloom',label:'全地图光晕 · 建筑 / 游船 / 花灯',hint:'画面中的发光扩散，不是水面倒影。阈值越低，参与光晕的区域越多。'},
  {id:'building',label:'建筑檐口与柔光范围',hint:'以当前试灯方案为基准调节；柔光只影响原方案已启用柔光的马头墙建筑，不增加窗外光源。'},
  {id:'wash',label:'局部照射 · 牌坊与岸边洗墙灯',hint:'调节现有局部灯光的照射距离和边缘，不改变灯的位置。'},
  {id:'ground',label:'地面光斑 · 总控',hint:'保留原来的总倍率，下方每类灯可单独细调；不改变灯体大小。'},
  ...[['street','沿街灯笼'],['lion','狮子花灯'],['mountain','灯山']].map(([id,label])=>({id:`ground-${id}`,label:`${label} · 地面辐射`,hint:'独立控制半径、强度、长宽比例和边缘衰减，与地面总控相乘。'})),
  ...[['building','沿河建筑'],['boat','游船灯光'],['street','临水路灯'],['lotus','荷花水灯'],['chrysanthemum','菊花水灯']].map(([id,label])=>({id:`water-${id}`,label:`${label} · 水面反射`,hint:id==='building'||id==='boat'||id==='street'?'按光源位置生成水面光影，不是整栋建筑的镜面倒影；仅河道内可见，强度为 0 时关闭。':'仅改变这一类水灯的倒影，不改变灯体发光；强度为 0 时关闭。'})),
];
export const MAP_LIGHT_FIELDS = [
  {key:'bloomStrength',group:'bloom',label:'光晕强度',min:0,max:2,step:.01,value:.36},
  {key:'bloomRadius',group:'bloom',label:'光晕扩散半径',min:0,max:1,step:.01,value:.42},
  {key:'bloomThreshold',group:'bloom',label:'光晕亮度阈值',min:0,max:3,step:.01,value:1.05},
  {key:'exposure',group:'bloom',label:'夜景曝光',min:.2,max:2,step:.01,value:.98},
  {key:'eaveWidth',group:'building',label:'院落 / 魁星阁檐口光宽',min:.25,max:2,step:.05,value:1,unit:'×'},
  {key:'spillIntensity',group:'building',label:'建筑柔光强度',min:0,max:3,step:.05,value:1,unit:'×'},
  {key:'spillHorizontal',group:'building',label:'柔光水平范围',min:.25,max:2,step:.05,value:1,unit:'×'},
  {key:'spillDown',group:'building',label:'柔光向下范围',min:.25,max:2,step:.05,value:1,unit:'×'},
  {key:'spillUp',group:'building',label:'柔光向上范围',min:.25,max:2,step:.05,value:1,unit:'×'},
  {key:'spillFalloff',group:'building',label:'柔光衰减速度',min:.25,max:2,step:.05,value:1,unit:'×'},
  {key:'washIntensity',group:'wash',label:'局部灯光强度',min:0,max:3,step:.05,value:1,unit:'×'},
  {key:'washDistance',group:'wash',label:'局部照射距离',min:.25,max:2,step:.05,value:1,unit:'×'},
  {key:'washAngle',group:'wash',label:'局部照射角度',min:.25,max:1.5,step:.05,value:1,unit:'×'},
  {key:'washPenumbra',group:'wash',label:'照射边缘柔和度',min:0,max:1,step:.01,value:.85},
  {key:'groundRadius',group:'ground',label:'地面光斑半径',min:.25,max:2,step:.05,value:1,unit:'×'},
  {key:'groundIntensity',group:'ground',label:'地面光斑强度',min:0,max:3,step:.05,value:1,unit:'×'},
];
// Append-only fields keep version-1 snapshots compatible with the original controls.
for(const [kind,label] of [['street','路灯'],['lion','狮子灯'],['mountain','灯山']]) {
  for(const [suffix,title,min,max,value] of [['Radius','辐射半径',.25,4,1],['Intensity','地面光强度',0,4,1],['Stretch','光斑长宽比',.25,4,1],['Falloff','地面光衰减',.25,3,1]])
    MAP_LIGHT_FIELDS.push({key:`${kind}Ground${suffix}`,group:`ground-${kind}`,label:`${label}${title}`,min,max,step:.05,value,unit:'×'});
}
for(const [kind,label] of [['building','建筑'],['boat','游船'],['street','路灯'],['lotus','荷花灯'],['chrysanthemum','菊花灯']]) {
  for(const [suffix,title,min,max,value] of [['Intensity','倒影强度',0,4,1],['Width','倒影宽度',.25,3,1],['Length','倒影延展',.25,3,1],['Ripple','波纹扰动',0,3,1],['Speed','波纹速度',0,3,1],['Fade','倒影衰减',.25,3,1]])
    MAP_LIGHT_FIELDS.push({key:`${kind}Water${suffix}`,group:`water-${kind}`,label:`${label}${title}`,min,max,step:.05,value,unit:'×'});
}
export const DEFAULT_MAP_LIGHTS = Object.freeze(Object.fromEntries(MAP_LIGHT_FIELDS.map(f=>[f.key,f.value])));
export function normalizeMapLights(value={}) {
  if(!value||typeof value!=='object'||Array.isArray(value))value={};
  return Object.fromEntries(MAP_LIGHT_FIELDS.map(f=>{
    const raw=value[f.key];
    const n=typeof raw==='number'&&Number.isFinite(raw)?raw:f.value;
    const bounded=Math.min(f.max,Math.max(f.min,n));
    const stepped=Number((f.min+Math.round((bounded-f.min)/f.step)*f.step).toFixed(4));
    return [f.key,Math.min(f.max,Math.max(f.min,stepped))];
  }));
}
export function readMapLights(storage) {
  try {const saved=JSON.parse(storage?.getItem(MAP_LIGHT_STORAGE_KEY)||'null');return normalizeMapLights(saved?.version===1?saved.settings:{});}catch{return {...DEFAULT_MAP_LIGHTS};}
}
export function saveMapLights(storage,settings) {
  try {if(!storage)return false;let previous;try{previous=JSON.parse(storage.getItem(MAP_LIGHT_STORAGE_KEY)||'null');}catch{}
    if(previous?.version!==1||!previous.settings||typeof previous.settings!=='object'||Array.isArray(previous.settings))previous={};
    storage.setItem(MAP_LIGHT_STORAGE_KEY,JSON.stringify({...previous,version:1,settings:{...previous.settings,...normalizeMapLights(settings)}}));return true;}catch{return false;}
}

// UI owns only its own versioned map snapshot; never writes building-study libraries.
export function mountMapLightControls(host, {storage, onChange, isNight}) {
  let settings = readMapLights(storage);
  const inputs = new Map();
  const groups = document.createElement('div');
  const mode = document.createElement('p'); mode.className = 'hint'; mode.id = 'mapLightMode';
  const status = document.createElement('p'); status.className = 'map-light-status';
  status.id = 'mapLightStatus'; status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  function sync() {
    for (const [key, pair] of inputs) for (const input of pair) input.value = String(settings[key]);
  }
  function commit(next, message) {
    settings = normalizeMapLights(next); sync(); onChange({...settings});
    const saved = saveMapLights(storage, settings);
    status.textContent = saved ? message : '已实时应用，但浏览器未允许保存；刷新后可能丢失。';
    status.classList.toggle('warn', !saved);
  }
  for (const group of MAP_LIGHT_GROUPS) {
    const section = document.createElement('details'); section.className = 'map-light-group'; section.open = group.id === 'bloom';
    const title = document.createElement('summary'); title.textContent = group.label; section.append(title);
    const hint = document.createElement('p'); hint.className = 'hint'; hint.textContent = group.hint; section.append(hint);
    for (const field of MAP_LIGHT_FIELDS.filter(f => f.group === group.id)) {
      const row = document.createElement('div'); row.className = 'map-light-field';
      const label = document.createElement('label'); label.htmlFor = `map-light-${field.key}`; label.textContent = field.label;
      const value = document.createElement('div'); value.className = 'map-light-value';
      const number = document.createElement('input'); number.type = 'number'; number.id = `map-light-${field.key}-value`;
      number.setAttribute('aria-label',`${field.label}数值`); number.inputMode = 'decimal';
      const range = document.createElement('input'); range.type = 'range'; range.id = label.htmlFor;
      range.setAttribute('aria-label',field.label);
      for (const input of [range,number]) { input.min = field.min; input.max = field.max; input.step = field.step; }
      const unit = document.createElement('span'); unit.textContent = field.unit || ''; unit.setAttribute('aria-hidden','true');
      value.append(number,unit); row.append(label,value,range); section.append(row); inputs.set(field.key,[range,number]);
      range.addEventListener('input',()=>commit({...settings,[field.key]:range.valueAsNumber},'已自动保存到本浏览器 · 刷新 / 切换时段后保留'));
      number.addEventListener('input',()=>{
        const n=number.valueAsNumber;
        // Ignore transient empty / out-of-range text while typing; don't overwrite it mid-edit.
        if(Number.isFinite(n)&&n>=field.min&&n<=field.max) {
          settings=normalizeMapLights({...settings,[field.key]:n}); range.value=String(settings[field.key]); onChange({...settings});
          const saved=saveMapLights(storage,settings);
          status.textContent=saved?'已自动保存到本浏览器 · 刷新 / 切换时段后保留':'已实时应用，但浏览器未允许保存；刷新后可能丢失。';
          status.classList.toggle('warn',!saved);
        }
      });
      number.addEventListener('change',()=>{
        const n=number.valueAsNumber;
        if(Number.isFinite(n))commit({...settings,[field.key]:n},'已保存 · 数值按范围与步长校正');else sync();
      });
    }
    groups.append(section);
  }
  const reset = document.createElement('button'); reset.type='button'; reset.id='mapLightReset';reset.textContent='恢复地图默认';
  reset.addEventListener('click',()=>commit(DEFAULT_MAP_LIGHTS,'已恢复并保存地图默认 · 不改动试灯方案'));
  host.append(mode,groups,reset,status); sync(); onChange({...settings});
  status.textContent='滑动或输入数值即时生效 · 自动保存 · 不覆盖试灯存档';
  const updateMode=()=>{mode.textContent=isNight()?'夜景实时生效 · × 表示相对当前试灯方案的倍率':'当前白天：参数仍会保存，切换夜晚生效；不改变白天照明。';};
  updateMode();
  return {
    updateMode,
    get settings(){return {...settings};},
    reload(){settings=readMapLights(storage);sync();onChange({...settings});status.textContent='已同步本浏览器保存的地图灯光参数';status.classList.remove('warn');},
  };
}
