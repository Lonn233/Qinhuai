import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ImportStreetlamps, STREETLAMP_PLACEMENTS, STREETLAMP_HEIGHT } from '../import-streetlamps.js';

function readGLB(path) {
  const bytes = fs.readFileSync(path);
  const size = bytes.readUInt32LE(12);
  const doc = JSON.parse(bytes.subarray(20, 20 + size));
  return { bytes, size, doc, accessor(index) {
    const accessor = doc.accessors[index], view = doc.bufferViews[accessor.bufferView];
    const components = { VEC2: 2, VEC3: 3, SCALAR: 1 }[accessor.type];
    const TypedArray = { 5126: Float32Array, 5125: Uint32Array, 5123: Uint16Array }[accessor.componentType];
    return new TypedArray(bytes.buffer, bytes.byteOffset + 28 + size + (view.byteOffset || 0) + (accessor.byteOffset || 0), accessor.count * components);
  } };
}
const root = new URL('../', import.meta.url);
const original = readGLB('E:/soft/inspiration/灯会/model/普通灯/路灯1.glb');
const repaired = readGLB(new URL('assets/qinhuai-modern-import/streetlamps/streetlamp-straight.glb', root));
const low = readGLB(new URL('assets/qinhuai-modern-import/streetlamps/streetlamp-low.glb', root));
const lowPrimitive = low.doc.meshes[0].primitives[0];
const lowTriangles = low.doc.accessors[lowPrimitive.indices].count / 3;
assert.ok(lowTriangles > 5000 && lowTriangles <= 12000, 'low-poly silhouette budget');
assert.ok(low.bytes.length < repaired.bytes.length * .7, 'smaller download with unchanged textures');
assert.deepEqual(low.doc.materials, repaired.doc.materials, 'original painted materials retained');
assert.deepEqual(low.doc.images, repaired.doc.images, 'original textures retained');
assert.ok(lowPrimitive.attributes.TEXCOORD_0 !== undefined);
assert.match(fs.readFileSync(new URL('import-streetlamps.js', root), 'utf8'), /streetlamp-low\.glb/);
const highBounds = repaired.doc.accessors[repaired.doc.meshes[0].primitives[0].attributes.POSITION];
const lowBounds = low.doc.accessors[lowPrimitive.attributes.POSITION];
for (let axis = 0; axis < 3; axis++) {
 assert.ok(Math.abs(highBounds.min[axis] - lowBounds.min[axis]) < .01, 'silhouette minimum retained');
 assert.ok(Math.abs(highBounds.max[axis] - lowBounds.max[axis]) < .01, 'silhouette maximum retained');
}
assert.equal(crypto.createHash('sha256').update(original.bytes).digest('hex'), '694ee74386160c6becb6a02949553a06e8fedfead2a1ce3c697e9bc08625345f');
const p = original.doc.meshes[0].primitives[0], q = repaired.doc.meshes[0].primitives[0];
assert.deepEqual(original.accessor(p.attributes.TEXCOORD_0), repaired.accessor(q.attributes.TEXCOORD_0));
assert.deepEqual(original.accessor(p.indices), repaired.accessor(q.indices));
const before = original.accessor(p.attributes.POSITION), after = repaired.accessor(q.attributes.POSITION);
assert.equal(before.length, after.length);
let moved = 0, maxCorrection = 0;
for (let i = 0; i < before.length; i += 3) {
  assert.equal(after[i + 1], before[i + 1], 'height preserved');
  assert.equal(after[i + 2], before[i + 2], 'depth preserved');
  const correction = Math.abs(after[i] - before[i]);
  maxCorrection = Math.max(correction, maxCorrection);
  if (correction > 1e-7) moved++;
  if (before[i] >= -.055 || before[i + 1] < -.66) assert.equal(correction, 0, 'lanterns and sleeve untouched');
}
assert.equal(moved, 11944);
assert.ok(maxCorrection < .0201);
assert.equal(STREETLAMP_PLACEMENTS.length, 27);
let minSpacing = Infinity;
for (let i = 0; i < STREETLAMP_PLACEMENTS.length; i++) {
  for (const b of STREETLAMP_PLACEMENTS.slice(i + 1)) {
    const a = STREETLAMP_PLACEMENTS[i];
    minSpacing = Math.min(minSpacing, Math.hypot(a.x - b.x, a.z - b.z));
  }
}
assert.ok(minSpacing > 4, 'roadside distribution remains sparse');

// Keep the actual exported geometry while avoiding browser bitmap APIs in Node.
const doc = structuredClone(low.doc);
doc.materials = doc.materials.map(material => ({ name: material.name }));
delete doc.images; delete doc.textures; delete doc.samplers;
const json = Buffer.from(JSON.stringify(doc)), jsonSize = Math.ceil(json.length / 4) * 4;
const buffer = Buffer.alloc(20 + jsonSize + low.bytes.length - 20 - low.size, 0x20);
low.bytes.copy(buffer, 0, 0, 12); buffer.writeUInt32LE(buffer.length, 8);
buffer.writeUInt32LE(jsonSize, 12); buffer.writeUInt32LE(0x4e4f534a, 16);
json.copy(buffer, 20); low.bytes.copy(buffer, 20 + jsonSize, 20 + low.size);
const gltf = await new GLTFLoader().parseAsync(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength), '');
let loads = 0;
const parent = new THREE.Group();
const lamps = new ImportStreetlamps(parent, { load: async () => { loads++; return gltf; } });
await Promise.all([lamps.registerTile(9), lamps.registerTile(9), lamps.registerTile(10), lamps.registerTile(6)]);
assert.equal(loads, 1); assert.equal(lamps.stats.lamps, 27); assert.equal(lamps.stats.sharedModelParts, 1);
await lamps.registerTile(9); assert.equal(lamps.stats.lamps, 27);
assert.ok(Math.abs(new THREE.Box3().setFromBufferAttribute(lamps.parts[0].geometry.attributes.position).getSize(new THREE.Vector3()).y - STREETLAMP_HEIGHT) < 1e-6);
assert.ok(Math.abs(new THREE.Box3().setFromBufferAttribute(lamps.parts[0].geometry.attributes.position).min.y) < 1e-6);
const geometries = new Set();
lamps.root.traverse(mesh => { if (mesh.isInstancedMesh && !mesh.userData.streetlampSpill) geometries.add(mesh.geometry); });
assert.equal(geometries.size, 1);
const shader = { uniforms: {}, fragmentShader: '#include <emissivemap_fragment>' };
lamps.parts[0].material.onBeforeCompile(shader);
assert.match(shader.fragmentShader, /diffuseColor\.r - diffuseColor\.b/);
assert.equal(shader.uniforms.qhStreetlampNight, lamps.night);
lamps.setState({ night: true }); assert.equal(lamps.stats.night, true);
lamps.setState({ night: true, wireframe: true }); assert.equal(lamps.stats.night, false);
assert.equal(lamps.parts[0].material.wireframe, true);
lamps.root.traverse(mesh => { if (mesh.userData.streetlampSpill) assert.equal(mesh.visible, false); });
lamps.setState({ night: false, wireframe: false }); assert.equal(lamps.stats.night, false);
lamps.dispose(); assert.equal(parent.children.length, 0); assert.equal(lamps.parts.length, 0);
const failing = new ImportStreetlamps(parent, { load: async () => { throw new Error('asset unavailable'); } });
await assert.rejects(failing.registerTile(9), /asset unavailable/);
assert.equal(failing.stats.lamps, 0); assert.equal(failing.pending.size, 0);
failing.dispose();
console.log(JSON.stringify({ passed: true, lamps: 27, minSpacing, movedVertices: moved,
  lowTriangles, triangleReduction: 1 - lowTriangles / (repaired.doc.accessors[q.indices].count / 3),
  maxCorrection, originalUnmodified: true, originalUVAndIndicesPreserved: true,
  sharedGeometry: true, dayNightWireframeDisposal: true }, null, 2));
