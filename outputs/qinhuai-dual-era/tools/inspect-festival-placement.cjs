const fs=require('node:fs');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4180/qinhuai-modern-import.html?time=night&view=gate&gateLight=gold');
  await page.waitForFunction(()=>window.__QINHUAI_IMPORT__?.loadedTileIds.includes(9),{},{timeout:180000});
  await page.waitForTimeout(6000);
  const result=await page.evaluate(async()=>{
   const T=await import('/node_modules/three/build/three.module.js'),app=window.__QINHUAI_IMPORT__,nodes=[];
   app.modelRoot.updateMatrixWorld(true);
   app.modelRoot.traverse(o=>{if(/^FuziTemple(0336|0338|0339|0340|0341|0360|0361|0362|066[4-8]|067[0-3])$/.test(o.name)){const b=new T.Box3().setFromObject(o);nodes.push({name:o.name,min:b.min.toArray(),max:b.max.toArray(),matrix:o.matrixWorld.toArray(),materials:[o.material].flat().filter(Boolean).map(m=>({name:m.name,color:m.color?.getHexString()}))});}});
   return {nodes,tiles:app.loadedTileIds,keys:Object.keys(app),buildings:app.nightLighting.environmentSpill?.buildings};
  });
  fs.mkdirSync('work/festival-placement',{recursive:true});fs.writeFileSync('work/festival-placement/inspection.json',JSON.stringify({result,errors},null,2));
  await page.screenshot({path:'work/festival-placement/before.png'});console.log(JSON.stringify({result,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
