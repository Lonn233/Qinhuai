export const DRAGON_STORAGE_KEY='qinhuai.dragon-wall-light.v1';
export const DRAGON_PARTS=[
 {id:'left',label:'左侧金龙',color:'#ffb72e',brightness:2.1,spill:.25,distance:3,position:[-11.9,12.45,5.5]},
 {id:'right',label:'右侧金龙',color:'#ffb72e',brightness:2.1,spill:.25,distance:3,position:[-6.8,12.45,5.3]},
 {id:'pearl',label:'中央宝珠',color:'#ff5635',brightness:1.8,spill:.15,distance:2,position:[-9.4,12.5,5.4]},
 {id:'wall',label:'红色墙面',color:'#ec431f',brightness:.7,spill:.12,distance:3,position:[-9.4,12.3,5.3]},
 {id:'roof',label:'顶部瓦檐',color:'#ffc66c',brightness:1.3,spill:.15,distance:3,position:[-9.4,13.35,5.3]},
 {id:'base',label:'下部台基',color:'#ffe0a0',brightness:.8,spill:.2,distance:3,position:[-9.4,11.6,5.3]},
 {id:'accent',label:'下部蓝紫点缀',color:'#493cff',brightness:1.35,spill:.08,distance:2,position:[-9.4,11.9,5.4]},
];
export const DRAGON_FIELDS=[{key:'brightness',label:'本体亮度',min:0,max:5,step:.05},{key:'spill',label:'环境外溢强度',min:0,max:2,step:.01},{key:'distance',label:'外溢距离',min:0,max:10,step:.1}];
const bounded=(v,d,a,b)=>typeof v==='number'&&Number.isFinite(v)?Math.max(a,Math.min(b,v)):d;
export function normalizeDragon(value={}){
 if(!value||typeof value!=='object')value={};
 const parts={...value.parts};
 for(const def of DRAGON_PARTS){const old=parts[def.id]||{};parts[def.id]={...old,enabled:typeof old.enabled==='boolean'?old.enabled:true,color:/^#[a-f0-9]{6}$/i.test(old.color)?old.color.toLowerCase():def.color};for(const f of DRAGON_FIELDS)parts[def.id][f.key]=bounded(old[f.key],def[f.key],f.min,f.max);}
 return {...value,enabled:typeof value.enabled==='boolean'?value.enabled:true,master:bounded(value.master,1,0,2),texture:bounded(value.texture,.95,0,1),parts};
}
export function readDragon(storage){try{const v=JSON.parse(storage?.getItem(DRAGON_STORAGE_KEY)||'null');if(v?.version===1)return {...v,settings:normalizeDragon(v.settings),presets:Array.isArray(v.presets)?v.presets:[]};}catch{}return {version:1,settings:normalizeDragon(),presets:[]};}
export function saveDragon(storage,record){try{if(!storage)return false;const old=readDragon(storage);storage.setItem(DRAGON_STORAGE_KEY,JSON.stringify({...old,...record,version:1,settings:normalizeDragon(record.settings)}));return true;}catch{return false;}}
export function mountDragonControls(host,{rig,storage,onFocus}){
 let record=readDragon(storage),selected='left';rig.setSettings(record.settings);
 host.innerHTML=`<details id="dragonLightPanel" class="map-light-panel"><summary>龙墙 · 分区光效</summary>
 <p class="hint">金龙红墙 · 参考图预设。保留龙鳞彩绘，瓦檐暖金、宝珠朱红，下部蓝紫点缀。</p>
 <div class="row"><button id="dragonFocus" type="button">定位龙墙</button><button id="dragonReference" type="button">应用参考图预设</button></div>
 <label class="environment-check"><input id="dragonEnabled" type="checkbox">启用龙墙灯光</label>
 <div class="map-light-field"><label for="dragonMaster">整体亮度</label><input id="dragonMaster" type="range" min="0" max="2" step=".05"><output id="dragonMasterValue"></output></div>
 <div class="map-light-field"><label for="dragonTexture">纹理保留</label><input id="dragonTexture" type="range" min="0" max="1" step=".05"><output id="dragonTextureValue"></output></div>
 <label class="hint" for="dragonPart">选择要调节的部分</label><select id="dragonPart" style="width:100%;margin:8px 0"></select>
 <label class="environment-check"><input id="dragonPartEnabled" type="checkbox">启用此部分</label>
 <div class="environment-color-row"><label for="dragonColor">光照颜色</label><input id="dragonColor" type="color"><input id="dragonColorHex" aria-label="分区光色十六进制" type="text" maxlength="7"></div>
 <div id="dragonFields"></div><p class="hint">外溢使用无阴影局部光源，照亮附近可受光表面；距离单位沿用地图比例。0 表示关闭外溢。整体光晕沿用主地图设置。</p>
 <div class="row"><input id="dragonPresetName" type="text" placeholder="输入方案名称" aria-label="龙墙方案名称" maxlength="60"><button id="dragonSavePreset" type="button">另存方案</button></div>
 <div class="row"><select id="dragonPresets" aria-label="龙墙已存方案"></select><button id="dragonApplyPreset" type="button">应用方案</button></div>
 <p id="dragonStatus" class="hint" role="status" aria-live="polite"></p></details>`;
 const $=id=>host.querySelector('#'+id),status=$('dragonStatus'),inputs={};
 for(const p of DRAGON_PARTS){const o=document.createElement('option');o.value=p.id;o.textContent=p.label;$('dragonPart').append(o);}
 for(const f of DRAGON_FIELDS){const row=document.createElement('div');row.className='map-light-field';row.innerHTML=`<label for="dragon-${f.key}">${f.label}</label><div class="map-light-value"><input id="dragon-${f.key}-value" aria-label="${f.label}数值" type="number" min="${f.min}" max="${f.max}" step="${f.step}"></div><input id="dragon-${f.key}" aria-label="${f.label}" type="range" min="${f.min}" max="${f.max}" step="${f.step}">`;$('dragonFields').append(row);inputs[f.key]=[$('dragon-'+f.key),$('dragon-'+f.key+'-value')];for(const el of inputs[f.key])el.addEventListener('input',()=>{if(Number.isFinite(el.valueAsNumber)){record.settings.parts[selected][f.key]=el.valueAsNumber;commit(el);}});}
 function sync(skip){const s=record.settings,p=s.parts[selected];$('dragonEnabled').checked=s.enabled;$('dragonMaster').value=s.master;$('dragonMasterValue').textContent=s.master.toFixed(2);$('dragonTexture').value=s.texture;$('dragonTextureValue').textContent=Math.round(s.texture*100)+'%';$('dragonPartEnabled').checked=p.enabled;$('dragonColor').value=p.color;if(skip!==$('dragonColorHex'))$('dragonColorHex').value=p.color;for(const [k,els]of Object.entries(inputs))for(const el of els)if(el!==skip)el.value=p[k];}
 function commit(skip){record.settings=normalizeDragon(record.settings);rig.setSettings(record.settings);sync(skip);const ok=saveDragon(storage,record);status.textContent=ok?'当前调整已保留在浏览器 · 文件落盘状态见顶部存档栏':'已应用，但浏览器保存失败；请导出备份';if(ok)host.dispatchEvent(new Event('change',{bubbles:true}));}
 function presets(){const select=$('dragonPresets');select.replaceChildren();for(const p of record.presets){const o=document.createElement('option');o.value=p.id;o.textContent=p.name;select.append(o);}$('dragonApplyPreset').disabled=!record.presets.length;}
 $('dragonPart').onchange=()=>{selected=$('dragonPart').value;sync();};
 $('dragonEnabled').onchange=()=>{record.settings.enabled=$('dragonEnabled').checked;commit();};
 $('dragonPartEnabled').onchange=()=>{record.settings.parts[selected].enabled=$('dragonPartEnabled').checked;commit();};
 for(const [id,key]of [['dragonMaster','master'],['dragonTexture','texture']])$(id).oninput=()=>{record.settings[key]=$(id).valueAsNumber;commit();};
 $('dragonColor').oninput=()=>{record.settings.parts[selected].color=$('dragonColor').value;commit();};
 $('dragonColorHex').oninput=()=>{if(/^#[a-f0-9]{6}$/i.test($('dragonColorHex').value)){record.settings.parts[selected].color=$('dragonColorHex').value;commit($('dragonColorHex'));}};
 $('dragonColorHex').onchange=()=>sync();
 $('dragonReference').onclick=()=>{record.settings=normalizeDragon();commit();};
 $('dragonFocus').onclick=async()=>{try{status.textContent='正在定位龙墙…';await onFocus();status.textContent='已定位龙墙 · 可拖动旋转视角、切换分区调节';}catch(e){status.textContent='定位失败：'+e.message;}};
 $('dragonSavePreset').onclick=()=>{const name=$('dragonPresetName').value.trim();if(!name){status.textContent='请先填写方案名称';$('dragonPresetName').focus();return;}const latest=readDragon(storage);record.presets=[...latest.presets,{id:crypto.randomUUID(),name,settings:structuredClone(record.settings),createdAt:new Date().toISOString()}];commit();presets();$('dragonPresets').value=record.presets.at(-1).id;};
 $('dragonApplyPreset').onclick=()=>{const p=record.presets.find(p=>p.id===$('dragonPresets').value);if(p){record.settings=normalizeDragon(p.settings);commit();}};
 presets();sync();status.textContent='夜景显示分区预设 · 当前调整自动保存，另存方案不会覆盖旧方案';
 return {reload(){record=readDragon(storage);rig.setSettings(record.settings);presets();sync();}};
}
