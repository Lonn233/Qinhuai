const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {ensureHandwork,screenDrag,screenDriver,completePaperGesture}=require('./gesture-driver.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const snap=page=>page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());
(async()=>{
 const wf=await import(pathToFileURL(path.join(__dirname,'../workflow.mjs')).href);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const errors=[],dir=path.join(__dirname,'paper-results');fs.mkdirSync(dir,{recursive:true});
 const mobile=process.argv.includes('--mobile');
 async function open(id){const w=new wf.Workflow();while(wf.currentStage(w.state).id!==id)assert.ok(w.skipStage(Date.now()).ok);const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile});page.on('pageerror',e=>(errors.push(e.message),console.error('PAGE ERROR',e.stack)));await page.goto('http://127.0.0.1:4180/lotus-workshop.html',{waitUntil:'networkidle'});await page.evaluate(s=>localStorage.setItem('qinhuai-lotus-workshop-v2',JSON.stringify(s)),w.state);await page.reload({waitUntil:'networkidle'});await page.click('#resume');await page.waitForTimeout(800);await ensureHandwork(page,mobile);return page;}
 async function shot(page,name){await page.screenshot({path:path.join(dir,(mobile?'mobile-':'desktop-')+name+'.png')});}
 async function trace(page){const s=await snap(page),d=await screenDriver(page,mobile);try{await d.down(s.outline[s.next]);for(const p of s.outline.slice(s.next+1))await d.move(p,2);await d.up();}finally{await d.dispose();}assert.ok((await snap(page)).ready,JSON.stringify(await snap(page)));}
 try{
 const dye=await open('paper_dye'),d=await screenDriver(dye,mobile);await shot(dye,'dye-idle');
 const action=async()=>{if(mobile)await dye.tap('#handwork-confirm');else await dye.keyboard.press('e');};
 // Take a real tabletop sheet, then release/regrab with an off-center grip.
 let s=await snap(dye);await d.down(s.stockTarget);await d.up();assert.equal((await snap(dye)).phase,'held');
 s=await snap(dye);const grip={x:s.paper.x+9,y:s.paper.y+7};await d.down(grip);assert.deepEqual((await snap(dye)).paperPosition,s.paperPosition);
 await d.move({x:grip.x+28,y:grip.y+12},10);await dye.waitForTimeout(80);const beforeUp=(await snap(dye)).paperPosition;await d.up();await dye.waitForTimeout(200);assert.deepEqual((await snap(dye)).paperPosition,beforeUp,'release must not move sheet');assert.equal((await snap(dye)).seconds,0);
 s=await snap(dye);await screenDrag(dye,s.paper,s.bath,mobile);s=await snap(dye);assert.equal(s.context,'bath');assert.equal(s.phase,'held');assert.equal(s.seconds,0,'nearby paper must not dye automatically');await action();await dye.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().seconds>.5);
 // Read the current chapter mid-dip: timer pauses, pages/TOC work, Escape keeps workbench open.
 await dye.click('#craft-book-open');assert.equal(await dye.locator('#craft-book').evaluate(e=>e.open),true);assert.match(await dye.locator('#book-chapter-title').innerText(),/浸染/);const paused=(await snap(dye)).seconds;await dye.waitForTimeout(500);assert.equal((await snap(dye)).seconds,paused);
 await shot(dye,'craft-book');await dye.click('#book-next');assert.match(await dye.locator('#book-chapter-title').innerText(),/绿色/);await dye.click('#book-prev');
 if(mobile)await dye.click('#book-toc-toggle');await dye.click('[data-chapter="0"]');assert.match(await dye.locator('#book-steps').innerText(),/右键/);
 if(mobile)await dye.click('#book-toc-toggle');await dye.click('#book-current');assert.match(await dye.locator('#book-chapter-title').innerText(),/浸染/);
 await dye.keyboard.press('Escape');assert.equal(await dye.locator('#craft-book').evaluate(e=>e.open),false);assert.ok((await snap(dye)).active);
 await dye.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().simulatedSeconds>=75);await shot(dye,'dye-immersed');const immersedY=(await snap(dye)).paperPosition[1];await action();await dye.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().phase==='review');assert.ok((await snap(dye)).ready);assert.ok((await snap(dye)).paperPosition[1]>immersedY+.2);assert.equal(await dye.locator('#handwork-retry').isVisible(),false);await shot(dye,'dye-lifted');
 s=await snap(dye);const actions=await dye.evaluate(()=>__LOTUS_WORKSHOP__.state.actions);await dye.keyboard.press('e');await dye.waitForTimeout(100);assert.equal(await dye.evaluate(()=>__LOTUS_WORKSHOP__.state.actions),actions,'E away from rack must not commit');
 // E above basin may resume; lift if so, then deliberately discard near the bin.
 if((await snap(dye)).phase==='dipping'){await action();await dye.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().phase==='review');}
 s=await snap(dye);await screenDrag(dye,s.paper,s.bin,mobile);assert.equal((await snap(dye)).waste,0,'dropping near bin must not discard');await action();assert.equal((await snap(dye)).waste,1);assert.ok((await snap(dye)).stock);
 await dye.click('#paper-stock');s=await snap(dye);await screenDrag(dye,s.paper,s.bath,mobile);await action();await dye.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().simulatedSeconds>=80);await action();await dye.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().ready);
 const dyeColors=await dye.evaluate(()=>Array.from(__LOTUS_WORKSHOP__.scene.getObjectByName('active-paper').geometry.attributes.color.array));s=await snap(dye);await screenDrag(dye,s.paper,s.rack,mobile);assert.equal((await snap(dye)).context,'rack');assert.equal(await dye.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.paper_dye),0);await shot(dye,'dye-near-rack');await action();await dye.waitForFunction(()=>__LOTUS_WORKSHOP__.state.counts.paper_dye===1);await shot(dye,'dye-hung');assert.deepEqual(await dye.evaluate(()=>Array.from(__LOTUS_WORKSHOP__.scene.getObjectByName('rack-petal-0').geometry.attributes.color.array)),dyeColors);await d.dispose();await dye.close();
 const press=await open('petal_pressing');await shot(press,'press-idle');await press.click('#handwork-confirm');await press.waitForTimeout(1400);assert.equal((await snap(press)).phase,'running');assert.equal(await press.locator('#handwork-confirm').isVisible(),false);await shot(press,'press-running');await press.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().phase==='done',null,{timeout:12000});await shot(press,'press-done');s=await snap(press);assert.equal(s.shape,'square');await press.waitForTimeout(200);assert.equal((await snap(press)).rotation,s.rotation);await press.click('#handwork-confirm');await press.waitForFunction(()=>__LOTUS_WORKSHOP__.state.counts.petal_pressing===1);await press.close();
 for(const id of ['paper_cutting','petal_cutting','leaf_cutting']){
 const p=await open(id);await shot(p,id+'-idle');s=await snap(p);const input=await screenDriver(p,mobile);await input.down(s.outline[0]);await input.move(s.paper,5);await input.up();await input.dispose();assert.equal((await snap(p)).failed,false);assert.equal(await p.locator('#handwork-confirm').isEnabled(),false);await trace(p);await shot(p,id+'-cut');await p.click('#handwork-confirm');await p.waitForFunction(id=>__LOTUS_WORKSHOP__.state.counts[id]===1,id);await p.close();}

 const green=await open('leaf_dye');await completePaperGesture(green,{touch:mobile,screenshot:path.join(dir,(mobile?'mobile':'desktop')+'-green-dye.png')});assert.equal(await green.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.leaf_dye),1);await green.close();
 const cancel=await open('petal_pressing');await cancel.click('#handwork-confirm');await cancel.waitForTimeout(300);await cancel.click('#handwork-skip-stage');await cancel.waitForTimeout(6000);assert.equal(await cancel.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.leaf_pressing),0,'cancelled animation must not commit into next stage');assert.equal(await cancel.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.petal_pressing),6);await cancel.click('#handwork-close');await cancel.click('#undo');assert.equal(await cancel.evaluate(()=>__LOTUS_WORKSHOP__.state.counts.petal_pressing),0);await cancel.close();
 assert.deepEqual(errors,[]);console.log('PASS paper interaction checks',mobile?'mobile':'desktop');
 }catch(e){console.error(e);for(const p of browser.contexts().flatMap(c=>c.pages())){console.log('FAILED SNAPSHOT',JSON.stringify(await snap(p).catch(()=>null)));await shot(p,'failure');}process.exitCode=1;}finally{await browser.close();}
})();

