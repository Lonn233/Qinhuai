import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {LANTERNS,RIDDLES,LOCATIONS,PLAY_AREA,SPAWN} from './data.mjs';
import {GameState,STATES,resolveMovement} from './state.mjs';

export function createLanternGame(api) {
 const {scene,model,renderer,firstPersonCamera:camera,firstPersonControls:controls}=api;
 let storage;try{storage=localStorage;}catch{}
 const state=new GameState(storage),root=new THREE.Group();root.name='Lantern_Festival_Five_Riddles';model.add(root);
 const abort=new AbortController(),signal=abort.signal;
 const on=(target,type,fn,options={})=>target.addEventListener(type,fn,{...options,signal});
 const $=id=>document.getElementById(id);
 const keys=new Set(),velocity=new THREE.Vector2(),direction=new THREE.Vector3(),right=new THREE.Vector3();
 const raycaster=new THREE.Raycaster(),aim=new THREE.Vector2(0,0);raycaster.far=4.8;raycaster.layers.set(2);
 const interactables=[],exhibits=new Map(),thumbnails=new Map(),loadErrors=new Map(),ownedTextures=new Set(),ownedMaterials=new Set(),ownedGeometries=new Set();
 const coarse=matchMedia('(pointer: coarse)').matches;
 let started=false,currentTarget=null,focusedLantern=null,lastRay=0,noticeTimer=null,disposed=false,drag=null,freeLook=false;
 const dialog=$('game-dialog'),content=$('dialog-content');
 controls.minPolarAngle=.22;controls.maxPolarAngle=Math.PI-.24;controls.pointerSpeed=.64;
 renderer.domElement.setAttribute('aria-label','上元秦淮灯市，WASD 行走，鼠标环顾，E 猜灯谜');
 const material=(params)=>{const m=new THREE.MeshStandardMaterial(params);ownedMaterials.add(m);return m;};
 const wood=material({color:0x53362b,roughness:.92}),red=material({color:0x8f3028,roughness:.75}),stone=material({color:0x7d7666,roughness:.96}),gold=material({color:0xc49a55,metalness:.4,roughness:.6});
 const mesh=(geometry,mat,parent,x,y,z)=>{ownedGeometries.add(geometry);const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.receiveShadow=true;parent.add(m);return m;};
 const box=(parent,mat,x,y,z,w,h,d)=>mesh(new THREE.BoxGeometry(w,h,d),mat,parent,x,y,z);
 // Each lantern is a backlit fabric shell: broad emissive cloth preserves painted detail,
 // while invisible internal sources supply the gentle volume and nearby warm spill.
 const LANTERN_GLOW={
  mountain:{emissive:0xef7e3d,intensity:.20,light:0xffa45a,sources:[{y:1.65,intensity:4.1,distance:5.1},{y:3.05,intensity:2.3,distance:4.1}]},
  lion:{emissive:0xee974f,intensity:.20,light:0xffaf63,sources:[{y:1.12,intensity:5.0,distance:4.6}]},
  fish:{emissive:0xeea44f,intensity:.19,light:0xffbf73,sources:[{y:1.05,intensity:3.0,distance:3.7}]},
  crane:{emissive:0xdf964e,intensity:.17,light:0xffbe76,sources:[{y:1.42,intensity:4.8,distance:4.9}]},
  lotus:{emissive:0xff7884,intensity:.25,light:0xffb977,sources:[{y:.48,intensity:3.7,distance:3.5}]}
 };
 const warmLanternMaterial=(original,glow)=>{
  const c=original.clone();
  if(c.isMeshStandardMaterial||c.isMeshPhysicalMaterial){
   c.metalness=Math.min(c.metalness,.16);c.roughness=Math.max(c.roughness,.68);
   c.emissive.setHex(glow.emissive);
   // Do not gate illumination through dark ink in the painted texture. The base map
   // remains visible under the inner light, while a uniform low emission makes the
   // complete coloured cloth read as a translucent, internally lit lantern.
   c.emissiveMap=null;c.emissiveIntensity=glow.intensity;c.needsUpdate=true;
  }
  ownedMaterials.add(c);return c;
 };
 const labelTexture=(title,number,subtitle)=>{
  const c=document.createElement('canvas');c.width=768;c.height=448;const ctx=c.getContext('2d');
  ctx.fillStyle='#e9dfc9';ctx.fillRect(0,0,768,448);ctx.strokeStyle='#aa8e62';ctx.lineWidth=4;ctx.strokeRect(24,24,720,400);
  ctx.fillStyle='#89372c';ctx.font='32px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(`灯谜 · ${String(number).padStart(2,'0')}`,384,95);
  ctx.fillStyle='#302d26';ctx.font='62px "STSong","SimSun",serif';ctx.fillText(title,384,222);
  ctx.fillStyle='#71654e';ctx.font='29px "Microsoft YaHei",sans-serif';ctx.fillText(subtitle,384,340);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;ownedTextures.add(tex);return tex;
 };
 for(const location of LOCATIONS){
  const lantern=LANTERNS.find(l=>l.id===location.lanternId),riddle=RIDDLES.find(r=>r.id===location.riddleId);
  const group=new THREE.Group();group.name=location.id;group.position.set(location.x,0,location.z);root.add(group);
  const {podiumWidth,podiumDepth}=location,signX=-podiumWidth/2+.72,signZ=-podiumDepth/2-.36;
  box(group,stone,0,1.06,0,podiumWidth,.42,podiumDepth);box(group,wood,0,1.35,0,podiumWidth-.3,.18,podiumDepth-.3);box(group,gold,0,1.44,-podiumDepth/2+.08,podiumWidth-.25,.035,.045);
  box(group,wood,signX,1.21,signZ,.085,.75,.1);box(group,wood,signX,1.62,signZ,1.05,.62,.08);
  const signMaterial=new THREE.MeshBasicMaterial({map:labelTexture(riddle.title,location.number,'走近 · 猜一盏灯'),toneMapped:false});ownedMaterials.add(signMaterial);
  const sign=mesh(new THREE.PlaneGeometry(1,.575),signMaterial,group,signX,1.62,signZ-.06);sign.rotation.y=Math.PI;
  box(group,red,signX-.44,1.17,signZ-.04,.1,.3,.025);box(group,red,signX+.44,1.17,signZ-.04,.1,.3,.025);
  const proxyMaterial=new THREE.MeshBasicMaterial({visible:false});ownedMaterials.add(proxyMaterial);
  const proxy=mesh(new THREE.BoxGeometry(podiumWidth+.1,5.1,podiumDepth+.1),proxyMaterial,group,0,3.05,-.1);proxy.layers.set(2);proxy.userData.locationId=location.id;interactables.push(proxy);
  exhibits.set(lantern.id,{group,lantern,location,sign,model:null});
 }
 const fill=new THREE.HemisphereLight(0xb1c2d2,0x6f4430,.7);fill.name='Festival_Local_Bounce';root.add(fill);

 function showNotice(text){$('game-notice').textContent=text;$('game-notice').classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('game-notice').classList.remove('visible'),3800);}
 function clearInput(){keys.clear();velocity.set(0,0);drag=null;}
 function resetPosition(){camera.position.set(SPAWN.x,PLAY_AREA.ground+PLAY_AREA.eyeHeight,SPAWN.z);camera.lookAt(SPAWN.lookX,SPAWN.lookY,SPAWN.lookZ);}
 function capture(){
  if(coarse||freeLook)return;
  try{const result=renderer.domElement.requestPointerLock();result?.catch(()=>{freeLook=true;showNotice('鼠标锁定不可用：按住画面拖动环顾，WASD 移动。');syncHUD();});}catch{freeLook=true;showNotice('按住画面拖动环顾，WASD 移动。');}
 }
 function start(){controls.enabled=true;if(!api.firstPerson)api.setFirstPerson(true,{requestLock:false});if(!started){resetPosition();started=true;}state.close();if(dialog.open)dialog.close();$('game-intro').hidden=true;capture();syncHUD();renderer.domElement.focus({preventScroll:true});}
 function setTarget(location){currentTarget=location;const prompt=$('interaction-prompt');prompt.hidden=!location;if(location){$('interaction-title').textContent=state.solved.has(location.riddleId)?'再赏这盏花灯':'查看灯谜';$('interaction-subtitle').textContent=RIDDLES.find(r=>r.id===location.riddleId).title;}}
 function syncHUD(){
  $('catalog-count').textContent=`${state.unlocked.size} / ${LANTERNS.length}`;
  $('collection-progress').textContent=`已赏 ${state.unlocked.size} 盏 · 共 ${LANTERNS.length} 盏`;
  $('resume-explore').hidden=!started||dialog.open||controls.isLocked||coarse||freeLook||!api.firstPerson;
  $('game-crosshair').hidden=!started||dialog.open||!api.firstPerson;
  $('return-walk').hidden=api.firstPerson;
  $('game-controls').hidden=!started||!api.firstPerson;
  $('touch-controls').hidden=!coarse||!started||dialog.open||!api.firstPerson;
  document.body.classList.toggle('map-view',!api.firstPerson);
  document.querySelectorAll('[data-game-era]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.gameEra===api.era)));
 }
 function openDialog(){clearInput();setTarget(null);controls.enabled=false;if(controls.isLocked)controls.unlock();if(!dialog.open)dialog.showModal();syncHUD();}
 function closeDialog(relock=true){state.close();dialog.close();controls.enabled=true;setTarget(null);syncHUD();if(relock&&started&&api.firstPerson)capture();renderer.domElement.focus({preventScroll:true});}
 function imageMarkup(lantern,locked=false){const image=thumbnails.get(lantern.id);return image?`<img class="lantern-image${locked?' silhouette':''}" src="${image}" alt="${locked?'未解锁花灯剪影':lantern.name}" draggable="false">`:`<div class="image-placeholder">${loadErrors.has(lantern.id)?'模型暂未载入':'正在点灯…'}</div>`;}
 function feedbackMarkup(riddle,repeat=false){const lantern=LANTERNS.find(l=>l.id===riddle.unlockLanternId);return `<div class="success-layout"><div class="success-art">${imageMarkup(lantern)}</div><div class="success-copy"><p class="dialog-eyebrow">${repeat?'此灯已入图鉴':'一谜一灯 · 灯火相逢'}</p><span class="red-seal">${repeat?'已赏':'猜中'}</span><h2 id="dialog-title">${lantern.name}</h2><p class="success-message">${repeat?'再赏一回，灯火依旧。':`猜中灯谜，已解锁：${lantern.name}`}</p><p class="answer-explanation">${riddle.explanation}</p><div class="dialog-actions"><button class="primary-button" data-action="view-unlock" data-id="${lantern.id}">查看图鉴 <span aria-hidden="true">↗</span></button><button class="text-button" data-action="continue">继续游园</button></div></div></div>`;}
 function openRiddle(location){
  if(!location||!started||!api.firstPerson||state.mode!==STATES.EXPLORING)return;
  state.openRiddle(location.riddleId);const r=state.activeRiddle;dialog.className='game-dialog riddle-dialog';
  if(state.mode===STATES.FEEDBACK)content.innerHTML=feedbackMarkup(r,true);
  else content.innerHTML=`<div class="riddle-layout"><aside class="riddle-margin" aria-hidden="true"><span>秦淮灯市</span><i></i><span>第 ${String(location.number).padStart(2,'0')} 谜</span></aside><div class="riddle-main"><p class="dialog-eyebrow">一盏花灯 · 一个谜底</p><h2 id="dialog-title">${r.title}</h2><p class="riddle-verse">${r.riddle.replaceAll('\n','<br>')}</p><p class="answer-type">${r.answerType}</p><form id="riddle-form" novalidate><label for="riddle-answer">你的谜底</label><div class="answer-row"><input id="riddle-answer" name="answer" type="text" maxlength="40" autocomplete="off" placeholder="在这里写下答案" autofocus><button class="primary-button" type="submit">揭晓</button></div><p id="answer-feedback" class="answer-feedback" role="status" aria-live="polite"></p></form><div class="riddle-footer"><button class="text-button" data-action="hint">借一点灯光 · 看提示</button><span id="hint-text" hidden>${r.hint}</span></div></div></div>`;
  openDialog();requestAnimationFrame(()=>$('riddle-answer')?.focus());
 }
 function renderCatalog(){
  const selected=LANTERNS.find(l=>l.id===focusedLantern);dialog.className='game-dialog catalog-dialog';
  const cards=LANTERNS.map((l,i)=>{const unlocked=state.unlocked.has(l.id);return `<button class="catalog-card${unlocked?' unlocked':' locked'}${selected?.id===l.id?' selected':''}" data-action="select-lantern" data-id="${l.id}" aria-pressed="${selected?.id===l.id}"><span class="card-number">${String(i+1).padStart(2,'0')}</span><div class="card-art">${imageMarkup(l,!unlocked)}</div><span class="card-name">${unlocked?l.name:'待灯火相逢'}</span><span class="card-status">${unlocked?'已入图鉴':'猜中对应灯谜解锁'}</span></button>`;}).join('');
  const unlocked=selected&&state.unlocked.has(selected.id);
  content.innerHTML=`<div class="catalog-heading"><p class="dialog-eyebrow">把今夜的灯火，收入一册</p><h2 id="dialog-title">花灯图鉴 <span>${state.unlocked.size} / 5</span></h2><p>沿河寻灯，猜谜留念。每盏灯，都有自己的模样。</p></div><div class="catalog-grid">${cards}</div><section class="catalog-detail" aria-live="polite">${selected?`<div><p class="dialog-eyebrow">${unlocked?selected.category:'尚未解锁'}</p><h3>${unlocked?selected.name:'灯下有谜，谜中有灯'}</h3></div><div><p>${unlocked?selected.description:'到河前灯市走近对应的谜签，按 E 猜中谜底，就能翻开这一页。'}</p>${unlocked&&selected.historicalNote?`<small>${selected.historicalNote}</small>`:''}${loadErrors.has(selected.id)?`<button class="text-button" data-action="retry-model" data-id="${selected.id}">重新加载模型</button>`:''}</div>`:'<p>选一盏灯，翻开它的故事。</p>'}</section><div class="catalog-footer"><span>${state.storageWarning?'当前仅保存在本次会话；浏览器不允许写入存档。':'进度保存在本机浏览器，刷新后也不会丢失。'}</span><button class="text-button" data-action="continue">回到灯火之间 <span aria-hidden="true">→</span></button></div>`;
 }
 function openCatalog(id){focusedLantern=id||focusedLantern||LANTERNS.find(l=>state.unlocked.has(l.id))?.id||null;state.openCatalog();renderCatalog();openDialog();}
 function refreshDialogArt(){if(state.mode===STATES.CATALOG){const focusId=document.activeElement?.dataset.id;renderCatalog();if(focusId)content.querySelector(`[data-id="${focusId}"]`)?.focus();}else if(state.mode===STATES.FEEDBACK&&state.activeRiddle)content.innerHTML=feedbackMarkup(state.activeRiddle,true);}
 on($('begin-festival'),'click',start);on($('resume-explore'),'click',start);on($('catalog-button'),'click',()=>openCatalog());
 on($('dialog-close'),'click',()=>closeDialog());on(dialog,'cancel',e=>{e.preventDefault();closeDialog(false);});
 on(dialog,'click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
 on(content,'click',event=>{
  const b=event.target.closest('[data-action]');if(!b)return;
  if(b.dataset.action==='continue')closeDialog();
  if(b.dataset.action==='hint'){$('hint-text').hidden=false;b.hidden=true;}
  if(b.dataset.action==='view-unlock')openCatalog(b.dataset.id);
  if(b.dataset.action==='select-lantern'){focusedLantern=b.dataset.id;renderCatalog();content.querySelector(`[data-id="${focusedLantern}"]`)?.focus();}
  if(b.dataset.action==='retry-model'){b.disabled=true;loadLantern(LANTERNS.find(l=>l.id===b.dataset.id));}
 });
 on(content,'submit',event=>{
  if(event.target.id!=='riddle-form')return;event.preventDefault();const result=state.answer($('riddle-answer').value);
  if(!result.ok){$('answer-feedback').textContent=result.reason==='empty'?'先写下一个谜底吧。':'还差一点，再想想。也可以借一点提示。';$('riddle-answer').setAttribute('aria-invalid','true');$('riddle-answer').setAttribute('aria-describedby','answer-feedback');$('riddle-answer').focus();return;}
  content.innerHTML=feedbackMarkup(state.activeRiddle);syncHUD();content.querySelector('button')?.focus();
  if(state.unlocked.size===LANTERNS.length)showNotice('五盏灯，五次相逢。今夜的秦淮灯火，已收入图鉴。');
 });
 on(content,'keydown',event=>{if(event.isComposing&&event.key==='Enter')event.preventDefault();});
 on($('overview-button'),'click',()=>{if(dialog.open)closeDialog(false);clearInput();started=true;$('game-intro').hidden=true;api.setFirstPerson(false);api.setView('perspective');setTarget(null);syncHUD();showNotice('全景模式：拖动旋转、滚轮缩放。点击“回到灯市”继续猜谜。');});
 on($('return-walk'),'click',()=>{api.setFirstPerson(true,{requestLock:false});resetPosition();start();});
 for(const b of document.querySelectorAll('[data-game-era]'))on(b,'click',()=>{api.setEra(b.dataset.gameEra);syncHUD();showNotice(b.dataset.gameEra==='ming'?'已切换明初意境。灯谜进度保持不变。':'已切换现代秦淮。灯谜进度保持不变。');});
 on($('weather-button'),'click',()=>{api.setNight(!api.night);$('weather-button').textContent=api.night?'看日景':'赏夜灯';fill.intensity=api.night?.7:.15;});
 on($('help-button'),'click',()=>showNotice(coarse?'左下方向键移动；拖动右侧画面环顾；靠近谜签后点“查看灯谜”。':'WASD 移动 · 鼠标环顾 · Shift 加速 · E 猜谜 · B 图鉴 · Esc 释放鼠标'));
 on($('interaction-prompt'),'click',()=>openRiddle(currentTarget));
 on(window,'keydown',event=>{
  if(event.isComposing||event.target.closest?.('input,textarea,select,[contenteditable]'))return;
  if(dialog.open)return;
  if(event.code==='KeyB'&&!event.repeat){event.preventDefault();openCatalog();return;}
  if(!started||!api.firstPerson)return;
  if(event.code==='KeyE'&&!event.repeat){event.preventDefault();openRiddle(currentTarget);return;}
  if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code)){event.preventDefault();if(controls.isLocked||coarse||freeLook)keys.add(event.code);}
 });
 on(window,'keyup',event=>keys.delete(event.code));on(window,'blur',clearInput);on(document,'visibilitychange',()=>{if(document.hidden)clearInput();});
 const lockChange=()=>{clearInput();requestAnimationFrame(syncHUD);};controls.addEventListener('lock',lockChange);controls.addEventListener('unlock',lockChange);
 on(renderer.domElement,'click',()=>{if(started&&state.mode===STATES.EXPLORING&&api.firstPerson&&!controls.isLocked&&!coarse&&!freeLook)capture();});
 on(renderer.domElement,'pointerdown',e=>{if((coarse||freeLook)&&started&&!dialog.open&&api.firstPerson){drag={id:e.pointerId,x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId);}});
 on(renderer.domElement,'pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const rot=new THREE.Euler().setFromQuaternion(camera.quaternion,'YXZ');rot.y-=(e.clientX-drag.x)*.003;rot.x=THREE.MathUtils.clamp(rot.x-(e.clientY-drag.y)*.003,-1.2,1.2);camera.quaternion.setFromEuler(rot);drag={id:e.pointerId,x:e.clientX,y:e.clientY};});
 on(renderer.domElement,'pointerup',()=>drag=null);on(renderer.domElement,'pointercancel',()=>drag=null);
 for(const b of document.querySelectorAll('[data-move]')){on(b,'pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(!dialog.open&&started)keys.add(b.dataset.move);});for(const type of ['pointerup','pointercancel','lostpointercapture'])on(b,type,()=>keys.delete(b.dataset.move));}

 function thumbnail(object){
  // One renderer, temporary offscreen target: opening the catalog never creates WebGL contexts.
  const preview=new THREE.Scene();preview.background=null;
  const copy=object.clone(true);copy.position.set(0,0,0);preview.add(copy);preview.add(new THREE.HemisphereLight(0xfff2d8,0x5d5147,2.8));
  const light=new THREE.DirectionalLight(0xffeed1,3.7);light.position.set(-3,6,-5);preview.add(light);
  const bounds=new THREE.Box3().setFromObject(copy),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
  const extent=Math.max(size.x,size.y,size.z)*.7,cam=new THREE.OrthographicCamera(-extent,extent,extent,-extent,.01,100);
  cam.position.copy(center).add(new THREE.Vector3(-.15,.28,-1).normalize().multiplyScalar(12));cam.lookAt(center);
  const target=new THREE.WebGLRenderTarget(384,384),old=renderer.getRenderTarget(),oldExposure=renderer.toneMappingExposure,oldAuto=renderer.shadowMap.autoUpdate,oldShadow=renderer.shadowMap.needsUpdate,oldClearColor=renderer.getClearColor(new THREE.Color()),oldClearAlpha=renderer.getClearAlpha();target.texture.colorSpace=THREE.SRGBColorSpace;
  const pixels=new Uint8Array(384*384*4);
  try{renderer.toneMappingExposure=1.1;renderer.setClearColor(0x000000,0);renderer.setRenderTarget(target);renderer.clear();renderer.render(preview,cam);renderer.readRenderTargetPixels(target,0,0,384,384,pixels);
   const c=document.createElement('canvas');c.width=c.height=384;const ctx=c.getContext('2d'),image=ctx.createImageData(384,384);for(let y=0;y<384;y++)image.data.set(pixels.subarray((383-y)*384*4,(384-y)*384*4),y*384*4);ctx.putImageData(image,0,0);return c.toDataURL('image/webp',.88);
  }finally{renderer.setRenderTarget(old);renderer.setClearColor(oldClearColor,oldClearAlpha);renderer.toneMappingExposure=oldExposure;renderer.shadowMap.autoUpdate=oldAuto;renderer.shadowMap.needsUpdate=oldShadow;target.dispose();preview.clear();}
 }
 function attachLantern(lantern,source){
  const exhibit=exhibits.get(lantern.id);if(exhibit.model)return;
  const object=source.clone(true);object.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const c=Math.abs(Math.cos(lantern.rotation)),s=Math.abs(Math.sin(lantern.rotation));
  const scale=Math.min(lantern.height/size.y,Math.min(lantern.width,exhibit.location.podiumWidth-.8)/(c*size.x+s*size.z),(exhibit.location.podiumDepth-.7)/(s*size.x+c*size.z));
  const pivot=new THREE.Group();pivot.scale.setScalar(scale);object.position.sub(new THREE.Vector3(center.x,bounds.min.y,center.z));pivot.add(object);
  const display=new THREE.Group();display.name='Lantern_'+lantern.id;display.add(pivot);display.rotation.y=lantern.rotation;display.position.y=1.45;
  const glow=LANTERN_GLOW[lantern.id],materials=new Map();object.traverse(o=>{if(!o.isMesh)return;o.castShadow=false;o.receiveShadow=true;const convert=m=>{if(materials.has(m))return materials.get(m);const c=warmLanternMaterial(m,glow);materials.set(m,c);return c;};o.material=Array.isArray(o.material)?o.material.map(convert):convert(o.material);});
  for(const source of glow.sources){const light=new THREE.PointLight(glow.light,source.intensity,source.distance,2);light.name=`${lantern.id}_internal_lantern_light`;light.position.set(0,source.y,0);display.add(light);}
  exhibit.group.add(display);exhibit.model=display;loadErrors.delete(lantern.id);
  thumbnails.set(lantern.id,thumbnail(display));refreshDialogArt();updateLoading();renderer.shadowMap.needsUpdate=true;
 }
 function updateLoading(){const loaded=[...exhibits.values()].filter(e=>e.model).length;$('lantern-load-status').textContent=loadErrors.size?`${loaded}/5 盏已点亮 · 部分模型未载入`:(loaded===5?'五盏花灯，已候君来':`正在点亮花灯 ${loaded}/5`);$('lantern-load-status').classList.toggle('load-error',loadErrors.size>0);$('retry-lanterns').hidden=loadErrors.size===0;}
 async function loadLantern(lantern){
  try{const gltf=await new GLTFLoader().loadAsync(lantern.modelPath);if(disposed)return;attachLantern(lantern,gltf.scene);}
  catch(error){console.warn('Lantern model unavailable:',lantern.id,error);loadErrors.set(lantern.id,String(error.message||error));updateLoading();refreshDialogArt();}
 }
 on($('retry-lanterns'),'click',async()=>{for(const id of [...loadErrors.keys()])await loadLantern(LANTERNS.find(l=>l.id===id));});
 const assetsReady=(async()=>{
  // Serial queue keeps peak decoding memory bounded; the district loads independently.
  for(const lantern of LANTERNS){if(lantern.id==='lotus')continue;await loadLantern(lantern);}
  const result=await api.assetsReady;
  const original=api.lotusLanterns.find(x=>x.kind==='main');
  if(original)attachLantern(LANTERNS.find(l=>l.id==='lotus'),original.group.children[0]);
  else await loadLantern(LANTERNS.find(l=>l.id==='lotus'));
  return {loaded:[...exhibits.values()].filter(e=>e.model).length,errors:[...loadErrors]};
 })();
 function update(dt,now){
  if(disposed)return;
  if(!started||!api.firstPerson||state.mode!==STATES.EXPLORING||dialog.open){setTarget(null);return;}
  if(controls.isLocked||coarse||freeLook){
   const f=Number(keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown'));
   const r=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));
   const length=Math.hypot(f,r)||1,speed=keys.has('ShiftLeft')||keys.has('ShiftRight')?5.0:3.0;
   velocity.lerp(new THREE.Vector2(r/length*speed,f/length*speed),1-Math.exp(-15*Math.min(dt,.05)));
   camera.getWorldDirection(direction);direction.y=0;direction.normalize();right.crossVectors(direction,camera.up).normalize();
   const move=resolveMovement(camera.position,(direction.x*velocity.y+right.x*velocity.x)*Math.min(dt,.05),(direction.z*velocity.y+right.z*velocity.x)*Math.min(dt,.05));
   camera.position.set(move.x,PLAY_AREA.ground+PLAY_AREA.eyeHeight,move.z);
  }
  if(now-lastRay<65)return;lastRay=now;camera.updateMatrixWorld();root.updateMatrixWorld(true);raycaster.setFromCamera(aim,camera);
  const hit=raycaster.intersectObjects(interactables,false)[0];let target=null;
  if(hit){const loc=LOCATIONS.find(l=>l.id===hit.object.userData.locationId);if(Math.hypot(camera.position.x-loc.x,camera.position.z-loc.z)<6.2)target=loc;}
  setTarget(target);
 }
 api.setNight(true);api.setFirstPerson(true,{requestLock:false});resetPosition();syncHUD();updateLoading();
 const game={state,root,exhibits,interactables,assetsReady,thumbnails,update,openCatalog,closeDialog,start,resetPosition,get target(){return currentTarget;},get started(){return started;},get controlsBlocked(){return !started||dialog.open||state.mode!==STATES.EXPLORING;},dispose(){disposed=true;clearInput();abort.abort();clearTimeout(noticeTimer);controls.removeEventListener('lock',lockChange);controls.removeEventListener('unlock',lockChange);controls.unlock();if(dialog.open)dialog.close();root.removeFromParent();for(const t of ownedTextures)t.dispose();for(const m of ownedMaterials)m.dispose();for(const g of ownedGeometries)g.dispose();}};
 on(window,'pagehide',event=>{if(!event.persisted)game.dispose();});return game;
}
