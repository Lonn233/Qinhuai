const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createServer} = require('../game/serve.cjs');
const {chromium} = require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const mobileOnly = process.argv.includes('--mobile-only');
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qinhuai-environment-'));
  const server = createServer({dataDir});
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const out = path.resolve(__dirname, '../work/environment-20261021');
  await fs.mkdir(out, {recursive: true});
  let browser;
  const report = {presets: {}, pixels: {}, errors: [], failed: [], warnings: []};
  try {
    browser = await chromium.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
    });
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    page.setDefaultTimeout(90000);
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') report.errors.push(message.text());
      if (message.type() === 'warning') report.warnings.push(message.text());
    });
    page.on('requestfailed', request => report.failed.push({url: request.url(), error: request.failure()}));
    await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold`, {waitUntil: 'domcontentloaded'});
    await page.waitForFunction(() => window.__QINHUAI_STARTUP__?.phase === '\u573a\u666f\u5df2\u52a0\u8f7d' && window.__QINHUAI_IMPORT__?.playerStats.ready, null, {timeout: 240000});
    await page.waitForFunction(() => [9, 10, 5, 6].every(id => window.__QINHUAI_IMPORT__.loadedTileIds.some(value => Number(value) === id)), null, {timeout: 120000});
    console.log('Scene ready; testing sky presets and real water');
    await page.locator('#toolbarToggle').click();
    await page.evaluate(() => { window.__QINHUAI_IMPORT__.setWaterMode('flow'); window.__QINHUAI_IMPORT__.focusNightView('festivalWater'); });
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
    if (!mobileOnly) {
    for (const time of ['night', 'day', 'sunset', 'blueHour']) {
      await page.evaluate(time => window.__QINHUAI_IMPORT__.setTimeOfDay(time), time);
      await capture(time);
      const stats = await page.evaluate(() => ({environment: window.__QINHUAI_IMPORT__.environmentStats, river: window.__QINHUAI_IMPORT__.riverStats}));
      report.presets[time] = stats;
      assert.equal(stats.environment.time, time);
      assert.equal(stats.environment.sky, ['day', 'sunset'].includes(time) ? 'atmosphere' : 'moon-stars');
      assert.equal(stats.river.active, true);
      assert.equal(stats.river.failed, false);
      assert.ok(stats.river.captures > 0);
      console.log('PASS preset', time, JSON.stringify(stats));
    }
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setTimeOfDay('night'));
    report.cache = await page.evaluate(() => window.__QINHUAI_IMPORT__.environmentStats);
    assert.equal(report.cache.environmentMaps, report.presets.blueHour.environment.environmentMaps, 'cached environment reused');
    const flow = await page.evaluate(() => window.__QINHUAI_IMPORT__.riverStats.flow);
    await page.waitForFunction(previous => window.__QINHUAI_IMPORT__.riverStats.flow !== previous, flow, {timeout: 90000});
    report.flow = {before: flow, after: await page.evaluate(() => window.__QINHUAI_IMPORT__.riverStats.flow)};
    assert.notEqual(report.flow.after, flow, 'flow animates');
    await page.evaluate(() => window.__QINHUAI_IMPORT__.focusNightView('gateDetail'));
    for (const time of ['day', 'sunset', 'night']) {
      await page.evaluate(time => window.__QINHUAI_IMPORT__.setTimeOfDay(time), time);
      await capture('sky-' + time);
    }
    }
    await page.evaluate(() => window.__QINHUAI_IMPORT__.focusNightView('festivalWater'));
    report.modes = await page.evaluate(() => {
      const app = window.__QINHUAI_IMPORT__, river = app.river;
      app.setWaterMode('original'); const original = {stats: app.riverStats, sourceVisible: river.sources.every(source => source.visible)};
      app.setWaterMode('flow'); app.setWaterVisible(false); const hidden = {stats: app.riverStats, meshVisible: river.mesh.visible, sourceVisible: river.sources.some(source => source.visible)};
      app.setWaterVisible(true); app.setWireframe(true); const wireframe = app.riverStats;
      app.setWireframe(false); app.setWaterQuality('low'); const low = app.riverStats;
      return {original, hidden, wireframe, low};
    });
    assert.equal(report.modes.original.stats.active, false); assert.equal(report.modes.original.sourceVisible, true);
    assert.equal(report.modes.hidden.meshVisible, false); assert.equal(report.modes.hidden.sourceVisible, false);
    assert.equal(report.modes.wireframe.active, false);
    assert.equal(report.modes.low.active, true); assert.equal(report.modes.low.resolution, 256);
    if (!mobileOnly) await capture('night-low');
    await page.setViewportSize({width: 390, height: 844});
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setWaterQuality('auto'));
    await capture('mobile-night');
    report.mobile = await page.evaluate(() => ({width: innerWidth, scrollWidth: document.documentElement.scrollWidth, river: window.__QINHUAI_IMPORT__.riverStats}));
    assert.ok(report.mobile.scrollWidth <= report.mobile.width); assert.equal(report.mobile.river.level, 'low');
    assert.deepEqual(report.errors, []); assert.deepEqual(report.failed, []);
    console.log(mobileOnly ? 'PASS: mobile rendering, original fallback, visibility, wireframe and adaptive quality' : 'PASS: sky presets, cached PMREM, flowing water, reflection captures, original fallback, visibility, wireframe and mobile');
  } finally {
    await fs.writeFile(path.join(out, mobileOnly ? 'environment-mobile.json' : 'environment-browser.json'), JSON.stringify(report, null, 2));
    await browser?.close();
    await new Promise(resolve => {server.close(resolve); server.closeAllConnections();});
    await fs.rm(dataDir, {recursive: true, force: true});
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
