const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createServer} = require('../game/serve.cjs');
const {chromium} = require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qinhuai-walking-'));
  const server = createServer({dataDir});
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const out = path.resolve(__dirname, '../work/walking-20261020');
  await fs.mkdir(out, {recursive: true});
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
    });
    const page = await browser.newPage({viewport: {width: 1440, height: 900}});
    const errors = [], failed = [], report = {};
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => failed.push({url: request.url(), error: request.failure()}));
    await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold`, {waitUntil: 'domcontentloaded'});
    await page.waitForFunction(() => window.__QINHUAI_STARTUP__?.phase === '\u573a\u666f\u5df2\u52a0\u8f7d' && window.__QINHUAI_IMPORT__?.playerStats.ready, null, {timeout: 240000});
    await page.waitForFunction(() => [9, 10, 5, 6].every(id => window.__QINHUAI_IMPORT__.loadedTileIds.some(value => Number(value) === id)), null, {timeout: 120000});
    console.log('Full-map scene and four walking tiles ready');
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setControlMode('firstPerson'));
    report.routes = await page.evaluate(() => {
      const app = window.__QINHUAI_IMPORT__, player = app.player;
      function walk(name, points, ground) {
        player.spawn({x: points[0][0], z: points[0][1], ground});
        player.stop();
        let steps = 0;
        const keys = new Set(['KeyW', 'ShiftLeft']);
        for (const [x, z] of points.slice(1)) {
          player.stop();
          const distance = Math.hypot(x - player.position.x, z - player.position.z);
          const limit = Math.ceil(distance / 1.34 * 60) + 180;
          let reached = false;
          for (let step = 0; step < limit; step++) {
            const dx = x - player.position.x, dz = z - player.position.z;
            if (Math.hypot(dx, dz) < .035) { reached = true; break; }
            app.camera.rotation.set(0, Math.atan2(-dx, -dz), 0, 'YXZ');
            app.camera.updateMatrixWorld();
            player.update(1 / 60, keys);
            steps++;
          }
          if (!reached) throw new Error(`${name}: blocked before ${x},${z} at ${player.position.toArray()}`);
        }
        player.stop();
        return {name, steps, end: player.position.toArray()};
      }
      const bridge = [[-21, -12], [-20.5, -6], [-21.6, 2.5], [-21.6, 5.5], [-21.6, 8]];
      const stairs = [[-18, -10.3], [-14, -10.3]];
      const path = [[-16, -10.3], [1.28, -10.3]];
      return [
        walk('bridge-out', bridge, 11.8641),
        walk('bridge-back', [...bridge].reverse(), 11.8641),
        walk('stair-down', stairs, 11.8641),
        walk('stair-up', [...stairs].reverse(), 11.3234),
        walk('lower-path-out', path, 11.3234),
        walk('lower-path-back', [...path].reverse(), 11.3234),
      ];
    });
    console.log('Actual first-person movement passed all six routes');
    for (const route of report.routes) {
      const expected = route.name.startsWith('lower-path') || route.name === 'stair-down' ? 11.3234 : 11.8641;
      assert.ok(Math.abs(route.end[1] - expected) < .02, `${route.name}: correct ground height`);
    }
    await page.locator('#toolbarToggle').click();
    async function capture(name, x, z, ground, yaw) {
      await page.evaluate(({x, z, ground, yaw}) => {
        const app = window.__QINHUAI_IMPORT__;
        app.player.spawn({x, z, ground});
        app.player.stop();
        app.camera.rotation.set(-.12, yaw, 0, 'YXZ');
        app.player.updateCamera(0, true);
      }, {x, z, ground, yaw});
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const png = await page.screenshot({path: path.join(out, name + '.png'), timeout: 90000});
      return page.evaluate(async base64 => {
        const image = new Image();
        image.src = 'data:image/png;base64,' + base64;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width; canvas.height = image.height;
        const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
        const pixels = context.getImageData(canvas.width * .2, canvas.height * .25, canvas.width * .6, canvas.height * .5).data;
        let lit = 0;
        const colors = new Set();
        for (let i = 0; i < pixels.length; i += 16) {
          if (Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) > 30) lit++;
          colors.add((pixels[i] >> 4) * 256 + (pixels[i + 1] >> 4) * 16 + (pixels[i + 2] >> 4));
        }
        return {lit, colors: colors.size};
      }, png.toString('base64'));
    }
    report.pixels = {
      bridge: await capture('bridge-first-person', -20.8, -4, 11.8641, -Math.PI),
      lower: await capture('lower-path-first-person', -10, -10.3, 11.3234, -Math.PI / 2),
    };
    await page.setViewportSize({width: 390, height: 844});
    report.pixels.mobile = await capture('lower-path-mobile', -10, -10.3, 11.3234, -Math.PI / 2);
    report.mobile = await page.evaluate(() => ({width: innerWidth, scrollWidth: document.documentElement.scrollWidth}));
    assert.ok(report.mobile.scrollWidth <= report.mobile.width);
    for (const pixels of Object.values(report.pixels)) {
      assert.ok(pixels.lit > 1000, 'scene is not blank');
      assert.ok(pixels.colors > 40, 'scene contains varied rendered geometry');
    }
    report.tiles = await page.evaluate(() => window.__QINHUAI_IMPORT__.loadedTileIds);
    report.errors = errors; report.failed = failed;
    assert.deepEqual(errors, []); assert.deepEqual(failed, []);
    await fs.writeFile(path.join(out, 'walking-browser.json'), JSON.stringify(report, null, 2));
    console.log('PASS', JSON.stringify(report));
  } finally {
    await browser?.close();
    await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
    await fs.rm(dataDir, {recursive: true, force: true});
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
