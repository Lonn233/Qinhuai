const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url'),path=require('node:path'),assert=require('node:assert/strict');
const {alignLining,screenDrag,screenDriver,dragPaper}=require('./gesture-driver.cjs');
(async()=>{
 const {Workflow,currentStage}=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const errors=[];
 try{for(const touch of (process.env.TEST_INPUT?[process.env.TEST_INPUT==='touch']:[false,true]))for(const stage of ['petal_assembly','calyx_assembly','lotus_leaf_assembly']){
 const w=new Workflow();while(currentStage(w.state).id!==stage)assert.ok(w.skipStage().ok);
 const page=await browser.newPage({viewport:touch?{width:390,height:844}:{width:1440,height:900},hasTouch:touch,isMobile:touch});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(state=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>.5});localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(state));},w.state);
 await page.goto('http://127.0.0.1:4180/lotus-workshop.html',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__?.ready);await page.evaluate(()=>{
 const r=__LOTUS_WORKSHOP__.renderer;r.shadowMap.enabled=false;const render=r.render.bind(r);let n=0;r.render=(s,c)=>{s.updateMatrixWorld(true);c.updateMatrixWorld(true);if(++n%8===0)render(s,c);};
 });
 const tap=sel=>touch?page.tap(sel):page.click(sel),snap=()=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot()),count=()=>page.evaluate(id=>__LOTUS_WORKSHOP__.state.counts[id],stage);
 await tap('#resume');await tap('#go-station');await page.waitForTimeout(900);await tap('#craft-action');await page.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().moving);
 assert.equal((await snap()).tool,'paper');assert.deepEqual((await snap()).glued,[]);
 await alignLining(page,touch);
 let s=await snap();await screenDrag(page,s.heldTarget,{x:25,y:300},touch);assert.equal(await count(),0);
 await alignLining(page,touch);s=await snap();const d=await screenDriver(page,touch);
 try{
 await d.down(s.heldTarget);await d.move(s.target,20);assert.equal((await snap()).dragging,true);assert.equal(await count(),0);
 assert.equal(await page.locator('#decoration-drop-prompt').getAttribute('data-ready'),'true');
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await d.up();assert.equal(await count(),0);
 s=await snap();await d.down(s.heldTarget);await d.move(s.target,20);assert.deepEqual((await snap()).glued,[]);
 // A secondary button release must never commit the left-button drag.
 if(!touch){await page.mouse.down({button:'right'});await page.mouse.up({button:'right'});assert.equal(await count(),0);assert.equal((await snap()).dragging,true);}
 if(!touch&&stage==='petal_assembly')await page.screenshot({path:path.join(__dirname,'autopaste-ready.png')});
 await d.up();await page.waitForFunction(id=>__LOTUS_WORKSHOP__.state.counts[id]===1,stage);await page.waitForTimeout(250);assert.equal(await count(),1);
 assert.equal((await snap()).active,true);assert.equal((await snap()).tool,'paper');
 // Next material also attaches without manually choosing the brush.
 await alignLining(page,touch);await dragPaper(page,touch);await page.waitForFunction(id=>__LOTUS_WORKSHOP__.state.counts[id]===2,stage);await page.waitForTimeout(200);assert.equal(await count(),2);
 if(!touch&&stage==='petal_assembly')await page.screenshot({path:path.join(__dirname,'autopaste-attached.png')});
 }finally{await d.dispose();}
 console.log('PASS auto paste, release exactly once, cancel, continuous placement:',stage,touch?'touch':'desktop');await page.close();
 }assert.deepEqual(errors,[]);}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
