const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const testKind=process.argv[2]||'gongming';if(!['gongming','mountain'].includes(testKind))throw Error('Unknown test kind');
 const root=path.resolve(__dirname,'..'),dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'large-lantern-lods-qa-'));
 const js=require('esbuild').buildSync({stdin:{contents:`
import * as THREE from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FeatureLanternLayer} from './import-feature-lanterns.js';import {ImportFestivalLanterns} from './import-festival-lanterns.js';
import {loadLargeLanternLods} from './import-large-lantern-lod.mjs';import {meshLanternEmitters} from './import-lantern-lighting.js';
const scene=new THREE.Scene();scene.background=new THREE.Color('#131a24');scene.add(new THREE.HemisphereLight(0xc8d5e6,0x65452d,.8));
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1200,700);renderer.toneMapping=THREE.ACESFilmicToneMapping;document.body.append(renderer.domElement);
const feature=new FeatureLanternLayer(scene),festival=new ImportFestivalLanterns(scene,{load:kind=>kind==='mountain'?new GLTFLoader().loadAsync('/game/assets/mountain.glb'):Promise.resolve({scene:new THREE.Group().add(new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial()))}),loadLargeLods:loadLargeLanternLods});
if('${testKind}'==='gongming')await feature.ensure('gongming');else await festival.registerTile(9);feature.setState({night:true});festival.setState({night:true});for(const b of festival.entries.get('lion')?.batches||[])b.mesh.visible=false;
const entries={gongming:feature.entries.get('gongming')?.lod,mountain:festival.entries.get('mountain')?.largeLod},camera=new THREE.PerspectiveCamera(60,1200/700,.01,1000);let time=0;
window.inspect=(kind,multiplier)=>{
 feature.root.visible=kind==='gongming';festival.root.visible=kind==='mountain';const lod=entries[kind],mesh=lod.mesh;scene.updateMatrixWorld(true);const box=mesh.boundingBox.clone().applyMatrix4(mesh.matrixWorld),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());camera.position.copy(center).add(new THREE.Vector3(0,0,Math.max(size.x,size.z)*multiplier));camera.lookAt(center);feature.update(++time,camera);festival.update(time,camera);renderer.render(scene,camera);
 return {contextLost:renderer.getContext().isContextLost(),lod:lod.stats,emitters:meshLanternEmitters([mesh]),render:{...renderer.info.render},textures:renderer.info.memory.textures,error:kind==='gongming'?feature.stats.gongmingLodError:festival.stats.mountainLodError};
};
window.compare=kind=>{
 feature.root.visible=false;festival.root.visible=false;const lod=entries[kind];camera.aspect=400/700;camera.position.set(.45,.6,1.6);camera.lookAt(0,.34,0);camera.updateProjectionMatrix();
 renderer.setScissorTest(true);for(let i=0;i<3;i++){const mesh=new THREE.Mesh(lod.geometries[i],lod.mesh.material);scene.add(mesh);renderer.setViewport(i*400,0,400,700);renderer.setScissor(i*400,0,400,700);renderer.render(scene,camera);scene.remove(mesh);}
 renderer.setScissorTest(false);return lod.spec.levels.map(l=>l.triangles);
};window.reset=()=>{renderer.setViewport(0,0,1200,700);camera.aspect=1200/700;camera.updateProjectionMatrix();};window.ready=true;
`,resolveDir:root,sourcefile:'large-lantern-qa.js'},bundle:true,format:'esm',write:false}).outputFiles[0].text;
 const server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:700}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.route('**/large-lantern-qa.html',r=>r.fulfill({contentType:'text/html',body:'<meta charset="utf-8"><style>body{margin:0}.labels{position:absolute;top:24px;width:100%;display:flex;color:#eee;font:18px sans-serif;text-align:center}.labels span{width:33.33%}</style><div class="labels"><span></span><span></span><span></span></div><script type="module" src="/large-lantern-qa.js"></script>'}));
  await page.route('**/large-lantern-qa.js',r=>r.fulfill({contentType:'text/javascript',body:js}));
  await page.goto('http://127.0.0.1:'+server.address().port+'/large-lantern-qa.html');await page.waitForFunction(()=>window.ready,null,{timeout:60000});
  const report={};for(const kind of [testKind]){
   await page.evaluate(()=>window.reset());report[kind]=[];
   for(const [multiplier,level] of [[1.6,0],[12,1],[40,2],[1.6,0]]){const r=await page.evaluate(([k,m])=>window.inspect(k,m),[kind,multiplier]);assert.equal(r.contextLost,false);assert.equal(r.lod.level,level);assert.equal(r.error,null);assert.equal(r.emitters.length,1);if(report[kind].length)assert.deepEqual(r.emitters,report[kind][0].emitters);report[kind].push(r);}
   const counts=await page.evaluate(k=>window.compare(k),kind);await page.locator('.labels span').evaluateAll((els,counts)=>els.forEach((el,i)=>el.textContent='LOD'+i+' · '+counts[i].toLocaleString()+' triangles'),counts);
   await page.screenshot({path:path.join(root,'work/'+kind+'-lod-comparison.png')});
  }
  assert.deepEqual(errors,[]);await fs.writeFile(path.join(root,'work/'+testKind+'-lod-browser-report.json'),JSON.stringify(report,null,2));console.log('PASS '+testKind+': actual GLB, three LODs and return to near, stable emitters, no shader errors.');console.log(JSON.stringify(report,null,2));
 }catch(error){console.error(error);throw error;}finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
