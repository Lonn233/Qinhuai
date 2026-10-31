const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createServer}=require('../game/serve.cjs');
(async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-lantern-qa-')),server=createServer({dataDir:dir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 console.log('QA directory:',dir);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const errors=[],shaders=[];let page;
 try{
  page=await browser.newPage({viewport:{width:1200,height:850}});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGLProgram/.test(m.text()))shaders.push(m.text());});
  const url='http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?time=night&view=courtyard&gateLight=gold';
  await page.goto(url);await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.courtyardLanterns.ready||window.__QINHUAI_STARTUP__?.error,null,{timeout:180000});
  assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__.error),null);console.log('Courtyard ready');
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.courtyardLanterns.ready,null,{timeout:120000});
  const initial=await page.evaluate(()=>({key:localStorage.getItem('qinhuai.main-lantern-lights.v1'),tree:__QINHUAI_IMPORT__.goldenTreeLanterns.fabric[0].emissiveIntensity,court:__QINHUAI_IMPORT__.courtyardLanterns.fabric[0].emissiveIntensity}));
  assert.equal(initial.key,null);assert.equal(initial.tree,.85);assert.equal(initial.court,.85);
  await page.evaluate(()=>{document.querySelector('#lanternLightPanel').open=true;document.querySelector('#lanternBodyPanel').open=true;document.querySelector('#lanternSpillPanel').open=true;});
  await page.selectOption('#lantern-group','courtyard');
  const set=async(id,value)=>page.evaluate(({id,value})=>{const e=document.getElementById(id);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new Event(e.type==='checkbox'?'change':'input',{bubbles:true}));},{id,value});
  await set('lantern-brightness',.5);await set('lantern-color','#ff8800');await set('lantern-spill-enabled',true);await set('lantern-spill-color','#22bbff');await set('lantern-spill-distance',6);
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.nightLighting.environmentSpill.lanternChannels.some(c=>c.cacheKey==='lantern|courtyard'&&c.emitters.length>0),null,{timeout:10000});
  const changed=await page.evaluate(()=>{const a=__QINHUAI_IMPORT__,env=a.nightLighting.environmentSpill,c=env.lanternChannels.find(c=>c.cacheKey==='lantern|courtyard');return {tree:a.goldenTreeLanterns.fabric[0].emissiveIntensity,court:a.courtyardLanterns.fabric[0].emissiveIntensity,color:a.courtyardLanterns.fabric[0].emissive.getHexString(),spill:c.color.getHexString(),sources:c.emitters.length,finite:c.emitters.every(e=>[e.x,e.y,e.z].every(Number.isFinite)),volume:env.volume.updates};});
  assert.equal(changed.tree,.85);assert.equal(changed.court,.425);assert.equal(changed.color,'ff8800');assert.equal(changed.spill,'22bbff');assert.ok(changed.sources>=216);assert.ok(changed.finite);console.log('Independent lights and real environment sources:',changed);
  await page.evaluate(()=>{document.querySelector('#lantern-preset-name').value='浏览器验证方案';document.querySelector('#lantern-preset-save').click();});
  await page.evaluate(()=>window.__QINHUAI_SCENE_SAVE__.flush());
  await page.waitForFunction(async()=>{const r=await fetch('/api/main-scene-settings').then(r=>r.json());const raw=r.entries?.['qinhuai.main-lantern-lights.v1'];return raw&&JSON.parse(raw).presets.some(p=>p.name==='浏览器验证方案');},null,{timeout:15000});
  const disk=JSON.parse(await fs.readFile(path.join(dir,'main-scene-settings.json'),'utf8'));assert.ok(disk.entries['qinhuai.main-lantern-lights.v1']);console.log('Disk before reload:',disk.revision,JSON.parse(disk.entries['qinhuai.main-lantern-lights.v1']));assert.equal(JSON.parse(disk.entries['qinhuai.main-lantern-lights.v1']).presets[0]?.name,'浏览器验证方案');
  // Open a new browser storage context: values must restore from the backend file.
  const context=await browser.newContext({viewport:{width:1440,height:1000}});await page.close();page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.courtyardLanterns.ready,null,{timeout:180000});
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.courtyardLanterns.fabric[0].emissiveIntensity===.425,null,{timeout:15000});
  const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('qinhuai.main-lantern-lights.v1')));assert.equal(restored.groups.courtyard.spill.color,'#22bbff');assert.equal(restored.presets[0].name,'浏览器验证方案');
  await page.evaluate(()=>{document.querySelector('#lanternLightPanel').open=true;document.querySelector('#lanternBodyPanel').open=true;document.querySelector('#lanternSpillPanel').open=true;});await page.selectOption('#lantern-group','courtyard');await page.locator('#lantern-group').scrollIntoViewIfNeeded();
  await fs.mkdir(path.join(__dirname,'../work'),{recursive:true});await page.screenshot({path:path.join(__dirname,'../work/lantern-controls-desktop.png')});
  await page.setViewportSize({width:390,height:844});await page.locator('#lantern-group').scrollIntoViewIfNeeded();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(__dirname,'../work/lantern-controls-mobile.png')});
  assert.deepEqual(errors,[]);assert.deepEqual(shaders,[]);console.log('PASS: default appearance, independent color/brightness, environment spill, saved preset, disk restore in clean browser, responsive layout. Data directory:',dir);
 }catch(error){console.error('Errors',errors,'Shaders',shaders);if(page)console.error(await page.evaluate(()=>({startup:window.__QINHUAI_STARTUP__,status:document.querySelector('#status')?.textContent})).catch(()=>null));throw error;}
 finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
