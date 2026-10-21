const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-player-lighting-')),server=createServer({dataDir});let browser;
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const out='work/player-lighting-20261020';await fs.mkdir(out,{recursive:true});
 try{
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
  const page=await browser.newPage({viewport:{width:480,height:600}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.route('**/__player_probe',r=>r.fulfill({contentType:'text/html',body:'<style>body{margin:0;background:#15181b}canvas{display:block;width:480px;height:600px}</style><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>'}));
  await page.goto('http://127.0.0.1:'+server.address().port+'/__player_probe');
  const report=await page.evaluate(async()=>{
   const T=await import('three'),{ImportPlayer}=await import('/import-player.js'),{ImportEnvironmentSpill}=await import('/import-environment-spill.js');
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,.8,.01,100),rig=new ImportEnvironmentSpill(),renderer=new T.WebGLRenderer({alpha:true,preserveDrawingBuffer:true});
   renderer.setSize(192,240);renderer.toneMapping=T.NoToneMapping;renderer.outputColorSpace=T.LinearSRGBColorSpace;document.body.append(renderer.domElement);
   const player=new ImportPlayer(scene,camera,{surface:()=>14,onReady:avatar=>rig.attachReceivers(avatar,{external:true})});await player.ready();
   player.spawn({x:0,z:0,ground:14});player.root.visible=true;player.avatar.rotation.y=Math.PI;
   rig.configured=true;rig.uniforms.envAtlasBounds.value.set(-12,-12,24,24);rig.buildings=[{id:'probe',rect:[-2,-2.2,2,-1.8],style:'eave',tiles:[1]}];rig.loaded.add(1);
   rig.emitters.set('probe',[{x:0,y:14.3,z:-2,nx:0,nz:1,halfWidth:2}]);rig.setSources({styles:{eave:{color:'#ffffff',energy:3}}});rig.setState({night:true});
   const target=new T.WebGLRenderTarget(192,240),data=new Uint8Array(192*240*4);
   const settings={enabled:true,inheritColor:false,color:'#ff9944',intensity:1,distance:8,decayDistance:5,feather:.5};
   const sample=(name,patch={},x=0)=>{
    rig.setSettings('probe',{...settings,...patch});rig.update();player.position.x=x;camera.position.set(x,14.55,1.2);camera.lookAt(x,14.28,0);scene.updateMatrixWorld(true);
    renderer.setRenderTarget(target);renderer.render(scene,camera);renderer.readRenderTargetPixels(target,0,0,192,240,data);
    let count=0,lit=0;const rgb=[0,0,0];for(let i=0;i<data.length;i+=4){if(data[i+3]<200)continue;count++;for(let k=0;k<3;k++)rgb[k]+=data[i+k];if(Math.max(data[i],data[i+1],data[i+2])>8)lit++;}
    renderer.setRenderTarget(null);renderer.render(scene,camera);
    return {count,lit,rgb:rgb.map(v=>v/count),image:renderer.domElement.toDataURL('image/png')};
   };
   const result={off:sample('off',{enabled:false}),warm:sample('warm'),cool:sample('cool',{color:'#4488ff'})};
   player.setAnimation('Walking');player.mixer.update(.25);result.walk=sample('walk');result.far=sample('far',{},11);
   rig.setState({night:false});result.day=sample('day');
   result.materials=[];player.avatar.traverse(o=>{if(o.isMesh)for(const m of [o.material].flat())result.materials.push({receiver:m.userData.environmentReceiver===true,textured:!!m.map,skinned:o.isSkinnedMesh===true});});
   rig.dispose();player.dispose();target.dispose();renderer.dispose();return result;
  });
  for(const [name,s] of Object.entries(report)){if(!s.image)continue;await fs.writeFile(out+'/'+name+'.png',Buffer.from(s.image.split(',')[1],'base64'));delete s.image;}
  await fs.writeFile(out+'/lighting.json',JSON.stringify({report,errors},null,2));console.log('Light samples',JSON.stringify(report));
  assert.ok(report.warm.count>1000);assert.ok(report.materials.every(m=>m.receiver&&m.textured));assert.ok(report.materials.some(m=>m.skinned));
  assert.ok(report.warm.rgb[0]>report.off.rgb[0]+8);assert.ok(report.warm.rgb[0]>report.warm.rgb[2]+8);
  assert.ok(report.cool.rgb[2]>report.warm.rgb[2]+5);assert.ok(report.cool.rgb[2]>report.cool.rgb[0]*5);
  assert.ok(report.cool.rgb[0]<report.warm.rgb[0]*.2);assert.ok(report.walk.rgb[0]>report.off.rgb[0]+8);
  assert.ok(Math.max(...report.far.rgb)<1);assert.ok(Math.max(...report.day.rgb)<1);assert.deepEqual(errors,[]);
  console.log('PASS',JSON.stringify(report));
 }finally{await browser?.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});await fs.rm(dataDir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
