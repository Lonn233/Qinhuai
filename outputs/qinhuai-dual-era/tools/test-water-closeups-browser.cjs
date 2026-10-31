const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const {createServer}=require('../game/serve.cjs');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-closeups-')),server=createServer({dataDir});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=d3d11']});
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.setDefaultTimeout(90000);
  page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE',e.message);});
  await page.addInitScript(()=>Object.defineProperty(window,'devicePixelRatio',{get:()=>.5}));
  await page.goto('http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?performance=low',{waitUntil:'domcontentloaded'});
  await page.locator('#menuShell [data-action="play"]').click();await page.locator('#menuShell [data-slot="slot-1"]').click();
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.story?.mode==='play');console.log('Scene ready');
  await page.evaluate(()=>{const s=__QINHUAI_IMPORT__.story.state;s.advance('INTRO_DONE');for(const id of ['lion','gongming','tengma','mountain'])s.advance('OBSERVATION_DONE',id);});
  const pose=()=>page.evaluate(()=>{const a=__QINHUAI_IMPORT__;return {position:a.camera.position.toArray(),rotation:a.camera.quaternion.toArray(),fov:a.camera.fov,mode:a.player.mode,player:a.player.position.toArray(),yaw:a.player.yaw,pitch:a.player.pitch,sensitivity:a.story.lookSensitivity};});
  for(const id of ['chrysanthemum','lotus-main','lotus-one']){
   await page.evaluate(async id=>{const a=__QINHUAI_IMPORT__,t=a.story.world.targets().find(t=>t.id===id&&t.dock),p=a.story.world.observationPoint(t);if(!p)throw Error('No observation point '+id);await a.setControlMode(id==='lotus-main'?'thirdPerson':'firstPerson');a.player.spawn({x:p.x,z:p.z,ground:p.y});a.player.yaw=Math.atan2(p.x-t.position.x,p.z-t.position.z);a.player.updateCamera(0,true);if(a.player.mode==='firstPerson')a.camera.lookAt(t.position);},id);
   await page.waitForFunction(id=>__QINHUAI_IMPORT__.story.snapshot.current?.id===id,id);const before=await pose();
   await page.keyboard.press('KeyE');await page.waitForFunction(id=>__QINHUAI_IMPORT__.story.snapshot.observing===id,id);
   const closeup=await pose();assert.equal(closeup.mode,'firstPerson');assert.ok(closeup.fov<before.fov*.4);assert.deepEqual(closeup.player,before.player);assert.ok(Math.abs(closeup.position[1]-closeup.player[1]-.53)<1e-8);assert.ok(closeup.sensitivity>0&&closeup.sensitivity<1);
   assert.equal(await page.evaluate(()=>__QINHUAI_IMPORT__.player.root.visible),false);await page.waitForFunction(()=>document.pointerLockElement===__QINHUAI_IMPORT__.renderer.domElement);
   assert.equal(await page.locator('#storyDialogueNext').isVisible(),false);assert.match(await page.locator('#storyObservationHint').innerText(),/按E退出赏灯/);
   await page.keyboard.down('KeyW');await page.waitForTimeout(180);await page.keyboard.up('KeyW');assert.deepEqual((await pose()).player,before.player);
   for(const [width,height] of [[1280,800],[390,844]]){
    await page.setViewportSize({width,height});await page.waitForTimeout(250);
    const framed=await page.evaluate(id=>{const a=__QINHUAI_IMPORT__,t=a.story.world.targets().find(t=>t.id===id&&t.dock),points=[];for(const x of [t.bounds.min.x,t.bounds.max.x])for(const y of [t.bounds.min.y,t.bounds.max.y])for(const z of [t.bounds.min.z,t.bounds.max.z]){const p=t.position.clone().set(x,y,z).project(a.camera);points.push(p.toArray());}return {points,overflow:document.documentElement.scrollWidth>innerWidth};},id);
    assert.equal(framed.overflow,false);assert.ok(framed.points.every(p=>Math.abs(p[0])<.9&&Math.abs(p[1])<.9&&Math.abs(p[2])<1),'lamp must fit closeup at '+width);
    await page.screenshot({path:path.join(__dirname,'../work/water-closeup-'+id+'-'+width+'.png')});
   }
   await page.setViewportSize({width:1280,height:800});const lookBefore=(await pose()).rotation;await page.mouse.move(650,390);await page.mouse.move(700,410,{steps:3});assert.notDeepEqual((await pose()).rotation,lookBefore);assert.deepEqual((await pose()).player,before.player);
   await page.keyboard.press('KeyE');await page.waitForFunction(()=>!__QINHUAI_IMPORT__.story.observing);
   const restored=await pose();assert.deepEqual(restored,before,'E exit restores camera and control mode');
   assert.ok(await page.evaluate(id=>__QINHUAI_IMPORT__.story.snapshot.observed.includes(id),id));console.log('PASS',id,{mode:before.mode,fov:closeup.fov,lookScale:closeup.sensitivity});
  }
  assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>__QINHUAI_IMPORT__.story.snapshot.observed.length),7);console.log('PASS all water closeups, portrait framing, free look, movement lock and restored FP/TP camera');
 }finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));await fs.rm(dataDir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
