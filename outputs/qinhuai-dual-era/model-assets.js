import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { readEmbeddedAsset } from './embedded-assets.js';

// Stream directly into the final attribute buffer. No complete GLB, base64 DOM,
// Response(arrayBuffer) concatenation, or second bufferView.slice allocation.
export async function readExactBuffer(url,expected,onProgress=()=>{},fetcher=fetch){
 if(!Number.isSafeInteger(expected)||expected<=0)throw new Error('模型缓冲区长度无效');
 const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),120000);
 let reader;
 try{
  const response=await fetcher(url,{signal:abort.signal});
  if(!response.ok)throw new Error('模型资源读取失败：HTTP '+response.status+' '+url);
  if(!response.body)throw new Error('模型资源响应为空：'+url);
  const bytes=new Uint8Array(expected);reader=response.body.getReader();let received=0;
  while(true){const {done,value}=await reader.read();if(done)break;
   if(received+value.byteLength>expected)throw new Error('模型资源长度超出预期：'+url);
   bytes.set(value,received);received+=value.byteLength;onProgress(value.byteLength);
  }
  if(received!==expected)throw new Error('模型资源不完整：'+url);
  return bytes.buffer;
 }catch(error){abort.abort();if(reader)await reader.cancel().catch(()=>{});throw error;}
 finally{clearTimeout(timer);reader?.releaseLock();}
}

export function createSharedBufferPlugin(parser,onProgress=()=>{},fetcher=fetch){
 const pending=new Map();
 return {name:'QinhuaiSharedBufferViews',loadBufferView(index){
  const view=parser.json.bufferViews[index],buffer=parser.json.buffers[view.buffer];
  // Only generated, uncompressed, one-view-per-file resources use this path.
  if((view.byteOffset||0)!==0||view.byteLength!==buffer.byteLength||!/^view-\d+\.bin$/.test(buffer.uri||'')||view.extensions)return null;
  if(!pending.has(index))pending.set(index,readExactBuffer(parser.options.path+buffer.uri,view.byteLength,onProgress,fetcher));
  return pending.get(index);
 }};
}

export async function loadModelAsset(id,onProgress=()=>{}){
 const holder=document.getElementById('asset-'+id);
 if(!holder)throw new Error('缺少模型资源信息：'+id);
 const loader=new GLTFLoader();
 if(!holder.dataset.url){
  const buffer=await readEmbeddedAsset(id,onProgress);
  return loader.parseAsync(buffer,''); // Explicit, optional standalone build.
 }
 if(location.protocol==='file:')throw new Error('低内存版请通过本地服务打开：在项目目录运行 npm run preview，再访问 http://127.0.0.1:4173/');
 let received=0;const total=Number(holder.dataset.geometryBytes)||1;
 loader.register(parser=>createSharedBufferPlugin(parser,bytes=>{received+=bytes;onProgress(Math.min(.99,received/total));}));
 const result=await loader.loadAsync(holder.dataset.url);onProgress(1);
 return result;
}
