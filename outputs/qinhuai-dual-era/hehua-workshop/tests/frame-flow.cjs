const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
 const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox'] });
 try {
 const page = await browser.newPage({ viewport: {width:1280,height:800} });
 const errors = []; page.on('pageerror', e=>errors.push(e.message));
 await page.goto(process.env.WORKSHOP_URL || 'http://127.0.0.1:4173/', {waitUntil:'commit',timeout:180000});
 await page.waitForFunction(()=>window.__HEHUA_READY__, {}, {timeout:180000});
 await page.evaluate(()=>{__HEHUA__.start();__HEHUA__.openAssembly(true);__HEHUA__.renderer.setPixelRatio(.5)});
 await page.evaluate(()=>{
  window.chimeModes=[];
  const chime=__HEHUA__.audio.chime;
  __HEHUA__.audio.chime=()=>{window.chimeModes.push(__HEHUA__.state().mode);chime()};
 });
 const state=()=>page.evaluate(()=>__HEHUA__.state());
 const idle=async()=>{await page.evaluate(()=>__HEHUA__.stage.update(2,0));await page.waitForFunction(()=>!__HEHUA__.state().busy,{}, {timeout:10000})};
 let animatedBindings=0;
 const drag=async()=>{const s=await state();assert(s.draggable, s.mode);await page.mouse.move(1100,680);await page.mouse.down();assert(await page.evaluate(k=>__HEHUA__.drag(k,1100,680),s.draggable));await page.mouse.move(s.dot.x,s.dot.y,{steps:3});await page.mouse.up();
  if(s.draggable==='twist'){
   const frames=await page.evaluate(()=>{
    const api=__HEHUA__, initial=api.state();
    if(!initial.busy||!initial.binding)throw Error('Missing binding animation');
    if(api.drag('twist',1100,680))throw Error('Duplicate binding accepted');
    const samples=[];
    for(const target of [.4,.8,.94]){
     const current=api.state().binding.progress;
     if(current<target)api.stage.update((target-current)*2.6,0);
     const wrap=[];api.scene.traverse(o=>{if(o.name==='CottonBinding'&&o.userData.phase!=='complete')wrap.push(o)});
     const w=wrap[0];samples.push({phase:api.state().binding.phase,count:w.userData.binding.cord.geometry.drawRange.count,scale:w.userData.binding.cord.scale.x,knot:w.userData.binding.knot.visible});
    }
    return {samples,inventory:api.state().inventory.twist};
   });
   assert.deepEqual(frames.samples.map(f=>f.phase),['winding','tightening','tying']);
   assert(frames.samples[0].count<frames.samples[1].count);assert(frames.samples[0].scale>frames.samples[2].scale);assert(frames.samples[2].knot);
   assert.equal(frames.inventory,s.inventory.twist-1);animatedBindings++;
  }
  await idle();};
 const bend=async()=>{const s=await state();await page.mouse.move(s.work.x,s.work.y);await page.mouse.down();await page.evaluate(()=>{const s=__HEHUA__.state();const target=s.mode==='bendArc'?.665:1;const speed=s.mode==='bendArc'?.35:s.mode==='bendSmall'?.42:.30;__HEHUA__.stage.update(Math.max(0,(target-s.curve)/speed),0)});await page.mouse.up();await idle();};
 const place=async()=>{const s=await state();await page.mouse.move(s.hoop.x,s.hoop.y);await page.mouse.down();await page.mouse.move(s.dot.x,s.dot.y,{steps:4});await page.mouse.up();await idle();};
 const dragSlot=async(key)=>{
  const s=await state();assert.equal(s.draggable,key);
  const slot=page.locator(`.inv-slot[data-key="${key}"]`);
  await slot.scrollIntoViewIfNeeded();const box=await slot.boundingBox();assert(box);
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
  assert.equal((await state()).drag,key,'Inventory pointer must start a drag');
  await page.mouse.move(s.dot.x,s.dot.y,{steps:5});await page.mouse.up();await idle();
 };
 // A failed drop cannot consume bamboo or advance the recipe.
 await page.evaluate(()=>{__HEHUA__.drag('longBamboo',1100,680);window.dispatchEvent(new PointerEvent('pointerup',{clientX:5,clientY:5}))});
 assert.equal((await state()).inventory.longBamboo,1);assert.equal((await state()).mode,'toBendBig');
 await drag();await bend();assert.equal((await state()).mode,'bindBig');await drag();
 assert.equal((await state()).mode,'collectBig');assert.equal((await state()).inventory.bigHoop,0);
 assert.equal(await page.evaluate(()=>__HEHUA__.drag('arcBamboo',1100,680)),false);
 await page.evaluate(()=>{__HEHUA__.assemblyStage.close();__HEHUA__.assemblyStage.open()});
 assert.equal((await state()).mode,'collectBig');assert((await state()).hoop);
 await page.keyboard.press('KeyE');
 assert.equal((await state()).mode,'toBendSmall');assert.equal((await state()).inventory.bigHoop,1);
 assert.equal(await page.evaluate(()=>__HEHUA__.assemblyStage.pick()),false);
 assert.equal((await state()).frameChildren,0);
 await drag();await bend();assert.equal((await state()).mode,'bindSmall');await drag();
 assert.equal((await state()).mode,'collectSmall');assert.equal((await state()).inventory.smallHoop,0);
 // Collect the small hoop by clicking its actual rim, not its empty center.
 const rim=await page.evaluate(async()=>{
  const {FRAME}=await import('../js/frame-profile.js');const {scene,camera}=__HEHUA__;
  const root=scene.getObjectByName('AssemblyCraftRoot');
  const frame=root.children.find(o=>o.children.some(c=>c.userData.wrap));
  const hoop=frame.children.find(o=>o.userData.wrap);root.updateWorldMatrix(true,true);camera.updateMatrixWorld();
  const p=hoop.localToWorld(hoop.position.clone().set(FRAME.smallRadius,0,0)).project(camera);
  return {x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};
 });
 await page.mouse.click(rim.x,rim.y);
 assert.equal((await state()).mode,'placeBig');assert.equal((await state()).inventory.bigHoop,1);assert.equal((await state()).inventory.smallHoop,1);
 assert.equal((await state()).frameChildren,0);
 assert.equal(await page.evaluate(()=>__HEHUA__.assemblyStage.pick()),false);
 await page.evaluate(()=>{__HEHUA__.assemblyStage.close();__HEHUA__.assemblyStage.open()});
 assert.equal((await state()).inventory.bigHoop,1);assert.equal((await state()).inventory.smallHoop,1);
 await page.screenshot({path:path.resolve(__dirname,'../preview/72-hoops-collected.png')});
 // Canceled/invalid drops must retain the crafted hoop.
 await page.evaluate(()=>{__HEHUA__.drag('bigHoop',1100,680);window.dispatchEvent(new PointerEvent('pointercancel'))});
 assert.equal((await state()).inventory.bigHoop,1);assert.equal((await state()).mode,'placeBig');
 await page.evaluate(()=>{__HEHUA__.drag('bigHoop',1100,680);window.dispatchEvent(new PointerEvent('pointerup',{clientX:5,clientY:5}))});
 assert.equal((await state()).inventory.bigHoop,1);assert.equal((await state()).frameChildren,0);
 await dragSlot('bigHoop');assert.equal((await state()).mode,'toBendArc');assert.equal((await state()).inventory.bigHoop,0);
 assert.equal((await state()).inventory.smallHoop,1);
 for(let i=0;i<3;i++){
  assert.equal((await state()).arcsPlaced,i);await drag();await bend();assert.equal((await state()).mode,'placeArc');if(i===0)await page.screenshot({path:path.resolve(__dirname,'../preview/68-u-bent.png')});await place();if(i===0)await page.screenshot({path:path.resolve(__dirname,'../preview/69-u-installed.png')});
  assert.equal((await state()).mode,'bindArc');await drag();assert.equal((await state()).arcEnd,1);assert.equal((await state()).arcsPlaced,i);
  // Leaving/re-entering retains the active joint and material counts.
  await page.evaluate(()=>{__HEHUA__.assemblyStage.close();__HEHUA__.assemblyStage.open()});assert.equal((await state()).arcEnd,1);
  await drag();assert.equal((await state()).arcsPlaced,i+1);
 }
 assert.equal((await state()).mode,'placeSmall');assert.equal((await state()).inventory.smallHoop,1);
 await dragSlot('smallHoop');assert.equal((await state()).mode,'bindTop');assert.equal((await state()).inventory.smallHoop,0);
 for(let i=0;i<3;i++){assert.equal((await state()).smallTies,i);await drag();}
 assert.equal((await state()).mode,'assembleWire');assert.equal((await state()).inventory.frame,0);
 await page.waitForFunction(()=>!__HEHUA__.cameraMoving);
 await drag();
 assert.equal(animatedBindings,11);
 const done=await state();assert.equal(done.done,true);assert.equal(done.bindChildren,9);assert.equal(done.inventory.twist,0);assert.equal(done.inventory.wire,0);assert.equal(done.inventory.frame,1);
 assert.deepEqual(await page.evaluate(()=>window.chimeModes),['placeBig','assembleWire','done']);
 await page.evaluate(()=>{__HEHUA__.assemblyStage.close();__HEHUA__.assemblyStage.open()});
 assert.equal(await page.evaluate(()=>window.chimeModes.length),3,'Reopening must not repeat a completion chime');
 const measurements=await page.evaluate(async()=>{
  const p=await import('../js/frame-profile.js');const lengths=[0,1,2].map(i=>{const points=p.frameArcPoints(i);return points.reduce((sum,v,j)=>sum+(j?v.distanceTo(points[j-1]):0),0)});
  const {petalGeometry}=await import('../js/geometry.js');const petal=petalGeometry();const positions=petal.attributes.position;const tipsClosed=[0,20].every(row=>{const first=new (positions.constructor)(positions.array,3);const base=row*19;for(let j=1;j<19;j++){if(Math.hypot(first.getX(base+j)-first.getX(base),first.getY(base+j)-first.getY(base),first.getZ(base+j)-first.getZ(base))>1e-7)return false;}return true;});petal.dispose();
  const root=__HEHUA__.scene.getObjectByName('AssemblyCraftRoot');root.updateWorldMatrix(true,true);
  const worldScale=root.getWorldScale(root.position.clone());
  const base=root.localToWorld(root.position.clone().set(0,p.FRAME.bottomY,0));
  return {worldScale:worldScale.toArray(),baseHeight:base.y,tipsClosed,lengths,height:p.FRAME.height,width:p.FRAME.bigRadius*2,upperRatio:(p.FRAME.bigY-p.FRAME.bottomY)/p.FRAME.height,uShape:[0,1,2].every(i=>{
    const points=p.frameArcPoints(i), normal=p.frameWidthAxis(i), mid=p.FRAME.segments/2;
    const planar=points.every(v=>Math.abs(v.dot(normal))<1e-9);
    const open=points[0].distanceTo(points.at(-1))>p.FRAME.bigRadius*1.8;
    const rises=points.every((v,j)=>j===0 || (j<=mid?v.y<=points[j-1].y+1e-9:v.y>=points[j-1].y-1e-9));
    const tips=points[0].distanceTo(p.topJoint(i))<1e-9 && Math.abs(points.at(-1).y-p.FRAME.smallY)<1e-9;
    const bottom=Math.abs(points[mid].y-p.FRAME.bottomY)<1e-9 && Math.hypot(points[mid].x,points[mid].z)<1e-9;
    const vertical=points[0].clone().sub(points[1]).normalize().y>.98 && points.at(-1).clone().sub(points.at(-2)).normalize().y>.98;
    return planar&&open&&rises&&tips&&bottom&&vertical;
  })};
 });
 assert.deepEqual(measurements.worldScale,[3,3,3]);assert(Math.abs(measurements.baseHeight-1.044)<1e-9);
 measurements.lengths.forEach(l=>assert(Math.abs(l-.4)<.002));assert(measurements.height<measurements.width);assert(measurements.upperRatio>.65);assert(measurements.uShape);assert(measurements.tipsClosed);
 const structure=await page.evaluate(async()=>{
  const {FRAME}=await import('../js/frame-profile.js');
  const {buildFrameModel,buildLotusLantern}=await import('../js/models.js');
  const {createMaterials}=await import('../js/materials.js');
  const root=__HEHUA__.scene.getObjectByName('AssemblyCraftRoot');
  const suspension=root.getObjectByName('ThreePointSuspension');
  const data=suspension.userData.suspension, vec=a=>root.position.clone().fromArray(a);
  const anchors=data.anchors.map(vec),apex=vec(data.apex),transitions=data.transitions.map(vec);
  const sides=anchors.map((p,i)=>p.distanceTo(anchors[(i+1)%3]));
  const correctAnchors=anchors.every(p=>Math.abs(p.y+FRAME.wireY-FRAME.bigY)<1e-9&&Math.abs(Math.hypot(p.x,p.z)-FRAME.bigRadius)<1e-9);
  const continuous=anchors.every((p,i)=>{
   const gold=suspension.getObjectByName(`GoldSuspensionFoot${i}`),red=suspension.getObjectByName(`RedSuspensionCord${i}`);
   const g=gold.geometry.parameters.path,r=red.geometry.parameters.path;
   return g.getPoint(0).distanceTo(p)<1e-9&&g.getPoint(1).distanceTo(transitions[i])<1e-9&&r.getPoint(0).distanceTo(transitions[i])<1e-9&&r.getPoint(1).distanceTo(apex)<1e-9&&gold.material.metalness>.8&&red.material.color.getHexString()==='c52c30';
  });
  const wraps=[];root.traverse(o=>{if(o.userData.crossing)wraps.push(o)});
  const crossBindings=wraps.length===9&&wraps.every(w=>{
   const pointAt=w.userData.binding.pointAt, points=Array.from({length:1001},(_,i)=>pointAt(i/1000));
   const diagonal=[points.slice(0,461),points.slice(540)].map(ps=>ps.reduce((sum,p)=>sum+p.x*p.y,0));
   const maxJump=Math.max(...points.slice(1).map((p,i)=>p.distanceTo(points[i])));
   return diagonal[0]>0&&diagonal[1]<0&&Math.max(...points.map(p=>p.z))>.004&&Math.min(...points.map(p=>p.z))<-.004&&maxJump<.001;
  });
  const M=createMaterials(),frame=buildFrameModel(M),lantern=buildLotusLantern(M);
  const shared=[frame,lantern].every(m=>JSON.stringify(m.getObjectByName('ThreePointSuspension').userData.suspension)===JSON.stringify(data));
  for(const m of [frame,lantern])m.traverse(o=>o.geometry?.dispose());
  return {correctAnchors,equilateral:Math.max(...sides)-Math.min(...sides)<1e-9,continuous,crossBindings,shared,parts:suspension.children.length};
 });
 assert(structure.correctAnchors);assert(structure.equilateral);assert(structure.continuous);assert(structure.crossBindings);assert(structure.shared);assert.equal(structure.parts,11);
 await page.waitForFunction(()=>document.getElementById('complete-dialog').open);
 await page.evaluate(()=>document.getElementById('complete-dialog').close());
 await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await page.screenshot({path:path.resolve(__dirname,'../preview/70-u-verified-frame.png')});
 const checkCanvas=()=>page.evaluate(()=>{
  const {renderer,scene,camera}=__HEHUA__;renderer.render(scene,camera);
  const gl=renderer.getContext(), pixels=new Uint8Array(32*32*4);
  gl.readPixels(Math.floor(gl.drawingBufferWidth/2)-16,Math.floor(gl.drawingBufferHeight/2)-16,32,32,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  const colors=new Set();for(let i=0;i<pixels.length;i+=4)colors.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]}`);
  return colors.size;
 });
 assert(await checkCanvas()>20,'Desktop canvas is blank');
 const desktopFov=await page.evaluate(()=>__HEHUA__.camera.fov);
 assert.equal(desktopFov,46);
 await page.setViewportSize({width:390,height:844});
 await page.waitForFunction(()=>__HEHUA__.renderer.domElement.clientWidth===390);
 await page.evaluate(()=>document.getElementById('complete-dialog').close());
 assert(await checkCanvas()>20,'Mobile canvas is blank');
 const checkFrameFits=()=>page.evaluate(async()=>{
  const {FRAME,frameArcPoints}=await import('../js/frame-profile.js');
  const {scene,camera}=__HEHUA__,root=scene.getObjectByName('AssemblyCraftRoot');
  root.updateWorldMatrix(true,true);camera.updateMatrixWorld();
  const points=[0,1,2].flatMap(i=>frameArcPoints(i));
  for(let i=0;i<64;i++){
   const angle=i*Math.PI/32;
   points.push(root.position.clone().set(Math.cos(angle)*FRAME.bigRadius,FRAME.bigY,Math.sin(angle)*FRAME.bigRadius));
   points.push(root.position.clone().set(Math.cos(angle)*FRAME.smallRadius,FRAME.smallY,Math.sin(angle)*FRAME.smallRadius));
  }
  const suspension=root.getObjectByName('ThreePointSuspension');
  if(suspension){
   const apex=suspension.position.clone().fromArray(suspension.userData.suspension.apex).add(suspension.position);
   points.push(apex,apex.clone().add(root.position.clone().set(0,.014,0)));
  }
  return points.every(p=>{p=root.localToWorld(p).project(camera);return Math.abs(p.x)<.94&&Math.abs(p.y)<.94&&p.z>-1&&p.z<1;});
 });
 assert(await checkFrameFits(),'Enlarged frame is clipped on mobile');
 await page.screenshot({path:path.resolve(__dirname,'../preview/71-frame-mobile.png')});
 await page.setViewportSize({width:1280,height:800});
 await page.waitForFunction(()=>__HEHUA__.camera.aspect===1.6);
 assert.equal(await page.evaluate(()=>__HEHUA__.camera.fov),desktopFov);
 assert(await checkFrameFits(),'Frame or suspension is clipped on desktop');
 await page.evaluate(()=>__HEHUA__.leave());
 await page.waitForFunction(()=>!__HEHUA__.transition);
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>__HEHUA__.openAssembly(false));
 await page.setViewportSize({width:420,height:844});
 await page.waitForFunction(()=>!__HEHUA__.transition);
 assert(await checkFrameFits(),'Enlarged frame is clipped after entering on mobile');
 await page.evaluate(()=>__HEHUA__.reset());const reset=await page.evaluate(()=>__HEHUA__.assemblyStage.snapshot());assert.equal(reset.frameChildren,0);assert.equal(reset.bindChildren,0);assert.equal(reset.arcEnd,0);assert.equal(reset.smallTies,0);assert.equal(reset.inventory.twist,11);assert.equal(reset.inventory.bigHoop,0);assert.equal(reset.inventory.smallHoop,0);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({result:'PASS',animatedBindings,done,measurements,structure,reset:reset.mode},null,2));
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
