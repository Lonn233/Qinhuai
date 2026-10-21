import * as THREE from 'three';
import { spatialInstanceGroups } from './import-render-visibility.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const BASE = new URL('./assets/qinhuai-modern-import/restored/', import.meta.url);
const REFLECT_X = new THREE.Matrix4().makeScale(-1, 1, 1);
const REMOVED_STREET_ASSETS = new Set([
  '1c49fe21d2c2', '1b883e520902', 'aef95eaffbbe', '72ff35b1d880',
  '8e1610e700d2', '2433529e11e0', '33bece1beb09', 'c20fd31662d0', '0eee72f78bdb', 'b2235e4004eb',
]);
export function retainStreetAsset(id, prototype) {
  return prototype?.kind !== 'person' && !REMOVED_STREET_ASSETS.has(id);
}

// Original MAX proxy instances, independent of building materials and saved lighting.
export class ImportRestoredProxies {
  constructor(parent, { load = url => new GLTFLoader().loadAsync(url), fetchManifest = async () => {
    const response = await fetch(new URL('manifest.json', BASE));
    if (!response.ok) throw new Error('原场景补充模型清单 HTTP ' + response.status);
    return response.json();
  }} = {}) {
    this.root = new THREE.Group(); this.root.name = '原场景树木与街边物件'; parent.add(this.root);
    this.load = load; this.fetchManifest = fetchManifest;
    this.tiles = new Map(); this.pending = new Map(); this.prototypes = new Map(); this.failures = new Map();
    this.geometries = new Set(); this.materials = new Set(); this.textures = new Set();
    this.queue = []; this.active = 0; this.wireframe = false; this.disposed = false;
  }
  async manifestReady() {
    if (!this.manifestPromise) this.manifestPromise = this.fetchManifest().then(data => {
      if (data.version !== 1 || !data.instances?.length) throw new Error('原场景补充模型清单无效');
      this.manifest = data;
      this.retained = data.instances.filter(item => retainStreetAsset(item.prototype, data.prototypes[item.prototype]));
      return data;
    }).catch(error => { this.manifestPromise = null; throw error; });
    return this.manifestPromise;
  }
  async limited(task) {
    if (this.active >= 3) await new Promise(resolve => this.queue.push(resolve));
    else this.active++;
    try { if (this.disposed) throw new Error('补充模型图层已关闭'); return await task(); }
    finally { const next = this.queue.shift(); if (next) next(); else this.active--; }
  }
  prototypeReady(id) {
    if (!this.prototypes.has(id)) {
      const promise = this.limited(async () => {
        const rec = this.manifest.prototypes[id];
        const gltf = await this.load(new URL(rec.file, BASE).href);
        const object = gltf.scene; object.updateMatrixWorld(true); const parts = [];
        object.traverse(mesh => {
          if (!mesh.isMesh) return;
          this.geometries.add(mesh.geometry);
          for (const material of [mesh.material].flat()) {
            material.wireframe = this.wireframe;
            this.materials.add(material);
            for (const value of Object.values(material)) if (value?.isTexture) this.textures.add(value);
          }
          parts.push({ geometry: mesh.geometry, material: mesh.material, matrix: mesh.matrixWorld.clone() });
        });
        if (this.disposed) { this.disposeResources(); throw new Error('补充模型图层已关闭'); }
        return parts;
      }).catch(error => { this.prototypes.delete(id); throw error; });
      this.prototypes.set(id, promise);
    }
    return this.prototypes.get(id);
  }
  mirrored(part) {
    if (!part.mirror) {
      const geometry = part.geometry.clone().applyMatrix4(REFLECT_X);
      if (!geometry.index) geometry.setIndex(Array.from({length:geometry.attributes.position.count}, (_,i)=>i));
      const a = geometry.index.array;
      for (let i = 0; i < a.length; i += 3) [a[i+1], a[i+2]] = [a[i+2], a[i+1]];
      geometry.index.needsUpdate = true;
      const tangent = geometry.attributes.tangent;
      if (tangent) { for (let i=0;i<tangent.count;i++) tangent.setW(i,-tangent.getW(i)); tangent.needsUpdate=true; }
      this.geometries.add(geometry); part.mirror = geometry;
    }
    return part.mirror;
  }
  registerTile(id) {
    id = Number(id);
    if (this.disposed || this.tiles.has(id)) return Promise.resolve();
    if (this.pending.has(id)) return this.pending.get(id);
    const promise = (async () => {
      const manifest = await this.manifestReady();
      const instances = this.retained.filter(item => item.tile === id);
      const byPrototype = new Map();
      for (const instance of instances) {
        if (instance.matrix.length !== 16 || !instance.matrix.every(Number.isFinite)) throw new Error('补充模型坐标无效');
        if (!byPrototype.has(instance.prototype)) byPrototype.set(instance.prototype, []);
        byPrototype.get(instance.prototype).push(instance);
      }
      const prepared = await Promise.all([...byPrototype.keys()].map(async key => [key, await this.prototypeReady(key)]));
      if (this.disposed) return;
      const group = new THREE.Group(); group.name = '原场景补充物件 tile-' + id;
      this.root.updateWorldMatrix(true, false);
      let triangles=0;
      for (const [key, parts] of prepared) {
        const records = byPrototype.get(key);
        triangles += records.length * manifest.prototypes[key].triangles;
        for (const part of parts) {
          const buckets = [[], []];
          for (const record of records) {
            const matrix = new THREE.Matrix4().fromArray(record.matrix).multiply(part.matrix);
            const mirrored = matrix.determinant() < 0;
            if (mirrored) matrix.multiply(REFLECT_X);
            buckets[Number(mirrored)].push(matrix);
          }
          buckets.forEach((matrices, mirrored) => {
            if (!matrices.length) return;
            const geometry = mirrored ? this.mirrored(part) : part.geometry;
            for (const bucket of spatialInstanceGroups(matrices, geometry, this.root.matrixWorld)) {
              const mesh = new THREE.InstancedMesh(geometry, part.material, bucket.length);
              mesh.name = manifest.prototypes[key].source; mesh.userData.restoredProxy = true;
              mesh.userData.prototype = key; mesh.userData.kind = manifest.prototypes[key].kind;
              bucket.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
              mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingBox(); mesh.computeBoundingSphere();
              mesh.castShadow = false; mesh.receiveShadow = true;
              group.add(mesh);
            }
          });
        }
      }
      this.root.add(group); this.tiles.set(id,{ group, count:instances.length, triangles }); this.failures.delete(id);
    })().catch(error => { this.failures.set(id,error.message); throw error; }).finally(() => this.pending.delete(id));
    this.pending.set(id,promise); return promise;
  }
  setState({wireframe=this.wireframe}={}) {
    this.wireframe=wireframe;
    for (const material of this.materials) material.wireframe=wireframe;
  }
  get stats() {
    let batches = 0; this.root.traverse(mesh => { if (mesh.isInstancedMesh) batches++; });
    return { instances:[...this.tiles.values()].reduce((n,t)=>n+t.count,0), expected:this.retained?.length||0,
      excluded:(this.manifest?.instances.length||0)-(this.retained?.length||0),
      triangles:[...this.tiles.values()].reduce((n,t)=>n+t.triangles,0), prototypes:this.prototypes.size,
      tiles:[...this.tiles.keys()], pending:[...this.pending.keys()], failures:Object.fromEntries(this.failures),
      drawCalls:batches };
  }
  disposeResources() {
    for (const geometry of this.geometries) geometry.dispose(); this.geometries.clear();
    for (const material of this.materials) material.dispose(); this.materials.clear();
    for (const texture of this.textures) { texture.dispose(); texture.source?.data?.close?.(); } this.textures.clear();
  }
  dispose() {
    this.disposed=true; this.root.traverse(mesh=>{if(mesh.isInstancedMesh)mesh.dispose();});
    this.root.removeFromParent(); this.root.clear(); this.tiles.clear(); this.disposeResources();
  }
}
