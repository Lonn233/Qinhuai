const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-dragon-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const key='qinhuai.dragon-wall-light.v1';
 try{
  await page.goto(origin+'/qinhuai-modern-import.html?time=night&view=dragonWall&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:240000});assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__.error),null);
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.dragonLighting.bindings.length),9);
  await page.locator('#dragonLightPanel').evaluate(el=>{for(let p=el;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await page.locator('#dragonFocus').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);await page.screenshot({path:'work/dragon-light-20261019/reference-preset.png'});
  await page.locator('#dragonPart').selectOption('right');await page.locator('#dragonColorHex').fill('#ff9d29');await page.locator('#dragonColorHex').press('Tab');await page.locator('#dragon-brightness-value').fill('3');await page.locator('#dragon-brightness-value').dispatchEvent('input');
  await page.locator('#dragonPresetName').fill('龙墙测试另存');await page.locator('#dragonSavePreset').click();for(let n=0;n<80;n++){const state=JSON.parse(await fs.readFile(path.join(dataDir,'main-scene-settings.json'),'utf8'));if(JSON.parse(state.entries[key]||'{}').presets?.length===1)break;await new Promise(r=>setTimeout(r,250));}
  console.log('Preset diagnostics',await page.evaluate(()=>({status:document.querySelector('#dragonStatus').textContent,save:document.querySelector('#sceneSaveStatus').textContent,record:JSON.parse(localStorage.getItem('qinhuai.dragon-wall-light.v1')).presets.length})));
  const disk=JSON.parse(await fs.readFile(path.join(dataDir,'main-scene-settings.json'),'utf8')),record=JSON.parse(disk.entries[key]);assert.equal(record.settings.parts.right.color,'#ff9d29');assert.equal(record.settings.parts.right.brightness,3);assert.equal(record.presets.length,1);
  await page.locator('#dragonReference').click();assert.equal(await page.locator('#dragonColorHex').inputValue(),'#ffb72e');assert.equal(await page.locator('#dragonPresets option').count(),1);await page.locator('#dragonApplyPreset').click();assert.equal(await page.locator('#dragonColorHex').inputValue(),'#ff9d29');
  await page.waitForTimeout(1200);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:240000});
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.dragonLighting.settings.parts.right.color),'#ff9d29');
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('day'));assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.dragonLighting.root.visible),false);
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('night'));assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.dragonLighting.root.visible),true);
  assert.deepEqual(errors,[]);await fs.writeFile('work/dragon-light-20261019/qa.json',JSON.stringify({ok:true,dataDir,revision:disk.revision,errors},null,2));console.log('PASS real WebGL dragon shader, per-part edits, preset save/apply, disk persistence, reload, day/night, no browser errors');
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
