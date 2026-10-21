const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-golden-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 const out='work/golden-tree-lanterns-20261020';await fs.mkdir(out,{recursive:true});
 try{
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],failed=[],modelRequests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));page.on('request',r=>{if(r.url().includes('golden-lantern-lod.glb'))modelRequests.push(r.url());});
  await page.goto('http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:240000});
  const near=await page.evaluate(()=>window.__QINHUAI_IMPORT__.goldenLanternStats);console.log('near',near);assert.equal(near.lamps,53);assert.equal(near.trees,7);
  await page.getByRole('button',{name:'加载全部',exact:true}).click();
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.loadedTileIds.length===5&&document.querySelector('#status').textContent.includes('模式：全部'),null,{timeout:240000});
  const all=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__,g=a.goldenTreeLanterns;let lights=0,invalid=[];g.root.traverse(o=>{if(o.isLight)lights++;if(o.isInstancedMesh&&!Array.from(o.instanceMatrix.array).every(Number.isFinite))invalid.push(o.name);});return {stats:a.goldenLanternStats,restored:a.restoredStats,lights,invalid};});
  assert.equal(all.stats.lamps,53);assert.equal(all.stats.trees,7);assert.equal(all.stats.drawCalls,6);assert.deepEqual(all.stats.failures,{});assert.equal(all.lights,0);assert.deepEqual(all.invalid,[]);assert.equal(modelRequests.length,1);
  await page.evaluate(()=>document.querySelector('#toolbar').classList.add('is-collapsed'));
  async function capture(name){
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const png=await page.screenshot({path:out+'/'+name+'.png',timeout:60000});
   const pixels=await page.evaluate(async b64=>{const image=new Image();image.src='data:image/png;base64,'+b64;await image.decode();const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);const d=ctx.getImageData(0,0,c.width,c.height).data;let lit=0,golden=0;const colors=new Set();for(let i=0;i<d.length;i+=16){if(Math.max(d[i],d[i+1],d[i+2])>30)lit++;if(d[i]>90&&d[i+1]>45&&d[i]>d[i+2]*1.3)golden++;colors.add((d[i]>>4)*256+(d[i+1]>>4)*16+(d[i+2]>>4));}return {lit,golden,colors:colors.size};},png.toString('base64'));assert.ok(pixels.lit>2000);assert.ok(pixels.colors>40);return pixels;
  }
  const pixels={gate:await capture('gate-night')};
  await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.setControlMode('firstPerson');a.camera.position.set(-9,15,-9);a.camera.lookAt(-10,13.8,-13);});
  pixels.close=await capture('tree-close-night');
  const projected=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__,mounts=[...a.goldenTreeLanterns.tiles.values()].flatMap(t=>t.group.userData.mounts);return mounts.map(m=>{const p=m.top.clone().project(a.camera);return {tree:m.tree,x:p.x,y:p.y,z:p.z};}).filter(p=>p.z>-1&&p.z<1&&Math.abs(p.x)<1&&Math.abs(p.y)<1);});assert.ok(projected.length>=5);
  await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.camera.position.set(-2,14.8,-9.5);a.camera.lookAt(-.6,13.8,-13);});pixels.right=await capture('tree-right-night');
  await page.setViewportSize({width:390,height:844});pixels.mobile=await capture('tree-mobile-night');
  await page.setViewportSize({width:1280,height:800});
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('day'));
  assert.ok(await page.evaluate(()=>window.__QINHUAI_IMPORT__.goldenTreeLanterns.fabric.every(m=>m.emissiveIntensity===0)));pixels.day=await capture('tree-day');
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('night'));
  const wire=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__,box=document.querySelector('#wireframe');box.checked=true;box.dispatchEvent(new Event('change'));const result=a.goldenTreeLanterns.fabric.every(m=>m.wireframe&&m.emissiveIntensity===0);box.checked=false;box.dispatchEvent(new Event('change'));return result;});assert.ok(wire);
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  await fs.writeFile(out+'/browser.json',JSON.stringify({near,all,pixels,projected,wire,errors,failed,modelRequests},null,2));console.log('PASS',JSON.stringify({all,pixels,visibleClose:projected.length}));
 }finally{await browser?.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
