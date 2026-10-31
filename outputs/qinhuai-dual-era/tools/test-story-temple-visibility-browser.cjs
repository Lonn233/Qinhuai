const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const {createServer}=require('../game/serve.cjs');
const root=path.resolve(__dirname,'..');
const LIGHT_KEY='qinhuai.main-lantern-lights.v1';
async function snapshot(page){return page.evaluate(()=>{
 const a=__QINHUAI_IMPORT__,effective=o=>{if(!o)return false;for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;};
 const count=root=>{let n=0;root?.traverse(o=>{if(o.isMesh&&effective(o)&&[o.material].flat().some(m=>m.visible!==false))n+=o.isInstancedMesh?o.count:1;});return n;};
 const water={};for(const id of ['lotus-main','lotus-one','chrysanthemum']){const e=a.festivalLanterns.entries.get(id);water[id]=(e?.batches||[]).filter(b=>!b.mesh.userData.festivalReflection&&!b.mesh.userData.festivalSpill).reduce((n,b)=>n+(effective(b.mesh)&&b.mesh.material.visible!==false?b.mesh.count:0),0);}
 return {mode:a.story.mode,inside:a.templeVisit.snapshot().inside,stage:a.story.snapshot.stage,tiles:a.loadedTileIds,gate:effective(a.modelRoot.getObjectByName('FuziTemple0340')),
  layers:Object.fromEntries(['streetlamps','festivalLanterns','featureLanterns','bridgeLanterns','redLanterns','placedLanterns','goldenTreeLanterns','courtyardRacks'].map(k=>[k,count(a[k].root)])),
  festivalIds:[...a.festivalLanterns.entries.keys()],featureIds:[...a.featureLanterns.entries.keys()],racksLoaded:a.courtyardRacks.ready,
  placed:a.placedLanterns.record.instances.map(item=>({id:item.id,x:item.x,z:item.z,visible:effective(a.placedLanterns.objects.get(item.id)),modelVisible:a.lanternLighting.getSettings(item.kind).modelVisible})),
  placedSpills:(a.nightLighting.environmentSpill.lanternChannels||[]).filter(c=>c.cacheKey.startsWith('placed-lantern|')).map(c=>c.cacheKey.slice('placed-lantern|'.length)),
  treeLights:count(a.courtyardLanterns.root.getObjectByName('CourtyardGoldenLanterns')),trees:count(a.courtyardLanterns.root.getObjectByName('CourtyardCopiedTrees')),
  interiorRendered:[...a.templeVisibility.gates.interior].reduce((n,g)=>n+count(g),0),water,waterQuality:a.riverStats.quality,nearQuality:a.nearLanternStats.mode,
  settings:a.lanternLighting.saved,startupError:__QINHUAI_STARTUP__.error};
 });}
function check(s,inside){
 assert.equal(s.mode,'play');assert.equal(s.inside,inside);assert.equal(s.startupError,null);assert.ok(s.tiles.includes(9),'story loads the shared facade/lantern tile before temple entry');assert.ok(s.gate,'temple entrance remains visible');assert.equal(s.waterQuality,'low');assert.equal(s.nearQuality,'five');assert.ok(s.treeLights>0,'courtyard tree lights stay visible');
 for(const id of ['lion','mountain','lotus-main','lotus-one','chrysanthemum'])assert.ok(s.festivalIds.includes(id),'loaded festival '+id);
 for(const id of ['gongming','tengma'])assert.ok(s.featureIds.includes(id),'loaded feature '+id);
 if(inside){for(const [key,n]of Object.entries(s.layers))if(key!=='courtyardRacks'&&key!=='placedLanterns')assert.equal(n,0,'hide outdoor '+key);assert.ok(s.layers.courtyardRacks>0);assert.ok(s.interiorRendered>0);assert.ok(s.trees>0);for(const n of Object.values(s.water))assert.equal(n,0);}
 else{for(const key of ['streetlamps','festivalLanterns','featureLanterns','bridgeLanterns','goldenTreeLanterns'])assert.ok(s.layers[key]>0,'show outdoor '+key);assert.equal(s.layers.courtyardRacks,0);assert.equal(s.interiorRendered,0);assert.equal(s.trees,0);assert.deepEqual(s.water,{'lotus-main':14,'lotus-one':16,chrysanthemum:5});}
 for(const item of s.placed){
  const courtyard=item.x>=-18.7&&item.x<=9.4&&item.z>=-58.15&&item.z<=-23.5;
  assert.equal(item.visible,item.modelVisible&&(!inside||courtyard),'placed lamp '+item.id+' visibility');
  if(inside&&!courtyard)assert.ok(!s.placedSpills.includes(item.id),'outdoor placed spill stays hidden');
 }
 if(s.settings.red?.modelVisible===false)assert.equal(s.layers.redLanterns,0,'user-hidden red lamps remain hidden across transitions');
}
async function main(){
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-story-visibility-'));
 const server=createServer({dataDir});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;const errors=[];
 try{
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=d3d11']});
  const page=await browser.newPage({viewport:{width:1280,height:800}});page.setDefaultTimeout(180000);page.on('pageerror',e=>errors.push(e.message));
  // An in-memory copy of the user's scene is optional; tests never write to it.
  const saved=process.env.QINHUAI_TEST_SCENE_SETTINGS?JSON.parse(await fs.readFile(process.env.QINHUAI_TEST_SCENE_SETTINGS,'utf8')):{version:1,revision:0,entries:{}};
  const entries=saved.entries||{};
  await page.addInitScript(entries=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>.65});if(!sessionStorage.getItem('visibility-fixture')){for(const[k,v]of Object.entries(entries))localStorage.setItem(k,v);sessionStorage.setItem('visibility-fixture','1');}},entries);
  await page.route('**/api/main-scene-settings**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(saved)}));
  await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html?performance=low`,{waitUntil:'domcontentloaded'});
  await page.locator('#menuShell [data-action="play"]').click();await page.locator('#menuShell [data-slot="slot-1"]').click();
  const ready=()=>page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.error||window.__QINHUAI_STARTUP__?.phase==='准备完成');await ready();
  await page.waitForFunction(()=>!__QINHUAI_IMPORT__.placedLanterns.pending.size);
  const before=await snapshot(page);check(before,false);assert.equal(before.layers.courtyardRacks,0);assert.ok(!before.racksLoaded,'interior racks do not load on story startup');
  const out=path.join(root,'work/temple-render',process.env.QINHUAI_TEST_SCENE_SETTINGS?'saved-regression':'default-regression');await fs.mkdir(out,{recursive:true});await page.screenshot({path:path.join(out,'story-start.png')});
  await page.locator('#storyTestToggle').click();await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.snapshot.testing&&!__QINHUAI_IMPORT__.story.snapshot.testBusy);
  const choose=async(value,inside,name)=>{await page.locator('#storyTestSelect').selectOption(value);await page.waitForFunction(v=>!__QINHUAI_IMPORT__.story.snapshot.testBusy&&String(__QINHUAI_IMPORT__.story.snapshot.testIndex)===v,value);await page.waitForTimeout(350);const s=await snapshot(page);check(s,inside);if(name)await page.screenshot({path:path.join(out,name+'.png')});console.log('PASS checkpoint',s.stage,value,'inside='+inside);};
  await choose('2',false,'lion');await choose('6',false,'water');await choose('9',false,'temple-outside');
  for(let cycle=0;cycle<2;cycle++){await choose('13',true,cycle?'':'temple-inside');await choose('6',false,cycle?'':'water-after-exit');}
  await page.locator('#storyTestExit').click();await page.waitForFunction(()=>!__QINHUAI_IMPORT__.story.snapshot.testing);check(await snapshot(page),false);
  // Resume a real save from inside, then leave via the normal E interaction.
  await page.evaluate(()=>__QINHUAI_IMPORT__.templeVisit.restore(true));check(await snapshot(page),true);
  await page.locator('#storyBack').click();await page.locator('#menuShell [data-action="continue"]').waitFor();
  await page.reload({waitUntil:'domcontentloaded'});await page.locator('#menuShell [data-action="continue"]').click();await page.locator('#menuShell [data-slot="slot-1"]').click();await ready();check(await snapshot(page),true);
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.templeVisit.snapshot().near);await page.keyboard.press('KeyE');await page.waitForFunction(()=>!__QINHUAI_IMPORT__.templeVisit.snapshot().busy&&!__QINHUAI_IMPORT__.templeVisit.snapshot().inside);check(await snapshot(page),false);
  if(entries[LIGHT_KEY])assert.equal(await page.evaluate(k=>localStorage.getItem(k),LIGHT_KEY),entries[LIGHT_KEY],'saved brightness/colors/switches are unchanged');
  assert.deepEqual(errors,[]);console.log('PASS: actual play startup, both temple crossings, water instances, checkpoint backtracking, resume-inside/E-exit, saved preferences, low water and 5% lantern models.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
