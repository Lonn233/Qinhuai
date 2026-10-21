const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url'),path=require('node:path'),assert=require('node:assert/strict');
const {driver,screenDriver,alignLining,dragPaper}=require('./gesture-driver.cjs');
(async()=>{
 const {Workflow,currentStage}=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const errors=[];
 try{for(const touch of [false,true])for(const stage of ['top_flower_assembly','pod_assembly','flower_making','pod_making','petal_assembly']){
 const w=new Workflow();while(currentStage(w.state).id!==stage)assert.ok(w.skipStage(Date.now()).ok);
 const page=await browser.newPage({viewport:touch?{width:390,height:844}:{width:1440,height:900},hasTouch:touch,isMobile:touch});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(state=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>.5});localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(state));},w.state);
 const snap=()=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());const count=()=>page.evaluate(id=>__LOTUS_WORKSHOP__.state.counts[id],stage);const tap=sel=>touch?page.tap(sel):page.click(sel);
 await page.goto('http://127.0.0.1:4180/lotus-workshop.html',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__?.ready);await page.evaluate(()=>{
 const {renderer}=__LOTUS_WORKSHOP__;renderer.shadowMap.enabled=false;
 // Keep real pointer/raycast geometry and animation updates; render fewer frames on software GPUs.
 const render=renderer.render.bind(renderer);let frames=0;
 renderer.render=(scene,camera)=>{scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);if(++frames%8===0)render(scene,camera);};
});
 await tap('#resume');await tap('#go-station');await page.waitForTimeout(900);await tap('#craft-action');await page.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().moving);
 assert.equal(await page.locator('#handwork-confirm').isVisible(),false);
 if(stage==='petal_assembly'){
  await alignLining(page,touch);let s=await snap();if(touch)await page.touchscreen.tap(s.target.x,s.target.y);else await page.mouse.click(s.target.x,s.target.y);await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().glued.length>0&&!__LOTUS_WORKSHOP__.handwork.snapshot().animation);
  await tap('#lining-paper');s=await snap();const d=await screenDriver(page,touch);
  try{await d.down(s.heldTarget);await d.move(s.target,20);assert.equal((await snap()).dragging,true);assert.equal(await count(),0);await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await d.up();assert.equal(await count(),0);assert.equal((await snap()).dragging,false);}finally{await d.dispose();}
  await dragPaper(page,touch);await page.waitForFunction(id=>__LOTUS_WORKSHOP__.state.counts[id]===1,stage);await page.waitForTimeout(200);assert.equal(await count(),1);
 }else{
  const d=await driver(page,touch),shape=stage.endsWith('making');
  try{for(let n=0;n<2;n++){
   let s=await snap();await d.down(s.grip);await d.move(shape?{x:1.065,y:.55}:{x:.65,y:.2},30);assert.equal(await count(),n,'must not commit before release');await d.up();
   await page.waitForFunction(({stage,n})=>__LOTUS_WORKSHOP__.state.counts[stage]===n,{stage,n:n+1});assert.equal((await snap()).active,true);await page.waitForTimeout(200);assert.equal(await count(),n+1);
  }}finally{await d.dispose();}
 }
 console.log('PASS release / no duplicate',stage,touch?'touch':'desktop');await page.close();
 }assert.deepEqual(errors,[]);}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
