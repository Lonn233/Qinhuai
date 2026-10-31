import * as THREE from 'three';
import {mapProjection} from './navigation.mjs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {LANTERNS} from './content.mjs';
import {RIDDLES} from './state.mjs';
import {pointInWater,FESTIVAL_LAYOUT,DOCK_OBSERVATIONS} from '../import-festival-lanterns.js';
import {TEMPLE_PORTAL} from '../import-temple-visit.mjs';
import {RACK_GROUND_Y,RIDDLE_HOST_POSITION,riddlePaperAnchors} from '../courtyard-rack-layout.mjs';
export function createStoryWorld(a){
 const root=new THREE.Group();root.name='QinhuaiStoryActors';root.visible=false;a.scene.add(root);
 const loader=new GLTFLoader(),matrix=new THREE.Matrix4(),worldMatrix=new THREE.Matrix4();
 const workshop={x:4.2,y:11.864055,z:-16.2},hang={x:-10.4,y:11.864055,z:-23};
 let master=null,masterTask=null,host=null,finished=null,finishTask=null,assets={},hung=false,animation=null,layout=null;
 let riddleHostBrightness=1,hostMaterialStates=[];
 const riddleTargets=[];let riddleGroup=null;
 const routeGeometry=new THREE.BufferGeometry(),routeMaterial=new THREE.LineBasicMaterial({color:0xffdb82,transparent:true,opacity:.85,depthWrite:false});
 const routeLine=new THREE.Line(routeGeometry,routeMaterial);routeLine.name='StoryWalkingRoute';routeLine.frustumCulled=false;routeLine.visible=false;root.add(routeLine);
 const observations=new Map(),stand=new THREE.Group();stand.name='StreetLanternHangingPoint';root.add(stand);
 const wood=new THREE.MeshStandardMaterial({color:0x755437,roughness:.85});
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.035,.05,1.5,8),wood);pole.position.set(-.36,.75,0);stand.add(pole);
 const beam=new THREE.Mesh(new THREE.BoxGeometry(.9,.055,.055),wood);beam.position.set(.03,1.48,0);stand.add(beam);
 const cord=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.2,6),new THREE.MeshStandardMaterial({color:0xb9a17a}));cord.position.set(.24,1.36,0);stand.add(cord);
 const halo=new THREE.PointLight(0xffd995,0,3,2);halo.position.set(.24,1.1,0);stand.add(halo);
 const aimFor=(mesh,index)=>{if(!mesh.geometry.boundingBox)mesh.geometry.computeBoundingBox();mesh.updateWorldMatrix(true,false);if(mesh.isInstancedMesh){if(mesh.userData.lanternEmitterMatrices?.[index])matrix.copy(mesh.userData.lanternEmitterMatrices[index]);else mesh.getMatrixAt(index,matrix);worldMatrix.multiplyMatrices(mesh.matrixWorld,matrix);}else worldMatrix.copy(mesh.matrixWorld);return mesh.geometry.boundingBox.clone().applyMatrix4(worldMatrix);};
 function targets(){const list=[];
  for(const lamp of LANTERNS){
   if(a.festival.lightControls?.[lamp.id]?.modelVisible===false||a.features.lightControls?.[lamp.id]?.modelVisible===false)continue;
   if(lamp.water&&!a.waterVisible())continue;
   const entry=a.festival.entries.get(lamp.id),feature=a.features.entries.get(lamp.id);
   const batches=entry?.batches.filter(b=>!b.mesh.userData.festivalReflection&&!b.mesh.userData.festivalSpill)||[];
   const mesh=batches[0]?.mesh||feature?.meshes.find(m=>m.userData.featureLantern===lamp.id&&!m.name.endsWith('reflection'));
   if(!mesh)continue;
   const count=batches[0]?.placements.length||(lamp.id==='tengma'?2:1);
   for(let i=0;i<count;i++){
    const bounds=aimFor(mesh,i),position=bounds.getCenter(new THREE.Vector3());
    const placement=batches[0]?.placements[i];
    const dock=lamp.water?DOCK_OBSERVATIONS.find(o=>o.placementId===placement?.id):null;
    list.push({id:lamp.id,instance:i,lamp,position,bounds,water:lamp.water,dock,key:lamp.id+':'+i});
   }
  }return list;
 }
 function groundPoint(x,z,reference=TEMPLE_PORTAL.ground){const y=a.surface(x,z,reference);return y===null||(pointInWater(x,z)&&y<FESTIVAL_LAYOUT.water.height+.1)?null:{x,y,z};}
 function observationPoint(target){
  if(target.water){
   if(!target.dock)return null;
   const point=groundPoint(target.dock.x,target.dock.z);
   return point&&a.lineClear(new THREE.Vector3(point.x,point.y+.53,point.z),target.position)?point:null;
  }
  const signature=[target.position.x,target.position.z,target.bounds.min.x,target.bounds.max.z].map(v=>v.toFixed(3)).join(',');
  const cached=observations.get(target.key);if(cached?.signature===signature&&(cached.point||performance.now()-cached.time<5000))return cached.point;
  const center=target.position,extent=Math.max(target.bounds.max.x-target.bounds.min.x,target.bounds.max.z-target.bounds.min.z)/2;
  const radii=target.water?[.7,1.2,2,3,4,5]:[.4,.8,1.2];let found=null;
  for(const r of radii){for(let i=0;i<24;i++){
   const angle=-Math.PI/2+i*Math.PI/12,c=Math.cos(angle),s=Math.sin(angle);
   const edge=target.water?0:Math.min((target.bounds.max.x-target.bounds.min.x)/2/Math.max(.0001,Math.abs(c)),(target.bounds.max.z-target.bounds.min.z)/2/Math.max(.0001,Math.abs(s)));
   const x=center.x+c*(r+edge),z=center.z+s*(r+edge);
   const point=groundPoint(x,z);if(!point)continue;
   const eye=new THREE.Vector3(x,point.y+.53,z);
   if(!a.lineClear(eye,center))continue;
   found=point;break;
  }if(found)break;}
  observations.set(target.key,{signature,point:found,time:performance.now()});return found;
 }
 function locate(preferred){const p=a.findSpawn(preferred.x,preferred.z,preferred.y);if(!p)throw Error('任务位置附近尚无可行走地面');return {x:p.x,y:p.ground,z:p.z};}
 async function loadMaster(){if(master)return master;if(masterTask)return masterTask;masterTask=loader.loadAsync(assets.master||'./story/assets/master.glb').then(gltf=>{
  master=gltf.scene;const box=new THREE.Box3().setFromObject(master),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  master.scale.setScalar(.56/size.y);master.position.set(-center.x*master.scale.x,-box.min.y*master.scale.y,-center.z*master.scale.z);
  const holder=new THREE.Group();holder.name='扎灯师傅';holder.add(master);root.add(holder);master=holder;
  master.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});a.attachReceivers(master);placeMaster(false);return master;
 }).finally(()=>masterTask=null);return masterTask;}
 function placeMaster(atStreet){if(!master)return;const p=atStreet?{x:hang.x-.65,y:hang.y,z:hang.z+.3}:workshop;master.position.set(p.x,p.y,p.z);master.rotation.y=atStreet?Math.PI/2:0;}
 function mountFinished(){if(!finished)return;const top=finished.userData.hook;finished.position.set(.24-top.x,1.26-top.y,-top.z);finished.visible=hung;halo.intensity=hung?.28:0;}
 function relaxHostArms(object){
  object.updateWorldMatrix(true,true);
  for(const [side,sign] of [['L',1],['R',-1]]){
   const arm=object.getObjectByName('upper_arm.'+side),elbow=object.getObjectByName('forearm.'+side);
   if(!arm||!elbow)continue;
   const direction=elbow.getWorldPosition(new THREE.Vector3()).sub(arm.getWorldPosition(new THREE.Vector3())).normalize();
   const desired=new THREE.Vector3(sign*.12,-1,.04).normalize();
   const worldRotation=new THREE.Quaternion().setFromUnitVectors(direction,desired).multiply(arm.getWorldQuaternion(new THREE.Quaternion()));
   arm.quaternion.copy(arm.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(worldRotation));
  }
 }
 function captureHostMaterials(object){
  hostMaterialStates=[];
  object.traverse(node=>{
   if(!node.isMesh)return;
   const materials=Array.isArray(node.material)?node.material:[node.material];
   for(const material of materials){
    if(!material)continue;
    hostMaterialStates.push({
     material,
     color:material.color?.clone(),
     emissive:material.emissive?.clone(),
     emissiveIntensity:Number.isFinite(material.emissiveIntensity)?material.emissiveIntensity:0
    });
   }
  });
 }
 function setRiddleHostBrightness(value){
  riddleHostBrightness=THREE.MathUtils.clamp(Number(value)||1,.25,2.5);
  for(const state of hostMaterialStates){
   const {material}=state;
   if(state.color&&material.color)material.color.copy(state.color).multiplyScalar(riddleHostBrightness);
   if(state.emissive&&material.emissive){
    material.emissive.copy(state.emissive);
    material.emissiveIntensity=state.emissiveIntensity*riddleHostBrightness;
   }
   material.needsUpdate=true;
  }
  a.needsRender=true;
  return riddleHostBrightness;
 }
 function getRiddleHostBrightness(){return riddleHostBrightness;}
 async function loadRiddleHost(){if(host)return host;const url=assets.riddleHost||'./story/assets/riddle-host.glb';try{const gltf=await loader.loadAsync(url);host=gltf.scene;host.name='猜灯主持人';host.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(host),size=box.getSize(new THREE.Vector3());host.scale.setScalar(.56/Math.max(.001,size.y));host.rotation.y=Math.atan2(TEMPLE_PORTAL.door.x-RIDDLE_HOST_POSITION.x,TEMPLE_PORTAL.door.z-RIDDLE_HOST_POSITION.z);host.updateMatrixWorld(true);const placedBox=new THREE.Box3().setFromObject(host),center=placedBox.getCenter(new THREE.Vector3());host.position.x+=RIDDLE_HOST_POSITION.x-center.x;host.position.y+=RACK_GROUND_Y-placedBox.min.y;host.position.z+=RIDDLE_HOST_POSITION.z-center.z;relaxHostArms(host);host.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});captureHostMaterials(host);setRiddleHostBrightness(riddleHostBrightness);root.add(host);a.attachReceivers?.(host);return host;}catch(error){console.warn('猜灯主持人模型暂不可用',error);return null;}}
 function createRiddlePapers(){if(riddleGroup)return;riddleGroup=new THREE.Group();riddleGroup.name='TenFixedRiddleSlips';root.add(riddleGroup);const anchors=riddlePaperAnchors();
  RIDDLES.forEach((r,index)=>{const canvas=document.createElement('canvas');canvas.width=512;canvas.height=384;const ctx=canvas.getContext('2d');ctx.fillStyle='#f0dfb8';ctx.fillRect(0,0,512,384);ctx.strokeStyle='#99764b';ctx.lineWidth=5;ctx.strokeRect(12,12,488,360);ctx.fillStyle='#9c5138';ctx.font='28px serif';ctx.textAlign='center';ctx.fillText('夫子庙灯谜  ·  '+String(index+1).padStart(2,'0'),256,58);ctx.fillStyle='#392f25';ctx.font='34px serif';ctx.textAlign='center';const chars=[...r.text];let lines=[],line='';for(const ch of chars){if(ctx.measureText(line+ch).width>430){lines.push(line);line=ch;}else line+=ch;}if(line)lines.push(line);const lineH=50,startY=Math.max(130,(384-lines.length*lineH)/2+55);lines.forEach((text,i)=>ctx.fillText(text,256,startY+i*lineH));const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;const material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,toneMapped:false});const {x,y,z,width,height,cordLength,top,mountIndex}=anchors[index];const paper=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);paper.name='RiddleSlip-'+String(index+1).padStart(2,'0');paper.userData.mountIndex=mountIndex;paper.position.set(x,y,z);paper.rotation.y=0;riddleGroup.add(paper);const cord=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,cordLength,6),new THREE.MeshStandardMaterial({color:0xb39263,roughness:1}));cord.position.set(x,top-cordLength/2,z);riddleGroup.add(cord);const hook=new THREE.Mesh(new THREE.SphereGeometry(.018,6,5),new THREE.MeshStandardMaterial({color:0xd2b981,roughness:.7}));hook.position.set(x,top,z);riddleGroup.add(hook);riddleTargets.push({id:r.id,text:r.text,position:new THREE.Vector3(x,y,z),bounds:new THREE.Box3(new THREE.Vector3(x-width/2-.025,y-height/2-.025,z-.04),new THREE.Vector3(x+width/2+.025,y+height/2+.025,z+.04)),key:'riddle:'+r.id});});}
 async function loadFinished(){if(finished)return true;if(!assets.finishedLantern)return false;if(finishTask)return finishTask;
  finishTask=(async()=>{const config=assets.finishedLantern;if(!config.url||!Number.isFinite(config.height)||config.height<=0)throw Error('成品配置需要 url 和正数 height（地图单位）');
   const gltf=await loader.loadAsync(config.url),object=gltf.scene;object.rotation.y=Number(config.yaw)||0;object.updateMatrixWorld(true);
   const box=new THREE.Box3().setFromObject(object),height=box.max.y-box.min.y;if(!Number.isFinite(height)||height<=0)throw Error('成品模型尺寸无效');
   object.scale.setScalar(config.height/height);object.updateMatrixWorld(true);const actual=new THREE.Box3().setFromObject(object),center=actual.getCenter(new THREE.Vector3());
   object.userData.hook=config.hook?new THREE.Vector3(...config.hook).multiplyScalar(object.scale.x).applyAxisAngle(new THREE.Vector3(0,1,0),object.rotation.y):new THREE.Vector3(center.x,actual.max.y,center.z);
   object.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});finished=object;stand.add(object);mountFinished();return true;
  })().finally(()=>finishTask=null);return finishTask;
 }
 async function prepare(){
  assets=await fetch('./story/assets.json').then(r=>{if(!r.ok)throw Error('剧情资源清单加载失败');return r.json();});
  Object.assign(workshop,locate(workshop));Object.assign(hang,locate(hang));stand.position.set(hang.x,hang.y,hang.z);
  if(!layout){layout=await fetch('./assets/qinhuai-modern-import/night/layout.json').then(r=>r.json());}
  await loadMaster();createRiddlePapers();void loadRiddleHost();return assets;
 }
 function animateHang(){if(!finished||animation)return Promise.resolve(false);finished.visible=true;const end=finished.position.clone();finished.position.y-=.45;const start=performance.now();return new Promise(resolve=>{animation={start,end,resolve};});}
 function update(now){if(!animation)return;const t=Math.min(1,(now-animation.start)/900),ease=t*t*(3-2*t);finished.position.copy(animation.end);finished.position.y-=.45*(1-ease);halo.intensity=.28*ease;if(t===1){hung=true;const resolve=animation.resolve;animation=null;resolve(true);}}
 function setHung(value){hung=value;mountFinished();}
 function drawMap(canvas,player,target,all,observed,route=[]){const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  const area={minX:-31,maxX:46,minZ:-60,maxZ:12},scale=Math.min((w-24)/(area.maxX-area.minX),(h-20)/(area.maxZ-area.minZ));
  const tx=x=>w/2+(x-(area.minX+area.maxX)/2)*scale,tz=z=>h/2+(z-(area.minZ+area.maxZ)/2)*scale;
  if(!canvas._storyBase){const base=document.createElement('canvas');base.width=w;base.height=h;const c=base.getContext('2d');c.clearRect(0,0,w,h);c.fillStyle='#c3ae8040';for(const tri of FESTIVAL_LAYOUT.water.triangles){c.beginPath();tri.forEach(([x,z],i)=>i?c.lineTo(tx(x),tz(z)):c.moveTo(tx(x),tz(z)));c.closePath();c.fill();}
   c.fillStyle='#e2c99538';c.strokeStyle='#e3c99788';c.lineWidth=1;for(const tile of Object.values(layout?.tiles||{}))for(const name of new Set((tile.materials||[]).filter(m=>m.role==='roof').map(m=>m.node))){const b=tile.bounds?.[name];if(!b)continue;if(b.max[0]<area.minX||b.min[0]>area.maxX||b.max[2]<area.minZ||b.min[2]>area.maxZ||b.max[1]-b.min[1]<.4)continue;const bw=(b.max[0]-b.min[0])*scale,bh=(b.max[2]-b.min[2])*scale;if(bw>160||bh>180)continue;c.fillRect(tx(b.min[0]),tz(b.min[2]),bw,bh);c.strokeRect(tx(b.min[0]),tz(b.min[2]),bw,bh);}
   canvas._storyBase=base;}
  ctx.clearRect(0,0,w,h);ctx.drawImage(canvas._storyBase,0,0);if(route.length){ctx.strokeStyle='#ffdc8a';ctx.lineWidth=canvas.width>600?4:3;ctx.lineJoin='round';ctx.beginPath();route.forEach((p,i)=>i?ctx.lineTo(tx(p.x),tz(p.z)):ctx.moveTo(tx(p.x),tz(p.z)));ctx.stroke();}
  ctx.font='17px "SimSun",serif';
  const dot=(p,color,r=4)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(tx(p.x),tz(p.z),r,0,Math.PI*2);ctx.fill();};
  for(const t of all)dot(t.position,observed.includes(t.id)?'#dfbd77':'#acb3a4',3);
  for(const [p,label] of [[workshop,'751 工坊'],[TEMPLE_PORTAL.door,'夫子庙'],[hang,'挂灯位']]){dot(p,'#c7b98f',4);ctx.fillStyle='#e5dfc8';ctx.fillText(label,tx(p.x)+(p===hang?-64:6),tz(p.z)+(p===hang?14:-6));}
  if(target){const p=target;ctx.strokeStyle='#f6d289';ctx.lineWidth=2;ctx.beginPath();ctx.arc(tx(p.x),tz(p.z),9,0,Math.PI*2);ctx.stroke();dot(p,'#ffdf8c',4);}
  ctx.save();ctx.translate(tx(player.position.x),tz(player.position.z));ctx.rotate(-player.yaw);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(-6,7);ctx.lineTo(0,4);ctx.lineTo(6,7);ctx.closePath();ctx.fill();ctx.restore();
 }
 return {riddleTargets,loadRiddleHost,setRiddleHostBrightness,getRiddleHostBrightness,get hostReady(){return !!host;},setRoute(){routeLine.visible=false;},mapPoint(canvas,event){const r=canvas.getBoundingClientRect();return mapProjection(canvas.width,canvas.height).world((event.clientX-r.left)*canvas.width/r.width,(event.clientY-r.top)*canvas.height/r.height);},root,workshop,hang,targets,observationPoint,prepare,placeMaster,loadFinished,setHung,animateHang,update,drawMap,
  get assets(){return assets;},get finishedReady(){return !!finished;},clearObservations(){observations.clear();},setVisible(value){root.visible=value;},
  async refreshAssets(){assets=await fetch('./story/assets.json',{cache:'no-store'}).then(r=>r.json());return loadFinished();}};
}
