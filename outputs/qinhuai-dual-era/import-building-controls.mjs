import {hasWindowFloors,normalizeWindowFloors,mountWindowFloorControls} from './import-window-floors.mjs';
import {normalizeGateGround,mountGateGroundControls} from './import-gate-ground.mjs';
import {BRIDGE_ID,BRIDGE_PARTS,BRIDGE_PRESET} from './import-bridge-config.mjs';
export const BUILDING_LIGHT_KEY='qinhuai.main-building-lights.v1';
export const BUILDING_PARTS=[['eave','檐口与轮廓'],['roof','屋面柔光'],['facade','墙柱照明'],['window','窗户透光'],['sign','匾额照明'],['trim','墙顶与装饰'],...BRIDGE_PARTS];
const number=(v,d,max)=>typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(0,v)):d;
export function normalizeBuilding(value={}){
 if(!value||typeof value!=='object'||Array.isArray(value))value={};
 const out={...value,enabled:value.enabled!==false,brightness:number(value.brightness,1,3),parts:{...value.parts},redLanterns:{...value.redLanterns,enabled:value.redLanterns?.enabled!==false}};
 for(const [id] of BUILDING_PARTS){const p=value.parts?.[id]||{};out.parts[id]={...p,enabled:p.enabled!==false,brightness:number(p.brightness,1,4),inheritColor:p.inheritColor!==false,color:/^#[a-f0-9]{6}$/i.test(p.color)?p.color:(BRIDGE_PRESET[id]?.color||'#ffbd68')};}
 if(value.windowFloors!==undefined)out.windowFloors=normalizeWindowFloors(value.windowFloors);
 if(value.groundProjection!==undefined)out.groundProjection=normalizeGateGround(value.groundProjection);
 return out;
}
export function readBuildingLights(storage){try{const r=JSON.parse(storage?.getItem(BUILDING_LIGHT_KEY)||'null');if(r?.version===1&&r.buildings&&typeof r.buildings==='object'&&!Array.isArray(r.buildings))return {...r,presets:Array.isArray(r.presets)?r.presets:[]};}catch{}return {version:1,buildings:{},presets:[]};}
export function writeBuildingLight(storage,id,settings,preset){
 if(!storage||!id)return false;
 try{const r=readBuildingLights(storage);r.buildings[id]=normalizeBuilding(settings);if(preset)r.presets.push({...preset,building:id,settings:structuredClone(r.buildings[id])});storage.setItem(BUILDING_LIGHT_KEY,JSON.stringify(r));return true;}catch{return false;}
}
export function mountBuildingControls(host,{rig,storage,redLanterns}){
 let selected='',record=readBuildingLights(storage),current=normalizeBuilding();rig.loadSettings(record.buildings);
 host.innerHTML=`<p class="hint">建筑本体灯光 · 基于当前收藏效果调节，1 倍保持原样。展开需要的模块即可操作。</p><button id="buildingBridgePreset" type="button" hidden>应用参考图 · 金栏暖石</button><div id="buildingLightModules"></div><details class="map-light-group" id="buildingLightPresets"><summary>本建筑 · 另存与恢复</summary><div class="row"><input id="buildingLightName" placeholder="方案名称" aria-label="建筑灯光方案名称" maxlength="40"><button id="buildingLightSave" type="button">另存方案</button></div><div class="row"><select id="buildingLightSaved" aria-label="此建筑已存灯效"></select><button id="buildingLightApply" type="button">应用方案</button></div><button id="buildingLightReset" type="button">恢复原灯效（保留收藏）</button></details><p id="buildingLightStatus" class="hint" role="status" aria-live="polite"></p>`;
 redLanterns?.loadBuildingSettings(record.buildings);
 const $=id=>host.querySelector('#'+id),status=$('buildingLightStatus'),fields=[];
 function slider(section,id,label,max,read,write){const row=document.createElement('div');row.className='map-light-field';row.innerHTML=`<label for="${id}">${label}</label><div class="map-light-value"><input id="${id}-value" aria-label="${label}数值" type="number" min="0" max="${max}" step=".05"></div><input id="${id}" aria-label="${label}" type="range" min="0" max="${max}" step=".05">`;section.append(row);for(const el of row.querySelectorAll('input')){fields.push(()=>{el.value=read();el.disabled=!selected;});el.oninput=()=>{if(Number.isFinite(el.valueAsNumber)){write(el.valueAsNumber);commit();}};}}
 function checkbox(section,id,label,read,write){const row=document.createElement('label');row.className='environment-check';row.innerHTML=`<input id="${id}" type="checkbox">${label}`;section.append(row);const el=row.firstElementChild;fields.push(()=>{el.checked=read();el.disabled=!selected;});el.onchange=()=>{write(el.checked);commit();};}
 for(const [id,label] of [['master','建筑总控'],...BUILDING_PARTS]){
  const section=document.createElement('details');section.className='map-light-group';section.id='building-module-'+id;section.innerHTML=`<summary>${label}</summary>`;$('buildingLightModules').append(section);
  const get=()=>id==='master'?current:current.parts[id];
  checkbox(section,'building-'+id+'-enabled','启用'+label,()=>get().enabled,v=>get().enabled=v);
  slider(section,'building-'+id+'-brightness',id==='master'?'建筑总亮度倍率':'本模块亮度倍率',id==='master'?3:4,()=>get().brightness,v=>get().brightness=v);
  if(id!=='master'){
   checkbox(section,'building-'+id+'-inherit','沿用原收藏光色',()=>get().inheritColor,v=>get().inheritColor=v);
   const row=document.createElement('div');row.className='environment-color-row';row.innerHTML=`<label for="building-${id}-color">光照颜色</label><input id="building-${id}-color" aria-label="${label}颜色" type="color"><input id="building-${id}-hex" aria-label="${label}颜色值" maxlength="7">`;section.append(row);
   const color=row.querySelector('[type=color]'),hex=row.lastElementChild;fields.push(()=>{color.value=hex.value=get().color;color.disabled=hex.disabled=!selected;});
   color.oninput=()=>{get().color=color.value;get().inheritColor=false;commit();};hex.onchange=()=>{if(/^#[a-f0-9]{6}$/i.test(hex.value)){get().color=hex.value;get().inheritColor=false;commit();}else sync();};
  }
 }
 const redSection=document.createElement('details');redSection.className='map-light-group';redSection.id='buildingRedLanterns';redSection.innerHTML='<summary>屋檐红灯笼</summary>';$('buildingLightModules').append(redSection);
 checkbox(redSection,'building-red-lanterns-enabled','启用屋檐红灯笼',()=>current.redLanterns.enabled,v=>current.redLanterns.enabled=v);
 fields.push(()=>{redSection.hidden=!redLanterns?.supportsBuilding(selected);});
 let floors=normalizeWindowFloors();
 const floorHost=document.createElement('div');floorHost.id='buildingWindowFloors';floorHost.hidden=true;$('buildingLightModules').after(floorHost);
 const floorControls=mountWindowFloorControls(floorHost,{read:()=>floors,commit:()=>{current.windowFloors=normalizeWindowFloors(floors);commit();}});
 const groundSection=document.createElement('details');groundSection.className='map-light-group';groundSection.id='buildingGateGround';groundSection.hidden=true;$('buildingLightModules').after(groundSection);
 const groundControls=mountGateGroundControls(groundSection,{read:()=>current.groundProjection,commit:value=>{current.groundProjection=normalizeGateGround(value);commit();}});
 function sync(){floors=normalizeWindowFloors(current.windowFloors,rig.environment?.getSettings(selected));floorHost.hidden=!hasWindowFloors(selected);floorControls.sync();floorControls.setAvailability(rig.getWindowAvailability?.(selected));groundSection.hidden=selected!=='gate';groundControls.sync();$('buildingBridgePreset').hidden=selected!==BRIDGE_ID;for(const f of fields)f();const available=rig.getParts(selected);for(const [id] of BUILDING_PARTS){const el=$('building-module-'+id);el.hidden=!available.includes(id);if(id==='window')el.querySelector('summary').textContent=hasWindowFloors(selected)?'窗户共同基准 · 原有设置':'窗户透光';}const presets=record.presets.filter(p=>p.building===selected);const select=$('buildingLightSaved'),old=select.value;select.replaceChildren();for(const p of presets){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;select.append(o);}if(presets.some(p=>p.id===old))select.value=old;$('buildingLightApply').disabled=!presets.length;$('buildingLightSave').disabled=$('buildingLightReset').disabled=!selected;}
 function commit(preset){if(!selected)return;if(selected==='gate')current.groundProjection=normalizeGateGround(current.groundProjection);current=normalizeBuilding(current);rig.setSettings(selected,current);redLanterns?.setBuildingSettings(selected,current);const ok=writeBuildingLight(storage,selected,current,preset);if(ok){record=readBuildingLights(storage);host.dispatchEvent(new Event('change',{bubbles:true}));}sync();status.textContent=ok?'此建筑调整已保存到浏览器 · 文件落盘状态见顶部存档栏':'调整已应用，浏览器保存失败，请导出备份';}
 $('buildingLightSave').onclick=()=>{const name=$('buildingLightName').value.trim();if(!name){status.textContent='请填写方案名称';return;}const preset={id:crypto.randomUUID(),name,createdAt:new Date().toISOString()};commit(preset);$('buildingLightSaved').value=preset.id;};
 $('buildingLightApply').onclick=()=>{const p=record.presets.find(p=>p.id===$('buildingLightSaved').value&&p.building===selected);if(p){current=normalizeBuilding(p.settings);commit();}};
 $('buildingBridgePreset').onclick=()=>{const parts={...current.parts};for(const [id] of BRIDGE_PARTS)parts[id]={...parts[id],enabled:true,brightness:1,inheritColor:true,color:BRIDGE_PRESET[id].color};current=normalizeBuilding({...current,enabled:true,brightness:1,parts});commit();status.textContent='已应用参考图预设：金色栏杆、暖白桥身、淡粉桥洞 · 已保留全部收藏';};
 $('buildingLightReset').onclick=()=>{current=normalizeBuilding();commit();};
 function select(id){selected=id;record=readBuildingLights(storage);current=normalizeBuilding(record.buildings[id]);sync();status.textContent='仅调节当前选中的建筑 · 关闭模块可收起，参数继续生效';}
 if(rig.environment)rig.environment.onWindowSourcesChange=()=>floorControls.setAvailability(rig.getWindowAvailability?.(selected));
 sync();return {select,reload(){record=readBuildingLights(storage);rig.loadSettings(record.buildings);redLanterns?.loadBuildingSettings(record.buildings);select(selected);}};
}
