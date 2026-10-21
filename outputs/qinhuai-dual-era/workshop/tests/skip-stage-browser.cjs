const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {ensureHandwork,completeGesture}=require('./gesture-driver.cjs');
const url=process.env.WORKSHOP_URL||'http://127.0.0.1:4180/lotus-workshop.html?v=skip-stage';
const state=page=>page.evaluate(()=>__LOTUS_WORKSHOP__.state);
const stage=page=>page.evaluate(()=>__LOTUS_WORKSHOP__.stages[__LOTUS_WORKSHOP__.state.stage].id);
async function checkLayout(page,selector){
 const metrics=await page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight,scroll:document.documentElement.scrollWidth};});
 assert.ok(metrics.x>=0&&metrics.y>=0&&metrics.right<=metrics.width&&metrics.bottom<=metrics.height,JSON.stringify(metrics));
 assert.ok(metrics.scroll<=metrics.width,'horizontal overflow');
 assert.ok(await page.locator(selector).isVisible());
}
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-timer-throttling']});
 const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'networkidle'});await page.click('#begin');await page.waitForTimeout(800);
  const initial=await state(page);await checkLayout(page,'#skip-stage');
  await page.click('#skip-stage');assert.equal(await stage(page),'frame_assembly');const after=await state(page);
  await page.click('#undo');assert.deepEqual(await state(page),initial);await page.click('#redo');assert.deepEqual(await state(page),after);
  await page.reload({waitUntil:'networkidle'});await page.click('#resume');assert.deepEqual(await state(page),after);
  await ensureHandwork(page);await checkLayout(page,'#handwork-skip-stage');
  await page.click('#handwork-skip-stage');assert.equal(await stage(page),'lining_upper');assert.ok(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.active));
  await completeGesture(page);const partial=await state(page);assert.equal(partial.counts.lining_upper,1);
  await page.click('#handwork-skip-stage');assert.equal(await stage(page),'lining_lower');
  await page.click('#handwork-close');await page.click('#undo');assert.deepEqual(await state(page),partial);await page.click('#redo');
  await page.screenshot({path:path.join(__dirname,'skip-stage-desktop.png')});
  await ensureHandwork(page);let skipped=0;
  while(!(await state(page)).complete){
   const id=await stage(page);await page.click('#handwork-skip-stage');skipped++;
   if(!(await state(page)).complete){assert.notEqual(await stage(page),id);assert.ok(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.active));}
   assert.ok(skipped<25,'skip chain must terminate');
  }
  assert.ok(await page.isVisible('#complete-dialog'));await page.click('#keep-looking');
  assert.equal(await page.locator('#skip-stage').isEnabled(),false);assert.equal(await page.locator('#handwork-skip-stage').isEnabled(),false);
  await page.click('#undo');assert.equal(await stage(page),'final_inspection');assert.equal((await state(page)).complete,false);assert.ok(await page.locator('#skip-stage').isEnabled());
  await page.click('#redo');await page.reload({waitUntil:'networkidle'});await page.click('#resume');assert.equal((await state(page)).complete,true);
  const pixels=await page.evaluate(()=>{const a=__LOTUS_WORKSHOP__;a.renderer.render(a.scene,a.camera);const gl=a.renderer.getContext(),out=new Uint8Array(4),colors=new Set();for(let y=1;y<6;y++)for(let x=1;x<6;x++){gl.readPixels(Math.floor(gl.drawingBufferWidth*x/6),Math.floor(gl.drawingBufferHeight*y/6),1,1,gl.RGBA,gl.UNSIGNED_BYTE,out);colors.add(out.slice(0,3).join(','));}return colors.size;});assert.ok(pixels>3,'scene must not be blank');
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});mobile.on('pageerror',e=>errors.push(e.message));
  await mobile.goto(url,{waitUntil:'networkidle'});await mobile.tap('#begin');await mobile.waitForTimeout(800);await checkLayout(mobile,'#skip-stage');
  await mobile.tap('#skip-stage');assert.equal(await stage(mobile),'frame_assembly');await mobile.screenshot({path:path.join(__dirname,'skip-stage-mobile.png')});
  await ensureHandwork(mobile,true);await checkLayout(mobile,'#handwork-skip-stage');await mobile.screenshot({path:path.join(__dirname,'skip-stage-mobile-workbench.png')});
  await mobile.tap('#handwork-skip-stage');assert.equal(await stage(mobile),'lining_upper');assert.ok(await mobile.evaluate(()=>__LOTUS_WORKSHOP__.handwork.active));
  await mobile.waitForTimeout(1300);await completeGesture(mobile,{touch:true});assert.equal((await state(mobile)).counts.lining_upper,1);
  assert.deepEqual(errors,[]);console.log('PASS: desktop/mobile skip, real gesture after skip, partial progress, undo/redo, reload, full chain, final dialog, nonblank scene');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
