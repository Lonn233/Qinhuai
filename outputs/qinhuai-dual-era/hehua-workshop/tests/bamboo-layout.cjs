const assert=require('node:assert/strict');const path=require('node:path');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>Object.defineProperty(window,'devicePixelRatio',{get:()=>1}));
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'commit',timeout:30000});await page.waitForFunction(()=>window.__HEHUA_READY__,{},{timeout:180000});
 await page.evaluate(()=>{__HEHUA__.start();__HEHUA__.openBamboo(true)});
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const layout=await page.evaluate(()=>{const names=['BambooLongStock','BambooArcStock','BambooSmallStock'];let reserve=0;__HEHUA__.scene.traverse(o=>{if(o.name==='BambooReserve')reserve+=o.children.length});return {reserve,lanes:names.map(n=>{const o=__HEHUA__.scene.getObjectByName(n);return {x:o.position.x,z:o.position.z,rotation:o.rotation.y,length:o.userData.stockLength,front:o.position.z+o.userData.stockLength/2}})};});
 assert.equal(layout.reserve,18);assert(layout.lanes[2].length<layout.lanes[0].length);assert(layout.lanes[0].x<layout.lanes[1].x&&layout.lanes[1].x<layout.lanes[2].x);layout.lanes.forEach(l=>{assert(Math.abs(l.rotation-Math.PI/2)<1e-8);assert(Math.abs(l.front-.29)<1e-8)});
 await page.screenshot({path:path.resolve(__dirname,'../preview/74-bamboo-bench.png')});
 for(const mode of ['pickLong','pickArc','pickArc','pickArc','pickSmall']){
  const s=await page.evaluate(()=>__HEHUA__.bambooStage.snapshot());assert.equal(s.mode,mode);
  await page.mouse.move(s.targets[mode].x,s.targets[mode].y);await page.keyboard.press('e');
 }
 const done=await page.evaluate(()=>__HEHUA__.bambooStage.snapshot());assert.equal(done.mode,'toAssembly');assert.equal(done.inventory.longBamboo,1);assert.equal(done.inventory.arcBamboo,3);assert.equal(done.inventory.smallBamboo,1);
 await page.screenshot({path:path.resolve(__dirname,'../preview/75-bamboo-collected.png')});
 await page.evaluate(()=>__HEHUA__.reset());const reset=await page.evaluate(()=>__HEHUA__.bambooStage.snapshot());assert.equal(reset.mode,'pickLong');assert.deepEqual(errors,[]);
 console.log(JSON.stringify({result:'PASS',layout,inventory:done.inventory,reset:reset.mode},null,2));
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});