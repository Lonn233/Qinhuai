const assert = require('node:assert/strict'), fs = require('node:fs'), os = require('node:os'), path = require('node:path'), crypto = require('node:crypto'), THREE = require('three');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qinhuai-golden-unit-')), entry = path.join(dir, 'layer.cjs');
require('esbuild').buildSync({entryPoints:['golden-tree-lantern-layer.js'],bundle:true,platform:'node',format:'cjs',outfile:entry,external:['three','three/*'],logLevel:'silent',define:{'import.meta.url':JSON.stringify('file:///golden-layer.js')}});
const Module = require('node:module'), mod = new Module(entry, module); mod.filename = entry; mod.paths = module.paths; mod._compile(fs.readFileSync(entry,'utf8'), entry);
const {GoldenTreeLanternLayer} = mod.exports, layout = require('../assets/golden-tree-lanterns/layout.json');
function fixture() {
 const scene = new THREE.Group(), geometry = new THREE.BoxGeometry(1,2,1), texture = new THREE.Texture(), material = new THREE.MeshStandardMaterial({map:texture});
 scene.add(new THREE.Mesh(geometry, material));
 const disposed = {geometry:0, material:0, texture:0};
 for (const [key, object] of Object.entries({geometry,material,texture})) object.addEventListener('dispose',()=>disposed[key]++);
 return {scene, geometry, material, texture, disposed};
}
(async()=>{
 const source = fixture(); let loads = 0;
 const layer = new GoldenTreeLanternLayer(new THREE.Group(), {load:async()=>{if (++loads===1) throw Error('retry fixture'); return source;}});
 await layer.registerTile(6); assert.equal(loads,0);
 await assert.rejects(layer.registerTile(9), /retry fixture/); assert.ok(layer.stats.failures[9]);
 await Promise.all([layer.registerTile(9),layer.registerTile(9)]); assert.equal(loads,2); assert.equal(layer.stats.lamps,45); assert.equal(layer.stats.trees,6);
 await layer.registerTile(10); await layer.registerTile(10); assert.equal(loads,2); assert.equal(layer.stats.lamps,53); assert.equal(layer.stats.trees,7); assert.equal(layer.stats.drawCalls,6); assert.deepEqual(layer.stats.failures,{});
 for (const {group} of layer.tiles.values()) {
  const body = group.children.find(o=>o.name==='GoldenLanternBodies'), counts = new Map();
  assert.equal(body.geometry,source.geometry); assert.equal(body.material.map,source.texture); assert.equal(body.material.emissiveMap,source.texture); assert.equal(body.material.metalness,0);
  assert.ok(Number.isFinite(body.boundingSphere.radius));
  group.userData.mounts.forEach((mount, i)=>{
   counts.set(mount.tree,(counts.get(mount.tree)||0)+1);
   const matrix = new THREE.Matrix4(); body.getMatrixAt(i,matrix); assert.ok(matrix.elements.every(Number.isFinite));
   const centerTop = new THREE.Vector3((layout.sourceBounds.min[0]+layout.sourceBounds.max[0])/2,layout.sourceBounds.max[1],(layout.sourceBounds.min[2]+layout.sourceBounds.max[2])/2).applyMatrix4(matrix);
   assert.ok(centerTop.distanceTo(mount.top)<1e-5); assert.ok(mount.branch.y>mount.top.y);
   assert.ok(Math.abs(new THREE.Vector3(0,1,0).transformDirection(matrix).dot(new THREE.Vector3(0,1,0))-1)<1e-6);
   assert.ok(Math.abs(new THREE.Vector3().setFromMatrixColumn(matrix,1).length()*(layout.sourceBounds.max[1]-layout.sourceBounds.min[1])/layout.mapUnitsPerMeter-.62)<1e-6);
  });
  for (const [name,count] of counts) assert.equal(count,layout.trees.find(t=>t.name===name).count);
 }
 let lights=0;layer.root.traverse(o=>{if(o.isLight)lights++;});assert.equal(lights,0);
 layer.setState({night:false}); assert.ok(layer.fabric.every(m=>m.emissiveIntensity===0)); assert.ok(layer.halos.every(h=>!h.visible));
 layer.setState({night:true,wireframe:true});assert.ok(layer.fabric.every(m=>m.wireframe&&m.emissiveIntensity===0));
 layer.setState({wireframe:false});assert.ok(layer.fabric.every(m=>!m.wireframe&&m.emissiveIntensity>0));assert.ok(layer.halos.every(h=>h.visible));
 layer.dispose();layer.dispose();assert.deepEqual(source.disposed,{geometry:1,material:1,texture:1});assert.equal(layer.root.parent,null);
 let release;const pendingSource=fixture(),pendingLayer=new GoldenTreeLanternLayer(new THREE.Group(),{load:()=>new Promise(r=>{release=r;})});
 const pending=pendingLayer.registerTile(9);pendingLayer.dispose();release(pendingSource);await assert.rejects(pending,/closed/);assert.deepEqual(pendingSource.disposed,{geometry:1,material:1,texture:1});assert.equal(pendingLayer.stats.lamps,0);
 const restored = require('../assets/qinhuai-modern-import/restored/manifest.json');
 assert.equal(layout.trees.length,7);assert.ok(layout.triangles<=6000);
 for(const tree of layout.trees){const original=restored.instances.find(t=>t.name===tree.name);assert.deepEqual(tree.matrix,original.matrix);assert.equal(tree.tile,original.tile);assert.equal(restored.prototypes[tree.prototype].kind,'tree');assert.ok([7,8].includes(tree.count));}
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(layout.source)).digest('hex'),layout.sourceSha256);
 const asset=fs.readFileSync('assets/golden-tree-lanterns/golden-lantern-lod.glb'),doc=JSON.parse(asset.subarray(20,20+asset.readUInt32LE(12)));
 assert.equal(doc.meshes.reduce((sum,m)=>sum+m.primitives.reduce((s,p)=>s+doc.accessors[p.indices].count/3,0),0),layout.triangles);
 console.log('PASS: 7 original trees / 53 lanterns; branch mounting, shared LOD, retry, deduplication, day/night, wireframe, disposal, unchanged source.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>fs.rmSync(dir,{recursive:true,force:true}));
