const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs/promises'), os = require('node:os'), path = require('node:path');
const { summarizeGLTF, auditFile } = require('./audit-glb-assets.cjs');
test('metadata counts indexed, nonindexed, strip/fan and repeated/instanced nodes separately', () => {
  const g = { accessors: [{ count: 6 }, { count: 9 }, { count: 4 }], meshes: [{ primitives: [
    { attributes: { POSITION: 0 }, indices: 1 }, { attributes: { POSITION: 0 }, mode: 5 },
    { attributes: { POSITION: 0 }, mode: 6 }, { attributes: { POSITION: 0 }, mode: 1 }
  ] }], nodes: [{ mesh: 0 }, { mesh: 0, extensions: { EXT_mesh_gpu_instancing: { attributes: { TRANSLATION: 2 } } } }],
    scenes: [{ nodes: [0, 1] }] };
  const s = summarizeGLTF(g);
  assert.equal(s.uniqueMeshTriangles, 11); assert.equal(s.defaultSceneTriangles, 55);
  assert.equal(s.defaultSceneMeshInstances, 5); assert.equal(s.primitiveVertices, 24);
  assert.equal(summarizeGLTF({}).defaultSceneTriangles, null);
  assert.throws(() => summarizeGLTF({ nodes: [{ children: [0] }], scenes: [{ nodes: [0] }] }), /Cyclic/);
});
test('GLB reader hashes without modifying source and rejects malformed files', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'qinhuai-glb-test-'));
  try {
    const json = Buffer.from(JSON.stringify({ asset: { version: '2.0' }, scenes: [{ nodes: [] }] }).padEnd(128, ' '));
    const header = Buffer.alloc(20); [0x46546c67, 2, 148, 128, 0x4e4f534a].forEach((v, i) => header.writeUInt32LE(v, i * 4));
    const file = path.join(dir, 'test.glb'), bytes = Buffer.concat([header, json]);
    await fs.writeFile(file, bytes);
    const result = await auditFile(file); assert.equal(result.bytes, 148); assert.equal(result.sha256.length, 64);
    assert.deepEqual(await fs.readFile(file), bytes);
    await fs.writeFile(file, Buffer.alloc(20)); await assert.rejects(auditFile(file), /Invalid GLB/);
  } finally { await fs.rm(dir, { recursive: true, force: true }); }
});
