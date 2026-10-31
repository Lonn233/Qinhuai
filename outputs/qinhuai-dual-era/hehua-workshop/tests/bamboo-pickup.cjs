const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox']
  });
  try {
    const page = await browser.newPage({viewport: {width:1280, height:800}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.WORKSHOP_URL || 'http://127.0.0.1:4173/', {waitUntil:'commit', timeout:180000});
    await page.waitForFunction(() => window.__HEHUA_READY__, {}, {timeout:180000});
    await page.evaluate(() => {__HEHUA__.start(); __HEHUA__.openBamboo(true); __HEHUA__.renderer.setPixelRatio(.5);});
    await page.evaluate(() => {
      window.chimeCount = 0;
      const chime = __HEHUA__.audio.chime;
      __HEHUA__.audio.chime = () => { window.chimeCount++; chime(); };
    });
    const state = () => page.evaluate(() => __HEHUA__.state());
    const initial = await state();
    assert.equal(initial.pieces.length, 23);
    for (const piece of initial.pieces) {
      await page.mouse.move(piece.x, piece.y);
      assert.equal((await state()).hoverId, piece.id, `Unpickable strip: ${piece.id}`);
    }
    await page.screenshot({path:path.resolve(__dirname, '../preview/72-all-bamboo-pickable.png')});
    const take = async piece => {
      await page.mouse.move(piece.x, piece.y);
      assert.equal((await state()).hoverId, piece.id);
      await page.keyboard.press('e');
      const after = await state();
      assert.equal(after.pieces.find(p => p.id === piece.id).visible, false);
      return after;
    };
    // Start from reserve stock on the right, out of the old prescribed order.
    const small = initial.pieces.filter(p => p.mode === 'pickSmall');
    const arcs = initial.pieces.filter(p => p.mode === 'pickArc');
    const long = initial.pieces.filter(p => p.mode === 'pickLong');
    let picked = await take(small[0]);
    assert.equal(picked.inventory.smallBamboo, 1);
    assert.equal(picked.mode, 'pickLong');
    assert.equal(picked.pieces.filter(p => p.visible).length, 22);
    for (const piece of arcs.slice(0,3)) await take(piece);
    assert.equal(await page.evaluate(() => window.chimeCount), 0);
    picked = await take(long[0]);
    assert.equal(picked.mode, 'toAssembly');
    assert(picked.partsDone);
    assert.equal(await page.evaluate(() => window.chimeCount), 1);
    // Surplus strips remain pickable even when the recipe is ready.
    picked = await take(long[1]);
    assert.equal(picked.inventory.longBamboo, 2);
    assert.equal(picked.mode, 'toAssembly');
    for (const piece of picked.pieces.filter(p => p.visible)) await take(piece);
    const collected = await state();
    assert.equal(collected.pieces.filter(p => p.visible).length, 0);
    assert.deepEqual([collected.inventory.longBamboo,collected.inventory.arcBamboo,collected.inventory.smallBamboo], [7,9,7]);
    await page.evaluate(() => { __HEHUA__.bambooStage.close(); __HEHUA__.bambooStage.open(); });
    assert.equal(await page.evaluate(() => window.chimeCount), 1, 'Surplus and reopening must not chime');
    await page.evaluate(() => __HEHUA__.reset());
    assert.equal((await state()).pieces.filter(p => p.visible).length, 23);
    assert.equal((await state()).inventory.longBamboo, 0);
    const resetPieces = (await state()).pieces;
    for (const mode of ['pickLong', 'pickArc', 'pickSmall']) {
      for (const piece of resetPieces.filter(p => p.mode === mode).slice(0, mode === 'pickArc' ? 3 : 1)) await take(piece);
    }
    assert.equal(await page.evaluate(() => window.chimeCount), 2, 'Replay must chime again');

    const profile = await page.evaluate(async () => {
      const THREE = await import('three');
      const {bambooRodGeometry, circlePoints} = await import('../js/geometry.js');
      const geometry = bambooRodGeometry([new THREE.Vector3(-.2,0,0),new THREE.Vector3(.2,0,0)], .01);
      const p = geometry.attributes.position;
      const radii = Array.from({length:13}, (_,i) => Math.hypot(p.getY(i), p.getZ(i)));
      const ring = bambooRodGeometry(circlePoints(.1), .01, true);
      const result = {radii, radialSegments:geometry.parameters.radialSegments, closed:ring.parameters.closed};
      geometry.dispose(); ring.dispose(); return result;
    });
    assert(profile.radii.every(r => Math.abs(r - .0022) < 1e-7));
    assert.equal(profile.radialSegments, 12);
    assert(profile.closed);

    await page.evaluate(() => __HEHUA__.leave());
    await page.waitForFunction(() => !__HEHUA__.transition);
    assert(await page.evaluate(() => __HEHUA__.openAssembly(true)));
    let s = await state();
    await page.mouse.move(1100,680); await page.mouse.down();
    assert(await page.evaluate(() => __HEHUA__.drag('longBamboo',1100,680)));
    await page.mouse.move(s.dot.x,s.dot.y); await page.mouse.up();
    await page.evaluate(() => __HEHUA__.stage.update(2,0));
    s = await state();
    assert.equal(s.mode,'bendBig');
    assert(s.work.y < 570, `Bending workpiece too low: ${s.work.y}`);
    await page.mouse.move(s.work.x,s.work.y); await page.mouse.down();
    await page.evaluate(() => __HEHUA__.stage.update((1-__HEHUA__.state().curve)/.30,0));
    await page.mouse.up();
    await page.evaluate(() => __HEHUA__.stage.update(2,0));
    assert.equal((await state()).mode, 'bindBig');
    await page.screenshot({path:path.resolve(__dirname, '../preview/73-thin-raised-hoop.png')});
    const pixelCheck = () => page.evaluate(() => {
      const {renderer,scene,camera} = __HEHUA__; renderer.render(scene,camera);
      const gl = renderer.getContext(), pixels = new Uint8Array(4096);
      gl.readPixels(gl.drawingBufferWidth/2-16,gl.drawingBufferHeight/2-16,32,32,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      return new Set(Array.from({length:1024},(_,i)=>`${pixels[i*4]},${pixels[i*4+1]},${pixels[i*4+2]}`)).size;
    });
    assert(await pixelCheck() > 20);
    await page.setViewportSize({width:390,height:844});
    await page.waitForFunction(() => __HEHUA__.camera.aspect < 1);
    assert(await pixelCheck() > 20);
    await page.screenshot({path:path.resolve(__dirname, '../preview/74-thin-hoop-mobile.png')});
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({result:'PASS',individualPickups:23,arbitraryOrder:true,reset:true,cylindricalProfile:profile,workY:s.work.y},null,2));
  } finally {await browser.close();}
})().catch(error => {console.error(error); process.exitCode=1;});
