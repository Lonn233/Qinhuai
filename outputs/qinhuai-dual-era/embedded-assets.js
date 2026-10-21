// Offline model data is consumed in small blocks, not compiled as JavaScript.
export const yieldToBrowser=()=>new Promise(resolve=>setTimeout(resolve,0));

export async function readEmbeddedAsset(id,onProgress=()=>{}){
 const holder=document.getElementById('asset-'+id);
 if(!holder)throw new Error('缺少内嵌模型数据：'+id+'，请重新打开完整 HTML');
 if(holder.dataset.encoding==='gzip'&&typeof DecompressionStream==='undefined'){
  throw new Error('当前浏览器不支持模型解压，请使用新版 Chrome 或 Edge');
 }
 const total=holder.childElementCount;
 if(!total)throw new Error('模型数据为空：'+id);
 const expectedBytes=Number(holder.dataset.bytes);
 let consumed=0;
 const input=new ReadableStream({
  async pull(controller){
   try{
    const block=holder.firstElementChild;
    if(!block){controller.close();return;}
    const binary=atob(block.textContent.trim());
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    block.remove();
    controller.enqueue(bytes);
    onProgress(++consumed/total);
    // Yield often enough to keep scene controls and progress updates usable.
    if(consumed%4===0)await yieldToBrowser();
   }catch(error){controller.error(error);}
  }
 });
 try{
  const decoded=holder.dataset.encoding==='gzip'?input.pipeThrough(new DecompressionStream('gzip')):input;
  const buffer=await new Response(decoded).arrayBuffer();
  if(buffer.byteLength!==expectedBytes)throw new Error('模型数据不完整：'+id);
  return buffer;
 }finally{
  holder.remove(); // Release encoded text even when decompression fails.
 }
}

export async function runAssetQueue(tasks,{onProgress=()=>{},onError=()=>{}}={}){
 const failures=[];
 for(let i=0;i<tasks.length;i++){
  const task=tasks[i];
  try{
   onProgress(task.label,i,tasks.length);
   await yieldToBrowser();
   await task.run();
  }catch(error){
   failures.push({id:task.id,message:error.message||String(error)});
   onError(task,error);
  }
 }
 return failures;
}
