// Offline refinement of Blender exports; source exports remain recoverable in work/.
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const {MeshoptSimplifier:S}=await import('meshoptimizer');await S.ready;
 const dir='assets/qinhuai-modern-import/restored',backup='work/model-completeness-20261019/blender-prototypes';fs.mkdirSync(backup,{recursive:true});
 const manifest=JSON.parse(fs.readFileSync(dir+'/manifest.json'));
 for(const [id,rec] of Object.entries(manifest.prototypes)){
  const src=path.join(dir,rec.file),original=path.join(backup,rec.file);
  if(!fs.existsSync(original))fs.copyFileSync(src,original);
  const data=fs.readFileSync(original),jl=data.readUInt32LE(12),doc=JSON.parse(data.subarray(20,20+jl)),bin=data.subarray(28+jl);
  const views=doc.bufferViews,accessors=doc.accessors,newViews=[],newAccessors=[],chunks=[];let offset=0,total=0;
  function append(bytes){const padded=Buffer.alloc((bytes.length+3)&~3);bytes.copy(padded);chunks.push(padded);const i=newViews.length;newViews.push({buffer:0,byteOffset:offset,byteLength:bytes.length});offset+=padded.length;return i;}
  function read(i){const a=accessors[i],v=views[a.bufferView],width={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type],Ctor={5126:Float32Array,5125:Uint32Array,5123:Uint16Array,5121:Uint8Array}[a.componentType];if(!Ctor||!width)throw Error('unsupported attribute');const size=Ctor.BYTES_PER_ELEMENT,stride=v.byteStride||width*size,out=new Ctor(a.count*width);for(let k=0;k<a.count;k++){const begin=(v.byteOffset||0)+(a.byteOffset||0)+k*stride;new Uint8Array(out.buffer,k*width*size,width*size).set(bin.subarray(begin,begin+width*size));}return {a,arr:out,width};}
  function store(arr,a){const idx=newAccessors.length;const copy={...a,bufferView:append(Buffer.from(arr.buffer,arr.byteOffset,arr.byteLength)),byteOffset:0,count:arr.length/({SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type])};delete copy.min;delete copy.max;if(a.type==='VEC3'&&a.min){copy.min=[Infinity,Infinity,Infinity];copy.max=[-Infinity,-Infinity,-Infinity];for(let j=0;j<arr.length;j++){const c=j%3;copy.min[c]=Math.min(copy.min[c],arr[j]);copy.max[c]=Math.max(copy.max[c],arr[j]);}}newAccessors.push(copy);return idx;}
  let sourceCount=0;for(const m of doc.meshes)for(const p of m.primitives)sourceCount+=accessors[p.indices].count/3;
  const budget=rec.kind==='tree'?24000:rec.source.includes('iAlpine')?350:rec.source.includes('iTrees')?800:rec.kind==='plant'?1800:rec.kind==='person'?1000:1800;
  function leafComponents(indices,positions,target){
   const parent=new Int32Array(positions.length/3);for(let i=0;i<parent.length;i++)parent[i]=i;
   function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
   for(let i=0;i<indices.length;i+=3){const r=find(indices[i]);parent[find(indices[i+1])]=r;parent[find(indices[i+2])]=r;}
   const groups=new Map();for(let i=0;i<indices.length;i+=3){const key=find(indices[i]);let g=groups.get(key);if(!g){g={key,faces:[],area:0};groups.set(key,g);}g.faces.push(i);const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3,ux=positions[b]-positions[a],uy=positions[b+1]-positions[a+1],uz=positions[b+2]-positions[a+2],vx=positions[c]-positions[a],vy=positions[c+1]-positions[a+1],vz=positions[c+2]-positions[a+2];g.area+=Math.hypot(uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx);}
   // Keep connected leaf cards intact instead of collapsing across disconnected foliage.
   if(groups.size<100||[...groups.values()].some(g=>g.faces.length*3>target*.2))return null;
   for(const g of groups.values()){let x=(g.key+1)|0;x=Math.imul(x^(x>>>16),0x45d9f3b);x=Math.imul(x^(x>>>16),0x45d9f3b);const u=((x^(x>>>16))>>>0)/4294967296;g.score=-Math.log(Math.max(u,1e-9))/Math.max(g.area,1e-12);}
   const sorted=[...groups.values()].sort((a,b)=>a.score-b.score),faces=[];let size=0;
   for(const g of sorted){if(size+g.faces.length*3>target)continue;faces.push(...g.faces);size+=g.faces.length*3;}
   faces.sort((a,b)=>a-b);return Uint32Array.from(faces.flatMap(i=>[indices[i],indices[i+1],indices[i+2]]));
  }
  for(const m of doc.meshes)for(const p of m.primitives){
   const pos=read(p.attributes.POSITION),input=Uint32Array.from(read(p.indices).arr),target=Math.max(12,Math.floor(budget*(input.length/3)/sourceCount)*3);let indices=input;
   if(input.length>target){
    const foliage=['tree','plant'].includes(rec.kind);
    const leaves=foliage?leafComponents(input,pos.arr,target):null;
    if(leaves?.length)indices=leaves;
    else {
     [indices]=S.simplify(input,pos.arr,3,target,foliage?.008:.025,['Permissive']);
     if(indices.length>target*3){const [spatial]=S.simplifySloppy(input,pos.arr,3,null,target,.008);if(spatial.length>target*.5&&spatial.length<indices.length)indices=spatial;}
    }
   }
   const kept=Array.from(new Set(indices)),map=new Map(kept.map((v,i)=>[v,i]));
   for(const [name,ai] of Object.entries(p.attributes)){const {a,arr,width}=read(ai),out=new arr.constructor(kept.length*width);kept.forEach((old,i)=>out.set(arr.subarray(old*width,(old+1)*width),i*width));p.attributes[name]=store(out,a);}
   p.indices=store(Uint32Array.from(indices,x=>map.get(x)),{componentType:5125,type:'SCALAR'});total+=indices.length/3;
  }
  for(const img of doc.images||[])if(img.bufferView!==undefined){const v=views[img.bufferView];img.bufferView=append(bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength));}
  doc.bufferViews=newViews;doc.accessors=newAccessors;doc.buffers=[{byteLength:offset}];let js=Buffer.from(JSON.stringify(doc));js=Buffer.concat([js,Buffer.alloc((-js.length)&3,32)]);const binary=Buffer.concat(chunks),header=Buffer.alloc(20),bh=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+js.length+binary.length,8);header.writeUInt32LE(js.length,12);header.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(binary.length);bh.writeUInt32LE(0x004e4942,4);fs.writeFileSync(src,Buffer.concat([header,js,bh,binary]));
  rec.blenderTriangles=sourceCount;rec.triangles=total;rec.bytes=fs.statSync(src).size;rec.optimization='Intact leaf-component sampling; meshoptimizer bounded geometric error .008 for foliage/.025 for other objects';fs.writeFileSync(path.join(dir,id+'.json'),JSON.stringify(rec,null,2));console.log(rec.source,sourceCount,'->',total,rec.bytes);
 }
 fs.writeFileSync(dir+'/manifest.json',JSON.stringify(manifest));
 console.log('TOTAL',Object.values(manifest.prototypes).reduce((s,p)=>s+p.bytes,0),'bytes',manifest.instances.reduce((s,i)=>s+manifest.prototypes[i.prototype].triangles,0),'instanced triangles');
})().catch(e=>{console.error(e);process.exitCode=1;});
