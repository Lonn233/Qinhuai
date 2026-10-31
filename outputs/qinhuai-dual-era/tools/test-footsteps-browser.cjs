const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const {createServer}=require('../game/serve.cjs');
(async()=>{
 const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'qinhuai-footsteps-')),server=createServer({dataDir});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try {
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1000,height:700}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(180000);
  await page.addInitScript(()=>Object.defineProperty(window,'devicePixelRatio',{get:()=>.25}));
  await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#storyStart')?.disabled===false);
  await page.locator('#storyStart').click();
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.mode==='play');
  await page.keyboard.down('KeyW');
  await page.waitForFunction(()=>{const a=__QINHUAI_IMPORT__.player.footsteps.audio;return a&&!a.paused&&a.currentTime>.1;});
  const media=await page.evaluate(()=>{const a=__QINHUAI_IMPORT__.player.footsteps.audio;return {src:a.currentSrc,duration:a.duration,loop:a.loop,volume:a.volume,error:a.error?.code};});
  assert.ok(media.src.endsWith('/assets/audio/walk-loop2.mp3'));assert.ok(media.duration>0);assert.equal(media.loop,true);assert.equal(media.error,undefined);
  await page.keyboard.down('ShiftLeft');await page.waitForFunction(()=>__QINHUAI_IMPORT__.player.footsteps.audio.playbackRate===1.35);
  await page.keyboard.up('ShiftLeft');await page.keyboard.up('KeyW');
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.player.footsteps.audio.paused);
  await page.evaluate(()=>{const p=__QINHUAI_IMPORT__.story.world.workshop;__QINHUAI_IMPORT__.player.spawn({x:p.x,z:p.z+.6,ground:p.y});});
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.snapshot.current?.kind==='master');await page.keyboard.press('KeyE');
  await page.locator('#storyDialogue').waitFor({state:'visible'});await page.keyboard.down('KeyW');await page.waitForTimeout(400);
  await page.waitForFunction(()=>!__QINHUAI_IMPORT__.player.footsteps.audio.paused);
  await page.keyboard.up('KeyW');await page.keyboard.press('Escape');
  await page.evaluate(()=>{__QINHUAI_IMPORT__.player.setMode('orbit');});
  assert.equal(await page.evaluate(()=>__QINHUAI_IMPORT__.player.footsteps.audio.paused),true);
  assert.deepEqual(errors,[]);console.log('PASS actual main scene: supplied MP3 decoded/playing, walk/run/stop, dialogue walking and orbit mute',media);
 } finally {if(browser)await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));fs.rmSync(dataDir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
