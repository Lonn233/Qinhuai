const fs=require('node:fs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:960}});page.on('pageerror',e=>console.log('PAGEERROR',e.message));
 await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&view=dragonWall&tile=all');
 await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.loadedTileIds.includes(5),{},{timeout:240000});
 const result=await page.evaluate(async()=>{const T=await import('/node_modules/three/build/three.module.js'),app=window.__QINHUAI_IMPORT__,nodes=[];app.modelRoot.updateMatrixWorld(true);app.modelRoot.traverse(o=>{if(/^FuziTemple(066[4-8]|067[0-3])$/.test(o.name)){const b=new T.Box3().setFromObject(o);nodes.push({name:o.name,min:b.min.toArray(),max:b.max.toArray()});}});app.camera.position.set(-10,20,-8);app.camera.lookAt(-10,11.5,4);return nodes;});console.log(JSON.stringify(result));
 await page.screenshot({path:'work/festival-placement/dragon-survey.png'});
 await page.evaluate(async()=>{const T=await import('/node_modules/three/build/three.module.js'),{GLTFLoader}=await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js');const app=window.__QINHUAI_IMPORT__;app.scene.clear();const fish=(await new GLTFLoader().loadAsync('/assets/feature-lanterns/fish-low.glb')).scene;fish.traverse(o=>{if(o.isMesh){o.material.metalness=0;o.material.emissive.copy(o.material.color);o.material.emissiveMap=o.material.map;o.material.emissiveIntensity=.8;}});app.scene.add(fish);app.scene.add(new T.AmbientLight(0xffffff,2));app.camera.position.set(3,0,0);app.camera.lookAt(0,0,0);app.camera.near=.01;app.camera.far=20;app.camera.updateProjectionMatrix();app.renderer.render(app.scene,app.camera);});
 await page.screenshot({path:'work/festival-placement/fish-source.png'});
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
