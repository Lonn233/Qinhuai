const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url'),path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const {alignLining,screenDrag,dragPaper,screenDriver}=require('./gesture-driver.cjs');
const url=process.env.WORKSHOP_URL||'http://127.0.0.1:4180/lotus-workshop.html';
(async()=>{
 const {Workflow,currentStage}=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const errors=[],runs=[];
 try{
 for(const mobile of [false,true])for(const stage of ['lining_upper','lining_lower']){
  const w=new Workflow();while(currentStage(w.state).id!==stage)assert.ok(w.skipStage(Date.now()).ok);
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile});
  page.on('pageerror',e=>errors.push(e.message));
  const snap=()=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());
  const click=async p=>mobile?page.touchscreen.tap(p.x,p.y):page.mouse.click(p.x,p.y);
  const tap=async sel=>mobile?page.tap(sel):page.click(sel);
  const count=()=>page.evaluate(id=>__LOTUS_WORKSHOP__.state.counts[id],stage);
  await page.goto(url);await page.evaluate(s=>localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(s)),w.state);await page.reload();await tap('#resume');
  await tap('#go-station');await page.waitForTimeout(750);
  const beforeY=await page.evaluate(()=>__LOTUS_WORKSHOP__.camera.position.y);
  await tap('#craft-action');assert.equal((await snap()).moving,true);
  await page.waitForTimeout(350);
  const duringY=await page.evaluate(()=>__LOTUS_WORKSHOP__.camera.position.y);
  assert.ok(duringY<beforeY&&duringY>1.5,'seated camera lowers gradually, never teleports');
  await page.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().moving);
  assert.ok(Math.abs(await page.evaluate(()=>__LOTUS_WORKSHOP__.camera.position.y)-1.58)<.001);
  await page.screenshot({path:path.join(__dirname,`lining-seated-${stage}-${mobile?'mobile':'desktop'}.png`)});
  // A click or paper drop at the wrong orientation does not start work.
  assert.equal((await snap()).orientation.aligned,false);
  await click((await snap()).target);assert.equal((await snap()).animation,null);assert.deepEqual((await snap()).glued,[]);
  assert.match(await page.textContent('#handwork-status'),/方位未对准/);
  await dragPaper(page,mobile);assert.equal((await snap()).pending,false);assert.match(await page.textContent('#handwork-status'),/方位未对准/);
  await alignLining(page,mobile);assert.deepEqual((await snap()).glued,[],'rotation release must not glue');
  await dragPaper(page,mobile);assert.equal((await snap()).pending,false);assert.match(await page.textContent('#handwork-status'),/需要先涂抹浆糊/);
  // Changing selected panel highlights it without automatically turning the lamp.
  const rotation=(await snap()).rotation;await tap('#lining-panel-3');await page.waitForTimeout(100);
  assert.equal((await snap()).rotation,rotation);assert.equal((await snap()).orientation.aligned,false);
  await click((await snap()).rotationTarget);assert.equal((await snap()).animation,null);
  await tap('#lining-panel-0');await alignLining(page,mobile);
  await tap('#lining-brush');await click((await snap()).target);
  await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().glued.includes(0));
  await dragPaper(page,mobile);assert.equal((await snap()).pending,true);
  let s=await snap();await screenDrag(page,s.rotationTarget,{x:s.rotationTarget.x+80,y:s.rotationTarget.y},mobile);
  assert.equal((await snap()).pending,false);assert.equal(await count(),0);assert.equal(await page.isDisabled('#handwork-confirm'),true);
  // Glue stays attached, while interrupted rotation cannot leave a stuck pointer.
  assert.deepEqual((await snap()).glueMarks,[0]);
  const d=await screenDriver(page,mobile);try{s=await snap();await d.down(s.rotationTarget);await d.move({x:s.rotationTarget.x+25,y:s.rotationTarget.y});await page.evaluate(()=>dispatchEvent(new Event('blur')));assert.equal((await snap()).turning,false);await d.up();}finally{await d.dispose();}
  // Six faces can all be processed with real rotation, click and paper-drop gestures.
  for(let panel=0;panel<6;panel++){
   await tap('#lining-panel-'+panel);await alignLining(page,mobile);
   assert.equal((await snap()).orientation.aligned,true);
   if(!(await snap()).glued.includes(panel)){await tap('#lining-brush');await click((await snap()).target);await page.waitForFunction(i=>__LOTUS_WORKSHOP__.handwork.snapshot().glued.includes(i),panel);}
   await dragPaper(page,mobile);assert.equal((await snap()).pending,true);
   await tap('#handwork-confirm');await page.waitForFunction(({id,n})=>__LOTUS_WORKSHOP__.state.counts[id]===n,{id:stage,n:panel+1});
   if(panel<5){assert.equal((await snap()).active,true);assert.equal((await snap()).moving,false,'do not repeat sitting after each paper');}
  }
  assert.equal(await count(),6);runs.push({mobile,stage,seatedCamera:true,faces:6});await page.close();
 }
 assert.deepEqual(errors,[]);const result={passed:true,runs,errors};fs.writeFileSync(path.join(__dirname,'lining-flat-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
