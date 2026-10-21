const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-background-timer-throttling']});
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const page=await context.newPage(),errors=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.setDefaultTimeout(20000);
 const ready=async()=>{await page.waitForFunction(()=>window.__QINHUAI_GAME__,null,{timeout:120000});await page.evaluate(async()=>{await window.__QINHUAI_GAME__.assetsReady;await window.__QINHUAI__.assetsReady;});};
 const shot=async name=>{await page.waitForTimeout(350);return page.screenshot({path:path.join(__dirname,name+'.png')});};
 const position=()=>page.evaluate(()=>window.__QINHUAI__.firstPersonCamera.position.toArray());
 const count=()=>page.evaluate(()=>window.__QINHUAI_GAME__.state.unlocked.size);
 const exhibits={mountain:{x:-15.2,z:-.15,depth:4.05},lion:{x:-5.7,z:-1.15,depth:3.55},fish:{x:2.45,z:.15,depth:3.2},crane:{x:11.65,z:-.85,depth:3.55},lotus:{x:5.7,z:-5.25,depth:3.2}};
 const at=async(x,z=-4.4,lookZ=.3,away=false)=>{await page.evaluate(({x,z,lookZ,away})=>{const c=window.__QINHUAI__.firstPersonCamera;c.position.set(x,2.55,z);c.lookAt(x,2.7,away?-20:lookZ);},{x,z,lookZ,away});await page.waitForTimeout(250);};
 const atExhibit=async id=>{const p=exhibits[id];await at(p.x,p.z-p.depth/2-2.5,p.z);};
 try{
  await page.goto(process.env.GAME_URL||'http://127.0.0.1:4180/lantern-festival.html',{waitUntil:'domcontentloaded',timeout:120000});await ready();
  assert.equal(await count(),0);await page.click('#begin-festival');await page.waitForTimeout(250);
  const before=await position();await page.keyboard.down('KeyW');await page.waitForTimeout(700);await page.keyboard.up('KeyW');await page.waitForTimeout(150);const after=await position();
  assert.ok(Math.hypot(after[0]-before[0],after[2]-before[2])>.2,'WASD must move the player');checks.push('real keyboard movement / pointer capture');
  await at(-9,-9.2);assert.equal(await page.locator('#interaction-prompt').isVisible(),false);await at(-9,-4.4,-.2,true);assert.equal(await page.locator('#interaction-prompt').isVisible(),false);checks.push('distance and look-away hide interaction');
  const entries=[['mountain','　山　'],['lion','獅子'],['fish','金鱼'],['crane','仙鹤'],['lotus','莲花']];
  for(let i=0;i<entries.length;i++){
   const [id,answer]=entries[i];await atExhibit(id);await page.waitForFunction(id=>window.__QINHUAI_GAME__.target?.lanternId===id,id);await shot('exhibit-'+id);
   await page.keyboard.press('KeyE');await page.waitForSelector('#riddle-answer');assert.equal(await page.evaluate(()=>window.__QINHUAI_GAME__.state.mode),'riddleOpen');
   if(i===0){
    await page.locator('#riddle-answer').press('Enter');assert.equal(await count(),0);assert.match(await page.locator('#answer-feedback').textContent(),/先写/);
    await page.locator('#riddle-answer').fill('不是谜底');await page.locator('#riddle-answer').press('Enter');assert.equal(await count(),0);assert.match(await page.locator('#answer-feedback').textContent(),/再想想/);
    const paused=await position();await page.locator('#riddle-answer').fill('');await page.keyboard.type('wasd');assert.equal(await page.locator('#riddle-answer').inputValue(),'wasd');assert.deepEqual(await position(),paused);
    await page.click('[data-action="hint"]');assert.equal(await page.locator('#hint-text').isVisible(),true);await shot('riddle');checks.push('empty / wrong answer, hint, modal movement pause, input keys');
   }
   await page.locator('#riddle-answer').fill(answer);await page.locator('#riddle-answer').press('Enter');await page.waitForSelector('.success-layout');assert.equal(await count(),i+1);await shot('success-'+id);
   await page.click('[data-action="view-unlock"]');assert.equal(await page.locator('.catalog-card.unlocked').count(),i+1);assert.equal(await page.locator('.catalog-card.selected').getAttribute('data-id'),id);
   if(id==='crane')await shot('crane-catalog');if(id==='lotus')await shot('catalog-complete');
   await page.click('#dialog-close');await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.__QINHUAI_GAME__.state.mode),'exploring');
  }
  checks.push('all five raycast → E → answer → success → catalog → return loops');
  await atExhibit('lotus');await page.waitForFunction(()=>window.__QINHUAI_GAME__.target?.lanternId==='lotus');await page.keyboard.press('KeyE');await page.waitForSelector('.success-layout');assert.equal(await page.locator('#riddle-answer').count(),0);assert.equal(await count(),5);await page.click('#dialog-close');checks.push('solved riddle reopens without duplicate unlock');
  // The front paving is intentionally open now, so give the player enough
  // time to reach the physical podium body before asserting the blocker.
  await at(-15.2,-5,-.15);await page.keyboard.down('KeyW');await page.waitForTimeout(1400);await page.keyboard.up('KeyW');await page.waitForTimeout(100);assert.ok((await position())[2]<=-1.65,'podium collision');
  await at(-9,-10.1,-20,true);await page.keyboard.down('KeyW');await page.waitForTimeout(700);await page.keyboard.up('KeyW');await page.waitForTimeout(100);assert.ok((await position())[2]>=-10.101,'play-area boundary');checks.push('podium collision / world boundary');
  await page.evaluate(()=>document.exitPointerLock());await page.click('[data-game-era="ming"]');assert.equal(await page.evaluate(()=>window.__QINHUAI__.era),'ming');assert.equal(await count(),5);await page.click('[data-game-era="modern"]');await page.click('#weather-button');assert.equal(await page.evaluate(()=>window.__QINHUAI__.night),false);await page.click('#weather-button');
  await page.click('#overview-button');assert.equal(await page.evaluate(()=>window.__QINHUAI__.firstPerson),false);await page.click('#return-walk');assert.equal(await page.evaluate(()=>window.__QINHUAI__.firstPerson),true);assert.deepEqual(await position(),[-11,2.55,-7.1]);checks.push('both eras, day/night, overview and safe return preserve progress');
  await page.reload({waitUntil:'domcontentloaded',timeout:120000});await ready();assert.equal(await count(),5);await page.click('#catalog-button');assert.equal(await page.locator('.catalog-card.unlocked').count(),5);checks.push('reload restores five unlocked catalog entries');
  await page.setViewportSize({width:390,height:844});await shot('mobile-catalog');assert.ok(await page.locator('#game-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1),'no mobile dialog horizontal overflow');
  await page.click('#dialog-close');await shot('mobile-intro');checks.push('390px responsive layout');
  assert.deepEqual(errors,[]);checks.push('zero browser runtime / console errors');
  fs.writeFileSync(path.join(__dirname,'e2e-results.json'),JSON.stringify({passed:true,checks,errors},null,2));console.log(JSON.stringify({passed:true,checks,errors},null,2));
 }catch(error){await shot('e2e-failure').catch(()=>{});console.error(JSON.stringify({checks,errors},null,2));throw error;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
