const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const {buildSync} = require('esbuild');
let playwright;
try { playwright = require('playwright'); } catch {
  playwright = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
}
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'work/mountain-four-faces');
fs.mkdirSync(out, {recursive: true});
process.env.TEMP = process.env.TMP = out;
const phase = process.argv[2] || 'before';
const asset = process.argv[3] || 'assets/lantern-quality/five/mountain.glb';
const code = buildSync({stdin: {contents: `
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
window.showLantern = async ({url,width,height}) => {
 const model=(await new GLTFLoader().loadAsync(url)).scene;
 const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3());
 model.position.sub(box.getCenter(new THREE.Vector3()));
 const scene=new THREE.Scene();scene.background=new THREE.Color('#28333b');scene.add(model);
 scene.add(new THREE.HemisphereLight(0xffffff,0xb4b4b4,2.5));
 const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
 renderer.setSize(width,height);renderer.setPixelRatio(1);renderer.toneMapping=THREE.ACESFilmicToneMapping;
 document.body.replaceChildren(renderer.domElement);document.body.style.margin='0';
 renderer.setScissorTest(true);
 const columns=width<600?2:4,rows=4/columns,w=width/columns,h=height/rows,nonblank=[];
 const extent=Math.max(size.x,size.y,size.z),half=extent*.57/Math.min(1,w/h);
 for(let i=0;i<4;i++){
  const x=(i%columns)*w,y=(rows-1-Math.floor(i/columns))*h,a=i*Math.PI/2;
  const camera=new THREE.OrthographicCamera(-half*w/h,half*w/h,half,-half,.01,extent*10);
  camera.position.set(Math.sin(a)*extent*3,extent*.23,Math.cos(a)*extent*3);camera.lookAt(0,0,0);
  renderer.setViewport(x,y,w,h);renderer.setScissor(x,y,w,h);renderer.render(scene,camera);
  const data=new Uint8Array(w*h*4),gl=renderer.getContext();gl.readPixels(x,y,w,h,gl.RGBA,gl.UNSIGNED_BYTE,data);
  let count=0;for(let p=0;p<data.length;p+=4)if(Math.max(...[0,1,2].map(c=>Math.abs(data[p+c]-data[c])))>8)count++;
  nonblank.push(count);
 }
 renderer.dispose();return {size:size.toArray(),nonblank};
};`, resolveDir: root}, bundle: true, format: 'iife', write: false, logLevel: 'silent'}).outputFiles[0].text;
(async () => {
 const browser=await playwright.chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
  const page=await browser.newPage(),errors=[],results=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/__mountain_qa__',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
  await page.goto('http://127.0.0.1:4180/__mountain_qa__');await page.addScriptTag({content:code});
  for(const viewport of [{width:2000,height:550},{width:390,height:844}]) {
   await page.setViewportSize(viewport);
   const result=await page.evaluate(opts=>window.showLantern(opts),{url:'http://127.0.0.1:4180/'+asset+'?qa='+Date.now(),...viewport});
   assert.ok(result.nonblank.every(n=>n>1000),'All four sides render');results.push({viewport,...result});
   await page.screenshot({path:path.join(out,phase+(viewport.width<600?'-mobile':'')+'.png')});
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,phase+'.json'),JSON.stringify({asset,results,errors},null,2));console.log(JSON.stringify(results));
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
