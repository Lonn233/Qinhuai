const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),path=require('node:path');
const {chromium}=require(path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));

(async()=>{
 const root=path.resolve(__dirname,'..'),work=path.join(root,'work'),html=path.join(work,'bridge-lantern-qa.html');await fs.mkdir(work,{recursive:true});
 await fs.writeFile(html,`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;height:100%;overflow:hidden;background:#111722}canvas{display:block}</style>
 <script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
 <script type="module">
 import * as THREE from '/node_modules/three/build/three.module.js';import {BridgeLanternLayer} from '/import-bridge-lanterns.js';
 const scene=new THREE.Scene();scene.background=new THREE.Color('#101722');const camera=new THREE.PerspectiveCamera(44,innerWidth/innerHeight,.1,100);camera.position.set(-34,19,-2);camera.lookAt(-20.8,12.7,-2);
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(1);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;document.body.append(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0x9bb5d0,0x3b2518,1.2));const key=new THREE.DirectionalLight(0xffd399,2);key.position.set(-25,20,-5);scene.add(key);
 const deck=new THREE.Mesh(new THREE.BoxGeometry(4.25,.38,14.5),new THREE.MeshStandardMaterial({color:0x6b5444,roughness:.9}));deck.position.set(-20.8,12.0,-2.28);scene.add(deck);
 const layer=new BridgeLanternLayer(scene);await layer.registerTile(9);layer.setNight(true);window.qa={layer,stats:layer.stats,materials:layer.entries.map(e=>({kind:e.kind,count:e.meshes[0].count,triangles:e.meshes[0].geometry.index.count/3,emissive:e.materials[0].emissiveIntensity}))};renderer.render(scene,camera);
 </script>`);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-dev-shm-usage','--use-angle=swiftshader']});
 try{const page=await browser.newPage({viewport:{width:1440,height:780}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4180/work/bridge-lantern-qa.html');await page.waitForFunction(()=>window.qa?.stats.ready,null,{timeout:30000});const result=await page.evaluate(()=>({stats:window.qa.stats,materials:window.qa.materials}));assert.equal(result.stats.lanterns,16);assert.deepEqual(result.materials.map(m=>m.count).sort(),[8,8]);assert.ok(result.materials.every(m=>m.triangles>0&&m.emissive>0));await page.evaluate(()=>window.qa.layer.setNight(false));assert.ok(await page.evaluate(()=>window.qa.layer.entries.every(e=>e.materials.every(m=>m.emissiveIntensity===0))));await page.evaluate(()=>window.qa.layer.setNight(true));
 const nightMaterials=await page.evaluate(()=>window.qa.layer.entries.flatMap(e=>e.materials.map(m=>({kind:e.kind,type:m.type,power:m.emissiveIntensity,metalness:m.metalness}))));
 assert.ok(nightMaterials.every(m=>m.power>=2&&m.metalness<.1),JSON.stringify(nightMaterials));
 assert.deepEqual(errors,[]);await page.screenshot({path:path.join(work,'bridge-lantern-qa.png')});console.log('PASS bridge lantern GLBs load/render; 16 placements, alternating models, night glow',result.materials);}finally{await browser.close();await fs.rm(html,{force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
