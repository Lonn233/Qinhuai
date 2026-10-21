const fs=require('node:fs');
const fsp=fs.promises,path=require('node:path');
const {pipeline}=require('node:stream/promises');
const {createHash}=require('node:crypto');
const MODEL_ASSETS=[['BRIDGE','qiao.glb','raw'],['PAVILION','Meshy_AI_kuixingge_1016044736_texture.glb','gzip'],['LOTUS_ONE','hehua_1.glb','gzip'],['LOTUS_MAIN','hehua-main.glb','gzip']];
async function hashFile(file){const hash=createHash('sha256');for await(const chunk of fs.createReadStream(file))hash.update(chunk);return hash.digest('hex');}
async function readGLB(file){
 const handle=await fsp.open(file,'r');
 try{
  const header=Buffer.alloc(20);await handle.read(header,0,20,0);
  if(header.readUInt32LE(0)!==0x46546c67||header.readUInt32LE(4)!==2||header.readUInt32LE(16)!==0x4e4f534a)throw new Error('Invalid GLB: '+file);
  const length=header.readUInt32LE(12);if(length>4*1024*1024)throw new Error('Unexpected GLB metadata size');
  const bytes=Buffer.alloc(length);await handle.read(bytes,0,length,20);
  const chunk=Buffer.alloc(8);await handle.read(chunk,0,8,20+length);
  if(chunk.readUInt32LE(4)!==0x004e4942)throw new Error('Missing GLB binary chunk');
  const stat=await handle.stat();if(stat.size!==header.readUInt32LE(8)||28+length+chunk.readUInt32LE(0)>stat.size)throw new Error('Truncated GLB');
  return {json:JSON.parse(bytes.toString('utf8')),binaryOffset:28+length,binaryBytes:chunk.readUInt32LE(0),size:stat.size};
 }finally{await handle.close();}
}
async function buildRuntimeAssets(sourceDir,outputDir){
 const manifest={version:1,models:[]};
 for(const [id,file] of MODEL_ASSETS){
  const source=path.join(sourceDir,file),{json,binaryOffset,binaryBytes,size}=await readGLB(source);
  const folder=path.join(outputDir,'runtime-assets',id);await fsp.mkdir(folder,{recursive:true});
  const imageViews=new Map((json.images||[]).filter(im=>im.bufferView!==undefined).map(im=>[im.bufferView,im.mimeType]));
  const buffers=[],resources=[];
  for(let i=0;i<json.bufferViews.length;i++){
   const view=json.bufferViews[i],offset=view.byteOffset||0;
   if(view.buffer!==0||offset+view.byteLength>binaryBytes||view.byteLength<=0)throw new Error('Invalid buffer view in '+file);
   const mime=imageViews.get(i),extension=mime==='image/jpeg'?'jpg':mime==='image/png'?'png':'bin';
   const uri='view-'+i+'.'+extension,target=path.join(folder,uri),temporary=target+'.tmp';
   await pipeline(fs.createReadStream(source,{start:binaryOffset+offset,end:binaryOffset+offset+view.byteLength-1,highWaterMark:256*1024}),fs.createWriteStream(temporary));
   await fsp.rename(temporary,target);
   resources.push({uri,bytes:view.byteLength,sha256:await hashFile(target),bufferView:i,sourceOffset:binaryOffset+offset});
   buffers.push({uri,byteLength:view.byteLength});view.buffer=i;view.byteOffset=0;
  }
  for(const image of json.images||[]){if(image.bufferView!==undefined){image.uri=buffers[image.bufferView].uri;delete image.bufferView;}}
  json.buffers=buffers;
  const target=path.join(folder,'scene.gltf');await fsp.writeFile(target+'.tmp',JSON.stringify(json));await fsp.rename(target+'.tmp',target);
  manifest.models.push({id,file,sourceBytes:size,sourceSHA256:await hashFile(source),gltf:'runtime-assets/'+id+'/scene.gltf',resources});
 }
 const target=path.join(outputDir,'runtime-assets','manifest.json');await fsp.writeFile(target+'.tmp',JSON.stringify(manifest,null,2));await fsp.rename(target+'.tmp',target);
 return manifest;
}
module.exports={MODEL_ASSETS,readGLB,buildRuntimeAssets};
