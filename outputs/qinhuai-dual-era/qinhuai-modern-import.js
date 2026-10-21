import {BUILDING_LIGHT_KEY,mountBuildingControls} from './import-building-controls.mjs';
import {DragonWallLighting} from './import-dragon-lighting.js';
import {DRAGON_STORAGE_KEY,mountDragonControls} from './import-dragon-controls.mjs';
import {RedLanternLayer} from './red-lantern-layer.js';
import {RED_LANTERN_KEY,readRedLantern} from './red-lantern-settings.mjs';
import * as THREE from 'three';
import {MAP_LIGHT_STORAGE_KEY, readMapLights, mountMapLightControls} from './import-light-controls.mjs';
import {ENVIRONMENT_STORAGE_KEY,mountEnvironmentControls} from './import-environment-controls.mjs';
import {environmentCameraPose} from './import-environment-focus.mjs';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {EnvironmentSystem, DAY_LIGHT_PRESETS, TIME_PRESETS} from './import-environment-system.js';
import {RiverSystem} from './import-river-system.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ImportNightLighting, GATE_LIGHT_PRESETS } from './import-night-lighting.js?v=night-11-gate-alignment';

import { repairGateRoof, disposeGateRoofRepair } from './import-gate-roof-repair.js';
import { ImportRestoredProxies } from './import-restored-proxies.js';
import { GoldenTreeLanternLayer } from './golden-tree-lantern-layer.js';
import { CourtyardLanternLayer } from './courtyard-lantern-layer.js';
import { ImportStreetlamps } from './import-streetlamps.js';
import { ImportFestivalLanterns } from './import-festival-lanterns.js';
import {FeatureLanternLayer} from './import-feature-lanterns.js';
import { ImportPlayer } from './import-player.js';
import { installImportPerformanceAudit } from './import-performance-audit.js';
import { XZSpatialIndex } from './import-spatial-index.mjs';
import { PERFORMANCE_PROFILES, performanceProfile, personFar } from './import-performance-profiles.mjs';
import { ImportRenderVisibility } from './import-render-visibility.js';

const root = document.querySelector('#app');
const statusEl = document.querySelector('#status');
const summaryEl = document.querySelector('#summary');
const progress = document.querySelector('#progress');
const progressTitle = document.querySelector('#progressTitle');
const progressText = document.querySelector('#progressText');
const progressBar = document.querySelector('#progressBar');
const errorsEl = document.querySelector('#errors');
const perfEl = document.querySelector('#perf');
const wireframeInput = document.querySelector('#wireframe');
const query = new URLSearchParams(location.search);
let activePerformanceProfile = performanceProfile(query.get('quality'));
const perfEnabled = query.get('perf') === '1';
const requestedMode = query.get('tile') === 'all' ? 'all' : 'near';
document.documentElement.classList.toggle('perf-on', perfEnabled);

window.__QINHUAI_STARTUP__?.stage('正在初始化 WebGL…');
const scene = new THREE.Scene();
const sceneFogColor = new THREE.Color(0xa7bbc7);
scene.background = new THREE.Color(0x8ea9bd);
scene.fog = new THREE.FogExp2(sceneFogColor, 0.00045);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.05, 3000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, PERFORMANCE_PROFILES[activePerformanceProfile].pixelRatio));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.94;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
root.appendChild(renderer.domElement);
renderer.domElement.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  window.__QINHUAI_STARTUP__?.fail(new Error('显卡上下文已丢失。请关闭不用的三维页面后重新加载。'));
});
renderer.debug.onShaderError = (gl, program, vertex, fragment) => {
  const message = gl.getProgramInfoLog(program) || gl.getShaderInfoLog(fragment) || gl.getShaderInfoLog(vertex) || '未知着色器错误';
  window.__QINHUAI_STARTUP__?.fail(new Error('着色器编译失败：' + message));
};

const hemi = new THREE.HemisphereLight(0xbfd8e9, 0x514d45, 0.72);
hemi.name = 'Sky and ground bounce';
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0cf, 2.75);
sun.name = 'Physical daylight sun';
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.00004;
sun.shadow.normalBias = 0.018;
sun.shadow.radius = 2.5;
scene.add(sun);
scene.add(sun.target);

const sunDir = new THREE.Vector3();
const sunTarget = new THREE.Vector3();
const environment = new EnvironmentSystem({scene,renderer,sun,hemi,sunDir,sunTarget});
// The boot sequence chooses day OR night after the controls have painted.

const modelRoot = new THREE.Group();
modelRoot.name = 'qinhuai-modern-import';
scene.add(modelRoot);
const renderVisibility = new ImportRenderVisibility();
function refreshRenderVisibility(tileRoot) {
  if (tileRoot) renderVisibility.register(tileRoot);
  renderVisibility.register(streetlamps.root);
  renderVisibility.register(restoredProxies.root);
  renderer.shadowMap.needsUpdate = true;
}
const restoredProxies = new ImportRestoredProxies(modelRoot);
const goldenTreeLanterns = new GoldenTreeLanternLayer(modelRoot);
const courtyardLanterns = new CourtyardLanternLayer(modelRoot, {trees:restoredProxies, lanterns:goldenTreeLanterns});
const streetlamps = new ImportStreetlamps(modelRoot);
const festivalLanterns = new ImportFestivalLanterns(modelRoot);
const featureLanterns = new FeatureLanternLayer(modelRoot);
const redLanterns = new RedLanternLayer(modelRoot);
window.addEventListener('storage',event=>{if(event.key===RED_LANTERN_KEY)redLanterns.configure(readRedLantern());});
window.addEventListener('focus',()=>redLanterns.configure(readRedLantern()));
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.dampingFactor = 0.075;
orbit.screenSpacePanning = true;
orbit.maxDistance = 2200;
const firstPerson = new PointerLockControls(camera, renderer.domElement);
// Codex's embedded browser and some hosted previews reject requestPointerLock.
// Keep first-person movement usable there with a normal drag-to-look fallback.
const isEmbeddedDocument = (() => {
  try { return window.self !== window.top; } catch (_) { return true; }
})();
let pointerLockUnavailable = isEmbeddedDocument || typeof renderer.domElement.requestPointerLock !== 'function';
let fallbackDragging = false;
let fallbackLastX = 0;
let fallbackLastY = 0;
const fallbackLookSpeed = 0.004;
let controlMode = 'orbit';
let manifest = null;
let initialCamera = null;
let cameraRevision = 0;
orbit.addEventListener('start', () => { cameraRevision++; });
const loadedTiles = new Map();
const failedTiles = new Map();
const tileObjects = new Map();
const waterMeshes = new Set();
const originalMaterials = new Map();
const clock = new THREE.Clock();
const keys = new Set();
// Source model is normalized; these are scene units, not meters.
const WALK = Object.freeze({ eyeHeight: .53, stepUp: .32, stepDown: .40 });
const WALKABLE_NODES = new Set([
  'FuziTemple1082', 'FuziTemple1083', 'FuziTemple0014', 'FuziTemple0009',
  'FuziTemple0113', 'FuziTemple0325', 'FuziTemple0326', 'FuziTemple0327',
  // Narrow bridge, bank paving and the actual stair treads are too small for
  // the generic imported-floor size filter, but are valid walking surfaces.
  'FuziTemple0005', 'FuziTemple0006', 'FuziTemple0007', 'FuziTemple0012',
  'FuziTemple0015', 'FuziTemple0019', 'FuziTemple0020', 'FuziTemple0309',
]);
const WALK_BARRIER_NODES = new Set([
  // Keep the low retaining edges and bridge railings as blockers even though
  // their imported bounds are below the normal obstacle-height threshold.
  'FuziTemple0023', 'FuziTemple0024', 'FuziTemple0307',
]);
const walkableMeshes = [];
const walkableMeshSet = new Set();
const walkObstacles = [];
const walkObstacleSet = new Set();
const groundIndex = new XZSpatialIndex(16 * .3212121212121212);
const obstacleIndex = new XZSpatialIndex(16 * .3212121212121212);
const groundCandidates = [], nearbyObstacles = [], cameraObstacles = [], rayHits = [];
const groundOrigin = new THREE.Vector3();
const collisionMetrics = {queries:0, milliseconds:0, candidates:0};
const groundRay = new THREE.Raycaster();
const groundDown = new THREE.Vector3(0, -1, 0);
const obstacleRay = new THREE.Raycaster();
const obstacleCandidates = [];
const obstacleDirection = new THREE.Vector3();
const obstacleOrigin = new THREE.Vector3();
const groundNormal = new THREE.Vector3();
const groundNormalMatrix = new THREE.Matrix3();
let savedOrbit = null;
let controlRequest = 0;
const WALK_SURFACE_REJECT = /(water|river|lake|roof|wall|building|house|facade|ceiling|stair|step|tower|tree|lantern|light|pole|屋顶|墙|建筑|树|灯|柱)/;
const WALK_SURFACE_HINT = /(road|street|path|ground|floor|pavement|paving|tile|plaza|广场|道路|地面|路面|铺装|地砖)/;
const WALK_OBSTACLE_HINT = /(building|house|wall|facade|temple|pavilion|tower|gate|roof|column|pillar|建筑|房|墙|殿|亭|塔|门|柱)/;
function meshLabel(mesh) {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return `${mesh.name || ''} ${mesh.parent?.name || ''} ${materials.map(material => material?.name || '').join(' ')}`.toLowerCase();
}
function isWalkSurface(mesh, bounds) {
  if (waterMeshes.has(mesh)) return false;
  const size = bounds.getSize(new THREE.Vector3());
  if (size.x < 20 || size.z < 20 || size.y > 1.5 || bounds.max.y < 2) return false;
  const label = meshLabel(mesh);
  if (WALK_SURFACE_REJECT.test(label)) return false;
  // Road and paving meshes in the imported tiles do not always carry semantic
  // names, so large, thin, elevated horizontal meshes are valid by default.
  return WALK_SURFACE_HINT.test(label) || (size.x >= 40 && size.z >= 40);
}
function isWalkObstacle(mesh, bounds) {
  if (waterMeshes.has(mesh)) return false;
  const size = bounds.getSize(new THREE.Vector3());
  if (size.y < 1.5 || size.x < .35 || size.z < .35 || size.x > 90 || size.z > 90) return false;
  if (bounds.min.y > 14) return false;
  const label = meshLabel(mesh);
  if (WALK_SURFACE_HINT.test(label) || WALK_SURFACE_REJECT.test(label) && !WALK_OBSTACLE_HINT.test(label)) return false;
  // Only named architectural solids should block walking. The old height-only
  // fallback treated tall decorative groups and terrain props as walls.
  return WALK_OBSTACLE_HINT.test(label);
}
function registerWalkable(rootObject) {
  rootObject.updateWorldMatrix(true, true);
  rootObject.traverse(mesh => {
    if (!mesh.isMesh) return;
    const bounds = new THREE.Box3().setFromObject(mesh);
    let node = mesh;
    let explicitlyWalkable = false;
    let explicitlyBlocked = false;
    while (node && node !== rootObject) {
      if (WALKABLE_NODES.has(node.name)) {
        explicitlyWalkable = true;
      }
      if (WALK_BARRIER_NODES.has(node.name)) explicitlyBlocked = true;
      node = node.parent;
    }
    const surface = !explicitlyBlocked && (explicitlyWalkable || isWalkSurface(mesh, bounds));
    if (surface && !walkableMeshSet.has(mesh)) {
      walkableMeshSet.add(mesh);
      const record = { mesh, bounds }; walkableMeshes.push(record); groundIndex.insert(record);
    }
    if (!surface && (explicitlyBlocked || isWalkObstacle(mesh, bounds)) && !walkObstacleSet.has(mesh)) {
      walkObstacleSet.add(mesh);
      const record = { mesh, bounds }; walkObstacles.push(record); obstacleIndex.insert(record);
    }
  });
}
function groundAt(x, z, footY) {
  const tolerance = .015;
  groundRay.set(groundOrigin.set(x, footY + WALK.stepUp + tolerance, z), groundDown);
  groundRay.near = 0;
  groundRay.far = WALK.stepUp + WALK.stepDown + 2 * tolerance;
  let highest = null;
  groundIndex.query(x, z, x, z, groundCandidates);
  collisionMetrics.candidates += groundCandidates.length;
  for (const { mesh, bounds } of groundCandidates) {
    if (x < bounds.min.x || x > bounds.max.x || z < bounds.min.z || z > bounds.max.z) continue;
    rayHits.length = 0;
    for (const hit of groundRay.intersectObject(mesh, false, rayHits)) {
      if (!hit.face) continue;
      groundNormalMatrix.getNormalMatrix(mesh.matrixWorld);
      groundNormal.copy(hit.face.normal).applyMatrix3(groundNormalMatrix).normalize();
      if (groundNormal.y < .65) continue;
      const y = hit.point.y;
      if (y > footY + WALK.stepUp + tolerance || y < footY - WALK.stepDown - tolerance) continue;
      if (highest === null || y > highest) highest = y;
    }
  }
  return highest;
}
function isWalkBlocked(fromX, fromZ, x, z, footY) {
  const radius = .16;
  const dx = x - fromX, dz = z - fromZ;
  const distance = Math.hypot(dx, dz);
  const minX = Math.min(fromX, x) - radius, maxX = Math.max(fromX, x) + radius;
  const minZ = Math.min(fromZ, z) - radius, maxZ = Math.max(fromZ, z) + radius;
  obstacleCandidates.length = 0;
  obstacleIndex.query(minX, minZ, maxX, maxZ, nearbyObstacles);
  collisionMetrics.candidates += nearbyObstacles.length;
  for (const obstacle of nearbyObstacles) {
    const { bounds } = obstacle;
    if (bounds.max.y < footY + .12 || bounds.min.y > footY + WALK.eyeHeight - .08) continue;
    if (bounds.max.x < minX || bounds.min.x > maxX || bounds.max.z < minZ || bounds.min.z > maxZ) continue;
    obstacleCandidates.push(obstacle.mesh);
  }
  if (!obstacleCandidates.length) return false;

  // Bounds only narrow the candidate set. Test the actual architectural
  // triangles along the player's swept body instead of treating an entire
  // irregular building's AABB as a solid wall.
  obstacleRay.near = 0;
  obstacleRay.far = distance + radius;
  const stationary = distance < 1e-5;
  const directions = stationary ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : [[dx / distance, dz / distance]];
  for (const height of [.18, WALK.eyeHeight - .08]) {
    for (const [moveX, moveZ] of directions) {
      const sideX = -moveZ * radius;
      const sideZ = moveX * radius;
      for (const side of stationary ? [0] : [-1, 0, 1]) {
        obstacleOrigin.set(fromX + sideX * side, footY + height, fromZ + sideZ * side);
        obstacleDirection.set(moveX, 0, moveZ);
        obstacleRay.set(obstacleOrigin, obstacleDirection);
        rayHits.length = 0;
        if (obstacleRay.intersectObjects(obstacleCandidates, false, rayHits).length) return true;

        // Imported facade materials can be single-sided. A reverse sweep
        // detects the same thin wall when its visible face points away from
        // the attempted movement direction.
        obstacleOrigin.set(x + sideX * side, footY + height, z + sideZ * side);
        obstacleDirection.set(-moveX, 0, -moveZ);
        obstacleRay.set(obstacleOrigin, obstacleDirection);
        rayHits.length = 0;
        if (obstacleRay.intersectObjects(obstacleCandidates, false, rayHits).length) return true;
      }
    }
  }
  return false;
}
function walkSurfaceAt(x, z, footY, fromX = x, fromZ = z) {
  const started = performance.now();
  const ground = groundAt(x, z, footY);
  const result = ground === null || isWalkBlocked(fromX, fromZ, x, z, footY) ? null : ground;
  collisionMetrics.queries++; collisionMetrics.milliseconds += performance.now() - started;
  return result;
}
function findWalkSpawn(x, z, footY) {
  const offsets = [
    [0, 0], [1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5],
    [3, 0], [-3, 0], [0, 3], [0, -3], [2.1, 2.1], [-2.1, 2.1], [2.1, -2.1], [-2.1, -2.1],
  ];
  for (const [dx, dz] of offsets) {
    const ground = walkSurfaceAt(x + dx, z + dz, footY);
    if (ground !== null) return { x: x + dx, z: z + dz, ground };
  }
  return null;
}
const player = new ImportPlayer(modelRoot, camera, {
  surface:walkSurfaceAt, obstacles:()=>walkObstacles,
  queryObstacles:(start,end,result)=>{
    obstacleIndex.query(Math.min(start.x,end.x)-.08,Math.min(start.z,end.z)-.08,
      Math.max(start.x,end.x)+.08,Math.max(start.z,end.z)+.08,cameraObstacles);
    for(const {mesh,bounds} of cameraObstacles)
      if(bounds.max.y>=Math.min(start.y,end.y)-.08&&bounds.min.y<=Math.max(start.y,end.y)+.08)result.push(mesh);
  },
  onReady:avatar=>nightLighting.environmentSpill.attachReceivers(avatar,{external:true})
});
function clearMovement() { keys.clear(); player.stop(); }
let totalBytes = 0;
let totalObjects = 0;
let totalVertices = 0;
let totalTriangles = 0;
let renderFrames = 0;
let lastFrameTime = performance.now();
let lastWaterUIUpdate = 0;
let fps = 0;
let currentMode = requestedMode;

const nightLighting = new ImportNightLighting(scene);
const river = new RiverSystem({scene,parent:modelRoot,renderer,
  onActiveChange:active=>nightLighting.waterReflections.setSceneReflectionEnabled(active)});
const dragonLighting = new DragonWallLighting(scene);
let mapLightStorage;
try { mapLightStorage = window.localStorage; } catch { /* Private browser: controls still work. */ }
let mapLightSettings = readMapLights(mapLightStorage);
let mapLightControls = null;
function setGateLighting(name = 'gold') {
  const selected = nightLighting.setGatePreset(name);
  document.querySelectorAll('[data-gate-light]').forEach(button => {
    const active = button.dataset.gateLight === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#gateLightDescription').textContent = GATE_LIGHT_PRESETS[selected].description;
  const url = new URL(location.href);
  url.searchParams.set('gateLight', selected);
  history.replaceState(history.state, '', url);
  return selected;
}
setGateLighting(query.get('gateLight') || 'gold');
let timeOfDay = 'day';
let timeRequest = 0;
let dayPreset = 'natural';
let nightLoad = null;
let composer = null;
let bloomPass = null;
let outputPass = null;
renderer.info.autoReset = false;

function resizeRendering() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, PERFORMANCE_PROFILES[activePerformanceProfile].pixelRatio));
  renderer.setSize(innerWidth, innerHeight);
  if (composer) {
    composer.setPixelRatio(Math.min(renderer.getPixelRatio(), 1.25));
    composer.setSize(innerWidth, innerHeight);
  }
  river.invalidate();
}
function applyPerformanceProfile() {
  const profile = PERFORMANCE_PROFILES[activePerformanceProfile];
  if (controlMode !== 'orbit') camera.far = personFar(activePerformanceProfile, savedOrbit?.far || 3000);
  camera.updateProjectionMatrix();
  scene.fog.density = controlMode !== 'orbit' && profile.farMeters !== null
    ? Math.sqrt(-Math.log(.01)) / (camera.far * .94)
    : environment.currentPreset.fog;
  if (bloomPass) bloomPass.enabled = profile.bloom;
  sun.castShadow = profile.shadowSize > 0 && environment.currentPreset.elevation !== undefined;
  if (profile.shadowSize && sun.shadow.mapSize.x !== profile.shadowSize) {
    sun.shadow.map?.dispose(); sun.shadow.map = null;
    sun.shadow.mapSize.set(profile.shadowSize, profile.shadowSize);
  }
  renderer.shadowMap.needsUpdate = true;
  river.setPerformanceOverride(profile.waterSize ? {size:profile.waterSize, hz:profile.waterHz} : null);
  resizeRendering();
  environment.update(camera);
  document.querySelector('#performanceQuality').value = activePerformanceProfile;
  updateWaterUI();
}
function setPerformanceProfile(value) {
  activePerformanceProfile = performanceProfile(value);
  applyPerformanceProfile();
  return activePerformanceProfile;
}

function applyMapLights(settings) {
  mapLightSettings = {...settings};
  if (bloomPass) { bloomPass.strength=settings.bloomStrength; bloomPass.radius=settings.bloomRadius; bloomPass.threshold=settings.bloomThreshold; }
  environment.setExposure(settings.exposure);
  renderer.shadowMap.needsUpdate = true;
  nightLighting.setMapLightSettings(settings);
  streetlamps.setMapLightSettings(settings);
  festivalLanterns.setMapLightSettings(settings);
  featureLanterns.setMapLightSettings(settings);
}
mapLightControls = mountMapLightControls(document.querySelector('#mapLightControls'), {
  storage:mapLightStorage, onChange:applyMapLights, isNight:()=>TIME_PRESETS[timeOfDay].lit,
});

const buildingLightHost=document.createElement('div');buildingLightHost.id='buildingLightControls';
const buildingControls=mountBuildingControls(buildingLightHost,{rig:nightLighting.buildingAdjustments,storage:mapLightStorage,redLanterns});buildingControls.host=buildingLightHost;
const environmentControls = mountEnvironmentControls(document.querySelector('#environmentLightControls'), {rig:nightLighting.environmentSpill,storage:mapLightStorage,isNight:()=>TIME_PRESETS[timeOfDay].lit,onFocus:focusEnvironmentBuilding,buildingControls});
const dragonControls=mountDragonControls(document.querySelector('#dragonLightControls'),{rig:dragonLighting,storage:mapLightStorage,onFocus:()=>focusNightView('dragonWall')});

function ensureNightComposer() {
  if (composer) return;
  composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(renderer.getPixelRatio(), 1.25));
  composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), mapLightSettings.bloomStrength, mapLightSettings.bloomRadius, mapLightSettings.bloomThreshold);
  bloomPass.enabled = PERFORMANCE_PROFILES[activePerformanceProfile].bloom;
  composer.addPass(bloomPass);
  outputPass = new OutputPass(); // exactly one tone-mapping / sRGB conversion
  composer.addPass(outputPass);
}
function updateTimeUI() {
  dragonLighting.setState({night:TIME_PRESETS[timeOfDay].lit,modelVisible:modelRoot.visible,wireframe:document.querySelector('#wireframe').checked});
  mapLightControls?.updateMode();
  environmentControls?.updateMode();
  document.querySelectorAll('[data-time-of-day]').forEach(button => {
    const active = button.dataset.timeOfDay === timeOfDay;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-light-preset]').forEach(button => {
    const active = timeOfDay === 'day' && button.dataset.lightPreset === dayPreset;
    button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
  const preset = TIME_PRESETS[timeOfDay];
  document.querySelector('#timeReadout').textContent = `${preset.clock} · ${preset.label}` + (preset.lit ? ` · 已点亮 ${nightLighting.stats.boats} 艘游船` : ' · 原始模型材质');
  updateWaterUI();
  nightLighting.setVisibility({ modelVisible: modelRoot.visible, wireframe: document.querySelector('#wireframe').checked });
  streetlamps.setState({ night: TIME_PRESETS[timeOfDay].lit, wireframe: document.querySelector('#wireframe').checked });
  festivalLanterns.setState({ night: TIME_PRESETS[timeOfDay].lit, wireframe: document.querySelector('#wireframe').checked });
  redLanterns.setState({night:TIME_PRESETS[timeOfDay].lit,wireframe:document.querySelector('#wireframe').checked});
  featureLanterns.setState({night:TIME_PRESETS[timeOfDay].lit,wireframe:document.querySelector('#wireframe').checked});
  goldenTreeLanterns.setState({night:TIME_PRESETS[timeOfDay].lit,wireframe:document.querySelector('#wireframe').checked});
  courtyardLanterns.setState({night:TIME_PRESETS[timeOfDay].lit,wireframe:document.querySelector('#wireframe').checked});
}
async function setTimeOfDay(value) {
  const desired = Object.hasOwn(TIME_PRESETS, value) ? value : 'day';
  const request = ++timeRequest;
  if (TIME_PRESETS[desired].lit) {
    setStatus('正在准备灯会夜景：屋檐灯带、窗格暖光、游船与牌坊灯光…');
    try { await nightLighting.prepare(); }
    catch (error) {
      if (request === timeRequest) setStatus(`夜景资源未就绪：${error.message}。可再次点击夜晚重试，白天不受影响。`);
      return false;
    }
    if (request !== timeRequest) return false;
    ensureNightComposer();
    nightLighting.refreshTempleStudy();
  }
  timeOfDay = desired;
  nightLighting.setEnabled(TIME_PRESETS[desired].lit);
  environment.apply(timeOfDay, dayPreset, mapLightSettings.exposure);
  applyPerformanceProfile();
  river.setTime(timeOfDay);
  setWireframe(document.querySelector('#wireframe').checked);
  renderer.shadowMap.needsUpdate = true;
  updateTimeUI();
  setStatus(`${TIME_PRESETS[desired].clock} · ${TIME_PRESETS[desired].label}；建筑和河道位置保持不变。`);
  return true;
}
function setLightingPreset(name = 'natural') {
  dayPreset = DAY_LIGHT_PRESETS[name] ? name : 'natural';
  return setTimeOfDay('day');
}
async function loadNightLandmarks() {
  if (!manifest) return;
  if (nightLoad) return nightLoad;
  nightLoad = (async () => {
    const focal = [9, 10, 5, 6].map(id => allTiles().find(tile => tile.id === id)).filter(Boolean);
    const missing = focal.filter(tile => !tileObjects.has(tile.id));
    if (!missing.length) return;
    showProgress('正在加载灯会重点区域…', '保留当前位置；加载魁星阁、游船、天下文枢及对岸区域');
    let done = 0;
    try {
      for (const tile of missing) {
        await loadTile(tile);
        updateProgress(++done, missing.length, `灯会区域 ${done}/${missing.length}`);
      }
    } finally { hideProgress(); updateTimeUI(); }
  })();
  try { await nightLoad; } finally { nightLoad = null; }
}
const NIGHT_VIEWS = {
  festivalMountain: { position: [-25, 24, -45], target: [-15.5, 13.2, -34] },
  festivalLions: { position: [-5.24, 19, -14.4], target: [-5.24, 11.9, -20.5] },
  festivalWater: { position: [-5, 17, 4], target: [-3, 11.2, -1] },
  dragonWall: {position:[-7.6,15.2,-10],target:[-7.05,12.35,6.1]},
  bridge: {position:[-7.8,16.2,7.5],target:[-20.7,11.7,-2.3]},
  riverfront: { position: [18, 28, 16], target: [-5, 12.8, -20] },
  pavilion: { position: [17.7, 18, .4], target: [11.27, 14.3, -6.82] },
  gate: { position: [1, 18, -2], target: [-5.24, 13.8, -13.46] },
  gateDetail: { position: [-1, 13.7, -7.5], target: [-5.24, 14.8, -13.46] },
  boats: { position: [-.5, 17.5, 1.4], target: [-7.5, 11.6, -6.6] },
  windowspill: { position: [-1.5, 16.5, -29.5], target: [-5.5, 12.3, -36.6] },
  temple: { position: [13, 29, -14], target: [-5.5, 14, -38] },
  courtyard: { position: [-5.55, 17.5, -22.6], target: [-5.55, 12.8, -32] },
  redLanterns: {position:[-40,14.1,1.8],target:[-40,12.9,-1.7]},
  streetlamps: { position: [4.8, 13.1, -24.8], target: [1.9, 12.5, -32] },
};
async function focusNightView(key = 'riverfront') {
  if (!manifest) return setStatus('请等待模型清单加载完成。');
  try {
    if (!TIME_PRESETS[timeOfDay].lit && !(await setTimeOfDay('night'))) return;
    const viewKey = NIGHT_VIEWS[key] ? key : 'riverfront';
    const view = NIGHT_VIEWS[viewKey];
    document.querySelector('#nightView').value = viewKey;
    switchControl('orbit'); cameraRevision++;
    camera.position.fromArray(view.position); orbit.target.fromArray(view.target);
    camera.near = .03; camera.far = 3000; camera.updateProjectionMatrix(); orbit.update();
    if(viewKey==='dragonWall'){
      const menu=document.querySelector('#toolbar'),rect=menu.getBoundingClientRect();
      if(!menu.classList.contains('is-collapsed')&&innerWidth>680){const shift=rect.right/innerWidth*camera.position.distanceTo(orbit.target)*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect;const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);camera.position.addScaledVector(right,-shift);orbit.target.addScaledVector(right,-shift);orbit.update();}
      document.querySelector('#dragonLightPanel').open=true;
    }
    await loadNightLandmarks();
    setStatus(`已切换重点夜景视角 · ${nightLighting.stats.boats} 艘游船 · ${streetlamps.stats.lamps} 盏沿街灯笼 · ${festivalLanterns.stats.lamps} 盏花灯`);
  } catch (error) { setStatus(`重点夜景区域尚未完整加载：${error.message}。请点击重试失败。`); }
}
// Loading one selection must never snap back after a newer selection or orbit gesture.
async function focusEnvironmentBuilding(id,{isCurrent=()=>true}={}) {
  const rig=nightLighting.environmentSpill,building=rig.getFocusTarget(id);
  if(!manifest||!building)throw new Error('请等待建筑清单加载完成。');
  const revision=++cameraRevision;
  for(const tileId of building.tiles){
    if(revision!==cameraRevision||!isCurrent())return {cancelled:true};
    const tile=allTiles().find(t=>t.id===tileId);
    if(!tile)throw new Error('该建筑所在区域未包含在地图清单中。');
    if(!tileObjects.has(tileId))await loadTile(tile);
  }
  if(revision!==cameraRevision||!isCurrent())return {cancelled:true};
  switchControl('orbit');
  // Remove any residual orbit damping before applying the new framed view.
  const damping=orbit.enableDamping;orbit.enableDamping=false;orbit.update();orbit.enableDamping=damping;
  const menu=document.querySelector('#toolbar'),rect=menu.getBoundingClientRect();
  const expanded=!menu.classList.contains('is-collapsed');
  const pose=environmentCameraPose(building.bounds,{position:camera.position.toArray(),fov:camera.fov,width:innerWidth,height:innerHeight,
    left:expanded&&innerWidth>680?rect.right+16:0,top:expanded&&innerWidth<=680?rect.bottom+12:0,reach:rig.getSettings(id).distance});
  camera.position.fromArray(pose.position);orbit.target.fromArray(pose.target);
  camera.near=.03;camera.far=3000;camera.updateProjectionMatrix();orbit.update();
  setStatus('已定位：'+building.label+' · 当前建筑及周边外溢范围；可继续拖动视角。');
  return {id:building.id,label:building.label,...pose};
}
window.__QINHUAI_IMPORT__ = {
  setPerformanceProfile,
  get performanceSettings() { return {profile:activePerformanceProfile, ...PERFORMANCE_PROFILES[activePerformanceProfile]}; },
  get collisionStats() { return {...collisionMetrics}; },
  get visibilityStats() { return renderVisibility.stats; },
  environment, river, setWaterMode, setWaterQuality, setWaterVisible, setWireframe,
  get environmentStats() { return environment.stats; },
  get riverStats() { return river.stats; },
  setTimeOfDay, setNight: enabled => setTimeOfDay(enabled ? 'night' : 'day'),
  setGateLighting,
  get mapLightSettings() { return {...mapLightSettings}; },
  get bloomSettings() { return bloomPass ? {strength:bloomPass.strength,radius:bloomPass.radius,threshold:bloomPass.threshold} : null; },
  get gateLighting() { return nightLighting.gatePreset; },
  setLightingPreset, focusNightView, focusEnvironmentBuilding, setControlMode: switchControl,
  get controlMode() { return controlMode; },
  player,
  get performanceAudit() { return performanceAudit; },
  get playerStats() { return player.stats; },
  get night() { return TIME_PRESETS[timeOfDay].lit; },
  get timeOfDay() { return timeOfDay; },
  get nightStats() { return { ...nightLighting.stats }; },
  get loadedTileIds() { return [...tileObjects.keys()]; },
  get streetlampStats() { return streetlamps.stats; },
  // Exposed read-only references for the standalone viewer's diagnostics.
  get restoredStats() { return restoredProxies.stats; },
  get goldenLanternStats() { return goldenTreeLanterns.stats; },
  get courtyardLanternStats() { return courtyardLanterns.stats; },
  courtyardLanterns, goldenTreeLanterns, restoredProxies, scene, camera, renderer, modelRoot, nightLighting, dragonLighting, streetlamps, festivalLanterns, redLanterns, featureLanterns,
};

const performanceAudit = perfEnabled ? installImportPerformanceAudit(window.__QINHUAI_IMPORT__) : null;

function setStatus(text) { statusEl.textContent = text; }
function fmtBytes(bytes) { if (!bytes) return '0 B'; const units = ['B','KB','MB','GB']; const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024))); return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`; }
function fmtNum(value) { return Number(value || 0).toLocaleString('en-US'); }
function boundsFromObject(object) { return new THREE.Box3().setFromObject(object); }
function allTiles() { return manifest?.tiles || []; }
function sortedNearTiles() {
  const center = new THREE.Vector3(0, 6, 0);
  return [...allTiles()].sort((a, b) => new THREE.Vector3(...a.center).distanceTo(center) - new THREE.Vector3(...b.center).distanceTo(center));
}
function tileListForMode(mode) {
  const tiles = sortedNearTiles();
  if (mode !== 'all' && ['sunset','blueHour','night'].includes(query.get('time')) && ['gate', 'gateDetail', 'streetlamps', 'festivalMountain', 'festivalLions', 'festivalWater', 'redLanterns'].includes(query.get('view'))) {
    const gateTile = allTiles().find(tile => tile.id === 9);
    if (gateTile) return [gateTile];
  }
  return mode === 'all' ? tiles : tiles.slice(0, Math.min(1, tiles.length));
}
function updateSummary() {
  if (!manifest) return;
  const source = manifest.sourceStats;
  const normalized = manifest.normalizedBounds;
  summaryEl.innerHTML = `源模型 <span class="value">${fmtNum(source.objects)}</span> 网格 · <span class="value">${fmtNum(source.triangles)}</span> 三角面 · ${fmtBytes(manifest.sourceBytes || 0)}<br>` +
    `归一化范围 <span class="accent">${(normalized.max[0] - normalized.min[0]).toFixed(1)} × ${(normalized.max[1] - normalized.min[1]).toFixed(1)}</span> 单位 · 贴图修复 ${manifest.textureReport.repaired}，缺失 <span class="${manifest.textureReport.missing ? 'warn' : 'value'}">${manifest.textureReport.missing}</span>`;
}
function showProgress(title, text = '准备中') { progress.classList.toggle('compact', tileObjects.size > 0); progress.classList.add('show'); progressTitle.textContent = title; progressText.textContent = text; progressBar.style.width = '0%'; }
function hideProgress() { progress.classList.remove('show'); }
function updateProgress(done, total, detail) { const percent = total ? Math.round(done / total * 100) : 0; progressBar.style.width = `${percent}%`; progressText.textContent = `${percent}% · ${detail}`; }
function addError(tile, error) {
  failedTiles.set(tile.id, tile);
  errorsEl.style.display = 'block';
  const row = document.createElement('div'); row.className = 'error-item'; row.dataset.tile = tile.id;
  row.innerHTML = `tile-${String(tile.id).padStart(2, '0')}.glb 加载失败：<span class="warn">${String(error?.message || error).slice(0, 180)}</span>`;
  const btn = document.createElement('button'); btn.textContent = '重试'; btn.onclick = () => loadTile(tile, true);
  row.appendChild(btn); errorsEl.appendChild(row);
}
function removeError(tileId) { const row = errorsEl.querySelector(`[data-tile="${tileId}"]`); if (row) row.remove(); if (!errorsEl.children.length) errorsEl.style.display = 'none'; }
function detectWater(mesh) {
  const objectName = `${mesh.name || ''} ${mesh.parent?.name || ''}`.toLowerCase();
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const materialName = materials.map(m => m?.name || '').join(' ').toLowerCase();
  if (mesh.name === 'FuziTemple0038' || /(water|river|lake|surface|河|水面|水体)/.test(`${objectName} ${materialName}`)) waterMeshes.add(mesh);
}
function rememberMaterials(rootObject) {
  rootObject.traverse(object => {
    if (!object.isMesh) return;
    detectWater(object);
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    // These source reliefs have separate, coplanar face/edge meshes. Only the
    // repaired photo faces need a depth offset; keep geometry and original UVs.
    for (const material of materials) {
      if (material?.userData?.repair !== 'dragon-wall-material-v1' || material.userData.role !== 'front') continue;
      material.polygonOffset = true;
      material.polygonOffsetFactor = -1;
      material.polygonOffsetUnits = -1;
      if (material.map) material.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    }
    originalMaterials.set(object, materials.map(material => ({ material, wireframe: !!material?.wireframe })));
    const canCastShadow = materials.every(material => material && !material.transparent && (material.opacity ?? 1) > 0.82);
    object.castShadow = canCastShadow && !waterMeshes.has(object);
    object.receiveShadow = true;
  });
}
function setWireframe(enabled) {
  restoredProxies.setState({wireframe:enabled});
  dragonLighting.setState({wireframe:enabled});
  for (const [mesh, entries] of originalMaterials) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((material, i) => { if (material) material.wireframe = enabled ? true : (entries[i]?.wireframe || false); });
  }
  nightLighting.setVisibility({ wireframe: enabled });
  streetlamps.setState({ night: TIME_PRESETS[timeOfDay].lit, wireframe: enabled });
  festivalLanterns.setState({ night: TIME_PRESETS[timeOfDay].lit, wireframe: enabled });
  redLanterns.setState({night:TIME_PRESETS[timeOfDay].lit,wireframe:enabled});
  featureLanterns.setState({night:TIME_PRESETS[timeOfDay].lit,wireframe:enabled});
  goldenTreeLanterns.setState({night:TIME_PRESETS[timeOfDay].lit,wireframe:enabled});
  courtyardLanterns.setState({night:TIME_PRESETS[timeOfDay].lit,wireframe:enabled});
  river.setWireframe(enabled);
}
function setWaterVisible(visible) { for (const mesh of waterMeshes) mesh.visible = visible; festivalLanterns.setState({waterVisible:visible}); featureLanterns.setState({waterVisible:visible}); nightLighting.setWaterVisible(visible); river.setVisible(visible); updateWaterUI(); }
function updateWaterUI() {
  const stats=river.stats;
  document.querySelector('#waterMode').value=stats.mode;
  document.querySelector('#waterQuality').value=stats.quality;
  document.querySelector('#waterStatus').textContent=stats.failed?'水面反射不可用，已恢复原始河面':stats.mode==='original'?'原始模型河面':`流动河面 · ${stats.resolution} px · 反射最高 ${stats.captureHz} 次/秒`;
}
function setWaterMode(value) { river.setEnabled(value!=='original'); updateWaterUI(); }
function setWaterQuality(value) { river.setQuality(value); updateWaterUI(); }
function fitCamera() {
  const box = boundsFromObject(modelRoot);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const radius = Math.max(size.length() * 0.52, 8);
  camera.near = Math.max(0.02, radius / 5000); camera.far = Math.max(3000, radius * 8); camera.updateProjectionMatrix();
  const position = center.clone().add(new THREE.Vector3(radius * 0.92, radius * 0.68, radius * 0.9));
  camera.position.copy(position); orbit.target.copy(center); orbit.update();
  initialCamera = { position: position.clone(), target: center.clone() };
  sunTarget.copy(center);
  sun.position.copy(center).addScaledVector(sunDir, Math.max(radius * 2.4, 500));
  sun.target.position.copy(center);
  sun.target.updateMatrixWorld();
  sunTarget.copy(center);
  sun.position.copy(center).addScaledVector(sunDir, Math.max(radius * 2.4, 500));
  sun.target.position.copy(center);
  sun.target.updateMatrixWorld();
  const shadowRadius = Math.max(radius * 0.9, 120);
  sun.shadow.camera.left = -shadowRadius; sun.shadow.camera.right = shadowRadius; sun.shadow.camera.top = shadowRadius; sun.shadow.camera.bottom = -shadowRadius;
  sun.shadow.camera.near = 10; sun.shadow.camera.far = Math.max(radius * 4, 900); sun.shadow.camera.updateProjectionMatrix();
  renderer.shadowMap.needsUpdate = true;
}
function resetCamera() { if (!initialCamera) return; cameraRevision++; switchControl('orbit'); camera.position.copy(initialCamera.position); orbit.target.copy(initialCamera.target); orbit.update(); }
function firstPersonControlHint() {
  return pointerLockUnavailable
    ? '第一人称：按住鼠标拖动转向，W/A/S/D 行走，Shift 加速。'
    : '第一人称：点击画面锁定鼠标，W/A/S/D 行走，Shift 加速，Esc 释放鼠标。';
}
function switchControl(mode) {
  mode = ['firstPerson', 'thirdPerson'].includes(mode) ? mode : 'orbit';
  const request = ++controlRequest;
  if (mode === controlMode) return;
  if (mode !== 'orbit') {
    if (!modelRoot.visible) return setStatus('请先显示模型，再进入人物视角。');
    if (!player.avatar) {
      setStatus('正在准备学生主角…');
      return player.ready().then(() => { if (request === controlRequest) switchControl(mode); })
        .catch(error => setStatus('学生模型加载失败，可再次点击人物视角重试：' + error.message));
    }
    if (!player.spawned) {
      const spawn = findWalkSpawn(-5, -29, 11.864055);
      if (!spawn) return setStatus('步行区域尚未加载，请先加载近景或夜景重点区域。');
      player.spawn(spawn);
    }
  }
  cameraRevision++;
  clearMovement(); fallbackDragging = false;
  if (firstPerson.isLocked) firstPerson.unlock();
  if (mode !== 'orbit' && controlMode === 'orbit') {
    orbit.enableDamping = false; orbit.update(); orbit.enableDamping = true;
    savedOrbit = { position:camera.position.clone(), quaternion:camera.quaternion.clone(), target:orbit.target.clone(), near:camera.near, far:camera.far };
    camera.lookAt(player.position.x - .5, player.position.y + WALK.eyeHeight, player.position.z - 9);
  }
  controlMode = mode;
  orbit.enabled = mode === 'orbit';
  player.setMode(mode);
  if (mode === 'orbit') {
    if (savedOrbit) {
      camera.position.copy(savedOrbit.position); camera.quaternion.copy(savedOrbit.quaternion);
      camera.near = savedOrbit.near; camera.far = savedOrbit.far;
      orbit.target.copy(savedOrbit.target);
    }
    setStatus('已恢复进入步行前的轨道视角。');
  } else {
    camera.near = .03;
    setStatus(mode === 'firstPerson' ? firstPersonControlHint() : '第三人称 · 学生主角');
  }
  applyPerformanceProfile();
  for (const [selector, value] of [['#orbitMode','orbit'], ['#firstPersonMode','firstPerson'], ['#thirdPersonMode','thirdPerson']]) {
    const button = document.querySelector(selector), active = mode === value;
    button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); button.blur();
  }
  if (orbit.enabled) orbit.update();
}
async function loadManifest() {
  const response = await fetch('./assets/qinhuai-modern-import/manifest.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`manifest HTTP ${response.status}`);
  manifest = await response.json(); updateSummary();
}
async function loadGoldenTreeLanterns(tileId) {
  try { await goldenTreeLanterns.registerTile(tileId); }
  catch (error) {
    console.warn('Tree lanterns unavailable for tile', tileId, error);
    const notice = document.createElement('div');
    notice.textContent = '分区 ' + tileId + ' 的树挂金灯笼暂未载入。';
    const retry = document.createElement('button'); retry.textContent = '重试金灯笼';
    retry.onclick = async () => {
      retry.disabled = true;
      try { await goldenTreeLanterns.registerTile(tileId); notice.remove(); }
      catch (error) { console.warn(error); }
      finally { retry.disabled = false; }
    };
    notice.appendChild(retry);
    document.querySelector('#errors').appendChild(notice);
    document.querySelector('#errors').style.display = 'block';
  }
}
async function loadCourtyardLanterns(tileId) {
  const load = async () => {
    await courtyardLanterns.registerTile(tileId);
    nightLighting.environmentSpill.attachReceivers(courtyardLanterns.root, {external:true});
  };
  try { await load(); }
  catch (error) {
    console.warn('Courtyard lantern nets unavailable for tile', tileId, error);
    const notice = document.createElement('div');
    notice.textContent = '大成殿两侧树阵与金灯笼挂网暂未载入。';
    const retry = document.createElement('button'); retry.textContent = '重试庭院挂网';
    retry.onclick = async () => {
      retry.disabled = true;
      try { await load(); notice.remove(); }
      catch (error) { console.warn(error); }
      finally { retry.disabled = false; }
    };
    notice.appendChild(retry); errorsEl.appendChild(notice); errorsEl.style.display = 'block';
  }
}
function loadTile(tile, retry = false) {
  if (loadedTiles.has(tile.id)) return loadedTiles.get(tile.id);
  const url = `./assets/qinhuai-modern-import/${tile.file}${tile.revision ? `?v=${encodeURIComponent(tile.revision)}` : ''}`;
  const loader = new GLTFLoader();
  window.__QINHUAI_STARTUP__?.stage('正在下载模型 ' + tile.file);
  const promise = new Promise((resolve, reject) => loader.load(url, gltf => resolve(gltf), event => {
    const total = event.total || tile.bytes || 0;
    const label = '正在下载 ' + tile.file + ' · ' + fmtBytes(event.loaded) + (total ? ' / ' + fmtBytes(total) : '');
    progressText.textContent = total && event.loaded >= total ? tile.file + ' 下载完成，正在解析模型和贴图…' : label;
    if (total) progressBar.style.width = Math.min(100, event.loaded / total * 100).toFixed(0) + '%';
    statusEl.textContent = progressText.textContent;
  }, reject));
  const ready = promise.then(async gltf => {
    const object = gltf.scene || gltf.scenes[0];
    object.name = `tile-${String(tile.id).padStart(2, '0')}`;
    if (query.get('gateRepair') !== 'off') await repairGateRoof(object);
    modelRoot.add(object); tileObjects.set(tile.id, object); rememberMaterials(object); registerWalkable(object);
    nightLighting.registerTile(tile.id, object);
    river.registerTile(tile.id, object);
    dragonLighting.registerTile(tile.id,object);
    nightLighting.environmentSpill.attachBindings(dragonLighting.bindings);
    for(const b of dragonLighting.bindings)for(const m of Array.isArray(b.original)?b.original:[b.original])nightLighting.environmentSpill.patchMaterial(m);
    // Street furniture is optional: a failed lamp download must not reject a map tile.
    try { await streetlamps.registerTile(tile.id); nightLighting.waterReflections.setStreetTileReady(tile.id); }
    catch (error) { console.warn('Roadside lamps unavailable for tile', tile.id, error); }
    try { await festivalLanterns.registerTile(tile.id); }
    catch (error) { console.warn('Festival lanterns unavailable for tile', tile.id, error); }
    try { await redLanterns.registerTile(tile.id,object); }
    catch(error){console.warn('红灯笼挂件载入失败',tile.id,error);}
    try { await featureLanterns.registerTile(tile.id); }
    catch(error){console.warn('金鱼灯或女灯载入失败',tile.id,error);const notice=document.createElement('div');notice.textContent='金鱼灯或女灯暂未载入，可点击重试花灯。';document.querySelector('#errors').append(notice);document.querySelector('#errors').style.display='block';}
    try { await restoredProxies.registerTile(tile.id); nightLighting.environmentSpill.attachReceivers(restoredProxies.root,{external:true}); await loadGoldenTreeLanterns(tile.id); }
    catch(error){
      console.warn('原场景树木与街边物件载入失败',tile.id,error);
      const notice=document.createElement('div');notice.textContent='分区 '+tile.id+' 的树木与街边物件暂未载入。';
      const retry=document.createElement('button');retry.textContent='重试补充模型';
      retry.onclick=async()=>{retry.disabled=true;try{await restoredProxies.registerTile(tile.id); nightLighting.environmentSpill.attachReceivers(restoredProxies.root,{external:true});await loadGoldenTreeLanterns(tile.id);refreshRenderVisibility();notice.remove();}catch(e){console.warn(e);}finally{retry.disabled=false;}};
      notice.appendChild(retry);document.querySelector('#errors').appendChild(notice);document.querySelector('#errors').style.display='block';
    }
    await loadCourtyardLanterns(tile.id);
    for(const layer of [streetlamps,festivalLanterns,redLanterns,featureLanterns])if(layer.root)nightLighting.environmentSpill.attachReceivers(layer.root,{external:true});
    updateFestivalReadout();
    setWireframe(document.querySelector('#wireframe').checked); updateTimeUI();
    totalBytes += tile.bytes || 0; totalObjects += tile.objects || 0; totalVertices += tile.vertices || 0; totalTriangles += tile.triangles || 0;
    failedTiles.delete(tile.id); removeError(tile.id); setStatus(`已加载 ${loadedTiles.size}/${allTiles().length} 个 tile · 当前模型 ${fmtNum(totalObjects)} 个网格、${fmtNum(totalTriangles)} 个三角面`);
    if (!initialCamera) fitCamera();
    document.querySelector('#waterVisible').dispatchEvent(new Event('change'));
    refreshRenderVisibility(object);
    return object;
  }).catch(error => { loadedTiles.delete(tile.id); addError(tile, error); throw error; });
  loadedTiles.set(tile.id, ready);
  return ready;
}
async function loadTiles(mode) {
  if (!manifest) return;
  const firstLoad = !initialCamera;
  const startRevision = cameraRevision;
  currentMode = mode; showProgress(mode === 'all' ? '正在加载完整秦淮现代模型…' : '正在加载近景模型…');
  const tiles = tileListForMode(mode); let done = 0;
  for (const tile of tiles) {
    if (!loadedTiles.has(tile.id)) {
      try { await loadTile(tile); } catch (_) {}
    }
    done++; updateProgress(done, tiles.length, `tile-${String(tile.id).padStart(2, '0')} · ${done}/${tiles.length}`);
  }
  hideProgress();
  if (firstLoad && startRevision === cameraRevision && controlMode === 'orbit') fitCamera();
  updateSummary();
  setStatus(`模式：${mode === 'all' ? '全部' : '近景'} · 已加载 ${loadedTiles.size}/${allTiles().length} 个 tile · ${fmtBytes(totalBytes)}`);
}
async function retryFailed() { const tiles = [...failedTiles.values()]; if (!tiles.length) return setStatus('当前没有失败的 tile。'); for (const tile of tiles) { try { await loadTile(tile, true); } catch (_) {} } }
function updateFirstPerson(delta) {
  if (!modelRoot.visible) clearMovement();
  player.update(delta, keys);
}
function updatePerf(now) {
  if (now - lastWaterUIUpdate >= 500) { updateWaterUI(); lastWaterUIUpdate = now; }
  if (!perfEnabled) return;
  renderFrames++;
  if (now - lastFrameTime < 500) return;
  fps = Math.round(renderFrames * 1000 / (now - lastFrameTime)); renderFrames = 0; lastFrameTime = now;
  const info = renderer.info;
  const nightStats = nightLighting.stats;
  perfEl.textContent = `FPS      ${fps}\nDRAW     ${info.render.calls}\nTRI      ${fmtNum(info.render.triangles)}\nGEOMETRY ${info.memory.geometries}\nTEXTURE  ${info.memory.textures}\nTILES    ${loadedTiles.size}/${allTiles().length}\nMODE     ${currentMode}\nTIME     ${TIME_PRESETS[timeOfDay].clock} ${timeOfDay}\nNIGHT    ${nightStats.batches} batches / ${nightStats.washLights} lights`;
  const visibility = renderVisibility.stats;
  perfEl.textContent += `\nQUALITY  ${PERFORMANCE_PROFILES[activePerformanceProfile].label}\nCELLS    ${visibility.visibleCells}/${visibility.cells}\nCULL MS  ${visibility.updateMs.toFixed(2)}`;
}
function animate(now = performance.now()) {
  requestAnimationFrame(animate);
  if (document.hidden) { clock.getDelta(); return; }
  performanceAudit?.tickStart();
  const rawDelta = clock.getDelta();
  const delta = Math.min(rawDelta, .05);
  updateFirstPerson(delta); festivalLanterns.update(now / 1000); featureLanterns.update(now / 1000); nightLighting.update(now / 1000);
  if (controlMode === 'orbit') orbit.update();
  environment.update(camera);
  // Bake static shadows with all distance cells present, then cull on the next
  // frame. Otherwise changing view could leave stale holes in the shadow map.
  const bakeShadows = sun.castShadow && renderer.shadowMap.needsUpdate;
  renderVisibility.update(camera.position, controlMode !== 'orbit' &&
    activePerformanceProfile !== 'original' && !bakeShadows ? camera.far : null);
  renderer.info.reset();
  performanceAudit?.renderStart();
  river.update(now / 1000, rawDelta);
  if (TIME_PRESETS[timeOfDay].lit && !wireframeInput.checked) composer.render(delta);
  else renderer.render(scene, camera);
  performanceAudit?.renderEnd();
  updatePerf(now);
  performanceAudit?.tickEnd();
}

window.addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); resizeRendering(); });
window.addEventListener('keydown', event => {
  if (controlMode === 'orbit' || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
  if (!['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(event.code)) return;
  keys.add(event.code); event.preventDefault();
});
window.addEventListener('blur', clearMovement);
document.addEventListener('visibilitychange', () => { if (document.hidden) clearMovement(); });
document.addEventListener('pointerlockerror', () => {
  pointerLockUnavailable = true;
  clearMovement();
  setStatus('当前浏览器不支持鼠标锁定。已启用拖拽转向，W/A/S/D 可继续行走。');
});
window.addEventListener('keyup', event => keys.delete(event.code));
function handlePointerLockFailure(error) {
  pointerLockUnavailable = true;
  clearMovement();
  setStatus('当前浏览器不支持鼠标锁定。已启用拖拽转向，W/A/S/D 可继续行走。');
  return error;
}
renderer.domElement.addEventListener('click', () => {
  if (controlMode !== 'firstPerson' || firstPerson.isLocked || pointerLockUnavailable) return;
  try {
    const lockRequest = firstPerson.lock();
    if (lockRequest && typeof lockRequest.catch === 'function') lockRequest.catch(handlePointerLockFailure);
  } catch (error) {
    handlePointerLockFailure(error);
  }
});
renderer.domElement.addEventListener('pointerdown', event => {
  if (controlMode === 'orbit' || (controlMode === 'firstPerson' && !pointerLockUnavailable) || event.button !== 0) return;
  fallbackDragging = true;
  fallbackLastX = event.clientX;
  fallbackLastY = event.clientY;
  renderer.domElement.setPointerCapture?.(event.pointerId);
  event.preventDefault();
});
renderer.domElement.addEventListener('pointermove', event => {
  if (!fallbackDragging || controlMode === 'orbit' || firstPerson.isLocked) return;
  const dx = event.clientX - fallbackLastX;
  const dy = event.clientY - fallbackLastY;
  fallbackLastX = event.clientX;
  fallbackLastY = event.clientY;
  if (controlMode === 'thirdPerson') player.look(dx, dy);
  else {
    camera.rotation.y -= dx * fallbackLookSpeed;
    camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - dy * fallbackLookSpeed, -Math.PI / 2, Math.PI / 2);
  }
});
const stopFallbackDrag = event => {
  fallbackDragging = false;
  if (event?.pointerId !== undefined && renderer.domElement.hasPointerCapture?.(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
};
renderer.domElement.addEventListener('pointerup', stopFallbackDrag);
renderer.domElement.addEventListener('pointercancel', stopFallbackDrag);
renderer.domElement.addEventListener('wheel', event => {
  if (controlMode !== 'thirdPerson') return;
  event.preventDefault(); player.zoom(event.deltaY);
}, {passive:false});
firstPerson.addEventListener('lock', () => setStatus('第一人称已锁定：W/A/S/D 移动，Shift 加速，Esc 退出。'));
firstPerson.addEventListener('unlock', () => { clearMovement(); if (controlMode === 'firstPerson') setStatus(pointerLockUnavailable ? '鼠标已释放：按住鼠标拖动转向，W/A/S/D 继续行走。' : '鼠标已释放，点击画面可重新进入第一人称。'); });
document.querySelector('#orbitMode').onclick = () => switchControl('orbit');
document.querySelector('#firstPersonMode').onclick = () => switchControl('firstPerson');
document.querySelector('#thirdPersonMode').onclick = () => switchControl('thirdPerson');
document.querySelector('#resetCamera').onclick = resetCamera;
document.querySelector('#loadNear').onclick = () => loadTiles('near');
document.querySelector('#loadAll').onclick = () => loadTiles('all');
document.querySelector('#retryFailed').onclick = retryFailed;
document.querySelector('#modelVisible').onchange = event => { modelRoot.visible = event.target.checked; nightLighting.setVisibility({ modelVisible: modelRoot.visible }); dragonLighting.setState({modelVisible:modelRoot.visible}); };
document.querySelector('#wireframe').onchange = event => setWireframe(event.target.checked);
document.querySelector('#waterVisible').onchange = event => setWaterVisible(event.target.checked);
document.querySelector('#waterMode').onchange = event => setWaterMode(event.target.value);
document.querySelector('#waterQuality').onchange = event => setWaterQuality(event.target.value);
document.querySelector('#performanceQuality').onchange = event => setPerformanceProfile(event.target.value);
document.querySelectorAll('[data-light-preset]').forEach(button => { button.onclick = () => setLightingPreset(button.dataset.lightPreset); });
document.querySelectorAll('[data-time-of-day]').forEach(button => {
  button.onclick = async () => {
    const changed = await setTimeOfDay(button.dataset.timeOfDay);
    if (changed && TIME_PRESETS[timeOfDay].lit) {
      try { await loadNightLandmarks(); } catch (error) { setStatus(`夜景已开启，部分重点区域加载失败：${error.message}。可重试失败资源。`); }
    }
  };
});
document.querySelectorAll('[data-gate-light]').forEach(button => {
  button.onclick = async () => {
    setGateLighting(button.dataset.gateLight);
    if (!TIME_PRESETS[timeOfDay].lit && !(await setTimeOfDay('night'))) return;
    try {
      await loadNightLandmarks();
      setStatus('天下文枢 · ' + GATE_LIGHT_PRESETS[nightLighting.gatePreset].label + '；保持当前位置，可切换比较。');
    } catch (error) { setStatus('灯效已选择，牌坊资源加载失败：' + error.message + '。请重试失败资源。'); }
  };
});
document.querySelector('#gateDetailView').onclick = () => focusNightView('gateDetail');

function updateFestivalReadout() {
  const stats=festivalLanterns.stats;
  document.querySelector('#festivalReadout').textContent=Object.keys(stats.errors).length
    ? '部分花灯未载入；可点击“重试花灯”，不影响原地图。'
    : `已布置 ${stats.lamps} 盏花灯 · 采用试灯室默认配色`;
}
document.querySelectorAll('[data-festival-view]').forEach(button=>{
  button.onclick=()=>focusNightView(button.dataset.festivalView);
});
function updateMountainPreview() {
  const settings=festivalLanterns.setMountain({sizeMeters:Number(document.querySelector('#mountainDiameter').value),rotation:Number(document.querySelector('#mountainRotation').value)});
  document.querySelector('#mountainDiameterValue').value=`${settings.sizeMeters.toFixed(1)} m`;
  document.querySelector('#mountainRotationValue').value=`${Math.round(settings.rotation)}°`;
}
document.querySelector('#mountainDiameter').oninput=updateMountainPreview;
document.querySelector('#mountainRotation').oninput=updateMountainPreview;
document.querySelector('#resetMountainPreview').onclick=()=>{
  document.querySelector('#mountainDiameter').value=13;
  document.querySelector('#mountainRotation').value=180;updateMountainPreview();
};
document.querySelector('#retryFestival').onclick=async()=>{
  for(const id of tileObjects.keys()){
    try { await festivalLanterns.registerTile(id); } catch(error) {console.warn(error);}
    try { await featureLanterns.registerTile(id);nightLighting.environmentSpill.attachReceivers(featureLanterns.root,{external:true}); } catch(error) {console.warn(error);}
  }
  updateFestivalReadout();
};
updateMountainPreview();

document.querySelector('#nightViewButton').onclick = () => focusNightView(document.querySelector('#nightView').value);
updateTimeUI();
window.addEventListener('beforeunload', () => {
  performanceAudit?.dispose();
  renderVisibility.dispose();
  environment.dispose(); river.dispose();
  player.dispose(); firstPerson.dispose(); orbit.dispose();
  courtyardLanterns.dispose(); goldenTreeLanterns.dispose(); restoredProxies.dispose(); redLanterns.dispose(); featureLanterns.dispose(); festivalLanterns.dispose(); streetlamps.dispose(); nightLighting.dispose(); dragonLighting.dispose(); disposeGateRoofRepair(); bloomPass?.dispose(); outputPass?.dispose(); composer?.dispose();
});

(async function boot() {
  try {
    window.__QINHUAI_STARTUP__?.stage('正在读取模型清单…');
    await loadManifest();
    updateSummary();
    window.__QINHUAI_STARTUP__?.stage('正在准备场景光照…');
    if (!(await setTimeOfDay(query.get('time') || 'day'))) throw new Error('场景光照加载失败，请重试。');
    animate();
    const playerReady = player.ready().catch(error => {
      console.warn('学生模型加载失败，可从人物视角按钮重试', error); return null;
    });
    await loadTiles(requestedMode);
    if (TIME_PRESETS[timeOfDay].lit) {
      if (query.get('view')) await focusNightView(query.get('view'));
      else await loadNightLandmarks();
    }
    await playerReady;
    performanceAudit?.markReady(failedTiles.size === 0 && player.stats.ready);
    window.__QINHUAI_STARTUP__?.ready();
  } catch (error) {
    window.__QINHUAI_STARTUP__?.fail(error);
    showProgress('独立测试页启动失败'); progressText.textContent = `${error.message}。请通过本地 HTTP 服务打开，不要直接使用 file://。`;
    setStatus(`启动失败：${error.message}`);
  }
})();

// Same-origin saved building settings: update already-loaded tiles without rebuilding geometry.
window.addEventListener('storage',event=>{
 if(event.key===BUILDING_LIGHT_KEY||event.key===null)buildingControls.reload();
 if(event.key===DRAGON_STORAGE_KEY||event.key===null)dragonControls.reload();
 if(event.key===MAP_LIGHT_STORAGE_KEY||event.key===null)mapLightControls.reload();
 if(event.key===ENVIRONMENT_STORAGE_KEY||event.key===null)environmentControls.reload();
 if(event.key==='qinhuai.building-light-studies.v1'||event.key===null){
  nightLighting.refreshTempleStudy();
  updateTimeUI();
 }
});
