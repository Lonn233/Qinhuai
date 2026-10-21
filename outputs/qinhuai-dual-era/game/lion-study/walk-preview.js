import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {createSurroundings} from './surroundings.js';
import {applyModelSize} from './model-sizing.mjs';
import {sizeLabel} from './dimensions.cjs';
import {arrangeExhibits,walkStep,EYE_HEIGHT} from './walk-layout.mjs';

export function createWalkPreview({renderer,lanterns,presets,prepareModel,disposeEntry,collectResources,onEnter,onExit}){
 const $=id=>document.getElementById(id),dialog=$('walk-dialog'),viewport=$('walk-viewport'),canvas=renderer.domElement;
 const camera=new THREE.PerspectiveCamera(65,1,.04,180);camera.rotation.order='YXZ';
 let active=false,ready=false,version=0,controller=null,scene=null,composer=null,bloom=null,layout=null,entries=[],error=null;
 let dragging=null,lastX=0,lastY=0,previousFocus=null,snapshot=null;
 const keys=new Set(),touch=new Set();
 const state={get active(){return active;},get ready(){return ready;},get error(){return error;},get camera(){return {position:camera.position.toArray(),rotation:camera.rotation.toArray()};},get models(){return entries.map(e=>({id:e.id,sizeMeters:e.sizeMeters,width:e.size.x,depth:e.size.z,height:e.size.y,position:e.group.position.toArray(),power:e.uniforms.uClothPower.value,color:e.tuning.color,base:presets[e.tuning.index].name}));},get layout(){return layout;}};
 function resize(){if(!active||!composer)return;const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
 new ResizeObserver(resize).observe(viewport);
 function pose(x,z,target){camera.position.set(x,EYE_HEIGHT,z);camera.lookAt(target);camera.updateMatrixWorld();keys.clear();touch.clear();}
 function home(){if(!layout)return;pose(layout.spawn.x,layout.spawn.z,new THREE.Vector3(0,3,layout.stations[0].z));$('walk-location').textContent='入口 · 花灯全景';markStation(null);}
 function markStation(id){for(const b of $('walk-stations').children)b.setAttribute('aria-pressed',String(b.dataset.station===id));}
 function visit(id){if(!ready)return;const s=layout.stations.find(s=>s.id===id),entry=entries.find(e=>e.id===id);if(!s||!entry)return;
  const distance=Math.max(1.4,entry.size.y*.8,entry.size.x*.65);
  pose(s.x,Math.max(layout.bounds.minZ+.5,s.z-s.halfZ-distance),new THREE.Vector3(s.x,s.lift+.05+entry.size.y*.45,s.z));
  $('walk-location').textContent=lanterns.find(l=>l.id===id).name+' · '+sizeLabel(id,entry.sizeMeters);markStation(id);viewport.focus({preventScroll:true});
 }
 function rotate(dx,dy){camera.rotation.y-=dx*.0025;camera.rotation.x=THREE.MathUtils.clamp(camera.rotation.x-dy*.0025,-1.35,1.35);}
 function unlock(){if(document.pointerLockElement===canvas)document.exitPointerLock();keys.clear();touch.clear();dragging=null;}
 function disposeScene(){
  for(const entry of entries)disposeEntry(entry);entries=[];
  if(scene){for(const r of collectResources(scene))r.dispose();scene.clear();}
  if(composer){for(const pass of composer.passes)pass.dispose?.();composer.dispose();}
  scene=null;composer=null;bloom=null;layout=null;
 }
 function close(){if(!active)return;version++;controller?.abort();unlock();active=false;ready=false;disposeScene();$('viewport').append(canvas);dialog.close();document.body.classList.remove('walk-is-open');onExit();previousFocus?.focus({preventScroll:true});}
 function addPlinth(s,entry){
  const height=s.lift+.10,mat=new THREE.MeshStandardMaterial({color:0x28312f,roughness:.9});
  const plinth=new THREE.Mesh(new THREE.BoxGeometry(s.halfX*2,height,s.halfZ*2),mat);plinth.position.set(s.x,height/2-.05,s.z);scene.add(plinth);
  // Readable exhibit plaque; labels are separate from the luminous cloth models.
  const label=document.createElement('canvas');label.width=640;label.height=176;const c=label.getContext('2d');
  c.fillStyle='#19211f';c.fillRect(0,0,640,176);c.strokeStyle='#a58e57';c.strokeRect(3,3,634,170);c.textAlign='center';c.fillStyle='#efdfb7';c.font='42px "Microsoft YaHei", sans-serif';c.fillText(lanterns.find(l=>l.id===s.id).name,320,66);c.font='27px "Microsoft YaHei", sans-serif';c.fillText(sizeLabel(s.id,entry.sizeMeters)+' · '+Math.round(entry.tuning.power*100)+'%',320,124);
  const texture=new THREE.CanvasTexture(label);texture.colorSpace=THREE.SRGBColorSpace;
  const plaque=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.36),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));plaque.rotation.y=Math.PI;plaque.position.set(s.x,.42,s.z-s.halfZ-.025);scene.add(plaque);
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.36,8),mat);stem.position.set(s.x,.18,plaque.position.z+.03);scene.add(stem);
 }
 function buildScene(){
  scene=new THREE.Scene();scene.background=new THREE.Color('#08121f');scene.fog=new THREE.Fog('#08121f',40,110);
  scene.add(new THREE.HemisphereLight(0xe4edff,0x504435,.56));
  const key=new THREE.DirectionalLight(0xffedda,.65);key.position.set(-3,5,4);scene.add(key);
  const fill=new THREE.DirectionalLight(0xb8cfee,.23);fill.position.set(3,2,-3);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(180,180),new THREE.MeshStandardMaterial({color:0x172020,roughness:.96}));floor.rotation.x=-Math.PI/2;floor.position.y=-.1;scene.add(floor);
  composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
  bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.18,.65,.63);composer.addPass(bloom);composer.addPass(new OutputPass());
  pose(0,-16,new THREE.Vector3(0,3,9));resize();
 }
 async function open(tunings){
  if(active)return;active=true;ready=false;error=null;snapshot=structuredClone(tunings);const token=++version;controller=new AbortController();const signal=controller.signal;
  previousFocus=document.activeElement;onEnter();document.body.classList.add('walk-is-open');dialog.showModal();viewport.prepend(canvas);$('walk-loading').hidden=false;$('walk-lock').hidden=true;$('walk-stations').replaceChildren();$('walk-location').textContent='正在布置五盏花灯…';
  buildScene();viewport.focus({preventScroll:true});
  try{
   for(const lantern of lanterns){
    $('walk-loading').textContent='正在布置 '+lantern.name+' · '+(entries.length+1)+' / '+lanterns.length;
    const response=await fetch(lantern.modelPath,{signal});if(!response.ok)throw Error(lantern.name+'模型加载失败（'+response.status+'）');
    const buffer=await response.arrayBuffer();if(token!==version)return;
    const gltf=await new GLTFLoader().parseAsync(buffer,new URL('./game/assets/',location.href).href);
    if(token!==version){for(const r of collectResources(gltf.scene))r.dispose();return;}
    const t=snapshot[lantern.id],base=presets[t.index],color=new THREE.Color(t.color);
    const uniforms={uClothPower:{value:t.power},uClothTint:{value:new THREE.Vector3(color.r,color.g,color.b)},uClothShape:{value:base.shape}};
    const entry=prepareModel(gltf.scene,lantern,uniforms);applyModelSize(entry,t.sizeMeters);entry.tuning=t;entry.uniforms=uniforms;entries.push(entry);
   }
   layout=arrangeExhibits(entries);
   for(const s of layout.stations){
    const e=entries.find(e=>e.id===s.id);e.group.position.set(s.x,.05+s.lift,s.z);scene.add(e.group);addPlinth(s,e);
    const base=presets[e.tuning.index],ratio=e.sizeMeters/e.referenceSizeMeters;
    const spill=new THREE.PointLight(0xffc78a,base.spill*(e.tuning.power/base.power)*ratio*ratio,5*ratio,2);spill.position.set(s.x,s.lift+.05+e.size.y*.35,s.z);scene.add(spill);
   }
   const scenery=createSurroundings(scene),b=layout.bounds;scenery.position.z=(b.maxZ+b.minZ)/2;scenery.userData.setFootprint(b.maxX-b.minX-2,b.maxZ-b.minZ-6);
   // Keep street furniture behind the walkable perimeter; no invisible obstacles in the path.
   scenery.getObjectByName('sign').visible=false;
   const borderMat=new THREE.MeshStandardMaterial({color:0x56615b,roughness:.9});
   for(const x of [b.minX,b.maxX]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.15,.5,b.maxZ-b.minZ),borderMat);rail.position.set(x,.18,(b.maxZ+b.minZ)/2);scene.add(rail);}
   for(const z of [b.minZ,b.maxZ]){const rail=new THREE.Mesh(new THREE.BoxGeometry(b.maxX-b.minX,.5,.15),borderMat);rail.position.set(0,.18,z);scene.add(rail);}
   bloom.strength=Math.max(...entries.map(e=>presets[e.tuning.index].bloom));bloom.radius=Math.max(...entries.map(e=>presets[e.tuning.index].radius));
   for(const lantern of lanterns){const button=document.createElement('button');button.type='button';button.dataset.station=lantern.id;button.textContent=lantern.name;button.addEventListener('click',()=>visit(lantern.id));$('walk-stations').append(button);}
   ready=true;$('walk-loading').hidden=true;$('walk-lock').hidden=false;home();resize();
  }catch(e){if(token!==version||e.name==='AbortError')return;error=String(e);$('walk-loading').textContent='预览加载失败：'+e.message+'。请返回调灯后重试。';console.error(e);}
 }
 function tick(dt){
  if(!active||!composer)return;
  if(ready){
   const held=(...codes)=>codes.some(code=>keys.has(code));
   let f=Number(held('KeyW','ArrowUp')||touch.has('forward'))-Number(held('KeyS','ArrowDown')||touch.has('back'));
   let r=Number(held('KeyD','ArrowRight')||touch.has('right'))-Number(held('KeyA','ArrowLeft')||touch.has('left'));
   const length=Math.hypot(f,r);if(length){f/=length;r/=length;const speed=(held('ShiftLeft','ShiftRight')?5:2.4)*Math.min(dt,.05),yaw=camera.rotation.y;
    const p=walkStep(camera.position,(r*Math.cos(yaw)-f*Math.sin(yaw))*speed,(-r*Math.sin(yaw)-f*Math.cos(yaw))*speed,layout.bounds,layout.colliders);camera.position.set(p.x,EYE_HEIGHT,p.z);
   }
  }
  composer.render();
 }
 $('walk-close').addEventListener('click',close);$('walk-home').addEventListener('click',()=>{home();viewport.focus({preventScroll:true});});
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 $('walk-lock').addEventListener('click',async()=>{if(!ready)return;viewport.focus({preventScroll:true});try{await canvas.requestPointerLock();}catch{$('walk-lock').textContent='可直接拖动环顾 · WASD 移动';}});
 document.addEventListener('pointerlockchange',()=>{if(!active)return;const locked=document.pointerLockElement===canvas;$('walk-lock').hidden=locked||!ready;keys.clear();});
 document.addEventListener('mousemove',e=>{if(active&&ready&&document.pointerLockElement===canvas)rotate(e.movementX,e.movementY);});
 canvas.addEventListener('pointerdown',e=>{if(!active||!ready||e.button!==0||document.pointerLockElement===canvas)return;dragging=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);viewport.focus({preventScroll:true});});
 canvas.addEventListener('pointermove',e=>{if(dragging!==e.pointerId||!active)return;rotate(e.clientX-lastX,e.clientY-lastY);lastX=e.clientX;lastY=e.clientY;});
 const stopDrag=()=>{dragging=null;};canvas.addEventListener('pointerup',stopDrag);canvas.addEventListener('pointercancel',stopDrag);canvas.addEventListener('lostpointercapture',stopDrag);
 window.addEventListener('keydown',e=>{if(!active||!ready||e.ctrlKey||e.altKey||e.metaKey)return;if(/^(Key[WASD]|Arrow(Up|Down|Left|Right)|Shift(Left|Right))$/.test(e.code)){e.preventDefault();keys.add(e.code);}});
 window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',unlock);document.addEventListener('visibilitychange',()=>{if(document.hidden)unlock();});
 for(const button of document.querySelectorAll('[data-move]')){
  button.addEventListener('pointerdown',e=>{if(!ready)return;e.preventDefault();button.setPointerCapture(e.pointerId);touch.add(button.dataset.move);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>touch.delete(button.dataset.move));
 }
 return {open,close,resize,tick,state,get active(){return active;}};
}
