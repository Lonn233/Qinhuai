import {presets} from './lighting-presets.js';
import {clothMaterial} from './cloth-material.js';
import {createWalkPreview} from './walk-preview.js';
import * as THREE from 'three';
import {LANTERNS} from '../data.mjs';
import {createTuner} from './tuning.js';
import {SIZE_SPECS,formatMeters,sizeLabel} from './dimensions.cjs';
import {initializeModelSize,applyModelSize} from './model-sizing.mjs';
import {createSurroundings} from './surroundings.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const query=new URLSearchParams(location.search);
const initialLantern=LANTERNS.some(l=>l.id===query.get('lantern'))?query.get('lantern'):'lion';
const effectNumber=Number(query.get('effect'));
const initialEffect=Number.isInteger(effectNumber)&&effectNumber>=1&&effectNumber<=presets.length?effectNumber-1:1;
const host=document.querySelector('#viewport'),status=document.querySelector('#status');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.86;host.append(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#111d2c');scene.fog=new THREE.Fog('#111d2c',10,29);
const camera=new THREE.PerspectiveCamera(34,1,.05,50),controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.minDistance=3;controls.maxDistance=11;controls.maxPolarAngle=Math.PI*.49;controls.autoRotateSpeed=.55;
let currentEntry=null,walkPreview=null;
const home=()=>{
 const size=currentEntry?.size||new THREE.Vector3(3.1,2.35,2.4);
 const halfFov=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
 const distance=Math.max(.6,size.y/halfFov*.72,Math.hypot(size.x,size.z)/(halfFov*Math.max(camera.aspect,.5))*.65);
 const targetY=.05+size.y*.5;
 controls.minDistance=Math.max(.15,Math.max(size.x,size.y,size.z)*.18);
 controls.maxDistance=Math.max(3,distance*3);
 camera.near=Math.max(.005,Math.min(.05,Math.max(size.x,size.y,size.z)*.005));
 camera.far=Math.max(80,distance*6);camera.updateProjectionMatrix();
 scene.fog.near=Math.max(12,distance+Math.max(size.x,size.y,size.z));scene.fog.far=Math.max(45,distance*4);
 controls.target.set(0,targetY,0);camera.position.set(-.45*distance,targetY+.19*distance,-.87*distance);controls.update();
};home();
scene.add(new THREE.HemisphereLight(0xe4edff,0x504435,.56));
const key=new THREE.DirectionalLight(0xffedda,.65);key.position.set(-3,5,4);scene.add(key);
const fill=new THREE.DirectionalLight(0xb8cfee,.23);fill.position.set(3,2,-3);scene.add(fill);
const spill=new THREE.PointLight(0xffc78a,1.6,5,2);spill.position.set(0,.7,0);scene.add(spill);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshStandardMaterial({color:0x172020,roughness:.96}));floor.rotation.x=-Math.PI/2;floor.position.y=-.1;scene.add(floor);
const plinth=new THREE.Mesh(new THREE.CylinderGeometry(2.05,2.12,.14,80),new THREE.MeshStandardMaterial({color:0x29302b,roughness:.94}));plinth.position.y=-.025;scene.add(plinth);
const surroundings=createSurroundings(scene);
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.09,.45,.57);composer.addPass(bloom);composer.addPass(new OutputPass());
const uniforms={uClothPower:{value:.53},uClothTint:{value:new THREE.Vector3(1,.97,.92)},uClothShape:{value:.04}};
let active=1,loaded=false,requestedId=initialLantern,displayedId=null,requestVersion=0,fetchController=null;
const cache=new Map(),selections=new Map(),lanterns=['lion','mountain','fish','crane','lotus'].map(id=>LANTERNS.find(l=>l.id===id));
selections.set(initialLantern,initialEffect);
const lanternButtons=lanterns.map((lantern,i)=>{
 const button=document.createElement('button');button.type='button';button.className='lantern-option';button.dataset.lantern=lantern.id;
 button.setAttribute('aria-pressed',String(lantern.id===initialLantern));
 const number=document.createElement('span');number.textContent='0'+(i+1);
 const name=document.createElement('strong');name.textContent=lantern.name;
 button.append(number,name);button.addEventListener('click',()=>switchLantern(lantern.id));document.querySelector('#lanterns').append(button);return button;
});
const buttons=presets.map((p,i)=>{const button=document.createElement('button');button.type='button';button.className=i>=5?'preset preset-bright':'preset';button.setAttribute('aria-pressed',String(i===active));button.innerHTML='<img alt="'+p.name+'灯效预览"><div class="text"><div class="line"><span class="index">0'+(i+1)+'</span><strong>'+p.name+'</strong></div><small>'+p.short+'</small></div>';button.addEventListener('click',()=>{if(loaded){tuner.activate(displayedId,i,true);selections.set(displayedId,i);}});document.querySelector('#presets').append(button);return button;});
function spillScale(){return currentEntry?Math.pow(currentEntry.sizeMeters/currentEntry.referenceSizeMeters,2):1;}
function select(i){if(!Number.isInteger(i)||i<0||i>=presets.length)return;active=i;const p=presets[i];uniforms.uClothPower.value=p.power;uniforms.uClothTint.value.set(...p.tint);uniforms.uClothShape.value=p.shape;bloom.strength=p.bloom;bloom.radius=p.radius;bloom.threshold=p.threshold??.57;spill.intensity=p.spill*spillScale();document.querySelector('#number').textContent='0'+(i+1);document.querySelector('#effect-title').textContent=p.name;document.querySelector('#effect-description').textContent=p.description;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));}

function updatePhysicalSize(metres){
 if(!currentEntry)return;
 if(currentEntry.sizeMeters!==metres)applyModelSize(currentEntry,metres);
 const size=currentEntry.size,footprint=Math.max(size.x,size.z),radius=footprint/2+Math.max(.12,footprint*.07);
 plinth.scale.set(radius/2.05,1,radius/2.05);
 // Scale luminous flux with area: resizing must not wash out small fabric lanterns.
 spill.position.y=.05+size.y*.35;spill.distance=5*Math.sqrt(spillScale());
 surroundings.userData.setFootprint(size.x,size.z);
 controls.minDistance=Math.max(.1,footprint*.1);
 const distance=camera.position.distanceTo(controls.target),extent=Math.max(size.x,size.y,size.z);
 camera.far=Math.max(80,distance+extent*8);camera.updateProjectionMatrix();
 scene.fog.near=Math.max(12,distance+extent);scene.fog.far=Math.max(45,distance+extent*8);
 document.querySelector('#model-dimensions').textContent='包围尺寸 '+[size.x,size.z,size.y].map(formatMeters).join(' × ')+' m（宽 / 深 / 高）';
}
const tuner=createTuner({presets,lanterns,onChange(s){
 select(s.index);
 updatePhysicalSize(s.sizeMeters);
 uniforms.uClothPower.value=s.power;
 if(s.custom){const color=new THREE.Color(s.color);uniforms.uClothTint.value.set(color.r,color.g,color.b);}
 const base=presets[s.index];spill.intensity=base.spill*(s.power/base.power)*spillScale();
 if(s.custom||s.name||s.sizeMeters!==SIZE_SPECS[displayedId].initial){document.querySelector('#number').textContent='自定';document.querySelector('#effect-title').textContent=s.name||'自定义方案';document.querySelector('#effect-description').textContent='基于「'+base.name+'」 · 亮度 '+Math.round(s.power*100)+'% · 光色 '+s.color.toUpperCase();}
 document.querySelector('#effect-description').textContent+=' · '+sizeLabel(displayedId,s.sizeMeters);
}});
function resize(){if(walkPreview?.active){walkPreview.resize();return;}const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(host);resize();
document.querySelector('#reset').addEventListener('click',home);
document.querySelector('#rotate').addEventListener('click',e=>{controls.autoRotate=!controls.autoRotate;e.currentTarget.setAttribute('aria-pressed',String(controls.autoRotate));});
// Reuse the painted base colour in linear space, without an emissive map or a
// flat orange emission. A very small floor keeps deep ink translucent. Surface
// orientation only gently modulates this broad emission; it never isolates edges.


function collectResources(object){
 const resources=new Set();object.traverse(o=>{if(!o.isMesh)return;resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){resources.add(m);for(const v of Object.values(m))if(v?.isTexture)resources.add(v);}});return resources;
}
function disposeEntry(entry){entry.group.removeFromParent();for(const r of entry.resources)r.dispose();}
function prepareModel(object,lantern,clothUniforms=uniforms){
 const resources=collectResources(object),bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
 object.position.sub(new THREE.Vector3(center.x,bounds.min.y,center.z));
 const group=new THREE.Group();group.name='Study_'+lantern.id;group.add(object);group.rotation.y=lantern.rotation;group.position.y=.05;
 const mats=new Map();object.traverse(o=>{if(!o.isMesh)return;const convert=m=>{if(!mats.has(m)){const cloth=clothMaterial(m,clothUniforms);mats.set(m,cloth);resources.add(cloth);}return mats.get(m);};o.material=Array.isArray(o.material)?o.material.map(convert):convert(o.material);});
 const measured=initializeModelSize(group,lantern.id),large=lantern.id==='mountain';
 const referenceScale=Math.min((large?3.2:2.35)/measured.nativeSize.y,(large?3.65:3.1)/Math.max(measured.nativeSize.x,measured.nativeSize.z));
 return {...measured,referenceSizeMeters:measured.nativeMeasure*referenceScale,resources,previews:null};
}
function renderPreviews(entry){
 const saved=active,rotation=controls.autoRotate;controls.autoRotate=false;
 try{
  renderer.setPixelRatio(1);renderer.setSize(420,255,false);composer.setSize(420,255);camera.aspect=420/255;camera.updateProjectionMatrix();home();
  entry.previews=presets.map((p,i)=>{select(i);composer.render();return renderer.domElement.toDataURL('image/png');});
 }finally{renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));select(saved);resize();home();controls.autoRotate=rotation;}
}
async function switchLantern(id){
 if(walkPreview?.active)return;
 const lantern=lanterns.find(l=>l.id===id);if(!lantern)return;
 if(displayedId===id&&loaded)return;
 const version=++requestVersion;requestedId=id;fetchController?.abort();fetchController=new AbortController();const signal=fetchController.signal;
 loaded=false;document.querySelector('#walk-open').disabled=true;tuner.setEnabled(false);window.__LION_STUDY__.ready=false;window.__LION_STUDY__.error=null;
 if(currentEntry)currentEntry.group.visible=false;
 status.hidden=false;status.textContent='正在载入'+lantern.name+'…';document.querySelector('#retry').hidden=true;
 document.querySelector('#viewport').setAttribute('aria-busy','true');
 document.querySelector('#lantern-name').textContent=lantern.name;document.querySelector('#current-lantern').textContent=lantern.name;
 document.querySelector('.stage').setAttribute('aria-label',lantern.name+'三维灯效预览');
 lanternButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lantern===id)));
 buttons.forEach(b=>{b.disabled=true;b.querySelector('img').hidden=true;});select(selections.get(id)??1);composer.render();
 let entry=cache.get(id);
 try{
  if(!entry){
   const response=await fetch(lantern.modelPath,{signal});if(!response.ok)throw new Error('模型加载失败：'+response.status);
   const buffer=await response.arrayBuffer();if(version!==requestVersion)return;
   status.textContent='正在准备'+lantern.name+'的九种灯效…';
   const gltf=await new GLTFLoader().parseAsync(buffer,new URL('./game/assets/',location.href).href);
   if(version!==requestVersion){for(const r of collectResources(gltf.scene))r.dispose();return;}
   entry=prepareModel(gltf.scene,lantern);cache.set(id,entry);
  }
  if(version!==requestVersion)return;
  cache.delete(id);cache.set(id,entry);currentEntry=entry;entry.group.visible=true;scene.add(entry.group);displayedId=id;
  updatePhysicalSize(entry.sizeMeters);
  resize();home();if(!entry.previews)renderPreviews(entry);
  buttons.forEach((b,i)=>{const img=b.querySelector('img');img.src=entry.previews[i];img.alt=lantern.name+' · '+presets[i].name;img.hidden=false;b.disabled=false;});
  loaded=true;document.querySelector('#walk-open').disabled=false;tuner.setEnabled(true);tuner.activate(id,selections.get(id)??1);home();document.querySelector('.light-sidebar').scrollTop=0;status.hidden=true;document.querySelector('#viewport').setAttribute('aria-busy','false');window.__LION_STUDY__.ready=true;
  // Keep at most two full models in GPU memory; thumbnails stay with those entries.
  while(cache.size>2){const oldest=cache.keys().next().value;disposeEntry(cache.get(oldest));cache.delete(oldest);}
  composer.render();
 }catch(error){
  if(version!==requestVersion||error.name==='AbortError')return;
  if(entry&&!cache.has(id))disposeEntry(entry);
  status.textContent=lantern.name+'暂时未能载入，请重试或选择另一盏灯。';document.querySelector('#retry').hidden=false;
  document.querySelector('#viewport').setAttribute('aria-busy','false');window.__LION_STUDY__.error=String(error);console.error(error);
 }
}
document.querySelector('#retry').addEventListener('click',()=>switchLantern(requestedId));
walkPreview=createWalkPreview({renderer,lanterns,presets,prepareModel,disposeEntry,collectResources,
 onEnter(){controls.enabled=false;},onExit(){controls.enabled=true;resize();controls.update();composer.render();}
});
document.querySelector('#walk-open').addEventListener('click',()=>{if(loaded)void walkPreview.open(tuner.getAll());});
window.__LION_STUDY__={get walk(){return walkPreview.state;},get allTuning(){return tuner.getAll();},ready:false,presets,lanterns,select:i=>{if(loaded&&presets[i]){tuner.activate(displayedId,i,true);selections.set(displayedId,i);}},get tuning(){return tuner.current;},switchLantern,reset:home,get lanternId(){return displayedId;},get requestedId(){return requestedId;},get cachedModels(){return [...cache.keys()];},get surroundings(){return surroundings;},get active(){return active;},get materials(){return uniforms;},get modelDimensions(){if(!currentEntry)return null;const box=new THREE.Box3().setFromObject(currentEntry.group),size=box.getSize(new THREE.Vector3());return {sizeMeters:currentEntry.sizeMeters,width:size.x,depth:size.z,height:size.y,minY:box.min.y,scale:currentEntry.group.scale.toArray()};}};
let previousFrame=performance.now();
renderer.setAnimationLoop(()=>{const now=performance.now(),dt=(now-previousFrame)/1000;previousFrame=now;if(walkPreview.active){walkPreview.tick(dt);return;}if(!loaded)return;controls.update();composer.render();});switchLantern(initialLantern);
