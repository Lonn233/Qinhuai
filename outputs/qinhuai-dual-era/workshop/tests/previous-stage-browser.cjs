const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const {Workflow,currentStage}=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const w=new Workflow();while(currentStage(w.state).id!=='lining_upper')assert.ok(w.skipStage().ok);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[];
 try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(state=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>.5});if(!localStorage.getItem('previous-test-seeded')){localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(state));localStorage.setItem('previous-test-seeded','1');}},w.state);
 const ready=async()=>{await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__?.ready);await page.evaluate(()=>{const r=__LOTUS_WORKSHOP__.renderer;r.shadowMap.enabled=false;const render=r.render.bind(r);let n=0;r.render=(s,c)=>{s.updateMatrixWorld(true);c.updateMatrixWorld(true);if(++n%8===0)render(s,c);};});};
 await page.goto('http://127.0.0.1:4180/lotus-workshop.html',{waitUntil:'domcontentloaded'});await ready();
 await page.click('#resume');await page.click('#go-station');await page.waitForTimeout(900);await page.click('#craft-action');await page.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().moving);
 await page.click('#handwork-previous-stage');await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().stage==='frame_assembly'&&!__LOTUS_WORKSHOP__.handwork.snapshot().moving);
 assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.frame_binding),0);
 assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.active),true);
 console.log('PASS active workbench returns to assembly and restores components');
 await page.click('#handwork-skip-stage');await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().stage==='lining_upper'&&!__LOTUS_WORKSHOP__.handwork.snapshot().moving);
 console.log('PASS skip forward again after returning');
 await page.click('#handwork-close');await page.reload({waitUntil:'domcontentloaded'});await ready();await page.click('#resume');
 assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.workflow.history.length),0);
 await page.click('#previous-stage');assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.frame_assembly),0);
 await page.click('#previous-stage');assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.stage),0);
 assert.ok(await page.locator('#previous-stage').isDisabled());
 console.log('PASS previous stage after reload and first-stage disabled boundary');
 await page.setViewportSize({width:390,height:844});await page.click('#go-station');await page.waitForTimeout(900);await page.click('#craft-action');await page.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().moving);
 assert.ok(await page.locator('#handwork-previous-stage').isDisabled());
 const box=await page.locator('#handwork-previous-stage').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=390);
 console.log('PASS narrow-screen workbench button visible');
 assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
