import * as THREE from 'three';
import { FRAME } from './frame-profile.js';
import { createCraftInteraction } from './craft-interaction.js';

const ORDER = ['needDip', 'dipBrush', 'lowerCoat', 'takeWhite', 'white', 'upperCoat', 'takeRed', 'red', 'done'];
const COPY = {
  needDip: ['蘸取浆糊', '拖动毛刷到浆糊罐并松开，完成蘸浆动作。'],
  dipBrush: ['蘸取浆糊', '拖动毛刷到浆糊罐并松开，完成蘸浆动作。'],
  lowerCoat: ['下半骨架刷浆', '将毛刷拖到骨架亮点，按 Q / R 转动骨架，逐处刷浆。'],
  takeWhite: ['收取白色无纺布', '按 E 一次收齐半圆形白色无纺布。'],
  white: ['贴下半白布', '从物品栏拖出半圆形无纺布，贴合下半骨架亮点。'],

  upperCoat: ['上半骨架刷浆', '将毛刷拖到上半骨架亮点，刷匀浆糊。'],
  takeRed: ['收取红色裱布', '按 E 一次收齐红色裱布。'],
  red: ['贴上半红色内衬', '从物品栏拖出红色裱布，贴合上半骨架亮点。'],
  done: ['裱糊已成', '下白上红，布面贴合。继续前往染料晾晒台制作花瓣。']
};

export function createPastingStage({ bench, assembly, materials: M, camera, renderer, audio, inventory, onState, onComplete, onBackBoundary, blocked }) {
  const tools = bench.group.userData.liningTools;
  const root = assembly.craft.root;
  const cloth = new THREE.Group(); cloth.name = 'PastedCloth'; root.add(cloth);
  const lowerMaterial = M.paperWhite.clone(); lowerMaterial.side = THREE.DoubleSide;
  const upperMaterial = M.paperWhite.clone(); upperMaterial.color.set('#b93440'); upperMaterial.side = THREE.DoubleSide;
  let mode = 'needDip', active = false, charge = 0, lower = 0, upper = 0, whites = 0, reds = 0, wait = 0, resume = 'lowerCoat', collecting = null, pendingPaste = null;
  const history = [];
  const brushHome = tools.brush.position.clone();
  const brushRestRotation = tools.brush.rotation.clone();
  let brushAction = null;
  const brushRestQuaternion = tools.brush.quaternion.clone();
  function remember() {
    history.push({ mode, charge, lower, upper, whites, reds, resume, rotation: root.rotation.y, inventory: { ...inventory }, panels: cloth.children.length });
  }
  function back() {
    if (!active || wait || blocked()) return false;
    if (!history.length) return assembly.hasHistory ? onBackBoundary?.() : false;
    const previous = history.pop();
    ({ mode, charge, lower, upper, whites, reds, resume } = previous);
    if (mode === 'takeWhite') { tools.nonwoven.visible = true; tools.nonwoven.scale.setScalar(1); tools.nonwoven.position.set(0, 0, 0); }
    if (mode === 'takeRed') { tools.lining.visible = true; tools.lining.scale.setScalar(1); tools.lining.position.set(0, 0, 0); }
    Object.assign(inventory, previous.inventory);
    root.rotation.y = previous.rotation;
    while (cloth.children.length > previous.panels) {
      const child = cloth.children.at(-1); child.removeFromParent(); child.geometry.dispose(); child.material.dispose();
    }
    wait = 0; interaction.clear(); emit(); return true;
  }
  const local = new THREE.Vector3();
  const world = (x, y, z) => root.localToWorld(new THREE.Vector3(x, y, z));
  function target() {
    root.updateWorldMatrix(true, true);
    if (['needDip', 'dipBrush'].includes(mode)) return tools.paste.getWorldPosition(local.clone()).add(new THREE.Vector3(0, .12, 0));
    if (mode === 'takeWhite') return tools.nonwoven.getWorldPosition(local.clone()).add(new THREE.Vector3(.73, 1.03, .28));
    if (mode === 'takeRed') return tools.lining.getWorldPosition(local.clone()).add(new THREE.Vector3(.82, 1.03, -.27));
    if (mode === 'done') return null;
    const top = ['upperCoat', 'red'].includes(mode), n = top ? (mode === 'red' ? reds : upper) : (mode === 'white' ? whites : lower);
    const a = (n % 6) * Math.PI / 3 + Math.PI / 6;
    if (top) {
      const radius = (FRAME.bigRadius + FRAME.smallRadius) / 2;
      return world(Math.cos(a) * radius, (FRAME.bigY + FRAME.smallY) / 2, Math.sin(a) * radius);
    }
    const theta = Math.PI * .75;
    const radius = FRAME.bigRadius * Math.sin(theta);
    return world(Math.cos(a) * radius, FRAME.bigY + FRAME.bigRadius * Math.cos(theta), Math.sin(a) * radius);
  }
  function source() {
    const object = ['needDip', 'lowerCoat', 'upperCoat'].includes(mode) ? tools.brush : null;
    return object ? { key: 'brush', object, point: object.getWorldPosition(new THREE.Vector3()) } : null;
  }
  function allowed() {
    return mode === 'white' ? 'nonwoven' : mode === 'red' ? 'lining' : ['needDip', 'lowerCoat', 'upperCoat'].includes(mode) ? 'brush' : null;
  }
  function startBrushAction(kind) {
    const parent = tools.brush.parent;
    parent.updateWorldMatrix(true, false);
    const point = parent.worldToLocal(target().clone());
    const direction = kind === 'dip'
      ? new THREE.Vector3(0, -1, 0)
      : new THREE.Vector3(0, -.55, .835).normalize();
    if (kind === 'dip') point.y -= .025; // brush tip dips just below the paste surface
    const toQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
    const fromPosition = tools.brush.position.clone();
    const fromQuaternion = tools.brush.quaternion.clone();
    const toPosition = point.clone().addScaledVector(direction, -.168); // .168 m from handle pivot to the bristle tip
    const tangent = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();
    brushAction = { kind, elapsed: 0, duration: kind === 'dip' ? .82 : .96, fromPosition, fromQuaternion, toPosition, toQuaternion, direction, tangent };
  }
  function createDragObject(key) {
    if (!['nonwoven', 'lining'].includes(key) || inventory[key] <= 0) return null;
    const shape = new THREE.Shape();
    const a0 = -.18, a1 = 1.22, ri = .035, ro = .155;
    shape.moveTo(Math.cos(a0) * ri, Math.sin(a0) * ri);
    shape.lineTo(Math.cos(a0) * ro, Math.sin(a0) * ro);
    shape.absarc(0, 0, ro, a0, a1, false);
    shape.lineTo(Math.cos(a1) * ri, Math.sin(a1) * ri);
    shape.absarc(0, 0, ri, a1, a0, true); shape.closePath();
    const geometry = new THREE.ShapeGeometry(shape);
    const material = (key === 'nonwoven' ? lowerMaterial : upperMaterial).clone();
    material.depthTest = false; material.side = THREE.DoubleSide;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 110;
    mesh.userData.inventoryDrag = true;
    bench.group.add(mesh);
    return mesh;
  }
  const interaction = createCraftInteraction({ camera, renderer, parent: bench.group, enabled: () => active && !wait && !blocked(), target, source, allow: key => key === allowed() && (!['nonwoven', 'lining'].includes(key) || inventory[key] > 0), createDragObject, onDrop: (key, object) => {
    if (object && ['white', 'red'].includes(mode)) return act(key, false, object);
    if (object?.parent) { object.removeFromParent(); object.geometry.dispose(); object.material.dispose(); }
    startBrushAction(['needDip', 'dipBrush'].includes(mode) ? 'dip' : 'paint'); return act(key);
  } });
  function emit() { if (active) onState(snapshot()); }
  function change(next, milestone = false) { mode = next; if (milestone) audio.chime(); emit(); }
  function panel(top, index, opacity = 1) {
    let geo;
    if (top) geo = new THREE.CylinderGeometry(FRAME.smallRadius * 1.015, FRAME.bigRadius * 1.015, FRAME.smallY - FRAME.bigY, 16, 1, true, index * Math.PI / 3, Math.PI / 3);
    else geo = new THREE.SphereGeometry(FRAME.bigRadius * 1.015, 16, 12, index * Math.PI / 3, Math.PI / 3, Math.PI / 2, Math.PI / 2);
    const faceMaterial = (top ? upperMaterial : lowerMaterial).clone();
    faceMaterial.transparent = opacity < 1; faceMaterial.opacity = opacity;
    const mesh = new THREE.Mesh(geo, faceMaterial);
    mesh.position.y = top ? (FRAME.smallY + FRAME.bigY) / 2 : FRAME.bigY;
    mesh.castShadow = true; mesh.receiveShadow = true; cloth.add(mesh);
    return mesh;
  }
  function collect(group, key, next) {
    collecting = { group, key, next };
    wait = .62;
    audio?.pick?.();
    emit();
  }
  function act(key, fast = false, dragObject = null) {
    if (mode === 'done' || (!fast && (wait || blocked()))) return false;
    if (!fast && key !== allowed()) return false;
    remember();
    if (mode === 'needDip' || mode === 'dipBrush') {
      charge = 3; change(resume); wait = fast ? 0 : .82;
    }
    else if (mode === 'lowerCoat' || mode === 'upperCoat') {
      const top = mode === 'upperCoat';
      if (top) upper++; else lower++;
      charge--;
      if ((top ? upper : lower) === 6) change(top ? 'takeRed' : 'takeWhite', true);
      else if (!charge) { resume = mode; change('needDip'); }
      else emit();
      if (!fast) wait = .96;
    } else if (mode === 'takeWhite') { if (fast) { inventory.nonwoven = 6; change('white'); } else collect(tools.nonwoven, 'nonwoven', 'white'); }
    else if (mode === 'white' || mode === 'red') {
      const top = mode === 'red', key = top ? 'lining' : 'nonwoven';
      if (inventory[key] <= 0) return false;
      if (dragObject && !fast) {
        const destination = target().clone();
        pendingPaste = { object: dragObject, key, top, index: top ? reds : whites, from: dragObject.getWorldPosition(new THREE.Vector3()), to: destination, elapsed: 0, duration: .78, panel: null };
        inventory[key]--; wait = .78;
        emit(); return true;
      }
      panel(top, top ? reds++ : whites++); inventory[key]--;
      if (!top && whites === 6) {
        resume = 'upperCoat'; charge = 3;
        change('upperCoat', true);
      }
      else if (top && reds === 6) { inventory.frame = 0; inventory.pastedFrame = 1; change('done', true); onComplete(); }
      else emit();
    } else if (mode === 'takeRed') { if (fast) { inventory.lining = 6; change('red'); } else collect(tools.lining, 'lining', 'red'); }

    if (!fast && !wait) wait = .28;
    emit(); return true;
  }
  function snapshot() {
    const step = mode === 'done' ? 2 : ['needDip', 'dipBrush', 'lowerCoat'].includes(mode) && lower < 6 ? 0 : ['takeWhite', 'white'].includes(mode) ? 1 : 2;
    return { active, canBack: active && (history.length > 0 || assembly.hasHistory), canSkip: active && mode !== 'done', phase: 2, phaseLabel: '第二步 · 裱糊', benchId: 'assembly', mode, step, labels: ['蘸浆刷下骨', '贴白色无纺布', '刷上骨贴红布'], taskName: COPY[mode][0], taskHint: COPY[mode][1], progress: mode === 'done' ? 1 : (lower + whites + upper + reds) / 24, inventory: { ...inventory }, selected: allowed(), draggable: ['nonwoven', 'lining'].includes(allowed()) ? allowed() : null, busy: !!wait, done: mode === 'done', charge, lower, upper, whites, reds, hints: [{ key: 'E', text: '收取布料' }, { icon: 'drag', text: '拖动材料或台面工具至亮点' }, { key: 'Q / R', text: '旋转骨架' }], ...interaction.snapshot() };
  }
  return {
    open() { active = true; tools.futureProps.forEach(o => { o.visible = false; }); emit(); },
    close() { active = false; interaction.clear(); }, snapshot,
    beginPartDrag: (key, x, y) => interaction.begin(key, x, y),
    pick() { return ['dipBrush', 'takeWhite', 'takeRed'].includes(mode) ? act(null) : false; },
    key(code) { if (code === 'KeyQ' || code === 'KeyR') { root.rotation.y += (code === 'KeyQ' ? -1 : 1) * Math.PI / 6; emit(); } },
    update(dt, elapsed) {
      if (active && !blocked()) {
        const before = wait;
        wait = Math.max(0, wait - dt);
        if (pendingPaste) {
          const p = pendingPaste;
          p.elapsed = Math.min(p.duration, p.elapsed + dt);
          const t = p.elapsed / p.duration;
          const eased = t * t * (3 - 2 * t);
          const point = p.from.clone().lerp(p.to, eased);
          p.object.position.copy(p.object.parent.worldToLocal(point));
          p.object.scale.setScalar(1 - .48 * eased);
          p.object.rotation.z = Math.sin(t * Math.PI) * .2;
          p.object.material.opacity = t < .62 ? 1 : Math.max(0, 1 - (t - .62) / .38);
          if (t > .56 && !p.panel) p.panel = panel(p.top, p.index, .01);
          if (p.panel) {
            p.panel.material.opacity = Math.min(1, (t - .56) / .44);
            p.panel.material.transparent = p.panel.material.opacity < 1;
          }
        }
        if (collecting) {
          const t = 1 - wait / .62;
          collecting.group.scale.setScalar(Math.max(.02, 1 - t));
          collecting.group.position.y = -.12 * t;
        }
        if (wait && brushAction) {
          const motion = brushAction;
          motion.elapsed = Math.min(motion.duration, motion.elapsed + dt);
          const t = motion.elapsed / motion.duration;
          const approach = motion.kind === 'dip' ? Math.min(1, t / .68) : Math.min(1, t / .62);
          const travel = approach * approach * (3 - 2 * approach);
          tools.brush.position.lerpVectors(motion.fromPosition, motion.toPosition, travel);
          tools.brush.quaternion.slerpQuaternions(motion.fromQuaternion, motion.toQuaternion, travel);
          if (motion.kind === 'dip' && t > .68) tools.brush.position.addScaledVector(motion.direction, .012 * Math.sin((t - .68) / .32 * Math.PI));
          if (motion.kind === 'paint' && t > .48) {
            const stroke = (t - .48) / .52;
            tools.brush.position.addScaledVector(motion.tangent, .032 * Math.sin(stroke * Math.PI));
            tools.brush.position.addScaledVector(motion.direction, .009 * Math.sin(stroke * Math.PI));
          }
        }
        if (before && !wait) {
          if (pendingPaste) {
            const p = pendingPaste;
            p.object.removeFromParent();
            p.object.geometry.dispose();
            p.object.material.dispose();
            pendingPaste = null;
            if (p.panel) {
              p.panel.material.opacity = 1;
              p.panel.material.transparent = false;
            } else panel(p.top, p.index);
            if (p.top) reds++;
            else whites++;
            if (!p.top && whites === 6) {
              resume = 'upperCoat'; charge = 3;
              change('upperCoat', true);
            }
            else if (p.top && reds === 6) {
              inventory.frame = 0;
              inventory.pastedFrame = 1;
              change('done', true);
              onComplete();
            }
            emit();
          }
          if (collecting) {
            const { group, key, next } = collecting;
            group.visible = false;
            group.scale.setScalar(1);
            group.position.set(0, 0, 0);
            inventory[key] = 6;
            collecting = null;
            change(next, true);
          }
          tools.brush.position.copy(brushHome);
          tools.brush.rotation.copy(brushRestRotation);
          tools.brush.quaternion.copy(brushRestQuaternion);
          brushAction = null;
          emit();
        }
      }
      interaction.update(elapsed);
    },
    back,
    skip() { if (!active || wait || blocked()) return false; return act(allowed(), true); },
    batch() { for (let i = 0; i < 80 && mode !== 'done'; i++) act(allowed(), true); wait = 0; emit(); if (mode === 'done') onComplete(); },
    reset() { history.length = 0; for (const child of [...cloth.children]) { child.geometry.dispose(); cloth.remove(child); } mode = 'needDip'; charge = lower = upper = whites = reds = wait = 0; resume = 'lowerCoat'; inventory.frame = 1; inventory.pastedFrame = inventory.nonwoven = inventory.lining = 0; tools.nonwoven.visible = tools.lining.visible = true; tools.nonwoven.scale.setScalar(1); tools.lining.scale.setScalar(1); tools.nonwoven.position.set(0, 0, 0); tools.lining.position.set(0, 0, 0); collecting = null; if (pendingPaste?.object?.parent) { pendingPaste.object.removeFromParent(); pendingPaste.object.geometry.dispose(); pendingPaste.object.material.dispose(); } pendingPaste = null; root.rotation.y = 0; interaction.clear(); emit(); },
    get busy() { return !!wait; }
  };
}
