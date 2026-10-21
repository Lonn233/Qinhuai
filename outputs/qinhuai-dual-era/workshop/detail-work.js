import * as THREE from 'three';
import {Handwork,completesOnRelease,RELEASE_PLACEMENT_STAGES,INTERACTIONS,SOURCE,TARGET,PIN,tracePoints} from './interaction-model.mjs';
import {makeHand as makeArtisanHand,alignHandGrip,disposeGroup} from './workbench-visuals.js';
// All manipulation markers and ray input share the same local work plane.
const WORK_Z=.4;
const $=id=>document.getElementById(id), V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const instructions={
 bend:['固定左端，再拖动右端弯圈','先点左侧木钉；抓住右端向左收拢，上下微调让两端相合。'],
 place:['拿起材料，对准轮廓后固定','拖动材料到浅色轮廓；滚轮 / Q R 调整方向。松开后按住接触点固定。'],
 dye:['浸入染液，再提到阴干架','拖纸入右侧染盘，浸入越深着色越快；颜色适中后移到左上方架子松手。'],
 press:['对齐纸张，再按住木模','拖动纸张，滚轮 / Q R 对齐轮廓；松开后按住纸面，筋络随压合出现。'],
 shape:['抓住边缘，慢慢卷起','拖动右侧圆点向右卷曲；过紧时向左回退，保留自然弧度后松手。'],
 trace:['沿引线移动工具','按住沿浅色线缓慢移动；只有工具经过的区域才会加工，可分次补齐。'],
 bind:['绕过交点，逐圈收线','按住沿线绕两圈；顺着亮点继续，走偏时可以回到未完成的地方。'],
 inspect:['移动验灯工具，逐处观察','按住拖动工具，分别在四个检查点稍作停留，观察各处结构与透光。']
};
export function createDetailWork({canvas,lantern,audio,getState,onComplete,scene,camera,world,canInteract}){
 const content=new THREE.Group();scene.add(content);content.visible=false;let flowerAnchor=null,preview=null,session=null,stage=null,actionIndex=0,active=false,pointer=null,pointerId=null,inventoryDrag=false,captureOwner=null,lastMove=0,lastSound=0,materialMesh,basePositions,curveMesh,grip,hand,leftHand,tool,veins,markerMeshes=[],guide,liquid,pressBlock,ray=new THREE.Raycaster(),plane=new THREE.Plane(V(0,0,1),0),currentTarget=V(TARGET.x,TARGET.y,0),pathLine;
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.87,side:THREE.DoubleSide,...extra});
 function mesh(g,m,parent=content){const o=new THREE.Mesh(g,m);parent.add(o);return o;}
 function box(x,y,z,w,h,d,color,parent=content){const o=mesh(new THREE.BoxGeometry(w,h,d),mat(color),parent);o.position.set(x,y,z);return o;}
 function disc(x,y,r,color,z=.2,parent=content){const o=mesh(new THREE.CylinderGeometry(r,r,.035,28),mat(color),parent);o.rotation.x=Math.PI/2;o.position.set(x,y,z);return o;}
 function line(points,color='#8b8163',opacity=1,parent=content){const geo=new THREE.BufferGeometry().setFromPoints(points);const o=new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:true,opacity,depthTest:false,depthWrite:false}));o.renderOrder=18;parent.add(o);return o;}
 function marker(x,y,r=.105){const o=mesh(new THREE.TorusGeometry(r,.018,6,24),mat('#fbebbb',{depthTest:false,depthWrite:false}));o.renderOrder=20;o.position.set(x,y,WORK_Z);return o;}
 function text(text,x,y,scale=1){const c=document.createElement('canvas');c.width=512;c.height=80;const ctx=c.getContext('2d');ctx.fillStyle='#594f3e';ctx.font='27px "Microsoft YaHei"';ctx.textAlign='center';ctx.fillText(text,256,47);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const m=new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,toneMapped:false});const sprite=new THREE.Sprite(m);sprite.position.set(x,y,.35);sprite.scale.set(2.5*scale,.39*scale,1);content.add(sprite);return sprite;}
 function makeHand(left=false){
  const g=new THREE.Group();content.add(g);
  const pose={press:'press',trace:'brush',inspect:'brush',bend:'bamboo'}[session.mode]||'pinch';
  const model=makeArtisanHand(g,left,pose);model.rotation.x=Math.PI/2;model.scale.setScalar(2.4);model.position.y=-.22;
  g.artisanHand=model;g.position.z=1.4;g.rotation.z=left?-.28:.28;return g;
 }
 function paper(color='#dca6ce',leaf=false){const geo=new THREE.PlaneGeometry(1.05,1.65,16,30),p=geo.attributes.position;for(let i=0;i<p.count;i++){const t=(p.getY(i)+.825)/1.65;p.setX(i,p.getX(i)*(leaf?Math.pow(Math.sin(Math.PI*t),.45):Math.pow(Math.sin(Math.PI*t),.65))+.001);}geo.computeVertexNormals();return mesh(geo,mat(color));}
 function cleanup(){preview=null;disposeGroup(content);}
 function background(){}
 function build(){cleanup();flowerAnchor=null;background();markerMeshes=[];materialMesh=null;curveMesh=null;pathLine=null;veins=null;pressBlock=null;liquid=null;guide=null;grip=null;
 const mode=session.mode,isLeaf=stage.id.includes('leaf')||stage.id.includes('calyx')||stage.id.includes('pod');
 if(mode==='bend'){
  const points=Array.from({length:97},()=>V());curveMesh=mesh(new THREE.BufferGeometry(),mat('#aaa36b'));const pos=new Float32Array(97*2*3),indices=[];for(let i=0;i<96;i++){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}curveMesh.geometry.setAttribute('position',new THREE.BufferAttribute(pos,3));curveMesh.geometry.setIndex(indices);
  guide=line(Array.from({length:97},(_,i)=>V(PIN.x+Math.sin(i/96*Math.PI*2)*.95,PIN.y+(1-Math.cos(i/96*Math.PI*2))*.95,.01)),'#847b55',.42);
  disc(PIN.x,PIN.y,.09,'#68543b',.3);markerMeshes.push(marker(PIN.x,PIN.y,.16));grip=marker(2.2,-.85,.13);text('固定端',PIN.x,-1.25,.6);text('活动端',2,-1.25,.6);
 }else if(['trace','bind'].includes(mode)){
  if(mode==='bind'){box(0,0,0,2,.11,.10,'#a6a06c');box(0,0,.08,.10,1.9,.10,'#aba770');}
  else {materialMesh=mesh(new THREE.PlaneGeometry(3.15,1.6,40,20),mat(stage.id==='lining_upper'?'#9e4559':'#eee2d0'));basePositions=materialMesh.geometry.attributes.position.array.slice();materialMesh.position.z=WORK_Z;}
  const points=session.points.map(p=>V(p.x,p.y,WORK_Z));guide=line(points,'#8a7a61',.35);pathLine=line(points,mode==='bind'?'#eee0bc':stage.id==='paper_cutting'?'#775842':'#f8efdf');pathLine.geometry.setDrawRange(0,0);grip=marker(points[0].x,points[0].y);
 }else if(mode==='inspect'){
  
  markerMeshes=session.points.map(p=>marker(p.x,p.y,.13));
 }else if(mode==='place'){
  // Work on the actual next registered component, shown beside its matching socket.
  const next=[...lantern.registry.values()].find(o=>o.userData.workflowStage===stage.id&&(o.userData.order??0)===actionIndex);
  if(next&&stage.id==='top_flower_assembly'){next.updateWorldMatrix(true,true);flowerAnchor=new THREE.Box3().setFromObject(next).getCenter(V());alignFlowerPlane();}
  if(next){materialMesh=new THREE.Group();content.add(materialMesh);const obj=next.clone(true);obj.visible=true;obj.traverse(o=>{if(o.geometry)o.geometry=o.geometry.clone();if(o.material){o.material=o.material.clone();o.material.vertexColors=!!o.geometry?.attributes.color;}});materialMesh.add(obj);obj.position.set(0,0,0);obj.rotation.set(0,0,0);const bounds=new THREE.Box3().setFromObject(obj),size=bounds.getSize(V()),center=bounds.getCenter(V());obj.position.sub(center);obj.scale.multiplyScalar(1.35/Math.max(size.x,size.y,size.z,.1));obj.position.multiplyScalar(1.35/Math.max(size.x,size.y,size.z,.1));}
  else materialMesh=paper(isLeaf?'#6e8b58':'#d3a0c8',isLeaf);
  guide=materialMesh.clone(true);guide.traverse(o=>{if(o.geometry)o.geometry=o.geometry.clone();if(o.material)o.material=new THREE.MeshBasicMaterial({color:'#9b855d',wireframe:true,transparent:true,opacity:.22});});content.add(guide);guide.position.set(TARGET.x,TARGET.y,.1);text('接合位置',TARGET.x,-1,.7);text('待装部件',SOURCE.x,-1.35,.7);
  // The lantern's existing ghost is the actual drop socket, not a separate tabletop marker.
  if(flowerAnchor){guide.visible=false;content.children.filter(o=>o.isSprite).forEach(o=>o.visible=false);materialMesh.traverse(o=>{if(o.isMesh){o.material.depthTest=false;o.material.depthWrite=false;o.renderOrder=19;}});}
  // Context remains visible while the joint is enlarged for accurate placement.

  grip=marker(SOURCE.x,SOURCE.y);
 }else{
  materialMesh=paper(mode==='dye'?'#eee5d3':isLeaf?'#6d8955':'#d6a3c8',isLeaf);basePositions=materialMesh.geometry.attributes.position.array.slice();
  if(mode==='dye'){
   box(.65,.2,-.12,1.9,1.7,.18,'#73684e');liquid=box(.65,.2,.01,1.72,1.52,.025,isLeaf?'#5c714d':'#aa648b');liquid.material.roughness=.25;
   box(-1.55,1,-.05,1.25,.95,.06,'#c7b38e');for(let i=0;i<6;i++)box(-2.04+i*.2,1,.015,.025,.85,.025,'#82704e');text('阴干架',-1.55,1.65,.7);text('染盘',.65,-1,.7);
  }else if(mode==='press'){
   box(TARGET.x,TARGET.y,-.1,1.35,1.95,.16,'#97805a');guide=paper('#9a895f',isLeaf);guide.position.set(TARGET.x,TARGET.y,.025);guide.material.wireframe=true;guide.material.transparent=true;guide.material.opacity=.3;makeVeins();pressBlock=box(TARGET.x,TARGET.y+.08,1,1.23,1.82,.16,'#9b7c51');pressBlock.material.transparent=true;pressBlock.material.opacity=.15;pressBlock.visible=false;
  }else {materialMesh.position.set(0,0,WORK_Z);makeVeins();grip=marker(.15,.55);text('卷曲方向 →',.85,-1.25,.8);}
  if(!grip)grip=marker(SOURCE.x,SOURCE.y);
 }
 hand=makeHand();leftHand=makeHand(true);leftHand.position.set(-2,-1.6,1);leftHand.visible=['bend','shape','trace','bind'].includes(mode);
 tool=new THREE.Group();hand.add(tool);tool.position.set(-.05,.12,.05);
 if(['trace','inspect','press'].includes(mode)){box(0,.1,.04,.12,.48,.1,mode==='inspect'?'#e4cc7c':'#675b40',tool);if(mode==='trace'){const blade=box(0,.4,.04,.1,.24,.035,'#bac1b6',tool);blade.rotation.z=-.25;}if(mode!=='press')alignHandGrip(hand.artisanHand,tool.position.clone().add(V(0,.1,.04)));}
 updateVisual();
 }
 function makeVeins(){veins=new THREE.Group();content.add(veins);for(let i=-4;i<=4;i++){const l=line(Array.from({length:25},(_,j)=>{const t=j/24;return V(Math.sin(Math.PI*t)*i*.082,-.78+t*1.52,.03);}), '#8c6382',.65,veins);l.geometry.userData.original=Array.from(l.geometry.attributes.position.array);}}
 function alignFlowerPlane(){
  if(!flowerAnchor)return;
  camera.updateMatrixWorld(true);camera.getWorldQuaternion(content.quaternion);
  content.position.copy(flowerAnchor).sub(V(TARGET.x,TARGET.y,WORK_Z).multiplyScalar(.30).applyQuaternion(content.quaternion));
  content.updateMatrixWorld(true);
 }
 function updateVisual(){if(!session)return;alignFlowerPlane();const s=session,m=s.mode;
  if(curveMesh){const p=curveMesh.geometry.attributes.position;for(let i=0;i<=96;i++){const t=i/96,a=t*Math.PI*2*s.curve;const circleX=PIN.x+Math.sin(t*Math.PI*2)*.95,circleY=PIN.y+(1-Math.cos(t*Math.PI*2))*.95;const blend=Math.min(s.curve,1);let x=THREE.MathUtils.lerp(PIN.x+t*3.1,circleX,blend),y=THREE.MathUtils.lerp(PIN.y,circleY,blend)+s.oval*Math.sin(t*Math.PI)*1.8;if(s.curve>1){x+=Math.sin(a)*.4*(s.curve-1);y+=t*(s.curve-1)*1.5;}for(let k=0;k<2;k++)p.setXYZ(i*2+k,x,y+(k-.5)*.055,.17);}p.needsUpdate=true;curveMesh.geometry.computeVertexNormals();curveMesh.geometry.computeBoundingSphere();markerMeshes[0].material.color.set(s.pinned?'#647950':'#fbebbb');}
  if(materialMesh&&['place','press','dye'].includes(m)){materialMesh.position.set(s.position.x,s.position.y,.4);materialMesh.rotation.z=s.angle*(m==='dye'?0:1);}
  if(materialMesh&&m==='dye'){materialMesh.material.color.set('#eee5d3').lerp(new THREE.Color(stage.id==='leaf_dye'?'#386546':'#b66097'),Math.min(1,s.dose/1.25));materialMesh.material.roughness=s.dose>0?.45:.9;}
  if(materialMesh&&m==='shape'){const p=materialMesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=basePositions[i*3],y=basePositions[i*3+1],t=(y+.825)/1.65;p.setXYZ(i,x*(1-s.curve*t*.26)+s.curve*1.5*t*t,y-t*t*s.curve*.34,t*t*s.curve*.95);}p.needsUpdate=true;materialMesh.geometry.computeVertexNormals();materialMesh.geometry.computeBoundingSphere();}
  if(veins){veins.visible=m!=='press'||s.contact>0;if(m==='press'){veins.position.set(TARGET.x,TARGET.y,.45);veins.scale.y=Math.min(1,s.contact/1.05);}else if(m==='shape'){veins.position.z=WORK_Z;for(const l of veins.children){const p=l.geometry.attributes.position,b=l.geometry.userData.original;for(let i=0;i<p.count;i++){const x=b[i*3],y=b[i*3+1],t=(y+.825)/1.65;p.setXYZ(i,x*(1-s.curve*t*.26)+s.curve*1.5*t*t,y-t*t*s.curve*.34,t*t*s.curve*.95+.02);}p.needsUpdate=true;l.geometry.computeBoundingSphere();}}else veins.position.z=.2;}
  if(pressBlock){pressBlock.visible=s.placed&&s.dragging;pressBlock.position.z=.7-Math.min(.24,s.contact*.2);}
  if(pathLine)pathLine.geometry.setDrawRange(0,s.next);
  if(m==='trace'&&materialMesh){const p=materialMesh.geometry.attributes.position,edge=-1.35+(s.next/25)*2.7;for(let i=0;i<p.count;i++){const x=basePositions[i*3],y=basePositions[i*3+1],processed=x<edge&&s.next>0;const cut=stage.id==='paper_cutting',guideY=.38*Math.sin((x+1.35)/2.7*Math.PI*2);p.setXYZ(i,x,y-(cut&&processed&&y<guideY?.055:0),cut?(processed&&y<guideY?.045:0):processed?0:.08*Math.sin(x*10)*Math.sin(y*6));}p.needsUpdate=true;materialMesh.geometry.computeVertexNormals();}

  if(grip){const pos=['trace','bind'].includes(m)?s.points[Math.min(s.next,s.points.length-1)]:s.placed?TARGET:s.grip;grip.position.set(pos.x,pos.y,WORK_Z);grip.material.color.set(s.ready?'#657d50':'#f2dfac');}
  markerMeshes.forEach((o,i)=>{if(m==='inspect')o.material.color.set(s.visited.has(i)?'#5d7752':'#f2dfac');});
  if(m==='bend'&&s.pinned)leftHand.position.set(PIN.x+.03,PIN.y-.28,1.2);if(m==='inspect'&&preview&&stage.id==='final_inspection')preview.traverse(o=>{if(o.isPointLight)o.intensity=.3+s.visited.size*.35;});
  const point=pointer||{x:1.75,y:-1.5};hand.position.set(point.x+.15,point.y-.3,1.5);hand.visible=true;
  const disabled=!s.ready||s.dragging;if($('handwork-confirm').disabled!==disabled)$('handwork-confirm').disabled=disabled;
  const flowerHint=stage.id==='top_flower_assembly'?(s.dragging?(Math.hypot(s.position.x-TARGET.x,s.position.y-TARGET.y)<.34?'位置合适 · 松开左键安装花头':'拖动花头到高亮轮廓，到位后松开左键'):s.issue||'从下方背包拖出花头，放到高亮位置后松手即可。'):null;
  const statusText=flowerHint||(s.ready?(completesOnRelease(stage.id)?'弧度合适，松开左键自动收好。':'本次加工已完成，可以确认。'):s.issue||(m==='bend'?(s.pinned?'左端已固定 · 收拢活动端，微调圆度。':'竹篾尚未固定 · 先按左侧木钉。'):m==='dye'?(s.dose<.55?'纸色尚浅 · 慢慢浸入染液。':s.dose<=1.15?'纸色适中 · 提到左上方阴干架。':'纸色过深 · 换纸重做。'):m==='inspect'?'已检查 '+s.visited.size+' / 4 处':m==='press'&&s.placed?'按住模具接触处，让纹路完整显现。':RELEASE_PLACEMENT_STAGES.includes(stage.id)?'拖到高亮轮廓后松开左键，材料会自动对齐粘贴。':instructions[m][1]));
  if(stage.id==='petal_shaping'){const phaseText=s.shapePhase==='form'?'抓住边缘圆点，慢慢卷起花瓣。':s.shapePhase==='pinch'?'成形完成 · 抓住边缘圆点向下捏边。':s.shapePhase==='wire'?'捏边完成 · 抓住圆点向下收拢铜丝固定。':'成形、捏边和铜丝固定已完成。';if($('handwork-subtitle').textContent!==phaseText)$('handwork-subtitle').textContent=phaseText;}
  if($('handwork-status').textContent!==statusText)$('handwork-status').textContent=statusText;if($('handwork-status').dataset.ready!==String(s.ready))$('handwork-status').dataset.ready=String(s.ready);
 }
 function resize(){}
 function screenPoint(e){const r=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const workPlane=new THREE.Plane().setFromNormalAndCoplanarPoint(V(0,0,1).applyQuaternion(content.quaternion),content.localToWorld(V(0,0,WORK_Z)));const hit=ray.ray.intersectPlane(workPlane,V());return hit?content.worldToLocal(hit):V(100,100,0);}
 const surface=$('handwork-surface'),flowerSlot=$('inventory-flower');
 const flowerStock=()=>Math.max(0,getState().counts.flower_making-getState().counts.top_flower_assembly);
 flowerSlot.addEventListener('dragstart',e=>e.preventDefault());
 flowerSlot.addEventListener('pointerdown',e=>{
  if(!active||stage.id!=='top_flower_assembly'||!canInteract()||pointerId!==null||e.button!==0||!flowerStock())return;
  e.preventDefault();session.reset();session.down(SOURCE);pointerId=e.pointerId;inventoryDrag=true;captureOwner=flowerSlot;flowerSlot.setPointerCapture(e.pointerId);lastMove=performance.now();
  movePointer(e);audio.play('tool');
 });
 function movePointer(e){const p=screenPoint(e);pointer={x:p.x,y:p.y};const now=performance.now();const contact=session.move(pointer,(now-lastMove)/1000);lastMove=now;if(contact)contactSound(now);updateVisual();}
 window.addEventListener('pointermove',e=>{if(active&&inventoryDrag&&e.pointerId===pointerId){if(!canInteract()){cancelGesture();return;}movePointer(e);}});
 window.addEventListener('pointerup',e=>{if(inventoryDrag)release(e);});
 window.addEventListener('pointercancel',e=>{if(e.pointerId===pointerId)cancelGesture();});
 flowerSlot.addEventListener('lostpointercapture',e=>{if(e.pointerId===pointerId)cancelGesture();});
 surface.addEventListener('pointerdown',e=>{if(!active||!canInteract()||pointerId!==null||e.button!==0)return;e.preventDefault();const p=screenPoint(e);pointer={x:p.x,y:p.y};if(session.down(pointer)){pointerId=e.pointerId;captureOwner=surface;surface.setPointerCapture(e.pointerId);lastMove=performance.now();}updateVisual();});
 surface.addEventListener('pointermove',e=>{if(!active||inventoryDrag||!canInteract()||pointerId!==null&&pointerId!==e.pointerId)return;movePointer(e);});
 function release(e){
  if(e.pointerId!==pointerId||e.button!==0)return;if(!canInteract()){cancelGesture();return;}
  if(RELEASE_PLACEMENT_STAGES.includes(stage.id))movePointer(e);
  const fromInventory=inventoryDrag;session.up();releaseCapture();
  const evidence=completesOnRelease(stage.id)?session.evidence():null;
  if(fromInventory&&!evidence){session.reset();pointer=null;session.issue='尚未到达高亮位置，花头已放回背包；拖到轮廓处再松手。';}
  updateVisual();if(evidence)onComplete(stage.id,actionIndex,evidence);
 }
 function releaseCapture(){const owner=captureOwner,id=pointerId;pointerId=null;captureOwner=null;inventoryDrag=false;if(owner&&id!==null&&owner.hasPointerCapture(id))owner.releasePointerCapture(id);}
 surface.addEventListener('pointerup',release);surface.addEventListener('pointercancel',()=>cancelGesture());surface.addEventListener('lostpointercapture',()=>{if(pointerId!==null)cancelGesture();});
 function cancelGesture(){const fromInventory=inventoryDrag;releaseCapture();session?.cancelGesture();if(fromInventory){session?.reset();pointer=null;}if(active)updateVisual();}
 function contactSound(now){if(now-lastSound>220){audio.play(stage.id==='final_inspection'?'check':stage.id);lastSound=now;}}
 function rotate(delta){session.rotate(delta);audio.play('tool');updateVisual();}
 surface.addEventListener('wheel',e=>{if(!active)return;e.preventDefault();rotate(e.deltaY>0?.1:-.1);},{passive:false});
 function controls(){
 $('handwork-rotate-left').onclick=()=>rotate(-.1);$('handwork-rotate-right').onclick=()=>rotate(.1);
 $('handwork-retry').onclick=()=>{cancelGesture();session.reset();pointer=null;build();};
 $('handwork-confirm').onclick=()=>{if(!canInteract())return;const evidence=session.evidence();if(evidence)onComplete(stage.id,actionIndex,evidence);};
 }
 function close(){if(!active)return;cancelGesture();active=false;flowerSlot.disabled=true;document.body.classList.remove('flower-placement');content.visible=false;cleanup();}
 window.addEventListener('keydown',e=>{if(!active)return;if(e.code==='KeyQ')rotate(-.1);if(e.code==='KeyR')rotate(.1);});
 window.addEventListener('blur',cancelGesture);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelGesture();});window.addEventListener('resize',resize);resize();
 return {scene,camera,get active(){return active;},open(s,index){const st=world.stations[s.station];content.position.set(st.x,s.station==='assembly'?1.28:1.04,st.z+(s.station==='assembly'?.60:.35));content.rotation.x=-Math.PI/2;content.scale.setScalar(.30);content.visible=true;controls();content.updateMatrixWorld(true);stage=s;actionIndex=index;session=new Handwork(s.id);pointer=null;pointerId=null;lastSound=0;active=true;flowerSlot.disabled=s.id!=='top_flower_assembly'||!flowerStock();document.body.classList.toggle('flower-placement',s.id==='top_flower_assembly');$('handwork').hidden=false;document.body.classList.add('handworking');$('handwork-title').textContent=s.name;$('handwork-subtitle').textContent='第 '+(index+1)+' / '+s.total+' '+s.unit+' · '+instructions[session.mode][0];$('handwork-tool').textContent={bend:'双手 · 固定木钉',place:'双手 · 糨糊 / 接合工具',dye:'双手 · 染盘',press:'双手 · 木质压模',shape:'双手 · 卷曲与定形丝',trace:s.id==='paper_cutting'?'裁纸刀 · 素纸':'裱糊刷 · 纸面',bind:'扎线 · 交点',inspect:'验灯工具 · 结构观察'}[session.mode];$('handwork-confirm').hidden=completesOnRelease(s.id);if(s.id==='top_flower_assembly')$('handwork-subtitle').textContent='从下方背包拖出花头 → 对准高亮轮廓 → 松开左键安装';else if(RELEASE_PLACEMENT_STAGES.includes(s.id))$('handwork-subtitle').textContent='拖动花头 / 莲蓬到高亮轮廓，松开左键直接贴合，无需再次按住或确认';else if(completesOnRelease(s.id))$('handwork-subtitle').textContent='拖动圆点卷曲定形，弧度合格后松开左键收好';const rotating=['place','press'].includes(session.mode)&&!RELEASE_PLACEMENT_STAGES.includes(s.id);$('handwork-rotate-left').hidden=!rotating;$('handwork-rotate-right').hidden=!rotating;build();resize();$('handwork-close').focus();},update(dt,now){if(!active)return;if(session.tick(dt,pointer))contactSound(now);updateVisual();},snapshot(){return session?{stage:stage.id,mode:session.mode,ready:session.ready,inventoryDrag,flowerStock:flowerStock(),dragging:session.dragging,pinned:session.pinned,curve:session.curve,oval:session.oval,position:{...session.position},angle:session.angle,dose:session.dose,contact:session.contact,next:session.next,placed:session.placed,visited:[...session.visited],grip:{...session.grip},issue:session.issue,shapePhase:session.shapePhase,formed:session.formed,edgePinched:session.edgePinched,wireFixed:session.wireFixed}:null;},project(p){const v=content.localToWorld(V(p.x,p.y,WORK_Z)).project(camera),r=canvas.getBoundingClientRect();return {x:r.left+(v.x+1)*r.width/2,y:r.top+(1-v.y)*r.height/2};},close};
}
