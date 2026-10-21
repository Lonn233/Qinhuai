const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-buildings-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[],key='qinhuai.main-building-lights.v1',oldKey='qinhuai.building-light-studies.v1';page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.addInitScript(()=>{if(!localStorage.getItem('qa-seeded')){localStorage.setItem('qinhuai.building-light-studies.v1',JSON.stringify({version:1,items:[],future:'keep-old-library'}));localStorage.setItem('qa-seeded','yes');}});
 try{
  await page.goto(origin+'/qinhuai-modern-import.html?time=night&view=riverfront&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:240000});assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__.error),null);
  await page.locator('#environment-auto-focus').uncheck();await page.locator('#environment-building').selectOption('matou-north-west');
  assert.equal(await page.locator('#building-module-window').getAttribute('open'),null);assert.equal(await page.locator('#environmentSpillPanel').getAttribute('open'),null);
  await page.locator('#building-module-window summary').click();await page.locator('#building-window-brightness-value').fill('1.8');await page.locator('#building-window-brightness-value').dispatchEvent('input');await page.locator('#building-window-hex').fill('#55bbff');await page.locator('#building-window-hex').press('Tab');
  const uniform=()=>page.evaluate(()=>window.__QINHUAI_IMPORT__.nightLighting.buildingAdjustments.getUniform('matou-north-west','window').value.toArray());assert.equal((await uniform())[3],1);
  await page.locator('#buildingLightPresets summary').click();await page.locator('#buildingLightName').fill('蓝窗测试');await page.locator('#buildingLightSave').click();
  await page.locator('#environment-building').selectOption('matou-north-east');assert.equal(await page.locator('#building-window-brightness-value').inputValue(),'1');await page.locator('#building-window-brightness-value').fill('0');await page.locator('#building-window-brightness-value').dispatchEvent('input');
  await page.locator('#environment-building').selectOption('matou-north-west');assert.equal(await page.locator('#building-window-brightness-value').inputValue(),'1.8');assert.equal(await page.locator('#building-window-hex').inputValue(),'#55bbff');
  await page.locator('#buildingLightReset').click();assert.equal(await page.locator('#buildingLightSaved option').count(),1);await page.locator('#buildingLightApply').click();assert.equal(await page.locator('#building-window-brightness-value').inputValue(),'1.8');
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.focusEnvironmentBuilding('matou-north-west'));
  await page.waitForTimeout(700);
  await page.locator('#environmentSpillPanel summary').click();await page.locator('#environment-enabled').check();await page.locator('#environment-color').fill('#ff0000');await page.locator('#environment-color').dispatchEvent('input');
  let disk;for(let n=0;n<100;n++){try{disk=JSON.parse(await fs.readFile(path.join(dataDir,'main-scene-settings.json'),'utf8'));const saved=JSON.parse(disk.entries[key]||'{}');if(saved.presets?.length===1&&saved.buildings?.['matou-north-east']?.parts.window.brightness===0&&saved.buildings?.['matou-north-west']?.parts.window.brightness===1.8)break;}catch{}await page.waitForTimeout(250);}
  assert.equal(JSON.parse(disk.entries[key]).presets.length,1);assert.equal(JSON.parse(disk.entries[oldKey]).future,'keep-old-library');
  await fs.mkdir('work/building-main-controls-20261019',{recursive:true});await page.locator('#environment-building').scrollIntoViewIfNeeded();await page.screenshot({path:'work/building-main-controls-20261019/panel.png'});
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:240000});assert.equal((await uniform())[3],1);
  await page.locator('#environment-auto-focus').uncheck();await page.locator('#environment-building').selectOption('temple-front-hall');await page.locator('#building-module-roof summary').click();await page.locator('#building-roof-brightness-value').fill('0');await page.locator('#building-roof-brightness-value').dispatchEvent('input');
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.nightLighting.buildingAdjustments.getUniform('temple-rear-hall','roof').value.x),1);
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('day'));await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('night'));await page.waitForTimeout(1000);
  await page.evaluate(()=>{const rig=window.__QINHUAI_IMPORT__.nightLighting;rig.buildingAdjustments.setSettings('gate',{parts:{sign:{enabled:false}}});});
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.nightLighting.root.getObjectByName('天下文枢·牌匾洗亮').intensity),0);
  assert.deepEqual(errors,[]);
  await fs.writeFile('work/building-main-controls-20261019/qa.json',JSON.stringify({ok:true,errors,dataDir,revision:disk.revision},null,2));console.log('PASS real WebGL, collapsed modules, per-building changes, presets, disk save, reload, prior library preservation, independent shared-mesh regions');
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
