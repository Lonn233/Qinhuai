const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const THREE = require('three');

const rootPath = require('node:path').resolve(__dirname, '..');
const {GLTFLoader} = require('three/addons/loaders/GLTFLoader.js');

function stripTextures(buffer) {
  const jsonLength = buffer.readUInt32LE(12);
  const document = JSON.parse(buffer.subarray(20, 20 + jsonLength));
  for (const material of document.materials || []) {
    delete material.normalTexture;
    delete material.occlusionTexture;
    delete material.emissiveTexture;
    if (material.pbrMetallicRoughness) {
      delete material.pbrMetallicRoughness.baseColorTexture;
      delete material.pbrMetallicRoughness.metallicRoughnessTexture;
    }
  }
  delete document.textures;
  delete document.images;
  delete document.samplers;
  const json = Buffer.from(JSON.stringify(document));
  const paddedJson = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20);
  json.copy(paddedJson);
  const binary = buffer.subarray(20 + jsonLength);
  const output = Buffer.alloc(20 + paddedJson.length + binary.length);
  buffer.copy(output, 0, 0, 12);
  output.writeUInt32LE(output.length, 8);
  output.writeUInt32LE(paddedJson.length, 12);
  output.writeUInt32LE(0x4e4f534a, 16);
  paddedJson.copy(output, 20);
  binary.copy(output, 20 + paddedJson.length);
  return output;
}

async function walkingHelpers() {
  const source = fs.readFileSync(rootPath + '/qinhuai-modern-import.js', 'utf8');
  const start = source.indexOf('const WALK = Object.freeze(');
  const end = source.indexOf('const player = new ImportPlayer', start);
  assert.ok(start >= 0 && end > start, 'walking helpers are present');
  const waterMeshes = new Set();
  const { XZSpatialIndex } = await import('../import-spatial-index.mjs');
  const context = {THREE, waterMeshes, XZSpatialIndex, performance};
  const code = source.slice(start, end) + '\nthis.walking = {registerWalkable, walkSurfaceAt, groundAt, isWalkBlocked, walkableMeshes, walkObstacles, obstacleCandidates};';
  vm.runInNewContext(code, context);
  return {api: context.walking, waterMeshes};
}

function getNamedMeshes(object, names) {
  const found = new Map([...names].map(name => [name, []]));
  object.traverse(mesh => {
    if (!mesh.isMesh) return;
    for (let node = mesh; node; node = node.parent) {
      if (!found.has(node.name)) continue;
      found.get(node.name).push(mesh);
      break;
    }
  });
  return found;
}

function traversePath(api, points, startY) {
  let [x, z] = points[0], y = startY;
  for (const [nextX, nextZ] of points.slice(1)) {
    const nextY = api.walkSurfaceAt(nextX, nextZ, y, x, z);
    const blocked = nextY === null && api.isWalkBlocked(x, z, nextX, nextZ, y);
    const candidates = blocked ? api.obstacleCandidates.map(mesh => ({name:mesh.name,parent:mesh.parent?.name,bounds:new THREE.Box3().setFromObject(mesh).min.toArray()})) : [];
    assert.notEqual(nextY, null, `walkable route stopped at (${nextX.toFixed(2)}, ${nextZ.toFixed(2)}), ground=${api.groundAt(nextX, nextZ, y)}, blocked=${blocked}, candidates=${JSON.stringify(candidates)}`);
    x = nextX;
    z = nextZ;
    y = nextY;
  }
  return y;
}

function routeThrough(corners, step = .05) {
  const points = [corners[0]];
  for (let index = 1; index < corners.length; index++) {
    const [x, z] = corners[index - 1];
    const [nextX, nextZ] = corners[index];
    const count = Math.ceil(Math.hypot(nextX - x, nextZ - z) / step);
    for (let part = 1; part <= count; part++) {
      points.push([x + (nextX - x) * part / count, z + (nextZ - z) * part / count]);
    }
  }
  return points;
}

(async () => {
  const tiles = new THREE.Group();
  for (const id of ['09', '05', '06', '10']) {
    const buffer = stripTextures(fs.readFileSync(rootPath + `/assets/qinhuai-modern-import/tiles/tile-${id}.glb`));
    const gltf = await new GLTFLoader().parseAsync(buffer.buffer, '');
    tiles.add(gltf.scene);
  }
  tiles.updateWorldMatrix(true, true);
  const {api, waterMeshes} = await walkingHelpers();
  const targetNames = new Set([
    'FuziTemple0005', 'FuziTemple0006', 'FuziTemple0007', 'FuziTemple0012',
    'FuziTemple0015', 'FuziTemple0019', 'FuziTemple0020', 'FuziTemple0023', 'FuziTemple0024',
    'FuziTemple0307', 'FuziTemple0309',
  ]);
  const namedMeshes = getNamedMeshes(tiles, targetNames);
  for (const name of targetNames) assert.ok(namedMeshes.get(name).length, `model node ${name} exists`);
  tiles.traverse(mesh => {
    if (!mesh.isMesh) return;
    const materials = [mesh.material].flat();
    const label = `${mesh.name} ${mesh.parent?.name || ''} ${materials.map(material => material?.name || '').join(' ')}`.toLowerCase();
    if (mesh.name === 'FuziTemple0038' || /(water|river|lake|surface|河|水面|水体)/.test(label)) waterMeshes.add(mesh);
  });
  api.registerWalkable(tiles);

  const descent = Array.from({length: 51}, (_, index) => [-18 + index * .08, -10.3]);
  const ascent = [...descent].reverse();
  const descentEnd = traversePath(api, descent, 11.8641);
  const ascentEnd = traversePath(api, ascent, descentEnd);
  assert.ok(Math.abs(ascentEnd - 11.8641) < .02, 'stair route works in both directions');

  // Follow the diagonal deck and its turn, not a straight line into the rail.
  const bridge = routeThrough([[-21, -12], [-20.5, -6], [-21.6, 2.5], [-21.6, 5.5], [-21.6, 8]]);
  const bridgeBack = [...bridge].reverse();
  const bridgeEnd = traversePath(api, bridge, 11.8641);
  const bridgeStart = traversePath(api, bridgeBack, bridgeEnd);
  assert.ok(Math.abs(bridgeEnd - 11.8641) < .02, 'bridge connects to the opposite bank paving');
  assert.ok(Math.abs(bridgeStart - 11.8641) < .02, 'bridge deck works in both directions');

  const lowerWalk = Array.from({length: 641}, (_, index) => [-16 + index * .027, -10.3]);
  const lowerWalkBack = [...lowerWalk].reverse();
  const lowerEnd = traversePath(api, lowerWalk, 11.3234);
  const lowerStart = traversePath(api, lowerWalkBack, lowerEnd);
  assert.ok(Math.abs(lowerStart - 11.3234) < .02, 'lower paved path works in both directions');

  for (const name of ['FuziTemple0023', 'FuziTemple0024', 'FuziTemple0307']) {
    for (const mesh of namedMeshes.get(name)) {
      assert.ok(api.walkObstacles.some(obstacle => obstacle.mesh === mesh), `${name} remains a walking obstacle`);
    }
  }
  assert.ok(waterMeshes.size > 0, 'fixture includes actual river water');
  for (const mesh of waterMeshes) {
    assert.ok(!api.walkableMeshes.some(surface => surface.mesh === mesh), 'water is never registered as a walking surface');
  }
  assert.equal(api.isWalkBlocked(-21, 1.76, -21, 1.84, 11.8641), true, 'bridge side rail still blocks walking');
  assert.equal(api.isWalkBlocked(-10, -10.5, -10, -10.85, 11.3234), true, 'low retaining wall still blocks walking');
  assert.equal(api.walkSurfaceAt(-10, -8.9, 11.3234, -10, -9.6), null, 'river cannot be entered as a walking surface');

  console.log('PASS: real four-tile bridge, stair descent/ascent and full lower path traverse both ways; rail/wall collisions and water exclusion remain active.');
})().catch(error => { console.error(error); process.exitCode = 1; });
