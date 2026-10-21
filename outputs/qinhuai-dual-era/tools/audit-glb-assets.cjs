// Reads only GLB metadata plus a streaming hash; never decodes or rewrites geometry.
const fs = require('node:fs/promises');
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const path = require('node:path');

function summarizeGLTF(g) {
  const accessors = g.accessors || [], meshes = g.meshes || [], nodes = g.nodes || [];
  const meshStats = meshes.map(mesh => {
    let triangles = 0, vertices = 0;
    for (const p of mesh.primitives || []) {
      const vertexCount = accessors[p.attributes?.POSITION]?.count || 0;
      const count = p.indices === undefined ? vertexCount : accessors[p.indices]?.count || 0;
      const mode = p.mode ?? 4;
      triangles += mode === 4 ? Math.floor(count / 3) : mode === 5 || mode === 6 ? Math.max(0, count - 2) : 0;
      vertices += vertexCount;
    }
    return { triangles, vertices, primitives: (mesh.primitives || []).length };
  });
  const scene = g.scenes?.[g.scene ?? 0];
  let references = 0, sceneTriangles = 0;
  function visit(index, ancestors) {
    if (ancestors.has(index)) throw new Error('Cyclic GLTF node graph');
    const node = nodes[index];
    if (!node) throw new Error('Invalid GLTF node reference');
    const next = new Set(ancestors); next.add(index);
    if (node.mesh !== undefined) {
      const mesh = meshStats[node.mesh];
      if (!mesh) throw new Error('Invalid GLTF mesh reference');
      const attributes = node.extensions?.EXT_mesh_gpu_instancing?.attributes;
      const count = attributes ? accessors[Object.values(attributes)[0]]?.count ?? 0 : 1;
      references += count; sceneTriangles += mesh.triangles * count;
    }
    for (const child of node.children || []) visit(child, next);
  }
  if (scene) for (const root of scene.nodes || []) visit(root, new Set());
  return { meshes: meshes.length, nodes: nodes.length,
    primitives: meshStats.reduce((n, m) => n + m.primitives, 0),
    uniqueMeshTriangles: meshStats.reduce((n, m) => n + m.triangles, 0),
    primitiveVertices: meshStats.reduce((n, m) => n + m.vertices, 0),
    defaultSceneMeshInstances: scene ? references : null,
    defaultSceneTriangles: scene ? sceneTriangles : null,
    materials: (g.materials || []).length, textures: (g.textures || []).length,
    images: (g.images || []).map(im => ({ name: im.name ?? null, mimeType: im.mimeType ?? null,
      embeddedBytes: im.bufferView === undefined ? null : g.bufferViews?.[im.bufferView]?.byteLength ?? null,
      external: im.uri !== undefined, dimensions: null })),
    animations: (g.animations || []).length, extensionsRequired: g.extensionsRequired || [] };
}
async function auditFile(file) {
  const handle = await fs.open(file, 'r');
  let g, bytes;
  try {
    bytes = (await handle.stat()).size;
    const header = Buffer.alloc(20);
    if ((await handle.read(header, 0, 20, 0)).bytesRead !== 20 || header.readUInt32LE(0) !== 0x46546c67
      || header.readUInt32LE(4) !== 2 || header.readUInt32LE(8) !== bytes || header.readUInt32LE(16) !== 0x4e4f534a)
      throw new Error('Invalid GLB 2 header/length/JSON chunk');
    const length = header.readUInt32LE(12);
    if (length > 64 * 1024 * 1024 || length + 20 > bytes) throw new Error('Invalid or oversized GLB JSON chunk');
    const json = Buffer.alloc(length);
    if ((await handle.read(json, 0, length, 20)).bytesRead !== length) throw new Error('Truncated GLB JSON');
    g = JSON.parse(json.toString('utf8'));
  } finally { await handle.close(); }
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return { bytes, sha256: hash.digest('hex'), ...summarizeGLTF(g) };
}
async function inventory(root) {
  const files = [], skipped = new Set(['node_modules', '.git', '.local-data', 'work', 'tooldeps']);
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory() && !skipped.has(entry.name)) await walk(file);
      else if (entry.isFile() && /\.glb$/i.test(entry.name)) files.push(file);
    }
  }
  await walk(root);
  const assets = [];
  for (const file of files.sort()) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    try { assets.push({ path: relative, ...await auditFile(file) }); }
    catch (error) { assets.push({ path: relative, error: error.message }); }
  }
  return { schema: 'qinhuai-glb-inventory-v1', generatedAt: new Date().toISOString(), root,
    notes: ['Metadata counts, not per-frame submitted triangles or VRAM.',
      'All mesh definitions counted once; default scene counts node/GPU instances before visibility and render passes.',
      'Image dimensions are not decoded. Original assets and settings are never written.'], assets };
}
if (require.main === module) {
  const args = process.argv.slice(2), root = path.resolve(args[0] || '.');
  const outputIndex = args.indexOf('--out');
  if (outputIndex !== -1 && !args[outputIndex + 1]) throw new Error('--out requires a report path');
  inventory(root).then(async report => {
    const json = JSON.stringify(report, null, 2);
    if (outputIndex !== -1) await fs.writeFile(path.resolve(args[outputIndex + 1]), json);
    else console.log(json);
    if (report.assets.some(a => a.error)) process.exitCode = 1;
  }).catch(error => { console.error(error); process.exitCode = 1; });
}
module.exports = { summarizeGLTF, auditFile, inventory };
