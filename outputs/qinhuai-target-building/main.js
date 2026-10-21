import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color('#d7d9d3');
scene.fog = new THREE.Fog('#d7d9d3', 54, 105);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 180);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.querySelector('#viewport').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.minDistance = 17;
controls.maxDistance = 72;
controls.maxPolarAngle = Math.PI * 0.48;
controls.target.set(0, 2.5, 0);

const model = new THREE.Group();
model.name = '塔对面1_建筑复刻';
scene.add(model);

const colors = {
  wall: '#d9d8ca',
  wallLight: '#e7e5d9',
  stone: '#8d918e',
  stoneLight: '#b8b9ae',
  roof: '#343b3c',
  roofLight: '#4e5655',
  roofEdge: '#252d2d',
  wood: '#403c34',
  woodWarm: '#5b4b3d',
  window: '#202928',
  floor: '#c4c4b9',
  ground: '#babbb3'
};
const material = (color, options = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.86, ...options });
const mats = {
  wall: material(colors.wall), wallLight: material(colors.wallLight), stone: material(colors.stone), stoneLight: material(colors.stoneLight),
  roof: material(colors.roof, { roughness: 0.96, side: THREE.DoubleSide }), roofLight: material(colors.roofLight), roofEdge: material(colors.roofEdge),
  wood: material(colors.wood), woodWarm: material(colors.woodWarm), window: material(colors.window, { roughness: 0.72 }),
  floor: material(colors.floor), ground: material(colors.ground)
};

function box(parent, mat, x, y, z, w, h, d, rotY = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.y = rotY;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function hipRoof(parent, { x, y, z, w, d, rise = 1.8, overhang = 0.55, label = '' }) {
  const hw = w / 2 + overhang;
  const hd = d / 2 + overhang;
  const ridgeInset = Math.min(1.35, hd * 0.34);
  const yEave = y;
  const yRidge = y + rise;
  const p = [
    [-hw, yEave, -hd], [0, yRidge, -hd + ridgeInset], [0, yRidge, hd - ridgeInset], [-hw, yEave, hd],
    [hw, yEave, -hd], [hw, yEave, hd]
  ];
  const faces = [
    [0, 1, 2, 3], [4, 5, 2, 1],
    [0, 4, 1], [3, 2, 5],
  ];
  const positions = [];
  for (const face of faces) {
    if (face.length === 3) {
      for (const index of face) positions.push(...p[index]);
    } else {
      for (const index of [face[0], face[1], face[2], face[0], face[2], face[3]]) positions.push(...p[index]);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  const roof = new THREE.Mesh(geometry, mats.roof);
  roof.position.set(x, 0, z);
  roof.castShadow = true;
  roof.receiveShadow = true;
  roof.name = label ? `${label}_瓦屋面` : '瓦屋面';
  parent.add(roof);

  const angle = Math.atan2(rise, hw);
  for (const side of [-1, 1]) {
    for (let i = 1; i <= 8; i++) {
      const u = i / 9;
      const px = side * hw * u;
      const py = yEave + rise * (1 - u) + 0.045;
      const tile = box(parent, mats.roofLight, x + px, py, z, 0.12, 0.055, d - ridgeInset * 1.5, 0);
      tile.rotation.z = -side * angle;
      tile.name = label ? `${label}_瓦垄_${i}` : '瓦垄';
    }
    box(parent, mats.roofEdge, x + side * hw, yEave - 0.06, z, 0.18, 0.22, d + overhang * 1.35);
  }
  box(parent, mats.roofEdge, x, yRidge + 0.06, z, 0.42, 0.18, d - ridgeInset * 1.55);
  box(parent, mats.roofEdge, x, yRidge + 0.02, z - (d - ridgeInset * 1.55) / 2, 0.52, 0.18, 0.22);
  box(parent, mats.roofEdge, x, yRidge + 0.02, z + (d - ridgeInset * 1.55) / 2, 0.52, 0.18, 0.22);
  return { yEave, yRidge, hw, hd };
}

function windowPanel(parent, x, y, z, w, h, side = 1) {
  box(parent, mats.window, x, y, z, w, h, 0.07);
  box(parent, mats.wood, x - w * 0.5, y, z + side * 0.055, 0.09, h + 0.14, 0.08);
  box(parent, mats.wood, x + w * 0.5, y, z + side * 0.055, 0.09, h + 0.14, 0.08);
  box(parent, mats.wood, x, y - h * 0.5, z + side * 0.055, w + 0.08, 0.09, 0.08);
  box(parent, mats.wood, x, y + h * 0.5, z + side * 0.055, w + 0.08, 0.09, 0.08);
  box(parent, mats.woodWarm, x, y, z + side * 0.065, 0.045, h, 0.045);
}

function facade(parent, { x, z, w, d, h, side = 1, door = false, windows = 3 }) {
  const faceZ = z + side * (d / 2 + 0.04);
  const span = w / Math.max(1, windows);
  box(parent, mats.wood, x, h + 0.22, faceZ, w + 0.25, 0.15, 0.13);
  for (let i = 0; i < windows; i++) {
    const px = x - w / 2 + span * (i + 0.5);
    if (door && i === Math.floor(windows / 2)) {
      box(parent, mats.woodWarm, px, 1.08, faceZ + side * 0.03, Math.min(1.35, span * 0.7), 2.0, 0.10);
      box(parent, mats.wood, px, 2.1, faceZ + side * 0.09, Math.min(1.5, span * 0.8), 0.09, 0.12);
      continue;
    }
    windowPanel(parent, px, Math.max(1.5, h * 0.48), faceZ + side * 0.035, Math.min(1.25, span * 0.65), Math.min(1.3, h * 0.42), side);
  }
}

function building({ id, x, z, w, d, h, roofRise = 1.55, front = 1, door = false, windows = 3, warm = false }) {
  const group = new THREE.Group();
  group.name = id;
  model.add(group);
  box(group, mats.stone, x, 0.16, z, w + 0.3, 0.32, d + 0.3);
  box(group, warm ? mats.wallLight : mats.wall, x, h / 2 + 0.32, z, w, h, d);
  box(group, mats.stoneLight, x, 0.48, z, w + 0.04, 0.18, d + 0.04);
  facade(group, { x, z, w, d, h, side: front, door, windows });
  hipRoof(group, { x, y: h + 0.37, z, w, d, rise: roofRise, label: id });
  return group;
}

function wallSegment({ id, x, z, w, d = 0.38, h = 2.25, cap = true }) {
  const group = new THREE.Group();
  group.name = id;
  model.add(group);
  box(group, mats.stone, x, 0.2, z, w + 0.2, 0.4, d + 0.15);
  box(group, mats.wall, x, h / 2 + 0.4, z, w, h, d);
  if (cap) box(group, mats.roofEdge, x, h + 0.52, z, w + 0.25, 0.18, d + 0.22);
  return group;
}

function steppedBoundary() {
  wallSegment({ id: '前院墙_西段', x: -10.7, z: 10.35, w: 7.2, h: 2.0 });
  wallSegment({ id: '前院墙_东段', x: 9.7, z: 10.35, w: 7.3, h: 2.0 });
  wallSegment({ id: '左侧马头墙_前段', x: -14.1, z: 4.2, w: 0.48, d: 7.6, h: 3.35 });
  wallSegment({ id: '左侧马头墙_后段', x: -14.1, z: -4.8, w: 0.48, d: 6.1, h: 4.0 });
  wallSegment({ id: '右侧马头墙_前段', x: 14.1, z: 4.3, w: 0.48, d: 7.0, h: 3.0 });
  wallSegment({ id: '右侧马头墙_后段', x: 14.1, z: -4.4, w: 0.48, d: 6.4, h: 3.55 });
  box(model, mats.roofEdge, -14.1, 4.2, 0.2, 0.56, 0.16, 13.2);
  box(model, mats.roofEdge, 14.1, 4.3, 0.2, 0.56, 0.16, 12.8);
}

function courtyard() {
  box(model, mats.floor, 0, 0.05, 5.0, 15.8, 0.1, 7.6);
  for (let x = -7.5; x <= 7.5; x += 2.2) box(model, mats.stoneLight, x, 0.108, 5, 0.025, 0.018, 7.4);
  for (let z = 1.4; z <= 8.6; z += 1.9) box(model, mats.stoneLight, 0, 0.109, z, 15.6, 0.018, 0.025);
}

function buildArchitecture() {
  courtyard();
  // The large rear roof and the staggered side roofs follow the silhouette visible in the aerial references.
  building({ id: '后排主厅', x: -0.8, z: -4.0, w: 21.0, d: 6.6, h: 4.1, roofRise: 2.15, front: 1, door: true, windows: 5 });
  building({ id: '后排东侧高房', x: 9.9, z: -4.0, w: 5.0, d: 5.0, h: 4.65, roofRise: 2.0, front: 1, windows: 2, warm: true });
  building({ id: '左侧纵向厢房', x: -10.0, z: 1.9, w: 5.4, d: 10.7, h: 3.2, roofRise: 1.75, front: 1, windows: 2 });
  building({ id: '右侧纵向厢房', x: 9.6, z: 1.7, w: 5.0, d: 8.8, h: 3.15, roofRise: 1.65, front: 1, windows: 2 });
  building({ id: '中庭南厅', x: -1.2, z: 2.8, w: 16.0, d: 4.7, h: 3.0, roofRise: 1.55, front: 1, door: true, windows: 4 });
  building({ id: '前排低厅', x: -1.9, z: 8.45, w: 13.6, d: 4.1, h: 2.65, roofRise: 1.4, front: 1, door: true, windows: 4, warm: true });
  building({ id: '左后小厅', x: -10.1, z: -5.4, w: 5.2, d: 4.8, h: 3.55, roofRise: 1.7, front: 1, windows: 2 });
  steppedBoundary();
  const site = box(model, mats.ground, 0, -0.08, 0, 34, 0.12, 27);
  site.name = '仅用于投影的中性基底';
  site.receiveShadow = true;
  model.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
}
buildArchitecture();

const ambient = new THREE.HemisphereLight('#f4f1e6', '#6d746c', 2.3);
scene.add(ambient);
const sun = new THREE.DirectionalLight('#fff3d8', 4.2);
sun.position.set(-22, 32, 24);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -32; sun.shadow.camera.right = 32; sun.shadow.camera.top = 32; sun.shadow.camera.bottom = -32;
scene.add(sun);
const fill = new THREE.DirectionalLight('#c5d8dc', 1.1);
fill.position.set(25, 14, -22);
scene.add(fill);

const views = {
  main: { position: [29, 23, 30], target: [0, 3.1, 0] },
  top: { position: [0, 39, 0.1], target: [0, 0, 0] },
  rear: { position: [-28, 18, -28], target: [0, 3, -1] },
  front: { position: [0, 14, 34], target: [0, 3, 2] }
};
function applyView(name) {
  const view = views[name];
  camera.position.set(...view.position);
  controls.target.set(...view.target);
  controls.update();
  document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === name)));
}
applyView('main');

let wire = false;
function setWire(value) {
  wire = value;
  model.traverse(obj => {
    if (obj.isMesh && obj.material && 'wireframe' in obj.material) obj.material.wireframe = wire;
  });
  document.querySelector('#wire').setAttribute('aria-pressed', String(wire));
}
function setCount() {
  const meshes = [];
  model.traverse(obj => { if (obj.isMesh) meshes.push(obj); });
  document.querySelector('#building-count').textContent = '07';
  document.querySelector('#mesh-count').textContent = String(meshes.length).padStart(2, '0');
}
setCount();

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => applyView(button.dataset.view)));
document.querySelector('#wire').addEventListener('click', () => setWire(!wire));
document.querySelector('#reset').addEventListener('click', () => { setWire(false); applyView('main'); });

document.querySelectorAll('[data-ref]').forEach(button => button.addEventListener('click', () => {
  const note = document.querySelector('#ref-note');
  note.textContent = button.dataset.ref === 'aerial' ? '俯视图：确认屋脊的前后错落、内院开口与连体墙线。' : button.dataset.ref === 'wire' ? '线框图：确认主体轮廓由前厅、后排主厅和两侧纵向厢房组成。' : '街景图：确认白灰墙面、深灰瓦面、黑色木构檐口的材质关系。';
  document.querySelectorAll('[data-ref]').forEach(item => item.classList.toggle('active', item === button));
}));

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}
addEventListener('resize', resize);
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

