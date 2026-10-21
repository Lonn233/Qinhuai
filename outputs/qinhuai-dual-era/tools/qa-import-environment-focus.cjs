const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out=path.resolve('work/environment-focus-color-20261019');fs.mkdirSync(out,{recursive:true});
const key='qinhuai.building-environment.v1';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:1200,height:820},deviceScaleFactor:1});
  const page=await context.newPage();page.setDefaultTimeout(60000);
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.addInitScript(k=>{
   if(!localStorage.getItem('qa-environment-seeded')){
    localStorage.setItem('qa-environment-seeded','1');
    localStorage.setItem('qinhuai.building-light-studies.v1','[]');
    localStorage.setItem(k,JSON.stringify({version:1,buildings:{'temple-front-hall':{enabled:true,inheritColor:false,intensity:.4,distance:4,decayDistance:3,feather:.7,extension:'preserve'},'matou-south-west':{enabled:false,distance:7,legacyNote:'do not rewrite'}}}));
   }
  },key);
  const url='http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&view=riverfront&gateLight=gold';
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  const ready=async()=>{await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:240000});assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__.error),null);};
  await ready();console.log('Night map ready');
  await page.locator('#environmentSpillPanel > summary').click();
  const select=page.locator('#environment-building');
  const position=()=>page.evaluate(()=>window.__QINHUAI_IMPORT__.camera.position.toArray());
  const idle=()=>page.waitForFunction(()=>document.querySelector('#environment-focus').getAttribute('aria-busy')==='false');
  const old=await position();await select.selectOption('pavilion');await idle();assert.notDeepEqual(await position(),old);
  assert.match(await page.locator('#environment-focus-status').textContent(),/已定位 魁星阁/);
  await page.locator('#environment-auto-focus').uncheck();const pavilion=await position();
  await select.selectOption('temple-front-hall');assert.deepEqual(await position(),pavilion);
  assert.equal(await page.locator('#environment-color').inputValue(),'#ffecd4');
  await page.locator('#environment-focus').click();await idle();assert.notDeepEqual(await position(),pavilion);
  const framing=await page.evaluate(()=>{
   const a=window.__QINHUAI_IMPORT__,b=a.nightLighting.environmentSpill.getFocusTarget('temple-front-hall'),c=b.bounds.min.map((v,i)=>(v+b.bounds.max[i])/2);
   const p=a.camera.position.clone().fromArray(c).project(a.camera),rect=document.querySelector('#toolbar').getBoundingClientRect();return {pixelX:(p.x+1)/2*innerWidth,menuRight:rect.right,pixelY:(1-p.y)/2*innerHeight};
  });assert.ok(framing.pixelX>framing.menuRight&&framing.pixelX<1200);assert.ok(framing.pixelY>0&&framing.pixelY<820);
  const oldSource=await page.evaluate(()=>JSON.stringify(window.__QINHUAI_IMPORT__.nightLighting.environmentSpill.sourceState));
  const oldOther=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).buildings['matou-south-west'],key);
  const fixture={id:'temple-front-hall'};
  await page.locator('#environment-intensity-value').fill('1');await page.locator('#environment-intensity-value').dispatchEvent('change');
  await page.locator('#environment-distance-value').fill('8');await page.locator('#environment-distance-value').dispatchEvent('change');
  await page.locator('#environment-focus').click();await idle();
  await page.locator('#environment-color').fill('#42bfff');
  await page.waitForFunction(()=>!window.__QINHUAI_IMPORT__.nightLighting.environmentSpill.dirty);
  assert.equal(await page.locator('#environment-inheritColor').isChecked(),false);
  const cyan=await page.evaluate(()=>Array.from(window.__QINHUAI_IMPORT__.nightLighting.environmentSpill.data));
  await page.locator('#environment-color').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(out,'cyan-ui.png')});
  await page.locator('#environment-color-hex').fill('#ff6633');await page.locator('#environment-color-hex').press('Tab');
  await page.waitForFunction(()=>!window.__QINHUAI_IMPORT__.nightLighting.environmentSpill.dirty);
  const orange=await page.evaluate(()=>Array.from(window.__QINHUAI_IMPORT__.nightLighting.environmentSpill.data));
  assert.ok(cyan.some((v,i)=>v!==orange[i]),'color really changes irradiance atlas');
  await page.screenshot({path:path.join(out,'orange-ui.png')});
  await page.locator('#environment-inheritColor').check();
  assert.equal(await page.locator('#environment-color').inputValue(),'#ff6633','inherited mode remembers custom color');
  await page.locator('#environment-inheritColor').uncheck();
  assert.equal(await page.evaluate(()=>JSON.stringify(window.__QINHUAI_IMPORT__.nightLighting.environmentSpill.sourceState)),oldSource);
  assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).buildings['matou-south-west'],key),oldOther);
  const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).buildings['temple-front-hall'],key);assert.equal(saved.color,'#ff6633');assert.equal(saved.inheritColor,false);assert.equal(saved.extension,'preserve');
  await page.locator('#environment-auto-focus').check();await select.selectOption('matou-north-east');await idle();assert.match(await page.locator('#environment-focus-status').textContent(),/马头墙/);
  await page.screenshot({path:path.join(out,'matou-focus.png')});
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setControlMode('firstPerson'));
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.controlMode),'firstPerson');
  await page.locator('#environment-focus').click();await idle();assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.controlMode),'orbit');
  await page.locator('#toolbarToggle').click();assert.equal(await page.locator('#toolbarContent').isVisible(),false);await page.locator('#toolbarToggle').click();
  console.log('Focus, colors, source preservation passed; reloading');
  await page.reload({waitUntil:'domcontentloaded'});await ready();
  await page.locator('#environmentSpillPanel > summary').click();
  assert.equal(await select.inputValue(),'temple-front-hall');assert.equal(await page.locator('#environment-color').inputValue(),'#ff6633');assert.equal(await page.locator('#environment-distance-value').inputValue(),'8');
  assert.equal(await page.evaluate(()=>localStorage.getItem('qinhuai.building-light-studies.v1')),'[]');
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.renderer.getContext().isContextLost()),false);
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'qa.json'),JSON.stringify({passed:true,framing,saved,oldOther,errors},null,2));
  console.log('PASS: auto/manual focus, menu-aware framing, first-person exit, ground colors, inheritance, legacy fields, per-building persistence, reload, no WebGL errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
