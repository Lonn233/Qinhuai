const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-boat-controls-')),server=createServer({dataDir:dir});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:1400,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url='http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?time=night&view=boats&gateLight=gold';
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.nightLighting.boatLanterns.hulls.size===14||window.__QINHUAI_STARTUP__?.error,null,{timeout:180000});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:180000});
  assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__.error),null);
  const initial=await page.evaluate(()=>{const a=__QINHUAI_IMPORT__,b=a.nightLighting.boatLanterns;return {parts:b.meshes.size,hulls:b.hulls.size,shown:[...b.meshes].every(m=>m.visible),base:[...b.materials].every(([m,p])=>m.emissiveIntensity===p.power&&m.emissive.equals(p.color)),record:localStorage.getItem('qinhuai.main-lantern-lights.v1')};});
  assert.equal(initial.hulls,14);assert.ok(initial.parts>100);assert.ok(initial.shown&&initial.base);assert.equal(initial.record,null);console.log('Boat default state:',initial);
  await page.evaluate(()=>{document.querySelector('#lanternLightPanel').open=true;document.querySelector('#lanternBodyPanel').open=true;document.querySelector('#lanternSpillPanel').open=true;});
  await page.selectOption('#lantern-group','boat');
  const set=async(id,value)=>page.evaluate(({id,value})=>{const e=document.getElementById(id);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new Event(e.type==='checkbox'?'change':'input',{bubbles:true}));},{id,value});
  await set('lantern-brightness',1.5);await set('lantern-color','#ff8040');await set('lantern-spill-enabled',true);await set('lantern-spill-color','#44aaff');
  console.log('Before spill check',await page.evaluate(()=>({settings:__QINHUAI_IMPORT__.lanternLighting.getSettings('boat'),active:__QINHUAI_IMPORT__.nightLighting.environmentSpill.active,count:__QINHUAI_IMPORT__.lanternLighting.sources('boat').length,errors:window.__QINHUAI_STARTUP__.error})));
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.nightLighting.environmentSpill.lanternChannels.some(c=>c.cacheKey==='lantern|boat'&&c.emitters.length===14),null,{timeout:15000});
  assert.ok(await page.evaluate(()=>[...__QINHUAI_IMPORT__.nightLighting.boatLanterns.materials].every(([m,p])=>Math.abs(m.emissiveIntensity-p.power*1.5)<1e-6&&m.emissive.getHexString()==='ff8040')));
  await page.evaluate(()=>{document.querySelector('#lantern-preset-name').value='游船暖色测试';document.querySelector('#lantern-preset-save').click();});
  await set('lantern-modelVisible',false);
  await page.waitForFunction(()=>!__QINHUAI_IMPORT__.nightLighting.environmentSpill.lanternChannels.some(c=>c.cacheKey==='lantern|boat'),null,{timeout:15000});
  assert.ok(await page.evaluate(()=>{const n=__QINHUAI_IMPORT__.nightLighting;return [...n.boatLanterns.meshes].every(m=>!m.visible)&&n.waterReflections.batches.filter(b=>b.kind==='boat').every(b=>!b.mesh.visible)&&[...n.boatLanterns.materials.keys()].every(m=>m.emissiveIntensity===0);}));
  await page.evaluate(()=>{const n=__QINHUAI_IMPORT__.nightLighting;n.setEnabled(false);n.setEnabled(true);n.applyMapLightSettings();});
  assert.ok(await page.evaluate(()=>[...__QINHUAI_IMPORT__.nightLighting.boatLanterns.meshes].every(m=>!m.visible)));
  await page.evaluate(()=>window.__QINHUAI_SCENE_SAVE__.flush());
  await page.waitForFunction(async()=>{const r=await fetch('/api/main-scene-settings').then(r=>r.json());const raw=r.entries?.['qinhuai.main-lantern-lights.v1'];return raw&&JSON.parse(raw).groups.boat.modelVisible===false;},null,{timeout:15000});
  const disk=JSON.parse(await fs.readFile(path.join(dir,'main-scene-settings.json'),'utf8'));const saved=JSON.parse(disk.entries['qinhuai.main-lantern-lights.v1']);assert.equal(saved.groups.boat.modelVisible,false);assert.equal(saved.presets[0].name,'游船暖色测试');assert.equal(saved.presets[0].settings.modelVisible,true);
  console.log('PASS boat brightness/color/spill, complete model hiding, time/settings switches, disk save/preset preservation');
  // Restoring through a fresh browser context exercises backend recovery, not just localStorage.
  await page.close();const context=await browser.newContext({viewport:{width:1400,height:900}});const restored=await context.newPage();restored.on('pageerror',e=>errors.push(e.message));await restored.goto(url,{waitUntil:'domcontentloaded'});
  await restored.waitForFunction(()=>window.__QINHUAI_IMPORT__?.nightLighting.boatLanterns.hulls.size===14,null,{timeout:180000});
  await restored.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:180000});
  assert.ok(await restored.evaluate(()=>[...__QINHUAI_IMPORT__.nightLighting.boatLanterns.meshes].every(m=>!m.visible)));
  await restored.evaluate(()=>{document.querySelector('#lanternLightPanel').open=true;document.querySelector('#lanternBodyPanel').open=true;document.querySelector('#lanternSpillPanel').open=true;});await restored.selectOption('#lantern-group','boat');
  assert.equal(await restored.locator('#lantern-modelVisible').isChecked(),false);
  await restored.evaluate(()=>{const e=document.querySelector('#lantern-modelVisible');e.checked=true;e.dispatchEvent(new Event('change'));});
  assert.ok(await restored.evaluate(()=>[...__QINHUAI_IMPORT__.nightLighting.boatLanterns.meshes].every(m=>m.visible)));
  await restored.locator('#lantern-group').scrollIntoViewIfNeeded();await restored.screenshot({path:path.resolve('work/boat-lantern-controls.png')});
  assert.deepEqual(errors,[]);console.log('PASS fresh-browser restore and re-enable; screenshot work/boat-lantern-controls.png');
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
