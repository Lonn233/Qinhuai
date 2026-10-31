const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'work/woman-decimation-study');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--mute-audio','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(r.url().includes('/assets/lantern-near-half/woman.glb'))requests.push(r.url());});
 try{
  await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&mode=orbit&view=gate&nearModels=current&v=woman-250k-20261022',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.featureLanterns&&window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:180000});
  console.log('Main scene ready');
  await page.evaluate(async()=>{
   const a=window.__QINHUAI_IMPORT__;a.setControlMode('orbit');await a.featureLanterns.ensure('woman');
   const b=a.featureLanterns.entries.get('woman').meshes.find(m=>m.userData.featureLantern==='woman');
   b.updateWorldMatrix(true,false);b.geometry.computeBoundingBox();const m=b.matrix.clone();b.getMatrixAt(0,m);
   const center=b.geometry.boundingBox.getCenter(b.position.clone()).applyMatrix4(m).applyMatrix4(b.matrixWorld);
   a.camera.position.copy(center).add(new (b.position.constructor)(.7,.18,1.0));a.orbit.target.copy(center);a.orbit.update();a.setNearLanternQuality('half');
  });
  await page.waitForFunction(()=>[...window.__QINHUAI_IMPORT__.nearLanternQuality.records.values()].some(r=>r.kind==='woman'&&r.mesh.visible&&r.mesh.count>0),null,{timeout:120000});
  const result=await page.evaluate(()=>{
   const a=window.__QINHUAI_IMPORT__,r=[...a.nearLanternQuality.records.values()].find(r=>r.kind==='woman'&&r.mesh.visible),e=a.featureLanterns.entries.get('woman');
   return {triangles:r.mesh.geometry.index.count/3,sameMaterial:r.mesh.material===r.source.material,sourceTriangles:r.source.geometry.index.count/3,reflectionTriangles:e.meshes.find(m=>m.name.endsWith('reflection')).geometry.index.count/3,stats:a.nearLanternStats,label:document.querySelector('#nearLanternQuality option[value=half]').textContent};
  });
  assert.equal(result.triangles,250000);assert.ok(result.sameMaterial);assert.equal(result.reflectionTriangles,result.sourceTriangles);assert.match(result.label,/女灯25万面/);
  assert.deepEqual(result.stats.errors,{});assert.ok(requests.some(u=>u.includes('v=woman-250k-20261022')));
  await page.screenshot({path:path.join(out,'main-woman-250k.png')});
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setNearLanternQuality('current'));
  const restored=await page.evaluate(()=>[...window.__QINHUAI_IMPORT__.nearLanternQuality.records.values()].every(r=>!r.mesh.visible));assert.ok(restored);
  assert.deepEqual(errors,[]);
  await fs.writeFile(path.join(out,'main-integration-verification.json'),JSON.stringify({result,requests,errors,restored,scope:'Functional regression, not an FPS benchmark'},null,2));
  console.log('PASS: actual 250000 near triangles, original production material, lightweight reflection, toggle fallback, versioned request.');
  console.log(JSON.stringify(result,null,2));
 }catch(e){console.error('Snapshot',await page.evaluate(()=>({progress:document.querySelector('#progressText')?.textContent,startup:window.__QINHUAI_STARTUP__?.phase,near:window.__QINHUAI_IMPORT__?.nearLanternStats,errors:document.querySelector('#errors')?.textContent})));throw e;}
 finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
