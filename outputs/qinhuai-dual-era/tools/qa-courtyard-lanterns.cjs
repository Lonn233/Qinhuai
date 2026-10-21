const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-courtyard-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;const out='work/courtyard-lanterns-20261020';await fs.mkdir(out,{recursive:true});
 try{
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],failed=[],modelRequests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));page.on('request',r=>{if(r.url().includes('golden-lantern-lod.glb'))modelRequests.push(r.url());});
  await page.goto('http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?time=night&view=courtyard&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:240000});
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.courtyardLanternStats.ready,null,{timeout:120000});
  const stats=await page.evaluate(()=>({courtyard:window.__QINHUAI_IMPORT__.courtyardLanternStats,original:window.__QINHUAI_IMPORT__.goldenLanternStats}));console.log('loaded',stats);assert.equal(stats.courtyard.trees,8);assert.equal(stats.courtyard.lamps,216);assert.equal(stats.courtyard.nets,2);assert.equal(stats.original.lamps,53);assert.equal(modelRequests.length,1);
  await page.locator('#toolbarToggle').click();
  async function capture(name){
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const png=await page.screenshot({path:out+'/'+name+'.png',timeout:60000});
   const pixels=await page.evaluate(async b64=>{const im=new Image();im.src='data:image/png;base64,'+b64;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);const d=ctx.getImageData(0,0,c.width,c.height).data;let lit=0,golden=0;const colors=new Set();for(let i=0;i<d.length;i+=16){if(Math.max(d[i],d[i+1],d[i+2])>30)lit++;if(d[i]>90&&d[i+1]>45&&d[i]>d[i+2]*1.3)golden++;colors.add((d[i]>>4)*256+(d[i+1]>>4)*16+(d[i+2]>>4));}return {lit,golden,colors:colors.size};},png.toString('base64'));assert.ok(pixels.lit>2000);assert.ok(pixels.colors>40);return pixels;
  }
  const pixels={elevated:await capture('courtyard-elevated-night')};
  await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.setControlMode('firstPerson');a.camera.position.set(-5.55,12.7,-27);a.camera.lookAt(-5.55,13.5,-38);});pixels.front=await capture('courtyard-front-night');
  await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.camera.position.set(-6.9,14,-28);a.camera.lookAt(-10.3,13.6,-30.3);});pixels.close=await capture('courtyard-net-close-night');
  const projected=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;return a.courtyardLanterns.root.userData.mounts.map(m=>{const p=m.top.clone().project(a.camera);return {kind:m.kind,x:p.x,y:p.y,z:p.z};}).filter(p=>p.z>-1&&p.z<1&&Math.abs(p.x)<1&&Math.abs(p.y)<1);});assert.ok(projected.length>20);
  await page.setViewportSize({width:390,height:844});pixels.mobile=await capture('courtyard-mobile-night');
  await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('day'));pixels.day=await capture('courtyard-net-day');assert.ok(await page.evaluate(()=>!window.__QINHUAI_IMPORT__.courtyardLanterns.halo.visible));
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);await fs.writeFile(out+'/browser.json',JSON.stringify({stats,pixels,projected,errors,failed,modelRequests},null,2));console.log('PASS',JSON.stringify({stats,pixels,visibleClose:projected.length}));
 }finally{await browser?.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
