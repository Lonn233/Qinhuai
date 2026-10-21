const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {alignLining,ensureHandwork,dragInventory,dragPaper,screenDrag}=require('./gesture-driver.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const url=process.env.WORKSHOP_URL||'http://127.0.0.1:4180/lotus-workshop.html';
const storageKey='qinhuai-lotus-workshop-v2',errors=[],pixels=[];
const snapshot=page=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());
const settle=page=>page.waitForFunction(()=>{const s=__LOTUS_WORKSHOP__.handwork.snapshot();return !s.moving&&!s.turning;});
async function choose(page,panel){await page.click('#lining-panel-'+panel);await settle(page);await alignLining(page);}
async function pixelCheck(page){
 const sample=await page.evaluate(()=>{
  const a=__LOTUS_WORKSHOP__,gl=a.renderer.getContext();a.renderer.render(a.scene,a.camera);
  const width=gl.drawingBufferWidth,height=gl.drawingBufferHeight,data=new Uint8Array(width*height*4);
  gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,data);
  const colors=new Set();let min=255,max=0;
  for(let i=0;i<data.length;i+=4*97){const r=data[i],g=data[i+1],b=data[i+2];colors.add((r>>3)*1024+(g>>3)*32+(b>>3));min=Math.min(min,r,g,b);max=Math.max(max,r,g,b);}
  return {width,height,colors:colors.size,range:max-min,lost:gl.isContextLost(),overflow:document.documentElement.scrollWidth>innerWidth};
 });
 assert.ok(sample.colors>100&&sample.range>70,'canvas must contain a rendered scene');assert.equal(sample.lost,false);assert.equal(sample.overflow,false);pixels.push(sample);
}
(async()=>{
 const wf=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 function fixture(id){const s=wf.createState();while(wf.currentStage(s).id!==id){const stage=wf.currentStage(s);if(stage.id==='frame_assembly')for(let i=0;i<3;i++)wf.applyRingPlacement(s,i);assert.ok(wf.applyAction(s,stage.tool).ok);}assert.ok(wf.validateState(s));return s;}
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 async function resume(page,mobile){await page.click('#resume');await page.waitForTimeout(750);await ensureHandwork(page,mobile);await settle(page);}
 async function open(id,mobile=false){const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile});page.on('pageerror',e=>errors.push(e.message));await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key:storageKey,state:fixture(id)});await page.reload({waitUntil:'networkidle'});await resume(page,mobile);return page;}
 async function dropItem(page,i){const b=await page.locator('#item-'+i).boundingBox();await page.keyboard.press('Digit'+(i+1));await screenDrag(page,{x:b.x+b.width/2,y:b.y+b.height/2},(await snapshot(page)).target);}
 try{
  const frame=await open('frame_assembly');
  await dropItem(frame,0);assert.equal((await snapshot(frame)).mounting,true);assert.equal((await snapshot(frame)).inventory[0],1);assert.deepEqual(await frame.evaluate(()=>__LOTUS_WORKSHOP__.state.frameItems.placedRings),[]);
  await frame.evaluate(()=>dispatchEvent(new Event('blur')));await frame.waitForTimeout(1500);assert.equal((await snapshot(frame)).mounting,false);assert.equal((await snapshot(frame)).inventory[0],1);assert.deepEqual(await frame.evaluate(()=>__LOTUS_WORKSHOP__.state.frameItems.placedRings),[]);
  for(let i=0;i<3;i++)await dragInventory(frame,i);
  await dropItem(frame,3);assert.equal((await snapshot(frame)).mounting,true);assert.deepEqual(await frame.evaluate(()=>[__LOTUS_WORKSHOP__.state.counts.frame_assembly,__LOTUS_WORKSHOP__.state.counts.frame_binding]),[0,0]);
  await frame.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().mounting);assert.deepEqual(await frame.evaluate(()=>[__LOTUS_WORKSHOP__.state.counts.frame_assembly,__LOTUS_WORKSHOP__.state.counts.frame_binding]),[1,1]);assert.equal((await snapshot(frame)).inventory[3],11);
  assert.ok(await frame.evaluate(()=>['big-ring','mouth-ring','waist-hoop'].every(id=>__LOTUS_WORKSHOP__.lantern.registry.get('binding-1-'+id).visible)));assert.equal((await snapshot(frame)).active,true);
  await pixelCheck(frame);await frame.screenshot({path:path.join(__dirname,'craft-frame-bound.png')});await frame.close();
  for(const mobile of [false,true]){
   const page=await open('lining_upper',mobile);await alignLining(page,mobile);
   await dragPaper(page,mobile);assert.equal((await snapshot(page)).pending,false);assert.equal(await page.textContent('#handwork-status'),'需要先涂抹浆糊');
   for(const panel of [4,1]){await choose(page,panel);await page.click('#lining-brush');const t=(await snapshot(page)).target;await page.mouse.click(t.x,t.y);await page.waitForFunction(i=>__LOTUS_WORKSHOP__.handwork.snapshot().glued.includes(i),panel);}
   assert.deepEqual((await snapshot(page)).glued,[4,1]);assert.deepEqual((await snapshot(page)).glueMarks,[4,1]);
   await dragPaper(page,mobile);assert.equal((await snapshot(page)).pending,true);await page.click('#handwork-retry');assert.equal((await snapshot(page)).pending,false);assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.lining_upper),0);
   await page.reload({waitUntil:'networkidle'});await resume(page,mobile);assert.deepEqual((await snapshot(page)).glued,[4,1]);assert.deepEqual((await snapshot(page)).glueMarks,[4,1]);
   await choose(page,4);await dragPaper(page,mobile);await page.click('#handwork-confirm');assert.equal((await snapshot(page)).animation,'paper');assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.lining_upper),0);
   await page.evaluate(()=>dispatchEvent(new Event('blur')));await page.waitForTimeout(1100);assert.equal(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.lining_upper),0);assert.deepEqual((await snapshot(page)).glued,[4,1]);assert.deepEqual((await snapshot(page)).glueMarks,[4,1]);
   for(const panel of [4,1]){await choose(page,panel);await dragPaper(page,mobile);assert.equal((await snapshot(page)).pending,true);await page.click('#handwork-confirm');await page.waitForFunction(i=>__LOTUS_WORKSHOP__.handwork.snapshot().installed.includes(i),panel);await settle(page);assert.equal(await page.isDisabled('#lining-panel-'+panel),true);}
   assert.deepEqual((await snapshot(page)).installed,[4,1]);assert.deepEqual((await snapshot(page)).glueMarks,[]);assert.equal((await snapshot(page)).active,true);await pixelCheck(page);await page.screenshot({path:path.join(__dirname,'craft-paper-'+(mobile?'mobile':'desktop')+'.png')});
   await page.keyboard.press('Escape');await page.waitForTimeout(750);await page.click('#undo');assert.deepEqual(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.lining.lining_upper.installed),[4]);await page.click('#redo');assert.deepEqual(await page.evaluate(()=>__LOTUS_WORKSHOP__.state.lining.lining_upper.installed),[4,1]);
   await page.reload({waitUntil:'networkidle'});await resume(page,mobile);assert.deepEqual((await snapshot(page)).installed,[4,1]);await page.close();
  }
  assert.deepEqual(errors,[]);const result={passed:true,generatedAt:new Date().toISOString(),errors,pixels,verified:['binding commits and consumes only after animation','cancelled binding leaves inventory untouched','each rib has three visible bound joints','unglued paper rejected on desktop and touch','out-of-order glue persists across actual reload','retry and interrupted adhesion consume no paper','continuous out-of-order adhesion, undo, redo and reload']};fs.writeFileSync(path.join(__dirname,'craft-browser-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{fs.writeFileSync(path.join(__dirname,'craft-browser-results.json'),JSON.stringify({passed:false,error:e.stack},null,2));console.error(e);process.exitCode=1;});

