const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const state = () => page.evaluate(() => window.__HEHUA__.state());
  const settle = () => page.waitForFunction(() => !window.__HEHUA__.stage.busy);
  const fast = dt => page.evaluate(dt => window.__HEHUA__.stage.update(dt), dt);
  const drag = async () => {
    const s = await state(); assert.ok(s.source && s.dot, `missing drag anchors in ${s.mode}`);
    await page.mouse.move(s.source.x, s.source.y); await page.mouse.down();
    await page.mouse.move((s.source.x+s.dot.x)/2, (s.source.y+s.dot.y)/2, { steps: 8 });
    await page.waitForTimeout(100); const mid = await state(); assert.equal(mid.drag, s.source.key);
    assert.ok(Math.hypot(mid.source.x-s.source.x,mid.source.y-s.source.y)>10,'paper follows pointer');
    assert.ok(Math.hypot(mid.dot.x-s.dot.x,mid.dot.y-s.dot.y)<1,'highlight stays on destination');
    await page.mouse.move(s.dot.x,s.dot.y,{steps:8});await page.mouse.up();await settle();
  };
  try {
    await page.goto('http://127.0.0.1:4173/'); await page.waitForFunction(() => window.__HEHUA_READY__);
    await page.locator('#start-button').click(); await page.waitForTimeout(1000);
    await page.evaluate(() => window.__HEHUA__.openDye(true)); await page.waitForTimeout(300);
    assert.equal((await state()).inventory.paper, 0); assert.equal(await page.locator('#dye-timer').isVisible(),false);
    await page.keyboard.press('e');await settle();assert.equal((await state()).inventory.paper,1);
    await drag();assert.equal((await state()).mode,'atDye');
    await page.keyboard.down('e');await page.waitForTimeout(1500);await page.keyboard.up('e');await settle();
    const paused=(await state()).dye.seconds;assert.ok(paused>=20 && paused<60,`20x wall clock: ${paused}`);
    await page.waitForTimeout(250);assert.equal((await state()).dye.seconds,paused);
    assert.equal(await page.locator('#dye-timer').isVisible(),true);assert.equal((await state()).dye.quality,'light');
    await page.keyboard.down('e'); await fast((130-paused)/20); await page.keyboard.up('e'); await settle();
    assert.equal((await state()).dye.quality,'ready');
    await page.screenshot({path:'outputs/qinhuai-dual-era/hehua-workshop/preview/dye-ready.png'});
    await drag();assert.equal((await state()).mode,'dye');assert.equal((await state()).dye.rackCount,1);assert.equal(await page.locator('#dye-timer').isVisible(),false);
    assert.equal((await state()).inventory.dyedPaper,0,'a sheet cannot be collected before the entire batch dries');
    await page.keyboard.press('e');await settle();await drag();await page.keyboard.down('e');await fast(9.2);await page.keyboard.up('e');await settle();
    assert.equal((await state()).dye.quality,'dark');await page.keyboard.press('d');assert.equal((await state()).mode,'dye');
    assert.equal((await state()).dye.discarded,1);assert.equal((await state()).inventory.wetPaper,1);
    await page.locator('#step-back').click();assert.equal((await state()).dye.quality,'dark');await page.keyboard.press('d');
    await page.evaluate(()=>window.__HEHUA__.batch());
    assert.equal((await state()).mode,'dyeDone');assert.equal((await state()).inventory.dyedPaper,6);
    assert.equal((await state()).dye.rackCount,0);    assert.equal((await state()).inventory.paper,0);assert.equal((await state()).inventory.wetPaper,0);
    assert.equal(await page.locator('#step-skip').isDisabled(),true);
    assert.deepEqual(errors,[]);console.log('PASS browser: real keyboard timing, paper follows mouse, stationary highlights, pause/resume, batch drying, sequential collection, discard, undo, completion');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
