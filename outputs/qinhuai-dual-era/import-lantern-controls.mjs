import {LANTERN_LIGHT_KEY,LANTERN_GROUPS,LANTERN_POSITIONED_LIGHTS,normalizeLantern,normalizeLanternTransforms,readLanternRecord,saveLantern,saveLanternTransforms} from './import-lantern-settings.mjs';
import {migratePlacedLanternLighting} from './import-placeable-lantern-settings.mjs';

export function mountLanternControls(host,{rig,storage,onFocus,placementLayer,onPlacementFocus,onPlacedFocus}){
 let selected='mountain',record=migratePlacedLanternLighting(storage),selectedPlacement=LANTERN_POSITIONED_LIGHTS[0].id,transforms=record.transforms;
 rig.loadSettings(record.groups);
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const section=el('details',null,'map-light-group');section.id='lanternLightPanel';section.append(el('summary','花灯与挂灯 · 逐组调节'));host.append(section);
 section.append(el('p','保留当前光效为默认：亮度 1 倍、沿用原灯色。新增环境外溢默认关闭，开启后照亮附近地面、树木、墙面与人物。','hint'));
 const label=el('label','选择花灯 / 挂灯');label.htmlFor='lantern-group';const select=el('select');select.id=label.htmlFor;
 for(const [id,title] of LANTERN_GROUPS){const o=el('option',title);o.value=id;select.append(o);}section.append(label,select);
 const focus=el('button','定位此灯组');focus.type='button';focus.id='lantern-focus';section.append(focus);
 const body=el('details',null,'map-light-group');body.id='lanternBodyPanel';body.append(el('summary','灯体光效'));
 const spill=el('details',null,'map-light-group');spill.id='lanternSpillPanel';spill.append(el('summary','环境外溢'));
 const inputs=new Map();let haloRow;
 const value=(p,key)=>key.startsWith('spill.')?p.spill[key.slice(6)]:p[key];
 function patch(key,v){const p=rig.getSettings(selected);if(key.startsWith('spill.'))p.spill={...p.spill,[key.slice(6)]:v};else p[key]=v;if(key==='color')p.inheritColor=false;if(key==='spill.color')p.spill.inheritColor=false;commit(p);}
 function check(parent,key,title){const row=el('label',null,'environment-check'),input=el('input');input.type='checkbox';input.id='lantern-'+key.replace('.','-');row.append(input,document.createTextNode(title));parent.append(row);inputs.set(key,[input]);input.onchange=()=>patch(key,input.checked);}
 function tint(parent,key,title){const row=el('div',null,'environment-color-row'),label=el('label',title),input=el('input');input.type='color';input.id='lantern-'+key.replace('.','-');label.htmlFor=input.id;row.append(label,input);parent.append(row);inputs.set(key,[input]);input.oninput=()=>patch(key,input.value);}
 function slider(parent,key,title,min,max,step){const row=el('div',null,'map-light-field'),label=el('label',title),wrap=el('div',null,'map-light-value'),range=el('input'),number=el('input');range.type='range';number.type='number';range.id='lantern-'+key.replace('.','-');label.htmlFor=range.id;number.setAttribute('aria-label',title+'数值');for(const input of [range,number]){input.min=min;input.max=max;input.step=step;}wrap.append(number);row.append(label,wrap,range);parent.append(row);inputs.set(key,[range,number]);range.oninput=()=>patch(key,range.valueAsNumber);number.onchange=()=>Number.isFinite(number.valueAsNumber)?patch(key,number.valueAsNumber):sync();return row;}
 check(section,'modelVisible','灯模型显示开关');section.append(body,spill);
 check(body,'enabled','启用灯体光效');slider(body,'brightness','灯体亮度 · 当前效果 ×',0,8,.05);check(body,'inheritColor','沿用当前默认灯色');tint(body,'color','灯体颜色');haloRow=slider(body,'halo','已有光晕强度 ×',0,3,.05);
 check(spill,'spill.enabled','启用额外环境外溢');check(spill,'spill.inheritColor','外溢跟随灯体颜色');tint(spill,'spill.color','独立外溢颜色');slider(spill,'spill.intensity','环境外溢强度',0,3,.05);slider(spill,'spill.distance','外溢最远距离',0,20,.1);slider(spill,'spill.decayDistance','亮度衰减距离',0,15,.1);slider(spill,'spill.feather','边缘柔和程度',0,1,.01);
 spill.append(el('p','距离单位沿用主地图。光线从灯体向四周扩散；光源之间采用柔和合并，避免密集挂灯叠加过曝。原有地面光斑、倒影及建筑灯效继续保留。','hint'));

 const placement=el('details',null,'map-light-group');placement.id='lanternPlacementPanel';placement.append(el('summary','灯具摆位 · 位置与旋转'));host.append(placement);
 placement.append(el('p','可在场景中直接点击腾马灯选中，也可在此切换左、右灯具。位置与旋转独立保存，不改变灯光参数。','hint'));
 const placementLabel=el('label','选择灯具');placementLabel.htmlFor='lantern-placement';const placementSelect=el('select');placementSelect.id=placementLabel.htmlFor;
 for(const target of LANTERN_POSITIONED_LIGHTS){const option=el('option',target.label);option.value=target.id;placementSelect.append(option);}placement.append(placementLabel,placementSelect);
 const placementInputs=new Map();
 function placementSlider(key,title,min,max,step){const row=el('div',null,'map-light-field'),label=el('label',title),wrap=el('div',null,'map-light-value'),range=el('input'),number=el('input');range.type='range';number.type='number';range.id='lantern-placement-'+key;label.htmlFor=range.id;number.setAttribute('aria-label',title+'数值');for(const input of [range,number]){input.min=min;input.max=max;input.step=step;}wrap.append(number);row.append(label,wrap,range);placement.append(row);placementInputs.set(key,[range,number]);range.oninput=()=>patchPlacement(key,range.valueAsNumber);number.onchange=()=>Number.isFinite(number.valueAsNumber)?patchPlacement(key,number.valueAsNumber):syncPlacements();}
 placementSlider('x','X 位置',-100,100,.1);placementSlider('y','Y 高度',0,100,.1);placementSlider('z','Z 位置',-100,100,.1);placementSlider('yaw','Y 轴旋转',-360,360,1);
 const placementFocus=el('button','定位选中灯具');placementFocus.type='button';placementFocus.id='lantern-placement-focus';const placementReset=el('button','恢复此灯默认摆位');placementReset.type='button';placementReset.id='lantern-placement-reset';const placementRow=el('div',null,'row');placementRow.append(placementFocus,placementReset);placement.append(placementRow);
 const placementStatus=el('p',null,'map-light-status');placementStatus.id='lantern-placement-status';placementStatus.setAttribute('role','status');placement.append(placementStatus);
 function applyTransforms(){
  const pair=LANTERN_POSITIONED_LIGHTS.filter(target=>target.kind==='tengma').sort((a,b)=>a.instance-b.instance).map(target=>({...transforms[target.id],yaw:transforms[target.id].yaw*Math.PI/180}));
  placementLayer?.setTengmaPlacements(pair);rig.invalidate?.();
 }
 function syncPlacements(){const current=transforms[selectedPlacement];placementSelect.value=selectedPlacement;for(const [key,pair] of placementInputs)for(const input of pair)input.value=current[key];}
 function savedPlacement(ok){placementStatus.textContent=ok?'摆位已保存在当前浏览器，文件存档状态见主场景保存提示。':'摆位已应用，但浏览器保存失败，请保留页面。';placementStatus.classList.toggle('warn',!ok);if(ok)section.dispatchEvent(new Event('change',{bubbles:true}));}
 function patchPlacement(key,value){transforms=normalizeLanternTransforms({...transforms,[selectedPlacement]:{...transforms[selectedPlacement],[key]:value}});applyTransforms();savedPlacement(saveLanternTransforms(storage,transforms));syncPlacements();}
 placementSelect.onchange=()=>{selectedPlacement=placementSelect.value;syncPlacements();placementStatus.textContent='切换灯具不会改变其他灯具的摆位。';};
 placementFocus.onclick=async()=>{placementFocus.disabled=true;try{await onPlacementFocus?.(selectedPlacement,transforms[selectedPlacement]);}catch(error){placementStatus.textContent='定位失败：'+error.message;}finally{placementFocus.disabled=false;}};
 placementReset.onclick=()=>{const defaults=normalizeLanternTransforms()[selectedPlacement];transforms=normalizeLanternTransforms({...transforms,[selectedPlacement]:defaults});applyTransforms();savedPlacement(saveLanternTransforms(storage,transforms));syncPlacements();};

 const presets=el('details',null,'map-light-group');presets.append(el('summary','此灯组方案 · 另存与恢复'));section.append(presets);
 const name=el('input');name.id='lantern-preset-name';name.placeholder='方案名称';name.setAttribute('aria-label','花灯方案名称');name.maxLength=80;
 const save=el('button','另存为新方案');save.type='button';save.id='lantern-preset-save';const row=el('div',null,'row');row.append(name,save);presets.append(row);
 const savedSelect=el('select');savedSelect.id='lantern-preset-select';savedSelect.setAttribute('aria-label','已存花灯方案');const apply=el('button','应用选中方案');apply.type='button';apply.id='lantern-preset-apply';presets.append(savedSelect,apply);
 const reset=el('button','恢复此灯组当前默认效果');reset.type='button';reset.id='lantern-reset';presets.append(reset);
 const status=el('p',null,'map-light-status');status.id='lantern-status';status.setAttribute('role','status');section.append(status);
 const loaded=el('p',null,'hint');loaded.id='lantern-loaded';section.append(loaded);
 function sync(){const p=rig.getSettings(selected),base=rig.baseColor(selected);for(const [key,pair] of inputs)for(const input of pair){if(input.type==='checkbox')input.checked=value(p,key);else input.value=key==='color'&&p.inheritColor?base:key==='spill.color'&&p.spill.inheritColor?(p.inheritColor?base:p.color):value(p,key);}haloRow.hidden=!['tree','courtyard','red'].includes(selected);select.value=selected;loaded.textContent=rig.counts?.[selected]?'已加载此灯组，可实时预览。':'此灯组加载后自动应用；可点击定位查看。';}
 function refreshPresets(){record=readLanternRecord(storage);savedSelect.replaceChildren();for(const p of record.presets.filter(p=>p.group===selected)){const o=el('option',p.name);o.value=p.id;savedSelect.append(o);}apply.disabled=!savedSelect.options.length;}
 function savedMessage(ok){status.textContent=ok?'已保存在当前浏览器，文件存档状态见主场景保存提示。':'已应用，但浏览器保存失败，请保留页面。';status.classList.toggle('warn',!ok);if(ok)section.dispatchEvent(new Event('change',{bubbles:true}));}
 function commit(p){rig.setSettings(selected,p);savedMessage(saveLantern(storage,selected,rig.getSettings(selected)));sync();}
 select.onchange=()=>{selected=select.value;sync();refreshPresets();status.textContent='各灯组独立保存；默认值沿用当前效果。';};
 focus.onclick=async()=>{focus.disabled=true;try{const group=LANTERN_GROUPS.find(g=>g[0]===selected);if(group[2])await onFocus?.(group[2]);else{const item=rig.placed?.record.instances.find(item=>item.kind===selected&&rig.placed.objects.has(item.id));if(item)await onPlacedFocus?.(item.id);else status.textContent='场景中尚未添加此类灯具，可在添加与摆位中放置。';}}catch(error){status.textContent='定位失败：'+error.message;}finally{focus.disabled=false;}};
 save.onclick=()=>{const title=name.value.trim();if(!title){status.textContent='请先填写方案名称。';name.focus();return;}const ok=saveLantern(storage,selected,rig.getSettings(selected),{id:crypto.randomUUID(),name:title,createdAt:new Date().toISOString()});savedMessage(ok);refreshPresets();if(ok)savedSelect.selectedIndex=savedSelect.options.length-1;};
 apply.onclick=()=>{const p=record.presets.find(p=>p.group===selected&&p.id===savedSelect.value);if(p)commit(p.settings);};
 reset.onclick=()=>commit(normalizeLantern());rig.onUpdate=sync;applyTransforms();sync();syncPlacements();refreshPresets();status.textContent='默认沿用当前效果；调节后自动保存，亦可另存多个方案。';
 return {reload(){record=migratePlacedLanternLighting(storage);rig.loadSettings(record.groups);transforms=record.transforms;applyTransforms();sync();syncPlacements();refreshPresets();},selectPlacement(id){if(!LANTERN_POSITIONED_LIGHTS.some(target=>target.id===id))return;selectedPlacement=id;placement.open=true;syncPlacements();placementStatus.textContent='已从场景选中此灯具，可调整位置与旋转。';},key:LANTERN_LIGHT_KEY};
}
