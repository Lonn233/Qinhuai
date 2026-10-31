// Offline spatial batches bound peak memory; keep the supplied GLB and texture bytes intact.
const fs=require('fs'),crypto=require('crypto');
const high=process.argv.includes('--high'),budget=high?180000:50000;
(async()=>{
 const {MeshoptSimplifier:S}=await import('meshoptimizer');await S.ready;
 const file='E:/soft/inspiration/灯会/model/贡名灯.glb',out='assets/gongming-lantern';fs.mkdirSync(out,{recursive:true});
 const data=fs.readFileSync(file),len=data.readUInt32LE(12),doc=JSON.parse(data.subarray(20,20+len)),bin=data.subarray(28+len),p=doc.meshes[0].primitives[0],old=doc.bufferViews;
 const widths={SCALAR:1,VEC2:2,VEC3:3,VEC4:4},types={5126:Float32Array,5125:Uint32Array,5123:Uint16Array};
 const read=id=>{const a=doc.accessors[id],v=old[a.bufferView],T=types[a.componentType];if(v.byteStride&&v.byteStride!==widths[a.type]*T.BYTES_PER_ELEMENT)throw Error('Interleaved data');return new T(bin.buffer,bin.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*widths[a.type]);};
 const sourceAttrs=Object.fromEntries(Object.entries(p.attributes).map(([k,id])=>[k,{a:doc.accessors[id],array:read(id)}]));const pos=sourceAttrs.POSITION.array,input=read(p.indices),bounds=sourceAttrs.POSITION.a;
 const bucket=new Uint8Array(input.length/3),counts=new Uint32Array(64);
 for(let i=0;i<input.length;i+=3){let key=0;for(let k=0;k<3;k++){const c=(pos[input[i]*3+k]+pos[input[i+1]*3+k]+pos[input[i+2]*3+k])/3;key+=Math.min(3,Math.max(0,Math.floor((c-bounds.min[k])/(bounds.max[k]-bounds.min[k])*4)))*(4**k)}bucket[i/3]=key;counts[key]+=3;}
 const views=[],accessors=[],chunks=[],primitives=[];let offset=0,triangles=0,maxError=0;
 function append(bytes){const pad=Buffer.alloc((bytes.length+3)&~3);bytes.copy(pad);chunks.push(pad);views.push({buffer:0,byteOffset:offset,byteLength:bytes.length});offset+=pad.length;return views.length-1;}
 function store(array,source){const a={...source,bufferView:append(Buffer.from(array.buffer,array.byteOffset,array.byteLength)),byteOffset:0,count:array.length/widths[source.type]};delete a.min;delete a.max;if(source.min){a.min=[Infinity,Infinity,Infinity];a.max=[-Infinity,-Infinity,-Infinity];array.forEach((v,i)=>{a.min[i%3]=Math.min(a.min[i%3],v);a.max[i%3]=Math.max(a.max[i%3],v)})}accessors.push(a);return accessors.length-1;}
 function simplify(key){const remap=new Int32Array(pos.length/3).fill(-1),kept=[];const indices=new Uint32Array(counts[key]);let cursor=0;for(let i=0;i<input.length;i+=3){if(bucket[i/3]!==key)continue;for(let t=0;t<3;t++){const old=input[i+t];if(remap[old]===-1){remap[old]=kept.length;kept.push(old)}indices[cursor++]=remap[old]}}
 const attrs={};for(const [name,{a,array}] of Object.entries(sourceAttrs)){const width=widths[a.type],v=new array.constructor(kept.length*width);kept.forEach((old,i)=>v.set(array.subarray(old*width,(old+1)*width),i*width));attrs[name]=v;}
 const weights=new Float32Array(kept.length*5);for(let i=0;i<kept.length;i++)weights.set([attrs.TEXCOORD_0[i*2],attrs.TEXCOORD_0[i*2+1],...attrs.NORMAL.subarray(i*3,i*3+3)],i*5);
 const target=Math.max(12,Math.floor(budget*3*indices.length/input.length/3)*3);
 const [result,error]=S.simplifyWithAttributes(indices,attrs.POSITION,3,weights,5,[.6,.6,.12,.12,.12],null,target,high?.015:.035,['Permissive','LockBorder']);maxError=Math.max(maxError,error);
 const used=[...new Set(result)],map=new Uint32Array(kept.length);used.forEach((old,i)=>map[old]=i);const primitive={attributes:{},material:p.material};
 for(const [name,array] of Object.entries(attrs)){const a=sourceAttrs[name].a,w=widths[a.type],v=new array.constructor(used.length*w);used.forEach((old,i)=>v.set(array.subarray(old*w,(old+1)*w),i*w));primitive.attributes[name]=store(v,a)}primitive.indices=store(Uint32Array.from(result,i=>map[i]),{type:'SCALAR',componentType:5125});primitives.push(primitive);triangles+=result.length/3;
 }
 for(let k=0;k<64;k++)if(counts[k]){simplify(k);global.gc?.();}
 // Merge batches back into one draw call, without changing UVs or normals.
 const merged={attributes:{},material:p.material},vertexCounts=primitives.map(p=>accessors[p.attributes.POSITION].count);
 const arr=id=>{const a=accessors[id],T=types[a.componentType],v=chunks[a.bufferView];return new T(v.buffer,v.byteOffset,a.count*widths[a.type]);};
 for(const name of Object.keys(p.attributes)){const a=sourceAttrs[name].a,T=types[a.componentType],array=new T(vertexCounts.reduce((a,b)=>a+b,0)*widths[a.type]);let at=0;for(const p of primitives){const v=arr(p.attributes[name]);array.set(v,at);at+=v.length}merged.attributes[name]=store(array,a);}
 const ix=new Uint32Array(triangles*3);let at=0,base=0;primitives.forEach((p,i)=>{for(const v of arr(p.indices))ix[at++]=v+base;base+=vertexCounts[i]});merged.indices=store(ix,{type:'SCALAR',componentType:5125});
 // Repack only merged attributes and images, dropping intermediate batch buffers.
 const finalIds=[...Object.values(merged.attributes),merged.indices],finalChunks=[],finalViews=[];let finalOffset=0;
 for(const id of finalIds){const a=accessors[id],chunk=chunks[a.bufferView];a.bufferView=finalViews.length;finalViews.push({buffer:0,byteOffset:finalOffset,byteLength:chunk.length});finalChunks.push(chunk);finalOffset+=chunk.length;}
 for(const image of doc.images||[]){const v=old[image.bufferView],bytes=bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength),pad=Buffer.alloc((bytes.length+3)&~3);bytes.copy(pad);image.bufferView=finalViews.length;finalViews.push({buffer:0,byteOffset:finalOffset,byteLength:bytes.length});finalChunks.push(pad);finalOffset+=pad.length;}
 const finalAccessors=finalIds.map(id=>accessors[id]);for(const name in merged.attributes)merged.attributes[name]=finalIds.indexOf(merged.attributes[name]);merged.indices=finalIds.indexOf(merged.indices);doc.meshes[0].primitives=[merged];doc.accessors=finalAccessors;doc.bufferViews=finalViews;doc.buffers=[{byteLength:finalOffset}];
 let json=Buffer.from(JSON.stringify(doc));json=Buffer.concat([json,Buffer.alloc((-json.length)&3,32)]);const head=Buffer.alloc(20),bh=Buffer.alloc(8);head.writeUInt32LE(0x46546c67);head.writeUInt32LE(2,4);head.writeUInt32LE(28+json.length+finalOffset,8);head.writeUInt32LE(json.length,12);head.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(finalOffset);bh.writeUInt32LE(0x004e4942,4);const fd=fs.openSync(out+(high?'/gongming-high.glb':'/gongming-low.glb'),'w');try{for(const c of [head,json,bh,...finalChunks])fs.writeSync(fd,c)}finally{fs.closeSync(fd)}
 const report={source:file,sha256:crypto.createHash('sha256').update(data).digest('hex'),sourceTriangles:input.length/3,triangles,maxError,bytes:28+json.length+finalOffset,drawCalls:1,texturePolicy:'Original embedded image bytes retained',sourceBounds:{min:bounds.min,max:bounds.max}};fs.writeFileSync(out+(high?'/audit-high.json':'/audit.json'),JSON.stringify(report,null,2));console.log(report);
})().catch(e=>{console.error(e);process.exitCode=1});
