const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createServer}=require('../serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-map-save-render-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const A='qinhuai.map-light-controls.v1',B='qinhuai.building-environment.v1',C='qinhuai.building-light-studies.v1';
 const raw={[A]:JSON.stringify({version:1,extension:'keep-root',settings:{exposure:.76,bloomStrength:.31,futureValue:9}}),[B]:JSON.stringify({version:1,extra:'keep-envelope',buildings:{'temple-front-hall':{enabled:true,inheritColor:false,color:'#56bbdf',intensity:.35,distance:5,decayDistance:3,feather:.7,legacy:42}}}),[C]:'{"version":1,"items":[]}'};
 try{
  await page.goto(origin+'/api/main-scene-settings');await page.evaluate(values=>{for(const[k,v]of Object.entries(values))localStorage.setItem(k,v);},raw);
  await page.goto(origin+'/qinhuai-modern-import.html?time=night&view=riverfront&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:240000});assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__.error),null);
  await page.waitForFunction(()=>document.querySelector('#scenePersistence').dataset.state==='saved');
  assert.equal(await page.locator('#map-light-exposure-value').inputValue(),'0.76');
  const panel=page.locator('#mapLightPanel');if(await panel.count())await panel.evaluate(el=>el.open=true);
  const exposure=page.locator('#map-light-exposure-value');await exposure.evaluate(el=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await exposure.fill('0.84');await exposure.dispatchEvent('change');
  await page.waitForFunction(()=>window.__QINHUAI_SCENE_SAVE__.status.state==='saved');
  let disk=JSON.parse(await fs.readFile(path.join(dataDir,'main-scene-settings.json'),'utf8')),map=JSON.parse(disk.entries[A]);assert.equal(map.settings.exposure,.84);assert.equal(map.settings.futureValue,9);assert.equal(map.extension,'keep-root');assert.equal(disk.entries[C],raw[C]);
  await page.locator('#environmentSpillPanel').evaluate(el=>el.open=true);await page.locator('#environment-auto-focus').uncheck();await page.locator('#environment-building').selectOption('temple-front-hall');
  await page.locator('#environment-color-hex').fill('#d894ff');await page.locator('#environment-color-hex').press('Tab');await page.waitForFunction(()=>window.__QINHUAI_SCENE_SAVE__.status.state==='saved');
  disk=JSON.parse(await fs.readFile(path.join(dataDir,'main-scene-settings.json'),'utf8'));const env=JSON.parse(disk.entries[B]);assert.equal(env.buildings['temple-front-hall'].color,'#d894ff');assert.equal(env.extra,'keep-envelope');assert.equal(env.buildings['temple-front-hall'].legacy,42);
  await page.locator('#toolbarContent').evaluate(el=>el.scrollTop=0);await fs.mkdir('work/main-scene-storage-20261019',{recursive:true});await page.screenshot({path:'work/main-scene-storage-20261019/map-save-ui.png'});
  await page.locator('#toolbarToggle').click();assert.equal(await page.locator('#toolbarContent').isVisible(),false);await page.locator('#toolbarToggle').click();assert.equal(await page.locator('#toolbarContent').isVisible(),true);
  assert.deepEqual(errors,[]);console.log('PASS actual WebGL map, Chrome values applied, exposure and per-building color saved, unknown fields/presets retained, toolbar toggles, no page errors');
  await fs.writeFile('work/main-scene-storage-20261019/map-qa.json',JSON.stringify({ok:true,dataDir,revision:disk.revision,errors},null,2));
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
