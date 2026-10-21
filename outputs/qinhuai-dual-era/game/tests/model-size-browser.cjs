const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {createServer}=require('../serve.cjs');
const {createPresetStore}=require('../preset-store.cjs');
const {SIZE_SPECS}=require('../lion-study/dimensions.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-size-browser-'));
 let browser,server;const errors=[],checks=[],measurements={};
 const log=text=>{checks.push(text);console.log('PASS:',text);};
 const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-5,`${actual} != ${expected}`);
 try{
  const legacy={id:'legacy-color-only',lanternId:'mountain',base:'柔彩透亮',name:'旧配色兼容测试',power:1.04,color:'#ffe6bb'};
  await createPresetStore(dataDir).add(legacy);
  server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const url=`http://127.0.0.1:${server.address().port}/lion-light-study.html?scene=festival&lantern=mountain&effect=6`;
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
  const page=await browser.newPage({viewport:{width:1440,height:945}});page.on('pageerror',e=>errors.push(String(e)));
  const ready=async id=>{try{await page.waitForFunction(id=>window.__LION_STUDY__?.ready&&window.__LION_STUDY__.lanternId===id&&document.querySelector('#storage-status').dataset.state==='online',id,{timeout:90000});}catch(e){console.error(await page.evaluate(()=>({ready:window.__LION_STUDY__?.ready,error:window.__LION_STUDY__?.error,message:document.querySelector('#tuning-message')?.textContent})),errors);throw e;}};
  const measured=()=>page.evaluate(()=>window.__LION_STUDY__.modelDimensions);
  const verify=async(id,value)=>{const d=await measured();near(id==='crane'?d.height:Math.max(d.width,d.depth),value);near(d.sizeMeters,value);near(d.minY,.05);near(d.scale[0],d.scale[1]);near(d.scale[1],d.scale[2]);return d;};
  const openLibrary=()=>page.locator('.saved-library').evaluate(el=>{el.open=true;});
  await page.goto(url);await ready('mountain');
  const sizes={mountain:14.5,lotus:.75,lion:3,crane:.65,fish:1};
  for(const [id,customSize] of Object.entries(sizes)){
   if(id!=='mountain'){await page.locator(`[data-lantern="${id}"]`).click();await ready(id);}
   measurements[id]=await verify(id,SIZE_SPECS[id].initial);
   await page.screenshot({path:path.resolve(__dirname,`../lion-study/size-${id}.png`)});
   if(id==='mountain'){
    await openLibrary();await page.locator('.saved-effect').filter({hasText:'旧配色兼容测试'}).locator('.apply-saved').click();
    near((await measured()).sizeMeters,13);assert.equal(await page.locator('#brightness').inputValue(),'104');
    log('Legacy colour-only presets apply at the new initial dimension');
    await page.locator('#model-size-number').fill('');
    await page.locator('#model-size-number').pressSequentially('14.5');
   }else{await page.locator('#model-size-number').fill(String(customSize));}
   await page.locator('#model-size-number').press('Tab');await verify(id,customSize);
   await page.locator('.preset').nth(4).click();await verify(id,customSize);
   assert.equal(await page.locator('#brightness').inputValue(),'65');
   await page.locator('#reset-tuning').click();await verify(id,customSize);
   await page.locator('#model-size-number').fill(String(SIZE_SPECS[id].max+1));
   assert.equal(await page.locator('#model-size-number').getAttribute('aria-invalid'),'true');await verify(id,customSize);
   await page.locator('#model-size-number').press('Tab');assert.equal(await page.locator('#model-size-number').inputValue(),String(customSize));
   await page.locator('#tuning-name').fill('尺寸测试-'+id);await page.locator('.save-button').click();
   await page.waitForFunction(name=>document.querySelector('#tuning-message').textContent.includes(name)&&document.querySelector('#tuning-message').textContent.includes('已写入项目文件'),'尺寸测试-'+id);
   const stored=JSON.parse(await fs.readFile(path.join(dataDir,'lantern-presets.json'),'utf8')).items.find(p=>p.name==='尺寸测试-'+id);
   assert.equal(stored.sizeMeters,customSize);assert.equal(stored.power,.65);
   await page.locator('#reset-size').click();await verify(id,SIZE_SPECS[id].initial);
   assert.equal(await page.locator('#brightness').inputValue(),'65');
   await openLibrary();await page.locator('.saved-effect').filter({hasText:'尺寸测试-'+id}).locator('.apply-saved').click();await verify(id,customSize);
   log(id+': exact initial dimensions, live resize, independent resets and saved size restore');
  }
  await page.locator('[data-lantern="mountain"]').click();await ready('mountain');await verify('mountain',14.5);
  log('Per-model sizes survive switches and GPU cache eviction');
  await page.evaluate(()=>localStorage.clear());await page.reload();await ready('mountain');await verify('mountain',13);
  await openLibrary();await page.locator('.saved-effect').filter({hasText:'尺寸测试-mountain'}).locator('.apply-saved').click();await verify('mountain',14.5);
  const disk=JSON.parse(await fs.readFile(path.join(dataDir,'lantern-presets.json'),'utf8'));
  assert.deepEqual(disk.items.find(p=>p.id===legacy.id),legacy);assert.equal(disk.items.length,6);
  log('Reload/cache clearing retains saved dimensions without rewriting old colour presets');
  await page.locator('#reset').click();await page.screenshot({path:path.resolve(__dirname,'../lion-study/size-saved-desktop.png')});
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(300);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:path.resolve(__dirname,'../lion-study/size-mobile.png'),fullPage:true});
  log('Mobile size controls fit without horizontal overflow');
  assert.deepEqual(errors,[]);
  await fs.writeFile(path.resolve(__dirname,'../lion-study/size-verification.json'),JSON.stringify({checks,measurements,errors},null,2));
  console.log(JSON.stringify({checks,measurements,errors},null,2));
 }finally{
  if(browser)await browser.close();if(server)await new Promise(r=>{server.close(r);server.closeAllConnections();});
  const resolved=path.resolve(dataDir);if(path.dirname(resolved)!==path.resolve(os.tmpdir())||!path.basename(resolved).startsWith('qinhuai-size-browser-'))throw Error('Unsafe cleanup target');
  await fs.rm(resolved,{recursive:true,force:true});
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
