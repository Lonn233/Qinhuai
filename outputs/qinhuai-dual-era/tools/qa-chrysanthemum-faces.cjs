const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const assert=require('node:assert/strict');
const {buildSync}=require('esbuild');
let playwright;
try{playwright=require('playwright');}catch{playwright=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const root=path.resolve(__dirname,'..');
const out=path.join(root,'work/chrysanthemum-four-faces');
const mode=process.argv[2]||'before';
const code=buildSync({stdin:{contents:`
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
window.showLantern=async({url,materialUrl,width,height})=>{
 const loader=new GLTFLoader(),model=(await loader.loadAsync(url)).scene;
 if(materialUrl){let material;(await loader.loadAsync(materialUrl)).scene.traverse(m=>{if(m.isMesh)material=m.material;});model.traverse(m=>{if(m.isMesh)m.material=material;});}
 const box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
 model.position.sub(center);
 const scene=new THREE.Scene();scene.background=new THREE.Color('#28333b');scene.add(model);
 scene.add(new THREE.HemisphereLight(0xffffff,0xcccccc,2));
 const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(width,height);renderer.setPixelRatio(1);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 document.body.replaceChildren(renderer.domElement);document.body.style.margin='0';
 renderer.setScissorTest(true);
 const columns=width<600?2:4,rows=4/columns,w=width/columns,h=height/rows,pixels=[];
 const distance=Math.max(size.x,size.y,size.z)*2.2/Math.min(1,w/h);
 for(let i=0;i<4;i++){
  const x=(i%columns)*w,y=Math.floor(i/columns)*h;
  const angle=i*Math.PI/2,camera=new THREE.PerspectiveCamera(36,w/h,.01,100);camera.position.set(Math.sin(angle)*distance,size.y*.12,Math.cos(angle)*distance);camera.lookAt(0,0,0);
  renderer.setViewport(x,y,w,h);renderer.setScissor(x,y,w,h);renderer.render(scene,camera);
  const data=new Uint8Array(w*h*4),gl=renderer.getContext();gl.readPixels(x,y,w,h,gl.RGBA,gl.UNSIGNED_BYTE,data);pixels.push(data);
 }
 const nonblank=pixels.map(data=>{let count=0;for(let p=0;p<data.length;p+=4)if(Math.max(...[0,1,2].map(c=>Math.abs(data[p+c]-data[c])))>8)count++;return count;});
 const faceDifferences=pixels.slice(1).map(data=>{let total=0;for(let p=0;p<data.length;p+=4)for(let c=0;c<3;c++)total+=Math.abs(data[p+c]-pixels[0][p+c]);return total/(w*h*3);});
 return {size:size.toArray(),center:center.toArray(),nonblank,faceDifferences};
};`,resolveDir:root},bundle:true,format:'iife',write:false,logLevel:'silent'}).outputFiles[0].text;
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await playwright.chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:400}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/__chrysanthemum_qa__',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
  await page.goto('http://127.0.0.1:4180/__chrysanthemum_qa__');await page.addScriptTag({content:code});
  const base='http://127.0.0.1:4180/',revision='?v=chrysanthemum-four-faces-20261022';
  const url=mode==='before'?base+'assets/qinhuai-modern-import/festival/chrysanthemum-low.glb':base+'assets/chrysanthemum-four-faces/'+mode+'.glb'+revision;
  const materialUrl=['before','current'].includes(mode)?null:base+'assets/chrysanthemum-four-faces/current.glb'+revision;
  for(const viewport of [{width:1280,height:400},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   const result=await page.evaluate(opts=>window.showLantern(opts),{url,materialUrl,...viewport});
   console.log(mode,viewport,result);assert.ok(result.nonblank.every(n=>n>1000),'every face must render nonblank pixels');
   if(mode!=='before')assert.ok(result.faceDifferences.every(n=>n<2),'all four rendered faces match the front');
   const file=path.join(out,mode+(viewport.width<600?'-mobile':'')+'.png');await page.screenshot({path:file});console.log(file);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
