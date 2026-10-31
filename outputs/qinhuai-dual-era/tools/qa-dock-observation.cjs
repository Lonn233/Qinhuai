const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const {createServer}=require('../game/serve.cjs');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-dock-')),server=createServer({dataDir});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  page.setDefaultTimeout(300000);
  page.on('pageerror',error=>console.error(error.message));
  await page.addInitScript(()=>Object.defineProperty(window,'devicePixelRatio',{get:()=>.25}));
  await page.goto(`http://127.0.0.1:${server.address().port}/qinhuai-modern-import.html`);
  await page.evaluate(()=>__QINHUAI_STARTUP__.enter('preview'));
  await page.waitForFunction(()=>document.getElementById('storyStart')?.disabled===false,null,{timeout:300000});
  await page.evaluate(()=>{__QINHUAI_IMPORT__.setPerformanceProfile('low');document.getElementById('storyStart').click();});
  await page.waitForFunction(()=>__QINHUAI_IMPORT__.story.mode==='play');
  const survey=await page.evaluate(async()=>{
   const THREE=await import('/node_modules/three/build/three.module.js'),a=__QINHUAI_IMPORT__;
   const boats=[...a.nightLighting.boatLanterns.hulls].map(m=>({name:m.name,box:new THREE.Box3().setFromObject(m)}));
   const meshes=[];a.modelRoot.traverseVisible(m=>{if(m.isMesh)meshes.push(m);});
   const ray=new THREE.Raycaster(),rows=[];
   for(const z of [-14,-13,-12,-11.5,-11,-10.5,-10])for(const x of [-15.4,-13.4,-11.4]){
    ray.set(new THREE.Vector3(x,30,z),new THREE.Vector3(0,-1,0));
    const hits=ray.intersectObjects(meshes,false).slice(0,3).map(h=>({y:h.point.y,name:h.object.name,mat:[h.object.material].flat().map(m=>m.name)}));rows.push({x,z,ground:a.player.surface(x,z,11.864055),hits});
   }
   await a.setControlMode('orbit');a.orbit.target.set(-10,11,-7);a.camera.position.set(-10,24,3);a.camera.lookAt(-10,11,-7);a.camera.updateMatrixWorld();
   const dock=[];
   for(const target of a.story.world.targets().filter(t=>t.dock)){
    const p=target.dock,y=a.player.surface(p.x,p.z,11.3234),start=new THREE.Vector3(p.x,y+.53,p.z),direction=target.position.clone().sub(start),length=direction.length();
    ray.set(start,direction.normalize());ray.near=.03;ray.far=length-.08;
    const hits=ray.intersectObjects(meshes,false).map(h=>({name:h.object.name,distance:h.distance,point:h.point.toArray(),parent:h.object.parent?.name}));
    dock.push({id:target.id,y,position:target.position.toArray(),observation:a.story.world.observationPoint(target),hits});
   }
   return {boats,rows,dock};
  });
  await fs.writeFile('work/dock-survey.json',JSON.stringify(survey,null,2));console.log(JSON.stringify(survey.rows.map(({x,z,ground,hits})=>({x,z,ground,top:hits[0]})),null,2));await page.screenshot({path:'work/dock-survey.png',timeout:90000});
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));await fs.rm(dataDir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
