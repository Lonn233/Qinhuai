const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {ensureHandwork,completeGesture,dragInventory}=require('./gesture-driver.cjs');
const shot=name=>path.join(__dirname,'revision-'+name+'.png');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4180/lotus-workshop.html?v=workbench-revision',{waitUntil:'networkidle'});
  await page.click('#begin');await ensureHandwork(page);
  const snap=()=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());
  assert.equal((await snap()).stock.length,16);
  await page.screenshot({path:shot('table')});
  await page.click('#ring-type-0');const stock=(await snap()).stock[0];await page.mouse.click(stock.x,stock.y);
  let s=await snap();assert.equal(s.selected,true);assert.equal(s.stripLength,.94);assert.equal(s.stripWidth,.012);assert.ok(s.gripSpacing<.61);
  await page.screenshot({path:shot('short-strip')});
  const b=await page.locator('#handwork-surface').boundingBox();await page.mouse.move(b.x+b.width*.5,b.y+b.height*.65);
  await page.mouse.down();await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().curve>=1.10);await page.mouse.up();
  assert.equal(await page.isEnabled('#handwork-confirm'),false);
  await page.mouse.down({button:'right'});await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().curve<=1);await page.mouse.up({button:'right'});
  assert.equal(await page.isEnabled('#handwork-confirm'),true);await page.screenshot({path:shot('ring-ready')});
  await page.click('#handwork-confirm');await page.waitForFunction(()=>__LOTUS_WORKSHOP__.state.counts.bamboo_prep===1);
  assert.equal((await snap()).active,true);assert.equal((await snap()).stock.length,15);
  for(let i=1;i<3;i++)await completeGesture(page);
  assert.deepEqual((await snap()).inventory,[1,1,1,12]);
  await ensureHandwork(page);
  for(let i=0;i<3;i++)await dragInventory(page,i);
  for(let i=1;i<=12;i++){
   await dragInventory(page,3);
   assert.deepEqual(await page.evaluate(()=>[__LOTUS_WORKSHOP__.state.counts.frame_assembly,__LOTUS_WORKSHOP__.state.counts.frame_binding]),[i,i]);
   assert.ok(await page.evaluate(i=>['big-ring','mouth-ring','waist-hoop'].every(id=>__LOTUS_WORKSHOP__.lantern.registry.get('binding-'+i+'-'+id).visible),i));
   assert.equal((await snap()).active,true);
  }
  assert.equal((await snap()).mode,'lining');assert.equal((await snap()).stage,'lining_upper');
  await completeGesture(page);assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.lining_upper),1);
  await page.screenshot({path:shot('frame-to-lining')});
  assert.deepEqual(errors,[]);
  console.log('PASS: short thin strip and close grips, overbend rejection, right-button release, three continuous rings, twelve individual bindings, direct transition into glue-and-paper');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
