const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox']
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      const probe = window.audioProbe = { decoded: [], played: [] };
      const labels = new WeakMap();
      const connections = new WeakMap();
      const connectNode = AudioNode.prototype.connect;
      AudioNode.prototype.connect = function (node, ...args) {
        connections.set(this, node);
        return connectNode.call(this, node, ...args);
      };
      const decode = AudioContext.prototype.decodeAudioData;
      AudioContext.prototype.decodeAudioData = async function (bytes) {
        const name = { 4179: 'change', 86746: 'chime', 31642: 'flip' }[bytes.byteLength] || 'other';
        const buffer = await decode.call(this, bytes);
        labels.set(buffer, name);
        probe.decoded.push({ name, duration: buffer.duration });
        return buffer;
      };
      const create = AudioContext.prototype.createBufferSource;
      AudioContext.prototype.createBufferSource = function () {
        const source = create.call(this), start = source.start, connect = source.connect;
        let target;
        source.connect = function (node) { target = node; return connect.call(this, node); };
        source.start = function (...args) {
          const name = labels.get(this.buffer);
          if (name) {
            let gain = 1;
            for (let node = target; node; node = connections.get(node)) {
              if (node.gain) gain *= node.gain.value;
            }
            probe.played.push({ name, gain });
          }
          return start.apply(this, args);
        };
        return source;
      };
    });
    await page.goto(process.env.WORKSHOP_URL || 'http://127.0.0.1:4173/', { waitUntil: 'commit', timeout: 180000 });
    await page.waitForFunction(() => window.__HEHUA_READY__, {}, { timeout: 180000 });
    await page.evaluate(() => { __HEHUA__.start(); __HEHUA__.openBamboo(true); __HEHUA__.renderer.setPixelRatio(.5); });
    await page.waitForFunction(() => window.audioProbe.decoded.length === 3);
    const decoded = await page.evaluate(() => window.audioProbe.decoded);
    assert.deepEqual(decoded.map(s => s.name).sort(), ['change', 'chime', 'flip']);
    assert(decoded.every(s => s.duration > 0));

    const count = () => page.evaluate(() => window.audioProbe.played.length);
    const slot = page.locator('[data-key="wire"]');
    await slot.click();
    await page.waitForFunction(() => window.audioProbe.played.length === 1);
    await slot.click();
    assert.equal(await count(), 1, 'Reselecting the same item must stay silent');
    await page.locator('#inv-right').click();
    await page.waitForFunction(() => window.audioProbe.played.length === 2);
    await page.locator('#inv-left').click();
    await page.waitForFunction(() => window.audioProbe.played.length === 3);
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 100);
    await page.waitForFunction(() => window.audioProbe.played.length === 4);

    await page.evaluate(() => { __HEHUA__.audio.setSfxVolume(.4); __HEHUA__.audio.chime(); });
    await page.waitForFunction(() => window.audioProbe.played.length === 5);
    const played = await page.evaluate(() => window.audioProbe.played);
    assert.deepEqual(played.map(s => s.name), ['change', 'change', 'change', 'change', 'chime']);
    assert(Math.abs(played[4].gain - .3) < 1e-6, 'Samples must use the SFX volume bus');
    await page.evaluate(() => {
      __HEHUA__.audio.setSfxVolume(0);
      __HEHUA__.audio.change(); __HEHUA__.audio.chime(); __HEHUA__.ui.cycleSelection(1);
    });
    assert.equal(await count(), 5, 'Muted samples must not start');
    await page.evaluate(() => { __HEHUA__.audio.setSfxVolume(.58); __HEHUA__.audio.change(); __HEHUA__.audio.change(); });
    await page.waitForFunction(() => window.audioProbe.played.length === 6);

    await page.evaluate(() => __HEHUA__.audio.setSfxVolume(.4));
    await page.locator('#guide-button').click();
    await page.waitForFunction(() => window.audioProbe.played.length === 7);
    await page.evaluate(() => __HEHUA__.ui.openGuide());
    assert.equal(await count(), 7, 'Opening an already-open guide must stay silent');
    await page.locator('[data-close="guide-dialog"]').click();
    await page.waitForFunction(() => window.audioProbe.played.length === 8);
    await page.keyboard.press('j');
    await page.waitForFunction(() => window.audioProbe.played.length === 9);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => window.audioProbe.played.length === 10);
    await page.locator('#guide-button').click();
    await page.waitForFunction(() => window.audioProbe.played.length === 11);
    await page.locator('#guide-dialog').dispatchEvent('click');
    await page.waitForFunction(() => window.audioProbe.played.length === 12);
    const guideSounds = await page.evaluate(() => window.audioProbe.played.slice(6));
    assert.deepEqual(guideSounds.map(s => s.name), Array(6).fill('flip'));
    assert(guideSounds.every(s => Math.abs(s.gain - .6) < 1e-6), 'Guide audio must be doubled while retaining the SFX volume bus');
    await page.evaluate(() => __HEHUA__.audio.setSfxVolume(0));
    await page.locator('#guide-button').click();
    await page.locator('[data-close="guide-dialog"]').click();
    await page.waitForFunction(() => !document.querySelector('#guide-dialog[open]'));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await count(), 12, 'Muted guide interactions must stay silent');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ result: 'PASS', decoded, itemSwitches: 4, sameItemSilent: true, volumeAndMute: true, staleSwitchDeduplicated: true, guideMouseKeyboardAndBackdrop: true, guideVolumeAndMute: true }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
