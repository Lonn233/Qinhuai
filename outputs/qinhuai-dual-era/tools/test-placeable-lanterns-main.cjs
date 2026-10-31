const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createServer}=require('../game/serve.cjs');
const key='qinhuai.scene-lantern-placements.v1',lightKey='qinhuai.main-lantern-lights.v1',out=path.resolve(__dirname,'../work/placeable-lanterns-20261022');
(async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-placed-main-')),server=createServer({dataDir:dir});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const errors=[];let page;
 try{
  page=await browser.newPage({viewport:{width:1280,height:900}});page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>Object.defineProperty(window,'devicePixelRatio',{get:()=>.35}));
  const url='http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?gateLight=gold&time=night&mode=orbit&view=gate';
  async function ready(){await page.waitForFunction(()=>document.querySelector('#storyPreview')?.disabled===false,null,{timeout:300000});await page.evaluate(()=>{const a=__QINHUAI_IMPORT__;a.setPerformanceProfile('low');a.renderer.setPixelRatio(.5);document.getElementById('storyPreview').click();});await page.waitForFunction(()=>__QINHUAI_IMPORT__.controlMode==='firstPerson',null,{timeout:120000});await page.evaluate(()=>__QINHUAI_IMPORT__.setControlMode('orbit'));await page.waitForFunction(()=>__QINHUAI_IMPORT__.placedLanterns.preview);}
  await page.goto(url,{waitUntil:'domcontentloaded'});await ready();console.log('Main scene preview ready');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),null);
  await page.evaluate(()=>{const a=__QINHUAI_IMPORT__;a.camera.position.set(0,30,20);a.orbit.target.set(0,0,0);a.orbit.update();document.getElementById('placedLanternPanel').open=true;document.getElementById('placed-lantern-add-center').click();});
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.placedLanterns.objects.size===1,null,{timeout:60000});
  console.log('Actual scene ground placement passed');
  await page.evaluate(()=>{const input=document.getElementById('placed-lantern-ry');input.value=47;input.dispatchEvent(new Event('change',{bubbles:true}));});
  await page.evaluate(()=>{
   const select=document.getElementById('lantern-group');select.value='column';select.dispatchEvent(new Event('change'));
   for(const [label,value] of [['灯体亮度 · 当前效果 ×数值',2.3],['外溢最远距离数值',7]]){const input=document.querySelector('[aria-label="'+label+'"]');input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}));}
   document.getElementById('lantern-spill-enabled').click();
  });
  const before=await page.evaluate(()=>({scene:__QINHUAI_IMPORT__.scene.uuid,record:__QINHUAI_IMPORT__.placedLanternControls.record,lighting:__QINHUAI_IMPORT__.lanternLighting.getSettings('column')}));
  assert.equal(before.record.instances[0].ry,47);
  assert.equal(before.record.instances[0].lighting,undefined);assert.equal(before.lighting.brightness,2.3);assert.equal(before.lighting.spill.distance,7);
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.nightLighting.environmentSpill.lanternChannels.some(c=>c.cacheKey.startsWith('placed-lantern|')),null,{timeout:30000});
  await page.evaluate(()=>__QINHUAI_SCENE_SAVE__.flush());
  await page.waitForFunction(async ({key,lightKey,record,lighting})=>{const data=await fetch('/api/main-scene-settings').then(r=>r.json());return data.entries?.[key]===JSON.stringify(record)&&JSON.stringify(JSON.parse(data.entries?.[lightKey]||'{}').groups?.column)===JSON.stringify(lighting);},{key,lightKey,record:before.record,lighting:before.lighting},{timeout:30000});
  const disk=JSON.parse(await fs.readFile(path.join(dir,'main-scene-settings.json'),'utf8'));assert.deepEqual(JSON.parse(disk.entries[key]),before.record);
  assert.deepEqual(JSON.parse(disk.entries[lightKey]).groups.column,before.lighting);
  await page.evaluate(()=>{const a=__QINHUAI_IMPORT__;a.placedLanternControls.select(a.placedLanternControls.record.instances[0].id);document.getElementById('placed-lantern-focus').click();});
  await page.screenshot({path:path.join(out,'main-preview.png'),timeout:90000});
  await page.evaluate(()=>{document.getElementById('storyBack').click();document.getElementById('storyStart').click();});
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.mode==='play'&&!__QINHUAI_IMPORT__.placedLanterns.preview,null,{timeout:300000});
  const play=await page.evaluate(()=>({scene:__QINHUAI_IMPORT__.scene.uuid,record:__QINHUAI_IMPORT__.placedLanternControls.record,objects:__QINHUAI_IMPORT__.placedLanterns.objects.size,helpers:__QINHUAI_IMPORT__.placedLanterns.helpers.visible}));
  assert.equal(play.scene,before.scene);assert.deepEqual(play.record,before.record);assert.equal(play.objects,1);assert.equal(play.helpers,false);
  assert.deepEqual(await page.evaluate(()=>__QINHUAI_IMPORT__.lanternLighting.getSettings('column')),before.lighting);
  await page.keyboard.press('KeyP');assert.deepEqual(await page.evaluate(()=>__QINHUAI_IMPORT__.placedLanternControls.record),before.record);
  console.log('Play shares scene and blocks placement edits');
  await page.evaluate(()=>{document.getElementById('storyBack').click();document.getElementById('storyPreview').click();});
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.mode==='preview');await page.evaluate(()=>__QINHUAI_IMPORT__.setControlMode('orbit'));
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.placedLanterns.preview);assert.deepEqual(await page.evaluate(()=>__QINHUAI_IMPORT__.placedLanternControls.record),before.record);
  const context=await browser.newContext({viewport:{width:1280,height:900}});await page.close();page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>Object.defineProperty(window,'devicePixelRatio',{get:()=>.35}));await page.goto(url,{waitUntil:'domcontentloaded'});await ready();
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.placedLanterns.objects.size===1,null,{timeout:60000});
  assert.deepEqual(await page.evaluate(()=>__QINHUAI_IMPORT__.placedLanternControls.record),before.record);
  assert.deepEqual(await page.evaluate(()=>__QINHUAI_IMPORT__.lanternLighting.getSettings('column')),before.lighting);
  assert.deepEqual(errors,[]);await fs.writeFile(path.join(out,'main.json'),JSON.stringify({before,play,errors,dataDir:dir},null,2));
  console.log('PASS full scene ground placement, numeric rotation, file save, shared preview/play, edit guard, clean-browser disk restore');
 }catch(error){if(page){console.error(await page.evaluate(async ({key,lightKey})=>({startup:window.__QINHUAI_STARTUP__,status:document.getElementById('placed-lantern-status')?.textContent,save:document.getElementById('sceneSaveStatus')?.textContent,record:window.__QINHUAI_IMPORT__?.placedLanternControls.record,local:localStorage.getItem(key),lighting:localStorage.getItem(lightKey),remote:await fetch('/api/main-scene-settings').then(r=>r.json())}),{key,lightKey}).catch(()=>null));await page.screenshot({path:path.join(out,'main-failure.png'),timeout:90000}).catch(()=>{});}throw error;}
 finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
