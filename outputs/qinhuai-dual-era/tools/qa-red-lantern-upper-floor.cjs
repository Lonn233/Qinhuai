const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});try{
const page=await browser.newPage({viewport:{width:1440,height:960}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://127.0.0.1:4180/building-light-study.html?building=matou');
const layout=JSON.parse(fs.readFileSync('assets/red-lantern/layout.json'));const expected=layout.placements.filter(p=>p.group==='north-west').length;
await page.waitForFunction(n=>window.__BUILDING_STUDY__?.redLanterns?.stats.lamps===n,expected,{timeout:120000});
await page.evaluate(()=>{const a=window.__BUILDING_STUDY__;a.controls.target.set(-40.9,13.65,-3.8);a.camera.position.set(-40.9,14.6,4.7);a.controls.update();});
await page.waitForTimeout(800);await page.locator('#viewport').screenshot({path:'work/red-lantern-upper-floor/preview.png'});
const stats=await page.evaluate(()=>window.__BUILDING_STUDY__.redLanterns.stats);assert.deepEqual(errors,[]);
fs.writeFileSync('work/red-lantern-upper-floor/browser-qa.json',JSON.stringify({stats,errors},null,2));console.log('PASS',stats);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
