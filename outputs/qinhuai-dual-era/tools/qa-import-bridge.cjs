const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-bridge-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[],key='qinhuai.main-building-lights.v1';page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.addInitScript(()=>{if(!localStorage.getItem('bridge-qa')){localStorage.setItem('qinhuai.main-building-lights.v1',JSON.stringify({version:1,unknown:'preserve',buildings:{gate:{brightness:.7,unknown:'keep'}},presets:[{id:'old-gate',building:'gate',name:'旧收藏',settings:{brightness:.7}}]}));localStorage.setItem('bridge-qa','yes');}});
 try{
  await page.goto('http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?time=night&view=bridge&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:240000});assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__.error),null);
  console.log('Scene loaded');
  await page.locator('#environment-auto-focus').uncheck();await page.locator('#environment-building').selectOption('bridge-riverfront');
  assert.equal(await page.locator('#building-module-bridgeRail').getAttribute('open'),null);assert.equal(await page.locator('#environmentSpillPanel').getAttribute('open'),null);
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.nightLighting.bridgeMaterials.length),9);
  await page.locator('#building-module-bridgeRail summary').click();await page.locator('#environment-building').scrollIntoViewIfNeeded();
  await fs.mkdir('work/bridge-light-20261019',{recursive:true});await page.screenshot({path:'work/bridge-light-20261019/reference-preset.png'});
  await page.locator('#building-bridgeRail-brightness-value').fill('1.6');await page.locator('#building-bridgeRail-brightness-value').dispatchEvent('input');await page.locator('#building-bridgeRail-hex').fill('#77aaff');await page.locator('#building-bridgeRail-hex').press('Tab');
  await page.locator('#buildingLightPresets summary').click();await page.locator('#buildingLightName').fill('桥栏冷蓝测试');await page.locator('#buildingLightSave').click();
  let disk;for(let n=0;n<100;n++){try{disk=JSON.parse(await fs.readFile(path.join(dataDir,'main-scene-settings.json'),'utf8'));if(JSON.parse(disk.entries[key]||'{}').presets?.length===2)break;}catch{}await page.waitForTimeout(250);}
  const saved=JSON.parse(disk.entries[key]);assert.equal(saved.unknown,'preserve');assert.equal(saved.buildings.gate.unknown,'keep');assert.equal(saved.presets[0].id,'old-gate');assert.equal(saved.buildings['bridge-riverfront'].parts.bridgeRail.color,'#77aaff');
  await page.locator('#buildingBridgePreset').click();assert.equal(await page.locator('#building-bridgeRail-brightness-value').inputValue(),'1');assert.equal(await page.locator('#buildingLightSaved option').count(),1);await page.locator('#buildingLightApply').click();
  await page.waitForTimeout(1300);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:240000});
  await page.locator('#environment-auto-focus').uncheck();await page.locator('#environment-building').selectOption('bridge-riverfront');assert.equal(await page.locator('#building-bridgeRail-brightness-value').inputValue(),'1.6');
  const runtime=await page.evaluate(()=>{const rig=window.__QINHUAI_IMPORT__.nightLighting;const before=rig.buildingAdjustments.getUniform('bridge-riverfront','bridgeBody').value.toArray();rig.buildingAdjustments.setSettings('bridge-riverfront',{parts:{bridgeRail:{enabled:false}}});const batch=rig.waterReflections.batches.flatMap(b=>b.sources.map((s,i)=>({s,p:b.mesh.geometry.attributes.sourcePower.getX(i)}))).filter(x=>x.s.style==='bridge');const binding=rig.bindings.find(b=>b.mesh.name==='FuziTemple0307');window.__QINHUAI_IMPORT__.setTimeOfDay('day');const restored=binding.mesh.material===binding.day;window.__QINHUAI_IMPORT__.setTimeOfDay('night');return {before,rail:rig.buildingAdjustments.getUniform('bridge-riverfront','bridgeRail').value.toArray(),body:rig.buildingAdjustments.getUniform('bridge-riverfront','bridgeBody').value.toArray(),restored,reflections:batch.length,railReflectionsOff:batch.filter(x=>x.s.role==='bridgeRail').every(x=>x.p===0)};});
  assert.equal(runtime.rail[0],0);assert.equal(runtime.body[0],1);assert.ok(runtime.restored);assert.ok(runtime.reflections>0);assert.ok(runtime.railReflectionsOff);
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.focusEnvironmentBuilding('bridge-riverfront'));await page.screenshot({path:'work/bridge-light-20261019/focused.png'});assert.deepEqual(errors,[]);
  await fs.writeFile('work/bridge-light-20261019/qa.json',JSON.stringify({ok:true,errors,dataDir,runtime},null,2));console.log('PASS bridge shaders, UI, preset, persistence/reload, previous data, independent parts, day/night, reflection controls');
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
