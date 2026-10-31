import * as THREE from 'three';
import {
  buildBambooStrip, buildWireCoil, buildBrush, buildPasteJar,
  buildScissors, buildHammer, buildThreadSpool, buildDyeBowl, buildPaperPile, buildPaperSheet,
  buildPress, buildDryingRack, buildLotusLantern, buildPlumBranch, buildBambooBundle,
  buildTeaSet, buildIncenseBurner
} from './models.js';
import {
  stoneTexture, plasterTexture, woodTexture, linenTexture, radialShadowTexture, dustTexture,
  glowTexture, latticeTexture, skyTexture, plaqueTexture, labelTexture, scrollTexture, clothTexture
} from './textures.js';
import { roundedBoxGeometry, latheGeometry, curveFromPoints } from './geometry.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;

function addMesh(parent, geo, mat, position = [0, 0, 0], rotation = [0, 0, 0], cast = true, receive = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...position);
  m.rotation.set(...rotation);
  m.castShadow = cast; m.receiveShadow = receive;
  parent.add(m);
  return m;
}

function planeTexture(texture, w, h, transparent = false) {
  return new THREE.MeshBasicMaterial({ map: texture, transparent, side: THREE.DoubleSide, toneMapped: false });
}

function makeEnvironment(renderer) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#4e3a29');
  grad.addColorStop(.38, '#b48b62');
  grad.addColorStop(.56, '#f2d3a2');
  grad.addColorStop(.7, '#a97c53');
  grad.addColorStop(1, '#3a251a');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 256);
  const windows = [[66, 92, 54, 82], [282, 88, 84, 74], [420, 100, 38, 66]];
  for (const [x, y, w, h] of windows) {
    const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 2, x + w / 2, y + h / 2, w);
    glow.addColorStop(0, 'rgba(255,241,208,1)');
    glow.addColorStop(.55, 'rgba(255,220,167,.7)');
    glow.addColorStop(1, 'rgba(255,210,150,0)');
    ctx.fillStyle = glow; ctx.fillRect(x - w / 2, y - h / 2, w * 2, h * 2);
  }
  const texture = new THREE.CanvasTexture(c);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(texture).texture;
  texture.dispose(); pmrem.dispose();
  return env;
}

function diamondTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d');
  x.translate(64, 64);
  x.strokeStyle = '#f5d79b'; x.lineWidth = 4;
  x.beginPath(); x.moveTo(0, -38); x.lineTo(38, 0); x.lineTo(0, 38); x.lineTo(-38, 0); x.closePath(); x.stroke();
  x.strokeStyle = 'rgba(255,230,180,.5)'; x.lineWidth = 1.4;
  x.beginPath(); x.moveTo(0, -27); x.lineTo(27, 0); x.lineTo(0, 27); x.lineTo(-27, 0); x.closePath(); x.stroke();
  const grad = x.createRadialGradient(0, 0, 1, 0, 0, 54);
  grad.addColorStop(0, 'rgba(255,214,140,.32)'); grad.addColorStop(1, 'rgba(255,200,110,0)');
  x.fillStyle = grad; x.beginPath(); x.arc(0, 0, 54, 0, TAU); x.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBenchBase(M, { width, depth, height = 0.93, dark = false }) {
  const group = new THREE.Group();
  const topMat = dark ? M.woodDark : M.wood;
  addMesh(group, roundedBoxGeometry(width, 0.075, depth, 0.025), topMat, [0, height, 0]);
  addMesh(group, new THREE.BoxGeometry(width - .08, .115, depth - .1), M.woodDark, [0, height - .095, 0]);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const x = sx * (width / 2 - .11), z = sz * (depth / 2 - .115);
    addMesh(group, new THREE.BoxGeometry(.105, height - .16, .105), M.woodDark, [x, (height - .16) / 2, z]);
    addMesh(group, new THREE.BoxGeometry(.15, .032, .15), M.woodDark, [x, .016, z]);
  }
  for (const sz of [-1, 1]) {
    addMesh(group, new THREE.BoxGeometry(width - .26, .06, .07), M.woodDark, [0, .26, sz * (depth / 2 - .13)]);
  }
  addMesh(group, new THREE.BoxGeometry(.07, .06, depth - .26), M.woodDark, [(width / 2 - .13), .26, 0]);
  addMesh(group, new THREE.BoxGeometry(.07, .06, depth - .26), M.woodDark, [-(width / 2 - .13), .26, 0]);
  return group;
}

function benchRunner(M, group, width, depth, y) {
  const runner = addMesh(group, new THREE.PlaneGeometry(width * .7, depth * .78), M.linen, [0, y + .001, 0], [-Math.PI / 2, 0, 0], false, true);
  runner.receiveShadow = true;
  const fringeMat = M.twine;
  for (let i = 0; i < 22; i++) {
    const z = -depth * .39 + (i / 21) * depth * .78;
    for (const x of [-width * .35, width * .35]) {
      const line = addMesh(group, new THREE.PlaneGeometry(.0025, .022), fringeMat, [x + (Math.random() - .5) * .01, y + .002, z], [-Math.PI / 2, 0, 0], false, false);
      line.material = fringeMat;
    }
  }
  return runner;
}

function makeStool(M, x, z, rotation = 0) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotation;
  const top = addMesh(group, new THREE.CylinderGeometry(.23, .24, .055, 28), M.woodDark, [0, .48, 0]);
  const ring = addMesh(group, new THREE.TorusGeometry(.19, .01, 5, 28), M.woodDark, [0, .25, 0], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 4; i++) {
    const a = i / 4 * TAU + Math.PI / 4;
    const leg = addMesh(group, new THREE.CylinderGeometry(.022, .026, .48, 8), M.woodDark, [Math.cos(a) * .17, .24, Math.sin(a) * .17]);
    leg.rotation.z = Math.cos(a) * .06; leg.rotation.x = -Math.sin(a) * .06;
  }
  group.userData.collider = { x, z, hx: .26, hz: .26 };
  return group;
}

function buildBambooBench(M) {
  const g = new THREE.Group();
  g.position.set(-3.15, 0, -2.25);
  const base = createBenchBase(M, { width: 2.55, depth: 1.38 });
  g.add(base);
  benchRunner(M, g, 2.55, 1.38, .968);
  // ruler and red marking pen
  addMesh(g, new THREE.BoxGeometry(.52, .006, .035), M.bambooWarm, [.94, 1.006, -.5]);
  const pen = new THREE.Group();
  pen.position.set(1.05, 1.012, -.4);
  addMesh(pen, new THREE.CylinderGeometry(.0055, .007, .19, 10), M.redLacquer, [0, 0, 0], [0, 0, Math.PI / 2]);
  addMesh(pen, new THREE.ConeGeometry(.004, .03, 8), M.ink, [.11, 0, 0], [0, 0, -Math.PI / 2]);
  g.add(pen);
  const cup = addMesh(g, latheGeometry([[.001, 0], [.03, .003], [.036, .04], [.034, .06], [.03, .06], [.032, .04], [.001, .035]], 20), M.ceramicCeladon, [-.96, 1.003, .48]);
  // label plaque on a tiny stand
  const label = makeLabel(M, '壹 · 竹篾操作台', '扎 框', .9);
  label.position.set(-.55, 1.13, -.62); label.rotation.y = .12;
  g.add(label);
  // stool
  g.add(makeStool(M, .95, 1.05, -.4));
  // floor basket with offcuts
  const basket = new THREE.Group();
  basket.position.set(-1.0, .02, .95);
  g.add(basket);
  addMesh(basket, new THREE.CylinderGeometry(.19, .15, .24, 24, 1, true), M.bambooWarm, [0, .12, 0]);
  addMesh(basket, new THREE.CircleGeometry(.15, 24), M.bambooWarm, [0, .01, 0], [-Math.PI / 2, 0, 0]);
  for (let i = 0; i < 9; i++) {
    const off = buildBambooStrip(M, { length: .2 + Math.random() * .22, width: .009, thickness: .0025 });
    off.position.set((Math.random() - .5) * .12, .22, (Math.random() - .5) * .12);
    off.rotation.set((Math.random() - .5) * .4, Math.random() * TAU, (Math.random() - .5) * .3);
    basket.add(off);
  }
  g.userData.collider = { x: -3.15, z: -2.25, hx: 1.4, hz: .83 };
  return g;
}

function makeLabel(M, title, sub, width = .8) {
  const texture = labelTexture(title, sub);
  const group = new THREE.Group();
  const plaque = addMesh(group, new THREE.PlaneGeometry(width, width * .375), new THREE.MeshBasicMaterial({ map: texture, transparent: true }), [0, 0, 0], [0, 0, 0], false, false);
  addMesh(group, new THREE.BoxGeometry(width + .03, width * .375 + .03, .018), M.woodDark, [0, 0, -.012], [0, 0, 0], true, true);
  const standX = width * .35;
  for (const x of [-standX, standX]) addMesh(group, new THREE.BoxGeometry(.022, .16, .06), M.woodDark, [x, -.085, -.03]);
  return group;
}

function buildAssemblyBench(M) {
  const g = new THREE.Group();
  g.position.set(-3.15, 0, 2.15);
  g.add(createBenchBase(M, { width: 2.7, depth: 1.65, dark: true }));
  const paste = buildPasteJar(M); paste.position.set(-.92, .972, -.22); g.add(paste);
  const brush = buildBrush(M); brush.position.set(.1, 1.005, .02); brush.rotation.y = .5; g.add(brush);
  const scissors = buildScissors(M); scissors.position.set(1.12, 1.045, .43); scissors.rotation.set(-.04, .48, -.02); scissors.scale.setScalar(2.15); g.add(scissors);
  const tray = addMesh(g, roundedBoxGeometry(.5, .028, .64, .012), M.linen, [.85, .99, 0]);
  const lining = new THREE.Group(); g.add(lining);
  const redPaper = M.paperWhite.clone(); redPaper.color.set(0xb33438);
  for (let i = 0; i < 6; i++) {
    addMesh(lining, new THREE.PlaneGeometry(.2, .26), redPaper, [.82 + i * .004, 1.012 + i * .002, -.27], [-Math.PI / 2, 0, -.12]);
  }
  const petals = buildPaperPile(M, { count: 5, width: .18, height: .16, pink: true }); petals.position.set(-.74, 1.012, -.4); petals.rotation.y = .2; g.add(petals);
  // nonwoven half circles
  const nonwoven = new THREE.Group(); g.add(nonwoven);
  const futureProps = [petals];
  for (let i = 0; i < 6; i++) {
    const geo = new THREE.CircleGeometry(.16, 24, 0, Math.PI);
    addMesh(nonwoven, geo, M.paperWhite, [.73 + i * .012, 1.012 + i * .002, .28 - i * .009], [-Math.PI / 2, 0, .35]);
  }
  // flower head, leaves, stem samples
  for (let i = 0; i < 2; i++) {
    const leaf = new THREE.Mesh(new THREE.PlaneGeometry(.12, .18), M.leaf);
    leaf.rotation.set(-Math.PI / 2, 0, .6 + i * .7); leaf.position.set(-.45 + i * .14, 1.002, .33);
    g.add(leaf);
    futureProps.push(leaf);
  }
  const candle = addMesh(g, new THREE.CylinderGeometry(.022, .024, .12, 16), M.candleWax, [.35, 1.03, -.62]);
  const wick = addMesh(g, new THREE.CylinderGeometry(.002, .002, .018, 6), M.ink, [.35, 1.1, -.62]);
  futureProps.push(candle, wick);
  g.userData.liningTools = { paste, brush, scissors, nonwoven, lining, tray, futureProps };
  const label = makeLabel(M, '肆 · 合成台', '合 框 · 裱 糊', .9);
  label.position.set(-.65, 1.13, -.68); label.rotation.y = .1; g.add(label);
  g.add(makeStool(M, 1.05, 1.15, .3));
  g.userData.collider = { x: -3.15, z: 2.15, hx: 1.48, hz: .95 };
  return g;
}

function buildDyeBench(M) {
  const g = new THREE.Group();
  g.position.set(3.2, 0, 2.15);
  g.add(createBenchBase(M, { width: 2.45, depth: 1.4 }));
  benchRunner(M, g, 2.45, 1.4, .968);
  const bowlA = buildDyeBowl(M, { color: 'pink' }); bowlA.position.set(-.55, .976, .28); bowlA.scale.setScalar(1.8); g.add(bowlA);
  const stock = buildPaperPile(M, { count: 6, width: .18, height: .24 }); stock.position.set(.55, 1.0, -.38); stock.rotation.y = -.08; g.add(stock);
  const rack = buildDryingRack(M, { withSheets: false });
  rack.scale.setScalar(.55);
  rack.position.set(-.55, .99, -.4);
  g.add(rack);
  g.userData.dyeBowl = bowlA;
  g.userData.stock = stock;
  g.userData.rack = rack;
  // bucket at the far side
  addMesh(g, new THREE.CylinderGeometry(.13, .1, .3, 24, 1, true), M.woodDark, [-1.02, .15, .6]);
  const label = makeLabel(M, '贰 · 染料晾晒台', '染 纸 · 阴 干', .9);
  label.position.set(.25, 1.13, -.65); label.rotation.y = .08; g.add(label);
  g.add(makeStool(M, 1.03, 1.03, -.2));
  g.userData.collider = { x: 3.2, z: 2.15, hx: 1.35, hz: .84 };
  return g;
}

function buildPressBench(M) {
  const g = new THREE.Group();
  g.position.set(3.2, 0, -2.25);
  g.add(createBenchBase(M, { width: 2.35, depth: 1.32, dark: true }));
  benchRunner(M, g, 2.35, 1.32, .968);
  const press = buildPress(M);
  press.position.set(-.24, 1.0, -.02);
  g.add(press);
  const spool = buildThreadSpool(M); spool.position.set(.72, 1.025, -.35); g.add(spool);
  const wire = buildWireCoil(M); wire.position.set(.82, 1.005, .3); g.add(wire);
  const hammer = buildHammer(M); hammer.position.set(.65, 1.012, .5); hammer.rotation.y = -.35; g.add(hammer);
  hammer.visible = false;
  g.userData.press = press;
  g.userData.hammer = hammer;
  g.userData.pressWraps = press.userData.wraps || [];
  g.userData.pressPaper = press.userData.paperSleeve;
  g.userData.pressShaft = press.userData.shaft;
  g.userData.pressPlatform = press.userData.platform || press;
  // shallow trays of pressed petals and leaves
  for (let i = 0; i < 2; i++) {
    addMesh(g, roundedBoxGeometry(.38, .022, .3, .01), M.bambooWarm, [.74, .985, i ? .02 : -.78]);
    for (let k = 0; k < 4; k++) {
      const petal = new THREE.Mesh(new THREE.CircleGeometry(.038, 16, 0, Math.PI), i ? M.leaf : M.paperPink);
      petal.rotation.set(-Math.PI / 2, 0, k * .9);
      petal.position.set(.66 + (k % 2) * .07, .999, (i ? -.02 : -.82) + Math.floor(k / 2) * .07);
      g.add(petal);
    }
  }
  const label = makeLabel(M, '叁 · 压模工作台', '压 瓣 · 折 花', .9);
  label.position.set(-.62, 1.13, -.6); label.rotation.y = .1; g.add(label);
  g.add(makeStool(M, 1.0, 1.02, .2));
  g.userData.collider = { x: 3.2, z: -2.25, hx: 1.3, hz: .82 };
  return g;
}

export function buildWorkshop(scene, renderer, M) {
  const group = new THREE.Group();
  group.name = 'WarmWorkshop';
  scene.add(group);
  const colliders = [];
  const markers = [];
  const lanternLights = [];

  scene.environment = makeEnvironment(renderer);
  scene.environmentIntensity = 0.62;
  scene.background = new THREE.Color('#8c7257');
  scene.fog = new THREE.FogExp2('#7d654e', .028);

  // ---------- room shell ----------
  const floorTex = stoneTexture();
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, color: '#c6b6a1', roughness: .72, metalness: .02 });
  const floor = addMesh(group, new THREE.PlaneGeometry(11.6, 9.6), floorMat, [0, 0, 0], [-Math.PI / 2, 0, 0], false, true);
  const plasterTex = plasterTexture();
  const plasterMat = new THREE.MeshStandardMaterial({ map: plasterTex, color: '#e1d2b8', roughness: .95 });
  const wallNorth = addMesh(group, new THREE.PlaneGeometry(11.6, 3.8), plasterMat, [0, 1.9, -4.75], [0, 0, 0], false, true);
  const wallWest = addMesh(group, new THREE.PlaneGeometry(9.6, 3.8), plasterMat, [-5.75, 1.9, 0], [0, Math.PI / 2, 0], false, true);
  const wallEast = addMesh(group, new THREE.PlaneGeometry(9.6, 3.8), plasterMat, [5.75, 1.9, 0], [0, -Math.PI / 2, 0], false, true);
  const wallSouth = addMesh(group, new THREE.PlaneGeometry(11.6, 3.8), plasterMat, [0, 1.9, 4.75], [0, Math.PI, 0], false, true);
  const ceiling = addMesh(group, new THREE.PlaneGeometry(11.6, 9.6), new THREE.MeshStandardMaterial({ color: '#5f4833', roughness: .95 }), [0, 3.8, 0], [Math.PI / 2, 0, 0], false, true);
  // skirting & beams
  for (const [x, z, rot] of [[0, -4.73, 0], [0, 4.73, 0], [-5.72, 0, Math.PI / 2], [5.72, 0, Math.PI / 2]]) {
    addMesh(group, new THREE.BoxGeometry(11.4, .24, .08), M.woodDark, [x, .12, z], [0, rot, 0]);
  }
  for (const x of [-5.25, -2.2, .9, 3.9, 5.25]) {
    addMesh(group, new THREE.BoxGeometry(.2, 3.82, .2), M.woodDark, [x, 1.9, -4.64]);
    addMesh(group, new THREE.BoxGeometry(.16, .18, 9.4), M.woodDark, [x, 3.62, 0]);
  }
  addMesh(group, new THREE.BoxGeometry(11.5, .2, .22), M.woodDark, [0, 3.37, -4.62]);
  addMesh(group, new THREE.BoxGeometry(.22, .2, 9.5), M.woodDark, [-5.62, 3.4, 0]);
  addMesh(group, new THREE.BoxGeometry(.22, .2, 9.5), M.woodDark, [5.62, 3.4, 0]);

  // ceiling beams
  for (const z of [-3.2, 0, 3.2]) addMesh(group, new THREE.BoxGeometry(11.3, .2, .26), M.woodDark, [0, 3.68, z]);

  // central round rug
  const rugTex = clothTexture({ base: '#4e2b21', pattern: '#c19a67' });
  rugTex.repeat.set(1, 1);
  const rug = addMesh(group, new THREE.CircleGeometry(1.48, 64), new THREE.MeshStandardMaterial({ map: rugTex, color: '#a87b64', roughness: 1 }), [0, .006, -.7], [-Math.PI / 2, 0, 0], false, true);

  // ---------- north wall: windows & plaque ----------
  const sky = new THREE.MeshBasicMaterial({ map: skyTexture(), toneMapped: false });
  const latticeMat = new THREE.MeshBasicMaterial({ map: latticeTexture(), toneMapped: false });
  for (const x of [-3.05, 3.25]) {
    addMesh(group, new THREE.PlaneGeometry(2.5, 1.9), latticeMat, [x, 2.03, -4.71], [0, 0, 0], false, false);
    for (const [w, h, dx, dy] of [[2.68, .09, 0, .99], [2.68, .09, 0, -.99], [.09, 2.05, -1.29, 0], [.09, 2.05, 1.29, 0]]) {
      addMesh(group, new THREE.BoxGeometry(w, h, .08), M.woodDark, [x + dx, 2.03 + dy, -4.67]);
    }
    addMesh(group, new THREE.BoxGeometry(2.66, .06, .1), M.woodDark, [x, 2.03, -4.65]);
    addMesh(group, new THREE.BoxGeometry(.06, 2.08, .1), M.woodDark, [x, 2.03, -4.65]);
    // outer sky backing
    addMesh(group, new THREE.PlaneGeometry(2.55, 1.95), sky, [x, 2.03, -4.74], [0, 0, 0], false, false);
  }
  // plaque
  const plaqueTex = plaqueTexture('秦 淮 灯 作', '一 篾 一 纸 · 一 盏 心 灯');
  const plaque = addMesh(group, new THREE.PlaneGeometry(2.28, .71), new THREE.MeshBasicMaterial({ map: plaqueTex }), [.1, 3.02, -4.63], [0, 0, 0], false, false);
  addMesh(group, new THREE.BoxGeometry(2.42, .84, .065), M.woodDark, [.1, 3.02, -4.67]);
  addMesh(group, new THREE.BoxGeometry(2.3, .05, .1), M.brass, [.1, 3.44, -4.64]);

  // sideboard beneath plaque
  const sideboard = new THREE.Group();
  sideboard.position.set(.1, 0, -4.08);
  group.add(sideboard);
  addMesh(sideboard, roundedBoxGeometry(2.9, .78, .62, .02), M.woodDark, [0, .39, 0]);
  addMesh(sideboard, roundedBoxGeometry(2.98, .06, .68, .015), M.woodPolished, [0, .81, 0]);
  for (const x of [-1.2, 1.2]) addMesh(sideboard, new THREE.BoxGeometry(.12, .75, .5), M.woodDark, [x, .38, 0]);
  const urn = addMesh(sideboard, latheGeometry([[.001, 0], [.12, .004], [.16, .08], [.2, .3], [.17, .46], [.1, .5], [.09, .54], [.115, .56]], 32), M.ceramicCeladon, [-.92, .84, 0]);
  const plum = buildPlumBranch(M, { height: .8 });
  plum.position.set(-.92, 1.38, 0);
  plum.rotation.z = -.1;
  sideboard.add(plum);
  const burner = buildIncenseBurner(M); burner.position.set(.5, .85, .1); sideboard.add(burner);
  const tea = buildTeaSet(M); tea.position.set(1.0, .85, 0); tea.rotation.y = .4; sideboard.add(tea);
  colliders.push({ x: .1, z: -4.08, hx: 1.55, hz: .42 });

  // scroll on east wall
  const scrollTex = scrollTexture();
  const scroll = addMesh(group, new THREE.PlaneGeometry(1.05, 2.1), new THREE.MeshStandardMaterial({ map: scrollTex, roughness: .92 }), [5.64, 2.05, .2], [0, -Math.PI / 2, 0], false, true);
  addMesh(group, new THREE.CylinderGeometry(.028, .028, 1.2, 10), M.woodDark, [5.6, 3.16, .2], [0, 0, Math.PI / 2]);
  addMesh(group, new THREE.CylinderGeometry(.028, .028, 1.2, 10), M.woodDark, [5.6, .94, .2], [0, 0, Math.PI / 2]);

  // west wall shelves
  const shelf = new THREE.Group();
  shelf.position.set(-5.58, 0, -.2);
  shelf.rotation.y = Math.PI / 2;
  group.add(shelf);
  for (const y of [1.1, 1.62, 2.14]) {
    addMesh(shelf, new THREE.BoxGeometry(3.4, .06, .34), M.woodDark, [0, y, 0]);
    for (let i = 0; i < 7; i++) {
      const jar = addMesh(shelf, latheGeometry([[.001, 0], [.07, .003], [.085, .03], [.08, .12], [.055, .16], [.058, .18], [.045, .185]], 16), i % 3 ? M.ceramicCream : M.ceramicCeladon, [-1.4 + i * .42, y + .03, 0]);
      if (i % 2) {
        const lid = addMesh(shelf, new THREE.CylinderGeometry(.048, .05, .02, 16), M.woodDark, [-1.4 + i * .42, y + .21, 0]);
      }
    }
  }
  addMesh(shelf, new THREE.BoxGeometry(3.4, .08, .03), M.woodDark, [0, 1.35, .17]);
  // bamboo stock leaning
  for (let i = 0; i < 8; i++) {
    const pole = addMesh(shelf, new THREE.CylinderGeometry(.011, .013, 2.2, 8), M.bambooWarm, [1.42, 1.25, .14 + i * .018], [0, 0, -.05 - i * .006]);
  }

  // ---------- central display ----------
  const display = new THREE.Group();
  display.position.set(.05, 0, -3.35);
  group.add(display);
  addMesh(display, new THREE.CylinderGeometry(.46, .55, .07, 40), M.woodDark, [0, .035, 0]);
  addMesh(display, new THREE.CylinderGeometry(.08, .12, .82, 16), M.woodDark, [0, .46, 0]);
  addMesh(display, new THREE.CylinderGeometry(.31, .22, .05, 40), M.woodPolished, [0, .89, 0]);
  addMesh(display, new THREE.TorusGeometry(.3, .014, 6, 48), M.brass, [0, .915, 0], [Math.PI / 2, 0, 0]);
  const sampleLantern = buildLotusLantern(M, { scale: 1.6 });
  sampleLantern.position.set(0, .93, 0);
  sampleLantern.rotation.y = -.5;
  display.add(sampleLantern);
  const displayLight = new THREE.PointLight('#ffc078', 8, 4, 2);
  displayLight.position.set(0, 2.25, -.4);
  group.add(displayLight);
  colliders.push({ x: .05, z: -3.35, hx: .58, hz: .58 });

  // ---------- hanging lanterns ----------
  const hanging = buildLotusLantern(M, { scale: 1.05, detailed: false });
  hanging.position.set(2.7, 2.47, .7);
  hanging.rotation.y = .4;
  group.add(hanging);
  addMesh(group, new THREE.CylinderGeometry(.002, .002, .55, 6), M.woodDark, [2.7, 3.4, .7]);
  const hanging2 = buildLotusLantern(M, { scale: .85, detailed: false });
  hanging2.position.set(-2.55, 2.34, .2);
  hanging2.rotation.y = -.7;
  group.add(hanging2);
  addMesh(group, new THREE.CylinderGeometry(.002, .002, .7, 6), M.woodDark, [-2.55, 3.31, .2]);
  for (const [x, z, s] of [[2.7, .7, 1], [-2.55, .2, .85]]) {
    const light = new THREE.PointLight('#ffbf7a', 10, 4.8, 2);
    light.position.set(x, 2.62, z + .1);
    group.add(light);
    lanternLights.push(light);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffc784', transparent: true, opacity: .35, depthWrite: false, blending: THREE.AdditiveBlending }));
    sprite.position.set(x, 2.6, z + .1);
    sprite.scale.setScalar(1.8);
    group.add(sprite);
  }

  // pendant lamps above benches
  const shadeMat = new THREE.MeshStandardMaterial({ map: clothTexture({ base: '#6d3a2b', pattern: '#d3a56c' }), color: '#b58a6c', roughness: .95, side: THREE.DoubleSide });
  for (const [x, z] of [[-3.15, -2.25], [-3.15, 2.15], [3.2, 2.15], [3.2, -2.25]]) {
    const cord = addMesh(group, new THREE.CylinderGeometry(.003, .003, .7, 6), M.ink, [x, 3.3, z]);
    const shade = addMesh(group, new THREE.ConeGeometry(.23, .17, 28, 1, true), shadeMat, [x, 2.92, z]);
    const bulb = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffd49c', transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending }));
    bulb.position.set(x, 2.86, z); bulb.scale.setScalar(.65); group.add(bulb);
    const light = new THREE.PointLight('#ffcf95', 14, 4.4, 2);
    light.position.set(x, 2.72, z);
    group.add(light);
    lanternLights.push(light);
  }

  // ---------- benches ----------
  const bamboo = buildBambooBench(M);
  group.add(bamboo);
  colliders.push(bamboo.userData.collider);
  const assembly = buildAssemblyBench(M);
  group.add(assembly);
  colliders.push(assembly.userData.collider);
  const dye = buildDyeBench(M);
  group.add(dye);
  colliders.push(dye.userData.collider);
  const press = buildPressBench(M);
  group.add(press);
  colliders.push(press.userData.collider);

  const benchDefs = [
    { id: 'bamboo', name: '竹篾操作台', stage: '第一步 · 扎框子', group: bamboo, x: -3.15, z: -2.25, markY: 1.7, interact: V(-3.15, 0, -1.21), camera: V(-3.15, 1.9, -.55), look: V(-3.15, .98, -2.25), fov: 44, locked: false },
    { id: 'assembly', name: '合成台', stage: '第一步 · 合框', group: assembly, x: -3.15, z: 2.15, markY: 1.7, interact: V(-3.15, 0, 3.0), camera: V(-3.15, 2.08, 3.5), look: V(-3.15, 1.1, 2.12), fov: 46, locked: true },
    { id: 'dye', name: '染料晾晒台', stage: '第三步 · 制作花瓣', group: dye, x: 3.2, z: 2.15, markY: 1.7, interact: V(3.2, 0, 3.0), camera: V(3.3, 2.5, 4.2), look: V(3.04, 1.15, 2.1), fov: 48, locked: true },
    { id: 'press', name: '压模工作台', stage: '第三步 · 制作花瓣', group: press, x: 3.2, z: -2.25, markY: 1.7, interact: V(3.2, 0, -1.21), camera: V(2.98, 1.88, -1.1), look: V(3.18, 1.08, -2.28), fov: 42, locked: true }
  ];
  const markerTex = diamondTexture();
  for (const bench of benchDefs) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, transparent: true, opacity: .56, depthWrite: false, depthTest: true }));
    sprite.position.set(bench.x, bench.markY, bench.interact.z + .06);
    sprite.scale.setScalar(.2);
    group.add(sprite);
    bench.marker = sprite;
    markers.push(sprite);
  }

  // ---------- props & carpets ----------
  const rug2 = addMesh(group, new THREE.CircleGeometry(.95, 48), new THREE.MeshStandardMaterial({ map: linenTexture({ tint: '#b9a280' }), color: '#a58f72', roughness: 1 }), [-3.1, .005, 1.45], [-Math.PI / 2, 0, 0], false, true);
  // baskets along the west wall
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Group();
    b.position.set(-4.9, 0, 3.3 - i * .55);
    group.add(b);
    addMesh(b, new THREE.CylinderGeometry(.24, .19, .34, 22, 1, true), M.bambooWarm, [0, .17, 0]);
    addMesh(b, new THREE.CircleGeometry(.19, 22), M.bambooWarm, [0, .01, 0], [-Math.PI / 2, 0, 0]);
    for (let k = 0; k < 5; k++) {
      const p = addMesh(b, new THREE.PlaneGeometry(.2, .26), k % 2 ? M.paper : M.paperPink, [0, .36 + k * .004, 0], [-Math.PI / 2, 0, k * .6]);
    }
    colliders.push({ x: -4.9, z: 3.3 - i * .55, hx: .3, hz: .3 });
  }
  // paper stacks & jars along the north wall
  for (const [x, z, pink] of [[-1.9, -4.3, false], [-1.55, -4.3, true], [1.65, -4.28, false]]) {
    const p = buildPaperPile(M, { count: 8, width: .3, height: .4, pink });
    p.position.set(x, .78, z);
    p.rotation.y = (Math.random() - .5) * .2;
    group.add(p);
  }
  const lowTable = new THREE.Group();
  lowTable.position.set(4.35, 0, -.25);
  group.add(lowTable);
  addMesh(lowTable, roundedBoxGeometry(1.0, .12, .55, .02), M.wood, [0, .55, 0]);
  for (const x of [-.38, .38]) addMesh(lowTable, new THREE.BoxGeometry(.08, .52, .42), M.woodDark, [x, .28, 0]);
  const vase = addMesh(lowTable, latheGeometry([[.001, 0], [.1, .005], [.14, .06], [.135, .24], [.08, .35], [.07, .4], [.085, .42]], 24), M.ceramicCream, [.24, .61, 0]);
  const plum2 = buildPlumBranch(M, { height: .62, seedOffset: 2 });
  plum2.position.set(.24, 1.01, 0);
  plum2.rotation.z = .2;
  lowTable.add(plum2);
  colliders.push({ x: 4.35, z: -.25, hx: .52, hz: .3 });

  // light shaft planes from north windows
  const shaftCanvas = document.createElement('canvas');
  shaftCanvas.width = 64; shaftCanvas.height = 256;
  const sctx = shaftCanvas.getContext('2d');
  const sgrad = sctx.createLinearGradient(0, 0, 0, 256);
  sgrad.addColorStop(0, 'rgba(255,233,190,.36)'); sgrad.addColorStop(.55, 'rgba(255,221,167,.12)'); sgrad.addColorStop(1, 'rgba(255,214,150,0)');
  sctx.fillStyle = sgrad; sctx.fillRect(0, 0, 64, 256);
  sctx.globalCompositeOperation = 'destination-in';
  const hgrad = sctx.createLinearGradient(0, 0, 64, 0);
  hgrad.addColorStop(0, 'rgba(0,0,0,0)'); hgrad.addColorStop(.32, 'rgba(0,0,0,.85)'); hgrad.addColorStop(.5, 'rgba(0,0,0,1)'); hgrad.addColorStop(.68, 'rgba(0,0,0,.85)'); hgrad.addColorStop(1, 'rgba(0,0,0,0)');
  sctx.fillStyle = hgrad; sctx.fillRect(0, 0, 64, 256);
  const shaftTex = new THREE.CanvasTexture(shaftCanvas);
  const shaftMat = new THREE.MeshBasicMaterial({ map: shaftTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .32, side: THREE.DoubleSide, toneMapped: false });
  for (const x of [-3.05, 3.25]) {
    const shaft = addMesh(group, new THREE.PlaneGeometry(1.05, 3.0), shaftMat, [x + .15, 2.28, -3.24], [.46, 0, 0], false, false);
    shaft.rotation.z = .1;
  }

  // contact shadows under benches
  const shadowTex = radialShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: .38, depthWrite: false });
  for (const [x, z, sx, sz] of [[-3.15, -2.25, 3.0, 2.0], [-3.15, 2.15, 3.15, 2.3], [3.2, 2.15, 2.9, 2.0], [3.2, -2.25, 2.8, 2.0], [.05, -3.35, 1.4, 1.3]]) {
    addMesh(group, new THREE.PlaneGeometry(sx, sz), shadowMat, [x, .012, z], [-Math.PI / 2, 0, 0], false, false);
  }

  // dust
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = [];
  for (let i = 0; i < 260; i++) {
    dustPos.push((Math.random() - .5) * 10, .35 + Math.random() * 3, (Math.random() - .5) * 8);
  }
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ map: dustTexture(), color: '#ffe4b4', size: .016, transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(dust);

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight('#ffe9ce', '#3f2c1e', .85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#ffd6a1', 3.0);
  sun.position.set(-3.5, 6.2, 4.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -7; sun.shadow.camera.right = 7;
  sun.shadow.camera.top = 7; sun.shadow.camera.bottom = -7;
  sun.shadow.camera.near = .5; sun.shadow.camera.far = 22;
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .02;
  scene.add(sun);
  const windowLight = new THREE.DirectionalLight('#ffe3b5', 1.0);
  windowLight.position.set(-1, 3.8, -5);
  scene.add(windowLight);
  const fill = new THREE.DirectionalLight('#bfd2d2', .4);
  fill.position.set(5, 3, -2);
  scene.add(fill);
  const ambient = new THREE.AmbientLight('#ffe2bb', .18);
  scene.add(ambient);

  // colliders for walls
  const bounds = { minX: -5.4, maxX: 5.4, minZ: -4.35, maxZ: 4.35 };

  function update(dt, elapsed, playerPos) {
    dust.rotation.y = Math.sin(elapsed * .02) * .02;
    const pos = dustGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + Math.sin(elapsed * .22 + i) * .0006 + .0009 * dt;
      if (y > 3.55) y = .3;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    for (let i = 0; i < lanternLights.length; i++) {
      lanternLights[i].intensity = (i < 2 ? 10 : 14) * (0.94 + Math.sin(elapsed * 2.1 + i * 1.7) * .035);
    }
    for (const bench of benchDefs) {
      const d = playerPos ? Math.hypot(playerPos.x - bench.interact.x, playerPos.z - bench.interact.z) : 99;
      const near = d < 1.7;
      bench.marker.material.opacity = near ? .95 : .32;
      bench.marker.position.y = bench.markY + Math.sin(elapsed * 1.6 + bench.x) * .02;
      const s = near ? .24 : .16;
      bench.marker.scale.setScalar(s);
    }
    return benchDefs;
  }

  return {
    group, colliders, benches: benchDefs, update, bounds, sampleLantern,
    ambientLights: { hemi, sun, windowLight, fill, ambient }
  };
}
