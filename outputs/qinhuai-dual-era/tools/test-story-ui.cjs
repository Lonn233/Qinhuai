const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
let playwright;try { playwright = require('playwright'); } catch { playwright = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const {createServer} = require('../game/serve.cjs');
(async () => {
 const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qinhuai-story-ui-'));
 const server = createServer({dataDir});
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 let browser;
 try {
  browser = await playwright.chromium.launch({executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
  const page = await browser.newPage({viewport: {width:1440,height:900}});
  page.setDefaultTimeout(90000);
  page.on('crash',()=>console.error('PAGE CRASH')); 
  const errors=[]; page.on('pageerror', error => {errors.push(error.message);console.error('PAGE ERROR',error.message);});page.on('console',msg=>{if(msg.type()==='error')console.error('BROWSER',msg.text().slice(0,300));});
  const out=path.resolve(__dirname,'../work');await fs.mkdir(out,{recursive:true});
  await page.addInitScript(()=>Object.defineProperty(window,'devicePixelRatio',{get:()=>.25}));
  await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html`, {waitUntil:'domcontentloaded', timeout:180000});
  await page.waitForFunction(() => document.querySelector('#storyStart')?.disabled === false || !!window.__QINHUAI_IMPORT__, null, {timeout:90000});
  await page.evaluate(() => {const a=window.__QINHUAI_IMPORT__;if(a){a.renderer.setPixelRatio(.25);}});
  await page.waitForFunction(() => document.querySelector('#storyStart')?.disabled === false, null, {timeout:300000});
  console.log('PASS actual main scene boot');
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.timeOfDay),'day','preview startup keeps its default time');
  await page.evaluate(() => { const a=window.__QINHUAI_IMPORT__; a.setPerformanceProfile('low'); a.renderer.setPixelRatio(.35); });
  await page.evaluate(()=>document.getElementById('storyStart').click());
  await page.waitForFunction(() => window.__QINHUAI_IMPORT__.story.mode === 'play', null, {timeout:180000});
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.timeOfDay),'night','new game enters at 20:00');
  console.log('PASS new game uses 20:00 night lighting');
  const styles = await page.evaluate(() => {
   const ids=['storyQuest','storyMapPanel','storyDialogue'];
   return {boxes:ids.map(id=>{const e=document.getElementById(id),s=getComputedStyle(e);return {id,background:s.backgroundColor,image:s.backgroundImage,shadow:s.boxShadow};}),lamps:document.querySelectorAll('#storyLampProgress li').length,scene:window.__QINHUAI_IMPORT__.scene.uuid,toolbar:getComputedStyle(document.querySelector('#toolbar')).display,fonts:getComputedStyle(document.querySelector('#storyChapter')).fontFamily};
  });
  for(const b of styles.boxes){assert.equal(b.background,'rgba(0, 0, 0, 0)',b.id+' transparent');assert.equal(b.image,'none',b.id+' no background image');}
  assert.equal(styles.lamps,7);assert.equal(styles.toolbar,'none');console.log('PASS transparent left HUD, seven-lamp tracker, hidden editor',JSON.stringify(styles));
  await page.screenshot({path:path.join(out,'story-ui-gold-desktop.png'),timeout:90000});
  await page.evaluate(() => {const a=window.__QINHUAI_IMPORT__,p=a.story.world.workshop;a.player.spawn({x:p.x,z:p.z+.6,ground:p.y});a.player.updateCamera(0,true);});
  await page.waitForFunction(() => window.__QINHUAI_IMPORT__.story.snapshot.current?.kind==='master');
  await page.keyboard.press('KeyE');
  await page.locator('#storyDialogue').waitFor({state:'visible'});
  assert.equal(await page.locator('#storySubtitle').evaluate(e=>getComputedStyle(e).color),'rgb(255, 255, 255)');
  await page.screenshot({path:path.join(out,'story-ui-gold-dialogue.png'),timeout:90000});
  await page.locator('#storyDialogueNext').click();
  await page.locator('#storyDialogueNext').click();
  await page.waitForFunction(() => window.__QINHUAI_IMPORT__.story.snapshot.stage==='observe');
  assert.equal(await page.locator('#storyLampProgress [aria-current="step"]').getAttribute('data-lamp'),'lion');
  await page.locator('#storyCatalogButton').click();
  assert.equal(await page.locator('.story-book-index button').count(),7);
  await page.screenshot({path:path.join(out,'story-ui-gold-catalog.png'),timeout:90000});
  await page.locator('#storyModalClose').click();
  for(const [width,height] of [[1280,720],[390,844],[844,390]]){
   await page.setViewportSize({width,height});
   const overlap=await page.evaluate(()=>{const r=id=>document.getElementById(id).getBoundingClientRect(),q=r('storyQuest'),m=r('storyMapPanel'),n=r('storyNav');return {leftOverlap:q.bottom>m.top,quest:{top:q.top,bottom:q.bottom},map:{top:m.top,bottom:m.bottom},navOverlap:q.right>n.left&&q.top<n.bottom,overflow:document.documentElement.scrollWidth>innerWidth};});
   assert.equal(overlap.leftOverlap,false,`${width}x${height} quest/map overlap: ${JSON.stringify(overlap)}`);assert.equal(overlap.navOverlap,false,`${width}x${height} quest/nav overlap`);assert.equal(overlap.overflow,false,'no horizontal overflow');
   await page.screenshot({path:path.join(out,`story-ui-gold-${width}.png`),timeout:90000});
   console.log('PASS responsive HUD',width,height);
  }
  await page.setViewportSize({width:1440,height:900});
  await page.locator('#storyBack').click();await page.locator('#storyPreview').click();
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.story.mode==='preview');
  assert.notEqual(await page.locator('#toolbar').evaluate(e=>getComputedStyle(e).display),'none');
  const identity=await page.evaluate(()=>window.__QINHUAI_IMPORT__.scene.uuid);assert.equal(identity,styles.scene,'same authored scene in preview');
  console.log('PASS preview keeps original scene/editor; no scene duplication');
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.setTimeOfDay('sunset')),true);
  assert.equal(await page.evaluate(()=>window.__QINHUAI_IMPORT__.timeOfDay),'sunset','preview time remains adjustable');
  await page.locator('#storyBack').click();
  await page.locator('#storyContinue').click();
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.story.mode==='play',null,{timeout:180000});
  const resumed=await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;return {time:a.timeOfDay,stage:a.story.snapshot.stage,scene:a.scene.uuid};});
  assert.equal(resumed.time,'night','continue re-applies 20:00 after preview time changes');
  assert.equal(resumed.stage,'observe','continue preserves story progress');
  assert.equal(resumed.scene,styles.scene,'continue preserves authored scene');
  console.log('PASS preview time adjustable; continue returns to 20:00 and keeps progress/scene');
  assert.deepEqual(errors,[]);console.log('PASS no uncaught browser errors. Screenshots:',out);
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
