// Offline-only: keep the supplied GLB intact and publish a UV-preserving shared LOD.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const SOURCE='E:/soft/inspiration/灯会/model/金灯笼.glb';
const OUTPUT='assets/golden-tree-lanterns';
function glb(file){
 const data=fs.readFileSync(file),length=data.readUInt32LE(12),doc=JSON.parse(data.subarray(20,20+length)),bin=data.subarray(28+length);
 function read(id){const a=doc.accessors[id],v=doc.bufferViews[a.bufferView],width={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type],Type={5126:Float32Array,5125:Uint32Array,5123:Uint16Array,5121:Uint8Array}[a.componentType];
  if(!Type||!width||a.sparse)throw Error('Unsupported source accessor');const size=Type.BYTES_PER_ELEMENT,result=new Type(a.count*width);
  for(let i=0;i<a.count;i++){const start=(v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||width*size);new Uint8Array(result.buffer,i*width*size,width*size).set(bin.subarray(start,start+width*size));}return result;
 }
 return {data,doc,bin,read};
}
function branchAnchors(file,count){
 const {doc,read}=glb(file),primitive=doc.meshes[0].primitives[0],pos=read(primitive.attributes.POSITION),indices=read(primitive.indices),candidates=[];
 for(let i=0;i<indices.length;i+=3){
  const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3;
  const p=[0,1,2].map(k=>(pos[a+k]+pos[b+k]+pos[c+k])/3),r=Math.hypot(p[0],p[2]);
  const u=[0,1,2].map(k=>pos[b+k]-pos[a+k]),v=[0,1,2].map(k=>pos[c+k]-pos[a+k]);
  const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],size=Math.hypot(...n);
  // Sample actual woody underside triangles, not the disconnected leaf cards.
  if(r>.105&&r<.31&&p[1]>-.015&&p[1]<.33&&size>1e-10&&n[1]/size<-.12)candidates.push({p,angle:Math.atan2(p[2],p[0]),r});
 }
 const selected=[];
 for(let i=0;i<count;i++){
  const angle=i*Math.PI*2/count+.24,targetY=[.04,.19,.11,.25,.065,.21,.12,.28][i];
  const scored=candidates.filter(c=>selected.every(p=>Math.hypot(...c.p.map((v,k)=>v-p[k]))>.125)).map(c=>{
   const delta=Math.atan2(Math.sin(c.angle-angle),Math.cos(c.angle-angle));
   return {c,score:delta*delta*.06+(c.p[1]-targetY)**2+(c.r-.22)**2*.5};
  }).sort((a,b)=>a.score-b.score);
  if(!scored.length)throw Error('Insufficient separated branch mounts: '+file);
  selected.push(scored[0].c.p);
 }
 return selected;
}
(async()=>{
 const {MeshoptSimplifier:S}=await import('meshoptimizer');await S.ready;
 fs.mkdirSync(OUTPUT,{recursive:true});const {data,doc,bin,read}=glb(SOURCE),originalViews=doc.bufferViews;
 const views=[],accessors=[],chunks=[];let offset=0,sourceTriangles=0,triangles=0;
 function append(bytes){const padded=Buffer.alloc((bytes.length+3)&~3);bytes.copy(padded);chunks.push(padded);const id=views.length;views.push({buffer:0,byteOffset:offset,byteLength:bytes.length});offset+=padded.length;return id;}
 function store(array,source){const a={...source,bufferView:append(Buffer.from(array.buffer,array.byteOffset,array.byteLength)),byteOffset:0,count:array.length/({SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[source.type])};delete a.min;delete a.max;
  if(source.type==='VEC3'&&source.min){a.min=[Infinity,Infinity,Infinity];a.max=[-Infinity,-Infinity,-Infinity];array.forEach((v,i)=>{a.min[i%3]=Math.min(a.min[i%3],v);a.max[i%3]=Math.max(a.max[i%3],v);});}
  accessors.push(a);return accessors.length-1;
 }
 const bounds=doc.accessors[doc.meshes[0].primitives[0].attributes.POSITION],sourceBounds={min:bounds.min,max:bounds.max};
 for(const mesh of doc.meshes)for(const p of mesh.primitives){
  const pos=read(p.attributes.POSITION),uv=read(p.attributes.TEXCOORD_0),normal=read(p.attributes.NORMAL),input=Uint32Array.from(read(p.indices)),attributes=new Float32Array(pos.length/3*5);
  for(let i=0;i<pos.length/3;i++)attributes.set([uv[i*2],uv[i*2+1],normal[i*3],normal[i*3+1],normal[i*3+2]],i*5);
  const [indices,error]=S.simplifyWithAttributes(input,pos,3,attributes,5,[.6,.6,.12,.12,.12],null,6000*3,.06,['Permissive']);
  if(indices.length/3>9000)throw Error('Golden lantern exceeds shared LOD budget: '+indices.length/3);
  const kept=Array.from(new Set(indices)),remap=new Map(kept.map((old,i)=>[old,i]));
  for(const [name,id] of Object.entries(p.attributes)){const source=doc.accessors[id],array=read(id),width=array.length/source.count,out=new array.constructor(kept.length*width);kept.forEach((old,i)=>out.set(array.subarray(old*width,(old+1)*width),i*width));p.attributes[name]=store(out,source);}
  p.indices=store(Uint32Array.from(indices,i=>remap.get(i)),{componentType:5125,type:'SCALAR'});sourceTriangles+=input.length/3;triangles+=indices.length/3;
  console.log('Golden lantern triangles',input.length/3,'->',indices.length/3,'error',error);
 }
 for(const image of doc.images||[])if(image.bufferView!==undefined){const v=originalViews[image.bufferView];image.bufferView=append(bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength));}
 doc.bufferViews=views;doc.accessors=accessors;doc.buffers=[{byteLength:offset}];let json=Buffer.from(JSON.stringify(doc));json=Buffer.concat([json,Buffer.alloc((-json.length)&3,32)]);
 const binary=Buffer.concat(chunks),header=Buffer.alloc(20),bh=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+binary.length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);bh.writeUInt32LE(binary.length);bh.writeUInt32LE(0x004e4942,4);
 fs.writeFileSync(OUTPUT+'/golden-lantern-lod.glb',Buffer.concat([header,json,bh,binary]));
 const restored='assets/qinhuai-modern-import/restored',manifest=JSON.parse(fs.readFileSync(restored+'/manifest.json'));
 const names=['VRayProxy_guanmuc10044','VRayProxy_guanmuc10041','VRayProxy_guanmuc10177','VRayProxy_guanmuc10178','VRayProxy_guanmuc10184','VRayProxy_guanmuc10189','VRayProxy_guanmuc10190'];
 const trees=names.map(name=>{const tree=manifest.instances.find(t=>t.name===name);if(!tree)throw Error('Missing original gate tree '+name);return {...tree,count:tree.prototype==='79106538a618'?8:7};});
 const anchors={};for(const tree of trees)if(!anchors[tree.prototype])anchors[tree.prototype]=branchAnchors(path.join(restored,manifest.prototypes[tree.prototype].file),tree.count);
 const layout={version:1,mapUnitsPerMeter:.3212121212121212,source:SOURCE,sourceSha256:crypto.createHash('sha256').update(data).digest('hex'),sourceTriangles,triangles,sourceBounds,lanternHeightMeters:.62,trees,anchors};
 fs.writeFileSync(OUTPUT+'/layout.json',JSON.stringify(layout,null,2));console.log('Prepared',trees.length,'trees',trees.reduce((n,t)=>n+t.count,0),'lanterns');
})().catch(e=>{console.error(e);process.exitCode=1;});

