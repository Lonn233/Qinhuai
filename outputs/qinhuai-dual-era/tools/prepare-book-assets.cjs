const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const ids=['lion','gongming','tengma','mountain','chrysanthemum','lotus-main','lotus-one'];

function readGlb(file){
 const bytes=fs.readFileSync(file);
 assert.equal(bytes.readUInt32LE(0),0x46546c67);
 assert.equal(bytes.readUInt32LE(4),2);
 assert.equal(bytes.readUInt32LE(8),bytes.length);
 let doc,bin;
 for(let offset=12;offset<bytes.length;){
  const length=bytes.readUInt32LE(offset),type=bytes.readUInt32LE(offset+4),chunk=bytes.subarray(offset+8,offset+8+length);
  if(type===0x4e4f534a)doc=JSON.parse(chunk.toString('utf8'));
  if(type===0x004e4942)bin=chunk;
  offset+=8+length;
 }
 assert.ok(doc&&bin,'Expected an embedded GLB');
 return {doc,bin,bytes};
}
function encodeGlb(doc,bin){
 const json=Buffer.from(JSON.stringify(doc));
 const paddedJson=Buffer.alloc(Math.ceil(json.length/4)*4,0x20);json.copy(paddedJson);
 const paddedBin=Buffer.alloc(Math.ceil(bin.length/4)*4);bin.copy(paddedBin);
 const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+paddedJson.length+paddedBin.length,8);header.writeUInt32LE(paddedJson.length,12);header.writeUInt32LE(0x4e4f534a,16);
 const binHeader=Buffer.alloc(8);binHeader.writeUInt32LE(paddedBin.length);binHeader.writeUInt32LE(0x004e4942,4);
 return Buffer.concat([header,paddedJson,binHeader,paddedBin]);
}
function triangles(doc){return doc.meshes.reduce((sum,mesh)=>sum+mesh.primitives.reduce((n,p)=>n+((p.indices===undefined?doc.accessors[p.attributes.POSITION]:doc.accessors[p.indices]).count/3),0),0);}
function hash(bytes){return crypto.createHash('sha256').update(bytes).digest('hex');}
function prepare(){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'work/all-lanterns-half-preview/manifest.json'),'utf8'));
 const destination=path.join(root,'assets/story-book');fs.mkdirSync(destination,{recursive:true});
 const report=[];
 for(const id of ids){
  const source=manifest.find(item=>item.id===id);assert.ok(source,'Missing source: '+id);
  const original=readGlb(source.source);let output=original.bytes;
  if(id==='chrysanthemum'){
   // Retain corrected four-front geometry at full resolution, with its original UV textures.
   const corrected=readGlb(path.join(root,'assets/chrysanthemum-four-faces/original.glb'));
   const doc=corrected.doc,chunks=[corrected.bin.subarray(0,doc.buffers[0].byteLength)];let length=chunks[0].length;
   for(const key of ['materials','textures','samplers','images'])if(original.doc[key])doc[key]=structuredClone(original.doc[key]);
   for(const image of doc.images){
    const view=original.doc.bufferViews[image.bufferView];assert.equal(view.buffer,0);
    const padding=(4-length%4)%4;chunks.push(Buffer.alloc(padding));length+=padding;
    image.bufferView=doc.bufferViews.length;doc.bufferViews.push({buffer:0,byteOffset:length,byteLength:view.byteLength});
    chunks.push(original.bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength));length+=view.byteLength;
   }
   for(const mesh of doc.meshes)for(const primitive of mesh.primitives)primitive.material=0;
   doc.buffers[0].byteLength=length;output=encodeGlb(doc,Buffer.concat(chunks));
   assert.ok(triangles(doc)>=triangles(original.doc));
  }
  const target=path.join(destination,id+'.glb');fs.writeFileSync(target,output);
  const checked=readGlb(target);assert.ok(checked.doc.materials?.length&&checked.doc.images?.length);
  assert.equal(hash(fs.readFileSync(source.source)),hash(original.bytes),'Source must stay unchanged');
  report.push({id,source:source.source,sourceSha256:hash(original.bytes),sha256:hash(output),triangles:triangles(checked.doc),bytes:output.length,images:checked.doc.images.length});
 }
 fs.writeFileSync(path.join(destination,'manifest.json'),JSON.stringify(report,null,2)+'\n');
 console.table(report.map(({id,triangles,bytes,images})=>({id,triangles,MB:(bytes/1048576).toFixed(1),images})));
}
if(require.main===module)prepare();
module.exports={readGlb,triangles,hash,prepare};
