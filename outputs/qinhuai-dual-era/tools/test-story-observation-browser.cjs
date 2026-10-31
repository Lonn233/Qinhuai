const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))); }
const {createServer} = require('../game/serve.cjs');
const waterGeometry = require('esbuild').buildSync({
 stdin: {contents: "export {pointInWater,DOCK_OBSERVATIONS,MAP_UNITS_PER_METER} from './import-festival-lanterns.js';", resolveDir: path.resolve(__dirname, '..')},
 bundle: true, write: false, format: 'iife', globalName: 'ObservationTest', platform: 'browser',
 define: {'import.meta.url': JSON.stringify('http://observation.test/')},
}).outputFiles[0].text;

(async () => {
 const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qinhuai-observation-'));
 const server = createServer({dataDir});
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 let browser;
 try {
  browser = await chromium.launch({executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--use-angle=d3d11']});
  const page = await browser.newPage({viewport: {width: 1280, height: 800}});
  page.setDefaultTimeout(90000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(window, 'devicePixelRatio', {get: () => .25}));
  await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html`, {waitUntil: 'domcontentloaded'});
  await page.locator('#menuShell [data-action="play"]').click();
  await page.locator('#menuShell [data-slot="slot-1"]').click();
  await page.waitForFunction(() => window.__QINHUAI_IMPORT__?.story?.mode === 'play');
  await page.addScriptTag({content: waterGeometry});
  await page.evaluate(() => __QINHUAI_IMPORT__.setPerformanceProfile('low'));
  console.log('Scene ready through game menu');
  await page.evaluate(() => __QINHUAI_IMPORT__.story.state.advance('INTRO_DONE'));

  async function approach(id, mode = 'firstPerson') {
   const target = await page.evaluate(async ({id, mode}) => {
    const a = __QINHUAI_IMPORT__;
    await a.setControlMode(mode);
    const candidates = a.story.world.targets().filter(t => t.id === id).sort((x, y) => x.position.z - y.position.z);
    for (const target of candidates) {
     const shore = a.story.world.observationPoint(target);
     if (!shore) continue;
     a.player.spawn({x: shore.x, z: shore.z, ground: shore.y});
     if (mode === 'thirdPerson') a.player.yaw = Math.atan2(shore.x-target.position.x, shore.z-target.position.z);
     a.player.updateCamera(0, true);
     if (mode === 'firstPerson') a.camera.lookAt(target.position);
     return {id, instance: target.instance, position: target.position.toArray(), shore, top: target.bounds.max.y};
    }
    throw Error('No reachable observation point for ' + id);
   }, {id, mode});
   await page.waitForFunction(id => __QINHUAI_IMPORT__.story.snapshot.current?.id === id, id);
   return target;
  }
  let entryPose;
  const cameraPose=()=>page.evaluate(()=>({position:__QINHUAI_IMPORT__.camera.position.toArray(),rotation:__QINHUAI_IMPORT__.camera.quaternion.toArray(),mode:__QINHUAI_IMPORT__.player.mode,fov:__QINHUAI_IMPORT__.camera.fov,pointerSpeed:__QINHUAI_IMPORT__.story.lookSensitivity}));
  async function begin(id) {
   const before=await page.evaluate(()=>({position:__QINHUAI_IMPORT__.camera.position.toArray(),rotation:__QINHUAI_IMPORT__.camera.quaternion.toArray(),mode:__QINHUAI_IMPORT__.player.mode}));
   entryPose=await cameraPose();
   await page.keyboard.press('KeyE');
   await page.waitForFunction(id => __QINHUAI_IMPORT__.story.snapshot.observing === id, id);
   if(['chrysanthemum','lotus-main','lotus-one'].includes(id)){
    const closeup=await cameraPose();assert.equal(closeup.mode,'firstPerson');assert.ok(closeup.fov<entryPose.fov*.4,'water lamp must have a magnified closeup');
    const fixed=await page.evaluate(()=>({player:__QINHUAI_IMPORT__.player.position.toArray(),camera:__QINHUAI_IMPORT__.camera.position.toArray(),speed:__QINHUAI_IMPORT__.story.lookSensitivity}));
    assert.ok(Math.abs(fixed.camera[1]-fixed.player[1]-.53)<1e-8,'closeup remains at first-person eye height');
    assert.ok(fixed.speed>0&&fixed.speed<1,'zoom must reduce mouse sensitivity');
    await page.keyboard.down('KeyW');await page.waitForTimeout(150);await page.keyboard.up('KeyW');
    assert.deepEqual(await page.evaluate(()=>__QINHUAI_IMPORT__.player.position.toArray()),fixed.player,'closeup must lock movement');
   }else assert.deepEqual(await page.evaluate(()=>({position:__QINHUAI_IMPORT__.camera.position.toArray(),rotation:__QINHUAI_IMPORT__.camera.quaternion.toArray(),mode:__QINHUAI_IMPORT__.player.mode})),before,'E must preserve camera position/orientation and FP/TP mode');
   await page.waitForFunction(()=>document.pointerLockElement===__QINHUAI_IMPORT__.renderer.domElement);
   assert.equal(await page.evaluate(()=>getComputedStyle(__QINHUAI_IMPORT__.renderer.domElement).cursor),'none');
   assert.equal(await page.locator('#storyObservationHint').isVisible(), true);
   assert.match(await page.locator('#storyObservationHint').innerText(), /按E退出赏灯/);
   assert.equal(await page.locator('#storyDialogueNext').isVisible(), false, 'observation must continue through E');
  }
  async function finish(id) {
   await page.keyboard.press('KeyE');
   await page.waitForFunction(id => __QINHUAI_IMPORT__.story.snapshot.observed.includes(id), id);
   assert.equal(await page.evaluate(() => __QINHUAI_IMPORT__.story.observing), false, 'second E must finish and exit observation together');
   assert.equal(await page.locator('#storyDialogue').isVisible(), false);
   await page.waitForFunction(() => !__QINHUAI_IMPORT__.story.observing);
   assert.equal(await page.locator('#storyObservationHint').isVisible(), false);
   if(['chrysanthemum','lotus-main','lotus-one'].includes(id))assert.deepEqual(await cameraPose(),entryPose,'exit must restore camera, FOV and control mode');
  }

  await approach('lion'); await begin('lion');
  assert.equal(await page.locator('#storyDialogueCancel').isVisible(), false, 'observation must exit through E, not dialogue cancel');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => __QINHUAI_IMPORT__.story.observing), true, 'Escape must not exit observation');
  await page.evaluate(() => {
   Object.defineProperty(document, 'hidden', {configurable: true, get: () => true});
   document.dispatchEvent(new Event('visibilitychange'));
   delete document.hidden;
  });
  assert.equal(await page.evaluate(() => __QINHUAI_IMPORT__.story.observing), true, 'backgrounding must not exit observation');
  await page.waitForTimeout(1500);
  await page.mouse.click(640,250);
  await page.waitForFunction(()=>document.pointerLockElement===__QINHUAI_IMPORT__.renderer.domElement);
  const pose = await page.evaluate(() => ({position: __QINHUAI_IMPORT__.player.position.toArray(), rotation: __QINHUAI_IMPORT__.camera.quaternion.toArray()}));
  for (const key of ['KeyW', 'KeyA', 'KeyS', 'KeyD']) {
   await page.keyboard.down(key); await page.waitForTimeout(180); await page.keyboard.up(key);
  }
  assert.deepEqual(await page.evaluate(() => __QINHUAI_IMPORT__.player.position.toArray()), pose.position, 'WASD must not move during observation');
  await page.mouse.move(600, 300); await page.mouse.move(720, 330, {steps: 5});
  assert.notDeepEqual(await page.evaluate(() => __QINHUAI_IMPORT__.camera.quaternion.toArray()), pose.rotation, 'mouse motion without a button must rotate observation camera during dialogue');
  assert.equal(await page.evaluate(()=>document.pointerLockElement===__QINHUAI_IMPORT__.renderer.domElement),true,'mouse must remain trapped within the game');
  assert.deepEqual(await page.evaluate(() => __QINHUAI_IMPORT__.player.position.toArray()), pose.position, 'looking must not move the character');
  assert.deepEqual(await page.evaluate(() => __QINHUAI_IMPORT__.story.snapshot.observed), [], 'entry and free look must not unlock before E confirmation');
  await finish('lion');
  await approach('lion', 'thirdPerson'); await begin('lion');
  const thirdPersonPose = await page.evaluate(() => ({position: __QINHUAI_IMPORT__.player.position.toArray(), rotation: __QINHUAI_IMPORT__.camera.quaternion.toArray()}));
  await page.keyboard.down('KeyA'); await page.waitForTimeout(180); await page.keyboard.up('KeyA');
  await page.mouse.move(670, 280, {steps: 3});
  assert.deepEqual(await page.evaluate(() => __QINHUAI_IMPORT__.player.position.toArray()), thirdPersonPose.position);
  assert.notDeepEqual(await page.evaluate(() => __QINHUAI_IMPORT__.camera.quaternion.toArray()), thirdPersonPose.rotation);
  assert.equal(await page.evaluate(() => __QINHUAI_IMPORT__.player.mode), 'thirdPerson');
  await finish('lion');
  assert.deepEqual(await page.evaluate(() => __QINHUAI_IMPORT__.story.snapshot.observed), ['lion'], 'revisiting must not duplicate progress');
  console.log('PASS observation preserves camera entry pose, hides/locks mouse, permits button-free look and exits/completes with second E');

  await page.evaluate(() => { for (const id of ['gongming', 'tengma', 'mountain']) __QINHUAI_IMPORT__.story.state.advance('OBSERVATION_DONE', id); });
  const out = path.resolve(__dirname, '../work'); await fs.mkdir(out, {recursive: true});
  for (const id of ['chrysanthemum', 'lotus-main', 'lotus-one']) {
   const target = await approach(id,id==='lotus-main'?'thirdPerson':'firstPerson');
   assert.ok(target.position[0] >= -17.7 && target.position[0] <= -5, 'target must be at old boat dock');
   assert.equal(target.shore.z, -11.5, 'observation must be on the upper promenade above the former boats');
   assert.ok(target.shore.y > 11.8, 'observation must not use the lower dock surface');
   const shoreValid = await page.evaluate(({shore, position}) => {
    const ground = __QINHUAI_IMPORT__.player.surface(shore.x, shore.z, shore.y);
    const meters = Math.hypot(shore.x-position[0], shore.z-position[2])/ObservationTest.MAP_UNITS_PER_METER;
    return ground !== null && Math.abs(ground - shore.y) < .05 && meters >= 23 && meters <= 35;
   }, target);
   assert.ok(shoreValid, 'player must stand on reachable land near the dock lamp: ' + JSON.stringify(target));
   await begin(id);
   const visibility = await page.evaluate(async ({position, id, instance}) => {
    const THREE = await import('/node_modules/three/build/three.module.js'), a = __QINHUAI_IMPORT__;
    const end = new THREE.Vector3(...position), direction = end.clone().sub(a.camera.position), distance = direction.length();
    const ray = new THREE.Raycaster(a.camera.position, direction.normalize(), .03, distance - .08), meshes = [];
    a.modelRoot.traverseVisible(mesh => { if (mesh.isMesh) meshes.push(mesh); });
    const ownMeshes = new Set(a.festivalLanterns.entries.get(id).batches.map(batch => batch.mesh));
    return ray.intersectObjects(meshes, false)
     .filter(hit => !(ownMeshes.has(hit.object) && hit.instanceId === instance))
     .map(hit => ({name: hit.object.name, instance: hit.instanceId, distance: hit.distance}));
   }, target);
   assert.deepEqual(visibility, [], 'actual scene geometry must not hide the lamp from the observation point');
   await page.waitForFunction(() => !document.getElementById('storyLampMarker').hidden);
   const marker = await page.evaluate(() => {
    const a = __QINHUAI_IMPORT__, s = a.story.snapshot;
    const t = a.story.world.targets().find(t => t.id === s.observing && t.dock);
    const p = t.position.clone(); p.y = t.bounds.max.y + (t.bounds.max.y-t.bounds.min.y)*.12; p.project(a.camera);
    const r = document.getElementById('storyLampMarker').getBoundingClientRect();
    return {x: r.left+r.width/2, y: r.bottom, expectedX: (p.x*.5+.5)*innerWidth, expectedY: (-p.y*.5+.5)*innerHeight};
   });
   assert.ok(Math.abs(marker.x-marker.expectedX) < 2 && Math.abs(marker.y-marker.expectedY) < 2, 'highlight must project above actual lamp');
   for (const [width, height] of [[1280, 800], [390, 844]]) {
    await page.setViewportSize({width, height});
    const layout = await page.evaluate(() => {
     const r = id => document.getElementById(id).getBoundingClientRect(), hint = r('storyObservationHint'), subtitle = r('storyDialogue'), map = r('storyMapPanel');
     const overlap = (a,b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
     const canvas = __QINHUAI_IMPORT__.renderer.domElement, gl = __QINHUAI_IMPORT__.renderer.getContext();
     const a = __QINHUAI_IMPORT__; a.renderer.render(a.scene, a.camera);
     const pixels = new Uint8Array(canvas.width * canvas.height * 4);
     gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
     const colors = new Set(); let lit = 0;
     for (let i = 0; i < pixels.length; i += 16) {
      colors.add((pixels[i] << 16) | (pixels[i+1] << 8) | pixels[i+2]);
      if (pixels[i] + pixels[i+1] + pixels[i+2] > 30) lit++;
     }
     return {hintOverlap: overlap(hint, subtitle) || overlap(hint, map), overflow: document.documentElement.scrollWidth > innerWidth, canvas: canvas.width > 0 && canvas.height > 0 && !gl.isContextLost(), colors: colors.size, lit};
    });
    assert.equal(layout.hintOverlap, false, 'observation hint must not overlap subtitles/map');
    assert.equal(layout.overflow, false); assert.equal(layout.canvas, true);
    assert.ok(layout.colors > 32 && layout.lit > 100, 'scene canvas must contain rendered, nonblank imagery');
    await page.screenshot({path: path.join(out, `story-observation-${id}-${width}.png`), timeout: 90000});
   }
   await page.setViewportSize({width: 1280, height: 800});
   await finish(id);
   console.log('PASS dock observation and marker', id, JSON.stringify(target));
  }
  assert.equal(await page.evaluate(() => __QINHUAI_IMPORT__.story.snapshot.stage), 'temple-enter');
  assert.equal(await page.evaluate(() => __QINHUAI_IMPORT__.story.snapshot.observed.length), 7);
  assert.deepEqual(errors, []);
  console.log('PASS seven distinct unlocks, responsive observation HUD and no browser errors');
 } finally {
  if (browser) await browser.close();
  server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  await fs.rm(dataDir, {recursive: true, force: true});
 }
})().catch(error => { console.error(error); process.exitCode = 1; });
