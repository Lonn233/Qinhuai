import {isTempleInteriorPosition} from './import-temple-visibility.js';
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

// Two shrub/conifer clumps immediately beside the Tianxia Wenshu lion lanterns.
// Remove these placements only; retain the same plants elsewhere in the map.
const REMOVED_LION_SHRUB_INSTANCES = new Set([
  "Obj3d66-646323-52-867",
  "Obj3d66-646323-53-935",
  "Obj3d66-646323-55-222",
  "Obj3d66-646323-56-948",
  "Obj3d66-646323-57-502",
  "Obj3d66-646323-58-863",
  "Obj3d66-646323-59-947",
  "Obj3d66-646323-60-829",
  "Obj3d66-646323-61-993",
  "Obj3d66-646323-62-128",
  "Obj3d66-646323-63-565",
  "Obj3d66-646323-64-470",
  "Obj3d66-646323-65-336",
  "Obj3d66-646323-66-566",
  "Obj3d66-646323-67-167",
  "Obj3d66-646323-68-790",
  "Obj3d66-646323-69-030",
  "Obj3d66-646323-70-288",
  "Obj3d66-646323-71-871",
  "Obj3d66-646323-72-186",
  "Obj3d66-646323-73-380",
  "Obj3d66-646323-74-501",
  "Obj3d66-646323-75-856",
  "Obj3d66-646323-76-833",
  "Obj3d66-646323-77-734",
  "Obj3d66-646323-78-876",
  "Obj3d66-646323-52-869",
  "Obj3d66-646323-53-937",
  "Obj3d66-646323-55-224",
  "Obj3d66-646323-56-950",
  "Obj3d66-646323-57-504",
  "Obj3d66-646323-58-865",
  "Obj3d66-646323-59-949",
  "Obj3d66-646323-60-831",
  "Obj3d66-646323-61-995",
  "Obj3d66-646323-62-130",
  "Obj3d66-646323-63-567",
  "Obj3d66-646323-64-472",
  "Obj3d66-646323-65-338",
  "Obj3d66-646323-66-568",
  "Obj3d66-646323-67-169",
  "Obj3d66-646323-68-792",
  "Obj3d66-646323-69-031",
  "Obj3d66-646323-70-290",
  "Obj3d66-646323-71-873",
  "Obj3d66-646323-72-188",
  "Obj3d66-646323-73-382",
  "Obj3d66-646323-74-503",
  "Obj3d66-646323-75-858",
  "Obj3d66-646323-76-835",
  "Obj3d66-646323-77-736",
  "Obj3d66-646323-78-878",
]);
// Left lion-side tree and its flower/grass mound, removed by placement.
const REMOVED_LION_FLOWER_INSTANCES = new Set([
  "Obj3d66-646323-52-868",
  "Obj3d66-646323-53-936",
  "Obj3d66-646323-55-223",
  "Obj3d66-646323-56-949",
  "Obj3d66-646323-57-503",
  "Obj3d66-646323-58-864",
  "Obj3d66-646323-59-948",
  "Obj3d66-646323-60-830",
  "Obj3d66-646323-61-994",
  "Obj3d66-646323-62-129",
  "Obj3d66-646323-63-566",
  "Obj3d66-646323-64-471",
  "Obj3d66-646323-65-337",
  "Obj3d66-646323-66-567",
  "Obj3d66-646323-67-168",
  "Obj3d66-646323-68-791",
  "Obj3d66-646323-69-032",
  "Obj3d66-646323-70-289",
  "Obj3d66-646323-71-872",
  "Obj3d66-646323-72-187",
  "Obj3d66-646323-73-381",
  "Obj3d66-646323-74-502",
  "Obj3d66-646323-75-857",
  "Obj3d66-646323-76-834",
  "Obj3d66-646323-77-735",
  "Obj3d66-646323-78-877",
]);
// Screenshot-selected tree beside the right lion, including its complete flower bed.
const REMOVED_LION_RIGHT_TREE_INSTANCES = new Set([
  "Obj3d66-646323-52-866",
  "Obj3d66-646323-53-934",
  "Obj3d66-646323-55-221",
  "Obj3d66-646323-56-947",
  "Obj3d66-646323-57-501",
  "Obj3d66-646323-58-862",
  "Obj3d66-646323-59-946",
  "Obj3d66-646323-60-828",
  "Obj3d66-646323-61-992",
  "Obj3d66-646323-62-127",
  "Obj3d66-646323-63-564",
  "Obj3d66-646323-64-469",
  "Obj3d66-646323-65-335",
  "Obj3d66-646323-66-565",
  "Obj3d66-646323-67-166",
  "Obj3d66-646323-68-789",
  "Obj3d66-646323-69-29",
  "Obj3d66-646323-70-287",
  "Obj3d66-646323-71-870",
  "Obj3d66-646323-72-185",
  "Obj3d66-646323-73-379",
  "Obj3d66-646323-74-500",
  "Obj3d66-646323-75-855",
  "Obj3d66-646323-76-832",
  "Obj3d66-646323-77-733",
  "Obj3d66-646323-78-875"
]);
export function retainStreetInstance(item, prototypes) {
  return retainStreetAsset(item.prototype, prototypes[item.prototype]) && !REMOVED_LION_SHRUB_INSTANCES.has(item.name) && !REMOVED_LION_FLOWER_INSTANCES.has(item.name) && !REMOVED_LION_RIGHT_TREE_INSTANCES.has(item.name);
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
      this.retained = data.instances.filter(item => retainStreetInstance(item, data.prototypes));
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
          const buckets = [[], [], [], []];
          for (const record of records) {
            const matrix = new THREE.Matrix4().fromArray(record.matrix).multiply(part.matrix);
            const mirrored = matrix.determinant() < 0;
            if (mirrored) matrix.multiply(REFLECT_X);
            const interior=id===9&&isTempleInteriorPosition(record.matrix[12],record.matrix[14]);
            buckets[Number(mirrored)+2*Number(interior)].push(matrix);
          }
          buckets.forEach((matrices, bucketIndex) => {
            const mirrored=!!(bucketIndex%2),interior=bucketIndex>=2;
            if (!matrices.length) return;
            const geometry = mirrored ? this.mirrored(part) : part.geometry;
            for (const bucket of spatialInstanceGroups(matrices, geometry, this.root.matrixWorld)) {
              const mesh = new THREE.InstancedMesh(geometry, part.material, bucket.length);
              mesh.name = manifest.prototypes[key].source; mesh.userData.restoredProxy = true;
              mesh.userData.templeInterior=interior;
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
