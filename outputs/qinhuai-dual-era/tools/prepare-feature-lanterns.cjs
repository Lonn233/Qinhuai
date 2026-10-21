// Offline derivatives only: retain source files and embedded painted textures.
const fs=require('node:fs'),crypto=require('node:crypto');
const output='assets/feature-lanterns';
const specs=[['fish','E:/soft/inspiration/灯会/model/fish/golden_fish.glb',32000],['woman','E:/soft/inspiration/灯会/model/女灯.glb',60000]];
(async()=>{
 const {MeshoptSimplifier:S}=await import('meshoptimizer');await S.ready;fs.mkdirSync(output,{recursive:true});const audit=[];
 for(const [kind,file,target] of specs){
  const data=fs.readFileSync(file),length=data.readUInt32LE(12),doc=JSON.parse(data.subarray(20,20+length)),bin=data.subarray(28+length),oldViews=doc.bufferViews;
  const widths={SCALAR:1,VEC2:2,VEC3:3,VEC4:4},types={5126:Float32Array,5125:Uint32Array,5123:Uint16Array,5121:Uint8Array};
  function read(id){const a=doc.accessors[id],v=oldViews[a.bufferView],Type=types[a.componentType],width=widths[a.type];if(!Type||!width||a.sparse)throw Error('Unsupported accessor');const size=Type.BYTES_PER_ELEMENT,out=new Type(a.count*width);for(let i=0;i<a.count;i++){const start=(v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||width*size);new Uint8Array(out.buffer,i*width*size,width*size).set(bin.subarray(start,start+width*size));}return out;}
  const views=[],accessors=[],chunks=[];let offset=0,sourceTriangles=0,triangles=0,maxError=0;
  function append(bytes){const padded=Buffer.alloc((bytes.length+3)&~3);bytes.copy(padded);chunks.push(padded);views.push({buffer:0,byteOffset:offset,byteLength:bytes.length});offset+=padded.length;return views.length-1;}
  function store(array,source){const a={...source,bufferView:append(Buffer.from(array.buffer,array.byteOffset,array.byteLength)),byteOffset:0,count:array.length/widths[source.type]};delete a.min;delete a.max;if(source.type==='VEC3'&&source.min){a.min=[Infinity,Infinity,Infinity];a.max=[-Infinity,-Infinity,-Infinity];array.forEach((v,i)=>{a.min[i%3]=Math.min(a.min[i%3],v);a.max[i%3]=Math.max(a.max[i%3],v);});}accessors.push(a);return accessors.length-1;}
  for(const mesh of doc.meshes)for(const p of mesh.primitives){
   const pos=read(p.attributes.POSITION),uv=read(p.attributes.TEXCOORD_0),normal=read(p.attributes.NORMAL),input=Uint32Array.from(read(p.indices)),attributes=new Float32Array(pos.length/3*5);
   for(let i=0;i<pos.length/3;i++)attributes.set([uv[i*2],uv[i*2+1],normal[i*3],normal[i*3+1],normal[i*3+2]],i*5);
   const [indices,error]=S.simplifyWithAttributes(input,pos,3,attributes,5,[.6,.6,.12,.12,.12],null,target*3,.06,['Permissive']);
   const kept=Array.from(new Set(indices)),remap=new Map(kept.map((old,i)=>[old,i]));
   for(const [name,id] of Object.entries(p.attributes)){const source=doc.accessors[id],array=read(id),width=array.length/source.count,out=new array.constructor(kept.length*width);kept.forEach((old,i)=>out.set(array.subarray(old*width,(old+1)*width),i*width));p.attributes[name]=store(out,source);}
   p.indices=store(Uint32Array.from(indices,i=>remap.get(i)),{componentType:5125,type:'SCALAR'});sourceTriangles+=input.length/3;triangles+=indices.length/3;maxError=Math.max(maxError,error);
  }
  for(const image of doc.images||[])if(image.bufferView!==undefined){const v=oldViews[image.bufferView];image.bufferView=append(bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength));}
  doc.bufferViews=views;doc.accessors=accessors;doc.buffers=[{byteLength:offset}];let json=Buffer.from(JSON.stringify(doc));json=Buffer.concat([json,Buffer.alloc((-json.length)&3,32)]);const binary=Buffer.concat(chunks),header=Buffer.alloc(20),bh=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+binary.length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(binary.length);bh.writeUInt32LE(0x004e4942,4);
  const result=Buffer.concat([header,json,bh,binary]);fs.writeFileSync(`${output}/${kind}-low.glb`,result);const record={kind,source:file,sha256:crypto.createHash('sha256').update(data).digest('hex'),sourceTriangles,triangles,maxError,bytes:result.length};audit.push(record);console.log(record);
 }
 fs.writeFileSync(`${output}/audit.json`,JSON.stringify(audit,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
