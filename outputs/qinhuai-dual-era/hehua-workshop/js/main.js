import * as THREE from 'three';
import { createMaterials } from './materials.js';
import { buildWorkshop } from './world.js';
import { createBambooStage } from './frame.js';
import { createAssemblyStage } from './assembly.js';
import { createPastingStage } from './pasting.js';
import { createPetalsStage } from './petals.js';
import { createItemThumbnails } from './thumbnails.js';
import { createAudio } from './audio.js';
import { createUI } from './ui.js';

const BASE_FOV = 58;
const EYE_HEIGHT = 1.64;
const ENTRY = new THREE.Vector3(.55, EYE_HEIGHT, 3.7);
const ENTRY_YAW = .18;
const ENTRY_PITCH = -.05;

const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, powerPreference: 'high-performance'
  });
} catch (error) {
  const loading = document.getElementById('loading');
  if (loading) loading.querySelector('p').textContent = '此浏览器无法点亮灯坊 · 请开启 WebGL';
  throw error;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.04;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(BASE_FOV, window.innerWidth / window.innerHeight, .05, 60);
camera.rotation.order = 'YXZ';

const materials = createMaterials();
const world = buildWorkshop(scene, renderer, materials);
const bambooBench = world.benches.find(bench => bench.id === 'bamboo');
const assemblyBench = world.benches.find(bench => bench.id === 'assembly');
const dyeBench = world.benches.find(bench => bench.id === 'dye');
const pressBench = world.benches.find(bench => bench.id === 'press');
const audio = createAudio();

const INITIAL_INVENTORY = {
  twist: 11, wire: 1,
  longBamboo: 0, arcBamboo: 0, smallBamboo: 0,
  bigHoop: 0, smallHoop: 0,
  frame: 0, pastedFrame: 0,
  nonwoven: 0, lining: 0,
  paper: 0, wetPaper: 0, dyedPaper: 0, pressedPaper: 0, copper: 0, petal: 0
};
const inventory = { ...INITIAL_INVENTORY };

function resetInventory() {
  Object.assign(inventory, INITIAL_INVENTORY);
}

let thumbnails = {};
try {
  thumbnails = createItemThumbnails(materials);
} catch (error) {
  console.warn('物品缩略图生成失败，已启用备用图标。', error);
}

const player = {
  pos: ENTRY.clone(),
  yaw: ENTRY_YAW,
  pitch: ENTRY_PITCH,
  velocity: new THREE.Vector2(),
  bobPhase: 0
};

let ui = null;
let stage = null;
let bambooStage = null;
let assemblyStage = null;
let pastingStage = null;
let petalsStage = null;
let phase = Number(new URLSearchParams(location.search).get('stage') || 1);
let started = false;
let activeBench = null;
let transition = null;
let camTween = null;
let assemblyCameraRaised = false;
let nearBench = null;
let lastNear = null;
let lastActive = null;
let lookDrag = null;
let lastWheel = 0;
const keys = new Set();

const easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function quatFromAngles(yaw, pitch) {
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
}

const LOOK_UP = new THREE.Vector3(0, 1, 0);
function quatLookingAt(position, look) {
  return new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().lookAt(position, look, LOOK_UP)
  );
}

function applyPlayerCamera() {
  camera.position.copy(player.pos);
  camera.position.y += Math.sin(player.bobPhase) * .012;
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
}

function startCameraTween({ position, quaternion, fov, duration, onDone }) {
  camTween = {
    fromPos: camera.position.clone(),
    toPos: position.clone(),
    fromQuat: camera.quaternion.clone(),
    toQuat: quaternion.clone(),
    fromFov: camera.fov,
    toFov: fov,
    duration: Math.max(.001, duration),
    t: 0,
    onDone
  };
}

function updateCameraTween(dt) {
  if (!camTween) return;
  camTween.t += dt;
  const k = easeInOut(Math.min(1, camTween.t / camTween.duration));
  camera.position.lerpVectors(camTween.fromPos, camTween.toPos, k);
  camera.quaternion.slerpQuaternions(camTween.fromQuat, camTween.toQuat, k);
  camera.fov = camTween.fromFov + (camTween.toFov - camTween.fromFov) * k;
  camera.updateProjectionMatrix();
  if (k >= 1) {
    const done = camTween.onDone;
    camTween = null;
    done?.();
  }
}

function stageForBench(bench) {
  if (bench === bambooBench) return bambooStage;
  if (bench === assemblyBench) return phase === 1 ? assemblyStage : pastingStage;
  if (bench === dyeBench || bench === pressBench) return petalsStage;
  return null;
}

function benchCameraFov(bench) {
  if (![assemblyBench, dyeBench].includes(bench) || camera.aspect >= 1) return bench.fov;
  // Keep the enlarged frame's horizontal viewing space on portrait screens.
  return THREE.MathUtils.radToDeg(2 * Math.atan(
    Math.tan(THREE.MathUtils.degToRad(bench.fov) / 2) / camera.aspect
  ));
}

function benchCameraLook(bench, state = stageForBench(bench)?.snapshot()) {
  const look = bench.look.clone();
  if (bench === assemblyBench && ['assembleWire', 'done'].includes(state?.mode)) look.y = 1.4;
  return look;
}

function syncAssemblyLock() {
  if (!assemblyBench) return;
  const partsReady = inventory.longBamboo >= 1
    && inventory.arcBamboo >= 3
    && inventory.smallBamboo >= 1;
  const shouldLock = phase === 1 ? !(partsReady || assemblyStage?.engaged) : phase > 2;
  if (assemblyBench.locked === shouldLock) return;
  assemblyBench.locked = shouldLock;
  if (lastNear === assemblyBench && !activeBench) ui?.setNear(assemblyBench, false);
}

function syncPhaseLocks() {
  if (dyeBench) dyeBench.locked = phase < 3;
  if (pressBench) pressBench.locked = phase < 3;
  syncAssemblyLock();
}

function handleStageState(state) {
  if (state.phase === 2 && !state.done && phase === 3) { phase = 2; syncPhaseLocks(); }
  syncAssemblyLock();
  if (activeBench && state.benchId === activeBench.id) {
      ui.update(state);
    if (activeBench === assemblyBench && !transition) {
      const raised = ['assembleWire', 'done'].includes(state.mode);
      if (raised !== assemblyCameraRaised) {
        assemblyCameraRaised = raised;
        startCameraTween({
          position: assemblyBench.camera,
          quaternion: quatLookingAt(assemblyBench.camera, benchCameraLook(assemblyBench, state)),
          fov: benchCameraFov(assemblyBench),
          duration: .55
        });
      }
    }
  }
}

function prepareParts() {
  inventory.longBamboo = 1;
  inventory.arcBamboo = 3;
  inventory.smallBamboo = 1;
  syncAssemblyLock();
  return { ...inventory };
}

function openBenchById(id, instant = false) {
  if (!started || activeBench || transition) return false;
  const bench = world.benches.find(item => item.id === id);
  if (!bench || bench.locked) return false;
  player.pos.set(bench.interact.x, EYE_HEIGHT, bench.interact.z + .25);
  player.yaw = 0;
  player.pitch = -.08;
  if (!instant) {
    enterBench(bench);
    return true;
  }
  activeBench = bench;
  if (bench.marker) bench.marker.visible = false;
  stage = stageForBench(bench);
  stage?.setBench?.(bench);
  assemblyCameraRaised = bench === assemblyBench && ['assembleWire', 'done'].includes(stage.snapshot().mode);
  camera.position.copy(bench.camera);
  camera.quaternion.copy(quatLookingAt(bench.camera, benchCameraLook(bench)));
  camera.fov = benchCameraFov(bench);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  ui.setNear(bench, true);
  stage?.open?.(bench);
  ui.update(stage.snapshot());
  return true;
}

function enterBench(bench, onOpened) {
  if (!started || !bench || activeBench || transition) return;
  if (bench.locked) {
    ui.showLocked(bench);
    return;
  }
  activeBench = bench;
  if (bench.marker) bench.marker.visible = false;
  player.velocity.set(0, 0);
  keys.clear();
  transition = 'enter';
  ui.setBend(null);
  ui.setNear(bench, true);
  audio.soft?.();
  assemblyCameraRaised = bench === assemblyBench && ['assembleWire', 'done'].includes(stageForBench(bench)?.snapshot().mode);
  startCameraTween({
    position: bench.camera,
    quaternion: quatLookingAt(bench.camera, benchCameraLook(bench)),
    fov: benchCameraFov(bench),
    duration: 1.08,
    onDone: () => {
      transition = null;
      stage = stageForBench(bench);
      stage?.setBench?.(bench);
      stage?.open?.(bench);
      if (stage) ui.update(stage.snapshot());
      onOpened?.();
    }
  });
}

function leaveBench() {
  if (!activeBench || transition) return;
  const bench = activeBench;
  stage.close();
  ui.update(stage.snapshot());
  player.velocity.set(0, 0);
  keys.clear();
  transition = 'leave';
  startCameraTween({
    position: player.pos,
    quaternion: quatFromAngles(player.yaw, player.pitch),
    fov: BASE_FOV,
    duration: .92,
    onDone: () => {
      transition = null;
      activeBench = null;
      if (bench.marker) bench.marker.visible = true;
      lastActive = null;
      lastNear = null;
      ui.setBend(null);
      ui.setNear(null, false);
      refreshNear();
    }
  });
}

function goToEntrance() {
  if (!started || transition) return;
  ui.closeDialogs();
  if (activeBench) {
    stage.close();
    if (activeBench.marker) activeBench.marker.visible = true;
  }
  activeBench = null;
  transition = 'entrance';
  player.pos.copy(ENTRY);
  player.yaw = ENTRY_YAW;
  player.pitch = ENTRY_PITCH;
  player.velocity.set(0, 0);
  keys.clear();
  startCameraTween({
    position: ENTRY,
    quaternion: quatFromAngles(player.yaw, player.pitch),
    fov: BASE_FOV,
    duration: 1.15,
    onDone: () => {
      transition = null;
      lastActive = null;
      lastNear = null;
      nearBench = null;
      ui.setNear(null, false);
      ui.toast('已回到门厅 · 暮色正好');
    }
  });
}

function restartAtBamboo(message, kind = '') {
  resetInventory();
  bambooStage.reset();
  assemblyStage.reset();
  syncAssemblyLock();
  if (activeBench === bambooBench) {
    ui.toast(message, kind);
    return;
  }
  if (activeBench) {
    stage?.close();
    if (activeBench.marker) activeBench.marker.visible = true;
  }
  activeBench = null;
  transition = null;
  player.pos.set(bambooBench.interact.x, EYE_HEIGHT, bambooBench.interact.z + .25);
  player.yaw = 0;
  player.pitch = -.08;
  enterBench(bambooBench, () => ui.toast(message, kind));
}

function resetCurrentStep() {
  if (!started || transition) return;
  restartAtBamboo('本步已重置 · 重新取篾', 'warn');
}

function recraft() {
  if (!started || transition) return;
  restartAtBamboo('新篾已备 · 从头再扎');
}

function tryInteract() {
  if (!started || transition || ui.isDialogOpen()) return;
  if (activeBench) {
    leaveBench();
    return;
  }
  if (!nearBench) return;
  if (nearBench.locked) {
    ui.showLocked(nearBench);
    return;
  }
  enterBench(nearBench);
}

function tryPick() {
  if (!started || transition || ui.isDialogOpen()) return;
  if (!activeBench) {
    if (nearBench) ui.toast('先按 F 入座工作台');
    return;
  }
  if (stage?.busy) return;

  if (activeBench === assemblyBench && phase === 1) {
    if (assemblyStage.pick()) return;
    const state = assemblyStage.snapshot();
    if (state.done) ui.toast('骨架已成 · 按 F 退出工作台');
    else if (state.mode === 'waitingParts') ui.toast('竹篾未齐 · 先回竹篾操作台收齐原料', 'warn');
    else if (state.mode.startsWith('bend')) ui.toast('竹篾在手 · 按住左键慢慢弯');
    else if (state.draggable) ui.toast('从物品栏按住材料 · 拖到黄白亮点再松手', 'warn');
    else ui.toast('此刻没有可拖出的材料');
    return;
  }

  if (stage?.key?.('KeyE')) return;

  if (!stage?.pick) return;
  const before = stage.snapshot();
  if (stage.pick()) return;
  if (before.done) ui.toast('骨架已在合成台搭成 · 按 F 退出工作台');
  else if (before.mode.startsWith('pick')) ui.toast('鼠标移到材料上 · 待其泛起金光再按 E', 'warn');
  else if (before.mode === 'toAssembly') ui.toast('竹篾已备齐 · 按 F 离开竹篾台，往北到合成台');
  else ui.toast('此刻没有可取的材料');
}

function blockedAt(x, z) {
  const r = .3;
  if (x < world.bounds.minX + r || x > world.bounds.maxX - r) return true;
  if (z < world.bounds.minZ + r || z > world.bounds.maxZ - r) return true;
  for (const box of world.colliders) {
    if (!box) continue;
    if (Math.abs(x - box.x) < box.hx + r && Math.abs(z - box.z) < box.hz + r) return true;
  }
  return false;
}

function updateMovement(dt) {
  let forward = 0, strafe = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) forward += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) forward -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) strafe += 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) strafe -= 1;

  let targetX = 0, targetZ = 0;
  if (forward || strafe) {
    const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
    let dx = -sin * forward + cos * strafe;
    let dz = -cos * forward - sin * strafe;
    const len = Math.hypot(dx, dz) || 1;
    const speed = 1.85;
    targetX = dx / len * speed;
    targetZ = dz / len * speed;
  }

  const damp = 1 - Math.exp(-11 * dt);
  player.velocity.x += (targetX - player.velocity.x) * damp;
  player.velocity.y += (targetZ - player.velocity.y) * damp;
  if (Math.abs(player.velocity.x) < .004) player.velocity.x = 0;
  if (Math.abs(player.velocity.y) < .004) player.velocity.y = 0;

  const nextX = player.pos.x + player.velocity.x * dt;
  if (!blockedAt(nextX, player.pos.z)) player.pos.x = nextX;
  else player.velocity.x = 0;
  const nextZ = player.pos.z + player.velocity.y * dt;
  if (!blockedAt(player.pos.x, nextZ)) player.pos.z = nextZ;
  else player.velocity.y = 0;

  const moving = Math.hypot(player.velocity.x, player.velocity.y) > .15;
  player.bobPhase += dt * (moving ? 7.6 : 2.2);
}

function refreshNear() {
  if (!started || transition) return;
  if (activeBench) {
    if (lastActive !== activeBench) {
      lastActive = activeBench;
      ui.setNear(activeBench, true);
    }
    return;
  }
  let best = null;
  let bestDistance = 1.72;
  for (const bench of world.benches) {
    const distance = Math.hypot(player.pos.x - bench.interact.x, player.pos.z - bench.interact.z);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = bench;
    }
  }
  nearBench = best;
  if (best !== lastNear || lastActive) {
    lastNear = best;
    lastActive = null;
    ui.setNear(best, false);
  }
}

ui = createUI({
  audio,
  thumbnails,
  onStart: () => {
    started = true;
    player.pos.copy(ENTRY);
    player.yaw = ENTRY_YAW;
    player.pitch = ENTRY_PITCH;
    applyPlayerCamera();
    lastNear = null;
    lastActive = null;
    syncPhaseLocks();
    ui.setNear(null, false);
    ui.toast('走近工坊西侧的竹篾操作台 · 按 F 入座');
  },
  onResetStep: resetCurrentStep,
  onBackToStart: goToEntrance,
  onCraftAgain: recraft,
  onStageSkip: () => { if (activeBench && !transition && !ui.isDialogOpen()) stage?.skip?.(); },
  onStageBack: () => { if (activeBench && !transition && !ui.isDialogOpen()) stage?.back?.(); },
  onInventoryDragStart: (key, event) =>
    !!(activeBench && stage?.beginPartDrag?.(key, event.clientX, event.clientY))
});

bambooStage = createBambooStage({
  bench: bambooBench,
  materials,
  camera,
  renderer,
  audio,
  inventory,
  onState: handleStageState,
  onBend: data => ui.setBend(data),
  onToast: (message, kind) => ui.toast(message, kind)
});

assemblyStage = createAssemblyStage({
  bench: assemblyBench,
  materials,
  camera,
  renderer,
  audio,
  inventory,
  onState: handleStageState,
  onToast: (message, kind) => ui.toast(message, kind),
  onBend: data => ui.setBend(data),
  onComplete: () => {
    assemblyStage.close();
    phase = 2;
    inventory.frame = 1;
    syncPhaseLocks();
    if (activeBench === assemblyBench) {
      pastingStage.open(assemblyBench);
      stage = pastingStage;
      ui.update(stage.snapshot());
      ui.toast('骨架完成 · 开始裱糊下白上红');
    }
  }
});

pastingStage = createPastingStage({
  bench: assemblyBench,
  assembly: assemblyStage,
  onBackBoundary: () => {
    pastingStage.close(); phase = 1; stage = assemblyStage;
    assemblyStage.open(); assemblyStage.back(); syncPhaseLocks();
    return true;
  },
  materials,
  camera,
  renderer,
  audio,
  inventory,
  onState: handleStageState,
  onComplete: () => {
    phase = 3;
    syncPhaseLocks();
    ui.toast('裱糊完成 · 前往染料晾晒台制作粉色花瓣');
  },
  blocked: () => ui.isDialogOpen() || !!transition || document.hidden
});

petalsStage = createPetalsStage({
  dyeBench,
  pressBench,
  materials,
  camera,
  renderer,
  audio,
  inventory,
  onState: handleStageState,
  onComplete: () => ui.toast('花瓣制作完成 · 下一步组合花头'),
  blocked: () => ui.isDialogOpen() || !!transition || document.hidden
});

if (phase >= 2) {
  inventory.frame = 1;
  inventory.pastedFrame = phase >= 3 ? 1 : 0;
  if (phase >= 3) inventory.paper = 0;
}
syncPhaseLocks();

stage = phase === 1 ? bambooStage : phase === 2 ? pastingStage : petalsStage;
ui.update(stage.snapshot());
ui.setNear(null, false);
ui.setBend(null);
camera.position.copy(player.pos);
camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');

const onKeyDown = event => {
  if (event.target instanceof HTMLInputElement) return;
  const code = event.code;
  if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
    keys.add(code);
  }
  if (event.repeat) return;
  if (code === 'KeyD' && activeBench === dyeBench) {
    keys.delete(code); event.preventDefault(); stage?.key?.(code); return;
  }
  if (code === 'KeyF') tryInteract();
  else if (code === 'KeyE') {
    if (!activeBench || !stage?.key?.('KeyE')) tryPick();
  } else if (code === 'KeyQ' || code === 'KeyR') {
    if (started && activeBench && !transition && !ui.isDialogOpen()) stage?.key?.(code);
  }
  else if (code === 'KeyJ') {
    if (started && !ui.isDialogOpen()) ui.openGuide();
  } else if (code === 'Escape') {
    if (started && !ui.isDialogOpen()) {
      event.preventDefault();
      ui.openSettings();
    }
  }
};

const onKeyUp = event => {
  keys.delete(event.code);
  stage?.keyUp?.(event.code);
};

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('blur', () => {
  stage?.keyUp?.('KeyE');
  keys.clear();
  lookDrag = null;
  canvas.style.cursor = '';
});

canvas.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  if (!started || activeBench || transition || ui.isDialogOpen()) return;
  lookDrag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  canvas.style.cursor = 'grabbing';
});

window.addEventListener('pointermove', event => {
  if (!lookDrag || event.pointerId !== lookDrag.id) return;
  const dx = event.clientX - lookDrag.x;
  const dy = event.clientY - lookDrag.y;
  lookDrag.x = event.clientX;
  lookDrag.y = event.clientY;
  const sensitivity = .0024 * ui.settings.sensitivity;
  player.yaw -= dx * sensitivity;
  player.pitch -= dy * sensitivity;
  player.pitch = Math.max(-1.12, Math.min(1.05, player.pitch));
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');
});

const endLook = event => {
  if (!lookDrag || event.pointerId !== lookDrag.id) return;
  lookDrag = null;
  canvas.style.cursor = '';
};
window.addEventListener('pointerup', endLook);
window.addEventListener('pointercancel', endLook);

window.addEventListener('wheel', event => {
  if (!started || !activeBench || transition || ui.isDialogOpen()) return;
  const now = performance.now();
  if (now - lastWheel < 140) return;
  lastWheel = now;
  event.preventDefault();
  ui.cycleSelection(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  if (activeBench && !transition) camera.fov = benchCameraFov(activeBench);
  if (activeBench && transition === 'enter' && camTween) {
    camTween.toFov = benchCameraFov(activeBench);
  }
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
let ready = false;

function animate() {
  requestAnimationFrame(animate);
  const realDt = clock.getDelta();
  const dt = Math.min(.05, realDt);
  const elapsed = clock.elapsedTime;

  if (!started) {
    camera.position.copy(player.pos);
    camera.position.x += Math.sin(elapsed * .18) * .025;
    camera.position.y += Math.sin(elapsed * .5) * .008;
    camera.rotation.set(player.pitch + Math.sin(elapsed * .21) * .004, player.yaw + Math.sin(elapsed * .12) * .012, 0, 'YXZ');
  } else if (camTween) {
    updateCameraTween(dt);
  } else {
    if (!activeBench && !transition && !ui.isDialogOpen()) updateMovement(dt);
    if (!activeBench) applyPlayerCamera();
  }

  if (started) {
    refreshNear();
    ui.setCrosshair(!activeBench && !transition && !ui.isDialogOpen());
  }

  bambooStage?.update(dt, elapsed);
  assemblyStage?.update(dt, elapsed);
  pastingStage?.update(dt, elapsed);
  petalsStage?.update(realDt, elapsed);
  world.update(dt, elapsed, player.pos);
  renderer.render(scene, camera);

  if (!ready) {
    ready = true;
    ui.ready();
    window.__HEHUA_READY__ = true;
  }
}

animate();

window.__HEHUA__ = {
  camera, scene, renderer, player, world, audio, inventory,
  get ui() { return ui; },
  get stage() { return stage; },
  get bambooStage() { return bambooStage; },
  get assemblyStage() { return assemblyStage; },
  get pastingStage() { return pastingStage; },
  get petalsStage() { return petalsStage; },
  get activeBench() { return activeBench; },
  get nearBench() { return nearBench; },
  get transition() { return transition; },
  get cameraMoving() { return !!camTween; },
  start() {
    if (!started) document.getElementById('start-button').click();
  },
  openBamboo(instant = false) { return openBenchById('bamboo', instant); },
  openAssembly(instant = false) {
    prepareParts();
    return openBenchById('assembly', instant);
  },
  openDye(instant = false) { phase = 3; syncPhaseLocks(); return openBenchById('dye', instant); },
  openPress(instant = false) { phase = 3; syncPhaseLocks(); return openBenchById('press', instant); },
  giveParts: prepareParts,
  leave() { leaveBench(); },
  teleport(x, z, yaw = 0, pitch = 0) {
    player.pos.set(x, EYE_HEIGHT, z);
    player.yaw = yaw;
    player.pitch = pitch;
    if (!activeBench) applyPlayerCamera();
  },
  state() { return stage.snapshot(); },
  setPhase(value) { phase = Math.max(1, Math.min(3, Number(value) || 1)); syncPhaseLocks(); stage = stageForBench(activeBench) || (phase === 1 ? bambooStage : phase === 2 ? pastingStage : petalsStage); stage?.open?.(activeBench); ui.update(stage.snapshot()); },
  skip() { stage?.skip?.(); },
  back() { return stage?.back?.(); },
  batch() { stage?.batch?.(); },
  drag(key, x, y) {
    return !!(activeBench && stage?.beginPartDrag?.(key, x, y));
  },
  pick() { tryPick(); },
  toast(message) { ui.toast(message); },
  reset() { resetCurrentStep(); }
};
