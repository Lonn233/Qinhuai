const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 849 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const state = () => page.evaluate(() => window.__HEHUA__.state());
  const settle = async () => {
    await page.evaluate(() => window.__HEHUA__.stage.update?.(10, 0));
    await page.waitForFunction(() => !window.__HEHUA__.stage.busy);
  };
  const skip = async () => { await page.locator('#step-skip').click(); await settle(); };
  const back = async () => { await page.locator('#step-back').click(); };
  const same = (actual, expected) => {
    for (const key of ['mode', 'inventory', 'arcsPlaced', 'arcEnd', 'smallTies', 'frameChildren', 'bindChildren', 'lower', 'upper', 'whites', 'reds', 'charge', 'petalsMade', 'pressedCount']) {
      assert.deepEqual(actual[key], expected[key], `undo mismatch: ${key} (${expected.mode})`);
    }
  };
  const roundTrip = async () => {
    const before = await state();
    await skip();
    await back();
    same(await state(), before);
    await skip();
  };
  const leave = async () => {
    await page.evaluate(() => window.__HEHUA__.leave());
    assert.equal(await page.locator('.step-controls').isVisible(), false);
    await page.waitForFunction(() => !window.__HEHUA__.transition);
  };
  try {
    await page.goto(process.env.WORKSHOP_URL || 'http://127.0.0.1:4173/');
    await page.waitForFunction(() => window.__HEHUA_READY__);
    await page.locator('#start-button').click();
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.__HEHUA__.openBamboo(true));
    assert.equal(await page.locator('#step-back').isDisabled(), true);
    for (let i = 0; i < 5; i++) await roundTrip();
    assert.equal((await state()).mode, 'toAssembly');
    assert.equal(await page.locator('#step-skip').isDisabled(), true);
    console.log('PASS bamboo: pickup, skip, undo, inventory and button states');
    await leave();
    await page.evaluate(() => window.__HEHUA__.openAssembly(true));
    let count = 0;
    while (!(await state()).done && count++ < 60) await roundTrip();
    assert.equal((await state()).done, true);
    await page.waitForFunction(() => window.__HEHUA__.state().phase === 2);
    // Undo across the assembly-to-pasting boundary.
    await back();
    assert.equal((await state()).mode, 'assembleWire');
    assert.equal((await state()).inventory.wire, 1);
    await skip();
    await page.waitForFunction(() => window.__HEHUA__.state().phase === 2);
    console.log(`PASS assembly: ${count} operations and phase-boundary undo`);
    await page.waitForFunction(() => !window.__HEHUA__.cameraMoving);
    const dip = await page.evaluate(() => window.__HEHUA__.pastingStage.snapshot());
    assert.deepEqual(dip.labels, ['蘸浆刷下骨', '贴白色无纺布', '刷上骨贴红布']);
    assert(!JSON.stringify(dip).includes('scissors'), 'pasting interaction must not expose a scissors step');
    assert(dip.source.x > 380 && dip.source.x < 1060 && dip.source.y < 850, 'brush must be on-screen and outside the inventory');
    await page.mouse.move(dip.source.x, dip.source.y); await page.mouse.down();
    await page.mouse.move(dip.dot.x, dip.dot.y, { steps: 10 }); await page.mouse.up();
    assert.equal((await state()).mode, 'lowerCoat', 'releasing the brush at glue must dip it and advance');
    await settle();
    const brushReady = await page.evaluate(() => window.__HEHUA__.pastingStage.snapshot());
    await page.mouse.move(brushReady.source.x, brushReady.source.y); await page.mouse.down();
    await page.mouse.move(brushReady.dot.x, brushReady.dot.y, { steps: 10 }); await page.mouse.up();
    assert.equal((await state()).lower, 1, 'releasing the moving brush at a frame point must paint it');
    await settle();
    const rotation = await page.evaluate(() => window.__HEHUA__.pastingStage.snapshot());
    await page.keyboard.press('q');
    const rotated = await page.evaluate(() => window.__HEHUA__.pastingStage.snapshot());
    assert.notEqual(rotated.dot.x, rotation.dot.x, 'Q must rotate the frame target');
    await page.keyboard.press('r');
    const restored = await page.evaluate(() => window.__HEHUA__.pastingStage.snapshot());
    await page.mouse.move(restored.source.x, restored.source.y); await page.mouse.down();
    await page.mouse.move(restored.dot.x, restored.dot.y, { steps: 10 }); await page.mouse.up();
    assert.equal((await state()).lower, 2, 'dragging the brush onto the next frame point must work');
    await back(); assert.equal((await state()).lower, 1);
    count = 0;
    while (!(await state()).done && count++ < 80) {
      const before = await state();
      await roundTrip();
      const current = await state();
      if (before.mode === 'white' && before.whites === 5) assert.equal(current.mode, 'upperCoat', 'white cloth must lead directly to upper-frame paste, without scissors');
    }
    assert.equal((await state()).inventory.pastedFrame, 1);
    assert.equal((await state()).done, true);
    console.log(`PASS pasting: ${count} operations, cloth undo and completion`);
    await leave();
    await page.evaluate(() => window.__HEHUA__.openDye(true));
    // Dye each sheet individually, then dry the full rack once and collect each sheet.
    for (let i = 0; i < 6; i++) {
      const nextMode = i === 5 ? 'readyToDryAll' : 'dye';
      for (const expected of ['paperReady', 'atDye', 'dyeing', nextMode]) {
        const before = await state();
        await page.locator('#step-skip').click();
        assert.equal((await state()).mode, expected);
        await back(); same(await state(), before);
        await page.locator('#step-skip').click();
      }
    }
    for (const expected of ['dryingAll', 'collectDyed']) {
      const before = await state(); await page.locator('#step-skip').click();
      assert.equal((await state()).mode, expected); await back(); same(await state(), before);
      await page.locator('#step-skip').click();
    }
    for (let i = 0; i < 6; i++) {
      const before = await state(); await page.locator('#step-skip').click();
      assert.equal((await state()).inventory.dyedPaper, i + 1);
      assert.equal((await state()).mode, i === 5 ? 'dyeDone' : 'collectDyed');
      await back(); same(await state(), before); await page.locator('#step-skip').click();
    }    assert.equal((await state()).inventory.dyedPaper, 6);
    assert.equal((await state()).inventory.paper, 0);
    assert.equal((await state()).inventory.wetPaper, 0);
    assert.equal(await page.locator('#step-skip').isDisabled(), true);
    console.log('PASS dyeing: six sheets, one reversible batch dry, sequential reversible collection, inventory conservation');
    await leave();
    await page.evaluate(() => window.__HEHUA__.openPress(true));
    // Opening the press grants wire once; dye undo must not undo that unrelated grant.
    await leave(); await page.evaluate(() => window.__HEHUA__.openDye(true));
    await back(); assert.equal((await state()).inventory.copper, 3);
    await page.locator('#step-skip').click();
    await leave(); await page.evaluate(() => window.__HEHUA__.openPress(true));
    // Leaving and returning must preserve the current step and not grant more wire.
    await skip(); const pressBefore = await state();
    await leave(); await page.evaluate(() => window.__HEHUA__.openPress(true));
    same(await state(), pressBefore);
    await back(); assert.equal((await state()).inventory.dyedPaper, 6);
    count = 0;
    while (!(await state()).done && count++ < 40) await roundTrip();
    assert.equal((await state()).pressedCount, 6);
    assert.equal((await state()).inventory.pressedPaper, 0);
    assert.equal((await state()).inventory.petal, 3);
    assert.equal((await state()).inventory.copper, 0);
    assert.equal((await state()).inventory.dyedPaper, 0);
    assert.equal(await page.locator('#step-skip').isDisabled(), true);
    assert.deepEqual(errors, []);
    console.log(`PASS pressing: ${count} operations, resume, inventory conservation, no browser errors`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });



