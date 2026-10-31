const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/near-lantern-quality');
(async()=>{
 await fs.mkdir(out,{recursive:true});const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--mute-audio','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/assets/lantern-near-half/'))requests.push(r.url());});
 page.on('console',m=>{if(m.type()==='error'&&/THREE|WebGL|shader/i.test(m.text()))errors.push(m.text());});
 try{
  await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&mode=orbit&view=gate&gateLight=gold&nearModels=current&v=lantern-five-default-20261022',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.festivalLanterns.entries.get('lion')?.lod,null,{timeout:120000});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__.phase==='场景已加载',null,{timeout:180000});console.log('Scene ready');
  assert.equal(requests.length,0,'explicit old lightweight mode does not download heavy models');
  await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.setControlMode('orbit');const b=a.festivalLanterns.entries.get('lion').lod.batches[0].mesh,m=b.matrix.clone();b.getMatrixAt(0,m);b.updateWorldMatrix(true,false);const center=b.geometry.boundingBox.getCenter(b.position.clone()).applyMatrix4(m).applyMatrix4(b.matrixWorld);a.camera.position.copy(center).add(new (b.position.constructor)(.65,.35,1.6));a.orbit.target.copy(center);a.orbit.update();});
  await page.waitForTimeout(1000);await page.screenshot({path:path.join(out,'main-current.png')});
  await page.locator('#nearLanternQuality').selectOption('half');console.log('Selected half');
  await page.waitForFunction(()=>{const s=window.__QINHUAI_IMPORT__.nearLanternStats;return s.active>0&&s.cachedKinds.includes('lion')&&!s.loading;},null,{timeout:120000});
  await page.waitForFunction(()=>{const n=window.__QINHUAI_IMPORT__.nearLanternStats.active;return n>0&&document.querySelector('#nearLanternStatus').textContent.includes(`当前 ${n}/12`);});
  const active=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;const gl=a.renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');return {stats:a.nearLanternStats,gpu:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),models:[...a.nearLanternQuality.records.values()].filter(r=>r.mesh.visible).map(r=>({kind:r.kind,count:r.mesh.count,triangles:r.mesh.geometry.index.count/3,sameMaterial:r.source.material===r.mesh.material})),restored:a.festivalLanterns.entries.get('lion').lod.batches.map(b=>b.mesh.count),text:document.querySelector('#nearLanternStatus').textContent};});
  assert.ok(active.stats.active<=12);assert.equal(active.stats.errors&&Object.keys(active.stats.errors).length,0);assert.ok(active.models.some(m=>m.kind==='lion'&&m.triangles===810603));assert.ok(active.models.every(m=>m.sameMaterial));
  await page.locator('#nearLanternQuality').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(out,'main-half.png')});
  await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.camera.position.set(200,100,200);a.orbit.target.set(200,101,200);a.orbit.update();});
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.nearLanternStats.active===0,null,{timeout:60000,polling:200});console.log('Near/far passed');
  await page.locator('#nearLanternQuality').selectOption('current');
  const off=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;return {stats:a.nearLanternStats,visible:[...a.nearLanternQuality.records.values()].filter(r=>r.mesh.visible).length};});assert.equal(off.visible,0);
  const cases=[];
  for(const kind of ['streetlamp','lotus-one','gongming','gold']){console.log('Checking '+kind);
    await page.evaluate(async kind=>{
      const a=window.__QINHUAI_IMPORT__;a.setNearLanternQuality('current');
      if(kind==='gold'){await a.courtyardRacks.registerTile(9);a.courtyardRacks.root.visible=true;}
      if(kind==='gongming')await a.featureLanterns.ensure('gongming');
      if(kind==='lotus-one')await a.festivalLanterns.registerTile(6);
      let b;
      if(kind==='streetlamp')a.streetlamps.root.traverse(m=>{if(!b&&m.name==='Original four-lantern streetlamp')b=m;});
      else if(kind==='gold')b=a.courtyardRacks.entries.get('rack-gold').meshes[0];
      else if(kind==='gongming')b=a.featureLanterns.entries.get(kind).meshes[0];
      else b=a.festivalLanterns.entries.get(kind).batches[0].mesh;
      if(!b)throw Error('Missing body '+kind);
      b.updateWorldMatrix(true,false);b.geometry.computeBoundingBox();const m=b.matrix.clone();b.getMatrixAt(0,m);
      const center=b.geometry.boundingBox.getCenter(b.position.clone()).applyMatrix4(m).applyMatrix4(b.matrixWorld);
      a.camera.position.copy(center).add(new (b.position.constructor)(.15,.12,.3));a.orbit.target.copy(center);a.orbit.update();a.setNearLanternQuality('half');
    },kind);
    await page.waitForFunction(kind=>[...window.__QINHUAI_IMPORT__.nearLanternQuality.records.values()].some(r=>r.kind===kind&&r.mesh.visible&&r.mesh.count>0),kind,{timeout:120000});
    const state=await page.evaluate(kind=>{const a=window.__QINHUAI_IMPORT__,records=[...a.nearLanternQuality.records.values()].filter(r=>r.kind===kind&&r.mesh.visible);return {kind,stats:a.nearLanternStats,bodies:records.map(r=>({triangles:r.mesh.geometry.index.count/3,sameMaterial:r.mesh.material===r.source.material,parent:r.mesh.parent===r.source,count:r.mesh.count,bounds:r.mesh.geometry.boundingBox.getSize(r.mesh.position.clone()).toArray()}))};},kind);
    assert.ok(state.stats.active<=12);assert.ok(state.bodies.length);assert.ok(state.bodies.every(b=>b.sameMaterial&&b.parent));assert.deepEqual(state.stats.errors,{});cases.push(state);await page.screenshot({path:path.join(out,`main-half-${kind}.png`)});console.log('Verified '+kind);
  }
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setNearLanternQuality('current'));
  const stored=await page.evaluate(()=>localStorage.getItem('qinhuai-near-lantern-quality-v2'));assert.equal(stored,'current');
  assert.deepEqual(errors,[]);await fs.writeFile(path.join(out,'browser-report.json'),JSON.stringify({active,off,cases,requests,errors},null,2));console.log('PASS main scene: UI switch, explicit lightweight mode/lazy load, real half lion, material identity, near/far, restored LOD, off mode, persistence and no runtime/shader errors.');console.log(JSON.stringify({active,requests,errors},null,2));
 }catch(e){console.error('Failure snapshot',await page.evaluate(()=>({startup:window.__QINHUAI_STARTUP__,progress:document.querySelector('#progressText')?.textContent,near:window.__QINHUAI_IMPORT__?.nearLanternStats,control:window.__QINHUAI_IMPORT__?.controlMode})));console.error('Page errors',errors);await page.screenshot({path:path.join(out,'failure.png')});throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
