const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {ensureHandwork,completeGesture,dragInventory,driver}=require('./gesture-driver.cjs');
const base=process.env.WORKSHOP_URL||'http://127.0.0.1:4182/lotus-workshop.html';
const shot=name=>path.join(__dirname,'process-'+name+'.png');
(async()=>{
 const {Workflow,currentStage}=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const at=id=>{const w=new Workflow();while(currentStage(w.state).id!==id)assert.ok(w.skipStage().ok);return w.state;};
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[];
 async function open(stage,mobile=false){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:960},hasTouch:mobile});
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(state=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>.5});if(!localStorage.getItem('process-test')){localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(state));localStorage.setItem('process-test','1');}},at(stage));
  await page.goto(base,{waitUntil:'domcontentloaded'});await ready(page);await page.click('#resume');return page;
 }
 async function ready(page){
  await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__?.ready);
  await page.evaluate(()=>{const r=__LOTUS_WORKSHOP__.renderer;r.shadowMap.enabled=false;const render=r.render.bind(r);let n=0;r.render=(s,c)=>{s.updateMatrixWorld(true);c.updateMatrixWorld(true);if(++n%8===0)render(s,c);};});
 }
 async function capture(page,name){
  await page.screenshot({path:shot(name)});
  const pixels=await page.evaluate(()=>{const a=__LOTUS_WORKSHOP__,gl=a.renderer.getContext(),p=new Uint8Array(4),colors=new Set();for(let y=1;y<=5;y++)for(let x=1;x<=5;x++){gl.readPixels(Math.floor(gl.drawingBufferWidth*x/6),Math.floor(gl.drawingBufferHeight*y/6),1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);colors.add([...p].join(','));}return colors.size;});
  assert.ok(pixels>3,'canvas must contain a rendered scene');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow');
 }
 try{
  const p=await open('frame_short_binding');await ensureHandwork(p);
  for(let i=1;i<=3;i++){await dragInventory(p,4);assert.equal(await p.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.frame_short_binding),i);if(i===1){await p.click('#handwork-close');await p.reload({waitUntil:'domcontentloaded'});await ready(p);await p.click('#resume');assert.equal(await p.evaluate(()=>__LOTUS_WORKSHOP__.state.frameItems.shortBinding),1);await ensureHandwork(p);}}
  assert.equal(await p.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().stage),'lining_lower');
  await completeGesture(p);await capture(p,'white-desktop');
  for(let i=1;i<6;i++)await completeGesture(p);
  assert.equal(await p.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().stage),'lining_upper');
  await completeGesture(p);assert.equal(await p.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.lining_upper),1);await capture(p,'red-desktop');
  await p.close();console.log('PASS desktop: three real short-strip drags, partial reload, six white panels before red');
  for(const mobile of [false,true]){
   const page=await open('petal_shaping',mobile);await ensureHandwork(page,mobile);
   for(const id of ['handwork-close','craft-book-open'])assert.equal(await page.evaluate(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));},id),true,id+' must not be covered');
   const d=await driver(page,mobile);
   await d.down({x:.15,y:.55});await d.move({x:1.065,y:.55},40);await d.up();
   assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().shapePhase),'pinch');assert.equal(await page.isEnabled('#handwork-confirm'),false);
   await d.down(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().grip));await d.move({x:1,y:0},40);await d.up();
   assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().shapePhase),'wire');assert.equal(await page.isEnabled('#handwork-confirm'),false);
   await d.down(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().grip));await d.move({x:.7,y:-.2},40);await d.up();await d.dispose();
   assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().shapePhase),'complete');await capture(page,mobile?'petal-mobile':'petal-desktop');
   await page.click('#handwork-confirm');assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.petal_shaping),1);
   assert.deepEqual(await page.evaluate(()=>{const e=__LOTUS_WORKSHOP__.state.handwork['petal_shaping:0'];return [e.formed,e.edgePinched,e.wireFixed];}),[true,true,true]);
   await page.click('#handwork-close');await page.reload({waitUntil:'domcontentloaded'});await ready(page);await page.click('#resume');assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.petal_shaping),1);
   await page.close();console.log('PASS '+(mobile?'touch/mobile':'mouse/desktop')+': form, pinch, wire, confirm and reload');
  }
  assert.deepEqual(errors,[]);console.log('PASS: no page errors; nonblank desktop/mobile screenshots');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
