const fs=require('node:fs/promises');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const out='work/player-20261020';await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
 const page=await browser.newPage({viewport:{width:1400,height:1200}});
 await page.route('**/player-audit',r=>r.fulfill({contentType:'text/html',body:'<html><head><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script></head><body style="margin:0;background:#fff"></body></html>'}));
 await page.goto('http://127.0.0.1:4180/player-audit');
 const result=await page.evaluate(async()=>{
 const T=await import('three'),{GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
 const manifest=await(await fetch('/assets/qinhuai-modern-import/restored/manifest.json')).json();
 const list=Object.entries(manifest.prototypes).filter(([id,p])=>p.kind==='street-detail');
 const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(280,210);document.body.style="margin:0;display:grid;grid-template-columns:repeat(5,280px);background:#fff";
 const loader=new GLTFLoader(),result=[];
 for(let i=0;i<list.length;i++){
 const [id,p]=list[i],g=await loader.loadAsync('/assets/qinhuai-modern-import/restored/'+p.file),s=new T.Scene();s.background=new T.Color('#e3e5e7');s.add(new T.HemisphereLight(0xffffff,0x777777,3));const light=new T.DirectionalLight(0xffffff,3);light.position.set(3,5,4);s.add(light);
 const b=new T.Box3().setFromObject(g.scene),size=b.getSize(new T.Vector3()),center=b.getCenter(new T.Vector3()),scale=2/Math.max(size.x,size.y,size.z);g.scene.position.sub(center);const group=new T.Group();group.add(g.scene);group.scale.setScalar(scale);s.add(group);
 const c=new T.PerspectiveCamera(35,280/210,.01,100);c.position.set(3,2.2,4);c.lookAt(0,0,0);const x=i%5*280,y=(Math.ceil(list.length/5)-1-Math.floor(i/5))*240;renderer.render(s,c);const cell=document.createElement("div"),image=new Image();image.src=renderer.domElement.toDataURL();cell.append(image);document.body.append(cell);
 const label=document.createElement('div');label.style='width:280px;height:30px;text-align:center;font:14px sans-serif;color:#111';label.textContent=id+' / '+p.source.split('-').slice(-1)[0];cell.append(label);result.push({id,source:p.source,size:size.toArray()});
 }
 return result;
 });
 await page.screenshot({path:out+'/street-details.png',fullPage:true});await fs.writeFile(out+'/street-details.json',JSON.stringify(result,null,2));console.log(result);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
