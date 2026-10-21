const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {ensureHandwork,dragInventory}=require('./gesture-driver.cjs');
const {pathToFileURL}=require('node:url'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const wf=await import(pathToFileURL(path.resolve(__dirname,'../workflow.mjs')).href);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{for(const mobile of [false,true]){
  for(const id of ['frame_assembly','paper_dye','petal_cutting']){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});const errors=[];page.on('pageerror',e=>(errors.push(e.message),console.error(e.stack)));
   const w=new wf.Workflow();while(wf.currentStage(w.state).id!==id)assert.ok(w.skipStage().ok);
   await page.addInitScript(s=>localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(s)),w.state);await page.goto('http://127.0.0.1:4180/lotus-workshop.html');await page.evaluate(()=>{const r=__LOTUS_WORKSHOP__.renderer;r.setPixelRatio(.65);r.shadowMap.enabled=false;});await page.click('#resume');
   assert.equal(await page.locator('[data-tool]').count(),0);
   if(id==='petal_cutting'){assert.equal(await page.locator('[data-stock="dyedPaper"] b').textContent(),'8');assert.match(await page.locator('[data-stock="dyedPaper"]').getAttribute('aria-label'),/粉紫 6 份，绿色 2 份/);}
   const counts=await page.locator('[data-stock] b').allTextContents();assert.deepEqual(counts,Object.values(wf.backpackInventory(w.state)).map(String));
   await page.screenshot({path:path.join(__dirname,`backpack-${mobile?'mobile':'desktop'}-overview.png`)});
   await ensureHandwork(page,mobile);
   assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.selectedTool),wf.currentStage(w.state).tool);
   assert.equal(await page.locator('.backpack').count(),0);assert.equal(await page.locator('#craft-inventory').count(),1);assert.equal(await page.locator('.task-panel').isVisible(),true);assert.equal(await page.locator('#stage-hint').isVisible(),true);await page.click('#hint-toggle');assert.equal(await page.locator('#guide-content').isVisible(),false);assert.equal(await page.locator('#hint-toggle').isVisible(),true);await page.click('#hint-toggle');assert.equal(await page.locator('#stage-hint').isVisible(),true);
   const rect=await page.locator('#craft-inventory').boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=(mobile?390:1440));assert.ok(await page.locator('#craft-inventory').isVisible());
   if(id==='frame_assembly'){await dragInventory(page,0,mobile);assert.equal(await page.locator('[data-stock="largeRing"] b').textContent(),'0');}
   await page.screenshot({path:path.join(__dirname,`backpack-${mobile?'mobile':'desktop'}-${id}.png`)});
   console.log('PASS',mobile?'mobile':'desktop',id,'stock, automatic tool, visible backpack');
  assert.deepEqual(errors,[]);await page.close();
  }
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
