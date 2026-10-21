const assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createServer}=require('../serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-scene-browser-')),server=createServer({dataDir});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const A='qinhuai.map-light-controls.v1',B='qinhuai.building-environment.v1',C='qinhuai.building-light-studies.v1',errors=[];
 const original={[A]:'{ "version": 1, "settings": {"exposure":0.73,"groundIntensity":0,"customUnknown":"keep"}}',[B]:'{"version":1,"buildings":{"matou-01":{"color":"#d077ff","inheritColor":false,"distance":7.5}}}',[C]:'{"version":1,"items":[{"label":"Chrome 旧收藏","future":7}]}'};
 const saved=async p=>p.waitForFunction(()=>document.querySelector('#scenePersistence')?.dataset.state==='saved');
 const disk=async()=>JSON.parse(await fs.readFile(path.join(dataDir,'main-scene-settings.json'),'utf8'));
 const context=await browser.newContext({viewport:{width:1100,height:850}});let p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.goto(origin+'/api/main-scene-settings');await p.evaluate(entries=>{for(const[k,v]of Object.entries(entries))localStorage.setItem(k,v);},original);
  await p.goto(origin+'/chrome-settings-backup.html');await saved(p);assert.deepEqual((await disk()).entries,original);
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),A),original[A]);console.log('PASS current Chrome values captured byte-for-byte, no defaults or preset rewrites');
  await fs.mkdir('work/main-scene-storage-20261019',{recursive:true});await p.screenshot({path:'work/main-scene-storage-20261019/chrome-backup.png'});
  // The helper watches the already-open map tab without reloading it.
  const old=await context.newPage();await old.goto(origin+'/api/main-scene-settings');const edited='{"version":1,"settings":{"exposure":0.91,"groundIntensity":0}}';await old.evaluate(([k,v])=>localStorage.setItem(k,v),[A,edited]);
  await p.waitForFunction(()=>document.querySelector('#sceneSaveStatus').textContent.includes('类'));await new Promise(r=>setTimeout(r,1500));assert.equal((await disk()).entries[A],edited);console.log('PASS original old map tab edits auto-save through Chrome capture tab');
  await p.route('**/api/main-scene-settings**',r=>r.abort());await old.evaluate(k=>localStorage.setItem(k,'offline-edit'),A);await p.waitForFunction(()=>document.querySelector('#scenePersistence').dataset.state==='error');assert.equal((await disk()).entries[A],edited);
  await p.unroute('**/api/main-scene-settings**');await saved(p);assert.equal((await disk()).entries[A],'offline-edit');console.log('PASS offline edit retained and retried without falsely claiming saved');
  // A completely different browser with no local cache restores disk values before engine startup.
  const clean=await browser.newContext();const restored=await clean.newPage();
  await restored.route('**/qinhuai-modern-import.bundle.js*',r=>r.fulfill({contentType:'text/javascript',body:'window.__ENGINE_SNAPSHOT__=Object.fromEntries(Object.entries(localStorage));'}));
  await restored.goto(origin+'/qinhuai-modern-import.html?time=night');await restored.waitForFunction(()=>window.__ENGINE_SNAPSHOT__);await saved(restored);
  assert.equal(await restored.evaluate(k=>window.__ENGINE_SNAPSHOT__[k],B),original[B]);assert.equal(await restored.evaluate(k=>window.__ENGINE_SNAPSHOT__[k],C),original[C]);console.log('PASS empty browser restores disk settings before 3D initialization');
  // Competing saved browser must preserve its own version, never silently replace either side.
  const alternate=await browser.newContext(),other=await alternate.newPage();await other.goto(origin+'/api/main-scene-settings');await other.evaluate(k=>localStorage.setItem(k,'other-browser-colors'),A);
  await other.goto(origin+'/chrome-settings-backup.html');await other.waitForFunction(()=>document.querySelector('#scenePersistence').dataset.state==='conflict');assert.equal((await disk()).entries[A],'offline-edit');assert.equal(await other.evaluate(k=>localStorage.getItem(k),A),'other-browser-colors');
  await other.click('#sceneSaveAdopt');await saved(other);assert.equal((await disk()).entries[A],'other-browser-colors');assert.equal((await disk()).entries[C],original[C]);console.log('PASS conflicts retain both versions, explicit adoption preserves unrelated presets');
  const snapshots=await fs.readdir(path.join(dataDir,'chrome-setting-snapshots'));assert.ok(snapshots.length>=2);assert.equal(errors.length,0);
  await fs.writeFile('work/main-scene-storage-20261019/qa.json',JSON.stringify({ok:true,dataDir,snapshots:snapshots.length,errors},null,2));
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
