import {isSeatedAssembly} from './lining-orientation.mjs';
import {createWorkshopMusic} from './music.js';
import {createCraftBook} from './craft-book.js';
import * as THREE from 'three';
import { CONFIG, STAGES, PHASES, STORAGE_KEY, LEGACY_STORAGE_KEY } from './config.mjs';
import { Workflow, createState, currentStage, updateDrying, inventory, backpackInventory, dyedPaperStock, progress, makeFinishedState, restoreState, migrateLegacyState } from './workflow.mjs';
import { createLantern } from './lantern.js';
import { createWorld } from './world.js';
import { createWorkshopAudio } from './audio.mjs';
import { createHandwork } from './handwork.js';
import { enableTouchButtons } from './touch-buttons.js';
enableTouchButtons();
const $=id=>document.getElementById(id);
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});}catch(error){$('loading').innerHTML='<p>当前浏览器未能启用 WebGL。<br>请开启硬件加速后刷新。</p>';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.06,40);
const world=createWorld(scene),lantern=createLantern();lantern.root.position.set(0,1.08,0);lantern.root.scale.setScalar(.86);scene.add(lantern.root);
let saved=null,storageWorks=true,migrated=false;
try{
 const raw=localStorage.getItem(STORAGE_KEY);
 if(raw){try{saved=restoreState(JSON.parse(raw));}catch{}}
 if(!saved&&!raw){const legacy=localStorage.getItem(LEGACY_STORAGE_KEY);if(legacy){try{saved=migrateLegacyState(JSON.parse(legacy));migrated=!!saved;}catch{}}}
}catch{storageWorks=false;}
const workflow=new Workflow(saved||createState());
let playing=false,freeMode=false,selectedTool='bamboo',focused='assembly',cameraTween=null,frameOnly=false,exploded=false,hiddenLayer=-1,holding=false,holdStart=0,lastCraftAt=-10000,toastTimer=null,toastMessage='',pressStart=-10,completedShown=false,lastUi=0,lastTime=0,elapsed=0;
const keys=new Set(),raycaster=new THREE.Raycaster(),direction=new THREE.Vector3(),rotation=new THREE.Euler(0,0,0,'YXZ');
let drag=null;
const preview=makeFinishedState();lantern.sync(preview);world.sync(preview);
const introPos=new THREE.Vector3(3.45,2.8,4.8),introLook=new THREE.Vector3(-.7,1.78,0);
camera.position.copy(introPos);camera.lookAt(introLook);
function toast(message){if(message===toastMessage&&$('toast').classList.contains('visible'))return;toastMessage=message;$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2800);}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(workflow.state));storageWorks=true;}catch{storageWorks=false;}$('save-status').textContent=storageWorks?'进度已自动保存 · 本机':'浏览器存储不可用 · 本次进度暂存内存';}
let audioStorage;try{audioStorage=localStorage;}catch{}
function updateSoundUI(state){
 $('sound-toggle').textContent=state.available?`音效：${state.enabled&&state.volume>0?'开':'关'}`:'音效不可用';
 $('sound-toggle').setAttribute('aria-pressed',String(state.enabled));$('sound-toggle').disabled=!state.available;
 $('sound-volume').value=String(Math.round(state.volume*100));$('sound-volume-value').textContent=Math.round(state.volume*100)+'%';$('sound-volume').disabled=!state.available;
}
const audio=createWorkshopAudio({storage:audioStorage,onChange:updateSoundUI});updateSoundUI(audio.snapshot());
function updateMusicUI(state){
 for(const button of document.querySelectorAll('[data-music-toggle]')){button.textContent=state.error?'音乐：重试':state.blocked?'音乐：点击播放':`音乐：${state.enabled?'开':'关'}`;button.setAttribute('aria-pressed',String(state.enabled));button.title='背景音乐：赵徽柔 — 漫夜星（独立于制作音效）';}
 $('music-volume').value=String(Math.round(state.volume*100));$('music-volume-value').textContent=Math.round(state.volume*100)+'%';
}
const music=createWorkshopMusic({storage:audioStorage,onChange:updateMusicUI});updateMusicUI(music.snapshot());
document.querySelectorAll('[data-music-toggle]').forEach(button=>button.onclick=()=>music.toggle());
$('music-volume').oninput=e=>music.setVolume(Number(e.target.value)/100);
const handwork=createHandwork({canvas:$('scene'),scene,camera,world,lantern,audio,getState:()=>workflow.state,onComplete:commitHandwork,onInstall:index=>{if(!workflow.installRing(index))return false;sync();return true;},onCollect:index=>{if(!workflow.collectStrip(index))return false;sync();return true;},onFinish:()=>workflow.finishPreparation(),onDiscardDye:()=>{if(!workflow.discardDye())return false;sync();return true;},onGlue:(id,panel)=>{if(!workflow.glue(id,panel))return false;sync();return true;},onSoak:(id,panel)=>{if(!workflow.soak(id,panel))return false;sync();return true;},onTrim:(id,panel)=>{if(!workflow.trim(id,panel))return false;sync();if(currentStage(workflow.state).id==='lining_upper'){handwork.open(currentStage(workflow.state),workflow.state.counts.lining_upper);return 'next';}if(currentStage(workflow.state).id!=='lining_lower'){handwork.close();toast('白布裁边完成，进入下一道工序。');return 'done';}return true;},onFocus:focusWorkbench,onSelectTool:id=>{if(id)selectTool(id);},isMoving:()=>!!cameraTween,onExit:station=>{keys.clear();goStation(station);}});
createCraftBook({getStage:()=>workflow.state.stage,onOpen:unlock});
// Tools belong to the current process; the bottom bar now stores crafted stock.
function selectTool(id){if(playing&&selectedTool!==id)audio.play('tool');selectedTool=id;}
const backpackItems=[
 ['largeRing','大圈','ring ring-0','已扎好的大圈，安装到骨架后扣除'],
 ['mouthRing','口圈','ring ring-1','已扎好的口圈，安装到骨架后扣除'],
 ['waistRing','腰箍','ring ring-2','已扎好的腰箍，安装到骨架后扣除'],
 ['cutPaper','剪纸','cut-paper','待染方纸及已裁成形的花瓣、叶片；染色或安装后扣除'],
 ['dyedPaper','染纸','dyed-paper','按实际操作份数计：一份粉紫纸对应6片花瓣用纸，一份绿色纸对应7片叶片用纸；阴干和压纹不增减，裁形后扣除一份']
];
for(const [index,[id,name,icon,description]] of backpackItems.entries()){
 const slot=index<3?$('item-'+index):document.createElement('div');
 if(index>=3){slot.className='inventory-item stock-item';slot.tabIndex=0;slot.innerHTML=`<i class="item-drawing ${icon}" aria-hidden="true"></i><span>${name}${id==='dyedPaper'?' / 份':''}</span><b class="item-count">0</b>`;$('inventory-slots').insertBefore(slot,$('lining-brush'));}
 slot.dataset.stock=id;slot.title=description;
}
// Keep the action panel above the one tray as contextual supplies change its height.
new ResizeObserver(()=>document.documentElement.style.setProperty('--inventory-height',$('craft-inventory').offsetHeight+'px')).observe($('craft-inventory'));
function updateBackpack(){
 const stock=backpackInventory(workflow.state),dyed=dyedPaperStock(workflow.state);
 const flowers=Math.max(0,CONFIG.flowerCount-workflow.state.counts.top_flower_assembly),flowerSlot=$('inventory-flower');
 flowerSlot.querySelector('.item-count').textContent=String(flowers);flowerSlot.classList.toggle('empty',flowers===0);
 flowerSlot.title='花头，剩余 '+flowers+' 组。接花头时从背包拖到高亮轮廓，松开左键安装。';flowerSlot.setAttribute('aria-label',flowerSlot.title);
 for(const [id,name,,description]of backpackItems){
  const slot=document.querySelector(`[data-stock="${id}"]`),count=stock[id],unit=id==='dyedPaper'?'份':id.endsWith('Ring')?'个':'张';
  const detail=id==='dyedPaper'?`粉红色花瓣纸 ${dyed.petal} 份。`:'';
  slot.querySelector('b').textContent=String(count);slot.classList.toggle('empty',count===0);
  slot.title=`${name}，剩余 ${count} ${unit}。${detail}${description}`;slot.setAttribute('aria-label',slot.title);
 }
}
function updateUI(){const s=currentStage(workflow.state),count=workflow.state.counts[s.id],inv=inventory(workflow.state),complete=workflow.state.complete;
 $('stage-number').textContent=`${String(STAGES.slice(0,workflow.state.stage+1).filter(s=>!s.automatic).length).padStart(2,'0')} / ${STAGES.filter(s=>!s.automatic).length}`;$('stage-title').textContent=complete?'灯成，花开':s.name;$('stage-hint').textContent=complete?'这盏灯已经完成。转动灯体、逐层隐藏花瓣，或展开查看每一个连接部件。':s.hint;
 $('stage-count').textContent=`${count} / ${s.total} ${s.unit}`;$('stage-percent').textContent=`${Math.round(count/s.total*100)}%`;$('stage-bar').style.width=`${count/s.total*100}%`;
 const leafInv=inventory(workflow.state,'leaves');
 $('inventory').textContent=`花瓣纸：未染 ${inv.raw} · 阴干中 ${inv.wet} · 已压模 ${inv.pressed} · 已折扎 ${inv.formed}
已贴粉色花瓣 ${inv.installed} / ${CONFIG.petals.count}
成品绿色叶片：待贴 ${leafInv.raw} · 已贴 ${leafInv.installed} / ${CONFIG.leafCount}`;
 $('inventory').style.whiteSpace='pre-line';
 $('phase-title').textContent=`阶段 ${s.phase+1} / ${PHASES.length} · ${PHASES[s.phase]}`;
 $('phase-track').innerHTML=PHASES.map((name,i)=>`<span class="${complete||i<s.phase?'done':i===s.phase?'current':''}" title="${i+1} · ${name}" ${!complete&&i===s.phase?'aria-current="step"':''}>${i+1}. ${name}</span>`).join('');
 $('action-location').textContent=complete?'作品 001 · 秦淮荷花灯':world.stations[s.station].name;
 $('action-text').textContent=complete?'欣赏成品 · 查看制作成果':'动手 · '+s.action;$('craft-action').disabled=s.id==='paper_drying';
 $('go-station').innerHTML=`前往${world.stations[s.station].name.split('·')[1]} <span>↗</span>`;
 $('total-progress').textContent=`全程 ${progress(workflow.state)}%`;
 $('undo').disabled=!workflow.history.length;$('redo').disabled=!workflow.future.length;$('light-toggle').disabled=!complete;
 $('skip-stage').disabled=$('handwork-skip-stage').disabled=complete;
 $('previous-stage').disabled=$('handwork-previous-stage').disabled=workflow.state.stage===0;
 $('frame-toggle').setAttribute('aria-pressed',String(frameOnly));$('explode-toggle').setAttribute('aria-pressed',String(exploded));
 $('layer-toggle').textContent=hiddenLayer<0?'隐藏花瓣层':`已隐藏第 ${hiddenLayer+1} 层`;
 updateBackpack();selectTool(s.tool);
 $('view-mode').textContent=freeMode?'第一人称 · 自由走动':'第一人称 · 工位近景';$('free-walk').innerHTML=freeMode?'回到当前工位 <kbd>F</kbd>':'自由走动 <kbd>F</kbd>';
 $('touch-movement').hidden=!(freeMode&&matchMedia('(pointer:coarse)').matches);
}
function sync(){lantern.sync(workflow.state);world.sync(workflow.state);updateUI();handwork.refreshInventory();save();}
function restoreView(){frameOnly=false;exploded=false;hiddenLayer=-1;lantern.restore();document.querySelectorAll('[data-part]').forEach(c=>c.checked=true);updateUI();}
function stopHolding(){holding=false;$('hold-progress').style.width='0%';}
function unlock(){if(document.pointerLockElement)document.exitPointerLock();keys.clear();stopHolding();}
function showDialog(id){unlock();const el=$(id);if(!el.open)el.showModal();}
function focusWorkbench(id,stageId){unlock();freeMode=false;focused=id;document.body.classList.remove('freewalk');document.body.classList.toggle('sitting-down',isSeatedAssembly(stageId));const st=world.stations[id];const lining=isSeatedAssembly(stageId);const look=new THREE.Vector3(st.x,lining?1.25:id==='assembly'?1.43:id==='dye'?1.43:1.08,st.z);const distance=lining?3.55:id==='assembly'?2.35:id==='dye'?2.2:1.75;const pos=lining?new THREE.Vector3(st.x,1.58,st.z+3.55):look.clone().add(new THREE.Vector3(0,distance,distance));const temp=new THREE.PerspectiveCamera();temp.position.copy(pos);temp.lookAt(look);cameraTween={start:performance.now(),duration:lining?1450:1100,seated:lining,from:camera.position.clone(),to:pos,qFrom:camera.quaternion.clone(),qTo:temp.quaternion.clone()};}
function goStation(id){unlock();freeMode=false;document.body.classList.remove('freewalk','sitting-down');focused=id;const st=world.stations[id];const look=st.look.clone(),pos=st.position.clone();if(id==='assembly'){if(innerWidth<700){pos.set(0,2.35,3.4);look.set(0,2.25,0);}else{pos.set(0,2.08,3.13);look.set(0,1.92,0);}}
 const temp=new THREE.PerspectiveCamera();temp.position.copy(pos);temp.lookAt(look);cameraTween={start:performance.now(),from:camera.position.clone(),to:pos,qFrom:camera.quaternion.clone(),qTo:temp.quaternion.clone()};updateUI();}
function start(resume=false){music.start();audio.resume();audio.play('enter');if(!resume){workflow.reset();save();}playing=true;completedShown=workflow.state.complete;lantern.root.rotation.y=0;$('intro').hidden=true;$('hero-caption').hidden=true;$('game-ui').hidden=false;document.body.classList.add('playing');restoreView();sync();goStation(currentStage(workflow.state).station);toast(resume?(migrated?'已保留旧版竹骨进度，请继续裱糊与后续制作。':'欢迎回来，接着做这盏灯。'):'先选竹篾，在扎架台弯出三只圈条。');}
$('begin').onclick=()=>start(false);$('resume').hidden=!saved;$('resume').onclick=()=>start(true);
$('hint-toggle').onclick=()=>{const collapsed=document.body.classList.toggle('guide-minimized');$('guide-content').hidden=collapsed;$('hint-toggle').setAttribute('aria-expanded',String(!collapsed));$('hint-toggle').textContent=collapsed?'展开指导 ＋':'最小化 −';$('hint-toggle').title=collapsed?'展开工序指导':'最小化工序指导';};
$('go-station').onclick=()=>goStation(currentStage(workflow.state).station);$('home-view').onclick=()=>goStation('assembly');
function canCraft(){const stage=currentStage(workflow.state),st=world.stations[stage.station];const distance=Math.hypot(camera.position.x-st.x,camera.position.z-st.z);if(distance>(stage.station==='assembly'?3.45:2.65))return false;if(freeMode){camera.getWorldDirection(direction);const to=new THREE.Vector3(st.x,1.25,st.z).sub(camera.position).normalize();return direction.dot(to)>.6;}return focused===stage.station;}
function craft(){if(!playing||handwork.active||document.querySelector('dialog[open]'))return false;
 if(workflow.state.complete){showDialog('complete-dialog');return false;}
 if(cameraTween){toast('正在前往工位，请稍候。');return false;}
 if(!canCraft()){audio.play('blocked');toast(`请前往${world.stations[currentStage(workflow.state).station].name}，面向工作台制作。`);return false;}
 const s=currentStage(workflow.state);if(!s.tool)return false;
 selectTool(s.tool);
 unlock();restoreView();handwork.open(s,workflow.state.counts[s.id]);return true;
}
function commitHandwork(stageId,index,evidence){
 const s=currentStage(workflow.state);if(s.id!==stageId||workflow.state.counts[s.id]!==index)return false;
 const oldStage=workflow.state.stage;const result=workflow.act(s.tool,Date.now(),evidence);
 if(!result.ok){audio.play('blocked');toast(result.message);return false;}
 lastCraftAt=performance.now();pressStart=elapsed;audio.play(result.stage);sync();
 if(workflow.state.stage!==oldStage){if(STAGES[oldStage].phase!==currentStage(workflow.state).phase)audio.play('phase_done');stopHolding();toast(`${STAGES[oldStage].name}完成 · 下一步：${currentStage(workflow.state).name}`);}
 if(workflow.state.complete&&!completedShown){completedShown=true;stopHolding();goStation('assembly');setTimeout(()=>showDialog('complete-dialog'),850);}
 return true;
}
$('craft-action').addEventListener('click',craft);
function skipStage(){
 if(!playing||workflow.state.complete||document.querySelector('dialog[open]'))return;
 const result=workflow.skipStage();if(!result.ok){toast(result.message);return;}
 const wasActive=handwork.active;handwork.close();unlock();drag=null;restoreView();
 const next=currentStage(workflow.state);if(next.tool)selectTool(next.tool);
 audio.play('ui');sync();toast(result.message+(workflow.state.complete?'':' · 下一步：'+next.name));
 if(workflow.state.complete){completedShown=true;goStation('assembly');showDialog('complete-dialog');}
 else if(wasActive)handwork.open(next,workflow.state.counts[next.id]);
 else goStation(next.station);
}
$('skip-stage').onclick=$('handwork-skip-stage').onclick=skipStage;
function previousStage(){
 if(!playing||document.querySelector('dialog[open]'))return;
 const result=workflow.previousStage();if(!result.ok){toast(result.message);return;}
 const wasActive=handwork.active;stopHolding();handwork.close();unlock();drag=null;restoreView();completedShown=false;
 const next=currentStage(workflow.state);if(next.tool)selectTool(next.tool);
 audio.play('undo');sync();toast(result.message);
 if(wasActive)handwork.open(next,workflow.state.counts[next.id]);else goStation(next.station);
}
$('previous-stage').onclick=$('handwork-previous-stage').onclick=previousStage;
window.addEventListener('pointerup',stopHolding);
$('undo').onclick=()=>{stopHolding();if(workflow.undo()){audio.play('undo');completedShown=false;sync();toast('已撤销上一步。');}};
$('redo').onclick=()=>{if(workflow.redo()){audio.play('ui');sync();toast('已重做上一步。');}};
$('reset-stage').onclick=()=>{stopHolding();if(workflow.resetStage()){sync();toast('本工序已重置。');}else toast('本次打开后，当前工序尚无可重置的操作。');};
$('restart').onclick=()=>showDialog('reset-dialog');$('confirm-reset').onclick=()=>{$('reset-dialog').close();workflow.reset();completedShown=false;restoreView();sync();goStation('bamboo');selectTool('bamboo');};
$('frame-toggle').onclick=()=>{frameOnly=!frameOnly;lantern.setFrame(frameOnly);updateUI();};
$('explode-toggle').onclick=()=>{exploded=!exploded;lantern.setExploded(exploded);updateUI();};
$('layer-toggle').onclick=()=>{hiddenLayer=hiddenLayer===CONFIG.petals.layers-1?-1:hiddenLayer+1;lantern.setLayer(hiddenLayer);updateUI();};$('restore-view').onclick=restoreView;
$('light-toggle').onclick=()=>{if(workflow.state.complete){workflow.state.lit=!workflow.state.lit;audio.play(workflow.state.lit?'light_on':'light_off');sync();}};
for(const c of document.querySelectorAll('[data-part]'))c.onchange=()=>lantern.setPartVisibility(c.dataset.part,c.checked);
$('reference-open').onclick=()=>showDialog('reference-dialog');$('help-toggle').onclick=()=>showDialog('help-dialog');
for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>b.closest('dialog').close();
for(const b of document.querySelectorAll('[data-ref]'))b.onclick=()=>{document.querySelectorAll('[data-ref]').forEach(el=>el.classList.toggle('active',el===b));$('reference-image').src=`./workshop/references/${b.dataset.ref}.png`;$('reference-image').alt=b.dataset.ref==='finished'?'用户提供的荷花灯成品四视图':'用户提供的真实制作过程图谱';};
$('keep-looking').onclick=()=>{$('complete-dialog').close();goStation('assembly');};
$('capture').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download='秦淮荷花灯-我的作品.png';a.href=renderer.domElement.toDataURL('image/png');a.click();toast('作品留影已保存。');};
$('sound-toggle').onclick=()=>{audio.setEnabled(!audio.snapshot().enabled);if(audio.snapshot().enabled)audio.play('tool');};
$('sound-volume').oninput=e=>audio.setVolume(Number(e.target.value)/100);
$('sound-volume').onchange=()=>audio.play('check');
const quietButtons=new Set(['go-station','home-view','frame-toggle','explode-toggle','layer-toggle','restore-view','reset-stage','reference-open','help-toggle','keep-looking','capture','hint-toggle','free-walk']);
document.addEventListener('click',e=>{const button=e.target.closest('button');if(button&&(quietButtons.has(button.id)||button.hasAttribute('data-close')||button.hasAttribute('data-ref')))audio.play('ui');});
document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.pause();music.pause();}else {audio.resume();music.resume();}});
window.addEventListener('pagehide',()=>{audio.pause();music.pause();});window.addEventListener('pageshow',()=>{audio.resume();music.resume();});
window.addEventListener('focus',()=>{if(!document.hidden){audio.resume();music.resume();}});
function toggleFree(){if(!playing)return;if(freeMode){goStation(currentStage(workflow.state).station);return;}cameraTween=null;freeMode=true;document.body.classList.add('freewalk');updateUI();toast('WASD 移动 · 点击场景后用鼠标环顾 · Esc 释放鼠标');}
$('free-walk').onclick=toggleFree;
function mouseLook(dx,dy){rotation.setFromQuaternion(camera.quaternion);rotation.y-=dx*.0024;rotation.x=THREE.MathUtils.clamp(rotation.x-dy*.0024,-1.25,1.25);rotation.z=0;camera.quaternion.setFromEuler(rotation);}
$('scene').addEventListener('click',()=>{if(playing&&freeMode&&!matchMedia('(pointer:coarse)').matches){const p=$('scene').requestPointerLock?.();p?.catch?.(()=>toast('鼠标锁定不可用，可按住右键拖动视角。'));}});
$('scene').addEventListener('contextmenu',e=>e.preventDefault());
$('scene').addEventListener('pointerdown',e=>{if(playing&&freeMode&&(e.button===2||e.pointerType==='touch')){drag={x:e.clientX,y:e.clientY};$('scene').setPointerCapture(e.pointerId);}});
$('scene').addEventListener('pointermove',e=>{if(drag){mouseLook(e.clientX-drag.x,e.clientY-drag.y);drag={x:e.clientX,y:e.clientY};}});
$('scene').addEventListener('pointerup',()=>drag=null);$('scene').addEventListener('pointercancel',()=>drag=null);
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===$('scene')&&freeMode)mouseLook(e.movementX,e.movementY);});
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement){keys.clear();stopHolding();}});
window.addEventListener('blur',()=>{audio.pause();music.pause();keys.clear();stopHolding();drag=null;});
window.addEventListener('keydown',e=>{
 if(!playing||handwork.active||document.querySelector('dialog[open]')||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
 if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyE','KeyQ','KeyR'].includes(e.code))e.preventDefault();
 keys.add(e.code);if(e.repeat)return;
 if(e.code==='KeyF')toggleFree();if(e.code==='KeyZ')$('undo').click();if(e.code==='KeyY')$('redo').click();
 if(e.code==='KeyE'||e.code==='Space')craft();
});
window.addEventListener('keyup',e=>{keys.delete(e.code);if(['KeyE','Space'].includes(e.code))stopHolding();});
for(const b of document.querySelectorAll('[data-key]')){b.onpointerdown=e=>{e.preventDefault();keys.add(b.dataset.key);b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key);}
function blocked(x,z){return Math.abs(x)>5.65||z< -4.5||z>4.9||world.collisions.some(c=>Math.abs(x-c.x)<c.hx&&Math.abs(z-c.z)<c.hz);}
function move(dt){if(handwork.active||!freeMode||document.querySelector('dialog[open]'))return;const forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0),side=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);if(!forward&&!side)return;const oldX=camera.position.x,oldZ=camera.position.z;
 camera.getWorldDirection(direction);direction.y=0;direction.normalize();const right=new THREE.Vector3().crossVectors(direction,camera.up);const delta=direction.clone().multiplyScalar(forward).addScaledVector(right,side).normalize().multiplyScalar(dt*(keys.has('ShiftLeft')?3.4:2));
 const x=camera.position.x+delta.x,z=camera.position.z+delta.z;if(!blocked(x,camera.position.z))camera.position.x=x;if(!blocked(camera.position.x,z))camera.position.z=z;camera.position.y=THREE.MathUtils.lerp(camera.position.y,1.72,dt*5);audio.walk(Math.hypot(camera.position.x-oldX,camera.position.z-oldZ));
}
function resize(){camera.fov=innerWidth<700?76:48;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);if(!playing){camera.position.copy(innerWidth<700?new THREE.Vector3(3.4,2.7,5.2):introPos);camera.lookAt(introLook);}}
window.addEventListener('resize',resize);resize();
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;elapsed+=dt;
 if(cameraTween){const t=Math.min((now-cameraTween.start)/(cameraTween.duration||650),1),e=t*t*(3-2*t);if(cameraTween.seated){const sit=Math.min(t/.58,1),se=sit*sit*(3-2*sit);const lean=Math.max(0,(t-.35)/.65),le=lean*lean*(3-2*lean);camera.position.lerpVectors(cameraTween.from,cameraTween.to,le);camera.position.y=THREE.MathUtils.lerp(cameraTween.from.y,cameraTween.to.y,se)-Math.sin(Math.PI*se)*.055;camera.quaternion.slerpQuaternions(cameraTween.qFrom,cameraTween.qTo,e);}else{camera.position.lerpVectors(cameraTween.from,cameraTween.to,e);camera.quaternion.slerpQuaternions(cameraTween.qFrom,cameraTween.qTo,e);}if(t===1){cameraTween=null;document.body.classList.remove('sitting-down');}}
 if(!playing)lantern.root.rotation.y=Math.sin(elapsed*.17)*.14-.25;else{
  move(dt);if(!handwork.active&&!document.querySelector('dialog[open]')){if(keys.has('KeyQ'))lantern.root.rotation.y+=dt*.8;if(keys.has('KeyR'))lantern.root.rotation.y-=dt*.8;}
  if(now-lastUi>150){lastUi=now;if(updateDrying(workflow.state)){sync();if(currentStage(workflow.state).id==='petal_pressing'){audio.play('paper_drying');toast('纸料已干透，可以去压瓣台了。');}}
   if(currentStage(workflow.state).id==='paper_drying'){const remaining=Math.max(0,...[...workflow.state.papers,...workflow.state.leaves].filter(p=>p.status==='wet').map(p=>p.readyAt-Date.now()));$('action-text').textContent=`阴干中 · ${(remaining/1000).toFixed(1)} 秒`;} 
   if(freeMode){raycaster.setFromCamera(new THREE.Vector2(),camera);const hits=raycaster.intersectObjects(Object.values(world.stations).map(s=>s.trigger));$('interact-hint').textContent=hits[0]&&hits[0].distance<3?`${world.stations[hits[0].object.userData.station].name} · E 动手操作`:'';}
   else $('interact-hint').textContent='';
  }
 }
 world.animate(elapsed,Math.max(0,1-(elapsed-pressStart)*2));handwork.update(dt,now);renderer.render(scene,camera);
}
requestAnimationFrame(frame);
window.__LOTUS_WORKSHOP__={audio,music,handwork,stages:STAGES,storageKey:STORAGE_KEY,get state(){return JSON.parse(JSON.stringify(workflow.state));},get ready(){return true;},get playing(){return playing;},get selectedTool(){return selectedTool;},get mode(){return freeMode?'free':'station';},snapshot(){return {state:this.state,selectedTool,mode:this.mode,focused,camera:camera.position.toArray(),stats:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures},parts:lantern.registry.size,visibleParts:[...lantern.registry].filter(([,p])=>p.visible).map(([id])=>id),sockets:lantern.sockets.size};},goStation,selectTool,lantern,workflow,scene,camera,renderer,craft,blocked};
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();toast('图形上下文已中断，进度已保存。请刷新页面恢复。');});
setTimeout(()=>{$('loading').style.opacity=0;setTimeout(()=>$('loading').hidden=true,500);},200);

