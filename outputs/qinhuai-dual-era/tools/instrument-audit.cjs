// Identical measurement hooks for immutable baseline copies and optimized source.
const fs=require('fs');
function instrument(s){
 s=s.replace(/\r\n/g,"\n");
 if(s.includes("from './performance-audit.js'"))return addFrameHooks(s);
 s="import { installPerformanceAudit } from './performance-audit.js';\n"+s;
 s=s.replace('function renderScene(){','let performanceAudit=null;\nfunction renderScene(){\n performanceAudit?.frameStart();');
 s=s.replace("try{draw();}catch(retryError){renderer.setRenderTarget(null);renderer.render(scene,activeCamera);}\n }\n}","try{draw();}catch(retryError){renderer.setRenderTarget(null);renderer.render(scene,activeCamera);}\n }finally{performanceAudit?.frameEnd();}\n}");
 s=s.replace('function setFirstPerson(value){','function setFirstPerson(value,{requestLock=true}={}){').replace('if(next&&!firstPersonControls.isLocked)firstPersonControls.lock();','if(next&&requestLock&&!firstPersonControls.isLocked)firstPersonControls.lock();').replace('  firstPersonControls.lock();','  if(requestLock)firstPersonControls.lock();');
 s=s.replace('async function loadModel(id,label){','async function loadModel(id,label){\n const auditStarted=performance.now();');
 s=s.replace(' return gltf;\n}',' performanceAudit?.assetLoaded(id,performance.now()-auditStarted,buffer.byteLength);\n return gltf;\n}');
 s=s.replace('window.__QINHUAI__={','window.__QINHUAI__={get waterReflectionFailed(){return waterReflectionFailed;},threeRevision:THREE.REVISION,');
 s=s.replace('window.__QINHUAI__.assetsReady=loadSceneAssets()',"performanceAudit=installPerformanceAudit(window.__QINHUAI__);\nwindow.__QINHUAI__.performanceAudit=performanceAudit;\nwindow.__QINHUAI__.assetsReady=loadSceneAssets()");
 if(!s.includes('finally{performanceAudit?.frameEnd();}'))throw new Error('Cannot safely instrument renderer');
 return addFrameHooks(s);
}
function addFrameHooks(s){
 if(!s.includes('performanceAudit?.tickStart();')){
  s=s.replace('function tick(now){', 'function tick(now){\n performanceAudit?.tickStart();');
  s=s.replace("}catch(error){window.__QINHUAI_BOOT__?.fail(error);return;}\n requestAnimationFrame(tick);", "}catch(error){window.__QINHUAI_BOOT__?.fail(error);return;}finally{performanceAudit?.tickEnd();}\n requestAnimationFrame(tick);");
 }
 if(!s.includes('threeRevision:THREE.REVISION'))s=s.replace('window.__QINHUAI__={','window.__QINHUAI__={threeRevision:THREE.REVISION,');
 if(!s.includes('finally{performanceAudit?.tickEnd();}'))throw new Error('Cannot safely instrument animation callback');
 return s;
}
module.exports={instrument};
if(require.main===module){const file=process.argv[2];fs.writeFileSync(file,instrument(fs.readFileSync(file,'utf8')));}
