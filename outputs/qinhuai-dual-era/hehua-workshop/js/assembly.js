import * as THREE from 'three';
import { buildHoop, buildWireBracket, buildTwistCoil, buildBambooStrip } from './models.js';
import { bambooRodGeometry, curveFromPoints } from './geometry.js';
import { FRAME, SMALL_STRIP_LENGTH, frameArcPoints, frameJoint, topJoint } from './frame-profile.js';
import { glowTexture } from './textures.js';
import { buildCrossBinding } from './bindings.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;
const GAUGE_MAX = 1.16;
const CRAFT_SCALE = 3;
const WORK = V(0, .018, .02 / CRAFT_SCALE);
const BIG_R = FRAME.bigRadius;
const HOOP_Y = FRAME.bigY;
const SMALL_R = FRAME.smallRadius;
const SMALL_Y = FRAME.smallY;
const WIRE_Y = FRAME.wireY;

const BEND = {
  big: { lo: .88, hi: 1.10, length: .62, speed: .30, width: .0102, label: '大圈' },
  arc: { lo: .56, hi: .77, length: .40, speed: .35, width: .0092, label: '弧骨' },
  small: { lo: .84, hi: 1.06, length: SMALL_STRIP_LENGTH, speed: .42, width: .0092, label: '小圈' }
};

const RAW = {
  longBamboo: { kind: 'big', length: .62, width: .0105, thickness: .003, marks: false, label: '62 厘米长篾' },
  arcBamboo: { kind: 'arc', length: .40, width: .0095, thickness: .0028, label: '40 厘米竹篾' },
  smallBamboo: { kind: 'small', length: SMALL_STRIP_LENGTH, width: .0095, thickness: .0028, label: '圈篾' }
};

const easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const cap = text => text.charAt(0).toUpperCase() + text.slice(1);

function makeDot() {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(.0062, 14, 10),
    new THREE.MeshBasicMaterial({ color: '#fff4cf' })
  );
  group.add(core);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(.0145, .0014, 6, 32),
    new THREE.MeshBasicMaterial({ color: '#ffd88c', transparent: true, opacity: .95 })
  );
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture(), color: '#ffcf7a', transparent: true, opacity: .66,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  halo.scale.setScalar(.105);
  group.add(halo);
  group.userData.ring = ring;
  group.userData.halo = halo;
  group.visible = false;
  return group;
}

// A continuous paper cord, progressively wound around the bamboo contact.
function makeWrap(M, scale = 1) {
  const group = new THREE.Group();
  group.name = 'CottonBinding';
  const turns = 6, segments = 240;
  const pointAt = t => {
    const angle = t * turns * TAU;
    return V(Math.cos(angle) * .009, (t - .5) * .014, Math.sin(angle) * .007);
  };
  const points = Array.from({ length: segments + 1 }, (_, i) => pointAt(i / segments));
  const cord = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, .0016, 6, false), M.twine);
  cord.name = 'WindingCord'; cord.castShadow = true;
  group.add(cord);
  const knotPoints = Array.from({ length: 65 }, (_, i) => {
    const t = i / 64, angle = t * TAU * 2;
    return V(.009 + Math.sin(angle) * .004, .007 + Math.sin(angle * .5) * .003, Math.cos(angle) * .004);
  });
  const knot = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(knotPoints), 64, .0017, 6, false), M.twine);
  knot.name = 'BindingKnot'; group.add(knot);
  const tail = new THREE.Mesh(new THREE.BufferGeometry(), M.twine);
  tail.name = 'LoosePaperCord'; group.add(tail);
  group.scale.setScalar(scale);
  group.userData.restScale = scale;
  group.userData.binding = { cord, knot, tail, pointAt };
  setWrapProgress(group, 1);
  return group;
}

function setWrapProgress(group, progress) {
  const { cord, knot, tail, pointAt } = group.userData.binding;
  const winding = Math.min(1, progress / .72);
  const tightening = easeInOut(THREE.MathUtils.clamp((progress - .72) / .16, 0, 1));
  const tying = THREE.MathUtils.clamp((progress - .88) / .12, 0, 1);
  cord.geometry.setDrawRange(0, Math.floor(winding * 240) * 36);
  const looseness = 1 + .48 * (1 - tightening);
  cord.scale.set(looseness, 1, looseness);
  knot.visible = tying > 0;
  knot.geometry.setDrawRange(0, Math.floor(tying * 64) * 36);
  const tip = pointAt(winding); tip.x *= looseness; tip.z *= looseness;
  const radial = V(tip.x, 0, tip.z).normalize();
  const remaining = .006 + .044 * (1 - tying);
  const end = tip.clone().addScaledVector(radial, remaining).add(V(0, .008 * (1 - tying), 0));
  const middle = tip.clone().lerp(end, .5).add(V(0, -.007 * (1 - tying), 0));
  tail.geometry.dispose();
  tail.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([tip, middle, end]), 16, group.userData.crossing ? .0009 : .0015, 6, false);
  group.userData.progress = progress;
  group.userData.phase = progress < .72 ? 'winding' : progress < .88 ? 'tightening' : progress < 1 ? 'tying' : 'complete';
}

function disposeTree(group) {
  group.traverse(child => {
    if (child.geometry) child.geometry.dispose();
    if (child.material?.userData?.owned) child.material.dispose();
  });
}

export function createAssemblyStage({
  bench, materials: M, camera, renderer, audio, inventory,
  onState, onToast, onBend, onComplete
}) {
  const canvas = renderer.domElement;
  const root = new THREE.Group();
  root.name = 'AssemblyCraftRoot';
  // Enlarge the craft, not the camera or table, while keeping its base height.
  root.scale.setScalar(CRAFT_SCALE);
  root.position.set(0, 1.022 - FRAME.bottomY * (CRAFT_SCALE - 1), -.04);
  bench.group.add(root);

  const frameLayer = new THREE.Group();
  const bindLayer = new THREE.Group();
  const workGroup = new THREE.Group();
  root.add(frameLayer, bindLayer, workGroup);
  workGroup.visible = false;

  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const tweens = [];
  const timers = new Set();

  let active = false, busy = false, session = 0;
  let drag = null;
  let ghostDot = null;
  let sparklePoints = null, sparkleVel = null, sparkleLife = 0;

  let curve = 0, bendKind = null, bending = null;
  let workMesh = null, workKind = null;
  let placingHoop = null, hoopDrag = null;
  let arcFlight = null;
  let bindingAnimation = null;
  let lastBendSound = 0, lastBendEmit = -1;

  const state = { mode: 'waitingParts', arcsPlaced: 0, arcEnd: 0, smallTies: 0 };

  // Checkpoints include the actual craft meshes, so undo restores the workbench too.
  const history = [];
  function copyTree(object, copies) {
    const data = object.userData;
    object.userData = {};
    const copy = object.clone(false);
    object.userData = data;
    copy.userData = { ...data };
    copies.set(object, copy);
    if (object.geometry) copy.geometry = object.geometry.clone();
    if (object.material?.userData?.owned) copy.material = object.material.clone();
    for (const child of object.children) copy.add(copyTree(child, copies));
    if (data.wrap) copy.userData.wrap = copies.get(data.wrap);
    return copy;
  }
  function remember() {
    const copies = new Map();
    const layers = [frameLayer, bindLayer, workGroup].map(layer => copyTree(layer, copies));
    history.push({ state: { ...state }, inventory: { ...inventory }, curve, bendKind, workKind,
      layers, workMesh: copies.get(workMesh) || null, placingHoop: copies.get(placingHoop) || null });
  }
  function back() {
    if (!active || busy || blocked() || !history.length) return false;
    const previous = history.pop();
    session++; clearTimers(); tweens.length = 0; bindingAnimation = arcFlight = bending = hoopDrag = null;
    cancelDrag(); hideDot();
    if (sparklePoints) { sparklePoints.removeFromParent(); disposeTree(sparklePoints); sparklePoints = null; }
    const layers = [frameLayer, bindLayer, workGroup];
    const references = new Map(previous.layers.map((saved, i) => [saved, layers[i]]));
    layers.forEach((layer, i) => {
      for (const child of [...layer.children]) { child.removeFromParent(); disposeTree(child); }
      const saved = previous.layers[i];
      layer.position.copy(saved.position); layer.quaternion.copy(saved.quaternion); layer.scale.copy(saved.scale);
      layer.visible = saved.visible;
      for (const child of [...saved.children]) layer.add(child);
    });
    Object.assign(state, previous.state); Object.assign(inventory, previous.inventory);
    ({ curve, bendKind, workKind, workMesh } = previous);
    placingHoop = references.get(previous.placingHoop) || previous.placingHoop;
    busy = false; lastBendEmit = -1; canvas.style.cursor = '';
    open(); return true;
  }
  function canSkip() {
    if (active && bindingAnimation && !blocked()) return true;
    return active && !busy && !drag && !hoopDrag && !stepDone()
      && (!!allowedKey() || state.mode.startsWith('bend') || ['collectBig', 'collectSmall', 'placeArc'].includes(state.mode));
  }
  function skip() {
    if (!canSkip() || blocked()) return false;
    if (bindingAnimation) {
      const animation = bindingAnimation;
      bindingAnimation = null;
      setWrapProgress(animation.wrap, 1);
      animation.done();
      return true;
    }
    if (state.mode.startsWith('bend')) { bending = null; finishBend(bendKind); }
    else if (state.mode === 'placeArc') placeArc();
    else if (state.mode === 'collectBig' || state.mode === 'collectSmall') return pick();
    else {
      const key = allowedKey();
      const record = { key };
      if (RAW[key]) startBend(record);
      else if (key === 'bigHoop' || key === 'smallHoop' || key === 'wire') {
        record.ghost = buildGhost(key).group; root.add(record.ghost);
        if (key === 'wire') attachWire(record); else placeInventoryHoop(record);
      } else if (state.mode === 'bindBig') bindBigRing(record);
      else if (state.mode === 'bindSmall') bindSmallRing(record);
      else bindJoints(record);
    }
    return true;
  }

  /* ---------- state ---------- */
  function stepDone() {
    return inventory.frame > 0;
  }

  function bambooReady() {
    return (inventory.longBamboo || 0) >= 1
      && (inventory.arcBamboo || 0) >= 3
      && (inventory.smallBamboo || 0) >= 1;
  }

  function allowedKey() {
    if (!active || busy || stepDone()) return null;
    if (state.mode === 'toBendBig') return (inventory.longBamboo || 0) > 0 ? 'longBamboo' : null;
    if (state.mode === 'toBendArc') return (inventory.arcBamboo || 0) > 0 ? 'arcBamboo' : null;
    if (state.mode === 'toBendSmall') return (inventory.smallBamboo || 0) > 0 ? 'smallBamboo' : null;
    if (state.mode === 'placeBig') return (inventory.bigHoop || 0) > 0 ? 'bigHoop' : null;
    if (state.mode === 'placeSmall') return (inventory.smallHoop || 0) > 0 ? 'smallHoop' : null;
    if (state.mode === 'bindBig' || state.mode === 'bindSmall' || state.mode === 'bindArc' || state.mode === 'bindTop') {
      return (inventory.twist || 0) > 0 ? 'twist' : null;
    }
    if (state.mode === 'assembleWire') return (inventory.wire || 0) > 0 ? 'wire' : null;
    return null;
  }

  function currentStep() {
    const mode = state.mode;
    if (['toBendBig', 'bendBig', 'bindBig', 'collectBig', 'toBendSmall', 'bendSmall', 'bindSmall', 'collectSmall'].includes(mode)) return 1;
    if (['placeBig', 'toBendArc', 'bendArc', 'placeArc', 'bindArc', 'placeSmall', 'bindTop'].includes(mode)) return 2;
    if (['assembleWire', 'done'].includes(mode)) return 3;
    return 0;
  }

  function emit() { onState?.(snapshot()); }

  /* ---------- target dot ---------- */
  function modeDot() {
    if (state.mode === 'toBendBig' || state.mode === 'toBendArc' || state.mode === 'toBendSmall') {
      return WORK.clone().add(V(0, .005, 0));
    }
    if (state.mode === 'bindBig') return WORK.clone().add(V(0, .004, BIG_R));
    if (state.mode === 'bindSmall') return WORK.clone().add(V(0, .004, SMALL_R));
    if (state.mode === 'placeArc') return frameJoint(state.arcsPlaced, 0);
    if (state.mode === 'bindArc') return frameJoint(state.arcsPlaced, state.arcEnd);
    if (state.mode === 'placeSmall') return V(0, SMALL_Y, 0);
    if (state.mode === 'bindTop') return topJoint(state.smallTies);
    if (state.mode === 'placeBig') return V(0, HOOP_Y, 0);
    if (state.mode === 'assembleWire') return V(0, WIRE_Y, 0);

    return null;
  }

  function showModeDot() {
    const p = modeDot();
    if (!p) { hideDot(); return; }
    if (!ghostDot) {
      ghostDot = makeDot();
      root.add(ghostDot);
    }
    ghostDot.position.copy(p);
    ghostDot.scale.setScalar(1);
    ghostDot.visible = true;
    ghostDot.userData.halo.material.opacity = .66;
  }

  function hideDot() {
    if (ghostDot) ghostDot.visible = false;
  }

  /* ---------- tweens / timers ---------- */
  function tween(target, to, duration, done, ease = easeInOut) {
    const record = {
      target, to: { ...to }, duration: Math.max(.001, duration),
      t: 0, done, ease, session
    };
    if (target?.isMaterial) {
      record.kind = 'material';
      record.from = {};
      for (const key of Object.keys(to)) record.from[key] = target[key] ?? 0;
    } else {
      record.kind = 'vec';
      record.from = { x: target.x, y: target.y, z: target.z };
    }
    tweens.push(record);
    return record;
  }

  function schedule(ms, fn) {
    const token = session;
    const id = setTimeout(() => {
      timers.delete(id);
      if (token === session) fn();
    }, ms);
    timers.add(id);
  }

  function clearTimers() {
    for (const id of timers) clearTimeout(id);
    timers.clear();
  }

  /* ---------- bending work ---------- */
  function bendPoints(length, amount, y = 0) {
    if (length === BEND.arc.length) {
      const shape = frameArcPoints(0);
      const axis = V(Math.cos(-Math.PI / 6), 0, Math.sin(-Math.PI / 6));
      const k = amount / .665;
      const points = shape.map((p, i) => {
        const x = p.dot(axis), z = p.y - (FRAME.smallY + FRAME.bottomY) / 2;
        return V(THREE.MathUtils.lerp(length / 2 - length * i / FRAME.segments, x, k), y, z * k);
      });
      let arcLength = 0;
      for (let i = 1; i < points.length; i++) arcLength += points[i].distanceTo(points[i - 1]);
      return points.map(p => p.multiplyScalar(length / arcLength));
    }
    const span = Math.max(.0001, amount * TAU);
    const radius = Math.min(length / span, 2.2);
    const realSpan = length / radius;
    const points = [];
    const count = FRAME.segments;
    const start = Math.PI - realSpan / 2;
    for (let i = 0; i <= count; i++) {
      const a = start + realSpan * i / count;
      points.push(V(Math.sin(a) * radius, y, Math.cos(a) * radius));
    }
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const p of points) {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
    }
    const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2;
    for (const p of points) { p.x -= cx; p.z -= cz; }
    return points;
  }

  function updateWorkGeometry() {
    if (!workMesh || !workKind) return;
    const spec = BEND[workKind];
    const points = bendPoints(spec.length, curve);
    const geo = bambooRodGeometry(points, spec.width);
    workMesh.geometry.dispose();
    workMesh.geometry = geo;
  }

  function makeWorkStrip() {
    clearWork();
    workGroup.visible = true;
    workGroup.position.copy(WORK);
    workGroup.scale.setScalar(1);
    workKind = bendKind;
    workMesh = new THREE.Mesh(new THREE.BufferGeometry(), M.bamboo);
    workMesh.castShadow = true;
    workMesh.receiveShadow = true;
    workGroup.add(workMesh);
    curve = 0;
    updateWorkGeometry();
  }

  function clearWork() {
    if (workMesh) {
      workGroup.remove(workMesh);
      workMesh.geometry.dispose();
      if (workMesh.material?.userData?.owned) workMesh.material.dispose();
      workMesh = null;
    }
    workGroup.visible = false;
    workGroup.scale.setScalar(1);
    workGroup.position.set(0, 0, 0);
    workKind = null;
  }

  function fadeOutWork() {
    if (!workMesh) { clearWork(); return; }
    const mesh = workMesh;
    const fadeMat = M.bamboo.clone();
    fadeMat.transparent = true;
    fadeMat.opacity = 1;
    fadeMat.userData.owned = true;
    workMesh.material = fadeMat;
    workMesh.castShadow = false;
    tween(fadeMat, { opacity: 0 }, .35);
    const token = session;
    schedule(390, () => {
      if (token === session && workMesh === mesh) clearWork();
    });
  }

  function startBend(record) {
    remember();
    const raw = RAW[record.key];
    removeGhost(record);
    inventory[record.key] = Math.max(0, (inventory[record.key] || 0) - 1);
    curve = 0;
    bendKind = raw.kind;
    state.mode = `bend${cap(raw.kind)}`;
    makeWorkStrip();
    busy = false;
    hideDot();
    const spec = BEND[raw.kind];
    onBend?.({
      visible: true, value: 0, lo: spec.lo, hi: spec.hi,
      max: GAUGE_MAX, ready: false, label: spec.label
    });
    audio?.pick?.();
    onToast?.(`${raw.label}已放上台面 · 按住左键缓缓弯制`);
    emit();
  }

  function startBending(dir) {
    if (!bendKind || busy) return false;
    bending = { dir };
    lastBendEmit = -1;
    return true;
  }

  function bendStep(dt) {
    if (!bending || !bendKind) return;
    const spec = BEND[bendKind];
    curve = Math.max(0, Math.min(GAUGE_MAX, curve + bending.dir * dt * spec.speed));
    updateWorkGeometry();
    const ready = curve >= spec.lo && curve <= spec.hi;
    if (Math.abs(curve - lastBendEmit) > .0015) {
      onBend?.({
        visible: true, value: curve, lo: spec.lo, hi: spec.hi,
        max: GAUGE_MAX, ready, over: curve > spec.hi, label: spec.label
      });
      lastBendEmit = curve;
    }
    const now = performance.now();
    if (now - lastBendSound > 320) {
      audio?.bend?.(Math.min(1, curve));
      lastBendSound = now;
    }
  }

  function stopBending() {
    if (!bending || !bendKind) return;
    bending = null;
    const kind = bendKind;
    const spec = BEND[kind];
    const inBand = curve >= spec.lo && curve <= spec.hi;
    onBend?.({
      visible: true, value: curve, lo: spec.lo, hi: spec.hi,
      max: GAUGE_MAX, ready: inBand, label: spec.label
    });
    if (!inBand) {
      if (curve > spec.hi) onToast?.('弯过了些 · 按住右键松劲回弹');
      else onToast?.('弧度还差一点 · 再按住左键慢慢弯');
      return;
    }
    finishBend(kind);
  }

  function finishBend(kind) {
    remember();
    onBend?.({ visible: false });
    curve = kind === 'arc' ? .665 : 1.025;
    updateWorkGeometry();
    busy = true;
    if (kind === 'big') {
      state.mode = 'bindBig';
      busy = false;
      showModeDot();
      emit();
      audio?.ready?.();
      onToast?.('大圈已弯成 · 从物品栏拖出棉花纸捻，扎紧首尾搭接处');
      return;
    }
    if (kind === 'small') {
      state.mode = 'bindSmall';
      busy = false;
      showModeDot();
      emit();
      audio?.ready?.();
      onToast?.('小圈已弯成 · 拖出棉花纸捻，扎紧收口');
      return;
    }

    bendKind = null;
    busy = false;
    state.mode = 'placeArc';
    placingHoop = workGroup;
    showModeDot(); emit();
    onToast?.('弧骨已弯好 · 拖动弧骨到大圈亮点，两端对齐后逐端捆扎');
  }

  function placeArc() {
    remember();
    busy = true; hideDot();
    const from = bendPoints(BEND.arc.length, curve).map(p => p.add(workGroup.position));
    const to = frameArcPoints(state.arcsPlaced);
    const geo = bambooRodGeometry(from, .0078);
    const arc = new THREE.Mesh(geo, M.bamboo);
    arc.castShadow = true; arc.receiveShadow = true;
    frameLayer.add(arc);
    arcFlight = { arc, from, to, t: 0, index: state.arcsPlaced };
    placingHoop = null; clearWork(); emit();
  }

  function addBoundHoop({ radius, x = 0, y = 0, z = 0, joint, wrapScale, width, thickness }, parent = frameLayer) {
    const group = new THREE.Group();
    const hoop = buildHoop(M, { radius, width, thickness, knot: false });
    group.add(hoop);

    const wrap = makeWrap(M, wrapScale);
    wrap.rotation.z = Math.PI / 2;
    wrap.position.set(joint.x, 0, joint.z);
    group.add(wrap);
    group.userData.wrap = wrap;

    group.position.set(x, y, z);
    parent.add(group);
    return group;
  }

  /* ---------- ghost pieces ---------- */
  function buildGhost(key) {
    const group = new THREE.Group();
    let planeY = WORK.y;
    if (RAW[key]) {
      const raw = RAW[key];
      group.add(buildBambooStrip(M, {
        length: raw.length, width: raw.width, thickness: raw.thickness, marks: !!raw.marks
      }));
      planeY = WORK.y;
    } else if (key === 'wire') {
      group.add(buildWireBracket(M));
      planeY = WIRE_Y;
    } else if (key === 'twist') {
      group.add(buildTwistCoil(M, .78));
      planeY = modeDot()?.y ?? WORK.y;
    } else if (key === 'bigHoop' || key === 'smallHoop') {
      const small = key === 'smallHoop';
      const radius = small ? SMALL_R : BIG_R;
      addBoundHoop({
        radius, joint: { x: 0, z: radius + (small ? 0 : .0015) },
        wrapScale: small ? .56 : .82,
        width: small ? .0075 : .0085, thickness: small ? .0026 : .0032
      }, group);
      planeY = small ? SMALL_Y : HOOP_Y;
    } else {
      return null;
    }
    group.scale.setScalar(1.06);
    return { group, planeY };
  }

  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      (event.clientX - rect.left) / rect.width * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    ray.setFromCamera(pointer, camera);
  }

  function setPlane(localY) {
    const worldY = root.localToWorld(V(0, localY, 0)).y;
    dragPlane.set(new THREE.Vector3(0, 1, 0), -worldY);
  }

  function localAt(event) {
    setPointer(event);
    const hit = V();
    if (!ray.ray.intersectPlane(dragPlane, hit)) return null;
    return root.worldToLocal(hit);
  }

  function projected(obj) {
    camera.updateWorldMatrix(true, false);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    const world = obj.getWorldPosition(V());
    const p = world.project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + (p.x + 1) * rect.width / 2,
      y: rect.top + (1 - p.y) * rect.height / 2,
      z: p.z
    };
  }

  function dotNear(event, distance = 62) {
    if (!ghostDot?.visible) return false;
    const p = projected(ghostDot);
    return Math.hypot(p.x - event.clientX, p.y - event.clientY) < distance;
  }

  function blocked() {
    return !!document.querySelector('dialog[open]');
  }

  /* ---------- drag from inventory ---------- */
  function beginPartDrag(key, clientX, clientY) {
    if (!active || busy || drag || blocked()) return false;
    if (allowedKey() !== key) return false;
    const ghost = buildGhost(key);
    if (!ghost) return false;
    root.add(ghost.group);
    drag = {
      key,
      ghost: ghost.group,
      planeY: ghost.planeY,
      start: { x: clientX, y: clientY },
      moved: false
    };
    setPlane(ghost.planeY);
    const local = localAt({ clientX, clientY });
    if (local) ghost.group.position.copy(local);
    canvas.style.cursor = 'grabbing';
    audio?.pick?.();
    emit();
    return true;
  }

  function updateDrag(event) {
    if (!drag) return;
    setPlane(drag.planeY);
    const local = localAt(event);
    if (local) drag.ghost.position.copy(local);
    if (Math.hypot(event.clientX - drag.start.x, event.clientY - drag.start.y) > 6) drag.moved = true;
    if (ghostDot?.visible) {
      const near = dotNear(event);
      ghostDot.userData.halo.material.opacity = near ? 1 : .62;
      ghostDot.scale.setScalar(near ? 1.4 : 1);
      drag.ghost.scale.setScalar(near ? 1 : 1.06);
    }
  }

  function removeGhost(record) {
    if (!record?.ghost) return;
    root.remove(record.ghost);
    disposeTree(record.ghost);
  }

  function cancelDrag() {
    if (!drag) return;
    removeGhost(drag);
    drag = null;
    canvas.style.cursor = '';
  }

  function finishDrag(event) {
    if (!drag) return;
    const record = drag;
    drag = null;
    canvas.style.cursor = '';
    if (!dotNear(event)) {
      removeGhost(record);
      if (record.moved) onToast?.('对准黄白亮点再松手');
      else audio?.soft?.();
      emit();
      return;
    }
    hideDot();
    if (RAW[record.key]) {
      startBend(record);
      return;
    }
    if (record.key === 'bigHoop' || record.key === 'smallHoop') {
      placeInventoryHoop(record);
      return;
    }
    if (record.key === 'twist' && state.mode === 'bindBig') {
      bindBigRing(record);
      return;
    }
    if (record.key === 'twist' && state.mode === 'bindSmall') {
      bindSmallRing(record);
      return;
    }
    if (record.key === 'wire') {
      attachWire(record);
      return;
    }
    if (record.key === 'twist' && (state.mode === 'bindArc' || state.mode === 'bindTop')) {
      bindJoints(record);
      return;
    }
    removeGhost(record);
    emit();
  }

  /* ---------- hoop placement ---------- */
  function pick() {
    if (!active || busy || blocked() || !placingHoop) return false;
    if (state.mode !== 'collectBig' && state.mode !== 'collectSmall') return false;
    remember();
    const small = state.mode === 'collectSmall';
    const key = small ? 'smallHoop' : 'bigHoop';
    inventory[key] = (inventory[key] || 0) + 1;
    placingHoop.removeFromParent();
    disposeTree(placingHoop);
    placingHoop = null;
    state.mode = small ? 'placeBig' : 'toBendSmall';
    showModeDot(); emit(); audio?.pick?.();
    if (small) audio?.chime?.();
    onToast?.(small
      ? '大小竹圈已收入物品栏 · 拖出大圈，开始搭建荷花骨架'
      : '大圈已收入物品栏 · 接着取圈篾制作小圈');
    return true;
  }

  function placeInventoryHoop(record) {
    remember();
    const small = record.key === 'smallHoop';
    inventory[record.key]--;
    const hoop = record.ghost;
    hoop.scale.setScalar(1);
    frameLayer.add(hoop);
    busy = true; hideDot(); audio?.bind?.();
    tween(hoop.position, { x: 0, y: small ? SMALL_Y : HOOP_Y, z: 0 }, .65, () => {
      busy = false;
      state.mode = small ? 'bindTop' : 'toBendArc';
      showModeDot(); emit();
      audio?.ready?.();
      onToast?.(small ? '小圈已对齐弧骨顶端 · 依次捆扎三处连接点' : '大圈已定位 · 取一根 40 厘米竹篾，弯第一根弧骨');
    });
    emit();
  }

  function startHoopDrag(event) {
    if (state.mode !== 'placeArc' || !placingHoop || busy) return false;
    hoopDrag = {
      startX: event.clientX, startY: event.clientY, moved: false,
      from: placingHoop.position.clone()
    };
    setPlane(placingHoop.position.y);
    const local = localAt(event);
    if (local) placingHoop.position.set(local.x, placingHoop.position.y, local.z);
    canvas.style.cursor = 'grabbing';
    audio?.pick?.();
    emit();
    return true;
  }

  function updateHoopDrag(event) {
    if (!hoopDrag || !placingHoop) return;
    setPlane(placingHoop.position.y);
    const local = localAt(event);
    if (local) placingHoop.position.set(local.x, placingHoop.position.y, local.z);
    if (Math.hypot(event.clientX - hoopDrag.startX, event.clientY - hoopDrag.startY) > 5) {
      hoopDrag.moved = true;
    }
  }

  function finishHoopDrag(event) {
    if (!hoopDrag || !placingHoop) return;
    const record = hoopDrag;
    hoopDrag = null;
    canvas.style.cursor = '';
    if (!dotNear(event, 86)) {
      tween(placingHoop.position, { x: record.from.x, y: record.from.y, z: record.from.z }, .3, null, easeOut);
      if (record.moved) onToast?.('把弧骨拖到骨架高光白点上再松手');
      else audio?.soft?.();
      emit();
      return;
    }
    placeArc();
  }

  /* ---------- binding steps ---------- */
  function animateBinding(wrap, done) {
    setWrapProgress(wrap, 0);
    bindingAnimation = { wrap, elapsed: 0, duration: 2.6, done };
    emit();
  }
  function bindBigRing(record) {
    remember();
    removeGhost(record);
    inventory.twist = Math.max(0, (inventory.twist || 0) - 1);
    busy = true;
    hideDot();
    fadeOutWork();
    placingHoop = addBoundHoop({
      radius: BIG_R, x: WORK.x, y: .055, z: WORK.z,
      joint: { x: 0, z: BIG_R + .0015 }, wrapScale: .82,
      width: .0085, thickness: .0032
    });
    audio?.bind?.();
    animateBinding(placingHoop.userData.wrap, () => {
      busy = false;
      bendKind = null;
      state.mode = 'collectBig';
      showModeDot();
      emit();
      audio?.ready?.();
      onToast?.('大圈已用棉花纸捻扎口 · 按 E 或点击竹圈收入物品栏');
    });
  }

  function bindSmallRing(record) {
    remember();
    removeGhost(record);
    inventory.twist = Math.max(0, (inventory.twist || 0) - 1);
    busy = true;
    hideDot();
    fadeOutWork();
    placingHoop = addBoundHoop({
      radius: SMALL_R, x: WORK.x, y: .055, z: WORK.z,
      joint: { x: 0, z: SMALL_R }, wrapScale: .56,
      width: .0075, thickness: .0026
    });
    audio?.bind?.();
    animateBinding(placingHoop.userData.wrap, () => {
      busy = false;
      bendKind = null;
      state.mode = 'collectSmall';
      showModeDot();
      emit();
      audio?.ready?.();
      onToast?.('小圈已扎口 · 按 E 或点击竹圈收入物品栏，再开始搭架');
    });
  }

  function attachWire(record) {
    remember();
    inventory.wire = Math.max(0, (inventory.wire || 0) - 1);
    const group = record.ghost;
    group.scale.setScalar(1);
    busy = true;
    tween(group.position, { x: 0, y: WIRE_Y, z: 0 }, .3, null, easeOut);
    tween(group.rotation, { x: 0, y: 0, z: 0 }, .3);
    frameLayer.add(group);
    audio?.bind?.();
    hideDot(); emit();
    schedule(460, () => {
      inventory.frame = 1; state.mode = 'done'; busy = false; bendKind = null;
      emit(); audio?.chime?.(); sparkle(0, SMALL_Y, 0, 60);
      onToast?.('骨架接点均已扎紧，金丝红线三点吊挂已安装 · 扎框子完成');
      schedule(1600, () => onComplete?.());
    });
  }

  function bindJoints(record) {
    remember();
    removeGhost(record);
    inventory.twist = Math.max(0, (inventory.twist || 0) - 1);
    const isArc = state.mode === 'bindArc';
    const p = isArc ? frameJoint(state.arcsPlaced, state.arcEnd) : topJoint(state.smallTies);
    const wrap = buildCrossBinding(M, p);
    bindLayer.add(wrap);
    busy = true; hideDot(); emit(); audio?.bind?.();
    animateBinding(wrap, () => {
      busy = false;
      if (isArc) {
        state.arcEnd++;
        if (state.arcEnd === 2) {
          state.arcsPlaced++; state.arcEnd = 0;
          state.mode = state.arcsPlaced < 3 ? 'toBendArc' : 'placeSmall';
          onToast?.(state.arcsPlaced < 3 ? '本根弧骨两端已扎牢 · 继续弯下一根' : '三根弧骨两端均已扎牢 · 从物品栏拖出小圈安装');
        } else onToast?.('这一端已扎牢 · 将棉花纸捻拖到另一端亮点');
      } else {
        state.smallTies++;
        if (state.smallTies === 3) {
          state.mode = 'assembleWire';
          audio?.chime?.();
        }
        onToast?.(state.smallTies === 3 ? '小圈三处连接已扎牢 · 最后安装金丝红线吊挂' : '继续捆扎小圈下一处连接点');
      }
      showModeDot(); emit();
    });
  }

  /* ---------- sparkles ---------- */
  function sparkle(x, y, z, count = 26) {
    if (sparklePoints) {
      root.remove(sparklePoints);
      sparklePoints.geometry.dispose();
      sparklePoints.material.dispose();
      sparklePoints = null;
    }
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = x + (Math.random() - .5) * .1;
      positions[i * 3 + 1] = y + (Math.random() - .5) * .06;
      positions[i * 3 + 2] = z + (Math.random() - .5) * .1;
      const a = Math.random() * TAU, s = .1 + Math.random() * .24;
      velocities.push(V(Math.cos(a) * s, .08 + Math.random() * .3, Math.sin(a) * s));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    sparklePoints = new THREE.Points(geo, new THREE.PointsMaterial({
      map: glowTexture(), color: '#ffd48c', size: .018, transparent: true,
      opacity: .95, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    sparkleVel = velocities;
    sparkleLife = 2.0;
    root.add(sparklePoints);
  }

  /* ---------- lifecycle ---------- */
  function ensureMode() {
    if (stepDone()) { state.mode = 'done'; return; }
    if (state.mode !== 'waitingParts') return;
    if (bambooReady()) state.mode = 'toBendBig';
  }

  function toastForMode() {
    const mode = state.mode;
    if (stepDone()) onToast?.('骨架已成 · 按 F 可退出工作台');
    else if (mode === 'waitingParts') onToast?.('竹篾未齐 · 先回竹篾操作台收齐长篾、三根 40 厘米竹篾与圈篾');
    else if (mode === 'toBendBig') onToast?.('从物品栏按住 62 厘米长篾 · 拖到台面高光点再弯制');
    else if (mode === 'bendBig') onToast?.('按住左键缓缓弯制 · 弧度落入金带后松手');
    else if (mode === 'bindBig') onToast?.('从物品栏拖出棉花纸捻 · 扎紧大圈首尾搭接处');
    else if (mode === 'collectBig' || mode === 'collectSmall') onToast?.('竹圈已扎口 · 按 E 或点击竹圈收入物品栏');
    else if (mode === 'placeBig') onToast?.('大小竹圈已备齐 · 从物品栏拖出大圈放到骨架亮点');
    else if (mode === 'toBendArc') onToast?.(`从物品栏取 40 厘米竹篾 · 拖到台面高光点弯第 ${state.arcsPlaced + 1} 根弧骨`);
    else if (mode === 'bendArc') onToast?.('弯出均匀弧度 · 落入金带后松手，弧骨两端朝上穿过大圈');
    else if (mode === 'toBendSmall') onToast?.('大圈已收好 · 取圈篾拖到台面高光点制作小圈');
    else if (mode === 'bendSmall') onToast?.('小圈弧度更急 · 慢慢加力，别一次弯过');
    else if (mode === 'bindSmall') onToast?.('从物品栏拖出棉花纸捻 · 扎紧小圈收口');
    else if (mode === 'assembleWire') onToast?.('从物品栏拖出金丝红线 · 固定主大圈三处吊挂点');
    else if (mode === 'bindArc') onToast?.('将棉花纸捻拖到当前弧骨亮点 · 两端分别捆扎');
    else if (mode === 'bindTop') onToast?.('依次捆扎小圈三处连接点');
    else if (mode === 'placeSmall') onToast?.('从物品栏拖出已制好的小圈 · 放到弧骨顶端亮点');
    else if (mode === 'placeArc') onToast?.('拖动台面已弯好的弧骨到骨架亮点');
  }

  function open() {
    active = true;
    ensureMode();
    showModeDot();
    emit();
    if (state.mode.startsWith('bend') && workMesh) {
      const spec = BEND[bendKind];
      onBend?.({
        visible: true, value: curve, lo: spec.lo, hi: spec.hi,
        max: GAUGE_MAX, ready: curve >= spec.lo && curve <= spec.hi, label: spec.label
      });
    } else {
      onBend?.({ visible: false });
    }
    toastForMode();
  }

  function close() {
    active = false;
    cancelDrag();
    hoopDrag = null;
    bending = null;
    hideDot();
    onBend?.({ visible: false });
    canvas.style.cursor = '';
  }

  function resetState() {
    for (const previous of history) previous.layers.forEach(disposeTree);
    history.length = 0;
    session++;
    clearTimers();
    tweens.length = 0;
    bindingAnimation = null;
    cancelDrag();
    hoopDrag = null;
    placingHoop = null;
    arcFlight = null;
    bending = null;
    if (sparklePoints) {
      root.remove(sparklePoints);
      sparklePoints.geometry.dispose();
      sparklePoints.material.dispose();
      sparklePoints = null;
    }
    clearWork();
    for (const layer of [frameLayer, bindLayer]) {
      while (layer.children.length) {
        const child = layer.children.pop();
        layer.remove(child);
        disposeTree(child);
      }
    }
    frameLayer.rotation.set(0, 0, 0);
    bindLayer.rotation.set(0, 0, 0);
    hideDot();
    onBend?.({ visible: false });
    state.mode = 'waitingParts';
    state.arcsPlaced = 0;
    state.arcEnd = 0;
    state.smallTies = 0;
    curve = 0;
    bendKind = null;
    lastBendEmit = -1;
    busy = false;
    canvas.style.cursor = '';
  }

  function reset() {
    const wasActive = active;
    resetState();
    if (wasActive) {
      ensureMode();
      showModeDot();
      emit();
      toastForMode();
    }
  }

  function update(dt, elapsed) {
    if (bindingAnimation) {
      const animation = bindingAnimation;
      animation.elapsed += dt;
      const progress = Math.min(1, animation.elapsed / animation.duration);
      setWrapProgress(animation.wrap, progress);
      if (progress === 1) { bindingAnimation = null; animation.done(); }
    }
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i];
      if (tw.session !== session) { tweens.splice(i, 1); continue; }
      tw.t += dt;
      const k = tw.ease(Math.min(1, tw.t / tw.duration));
      if (tw.kind === 'material') {
        for (const key of Object.keys(tw.to)) tw.target[key] = tw.from[key] + (tw.to[key] - tw.from[key]) * k;
      } else {
        for (const key of ['x', 'y', 'z']) {
          if (key in tw.to) tw.target[key] = tw.from[key] + (tw.to[key] - tw.from[key]) * k;
        }
      }
      if (tw.t >= tw.duration) {
        tweens.splice(i, 1);
        tw.done?.();
      }
    }
    if (arcFlight) {
      const f = arcFlight; f.t = Math.min(1, f.t + dt / .9);
      const points = f.from.map((p, i) => p.clone().lerp(f.to[i], easeInOut(f.t)));
      f.arc.geometry.dispose();
      f.arc.geometry = bambooRodGeometry(points, .0078);
      if (f.t === 1) {
        arcFlight = null; busy = false; state.mode = 'bindArc'; state.arcEnd = 0;
        if (active) showModeDot(); emit();
        onToast?.('弧骨已对齐 · 先用棉花纸捻扎紧第一端');
      }
    }
    if (!active) return;
    if (bending) bendStep(dt);
    if (ghostDot?.visible) {
      const pulse = 1 + Math.sin(elapsed * 4.2) * .12;
      ghostDot.scale.setScalar(pulse);
      ghostDot.userData.ring.rotation.z = elapsed * .7;
      ghostDot.userData.halo.material.opacity = .5 + Math.sin(elapsed * 3.1) * .14;
    }
    if (sparklePoints && sparkleLife > 0) {
      sparkleLife -= dt;
      const pos = sparklePoints.geometry.attributes.position;
      for (let i = 0; i < sparkleVel.length; i++) {
        const vel = sparkleVel[i];
        pos.setXYZ(i, pos.getX(i) + vel.x * dt, pos.getY(i) + vel.y * dt, pos.getZ(i) + vel.z * dt);
        vel.y -= .35 * dt;
      }
      pos.needsUpdate = true;
      sparklePoints.material.opacity = Math.max(0, sparkleLife / 2.0);
      if (sparkleLife <= 0) {
        root.remove(sparklePoints);
        sparklePoints.geometry.dispose();
        sparklePoints.material.dispose();
        sparklePoints = null;
      }
    }
    if (stepDone()) {
      frameLayer.rotation.y += dt * .12;
      bindLayer.rotation.y += dt * .12;
    }
  }

  function snapshot() {
    return {
      benchId: 'assembly',
      active, canBack: active && history.length > 0, canSkip: canSkip(),
      mode: stepDone() ? 'done' : state.mode,
      step: currentStep(),
      arcs: state.arcsPlaced,
      arcsPlaced: state.arcsPlaced,
      arcEnd: state.arcEnd, smallTies: state.smallTies,
      curve: +curve.toFixed(3),
      inventory: { ...inventory },
      busy: !!busy,
      binding: bindingAnimation ? { progress: bindingAnimation.wrap.userData.progress, phase: bindingAnimation.wrap.userData.phase } : null,
      selected: allowedKey(),
      draggable: allowedKey(),
      drag: drag?.key || null,
      placeHoop: !!placingHoop,
      hoop: placingHoop ? projected(placingHoop) : null,
      hoopPos: placingHoop ? {
        x: +placingHoop.position.x.toFixed(3),
        y: +placingHoop.position.y.toFixed(3),
        z: +placingHoop.position.z.toFixed(3)
      } : null,
      dot: ghostDot?.visible ? projected(ghostDot) : null,
      work: workGroup.visible ? projected(workGroup) : null,
      done: stepDone(),
      frameChildren: frameLayer.children.length,
      bindChildren: bindLayer.children.length
    };
  }

  function dispose() {
    for (const previous of history) previous.layers.forEach(disposeTree);
    history.length = 0;
    session++;
    clearTimers();
    canvas.removeEventListener('pointerdown', onCanvasDown);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onCancel);
    bench.group.remove(root);
  }

  function onCanvasDown(event) {
    if (!active || busy || blocked()) return;
    if (event.target !== canvas) return;
    if ((state.mode === 'collectBig' || state.mode === 'collectSmall') && event.button === 0) {
      setPointer(event);
      if (placingHoop && ray.intersectObject(placingHoop, true).length) {
        event.preventDefault(); pick();
      }
      return;
    }
    if (state.mode === 'placeArc' && event.button === 0) {
      event.preventDefault();
      startHoopDrag(event);
      return;
    }
    if (!bendKind || !state.mode.startsWith('bend')) return;
    if (event.button !== 0 && event.button !== 2) return;
    event.preventDefault();
    startBending(event.button === 2 ? -1 : 1);
  }

  function onMove(event) {
    if (!active) return;
    if (hoopDrag) updateHoopDrag(event);
    else if (drag) updateDrag(event);
  }

  function onUp(event) {
    if (!active) return;
    if (hoopDrag) {
      finishHoopDrag(event);
      return;
    }
    if (bending) {
      stopBending();
      return;
    }
    if (drag) finishDrag(event);
  }

  function onCancel() {
    if (!active) return;
    bending = null;
    hoopDrag = null;
    cancelDrag();
  }

  canvas.addEventListener('pointerdown', onCanvasDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onCancel);

  resetState();

  return {
    open, close, reset, update, dispose, snapshot, beginPartDrag, pick, skip, back,
    get hasHistory() { return history.length > 0; },
    get craft() { return { root, frameLayer, bindLayer }; },
    get active() { return active; },
    get engaged() { return state.mode !== 'waitingParts'; },
    get state() { return state; },
    get busy() { return busy; }
  };
}
