const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {ensureHandwork,screenDriver}=require('./gesture-driver.cjs');
const assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const {Workflow,currentStage,validateState}=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const errors=[];
 async function load(stage,mobile){
  const w=new Workflow();while(currentStage(w.state).id!==stage)assert.ok(w.skipStage().ok);
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile});page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(s=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>.5});localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(s));},w.state);
  await page.goto('http://127.0.0.1:4180/lotus-workshop.html',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__?.ready);await page.evaluate(()=>__LOTUS_WORKSHOP__.renderer.shadowMap.enabled=false);await page.click('#resume');await ensureHandwork(page,mobile);return page;
 }
 try{for(const mobile of [false,true]){
  let page=await load('bamboo_prep',mobile),d=await screenDriver(page,mobile);const snap=()=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());
  let s=await snap();await d.down(s.stock[0]);await d.up();assert.equal((await snap()).selected,false,'must choose ring type before picking strip');
  for(const ring of [2,0,1]){
   await page.click('#ring-type-'+ring);s=await snap();assert.equal(s.ringType,ring);await d.down(s.stock[0]);await d.up();assert.equal((await snap()).selected,true);
   const rect=await page.locator('#bend-in').boundingBox();await d.down({x:rect.x+rect.width/2,y:rect.y+rect.height/2});await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().curve>=.98);await d.up();
   s=await snap();if(s.curve>1.025){const r=await page.locator('#bend-out').boundingBox();await d.down({x:r.x+r.width/2,y:r.y+r.height/2});await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().curve<=1.01);await d.up();}
   assert.ok((await snap()).ready);await page.click('#handwork-confirm');await page.waitForFunction(i=>__LOTUS_WORKSHOP__.state.frameItems.madeRings.includes(i),ring);
   const state=await page.evaluate(()=>__LOTUS_WORKSHOP__.state);assert.ok(validateState(state));if(ring===2){assert.equal(await page.locator('[data-stock="waistRing"] b').innerText(),'1');assert.equal(await page.locator('[data-stock="largeRing"] b').innerText(),'0');await page.screenshot({path:path.join(__dirname,`craft-refine-${mobile?'mobile':'desktop'}-ring.png`)});}
  }
  assert.deepEqual((await page.evaluate(()=>__LOTUS_WORKSHOP__.state)).frameItems.madeRings,[2,0,1]);await d.dispose();await page.close();console.log(mobile?'mobile ring choice PASS':'desktop ring choice PASS');
  for(const stage of (mobile?['leaf_cutting']:['paper_cutting','petal_cutting'])){
   page=await load(stage,mobile);d=await screenDriver(page,mobile);s=await snap();await d.down(s.outline[0]);for(const p of s.outline.slice(1,8))await d.move(p);await d.up();const n=(await snap()).next;assert.ok(n>0);
   await d.down((await snap()).outline[n]);await d.move({x:20,y:100});await d.up();assert.equal((await snap()).failed,false);assert.ok((await snap()).next>=n);
   await page.screenshot({path:path.join(__dirname,`craft-refine-${stage}-${mobile?'mobile':'desktop'}-scissors.png`)});
   let clicks=0;while(!(s=await snap()).ready&&clicks++<100){await d.down(s.outline[s.next]);await d.up();}assert.ok((await snap()).ready,'click-to-continue completes outline');assert.equal((await snap()).failed,false);
   const before=await page.evaluate(id=>__LOTUS_WORKSHOP__.state.counts[id],stage);await page.click('#handwork-confirm');await page.waitForFunction(({stage,before})=>__LOTUS_WORKSHOP__.state.counts[stage]===before+1,{stage,before});assert.equal((await snap()).next,0);
   await d.dispose();await page.close();console.log(stage+' resumable clicks PASS');
  }
 }assert.deepEqual(errors,[]);}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
