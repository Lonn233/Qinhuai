const fs=require('node:fs/promises'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const out='work/courtyard-racks-20261021';let browser;const deadline=setTimeout(()=>{console.error('Full map QA exceeded 150 seconds');browser?.close().finally(()=>process.exit(1));},150000);
 try{
 console.log('Launching full-map browser');
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=d3d11']});
 console.log('Browser launched');
 const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});const errors=[],requests=[];
 page.on('pageerror',e=>{errors.push(e.message);console.log('Page error',e.message);});page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));page.on('response',r=>{if(r.url().includes('/tiles/'))console.log('Tile response',r.url(),r.status());if(r.url().includes('/courtyard-rack-lanterns/'))requests.push({url:r.url(),status:r.status()});});
 // Browser QA must never restore or write the user's persistent lighting settings.
 await page.route('**/api/main-scene-settings**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:1,revision:0,entries:{}})}));
 console.log('Opening map');
 await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&view=courtyard&gateLight=gold&v=lantern-startup-fix-20261022',{waitUntil:'domcontentloaded'});
 console.log('Map document loaded');
 await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.error||window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:120000});
 assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__?.error),null,'map startup must succeed');
 await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.player.spawn({x:-5.43,z:-23.65,ground:11.864055});});
 await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.templeVisit.snapshot().near);
 await page.keyboard.press('KeyE');
 await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.templeVisit.snapshot().inside&&!window.__QINHUAI_IMPORT__.templeVisit.snapshot().busy);
 console.log('Racks loaded');
 console.log('Reading map stats');
 const initial=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;return {racks:a.courtyardRackStats,trees:a.courtyardLanternStats};});assert.equal(initial.racks.lamps,36);assert.equal(initial.racks.drawCalls,8);assert.equal(initial.trees.trees,8);
 console.log('Capturing full courtyard');
 await page.locator('#toolbarToggle').click();await page.screenshot({path:out+'/full-map-night.png',timeout:60000});
 await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.setControlMode('orbit');a.camera.position.set(-5.6,13.4,-25.8);a.orbit.target.set(-5.6,13.5,-29.3);a.orbit.update();});await page.waitForTimeout(300);await page.screenshot({path:out+'/rack-close-night.png',timeout:60000});
 const controls=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__,l=a.lanternLighting;const before=l.sources('rack-blue').length;l.setSettings('rack-green',{brightness:2,inheritColor:false,color:'#ff00ff'});const green=a.courtyardRacks.entries.get('rack-green'),blue=a.courtyardRacks.entries.get('rack-blue');const result={before,power:green.uniforms.uClothPower.value,tint:green.uniforms.uClothTint.value.getHexString(),blue:blue.uniforms.uClothTint.value.getHexString(),groups:[...document.querySelectorAll('#lantern-group option')].filter(o=>o.value.startsWith('rack-')).length};l.setSettings('rack-green',{});return result;});assert.equal(controls.before,9);assert.equal(controls.power,1.44);assert.equal(controls.tint,'ff00ff');assert.equal(controls.blue,'ffffff');assert.equal(controls.groups,4);
 await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('day'));await page.waitForTimeout(300);await page.screenshot({path:out+'/rack-close-day.png',timeout:60000});
 const report={initial,controls,requests,errors,renderer:await page.evaluate(()=>{const gl=window.__QINHUAI_IMPORT__.renderer.getContext(),e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);})};await fs.writeFile(out+'/browser.json',JSON.stringify(report,null,2));assert.deepEqual(errors,[]);assert.equal(requests.length,4);assert.ok(requests.every(r=>r.status===200));console.log('PASS',JSON.stringify(report));
 }finally{clearTimeout(deadline);await browser?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
