const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const {createServer}=require('../game/serve.cjs');
(async()=>{
 const server=createServer({dataDir:fs.mkdtempSync(path.join(os.tmpdir(),'qinhuai-act1-audio-'))});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=d3d11','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],mediaRequests=[];page.setDefaultTimeout(60000);
  page.on('response',response=>{if(/\.(?:mp3|wav)(?:\?|$)/i.test(response.url()))mediaRequests.push({url:response.url(),status:response.status()});});
  page.on('requestfailed',request=>{if(/\.(?:mp3|wav)(?:\?|$)/i.test(request.url()))mediaRequests.push({url:request.url(),failure:request.failure()?.errorText});});
  page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE',e.message)});page.on('console',m=>{if(m.type()==='error')console.error('BROWSER',m.text().slice(0,300));else if(m.text().startsWith('AUDIO TEST'))console.log(m.text());});
  await page.addInitScript(()=>{
   Object.defineProperty(window,'devicePixelRatio',{get:()=>.35});window.__voiceEvents=[];
   window.addEventListener('qinhuai-startup',event=>console.log('AUDIO TEST startup: '+event.detail.phase));
   const NativeAudio=window.Audio;
   window.Audio=function(src){const audio=new NativeAudio(src);if(/walk-loop2\.mp3(?:\?|$)/.test(String(src)))return audio;window.__lastVoice=audio;
    for(const event of ['playing','ended','error'])audio.addEventListener(event,()=>window.__voiceEvents.push({event,src:audio.currentSrc||audio.src,stage:window.__QINHUAI_IMPORT__?.story?.snapshot.stage}));return audio;};window.Audio.prototype=NativeAudio.prototype;
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html?mode=orbit&time=day`,{waitUntil:'domcontentloaded'});
  fs.mkdirSync('work',{recursive:true});
  const decoded=await page.evaluate(async()=>{
   const manifest=await fetch('./story/assets.json',{cache:'no-store'}).then(r=>r.json());
   const context=new AudioContext(),results=[];
   try{
    for(const [id,cue] of Object.entries(manifest.audio).filter(([,cue])=>cue.ready)){
     for(const file of cue.files){
      const response=await fetch(file,{cache:'no-store'});
      if(!response.ok)throw Error(id+': HTTP '+response.status);
      const buffer=await context.decodeAudioData(await response.arrayBuffer());
      results.push({id,file,duration:buffer.duration});
     }
    }
   }finally{await context.close();}
   return results;
  });
  assert.equal(decoded.length,25);
  assert.ok(decoded.every(cue=>cue.duration>0));
  fs.writeFileSync('work/story-audio-decoded.json',JSON.stringify(decoded,null,2));
  console.log('PASS all 25 current voice files fetched and decoded by Chrome');
  if(process.env.STORY_AUDIO_DECODE_ONLY==='1')return;
  await page.locator('#menuShell [data-action="preview"]').click();
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__,null,{timeout:90000});await page.evaluate(()=>__QINHUAI_IMPORT__.renderer.setPixelRatio(.25));
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.error||(document.documentElement.dataset.shell==='game'&&document.getElementById('storyStart')?.disabled===false),null,{timeout:120000});
  const startupError=await page.evaluate(()=>window.__QINHUAI_STARTUP__?.error?.message||null);
  assert.equal(startupError,null,'main scene startup must succeed');console.log('Scene ready');
  await page.evaluate(()=>{__QINHUAI_IMPORT__.setPerformanceProfile('low');document.getElementById('storyStart').click();});
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.mode==='play',null,{timeout:90000});
  await page.evaluate(async()=>{const a=__QINHUAI_IMPORT__,p=a.story.world.workshop;await a.setControlMode('thirdPerson');a.player.spawn({x:p.x,z:p.z+.6,ground:p.y});a.player.updateCamera(0,true);});
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.snapshot.current?.kind==='master');
  await page.evaluate(()=>{const p=__QINHUAI_IMPORT__.player;p.setAnimation('Walking');p.mixer.update(.25);});
  const baseVolume=await page.evaluate(()=>document.getElementById('main-scene-music')?.volume??null);
  await page.keyboard.press('KeyE');
  console.log('After E',await page.evaluate(()=>({snapshot:__QINHUAI_IMPORT__.story.snapshot,voice:document.getElementById('storyVoiceStatus').textContent,cue:__QINHUAI_IMPORT__.story.world.assets.audio.ACT1_001,events:__voiceEvents})));
  try{
   await page.waitForFunction(()=>window.__voiceEvents.some(e=>e.event==='playing'&&e.src.endsWith('/ACT1_001.wav')));
  }catch(error){
   console.error('Audio playback diagnostics',JSON.stringify({requests:mediaRequests,state:await page.evaluate(()=>{const audio=window.__lastVoice;return {events:window.__voiceEvents,audio:audio?{src:audio.currentSrc||audio.src,readyState:audio.readyState,networkState:audio.networkState,paused:audio.paused,currentTime:audio.currentTime,duration:audio.duration,error:audio.error?{code:audio.error.code,message:audio.error.message}:null}:null};}).catch(()=>null)},null,2));
   throw error;
  }
  assert.equal(await page.locator('#storyDialogueNext').isVisible(),true);
  assert.equal(await page.evaluate(()=>__QINHUAI_IMPORT__.story.snapshot.stage),'intro');
  if(baseVolume!==null)assert.ok(Math.abs(await page.evaluate(()=>document.getElementById('main-scene-music').volume)-baseVolume*.3)<1e-6);
  const standing=await page.evaluate(()=>{const p=__QINHUAI_IMPORT__.player;return {position:p.position.toArray(),time:p.mixer.time,camera:p.camera.position.toArray()};});
  await page.keyboard.down('KeyW');
  await page.waitForFunction(time=>__QINHUAI_IMPORT__.player.mixer.time>time+.4,standing.time);
  await page.keyboard.up('KeyW');
  const afterStanding=await page.evaluate(()=>{const p=__QINHUAI_IMPORT__.player;return {position:p.position.toArray(),camera:p.camera.position.toArray(),idle:p.actions.get('Idle').getEffectiveWeight(),walk:p.actions.get('Walking').getEffectiveWeight()};});
  assert.ok(Math.hypot(...afterStanding.position.map((v,i)=>v-standing.position[i]))>.05,'dialogue must allow walking');
  assert.equal(await page.evaluate(()=>__QINHUAI_IMPORT__.renderer.getContext().isContextLost()),false,'main scene WebGL context must still be live');
  await page.screenshot({path:'work/story-dialogue-standing.png',timeout:20000});
  console.log('PASS dialogue allows walking while animation advances');
  const playingBeforeRepeat=await page.evaluate(()=>__voiceEvents.filter(e=>e.event==='playing').length);
  await page.keyboard.press('KeyE');await page.waitForTimeout(150);
  assert.equal(await page.evaluate(()=>__voiceEvents.filter(e=>e.event==='playing').length),playingBeforeRepeat,'repeated E must not start overlapping audio');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>__lastVoice.paused),true);
  assert.equal(await page.evaluate(()=>__QINHUAI_IMPORT__.story.snapshot.stage),'intro','cancellation must not advance');
  if(baseVolume!==null)assert.equal(await page.evaluate(()=>document.getElementById('main-scene-music').volume),baseVolume);
  console.log('PASS real audio starts, ducks music, rejects duplicate E, stops on cancel without advancing');
  await page.evaluate(()=>{window.__voiceEvents=[];const a=__QINHUAI_IMPORT__,p=a.story.world.workshop;a.player.spawn({x:p.x,z:p.z+.6,ground:p.y});a.player.updateCamera(0,true);});
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.snapshot.current?.kind==='master');await page.keyboard.press('KeyE');
  await page.waitForFunction(()=>__voiceEvents.some(e=>e.event==='ended'&&e.src.endsWith('/ACT1_001.wav')),null,{timeout:90000});
  assert.equal(await page.evaluate(()=>__QINHUAI_IMPORT__.story.snapshot.dialogueId),'ACT1_001','voice must not auto advance dialogue');
  await page.locator('#storyDialogueNext').click();
  await page.waitForFunction(()=>__voiceEvents.some(e=>e.event==='ended'&&e.src.endsWith('/ACT1_002.wav')),null,{timeout:90000});
  assert.equal(await page.evaluate(()=>__QINHUAI_IMPORT__.story.snapshot.stage),'intro','final voice still requires click');
  await page.locator('#storyDialogueNext').click();
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.snapshot.stage==='observe');
  const events=await page.evaluate(()=>__voiceEvents);const ended=events.filter(e=>e.event==='ended');
  assert.deepEqual(ended.map(e=>e.src.split('/').pop()),['ACT1_001.wav','ACT1_002.wav']);
  assert.ok(ended.every(e=>e.stage==='intro'),'stage must stay intro until final audio ended');assert.equal(events.filter(e=>e.event==='error').length,0);
  assert.equal(await page.locator('#storyDialogue').isVisible(),false);
  if(baseVolume!==null)assert.equal(await page.evaluate(()=>document.getElementById('main-scene-music').volume),baseVolume);
  assert.deepEqual(errors,[]);console.log('PASS two current WAVs decoded/played/ended in order; manual clicks advance dialogue');
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
