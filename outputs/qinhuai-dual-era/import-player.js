import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const PLAYER_SCALE = 0.3212121212121212;
export class ImportPlayer {
  constructor(parent, camera, {load = url => new GLTFLoader().loadAsync(url), surface, obstacles = () => [], queryObstacles, onReady = () => {}} = {}) {
    this.root = new THREE.Group(); this.root.name = '学生主角'; parent.add(this.root);
    this.camera = camera; this.load = load; this.surface = surface; this.obstacles = obstacles; this.onReady = onReady;
    this.position = this.root.position; this.velocity = new THREE.Vector3();
    this.forward = new THREE.Vector3(); this.right = new THREE.Vector3(); this.input = new THREE.Vector3();
    this.target = new THREE.Vector3(); this.desired = new THREE.Vector3(); this.ray = new THREE.Raycaster();
    this.queryObstacles = queryObstacles; this.cameraMeshes = []; this.cameraHits = []; this.armEnd = new THREE.Vector3();
    this.mode = 'orbit'; this.spawned = false; this.yaw = 0; this.pitch = Math.PI / 4;
    this.distance = 3.8 * PLAYER_SCALE; this.actions = new Map(); this.state = 'Idle'; this.disposed = false;
    this.root.visible = false;
  }
  ready() {
    if (!this.loading) this.loading = this.load(new URL('./assets/player/student.glb', import.meta.url).href).then(gltf => {
      if (this.disposed) { this.release(gltf.scene); return; }
      this.error = null;
      this.avatar = gltf.scene; this.avatar.scale.setScalar(PLAYER_SCALE); this.root.add(this.avatar);
      this.avatar.traverse(mesh => { if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; } });
      this.mixer = new THREE.AnimationMixer(this.avatar);
      const roots = new Set(); this.avatar.traverse(node => { if (node.isBone && !node.parent?.isBone) roots.add(node.name); });
      for (const source of gltf.animations) {
        const clip = source.clone();
        // Keep vertical gait bob, but locomotion is owned by collision-aware movement.
        for (const track of clip.tracks) {
          const node = track.name.slice(0, track.name.lastIndexOf('.'));
          if (track.name.endsWith('.position') && roots.has(node)) {
            const firstX = track.values[0], firstZ = track.values[2];
            for (let i = 0; i < track.values.length; i += 3) { track.values[i] = firstX; track.values[i + 2] = firstZ; }
          }
        }
        this.actions.set(clip.name, this.mixer.clipAction(clip));
      }
      const tracks = [];
      this.avatar.traverse(bone => {
        if (!bone.isBone) return;
        const p = bone.position.toArray(), q = bone.quaternion.toArray();
        const breathed = [...p]; if (roots.has(bone.name)) breathed[1] += .004;
        tracks.push(new THREE.VectorKeyframeTrack(bone.name + '.position', [0, 1.5, 3], [...p, ...breathed, ...p]));
        tracks.push(new THREE.QuaternionKeyframeTrack(bone.name + '.quaternion', [0, 3], [...q, ...q]));
      });
      this.actions.set('Idle', this.mixer.clipAction(new THREE.AnimationClip('Idle', 3, tracks)));
      this.actions.get('Idle').play(); this.updateCamera(0, true);
      this.onReady(this.avatar);
      return this;
    }).catch(error => { this.loading = null; this.error = error.message; throw error; });
    return this.loading;
  }
  spawn({x, z, ground}) { this.position.set(x, ground, z); this.spawned = true; }
  stop() { this.velocity.set(0, 0, 0); this.setAnimation('Idle'); }
  setMode(mode) {
    const previous = this.mode; this.stop(); this.mode = mode;
    this.root.visible = this.spawned && mode === 'thirdPerson';
    this.camera.getWorldDirection(this.forward);
    this.yaw = Math.atan2(-this.forward.x, -this.forward.z);
    if (mode === 'firstPerson') {
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.set(previous === 'thirdPerson' ? 0 : this.camera.rotation.x, this.yaw, 0);
    }
    if (mode === 'thirdPerson') this.pitch = Math.PI / 4;
    this.updateCamera(0, true);
  }
  look(dx, dy) {
    this.yaw -= dx * .004;
    this.pitch = THREE.MathUtils.clamp(this.pitch + dy * .004, .15, 1.3);
  }
  zoom(delta) { this.distance = THREE.MathUtils.clamp(this.distance * Math.exp(delta * .001), .65, 2.5); }
  setAnimation(name) {
    if (name === this.state || !this.actions.has(name)) return;
    this.actions.get(this.state)?.fadeOut(.18);
    this.actions.get(name).reset().fadeIn(.18).play(); this.state = name;
  }
  update(delta, keys) {
    if (this.spawned && this.mode !== 'orbit') {
      const x = Number(keys.has('KeyD')) - Number(keys.has('KeyA'));
      const z = Number(keys.has('KeyW')) - Number(keys.has('KeyS'));
      const run = keys.has('ShiftLeft') || keys.has('ShiftRight');
      if (this.mode === 'thirdPerson') this.forward.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
      else { this.camera.getWorldDirection(this.forward); this.forward.y = 0; this.forward.normalize(); }
      this.right.crossVectors(this.forward, THREE.Object3D.DEFAULT_UP).normalize();
      this.input.copy(this.forward).multiplyScalar(z).addScaledVector(this.right, x).normalize();
      const speed = (run ? 4.2 : 1.45) * PLAYER_SCALE;
      this.velocity.lerp(this.input.multiplyScalar(speed), 1 - Math.exp(-14 * delta));
      const oldX = this.position.x, oldZ = this.position.z;
      for (const axis of ['x', 'z']) {
        const displacement = this.velocity[axis] * delta;
        // Static ground does not need two triangle raycasts on every idle frame.
        // Keep normal sweeps and wall sliding for every meaningful movement.
        if (Math.abs(displacement) < 1e-7) continue;
        const next = this.position[axis] + displacement;
        const y = this.surface(axis === 'x' ? next : this.position.x, axis === 'z' ? next : this.position.z,
          this.position.y, this.position.x, this.position.z);
        if (y !== null) { this.position[axis] = next; this.position.y = y; }
        else this.velocity[axis] = 0;
      }
      const dx = this.position.x - oldX, dz = this.position.z - oldZ;
      const moving = Math.hypot(dx, dz) > delta * .01;
      this.setAnimation(moving ? (run ? 'Running' : 'Walking') : 'Idle');
      if (moving && this.avatar) {
        const yaw = Math.atan2(dx, dz);
        this.avatar.rotation.y += Math.atan2(Math.sin(yaw - this.avatar.rotation.y), Math.cos(yaw - this.avatar.rotation.y)) * (1 - Math.exp(-15 * delta));
      }
      this.updateCamera(delta);
    }
    if (this.spawned && this.mode === 'thirdPerson') this.mixer?.update(delta);
  }
  updateCamera(delta, snap = false) {
    if (!this.spawned || this.mode === 'orbit') return;
    if (this.mode === 'firstPerson') { this.camera.position.copy(this.position); this.camera.position.y += .53; return; }
    this.target.copy(this.position); this.target.y += 1.05 * PLAYER_SCALE;
    this.desired.set(Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), Math.cos(this.yaw) * Math.cos(this.pitch));
    this.ray.set(this.target, this.desired); this.ray.far = this.distance; this.ray.near = .04;
    this.armEnd.copy(this.target).addScaledVector(this.desired, this.distance);
    this.cameraMeshes.length = 0; this.cameraHits.length = 0;
    if (this.queryObstacles) this.queryObstacles(this.target, this.armEnd, this.cameraMeshes);
    else for (const obstacle of this.obstacles()) this.cameraMeshes.push(obstacle.mesh || obstacle);
    const hits = this.ray.intersectObjects(this.cameraMeshes, false, this.cameraHits);
    const distance = hits.length ? Math.max(.12, hits[0].distance - .08) : this.distance;
    this.desired.multiplyScalar(distance).add(this.target);
    this.camera.position.lerp(this.desired, snap || hits.length ? 1 : 1 - Math.exp(-12 * delta));
    this.camera.lookAt(this.target);
  }
  get stats() { return {ready:!!this.avatar, error:this.error || null, mode:this.mode, position:this.position.toArray(), animation:this.state,
    clips:[...this.actions.keys()], heightMeters:1.7, pitchDegrees:this.pitch * 180 / Math.PI}; }
  release(object) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    object?.traverse(node => { if (!node.isMesh) return; geometries.add(node.geometry); if (node.isSkinnedMesh) node.skeleton.dispose();
      for (const mat of [node.material].flat()) { materials.add(mat); for (const val of Object.values(mat)) if (val?.isTexture) textures.add(val); } });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => { t.dispose(); t.source?.data?.close?.(); });
  }
  dispose() { if (this.disposed) return; this.disposed = true; this.stop(); this.mixer?.stopAllAction(); if (this.avatar) this.mixer.uncacheRoot(this.avatar);
    this.release(this.avatar); this.root.removeFromParent(); }
}
