// CPU-only integration test. It exercises actual scene construction and state
// transitions, not WebGL rendering or visual quality; no browser is controlled.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const deps=process.env.QINHUAI_DEPS||__dirname;
const esbuild=require(path.join(deps,'node_modules/esbuild'));
const ActualThree=require(path.join(deps,'node_modules/three/build/three.cjs'));
const template=fs.readFileSync(path.join(__dirname,'page-template.html'),'utf8');
const source=fs.readFileSync(path.join(__dirname,'model-source.js'),'utf8');
const originalWarn=console.warn;
console.warn=(...args)=>{if(args[0]==='THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.')return;originalWarn(...args);};
test.after(()=>{console.warn=originalWarn;});
const makeElement=()=>{
 const attrs=new Map(),classes=new Set(),listeners=new Map();
 return {style:{},dataset:{},hidden:false,disabled:false,textContent:'',checked:true,
  classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle(x,on){if(on??!classes.has(x))classes.add(x);else classes.delete(x);}},
  setAttribute:(k,v)=>attrs.set(k,String(v)),getAttribute:k=>attrs.get(k),
  addEventListener:(type,fn)=>listeners.set(type,fn),removeEventListener:()=>{},prepend:()=>{},remove:()=>{},
  getContext:()=>new Proxy({},{get:(_,key)=>key.startsWith('create')?()=>({addColorStop(){}}):()=>{}}),
  focus(){},showModal(){},close(){},click(){this.onclick?.();}
 };
};
async function createHarness({failAsset=null,failRender=false,failExport=false,baseline=false,pilot=null}={}){
 const moduleRoot=baseline?path.resolve(__dirname,'../../work/perf-baseline-20261017'):__dirname;
 const programSource=baseline?fs.readFileSync(path.join(moduleRoot,'model-source.js'),'utf8'):source;const exportMaterials=[];
 const elements=new Map([...template.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],makeElement()]));
 const weatherButtons=['clear','overcast','mist','night'].map(weather=>Object.assign(makeElement(),{dataset:{weather}}));
 const layerInputs=['trees','boats','details','water'].map(layer=>Object.assign(makeElement(),{dataset:{layer}}));
 const events=new Map(),bootEvents=[],modelLoads=[],raf=[];
 const document={readyState:'loading',body:makeElement(),getElementById:id=>elements.get(id)||null,createElement:makeElement,
  querySelectorAll:selector=>selector==='[data-weather]'?weatherButtons:selector==='[data-layer]'?layerInputs:[],
  addEventListener:(event,handler)=>events.set(event,handler)};
 class Renderer{
  constructor(){this.domElement=makeElement();this.capabilities={getMaxAnisotropy:()=>8};this.shadowMap={};this.info={render:{calls:0,triangles:0},reset:()=>{}};}
  setPixelRatio(){}setSize(){}setRenderTarget(){}
  render(){if(failRender)throw new Error('Simulated renderer failure');this.info.render.calls++;}
 }
 const THREE={...ActualThree,WebGLRenderer:Renderer,
  PMREMGenerator:class{compileEquirectangularShader(){}fromScene(){return {texture:new ActualThree.Texture(),dispose(){}};}dispose(){}},
  TextureLoader:class{async loadAsync(){return new ActualThree.Texture();}}
 };
 class OrbitControls{
  constructor(){this.target=new THREE.Vector3();}update(){return false;}addEventListener(){}
 }
 class PointerLockControls{
  constructor(){this.isLocked=false;}addEventListener(){}lock(){this.isLocked=true;}unlock(){this.isLocked=false;}
 }
 class GLTFLoader{
  async parseAsync(buffer){
   const id=new TextDecoder().decode(buffer);modelLoads.push(id);
   if(id===failAsset)throw new Error('Simulated '+id+' parse failure');
   const scene=new THREE.Group();scene.add(new THREE.Mesh(new THREE.BoxGeometry(2,10,2),new THREE.MeshStandardMaterial()));return {scene};
  }
 }
 class EffectComposer{constructor(renderer){this.renderer=renderer;this.passes=[];}addPass(pass){this.passes.push(pass);}setSize(){}render(){this.renderer.render();}}
 const localCache=new Map();
 function loadLocal(filename){
  const file=filename.startsWith('three/addons/')?path.join(deps,'node_modules/three/examples/jsm',filename.slice(13)):path.resolve(moduleRoot,filename);if(localCache.has(file))return localCache.get(file);
  const module={exports:{}};localCache.set(file,module.exports);
  const code=esbuild.transformSync(fs.readFileSync(file,'utf8'),{format:'cjs'}).code;
  vm.runInNewContext(code,{module,exports:module.exports,require:id=>id==='three'?THREE:loadLocal(id),document,console,setTimeout,performance});
  localCache.set(file,module.exports);return module.exports;
 }
 const addon=async file=>import(pathToFileURL(path.join(deps,'node_modules/three/examples/jsm',file)).href);
 const window={__QINHUAI_PAVILION_PILOT__:pilot,__QINHUAI_BOOT__:{update:m=>bootEvents.push(['progress',m]),ready:()=>bootEvents.push(['ready']),complete:()=>bootEvents.push(['complete']),fail:e=>bootEvents.push(['error',e.message])}};
 const context={THREE,...loadLocal('ming-architecture.js'),...loadLocal('pavilion-lighting.js'),
  Sky:(await addon('objects/Sky.js')).Sky,Water:(await addon('objects/Water.js')).Water,
  mergeGeometries:(await addon('utils/BufferGeometryUtils.js')).mergeGeometries,
  OrbitControls,PointerLockControls,GLTFLoader,GLTFExporter:class{async parseAsync(copy){copy.traverse(o=>{if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material]){if(!exportMaterials.includes(m)){m.testDisposed=false;m.addEventListener('dispose',()=>{m.testDisposed=true});exportMaterials.push(m);}}});if(failExport)throw new Error('Simulated export failure');return new ArrayBuffer(8);}},EffectComposer,RenderPass:class{},UnrealBloomPass:class{},OutputPass:class{},
  ...loadLocal(path.join(__dirname,'performance-audit.js')),...loadLocal('embedded-assets.js'),readEmbeddedAsset:async id=>new TextEncoder().encode(id).buffer,
  window,document,console,performance,innerWidth:1280,innerHeight:800,devicePixelRatio:1,location:{hash:''},
  addEventListener(){},requestAnimationFrame:fn=>{raf.push(fn);return raf.length;},setTimeout,clearTimeout,URL,Blob
 };
 vm.runInNewContext(programSource.replace(/^import .*;\r?\n/gm,''),context,{filename:'model-source.js',timeout:20000});
 return {api:window.__QINHUAI__,exportMaterials,elements,weatherButtons,layerInputs,bootEvents,modelLoads,raf,
  releaseDOM(){document.readyState='interactive';events.get('DOMContentLoaded')?.();}};
}
test('base scene appears before GLB loading, current era/weather/layers survive delayed models',async()=>{
 const h=await createHarness(),{api}=h;
 assert.ok(h.bootEvents.some(e=>e[0]==='ready'));assert.equal(h.modelLoads.length,0);
 assert.equal(api.assetState.phase,'initializing');assert.equal(h.elements.get('export').disabled,true);
 const groundGeometry=[];api.groups.ground.traverse(o=>{if(o.isMesh)groundGeometry.push(o.geometry.uuid);});
 api.setEra('ming');api.setWeather('night');api.setWire(true);api.groups.trees.visible=false;
 h.releaseDOM();const result=await api.assetsReady;
 assert.equal(result.ok,true);assert.deepEqual(h.modelLoads,['BRIDGE','PAVILION','LOTUS_ONE','LOTUS_MAIN']);
 assert.equal(api.assetState.phase,'ready');assert.equal(api.assetState.completed,5);
 assert.equal(api.era,'ming');assert.equal(api.weather,'night');assert.equal(api.wire,true);assert.equal(api.groups.trees.visible,false);
 assert.ok(api.towerModern&&api.towerMing&&api.bridge);assert.equal(api.lotusLanterns.length,12);
 assert.equal(api.towerModern.position.x,27.5);assert.equal(api.towerModern.position.z,10.1);
 assert.equal(api.bridge.position.x,api.bridgePlacement.x);assert.equal(api.bridge.position.z,api.bridgePlacement.z);
 assert.equal(h.elements.get('export').disabled,false);assert.equal(h.elements.get('night').getAttribute('aria-pressed'),'true');
 api.setFirstPerson(true);assert.equal(api.firstPerson,true);assert.equal(api.weather,'night');api.setFirstPerson(false);assert.equal(api.firstPerson,false);
 let weatherObjects=0;api.createExportSnapshot().traverse(o=>{if(o.userData.weatherFX||o.name==='Weather_System')weatherObjects++;});assert.equal(weatherObjects,0);
 h.elements.get('reset').click();assert.equal(api.era,'modern');assert.equal(api.weather,'clear');assert.equal(api.wire,false);
 assert.ok(h.layerInputs.every(input=>api.groups[input.dataset.layer].visible));
 const after=[];api.groups.ground.traverse(o=>{if(o.isMesh)after.push(o.geometry.uuid);});assert.deepEqual(after,groundGeometry);
});
test('a failed GLB leaves the map usable and does not block following assets or hide the error',async()=>{
 const h=await createHarness({failAsset:'PAVILION'});h.releaseDOM();const result=await h.api.assetsReady;
 assert.equal(result.ok,false);assert.equal(h.api.assetState.phase,'partial');assert.ok(h.api.bridge);
 assert.equal(h.api.lotusLanterns.length,12);assert.equal(h.elements.get('export').disabled,true);
 assert.ok(h.bootEvents.some(e=>e[0]==='ready'));assert.ok(h.bootEvents.some(e=>e[0]==='error'&&e[1].includes('PAVILION')));
 h.api.setWeather('clear');h.api.setEra('modern');h.api.renderScene();
});
test('failed initial rendering is reported and never marked as a ready scene',async()=>{
 const h=await createHarness({failRender:true});const result=await h.api.assetsReady;
 assert.equal(result.ok,false);assert.equal(h.api.assetState.phase,'failed');
 assert.ok(!h.bootEvents.some(e=>e[0]==='ready'));assert.ok(h.bootEvents.some(e=>e[0]==='error'));
});

test('both eras share derived night materials without changing source or light layout',async()=>{
 const before=await createHarness({baseline:true}),after=await createHarness();before.releaseDOM();after.releaseDOM();await Promise.all([before.api.assetsReady,after.api.assetsReady]);
 assert.notEqual(before.api.modernLighting.overrides[0].night,before.api.mingLighting.overrides[0].night);
 assert.equal(after.api.modernLighting.overrides[0].night,after.api.mingLighting.overrides[0].night);
 const digest=api=>{const hash=require('node:crypto').createHash('sha256');api.model.traverse(o=>{hash.update(JSON.stringify([o.type,o.name,o.position.toArray(),o.quaternion.toArray(),o.scale.toArray()]));if(o.geometry){for(const [name,a] of Object.entries(o.geometry.attributes)){hash.update(name);hash.update(Buffer.from(a.array.buffer,a.array.byteOffset,a.array.byteLength));}if(o.geometry.index)hash.update(Buffer.from(o.geometry.index.array.buffer));}});return hash.digest('hex');};
 assert.equal(digest(before.api),digest(after.api),'all model geometry and transforms preserved');
 for(const era of ['modern','ming']){after.api.setEra(era);after.api.setWeather('night');assert.equal(after.api.lighting.rig.visible,true);assert.equal(after.api.lighting.overrides[0].object.material,after.api.lighting.overrides[0].night);after.api.setWeather('clear');assert.equal(after.api.lighting.overrides[0].object.material,after.api.lighting.overrides[0].day);}
});
test('export failure disposes only temporary cloned materials',async()=>{
 const h=await createHarness({failExport:true});h.releaseDOM();await h.api.assetsReady;const live=new Set();h.api.model.traverse(o=>{if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material])live.add(m);});let liveDisposed=0;for(const m of live)m.addEventListener('dispose',()=>liveDisposed++);
 await h.elements.get('export').onclick();assert.ok(h.exportMaterials.length>0);assert.ok(h.exportMaterials.every(m=>m.testDisposed));assert.equal(liveDisposed,0);assert.equal(h.elements.get('export').disabled,false);
});
test('pilot uses canonical original bounds and keeps night, era, layers and first-person behavior',async()=>{
 const pilot={level:'LOD0',url:'candidate.glb',sourceBounds:{min:[-1,-2,-3],max:[1,8,3]}};const h=await createHarness({pilot});h.releaseDOM();await h.api.assetsReady;
 assert.equal(h.api.tower.scale.x,.96);assert.deepEqual(h.api.tower.children[0].position.toArray().map(x=>x||0),[0,2,0]);assert.equal(h.api.tower.userData.pilot,'LOD0');assert.equal(h.api.pavilionPilot.level,'LOD0');
 h.api.setFirstPerson(true,{requestLock:false});assert.equal(h.api.firstPerson,true);assert.equal(h.api.firstPersonControls.isLocked,false);h.api.setFirstPerson(false);h.api.setFirstPerson(true);assert.equal(h.api.firstPersonControls.isLocked,true);
 h.api.setWeather('night');h.api.setEra('ming');h.api.setWire(true);assert.equal(h.api.weather,'night');assert.equal(h.api.wire,true);assert.equal(h.api.mingLighting.rig.visible,true);assert.equal(h.api.towerModern.children[0].children[0].geometry,h.api.towerMing.children[0].children[0].geometry);
});
