const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {chromium}=require('C:/Users/Lonn/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createServer}=require('../game/serve.cjs');
const out=path.resolve(__dirname,'../work/placeable-lanterns-20261022');
(async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'qinhuai-placed-qa-')),server=createServer({dataDir:dir});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
 const errors=[];let page;
 try{
  const source=await fs.readFile(path.resolve(__dirname,'../qinhuai-modern-import.html'),'utf8');
  const style=source.match(/<style>([\s\S]*?)<\/style>/)[1];
  let html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><style>${style}
   #app{right:360px}#toolbar{left:auto;right:14px} .placed-lantern-panel{margin:0}
   @media(max-width:600px){#app{right:0}#toolbar{top:auto;bottom:10px;max-height:54vh}}
   </style><div id="app"></div><aside id="toolbar" class="panel"></aside>
   <script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
   <script type="module">
   import * as T from 'three';
   import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
   import {PlaceableLanternLayer} from '/import-placeable-lanterns.js';
   import {mountPlaceableLanternControls} from '/import-placeable-lantern-controls.mjs';
   import {mountLanternControls} from '/import-lantern-controls.mjs';
   import {LanternLighting} from '/import-lantern-lighting.js';
   import {PLACEABLE_LANTERNS} from '/import-placeable-lantern-settings.mjs';
   const scene=new T.Scene();scene.background=new T.Color('#26373d');
   const camera=new T.PerspectiveCamera(44,1,.01,100);camera.position.set(4,5,10);
   const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);document.querySelector('#app').append(renderer.domElement);
   scene.add(new T.HemisphereLight(0xffffff,0x74776b,3));const light=new T.DirectionalLight(0xffffff,3);light.position.set(3,8,5);scene.add(light);
   const floor=new T.Mesh(new T.PlaneGeometry(40,40),new T.MeshStandardMaterial({color:0x506268,roughness:1}));floor.rotation.x=-Math.PI/2;scene.add(floor);scene.add(new T.GridHelper(40,40,0x829597,0x687a7e));
   const orbit=new OrbitControls(camera,renderer.domElement);orbit.target.set(0,.8,0);orbit.update();
   const layer=new PlaceableLanternLayer(scene);let preview=true;
   const stub=()=>({entries:new Map(),tiles:new Map(),root:new T.Group(),groups:[],settings:{enabled:true,brightness:1},waterVisible:true,ready:true,setState(){}});
   const environment={active:true,setLanternChannels(channels){this.channels=channels;}};
   const rig=new LanternLighting({festival:stub(),feature:stub(),tree:stub(),courtyard:stub(),racks:stub(),red:stub(),street:stub(),placed:layer,environment});
   const ground=ray=>ray.intersectObject(floor)[0]?.point.clone()||null;
   const focus=id=>{const b=layer.bounds(id),c=b.getCenter(new T.Vector3()),s=b.getSize(new T.Vector3());camera.position.copy(c).add(new T.Vector3(2,1.1,3).normalize().multiplyScalar(s.length()*1.8));orbit.target.copy(c);orbit.update();};
   const options={layer,storage:localStorage,camera,canvas:renderer.domElement,canEdit:()=>preview,pickGround:ground,viewTarget:()=>{const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(),camera);return ground(ray);},onFocus:focus};
   let controls=mountPlaceableLanternControls(document.querySelector('#toolbar'),options);controls.panel.open=true;
   const lights=mountLanternControls(document.querySelector('#toolbar'),{rig,storage:localStorage,onPlacedFocus:focus});
   let down;renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<=5)controls.handleClick(e);down=null;});
   const resize=()=>{const rect=document.querySelector('#app').getBoundingClientRect();renderer.setSize(rect.width,rect.height);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();};addEventListener('resize',resize);resize();
   function render(){controls.update(preview);rig.update();orbit.update();renderer.render(scene,camera);requestAnimationFrame(render);}render();
   window.qa={scene,camera,renderer,layer,rig,lights,environment,catalog:PLACEABLE_LANTERNS,get controls(){return controls;},setPreview:v=>preview=v,focus,
    reset:()=>{camera.position.set(4,5,10);orbit.target.set(0,.8,0);orbit.update();},
    remount:()=>{controls.dispose();controls=mountPlaceableLanternControls(document.querySelector('#toolbar'),options);controls.panel.open=true;},
    sample:()=>{renderer.render(scene,camera);const gl=renderer.getContext(),pixels=new Uint8Array(renderer.domElement.width*renderer.domElement.height*4);gl.readPixels(0,0,renderer.domElement.width,renderer.domElement.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);return pixels;},
    pixelDiff:()=>{const a=qa.sample();layer.root.visible=false;const b=qa.sample();layer.root.visible=true;let changed=0;for(let i=0;i<a.length;i+=4)if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>25)changed++;renderer.render(scene,camera);return changed;}
   };
   </script></html>`;
  // Match the production bundle's CJS/JSON handling without changing the server.
  const moduleSource=html.match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/from '\//g,"from './");
  const bundle=require('esbuild').buildSync({stdin:{contents:moduleSource,resolveDir:path.resolve(__dirname,'..'),sourcefile:'placeable-lantern-qa.js'},bundle:true,write:false,format:'esm',platform:'browser',target:'es2022',external:['three','three/*']}).outputFiles[0].text;
  html=html.replace(/<script type="module">[\s\S]*?<\/script>/,'<script type="module" src="/placeable-lantern-qa.js"></script>');
  page=await browser.newPage({viewport:{width:1280,height:900}});page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')console.error(m.text());});
  await page.route('**/placeable-lantern-qa.js',route=>route.fulfill({contentType:'text/javascript',body:bundle}));
  await page.route('**/placeable-lantern-qa',route=>route.fulfill({contentType:'text/html',body:html}));
  await page.goto('http://127.0.0.1:'+server.address().port+'/placeable-lantern-qa');await page.waitForFunction(()=>window.qa);
  for(const kind of ['column','rack','pink','drum']){
   await page.selectOption('#placed-lantern-kind',kind);await page.click('#placed-lantern-add');
   await page.waitForFunction(()=>document.querySelector('#placed-lantern-status').textContent.startsWith('待放置'),null,{timeout:90000});
   await page.mouse.move(420,470);await page.mouse.down();await page.mouse.move(470,480,{steps:4});await page.mouse.up();
   assert.equal(await page.evaluate(()=>qa.controls.record.instances.length),['column','rack','pink','drum'].indexOf(kind),'drag must not place');
   await page.mouse.move(440,480);await page.mouse.click(440,480);
   await page.evaluate(()=>qa.layer.ready);console.log('Placed',kind);
  }
  assert.equal(await page.evaluate(()=>qa.layer.objects.size),4);
  const before=await page.evaluate(()=>qa.controls.record.instances.at(-1));
  await page.locator('#placed-lantern-add').focus();await page.keyboard.press('ArrowUp');await page.keyboard.press('ArrowRight');await page.keyboard.press('KeyP');
  const moved=await page.evaluate(()=>qa.controls.record.instances.at(-1));
  assert.ok(Math.hypot(moved.x-before.x,moved.z-before.z)>.3);assert.equal(moved.y,before.y+.25);
  await page.keyboard.press('KeyO');assert.ok(Math.abs(await page.evaluate(()=>qa.controls.record.instances.at(-1).y)-before.y)<1e-10);
  for(const [key,value] of [['x',1.7],['y',.8],['z',-2.1],['rx',10],['ry',65],['rz',-5],['scale',1.2]]){
   await page.locator('#placed-lantern-'+key).fill(String(value));await page.locator('#placed-lantern-'+key).dispatchEvent('change');
   assert.equal(await page.evaluate(key=>qa.controls.record.instances.at(-1)[key],key),value);
  }
  const inputBefore=await page.evaluate(()=>qa.controls.record);await page.locator('#placed-lantern-y').focus();await page.keyboard.press('KeyP');
  assert.deepEqual(await page.evaluate(()=>qa.controls.record),inputBefore,'typing into a field must not move selection');
  await page.click('#placed-lantern-copy');assert.equal(await page.evaluate(()=>qa.controls.record.instances.length),5);
  await page.click('#placed-lantern-delete');assert.equal(await page.evaluate(()=>qa.controls.record.instances.length),4);
  await page.evaluate(()=>qa.controls.select(qa.controls.record.instances.at(-1).id));
  assert.equal(await page.locator('#placedLanternPanel input[type="color"], #placedLanternPanel input[type="range"]').count(),0);
  await page.evaluate(()=>{for(const id of ['lanternLightPanel','lanternBodyPanel','lanternSpillPanel'])document.getElementById(id).open=true;});
  await page.selectOption('#lantern-group','drum');
  for(const [label,value] of [['灯体亮度 · 当前效果 ×数值',2.6],['环境外溢强度数值',1.3],['外溢最远距离数值',6],['亮度衰减距离数值',3],['边缘柔和程度数值',.5]]){
   await page.getByRole('spinbutton',{name:label,exact:true}).fill(String(value));await page.getByRole('spinbutton',{name:label,exact:true}).dispatchEvent('change');
  }
  await page.locator('#lantern-spill-enabled').check();
  await page.locator('#lantern-inheritColor').uncheck();
  await page.locator('#lantern-color').fill('#ff4050');await page.locator('#lantern-color').dispatchEvent('input');
  const lighting=await page.evaluate(()=>qa.rig.getSettings('drum'));
  assert.equal(lighting.brightness,2.6);assert.equal(lighting.color,'#ff4050');assert.equal(lighting.spill.distance,6);assert.equal(lighting.spill.enabled,true);
  const independent=await page.evaluate(async()=>{
   const id=qa.controls.selected,original=qa.controls.record.instances.find(i=>i.id===id);document.getElementById('placed-lantern-copy').click();await qa.layer.ready;
   const copyId=qa.controls.selected;let a,b,t;
   qa.layer.objects.get(id).traverse(o=>{if(o.isMesh)a=o.material;});qa.layer.objects.get(copyId).traverse(o=>{if(o.isMesh)b=o.material;});(await qa.layer.template(original.kind)).traverse(o=>{if(o.isMesh)t=o.material;});
   const other=qa.layer.objects.get(qa.controls.record.instances.find(i=>i.kind==='column').id);let c;other.traverse(o=>{if(o.isMesh)c=o.material;});
   const result={separate:a!==b&&a!==t&&b!==t,original:a.emissiveIntensity,copy:b.emissiveIntensity,other:c.emissiveIntensity,emissiveMap:a.emissiveMap===a.map};document.getElementById('placed-lantern-delete').click();qa.controls.select(id);return result;
  });
  assert.ok(independent.separate);assert.equal(independent.original,2.6*.65);assert.equal(independent.copy,2.6*.65);assert.equal(independent.other,.65);assert.ok(independent.emissiveMap);
  const spill=await page.evaluate(()=>qa.layer.spillChannels().map(c=>({key:c.cacheKey,energy:c.energy,count:c.emitters.length,color:c.color.getHexString()})));
  assert.equal(spill.length,1);assert.equal(spill[0].energy,2.6*.65);assert.equal(spill[0].color,'ff4050');
  await page.evaluate(()=>{qa.environment.active=false;qa.rig.apply();});assert.equal(await page.evaluate(()=>qa.layer.spillChannels().length),0);
  await page.evaluate(()=>{qa.environment.active=true;qa.rig.apply();qa.rig.setSettings('drum',{...qa.rig.getSettings('drum'),modelVisible:false});});
  assert.equal(await page.evaluate(()=>qa.layer.objects.get(qa.controls.selected).visible),false);
  await page.evaluate(()=>qa.lights.reload());
  assert.equal(await page.evaluate(()=>qa.layer.objects.get(qa.controls.selected).visible),true);
  const saved=await page.evaluate(()=>qa.controls.record);await page.evaluate(()=>qa.remount());
  assert.deepEqual(await page.evaluate(()=>qa.controls.record),saved);await page.evaluate(()=>qa.layer.ready);
  await page.selectOption('#placed-lantern-instance',saved.instances[0].id);await page.click('#placed-lantern-focus');
  await page.evaluate(()=>qa.setPreview(false));await page.waitForFunction(()=>!qa.layer.preview);
  const locked=await page.evaluate(()=>qa.controls.record);await page.click('#placed-lantern-add-center');await page.locator('#placed-lantern-add').focus();await page.keyboard.press('ArrowRight');
  assert.deepEqual(await page.evaluate(()=>qa.controls.record),locked);assert.equal(await page.evaluate(()=>qa.layer.objects.size),4);assert.equal(await page.evaluate(()=>qa.layer.helpers.visible),false);
  await page.evaluate(()=>qa.setPreview(true));await page.waitForFunction(()=>qa.layer.preview);
  await page.evaluate(async()=>{const record=qa.controls.record;for(const config of qa.catalog)if(!record.instances.some(i=>i.kind===config.id))record.instances.push({id:'qa-'+config.id,kind:config.id,x:0,y:0,z:0,rx:0,ry:0,rz:0,scale:1});localStorage.setItem('qinhuai.scene-lantern-placements.v1',JSON.stringify(record));qa.controls.reload();await qa.layer.ready;});
  assert.equal(await page.evaluate(()=>qa.layer.objects.size),23);
  const fishMaterial=await page.evaluate(async()=>{
   const item=qa.controls.record.instances.find(v=>v.kind==='fish'),object=qa.layer.objects.get(item.id),meshes=[];
   object.traverse(o=>{if(o.isMesh)meshes.push(o);});
   const mesh=meshes[0],m=mesh.material;
   const raw=await fetch('/assets/lantern-quality/five/fish.glb').then(r=>r.arrayBuffer()),view=new DataView(raw);
   const json=JSON.parse(new TextDecoder().decode(new Uint8Array(raw,20,view.getUint32(12,true))));
   return {meshes:meshes.length,map:!!m.map,normal:!!m.normalMap,roughness:!!m.roughnessMap,metalness:!!m.metalnessMap,
    emissive:m.emissiveMap===m.map,uv:mesh.geometry.attributes.uv.count===mesh.geometry.attributes.position.count,
    triangles:mesh.geometry.index.count/3,expectedTriangles:json.accessors[json.meshes[0].primitives[0].indices].count/3,
    position:object.position.toArray(),expectedPosition:[item.x,item.y,item.z]};
  });
  assert.equal(fishMaterial.meshes,1);
  for(const key of ['map','normal','roughness','metalness','emissive','uv'])assert.equal(fishMaterial[key],true,'fish '+key);
  assert.equal(fishMaterial.triangles,fishMaterial.expectedTriangles);
  assert.deepEqual(fishMaterial.position,fishMaterial.expectedPosition);
  const renders=[];
  for(const item of await page.evaluate(()=>qa.controls.record.instances)){
   await page.evaluate(({id})=>{for(const [other,o] of qa.layer.objects)o.visible=other===id;qa.controls.select(id);qa.focus(id);},item);await page.waitForTimeout(150);
   const changed=await page.evaluate(()=>qa.pixelDiff());assert.ok(changed>100,'model must contribute visible canvas pixels');
   const lightPixels=await page.evaluate(id=>{
    const entry=qa.controls.record.instances.find(v=>v.id===id),settings=qa.rig.getSettings(entry.kind),apply=p=>{qa.rig.setSettings(entry.kind,p);for(const [other,o] of qa.layer.objects)o.visible=other===id;};apply({...settings,brightness:0});const dark=qa.sample();apply({...settings,brightness:4});const bright=qa.sample();let changed=0;
    for(let i=0;i<dark.length;i+=4)if(Math.abs(dark[i]-bright[i])+Math.abs(dark[i+1]-bright[i+1])+Math.abs(dark[i+2]-bright[i+2])>20)changed++;
    apply({...settings,brightness:4,inheritColor:false,color:'#00ff00'});const green=qa.sample();let tinted=0;for(let i=0;i<green.length;i+=4)if(Math.abs(green[i]-bright[i])+Math.abs(green[i+1]-bright[i+1])+Math.abs(green[i+2]-bright[i+2])>20)tinted++;
    apply(settings);return {changed,tinted};
   },item.id);assert.ok(lightPixels.changed>100,'brightness must change rendered pixels');assert.ok(lightPixels.tinted>100,'color must change rendered pixels');
   renders.push({kind:item.kind,changed,lightPixels});if(['column','rack','pink','drum','fish'].includes(item.kind))await page.screenshot({path:path.join(out,item.kind+'.png')});
  }
  await page.evaluate(saved=>{saved.instances.forEach((v,i)=>Object.assign(v,{x:(i-1.5)*2.1,y:0,z:0,rx:0,ry:0,rz:0,scale:1}));localStorage.setItem('qinhuai.scene-lantern-placements.v1',JSON.stringify(saved));qa.controls.reload();qa.reset();},saved);
  await page.evaluate(()=>qa.layer.ready);await page.screenshot({path:path.join(out,'desktop.png')});
  const initialPixels=await page.evaluate(()=>Array.from(qa.sample()));await page.mouse.move(390,350);await page.mouse.down();await page.mouse.move(430,370,{steps:5});await page.mouse.up();
  assert.notDeepEqual(await page.evaluate(()=>Array.from(qa.sample())),initialPixels,'camera orbit changes the rendered canvas');
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.ok(await page.evaluate(()=>qa.pixelDiff())>100);await page.screenshot({path:path.join(out,'mobile.png')});
  // Pending loads must honor the newest record, including a kind change for the same ID.
  await page.evaluate(async()=>{const r=qa.controls.record,a={...r.instances[0],id:'race',kind:'column'};const old=qa.layer.apply({version:1,instances:[a]});await qa.layer.apply({version:1,instances:[{...a,kind:'rack',x:3}]});await old;});
  assert.deepEqual(await page.evaluate(()=>[...qa.layer.objects.values()].map(o=>[o.userData.kind,o.position.x])),[['rack',3]]);
  await page.evaluate(()=>qa.controls.reload());await page.evaluate(()=>qa.layer.ready);
  assert.deepEqual(errors,[]);await fs.writeFile(path.join(out,'browser.json'),JSON.stringify({renders,fishMaterial,errors},null,2));console.log('PASS placement, drag guard, camera-relative movement, O/P, numeric transforms, input guard, copy/delete, persistence, mode guard, responsive rendering, load races',renders);
 }catch(error){console.error('Browser errors:',errors);throw error;}finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
function CSSescape(value){return value.replaceAll('.','\\.');}
