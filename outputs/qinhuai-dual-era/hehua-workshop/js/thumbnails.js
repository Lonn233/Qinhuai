import * as THREE from 'three';
import {
  buildBambooStrip, buildHoop, buildTwistCoil, buildWireBracket, buildFrameModel
} from './models.js';
import { flatStripGeometry, applyStripUV, curveFromPoints } from './geometry.js';

import { FRAME, SMALL_STRIP_LENGTH } from './frame-profile.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;

function environment(renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#3f3024');
  grad.addColorStop(.42, '#a98258');
  grad.addColorStop(.58, '#f4dcb4');
  grad.addColorStop(.72, '#8f6743');
  grad.addColorStop(1, '#2b1d14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);
  const glow = ctx.createRadialGradient(176, 62, 2, 176, 62, 56);
  glow.addColorStop(0, 'rgba(255,244,214,1)');
  glow.addColorStop(.5, 'rgba(255,219,164,.65)');
  glow.addColorStop(1, 'rgba(255,205,140,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(100, 0, 152, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  tex.dispose();
  pmrem.dispose();
  return env;
}

function curvedStrip(M) {
  const points = [];
  const span = 4.2;
  for (let i = 0; i <= 32; i++) {
    const a = -span / 2 + span * i / 32;
    points.push(V(Math.cos(a) * .082, 0, Math.sin(a) * .082));
  }
  const geo = flatStripGeometry(points, .016, .003, false, 3.4);
  applyStripUV(geo, .3, .016);
  return new THREE.Mesh(geo, M.bamboo);
}

function buildItems(M) {
  const strip40 = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const s = buildBambooStrip(M, { length: .40, width: .014, thickness: .0028 });
    s.position.set(0, (i - 1) * .015, (i - 1) * .005);
    s.rotation.y = i * .025;
    strip40.add(s);
  }

  const twist = buildTwistCoil(M, 1.25);
  const wire = buildWireBracket(M);

  return {
    twist,
    wire,
    longBamboo: buildBambooStrip(M, { length: .62, width: .018, thickness: .003, marks: false }),
    arcBamboo: strip40,
    smallBamboo: buildBambooStrip(M, { length: SMALL_STRIP_LENGTH, width: .0095, thickness: .0028 }),
    bigHoop: buildHoop(M, { radius: FRAME.bigRadius, width: .0085, thickness: .0032 }),
    smallHoop: buildHoop(M, { radius: FRAME.smallRadius, width: .0075, thickness: .0026 }),
    frame: buildFrameModel(M)
  };
}

export function createItemThumbnails(M) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: true, preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
  } catch (error) {
    console.warn('物品栏缩略图渲染不可用，使用备用图标。', error);
    return {};
  }

  const size = 256;
  renderer.setPixelRatio(1);
  renderer.setSize(size, size, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  const env = environment(renderer);
  scene.environment = env;

  scene.add(new THREE.HemisphereLight(0xffefd6, 0x2b1d14, 1.35));
  const key = new THREE.DirectionalLight(0xffe3ba, 2.6);
  key.position.set(2.2, 3.2, 2.4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdbe7ec, .9);
  fill.position.set(-2.4, 1.6, 2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffc68a, 1.8);
  rim.position.set(-1.2, 2, -2.6);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(26, 1, .01, 20);
  camera.position.set(.95, 1.0, 1.9).normalize().multiplyScalar(2.7);
  camera.lookAt(0, 0, 0);

  const icons = {};
  const models = buildItems(M);
  const viewDir = camera.position.clone().normalize();
  const faceQ = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), viewDir);
  const rollQ = new THREE.Quaternion().setFromAxisAngle(viewDir, -.62);
  const stripQ = rollQ.clone().multiply(faceQ);

  for (const [keyName, model] of Object.entries(models)) {
    const holder = new THREE.Group();
    const group = new THREE.Group();
    group.add(model);
    if (keyName === 'longBamboo' || keyName === 'arcBamboo' || keyName === 'smallBamboo') {
      group.quaternion.copy(stripQ);
    } else {
      group.rotation.y = keyName === 'frame' ? .32 : .42;
      if (keyName === 'frame') group.rotation.z = -.03;
    }
    holder.add(group);
    holder.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(holder);
    const sizeV = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);
    holder.updateMatrixWorld(true);

    const half = Math.max(sizeV.x, sizeV.y, sizeV.z) * .5;
    // Use one scale for all raw bamboo, so icons retain their true length ratio.
    const isBamboo = ['longBamboo','arcBamboo','smallBamboo'].includes(keyName);
    const isHoop = keyName === 'bigHoop' || keyName === 'smallHoop';
    const fit = isBamboo ? .86 / .62 : isHoop ? .43 / (FRAME.bigRadius + .012) : .43 / Math.max(.0001, half);
    holder.scale.setScalar(fit);

    scene.add(holder);
    renderer.render(scene, camera);
    icons[keyName] = renderer.domElement.toDataURL('image/png');
    scene.remove(holder);

    holder.traverse(child => {
      if (child.geometry) child.geometry.dispose();
    });
  }

  scene.environment = null;
  env.dispose();
  renderer.dispose();
  renderer.forceContextLoss();

  return icons;
}
