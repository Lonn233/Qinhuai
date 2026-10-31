const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createServer} = require('../game/serve.cjs');
const {chromium} = require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const layout = require('../assets/qinhuai-modern-import/festival/layout.json');

(async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qinhuai-water-'));
  const server = createServer({dataDir});
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const out = path.resolve(__dirname, '../work/water-proximity');
  await fs.mkdir(out, {recursive: true});
  let browser;
  const report = {states: {}, pixels: {}, errors: [], failed: []};
  try {
    browser = await chromium.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
    });
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    page.setDefaultTimeout(90000);
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => {if (message.type() === 'error') report.errors.push(message.text());});
    page.on('requestfailed', request => report.failed.push({url: request.url(), error: request.failure()}));
    await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html?time=night&view=gate`, {waitUntil: 'domcontentloaded'});
    await page.locator('#menuShell [data-action="preview"]').click();
    await page.waitForFunction(() => window.__QINHUAI_STARTUP__?.phase === '\u51c6\u5907\u5b8c\u6210' && window.__QINHUAI_IMPORT__?.playerStats.ready, null, {timeout: 240000});
    console.log('Scene ready');
    await page.waitForFunction(() => window.__QINHUAI_IMPORT__.loadedTileIds.some(id => Number(id) === 6), null, {timeout: 120000});
    const {MAP_SCALE} = await import('../import-performance-profiles.mjs');
    const edge = layout.water.triangles.flat().reduce((a, b) => b[1] < a[1] ? b : a);
    async function move(meters, loaded) {
      await page.evaluate(({edge, scale, meters, height}) => {
        const app = window.__QINHUAI_IMPORT__;
        app.setControlMode('orbit'); app.orbit.enableDamping = false; app.orbit.update();
        app.camera.position.set(edge[0], height + 2, edge[1] - meters * scale);
        app.orbit.target.set(edge[0] + 3, height, edge[1] + 4); app.orbit.update();
      }, {edge, scale: MAP_SCALE, meters, height: layout.water.height});
      await page.waitForFunction(({loaded, distance}) => {
        const stats = window.__QINHUAI_IMPORT__.riverStats;
        return stats.loaded === loaded && Math.abs(stats.distance - distance) < .1;
      }, {loaded, distance: meters * MAP_SCALE});
      return page.evaluate(() => {
        const app = window.__QINHUAI_IMPORT__;
        return {...app.riverStats, originalVisible: app.river.sources.every(source => source.visible)};
      });
    }
    async function capture(name) {
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const png = await page.screenshot({path: path.join(out, name + '.png'), timeout: 90000});
      const pixels = await page.evaluate(async base64 => {
        const image = new Image(); image.src = 'data:image/png;base64,' + base64; await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
        const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
        const data = ctx.getImageData(canvas.width * .2, canvas.height * .25, canvas.width * .6, canvas.height * .5).data;
        let lit = 0; const colors = new Set();
        for (let i = 0; i < data.length; i += 16) {
          if (Math.max(data[i], data[i + 1], data[i + 2]) > 30) lit++;
          colors.add((data[i] >> 4) * 256 + (data[i + 1] >> 4) * 16 + (data[i + 2] >> 4));
        }
        return {lit, samples: Math.ceil(data.length / 16), colors: colors.size};
      }, png.toString('base64'));
      report.pixels[name] = pixels;
      assert.ok(pixels.lit / pixels.samples > .01, name + ': nonblank scene');
      assert.ok(pixels.colors > 40, name + ': varied rendered geometry');
    }
    report.states.far = await move(40, false);
    assert.equal(report.states.far.originalVisible, false, 'far gameplay hides the source water mesh');
    report.states.near = await move(7, true);
    assert.equal(report.states.near.active, true);
    assert.equal(report.states.near.originalVisible, false);
    await page.waitForFunction(() => window.__QINHUAI_IMPORT__.riverStats.captures > 0);
    report.states.bandLoaded = await move(10, true);
    assert.equal(report.states.bandLoaded.active, true, 'hysteresis keeps the flow surface loaded inside the 12x radius');
    report.states.unloaded = await move(13, false);
    assert.equal(report.states.unloaded.originalVisible, false, 'leaving the shoreline unloads water without showing the source mesh');
    report.states.bandUnloaded = await move(10, false);
    assert.equal(report.states.bandUnloaded.loaded, false, 'unloaded water stays unloaded inside the hysteresis band');
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setWaterQuality('low'));
    for (let i = 0; i < 3; i++) {await move(7, true); await move(40, false);}
    report.states.reentry = await move(7, true);
    assert.equal(report.states.reentry.quality, 'low');
    assert.equal(report.states.reentry.failed, false);
    await capture('desktop-near');
    report.states.original = await page.evaluate(() => {
      const app = window.__QINHUAI_IMPORT__; app.setWaterMode('original');
      return {...app.riverStats, originalVisible: app.river.sources.every(source => source.visible)};
    });
    assert.equal(report.states.original.loaded, false);
    assert.equal(report.states.original.originalVisible, true);
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setWaterMode('flow'));
    await page.waitForFunction(() => window.__QINHUAI_IMPORT__.riverStats.active);
    await page.setViewportSize({width: 390, height: 844});
    await capture('mobile-near');
    report.mobile = await page.evaluate(() => ({width: innerWidth, scrollWidth: document.documentElement.scrollWidth, river: window.__QINHUAI_IMPORT__.riverStats}));
    assert.ok(report.mobile.scrollWidth <= report.mobile.width);
    assert.equal(report.mobile.river.active, true);
    assert.deepEqual(report.errors, []); assert.deepEqual(report.failed, []);
    console.log('PASS: browser shoreline loading, hysteresis, release/reentry, fallback and desktop/mobile rendering');
  } finally {
    await fs.writeFile(path.join(out, 'browser.json'), JSON.stringify(report, null, 2));
    await browser?.close();
    await new Promise(resolve => {server.close(resolve); server.closeAllConnections();});
    await fs.rm(dataDir, {recursive: true, force: true});
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
