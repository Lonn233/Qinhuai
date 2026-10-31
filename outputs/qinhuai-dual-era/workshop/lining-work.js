import * as THREE from 'three';
import {CONFIG,STAGES} from './config.mjs';
import {liningOrientation,attachmentOrientation,DECORATION_STAGES,LINING_ROTATION_SPEED} from './lining-orientation.mjs';
import {clonePart,disposeGroup,makeHand,alignHandGrip} from './workbench-visuals.js';
const $=id=>document.getElementById(id),V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const TAU=Math.PI*2;
export function createLiningWork({scene,camera,canvas,lantern,audio,getState,onGlue,onSoak,onTrim,onComplete,canInteract}){
 const overlay=new THREE.Group(),held=new THREE.Group(),glueMarks=new THREE.Group();scene.add(overlay,held);lantern.root.add(glueMarks);glueMarks.name='workbench-glue-marks';
 const surface=$('handwork-surface'),ray=new THREE.Raycaster();
 const dropPrompt=document.createElement('span');dropPrompt.id='decoration-drop-prompt';dropPrompt.hidden=true;dropPrompt.setAttribute('role','status');document.body.append(dropPrompt);
 let active=false,stage,index=0,panel=0,tool='brush',target=null,ghost=null,dot=null,preview=null,brush=null,hand=null;
 let drag=null,rotationDrag=null,pending=false,animation=null,angle=0,notice='';
 // Invisible pick shells cover empty framework bays without changing lamp materials.
 const pickShells=new THREE.Group();lantern.root.add(pickShells);pickShells.name='lining-rotation-pick-shells';
 for(const id of ['lining_upper','lining_lower'])for(let i=1;i<=6;i++){const original=lantern.registry.get(id+'-'+i),m=new THREE.Mesh(original.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide,visible:false}));pickShells.add(m);}
 let decorationGlue=[];
 const decoration=()=>DECORATION_STAGES.includes(stage?.id);
 const itemName=()=>stage.id==='petal_assembly'?'花瓣':stage.id==='calyx_assembly'?'叶托':stage.id==='lotus_leaf_assembly'?'荷叶':stage.id==='lining_upper'?'红纸糊':'白色底纸';
 const targetLabel=()=>decoration()?(stage.id==='petal_assembly'?'第 '+(Math.floor(index/CONFIG.petals.perLayer)+1)+' 层 · ':'')+'第 '+(index+1)+' '+stage.unit+itemName():'第 '+(panel+1)+' 幅';
 const data=()=>decoration()?{glued:decorationGlue,installed:Array.from({length:getState().counts[stage.id]},(_,i)=>i)}:getState().lining[stage.id];
 function eachMaterial(object,fn){object.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(fn);});}
 function paint(object,color,opacity){eachMaterial(object,m=>{m.color.set(color);Object.assign(m,{transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});});}
 function CONFIG_STAGE_INDEX(id){return STAGES.findIndex(item=>item.id===id);}
 function applySoak(panel){return decoration()?true:onSoak(stage.id,panel);}
 function applyGlue(panel){if(!decoration())return onGlue(stage.id,panel);if(!decorationGlue.includes(panel))decorationGlue.push(panel);return true;}
 const busy=()=>!!animation||!canInteract();
 function orientation(){
 const cameraAzimuth=Math.atan2(camera.position.x-lantern.root.position.x,camera.position.z-lantern.root.position.z);
 if(!decoration())return liningOrientation(panel,lantern.root.rotation.y,cameraAzimuth);
 const p=lantern.root.worldToLocal(targetPoint());return attachmentOrientation(Math.atan2(p.x,p.z),lantern.root.rotation.y,cameraAzimuth);
 }
 function requireFacing(){if(orientation().aligned)return true;status('方位未对准：请按住灯体左右旋转，将'+targetLabel()+(decoration()?'转向自己后再拖入材料。':'转向自己后再点击。'));audio.play('blocked');return false;}
 function releasePointers(){for(const id of [drag?.id,rotationDrag?.id])if(id!==undefined)for(const el of [surface,$('lining-paper')])if(el.hasPointerCapture?.(id))el.releasePointerCapture(id);drag=null;rotationDrag=null;}
 function updateFacing(){if(!active)return;updateDropPrompt();const o=orientation(),el=$('lining-facing');el.dataset.aligned=String(o.aligned);const text=o.aligned?targetLabel()+(decoration()?' · 朝向合格，拖入材料后松手粘贴':' · 朝向合格，可以点击加工'):targetLabel()+' · '+(o.error<0?'向左':'向右')+'拖动灯体约 '+Math.round(o.degrees)+'°';if(el.textContent!==text)el.textContent=text;$('handwork-confirm').disabled=!pending||busy()||!o.aligned;}
 function updateDropPrompt(){
  dropPrompt.hidden=!active||!decoration()||tool!=='paper'||!target;
  if(dropPrompt.hidden)return;
  const p=project(target),aligned=orientation().aligned,ready=!!drag?.over&&aligned;
  dropPrompt.style.left=Math.max(95,Math.min(innerWidth-95,p.x))+'px';dropPrompt.style.top=Math.max(80,Math.min(innerHeight-70,p.y+42))+'px';
  dropPrompt.dataset.ready=String(ready);
  const text=animation?'正在上浆贴合…':!aligned?'先转动灯体，将目标转向自己':ready?'松开左键 · 自动贴合':'拖到此处，松手粘贴';
  if(dropPrompt.textContent!==text)dropPrompt.textContent=text;
 }
 function project(p){const r=canvas.getBoundingClientRect(),v=p.clone().project(camera);return {x:r.left+(v.x+1)*r.width/2,y:r.top+(1-v.y)*r.height/2};}
 function source(){return decoration()?[...lantern.registry.values()].find(o=>o.userData.workflowStage===stage.id&&o.userData.order===index):lantern.registry.get(stage.id+'-'+(panel+1));}
 function targetPoint(){
 const part=source();part.updateWorldMatrix(true,true);
 if(decoration()&&!part.geometry){
 const box=new THREE.Box3(),inverse=part.matrixWorld.clone().invert();
 part.traverse(o=>{if(!o.geometry)return;o.geometry.computeBoundingBox();box.union(o.geometry.boundingBox.clone().applyMatrix4(inverse.clone().multiply(o.matrixWorld)));});
 return part.localToWorld(box.getCenter(V()));
 }
 const geometry=part.geometry;geometry.computeBoundingBox();return part.localToWorld(geometry.boundingBox.getCenter(V()));
 }
 function alignedClone(part,isGhost=false){const copy=clonePart(part,isGhost);part.updateWorldMatrix(true,false);part.matrixWorld.decompose(copy.position,copy.quaternion,copy.scale);return copy;}
 function status(text){notice=text;$('handwork-status').textContent=text;$('handwork-status').dataset.ready=String(pending);}
 function inventory(){
  $('lining-brush').classList.toggle('selected',tool==='brush');$('lining-paper').classList.toggle('selected',tool==='paper');
  $('lining-soak').hidden=decoration();$('lining-trim').hidden=decoration()||stage.id!=='lining_lower';$('lining-soak').disabled=!!animation||data().soaked.includes(panel);$('lining-trim').disabled=!!animation||!data().installed.includes(panel)||data().trimmed.includes(panel);
  $('lining-brush').setAttribute('aria-pressed',String(tool==='brush'));$('lining-paper').setAttribute('aria-pressed',String(tool==='paper'));
  document.querySelector('.lining-inventory-caption').textContent='1 胶刷 · 2 '+itemName()+(decoration()?' · 对准松手粘贴':' · 拖入后确认');
  $('lining-paper-name').textContent=itemName();$('lining-paper-count').textContent=stage.total-data().installed.length;
  $('lining-paper').classList.toggle('white-paper',stage.id==='lining_lower');
  $('lining-paper').classList.toggle('decoration-paper',decoration());
  $('lining-paper').classList.toggle('leaf-paper',['calyx_assembly','lotus_leaf_assembly'].includes(stage.id));
  if(!decoration())for(let i=0;i<6;i++){const b=$('lining-panel-'+i),done=data().installed.includes(i),needsTrim=stage.id==='lining_lower'&&done&&!data().trimmed.includes(i),glued=data().glued.includes(i);b.classList.toggle('current',panel===i);b.classList.toggle('glued',glued);b.disabled=done&&!needsTrim||!!animation;b.textContent=(i+1)+' · '+(needsTrim?'待裁边':done?'已完成':glued?'已涂':'待涂');b.setAttribute('aria-pressed',String(panel===i));}
  $('handwork-confirm').disabled=!pending||busy()||!orientation().aligned;$('handwork-retry').disabled=!!animation;
 }
 function showHeld(){
  disposeGroup(held);held.visible=true;preview=brush=hand=null;
  if(tool==='brush'){
   brush=new THREE.Group();held.add(brush);
   const handle=new THREE.Mesh(new THREE.CylinderGeometry(.013,.018,.24,10),new THREE.MeshStandardMaterial({color:'#997947',roughness:.85}));brush.add(handle);
   const ferrule=new THREE.Mesh(new THREE.BoxGeometry(.065,.045,.022),new THREE.MeshStandardMaterial({color:'#8f9180',metalness:.3,roughness:.5}));ferrule.position.y=.135;brush.add(ferrule);
   const bristles=new THREE.Mesh(new THREE.BoxGeometry(.067,.055,.025),new THREE.MeshStandardMaterial({color:'#e7dec0',roughness:1}));bristles.position.y=.18;brush.add(bristles);brush.rotation.z=-.6;
   hand=makeHand(brush,false,'brush');hand.scale.setScalar(.7);hand.rotation.x=-Math.PI/2;hand.rotation.y=-.18;alignHandGrip(hand,V(0,-.025,0));
  }else{
   preview=new THREE.Mesh(new THREE.PlaneGeometry(.32,.39,8,8),new THREE.MeshStandardMaterial({color:stage.id==='lining_upper'?'#a23046':'#f0e8d4',side:THREE.DoubleSide,transparent:true,opacity:.8,roughness:.9}));if(decoration()){
 preview.geometry.dispose();preview.material.dispose();preview=clonePart(source());preview.position.set(0,0,0);preview.quaternion.identity();preview.scale.setScalar(1);
 const center=new THREE.Box3().setFromObject(preview).getCenter(V());preview.position.sub(center);preview.scale.setScalar(.5);preview.position.multiplyScalar(.5);
 }held.add(preview);if(!decoration()){preview.rotation.x=-.55;preview.rotation.z=-.2;}
   hand=makeHand(held,true,'pinch');hand.scale.setScalar(.65);hand.rotation.y=-.5;preview.updateMatrix();alignHandGrip(hand,V(-.14,-.12,0).applyMatrix4(preview.matrix));
  }
  held.position.set(innerWidth<700?-.34:-.72,1.30,.76);
 }
 // Keep all uncovered glue marks attached to the rotating lamp.
 function refreshGlueMarks(){
  disposeGroup(glueMarks);
  lantern.root.updateMatrixWorld(true);
  for(const i of data().glued){
   if(data().installed.includes(i))continue;
   const part=decoration()?source():lantern.registry.get(stage.id+'-'+(i+1)),mark=clonePart(part,true);
   part.updateWorldMatrix(true,false);
   const local=new THREE.Matrix4().copy(lantern.root.matrixWorld).invert().multiply(part.matrixWorld);
   local.decompose(mark.position,mark.quaternion,mark.scale);
   paint(mark,'#dce8bd',.26);mark.userData.gluePanel=i;glueMarks.add(mark);
  }
 }
 function buildTarget(){
  refreshGlueMarks();
  disposeGroup(overlay);ghost=dot=null;target=null;
  if(data().installed.includes(panel))return;
  lantern.root.updateMatrixWorld(true);ghost=alignedClone(source(),true);
  paint(ghost,data().glued.includes(panel)?'#dce8bd':'#bcc67f',data().glued.includes(panel)?.12:.14);overlay.add(ghost);
  // The glue layer is a separate translucent surface on this panel, not a replacement scene.
  target=targetPoint();dot=new THREE.Mesh(new THREE.SphereGeometry(.031,12,8),new THREE.MeshBasicMaterial({color:data().glued.includes(panel)?'#e6f2cc':'#e7d6a0',depthTest:false}));dot.position.copy(target);dot.renderOrder=20;overlay.add(dot);
 }
 function choosePanel(i,initial=false){
  const unfinishedTrim=stage?.id==='lining_lower'&&data().installed.includes(i)&&!data().trimmed.includes(i);
  if(!active||animation||!initial&&!canInteract()||data().installed.includes(i)&&!unfinishedTrim)return;
  releasePointers();pending=false;panel=i;angle=lantern.root.rotation.y;
  buildTarget();showHeld();inventory();updateFacing();status(unfinishedTrim?'白布已贴合，请点击“裁边”修去这面的多余边缘。':decoration()||data().glued.includes(i)?dropHint():'选胶刷，点击灯体上高亮的一幅，先涂浆糊。');
 }
 function dropHint(){return decoration()?'拖动手中或下方物品栏的材料，对准高亮位置后松开左键，自动上浆并粘贴。':'将纸料拖到已上胶的亮点，松手定位后点击「确认粘贴」。';}
 function selectTool(next){if(!active||animation||!canInteract())return;releasePointers();pending=false;tool=next;buildTarget();showHeld();inventory();audio.play('tool');status(next==='brush'?'胶刷在手：点击高亮灯面涂浆糊。':dropHint());}
 function heldPoint(){if(!preview)return null;held.updateWorldMatrix(true,true);return project(new THREE.Box3().setFromObject(preview).getCenter(V()));}
 function screenRay(e){const r=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);}
 function near(e){if(!target)return false;screenRay(e);if(ghost&&ray.intersectObject(ghost).length)return true;const p=project(target);return Math.hypot(e.clientX-p.x,e.clientY-p.y)<(e.pointerType==='touch'?48:34);}
 function beginGlue(){
  if(!requireFacing())return;
  if(!decoration()&&!data().soaked.includes(panel)){status('先点击“蘸浆”，再用胶刷。');return;}
  if(data().glued.includes(panel)){status('这个位置已涂好浆糊，可以切换纸料。');return;}
  animation={type:'glue',time:0,panel};audio.play('lining_lower');inventory();status('胶刷轻扫骨架，铺开一层浆糊…');
 }
 function startDrag(e){if(!active||busy()||tool!=='paper'||pending)return;drag={id:e.pointerId};e.preventDefault();e.currentTarget.setPointerCapture?.(e.pointerId);moveDrag(e);}
 function moveDrag(e){if(!drag||drag.id!==e.pointerId)return;screenRay(e);const p=ray.ray.intersectPlane(new THREE.Plane().setFromNormalAndCoplanarPoint(camera.getWorldDirection(V()),target),V());if(p)held.position.copy(p);drag.over=near(e);if(dot)dot.material.color.set(drag.over&&orientation().aligned?(decoration()||data().glued.includes(panel)?'#88c68c':'#d58b6a'):'#e7d6a0');updateDropPrompt();}
 function makePreview(){
  disposeGroup(held);preview=alignedClone(source());held.add(preview);held.position.set(0,0,0);
  eachMaterial(preview,m=>{m.transparent=true;m.opacity=.58;});
  if(decoration()){preview.userData.finalPosition=preview.position.clone();fitPreview(0);dot.visible=false;return;}
  const p=preview.geometry.attributes.position;preview.userData.finalPositions=p.array.slice();
  fitPreview(0);dot.visible=false;
 }
 function fitPreview(t){
  if(decoration()&&preview?.userData.finalPosition){
 const outward=target.clone().sub(lantern.root.position);outward.y=0;outward.normalize();
 preview.position.copy(preview.userData.finalPosition).addScaledVector(outward,(1-t)*.16);preview.position.y+=(1-t)*.045;
 eachMaterial(preview,m=>m.opacity=.58+t*.42);return;
 }
 if(!preview?.userData.finalPositions)return;
  const p=preview.geometry.attributes.position,original=preview.userData.finalPositions,a=(panel+.5)*TAU/6,nx=Math.sin(a),nz=Math.cos(a);
  for(let i=0;i<p.count;i++){const x=original[i*3],y=original[i*3+1],z=original[i*3+2],radial=x*nx+z*nz,offset=(1-t)*(.17+.45*(.92-radial));p.setXYZ(i,x+nx*offset,y+(1-t)*.04,z+nz*offset);}
  p.needsUpdate=true;preview.geometry.computeVertexNormals();preview.geometry.computeBoundingSphere();preview.material.opacity=.58+t*.20;
 }
 function finishDrag(e){
  if(!drag||drag.id!==e.pointerId||e.button!==0)return;releasePointers();
  if(busy()){showHeld();return;}
  if(!requireFacing()){showHeld();return;}
  if(!near(e)){showHeld();status('纸料尚未对齐。请拖到灯面上的高亮点。');return;}
  // Decorative pieces carry paste on placement; lining keeps its separate brush step.
  if(decoration()&&!data().glued.includes(panel)){applyGlue(panel);refreshGlueMarks();}
  if(!data().glued.includes(panel)){audio.play('blocked');showHeld();status('需要先涂抹浆糊');return;}
  pending=true;makePreview();inventory();if(decoration()){confirm();return;}status('纸料已对齐，尚未消耗。点击「确认粘贴」让纸面贴合骨架。');
 }
 function confirm(){if(!active||busy()||!pending||!data().glued.includes(panel)||!requireFacing())return;pending=false;animation={type:'paper',time:0,panel};audio.play(stage.id);inventory();status(decoration()?'自动上浆，正在贴合'+itemName()+'…':'纸料正在沿弧骨贴合，轻轻抚平边缘…');}
 function cancel(){
  if(!active)return;releasePointers();pending=false;animation=null;buildTarget();showHeld();inventory();status('本次未完成操作已收回；已涂浆糊和已贴纸面保留。');
 }
 function lampHit(e){
 screenRay(e);lantern.root.updateMatrixWorld(true);
 if(decoration()){
 if(near(e))return true;
 const meshes=[];lantern.root.traverseVisible(o=>{if(o.isMesh)meshes.push(o);});
 if(ray.intersectObjects(meshes,false).length)return true;
 }
 return ray.intersectObject(pickShells,true).length>0;
 }
 function syncRotation(){
  lantern.root.rotation.y=angle;lantern.root.updateMatrixWorld(true);
  if(ghost){source().updateWorldMatrix(true,false);source().matrixWorld.decompose(ghost.position,ghost.quaternion,ghost.scale);target=targetPoint();dot?.position.copy(target);}
  updateFacing();
 }
 surface.addEventListener('pointerdown',e=>{
  if(!active||e.button!==0||busy()||drag||rotationDrag)return;
  // Pick up the actual held material before treating a gesture as lamp rotation.
  if(tool==='paper'&&!pending&&preview){held.updateWorldMatrix(true,true);screenRay(e);if(ray.intersectObject(preview,true).length||ray.ray.intersectsBox(new THREE.Box3().setFromObject(preview))){startDrag(e);return;}}
  if(!lampHit(e))return;
  rotationDrag={id:e.pointerId,x:e.clientX,y:e.clientY,angle:lantern.root.rotation.y,moved:false};surface.setPointerCapture(e.pointerId);e.preventDefault();
 });
 window.addEventListener('pointermove',e=>{
  if(!active||busy())return;
  if(rotationDrag?.id===e.pointerId){
   const g=rotationDrag,dx=e.clientX-g.x;
   if(Math.hypot(dx,e.clientY-g.y)>6)g.moved=true;
   if(g.moved){if(pending){pending=false;showHeld();if(dot)dot.visible=true;inventory();}angle=g.angle+dx*LINING_ROTATION_SPEED;syncRotation();status('正在转动灯体 · 松手后再点击加工；拖动本身不会涂胶或贴纸。');}
  }else moveDrag(e);
 });
 window.addEventListener('pointerup',e=>{
  if(!active)return;
  if(rotationDrag?.id===e.pointerId){
   const g=rotationDrag;releasePointers();if(busy())return;
   if(g.moved){updateFacing();status(orientation().aligned?(decoration()?'目标已转正，拖入材料后松手，自动上浆贴合。':'当前灯面已转正。点击高亮面涂胶，或从物品栏拖入纸料。'):'请继续旋转，将高亮位置转向自己。');return;}
   if(!requireFacing())return;
   if(near(e)){if(tool==='brush')beginGlue();else if(pending)confirm();else status(decoration()?'拖动手中材料或从物品栏拖出材料，放到亮点后松手粘贴。':'请从物品栏拖出纸料，放到已经涂胶的灯面亮点。');}
   else status('请点击'+targetLabel()+'的高亮位置。');
  }else finishDrag(e);
 });
 window.addEventListener('craft-book-open',cancel);window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 $('lining-soak').onclick=()=>{if(!active||decoration()||busy())return;if(!applySoak(panel)){status('这个位置已经蘸过浆，继续刷胶即可。');return;}audio.play('lining_lower');inventory();status('蘸浆完成。取胶刷，在同一面均匀刷胶。');selectTool('brush');};
 $('lining-trim').onclick=()=>{if(!active||decoration()||busy()||stage.id!=='lining_lower')return;const result=onTrim(stage.id,panel);if(!result){status('请先贴好白布，再裁边。');return;}audio.play('tool');if(result==='next'||result==='done')return;const next=Array.from({length:stage.total},(_,j)=>j).find(j=>!data().trimmed.includes(j));if(next!==undefined)choosePanel(next,true);inventory();status(next===undefined?'白布六面已全部裁边。':'裁边完成。继续处理下一面：先蘸浆，再刷胶。');};
 $('lining-brush').onclick=()=>selectTool('brush');
 $('lining-paper').addEventListener('pointerdown',e=>{if(e.button!==0)return;selectTool('paper');startDrag(e);});$('lining-paper').onclick=e=>{if(e.detail===0)selectTool('paper');};
 for(let i=0;i<6;i++)$('lining-panel-'+i).onclick=()=>choosePanel(i);
 function open(s,i){
  active=true;stage=s;index=i;decorationGlue=[];tool=decoration()?'paper':'brush';pending=false;animation=null;drag=null;rotationDrag=null;angle=lantern.root.rotation.y;overlay.visible=true;lantern.groups.DebugMarkers.visible=false;
  document.body.classList.add('lining-work');$('lining-panels').hidden=decoration();$('lining-facing').hidden=false;
  $('handwork-title').textContent=decoration()?s.name+' · '+(i+1)+' / '+s.total:s.id==='lining_upper'?'先上浆，再裱一幅红纸':'薄施浆糊，白纸打底';
  $('handwork-subtitle').textContent=decoration()?'合灯台 · 入座平视 · 拖动灯体转正 / 拖入材料后松手粘贴':'合灯台 · 入座平视 · 左键拖动灯体旋转 / 松手后点击加工';$('handwork-tool').textContent=decoration()?'转正目标位置 → 拖入'+itemName()+' → 松开左键，自动上浆贴合':'裱糊顺序：蘸浆 → 刷胶 → 贴'+(s.id==='lining_lower'?'白布':'红色内衬')+(s.id==='lining_lower'?' → 裁边':'');
  $('handwork-confirm').textContent=decoration()?'确认粘贴 · 贴合'+itemName():'确认粘贴 · 贴合纸面';$('handwork-confirm').hidden=decoration();$('handwork-retry').textContent='收回纸料';$('handwork-retry').hidden=false;
  $('handwork-rotate-left').hidden=$('handwork-rotate-right').hidden=true;
  $('handwork-confirm').onclick=confirm;$('handwork-retry').onclick=cancel;
  const first=Array.from({length:6},(_,j)=>j).find(j=>!data().installed.includes(j)||stage.id==='lining_lower'&&!data().trimmed.includes(j))??0;inventory();choosePanel(decoration()?index:first,true);if(!decoration()&&data().installed.includes(panel))status('白布已贴合，请点击“裁边”修去多余边缘。');
 }
 function close(){if(!active)return;releasePointers();active=false;dropPrompt.hidden=true;drag=null;pending=false;animation=null;disposeGroup(overlay);disposeGroup(held);disposeGroup(glueMarks);ghost=dot=preview=brush=hand=null;target=null;overlay.visible=held.visible=false;document.body.classList.remove('lining-work');$('lining-panels').hidden=true;$('lining-facing').hidden=true;lantern.groups.DebugMarkers.visible=true;}
 return {open,close,selectTool,get active(){return active;},update(dt){
  if(!active)return;
  updateFacing();
  if(!animation)return;
  const job=animation;job.time+=dt;const t=Math.min(1,job.time/(job.type==='glue'?.85:.95));
  if(job.type==='glue'){
   held.position.copy(target).add(V(Math.sin(t*Math.PI*4)*.13,-.12+Math.sin(t*Math.PI)*.06,.10));if(ghost)paint(ghost,'#dce8bd',.14+t*.24);brush.rotation.z=-.6+Math.sin(t*Math.PI*4)*.3;
   if(t===1){animation=null;if(applyGlue(job.panel)){audio.play('tool');buildTarget();showHeld();inventory();status(decoration()?'浆糊已涂好。从下方物品栏拖入'+itemName()+'，或拖动手中材料；对准亮点，松开左键直接粘贴。':'浆糊已涂好。可选下一幅继续涂胶，或按 2 取纸粘贴。');}}
  }else {fitPreview(t);if(t===1){animation=null;const ok=onComplete(stage.id,index,{mode:decoration()?'place':'paper',panel:job.panel,quality:1,curve:0,oval:0,dose:1,angle:0,distance:1});if(!ok){pending=true;inventory();status('纸料尚未提交，请检查该位置是否已上胶。');}else if(!decoration()){inventory();status(stage.id==='lining_lower'?'白布贴合完成。点击“裁边”修去边缘多余部分。':'红色内衬贴合完成。');if(stage.id==='lining_upper'&&getState().stage!==CONFIG_STAGE_INDEX(stage.id))close();}}}
 },snapshot(){return {mode:decoration()?'decoration':'lining',stage:stage?.id,panel,tool,heldTarget:heldPoint(),target:target?project(target):null,ready:pending,dragging:!!drag,pending,animation:animation?.type??null,turning:!!rotationDrag?.moved,rotation:lantern.root.rotation.y,orientation:orientation(),rotationSpeed:LINING_ROTATION_SPEED,rotationTarget:project(lantern.root.localToWorld(V(0,.68,0))),glueMarks:glueMarks.children.map(m=>m.userData.gluePanel),glued:active?[...data().glued]:[],installed:active?[...data().installed]:[]};}};
}
