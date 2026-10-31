const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))); }
const {createServer} = require('../game/serve.cjs');

(async () => {
 const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qinhuai-water-points-'));
 const server = createServer({dataDir});
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 let browser;
 try {
  browser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-angle=d3d11']});
  const page = await browser.newPage({viewport: {width: 1280, height: 800}});
  page.setDefaultTimeout(60000);
  const errors = [];
  page.on('pageerror', error => { errors.push(error.message); console.error('PAGE', error.message); });
  await page.addInitScript(() => Object.defineProperty(window, 'devicePixelRatio', {get: () => .4}));
  await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html?performance=low`, {waitUntil: 'domcontentloaded'});
  console.log('Document ready');
  await page.locator('#menuShell [data-action="play"]').click();
  await page.locator('#menuShell [data-slot="slot-1"]').click();
  await page.waitForFunction(() => document.getElementById('menuShell')?.hidden === true);
  await page.waitForFunction(() => document.getElementById('storyStart')?.disabled === false);
  console.log('Scene ready');
  await page.waitForFunction(() => __QINHUAI_IMPORT__.story.mode === 'play');
  await page.evaluate(() => __QINHUAI_IMPORT__.setPerformanceProfile('low'));
  await page.evaluate(async () => {
   const a = __QINHUAI_IMPORT__;
   await a.setControlMode('firstPerson');
   a.story.state.advance('INTRO_DONE');
   for (const id of ['lion', 'gongming', 'tengma', 'mountain']) a.story.state.advance('OBSERVATION_DONE', id);
  });
  console.log('Act 2 water targets ready');
  for (const id of ['chrysanthemum', 'lotus-main', 'lotus-one']) {
   const point = await page.evaluate(id => {
    const a = __QINHUAI_IMPORT__, target = a.story.world.targets().find(t => t.id === id && t.dock);
    if (!target) throw Error('Missing water target: ' + id);
    const point = a.story.world.observationPoint(target);
    if (!point) throw Error('No visible upper promenade point: ' + id);
    a.player.spawn({x: point.x, z: point.z - .8, ground: point.y});
    a.player.updateCamera(0, true);
    a.camera.lookAt(target.position);
    return {point, lamp: target.position.toArray()};
   }, id);
   assert.equal(point.point.z, -11.5);
   assert.ok(point.point.y > 11.8);
   assert.ok(point.lamp[2] >= -4);
   const route = await page.waitForFunction(point => {
    const n = __QINHUAI_IMPORT__.story.navigation;
    if (!n.goal || Math.hypot(n.goal.x - point.x, n.goal.z - point.z) >= .01) return false;
    return ['ready', 'arrived', 'unreachable', 'error'].includes(n.status) && {status: n.status, goal: n.goal, path: n.path};
   }, point.point);
   const navigation = await route.jsonValue();
   await route.dispose();
   assert.equal(navigation.status, 'ready', 'Upper promenade route must be walkable');
   assert.ok(Math.hypot(navigation.goal.x - point.point.x, navigation.goal.z - point.point.z) < .01);
   assert.ok(Math.abs(navigation.goal.y - point.point.y) < .01);
   await page.evaluate(({point}) => {
    const a = __QINHUAI_IMPORT__;
    a.player.spawn({x: point.x, z: -8.8, ground: 11.323448});
    a.player.updateCamera(0, true);
   }, point);
   await page.waitForTimeout(300);
   assert.equal(await page.evaluate(() => __QINHUAI_IMPORT__.story.snapshot.current?.id || null), null, 'Old lower dock must not trigger observation');
   await page.evaluate(({point, lamp}) => {
    const a = __QINHUAI_IMPORT__;
    a.player.spawn({x: point.x, z: point.z, ground: point.y});
    a.player.updateCamera(0, true);
    a.camera.lookAt(...lamp);
   }, point);
   await page.waitForFunction(id => __QINHUAI_IMPORT__.story.snapshot.current?.id === id, id);
   await page.keyboard.press('KeyE');
   await page.waitForFunction(id => __QINHUAI_IMPORT__.story.snapshot.observing === id, id);
   assert.equal(await page.evaluate(id => __QINHUAI_IMPORT__.story.snapshot.observed.includes(id), id), false);
   await page.keyboard.press('KeyE');
   await page.waitForFunction(id => __QINHUAI_IMPORT__.story.snapshot.observed.includes(id), id);
   console.log('PASS upper route, lower dock rejection and E unlock', id, JSON.stringify(point));
  }
  assert.equal(await page.evaluate(() => __QINHUAI_IMPORT__.story.snapshot.observed.length), 7);
  const out = path.join(__dirname, '../work');
  await fs.mkdir(out, {recursive: true});
  for (const [width, height] of [[1280, 800], [390, 844]]) {
   await page.setViewportSize({width, height});
   assert.equal(await page.locator('#menuShell').isVisible(), false, 'Startup menu must not cover gameplay');
   const image = await page.evaluate(() => {
    const a = __QINHUAI_IMPORT__, gl = a.renderer.getContext(), canvas = a.renderer.domElement;
    a.renderer.render(a.scene, a.camera);
    const pixels = new Uint8Array(canvas.width * canvas.height * 4);
    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const colors = new Set();
    for (let i = 0; i < pixels.length; i += 16) colors.add((pixels[i] << 16) | (pixels[i+1] << 8) | pixels[i+2]);
    return {colors: colors.size, overflow: document.documentElement.scrollWidth > innerWidth};
   });
   assert.ok(image.colors > 32, 'Rendered scene must not be blank');
   assert.equal(image.overflow, false);
   await page.screenshot({path: path.join(out, `story-water-upper-${width}.png`), timeout: 30000});
  }
  assert.deepEqual(errors, []);
  console.log('PASS all three upper promenade observation points and responsive scene rendering');
 } finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  await fs.rm(dataDir, {recursive: true, force: true});
 }
})().catch(error => { console.error(error); process.exitCode = 1; });
