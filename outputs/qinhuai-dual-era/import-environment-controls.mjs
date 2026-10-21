// Separate persistence: environmental spill never rewrites map or study presets.
export const ENVIRONMENT_STORAGE_KEY = 'qinhuai.building-environment.v1';
// Keep the previous neutral warm-white for old independent-color settings.
export const DEFAULT_ENVIRONMENT_COLOR = '#ffecd4';
export function normalizeEnvironmentColor(value) {
  if(typeof value !== 'string') return DEFAULT_ENVIRONMENT_COLOR;
  const text=value.trim().toLowerCase();
  if(/^#[0-9a-f]{6}$/.test(text)) return text;
  if(/^#[0-9a-f]{3}$/.test(text)) return '#'+[...text.slice(1)].map(c=>c+c).join('');
  return DEFAULT_ENVIRONMENT_COLOR;
}
export const ENVIRONMENT_FIELDS = [
  {key:'intensity',label:'环境辐射强度',min:0,max:1,step:.05,value:.2},
  {key:'distance',label:'照射距离',min:0,max:30,step:.1,value:4,unit:'场景单位'},
  {key:'angle',label:'外溢展开角度（°）',min:10,max:160,step:1,value:90},
  {key:'decayDistance',label:'辐射衰减距离',min:0,max:15,step:.1,value:4,unit:'场景单位'},
  {key:'feather',label:'辐射边缘羽化',min:0,max:1,step:.01,value:.7},
];
export function normalizeEnvironment(value={}, enabled=false) {
  if(!value || typeof value!=='object' || Array.isArray(value)) value={};
  const out={enabled:typeof value.enabled==='boolean'?value.enabled:enabled,inheritColor:typeof value.inheritColor==='boolean'?value.inheritColor:true,color:normalizeEnvironmentColor(value.color)};
  for(const f of ENVIRONMENT_FIELDS){
    const n=typeof value[f.key]==='number'&&Number.isFinite(value[f.key])?value[f.key]:f.value;
    out[f.key]=Number((f.min+Math.round((Math.max(f.min,Math.min(f.max,n))-f.min)/f.step)*f.step).toFixed(4));
  }
  return out;
}
export function readEnvironment(storage) {
  try {
    const data=JSON.parse(storage?.getItem(ENVIRONMENT_STORAGE_KEY)||'null');
    if(data?.version!==1||!data.buildings||typeof data.buildings!=='object'||Array.isArray(data.buildings))return {};
    return Object.fromEntries(Object.entries(data.buildings).filter(([id,v])=>id&&v&&typeof v==='object'&&!Array.isArray(v)).map(([id,v])=>[id,{...v}]));
  } catch{return {};}
}
export function saveEnvironment(storage,buildings) {
  try {if(!storage)return false;let previous;try{previous=JSON.parse(storage.getItem(ENVIRONMENT_STORAGE_KEY)||'null');}catch{}
    if(previous?.version!==1||!previous.buildings||typeof previous.buildings!=='object'||Array.isArray(previous.buildings))previous={};
    storage.setItem(ENVIRONMENT_STORAGE_KEY,JSON.stringify({...previous,version:1,buildings:{...previous.buildings,...buildings}}));return true;}catch{return false;}
}
export function environmentFalloff(distance,settings) {
  const p=normalizeEnvironment(settings);
  if(!p.enabled||!p.intensity||!p.distance||!p.decayDistance||distance>=p.distance)return 0;
  const t=Math.max(0,Math.min(1,(distance/p.distance-(1-Math.max(.02,p.feather)))/Math.max(.02,p.feather)));
  return p.intensity*Math.exp(-Math.max(0,distance)/p.decayDistance)*(1-t*t*(3-2*t));
}
export function mountEnvironmentControls(host,{rig,storage,isNight,onFocus,buildingControls}) {
  let saved=readEnvironment(storage),selected='',catalog=[],focusRequest=0;
  const section=document.createElement('details');section.className='map-light-group';section.id='environmentSpillPanel';
  const summary=document.createElement('summary');summary.textContent='环境辐射溢出';section.append(summary);
  const hint=document.createElement('p');hint.className='hint';hint.textContent='每栋建筑独立保存。外溢照亮附近地面、墙面、树木和街边物件，根据距离、高度和表面朝向柔和衰减，并叠加在已有建筑灯效上。';section.append(hint);
  const label=document.createElement('label');label.htmlFor='environment-building';label.textContent='选择建筑';
  const select=document.createElement('select');select.id=label.htmlFor;select.setAttribute('aria-label','环境辐射建筑');host.append(label,select);
  const focusRow=document.createElement('div');focusRow.className='environment-focus-row';
  const focusButton=document.createElement('button');focusButton.type='button';focusButton.id='environment-focus';focusButton.textContent='定位此建筑';
  const autoLabel=document.createElement('label');autoLabel.className='environment-check';
  const autoFocus=document.createElement('input');autoFocus.type='checkbox';autoFocus.id='environment-auto-focus';autoFocus.checked=true;
  autoLabel.append(autoFocus,document.createTextNode('切换建筑时自动定位'));focusRow.append(focusButton,autoLabel);host.append(focusRow);
  const focusHint=document.createElement('p');focusHint.id='environment-focus-status';focusHint.className='hint';focusHint.setAttribute('role','status');focusHint.setAttribute('aria-live','polite');focusHint.textContent='定位后可继续拖动视角，观察建筑及周边物件的外溢。';host.append(focusHint);
  if(buildingControls?.host)host.append(buildingControls.host);
  async function focusSelected(){
    if(!selected||typeof onFocus!=='function')return;
    const id=selected,request=++focusRequest,name=catalog.find(b=>b.id===id)?.label||id;
    focusButton.setAttribute('aria-busy','true');focusHint.textContent='正在定位 '+name+'…';focusHint.classList.toggle('warn',false);
    try{
      const result=await onFocus(id,{isCurrent:()=>request===focusRequest&&id===selected});
      if(request!==focusRequest||id!==selected)return;
      focusHint.textContent=result?.cancelled?'已保留当前视角，可再次点击定位。':'已定位 '+name+' · 可拖动 / 缩放查看外溢';
    }catch(error){if(request===focusRequest&&id===selected){focusHint.textContent='定位未完成：'+error.message;focusHint.classList.toggle('warn',true);}}
    finally{if(request===focusRequest)focusButton.setAttribute('aria-busy','false');}
  }
  focusButton.addEventListener('click',focusSelected);
  const inputs=new Map();
  for(const [key,title] of [['enabled','启用环境辐射'],['inheritColor','跟随建筑原灯光颜色']]){
    const row=document.createElement('label');row.className='environment-check';
    const input=document.createElement('input');input.type='checkbox';input.id=`environment-${key}`;input.setAttribute('aria-label',title);
    row.append(input,document.createTextNode(title));section.append(row);inputs.set(key,[input]);
    input.addEventListener('change',()=>commit({...current(),[key]:input.checked}));
  }
  const colorRow=document.createElement('div');colorRow.className='environment-color-row';
  const colorLabel=document.createElement('label');colorLabel.htmlFor='environment-color';colorLabel.textContent='外溢光色';
  const colorInput=document.createElement('input');colorInput.type='color';colorInput.id=colorLabel.htmlFor;colorInput.setAttribute('aria-label','外溢光照颜色');
  const colorHex=document.createElement('input');colorHex.type='text';colorHex.id='environment-color-hex';colorHex.maxLength=7;colorHex.spellcheck=false;colorHex.setAttribute('aria-label','外溢颜色十六进制');
  colorHex.setAttribute('placeholder','#ffecd4');colorRow.append(colorLabel,colorInput,colorHex);section.append(colorRow);inputs.set('color',[colorInput,colorHex]);
  const colorHint=document.createElement('p');colorHint.className='hint';colorHint.id='environment-color-status';section.append(colorHint);
  colorInput.addEventListener('input',()=>commit({...current(),color:colorInput.value,inheritColor:false}));
  colorHex.addEventListener('input',()=>{if(/^#[0-9a-f]{6}$/i.test(colorHex.value))commit({...current(),color:colorHex.value,inheritColor:false},colorHex);});
  colorHex.addEventListener('change',()=>/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(colorHex.value.trim())?commit({...current(),color:colorHex.value,inheritColor:false}):sync());
  for(const f of ENVIRONMENT_FIELDS){
    const row=document.createElement('div');row.className='map-light-field';
    const label=document.createElement('label');label.htmlFor=`environment-${f.key}`;label.textContent=f.label;
    const value=document.createElement('div');value.className='map-light-value';
    const number=document.createElement('input');number.type='number';number.id=label.htmlFor+'-value';number.setAttribute('aria-label',f.label+'数值');
    const range=document.createElement('input');range.type='range';range.id=label.htmlFor;range.setAttribute('aria-label',f.label);
    for(const input of [range,number]){input.min=f.min;input.max=f.max;input.step=f.step;}
    value.append(number);row.append(label,value,range);section.append(row);inputs.set(f.key,[range,number]);
    range.addEventListener('input',()=>commit({...current(),[f.key]:range.valueAsNumber}));
    number.addEventListener('input',()=>{const n=number.valueAsNumber;if(Number.isFinite(n)&&n>=f.min&&n<=f.max)commit({...current(),[f.key]:n},number);});
    number.addEventListener('change',()=>Number.isFinite(number.valueAsNumber)?commit({...current(),[f.key]:number.valueAsNumber}):sync());
  }
  const note=document.createElement('p');note.className='hint';note.textContent='照射距离：从窗户 / 立面向周边表面照射的最远距离（0–30）。展开角度：10°–160°，越小越集中，越大覆盖越宽，同时影响地面、墙面和周围物件；默认 90° 保持原有范围。衰减距离：亮度递减的长度（0–15）。任一距离为 0 时关闭溢出；单位沿用地图场景比例。选色后自动使用独立外溢光色；勾选「跟随建筑原灯光颜色」可恢复继承，不会改动建筑本体颜色。';section.append(note);
  const reset=document.createElement('button');reset.type='button';reset.textContent='恢复此建筑默认';reset.addEventListener('click',()=>commit(normalizeEnvironment({},catalog.find(b=>b.id===selected)?.defaultEnabled)));section.append(reset);
  const status=document.createElement('p');status.id='environment-status';status.className='map-light-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');section.append(status);host.append(section);
  const diagnostics=document.createElement('p');diagnostics.id='environment-diagnostics';diagnostics.className='hint';section.append(diagnostics);
  rig.onDiagnostics=stats=>{diagnostics.textContent=`地面、墙面与物件受光 · 窗 / 立面光带 ${stats.windowStrips} · 已启用建筑 ${stats.activeSources}`;};
  function current(){return rig.getSettings(selected);}
  function sync(skip){const p=current();for(const [key,pair] of inputs)for(const el of pair){el.disabled=!selected;if(el===skip)continue;if(el.type==='checkbox')el.checked=p[key];else el.value=String(p[key]);}reset.disabled=!selected;focusButton.disabled=!selected||typeof onFocus!=='function';autoFocus.disabled=typeof onFocus!=='function';colorHint.textContent=p.inheritColor?'当前跟随建筑原灯光；选色即可改为独立外溢色。':'当前使用独立外溢色 '+p.color.toUpperCase()+' · 改变周边表面的受光颜色';}
  function mode(){status.textContent=!catalog.length?'夜景建筑加载后可逐栋调节。':(isNight()?'夜景实时生效':'白天预设待用')+' · 每栋独立自动保存 · 不覆盖试灯存档';}
  function commit(next,skip){if(!selected)return;rig.setSettings(selected,next);saved[selected]={...saved[selected],...current()};sync(skip);const ok=saveEnvironment(storage,saved);status.textContent=ok?'已保存此建筑全部参数 · 切换建筑 / 时段后保留':'已应用，但浏览器未允许保存；刷新后可能丢失';status.classList.toggle('warn',!ok);}
  function refresh(){catalog=rig.getCatalog();select.replaceChildren();for(const b of catalog){const option=document.createElement('option');option.value=b.id;option.textContent=b.label;select.append(option);}if(!catalog.some(b=>b.id===selected))selected=catalog.find(b=>b.defaultEnabled)?.id||catalog[0]?.id||'';select.value=selected;select.disabled=!selected;sync();mode();buildingControls?.select(selected);}
  select.addEventListener('change',()=>{selected=select.value;buildingControls?.select(selected);focusRequest++;focusButton.setAttribute('aria-busy','false');focusHint.textContent='可定位此建筑并观察周边外溢。';sync();mode();if(autoFocus.checked)return focusSelected();});
  rig.loadSettings(saved);rig.onCatalogChange=refresh;refresh();
  return {updateMode:mode,refresh,reload(){saved=readEnvironment(storage);rig.loadSettings(saved);sync();mode();}};
}
