import {makeScissors} from './scissors.js';
import * as THREE from 'three';
import {CutProcess,DyeProcess,PressProcess,clamp} from './paper-process.mjs';
import {makePaper,colorPaper,addVeins,makePress} from './paper-visuals.js';
import {currentStage} from './workflow.mjs';
import {ManualPressProcess} from './manual-press-process.mjs';
import {makeManualPress} from './manual-press-visuals.js';
import {disposeGroup,makeHand,alignHandGrip} from './workbench-visuals.js';
const $=id=>document.getElementById(id),V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
export function createPaperWork({scene,camera,canvas,world,audio,getState,onComplete,onDiscardDye,canInteract}){
 const root=new THREE.Group();root.name='paper-work';scene.add(root);root.visible=false;
 const surface=$('handwork-surface'),ray=new THREE.Raycaster();
 let active=false,stage,index,mode,leaf,profile,process,paper,hand,outline,cutDot,knife,veins,machine,bin,pointer=null,drag=null,hang=0,base,notice='',lastSound=0,dragPlane,dragOrigin,paperOrigin,actionStart;
 let pressMode='machine',manual=null,windPointer=null,manualDragOffset=null,suppressManualClick=false;
 const isManual=()=>mode==='press'&&pressMode==='manual';
 const status=t=>{$('handwork-status').textContent=t;};
 function project(p){const r=canvas.getBoundingClientRect(),q=p.clone().project(camera);return {x:r.left+(q.x+1)*r.width/2,y:r.top+(1-q.y)*r.height/2};}
 function hit(e,y=1.05){const r=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);return ray.ray.intersectPlane(new THREE.Plane(V(0,1,0),-y),V());}
 function near(e,p,r=48){const q=project(p);return Math.hypot(q.x-e.clientX,q.y-e.clientY)<r;}
 function box(size,pos,color){const m=new THREE.Mesh(new THREE.BoxGeometry(...size),new THREE.MeshStandardMaterial({color,roughness:.85}));m.position.copy(pos);root.add(m);return m;}
 function evidence(){return {mode:mode==='cut'?'trace':mode,quality:mode==='dye'?clamp(1-Math.abs(process.dose-.8)):1,curve:0,oval:0,dose:mode==='dye'?process.dose:profile.dose,depth:mode==='dye'?process.maxDepth:profile.depth,angle:0,distance:1};}
 function sound(){const now=performance.now();if(now-lastSound>240){audio.play(mode==='cut'?'paper_cutting':stage.id);lastSound=now;}}
 function pickProfile(){const items=leaf?getState().leaves:getState().papers,p=items[index*(leaf?7:6)];return {leaf,dose:p?.dyeDose??.8,depth:p?.dyeDepth??.8};}
 function build(){
  releasePointers();suppressManualClick=false;manual=null;disposeGroup(root);paper=hand=outline=cutDot=knife=veins=machine=bin=null;notice='';hang=0;drag=null;
  if(mode==='dye'){
   process=new DyeProcess();paper=makePaper({leaf,dose:0});paper.scale.setScalar(.56);paper.visible=false;root.add(paper);
   bin=world.dyeBin.position;
   hand=makeHand(root,false,'pinch');hand.scale.setScalar(.58);hand.visible=false;
  }else if(isManual()){
   process=new ManualPressProcess();manual=makeManualPress(profile);root.add(manual.root);paper=manual.paper;manual.update(process);
  }else if(mode==='press'){
   process=new PressProcess();machine=makePress();root.add(machine.root);machine.root.position.set(3.08,1.01,1.42);
   paper=makePaper(profile);paper.scale.setScalar(.72);paper.rotation.x=-Math.PI/2;paper.position.set(4.05,1.045,1.76);root.add(paper);base=paper.geometry.attributes.position.array.slice();
   veins=addVeins(paper,leaf,true);veins.visible=false;
  }else{
   const kind=stage.id==='paper_cutting'?'square':leaf?'leaf':'petal';process=new CutProcess(kind);
   paper=makePaper(stage.id==='paper_cutting'?{dose:0}:profile,'square',stage.id==='paper_cutting'?1.05:.72);root.add(paper);const st=world.stations[stage.station];paper.rotation.x=-Math.PI/2;paper.position.set(st.x,1.055,st.z+.25);
   if(kind!=='square')veins=addVeins(paper,leaf);
   outline=new THREE.Line(new THREE.BufferGeometry().setFromPoints(process.points.map(p=>V(p.x,p.y,.006))),new THREE.LineBasicMaterial({color:'#624a33',depthTest:false}));paper.add(outline);outline.renderOrder=15;
   cutDot=new THREE.Mesh(new THREE.TorusGeometry(.022,.004,6,20),new THREE.MeshBasicMaterial({color:'#a84e35',depthTest:false}));cutDot.renderOrder=16;paper.add(cutDot);
   knife=makeScissors();root.add(knife);knife.rotation.x=-Math.PI/2;knife.position.copy(paper.position).add(V(.43,.026,0));
  }
  paper.name='active-paper';updateUI();
 }
 function updateUI(){
  const confirm=$('handwork-confirm'),retry=$('handwork-retry');
  retry.hidden=mode!=='cut';retry.textContent='重新裁剪';confirm.hidden=mode==='press'&&process.phase==='running';
  if(mode==='dye'){
   const action=contextAction();
   $('paper-stock').disabled=process.phase!=='stock';$('paper-stock-count').textContent='第 '+(index+1)+' / '+stage.total+' 批 · 方纸在桌面左上角';
   $('paper-waste-count').textContent='废纸 '+getState().dyeWaste+' 批';confirm.textContent=action?('E · '+action.label):hang?'正在挂纸…':'移动纸张靠近目标';confirm.disabled=!action||hang>0;
   const clock=$('dye-clock');clock.hidden=process.phase==='stock';
   const t=Math.floor(process.simulatedSeconds);$('dye-time').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
   $('dye-real-time').textContent='实际浸染 '+process.seconds.toFixed(1)+' 秒 · 20 倍速';
   $('dye-time-note').textContent=process.simulatedSeconds>120?'已超过建议时间 · 可提纸后弃置':process.simulatedSeconds>=60?(process.phase==='dipping'?'已到建议区间 · 按 E 提纸':'染色已就绪 · 移至阴干架'):'建议工艺时间 01:00—02:00';
   clock.dataset.state=process.simulatedSeconds>120?'over':process.simulatedSeconds>=60?'ready':'waiting';
   const hints={stock:'点击桌面左上角方纸，拖至染盘附近，再按 E 浸润。',held:'按住纸张拖动；松手原位停留。靠近染盘、阴干架或废料桶后按 E。',dipping:'正在浸染 · 按 E 提纸。松开鼠标不会移动纸张或停止染色。',lifting:'正在抬离染液，保留本次渐变…',review:process.ready?'染色已合适：拖到阴干架旁按 E 挂纸；不满意可移至废料桶。':'时间不足可移回染盘继续浸染；过深可移至废料桶弃置。'};
   status(notice||(hang?'正在挂纸；纸色与浸染结果保持一致。':action?('【E】'+action.label+' · '+(action.hint||'松手不会自动执行')):hints[process.phase]));
   for(const [key,label,pos] of [['bath','染盘',world.bathPositions[leaf?1:0]],['rack','阴干架',rackTarget()],['bin','废料桶',bin]]){
    const el=$('dye-target-'+key),q=project(pos);el.style.left=q.x+'px';el.style.top=q.y+'px';el.classList.toggle('near',action?.key===key);el.textContent=action?.key===key?'E · '+action.label:label;
   }
  }else if(isManual()){
   manualUI(confirm);
  }else if(mode==='press'){
   confirm.disabled=false;confirm.textContent=process.phase==='done'?'取出压纹方纸 →':'启动滚轴压纹';
   status(process.phase==='running'?'滚轴运转 · 卷线进纸 '+Math.round(process.progress*100)+'% · 等待自动停止':process.phase==='done'?'滚轴已停止，压纹完成。右侧仍是方纸，下一步才裁轮廓。':'右侧为阴干方纸，左侧为压纹机。点击启动，等待完整进纸与压纹。');
  }else{
   confirm.disabled=!process.ready;confirm.textContent=stage.id==='paper_cutting'?'收好方形纸片 →':'收好裁成的'+(leaf?'叶片':'花瓣')+' →';
   status(process.ready?'轮廓裁剪完成，可以收好本批纸片。':'沿亮点附近的轨迹按住或点击左键继续剪；松手、偏离只暂停，已剪进度会保留。');
  }
 }
 function releasePointers(){
  for(const el of [surface,$('handwork-confirm')])for(const id of [drag,windPointer])if(id!==null&&el.hasPointerCapture?.(id))el.releasePointerCapture(id);
  drag=null;windPointer=null;manualDragOffset=null;
 }
 function manualUI(confirm){
  const p=process.phase;
  const labels={idle:'放入方纸坯料',loading:'正在平铺放料…',loaded:'贴紧模具表面',fitting:'正在抚平贴模…',winding:'按住缠线 · '+Math.round(process.winding*100)+'%',wrapped:'将工装竖直立起',standing:'正在立模…',hammering:'锤击压实 · '+process.hits+' / 8',compressed:'拉高模具复位',restoring:'正在拉高模具…',restored:'抽出棉线',unthreading:'正在抽线…',unthreaded:'取出压纹方纸',extracting:'正在取出方纸…',done:'收好压纹方纸 →'};
  confirm.hidden=false;confirm.textContent=labels[p]||'已收好';confirm.disabled=['loading','fitting','standing','restoring','unthreading','extracting','collected'].includes(p)||(p==='hammering'&&process.strike>0);
  const hints={idle:'将右侧阴干方纸拖到左侧模具型腔；也可点击「放入方纸坯料」。',loading:'将方纸平铺到模具上，暂不缠线。',loaded:'放料完成。点击「贴紧模具表面」，先让纸张完全贴合模具，再开始缠线。',fitting:'正在沿模具表面抚平纸张，贴紧完成后才可缠线。',winding:'沿花瓣面绕轴缠线，绷紧固定纸张 · 按住模具或下方按钮缠线，松手暂停。',wrapped:'棉线已绷紧，点击将整套工装立到平台上。',standing:'正在竖立工装，等待底座就稳。',hammering:'锤击下压，消除模具内部空隙，完成花瓣塑形 · 点击模具或按钮逐次敲打。',compressed:'已压实。向上拉高被敲扁的模具，使其恢复原高度，不需要拆开模具。',restoring:'保持模具完整，正在竖直拉高复位。',restored:'模具已恢复原高度，接下来抽出缠绕的棉线。',unthreading:'正在从模具上逐圈抽出棉线，请等待。',unthreaded:'棉线已全部取出，可以取出压好筋纹的方纸。',extracting:'正在取出方纸。此时只有筋纹，裁剪工序才显示花瓣轮廓。',done:'塑形压纹完成。取出本批方纸，后续再裁剪花瓣 / 叶片。'};
  status(notice||hints[p]);
  $('stage-hint').textContent=hints[p];
  const step={idle:0,loading:0,loaded:1,fitting:1,winding:2,wrapped:3,standing:3,hammering:4,compressed:5,restoring:5,restored:6,unthreading:6,unthreaded:7,extracting:7,done:7}[p]??7;
  $('manual-press-guide').querySelectorAll('li').forEach((el,i)=>{el.classList.toggle('current',i===step);el.classList.toggle('complete',i<step);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  $('manual-press-progress').value=process.progress;
 }
 function manualAction(){
  notice='';
  if(process.phase==='idle')process.place();
  else if(process.phase==='loaded')process.fit();
  else if(process.phase==='wrapped')process.stand();
  else if(process.phase==='hammering'){if(process.hammer())audio.play('petal_pressing');}
  else if(process.phase==='compressed')process.restore();
  else if(process.phase==='restored')process.unthread();
  else if(process.phase==='unthreaded')process.removePaper();
  else if(process.phase==='done'&&process.extract())onComplete(stage.id,index,evidence());
  if(active)updateUI();
 }
 $('press-mode').addEventListener('change',()=>{
  if(!active||mode!=='press'||!canInteract()){$('press-mode').value=pressMode;return;}
  pressMode=$('press-mode').value==='manual'?'manual':'machine';
  $('stage-hint').textContent=stage.hint;
  $('manual-press-guide').hidden=!isManual();$('handwork-tool').textContent=isManual()?'手工压磨具 · 棉线 · 木柄锤':'启动 → 卷线进纸 → 自动停机 → 取纸';build();
 });
 $('handwork-confirm').addEventListener('pointerdown',e=>{
  if(!active||!isManual()||!canInteract()||process.phase!=='winding'||e.button!==0)return;
  suppressManualClick=true;windPointer=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);e.preventDefault();
 });
 $('handwork-confirm').addEventListener('keydown',e=>{
  if(active&&isManual()&&canInteract()&&process.phase==='winding'&&['Space','Enter'].includes(e.code)){e.preventDefault();suppressManualClick=true;windPointer='keyboard';}
 });
 $('handwork-confirm').addEventListener('keyup',e=>{if(active&&isManual()&&['Space','Enter'].includes(e.code)){windPointer=null;suppressManualClick=false;e.preventDefault();}});
 $('handwork-confirm').addEventListener('blur',()=>{windPointer=null;});
 function rackTarget(){return V(3.55,1.90,-1.96);}
 function contextAction(){
  if(mode!=='dye'||hang||process.phase==='stock'||process.phase==='lifting')return null;
  if(process.phase==='dipping')return {key:'bath',label:'提起纸张',hint:'观察下深上浅的渐变'};
  const q=project(paper.position),radius=innerWidth<700?42:62;
  const targets=[['bath',world.bathPositions[leaf?1:0]],['rack',rackTarget()],['bin',bin]].map(([key,p])=>({key,d:Math.hypot(project(p).x-q.x,project(p).y-q.y)})).sort((a,b)=>a.d-b.d);
  const t=targets[0];if(t.d>radius)return null;
  if(t.key==='bath')return {...t,label:process.seconds?'继续浸染':'浸润方纸'};
  if(t.key==='bin')return {...t,label:'丢弃此纸'};
  if(process.ready)return {...t,label:'挂上阴干架'};
  return {...t,label:'暂不能挂纸',blocked:true,hint:process.simulatedSeconds>120?'染色过深，请移至废料桶':'请先完成 1—2 分钟模拟浸染'};
 }
 function beginDrag(e){
  drag=e.pointerId;const normal=camera.getWorldDirection(V());dragPlane=new THREE.Plane().setFromNormalAndCoplanarPoint(normal,paper.position);
  const r=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);
  dragOrigin=ray.ray.intersectPlane(dragPlane,V());paperOrigin=paper.position.clone();e.currentTarget.setPointerCapture?.(e.pointerId);
 }
 function take(e){if(!active||mode!=='dye'||!canInteract()||!process.take())return;notice='';paper.visible=hand.visible=true;paper.position.copy(world.paperStock.position).add(V(0,.23,0));if(e)beginDrag(e);updateUI();}
 function moveDye(e){
  if(drag!==e.pointerId||!dragOrigin)return;const r=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);
  const p=ray.ray.intersectPlane(dragPlane,V());if(!p)return;paper.position.copy(paperOrigin).add(p.sub(dragOrigin));notice='';
 }
 function releaseDye(e){if(drag!==e.pointerId)return;drag=null;process.release();updateUI();}
 function interact(){
  if(!active||mode!=='dye'||!canInteract()||drag!==null)return;const action=contextAction();if(!action)return;
  notice='';if(action.blocked){notice=action.hint;updateUI();return;}
  if(action.key==='bath'){actionStart=paper.position.clone();if(process.phase==='dipping')process.liftOut();else process.immerse(.8);}
  else if(action.key==='rack'){hang=.001;drag=null;}
  else if(action.key==='bin'&&onDiscardDye()){process.reset();paper.visible=hand.visible=false;notice='已丢弃。请从桌面左上角取一片新的方纸。';}
  updateUI();
 }
 surface.addEventListener('pointerdown',e=>{
  if(!active||!canInteract()||e.button!==0)return;
  if(isManual()){
   if(process.phase==='idle'&&near(e,paper.getWorldPosition(V()),60)){
    const q=hit(e,1.06);if(!q)return;drag=e.pointerId;manualDragOffset=paper.getWorldPosition(V()).sub(q);surface.setPointerCapture(e.pointerId);
   }else if(near(e,manual.moldTarget(),80)){
    if(process.phase==='winding'){windPointer=e.pointerId;surface.setPointerCapture(e.pointerId);}
    else if(['loaded','hammering'].includes(process.phase))manualAction();
   }
  }else if(mode==='dye'){
   if(process.phase==='stock'){if(near(e,world.paperStock.position,innerWidth<700?35:52))take(e);return;}
   if(hang||['dipping','lifting'].includes(process.phase))return;
   if(!near(e,paper.position,innerWidth<700?55:75))return;
   beginDrag(e);
  }else if(mode==='cut'){
   const q=hit(e,1.055);if(!q)return;paper.updateMatrixWorld(true);const p=paper.worldToLocal(q.clone());if(process.down(p)){drag=e.pointerId;surface.setPointerCapture(e.pointerId);knife.position.copy(q).add(V(0,.028,0));sound();}updateUI();
  }
 });
 window.addEventListener('pointermove',e=>{
  if(!active||!canInteract()||drag!==e.pointerId)return;
  if(isManual()){const q=hit(e,1.06);if(q&&manualDragOffset)paper.position.copy(manual.root.worldToLocal(q.add(manualDragOffset)));}
  else if(mode==='dye')moveDye(e);
  else if(mode==='cut'){const q=hit(e,1.055);if(q){paper.updateMatrixWorld(true);const p=paper.worldToLocal(q.clone());process.move(p);if(process.onTrack){knife.position.copy(q).add(V(0,.028,0));sound();}updateUI();}}
 });
 window.addEventListener('pointerup',e=>{if(windPointer===e.pointerId)windPointer=null;if(!active||drag!==e.pointerId)return;if(isManual()){releasePointers();if(canInteract()&&near(e,manual.moldTarget(),85)){notice='';process.place();}else notice='将纸张移到左侧模具上，再松手放料。';updateUI();return;}if(mode==='dye')releaseDye(e);else{process.up();drag=null;updateUI();}});
 function interrupt(){if(!active)return;releasePointers();suppressManualClick=false;if(mode==='cut')process.up();updateUI();}
 window.addEventListener('craft-book-open',interrupt);window.addEventListener('pointercancel',interrupt);window.addEventListener('blur',interrupt);document.addEventListener('visibilitychange',()=>{if(document.hidden)interrupt();});
 $('paper-stock').addEventListener('pointerdown',e=>{if(e.button===0){e.preventDefault();take();}});
 $('paper-stock').onclick=e=>{if(e.detail===0)take();};
 function close(){if(!active)return;$('stage-hint').textContent=currentStage(getState()).hint;releasePointers();active=false;$('press-mode-panel').hidden=true;drag=null;hang=0;disposeGroup(root);root.visible=false;$('paper-supplies').hidden=true;$('dye-context').hidden=true;document.body.classList.remove('paper-work','press-work');world.setPaperFocus(false);world.sync(getState());}
 return {open(s,i){
  close();active=true;stage=s;index=i;leaf=s.id.includes('leaf');mode=s.id.includes('dye')?'dye':s.id.includes('pressing')?'press':'cut';profile=pickProfile();root.visible=true;world.setPaperFocus(true);document.body.classList.add('paper-work');
  $('paper-supplies').hidden=mode!=='dye';$('dye-context').hidden=mode!=='dye';$('handwork-title').textContent=s.name;$('handwork-subtitle').textContent='裁方纸 → 浸染 → 阴干 → 滚轴压纹 → 裁花瓣 / 叶片 · 第 '+(i+1)+' / '+s.total+' 批';
  $('handwork-tool').textContent=mode==='dye'?'方纸素材库 · 染盘 · 后方阴干架':mode==='press'?'启动 → 卷线进纸 → 自动停机 → 取纸':'剪刀 · 沿轨迹左键续剪 · 松手保留进度';
  $('handwork-rotate-left').hidden=$('handwork-rotate-right').hidden=true;
  document.body.classList.toggle('press-work',mode==='press');$('press-mode-panel').hidden=mode!=='press';$('press-mode').value=pressMode;$('manual-press-guide').hidden=!isManual();if(isManual())$('handwork-tool').textContent='手工压磨具 · 棉线 · 木柄锤';
  build();$('handwork-retry').onclick=()=>{if(mode==='cut'&&canInteract())build();};
  $('handwork-confirm').onclick=()=>{
   if(!canInteract())return;
   if(isManual()){if(suppressManualClick){suppressManualClick=false;return;}manualAction();}
   else if(mode==='press'){if(process.phase==='idle'){process.start();audio.play('petal_pressing');}else if(process.phase==='done')onComplete(stage.id,index,evidence());}
   else if(mode==='cut'&&process.ready)onComplete(stage.id,index,evidence());
   else if(mode==='dye')interact();
   if(active)updateUI();
  };
 },close,interact,get active(){return active;},update(dt){
  if(!active||!canInteract())return;
  if(mode==='dye'){
   process.tick(dt);if(process.phase==='dipping'){const bath=world.bathPositions[leaf?1:0];paper.position.lerp(V(bath.x,bath.y+.20-.40*process.depth,bath.z+.025),Math.min(1,dt*7));}colorPaper(paper.geometry,{leaf,dose:process.dose,depth:process.maxDepth});
   if(process.phase==='lifting'){const bath=world.bathPositions[leaf?1:0];paper.position.lerpVectors(actionStart,V(actionStart.x,1.80,actionStart.z),process.lift*process.lift*(3-2*process.lift));}
   if(hang){hang=Math.min(1,hang+dt/1.0);const target=world.rackPositions[(leaf?6:0)+index];paper.position.lerp(target,Math.min(1,dt*7));if(hang===1){onComplete(stage.id,index,evidence());return;}}
   hand.visible=paper.visible&&!hang;hand.position.copy(paper.position);alignHandGrip(hand,paper.position.clone().add(V(.15,.18,0)));
   if(process.phase==='dipping')sound();
  }else if(isManual()){
   if(windPointer!==null&&process.phase==='winding'){process.wind(dt/3.8);sound();}if(process.phase!=='winding')windPointer=null;
   process.tick(dt);manual.update(process);
  }else if(mode==='press'){
   process.tick(dt);const t=process.progress;machine.update(t,process.rotation);
   if(process.phase==='running'){
    const entry=clamp(t/.22);paper.position.set(THREE.MathUtils.lerp(4.05,3.08,entry),1.32,THREE.MathUtils.lerp(1.76,1.68,entry));
    const p=paper.geometry.attributes.position,feed=clamp((t-.22)/.66);
    for(let i=0;i<p.count;i++){const x=base[i*3],y=base[i*3+1],travel=y+feed*.84;let yy=travel,zz=0;if(travel>.26){const a=(travel-.26)/.15;yy=.26+Math.sin(a)*.15;zz=(1-Math.cos(a))*.15;}p.setXYZ(i,x,yy,zz);}
    p.needsUpdate=true;paper.geometry.computeVertexNormals();paper.geometry.computeBoundingSphere();paper.visible=t<.90;sound();
   }else if(process.phase==='done'){
    paper.visible=true;paper.position.set(4.05,1.045,1.76);paper.geometry.attributes.position.array.set(base);paper.geometry.attributes.position.needsUpdate=true;paper.geometry.computeVertexNormals();paper.geometry.computeBoundingSphere();veins.visible=true;
   }
  }else{
   const p=process.points[Math.min(process.next,process.points.length-1)];cutDot.position.set(p.x,p.y,.009);outline.material.color.set(process.failed?'#b33128':process.ready?'#4c7248':'#624a33');
   if(process.ready&&paper.userData.cut!==true){
    const cut=stage.id==='paper_cutting'?makePaper({dose:0},'square',.62):makePaper(profile,leaf?'leaf':'petal');paper.geometry.dispose();paper.geometry=cut.geometry;cut.material.dispose();paper.userData.cut=true;
   }
  }
  if(mode==='cut'&&knife){knife.userData.setOpening(process.dragging&&process.onTrack ? .5+.45*Math.sin(performance.now()*.026) : .6);const k=Math.min(process.next,process.points.length-1),a=process.points[Math.max(0,k-1)],b=process.points[k];knife.rotation.z=-Math.atan2(b.x-a.x,b.y-a.y);}
  updateUI();
 },snapshot(){return {pressMode:mode==='press'?pressMode:null,manualTarget:manual?project(manual.moldTarget()):null,winding:process?.winding,adherence:process?.adherence,hits:process?.hits,compression:process?.compression,strike:process?.strike,mode:isManual()?'manual-press':mode==='cut'?'paper-cut':mode==='press'?'roller-press':'paper-dye',stage:stage?.id,phase:process?.phase,seconds:process?.seconds,simulatedSeconds:process?.simulatedSeconds,context:mode==='dye'?contextAction()?.key:null,stockTarget:mode==='dye'?project(world.paperStock.position):null,rack:mode==='dye'?project(rackTarget()):null,ready:mode==='press'?process?.phase==='done':process?.ready,failed:process?.failed,next:process?.next,dose:process?.dose,depth:process?.depth,progress:process?.progress,rotation:process?.rotation,dragging:drag!==null,stock:mode==='dye'&&process.phase==='stock',waste:getState().dyeWaste,profile,shape:mode==='cut'&&process.ready&&stage.id!=='paper_cutting'?(leaf?'leaf':'petal'):'square',paper:paper?project(paper.getWorldPosition(V())):null,paperPosition:paper?.getWorldPosition(V()).toArray(),bath:mode==='dye'?project(world.bathPositions[leaf?1:0]):null,bin:bin?project(bin):null,outline:mode==='cut'?process.points.map(p=>project(paper.localToWorld(V(p.x,p.y,0)))):[]};}};
}
