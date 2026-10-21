import * as THREE from 'three';
import { XZSpatialIndex } from './import-spatial-index.mjs';
import { MAP_SCALE } from './import-performance-profiles.mjs';

export const RENDER_CELL_SIZE = 32 * MAP_SCALE;

// Keep shared geometry/materials, but avoid submitting a whole tile of instances
// when only one street is nearby. Bounds are still computed from all vertices.
export function spatialInstanceGroups(matrices, geometry, parentWorld, cellSize = RENDER_CELL_SIZE) {
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  const center = geometry.boundingBox.getCenter(new THREE.Vector3());
  const point = new THREE.Vector3(), groups = new Map();
  for (const matrix of matrices) {
    point.copy(center).applyMatrix4(matrix).applyMatrix4(parentWorld);
    const key = Math.floor(point.x / cellSize) + ':' + Math.floor(point.z / cellSize);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(matrix);
  }
  return groups.values();
}

// Own only wrapper visibility. Authored mesh visibility, collision references,
// shared resources and layer controls remain owned by their existing systems.
export class ImportRenderVisibility {
  constructor(cellSize = RENDER_CELL_SIZE) {
    this.index = new XZSpatialIndex(cellSize);
    this.cellSize = cellSize;
    this.records = [];
    this.known = new WeakSet();
    this.parents = new WeakMap();
    this.candidates = [];
    this.active = new Set();
    this.next = new Set();
    this.position = new THREE.Vector3(Infinity, Infinity, Infinity);
    this.dirty = true;
    this.enabled = false;
    this.radius = null;
    this.updates = 0;
    this.lastMs = 0;
  }
  register(root) {
    root.updateWorldMatrix(true, true);
    const meshes = [];
    const collect = object => {
      if (object.isSkinnedMesh || object.isLOD || object.animations?.length || object.userData.renderDynamic) return;
      if (object.isMesh && !this.known.has(object) && object.children.length === 0 &&
          object.frustumCulled && !object.morphTargetInfluences &&
          ![object.material].flat().some(material => material?.isShaderMaterial || material?.displacementMap)) meshes.push(object);
      for (const child of object.children) collect(child);
    };
    collect(root);
    const center = new THREE.Vector3();
    let added = 0;
    for (const mesh of meshes) {
      if (mesh.isInstancedMesh) mesh.computeBoundingBox();
      else if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      const localBounds = mesh.isInstancedMesh ? mesh.boundingBox : mesh.geometry.boundingBox;
      const bounds = localBounds.clone().applyMatrix4(mesh.matrixWorld);
      if (bounds.isEmpty() || ![...bounds.min.toArray(), ...bounds.max.toArray()].every(Number.isFinite)) continue;
      const parent = mesh.parent;
      // Subsequent asynchronous registrations may discover a wrapper's children.
      if (parent.userData.renderVisibilityCell) continue;
      bounds.getCenter(center);
      const key = Math.floor(center.x / this.cellSize) + ':' + Math.floor(center.z / this.cellSize);
      let cells = this.parents.get(parent);
      if (!cells) this.parents.set(parent, cells = new Map());
      let record = cells.get(key);
      if (!record) {
        const group = new THREE.Group();
        group.name = 'Render visibility cell ' + key;
        group.userData.renderVisibilityCell = true;
        parent.add(group);
        record = {group, parent, bounds: new THREE.Box3(), meshes: 0};
        cells.set(key, record); this.records.push(record);
      }
      record.bounds.union(bounds); record.meshes++;
      record.group.add(mesh); this.known.add(mesh); added++;
    }
    if (added) {
      this.index.clear();
      for (const record of this.records) this.index.insert(record);
      this.dirty = true;
    }
    return added;
  }
  update(position, radius = null) {
    const enabled = Number.isFinite(radius) && radius > 0;
    if (!this.dirty && enabled === this.enabled && radius === this.radius &&
        (!enabled || position.distanceToSquared(this.position) < .0025)) return;
    const start = performance.now();
    this.enabled = enabled; this.radius = radius; this.position.copy(position);
    if (!enabled) {
      for (const record of this.records) record.group.visible = true;
      this.active.clear();
    } else {
      // Distance-only broad phase also serves reflected/refracted cameras. Do not
      // use the main camera frustum: offscreen objects may appear in the water.
      // A small guard band prevents rapid toggles on cell boundaries.
      const r = radius + this.cellSize * .1;
      this.index.query(position.x-r, position.z-r, position.x+r, position.z+r, this.candidates);
      this.next.clear();
      for (const record of this.candidates) {
        if (record.bounds.distanceToPoint(position) <= r) this.next.add(record);
      }
      if (this.dirty || this.active.size === 0) {
        for (const record of this.records) record.group.visible = this.next.has(record);
      } else {
        for (const record of this.active) if (!this.next.has(record)) record.group.visible = false;
        for (const record of this.next) record.group.visible = true;
      }
      [this.active, this.next] = [this.next, this.active];
    }
    this.dirty = false; this.updates++; this.lastMs = performance.now() - start;
  }
  get stats() {
    return {enabled: this.enabled, cells: this.records.length,
      visibleCells: this.enabled ? this.active.size : this.records.length,
      meshes: this.records.reduce((sum, record) => sum + record.meshes, 0),
      candidates: this.enabled ? this.candidates.length : this.records.length,
      updateMs: this.lastMs, updates: this.updates, cellMeters: this.cellSize / MAP_SCALE};
  }
  dispose() {
    for (const {group, parent} of this.records) {
      for (const child of [...group.children]) parent.add(child);
      group.removeFromParent();
    }
    this.records.length = 0; this.active.clear(); this.next.clear();
    this.candidates.length = 0; this.index.clear();
    this.known = new WeakSet(); this.parents = new WeakMap(); this.dirty = true;
  }
}
