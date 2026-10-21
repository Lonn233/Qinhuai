// Bounded, non-destructive Kuixing-only pilot using upstream meshoptimizer.
// All retained positions/normals/UVs and embedded textures come from the original.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {MeshoptSimplifier:S}=require('./asset-deps/node_modules/meshoptimizer');
const root=path.resolve(__dirname,'..'),out=path.join(root,'assets/kuixing-pilot');
const level=process.argv[2]||'LOD0',presets={LOD0:{target:900000,error:.002},LOD1:{target:200000,error:.006},LOD2:{target:50000,error:.015}};
if(!presets[level])throw new Error('Unknown pilot preset');
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
(async()=>{
 await S.ready;const started=performance.now(),file=path.join(root,'Meshy_AI_kuixingge_1016044736_texture.glb'),raw=fs.readFileSync(file),jsonLength=raw.readUInt32LE(12),j=JSON.parse(raw.toString('utf8',20,20+jsonLength)),bin=raw.subarray(28+jsonLength);
 if(j.meshes.length!==1||j.meshes[0].primitives.length!==1)throw new Error('This pilot only supports the audited pavilion');
 const prim=j.meshes[0].primitives[0];if(Object.keys(prim.attributes).sort().join()!=='NORMAL,POSITION,TEXCOORD_0')throw new Error('Unexpected attributes; stop rather than drop data');
 function accessor(i,Type){const a=j.accessors[i],v=j.bufferViews[a.bufferView];if(v.byteStride||a.sparse)throw new Error('Unsupported accessor layout');return new Type(bin.buffer,bin.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*({VEC3:3,VEC2:2,SCALAR:1}[a.type]));}
 const pos=accessor(prim.attributes.POSITION,Float32Array),normal=accessor(prim.attributes.NORMAL,Float32Array),uv=accessor(prim.attributes.TEXCOORD_0,Float32Array),idx=accessor(prim.indices,Uint32Array),n=pos.length/3;
 const pa=j.accessors[prim.attributes.POSITION],min=pa.min,max=pa.max,extent=Math.max(...max.map((v,i)=>v-min[i]));
 const cell=extent*.0015,grid=new Set(),key=(x,y,z)=>x+y*2048+z*4194304;
 const coord=p=>p.map((v,i)=>Math.floor((v-min[i])/cell));
 const paths=JSON.parse(fs.readFileSync(path.join(out,'eaves.json'),'utf8'));
 for(const line of paths)for(let i=0;i<line.length;i++){
  const a=line[i],b=line[(i+1)%line.length],len=Math.hypot(...a.map((v,k)=>v-b[k])),steps=Math.max(1,Math.ceil(len/(cell*.5)));
  for(let s=0;s<=steps;s++){const [x,y,z]=coord(a.map((v,k)=>v+(b[k]-v)*s/steps));for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++)grid.add(key(x+dx,y+dy,z+dz));}
 }
 const locks=new Uint8Array(n),attrs=new Float32Array(n*5);let locked=0;
 for(let i=0;i<n;i++){
  const x=pos[i*3],y=pos[i*3+1],z=pos[i*3+2];
  if(grid.has(key(Math.floor((x-min[0])/cell),Math.floor((y-min[1])/cell),Math.floor((z-min[2])/cell)))||y>max[1]-extent*.006||Math.min(x-min[0],max[0]-x,z-min[2],max[2]-z)<extent*.0003){locks[i]=1;locked++;}
  attrs.set(normal.subarray(i*3,i*3+3),i*5);attrs[i*5+3]=uv[i*2];attrs[i*5+4]=uv[i*2+1];
 }
 console.log(JSON.stringify({level,sourceTriangles:idx.length/3,vertices:n,locked,phase:'simplify'}));
 const startSimplify=performance.now();const [indices,error]=S.simplifyWithAttributes(idx,pos,3,attrs,5,[.25,.25,.25,4,4],locks,presets[level].target*3,presets[level].error,[]);
 const simplifySeconds=(performance.now()-startSimplify)/1000;
 const [remap,count]=S.compactMesh(indices);const positions=new Float32Array(count*3),normals=new Float32Array(count*3),uvs=new Float32Array(count*2),lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<n;i++){const dst=remap[i];if(dst===undefined||dst===0xffffffff)continue;positions.set(pos.subarray(i*3,i*3+3),dst*3);normals.set(normal.subarray(i*3,i*3+3),dst*3);uvs.set(uv.subarray(i*2,i*2+2),dst*2);for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],pos[i*3+k]);hi[k]=Math.max(hi[k],pos[i*3+k]);}}
 const result=structuredClone(j),parts=[];result.bufferViews=[];result.accessors=[];let offset=0;
 function append(bytes,target){const b=Buffer.from(bytes.buffer,bytes.byteOffset,bytes.byteLength),index=result.bufferViews.length;result.bufferViews.push({buffer:0,byteOffset:offset,byteLength:b.length,...(target?{target}:{})});parts.push(b);offset+=b.length;if(offset%4){const pad=Buffer.alloc(4-offset%4);parts.push(pad);offset+=pad.length;}return index;}
 function attr(array,type,componentType,target){const view=append(array,target),id=result.accessors.length;result.accessors.push({bufferView:view,componentType,count:array.length/({SCALAR:1,VEC2:2,VEC3:3}[type]),type,...(array===positions?{min:lo,max:hi}:{})});return id;}
 const rp=result.meshes[0].primitives[0];rp.attributes={POSITION:attr(positions,'VEC3',5126,34962),NORMAL:attr(normals,'VEC3',5126,34962),TEXCOORD_0:attr(uvs,'VEC2',5126,34962)};rp.indices=attr(indices,'SCALAR',5125,34963);
 const imageHashes=[];for(let i=0;i<j.images.length;i++){const v=j.bufferViews[j.images[i].bufferView],b=bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength);result.images[i].bufferView=append(b);imageHashes.push(digest(b));}
 result.buffers=[{byteLength:offset}];result.asset.generator='Qinhuai Kuixing pilot / meshoptimizer 1.3.0; candidate NOT APPROVED';
 result.extras={...result.extras,pilot:{level,approved:false,sourceBounds:{min,max},lockedVertices:locked}};
 let text=Buffer.from(JSON.stringify(result));if(text.length%4)text=Buffer.concat([text,Buffer.alloc(4-text.length%4,32)]);
 const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(28+text.length+offset,8);header.writeUInt32LE(text.length,12);header.writeUInt32LE(0x4e4f534a,16);const bh=Buffer.alloc(8);bh.writeUInt32LE(offset,0);bh.writeUInt32LE(0x004e4942,4);
 const output=path.join(out,'export','kuixing_'+level+'.glb');const fd=fs.openSync(output,'w');try{for(const b of [header,text,bh,...parts])fs.writeSync(fd,b);}finally{fs.closeSync(fd);}
 const report={algorithm:'meshoptimizer 1.3.0 simplifyWithAttributes (no vertex relocation, no permissive/prune/sloppy flags)',level,approval:'candidate_not_approved',source_sha256:digest(raw),source_bytes:raw.length,source_triangles:idx.length/3,source_vertices:n,requested_triangles:presets[level].target,actual_triangles:indices.length/3,actual_vertices:count,position_error_limit:presets[level].error,returned_attribute_aware_error:error,error_units:'relative attribute-aware metric, NOT a screen-pixel error or pure position Hausdorff bound',locked_vertices:locked,attribute_weights:[.25,.25,.25,4,4],source_bounds:{min,max},candidate_bounds:{min:lo,max:hi},source_geometry_buffer_bytes:idx.byteLength+pos.byteLength+normal.byteLength+uv.byteLength,candidate_geometry_buffer_bytes:indices.byteLength+positions.byteLength+normals.byteLength+uvs.byteLength,glb_bytes:fs.statSync(output).size,images_sha256:imageHashes,texture_policy:'Source JPEG bytes preserved exactly, no resize/recompression; existing normal map retained, no new bake',simplify_seconds:simplifySeconds,total_seconds:(performance.now()-started)/1000,process_memory:process.memoryUsage(),limitations:['Eave mask is proximity-based, not semantic segmentation','UV/normal preservation and silhouette require visual approval','Candidate excluded from default page until in-game verification']};
 fs.writeFileSync(path.join(out,'reports',level+'.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
