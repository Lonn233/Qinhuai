import * as THREE from 'three';
import {createWorkerNavigator} from './navigation-client.js';
import {createLanternBook} from './book.js';
import {StoryState,canObserve,RIDDLES} from './state.mjs';
import {LANTERNS,INTRO,RIDDLE_OPENING,RETURN,HANG,observation} from './content.mjs';
import {createStoryUI} from './ui.js';
import {createStoryWorld} from './world.js';
import {TEMPLE_PORTAL} from '../import-temple-visit.mjs';
import {menuSounds} from '../menu-sounds.js';
import {TEST_CHECKPOINTS,checkpointData,checkpointIndex,memoryStorage} from './test-checkpoints.mjs';
export function mountStory(a){
 let storage;try{storage=localStorage;}catch{}
 let state=new StoryState(storage);
 const ui=createStoryUI(),world=createStoryWorld(a),el=ui.el;
 let mode='menu',ready=false,busy=false,restoring=false,modal=false,dialogue=null,lastUpdate=0,lastSave=0,current=null,targets=[],targetPoint=null,templeInside=a.temple.snapshot().inside,riddleTarget=null,riddleAudio=null,riddleAudioToken=0;
 let book=null,observing=null,testing=null,testIndex=0,testBusy=false,riddleFocus=null;
 let audio=null,cancelAudio=null,audioToken=0,duckedVolume=null,previousMode='firstPerson',endingPose=null;
 const navigation=createWorkerNavigator(a.navigationSnapshot);let selectedTarget=null,navKey='',routeRevision=-1,mapCanvas=null,mapStatus=null;
 const eye=new THREE.Vector3(),direction=new THREE.Vector3();
 const blocked=()=>mode==='menu'||busy||modal||!!dialogue||!!observing||!el('Riddle').hidden;
 const movementLocked=()=>mode==='menu'||busy||modal||!!observing||!el('Riddle').hidden;
 const lookLocked=()=>!!testing||mode==='menu'||busy||modal||!el('Riddle').hidden;
 function stop(){a.stop();if(a.pointer.isLocked)a.pointer.unlock();}
 function refresh(){ui.quest(state);el('Continue').hidden=!state.data.started;el('Detail').textContent=state.stage==='riddles'?(state.riddleSolved>=5?'已猜对 '+state.riddleSolved+'/10 · 可以离开夫子庙，仍可继续挑战':'猜对灯谜 '+state.riddleSolved+'/5 · 靠近有纸签的灯笼并看向它，按 E 作答'):state.stage==='return'?'沿地图金线回到师傅处；离开夫子庙不会自动完成任务。':state.stage==='temple-enter'?'进入夫子庙，寻找挂有纸签的灯笼。':state.currentLantern?.water?'前往原船位上方步道，面向水灯，按 E 欣赏。':['hang-travel','hang-ready'].includes(state.stage)&&!world.finishedReady?'成品荷花灯待提供，挂灯位已准备。':'靠近目标按 E · 再按 E 结束赏灯并解锁图鉴';}
 function run(task){return Promise.resolve().then(task).catch(error=>{console.error('剧情交互失败',error);ui.toast(error.message||'操作失败，请重试');});}
 function clearAudio(){audioToken++;if(cancelAudio){cancelAudio();cancelAudio=null;}if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null;}const music=document.querySelector('#main-scene-music');if(music&&duckedVolume!==null)music.volume=duckedVolume;duckedVolume=null;}
 function playRiddleCue(key,onended){const cue=world.assets.audio?.[key];if(!cue?.files?.length){onended?.();return;}const token=++riddleAudioToken;const music=document.querySelector('#main-scene-music');if(riddleAudio){riddleAudio.pause();riddleAudio=null;}if(music&&music.dataset.riddleVolume===undefined){music.dataset.riddleVolume=String(music.volume);music.volume*=.3;}const finish=()=>{if(token!==riddleAudioToken)return;riddleAudio=null;if(music&&music.dataset.riddleVolume!==undefined){music.volume=Number(music.dataset.riddleVolume);delete music.dataset.riddleVolume;}onended?.();};riddleAudio=new Audio(cue.files[0]);riddleAudio.onended=finish;riddleAudio.onerror=finish;riddleAudio.play().catch(finish);}
 function startRiddleIntro(){if(state.stage!=='riddles'||!state.data.inside||state.data.riddleIntroVersion>=1||dialogue)return;state.data.riddleIntroPlayed=true;state.data.riddleIntroVersion=1;state.persist();speak(RIDDLE_OPENING);}
 function stopRiddleCue(){riddleAudioToken++;if(riddleAudio){riddleAudio.pause();riddleAudio=null;}const music=document.querySelector('#main-scene-music');if(music&&music.dataset.riddleVolume!==undefined){music.volume=Number(music.dataset.riddleVolume);delete music.dataset.riddleVolume;}}
 function closeRiddle(){clearTimeout(riddleFocus);if(el('Riddle').hidden)return;el('Riddle').hidden=true;riddleTarget=null;stopRiddleCue();el('Prompt').hidden=true;a.stop();refresh();if(!testing)a.requestLookLock?.();}
 function openRiddle(target){riddleTarget=target;const r=RIDDLES.find(item=>item.id===target.id);if(!r)return;if(state.data.solvedRiddles.includes(r.id)){riddleTarget=null;ui.toast('这个灯谜已经猜过了');return;}stop();el('RiddleNumber').textContent='第 '+String(r.id).padStart(2,'0')+' 盏灯';el('RiddleTitle').textContent='灯笼谜签';el('RiddleText').textContent=r.text;el('RiddleFeedback').textContent='';el('RiddleFeedback').classList.remove('is-correct');el('RiddleProgress').textContent='已猜对 '+state.riddleSolved+'/10（答对五题即可离开）';el('RiddleAnswer').value='';el('RiddleAnswer').disabled=false;el('Riddle').hidden=false;clearTimeout(riddleFocus);riddleFocus=setTimeout(()=>{if(riddleTarget===target&&!el('Riddle').hidden)el('RiddleAnswer').focus();},80);}
 function submitRiddle(event){event.preventDefault();if(!riddleTarget||el('RiddleAnswer').disabled)return;const result=state.answerRiddle(riddleTarget.id,el('RiddleAnswer').value);if(!result.accepted){el('RiddleFeedback').textContent=result.already?'这个灯谜已经猜过了':'请输入谜底后提交。';return;}const key=result.correct?'ACT2_RIDDLE_CORRECT_B':'ACT2_RIDDLE_WRONG_'+(state.data.riddleWrongCursor%2?'B':'A');if(result.correct)state.data.riddleCorrectCursor++;else state.data.riddleWrongCursor++;state.persist();el('RiddleProgress').textContent='已猜对 '+state.riddleSolved+'/10（答对五题即可离开）';el('RiddleAnswer').disabled=true;const announceComplete=result.correct&&result.complete&&!state.data.riddleCompletePlayed;if(result.correct){el('RiddleFeedback').textContent='答对了！';el('RiddleFeedback').classList.add('is-correct');refresh();}else{el('RiddleFeedback').textContent='还不对，再想一想，可以继续尝试。';}playRiddleCue(key,()=>{el('RiddleAnswer').disabled=false;if(announceComplete){el('RiddleFeedback').textContent='答对了！已达到五题，可以离开夫子庙；也可以继续挑战。';state.data.riddleCompletePlayed=true;state.persist();}if(!result.correct)el('RiddleAnswer').select();});}
 function closeDialogue(cancelled=false){if(!dialogue)return;const previous=dialogue;dialogue=null;clearAudio();el('Dialogue').hidden=true;if(!cancelled)previous.complete?.();refresh();}
 function nextLine(){if(!dialogue||dialogue.observation)return;dialogue.index++;if(dialogue.index>=dialogue.lines.length)closeDialogue();else renderLine();}
 function renderLine(){
  const line=dialogue.lines[dialogue.index];el('Speaker').textContent=line.speaker;el('Subtitle').textContent=line.text;el('DialogueRetry').hidden=true;el('DialogueNext').hidden=dialogue.observation;el('DialogueNext').disabled=false;
  const cue=world.assets.audio?.[line.id];dialogue.voiced=!!((cue?.ready||cue?.verified)&&cue?.files?.length);
  if(dialogue.observation)el('ObservationHintText').textContent='按E退出赏灯';
  if(!dialogue.voiced){clearAudio();el('VoiceStatus').textContent=dialogue.observation?'':'配音待补 · 阅读后继续';return;}
  el('DialogueNext').hidden=dialogue.observation;playVoice(cue.files);
 }
 async function playVoice(files){clearAudio();const token=audioToken;const music=document.querySelector('#main-scene-music');if(music){duckedVolume=music.volume;music.volume*=.3;}el('VoiceStatus').textContent='正在播放对白…';el('DialogueRetry').hidden=true;
  try{for(const file of files){if(!dialogue||token!==audioToken)return;await new Promise((resolve,reject)=>{audio=new Audio(file);cancelAudio=()=>reject(Error('对白已取消'));audio.onended=()=>{cancelAudio=null;resolve();};audio.onerror=()=>{cancelAudio=null;reject(Error('录音加载失败'));};audio.play().catch(reject);});}
   if(!dialogue||token!==audioToken)return;clearAudio();el('VoiceStatus').textContent=dialogue.observation?'':'点击继续';
  }catch{if(!dialogue||token!==audioToken)return;clearAudio();el('VoiceStatus').textContent=dialogue.observation?'配音暂不可用，可重试或按 E 结束赏灯。':'配音未能播放完成，请重试；本次不解锁。';el('DialogueRetry').hidden=false;}
 }
 function speak(lines,complete){if(dialogue)return;dialogue={lines,index:0,complete,voiced:false,observation:!!observing};if(!observing&&a.pointer.isLocked)a.pointer.unlock();el('DialogueCancel').hidden=!!observing;el('Dialogue').hidden=false;renderLine();}
 function resizeObservation(){
  const view=observing?.closeup;if(!view)return;
  const fov=THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(2*Math.atan2(view.radius,view.distance*.52))/Math.min(1,a.camera.aspect),.6,35);
  a.camera.fov=fov;a.camera.updateProjectionMatrix();
  view.lookScale=Math.tan(THREE.MathUtils.degToRad(fov/2))/Math.tan(THREE.MathUtils.degToRad(view.fov/2));
  a.pointer.pointerSpeed=view.pointerSpeed*view.lookScale;view.aspect=a.camera.aspect;
 }
 function exitObservation(complete=false){
  if(!observing)return false;const previous=observing;observing=null;delete document.documentElement.dataset.storyObserving;closeDialogue(true);a.stop();
  if(previous.closeup){const view=previous.closeup;a.switchControl(previous.mode);a.player.yaw=view.yaw;a.player.pitch=view.pitch;a.camera.position.copy(view.position);a.camera.quaternion.copy(view.quaternion);a.camera.fov=view.fov;a.camera.updateProjectionMatrix();a.pointer.pointerSpeed=view.pointerSpeed;}
  if(previous.mode!=='firstPerson'&&!previous.pointerLocked&&a.pointer.isLocked)a.pointer.unlock();
  else if(previous.closeup&&previous.pointerLocked&&!testing)a.requestLookLock?.();
  el('ObservationHint').hidden=true;el('Controls').hidden=mode!=='play';if(complete)previous.complete?.();refresh();return true;
 }
 function enterObservation(target,complete){
  a.stop();observing={mode:a.controlMode(),pointerLocked:a.pointer.isLocked,target,complete};
  if(target.water){
   const view=observing.closeup={position:a.camera.position.clone(),quaternion:a.camera.quaternion.clone(),fov:a.camera.fov,yaw:a.player.yaw,pitch:a.player.pitch,pointerSpeed:a.pointer.pointerSpeed??1};
   a.switchControl('firstPerson');a.player.updateCamera(0,true);
   const size=target.bounds.getSize(new THREE.Vector3()),center=target.bounds.getCenter(new THREE.Vector3());
   center.y-=size.y*.18;a.camera.lookAt(center);
   view.radius=Math.max(size.length()*.5,.035);view.distance=Math.max(a.camera.position.distanceTo(center),.1);resizeObservation();
  }
  document.documentElement.dataset.storyObserving='';if(!testing)a.requestLookLock?.();el('Controls').hidden=true;el('ObservationHint').hidden=false;speak([observation(target.id)]);
 }
 function storyTargets(id){return targets.filter(t=>(!id||t.id===id)&&(!t.water||t.dock));}
 function hideModal(){book?.dispose();book=null;mapCanvas=null;mapStatus=null;el('Modal').classList.remove('story-map-modal','story-book-modal');modal=false;el('Modal').hidden=true;}
 function showModal(title,text,buttons=[]){hideModal();stop();modal=true;ui.showModal(title,text,buttons);}
 function catalog(){if(busy||dialogue)return;menuSounds.play('flip');const nextBook=createLanternBook(state.data.observed);showModal('秦淮灯谱',nextBook);book=nextBook;el('Modal').classList.add('story-book-modal');}
 function selectDestination(point,label){if(!point){ui.toast('此处暂无可达观察点，请检查预览中的位置。');return;}selectedTarget={point:{...point},label,stage:state.stage};navKey='';ui.toast('已标记：'+label+'。路线不会跳过剧情顺序。');}
 function openMap(){if(mode!=='play'||busy||dialogue)return;const wrapper=document.createElement('div');wrapper.className='story-large-map';
  const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=760;canvas.setAttribute('aria-label','点击地点或下方目标按钮设置路线');
  const note=document.createElement('p');note.textContent='点击地图标记目的地，或选择下方任务点。金线为可行走路线。';
  const status=document.createElement('p');status.setAttribute('role','status');const choices=document.createElement('div');choices.className='story-map-targets';
  const markers=[{label:'751 师傅工坊',get:()=>world.workshop,position:world.workshop},{label:'夫子庙入口',get:()=>({...TEMPLE_PORTAL.outside,y:TEMPLE_PORTAL.ground}),position:TEMPLE_PORTAL.door},{label:'街道挂灯位',get:()=>world.hang,position:world.hang}];
  for(const lamp of LANTERNS){const instances=storyTargets(lamp.id).sort((x,y)=>x.position.distanceToSquared(a.player.position)-y.position.distanceToSquared(a.player.position));for(const t of instances)markers.push({label:lamp.name,get:()=>world.observationPoint(t),position:t.position,id:lamp.id});}
  const seen=new Set();for(const marker of markers){if(seen.has(marker.label))continue;seen.add(marker.label);const b=document.createElement('button');b.textContent=marker.label;b.onclick=()=>selectDestination(marker.get(),marker.label);choices.append(b);}
  const auto=document.createElement('button');auto.textContent='恢复当前任务指引';auto.onclick=()=>{selectedTarget=null;navKey='';};choices.prepend(auto);
  canvas.onclick=event=>{const point=world.mapPoint(canvas,event);const near=markers.map(m=>({m,d:Math.hypot(m.position.x-point.x,m.position.z-point.z)})).sort((a,b)=>a.d-b.d)[0];if(near?.d<1.7){selectDestination(near.m.get(),near.m.label);return;}const y=a.surface(point.x,point.z,a.player.position.y);if(y===null){ui.toast('这里没有可行走地面，请选择街道或目标标记。');return;}selectDestination({...point,y},'自选目的地');};
  wrapper.append(note,canvas,status,choices);showModal('秦淮游踪 · 灯会全图',wrapper);el('Modal').classList.add('story-map-modal');mapCanvas=canvas;mapStatus=status;drawNavigation();
 }
 function drawNavigation(){const lamps=storyTargets();world.drawMap(el('Map'),a.player,targetPoint,lamps,state.data.observed,navigation.path);if(mapCanvas)world.drawMap(mapCanvas,a.player,targetPoint,lamps,state.data.observed,navigation.path);const label=selectedTarget?.label||state.objective;const text=({idle:'请选择目的地',searching:'正在计算可行走路线…',unreachable:'未找到连通路线，请移至街道或另选点位',error:'导航加载失败，请返回菜单后重试',arrived:'已到达目的地',ready:'沿金线行走 · 剩余 '+Math.ceil(navigation.remaining/.3212)+' 米'})[navigation.status];el('RouteStatus').textContent=text;if(mapStatus)mapStatus.textContent=label+' · '+text;}

 function savePose(){if(mode!=='play'||busy||a.temple.snapshot().busy)return;state.data.pose={x:a.player.position.x,y:a.player.position.y,z:a.player.position.z,yaw:a.player.yaw};state.persist();}
 function refreshTest(){
  el('TestPanel').hidden=!testing;
  el('TestToggle').setAttribute('aria-expanded',String(!!testing));
  el('TestSelect').value=String(testIndex);
  el('TestCount').textContent=(testIndex+1)+' / '+TEST_CHECKPOINTS.length;
  el('TestPrev').disabled=testBusy||testIndex===0;
  el('TestNext').disabled=testBusy||testIndex===TEST_CHECKPOINTS.length-1;
  for(const id of ['TestSelect','TestReplay','TestExit'])el(id).disabled=testBusy;
 }
 function clearTestStep(){
  stop();exitObservation();closeDialogue(true);clearAudio();closeRiddle();stopRiddleCue();hideModal();restoreEndingCamera();
  selectedTarget=null;current=null;targetPoint=null;navigation.reset();navKey='';world.setRoute([]);world.clearObservations();
  el('Prompt').hidden=true;el('LampMarker').hidden=true;
 }
 function testSpawn(point,lookAt){
  const spawn=a.findSpawn(point.x,point.z,point.y);
  if(!spawn)throw Error('该步骤没有安全落脚点，请检查场景位置');
  a.player.spawn(spawn);
  if(lookAt)a.player.yaw=Math.atan2(point.x-lookAt.x,point.z-lookAt.z);
  if(a.controlMode()==='firstPerson')a.camera.rotation.set(0,a.player.yaw,0,'YXZ');
  a.player.updateCamera(0,true);
 }
 async function jumpTest(index){
  if(mode!=='play'||busy||testBusy||a.temple.snapshot().busy||!Number.isInteger(index)||!TEST_CHECKPOINTS[index])return;
  if(!testing){
   testing={state,position:a.player.position.clone(),yaw:a.player.yaw,control:a.controlMode(),inside:a.temple.snapshot().inside};
   state=new StoryState(memoryStorage());document.documentElement.dataset.storyTesting='';
  }
  testBusy=true;busy=true;testIndex=index;refreshTest();el('TestStatus').textContent='正在切换…';
  try{
   clearTestStep();state.data=checkpointData(TEST_CHECKPOINTS[index]);state.persist();
   restoring=true;try{await a.temple.restore(state.data.inside);}finally{restoring=false;templeInside=a.temple.snapshot().inside;}
   await a.switchControl('firstPerson');
   const point=TEST_CHECKPOINTS[index],late=['hang-travel','hang-ready','ending','complete'].includes(point.stage);
   world.setHung(state.data.hung);world.placeMaster(late);targets=world.targets();
   let anchor=point.stage==='riddles'?{...TEMPLE_PORTAL.inside,y:TEMPLE_PORTAL.ground}:late?{...world.hang,z:world.hang.z+(point.kind==='hang' ? .8 : 2)}: {...world.workshop,z:world.workshop.z+1};
   let lookAt=late?world.hang:world.workshop,lamp=null,observationStatus='';
   if(point.kind==='observe'){
    const candidates=storyTargets(point.lamp);
    for(const candidate of candidates){const safe=world.observationPoint(candidate);if(safe){lamp=candidate;anchor=safe;lookAt=lamp.position;break;}}
    if(!lamp)observationStatus=(candidates.length?'该花灯暂无安全观察点':'该花灯未加载')+' · 仅预听对白，可继续切换步骤';
   }else if(point.id==='temple-enter'){anchor={...TEMPLE_PORTAL.outside,y:TEMPLE_PORTAL.ground};lookAt=TEMPLE_PORTAL.door;}
   else if(point.kind==='riddle'){
    const target=world.riddleTargets.find(t=>t.id===point.riddle);if(target){anchor={x:target.position.x,y:TEMPLE_PORTAL.ground,z:target.position.z+1};lookAt=target.position;}
   }
   testSpawn(anchor,lookAt);refresh();
   el('TestStatus').textContent=point.stage==='ending'&&!world.finishedReady?'结尾对白预听 · 成品模型尚未接入':'临时测试进度';
   if(point.kind==='dialogue')speak([point.line]);
   else if(point.kind==='observe'){
    if(lamp)enterObservation(lamp,()=>{state.advance('OBSERVATION_DONE',point.lamp);refresh();});
    else{el('TestStatus').textContent=observationStatus;speak([observation(point.lamp)]);}
   }else if(point.kind==='riddle')openRiddle({id:point.riddle});
   else if(point.kind==='craft')offerCraft();
   else if(point.kind==='hang'&&!world.finishedReady)el('TestStatus').textContent='挂灯位已到达 · 成品模型尚未接入';
  }catch(error){el('TestStatus').textContent='跳转失败：'+error.message;throw error;}
  finally{busy=false;testBusy=false;refreshTest();refresh();}
 }
 async function exitTest(){
  if(!testing||busy||testBusy||a.temple.snapshot().busy)return;
  const original=testing;testBusy=true;busy=true;refreshTest();
  try{
   clearTestStep();restoring=true;try{await a.temple.restore(original.inside);}finally{restoring=false;templeInside=a.temple.snapshot().inside;}
   await a.switchControl(original.control);
   testSpawn(original.position);a.player.yaw=original.yaw;
   if(a.controlMode()==='firstPerson')a.camera.rotation.set(0,original.yaw,0,'YXZ');a.player.updateCamera(0,true);
   state=original.state;testing=null;delete document.documentElement.dataset.storyTesting;
   world.setHung(state.data.hung);world.placeMaster(['hang-travel','hang-ready','ending','complete'].includes(state.stage));
   refresh();ui.toast('已退出测试，恢复原来的剧情进度');
  }finally{busy=false;testBusy=false;refreshTest();}
 }
 function setMode(value){mode=value;ui.setMode(mode);world.setVisible(mode==='play');a.setPlayBoatsHidden?.(mode==='play');if(mode!=='play'){selectedTarget=null;navigation.reset();world.setRoute([]);navKey='';}a.orbit.enabled=mode==='preview'&&a.controlMode()==='orbit';el('Prompt').hidden=true;refresh();}
 function returnMenu(){if(busy||a.temple.snapshot().busy)return;if(testing){run(async()=>{await exitTest();returnMenu();});return;}savePose();exitObservation();closeDialogue(true);closeRiddle();hideModal();stop();if(mode==='preview')previousMode=a.controlMode();restoreEndingCamera();setMode('menu');}
 async function preview(){if(!ready||busy)return;if(testing)await exitTest();stop();setMode('preview');await a.switchControl(previousMode);a.orbit.enabled=a.controlMode()==='orbit';}
 async function startGame(reset){if(!ready||busy)return;busy=true;stop();el('LoadStatus').textContent='正在准备师傅与任务位置…';
  try{
   if(!a.modelVisible())throw Error('请在预览模式中打开“显示模型”，再开始游玩。');
   await a.ensureScene();
   if(!await a.setTimeOfDay('night'))throw Error('20:00 夜景加载失败，请重试进入游玩模式。');
   await a.switchControl('firstPerson');await world.prepare();
   if(reset)state.reset();else if(!state.data.started)state.reset();
   world.setHung(state.data.hung);await world.loadFinished().catch(e=>ui.toast('成品模型加载失败：'+e.message));
   restoring=true;try{await a.temple.restore(state.data.inside);}finally{restoring=false;templeInside=a.temple.snapshot().inside;}if(templeInside&&state.stage==='temple-enter')state.temple(true);
   const pose=!reset&&state.data.pose,anchor=state.data.inside?{...TEMPLE_PORTAL.inside,y:TEMPLE_PORTAL.ground}:world.workshop;
   const spawn=a.findSpawn(pose?.x??anchor.x,(pose?.z??anchor.z)+(pose||state.data.inside?0:1),pose?.y??anchor.y);
   if(!spawn)throw Error('没有找到安全的人物落脚点，请检查预览场景。');
   a.player.spawn(spawn);a.player.yaw=pose?.yaw??0;if(a.controlMode()==='firstPerson')a.camera.rotation.set(0,a.player.yaw,0,'YXZ');a.player.updateCamera(0,true);world.clearObservations();setMode('play');startRiddleIntro();world.placeMaster(['hang-travel','hang-ready','ending','complete'].includes(state.stage));
   if(state.stage==='ending'&&world.finishedReady)beginEnding();
   ui.toast('W / A / S / D 行走 · 面向目标按 E');
  }finally{busy=false;el('LoadStatus').textContent='预览调整会同步用于剧情模式。';refresh();}
 }
 function requestNew(){if(state.data.started){showModal('开始新的旅程？','将重置剧情进度和图鉴，保留你搭建的场景与所有调节设置。',[{label:'保留进度',action:hideModal},{label:'重新开始',action:()=>{hideModal();run(()=>startGame(true));}}]);}else run(()=>startGame(true));}
 function offerCraft(){showModal('制作场景暂未接入','你可以暂时跳过制作，前往庙门外的街道体验第四幕。挂灯需要你提供另一项目的成品模型。',[{label:'稍后继续',action:hideModal},{label:'跳过制作，体验第四幕',action:()=>{hideModal();if(!state.advance('CRAFT_DONE','preview'))return;world.placeMaster(true);speak(HANG.slice(0,2),()=>{world.placeMaster(true);refresh();});}}]);}
 function visitMaster(){if(state.stage==='intro')speak(INTRO,()=>{state.advance('INTRO_DONE');refresh();});else if(state.stage==='return')speak(RETURN,()=>{state.advance('RETURN_DONE');offerCraft();});else if(state.stage==='craft')offerCraft();else ui.toast(state.objective);}
 function restoreEndingCamera(){if(!endingPose)return;a.camera.position.copy(endingPose.position);a.camera.quaternion.copy(endingPose.quaternion);endingPose=null;a.player.updateCamera(0,true);}
 function beginEnding(){if(!world.finishedReady){ui.toast('请先恢复成品资源，再继续结尾');return;}endingPose={position:a.camera.position.clone(),quaternion:a.camera.quaternion.clone(),start:performance.now()};const framing=a.camera.clone();framing.position.set(world.hang.x+2,world.hang.y+1.8,world.hang.z+3);framing.lookAt(world.hang.x,world.hang.y+1,world.hang.z);endingPose.target=framing.position.clone();endingPose.rotation=framing.quaternion.clone();speak(HANG.slice(3),()=>{state.advance('ENDING_DONE');restoreEndingCamera();ui.toast('灯入长街 · 你的灯已留在这条街上');});}
 async function hangLantern(){if(state.stage!=='hang-ready')return;
  if(!world.finishedReady){showModal('等待你的成品荷花灯','挂灯位已经准备好。请提供另一制作项目的成品模型或项目路径，接入后即可继续；这里不会用水灯替代，也不会提前标记完成。',[{label:'返回街景',action:hideModal},{label:'重新检查成品资源',action:()=>run(async()=>{if(await world.refreshAssets()){hideModal();ui.toast('成品已就绪，按 E 挂灯');}else ui.toast('尚未配置成品模型');})}]);return;}
  busy=true;stop();try{if(await world.animateHang()){state.advance('HANG_DONE',true);beginEnding();}}finally{busy=false;refresh();}
 }
 function chooseTarget(){const p=a.player.position;eye.copy(p);eye.y+=.53;a.camera.getWorldDirection(direction);direction.y=0;direction.normalize();
  const list=[];
  if(a.temple.snapshot().near)list.push({kind:'temple',distance:Math.hypot(p.x-(templeInside?TEMPLE_PORTAL.inside.x:TEMPLE_PORTAL.door.x),p.z-(templeInside?TEMPLE_PORTAL.inside.z:TEMPLE_PORTAL.door.z)),label:templeInside?'按 E · 离开夫子庙':'按 E · 进入夫子庙'});
  const masterAt=['hang-travel','hang-ready','ending','complete'].includes(state.stage)?{x:world.hang.x-.65,y:world.hang.y,z:world.hang.z+.3}:world.workshop;
  const md=Math.hypot(p.x-masterAt.x,p.z-masterAt.z);if(md<1.15&&Math.abs(p.y-masterAt.y)<.8&&!['hang-travel','hang-ready','ending','complete'].includes(state.stage))list.push({kind:'master',distance:md,label:'按 E · 与扎灯师傅交谈'});
  if(['hang-ready','ending'].includes(state.stage)){const d=Math.hypot(p.x-world.hang.x,p.z-world.hang.z);if(d<1.25&&Math.abs(p.y-world.hang.y)<.8)list.push({kind:'hang',distance:d,label:state.stage==='ending'?'按 E · 继续结尾对白':world.finishedReady?'按 E · 挂上荷花灯':'按 E · 查看挂灯位（成品待提供）'});}
  if(state.stage==='riddles'&&templeInside){for(const t of world.riddleTargets){const dx=t.position.x-p.x,dz=t.position.z-p.z,d=Math.hypot(dx,dz),facing=d<.05?1:(direction.x*dx+direction.z*dz)/d;if(d<1.7&&facing>.18&&Math.abs(t.position.y-(p.y+1.55))<1.3&&a.lineClear(eye,t.position))list.push({kind:'riddle',distance:d,target:t,label:state.data.solvedRiddles.includes(t.id)?'按 E · 这个灯谜已经猜过了':'按 E · 猜第 '+String(t.id).padStart(2,'0')+' 道灯谜'});}}
  for(const t of storyTargets()){const dock=t.water?world.observationPoint(t):null;if(t.water&&(!dock||Math.hypot(p.x-dock.x,p.z-dock.z)>.6||Math.abs(p.y-dock.y)>.2))continue;const dx=t.position.x-p.x,dz=t.position.z-p.z,centerDistance=Math.hypot(dx,dz);const closest=t.bounds.clone();closest.min.y=closest.max.y=p.y;const distance=t.water?centerDistance:closest.distanceToPoint(p);const maxDistance=t.water?Math.hypot(t.position.x-dock.x,t.position.z-dock.z)+.65:1.35;if(distance>maxDistance)continue;
   const facing=centerDistance<.05?1:(direction.x*dx+direction.z*dz)/centerDistance;
   if(canObserve({distance,facing,visible:true,onShore:!t.water||!!dock,water:t.water,maxDistance})&&a.lineClear(eye,t.position)){
    list.push({kind:'lamp',distance,target:t,label:state.data.observed.includes(t.id)?'按 E · 重温'+t.lamp.name:state.currentLantern?.id===t.id?'按 E · 欣赏'+t.lamp.name:'按 E · 查看'+t.lamp.name});}
  }
  list.sort((x,y)=>{const rank=t=>t.kind==='riddle'?0:t.kind==='lamp'&&t.target.id===state.currentLantern?.id?1:t.kind==='lamp'?3:2;return rank(x)-rank(y)||x.distance-y.distance;});return list[0]||null;
 }
 async function dispatchInteraction(){if(mode!=='play'||blocked())return false;current=chooseTarget();if(!current)return false;
  if(current.kind==='temple')return a.temple.activate();if(current.kind==='riddle'){openRiddle(current.target);return true;}
  if(current.kind==='master'){visitMaster();return true;}
  if(current.kind==='hang'){if(state.stage==='ending')beginEnding();else await hangLantern();return true;}
  const t=current.target,unlocked=state.data.observed.includes(t.id);if(!unlocked&&state.currentLantern?.id!==t.id){ui.toast('请先完成：'+state.objective);return true;}
  enterObservation(t,()=>{if(!unlocked&&state.advance('OBSERVATION_DONE',t.id))ui.toast('图鉴已更新：'+t.lamp.name+' · '+state.objective);refresh();});return true;
 }
 async function activate(){try{if(exitObservation(true))return true;return await dispatchInteraction();}catch(error){console.error('剧情交互失败',error);ui.toast(error.message||'交互失败，请重试');return false;}}
 function objectivePoint(){if(['intro','return','craft'].includes(state.stage))return world.workshop;if(state.stage==='riddles'&&state.data.solvedRiddles.length>=5)return {...(templeInside?TEMPLE_PORTAL.inside:TEMPLE_PORTAL.outside),y:TEMPLE_PORTAL.ground};if(state.stage==='riddles'&&!templeInside)return {...TEMPLE_PORTAL.outside,y:TEMPLE_PORTAL.ground};if(state.stage==='riddles'&&templeInside){const r=world.riddleTargets.find(t=>!state.data.solvedRiddles.includes(t.id));if(r)return r.position;}if(['temple-enter','temple-exit'].includes(state.stage))return {...(state.stage==='temple-enter'?TEMPLE_PORTAL.outside:TEMPLE_PORTAL.inside),y:TEMPLE_PORTAL.ground};if(state.currentLantern){const candidates=storyTargets(state.currentLantern.id).sort((x,y)=>x.position.distanceToSquared(a.player.position)-y.position.distanceToSquared(a.player.position));for(const t of candidates){const point=world.observationPoint(t);if(point)return point;}return null;}return world.hang;}
 function update(now){if(observing?.closeup&&observing.closeup.aspect!==a.camera.aspect)resizeObservation();world.update(now);if(endingPose&&dialogue){const t=matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.min(1,(now-endingPose.start)/2400),k=t*t*(3-2*t);a.camera.position.lerpVectors(endingPose.position,endingPose.target,k);a.camera.quaternion.slerpQuaternions(endingPose.quaternion,endingPose.rotation,k);}if(mode!=='play')return;navigation.tick();if(navigation.revision!==routeRevision){routeRevision=navigation.revision;world.setRoute(navigation.path);}if(now-lastUpdate<120)return;lastUpdate=now;targets=world.targets();current=blocked()?null:chooseTarget();el('Prompt').hidden=!current;el('Prompt').textContent=current?.label||'';if(selectedTarget&&selectedTarget.stage!==state.stage)selectedTarget=null;targetPoint=selectedTarget?.point||objectivePoint();const key=targetPoint?[state.stage,selectedTarget?.label||'',targetPoint.x.toFixed(2),targetPoint.y.toFixed(2),targetPoint.z.toFixed(2)].join(':'):'';if(key!==navKey){navKey=key;navigation.request(a.player.position,targetPoint);}navigation.follow(a.player.position);drawNavigation();
  if(state.currentLantern){if(!storyTargets(state.currentLantern.id).length)el('Detail').textContent='目标灯当前隐藏或未加载，请在预览中打开对应模型。';else el('Detail').textContent=targetPoint?(state.currentLantern.water?'沿地图前往原船位上方步道，面向水灯按 E。':'靠近目标按 E · 再按 E 结束赏灯并解锁图鉴'):'暂未找到安全观察点，请检查预览中的花灯位置。';}
  if(!testing&&!blocked()&&state.stage==='hang-travel'&&Math.hypot(a.player.position.x-world.hang.x,a.player.position.z-world.hang.z)<1.5&&Math.abs(a.player.position.y-world.hang.y)<.8)speak([HANG[2]],()=>{state.advance('ARRIVAL_DONE');refresh();});
  if(now-lastSave>5000&&!blocked()){savePose();lastSave=now;}
 }
 function updateMarker(){const marker=el('LampMarker');marker.hidden=true;if(mode!=='play'||modal)return;const lamp=observing?.target||(state.currentLantern?storyTargets(state.currentLantern.id).sort((x,y)=>x.position.distanceToSquared(a.player.position)-y.position.distanceToSquared(a.player.position))[0]:null);if(!lamp)return;const point=lamp.position.clone();point.y=lamp.bounds.max.y+(observing?.closeup?(lamp.bounds.max.y-lamp.bounds.min.y)*.12:.24);const projection=point.project(a.camera);if(projection.z < -1||projection.z>1||Math.abs(projection.x)>.96||Math.abs(projection.y)>.94)return;marker.style.left=(projection.x*.5+.5)*innerWidth+'px';marker.style.top=(-projection.y*.5+.5)*innerHeight+'px';marker.hidden=false;}
 el('MapPanel').onclick=()=>{if(!observing)openMap();};el('MapPanel').onkeydown=e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();if(!observing)openMap();}};
 el('Start').onclick=requestNew;el('Continue').onclick=()=>run(()=>startGame(false));el('Preview').onclick=()=>run(preview);el('Back').onclick=returnMenu;el('CatalogButton').onclick=()=>{if(!observing)catalog();};
 el('Camera').onclick=()=>{if(!blocked())run(()=>a.switchControl(a.controlMode()==='firstPerson'?'thirdPerson':'firstPerson'));};
 const testGroups=new Map();
 TEST_CHECKPOINTS.forEach((point,index)=>{
  let group=testGroups.get(point.group);
  if(!group){group=document.createElement('optgroup');group.label=point.group;testGroups.set(point.group,group);el('TestSelect').append(group);}
  const option=document.createElement('option');option.value=String(index);option.textContent=point.label;group.append(option);
 });
 el('TestToggle').onclick=()=>run(()=>testing?exitTest():jumpTest(checkpointIndex(state,dialogue?.lines[dialogue.index]?.id)));
 el('TestPrev').onclick=()=>run(()=>jumpTest(testIndex-1));
 el('TestNext').onclick=()=>run(()=>jumpTest(testIndex+1));
 el('TestReplay').onclick=()=>run(()=>jumpTest(testIndex));
 el('TestSelect').onchange=e=>run(()=>jumpTest(Number(e.target.value)));
 el('TestExit').onclick=()=>run(exitTest);
 el('DialogueNext').onclick=nextLine;el('RiddleForm').addEventListener('submit',submitRiddle);el('RiddleClose').onclick=closeRiddle;el('DialogueCancel').onclick=()=>{if(!exitObservation())closeDialogue(true);restoreEndingCamera();};el('DialogueRetry').onclick=()=>dialogue&&renderLine();el('ModalClose').onclick=hideModal;
 const key=e=>{if(endingPose&&['KeyW','KeyA','KeyS','KeyD'].includes(e.code))restoreEndingCamera();if(e.code==='Escape'&&mode==='play'){if(!el('Riddle').hidden){e.preventDefault();e.stopImmediatePropagation();closeRiddle();return;}if(observing){e.preventDefault();e.stopImmediatePropagation();}else if(modal){hideModal();e.stopImmediatePropagation();}else if(dialogue){closeDialogue(true);restoreEndingCamera();e.stopImmediatePropagation();}}if(mode==='play'&&!e.repeat&&!e.target.closest('input,textarea,[contenteditable=true]')){const toggleHud=(number,id,dataset)=>{if(e.code!==`Digit${number}`&&e.code!==`Numpad${number}`)return false;e.preventDefault();e.stopImmediatePropagation();const item=el(id),root=document.documentElement,key=dataset+'Hotkey';const currentlyVisible=root.dataset[key]==='show'||(root.dataset[key]!=='hide'&&getComputedStyle(item).display!=='none');root.dataset[key]=currentlyVisible?'hide':'show';return true;};if(toggleHud(7,'TestToggle','storyTest')||toggleHud(8,'Quest','storyQuest'))return;}if(!el('Riddle').hidden&&e.code==='KeyE'&&!e.target.closest('input,textarea,[contenteditable=true]')){e.preventDefault();e.stopImmediatePropagation();}if(movementLocked()&&['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(e.code)&&!e.target.closest('input,textarea')){e.preventDefault();e.stopImmediatePropagation();}};
 const previewEscape=e=>{if(mode==='preview'&&e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();returnMenu();}};document.addEventListener('keydown',key,true);document.addEventListener('keydown',previewEscape,true);window.addEventListener('pagehide',savePose);
 const visibility=()=>{if(!document.hidden)return;if(observing){if(dialogue?.voiced){clearAudio();el('VoiceStatus').textContent='配音已暂停，可重试或按 E 结束赏灯。';el('DialogueRetry').hidden=false;}return;}if(dialogue){closeDialogue(true);restoreEndingCamera();ui.toast('对白已暂停，可重新交互继续。');}};document.addEventListener('visibilitychange',visibility);
 setMode('menu');
 return {update(now){update(now);updateMarker();},activate,navigation,get observing(){return !!observing;},get lookSensitivity(){return observing?.closeup?.lookScale??1;},get testing(){return !!testing;},get state(){return state;},get movementLocked(){return movementLocked();},get lookLocked(){return lookLocked();},get blocked(){return blocked();},get mode(){return mode;},world,
  async enter(value,options={}){if(!ready||busy||a.temple.snapshot().busy)throw Error('场景尚未就绪');if(testing)await exitTest();if(value==='play'){if(options.newGame)state.beginNew(options.saveId);else if(options.saveId)state.selectSlot(options.saveId);await startGame(false);}else if(value==='preview')await preview();else throw Error('未知的游戏模式');},
  ready(){ready=true;for(const id of ['Start','Continue','Preview'])el(id).disabled=false;el('LoadStatus').textContent='场景已就绪 · 预览调整会同步用于剧情模式';refresh();},
  onTempleChange(s){if(s.busy||s.error||restoring)return;if(templeInside!==s.inside){templeInside=s.inside;if(mode==='play'){state.temple(s.inside);navigation.reset();navKey='';savePose();refresh();if(s.inside)startRiddleIntro();}}},
  get snapshot(){return {mode,testing:!!testing,testBusy,testIndex:testing?testIndex:null,checkpointId:testing?TEST_CHECKPOINTS[testIndex].id:null,blocked:blocked(),movementLocked:movementLocked(),observing:observing?.target.id||null,riddle:!el('Riddle').hidden?riddleTarget?.id:null,stage:state.stage,observed:[...state.data.observed],inside:state.data.inside,objective:state.objective,target:targetPoint,current:current?{kind:current.kind,id:current.target?.id,instance:current.target?.instance}:null,finishedReady:world.finishedReady,dialogueId:dialogue?.lines[dialogue.index]?.id||null};},
  completeCraft(){if(!state.advance('CRAFT_DONE','workshop'))return false;world.placeMaster(true);if(mode==='play')speak(HANG.slice(0,2),()=>world.placeMaster(true));refresh();return true;},
  dispose(){exitObservation();delete document.documentElement.dataset.storyObserving;delete document.documentElement.dataset.storyTesting;clearTimeout(riddleFocus);hideModal();navigation.reset();clearAudio();stopRiddleCue();document.removeEventListener('keydown',key,true);document.removeEventListener('keydown',previewEscape,true);window.removeEventListener('pagehide',savePose);document.removeEventListener('visibilitychange',visibility);ui.dispose();}};
}
