// Run tools/blender_lion_lods.py first; pack geometry only, sharing existing painted textures at runtime.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets/qinhuai-modern-import/festival');
function glb(file){const source=fs.readFileSync(file),length=source.readUInt32LE(12),doc=JSON.parse(source.subarray(20,20+length)),bin=source.subarray(28+length);
 if(doc.meshes.length!==1||doc.meshes[0].primitives.length!==1||doc.nodes.length!==1||(['translation','rotation','scale'].some(k=>doc.nodes[0][k])||(doc.nodes[0].matrix&&doc.nodes[0].matrix.some((v,i)=>v!==(i%5===0?1:0)))))throw Error('Re-audit lion transforms before packing');
 function read(id){const a=doc.accessors[id],v=doc.bufferViews[a.bufferView],Type={5126:Float32Array,5123:Uint16Array,5125:Uint32Array}[a.componentType],width={SCALAR:1,VEC2:2,VEC3:3}[a.type],out=new Type(a.count*width),b=Type.BYTES_PER_ELEMENT;for(let i=0;i<a.count;i++){const start=(v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||width*b);new Uint8Array(out.buffer,i*width*b,width*b).set(bin.subarray(start,start+width*b));}return out;}
 return {source,doc,read,p:doc.meshes[0].primitives[0]};
}
const near=glb(path.join(root,'game/assets/lion.glb')),bounds=near.doc.accessors[near.p.attributes.POSITION],scale=1/Math.max(bounds.max[0]-bounds.min[0],bounds.max[2]-bounds.min[2]),origin=[(bounds.min[0]+bounds.max[0])/2,bounds.min[1],(bounds.min[2]+bounds.max[2])/2];
const report={version:3,source:'game/assets/lion.glb',sourceSha256:crypto.createHash('sha256').update(near.source).digest('hex'),sourceBytes:near.source.length,vertices:bounds.count,sourceTriangles:near.read(near.p.indices).length/3,thresholds:{medium:.10,far:.035,hysteresis:.12},levels:[{level:0,triangles:near.read(near.p.indices).length/3}],geometryFile:'lion-lods.bin'},chunks=[];let byteOffset=0;
function pack(array){const bytes=Buffer.from(array.buffer,array.byteOffset,array.byteLength),padded=Buffer.alloc((bytes.length+3)&~3);bytes.copy(padded);const entry={byteOffset,count:array.length};chunks.push(padded);byteOffset+=padded.length;return entry;}
for(const level of [1,2]){
 const lod=glb(path.join(root,`work/lion-lods/lion-lod${level}.glb`)),position=lod.read(lod.p.attributes.POSITION),normal=lod.read(lod.p.attributes.NORMAL),uv=lod.read(lod.p.attributes.TEXCOORD_0),index=Uint16Array.from(lod.read(lod.p.indices));
 for(let i=0;i<position.length;i++)position[i]=(position[i]-origin[i%3])*scale;
 if(position.length/3>65535||lod.read(lod.p.indices).some(i=>i>=position.length/3)||index.some(i=>i>=position.length/3))throw Error('LOD index out of range');
 report.levels.push({level,triangles:index.length/3,vertices:position.length/3,attributes:{position:pack(position),normal:pack(normal),uv:pack(uv),index:pack(index)}});
}
report.extraBytes=byteOffset;fs.writeFileSync(path.join(dir,report.geometryFile),Buffer.concat(chunks));fs.writeFileSync(path.join(dir,'lion-lods.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
