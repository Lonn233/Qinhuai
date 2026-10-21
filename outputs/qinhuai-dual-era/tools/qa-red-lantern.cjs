const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const out='work/red-lantern-20261019/';
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});const context=await browser.newContext({viewport:{width:1280,height:900},deviceScaleFactor:1});const errors=[];context.on('page',p=>{p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});});const page=await context.newPage();
const ready=()=>page.waitForFunction(()=>window.__BUILDING_STUDY__?.redLanterns?.stats.lamps>0&&!document.querySelector('#controls').disabled,null,{timeout:120000});
const screenshot=async(name)=>{await page.waitForTimeout(200);await page.locator('#viewport').screenshot({path:out+name+'.png'});};
try{
 await page.goto('http://127.0.0.1:4180/building-light-study.html?building=matou',{waitUntil:'domcontentloaded'});await ready();await page.locator('#red-detail').click();
 const snapshot=()=>page.evaluate(()=>{const a=window.__BUILDING_STUDY__;return {settings:a.snapshot,exposure:a.renderer.toneMappingExposure,materials:a.model.children.flatMap(o=>{const materials=[];o.traverse(m=>{if(m.isMesh&&m.name!=='RedLanternReceiver')materials.push([m.name,m.geometry.uuid,...(Array.isArray(m.material)?m.material:[m.material]).map(mat=>[mat.uuid,mat.color?.getHex(),mat.emissive?.getHex(),mat.emissiveIntensity])]);});return materials;})};});
 const baseline=await snapshot();await screenshot('on');
 await page.locator('#red-enabled').uncheck();await screenshot('off');assert.deepEqual(await snapshot(),baseline);
 assert.equal(await page.evaluate(()=>window.__BUILDING_STUDY__.redLanterns.receivers.every(r=>!r.visible)),true);
 await page.locator('#red-enabled').check();await page.locator('#red-halo').fill('0');await page.locator('#red-halo').dispatchEvent('input');await page.locator('#red-walls').uncheck();await screenshot('eaves-only');
 await page.locator('#red-eaves').uncheck();await page.locator('#red-walls').check();await screenshot('walls-only');
 await page.locator('#red-walls').uncheck();await screenshot('no-spill');assert.deepEqual(await snapshot(),baseline);
 for(const [id,value] of [['red-brightness','1.4'],['red-temperature','4500'],['red-spillRange','2.2'],['red-halo','0.6']]){await page.locator('#'+id).fill(value);await page.locator('#'+id).dispatchEvent('input');}
 await page.locator('#red-eaves').check();await page.locator('#red-walls').check();assert.deepEqual(await snapshot(),baseline);
 const settings=await page.evaluate(()=>window.__BUILDING_STUDY__.redLanterns.settings);
 await page.reload({waitUntil:'domcontentloaded'});await ready();assert.deepEqual(await page.evaluate(()=>window.__BUILDING_STUDY__.redLanterns.settings),settings);
 await page.locator('#building-select').selectOption('temple');await page.waitForFunction(()=>window.__BUILDING_STUDY__?.building==='temple'&&!document.querySelector('#controls').disabled,null,{timeout:120000});assert.equal(await page.locator('#red-enabled').isDisabled(),true);assert.equal(await page.evaluate(()=>window.__BUILDING_STUDY__.scene.getObjectByName('RedLanternOverlay')===undefined),true);
 await page.locator('#building-select').selectOption('matou');await ready();await page.locator('#red-reset').click();await page.locator('#red-detail').click();await page.screenshot({path:out+'study-detail.png'});await page.locator('#reset').click();await page.screenshot({path:out+'study-full.png'});
 const studyStats=await page.evaluate(()=>window.__BUILDING_STUDY__.redLanterns.stats);
 // Release the study WebGL context before loading the full city in software QA.
 await page.route('**/red-lantern-sync-check.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><link rel="icon" href="data:,"><title>Lightweight storage test</title>'}));
 await page.goto('http://127.0.0.1:4180/red-lantern-sync-check.html');
 const map=await context.newPage();await map.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&view=redLanterns&gateLight=gold',{waitUntil:'domcontentloaded'});await map.waitForFunction(expected=>window.__QINHUAI_IMPORT__?.redLanterns.stats.lamps===expected,JSON.parse(fs.readFileSync('assets/red-lantern/layout.json')).placements.length,{timeout:180000}).catch(async()=>{const v=await map.evaluate(()=>({stats:window.__QINHUAI_IMPORT__?.redLanterns?.stats,tiles:window.__QINHUAI_IMPORT__?.loadedTileIds}));throw Error(JSON.stringify(v));});
 await map.addStyleTag({content:'#toolbar,#help,#perf,#progress,#status{display:none!important}'});await map.waitForTimeout(700);await map.screenshot({path:out+'map-detail.png'});
 const mapStats=await map.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;return {lamps:a.redLanterns.stats,receivers:a.redLanterns.receivers.reduce((sum,m)=>sum+m.geometry.attributes.position.count/3,0),tiles:a.loadedTileIds,lost:a.renderer.getContext().isContextLost()};});
 await page.evaluate(()=>{const key='qinhuai.red-lantern-light.v1',s=JSON.parse(localStorage.getItem(key));s.enabled=false;localStorage.setItem(key,JSON.stringify(s));});await map.waitForFunction(()=>window.__QINHUAI_IMPORT__.redLanterns.settings.enabled===false);await map.screenshot({path:out+'map-off.png'});
 await page.evaluate(()=>{const key='qinhuai.red-lantern-light.v1',s=JSON.parse(localStorage.getItem(key));s.enabled=true;localStorage.setItem(key,JSON.stringify(s));});await map.waitForFunction(()=>window.__QINHUAI_IMPORT__.redLanterns.settings.enabled===true);
 await map.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.redLanterns.setState({night:false});});
 assert.equal(await map.evaluate(()=>window.__QINHUAI_IMPORT__.redLanterns.groups.every(g=>g.uniforms.power.value===0&&!g.halo.visible)),true);
 await map.evaluate(()=>window.__QINHUAI_IMPORT__.redLanterns.setState({night:true,wireframe:true}));assert.equal(await map.evaluate(()=>window.__QINHUAI_IMPORT__.redLanterns.receivers.every(r=>!r.visible)),true);
 await map.evaluate(()=>window.__QINHUAI_IMPORT__.redLanterns.setState({night:true,wireframe:false}));
 await map.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.camera.position.set(-32,19,12);a.camera.lookAt(-32,13,-4);});
 await map.screenshot({path:out+'map-row.png'});
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'browser-qa.json',JSON.stringify({studyStats,mapStats,settingsPersisted:true,buildingMaterialsAndSettingsUnchanged:true,crossTabSync:true,errors},null,2));console.log('QA PASS',JSON.stringify({studyStats,mapStats,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
