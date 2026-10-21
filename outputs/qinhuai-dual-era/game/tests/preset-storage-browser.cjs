const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const {createServer} = require('../serve.cjs');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qinhuai-browser-storage-'));
  let server = createServer({dataDir}), browser;
  const checks = [], errors = [], failures = [];
  const check = message => { checks.push(message); console.log('PASS:', message); };
  const listen = port => new Promise((resolve, reject) => server.once('error', reject).listen(port, '127.0.0.1', resolve));
  const close = () => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
  const track = page => {
    page.on('pageerror', error => errors.push(String(error)));
    page.on('requestfailed', request => { if(request.url().includes('/api/')) failures.push({url:request.url(),error:request.failure()}); });
    return page;
  };
  const ready = async page => {
    try {
      await page.waitForFunction(() => window.__LION_STUDY__?.ready && document.querySelector('#storage-status')?.dataset.state === 'online', null, {timeout:60000});
    } catch(error) {
      console.error('READINESS', await page.evaluate(() => ({ready:window.__LION_STUDY__?.ready,error:window.__LION_STUDY__?.error,state:document.querySelector('#storage-status')?.dataset.state,message:document.querySelector('#tuning-message')?.textContent})), failures, errors);
      throw error;
    }
  };
  const openLibrary = async page => page.locator('.saved-library').evaluate(node => { node.open = true; });
  try {
    await listen(0);
    const port = server.address().port;
    const origin = 'http://127.0.0.1:' + port;
    const url = origin + '/lion-light-study.html?scene=festival&lantern=mountain&effect=6';
    browser = await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
    const original = await browser.newContext({viewport:{width:1440,height:945}});
    let page = track(await original.newPage());
    const legacy = {id:'legacy-browser-test',lanternId:'mountain',base:'柔彩透亮',name:'旧配色迁移测试',power:1.04,color:'#ffe6bb'};
    // Seed once rather than an init script that would undo the cache-clearing test on reload.
    await page.goto(origin + '/api/lantern-presets');
    await page.evaluate(p => localStorage.setItem('qinhuai.lantern-light-studies.v1', JSON.stringify({version:1,items:[p]})), legacy);
    await page.goto(url); await ready(page);
    let disk = JSON.parse(await fs.readFile(path.join(dataDir,'lantern-presets.json'),'utf8'));
    assert.equal(disk.items.length,1); assert.equal(disk.items[0].id,legacy.id);
    assert.notEqual(await page.evaluate(() => localStorage.getItem('qinhuai.lantern-light-studies.v1')), null);
    check('Legacy localStorage migrated to file without deleting browser original');
    await openLibrary(page); await page.locator('.apply-saved').click();
    assert.equal(await page.locator('#brightness').inputValue(),'104');
    assert.equal(await page.locator('#light-color').inputValue(),'#ffe6bb');
    await page.locator('#brightness').fill('117'); await page.locator('#brightness').dispatchEvent('input');
    await page.locator('#color-hex').fill('#f5d9a7'); await page.locator('#tuning-name').fill('文件持久化测试');
    await page.locator('.save-button').click();
    await page.waitForFunction(() => document.querySelector('#tuning-message').textContent.includes('已写入项目文件'));
    disk = JSON.parse(await fs.readFile(path.join(dataDir,'lantern-presets.json'),'utf8'));
    assert.equal(disk.items.length,2); assert.equal(disk.items[1].color,'#f5d9a7'); assert.equal(disk.items[1].power,1.17);
    check('Save acknowledgement follows actual disk write');
    await page.evaluate(() => localStorage.clear()); await page.reload(); await ready(page);
    assert.equal(await page.locator('.apply-saved').count(),2);
    assert.equal(await page.evaluate(() => localStorage.getItem('qinhuai.lantern-light-studies.v1')),null);
    check('Clearing localStorage does not remove file-backed presets');
    await close(); server = createServer({dataDir}); await listen(port);
    await page.reload(); await ready(page); assert.equal(await page.locator('.apply-saved').count(),2);
    check('Server restart preserves saved presets');
    // Release the large software-rendered model before starting another independent browser context.
    await page.close();
    const fresh = await browser.newContext({viewport:{width:1440,height:945}});
    const other = track(await fresh.newPage()); await other.goto(url); await ready(other);
    assert.equal(await other.locator('.apply-saved').count(),2);
    assert.equal(await other.evaluate(() => localStorage.getItem('qinhuai.lantern-light-studies.v1')),null);
    check('Fresh browser context sees shared file presets');
    await openLibrary(other);
    await other.locator('.saved-effect').filter({hasText:'文件持久化测试'}).locator('.apply-saved').click();
    assert.equal(await other.locator('#brightness').inputValue(),'117');
    await other.locator('.saved-effect').filter({hasText:'旧配色迁移测试'}).locator('.delete-saved').click();
    await other.waitForFunction(() => document.querySelector('#saved-count').textContent === '1');
    await fresh.close();
    page = track(await original.newPage());
    await page.goto(origin + '/api/lantern-presets');
    await page.evaluate(p => localStorage.setItem('qinhuai.lantern-light-studies.v1',JSON.stringify({version:1,items:[p]})),legacy);
    await page.goto(url); await ready(page); assert.equal(await page.locator('.apply-saved').count(),1);
    check('Stale browser migration cannot resurrect a deleted preset');
    await page.route('**/api/lantern-presets**',route => route.abort()); await page.locator('#retry-storage').click();
    await page.waitForFunction(() => document.querySelector('#storage-status').dataset.state === 'offline');
    assert.equal(await page.locator('.save-button').isDisabled(),true);
    await page.locator('#brightness').fill('99'); await page.locator('#brightness').dispatchEvent('input');
    assert.equal(await page.evaluate(() => window.__LION_STUDY__.materials.uClothPower.value),.99);
    check('Offline state disables save without blocking live tuning');
    await page.unroute('**/api/lantern-presets**'); await page.locator('#retry-storage').click(); await ready(page);
    assert.equal(await page.locator('.save-button').isEnabled(),true);
    assert.match(await page.locator('#tuning-message').textContent(),/文件存储已连接/);
    check('Retry reconnects to persistent data');
    await openLibrary(page);
    await page.screenshot({path:path.resolve(__dirname,'../lion-study/persistence-desktop.png')});
    await page.setViewportSize({width:390,height:844}); await page.reload(); await ready(page);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
    check('Mobile sidebar remains usable without horizontal overflow');
    assert.equal(errors.length,0);
    await fs.writeFile(path.resolve(__dirname,'../lion-study/persistence-verification.json'),JSON.stringify({checks,errors},null,2));
    console.log(JSON.stringify({checks,errors},null,2));
  } finally {
    if(browser) await browser.close();
    if(server.listening) await close();
    const resolved = path.resolve(dataDir);
    if(path.dirname(resolved) !== path.resolve(os.tmpdir()) || !path.basename(resolved).startsWith('qinhuai-browser-storage-')) throw Error('Unexpected test cleanup path');
    await fs.rm(resolved,{recursive:true,force:true});
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
