const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-restoration-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));
 const out='work/restored-proxies-20261020';await fs.mkdir(out,{recursive:true});
 try{
  await page.goto('http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:240000});
  console.log('near',await page.evaluate(()=>window.__QINHUAI_IMPORT__.restoredStats));
  await page.getByRole('button',{name:'加载全部',exact:true}).click();
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.loadedTileIds.length===5&&document.querySelector('#status').textContent.includes('模式：全部'),null,{timeout:240000});
  const snapshot=await page.evaluate(async()=>{
   const a=window.__QINHUAI_IMPORT__,before=a.restoredStats;
   await Promise.all(a.loadedTileIds.map(id=>a.restoredProxies.registerTile(id)));
   const invalid=[],bounds=[];let visible=0;
   a.restoredProxies.root.traverse(o=>{if(!o.isInstancedMesh)return;visible+=o.count;const b=o.boundingBox;bounds.push({name:o.name,kind:o.userData.kind,count:o.count,min:b.min.toArray(),max:b.max.toArray()});if(![...b.min.toArray(),...b.max.toArray()].every(Number.isFinite))invalid.push(o.name);});
   return {before,after:a.restoredStats,bounds,invalid,visible,loaded:a.loadedTileIds,render:a.renderer.info.render};
  });
  assert.equal(snapshot.after.instances,1546);assert.equal(snapshot.after.prototypes,61);assert.equal(snapshot.before.instances,snapshot.after.instances);assert.equal(snapshot.invalid.length,0);assert.deepEqual(snapshot.after.failures,{});
  await page.evaluate(()=>{document.querySelector('#toolbar').classList.add('is-collapsed');});
  await page.screenshot({path:out+'/gate-night.png',timeout:60000});
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.focusNightView('temple'));
  await page.screenshot({path:out+'/temple-night.png',timeout:60000});
  await page.evaluate(async()=>{const a=window.__QINHUAI_IMPORT__;await a.setTimeOfDay('day');a.setControlMode('firstPerson');a.camera.position.set(28,19,48);a.camera.lookAt(14,12.5,43);});
  await page.screenshot({path:out+'/trees-day.png',timeout:60000});
  await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.camera.position.set(-10,17,-4);a.camera.lookAt(-10,12,-14);});
  await page.screenshot({path:out+'/plants-day.png',timeout:60000});
  const wire=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__,box=document.querySelector('#wireframe');box.checked=true;box.dispatchEvent(new Event('change'));const result=[...a.restoredProxies.materials].every(m=>m.wireframe);box.checked=false;box.dispatchEvent(new Event('change'));return result;});assert.ok(wire);
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  await fs.writeFile(out+'/browser.json',JSON.stringify({snapshot,wire,errors,failed},null,2));console.log('PASS',snapshot.after);
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
