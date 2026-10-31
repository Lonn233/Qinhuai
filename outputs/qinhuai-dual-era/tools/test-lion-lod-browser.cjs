const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const root=path.resolve(__dirname,'..'),dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'lion-lod-qa-'));
 const js=require('esbuild').buildSync({stdin:{contents:`
import * as THREE from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ImportFestivalLanterns} from './import-festival-lanterns.js';import {loadLionLodData} from './import-lion-lod.mjs';import {LanternLighting} from './import-lantern-lighting.js';
const scene=new THREE.Scene();scene.background=new THREE.Color('#131a24');scene.add(new THREE.HemisphereLight(0xc8d5e6,0x65452d,.8));
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1200,700);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;document.body.append(renderer.domElement);
const layer=new ImportFestivalLanterns(scene,{load:kind=>kind==='lion'?new GLTFLoader().loadAsync('/game/assets/lion.glb'):Promise.resolve({scene:new THREE.Group().add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial()))}),loadLionLods:loadLionLodData});
await layer.registerTile(9);layer.setState({night:true});for(const {mesh} of layer.entries.get('mountain').batches)mesh.visible=false;
const camera=new THREE.PerspectiveCamera(60,1200/700,.01,300),entry=layer.entries.get('lion');let time=0;
window.inspect=(position)=>{camera.position.fromArray(position);camera.lookAt(-5.2,12.1,-20);layer.update(++time,camera);renderer.render(scene,camera);return {lod:layer.stats.lionLod,error:layer.stats.lionLodError,emitters:LanternLighting.prototype.sources.call({festival:layer},'lion'),render:{...renderer.info.render},textures:renderer.info.memory.textures};};
window.compare=()=>{
 scene.remove(layer.root);camera.aspect=400/700;camera.position.set(.95,.65,1.2);camera.lookAt(0,.30,0);camera.updateProjectionMatrix();
 renderer.setScissorTest(true);for(let i=0;i<3;i++){const mesh=new THREE.Mesh(entry.lod.batches[i].mesh.geometry,entry.parts[0].material);scene.add(mesh);renderer.setViewport(i*400,0,400,700);renderer.setScissor(i*400,0,400,700);renderer.render(scene,camera);scene.remove(mesh);}
 renderer.setScissorTest(false);return entry.lod.batches.map(b=>b.mesh.geometry.index.count/3);
};window.ready=true;
`,resolveDir:root,sourcefile:'lion-lod-qa.js'},bundle:true,format:'esm',write:false}).outputFiles[0].text;
 const server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:700}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.route('**/lion-lod-qa.html',r=>r.fulfill({contentType:'text/html',body:'<meta charset="utf-8"><style>body{margin:0} .labels{position:absolute;top:30px;width:100%;display:flex;color:#eee;font:18px sans-serif;text-align:center}.labels span{width:33.33%}</style><div class="labels"><span>LOD0 · 89,996 triangles</span><span>LOD1 · 8,999 triangles</span><span>LOD2 · 1,500 triangles</span></div><script type="module" src="/lion-lod-qa.js"></script>'}));
  await page.route('**/lion-lod-qa.js',r=>r.fulfill({contentType:'text/javascript',body:js}));
  await page.goto('http://127.0.0.1:'+server.address().port+'/lion-lod-qa.html');await page.waitForFunction(()=>window.ready,null,{timeout:60000});
  const report=[];for(const [position,counts] of [[[-5.2,14,-20],[6,0,0]],[[-5.2,12.5,-8],[0,6,0]],[[-5.2,13,100],[0,0,6]]]){const r=await page.evaluate(p=>window.inspect(p),position);assert.deepEqual(r.lod.counts,counts);assert.equal(r.error,null);assert.equal(r.emitters.length,6);if(report.length)assert.deepEqual(r.emitters,report[0].emitters);report.push(r);}
  assert.deepEqual(await page.evaluate(()=>window.compare()),[89996,8999,1500]);await page.screenshot({path:path.join(root,'work/lion-lod-comparison.png')});assert.deepEqual(errors,[]);
  await fs.writeFile(path.join(root,'work/lion-lod-browser-report.json'),JSON.stringify(report,null,2));console.log('PASS actual GLB/painted material/shaders; near/medium/far 6 instances each; stable six spill sources; screenshot saved.');console.log(report.map(r=>({lod:r.lod,render:r.render,textures:r.textures})));
 }finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
