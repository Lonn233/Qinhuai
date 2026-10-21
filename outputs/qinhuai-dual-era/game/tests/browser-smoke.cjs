const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--disable-background-timer-throttling']});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});const errors=[],consoleErrors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
 await page.goto('http://127.0.0.1:4180/lantern-festival.html',{waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction(()=>window.__QINHUAI_GAME__,{timeout:120000});
 const result=await page.evaluate(async()=>{const game=window.__QINHUAI_GAME__;const assets=await game.assetsReady;return {assets,base:await window.__QINHUAI__.assetsReady,phase:window.__QINHUAI__.assetState.phase,stats:window.__QINHUAI__.stats(),lanterns:[...game.exhibits].map(([id,e])=>({id,loaded:!!e.model})),camera:window.__QINHUAI__.firstPersonCamera.position.toArray()};});
 await page.waitForTimeout(1400);await page.screenshot({path:path.join(__dirname,'intro.png')});
 await page.click('#begin-festival');await page.waitForTimeout(500);
 await page.screenshot({path:path.join(__dirname,'exploring.png')});
 await page.evaluate(()=>window.__QINHUAI_GAME__.openCatalog());await page.waitForTimeout(300);await page.screenshot({path:path.join(__dirname,'catalog.png')});
 console.log(JSON.stringify({result,errors,consoleErrors},null,2));fs.writeFileSync(path.join(__dirname,'smoke-results.json'),JSON.stringify({result,errors,consoleErrors},null,2));
 await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
