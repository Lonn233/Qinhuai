/** Opt-in, user-operated audit. No uploads, no automatic benchmark on page load.
 * CPU submit time != GPU time. renderer.info counts the entire frame, including
 * reflection/composer passes. GPU query latency is polled without blocking.
 */
export function summarizeSamples(rows){
 const stat=values=>{const a=values.filter(Number.isFinite).sort((a,b)=>a-b);if(!a.length)return null;const mean=a.reduce((s,x)=>s+x,0)/a.length;return {mean,min:a[0],max:a.at(-1),p50:a[Math.floor((a.length-1)*.5)],p95:a[Math.floor((a.length-1)*.95)],p99:a[Math.floor((a.length-1)*.99)]};};
 const dt=rows.map(r=>r.frameMs).filter(x=>Number.isFinite(x)&&x>0).sort((a,b)=>b-a),tail=dt.slice(0,Math.max(1,Math.ceil(dt.length*.01)));
 return {frames:rows.length,averageFps:dt.length?1000*dt.length/dt.reduce((a,b)=>a+b,0):null,onePercentLowFps:tail.length?1000/(tail.reduce((a,b)=>a+b,0)/tail.length):null,minimumFps:dt.length?1000/dt[0]:null,frameMs:stat(dt),cpuRenderSubmissionMs:stat(rows.map(r=>r.cpuMs)),cpuAnimationCallbackMs:stat(rows.map(r=>r.cpuAnimationFrameMs)),gpuMs:stat(rows.map(r=>r.gpuMs)),gpuSamples:rows.filter(r=>Number.isFinite(r.gpuMs)).length,drawCalls:stat(rows.map(r=>r.calls)),submittedTriangles:stat(rows.map(r=>r.triangles)),geometries:stat(rows.map(r=>r.geometries)),textures:stat(rows.map(r=>r.textures)),jsHeapUsedBytes:stat(rows.map(r=>r.heapBytes))};
}
export function installPerformanceAudit(api){
 if(typeof location==='undefined'||!new URLSearchParams(location.search||'').has('perf'))return null;
 const {renderer}=api,gl=renderer.getContext(),ext=gl.getExtension('EXT_disjoint_timer_query_webgl2');
 const assets=[],results=[],queries=[],listeners=[],errors=[],started=performance.now();let recording=null,previousFrame=null,start=0,currentQuery=null,currentRow=null,busy=false,invalid=null,firstFrame=null,assetsReadyMs=null,tickBegan=null,tickRow=null,disposed=false;
 const panel=document.createElement('aside');panel.id='performance-audit';panel.style.cssText='position:fixed;left:12px;bottom:70px;z-index:10000;width:min(350px,calc(100vw - 24px));box-sizing:border-box;background:#14232bea;color:#eff5ed;padding:14px;border:1px solid #647b7b;border-radius:10px;font:12px/1.5 system-ui;max-height:55vh;overflow:auto';
 panel.innerHTML='<strong>性能审计 · 手动启动</strong><div>保持窗口前台、尺寸不变。每个场景预热 3 秒、采样 10 秒。基线/优化页使用同一机器与设置，至少各运行三次。</div><label>报告标记 <input id="perf-label" value="optimized" style="width:120px"></label><div style="display:flex;gap:6px;margin-top:8px"><button id="perf-run">开始五场景测试</button><button id="perf-save">下载 JSON</button><button id="perf-close">关闭</button></div><pre id="perf-status" style="white-space:pre-wrap">等待模型加载。不会自动开始。</pre>';
 document.body.appendChild(panel);const $=s=>panel.querySelector(s),status=$('#perf-status');
 $('#perf-label').value=window.__QINHUAI_BUILD__?.kind||'optimized';
 const listen=(target,name,fn)=>{target.addEventListener(name,fn);listeners.push(()=>target.removeEventListener(name,fn));};
 listen(document,'visibilitychange',()=>{if(busy&&document.hidden)invalid='Page became hidden; rerun this sample.';});
 listen(document,'pointerdown',e=>{if(busy&&!panel.contains(e.target))invalid='UI/camera input during run; rerun this sample.';});
 listen(document,'wheel',()=>{if(busy)invalid='Wheel input during run; rerun this sample.';});
 listen(document,'keydown',()=>{if(busy)invalid='Keyboard input during run; rerun this sample.';});
 listen(window,'resize',()=>{if(busy)invalid='Viewport changed during run; rerun this sample.';});
 listen(window,'error',e=>errors.push(String(e.message)));listen(window,'unhandledrejection',e=>errors.push(String(e.reason)));
 function drain(){
  if(ext&&gl.getParameter(ext.GPU_DISJOINT_EXT)){for(const q of queries)gl.deleteQuery(q.query);queries.length=0;return;}
  for(let i=queries.length-1;i>=0;i--){const q=queries[i];if(gl.getQueryParameter(q.query,gl.QUERY_RESULT_AVAILABLE)){q.row.gpuMs=gl.getQueryParameter(q.query,gl.QUERY_RESULT)/1e6;gl.deleteQuery(q.query);queries.splice(i,1);}}
 }
 function frameStart(){
  drain();start=performance.now();currentRow=null;currentQuery=null;
  if(!recording)return;
  currentRow={timestampMs:start,frameMs:previousFrame===null?null:start-previousFrame,gpuMs:null};previousFrame=start;
  if(ext&&queries.length<6&&!gl.getQuery(ext.TIME_ELAPSED_EXT,gl.CURRENT_QUERY)){currentQuery=gl.createQuery();gl.beginQuery(ext.TIME_ELAPSED_EXT,currentQuery);}
 }
 function frameEnd(){
  const end=performance.now();if(firstFrame===null)firstFrame=end;
  if(currentQuery){gl.endQuery(ext.TIME_ELAPSED_EXT);queries.push({query:currentQuery,row:currentRow});currentQuery=null;}
  if(currentRow&&recording){const info=renderer.info;Object.assign(currentRow,{cpuMs:end-start,calls:info.render.calls,triangles:info.render.triangles,geometries:info.memory.geometries,textures:info.memory.textures,heapBytes:performance.memory?.usedJSHeapSize??null});recording.push(currentRow);tickRow=currentRow;}currentRow=null;
 }
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const savePose=()=>({era:api.era,weather:api.weather,wire:api.wire,firstPerson:api.firstPerson,pos:api.camera.position.clone(),target:api.controls.target.clone(),zoom:api.camera.zoom,fpPos:api.firstPersonCamera.position.clone(),fpQuat:api.firstPersonCamera.quaternion.clone(),autoRotate:api.controls.autoRotate});
 function restorePose(s){api.setFirstPerson(false);api.setEra(s.era);api.setWeather(s.weather);api.setWire(s.wire);api.camera.position.copy(s.pos);api.camera.zoom=s.zoom;api.camera.updateProjectionMatrix();api.controls.target.copy(s.target);api.controls.update();api.controls.autoRotate=s.autoRotate;if(s.firstPerson){api.setFirstPerson(true,{requestLock:false});api.firstPersonCamera.position.copy(s.fpPos);api.firstPersonCamera.quaternion.copy(s.fpQuat);}api.renderScene();}
 const cases=[
  {id:'overview',view:'perspective',weather:'clear'},
  {id:'dense_buildings',view:'bridge',weather:'clear'},
  {id:'river_reflections',view:'perspective',weather:'clear',fp:true},
  {id:'pavilion_close',view:'pavilion-night',weather:'night'},
  {id:'era_switch',view:'perspective',weather:'night'}
 ];
 async function run(){
  if(busy||disposed)return;busy=true;invalid=null;$('#perf-run').disabled=true;const snapshot=savePose(),startSize=[innerWidth,innerHeight,renderer.getPixelRatio()];
  try{
   const ready=await api.assetsReady;if(!ready.ok)throw new Error('Models incomplete; baseline is invalid.');
   if(document.hidden)throw new Error('Keep the page visible.');
   if([...document.querySelectorAll('[data-layer]')].some(i=>!i.checked))throw new Error('Reset layer visibility before measuring.');
   const run={label:$('#perf-label').value||'unlabelled',timestamp:new Date().toISOString(),viewport:startSize,rendererSettings:{pixelRatio:renderer.getPixelRatio(),toneMapping:renderer.toneMapping,exposure:renderer.toneMappingExposure,outputColorSpace:renderer.outputColorSpace,shadowType:renderer.shadowMap.type,contextAttributes:gl.getContextAttributes()},cases:[],valid:false};results.push(run);
   for(const c of cases){
    api.setFirstPerson(false);api.setWire(false);api.setEra('modern');api.setView(c.view);api.setWeather(c.weather);api.controls.autoRotate=false;
    if(c.fp){api.setFirstPerson(true,{requestLock:false});api.firstPersonCamera.position.set(-9,3.15,27);api.firstPersonCamera.lookAt(20,4,8);}
    status.textContent=c.id+' · 预热中…';await wait(3000);if(invalid||disposed)throw new Error(invalid||'Audit disposed');
    const rows=[],switches=[];const measuredCamera=c.fp?api.firstPersonCamera:api.camera,pose={position:measuredCamera.position.toArray(),quaternion:measuredCamera.quaternion.toArray(),projection:measuredCamera.projectionMatrix.toArray()};recording=rows;previousFrame=null;status.textContent=c.id+' · 采样中，请勿操作场景';const began=performance.now();
    if(c.id==='era_switch'){for(let n=0;n<10;n++){const to=n%2?'modern':'ming',t=performance.now();api.setEra(to);const submit=performance.now()-t;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{switches.push({to,handlerMs:submit,nextTwoAnimationFramesMs:performance.now()-t});resolve();})));await wait(Math.max(0,1000-(performance.now()-t)));}}
    else await wait(10000);
    recording=null;await wait(250);drain();run.cases.push({id:c.id,pose,weather:c.weather,perspective:!!c.fp,sampleSeconds:(performance.now()-began-250)/1000,switches,summary:summarizeSamples(rows),rawFrames:rows});if(invalid||disposed)throw new Error(invalid||'Audit disposed');
   }
   if(run.cases.some(c=>c.rawFrames.length<2))throw new Error('No usable frame sample; not a valid run.');
   if(api.waterReflectionFailed)throw new Error('Water reflection fallback active; this is not an equivalent scene.');
   run.valid=errors.length===0;status.textContent='测试完成。点击下载 JSON。'+(errors.length?' 有运行错误，结果未通过有效性检查。':' 请基线/优化页各重复至少三次。');
  }catch(error){status.textContent='测试未通过：'+error.message;const run=results.at(-1);if(run&&!run.valid)run.invalidReason=error.message;}finally{recording=null;previousFrame=null;try{if(!disposed)restorePose(snapshot);}finally{busy=false;if(!disposed)$('#perf-run').disabled=false;}}
 }
 function report(){
  const nav=performance.getEntriesByType('navigation')[0],debug=gl.getExtension('WEBGL_debug_renderer_info');
  return {schema:'qinhuai-performance-v1',build:window.__QINHUAI_BUILD__||null,generatedAt:new Date().toISOString(),url:location.href,userAgent:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency,deviceMemoryGiB:navigator.deviceMemory??null,gpuRenderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):null,threeRevision:api.threeRevision??null,pilot:api.pavilionPilot??'original',timerQueryAvailable:!!ext,firstRenderSinceNavigationMs:firstFrame,allModelsReadySinceNavigationMs:assetsReadyMs,navigation:nav?{responseEnd:nav.responseEnd,domContentLoadedEventEnd:nav.domContentLoadedEventEnd,loadEventEnd:nav.loadEventEnd,transferSize:nav.transferSize,decodedBodySize:nav.decodedBodySize}:null,assets,errors,waterReflectionFailed:api.waterReflectionFailed??null,runs:results.map(r=>({...r,cases:r.cases.map(c=>({...c,summary:summarizeSamples(c.rawFrames)}))})),notes:['No VRAM measurement: renderer.info.memory contains object counts, not GPU bytes.','CPU render = renderScene submission; CPU animation callback includes updates and render submission, not browser layout/compositor or GPU time.','FPS includes rendering/display scheduling; no synthetic FPS. 1% low = 1000 / mean slowest 1% intervals.','Submitted triangles include reflection/shadow/post-processing passes, not unique asset triangles.','GPU samples are nonblocking disjoint timer queries; null = unsupported/missing, not zero.','No runtime benchmark is executed until the user clicks Start.']};
 }
 $('#perf-run').onclick=run;$('#perf-save').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(report(),null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='qinhuai-'+($('#perf-label').value||'audit')+'-'+Date.now()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};$('#perf-close').onclick=()=>{if(busy){invalid='Audit cancelled';return;}panel.style.display='none';};
 const dispose=()=>{if(disposed)return;disposed=true;invalid='Audit disposed';recording=null;listeners.forEach(fn=>fn());for(const q of queries)gl.deleteQuery(q.query);queries.length=0;panel.remove();};listen(window,'pagehide',dispose);
 queueMicrotask(()=>api.assetsReady.then(result=>{if(result.ok)assetsReadyMs=performance.now();if(!disposed)status.textContent=result.ok?'模型已加载，点击开始测试。':'模型未完整加载，不能作为有效基线。';}));
 return {frameStart,frameEnd,tickStart:()=>{tickBegan=performance.now();tickRow=null;},tickEnd:()=>{if(tickRow&&tickBegan!==null)tickRow.cpuAnimationFrameMs=performance.now()-tickBegan;tickBegan=null;tickRow=null;},assetLoaded:(id,totalMs,bytes)=>assets.push({id,totalMs,bytes}),report,run,dispose};
}
