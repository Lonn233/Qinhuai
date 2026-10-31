const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const {build} = require('esbuild');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))); }

async function main() {
 const mocks = {
  'world.js': 'export const createStoryWorld = a => a.testWorld;',
  'navigation-client.js': 'export const createWorkerNavigator = () => ({path:[],revision:0,remaining:0,status:"idle",reset(){},tick(){},request(){},follow(){}});',
  'book.js': 'export const createLanternBook = () => document.createElement("div");',
  'import-festival-lanterns.js': 'export const pointInWater = () => false;',
 };
 const bundle = await build({
  stdin: {resolveDir: path.resolve(__dirname, '..'), contents: `
   import * as THREE from 'three';
   import {mountStory} from './story/controller.js';
   import {LANTERNS} from './story/content.mjs';
   import assets from './story/assets.json';
   let control='thirdPerson',switches=0;
   const lamp={id:'lion',lamp:LANTERNS[0],water:false,instance:0,
    position:new THREE.Vector3(0,.5,-1),
    bounds:new THREE.Box3(new THREE.Vector3(-.2,0,-1.2),new THREE.Vector3(.2,1,-.8))};
   const world={assets:structuredClone(assets),finishedReady:false,riddleTargets:[],workshop:{x:10,y:0,z:10},hang:{x:20,y:0,z:20},
    async prepare(){},async loadFinished(){},setHung(){},clearObservations(){},
    async animateHang(){return true;},
    setVisible(){},placeMaster(){},setRoute(){},update(){},drawMap(){},
    targets:()=>[lamp],observationPoint:()=>({x:0,y:0,z:0})};
   const adapter={testWorld:world,camera:new THREE.PerspectiveCamera(60,1,.01,100),
    stop(){},pointer:{isLocked:false,unlock(){this.isLocked=false;}},orbit:{},
    requestLookLock(){this.pointer.isLocked=true;},
    modelVisible:()=>true,controlMode:()=>control,switchControl:value=>{switches++;control=value;},
    async ensureScene(){},async setTimeOfDay(){return true;},
    temple:{snapshot:()=>({inside:false,busy:false,near:false}),async restore(){}},
    findSpawn:(x,z,y)=>({x,z,ground:y}),lineClear:()=>true,
    player:{position:new THREE.Vector3(),yaw:0,
     spawn(p){this.position.set(p.x,p.ground,p.z);},updateCamera(){}}};
   window.testAudio=[];
   window.Audio=class{
    constructor(file){this.file=file;testAudio.push(this);}
    play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}load(){}removeAttribute(){}
   };
   const story=mountStory(adapter);
   window.fixture={story,world,lamp,adapter,assets,get switches(){return switches;},now:0,approach(id){
    const type=LANTERNS.find(l=>l.id===id);
    Object.assign(lamp,{id,lamp:type,water:type.water,dock:type.water?{}:null});
    adapter.player.position.set(0,0,0);
    adapter.camera.position.set(0,.53,0);adapter.camera.lookAt(lamp.position);
    story.update(this.now+=200);
   }};
   window.addEventListener('keydown',e=>{
    if(e.code==='KeyE'&&!e.repeat){e.preventDefault();void story.activate();}
   });
   story.ready();
  `},
  bundle:true,write:false,format:'iife',platform:'browser',
  plugins:[{name:'test-world',setup(b){
   b.onLoad({filter:/[\\/](world|navigation-client|book|import-festival-lanterns)\.js$/},args=>({contents:mocks[path.basename(args.path)]}));
  }}],
 });
 const browser = await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
  const page = await browser.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('http://story.test/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
  await page.goto('http://story.test/');
  await page.addScriptTag({content:bundle.outputFiles[0].text});
  await page.locator('#storyStart').click();
  await page.waitForFunction(()=>fixture.story.mode==='play');
  const snapshot=()=>page.evaluate(()=>fixture.story.snapshot);
  const press=()=>page.keyboard.press('KeyE');
  const expectVoice=async id=>{
   assert.equal((await snapshot()).dialogueId,id);
   assert.equal(await page.evaluate(()=>testAudio.at(-1)?.file),await page.evaluate(id=>fixture.assets.audio[id].files[0],id),id+': current recording is dispatched');
   assert.equal(await page.evaluate(()=>testAudio.at(-1)?.paused),false,id+': voice is playing');
  };
  const pose=()=>page.evaluate(()=>({position:fixture.adapter.camera.position.toArray(),rotation:fixture.adapter.camera.quaternion.toArray(),mode:fixture.adapter.controlMode(),switches:fixture.switches}));
  await page.evaluate(()=>{fixture.adapter.player.position.set(10,0,10.5);fixture.story.update(fixture.now+=200);});
  await press();
  assert.equal((await snapshot()).dialogueId,'ACT1_001');
  await expectVoice('ACT1_001');
  assert.equal(await page.evaluate(()=>fixture.story.movementLocked),false);
  await press();
  assert.equal((await snapshot()).dialogueId,'ACT1_001','E must not advance NPC dialogue');
  await page.locator('#storyDialogueNext').click();
  assert.equal((await snapshot()).dialogueId,'ACT1_002');
  await expectVoice('ACT1_002');
  await page.locator('#storyDialogueNext').click();
  assert.equal((await snapshot()).stage,'observe');
  console.log('PASS NPC dialogue retains click-to-continue and free movement');

  const ids=['lion','gongming','tengma','mountain','chrysanthemum','lotus-main','lotus-one'];
  for(const [index,id] of ids.entries()){
   await page.evaluate(id=>fixture.approach(id),id);
   await page.evaluate(index=>{fixture.adapter.switchControl(index%2?'firstPerson':'thirdPerson');fixture.adapter.pointer.isLocked=index%2===1;},index);
   const before=await pose();
   await press();
   await expectVoice('OBSERVE_'+id);
   assert.deepEqual(await pose(),before,'E must preserve camera pose and control mode without switchControl');
   assert.equal(await page.evaluate(()=>fixture.adapter.pointer.isLocked),true,'dialogue must retain mouse lock');
   assert.equal(await page.evaluate(()=>document.documentElement.hasAttribute('data-story-observing')),true);
   assert.equal((await snapshot()).observing,id);
   assert.equal((await snapshot()).observed.length,index);
   assert.equal(await page.locator('#storyDialogueNext').isVisible(),false);
   assert.match(await page.locator('#storyObservationHint').innerText(),/按E退出赏灯/);
   assert.equal(await page.evaluate(()=>fixture.story.movementLocked),true);
   assert.equal(await page.evaluate(()=>fixture.story.lookLocked),false);
   await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyE',repeat:true,bubbles:true})));
   assert.equal((await snapshot()).observed.length,index,'held E must not advance');
   await press();
   assert.deepEqual(await pose(),before,'E exit must not change control mode or camera');
   assert.equal(await page.evaluate(()=>fixture.adapter.pointer.isLocked),index%2===1,'FP must retain mouse lock; TP must restore its previous lock state');
   assert.equal(await page.evaluate(()=>document.documentElement.hasAttribute('data-story-observing')),false);
   assert.equal((await snapshot()).observed.length,index+1);
   assert.equal((await snapshot()).observing,null,'second E must complete and exit observation');
   assert.equal(await page.locator('#storyDialogue').isVisible(),false);
   assert.equal(await page.locator('#storyObservationHint').isVisible(),false);
   assert.equal(await page.evaluate(()=>fixture.story.movementLocked),false);
  }
  assert.equal((await snapshot()).stage,'temple-enter');
  await page.evaluate(()=>fixture.approach('lion'));
  await press();await press();
  assert.equal((await snapshot()).observed.length,7,'revisiting must not duplicate unlocks');
  console.log('PASS seven lamps enter with first E and complete/exit with second E; held E is ignored');

  await page.evaluate(()=>{
   fixture.story.state.reset();fixture.story.state.advance('INTRO_DONE');
   fixture.world.assets.audio.OBSERVE_lion={verified:true,files:['part-1.mp3','part-2.mp3']};
   fixture.approach('lion');
  });
  await press();
  assert.equal((await snapshot()).observed.length,0,'entering must not unlock');
  await page.evaluate(()=>testAudio.at(-1).onended());
  assert.equal((await snapshot()).observed.length,0,'first clip must not unlock');
  await page.evaluate(()=>testAudio.at(-1).onerror());
  assert.equal(await page.locator('#storyDialogueRetry').isVisible(),true);
  assert.equal((await snapshot()).observed.length,0,'failed audio must not unlock');
  await page.locator('#storyDialogueRetry').click();
  await page.evaluate(()=>testAudio.at(-1).onended());
  await page.evaluate(()=>testAudio.at(-1).onended());
  await page.waitForFunction(()=>!document.getElementById('storyVoiceStatus').textContent);
  assert.equal((await snapshot()).observed.length,0,'finished audio must wait for second E');
  assert.equal((await snapshot()).observing,'lion');
  await press();
  assert.equal((await snapshot()).observing,null);
  assert.deepEqual((await snapshot()).observed,['lion']);
  await page.evaluate(()=>fixture.approach('lion'));
  await press();
  const activeAudio=await page.evaluate(()=>testAudio.length);
  await press();
  assert.equal((await snapshot()).observing,null,'second E must stop active audio and exit');
  assert.equal((await snapshot()).dialogueId,null);
  await page.evaluate(()=>testAudio.at(-1).onended());
  assert.equal(await page.evaluate(()=>testAudio.length),activeAudio,'cancelled audio must not start another clip');
  assert.deepEqual((await snapshot()).observed,['lion'],'revisit must not duplicate unlock');
  console.log('PASS audio retry, playback completion, and immediate E exit without duplicate unlocks');
  await page.evaluate(()=>{
   fixture.world.assets.audio.OBSERVE_lion=structuredClone(fixture.assets.audio.OBSERVE_lion);
   for(const id of ['gongming','tengma','mountain','chrysanthemum','lotus-main','lotus-one'])fixture.story.state.advance('OBSERVATION_DONE',id);
   fixture.story.onTempleChange({inside:true,busy:false});
  });
  assert.equal((await snapshot()).stage,'riddles');
  for(const id of ['ACT2_RIDDLE_001','ACT2_RIDDLE_002','ACT2_RIDDLE_003']){
   await expectVoice(id);
   await page.locator('#storyDialogueNext').click();
  }
  await page.evaluate(()=>{
   ['香','合','出','雷','告'].forEach((answer,i)=>fixture.story.state.answerRiddle(i+1,answer));
   fixture.story.onTempleChange({inside:false,busy:false});
   fixture.adapter.player.position.set(10,0,10.5);fixture.story.update(fixture.now+=200);
  });
  assert.equal((await snapshot()).stage,'return');
  await press();
  for(const id of ['ACT2_002','ACT2_003','ACT2_004']){
   await expectVoice(id);
   await page.locator('#storyDialogueNext').click();
  }
  assert.equal((await snapshot()).stage,'craft');
  await page.getByRole('button',{name:'跳过制作，体验第四幕',exact:true}).click();
  assert.equal((await snapshot()).stage,'hang-travel');
  for(const id of ['ACT4_HANG_001','ACT4_HANG_002']){
   await expectVoice(id);
   await page.locator('#storyDialogueNext').click();
  }
  await page.evaluate(()=>{fixture.adapter.player.position.set(20,0,20);fixture.story.update(fixture.now+=200);});
  await expectVoice('ACT4_HANG_003');
  await page.locator('#storyDialogueNext').click();
  assert.equal((await snapshot()).stage,'hang-ready');
  const beforeMissingModel=await page.evaluate(()=>testAudio.length);
  await press();
  assert.equal((await snapshot()).stage,'hang-ready','missing model must not fake a successful hanging');
  assert.equal(await page.evaluate(()=>testAudio.length),beforeMissingModel,'ending voices must wait for a real finished model');
  await page.getByRole('button',{name:'返回街景',exact:true}).click();
  await page.evaluate(()=>{fixture.world.finishedReady=true;fixture.story.update(fixture.now+=200);});
  await press();
  assert.equal((await snapshot()).stage,'ending');
  for(const id of ['ACT4_HANG_004','ACT4_HANG_005','ACT4_HANG_006']){
   await expectVoice(id);
   await page.locator('#storyDialogueNext').click();
  }
  assert.equal((await snapshot()).stage,'complete');
  console.log('PASS current riddle opening, return visit, all six Act 4 voice triggers, and missing-model guard');
  assert.deepEqual(errors,[]);
 } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
