const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),THREE=require('three');
require('esbuild').buildSync({entryPoints:['courtyard-rack-lanterns.js'],bundle:true,platform:'node',format:'cjs',outfile:'work/courtyard-racks-20261021/layer.cjs',external:['three','three/*'],logLevel:'silent'});
const {CourtyardRackLanterns}=require('../work/courtyard-racks-20261021/layer.cjs');
async function bare(kind){
 const b=fs.readFileSync('assets/courtyard-rack-lanterns/'+kind+'-low.glb'),l=b.readUInt32LE(12),j=JSON.parse(b.subarray(20,20+l));
 for(const m of j.materials||[]){delete m.normalTexture;delete m.occlusionTexture;delete m.emissiveTexture;if(m.pbrMetallicRoughness){delete m.pbrMetallicRoughness.baseColorTexture;delete m.pbrMetallicRoughness.metallicRoughnessTexture;}}
 delete j.textures;delete j.images;const text=Buffer.from(JSON.stringify(j)),chunk=Buffer.alloc(Math.ceil(text.length/4)*4,32);text.copy(chunk);
 const out=Buffer.concat([b.subarray(0,20),chunk,b.subarray(20+l)]);out.writeUInt32LE(out.length,8);out.writeUInt32LE(chunk.length,12);
 const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');return new GLTFLoader().parseAsync(out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength),'');
}
(async()=>{
 const {RACK_REGIONS,RACK_GROUND_Y,RACK_PAVING_REGIONS,riddlePaperAnchors}=await import('../courtyard-rack-layout.mjs');
 let loads=0,fail=true;const layer=new CourtyardRackLanterns(new THREE.Group(),{load:async k=>{loads++;if(fail){fail=false;throw Error('retry');}return bare(k);}});
 await layer.registerTile(8);assert.equal(loads,0);await assert.rejects(layer.registerTile(9),/retry/);assert.equal(layer.root.children.length,0);
 await Promise.all([layer.registerTile(9),layer.registerTile(9)]);assert.equal(loads,5);assert.equal(layer.stats.lamps,108);assert.equal(layer.stats.drawCalls,8);
 const boxes=[],m=new THREE.Matrix4();let minGap=Infinity,minTreeClearance=Infinity;
 layer.root.traverse(mesh=>{if(!mesh.isInstancedMesh)return;const r=[...RACK_REGIONS,...RACK_PAVING_REGIONS].find(r=>r.id===mesh.userData.rackRegion);mesh.geometry.computeBoundingBox();
  for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,m);const b=mesh.geometry.boundingBox.clone().applyMatrix4(m);
   assert.ok(b.min.x>=r.minX&&b.max.x<=r.maxX&&b.min.z>=r.minZ&&b.max.z<=r.maxZ,mesh.name+' outside floor');assert.ok(b.min.y>=RACK_GROUND_Y-1e-6,mesh.name+' below paving');
   for(const treeX of mesh.userData.walkSurface?[]:[-10.05,-1.1])for(const z of [-26.9,-29.2,-31.5,-33.8]){const dx=Math.max(b.min.x-treeX,0,treeX-b.max.x),dz=Math.max(b.min.z-z,0,z-b.max.z),clearance=Math.hypot(dx,dz)-.3;minTreeClearance=Math.min(minTreeClearance,clearance);assert.ok(clearance>.1,mesh.name+' overlaps trunk clearance');}
   if(mesh.userData.rackKind)assert.ok(b.min.y-RACK_GROUND_Y>1,'head clearance below lamps');
   if(mesh.userData.rackKind)boxes.push({kind:mesh.userData.rackKind,region:r.id,box:b});
  }
 });
 for(let i=0;i<boxes.length;i++)for(let k=i+1;k<boxes.length;k++){const a=boxes[i].box,b=boxes[k].box,gap=Math.hypot(Math.max(a.min.x-b.max.x,b.min.x-a.max.x,0),Math.max(a.min.y-b.max.y,b.min.y-a.max.y,0),Math.max(a.min.z-b.max.z,b.min.z-a.max.z,0));minGap=Math.min(minGap,gap);assert.ok(gap>.005,'lanterns intersect or lose safety gap: '+gap);}
 assert.ok(minGap<.012,'lanterns should be nearly touching');
 for(const layout of layer.root.userData.layouts){const sizes=layout.mounts.map(m=>m.height);assert.ok(Math.max(...sizes)/Math.min(...sizes)>1.5,'mixed lantern sizes');assert.ok(sizes.filter(h=>h>=.45).length>=20,'retain a substantial group of larger lanterns');}
 for(const l of layer.root.userData.layouts){assert.equal(l.wood.filter(s=>s.role==='corner-post').length,4);for(const kind of ['green','blue','gold','red']){assert.equal(l.mounts.filter(m=>m.kind===kind&&m.mode==='net').length,27);assert.equal(l.mounts.filter(m=>m.kind===kind&&m.mode==='hanging').length,0);}}
 const anchors=riddlePaperAnchors();assert.equal(anchors.length,10);
 for(const anchor of anchors){const mount=layer.root.userData.layouts[0].mounts[anchor.mountIndex];assert.equal(anchor.x,mount.center[0]);assert.equal(anchor.z,mount.center[2]);assert.ok(Math.abs(anchor.top-(mount.center[1]-mount.height/2))<1e-8);assert.ok(Math.abs(anchor.y+anchor.height/2+anchor.cordLength-anchor.top)<1e-8);}
 for(const l of layer.root.userData.layouts){
  assert.ok(Math.abs(l.shelf-RACK_GROUND_Y-1.90)<1e-8,'raised canopy height');
  assert.ok(l.wood.every(s=>Math.max(s.a[1],s.b[1])<=l.shelf+.041),'no upper tier');
  const heights=l.mounts.map(m=>m.center[1]);assert.ok(Math.max(...heights)-Math.min(...heights)>.18,'vary hanging height');
 }
 for(const l of layer.root.userData.layouts)for(const mount of l.mounts){
  assert.equal(mount.rotation,0,'lantern must stay upright');
  const hanger=l.ropes.find(r=>r.role===(mount.mode==='net'?'net-hanger':'hanger')&&Math.abs(r.b[0]-mount.center[0])<1e-8&&Math.abs(r.b[2]-mount.center[2])<1e-8);
  assert.ok(hanger,'missing suspension string');assert.ok(Math.abs(hanger.b[1]-mount.center[1]-mount.height/2)<1e-8,'string must meet lantern top');
  if(mount.mode==='net')assert.ok(l.ropes.some(r=>r.role==='net-support'&&r.a[2]===hanger.a[2]&&r.a[1]===hanger.a[1]),'hanger must connect to support rope');
 }
 layer.lightControls={'rack-green':{enabled:true,brightness:2,inheritColor:false,color:'#123456'}};layer.setState();assert.equal(layer.entries.get('rack-green').uniforms.uClothPower.value,1.44);assert.equal(layer.entries.get('rack-blue').uniforms.uClothPower.value,.72);assert.equal(layer.entries.get('rack-blue').uniforms.uClothTint.value.getHexString(),'ffffff');layer.setState({night:false});for(const e of layer.entries.values())assert.equal(e.uniforms.uClothPower.value,0);
 const report={stats:layer.stats,minLanternGap:minGap,minTrunkClearance:minTreeClearance,boxes:boxes.map(b=>({kind:b.kind,region:b.region,min:b.box.min.toArray(),max:b.box.max.toArray()}))};fs.writeFileSync('work/courtyard-racks-20261021/geometry-check.json',JSON.stringify(report,null,2));layer.dispose();layer.dispose();assert.equal(layer.resources.size,0);assert.equal(layer.root.children.length,0);
 let resume;const pending=new CourtyardRackLanterns(new THREE.Group(),{load:()=>new Promise(r=>resume=r)}),task=pending.registerTile(9);pending.dispose();resume(await bare('green'));await task;assert.equal(pending.resources.size,0);assert.equal(pending.ready,false);
 console.log('PASS: real GLB bounds, 108 lanterns, aligned riddle slips, equal mix, trunk clearance, independent lighting, retry and disposal',JSON.stringify({minGap,minTreeClearance}));
})().catch(e=>{console.error(e);process.exitCode=1;});
