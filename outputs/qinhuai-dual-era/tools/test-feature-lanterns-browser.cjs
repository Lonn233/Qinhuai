const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-dev-shm-usage']});
 try {
  const page = await browser.newPage({viewport:{width:1440,height:960}});
  const errors = [];
  const failures = [];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('requestfailed',request=>failures.push({url:request.url(),error:request.failure()?.errorText}));
  await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold');
  try {
   await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'||window.__QINHUAI_STARTUP__?.error,null,{timeout:120000});
   assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__?.error),null);
  } catch(error) {
   console.error(JSON.stringify({startup:await page.evaluate(()=>window.__QINHUAI_STARTUP__),errors,failures},null,2));
   throw error;
  }
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.featureLanterns.stats.fish===0&&window.__QINHUAI_IMPORT__?.featureLanterns.stats.woman===1&&window.__QINHUAI_IMPORT__?.bridgeLanterns.stats.ready,null,{timeout:120000});
  const ui = await page.evaluate(async()=>{
   const {mountBuildingControls,BUILDING_LIGHT_KEY}=await import('/import-building-controls.mjs');
   const initial={version:1,future:'keep',buildings:{'matou-north-west':{future:7},other:{brightness:2}},presets:[{id:'old',name:'原收藏',building:'matou-north-west',settings:{brightness:.5}}]};
   const map=new Map([[BUILDING_LIGHT_KEY,JSON.stringify(initial)]]);
   const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
   const applied=[];
   const rig={loadSettings(){},getParts:()=>['window'],setSettings:(id,s)=>applied.push([id,s.redLanterns.enabled])};
   const lanterns={loadBuildingSettings(){},supportsBuilding:id=>id==='matou-north-west',setBuildingSettings(){}};
   // Detached DOM avoids the real scene's autosave listeners and localStorage.
   const host=document.createElement('div'),controls=mountBuildingControls(host,{rig,storage,redLanterns:lanterns});
   controls.select('matou-north-west');
   const checkbox=host.querySelector('#building-red-lanterns-enabled');
   checkbox.checked=false;checkbox.dispatchEvent(new Event('change'));
   host.querySelector('#buildingLightName').value='关闭红灯笼';host.querySelector('#buildingLightSave').click();
   const saved=JSON.parse(map.get(BUILDING_LIGHT_KEY)),newPreset=saved.presets.at(-1).id;
   checkbox.checked=true;checkbox.dispatchEvent(new Event('change'));
   host.querySelector('#buildingLightSaved').value=newPreset;host.querySelector('#buildingLightApply').click();
   controls.reload();
   const restored=checkbox.checked;
   controls.select('gate');
   return {restored,unsupportedHidden:host.querySelector('#buildingRedLanterns').hidden,record:JSON.parse(map.get(BUILDING_LIGHT_KEY)),applied};
  });
  assert.equal(ui.restored,false);assert.equal(ui.unsupportedHidden,true);
  assert.equal(ui.record.future,'keep');assert.equal(ui.record.buildings.other.brightness,2);
  assert.equal(ui.record.buildings['matou-north-west'].future,7);
  assert.equal(ui.record.presets.length,2);assert.equal(ui.record.presets[0].id,'old');
  assert.equal(ui.record.presets[1].settings.redLanterns.enabled,false);
  const out='work/festival-placement';fs.mkdirSync(out,{recursive:true});
  await page.evaluate(async()=>{document.querySelector('#toolbar').classList.add('is-collapsed');document.querySelector('#toolbarContent').hidden=true;const a=window.__QINHUAI_IMPORT__;await a.focusNightView('gate');a.camera.position.set(-5.42,12.8,-17);});
  await page.waitForTimeout(1500);await page.screenshot({path:out+'/gate-verified.png'});
  await page.evaluate(async()=>{const a=window.__QINHUAI_IMPORT__;await a.focusNightView('dragonWall');a.camera.position.set(-21,14,-5);});
  await page.waitForTimeout(1500);await page.screenshot({path:out+'/woman-verified.png'});
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.focusNightView('redLanterns'));
  await page.waitForTimeout(1500);await page.screenshot({path:out+'/red-lanterns-verified.png'});
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.focusNightView('gate'));
  await page.waitForTimeout(1500);await page.screenshot({path:out+'/mobile-verified.png'});
  const pixels=await page.evaluate(()=>{const {renderer,scene,camera}=window.__QINHUAI_IMPORT__;renderer.render(scene,camera);const gl=renderer.getContext(),w=gl.drawingBufferWidth,h=gl.drawingBufferHeight,data=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,data);let lit=0;for(let i=0;i<data.length;i+=4)if(data[i]+data[i+1]+data[i+2]>45)lit++;return {width:w,height:h,litRatio:lit/(w*h)};});
  assert.ok(pixels.litRatio>.03,'Canvas must show nonblank scene');assert.deepEqual(errors,[]);
  console.log(JSON.stringify({ui,pixels,errors},null,2));
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
