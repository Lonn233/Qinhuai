const assert = require('node:assert/strict'), fs = require('node:fs'), os = require('node:os'), path = require('node:path'), THREE = require('three');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qinhuai-courtyard-unit-')), entry = path.join(dir, 'layer.cjs');
require('esbuild').buildSync({entryPoints:['courtyard-lantern-layer.js'],bundle:true,platform:'node',format:'cjs',outfile:entry,external:['three','three/*'],logLevel:'silent'});
const Module = require('node:module'), mod = new Module(entry, module); mod.paths = module.paths; mod._compile(fs.readFileSync(entry,'utf8'), entry);
const {CourtyardLanternLayer} = mod.exports;
function fixture() {
 const geometry = new THREE.BoxGeometry(1,1,1), material = new THREE.MeshStandardMaterial(), reflected = geometry.clone();
 let disposed = 0, loads = 0, fail = true;
 for (const object of [geometry,material,reflected]) object.addEventListener('dispose',()=>disposed++);
 const parts = [{geometry,material,matrix:new THREE.Matrix4().makeScale(-1,1,1)}];
 return {trees:{manifestReady:async()=>{},prototypeReady:async()=>{loads++;if(fail){fail=false;throw Error('retry');}return parts;},mirrored:()=>reflected},
  lanterns:{modelReady:async()=>[{geometry,material,matrix:new THREE.Matrix4()}]},get loads(){return loads;},get disposed(){return disposed;}};
}
(async()=>{
 const source = fixture(), parent = new THREE.Group(), layer = new CourtyardLanternLayer(parent,source);
 await layer.registerTile(8);assert.equal(source.loads,0);
 await assert.rejects(layer.registerTile(9),/retry/);assert.equal(layer.root.children.length,0);
 await Promise.all([layer.registerTile(9),layer.registerTile(9)]);await layer.registerTile(9);
 assert.equal(source.loads,2);assert.equal(layer.stats.trees,8);assert.equal(layer.stats.lamps,216);assert.equal(layer.stats.nets,2);assert.ok(layer.stats.drawCalls<=6);
 for(const matrix of layer.root.userData.treeMatrices){const p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();matrix.decompose(p,q,s);assert.ok(Math.abs(p.y-s.y*.50000006-11.84)<1e-6);assert.ok(p.x<-8||p.x>-3);}
 const mounts = layer.root.userData.mounts;
 assert.equal(mounts.filter(m=>m.kind==='net').length,168);assert.equal(mounts.filter(m=>m.kind==='tree').length,48);
 for(const m of mounts){assert.ok(m.branch.y>m.top.y);assert.ok(m.top.y>12.9);assert.ok(m.side==='left'?m.top.x<-9:m.top.x> -2);}
 layer.root.traverse(o=>{assert.ok(!o.isLight);if(o.isInstancedMesh){assert.ok(Number.isFinite(o.boundingSphere.radius));for(let i=0;i<o.count;i++){const m=new THREE.Matrix4();o.getMatrixAt(i,m);assert.ok(m.elements.every(Number.isFinite));assert.ok(m.determinant()>0);}}});
 layer.setState({night:false});assert.ok(!layer.halo.visible);layer.setState({night:true,wireframe:true});assert.ok(!layer.halo.visible);layer.setState({wireframe:false});assert.ok(layer.halo.visible);
 layer.dispose();layer.dispose();assert.equal(source.disposed,0);assert.equal(layer.root.parent,null);assert.equal(layer.stats.lamps,0);
 const waiting=fixture();let release;waiting.trees.manifestReady=()=>new Promise(r=>release=r);const pendingLayer=new CourtyardLanternLayer(parent,waiting);const pending=pendingLayer.registerTile(9);pendingLayer.dispose();waiting.trees.prototypeReady=async()=>[];release();await pending;assert.equal(pendingLayer.stats.trees,0);assert.equal(pendingLayer.root.children.length,0);assert.equal(waiting.disposed,0);
 console.log('PASS: 8 grounded trees, 216 lamps, side-only sagging nets, positive matrices, shared resources, retry, deduplication, state and disposal.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>fs.rmSync(dir,{recursive:true,force:true}));
