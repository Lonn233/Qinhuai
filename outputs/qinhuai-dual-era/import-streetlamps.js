import * as THREE from 'three';
import { spatialInstanceGroups } from './import-render-visibility.js';
import {groundControls,applyGroundControls} from './import-light-effects.mjs';
import {normalizeMapLights} from './import-light-controls.mjs';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_URL = new URL('./assets/qinhuai-modern-import/streetlamps/streetlamp-low.glb', import.meta.url);
export const STREETLAMP_HEIGHT = 1.24;
const GROUND = 11.864055383674;
const TEMPLE_GROUND = 11.86148106083;
// Surveyed road-edge locations in normalized map coordinates, not meters.
export const STREETLAMP_PLACEMENTS = Object.freeze([
  ...[-29, -36, -43].map(z => ({ tile: 9, route: 'temple-east', x: 1.9, z, y: TEMPLE_GROUND, rotation: Math.PI })),
  ...[-29, -36, -42].map(z => ({ tile: 9, route: 'temple-west', x: -18.5, z, y: TEMPLE_GROUND, rotation: 0 })),
  ...[-12, -4].map(x => ({ tile: 9, route: 'north-lane', x, z: -43.2, y: TEMPLE_GROUND, rotation: -Math.PI / 2 })),
  ...[-31, -39].map(z => ({ tile: 10, route: 'east-lane', x: 24, z, y: GROUND, rotation: Math.PI })),
  ...[-28, -20, -12, -4, 4, 12, 20, 28, 36, 44].map(x => ({ tile: 6, route: 'market-north', x, z: 12.2, y: GROUND, rotation: Math.PI / 2 })),
  { tile: 9, route: 'forecourt', x: -10.4, z: -20.5, y: TEMPLE_GROUND, rotation: 0 },
  ...[14, 22, 30, 38, 46].map(x => ({ tile: 10, route: 'river-road', x, z: -15.5, y: [14, 22, 46].includes(x) ? 11.864312816886 : GROUND, rotation: Math.PI / 2 })),
  { tile: 10, route: 'riverside', x: 44, z: .9, y: GROUND, rotation: -Math.PI / 2 },
].map(Object.freeze));

function clothMaterial(source, night) {
  const material = source.clone();
  material.emissive?.setHex(0);
  material.onBeforeCompile = shader => {
    shader.uniforms.qhStreetlampNight = night;
    shader.fragmentShader = 'uniform float qhStreetlampNight;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
      #include <emissivemap_fragment>
      // Sample the original painted fabric; neutral metal stays unlit.
      float cloth = smoothstep(.045, .16, diffuseColor.r - diffuseColor.b)
        * smoothstep(.065, .22, diffuseColor.r)
        * smoothstep(.035, .12, diffuseColor.g);
      totalEmissiveRadiance += diffuseColor.rgb * vec3(1.0, .94, .82)
        * cloth * qhStreetlampNight * 1.8;
    `);
  };
  material.customProgramCacheKey = () => 'qh-streetlamp-cloth-v1';
  return material;
}

function groundMaterial(night, ground) {
  return new THREE.ShaderMaterial({
    uniforms: { qhStreetlampNight: night, ...ground },
    vertexShader: `varying vec2 vUv; uniform float mapGroundRadius; uniform float mapGroundStretch;
      void main() {
        vUv = uv;
        vec3 localPosition = position; localPosition.xz *= mapGroundRadius; localPosition.z *= mapGroundStretch;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(localPosition, 1.0);
      }`,
    fragmentShader: `varying vec2 vUv;
      uniform float qhStreetlampNight; uniform float mapGroundIntensity; uniform float mapGroundFalloff;
      void main() {
        float r = length(vUv - .5) * 2.0;
        float falloff = exp(-r * r * 3.8 * mapGroundFalloff) * (1.0 - smoothstep(.65, 1.0, r));
        gl_FragColor = vec4(.75, .39, .09, falloff * .18 * qhStreetlampNight * mapGroundIntensity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false, polygonOffset: true,
    polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  });
}

export class ImportStreetlamps {
  constructor(parent, { load = () => new GLTFLoader().loadAsync(MODEL_URL.href) } = {}) {
    this.root = new THREE.Group();
    this.root.name = 'Roadside lanterns - repaired Blender model';
    parent.add(this.root);
    this.load = load;
    this.night = { value: 0 };
    this.groundLight = groundControls();
    this.tiles = new Map();
    this.pending = new Map();
    this.parts = [];
    this.disposed = false;
    this.wireframe = false;
    this.spillGeometry = new THREE.PlaneGeometry(1.6, 1.6);
    this.spillGeometry.rotateX(-Math.PI / 2);
    this.spillMaterial = groundMaterial(this.night, this.groundLight);
  }

  setMapLightSettings(settings) {
    const p = normalizeMapLights(settings);
    applyGroundControls(this.groundLight,p,'street');
  }

  async prepare() {
    if (this.loading) return this.loading;
    this.loading = (async () => {
      const gltf = await this.load();
      const model = gltf.scene;
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const scale = STREETLAMP_HEIGHT / (box.max.y - box.min.y);
      const normalize = new THREE.Matrix4().makeScale(scale, scale, scale)
        .multiply(new THREE.Matrix4().makeTranslation(.0995, -box.min.y, 0));
      const textures = new Set();
      const sourceGeometry = new Set();
      const sourceMaterials = new Set();
      model.traverse(mesh => {
        if (!mesh.isMesh) return;
        sourceGeometry.add(mesh.geometry);
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach(material => {
          sourceMaterials.add(material);
          Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); });
        });
        this.parts.push({
          geometry: mesh.geometry.clone().applyMatrix4(normalize.clone().multiply(mesh.matrixWorld)),
          material: Array.isArray(mesh.material)
            ? mesh.material.map(material => clothMaterial(material, this.night))
            : clothMaterial(mesh.material, this.night),
        });
      });
      sourceGeometry.forEach(geometry => geometry.dispose());
      sourceMaterials.forEach(material => material.dispose());
      this.textures = textures;
      if (this.disposed) this.disposeResources();
    })().catch(error => { this.loading = null; throw error; });
    return this.loading;
  }

  registerTile(id) {
    if (this.disposed || this.tiles.has(id)) return Promise.resolve();
    if (this.pending.has(id)) return this.pending.get(id);
    const locations = STREETLAMP_PLACEMENTS.filter(item => item.tile === id);
    if (!locations.length) return Promise.resolve();
    const pending = this.prepare().then(() => {
      if (this.disposed) return;
      const group = new THREE.Group();
      group.name = `roadside-lamps-tile-${id}`;
      const matrix = new THREE.Matrix4();
      this.root.updateWorldMatrix(true, false);
      const matrices = locations.map(item => new THREE.Matrix4().makeRotationY(item.rotation).setPosition(item.x, item.y, item.z));
      for (const part of this.parts) {
        for (const bucket of spatialInstanceGroups(matrices, part.geometry, this.root.matrixWorld)) {
          const mesh = new THREE.InstancedMesh(part.geometry, part.material, bucket.length);
          mesh.name = 'Original four-lantern streetlamp';
          mesh.castShadow = false;
          mesh.receiveShadow = true;
          bucket.forEach((placement, i) => mesh.setMatrixAt(i, placement));
          mesh.computeBoundingBox();
          mesh.computeBoundingSphere();
          group.add(mesh);
        }
      }
      const spill = new THREE.InstancedMesh(this.spillGeometry, this.spillMaterial, locations.length);
      spill.name = 'Soft warm pavement spill';
      spill.userData.streetlampSpill = true;
      spill.frustumCulled = false; // Shader radius may extend beyond the original instance bounds.
      locations.forEach((item, i) => {
        const offset = new THREE.Vector3(.11, .008, 0).applyAxisAngle(THREE.Object3D.DEFAULT_UP, item.rotation);
        matrix.makeTranslation(item.x + offset.x, item.y + offset.y, item.z + offset.z);
        spill.setMatrixAt(i, matrix);
      });
      spill.computeBoundingSphere();
      group.add(spill);
      this.tiles.set(id, { group, count: locations.length });
      this.root.add(group);
      this.setState({ wireframe: this.wireframe });
    }).finally(() => this.pending.delete(id));
    this.pending.set(id, pending);
    return pending;
  }

  setState({ night = this.night.value > 0, wireframe = this.wireframe } = {}) {
    this.wireframe = wireframe;
    this.night.value = night && !wireframe ? 1 : 0;
    for (const part of this.parts) {
      for (const material of [part.material].flat()) material.wireframe = wireframe;
    }
    this.root.traverse(mesh => {
      if (mesh.userData.streetlampSpill) mesh.visible = !!night && !wireframe;
    });
  }

  get stats() {
    return { lamps: [...this.tiles.values()].reduce((sum, tile) => sum + tile.count, 0),
      tiles: [...this.tiles.keys()], night: this.night.value > 0,
      sharedModelParts: this.parts.length, height: STREETLAMP_HEIGHT };
  }

  disposeResources() {
    for (const part of this.parts.splice(0)) {
      part.geometry.dispose();
      for (const material of [part.material].flat()) material.dispose();
    }
    this.textures?.forEach(texture => { texture.dispose(); texture.source?.data?.close?.(); });
    this.textures?.clear();
  }

  dispose() {
    this.disposed = true;
    this.root.traverse(mesh => { if (mesh.isInstancedMesh) mesh.dispose(); });
    this.root.removeFromParent();
    this.root.clear(); this.tiles.clear();
    this.disposeResources();
    this.spillGeometry.dispose(); this.spillMaterial.dispose();
  }
}
