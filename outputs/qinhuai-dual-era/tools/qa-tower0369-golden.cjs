const fs=require('node:fs/promises'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='work/tower0369-golden-20261022';
const html=`<!doctype html><style>body{margin:0}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {ImportNightLighting} from '/import-night-lighting.js';
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.86;document.body.append(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#10131a');
scene.add(new THREE.HemisphereLight(0x7a97bd,0x27160c,.5));const light=new THREE.DirectionalLight(0xffe1b5,1.6);light.position.set(-6,23,-10);scene.add(light);
const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,500);camera.position.set(-6.5,16.2,-9.5);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(-12.72,13.45,-17.21);controls.update();
const layout=await (await fetch('/assets/qinhuai-modern-import/night/layout.json')).json();
const {scene:model}=await new GLTFLoader().loadAsync('/work/tower0369-golden-20261022/tower0369.glb');scene.add(model);
const rig=new ImportNightLighting(scene);rig.layout=layout;rig.registerTile(9,model);rig.setEnabled(true);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
window.qa={renderer,scene,camera,controls,rig,model};renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});window.ready=true;
</script>`;
(async()=>{
 await fs.mkdir(out,{recursive:true});let browser;
 const bytes=await fs.readFile('assets/qinhuai-modern-import/tiles/tile-09.glb'),size=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+size));
 doc.scenes=[{nodes:doc.nodes.map((n,i)=>/^FuziTemple0(36[4-9]|37\d|38[0-8])$/.test(n.name)?i:-1).filter(i=>i>=0)}];doc.scene=0;
 const json=Buffer.from(JSON.stringify(doc)),n=Math.ceil(json.length/4)*4,data=Buffer.alloc(20+n+bytes.length-20-size,0x20);
 bytes.copy(data,0,0,12);data.writeUInt32LE(data.length,8);data.writeUInt32LE(n,12);data.writeUInt32LE(0x4e4f534a,16);json.copy(data,20);bytes.copy(data,20+n,20+size);
 await fs.writeFile(out+'/tower0369.glb',data);
 try{
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
  const page=await browser.newPage({viewport:{width:1000,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.route('**/tower0369-qa',route=>route.fulfill({contentType:'text/html',body:html}));
  await page.goto('http://127.0.0.1:4180/tower0369-qa');await page.waitForFunction(()=>window.ready,null,{timeout:120000});
  async function capture(name){
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const pixels=await page.evaluate(()=>{const gl=qa.renderer.getContext(),w=gl.drawingBufferWidth,h=gl.drawingBufferHeight,d=new Uint8Array(w*h*4);qa.renderer.render(qa.scene,qa.camera);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,d);let golden=0,red=0;for(let i=0;i<d.length;i+=4){if(d[i]>100&&d[i+1]>60&&d[i]>d[i+2]*1.5)golden++;if(d[i]>100&&d[i]>d[i+1]*2.1)red++;}return {golden,red};});
   await page.screenshot({path:out+'/'+name+'.png'});assert.ok(pixels.golden>500,JSON.stringify(pixels));assert.ok(pixels.red>30,JSON.stringify(pixels));return pixels;
  }
  const desktop=await capture('isolated-desktop');
  const before=await page.evaluate(()=>qa.camera.position.toArray());await page.mouse.move(490,450);await page.mouse.down();await page.mouse.move(660,450,{steps:8});await page.mouse.up();assert.notDeepEqual(await page.evaluate(()=>qa.camera.position.toArray()),before);const orbit=await capture('isolated-orbit');
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{qa.camera.position.set(-3,17.4,-5);qa.controls.update();});const mobile=await capture('isolated-mobile');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({desktop,orbit,mobile,errors}));
  await fs.writeFile(out+'/isolated.json',JSON.stringify({desktop,orbit,mobile,errors},null,2));
 }finally{await browser?.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
