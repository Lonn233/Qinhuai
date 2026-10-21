const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {ensureHandwork,screenDriver,screenDrag}=require('./gesture-driver.cjs');
const assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const {Workflow,currentStage}=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[];
 try{for(const mobile of [false,true]){
 const stage=mobile?'leaf_pressing':'petal_pressing',w=new Workflow();while(currentStage(w.state).id!==stage)assert.ok(w.skipStage(Date.now()).ok);
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile});page.on('pageerror',e=>(errors.push(e.message),console.error(e.stack)));
 page.setDefaultTimeout(60000);await page.addInitScript(()=>Object.defineProperty(window,'devicePixelRatio',{get:()=>.65}));await page.addInitScript(s=>localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(s)),w.state);await page.goto('http://127.0.0.1:4180/lotus-workshop.html',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__?.ready);await page.evaluate(()=>{const r=__LOTUS_WORKSHOP__.renderer;r.setPixelRatio(.65);r.shadowMap.enabled=false;});await page.click('#resume');await ensureHandwork(page,mobile);
 const snap=()=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot()),wait=phase=>page.waitForFunction(p=>__LOTUS_WORKSHOP__.handwork.snapshot().phase===p,phase);
 const count=()=>page.evaluate(s=>__LOTUS_WORKSHOP__.state.counts[s],stage),initial=await count();
 assert.equal((await snap()).mode,'roller-press');await page.selectOption('#press-mode','manual');assert.equal((await snap()).phase,'idle');
 await page.screenshot({path:path.join(__dirname,'manual-'+(mobile?'mobile':'desktop')+'-idle.png')});
 let s=await snap(page);await screenDrag(page,s.paper,s.manualTarget,mobile);await wait('loaded');assert.equal((await snap()).winding,0);await page.waitForTimeout(250);assert.equal((await snap()).phase,'loaded');await page.click('#handwork-confirm');await wait('fitting');assert.equal((await snap()).winding,0);await wait('winding');assert.equal((await snap()).adherence,1);assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.scene.getObjectByName('manual-cotton-winding').geometry.drawRange.count),0);assert.match(await page.locator('#stage-hint').innerText(),/缠线/);await page.screenshot({path:path.join(__dirname,'manual-'+(mobile?'mobile':'desktop')+'-fitted.png')});
 const driver=await screenDriver(page,mobile);const box=await page.locator('#handwork-confirm').boundingBox(),button={x:box.x+box.width/2,y:box.y+box.height/2};
 await driver.down(button);await page.waitForTimeout(600);await driver.up();s=await snap();assert.ok(s.winding>0&&s.winding<1);const winding=s.winding;await page.waitForTimeout(250);assert.equal((await snap()).winding,winding);
 await page.click('#craft-book-open');assert.match(await page.locator('#book-steps').innerText(),/手工/);await page.waitForTimeout(300);assert.equal((await snap()).winding,winding);await page.keyboard.press('Escape');
 await page.selectOption('#press-mode','machine');assert.equal((await snap()).phase,'idle');assert.equal(await count(),initial);
 // Existing machine process still runs and stops, and changing mode discards uncollected work.
 await page.click('#handwork-confirm');await wait('running');await wait('done');assert.equal(await count(),initial);
 await page.selectOption('#press-mode','manual');assert.equal((await snap()).winding,0);await page.click('#handwork-confirm');await wait('loaded');await page.click('#handwork-confirm');await wait('fitting');await wait('winding');
 const b=await page.locator('#handwork-confirm').boundingBox();await driver.down({x:b.x+b.width/2,y:b.y+b.height/2});await wait('wrapped');await driver.up();assert.equal((await snap()).phase,'wrapped','releasing wrap must not automatically stand');
 await page.click('#handwork-confirm');await wait('hammering');
 await page.screenshot({path:path.join(__dirname,'manual-'+(mobile?'mobile':'desktop')+'-upright.png')});
 for(let i=0;i<8;i++){await page.click('#handwork-confirm');await page.waitForFunction(n=>{const s=__LOTUS_WORKSHOP__.handwork.snapshot();return s.hits===n&&s.strike===0;},i+1);}
 assert.equal((await snap()).phase,'compressed');assert.equal(await count(),initial);
 await page.click('#handwork-confirm');await wait('restored');assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.scene.getObjectByName('manual-mold').scale.y),1);await page.click('#handwork-confirm');await wait('unthreaded');assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.scene.getObjectByName('manual-cotton-winding').geometry.drawRange.count),0);await page.click('#handwork-confirm');await wait('done');
 assert.equal((await snap()).shape,'square');await page.screenshot({path:path.join(__dirname,'manual-'+(mobile?'mobile':'desktop')+'-done.png')});
 await page.click('#handwork-confirm');assert.equal(await count(),initial+1);assert.equal((await snap()).phase,'idle');
 // Machine extraction commits exactly one batch; manual props disappear on switching.
 await page.selectOption('#press-mode','machine');assert.equal(await page.evaluate(()=>!!__LOTUS_WORKSHOP__.scene.getObjectByName('manual-press-tool')),false);
 await page.click('#handwork-confirm');await wait('done');await page.click('#handwork-confirm');assert.equal(await count(),initial+2);
 if(!mobile){
 await page.selectOption('#press-mode','manual');await page.click('#handwork-confirm');await wait('loaded');await page.click('#handwork-confirm');await wait('fitting');await wait('winding');
 await page.locator('#handwork-confirm').focus();await page.keyboard.down('Space');await page.waitForTimeout(300);await page.keyboard.up('Space');assert.ok((await snap()).winding>0);
 await page.click('#handwork-close');await ensureHandwork(page,mobile);assert.equal((await snap()).phase,'idle');assert.equal((await snap()).winding,0);assert.equal(await count(),initial+2);
 }
 await driver.dispose();await page.close();console.log(mobile?'mobile manual / machine PASS':'desktop manual / machine PASS');
 }assert.deepEqual(errors,[]);}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
