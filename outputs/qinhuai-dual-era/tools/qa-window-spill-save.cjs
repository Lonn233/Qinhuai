// Run against the existing local server; uses an isolated browser storage context.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.resolve(__dirname,'../../../work/window-spill-save-20261019');fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const errors=[],checks=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+': '+r.url());});
  await page.addInitScript(()=>{if(!localStorage.getItem('qa.window-spill-seeded')){localStorage.setItem('qa.window-spill-seeded','1');const old={key:'legacy-point',label:'旧版点位方案',state:{enabled:false,preset:'eave',selectedId:null,points:[]}};localStorage.setItem('qinhuai.building-manual-spill.v1',JSON.stringify({matou:[old],pavilion:[{...old,key:'pavilion-old',label:'魁星阁旧方案'}]}));}});
  const ready=async(building='matou')=>page.waitForFunction(building=>window.__BUILDING_STUDY__?.building===building&&!document.getElementById('controls').disabled&&document.getElementById('status').hidden,building,{timeout:120000});
  await page.goto('http://127.0.0.1:4173/building-light-study.html?building=matou&v=window-spill-save-20261019');await ready();
  const snapshot=()=>page.evaluate(()=>{const s=window.__BUILDING_STUDY__;return {surfaceSpill:s.surfaceSettings,windowLight:s.windowSettings,manualSpill:s.manualSpillSettings};});
  const set=async(id,value)=>page.evaluate(({id,value})=>{const e=document.getElementById(id);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));},{id,value});
  const open=locator=>locator.evaluate(e=>{for(let p=e;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});
  const verifyControls=async expected=>{
   for(const [key,value]of Object.entries(expected.surfaceSpill.window.floors?.first||expected.surfaceSpill.window)){
    const el=page.locator('#ss-window-'+key+(typeof value==='boolean'?'':'-number'));
    assert.equal(typeof value==='boolean'?await el.isChecked():Number(await el.inputValue()),value,'window exterior UI '+key);
   }
   assert.equal(await page.locator('#wl-binding-label').textContent(),'分层独立调光');
   assert.equal(await page.locator('#wl-color-code').inputValue(),(expected.windowLight.floors?.first||expected.windowLight).color);
   assert.equal(Number(await page.locator('#wl-brightness-number').inputValue()),(expected.windowLight.floors?.first||expected.windowLight).brightness);
  };
  await open(page.locator('#ss-window-enabled'));
  await set('ss-window-enabled',true);
  for(const [k,v]of Object.entries({intensity:2.7,distance:17.5,angle:130,azimuth:22,elevation:-38,softness:.94}))await set('ss-window-'+k+'-number',v);
  await set('ss-window-shadows',false);await set('wl-color-code','#d98a39');await set('wl-brightness-number',2.15);
  await set('wl-distance-number',7.4);await set('wl-sourceDistance-number',2.1);await set('wl-angle-number',95);await set('wl-azimuth-number',12);await set('wl-elevation-number',-15);await set('wl-softness-number',.82);
  await page.evaluate(()=>{const a=window.__BUILDING_STUDY__;a.addManualPoint(a.controls.target.toArray(),[0,0,1]);});
  const expected=await snapshot(),base=await page.evaluate(()=>window.__BUILDING_STUDY__.settings);
  await page.locator('#manual-scheme-name').fill('窗户外溢 · 参数全存');await page.locator('#manual-save').click();
  let records=await page.evaluate(()=>JSON.parse(localStorage.getItem('qinhuai.building-manual-spill.v1')));
  const named=records.matou.find(s=>s.label==='窗户外溢 · 参数全存');assert.ok(named);assert.deepEqual(named.surfaceSpill,expected.surfaceSpill);assert.deepEqual(named.windowLight,expected.windowLight);assert.deepEqual(named.state,expected.manualSpill);assert.equal(records.matou.length,2);assert.equal(records.pavilion[0].key,'pavilion-old');checks.push('Save As stores every window exterior parameter, window lighting and manual points without overwriting existing schemes');
  const change=async()=>{await set('ss-window-enabled',false);await set('ss-window-distance-number',2);await set('ss-window-intensity-number',.25);await set('ss-window-angle-number',55);await set('ss-window-azimuth-number',-25);await set('ss-window-elevation-number',40);await set('ss-window-softness-number',.1);await set('ss-window-shadows',true);await set('wl-color-code','#326bff');await set('wl-brightness-number',.4);await page.evaluate(()=>window.__BUILDING_STUDY__.setManualSpill({enabled:false,points:[]}));};
  await change();await page.locator('[data-manual-saved="'+named.key+'"]').click();assert.deepEqual(await snapshot(),expected);await verifyControls(expected);assert.deepEqual(await page.evaluate(()=>window.__BUILDING_STUDY__.settings),base);checks.push('Restoring Save As restores all controls and points without modifying other architectural light/material settings');
  await page.reload();await ready();assert.deepEqual(await snapshot(),expected);await verifyControls(expected);checks.push('Window spill survives page reload and draft restoration');
  await change();await page.locator('[data-manual-saved="'+named.key+'"]').click();assert.deepEqual(await snapshot(),expected);checks.push('Named external spill scheme is readable after full serialization/reload');
  const beforeLegacy=await snapshot();await page.locator('[data-manual-saved="legacy-point"]').click();const afterLegacy=await snapshot();assert.deepEqual(afterLegacy.surfaceSpill,beforeLegacy.surfaceSpill);assert.deepEqual(afterLegacy.windowLight,beforeLegacy.windowLight);assert.deepEqual(afterLegacy.manualSpill.points,[]);checks.push('Old point-only schemes do not clear current window or regional spill settings');
  await page.locator('[data-manual-saved="'+named.key+'"]').click();await page.getByRole('button',{name:'删除点位方案 旧版点位方案',exact:true}).click();records=await page.evaluate(()=>JSON.parse(localStorage.getItem('qinhuai.building-manual-spill.v1')));assert.deepEqual(records.matou,[named]);checks.push('Deleting another saved scheme does not strip window exterior data from the remaining scheme');
  await page.locator('#save-name').fill('完整方案 · 窗户外溢');await page.locator('#wl-save').click();
  const full=await page.evaluate(()=>JSON.parse(localStorage.getItem('qinhuai.building-light-studies.v1')).items.at(-1));assert.deepEqual(full.surfaceSpill,expected.surfaceSpill);assert.deepEqual(full.windowLight,expected.windowLight);await change();await open(page.locator('[data-saved-key="'+full.key+'"]'));await page.locator('[data-saved-key="'+full.key+'"]').click();assert.deepEqual(await snapshot(),expected);await verifyControls(expected);checks.push('Complete lighting scheme Save As also round-trips window exterior and independent floor-window settings');
  await page.locator('#building-select').selectOption('pavilion');await ready('pavilion');assert.equal(await page.locator('[data-manual-saved="'+named.key+'"]').count(),0);await page.locator('#building-select').selectOption('matou');await ready();assert.deepEqual(await snapshot(),expected);checks.push('Switching buildings keeps separate libraries and preserves the Matou window exterior settings');
  await open(page.locator('#ss-window-enabled'));await page.locator('#ss-window-enabled').evaluate(e=>e.scrollIntoView({block:'start'}));
  await page.locator('#manual-markers').uncheck();await page.waitForTimeout(500);await page.screenshot({path:path.join(output,'window-spill-restored.png')});await page.locator('#viewport').screenshot({path:path.join(output,'window-spill-scene.png')});
  const stats=await page.evaluate(()=>window.__BUILDING_STUDY__.surfaceLayer.stats);assert.ok(stats.active);assert.ok(stats.coverage.window>0);assert.deepEqual(errors,[]);
  const report={passed:true,checks,expected,stats,errors};fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,checks,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
