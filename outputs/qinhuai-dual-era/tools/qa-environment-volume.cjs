const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {createServer}=require('../game/serve.cjs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const dataDir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-spatial-spill-')),server=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],origin='http://127.0.0.1:'+server.address().port,out='work/environment-volume-20261020';await fs.mkdir(out,{recursive:true});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.error(m.text().slice(0,2000));}});
 try{
  await page.route('**/__spill_probe',route=>route.fulfill({contentType:'text/html',body:'<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>'}));
  await page.goto(origin+'/__spill_probe');
  const pixels=await page.evaluate(async()=>{
   const T=await import('three'),{ImportEnvironmentSpill}=await import('/import-environment-spill.js');
   const rig=new ImportEnvironmentSpill(),renderer=new T.WebGLRenderer(),scene=new T.Scene(),camera=new T.PerspectiveCamera(40,1,.1,100),target=new T.WebGLRenderTarget(48,48);
   renderer.setSize(48,48);renderer.toneMapping=T.NoToneMapping;renderer.outputColorSpace=T.LinearSRGBColorSpace;renderer.setRenderTarget(target);
   rig.configured=true;rig.uniforms.envAtlasBounds.value.set(-12,-12,24,24);rig.buildings=[{id:'probe',rect:[-2,-.2,2,.2],style:'eave',tiles:[1]}];rig.loaded.add(1);rig.emitters.set('probe',[{x:0,y:14,z:0,nx:0,nz:1,halfWidth:2}]);rig.setSources({styles:{eave:{color:'#ffffff',energy:3}}});rig.setState({night:true});
   const mat=new T.MeshStandardMaterial({color:'#888888',metalness:0,roughness:1}),mesh=new T.Mesh(new T.PlaneGeometry(3,3),mat);mesh.position.set(0,14,3);mesh.rotation.y=Math.PI;scene.add(mesh);rig.attachReceivers(scene,{external:true});
   const sample=(y=14)=>{camera.position.set(0,y,1);camera.lookAt(0,y,3);renderer.render(scene,camera);const pixel=new Uint8Array(4);renderer.readRenderTargetPixels(target,24,24,1,1,pixel);return Array.from(pixel);};
   const settings={enabled:true,inheritColor:false,color:'#ff0000',intensity:1,distance:8,decayDistance:5,feather:.5};
   rig.setSettings('probe',{...settings,enabled:false});rig.update();const off=sample();
   rig.setSettings('probe',settings);rig.update();const red=sample();
   rig.setSettings('probe',{...settings,color:'#0000ff'});rig.update();const blue=sample();
   rig.setSettings('probe',settings);rig.update();mesh.position.y=26;const high=sample(26);mesh.position.y=14;
   mesh.visible=false;const instanced=new T.InstancedMesh(mesh.geometry,mat,1);instanced.setMatrixAt(0,new T.Matrix4().makeRotationY(Math.PI).setPosition(0,14,3));scene.add(instanced);const instance=sample();
   rig.setState({night:false});const day=sample();
   rig.dispose();target.dispose();mesh.geometry.dispose();mat.dispose();renderer.dispose();return {off,red,blue,high,instance,day};
  });
  assert.ok(pixels.red[0]>pixels.off[0]+8,JSON.stringify(pixels));assert.ok(pixels.red[0]>pixels.red[2]+8);assert.ok(pixels.blue[2]>pixels.blue[0]+8);assert.ok(pixels.high[0]<=pixels.off[0]+1);assert.ok(Math.abs(pixels.instance[0]-pixels.red[0])<3);assert.deepEqual(pixels.day,pixels.off);console.log('Rendered wall and instanced object:',pixels);
  await page.goto(origin+'/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__QINHUAI_STARTUP__?.phase==='场景已加载',null,{timeout:240000});
  await page.getByRole('button',{name:'加载全部',exact:true}).click();
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__.loadedTileIds.length===5&&document.querySelector('#status').textContent.includes('模式：全部'),null,{timeout:240000});
  const state=await page.evaluate(()=>{
   const a=window.__QINHUAI_IMPORT__,r=a.nightLighting.environmentSpill;let restored=0,unpatched=0;
   a.restoredProxies.root.traverse(m=>{if(m.isMesh){restored+=m.count||1;for(const mat of Array.isArray(m.material)?m.material:[m.material])if(!mat.userData.environmentReceiver)unpatched++;}});
   const bindings=a.nightLighting.bindings.flatMap(b=>Array.isArray(b.night)?b.night:[b.night]);
   const countBefore=a.scene.getObjectsByProperty('isLight',true).length;
   for(const b of r.buildings)r.setSettings(b.id,{...r.getSettings(b.id),enabled:false});r.update();
   document.querySelector('#toolbar').classList.add('is-collapsed');
   return {restored,instances:a.restoredStats.instances,unpatched,bindingMaterials:bindings.length,patchedBindings:bindings.filter(m=>m.userData.environmentReceiver).length,stats:r.stats,lights:countBefore,render:a.renderer.info.render};
  });
  await page.evaluate(()=>{const a=window.__QINHUAI_IMPORT__;a.setControlMode('firstPerson');a.camera.position.set(-10,18,4);a.camera.lookAt(-10,13,-14);});
  await page.screenshot({path:out+'/environment-off.png',timeout:60000});
  const bake=await page.evaluate(()=>{
   const r=window.__QINHUAI_IMPORT__.nightLighting.environmentSpill,t=performance.now();let volumeMs=0;const original=r.volume.addChannel;r.volume.addChannel=function(...args){const start=performance.now();const result=original.apply(this,args);volumeMs+=performance.now()-start;return result;};
   for(const b of r.buildings)r.setSettings(b.id,{enabled:true,intensity:.65,distance:12,decayDistance:7,inheritColor:false,color:'#ffab55',feather:.7});r.update();
   r.volume.addChannel=original;return {ms:performance.now()-t,volumeMs,stats:r.stats,volume:r.volume.size,origin:r.volume.origin.toArray(),span:r.volume.span.toArray()};
  });
  await page.screenshot({path:out+'/environment-warm.png',timeout:60000});
  const recolor=await page.evaluate(()=>{const r=window.__QINHUAI_IMPORT__.nightLighting.environmentSpill,t=performance.now(),builds=r.volume.kernelBuilds;for(const b of r.buildings)r.setSettings(b.id,{...r.getSettings(b.id),color:'#4488ff'});r.update();return {ms:performance.now()-t,newKernels:r.volume.kernelBuilds-builds,cacheBytes:r.volume.cacheBytes};});assert.equal(recolor.newKernels,0);
  await page.screenshot({path:out+'/environment-blue.png',timeout:60000});
  const lifecycle=await page.evaluate(async()=>{
   const a=window.__QINHUAI_IMPORT__,r=a.nightLighting.environmentSpill;await a.setTimeOfDay('day');const day=r.uniforms.envActive.value;await a.setTimeOfDay('night');const night=r.uniforms.envActive.value;
   const box=document.querySelector('#wireframe');box.checked=true;box.dispatchEvent(new Event('change'));const wire=r.uniforms.envActive.value;box.checked=false;box.dispatchEvent(new Event('change'));
   return {day,night,wire,dragonIntact:a.dragonLighting.bindings.every(b=>b.mesh.material===b.night),lights:a.scene.getObjectsByProperty('isLight',true).length};
  });
  console.log("Main map results",JSON.stringify({state,bake,recolor,lifecycle}));assert.equal(state.instances,1546);assert.equal(state.unpatched,0);assert.ok(state.patchedBindings>0);assert.equal(lifecycle.dragonIntact,true);assert.equal(lifecycle.day,0);assert.equal(lifecycle.night,1);assert.equal(lifecycle.wire,0);assert.equal(lifecycle.lights,state.lights);assert.deepEqual(errors,[]);
  await fs.writeFile(out+'/qa.json',JSON.stringify({pixels,state,bake,recolor,lifecycle,errors,dataDir},null,2));console.log('PASS',JSON.stringify({state,bake,recolor,lifecycle}));
 }catch(e){await fs.writeFile(out+'/errors.json',JSON.stringify(errors,null,2));throw e;}finally{await browser.close();await new Promise(r=>{server.close(r);server.closeAllConnections();});}
})().catch(e=>{console.error(e);process.exitCode=1;});
