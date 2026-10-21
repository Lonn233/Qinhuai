import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import layout from './assets/golden-tree-lanterns/layout.json' with { type: 'json' };

const ASSET = new URL('./assets/golden-tree-lanterns/golden-lantern-lod.glb', import.meta.url);
const UP = new THREE.Vector3(0, 1, 0);

// Explicit gate-tree allowlist; this layer never edits building materials or saved presets.
export class GoldenTreeLanternLayer {
  constructor(parent, { load = url => new GLTFLoader().loadAsync(url) } = {}) {
    this.root = new THREE.Group(); this.root.name = 'GoldenLanterns-GateTrees'; parent.add(this.root);
    this.load = load; this.tiles = new Map(); this.pending = new Map(); this.failures = new Map();
    this.geometries = new Set(); this.materials = new Set(); this.textures = new Set();
    this.fabric = []; this.halos = []; this.night = true; this.wireframe = false; this.disposed = false;
  }
  modelReady() {
    if (!this.promise) this.promise = this.load(ASSET.href).then(gltf => {
      const source = gltf.scene; source.updateMatrixWorld(true); const parts = [];
      source.traverse(mesh => {
        if (!mesh.isMesh) return;
        this.geometries.add(mesh.geometry);
        const convert = material => {
          this.materials.add(material);
          for (const value of Object.values(material)) if (value?.isTexture) this.textures.add(value);
          const fabric = material.clone(); fabric.name = 'GoldenLanternFabric';
          fabric.metalness = 0; fabric.roughness = .78; fabric.emissiveMap = fabric.map;
          fabric.emissive.set('#ffe0a1'); fabric.emissiveIntensity = 0;
          this.materials.add(fabric); this.fabric.push(fabric); return fabric;
        };
        parts.push({ geometry: mesh.geometry, material: Array.isArray(mesh.material) ? mesh.material.map(convert) : convert(mesh.material), matrix: mesh.matrixWorld.clone() });
      });
      if (this.disposed) { this.disposeResources(); throw new Error('Golden lantern layer is closed'); }
      if (!parts.length) throw new Error('Golden lantern model has no meshes');
      this.parts = parts; this.setState(); return parts;
    }).catch(error => { this.promise = null; throw error; });
    return this.promise;
  }
  registerTile(id) {
    id = Number(id);
    if (this.disposed || this.tiles.has(id)) return Promise.resolve();
    if (this.pending.has(id)) return this.pending.get(id);
    const trees = layout.trees.filter(tree => tree.tile === id);
    if (!trees.length) return Promise.resolve();
    const promise = (async () => {
      const parts = await this.modelReady(); if (this.disposed) return;
      const group = new THREE.Group(); group.name = 'GoldenTreeLanterns-tile-' + id;
      const mounts = [];
      for (const tree of trees) {
        const matrix = new THREE.Matrix4().fromArray(tree.matrix);
        layout.anchors[tree.prototype].slice(0, tree.count).forEach((anchor, index) => {
          const branch = new THREE.Vector3(...anchor).applyMatrix4(matrix);
          const cordLength = (.1 + (index % 3) * .025) * layout.mapUnitsPerMeter;
          mounts.push({ tree: tree.name, branch, top: branch.clone().addScaledVector(UP, -cordLength), cordLength, rotation: index * 2.39996 });
        });
      }
      const height = layout.lanternHeightMeters * layout.mapUnitsPerMeter;
      const min = layout.sourceBounds.min, max = layout.sourceBounds.max;
      const scale = height / (max[1] - min[1]);
      const origin = new THREE.Matrix4().makeTranslation(-(min[0] + max[0]) / 2, -max[1], -(min[2] + max[2]) / 2);
      const quaternion = new THREE.Quaternion(), matrix = new THREE.Matrix4();
      for (const part of parts) {
        const batch = new THREE.InstancedMesh(part.geometry, part.material, mounts.length);
        batch.name = 'GoldenLanternBodies'; batch.receiveShadow = true;
        mounts.forEach((mount, i) => {
          quaternion.setFromAxisAngle(UP, mount.rotation);
          matrix.compose(mount.top, quaternion, new THREE.Vector3(scale, scale, scale)).multiply(origin).multiply(part.matrix);
          batch.setMatrixAt(i, matrix);
        });
        batch.instanceMatrix.needsUpdate = true; batch.computeBoundingBox(); batch.computeBoundingSphere(); group.add(batch);
      }
      if (!this.cordGeometry) {
        this.cordGeometry = new THREE.CylinderGeometry(.0025 * layout.mapUnitsPerMeter, .0025 * layout.mapUnitsPerMeter, 1, 5);
        this.cordMaterial = new THREE.MeshStandardMaterial({ color: '#57422b', roughness: .9 });
        this.geometries.add(this.cordGeometry); this.materials.add(this.cordMaterial);
      }
      const cords = new THREE.InstancedMesh(this.cordGeometry, this.cordMaterial, mounts.length); cords.name = 'GoldenLanternHangingCords';
      mounts.forEach((mount, i) => {
        matrix.makeScale(1, mount.cordLength, 1).setPosition(mount.branch.clone().addScaledVector(UP, -mount.cordLength / 2));
        cords.setMatrixAt(i, matrix);
      });
      cords.instanceMatrix.needsUpdate = true; cords.computeBoundingBox(); cords.computeBoundingSphere(); group.add(cords);
      const haloMaterial = new THREE.ShaderMaterial({
        uniforms: { power: { value: 0 }, tint: { value: new THREE.Color('#ffc65c') } },
        vertexShader: 'varying vec2 vUv; void main(){vUv=uv;vec4 center=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);center.xy+=position.xy*length(instanceMatrix[0].xyz);gl_Position=projectionMatrix*center;}',
        fragmentShader: 'varying vec2 vUv;uniform float power;uniform vec3 tint;void main(){float r=length(vUv-.5)*2.;float glow=exp(-r*r*5.)*pow(max(0.,1.-r),2.);gl_FragColor=vec4(tint,glow*power);}',
        transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending, toneMapped: false
      });
      const haloGeometry = new THREE.PlaneGeometry(1, 1);
      this.materials.add(haloMaterial); this.geometries.add(haloGeometry);
      const halo = new THREE.InstancedMesh(haloGeometry, haloMaterial, mounts.length); halo.name = 'GoldenLanternSoftHalos'; halo.renderOrder = 4;
      mounts.forEach((mount, i) => {
        matrix.makeScale(height * 1.65, height * 1.65, height * 1.65).setPosition(mount.top.clone().addScaledVector(UP, -height * .36));
        halo.setMatrixAt(i, matrix);
      });
      halo.instanceMatrix.needsUpdate = true; halo.computeBoundingSphere(); group.add(halo); this.halos.push(halo);
      group.userData.mounts = mounts; this.root.add(group);
      this.tiles.set(id, { group, trees: trees.length, lamps: mounts.length }); this.failures.delete(id); this.setState();
    })().catch(error => { this.failures.set(id, error.message); throw error; }).finally(() => this.pending.delete(id));
    this.pending.set(id, promise); return promise;
  }
  setState({ night = this.night, wireframe = this.wireframe } = {}) {
    this.night = night; this.wireframe = wireframe; const active = night && !wireframe;
    for (const material of this.materials) if (material.isMeshStandardMaterial) material.wireframe = wireframe;
    for (const material of this.fabric) material.emissiveIntensity = active ? .85 : 0;
    for (const halo of this.halos) { halo.visible = active; halo.material.uniforms.power.value = active ? .17 : 0; }
  }
  get stats() {
    const tiles = [...this.tiles.values()];
    return { trees: tiles.reduce((n,t) => n + t.trees, 0), lamps: tiles.reduce((n,t) => n + t.lamps, 0),
      expected: layout.trees.reduce((n,t) => n + t.count, 0), trianglesPerLantern: layout.triangles,
      tiles: [...this.tiles.keys()], pending: [...this.pending.keys()], failures: Object.fromEntries(this.failures),
      drawCalls: tiles.reduce((n,t) => n + t.group.children.length, 0) };
  }
  disposeResources() {
    for (const geometry of this.geometries) geometry.dispose(); this.geometries.clear();
    for (const material of this.materials) material.dispose(); this.materials.clear();
    for (const texture of this.textures) { texture.dispose(); texture.source?.data?.close?.(); } this.textures.clear();
  }
  dispose() {
    if (this.disposed) return; this.disposed = true;
    this.root.traverse(mesh => { if (mesh.isInstancedMesh) mesh.dispose(); });
    this.root.removeFromParent(); this.root.clear(); this.tiles.clear(); this.halos.length = 0; this.fabric.length = 0; this.disposeResources();
  }
}
