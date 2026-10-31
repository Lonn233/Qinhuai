// Geometry-only LOD payloads. Near GLBs and all user presets remain untouched.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'assets/large-lantern-lods');fs.mkdirSync(out,{recursive:true});
function glb(file){const source=fs.readFileSync(path.resolve(root,file)),length=source.readUInt32LE(12),doc=JSON.parse(source.subarray(20,20+length)),bin=source.subarray(28+length);
 if(doc.meshes.length!==1||doc.meshes[0].primitives.length!==1||doc.nodes.length!==1||['translation','rotation','scale'].some(k=>doc.nodes[0][k])||doc.nodes[0].matrix?.some((v,i)=>v!==(i%5===0?1:0)))throw Error('Unexpected model structure: '+file);
 function read(id){const a=doc.accessors[id],v=doc.bufferViews[a.bufferView],Type={5126:Float32Array,5123:Uint16Array,5125:Uint32Array}[a.componentType],width={SCALAR:1,VEC2:2,VEC3:3}[a.type],array=new Type(a.count*width),bytes=Type.BYTES_PER_ELEMENT;for(let i=0;i<a.count;i++){const start=(v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||width*bytes);new Uint8Array(array.buffer,i*width*bytes,width*bytes).set(bin.subarray(start,start+width*bytes));}return array;}
 return {source,doc,read,p:doc.meshes[0].primitives[0]};
}
for(const [kind,nearPath,mediumPath,axis] of [
 ['gongming','assets/gongming-lantern/gongming-high.glb','work/large-lantern-lods/gongming-1.glb','x'],
 ['mountain','game/assets/mountain.glb','assets/qinhuai-modern-import/festival/mountain-low.glb','xz']
]){
 if(process.argv[2] && process.argv[2]!==kind)continue;
 const near=glb(nearPath),bounds=near.doc.accessors[near.p.attributes.POSITION],scale=1/(axis==='x'?bounds.max[0]-bounds.min[0]:Math.max(bounds.max[0]-bounds.min[0],bounds.max[2]-bounds.min[2])),origin=[(bounds.min[0]+bounds.max[0])/2,bounds.min[1],(bounds.min[2]+bounds.max[2])/2];
 const spec={version:1,kind,source:nearPath,sourceSha256:crypto.createHash('sha256').update(near.source).digest('hex'),sourceBytes:near.source.length,vertices:bounds.count,thresholds:{medium:.10,far:.035,hysteresis:.12},levels:[{level:0,triangles:near.read(near.p.indices).length/3}],geometryFile:kind+'-lods.bin'},chunks=[];let offset=0;
 function pack(array){const bytes=Buffer.from(array.buffer,array.byteOffset,array.byteLength),padded=Buffer.alloc((bytes.length+3)&~3);bytes.copy(padded);const info={byteOffset:offset,count:array.length};chunks.push(padded);offset+=padded.length;return info;}
 for(const [level,file] of [[1,mediumPath],[2,`work/large-lantern-lods/${kind}-2.glb`]]){
  const lod=glb(file),position=lod.read(lod.p.attributes.POSITION),normal=lod.read(lod.p.attributes.NORMAL),uv=lod.read(lod.p.attributes.TEXCOORD_0),indices=lod.read(lod.p.indices);
  if(indices.some(i=>i>=position.length/3))throw Error('Invalid indices');
  const index=position.length/3>65535?Uint32Array.from(indices):Uint16Array.from(indices);
  for(let i=0;i<position.length;i++)position[i]=(position[i]-origin[i%3])*scale;
  if([position,normal,uv].some(a=>a.some(n=>!Number.isFinite(n))))throw Error('Non-finite geometry');
  spec.levels.push({level,triangles:index.length/3,vertices:position.length/3,indexType:index.BYTES_PER_ELEMENT===4?'uint32':'uint16',attributes:{position:pack(position),normal:pack(normal),uv:pack(uv),index:pack(index)}});
 }
 spec.extraBytes=offset;fs.writeFileSync(path.join(out,spec.geometryFile),Buffer.concat(chunks));fs.writeFileSync(path.join(out,kind+'-lods.json'),JSON.stringify(spec,null,2)+'\n');console.log(kind,spec.levels.map(l=>l.triangles),offset+' geometry bytes');
}
