const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs/promises');
const {build} = require('esbuild');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))); }

async function main() {
 const mocks = {
  'world.js': 'export const createStoryWorld=a=>a.testWorld;',
  'navigation-client.js': 'export const createWorkerNavigator=()=>({path:[],revision:0,remaining:0,status:"idle",reset(){},tick(){},request(){},follow(){}});',
  'book.js': 'export const createLanternBook=()=>document.createElement("div");',
  'import-festival-lanterns.js': 'export const pointInWater=()=>false;',
 };
 const bundle = await build({
  stdin:{resolveDir:path.resolve(__dirname,'..'),contents:`
   import * as THREE from 'three';
   import {mountStory} from './story/controller.js';
   import {LANTERNS} from './story/content.mjs';
   import {RIDDLES} from './story/state.mjs';
   import {TEST_CHECKPOINTS,checkpointData} from './story/test-checkpoints.mjs';
   import assets from './story/assets.json';
   let inside=false,control='firstPerson',templeBusy=false,delay=0;
   const lamps=LANTERNS.map((lamp,i)=>({id:lamp.id,lamp,water:lamp.water,dock:!!lamp.water,instance:0,
    position:new THREE.Vector3(i*3,1,-2),bounds:new THREE.Box3(new THREE.Vector3(i*3-.2,0,-2.2),new THREE.Vector3(i*3+.2,2,-1.8))}));
   const world={assets:structuredClone(assets),finishedReady:false,riddleTargets:RIDDLES.map(r=>({id:r.id,position:new THREE.Vector3(r.id,1,-5)})),
    workshop:{x:10,y:0,z:10},hang:{x:20,y:0,z:20},hung:false,
    async prepare(){},async loadFinished(){},setHung(v){this.hung=v;},clearObservations(){},async animateHang(){return true;},
    setVisible(){},placeMaster(){},setRoute(){},update(){},drawMap(){},targets:()=>lamps,
    observationPoint:t=>({x:t.position.x,y:0,z:t.position.z+1})};
   const adapter={testWorld:world,camera:new THREE.PerspectiveCamera(60,1,.01,100),stop(){},
    pointer:{isLocked:false,unlock(){this.isLocked=false;}},orbit:{},requestLookLock(){this.pointer.isLocked=true;},
    modelVisible:()=>true,controlMode:()=>control,switchControl:v=>{control=v;},async ensureScene(){},async setTimeOfDay(){return true;},
    temple:{snapshot:()=>({inside,busy:templeBusy,near:false}),async restore(v){await new Promise(r=>setTimeout(r,delay));inside=v;}},
    findSpawn:(x,z,y)=>({x,z,ground:y}),lineClear:()=>true,
    player:{position:new THREE.Vector3(),yaw:0,spawn(p){this.position.set(p.x,p.ground,p.z);},updateCamera(){}}};
   window.testAudio=[];window.Audio=class{
    constructor(file){this.file=file;this.paused=true;testAudio.push(this);}
    play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}load(){}removeAttribute(){}
   };
   const story=mountStory(adapter);
   window.fixture={story,world,adapter,points:TEST_CHECKPOINTS,RIDDLES,checkpointData,
    set delay(v){delay=v;},set templeBusy(v){templeBusy=v;},get inside(){return inside;},now:0};
   story.ready();
  `},bundle:true,write:false,format:'iife',platform:'browser',
  plugins:[{name:'test-world',setup(b){b.onLoad({filter:/[\\/](world|navigation-client|book|import-festival-lanterns)\.js$/},args=>({contents:mocks[path.basename(args.path)]}));}}],
 });
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('http://story.test/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body style="margin:0;background:#444"></body></html>'}));
  await page.goto('http://story.test/');
  await page.addStyleTag({path:path.resolve(__dirname,'../story/story.css')});
  await page.addScriptTag({content:bundle.outputFiles[0].text});
  await page.locator('#storyStart').click();
  await page.waitForFunction(()=>fixture.story.mode==='play');
  await page.evaluate(()=>document.documentElement.dataset.storyUiHidden='true');
  assert.equal(await page.locator('#storyTestToggle').isVisible(),false);
  assert.equal(await page.locator('#storyQuest').isVisible(),false);
  await page.keyboard.press('7');assert.equal(await page.locator('#storyTestToggle').isVisible(),true);
  await page.keyboard.press('7');assert.equal(await page.locator('#storyTestToggle').isVisible(),false);
  await page.keyboard.press('8');assert.equal(await page.locator('#storyQuest').isVisible(),true);
  await page.keyboard.press('8');assert.equal(await page.locator('#storyQuest').isVisible(),false);
  await page.evaluate(()=>{delete document.documentElement.dataset.storyUiHidden;delete document.documentElement.dataset.storyTestHotkey;delete document.documentElement.dataset.storyQuestHotkey;});
  const points=await page.evaluate(()=>fixture.points.map(p=>({id:p.id,kind:p.kind,stage:p.stage,riddle:p.riddle,lamp:p.lamp,line:p.line?.id})));
  const storage=()=>page.evaluate(()=>JSON.stringify({...localStorage}));
  const initialStorage=await storage();
  const original=await page.evaluate(()=>{
   fixture.adapter.player.position.set(4,0,7);fixture.adapter.player.yaw=.83;fixture.adapter.switchControl('thirdPerson');
   return {data:JSON.stringify(fixture.story.state.data),position:fixture.adapter.player.position.toArray(),yaw:fixture.adapter.player.yaw};
  });
  const snap=()=>page.evaluate(()=>fixture.story.snapshot);
  const settled=()=>page.waitForFunction(()=>fixture.story.testing&&!fixture.story.snapshot.testBusy);
  const jump=async id=>{await page.locator('#storyTestSelect').selectOption(String(points.findIndex(p=>p.id===id)));await settled();};
  const verify=async i=>{
   await settled();const state=await snap(),p=points[i];
   assert.equal(state.testIndex,i);assert.equal(state.checkpointId,p.id);assert.equal(state.stage,p.stage);
   assert.equal(state.dialogueId,p.kind==='dialogue'?p.line:p.kind==='observe'?'OBSERVE_'+p.lamp:null);
   assert.equal(state.observing,p.kind==='observe'?p.lamp:null);
   assert.equal(state.riddle,p.kind==='riddle'?p.riddle:null);
   assert.equal(await page.evaluate(()=>fixture.inside),p.stage==='riddles');
   assert.equal(await page.evaluate(()=>fixture.adapter.pointer.isLocked),false);
   assert.ok((await page.locator('#storyTestStatus').textContent()).indexOf('失败')<0);
   assert.equal(await storage(),initialStorage,'test steps must never change formal localStorage');
   assert.ok(await page.evaluate(()=>testAudio.filter(a=>!a.paused).length<=1),'only the current voice may play');
  };
  await page.locator('#storyTestToggle').click();await verify(0);
  assert.equal(await page.locator('#storyTestPrev').isDisabled(),true);
  for(let i=1;i<points.length;i++){await page.locator('#storyTestNext').click();await verify(i);}
  assert.equal(await page.locator('#storyTestNext').isDisabled(),true);
  for(let i=points.length-2;i>=0;i--){await page.locator('#storyTestPrev').click();await verify(i);}
  console.log('PASS all '+points.length+' checkpoints forward and backward, single voice, isolated saves');
  await jump('riddle-5');
  await page.locator('#storyRiddleAnswer').fill(await page.evaluate(()=>fixture.RIDDLES[4].answers[0]));
  await page.locator('#storyRiddleForm button[type=submit]').click();
  const staleCue=await page.evaluate(()=>{window.staleCue=testAudio.at(-1).onended;return testAudio.length;});
  await jump('ACT4_HANG_005');
  await page.evaluate(()=>window.staleCue());
  assert.equal((await snap()).dialogueId,'ACT4_HANG_005');
  assert.equal(await page.evaluate(()=>fixture.story.state.data.riddleCompletePlayed),true);
  assert.equal(await storage(),initialStorage);
  await page.locator('#storyTestReplay').click();await settled();
  assert.ok(await page.evaluate(n=>testAudio.length>n,staleCue));
  await jump('riddle-5');assert.equal(await page.locator('#storyRiddleAnswer').inputValue(),'');
  assert.equal(await page.evaluate(()=>fixture.story.state.riddleSolved),4);
  console.log('PASS direct jumps, replay/reset, and stale riddle feedback cancellation');
  await page.evaluate(()=>{fixture.delay=160;});
  await page.evaluate(()=>{document.getElementById('storyTestNext').click();document.getElementById('storyTestNext').click();});
  await settled();assert.equal((await snap()).checkpointId,'riddle-6');
  await page.evaluate(()=>{fixture.delay=0;fixture.templeBusy=true;});
  await page.locator('#storyTestNext').click();assert.equal((await snap()).checkpointId,'riddle-6');
  await page.evaluate(()=>{fixture.templeBusy=false;});
  console.log('PASS rapid click and temple-transition guards');
  await page.evaluate(()=>{
   window.observationDefaults={targets:fixture.world.targets,point:fixture.world.observationPoint};
   const lamps=fixture.world.targets(),first=lamps.find(t=>t.id==='lion');
   const second={...first,instance:1,position:first.position.clone().setX(50)};
   fixture.world.targets=()=>[first,second,...lamps.filter(t=>t.id!=='lion')];
   fixture.world.observationPoint=t=>t.id==='lion'&&t.instance===0?null:observationDefaults.point(t);
  });
  await jump('observe-lion');await verify(points.findIndex(p=>p.id==='observe-lion'));
  assert.equal(await page.evaluate(()=>fixture.adapter.player.position.x),50,'use the reachable alternative lamp');
  await page.evaluate(()=>{fixture.world.observationPoint=()=>null;});
  await page.locator('#storyTestReplay').click();await settled();
  assert.equal((await snap()).observing,null);
  assert.equal((await snap()).dialogueId,'OBSERVE_lion');
  assert.match(await page.locator('#storyTestStatus').textContent(),/暂无安全观察点.*仅预听/);
  assert.equal(await page.evaluate(()=>fixture.story.state.data.observed.includes('lion')),false);
  assert.equal(await page.evaluate(()=>fixture.adapter.player.position.x),10,'fallback stays at the safe workshop');
  await page.locator('#storyTestNext').click();await settled();
  assert.notEqual((await snap()).checkpointId,'observe-lion');
  await page.locator('#storyTestPrev').click();await settled();
  assert.equal((await snap()).checkpointId,'observe-lion');
  await page.evaluate(()=>{fixture.world.targets=()=>[];});
  await page.locator('#storyTestReplay').click();await settled();
  assert.equal((await snap()).observing,null);
  assert.equal((await snap()).dialogueId,'OBSERVE_lion');
  assert.match(await page.locator('#storyTestStatus').textContent(),/未加载.*仅预听/);
  assert.equal(await page.evaluate(()=>testAudio.filter(a=>!a.paused).length),1);
  assert.equal(await storage(),initialStorage);
  await page.evaluate(()=>{fixture.world.targets=observationDefaults.targets;fixture.world.observationPoint=observationDefaults.point;});
  console.log('PASS alternate lamp selection, unreachable/unloaded voice-only fallback and continued navigation');
  const out=path.resolve(__dirname,'../work');await fs.mkdir(out,{recursive:true});
  for(const [width,height] of [[1440,900],[390,844],[844,390]]){
   await page.setViewportSize({width,height});
   for(const id of ['ACT4_HANG_005','observe-lion','riddle-1','craft']){
    await jump(id);
    const layout=await page.evaluate(()=>{
     const panel=document.getElementById('storyTestPanel').getBoundingClientRect();
     const e=[...document.querySelectorAll('#storyDialogue,.story-riddle-card,.story-modal-card')].find(e=>e.getClientRects().length);
     const other=e?.getBoundingClientRect();
     return {overlap:!!other&&panel.left<other.right&&panel.right>other.left&&panel.top<other.bottom&&panel.bottom>other.top,
      clipped:panel.left<0||panel.right>innerWidth||panel.top<0||panel.bottom>innerHeight,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.deepEqual(layout,{overlap:false,clipped:false,overflow:false},width+'x'+height+' '+id+' layout');
    await page.screenshot({path:path.join(out,'story-testing-'+width+'-'+id+'.png')});
   }
  }
  console.log('PASS desktop, portrait and landscape layouts; screenshots in '+out);
  await page.locator('#storyTestExit').click();
  await page.waitForFunction(()=>!fixture.story.testing);
  assert.equal(await page.locator('#storyTestPanel').isVisible(),false);
  assert.equal(await page.evaluate(()=>JSON.stringify(fixture.story.state.data)),original.data);
  assert.deepEqual(await page.evaluate(()=>fixture.adapter.player.position.toArray()),original.position);
  assert.equal(await page.evaluate(()=>fixture.adapter.player.yaw),original.yaw);
  assert.equal(await page.evaluate(()=>fixture.adapter.controlMode()),'thirdPerson');
  assert.equal(await page.evaluate(()=>fixture.inside),false);
  assert.equal(await storage(),initialStorage);
  assert.equal(await page.evaluate(()=>testAudio.filter(a=>!a.paused).length),0);
  assert.deepEqual(errors,[]);
  console.log('PASS exit restores formal state, exact pose, control mode, temple and save; no browser exceptions');
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
