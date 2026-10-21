const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-gate-ground-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[],key='qinhuai.main-building-lights.v1';page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.addInitScript(()=>{if(!localStorage.getItem('gate-ground-qa')){localStorage.setItem('qinhuai.main-building-lights.v1',JSON.stringify({version:1,unknown:'preserve',buildings:{gate:{unknown:'keep',parts:{eave:{brightness:.9}}},'bridge-riverfront':{brightness:.8}},presets:[{id:'old-gate',building:'gate',name:'旧牌坊收藏',settings:{brightness:1,unknown:'keep'}}]}));localStorage.setItem('gate-ground-qa','yes');}});
 try{
  await page.goto('http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:240000});assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__.error),null);console.log('Scene loaded');
  await page.locator('#environment-auto-focus').uncheck();await page.locator('#environment-building').selectOption('gate');
  assert.equal(await page.locator('#buildingGateGround').getAttribute('open'),null);
  await page.locator('#buildingGateGround summary').click();await page.locator('#buildingGateGround').scrollIntoViewIfNeeded();
  await fs.mkdir('work/gate-ground-20261019',{recursive:true});await page.screenshot({path:'work/gate-ground-20261019/preset.png'});
  const sample=()=>page.evaluate(()=>{const r=window.__QINHUAI_IMPORT__.nightLighting.environmentSpill;r.update();const b=r.uniforms.envAtlasBounds.value,n=1024,x=Math.floor((-5.24-b.x)/b.z*n),z=Math.floor((-13.46-b.y)/b.w*n),i=(z*n+x)*3;return Array.from(r.accum.slice(i,i+3));});
  const on=await sample();await page.locator('#gate-ground-enabled').uncheck();const off=await sample();assert.ok(on[0]>off[0]+1);await page.screenshot({path:'work/gate-ground-20261019/off.png'});
  await page.locator('#gate-ground-enabled').check();await page.locator('#gate-ground-intensity-value').fill('2.4');await page.locator('#gate-ground-intensity-value').dispatchEvent('input');await page.locator('#gate-ground-hex').fill('#66aaff');await page.locator('#gate-ground-hex').press('Tab');await page.locator('#gate-ground-offsetX-value').fill('-1.2');await page.locator('#gate-ground-offsetX-value').dispatchEvent('input');
  await page.locator('#buildingLightPresets summary').click();await page.locator('#buildingLightName').fill('门下蓝色测试');await page.locator('#buildingLightSave').click();
  let disk;for(let n=0;n<100;n++){try{disk=JSON.parse(await fs.readFile(path.join(dataDir,'main-scene-settings.json'),'utf8'));if(JSON.parse(disk.entries[key]||'{}').presets?.length===2)break;}catch{}await page.waitForTimeout(250);}
  const saved=JSON.parse(disk.entries[key]);assert.equal(saved.buildings.gate.groundProjection.color,'#66aaff');assert.equal(saved.buildings.gate.unknown,'keep');assert.equal(saved.buildings.gate.parts.eave.brightness,.9);assert.equal(saved.buildings['bridge-riverfront'].brightness,.8);assert.equal(saved.unknown,'preserve');assert.equal(saved.presets[0].id,'old-gate');
  await page.locator('#gate-ground-preset').click();assert.equal(await page.locator('#gate-ground-color').inputValue(),'#ffb85c');assert.equal(await page.locator('#buildingLightSaved option').count(),2);await page.locator('#buildingLightApply').click();assert.equal(await page.locator('#gate-ground-color').inputValue(),'#66aaff');
  await page.waitForTimeout(1300);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:240000});await page.locator('#environment-auto-focus').uncheck();await page.locator('#environment-building').selectOption('gate');assert.equal(await page.locator('#gate-ground-color').inputValue(),'#66aaff');assert.equal(await page.locator('#gate-ground-offsetX-value').inputValue(),'-1.2');
  await page.locator('#environment-building').selectOption('bridge-riverfront');assert.ok(await page.locator('#buildingGateGround').isHidden());
  assert.deepEqual(errors,[]);await fs.writeFile('work/gate-ground-20261019/qa.json',JSON.stringify({ok:true,errors,dataDir,on,off},null,2));console.log('PASS actual gate ground illumination, controls, preset, named save, refresh restore, prior data preserved');
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
