const {completeGesture}=require('./gesture-driver.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const url=process.env.WORKSHOP_URL||'http://127.0.0.1:4180/lotus-workshop.html';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__?.ready);
  assert.equal(await page.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().state),'idle','page load must not start audio');
  await page.click('#begin');await page.waitForTimeout(850);
  assert.equal(await page.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().state),'running');
  await page.keyboard.press('KeyE');await completeGesture(page);assert.equal(await page.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().lastSound),'bamboo');
  await page.click('#handwork-close');await page.waitForTimeout(750);
  await page.click('#sound-toggle');assert.equal(await page.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().activeVoices),0);
  const muted=await page.evaluate(()=>{const a=window.__LOTUS_WORKSHOP__.audio,before=a.snapshot().played;a.play('water');return {before,after:a.snapshot().played,enabled:a.snapshot().enabled};});assert.equal(muted.before,muted.after);assert.equal(muted.enabled,false);
  await page.click('#sound-settings summary');await page.locator('#sound-volume').fill('30');await page.screenshot({path:path.join(__dirname,'audio-controls.png')});
  await page.reload({waitUntil:'networkidle'});assert.deepEqual(await page.evaluate(()=>{const a=window.__LOTUS_WORKSHOP__.audio.snapshot();return [a.enabled,a.volume,a.state];}),[false,.3,'idle']);
  await page.click('#sound-toggle');await page.click('#resume');await page.waitForTimeout(850);
  const actual=await page.evaluate(async()=>{
   const {SOUND_RECIPES,STAGE_SOUNDS,synthesize,createWorkshopAudio}=await import('/workshop/audio.mjs');
   const missing=window.__LOTUS_WORKSHOP__.stages.filter(s=>!SOUND_RECIPES[STAGE_SOUNDS[s.id]]).map(s=>s.id),samples={};
   for(const name of Object.keys(SOUND_RECIPES)){
    const ctx=new OfflineAudioContext(1,48000*2,48000);synthesize(ctx,ctx.destination,name,{start:.02});
    const buffer=await ctx.startRendering(),data=buffer.getChannelData(0);let peak=0,energy=0,finite=true,tail=0;
    for(let i=0;i<data.length;i++){const v=data[i];finite&&=Number.isFinite(v);peak=Math.max(peak,Math.abs(v));energy+=v*v;if(i>data.length-2400)tail=Math.max(tail,Math.abs(v));}
    samples[name]={peak,rms:Math.sqrt(energy/data.length),finite,tail};
   }
   const unavailable=createWorkshopAudio({contextFactory(){throw new Error('unsupported');}});unavailable.play('wood');
   const a=window.__LOTUS_WORKSHOP__.audio;for(let i=0;i<100;i++)for(const name of Object.keys(SOUND_RECIPES))a.play(name);const voices=a.snapshot().activeVoices;a.setEnabled(false);const cleared=a.snapshot().activeVoices;a.setEnabled(true);
   a.play('complete');a.pause();const paused=a.snapshot();a.play('water');const pausedUnchanged=a.snapshot().played===paused.played;a.resume();
   a.setVolume(0);const before=a.snapshot().played;a.play('press');const zeroSilent=a.snapshot().played===before;a.setVolume(.3);
   return {missing,samples,unavailable:unavailable.snapshot(),voices,cleared,pausedUnchanged,zeroSilent};
  });
  assert.deepEqual(actual.missing,[]);for(const [name,s]of Object.entries(actual.samples)){assert.ok(s.finite&&s.peak>.001&&s.peak<.95&&s.rms>.0001,name+': empty, invalid or clipped signal');assert.equal(s.tail,0,name+': unending sound');}
  assert.ok(actual.voices<=8);assert.equal(actual.cleared,0);assert.equal(actual.unavailable.available,false);assert.ok(actual.pausedUnchanged&&actual.zeroSilent);
  // Actual movement sounds only after travelling, not when pushing into the table.
  await page.click('#home-view');await page.waitForTimeout(750);await page.click('#free-walk');await page.keyboard.down('KeyW');await page.waitForTimeout(1500);await page.keyboard.up('KeyW');
  assert.equal(await page.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().lastSound),'footstep');
  const atWall=await page.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().played);await page.keyboard.down('KeyW');await page.waitForTimeout(450);await page.keyboard.up('KeyW');assert.equal(await page.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().played),atWall,'blocked movement should be silent');
  await page.waitForTimeout(1400);assert.equal(await page.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().activeVoices),0);
  // Create a short standalone audition of the same recipes used by the game.
  const wav=await page.evaluate(async()=>{
   const {synthesize}=await import('/workshop/audio.mjs');const names=['bamboo','binding','lining','cut','water','press','shape','paste','complete'];
   const ctx=new OfflineAudioContext(1,48000*11,48000),gain=ctx.createGain();gain.gain.value=.55;gain.connect(ctx.destination);names.forEach((name,i)=>synthesize(ctx,gain,name,{start:.15+i*1.08}));
   const data=(await ctx.startRendering()).getChannelData(0),bytes=new Uint8Array(44+data.length*2),view=new DataView(bytes.buffer);const text=(at,s)=>[...s].forEach((c,i)=>view.setUint8(at+i,c.charCodeAt(0)));text(0,'RIFF');view.setUint32(4,bytes.length-8,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,48000,true);view.setUint32(28,96000,true);view.setUint16(32,2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,data.length*2,true);for(let i=0;i<data.length;i++)view.setInt16(44+i*2,Math.max(-1,Math.min(1,data[i]))*32767,true);let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary);
  });fs.writeFileSync(path.join(__dirname,'workshop-sounds.wav'),Buffer.from(wav,'base64'));
  await page.close();
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(url,{waitUntil:'networkidle'});await mobile.tap('#begin');await mobile.waitForTimeout(850);await mobile.tap('#craft-action');await completeGesture(mobile,{touch:true});assert.equal(await mobile.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().lastSound),'bamboo');
  await mobile.tap('#handwork-close');await mobile.waitForTimeout(750);
  await mobile.tap('#sound-settings summary');await mobile.locator('#sound-volume').fill('25');await mobile.screenshot({path:path.join(__dirname,'mobile-audio-controls.png')});assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await mobile.tap('#sound-toggle');assert.equal(await mobile.evaluate(()=>window.__LOTUS_WORKSHOP__.audio.snapshot().enabled),false);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'audio-results.json'),JSON.stringify({passed:true,errors,...actual},null,2));console.log(JSON.stringify({passed:true,errors,sounds:Object.keys(actual.samples).length,verified:['gesture start','craft sound','mute stops tails','volume/mute persistence','all stage mappings','real offline PCM output','voice cap and cleanup','pause and zero volume','movement and wall collision','unavailable audio fallback','mobile touch and layout']},null,2));
 }finally{await browser.close();}
})().catch(e=>{fs.writeFileSync(path.join(__dirname,'audio-results.json'),JSON.stringify({passed:false,error:e.stack},null,2));console.error(e);process.exitCode=1;});
