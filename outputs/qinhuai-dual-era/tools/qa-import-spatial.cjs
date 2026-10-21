const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const out = path.resolve('work/performance-20261021');
  await fs.mkdir(out, { recursive: true });
  const software = process.argv.includes('--software');
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: software ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'] : [],
  });
  const report = {softwareRequested: software, errors: [], warnings: [], profiles: {}, modes: {}};
  try {
    const page = await browser.newPage({viewport: {width: 1920, height: 1080}});
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') report.errors.push(message.text());
      if (message.type() === 'warning') report.warnings.push(message.text());
    });
    await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold&perf=1', {waitUntil: 'domcontentloaded'});
    const progress = setInterval(async () => {
      try { console.log('Loading:', await page.evaluate(() => ({phase:window.__QINHUAI_STARTUP__?.phase, tiles:window.__QINHUAI_IMPORT__?.loadedTileIds}))); } catch {}
    }, 30000);
    try {
      await page.waitForFunction(() => window.__QINHUAI_STARTUP__?.phase === '场景已加载' && window.__QINHUAI_IMPORT__?.playerStats.ready, null, {timeout: 180000});
    } finally { clearInterval(progress); }
    report.gpu = await page.evaluate(() => window.__QINHUAI_IMPORT__.performanceAudit.report().gpuRenderer);
    report.hardware = !/swiftshader|llvmpipe|software|microsoft basic/i.test(report.gpu || '') && !!report.gpu;
    console.log('GPU:', report.gpu);
    const settle = () => page.evaluate(() => new Promise(resolve => {
      let frames = 0; const step = () => ++frames === 12 ? resolve() : requestAnimationFrame(step); requestAnimationFrame(step);
    }));
    const state = () => page.evaluate(() => {
      const a = window.__QINHUAI_IMPORT__;
      const sun = a.scene.children.find(o => o.isDirectionalLight);
      return {mode:a.controlMode, far:a.camera.far, dpr:a.renderer.getPixelRatio(), visibility:a.visibilityStats,
        water:a.riverStats, shadow:{enabled:sun.castShadow, size:sun.shadow.mapSize.x},
        sky:a.environmentStats.sky, geometries:a.renderer.info.memory.geometries, textures:a.renderer.info.memory.textures};
    });
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setControlMode('firstPerson'));
    await settle();
    for (const quality of ['original','smooth','low']) {
      await page.evaluate(quality => window.__QINHUAI_IMPORT__.setPerformanceProfile(quality), quality);
      await settle();
      const snapshot = await state();
      const samples = await page.evaluate(async quality => window.__QINHUAI_IMPORT__.performanceAudit.run({
        seconds: 2, warmupSeconds: 1, repeats: 1, label: 'profile-regression-' + quality,
      }), quality);
      report.profiles[quality] = {snapshot, valid:samples.valid, invalidReason:samples.invalidReason, summary:samples.samples[0]?.summary};
      console.log(quality, JSON.stringify(report.profiles[quality]));
      assert.equal(snapshot.visibility.enabled, quality !== 'original');
      assert.equal(snapshot.dpr, quality === 'low' ? .8 : 1);
      assert.equal(snapshot.water.resolution, quality === 'original' ? snapshot.water.resolution : 256);
      assert.equal(snapshot.water.failed, false);
      if (quality !== 'original') assert.ok(snapshot.visibility.visibleCells < snapshot.visibility.cells, 'remote cells actually hidden');
      assert.equal(samples.valid, true, samples.invalidReason);
    }
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setPerformanceProfile('smooth'));
    for (const mode of ['thirdPerson','orbit','firstPerson']) {
      await page.evaluate(mode => window.__QINHUAI_IMPORT__.setControlMode(mode), mode);
      await settle(); report.modes[mode] = await state();
      assert.equal(report.modes[mode].mode, mode);
      assert.equal(report.modes[mode].visibility.enabled, mode !== 'orbit');
      if (mode === 'orbit') assert.equal(report.modes[mode].visibility.visibleCells, report.modes[mode].visibility.cells);
    }
    await page.screenshot({path:path.join(out,'first-person-spatial.png'), timeout:90000});
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setTimeOfDay('day'));
    await settle(); report.day = await state();
    assert.equal(report.day.shadow.enabled, true); assert.equal(report.day.shadow.size, 1024);
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setPerformanceProfile('low'));
    await settle(); report.lowDay = await state(); assert.equal(report.lowDay.shadow.enabled, false);
    await page.setViewportSize({width:1280,height:720}); await settle();
    assert.equal((await state()).dpr,.8, 'resize retains low DPR');
    await page.evaluate(() => window.__QINHUAI_IMPORT__.setTimeOfDay('night'));
    await settle(); report.night = await state();
    assert.equal(report.night.sky,'moon-stars'); assert.equal(report.night.water.failed,false);
    report.audit = await page.evaluate(() => window.__QINHUAI_IMPORT__.performanceAudit.report());
    assert.deepEqual(report.errors,[]);
    report.passed = true;
  } catch (error) {
    report.passed = false;
    report.failure = error.stack || String(error);
    throw error;
  } finally {
    await fs.writeFile(path.join(out,'spatial-browser.json'), JSON.stringify(report,null,2));
    await browser.close();
  }
})().catch(error => {console.error(error);process.exitCode=1;});
