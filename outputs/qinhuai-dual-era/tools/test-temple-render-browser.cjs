const assert=require('node:assert/strict'),fs=require('node:fs/promises');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=d3d11']});
 const timer=setTimeout(()=>browser.close(),240000);
 try {
  const page=await browser.newPage({viewport:{width:800,height:500}}),errors=[];
  page.on('pageerror',e=>{errors.push(e.message);console.error('PAGEERROR',e.message);});
  await page.route('**/api/main-scene-settings**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({version:1,revision:0,entries:{}})}));
  await page.route('**/assets/qinhuai-modern-import/manifest.json',async r=>{const manifest=JSON.parse(await fs.readFile('assets/qinhuai-modern-import/manifest.json','utf8'));manifest.tiles=manifest.tiles.filter(t=>t.id===9);await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(manifest)});});
  await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?mode=orbit&time=night&view=courtyard&nearModels=current',{waitUntil:'domcontentloaded'});
  await page.locator('#menuShell [data-action="preview"]').click();
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.error||window.__QINHUAI_STARTUP__?.phase==='准备完成',null,{timeout:180000});
  assert.equal(await page.evaluate(()=>window.__QINHUAI_STARTUP__.error),null);
  const snapshot=()=>page.evaluate(()=>{
   const a=window.__QINHUAI_IMPORT__,effective=o=>{if(!o)return false;for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
   const exterior=[a.streetlamps,a.festivalLanterns,a.featureLanterns,a.bridgeLanterns,a.redLanterns,a.placedLanterns,a.goldenTreeLanterns];
   let renderedInterior=0,renderedExterior=0,interiorTotal=0,interiorTriangles=0;
   a.modelRoot.traverse(o=>{if(o.userData.templeVisibilityGate==='interior'){interiorTotal++;if(effective(o))renderedInterior++;o.traverse(m=>{if(m.isMesh)interiorTriangles+=(m.geometry.index?.count||m.geometry.attributes.position?.count||0)/3*(m.isInstancedMesh?m.count:1);});}});
   for(const layer of exterior)layer.root.traverse(o=>{if(o.isMesh&&effective(o))renderedExterior++;});
   return {inside:a.templeVisit.snapshot().inside,stats:a.templeVisibility.stats,renderedInterior,interiorTotal,interiorTriangles,renderedExterior,water:a.riverStats,selector:document.querySelector('#waterQuality').value,
    courtyardLight:effective(a.courtyardLanterns.root.getObjectByName('CourtyardGoldenLanterns')),courtyardTree:effective(a.courtyardLanterns.root.getObjectByName('CourtyardCopiedTrees')),
    gate:effective(a.modelRoot.getObjectByName('FuziTemple0340')),racks:effective(a.courtyardRacks.root),boats:[...a.nightLighting.boatLanterns.meshes].filter(effective).length,
    spill:a.nightLighting.environmentSpill.lanternChannels?.map(c=>c.cacheKey)||[]};
  });
  const outside=await snapshot();console.log('OUTSIDE',JSON.stringify(outside));
  assert.equal(outside.inside,false);assert.ok(outside.interiorTotal>=4);assert.equal(outside.renderedInterior,0);assert.equal(outside.courtyardTree,false);assert.equal(outside.courtyardLight,true);assert.equal(outside.gate,true);assert.ok(outside.renderedExterior>0);
  assert.equal(outside.water.quality,'low');assert.equal(outside.water.captureHz,3);assert.equal(outside.water.resolution,256);assert.equal(outside.selector,'low');
  await fs.mkdir('work/temple-render',{recursive:true});await page.screenshot({path:'work/temple-render/outside.png'});
  for(let cycle=0;cycle<2;cycle++){
   await page.evaluate(async()=>{const a=__QINHUAI_IMPORT__;await a.templeVisit.restore(true);a.setWireframe(true);a.setWireframe(false);a.lanternLighting.apply();});
   await page.waitForTimeout(350);const inside=await snapshot();console.log('INSIDE '+cycle,JSON.stringify(inside));
   assert.equal(inside.inside,true);assert.equal(inside.renderedExterior,0);assert.equal(inside.boats,0);assert.ok(inside.renderedInterior>0);assert.equal(inside.courtyardTree,true);assert.equal(inside.courtyardLight,true);assert.equal(inside.racks,true);
   assert.ok(inside.spill.every(k=>k==='lantern|courtyard'||k.startsWith('lantern|rack-')));
   if(!cycle)await page.screenshot({path:'work/temple-render/inside.png'});
   await page.evaluate(()=>__QINHUAI_IMPORT__.templeVisit.restore(false));await page.waitForTimeout(300);
   const back=await snapshot();console.log('EXIT '+cycle,JSON.stringify(back));assert.equal(back.renderedInterior,0);assert.ok(back.renderedExterior>0);assert.equal(back.courtyardLight,true);assert.equal(back.courtyardTree,false);
  }
  assert.deepEqual(errors,[]);console.log('PASS: real main scene default water, late temple load, two enter/exit cycles, tree-light exception, outdoor model and spill isolation.');
 } finally {clearTimeout(timer);await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
