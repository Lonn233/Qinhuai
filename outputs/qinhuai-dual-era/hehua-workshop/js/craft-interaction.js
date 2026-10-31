import * as THREE from 'three';

// Shared screen-space picking keeps small craft targets usable on portrait screens.
export function createCraftInteraction({ camera, renderer, parent, enabled, target, source, allow, onDrop, onClick, createDragObject, keepTargetFixed = false }) {
  const canvas = renderer.domElement;
  const getParent = () => typeof parent === 'function' ? parent() : parent;
  const dot = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(.012, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff8ca, depthTest: false }));
  const ring = new THREE.Mesh(new THREE.RingGeometry(.024, .029, 32), new THREE.MeshBasicMaterial({ color: 0xf7cd70, side: THREE.DoubleSide, transparent: true, opacity: .9, depthTest: false }));
  core.renderOrder = ring.renderOrder = 100;
  dot.add(core, ring);
  getParent()?.add(dot);
  let drag = null;
  let pointer = { x: -1000, y: -1000 };
  const project = point => {
    if (!point) return null;
    camera.updateMatrixWorld(true);
    const p = point.clone().project(camera), r = canvas.getBoundingClientRect();
    return { x: r.left + (p.x + 1) * r.width / 2, y: r.top + (1 - p.y) * r.height / 2 };
  };
  const near = (a, b, radius = 65) => !!a && !!b && Math.hypot(a.x - b.x, a.y - b.y) < radius;
  function begin(key, x, y) {
    if (!enabled() || !allow(key)) return false;
    const item = source?.();
    const object = item?.object || createDragObject?.(key) || null;
    drag = { key, x, y, startX: x, startY: y, object, generated: !!object && !item?.object, home: item?.object?.position.clone() || null, depth: item?.object ? camera.position.distanceTo(item.object.getWorldPosition(new THREE.Vector3())) : 1.8 };
    canvas.style.cursor = 'grabbing';
    return true;
  }
  function down(e) {
    if (e.button !== 0 || !enabled()) return;
    pointer = { x: e.clientX, y: e.clientY };
    const s = source();
    if (s && near(pointer, project(s.point), 70)) { begin(s.key, e.clientX, e.clientY); e.preventDefault(); }
    else if (near(pointer, project(target()))) onClick?.();
  }
  function move(e) {
    pointer = { x: e.clientX, y: e.clientY };
    if (drag) { drag.x = e.clientX; drag.y = e.clientY; }
  }
  function clear() {
    if (drag && !drag.generated && drag.home && drag.object) drag.object.position.copy(drag.home);
    if (drag?.generated && drag.object?.parent) {
      drag.object.removeFromParent(); drag.object.geometry?.dispose(); drag.object.material?.dispose?.();
    }
    drag = null; canvas.style.cursor = '';
  }
  function up(e) {
    if (!drag) return;
    const item = drag;
    const hit = enabled() && near({ x: e.clientX, y: e.clientY }, project(target()), 76);
    if (item.object && !item.generated) {
      if (hit) item.object.position.copy(item.object.parent.worldToLocal(target().clone()));
      else if (item.home) item.object.position.copy(item.home);
    }
    drag = null; canvas.style.cursor = '';
    const accepted = hit && onDrop(item.key, item.generated ? item.object : null);
    if (item.generated && !accepted && item.object?.parent) { item.object.removeFromParent(); item.object.geometry?.dispose(); item.object.material?.dispose?.(); }
  }
  canvas.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', clear);
  window.addEventListener('blur', clear);
  return {
    begin, clear, project,
    isPointed: () => near(pointer, project(target())),
    update(elapsed) {
      const p = enabled() && target(); dot.visible = !!p;
      if (p) {
        const owner = getParent();
        owner?.updateWorldMatrix(true, false);
        if (owner) {
          dot.position.copy(owner.worldToLocal(p.clone()));
          dot.quaternion.copy(owner.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(camera.quaternion));
        } else {
          dot.position.copy(p);
          dot.quaternion.copy(camera.quaternion);
        }
        ring.scale.setScalar(1 + Math.sin(elapsed * 4) * .12);
      }
      if (!enabled()) clear();
      if (drag) {
        const rect = canvas.getBoundingClientRect();
        const p = new THREE.Vector3(((drag.x - rect.left) / rect.width) * 2 - 1, 1 - ((drag.y - rect.top) / rect.height) * 2, 0).unproject(camera);
        const ray = p.sub(camera.position).normalize();
        const worldPoint = camera.position.clone().addScaledVector(ray, drag.depth);
        const owner = getParent();
        if (drag.object?.parent) {
          drag.object.position.copy(drag.object.parent.worldToLocal(worldPoint));
          if (drag.generated) drag.object.quaternion.copy(camera.quaternion);
        }
        if (!keepTargetFixed) dot.position.copy(owner ? owner.worldToLocal(worldPoint) : worldPoint);
      }
    },
    snapshot() { const s = source(); return { dot: project(target()), source: s ? { key: s.key, ...project(s.point) } : null, drag: drag?.key || null }; },
    dispose() {
      canvas.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', clear); window.removeEventListener('blur', clear);
      dot.removeFromParent(); core.geometry.dispose(); core.material.dispose(); ring.geometry.dispose(); ring.material.dispose();
    }
  };
}
