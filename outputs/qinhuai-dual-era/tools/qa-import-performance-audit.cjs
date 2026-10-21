const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createServer } = require('../game/serve.cjs');
const { chromium } = require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

// Lifecycle regression for the opt-in import-viewer sampler. This never writes
// the app's persistent data directory and does not measure performance itself.
(async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qinhuai-perf-audit-'));
  const server = createServer({ dataDir });
  let browser;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const out = 'work/performance-20261020';
  await fs.mkdir(out, { recursive: true });
  try {
    browser = await chromium.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
    });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const url = `http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold&perf=1`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__QINHUAI_STARTUP__?.phase === '场景已加载'
      && window.__QINHUAI_IMPORT__?.performanceAudit, null, { timeout: 240000 });

    const invalidated = await page.evaluate(async () => {
      const audit = window.__QINHUAI_IMPORT__.performanceAudit;
      const promise = audit.run({ seconds: 1, warmupSeconds: 0, repeats: 1, label: 'lifecycle-input' });
      setTimeout(() => document.dispatchEvent(new Event('keydown', { bubbles: true })), 150);
      const result = await promise;
      return { valid: result.valid, invalidReason: result.invalidReason, frames: result.samples[0]?.rawFrames?.length ?? 0 };
    });
    assert.equal(invalidated.valid, false);
    assert.match(invalidated.invalidReason, /input/i);

    const disposed = await page.evaluate(() => {
      const audit = window.__QINHUAI_IMPORT__.performanceAudit;
      audit.dispose();
      return { panel: !!document.querySelector('#import-performance-audit') };
    });
    assert.equal(disposed.panel, false);
    const rejected = await page.evaluate(async () => {
      try {
        await window.__QINHUAI_IMPORT__.performanceAudit.run({ seconds: 1, warmupSeconds: 0, repeats: 1 });
        return false;
      } catch (error) {
        return /unavailable|disposed/i.test(error.message);
      }
    });
    assert.equal(rejected, true);
    assert.deepEqual(errors, []);
    const report = { schema: 'qinhuai-import-performance-lifecycle-v1', invalidated, disposed, rejected, errors };
    await fs.writeFile(path.join(out, 'audit-lifecycle.json'), JSON.stringify(report, null, 2));
    console.log('PASS', JSON.stringify(report));
  } finally {
    await browser?.close();
    await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
    await fs.rm(dataDir, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
