// Drives real pointer/touch events; debug access only reads coordinates and progress.
const assert=require('node:assert/strict');
async function driver(page,touch=false){
 const cdp=touch?await page.context().newCDPSession(page):null;let held=false,last={x:0,y:0};
 const project=p=>page.evaluate(p=>window.__LOTUS_WORKSHOP__.handwork.project(p),p);
 async function send(type,p){if(cdp){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x:p.x,y:p.y,id:1,radiusX:2,radiusY:2}]});}else if(type==='touchStart'){await page.mouse.move(p.x,p.y);await page.mouse.down();}else if(type==='touchEnd')await page.mouse.up();else await page.mouse.move(p.x,p.y);}
 async function down(p){last={...p};held=true;await send('touchStart',await project(p));}
 async function move(p,steps=20){const from={...last};for(let i=1;i<=steps;i++){last={x:from.x+(p.x-from.x)*i/steps,y:from.y+(p.y-from.y)*i/steps};await send('touchMove',await project(last));}}
 async function up(){await send('touchEnd',await project(last));held=false;}
 async function click(p){await down(p);await up();}
 return {down,move,up,click,async dispose(){if(held)await up();if(cdp)await cdp.detach();}};
}
async function completeGesture(page,{touch=false,screenshot}={}){
 await ensureHandwork(page,touch);
 if(['paper-cut','paper-dye','roller-press'].includes((await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot())).mode))return completePaperGesture(page,{touch,screenshot});
 const beforeActions=await page.evaluate(()=>window.__LOTUS_WORKSHOP__.state.actions);
 const d=await driver(page,touch);try{
 const state=await page.evaluate(()=>window.__LOTUS_WORKSHOP__.handwork.snapshot()),mode=state.mode;
 if(mode!=='inventory-place')assert.equal(await page.locator('#handwork-confirm').isEnabled(),false,'fresh gesture must not be complete');
 if(mode==='bend'){await page.locator('#ring-choice button:not(:disabled)').first().click();const stock=state.stock[0];if(touch)await page.touchscreen.tap(stock.x,stock.y);else await page.mouse.click(stock.x,stock.y);const b=await page.locator('#bend-in').boundingBox();await screenHold(page,{x:b.x+b.width/2,y:b.y+b.height/2},touch,()=>page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().curve>=.99));}
 else if(mode==='inventory-place'){if(state.stage==='frame_short_binding')await dragInventory(page,4,touch);else{for(let i=0;i<3;i++){if((await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().inventory))[i])await dragInventory(page,i,touch);}await dragInventory(page,3,touch);}if(screenshot)await page.screenshot({path:screenshot});return;}
 else if(mode==='lining'||mode==='decoration'){
  await alignLining(page,touch);
  await page.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().turning);
  const panel=await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().panel),id=state.stage;
  const count=await page.evaluate(id=>__LOTUS_WORKSHOP__.state.counts[id],id);
  if(!state.glued.includes(panel)){
   if(touch)await page.tap('#lining-brush');else await page.click('#lining-brush');
   const t=await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().target);
   if(touch)await page.touchscreen.tap(t.x,t.y);else await page.mouse.click(t.x,t.y);
   await page.waitForFunction(i=>__LOTUS_WORKSHOP__.handwork.snapshot().glued.includes(i)&&!__LOTUS_WORKSHOP__.handwork.snapshot().animation,panel);
  }
  await dragPaper(page,touch);
  if(mode==='lining')assert.ok(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().pending),'paper must align on a glued panel');
  if(screenshot)await page.screenshot({path:screenshot});
  if(touch)await page.tap('#handwork-confirm');else await page.click('#handwork-confirm');
  await page.waitForFunction(({id,count})=>__LOTUS_WORKSHOP__.state.counts[id]===count+1,{id,count},{timeout:5000});return;
 }
 else if(['top_flower_assembly','pod_assembly'].includes(state.stage)){await d.down({x:-1.75,y:-.35});await d.move({x:.65,y:.2},30);await d.up();await page.waitForFunction(n=>__LOTUS_WORKSHOP__.state.actions>n,beforeActions);return;}
 else if(mode==='shape'){
  await d.down({x:.15,y:.55});await d.move({x:1.065,y:.55},40);await d.up();
  if(state.stage==='petal_shaping'){
   for(const target of [{x:1,y:0},{x:.7,y:-.2}]){await d.down(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().grip));await d.move(target,40);await d.up();}
  }
 }
 else if(mode==='place'||mode==='press'){
  await d.down({x:-1.75,y:-.35});await d.move({x:.65,y:.2},30);if(touch){await d.up();for(let i=0;i<4;i++)await page.tap('#handwork-rotate-right');await d.down({x:.65,y:.2});await d.up();}else{for(let i=0;i<4;i++)await page.keyboard.press('KeyR');await d.up();}
  assert.equal(await page.evaluate(()=>window.__LOTUS_WORKSHOP__.handwork.snapshot().placed),true,'material must align');
  await d.down({x:.65,y:.2});await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__.handwork.snapshot().ready,null,{timeout:8000});await d.up();
 }else if(mode==='dye'){
  await d.down({x:-1.75,y:-.35});await d.move({x:.65,y:1.1},9);await d.move({x:.65,y:.2},3);await page.waitForFunction(()=>window.__LOTUS_WORKSHOP__.handwork.snapshot().dose>=.62,null,{timeout:8000});await d.move({x:.65,y:1.1},3);await d.move({x:-1.55,y:1},8);await d.up();
 }else if(mode==='inspect'){
  const points=[{x:-.8,y:.65},{x:.75,y:.6},{x:.85,y:-.55},{x:-.8,y:-.55}];await d.down(points[0]);for(let i=0;i<4;i++){if(i)await d.move(points[i],20);await page.waitForFunction(i=>window.__LOTUS_WORKSHOP__.handwork.snapshot().visited.includes(i),i,{timeout:8000});}await d.up();
 }else{
  const points=mode==='bind'?Array.from({length:49},(_,i)=>({x:Math.sin(i/48*Math.PI*4)*.64,y:Math.cos(i/48*Math.PI*4)*.64})):Array.from({length:25},(_,i)=>({x:-1.35+i/24*2.7,y:.38*Math.sin(i/24*Math.PI*2)}));
  // Start slightly beside the first point: Chrome suppresses stationary touchMove events.
  await d.down({x:points[0].x-.08,y:points[0].y});let guard=0;while(guard++<100){const next=await page.evaluate(()=>window.__LOTUS_WORKSHOP__.handwork.snapshot().next);if(next>=points.length)break;await d.move(points[next],5);}await d.up();
 }
 if(['flower_making','pod_making'].includes(state.stage)){await page.waitForFunction(n=>__LOTUS_WORKSHOP__.state.actions>n,beforeActions);return;}
 assert.equal(await page.locator('#handwork-confirm').isEnabled(),true,'gesture did not pass: '+JSON.stringify(await page.evaluate(()=>window.__LOTUS_WORKSHOP__.handwork.snapshot())));
 if(screenshot)await page.screenshot({path:screenshot});if(touch)await page.tap('#handwork-confirm');else await page.click('#handwork-confirm');
 await page.waitForFunction(n=>window.__LOTUS_WORKSHOP__.state.actions>n,beforeActions,{timeout:5000});
 }finally{await d.dispose();}
}
async function screenHold(page,p,touch,wait){const cdp=touch?await page.context().newCDPSession(page):null;try{if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,id:1}]});else{await page.mouse.move(p.x,p.y);await page.mouse.down();}await wait();}finally{if(cdp){await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}else await page.mouse.up();}}
async function dragInventory(page,i,touch=false){const b=await page.locator('#item-'+i).boundingBox(),p={x:b.x+b.width/2,y:b.y+b.height/2},cdp=touch?await page.context().newCDPSession(page):null;try{if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,id:1}]});else{await page.mouse.move(p.x,p.y);await page.mouse.down();}const t=(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot())).target;assert.ok(t,'inventory item needs a socket');for(let n=1;n<=20;n++){const q={x:p.x+(t.x-p.x)*n/20,y:p.y+(t.y-p.y)*n/20};if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...q,id:1}]});else await page.mouse.move(q.x,q.y);}if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await page.mouse.up();}finally{if(cdp)await cdp.detach();}await page.waitForFunction(()=>!__LOTUS_WORKSHOP__.handwork.snapshot().mounting);}
async function ensureHandwork(page,touch=false){const tap=selector=>touch?page.tap(selector):page.click(selector);if(!await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.active)){await tap('#go-station');await page.waitForTimeout(750);await tap('#craft-action');}if(await page.isVisible('#handwork-next'))await tap('#handwork-next');await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.active&&!__LOTUS_WORKSHOP__.handwork.snapshot().moving,null,{timeout:5000});}
async function dragPaper(page,touch=false){const b=await page.locator('#lining-paper').boundingBox(),p={x:b.x+b.width/2,y:b.y+b.height/2};await screenDrag(page,p,await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot().target),touch);}
async function screenDrag(page,from,to,touch=false){const cdp=touch?await page.context().newCDPSession(page):null;try{if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...from,id:1}]});else{await page.mouse.move(from.x,from.y);await page.mouse.down();}for(let n=1;n<=20;n++){const p={x:from.x+(to.x-from.x)*n/20,y:from.y+(to.y-from.y)*n/20};if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...p,id:1}]});else await page.mouse.move(p.x,p.y);}if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await page.mouse.up();}finally{if(cdp)await cdp.detach();}}
async function alignLining(page,touch=false){
 for(let i=0;i<12;i++){
  const s=await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());if(s.orientation.aligned)return;
  const p=s.rotationTarget,dx=Math.max(-100,Math.min(100,s.orientation.error/s.rotationSpeed));
  await screenDrag(page,p,{x:p.x+dx,y:p.y},touch);
 }
 assert.fail('lamp did not align: '+JSON.stringify(await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot())));
}
module.exports={alignLining,completeGesture,driver,ensureHandwork,dragInventory,dragPaper,screenDrag,screenHold};

// Screen-space input for paper gestures; CDP touch follows exactly the same paths.
async function screenDriver(page,touch=false){
 const cdp=touch?await page.context().newCDPSession(page):null;let last={x:0,y:0},held=false;
 async function down(p){last=p;held=true;if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...p,id:1}]});else{await page.mouse.move(p.x,p.y);await page.mouse.down();}}
 async function move(p,steps=1){const start=last;for(let i=1;i<=steps;i++){const q={x:start.x+(p.x-start.x)*i/steps,y:start.y+(p.y-start.y)*i/steps};if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...q,id:1}]});else await page.mouse.move(q.x,q.y);}last=p;}
 async function up(){if(cdp)await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await page.mouse.up();held=false;}
 return {down,move,up,async dispose(){if(held)await up();if(cdp)await cdp.detach();}};
}
async function completePaperGesture(page,{touch=false,screenshot}={}){
 const s=await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot()),d=await screenDriver(page,touch),before=await page.evaluate(()=>__LOTUS_WORKSHOP__.state.actions);
 try{
  if(s.mode==='paper-cut'){await d.down(s.outline[0]);for(const p of s.outline.slice(1))await d.move(p,2);await d.up();}
  else if(s.mode==='paper-dye'){
   await page.click('#paper-stock');let q=await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());await screenDrag(page,q.paper,q.bath,touch);
   await page.click('#handwork-confirm');await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().simulatedSeconds>=75);await page.click('#handwork-confirm');
   await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().phase==='review');q=await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot());await screenDrag(page,q.paper,q.rack,touch);
  }
  else{await page.click('#handwork-confirm');await page.waitForFunction(()=>__LOTUS_WORKSHOP__.handwork.snapshot().ready,null,{timeout:15000});}
  assert.ok((await page.evaluate(()=>__LOTUS_WORKSHOP__.handwork.snapshot())).ready,'paper gesture not ready');if(screenshot)await page.screenshot({path:screenshot});await page.click('#handwork-confirm');await page.waitForFunction(n=>__LOTUS_WORKSHOP__.state.actions>n,before);
 }finally{await d.dispose();}
}
module.exports.screenDriver=screenDriver;
module.exports.completePaperGesture=completePaperGesture;
