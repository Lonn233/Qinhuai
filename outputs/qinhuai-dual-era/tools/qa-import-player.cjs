const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-player-')),server=createServer({dataDir});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const out='work/player-20261020';await fs.mkdir(out,{recursive:true});let browser;
 try{
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],failed=[],report={};
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://127.0.0.1:'+server.address().port+'/qinhuai-modern-import.html?time=night&view=courtyard&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载'&&window.__QINHUAI_IMPORT__?.playerStats.ready,null,{timeout:240000});
  console.log('Scene and student ready');
  report.receivers=await page.evaluate(()=>{const materials=new Set();window.__QINHUAI_IMPORT__.player.avatar.traverse(o=>{if(o.isMesh)for(const m of [o.material].flat())materials.add(m);});return [...materials].map(m=>({receiver:m.userData.environmentReceiver===true,textured:!!m.map}));});
  assert.ok(report.receivers.length>0);assert.ok(report.receivers.every(m=>m.receiver&&m.textured));
  report.assets=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;return {player:a.playerStats,restored:a.restoredStats,courtyard:a.courtyardLanternStats,golden:a.goldenLanternStats};});
  assert.ok(report.assets.restored.excluded>0);assert.equal(report.assets.courtyard.trees,8);assert.equal(report.assets.courtyard.lamps,216);assert.equal(report.assets.golden.lamps,53);
  await page.locator('#thirdPersonMode').click();
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.playerStats.mode==='thirdPerson');
  report.thirdPerson=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__,p=a.player;return {stats:p.stats,visible:p.root.visible,camera:a.camera.position.toArray(),bones:(()=>{let n=0;p.avatar.traverse(o=>{if(o.isBone)n++;});return n;})()};});
  assert.equal(report.thirdPerson.stats.pitchDegrees,45);assert.ok(report.thirdPerson.visible);assert.ok(report.thirdPerson.bones>40);
  const start=report.thirdPerson.stats.position;
  await page.keyboard.down('w');await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.playerStats.animation==='Walking',null,{timeout:30000});
  await page.waitForFunction(p=>{const v=window.__QINHUAI_IMPORT__.player.position;return Math.hypot(v.x-p[0],v.z-p[2])>.08;},start,{timeout:60000});
  report.walk=await page.evaluate(()=>window.__QINHUAI_IMPORT__.playerStats);
  await page.keyboard.down('Shift');await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.playerStats.animation==='Running',null,{timeout:30000});
  report.run=await page.evaluate(()=>window.__QINHUAI_IMPORT__.playerStats);
  await page.keyboard.up('Shift');await page.keyboard.up('w');
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.playerStats.animation==='Idle',null,{timeout:60000});
  const position=await page.evaluate(()=>window.__QINHUAI_IMPORT__.player.position.toArray());
  await page.locator('#firstPersonMode').click();report.firstPerson=await page.evaluate(()=>{const p=window.__QINHUAI_IMPORT__.player;return {stats:p.stats,visible:p.root.visible};});
  // Input release can coast slightly before the browser dispatches the click.
  assert.ok(Math.hypot(...position.map((v,i)=>v-report.firstPerson.stats.position[i]))<.003);assert.equal(report.firstPerson.visible,false);
  await page.locator('#thirdPersonMode').click();assert.deepEqual(await page.evaluate(()=>window.__QINHUAI_IMPORT__.player.position.toArray()),report.firstPerson.stats.position);
  await page.locator('#toolbarToggle').click();
  async function capture(name){
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const png=await page.screenshot({path:out+'/'+name+'.png',timeout:90000});
   return page.evaluate(async b64=>{const im=new Image();im.src='data:image/png;base64,'+b64;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);const d=ctx.getImageData(0,0,c.width,c.height).data,colors=new Set();let lit=0;for(let i=0;i<d.length;i+=16){if(Math.max(d[i],d[i+1],d[i+2])>30)lit++;colors.add((d[i]>>4)*256+(d[i+1]>>4)*16+(d[i+2]>>4));}return {lit,colors:colors.size};},png.toString('base64'));
  }
  report.pixels={night:await capture('student-third-person-night')};
  const yaw=await page.evaluate(()=>window.__QINHUAI_IMPORT__.player.yaw);
  await page.mouse.move(1000,430);await page.mouse.down();await page.mouse.move(1100,440,{steps:5});await page.mouse.up();
  assert.notEqual(await page.evaluate(()=>window.__QINHUAI_IMPORT__.player.yaw),yaw);
  const distance=await page.evaluate(()=>window.__QINHUAI_IMPORT__.player.distance);await page.mouse.wheel(0,-200);
  await page.waitForFunction(d=>window.__QINHUAI_IMPORT__.player.distance<d,distance);
  await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('day'));report.pixels.day=await capture('student-third-person-day');
  await page.setViewportSize({width:390,height:844});await page.locator('#toolbarToggle').click();
  await page.locator('#thirdPersonMode').scrollIntoViewIfNeeded();report.pixels.mobile=await capture('student-mobile-controls');
  report.mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,button:document.querySelector('#thirdPersonMode').getBoundingClientRect().toJSON()}));
  assert.ok(report.mobile.scroll<=report.mobile.width);assert.ok(report.mobile.button.right<=390);
  for(const p of Object.values(report.pixels)){assert.ok(p.lit>2000);assert.ok(p.colors>40);}
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);report.errors=errors;report.failed=failed;
  await fs.writeFile(out+'/player-browser.json',JSON.stringify(report,null,2));console.log('PASS',JSON.stringify(report));
 }finally{await browser?.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});await fs.rm(dataDir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
