import {normalizeManualSpill,createManualPoint,MAX_MANUAL_POINTS} from './manual-spill-profiles.mjs';
import {createManualSpillLayer} from './manual-spill.js';
import {createManualSpillControls} from './manual-spill-controls.js';
import {normalizeSurfaceSpill,sourceLevel,surfaceFloorSettings,updateSurfaceFloor} from './surface-spill-profiles.mjs';
import {createSurfaceControls} from './surface-spill-controls.js';
import {createSurfaceSpill} from './surface-spill.js';
import {normalizeWindowLight,windowFloorSettings,updateWindowFloor} from './window-light.mjs';
import {createWindowControls} from './window-controls.js';
import {RedLanternLayer} from '../../red-lantern-layer.js';
import {RED_LANTERN_KEY,readRedLantern,mountRedLanternControls} from '../../red-lantern-settings.mjs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {PRESETS,STORAGE_KEY,readSaved,CONTROL_GROUPS,COLOR_CONTROLS} from './profiles.mjs';
import {applyEnvironment} from './environment.mjs';
import {createBuildingLighting} from './lighting.js';
import {parseColorInput} from './color-input.mjs';
import {createSoftSpill,loadSoftSpill} from './soft-spill.js';
import {createSpillControls,readSpillState,saveSpill} from './spill-controls.js';
import {captureStudy,restoreStudy,hasSavedSpill,readStudyDraft,saveStudyDraft} from './study-state.mjs';
import {normalizeSpill} from './spill-profiles.mjs';
const $=id=>document.getElementById(id),host=$('viewport');
const query=new URLSearchParams(location.search);
const requestedBuilding=query.get('building');
let building=['temple','pavilion','matou'].includes(requestedBuilding)?requestedBuilding:'temple';
let floor,modelBounds,softSpill,redLanterns;
let manualSettings=normalizeManualSpill(),manualLayer,manualUI;
let surfaceSettings=normalizeSurfaceSpill(),surfaceLayer;const surfaceUI=new Map();
let windowSettings=normalizeWindowLight(),windowUI,windowSecondUI,windowSecondHost,windowMasterHost;
const redUI=mountRedLanternControls($('red-lantern-controls'),value=>{redLanterns?.configure(value);dirty=true;});
window.addEventListener('storage',event=>{if(event.key===RED_LANTERN_KEY){const value=readRedLantern();redUI.sync(value,building==='matou'&&Boolean(redLanterns));redLanterns?.configure(value);dirty=true;}});
const initialSpill=readSpillState(building);
let softSpillEnabled=initialSpill.enabled;
let spillSettings=initialSpill.settings,spillUI;
function assetBase(){return new URL('./assets/building-study/'+building+'/',location.href);}
function syncBuilding(){
 const pavilion=building==='pavilion',matou=building==='matou';
 if(windowMasterHost){windowMasterHost.hidden=!matou;if(matou)windowMasterHost.append($('region-window'));else $('wl-basic').prepend($('region-window'));}
 redUI.sync(readRedLantern(),false);
 $('red-detail').hidden=!matou;$('red-retry').hidden=true;
 $('trim-color-control').hidden=!matou;
 document.querySelector('label[for="windowColor"]').textContent=matou?'窗户透光颜色':'窗格 / 匾额光色';
 $('windowColor-code').setAttribute('aria-label',(matou?'窗户透光颜色':'窗格 / 匾额光色')+' HEX / RGB');
 const name=matou?'马头墙民居':pavilion?'魁星阁':'夫子庙中轴院落';
 $('soft-spill-toggle').disabled=false;
 $('soft-spill-help').textContent=matou?'原有灯效保持仅窗内透光；开启此项才额外叠加檐下外溢。':'只切换檐下柔光外溢，不改变现有建筑灯效与材质。';
 $('building-select').value=building;
 $('building-name').textContent=name;
 $('building-parts').textContent=matou?'沿河连排民居 · 阶梯檐口 · 白墙黑瓦':pavilion?'多层飞檐 · 屋面 · 塔身木构':'大殿 · 重檐 · 两侧廊房';
 $('building-caption').textContent='建筑灯光研究 / '+name;
 $('reset').textContent=matou?'全景视角':pavilion?'全塔视角':'全院视角';
 $('building-note').textContent=matou?'保留原始白墙黑瓦和纹理。墙顶压边与窗户光色可分别设置，各区域可独立开启环境外溢，关闭即恢复原方案。不增加发光外壳，不修改主地图。':pavilion?'魁星阁使用主地图原始模型、贴图和 66 段檐口光场；檐口、屋面、塔身木构独立调光，不增加发光外壳。保存到建筑方案库，不影响花灯。':'两侧外排建筑不加发光；内院两条长廊只亮檐口，屋面与墙体不发光。檐口光色仍可独立调节。';
}
let settings={...(PRESETS.find(p=>p.id===new URLSearchParams(location.search).get('preset'))||PRESETS[0])};
let renderer,composer,camera,controls,bloom,scene,lighting,model,ambientLight,moonLight,frame=0,disposed=false,loadVersion=0,contextLost=false;
let center=new THREE.Vector3(-5.6,12,-40),dirty=true,enabled=true,saved=[];
try{saved=readSaved(localStorage.getItem(STORAGE_KEY));}catch{}
if(building==='matou'&&!query.has('preset'))settings={...PRESETS[0],brightness:.85,color:'#e6ad65',roofColor:'#a86f2e',facadeColor:'#80552b',windowColor:'#b47735',trimColor:'#b47735',eave:1.75,roof:0,facade:0,window:.10,sign:.04,width:1.15,bloom:.06};
if(building==='pavilion'&&!query.has('preset')){const match=saved.filter(s=>s.label.replace(/\s+/g,'')==='原景琥珀·自定').at(-1);if(match)applyStudy(match);}
function currentStudy(){return captureStudy(settings,spillSettings,softSpillEnabled,enabled,building,windowSettings,surfaceSettings,manualSettings);}
function applyStudy(snapshot){
 const state=restoreStudy(snapshot,{building,spillSettings,softSpillEnabled,enabled,manualSpill:manualSettings});
 manualSettings=state.manualSpill;settings=state.settings;spillSettings=state.spillSettings;windowSettings=state.windowLight;surfaceSettings=state.surfaceSpill;
 softSpillEnabled=state.softSpillEnabled;enabled=state.enabled;
}
if(!query.has('preset')){const draft=readStudyDraft(building);if(draft)applyStudy(draft);}
const fields=new Map(),masks=new Map(),sliderInputs=new Map(),originalMaterials=new Map();
const numericInputs=new Map();
const colorInputs=new Map();
const percentageKeys=new Set(CONTROL_GROUPS.flatMap(g=>g.controls).filter(c=>c[5]==='%').map(c=>c[0]));
const message=text=>$('message').textContent=text;
function sync(){
 const p=PRESETS.find(p=>p.id===settings.id);$('number').textContent=String(PRESETS.indexOf(p)+1).padStart(2,'0');$('effect-title').textContent=settings.label||p.name;$('effect-description').textContent=p.description;
 $('tuning-base').textContent='基于 · '+p.name;
 $('light-toggle').setAttribute('aria-pressed',String(enabled));$('light-toggle').textContent='建筑灯：'+(enabled?'开':'关');
 for(const [key,input] of sliderInputs){input.value=settings[key];const valueText=percentageKeys.has(key)?Math.round(settings[key]*100)+'%':Number(settings[key]).toFixed(2);$(key+'-value').textContent=valueText;input.setAttribute('aria-valuetext',valueText);numericInputs.get(key).value=Number((settings[key]*(percentageKeys.has(key)?100:1)).toFixed(3));}
 for(const [key] of COLOR_CONTROLS){
  $(key==='color'?'building-color':key).value=settings[key];
  const input=colorInputs.get(key);input.value=settings[key];input.removeAttribute('aria-invalid');input.setCustomValidity('');
 }
 document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===settings.id)));
 lighting?.apply(settings,enabled);lighting?.configureWindows(windowSettings);windowUI?.sync(building==='matou'?windowFloorSettings(windowSettings,'first'):windowSettings,settings.windowColor,enabled,building==='matou');windowSecondUI?.sync(windowFloorSettings(windowSettings,'second'),settings.windowColor,enabled,true);if(windowSecondHost)windowSecondHost.hidden=building!=='matou';softSpill?.configure(spillSettings);softSpill?.apply(softSpillEnabled,enabled);$('soft-spill-toggle').checked=softSpillEnabled;spillUI?.sync(spillSettings,softSpillEnabled,Boolean(softSpill),enabled);applyEnvironment(settings,{renderer,bloom,ambientLight,moonLight},enabled);
 surfaceLayer?.configure(surfaceSettings,settings,windowSettings,enabled);
 manualLayer?.configure(manualSettings,enabled);manualUI?.sync(manualSettings,Boolean(manualLayer),enabled,building);manualLayer?.setEditor(manualUI?.editing??{});
 for(const [key,ui] of surfaceUI){
  const zone=key==='window-second'?'window':key;
  const floorKey=zone==='window'&&building==='matou'?(key==='window-second'?'second':'first'):null;
  const state=floorKey?surfaceFloorSettings(surfaceSettings.window,floorKey):surfaceSettings[zone];
  const w=floorKey?windowFloorSettings(windowSettings,floorKey):windowSettings;
  const coverage=floorKey?surfaceLayer?.anchors.window?.filter(a=>a.floor===floorKey).length:surfaceLayer?.stats.coverage[zone];
  ui.sync(state,Boolean(coverage),enabled,sourceLevel(zone,settings,w)>0,coverage||0);
 }
 const draftSaved=saveStudyDraft(building,currentStudy());
 $('draft-status').hidden=draftSaved;
 dirty=true;
}
function attachSurface(host,zone,floorKey=null){
 const key=floorKey==='second'?'window-second':zone;
 surfaceUI.set(key,createSurfaceControls(host,zone,values=>{
  surfaceSettings=normalizeSurfaceSpill({...surfaceSettings,[zone]:zone==='window'&&building==='matou'?updateSurfaceFloor(surfaceSettings.window,floorKey||'first',values):{...surfaceSettings[zone],...values}});sync();
 },floorKey==='second'?{prefix:'ss-window-second',name:'二层窗户'}:{}));
}
function change(values){settings={...settings,...values};delete settings.label;sync();message('建筑光照已更新。喜欢的效果可单独保存。');}
for(const group of CONTROL_GROUPS){
 const section=document.createElement('details'),summary=document.createElement('summary'),help=document.createElement('p');
 section.className='control-group';section.open=group.open;summary.textContent=group.title;help.className='control-help';help.textContent=group.help;section.append(summary,help);
 for(const [key,label,min,max,step,unit] of group.controls){
  const row=document.createElement('div'),l=document.createElement('label'),o=document.createElement('output'),input=document.createElement('input'),number=document.createElement('input'),pair=document.createElement('div');
  row.id='region-'+key;
  const factor=unit==='%'?100:1;
  input.type='range';input.id=key;input.min=min;input.max=max;input.step=step;l.htmlFor=key;l.append(label);o.id=key+'-value';o.htmlFor=key;l.append(o);
  input.addEventListener('input',()=>change({[key]:Number(input.value)}));
  number.type='number';number.min=min*factor;number.max=max*factor;number.step=step*factor;number.setAttribute('aria-label',label+(unit==='%'?'（百分比）':'（数值）'));
  number.addEventListener('change',()=>{const v=number.valueAsNumber;if(!Number.isFinite(v)){sync();return;}const clamped=Math.max(min,Math.min(max,v/factor));change({[key]:Number((Math.round(clamped/step)*step).toFixed(4))});});
  pair.className='control-inputs';pair.append(input,number);row.append(l,pair);section.append(row);sliderInputs.set(key,input);numericInputs.set(key,number);
  if(['eave','roof','facade','sign'].includes(key))attachSurface(row,key);
 }
 const reset=document.createElement('button');reset.type='button';reset.className='group-reset';reset.textContent='重置本组';reset.setAttribute('aria-label','重置'+group.title);
 reset.addEventListener('click',()=>{const base=PRESETS.find(p=>p.id===settings.id);change(Object.fromEntries(group.controls.map(([key])=>[key,base[key]])));});section.append(reset);$('sliders').append(section);
}
// Keep roof, facade and window colors independent, without changing source maps.
for(const [key,label] of COLOR_CONTROLS){
 let swatch=key==='color'?$('building-color'):null;
 if(!swatch){
  const l=document.createElement('label');swatch=document.createElement('input');l.htmlFor=key;l.textContent=label;swatch.id=key;swatch.type='color';$('restore').before(l,swatch);
 }
 const pair=document.createElement('div'),input=document.createElement('input');pair.className='color-inputs';swatch.before(pair);pair.append(swatch,input);
  if(key==='trimColor'){const wrapper=document.createElement('div'),labelElement=document.querySelector('label[for="trimColor"]');wrapper.id='trim-color-control';wrapper.hidden=building!=='matou';labelElement.before(wrapper);wrapper.append(labelElement,pair);}
 const region={color:'eave',roofColor:'roof',facadeColor:'facade',windowColor:'window'}[key];
 if(region){const target=$('region-'+region),labelElement=document.querySelector('label[for="'+swatch.id+'"]'),anchor=target.querySelector('.surface-spill-panel');target.insertBefore(labelElement,anchor);target.insertBefore(pair,anchor);}
 input.type='text';input.id=swatch.id+'-code';input.placeholder='#010203 / rgb(1, 2, 3)';input.spellcheck=false;input.autocomplete='off';input.setAttribute('autocapitalize','off');input.setAttribute('aria-label',label+' HEX / RGB');input.maxLength=40;colorInputs.set(key,input);
 const commit=()=>{
  const color=parseColorInput(input.value);
  if(!color){input.setAttribute('aria-invalid','true');input.setCustomValidity('请输入 #010203 或 rgb(1, 2, 3)，RGB 分量为 0 到 255。');message(label+'格式不正确：请输入 #010203 或 rgb(1, 2, 3)，RGB 分量为 0 到 255。');return;}
  change({[key]:color});
 };
 input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');input.setCustomValidity('');});
 input.addEventListener('change',commit);
 input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();commit();}else if(e.key==='Escape'){e.preventDefault();input.value=settings[key];input.removeAttribute('aria-invalid');input.setCustomValidity('');}});
 swatch.addEventListener('input',()=>change({[key]:swatch.value}));
}
windowUI=createWindowControls($('window-light-controls'),values=>{windowSettings=building==='matou'?updateWindowFloor(windowSettings,'first',values):normalizeWindowLight({...windowSettings,...values});sync();},()=>{$('save').requestSubmit();});
 attachSurface($('wl-environment'),'window','first');attachSurface($('trim-color-control'),'trim');
 windowSecondHost=document.createElement('div');$('window-light-controls').append(windowSecondHost);
 windowSecondUI=createWindowControls(windowSecondHost,values=>{windowSettings=updateWindowFloor(windowSettings,'second',values);sync();},()=>{$('save').requestSubmit();},{prefix:'wl-second',floor:'second'});
 attachSurface($('wl-second-environment'),'window','second');
windowMasterHost=document.createElement('details');windowMasterHost.className='window-panel';windowMasterHost.innerHTML='<summary>窗户整体基准（两层共用）</summary><p class="control-help">共同的透光基准与默认光色。下面的一层、二层面板分别调整各自亮度、独立颜色、照明范围和环境外溢；若需要单独改变一层，请使用对应楼层面板。</p>';$('window-light-controls').prepend(windowMasterHost);
$('wl-basic').prepend($('region-window'));
$('region-sign').after($('trim-color-control'));
const legacyEave=document.createElement('details');legacyEave.className='surface-spill-panel';const legacySummary=document.createElement('summary');legacySummary.textContent='檐下柔光 · 原有方案';legacyEave.append(legacySummary,document.querySelector('.spill-option'),$('spill-controls'));$('region-eave').append(legacyEave);

for(const p of PRESETS){const b=document.createElement('button');b.type='button';b.className='preset';b.dataset.preset=p.id;b.style.setProperty('--swatch',p.color);const text=document.createElement('div');text.className='text';const name=document.createElement('strong'),small=document.createElement('small');name.textContent=p.name;small.textContent=p.short;text.append(name,small);b.append(text);b.addEventListener('click',()=>{settings={...p};windowSettings=normalizeWindowLight();surfaceSettings=normalizeSurfaceSpill();sync();message('已选择建筑预设「'+p.name+'」。');});$('presets').append(b);}
$('restore').addEventListener('click',()=>{settings={...PRESETS.find(p=>p.id===settings.id)};windowSettings=normalizeWindowLight();surfaceSettings=normalizeSurfaceSpill();sync();});
function persist(next){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,items:next}));saved=next;renderSaved();return true;}catch{message('本地存储不可用，当前调光仍可使用。');return false;}}
function renderSaved(){
 $('saved-count').textContent=saved.length;$('saved').replaceChildren();
 if(!saved.length)$('saved').textContent='还没有保存的建筑方案。';
 for(const s of saved){const row=document.createElement('div'),b=document.createElement('button'),del=document.createElement('button');row.className='saved-row';b.textContent=s.label;b.dataset.savedKey=s.key;b.type=del.type='button';b.addEventListener('click',()=>{applyStudy(s);sync();message(hasSavedSpill(s)?'已完整恢复方案「'+s.label+'」的建筑灯光、窗户照明、各区域外溢、柔光参数和开关。':'已应用旧方案「'+s.label+'」；该方案未保存柔光数据，保留当前柔光设置。请调整后另存为完整方案。');});del.textContent='删除';del.setAttribute('aria-label','删除建筑方案 '+s.label);del.addEventListener('click',()=>persist(saved.filter(v=>v.key!==s.key)));row.append(b,del);$('saved').append(row);}
}
$('save').addEventListener('submit',e=>{e.preventDefault();if(!lighting)return;if(saved.length>=50){message('已保存 50 个建筑方案，请先删除不需要的方案。');return;}const label=$('save-name').value.trim()||PRESETS.find(p=>p.id===settings.id).name+' · 自定';if(persist([...saved,{...currentStudy(),label,key:crypto.randomUUID()}])){message('已保存完整方案「'+label+'」：包含建筑灯光、窗户照明、各区域外溢、环境、柔光和手动外溢点位全部参数和开关。');$('save-name').value='';}});
function home(detail=false){if(!camera)return;if((building==='pavilion'||building==='matou')&&modelBounds){const size=modelBounds.getSize(new THREE.Vector3());const target=modelBounds.getCenter(new THREE.Vector3());const distance=Math.max(size.y,size.x/Math.max(camera.aspect,.45))/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.35;if(detail)target.y=modelBounds.max.y-size.y*.3;controls.target.copy(target);camera.position.copy(target).add(new THREE.Vector3(distance*(detail?.18:.28),distance*(detail?.08:.20),distance*(detail?.48:1)));controls.update();dirty=true;return;}const distance=detail?12:Math.max(49,23/Math.max(camera.aspect,.45));const target=detail?new THREE.Vector3(-5.65,13.45,-36.7):center.clone().add(new THREE.Vector3(0,1,1));controls.target.copy(target);camera.position.copy(target).add(new THREE.Vector3(detail?4:distance*.11,detail?3.8:distance*.58,distance));controls.update();dirty=true;}
$('reset').addEventListener('click',()=>home());$('detail').addEventListener('click',()=>home(true));
$('rotate').addEventListener('click',e=>{if(!controls)return;controls.autoRotate=!controls.autoRotate;e.currentTarget.setAttribute('aria-pressed',String(controls.autoRotate));dirty=true;});
$('light-toggle').addEventListener('click',e=>{enabled=!enabled;e.currentTarget.setAttribute('aria-pressed',String(enabled));e.currentTarget.textContent='建筑灯：'+(enabled?'开':'关');sync();});
function addManualPoint(position,normal=[0,0,1],reposition=false){
 const point=manualSettings.points.find(p=>p.id===manualSettings.selectedId);
 if(reposition&&point){manualSettings=normalizeManualSpill({...manualSettings,points:manualSettings.points.map(p=>p.id===point.id?{...p,position,normal}:p)});manualUI.stop();}
 else {if(manualSettings.points.length>=MAX_MANUAL_POINTS){manualUI.tell('最多添加 8 个点位，请先删除不需要的点。');return false;}const next=createManualPoint(position,normal,manualSettings.preset,crypto.randomUUID());next.name='外溢点 '+(manualSettings.points.length+1);manualSettings=normalizeManualSpill({...manualSettings,enabled:true,points:[...manualSettings.points,next],selectedId:next.id});}
 sync();manualUI.tell(reposition?'已更新点位位置和表面朝向。':'已添加柔光点；可继续点击添加，或结束布点后调节选中点。');return true;
}
manualUI=createManualSpillControls($('manual-spill-controls'),(value,linked)=>{manualSettings=normalizeManualSpill(value);if(linked?.surfaceSpill)surfaceSettings=normalizeSurfaceSpill(linked.surfaceSpill);if(linked?.windowLight)windowSettings=normalizeWindowLight(linked.windowLight);sync();},editor=>{manualLayer?.setEditor(editor);if(editor.placing&&controls){controls.autoRotate=false;$('rotate').setAttribute('aria-pressed','false');}dirty=true;},point=>{if(!camera||!controls)return;const target=new THREE.Vector3(...point.position),normal=new THREE.Vector3(...point.normal);if(Math.abs(normal.y)>.8)normal.set(0,.15,1);normal.y=Math.max(.15,normal.y);controls.target.copy(target);camera.position.copy(target).addScaledVector(normal.normalize(),2.5);controls.update();dirty=true;},()=>({surfaceSpill:surfaceSettings,windowLight:windowSettings}));
spillUI=createSpillControls($('spill-controls'),(values,replace=false)=>{spillSettings=normalizeSpill(replace?values:{...spillSettings,...values});sync();},()=>{message(saveSpill(building,spillSettings,softSpillEnabled)?'已保存本建筑外溢参数与开关；保存全部灯光请使用「保存完整灯光方案」。':'无法写入浏览器存储，请检查存储权限。');});
$('soft-spill-toggle').addEventListener('change',e=>{softSpillEnabled=e.currentTarget.checked;sync();message(softSpillEnabled?'柔和外溢射灯已开启；原有建筑灯效保持不变。':'柔和外溢射灯已关闭；保留原有建筑灯效。');});
function release(object){if(!object)return;const res=new Set();object.traverse(o=>{if(!o.isMesh)return;res.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){res.add(m);Object.values(m).forEach(v=>{if(v?.isTexture)res.add(v);});}});res.forEach(r=>r.dispose());}
function clearLoaded(){manualUI?.stop();manualLayer?.dispose();manualLayer=null;surfaceLayer?.dispose();surfaceLayer=null;redLanterns?.dispose();redLanterns=null;modelBounds=null;softSpill?.dispose();softSpill=null;lighting?.dispose();lighting=null;for(const [mesh,material] of originalMaterials)mesh.material=material;originalMaterials.clear();if(model){scene?.remove(model);release(model);model=null;}for(const texture of new Set([...fields.values()].map(f=>f.texture)))texture.dispose();for(const m of masks.values())m.dispose();fields.clear();masks.clear();}
async function load(){
 if(contextLost){location.reload();return;}
 const version=++loadVersion,ASSETS=assetBase();syncBuilding();$('building-select').disabled=true;host.setAttribute('aria-busy','true');$('retry').hidden=true;$('status').hidden=false;$('controls').disabled=true;clearLoaded();manualUI?.sync(manualSettings,false,enabled,building);
 try{
  const res=await fetch(new URL('manifest.json',ASSETS));if(!res.ok)throw new Error('建筑清单 HTTP '+res.status);const manifest=await res.json();
  const gltf=await new GLTFLoader().loadAsync(new URL(manifest.file,ASSETS).href,e=>{$('status').textContent='载入建筑 '+Math.min(100,Math.round(e.loaded/(e.total||manifest.bytes)*100))+'% · 保留原始材质';});
  if(disposed||version!==loadVersion){release(gltf.scene);return;}model=gltf.scene;
  $('status').textContent='正在准备檐口光场与窗格遮罩…';
  // Sequential resource loads keep retry/disposal deterministic.
  const fieldCache=new Map();
  for(const [name,info] of Object.entries(manifest.fields)){
   if(fieldCache.has(info.file)){fields.set(name,{info,texture:fieldCache.get(info.file)});continue;}
   const r=await fetch(new URL(info.file,ASSETS));if(!r.ok)throw new Error('檐光数据 HTTP '+r.status);const data=new Uint8Array(await r.arrayBuffer());const channels=info.channels??1;if(![1,2].includes(channels)||data.length!==info.size.reduce((a,b)=>a*b,channels))throw new Error('檐光数据不完整');
   if(disposed||version!==loadVersion)return;
   const texture=new THREE.Data3DTexture(data,...info.size);texture.format=channels===2?THREE.RGFormat:THREE.RedFormat;texture.type=THREE.UnsignedByteType;texture.minFilter=texture.magFilter=THREE.LinearFilter;texture.wrapS=texture.wrapT=texture.wrapR=THREE.ClampToEdgeWrapping;texture.unpackAlignment=1;texture.generateMipmaps=false;texture.needsUpdate=true;fieldCache.set(info.file,texture);fields.set(name,{info,texture});
  }
  for(const [name,file] of Object.entries(manifest.masks)){const texture=await new THREE.TextureLoader().loadAsync(new URL(file,ASSETS).href);if(disposed||version!==loadVersion){texture.dispose();return;}texture.flipY=false;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;masks.set(name,texture);}
  model.traverse(mesh=>{if(mesh.isMesh)originalMaterials.set(mesh,mesh.material);});lighting=createBuildingLighting(model,manifest,fields,masks,{regionalPolicy:building==='temple',mode:building});
  // Optional layer: loading errors must never block the original model.
  try{const spillField=await loadSoftSpill(ASSETS);if(disposed||version!==loadVersion){spillField.texture.dispose();return;}softSpill=createSoftSpill(model,manifest,spillField,{regionalPolicy:building==='temple',baseFields:building==='matou'?new Map():fields});}
  catch(error){console.warn('可选柔光资源载入失败，保留原建筑灯效',error);message('外溢光资源暂不可用，原建筑仍可正常试灯。');}
  scene.add(model);model.updateMatrixWorld(true);
  if(building==='matou'){
   const layer=new RedLanternLayer(scene);redLanterns=layer;
   try{await layer.registerTile(9,model,{groupId:'north-west'});if(disposed||version!==loadVersion){layer.dispose();return;}redUI.sync(layer.settings,true);}
   catch(error){layer.dispose();redLanterns=null;redUI.sync(readRedLantern(),false);$('red-state').textContent='红灯笼载入失败，点击“重新载入红灯笼”重试。';$('red-retry').hidden=false;console.warn('红灯笼图层载入失败',error);}
  }
  modelBounds=new THREE.Box3().setFromObject(model);center.set(-5.6,12,-40);if(building==='pavilion'||building==='matou'){modelBounds.getCenter(center);floor.position.set(center.x,modelBounds.min.y-.02,center.z);}else floor.position.set(-5.6,11.70,-40);surfaceLayer=createSurfaceSpill(scene,model,floor,renderer,manifest,fields,masks,building);
  manualLayer=createManualSpillLayer(scene,model,floor,renderer,camera,renderer.domElement,{onPick:addManualPoint,onSelect:id=>{manualSettings=normalizeManualSpill({...manualSettings,selectedId:id});sync();},onStop:()=>{manualUI.stop();dirty=true;},onMessage:text=>manualUI.tell(text)});home();sync();
  $('asset-info').textContent=manifest.meshes+' 个网格 · '+(manifest.triangles/10000).toFixed(1)+' 万三角面 · 原始贴图';
  $('controls').disabled=false;$('status').hidden=true;host.setAttribute('aria-busy','false');dirty=true;
  window.__BUILDING_STUDY__={manualSpillLayer:manualLayer,get manualSpillSettings(){return normalizeManualSpill(manualSettings);},setManualSpill(value){manualSettings=normalizeManualSpill(value);sync();},addManualPoint,surfaceLayer,get surfaceSettings(){return normalizeSurfaceSpill(surfaceSettings);},building,scene,model,camera,controls,renderer,lighting,softSpill,redLanterns,get windowSettings(){return normalizeWindowLight(windowSettings);},get snapshot(){return currentStudy();},get softSpillEnabled(){return softSpillEnabled;},get spillSettings(){return {...spillSettings};},setSpillSettings(value){spillSettings=normalizeSpill({...spillSettings,...value});sync();},setSoftSpill(value){softSpillEnabled=Boolean(value);sync();},presets:PRESETS,get settings(){return {...settings};},select(id){const p=PRESETS.find(p=>p.id===id);if(p){settings={...p};windowSettings=normalizeWindowLight();surfaceSettings=normalizeSurfaceSpill();sync();}},manifest};
 }catch(error){if(disposed)return;host.setAttribute('aria-busy','false');clearLoaded();$('status').textContent='建筑载入失败：'+error.message;$('retry').hidden=false;console.error(error);}finally{if(!disposed&&version===loadVersion)$('building-select').disabled=false;}
}
$('red-retry').addEventListener('click',()=>{$('red-retry').hidden=true;load();});
$('red-detail').addEventListener('click',()=>{if(!redLanterns?.groups.length)return;const p=redLanterns.groups[0].points[0].mount;controls.target.set(p[0],p[1]-.12,p[2]);camera.position.set(p[0]+.8,p[1]+.3,p[2]+2);controls.update();dirty=true;});
$('building-select').addEventListener('change',()=>{
 saveStudyDraft(building,currentStudy());
 building=$('building-select').value;
 const draft=readStudyDraft(building);
 if(draft)applyStudy(draft);
 else{manualSettings=normalizeManualSpill();windowSettings=normalizeWindowLight();surfaceSettings=normalizeSurfaceSpill();const spill=readSpillState(building);spillSettings=spill.settings;softSpillEnabled=spill.enabled;}
 const url=new URL(location.href);url.searchParams.set('building',building);history.replaceState(null,'',url);
 load();message(draft?'已恢复本建筑上次调整的灯光、柔光参数和开关。':'已切换建筑；沿用当前基础调光，载入本建筑的外溢设置。');
});
syncBuilding();
let resizeObserver;
try{
 renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.86;host.append(renderer.domElement);
 scene=new THREE.Scene();scene.background=new THREE.Color('#111d2c');scene.fog=new THREE.Fog('#111d2c',110,260);
 camera=new THREE.PerspectiveCamera(36,1,.05,500);controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=2;controls.maxDistance=140;controls.maxPolarAngle=Math.PI*.495;controls.autoRotateSpeed=.35;controls.addEventListener('change',()=>dirty=true);
 ambientLight=new THREE.HemisphereLight(0xc3d6ed,0x514535,.36);moonLight=new THREE.DirectionalLight(0xcbd9ef,.48);moonLight.position.set(-20,65,10);scene.add(ambientLight,moonLight);
 floor=new THREE.Mesh(new THREE.PlaneGeometry(150,150),new THREE.MeshStandardMaterial({color:0x20292a,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.set(-5.6,11.70,-40);scene.add(floor);
 composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.12,.48,.8);composer.addPass(bloom);composer.addPass(new OutputPass());
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();dirty=true;};resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();home();
 const animate=()=>{if(disposed)return;frame=requestAnimationFrame(animate);controls.update();if(dirty&&!document.hidden){surfaceLayer?.updateShadows();manualLayer?.updateMarkers();composer.render();dirty=false;}};animate();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(frame);$('status').hidden=false;$('status').textContent='显卡上下文已中断，请重新载入页面。';$('retry').hidden=false;});
 $('retry').addEventListener('click',load);load();
}catch(error){$('status').textContent='无法初始化三维预览：'+error.message;console.error(error);}
sync();renderSaved();
window.addEventListener('beforeunload',()=>{disposed=true;loadVersion++;cancelAnimationFrame(frame);resizeObserver?.disconnect();controls?.dispose();clearLoaded();release(scene);composer?.passes.forEach(p=>p.dispose?.());composer?.dispose();renderer?.dispose();});
