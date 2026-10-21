const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url'),path=require('node:path'),assert=require('node:assert/strict');
const {screenDriver}=require('./gesture-driver.cjs');
(async()=>{
 const {Workflow,currentStage}=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const errors=[];
 try{for(const touch of [false,true]){
 const w=new Workflow();while(currentStage(w.state).id!=='top_flower_assembly')assert.ok(w.skipStage(Date.now()).ok);
 const page=await browser.newPage({viewport:touch?{width:390,height:844}:{width:1440,height:900},hasTouch:touch,isMobile:touch});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(state=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>.5});localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(state));},w.state);
 await page.goto('http://127.0.0.1:4180/lotus-workshop.html',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__?.ready);
 await page.evaluate(()=>{const r=__LOTUS_WORKSHOP__.renderer;r.shadowMap.enabled=false;const render=r.render.bind(r);let n=0;r.render=(s,c)=>{s.updateMatrixWorld(true);c.updateMatrixWorld(true);if(++n%8===0)render(s,c);};});
 const tap=sel=>touch?page.tap(sel):page.click(sel);await tap('#resume');await tap('#go-station');await page.waitForTimeout(900);await tap('#craft-action');await page.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().moving);
 const count=()=>page.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.top_flower_assembly);
 const stock=()=>page.locator('#inventory-flower .item-count').textContent();
 const start=async d=>{const b=await page.locator('#inventory-flower').boundingBox();await d.down({x:b.x+b.width/2,y:b.y+b.height/2});assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().inventoryDrag),true);};
 const target=()=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.project({x:.65,y:.2}));
 const d=await screenDriver(page,touch);
 try{
 assert.equal(await stock(),'6');assert.equal(await page.locator('#inventory-flower').isEnabled(),true);
 await start(d);await d.up();assert.equal(await count(),0);assert.equal(await stock(),'6');
 await start(d);await d.move(await target(),12);await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await d.up();assert.equal(await count(),0);assert.equal(await stock(),'6');
 for(let n=0;n<6;n++){
 await start(d);await d.move(await target(),15);assert.equal(await count(),n);assert.equal(await stock(),String(6-n));
 if(n===0)await page.screenshot({path:path.join(__dirname,'../../work/flower-backpack-'+(touch?'touch':'desktop')+'.png')});
 await d.up();await page.waitForFunction(n=>__LOTUS_WORKSHOP__.state.counts.top_flower_assembly===n,n+1);assert.equal(await stock(),String(5-n));assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.active),true);
 }
 assert.equal(await page.locator('#inventory-flower').isEnabled(),false);
 console.log('PASS backpack flower drag: invalid drop, cancel, six consecutive drops, quantities, next stage',touch?'touch':'desktop');
 }finally{await d.dispose();}await page.close();
 }assert.deepEqual(errors,[]);}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
