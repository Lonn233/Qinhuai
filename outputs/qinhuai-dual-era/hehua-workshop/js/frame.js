import * as THREE from 'three';
import { SMALL_STRIP_LENGTH } from './frame-profile.js';
import { buildBambooStrip } from './models.js';
import { glowTexture, radialShadowTexture, labelTexture } from './textures.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const PICK_MODES = ['pickLong', 'pickArc', 'pickSmall', 'toAssembly'];

export function createBambooStage({
  bench, materials: M, camera, renderer, audio, inventory,
  onState, onToast
}) {
  const canvas = renderer.domElement;
  const root = new THREE.Group();
  root.name = 'BambooCraftRoot';
  root.position.set(0, .972, -.03);
  bench.group.add(root);

  const spin = new THREE.Group();
  root.add(spin);

  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let session = 0, active = false, hoveredPick = null;

  const state = {
    mode: 'pickLong',
    arcs: 0
  };
  const pickupHistory = [];

  const shadowMat = new THREE.MeshBasicMaterial({
    map: radialShadowTexture(), transparent: true, opacity: .34, depthWrite: false
  });
  function addShadow(x, z, sx, sz) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(sx, sz), shadowMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, -.0012, z);
    spin.add(m);
    return m;
  }

  /* ---------- bamboo stock on the bench ---------- */
  const stock = new THREE.Group();
  spin.add(stock);

  // All strips face the player, with their near ends aligned on one baseline.
  const FRONT = .29;
  const lanes = [
    {x:-.56,length:.62,title:'大圈用篾',sub:'62 厘米'},
    {x:0,length:.40,title:'骨架用篾',sub:'40 厘米'},
    {x:.56,length:SMALL_STRIP_LENGTH,title:'小圈用篾',sub:'约 58.5 厘米'}
  ];
  function makeLane(lane) {
    const group = new THREE.Group();
    group.position.set(lane.x,.003,FRONT-lane.length/2);
    group.rotation.y=Math.PI/2;
    stock.add(group);
    addShadow(lane.x,group.position.z,.30,lane.length+.035);
    // Extra stock is individually collectable, just like the recipe pieces.
    const reserve=new THREE.Group();reserve.name='BambooReserve';
    reserve.position.copy(group.position);reserve.rotation.copy(group.rotation);stock.add(reserve);
    for(const z of [-.12,-.09,-.06,.06,.09,.12]){
      const raw=buildBambooStrip(M,{length:lane.length,width:.0105,thickness:.0028});
      raw.position.z=z;raw.userData.stockLength=lane.length;reserve.add(raw);
    }
    const plaque=new THREE.Mesh(new THREE.PlaneGeometry(.29,.105),new THREE.MeshBasicMaterial({map:labelTexture(lane.title,lane.sub)}));
    plaque.rotation.x=-Math.PI/2;plaque.position.set(lane.x,.003,FRONT+.11);spin.add(plaque);
    group.userData.stockLength=lane.length;
    return group;
  }
  const stockLong=makeLane(lanes[0]);stockLong.name='BambooLongStock';
  stockLong.add(buildBambooStrip(M,{length:.62,width:.0105,thickness:.003,marks:false}));
  const stockArc=makeLane(lanes[1]);stockArc.name='BambooArcStock';
  for(let i=0;i<3;i++){
    const raw=buildBambooStrip(M,{length:.40,width:.0105,thickness:.0028});
    raw.position.z=(i-1)*.025;stockArc.add(raw);
  }
  const stockSmall=makeLane(lanes[2]);stockSmall.name='BambooSmallStock';
  stockSmall.add(buildBambooStrip(M,{length:SMALL_STRIP_LENGTH,width:.0105,thickness:.0028}));

  /* ---------- hover highlight ---------- */
  const pickHalo = new THREE.Group();
  const haloRing = new THREE.Mesh(
    new THREE.TorusGeometry(.072, .0021, 5, 40),
    new THREE.MeshBasicMaterial({ color: '#ffc45f', transparent: true, opacity: .85, toneMapped: false })
  );
  haloRing.rotation.x = Math.PI / 2;
  pickHalo.add(haloRing);
  const haloGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture(), color: '#ffc260', transparent: true, opacity: .42,
    depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false
  }));
  haloGlow.scale.setScalar(.24);
  pickHalo.add(haloGlow);
  pickHalo.visible = false;
  spin.add(pickHalo);

  const pickTargets = [];
  const targetByHit = new Map();

  function registerPickTarget(mode, group, size, center, haloScale) {
    const hit = new THREE.Mesh(
      new THREE.BoxGeometry(size[0], size[1], size[2]),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    hit.position.set(center[0], center[1], center[2]);
    group.add(hit);
    const materials = [];
    const clones = new Map();
    const meshes = [];
    group.traverse(child => {
      if (child.isMesh && child !== hit && child.material) meshes.push(child);
    });
    const overlayMaterial = new THREE.MeshBasicMaterial({
      color: '#ffb44f', transparent: true, opacity: .4, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false
    });
    const overlays = [];
    for (const child of meshes) {
      const swap = material => {
        if (!clones.has(material)) {
          const clone = material.clone();
          clone.userData.pickOrigin = {
            emissive: clone.emissive ? clone.emissive.getHex() : null,
            intensity: clone.emissiveIntensity ?? 1
          };
          clones.set(material, clone);
        }
        return clones.get(material);
      };
      const original = child.material;
      child.material = Array.isArray(original) ? original.map(swap) : swap(original);
      const groupMaterials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of groupMaterials) {
        if (!materials.includes(material)) materials.push(material);
      }
      const overlay = new THREE.Mesh(child.geometry, overlayMaterial);
      overlay.position.copy(child.position);
      overlay.position.y += .0006;
      overlay.quaternion.copy(child.quaternion);
      overlay.scale.copy(child.scale).multiplyScalar(1.06);
      overlay.renderOrder = 2;
      overlay.visible = false;
      child.parent.add(overlay);
      overlays.push(overlay);
    }
    const entry = { id: `bamboo-${pickTargets.length}`, mode, group, hit, materials, overlays, overlayMaterial, haloScale };
    pickTargets.push(entry);
    targetByHit.set(hit, entry);
  }

  for (const lane of stock.children) {
    const length = lane.userData.stockLength || lane.children[0].userData.stockLength;
    const mode = length === .62 ? 'pickLong' : length === .4 ? 'pickArc' : 'pickSmall';
    for (const raw of [...lane.children]) {
      registerPickTarget(mode, raw, [length + .015, .025, .022], [0, .006, 0], .45);
    }
  }

  /* ---------- state ---------- */
  function stepDone() {
    return inventory.frame > 0;
  }

  function emit() {
    onState?.(snapshot());
  }

  function setMode(mode) {
    setPickHover(null);
    state.mode = mode;
    updateHalos();
    emit();
  }

  function refreshPickHalo() {
    const show = !!hoveredPick && PICK_MODES.includes(state.mode)
      && !stepDone() && hoveredPick.group.visible;
    pickHalo.visible = show;
    if (!show) return;
    const p = spin.worldToLocal(hoveredPick.group.getWorldPosition(V()));
    pickHalo.position.copy(p);
    pickHalo.position.y += .014;
    pickHalo.scale.setScalar(hoveredPick.haloScale || 1);
  }

  function updateHalos() {
    refreshPickHalo();
  }

  function restorePickMaterials(entry) {
    if (!entry) return;
    for (const material of entry.materials) {
      const base = material.userData.pickOrigin;
      if (!base) continue;
      if (material.emissive && base.emissive != null) material.emissive.setHex(base.emissive);
      if ('emissiveIntensity' in material) material.emissiveIntensity = base.intensity;
    }
    for (const overlay of entry.overlays) overlay.visible = false;
  }

  function setPickHover(entry) {
    if (hoveredPick === entry) return;
    restorePickMaterials(hoveredPick);
    hoveredPick = entry || null;
    if (hoveredPick) {
      for (const material of hoveredPick.materials) {
        if (!material.emissive) continue;
        material.emissive.set('#ffb45a');
        material.emissiveIntensity = 1.2;
      }
      for (const overlay of hoveredPick.overlays) overlay.visible = true;
    }
    updateHalos();
    canvas.style.cursor = hoveredPick ? 'pointer' : '';
  }

  function canPick() {
    return active && !stepDone() && PICK_MODES.includes(state.mode);
  }

  function updatePickHover(event) {
    if (event.target !== canvas) { setPickHover(null); return; }
    if (!canPick()) { setPickHover(null); return; }
    setPointer(event);
    const hits = ray.intersectObjects(pickTargets.filter(entry => entry.group.visible).map(entry => entry.hit), false);
    setPickHover(hits.length ? targetByHit.get(hits[0].object) : null);
  }

  /* ---------- pickups ---------- */
  function pick() {
    if (!canPick() || !hoveredPick?.group.visible) return false;
    const target = hoveredPick;
    const wasReady = state.mode === 'toAssembly';
    const previousMode = state.mode;
    const key = {pickLong:'longBamboo',pickArc:'arcBamboo',pickSmall:'smallBamboo'}[target.mode];
    pickupHistory.push({ target, key, previousMode });
    inventory[key] = (inventory[key] || 0) + 1;
    target.group.visible = false;
    state.arcs = inventory.arcBamboo || 0;
    audio?.pick?.();
    setMode(!inventory.longBamboo ? 'pickLong' : state.arcs < 3 ? 'pickArc'
      : !inventory.smallBamboo ? 'pickSmall' : 'toAssembly');
    if (!wasReady && state.mode === 'toAssembly') audio?.chime?.();
    onToast?.(state.mode === 'toAssembly' ? '竹篾已备齐 · 可继续收取，或前往合成台'
      : `已收入物品栏 · 长篾 ${Math.min(1, inventory.longBamboo || 0)}/1 · 弧骨篾 ${Math.min(3, state.arcs)}/3 · 圈篾 ${Math.min(1, inventory.smallBamboo || 0)}/1`);
    return true;
  }

  /* ---------- pointer ---------- */
  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      (event.clientX - rect.left) / rect.width * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    ray.setFromCamera(pointer, camera);
  }

  function projected(obj) {
    const world = obj.getWorldPosition(V());
    const p = world.project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + (p.x + 1) * rect.width / 2,
      y: rect.top + (1 - p.y) * rect.height / 2,
      z: p.z
    };
  }

  function onMove(event) {
    if (!active) return;
    updatePickHover(event);
  }

  function onCancel() {
    if (!active) return;
    canvas.style.cursor = '';
  }

  function onPointerLeave() { setPickHover(null); }

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('pointerleave', onPointerLeave);

  /* ---------- lifecycle ---------- */
  function skip() {
    if (!canPick()) return false;
    const target = pickTargets.find(entry => entry.mode === state.mode && entry.group.visible);
    if (!target) return false;
    setPickHover(target);
    return pick();
  }

  function back() {
    if (!active || !pickupHistory.length || !(inventory[pickupHistory.at(-1).key] > 0)) return false;
    const last = pickupHistory.pop();
    inventory[last.key] = Math.max(0, (inventory[last.key] || 0) - 1);
    last.target.group.visible = true;
    state.arcs = inventory.arcBamboo || 0;
    setPickHover(null);
    setMode(last.previousMode);
    onToast?.('已返回上一步 · 材料已放回台面');
    return true;
  }

  function resetState() {
    session++;
    pickupHistory.length = 0;
    pickTargets.forEach(entry => { entry.group.visible = true; });
    spin.rotation.set(0, 0, 0);
    canvas.style.cursor = '';

    state.mode = 'pickLong';
    state.arcs = 0;
    setPickHover(null);
    updateHalos();
  }

  function toastForMode() {
    if (stepDone()) onToast?.('骨架已在合成台搭成 · 按 F 可退出工作台');
    else if (state.mode.startsWith('pick')) onToast?.('台面竹篾均可收取 · 对准任意一根，高亮后按 E');
    else if (state.mode === 'toAssembly') onToast?.('竹篾已齐 · 按 F 离开竹篾台，到合成台按 F 开始弯制');
  }

  function open() {
    active = true;
    updateHalos();
    emit();
    toastForMode();
  }

  function close() {
    active = false;
    setPickHover(null);
    canvas.style.cursor = '';
  }

  function reset() {
    const wasActive = active;
    resetState();
    if (wasActive) {
      emit();
      toastForMode();
    }
  }

  function update(dt, elapsed) {
    if (!active) return;
    if (pickHalo.visible) {
      pickHalo.rotation.y = elapsed * .35;
      pickHalo.children[1].material.opacity = .26 + Math.sin(elapsed * 2.8) * .1;
      if (hoveredPick) hoveredPick.overlayMaterial.opacity = .36 + Math.sin(elapsed * 5.2) * .12;
    }
  }

  function snapshot() {
    return {
      benchId: 'bamboo',
      active,
      mode: stepDone() ? 'done' : state.mode,
      canSkip: active && !stepDone() && !!pickTargets.find(entry => entry.mode === state.mode && entry.group.visible),
      canBack: active && pickupHistory.length > 0 && inventory[pickupHistory.at(-1).key] > 0,
      step: 0,
      arcs: state.arcs,
      inventory: { ...inventory },
      busy: false,
      selected: null,
      activeStock: null,
      hover: hoveredPick?.mode || null,
      hoverId: hoveredPick?.id || null,
      pieces: pickTargets.map(entry => ({id:entry.id,mode:entry.mode,visible:entry.group.visible,...projected(entry.group)})),
      targets: {
        pickLong: projected(stockLong),
        pickArc: projected(stockArc),
        pickSmall: projected(stockSmall)
      },
      done: stepDone(),
      partsDone: stepDone() || state.mode === 'toAssembly',
      draggable: null
    };
  }

  function dispose() {
    session++;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointercancel', onCancel);
    canvas.removeEventListener('pointerleave', onPointerLeave);
    bench.group.remove(root);
  }

  resetState();

  return {
    open, close, reset, pick, skip, back, update, dispose, snapshot,
    get active() { return active; },
    get state() { return state; },
    get busy() { return false; }
  };
}
