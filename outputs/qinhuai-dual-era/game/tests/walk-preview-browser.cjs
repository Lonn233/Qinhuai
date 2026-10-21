const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {createServer}=require('../serve.cjs');
const {DEFAULT_LIGHTS}=require('../lion-study/defaults.cjs');
const {SIZE_SPECS}=require('../lion-study/dimensions.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-walk-browser-'));
 const server=createServer({dataDir});let browser;const checks=[],errors=[];
 const pass=s=>{checks.push(s);console.log('PASS:',s);};
 try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url=`http://127.0.0.1:${server.address().port}/lion-light-study.html?scene=festival&lantern=mountain&effect=6`;
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
  const page=await browser.newPage({viewport:{width:1440,height:945}});page.on('pageerror',e=>errors.push(String(e)));
  const studyReady=()=>page.waitForFunction(()=>window.__LION_STUDY__?.ready,null,{timeout:90000});
  const walkReady=async()=>{await page.waitForFunction(()=>window.__LION_STUDY__.walk.ready||window.__LION_STUDY__.walk.error,null,{timeout:180000});assert.equal(await page.evaluate(()=>window.__LION_STUDY__.walk.error),null);};
  await page.goto(url);await studyReady();
  assert.equal(await page.locator('#brightness').inputValue(),'112');assert.equal(await page.locator('#light-color').inputValue(),'#fffbf5');
  const defaults=await page.evaluate(()=>window.__LION_STUDY__.allTuning);
  for(const [id,t]of Object.entries(defaults)){assert.equal(t.power,DEFAULT_LIGHTS[id].power);assert.equal(t.color,DEFAULT_LIGHTS[id].color);assert.equal(t.sizeMeters,SIZE_SPECS[id].initial);}
  pass('All five user colours and intensities are defaults, including stale effect URL');
  await page.screenshot({path:path.resolve(__dirname,'../lion-study/walk-studio.png')});
  await page.locator('#brightness').fill('93');await page.locator('#brightness').dispatchEvent('input');
  await page.locator('#model-size-number').fill('14');await page.locator('#model-size-number').dispatchEvent('input');
  await page.locator('#walk-open').click();await walkReady();
  const models=await page.evaluate(()=>window.__LION_STUDY__.walk.models);
  assert.equal(models.length,5);assert.equal(models.find(m=>m.id==='mountain').power,.93);assert.equal(models.find(m=>m.id==='mountain').sizeMeters,14);
  for(const m of models)if(m.id!=='mountain'){assert.equal(m.power,DEFAULT_LIGHTS[m.id].power);assert.equal(m.color,DEFAULT_LIGHTS[m.id].color);assert.equal(m.sizeMeters,SIZE_SPECS[m.id].initial);}
  assert.equal(await page.locator('#walk-stations button').count(),5);
  assert.equal(await page.locator('#walk-dialog').evaluate(d=>d.open),true);
  pass('All five real models load together with independent light uniforms and current draft dimensions');
  await page.screenshot({path:path.resolve(__dirname,'../lion-study/walk-overview.png')});
  const start=await page.evaluate(()=>window.__LION_STUDY__.walk.camera.position);
  await page.keyboard.down('w');await page.waitForTimeout(1000);await page.keyboard.up('w');
  const end=await page.evaluate(()=>window.__LION_STUDY__.walk.camera.position);
  assert.equal(end[1],1.65);assert.ok(Math.hypot(end[0]-start[0],end[2]-start[2])>.08);
  pass('First-person WASD movement works at a fixed 1.65m eye level');
  const area=await page.locator('#walk-viewport').boundingBox();
  const rotation=await page.evaluate(()=>window.__LION_STUDY__.walk.camera.rotation);
  await page.mouse.move(area.x+area.width*.5,area.y+area.height*.5);await page.mouse.down();await page.mouse.move(area.x+area.width*.65,area.y+area.height*.55,{steps:5});await page.mouse.up();
  const turned=await page.evaluate(()=>window.__LION_STUDY__.walk.camera.rotation);assert.notEqual(turned[1],rotation[1]);
  pass('Drag-to-look works without pointer lock permission');
  for(const id of ['lion','fish','crane','lotus','mountain']){
   await page.locator(`[data-station="${id}"]`).click();assert.equal(await page.locator(`[data-station="${id}"]`).getAttribute('aria-pressed'),'true');
   assert.equal((await page.evaluate(()=>window.__LION_STUDY__.walk.camera.position))[1],1.65);
   await page.screenshot({path:path.resolve(__dirname,`../lion-study/walk-${id}.png`)});
  }
  pass('Five quick-view stations keep true first-person scale');
  await page.locator('#walk-close').click();assert.equal(await page.evaluate(()=>window.__LION_STUDY__.walk.active),false);
  assert.equal(await page.locator('#viewport canvas').count(),1);assert.equal(await page.locator('#brightness').inputValue(),'93');assert.equal(await page.locator('#model-size-number').inputValue(),'14');
  await page.locator('#restore-default').click();assert.equal(await page.locator('#brightness').inputValue(),'112');assert.equal(await page.locator('#model-size-number').inputValue(),'14');
  pass('Returning restores studio draft and default-colour reset does not alter size');
  await page.locator('[data-lantern="fish"]').click();await studyReady();assert.equal(await page.locator('#brightness').inputValue(),'53');
  await page.locator('[data-lantern="crane"]').click();await studyReady();assert.equal(await page.locator('#brightness').inputValue(),'112');
  await page.locator('[data-lantern="lotus"]').click();await studyReady();assert.equal(await page.locator('#brightness').inputValue(),'135');
  await page.locator('[data-lantern="lion"]').click();await studyReady();assert.equal(await page.locator('#brightness').inputValue(),'71');
  pass('Switching through all models actually applies each saved default');
  await page.setViewportSize({width:390,height:844});await page.locator('#walk-open').click();await walkReady();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.ok(await page.locator('.walk-touch').isVisible());
  const before=await page.evaluate(()=>window.__LION_STUDY__.walk.camera.position);
  const button=await page.locator('[data-move="forward"]').boundingBox();await page.mouse.move(button.x+button.width/2,button.y+button.height/2);await page.mouse.down();await page.waitForTimeout(600);await page.mouse.up();
  const after=await page.evaluate(()=>window.__LION_STUDY__.walk.camera.position);assert.ok(Math.hypot(after[0]-before[0],after[2]-before[2])>.05);
  await page.screenshot({path:path.resolve(__dirname,'../lion-study/walk-mobile.png')});
  await page.keyboard.press('Escape');assert.equal(await page.locator('#walk-dialog').evaluate(d=>d.open),false);
  pass('Mobile controls, responsive layout, re-entry and Escape close work');
  await page.setViewportSize({width:1440,height:945});await page.reload();await studyReady();
  assert.equal(await page.locator('#brightness').inputValue(),'112');assert.equal(await page.locator('#model-size-number').inputValue(),'13');
  await page.locator('#walk-open').click();await page.locator('#walk-close').click();await page.waitForTimeout(1000);assert.equal(await page.evaluate(()=>window.__LION_STUDY__.walk.active),false);assert.equal(await page.locator('#viewport canvas').count(),1);
  pass('Defaults survive reload and closing during loading cancels safely');
  assert.deepEqual(errors,[]);
  await fs.writeFile(path.resolve(__dirname,'../lion-study/walk-verification.json'),JSON.stringify({checks,models,errors},null,2));console.log(JSON.stringify({checks,errors},null,2));
 }finally{
  if(browser)await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});
  const resolved=path.resolve(dataDir);if(path.dirname(resolved)!==path.resolve(os.tmpdir())||!path.basename(resolved).startsWith('qinhuai-walk-browser-'))throw Error('Unsafe cleanup target');await fs.rm(resolved,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
