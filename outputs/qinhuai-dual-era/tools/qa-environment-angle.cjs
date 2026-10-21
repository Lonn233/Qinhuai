const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-environment-angle-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:960}}),page=await context.newPage(),errors=[],key='qinhuai.building-environment.v1',presetKey='qinhuai.main-building-lights.v1',dir='work/environment-angle-20261020';
 await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const seed={version:1,future:'keep-envelope',buildings:{gate:{enabled:true,distance:6,custom:'keep-building'},'temple-front-hall':{angle:45,distance:5}}};
 const presets=JSON.stringify({version:1,buildings:{},presets:[{id:'keep-old',name:'旧收藏',building:'gate',settings:{brightness:.8}}]});
 const origin='http://127.0.0.1:'+server.address().port;
 const ready=()=>page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'&&window.__QINHUAI_IMPORT__?.loadedTileIds.includes(9),null,{timeout:180000});
 const choose=async id=>{await page.locator('#environment-auto-focus').uncheck();await page.locator('#environment-building').selectOption(id);await page.locator('#environmentSpillPanel').evaluate(el=>{for(let p=el;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});};
 const set=async value=>{await page.locator('#environment-angle-value').fill(String(value));await page.locator('#environment-angle-value').dispatchEvent('input');};
 try{
  await page.goto(origin+'/api/main-scene-settings');await page.evaluate(({key,seed,presetKey,presets})=>{localStorage.setItem(key,JSON.stringify(seed));localStorage.setItem(presetKey,presets);},{key,seed,presetKey,presets});
  await page.goto(origin+'/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold',{waitUntil:'domcontentloaded'});await ready();console.log('Map loaded');
  await choose('gate');assert.equal(await page.locator('#environment-angle-value').inputValue(),'90');assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),seed);
  await set(25);assert.equal(await page.locator('#environment-angle').inputValue(),'25');assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.nightLighting.environmentSpill.getSettings('gate').angle),25);
  await choose('temple-front-hall');assert.equal(await page.locator('#environment-angle-value').inputValue(),'45');await set(135);
  await choose('gate');assert.equal(await page.locator('#environment-angle-value').inputValue(),'25');
  let disk;for(let i=0;i<80;i++){try{disk=JSON.parse(await fs.readFile(path.join(dataDir,'main-scene-settings.json'),'utf8'));if(JSON.parse(disk.entries[key]).buildings['temple-front-hall'].angle===135)break;}catch{}await page.waitForTimeout(250);}
  const saved=JSON.parse(disk.entries[key]);assert.equal(saved.buildings.gate.angle,25);assert.equal(saved.buildings['temple-front-hall'].angle,135);assert.equal(saved.future,seed.future);assert.equal(saved.buildings.gate.custom,'keep-building');assert.equal(disk.entries[presetKey],presets);
  await page.locator('#environment-angle').scrollIntoViewIfNeeded();await page.screenshot({path:dir+'/environment-angle.png'});console.log('Angle controls and isolated backend persistence verified');
  await page.reload({waitUntil:'domcontentloaded'});await ready();await choose('gate');assert.equal(await page.locator('#environment-angle-value').inputValue(),'25');await choose('temple-front-hall');assert.equal(await page.locator('#environment-angle-value').inputValue(),'135');assert.equal(await page.evaluate(k=>localStorage.getItem(k),presetKey),presets);
  assert.deepEqual(errors,[]);await fs.writeFile(dir+'/browser-qa.json',JSON.stringify({ok:true,dataDir,angles:{gate:25,frontHall:135},presetsPreserved:true,reloadVerified:true,errors},null,2));console.log('PASS angle controls, independent buildings, disk save, reload, old presets and unknown fields preserved');
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
