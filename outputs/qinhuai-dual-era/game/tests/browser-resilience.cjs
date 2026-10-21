const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
 let blocked=true;await page.route('**/game/assets/fish.glb',route=>blocked?route.abort():route.continue());
 try{await page.goto(process.env.GAME_URL||'http://127.0.0.1:4180/lantern-festival.html',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>window.__QINHUAI_GAME__,null,{timeout:120000});
 const initial=await page.evaluate(async()=>await window.__QINHUAI_GAME__.assetsReady);assert.equal(initial.loaded,4);assert.equal(initial.errors.length,1);assert.equal(await page.locator('#retry-lanterns').isVisible(),true);
 blocked=false;await page.click('#retry-lanterns');await page.waitForFunction(()=>!!window.__QINHUAI_GAME__.exhibits.get('fish').model,null,{timeout:60000});assert.equal(await page.locator('#retry-lanterns').isVisible(),false);
 await page.click('#begin-festival');await page.waitForTimeout(400);assert.equal(await page.locator('#touch-controls').isVisible(),true);assert.equal(await page.locator('#game-controls').isVisible(),false);
 const button=page.locator('[data-move="KeyW"]'),box=await button.boundingBox(),before=await page.evaluate(()=>window.__QINHUAI__.firstPersonCamera.position.toArray());
 await page.mouse.move(box.x+20,box.y+20);await page.mouse.down();await page.waitForTimeout(700);await page.mouse.up();const after=await page.evaluate(()=>window.__QINHUAI__.firstPersonCamera.position.toArray());assert.ok(Math.hypot(after[0]-before[0],after[2]-before[2])>.2);
 await page.click('#catalog-button');await page.waitForTimeout(400);assert.match(await page.locator('.catalog-footer').textContent(),/本次会话/);await page.screenshot({path:path.join(__dirname,'mobile-touch-catalog.png')});
 assert.ok(await page.locator('#game-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1));await page.click('#dialog-close');await page.waitForTimeout(300);await page.screenshot({path:path.join(__dirname,'mobile-touch-exploring.png')});
 const stats=await page.evaluate(()=>({lotusKinds:[...new Set(window.__QINHUAI__.lotusLanterns.map(x=>x.kind))],lotusCount:window.__QINHUAI__.lotusLanterns.length,loaded:[...window.__QINHUAI_GAME__.exhibits.values()].filter(x=>x.model).length,canvasCount:document.querySelectorAll('#viewport canvas').length}));
 assert.equal(stats.loaded,5);assert.equal(stats.canvasCount,1);assert.ok(stats.lotusKinds.includes('main'));assert.equal(stats.lotusKinds.length,2);assert.deepEqual(errors,[]);
 const result={passed:true,checks:['one failed model does not block other lanterns','failed model retry succeeds','blocked localStorage stays playable and displays session-only warning','coarse pointer direction controls actually move player','mobile catalog has no horizontal overflow','both original lotus variants present','one scene canvas','no browser runtime errors'],stats,errors};fs.writeFileSync(path.join(__dirname,'resilience-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
