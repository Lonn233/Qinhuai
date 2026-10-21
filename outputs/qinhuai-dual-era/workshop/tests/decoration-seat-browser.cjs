const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url'),path=require('node:path'),assert=require('node:assert/strict');
const {alignLining,screenDrag,dragPaper}=require('./gesture-driver.cjs');
(async()=>{
 const {Workflow,currentStage}=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[];
 try{
 for(const touch of (process.env.TEST_INPUT?[process.env.TEST_INPUT==='touch']:[false,true]))for(const stage of (process.env.TEST_STAGES?process.env.TEST_STAGES.split(','):['lining_upper','petal_assembly','calyx_assembly','lotus_leaf_assembly'])){
 const w=new Workflow();while(currentStage(w.state).id!==stage)assert.ok(w.skipStage(Date.now()).ok);
 const page=await browser.newPage({viewport:touch?{width:390,height:844}:{width:1440,height:900},hasTouch:touch,isMobile:touch});
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(state=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>.5});localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(state));},w.state);
 const snap=()=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());
 const click=async p=>touch?page.touchscreen.tap(p.x,p.y):page.mouse.click(p.x,p.y);
 const tap=async sel=>touch?page.tap(sel):page.click(sel);
 await page.goto('http://127.0.0.1:4180/lotus-workshop.html',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__?.ready);
 await page.evaluate(()=>{
 const {renderer}=__LOTUS_WORKSHOP__;renderer.shadowMap.enabled=false;
 const render=renderer.render.bind(renderer);let frames=0;
 renderer.render=(scene,camera)=>{scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);if(++frames%8===0)render(scene,camera);};
});
 await tap('#resume');await tap('#go-station');await page.waitForTimeout(900);await tap('#craft-action');
 assert.equal((await snap()).moving,true);
 await page.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().moving);
 assert.equal((await snap()).mode,stage==='lining_upper'?'lining':'decoration');
 assert.ok(Math.abs(await page.evaluate(()=>__LOTUS_WORKSHOP__.camera.position.y)-1.58)<.001);
 assert.equal(await page.locator('#handwork-rotate-left').isVisible(),false);
 // Rotate away deliberately. Drag must not apply glue or consume materials.
 await alignLining(page,touch);let s=await snap();await screenDrag(page,s.rotationTarget,{x:s.rotationTarget.x+90,y:s.rotationTarget.y},touch);
 s=await snap();assert.equal(s.orientation.aligned,false);assert.equal(s.animation,null);assert.deepEqual(s.glued,[]);
 await click(s.target);assert.equal((await snap()).animation,null);assert.deepEqual((await snap()).glued,[]);
 await dragPaper(page,touch);assert.equal((await snap()).pending,false);
 await alignLining(page,touch);if(stage==='lining_upper'){await dragPaper(page,touch);assert.equal((await snap()).pending,false);assert.match(await page.textContent('#handwork-status'),/先涂抹浆糊/);}
 for(let i=0;i<2;i++){
 await alignLining(page,touch);await tap('#lining-brush');s=await snap();await click(s.target);
 await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().glued.length>0&&!__LOTUS_WORKSHOP__.handwork.snapshot().animation);
 if(stage==='lining_upper'){
 await dragPaper(page,touch);assert.equal((await snap()).pending,true);
 }else{
 assert.equal(await page.locator('#handwork-confirm').isVisible(),false);
 // Check the actual visible material, not just the inventory control.
 await tap('#lining-paper');
 s=await snap();assert.ok(s.heldTarget);
 // Invalid release must neither attach nor spend this piece.
 await screenDrag(page,s.heldTarget,{x:30,y:300},touch);
 assert.equal(await page.evaluate(id=>__LOTUS_WORKSHOP__.state.counts[id],stage),i);
 s=await snap();await screenDrag(page,s.heldTarget,s.target,touch);
 assert.ok((await snap()).animation==='paper'||await page.evaluate(({stage,n})=>__LOTUS_WORKSHOP__.state.counts[stage]===n,{stage,n:i+1}),'drop must begin attachment: '+JSON.stringify(await snap())+' '+await page.textContent('#handwork-status'));
 }

 if(i===0)await page.screenshot({path:path.join(__dirname,`seated-${stage}-${touch?'touch':'desktop'}.png`)});
 if(stage==='lining_upper')await tap('#handwork-confirm');await page.waitForFunction(({stage,n})=>__LOTUS_WORKSHOP__.state.counts[stage]===n,{stage,n:i+1});
 await page.waitForTimeout(150);assert.equal(await page.evaluate(id=>__LOTUS_WORKSHOP__.state.counts[id],stage),i+1);
 if(i===0){assert.equal((await snap()).active,true);assert.equal((await snap()).moving,false);assert.equal((await snap()).stage,stage);}
 }
 console.log('PASS',stage,touch?'touch':'desktop');await page.close();
 }
 assert.deepEqual(errors,[]);console.log('All seated attachment interaction checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
