const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='work/tower0369-golden-20261022';
(async()=>{
 await fs.mkdir(out,{recursive:true});let browser;
 try{
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>Object.defineProperty(window,'devicePixelRatio',{get:()=>.35}));
  await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?gateLight=gold&time=night&mode=orbit&view=gate',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#storyPreview')?.disabled===false,null,{timeout:300000});
  console.log('Main scene ready');
  await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.setPerformanceProfile('low');a.renderer.setPixelRatio(.6);document.getElementById('storyPreview').click();});
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.story.mode==='preview');
  async function capture(name){
   await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.setControlMode('orbit');a.camera.position.set(-6.5,16.2,-9.5);a.orbit.target.set(-12.72,13.45,-17.21);a.orbit.update();});
   const data=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__,r=a.nightLighting;return {mode:a.story.mode,scene:a.scene.uuid,time:a.timeOfDay,studies:r.tower0369Studies.length,fixtures:r.tower0369Fixtures.length,nodes:[]};});
   assert.equal(data.studies,16);assert.equal(data.fixtures,1);
   await page.screenshot({path:out+'/'+name+'.png',timeout:90000});return data;
  }
  const preview=await capture('main-preview');console.log('Preview verified',JSON.stringify(preview));
  await page.evaluate(()=>{document.getElementById('storyBack').click();document.getElementById('storyStart').click();});
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.story.mode==='play',null,{timeout:300000});
  const play=await capture('main-play');assert.equal(play.scene,preview.scene);assert.equal(play.time,'night');console.log('Play verified',JSON.stringify(play));
  await page.evaluate(()=>{document.getElementById('storyBack').click();document.getElementById('storyPreview').click();});
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.story.mode==='preview');
  const again=await capture('main-preview-restored');assert.equal(again.scene,preview.scene);
  assert.deepEqual(errors,[]);await fs.writeFile(out+'/main.json',JSON.stringify({preview,play,again,errors},null,2));console.log('PASS shared tower and scene across preview/play; no browser errors');
 }finally{await browser?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
