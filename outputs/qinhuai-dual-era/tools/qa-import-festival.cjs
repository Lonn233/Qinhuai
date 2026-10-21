const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const errors=[],requests=[];let page;
 const assert=require('node:assert/strict');
 try{
  page=await browser.newPage({viewport:{width:800,height:600},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('requestfailed',r=>requests.push([r.url(),r.failure()]));
  await page.addInitScript(()=>{window.__lost=[];document.addEventListener('webglcontextlost',e=>window.__lost.push(Date.now()),true);});
  await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&view=festivalMountain&gateLight=gold',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.festivalLanterns.stats.lamps===39&&window.__QINHUAI_IMPORT__?.loadedTileIds.includes(6),null,{timeout:180000});
  await page.waitForTimeout(1500);
  const out=path.resolve('assets/qinhuai-modern-import/festival');
  const hiddenUi=await page.addStyleTag({content:'#toolbar,#help,#perf,#status,#progress{display:none!important}'});
  for(const view of ['festivalMountain','festivalLions','festivalWater']){
   await page.evaluate(v=>window.__QINHUAI_IMPORT__.focusNightView(v),view);await page.waitForTimeout(2000);
   await page.screenshot({path:path.join(out,view+'.png')});
  }
  const report=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;return {stats:a.festivalLanterns.stats,tiles:a.loadedTileIds,night:a.night,contextLost:a.renderer.getContext().isContextLost(),lostEvents:window.__lost,startup:window.__QINHUAI_STARTUP__?.error,temple:a.nightLighting.templeSelection,render:a.renderer.info.render,water:[]};});
  await hiddenUi.evaluate(el=>el.remove());
  await page.locator('.festival-panel summary').click();
  await page.locator('#mountainDiameter').fill('15');
  await page.locator('#mountainDiameter').dispatchEvent('input');
  await page.locator('#mountainRotation').fill('75');
  await page.locator('#mountainRotation').dispatchEvent('input');
  report.changedMountain=await page.evaluate(()=>window.__QINHUAI_IMPORT__.festivalLanterns.stats.mountain);
  assert.deepEqual(report.changedMountain,{sizeMeters:15,rotation:75});
  await page.locator('#resetMountainPreview').click();
  await page.locator('#waterVisible').uncheck();
  report.waterHidden=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;return !a.festivalLanterns.waterRoot.visible&&!a.modelRoot.getObjectByName('FuziTemple0038').visible;});
  assert.equal(report.waterHidden,true);
  await page.locator('#waterVisible').check();
  await page.locator('#wireframe').check();
  report.wireframeOff=await page.evaluate(()=>[...window.__QINHUAI_IMPORT__.festivalLanterns.entries.values()].every(e=>e.uniforms.uClothPower.value===0));
  assert.equal(report.wireframeOff,true);await page.locator('#wireframe').uncheck();
  await page.locator('[data-festival-view="festivalMountain"]').click();await page.waitForTimeout(1000);
  await page.screenshot({path:path.join(out,'festival-controls.png')});
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('day'));await page.waitForTimeout(500);
  report.dayPowers=await page.evaluate(()=>[...window.__QINHUAI_IMPORT__.festivalLanterns.entries.values()].map(e=>e.uniforms.uClothPower.value));
  report.errors=errors;report.failedRequests=requests;
  fs.writeFileSync(path.join(out,'browser-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  if(errors.length||report.lostEvents.length||report.contextLost||report.startup)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
