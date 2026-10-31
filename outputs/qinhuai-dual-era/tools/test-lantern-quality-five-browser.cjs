const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/lantern-quality-five');
const url='http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&mode=orbit&view=gate&gateLight=gold&v=lantern-five-default-20261022';
(async()=>{
 const manifest=JSON.parse(await fs.readFile(path.join(root,'assets/lantern-quality/manifest.json'),'utf8'));
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--mute-audio','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],requests=[],cases=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>console.log('REQUEST FAILED',r.url(),r.failure()?.errorText));
 page.on('request',r=>{if(/\/assets\/(lantern-quality|lantern-near-half)\//.test(r.url()))requests.push(r.url());});
 page.on('console',m=>{if(m.type()==='error'&&/THREE|WebGL|shader/i.test(m.text()))errors.push(m.text());});
 // Old saved preferences must not silently select the former heavy default.
 await page.addInitScript(()=>{localStorage.setItem('qinhuai-near-lantern-quality-v1','half');});
 const ready=async()=>{
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__&&window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:180000});
  if(await page.locator('#storyPreview').isVisible())await page.locator('#storyPreview').click();
  if(await page.locator('#toolbarToggle').getAttribute('aria-expanded')==='false')await page.locator('#toolbarToggle').click();
 };
 const focus=async kind=>{
  await page.evaluate(async kind=>{
   const a=window.__QINHUAI_IMPORT__;a.setControlMode('orbit');
   let b;
   if(['green','blue','gold','red'].includes(kind)){
    await a.courtyardRacks.registerTile(9);a.courtyardRacks.root.visible=true;b=a.courtyardRacks.entries.get('rack-'+kind).meshes[0];
   }else if(['woman','fish','gongming','tengma'].includes(kind)){
    await a.featureLanterns.ensure(kind);b=a.featureLanterns.entries.get(kind).meshes.find(m=>m.userData.featureLantern);
   }else if(kind==='streetlamp')a.streetlamps.root.traverse(m=>{if(!b&&m.name==='Original four-lantern streetlamp')b=m;});
   else{
    await a.festivalLanterns.registerTile(['lion','mountain'].includes(kind)?9:6);
    const e=a.festivalLanterns.entries.get(kind);b=e.lod?.batches[0].mesh||e.batches.find(b=>b.mesh.userData.festivalKind).mesh;
   }
   if(!b)throw Error('Missing placed body '+kind);
   b.updateWorldMatrix(true,false);b.geometry.computeBoundingBox();const matrix=b.matrix.clone();b.getMatrixAt(0,matrix);
   const center=b.geometry.boundingBox.getCenter(b.position.clone()).applyMatrix4(matrix).applyMatrix4(b.matrixWorld);
   const offset=kind==='lion'?[.65,.35,1.6]:[.5,.2,.9];
   a.camera.position.copy(center).add(new (b.position.constructor)(...offset));a.orbit.target.copy(center);a.orbit.update();
  },kind);
 };
 const record=async(kind,mode)=>{
  await page.waitForFunction(({kind,mode})=>[...window.__QINHUAI_IMPORT__.nearLanternQuality.records.values()].some(r=>r.kind===kind&&r.mode===mode&&r.mesh.visible&&r.mesh.count>0),{kind,mode},{timeout:120000});
  return page.evaluate(kind=>{
   const a=window.__QINHUAI_IMPORT__,r=[...a.nearLanternQuality.records.values()].find(r=>r.kind===kind&&r.mesh.visible&&r.mesh.count>0);
   return {kind,mode:r.mode,triangles:r.mesh.geometry.index.count/3,sameMaterial:r.mesh.material===r.source.material,stats:a.nearLanternStats,sourceGeometry:r.source.geometry.index.count/3};
  },kind);
 };
 try{
  await page.goto(url,{waitUntil:'domcontentloaded'});await ready();console.log('Main ready; checking new default');
  const initial=await page.evaluate(()=>({mode:window.__QINHUAI_IMPORT__.nearLanternStats.mode,ui:document.querySelector('#nearLanternQuality').value,options:[...document.querySelector('#nearLanternQuality').options].map(o=>o.value)}));
  assert.equal(initial.mode,'five');assert.equal(initial.ui,'five');assert.deepEqual(initial.options,['five','half','original','current']);
  assert.ok(!requests.some(r=>r.includes('/original/')||r.includes('/lantern-near-half/')),'default does not request high-poly geometry');
  await focus('lion');let state=await record('lion','five');assert.equal(state.triangles,81059);assert.ok(state.sameMaterial);cases.push(state);
  await page.locator('#nearLanternQuality').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'main-five-lion.png')});
  await page.locator('#nearLanternQuality').selectOption('original');state=await record('lion','original');assert.equal(state.triangles,1621206);assert.ok(state.sameMaterial);cases.push(state);console.log('Actual original lion verified');
  await page.locator('#nearLanternQuality').selectOption('half');state=await record('lion','half');assert.equal(state.triangles,810603);cases.push(state);
  await page.locator('#nearLanternQuality').selectOption('five');state=await record('lion','five');assert.equal(state.triangles,81059);
  for(const kind of ['mountain','lotus-main','lotus-one','chrysanthemum','streetlamp','fish','woman','gongming','tengma','green','blue','gold','red']){
   await focus(kind);state=await record(kind,'five');assert.equal(state.triangles,manifest.models[kind].five.triangles);assert.ok(state.sameMaterial);assert.ok(state.stats.active<=12);assert.deepEqual(state.stats.errors,{});cases.push(state);console.log('PASS five '+kind+' '+state.triangles);
  }
  await focus('woman');await page.locator('#nearLanternQuality').selectOption('half');state=await record('woman','half');assert.equal(state.triangles,250000);cases.push(state);console.log('Prior woman 250k preserved');
  await page.locator('#nearLanternQuality').selectOption('current');assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.nearLanternQuality.records.size),0);
  await page.locator('#nearLanternQuality').selectOption('five');
  assert.equal(await page.evaluate(()=>localStorage.getItem('qinhuai-near-lantern-quality-v2')),'five');assert.equal(new URL(page.url()).searchParams.get('nearModels'),'five');
  await page.reload({waitUntil:'domcontentloaded'});await ready();assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.nearLanternStats.mode),'five');
  // Explicit stored selection survives without a query override.
  await page.locator('#nearLanternQuality').selectOption('current');await page.goto(url,{waitUntil:'domcontentloaded'});await ready();assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.nearLanternStats.mode),'current');
  await page.locator('#nearLanternQuality').selectOption('five');await focus('lion');await record('lion','five');
  const gpu=await page.evaluate(()=>{const gl=window.__QINHUAI_IMPORT__.renderer.getContext(),e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);});
  assert.deepEqual(errors,[]);
  await fs.writeFile(path.join(out,'browser-verification.json'),JSON.stringify({passed:true,initial,cases,requests,errors,gpu,persistence:true,scope:'Functional regression, not FPS benchmark'},null,2));
  console.log('PASS: all 14 placed kinds; default five; real original and prior half; prior woman 250k; material identity; resource release; persistence; no page/shader errors.');
 }catch(e){await fs.writeFile(path.join(out,'browser-failure.json'),JSON.stringify({error:e.message,errors,requests,cases,state:await page.evaluate(()=>({startup:window.__QINHUAI_STARTUP__?.phase,near:window.__QINHUAI_IMPORT__?.nearLanternStats}))},null,2));await page.screenshot({path:path.join(out,'failure.png')});throw e;}
 finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
