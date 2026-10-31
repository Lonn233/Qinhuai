const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),THREE=require('three');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'qinhuai-proxy-test-')),entry=path.join(dir,'layer.cjs');
require('esbuild').buildSync({entryPoints:['import-restored-proxies.js'],bundle:true,platform:'node',format:'cjs',outfile:entry,external:['three','three/*'],logLevel:'silent',define:{'import.meta.url':JSON.stringify('file:///restored-layer.js')}});
// Resolve THREE from the project's node_modules when loading the temporary bundle.
module.paths.push(path.resolve('node_modules'));const Module=require('node:module'),mod=new Module(entry,module);mod.filename=entry;mod.paths=module.paths;mod._compile(fs.readFileSync(entry,'utf8'),entry);const {ImportRestoredProxies,retainStreetAsset,retainStreetInstance}=mod.exports;
(async()=>{
 const identity=new THREE.Matrix4(),mirror=new THREE.Matrix4().makeScale(-2,3,2).setPosition(10,5,-4);
 const manifest={version:1,prototypes:{one:{file:'one.glb',source:'fixture',kind:'tree',triangles:1}},instances:[{tile:9,prototype:'one',matrix:identity.toArray()},{tile:9,prototype:'one',matrix:mirror.toArray()}]};
 let loads=0,attempts=0,disposedGeometry=0;
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,1,0,0,0,1,0],3));geometry.setIndex([0,1,2]);geometry.computeVertexNormals();geometry.addEventListener('dispose',()=>disposedGeometry++);
 const local=new THREE.Matrix4().makeRotationY(.4).setPosition(2,1,3);
 const loader=async()=>{loads++;const scene=new THREE.Group(),mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial());mesh.applyMatrix4(local);scene.add(mesh);return {scene};};
 const layer=new ImportRestoredProxies(new THREE.Group(),{load:loader,fetchManifest:async()=>{if(!attempts++)throw Error('temporary failure');return manifest;}});
 await assert.rejects(layer.registerTile(9),/temporary failure/);assert.ok(layer.stats.failures[9]);
 await Promise.all([layer.registerTile(9),layer.registerTile(9)]);assert.equal(loads,1);assert.equal(layer.stats.instances,2);assert.deepEqual(layer.stats.failures,{});
 const meshes=layer.root.children[0].children;assert.equal(meshes.length,2);
 meshes.forEach((mesh,index)=>{const matrix=new THREE.Matrix4();mesh.getMatrixAt(0,matrix);assert.ok(matrix.determinant()>0);const world=(index?mirror:identity).clone().multiply(local);for(let v=0;v<3;v++){const actual=new THREE.Vector3().fromBufferAttribute(mesh.geometry.attributes.position,v).applyMatrix4(matrix),expected=new THREE.Vector3().fromBufferAttribute(geometry.attributes.position,v).applyMatrix4(world);assert.ok(actual.distanceTo(expected)<1e-5);}assert.ok(Number.isFinite(mesh.boundingSphere.radius));});
 layer.setState({wireframe:true});assert.ok([...layer.materials].every(m=>m.wireframe));layer.dispose();layer.dispose();assert.equal(disposedGeometry,1);
 const production=JSON.parse(fs.readFileSync('assets/qinhuai-modern-import/restored/manifest.json'));assert.equal(production.instances.length,1546);assert.equal(Object.keys(production.prototypes).length,61);
 for(const item of production.instances){assert.ok([5,6,9,10,15].includes(item.tile));assert.ok(item.matrix.every(Number.isFinite));assert.ok(production.prototypes[item.prototype]);}
 const removed=['1c49fe21d2c2','1b883e520902','aef95eaffbbe','72ff35b1d880','8e1610e700d2','2433529e11e0','33bece1beb09','c20fd31662d0','0eee72f78bdb','b2235e4004eb'];
 for(const id of removed)assert.equal(retainStreetAsset(id,production.prototypes[id]),false,id);
 assert.equal(retainStreetAsset('new-person',{kind:'person'}),false);
 for(const id of ['2aef056dfd30','2653adabd207','1e927883527a','b5edc0957e35','f9c56fd5588e','725cc47fa7ec','c18b080bb16c','aea2429a8149','82b828ba1638','f36907c329f8','82584b68b828','ff70b10c3fc3','3cf718c9af4e']){assert.ok(production.prototypes[id]);assert.ok(retainStreetAsset(id,production.prototypes[id]),id);}
 const retained=production.instances.filter(item=>retainStreetInstance(item,production.prototypes));
 const shrubPlacements=production.instances.filter(item=>retainStreetAsset(item.prototype,production.prototypes[item.prototype])&&!retainStreetInstance(item,production.prototypes));
 assert.equal(shrubPlacements.length,104);
 assert.equal(shrubPlacements.filter(item=>item.tile===9&&item.matrix[14]>-19.6&&item.matrix[14]<-19.1).length,52);
 assert.ok(!retained.some(item=>item.name==='Obj3d66-646323-52-868'),'remaining screenshot tree removed');
 const selectedGroup=production.instances.filter(item=>['b5edc0957e35','f9c56fd5588e','725cc47fa7ec','c18b080bb16c'].includes(item.prototype)&&item.tile===9&&Math.abs(item.matrix[12]+2.66453338)<.3&&Math.abs(item.matrix[14]+14.80933224)<.3);
 assert.equal(selectedGroup.length,26);assert.ok(selectedGroup.every(item=>!retainStreetInstance(item,production.prototypes)),'selected tree and entire flower bed excluded');
 const requested=[];const filtered=new ImportRestoredProxies(new THREE.Group(),{fetchManifest:async()=>production,load:async url=>{requested.push(url);return {scene:new THREE.Group()};}});
 for(const tile of [5,6,9,10,15])await filtered.registerTile(tile);
 assert.equal(filtered.stats.instances,retained.length);assert.equal(filtered.stats.expected,retained.length);assert.equal(filtered.stats.excluded,1546-retained.length);assert.ok(filtered.stats.excluded>0);
 for(const id of removed)assert.ok(!requested.some(url=>url.endsWith('/'+production.prototypes[id].file)));
 filtered.dispose();
 console.log('PASS: retry, tile deduplication, mirrored geometry, disposal, retained trees/gardens, excluded people/seating/umbrellas; original manifest preserved.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>fs.rmSync(dir,{recursive:true,force:true}));
