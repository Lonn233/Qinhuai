import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {StoryState,SAVE_KEY,SAVE_SLOTS_KEY,listSaveSlots,MAX_SAVE_SLOTS,canObserve,RIDDLES} from '../story/state.mjs';
import {INTRO,RIDDLE_OPENING,LANTERNS,RETURN,HANG,observation} from '../story/content.mjs';
import {createTempleVisit,TEMPLE_PORTAL} from '../import-temple-visit.mjs';
const gongming=LANTERNS.find(l=>l.id==='gongming');
assert.equal(gongming.name,'贡院题名灯');
assert.equal(gongming.dialogueId,'OBSERVE_gongming','renaming must preserve audio and save IDs');
assert.equal(gongming.text,'灯火映着功名二字，像把心中的盼望也照亮了。愿来赏灯的人，都能向自己的心愿更近一步。');
const script=fs.readFileSync(new URL('../docs/秦淮灯火_完整配音剧本.md',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const cues=[...INTRO,...LANTERNS.map(l=>observation(l.id)),...RETURN,...HANG];
assert.equal(cues.length,18);
const feedbackIds=['ACT2_RIDDLE_CORRECT_A','ACT2_RIDDLE_CORRECT_B','ACT2_RIDDLE_WRONG_A','ACT2_RIDDLE_WRONG_B'];
const activeAudioIds=[...cues.map(c=>c.id),...RIDDLE_OPENING.map(c=>c.id),...feedbackIds];
assert.equal(new Set(activeAudioIds).size,25);
assert.deepEqual([...script.matchAll(/^### (\S+)$/gm)].map(m=>m[1]),[...cues.slice(0,9).map(c=>c.id),...RIDDLE_OPENING.map(c=>c.id),...feedbackIds,...cues.slice(9).map(c=>c.id)]);
for(const cue of cues){const block=script.split(`### ${cue.id}\n\n`)[1]?.split(/\n(?:### |---)/)[0];assert.ok(block?.includes(`**${cue.speaker}${cue.speaker.includes('内心')?'（V.O.）':''}**`),`${cue.id}: role matches script`);assert.ok(block?.trimEnd().endsWith(`\n\n${cue.text}`),`${cue.id}: spoken text matches script`);}
assert.ok(script.includes('灯会街道 · 贡院题名灯前'));
assert.ok(script.includes('靠近并面向贡院题名灯，按 E'));
assert.deepEqual(RIDDLE_OPENING.map(line=>line.id),['ACT2_RIDDLE_001','ACT2_RIDDLE_002','ACT2_RIDDLE_003']);
const audioManifest=JSON.parse(fs.readFileSync(new URL('../story/assets.json',import.meta.url),'utf8'));
for(const id of [...RIDDLE_OPENING.map(line=>line.id),'ACT2_RIDDLE_CORRECT_A','ACT2_RIDDLE_CORRECT_B','ACT2_RIDDLE_WRONG_A','ACT2_RIDDLE_WRONG_B']){const cue=audioManifest.audio[id];assert.equal(cue.ready,true,`${id}: audio is playable`);assert.equal(cue.verified,false,`${id}: do not claim human listening verification`);for(const file of cue.files)assert.ok(fs.existsSync(new URL(`../story/assets/${file.replace('./story/assets/','')}`,import.meta.url)),`${id}: ${file} exists`);}
for(const id of activeAudioIds){
 const cue=audioManifest.audio[id];
 assert.equal(cue.ready,true,id+': audio is playable');
 assert.equal(cue.verified,false,id+': do not claim human listening verification');
 assert.equal(cue.files.length,1);
 assert.ok(cue.source);
 for(const file of cue.files){
  const url=new URL('../'+file,import.meta.url);
  assert.ok(fs.existsSync(url),id+': file exists');
  assert.equal(createHash('sha256').update(fs.readFileSync(url)).digest('hex'),cue.sha256,id+': source hash matches');
 }
}
assert.deepEqual(audioManifest.audio.ACT1_001.files,['./story/assets/audio/ACT1_001.wav']);
assert.deepEqual(audioManifest.audio.ACT1_002.files,['./story/assets/audio/ACT1_002.wav']);
const saved=new Map([['scene-lighting','keep']]);const storage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
const s=new StoryState(storage);s.reset();s.temple(true);s.temple(false);assert.equal(s.stage,'intro');
assert.equal(s.advance('OBSERVATION_DONE','lion'),false);s.advance('INTRO_DONE');
assert.equal(s.advance('OBSERVATION_DONE','gongming'),false);
for(const lamp of LANTERNS){const before=s.data.observed.length;assert.equal(s.currentLantern.id,lamp.id);assert.equal(s.data.observed.length,before,'presenting a target does not unlock it');assert.ok(s.advance('OBSERVATION_DONE',lamp.id));assert.equal(s.advance('OBSERVATION_DONE',lamp.id),false);}
assert.equal(s.stage,'temple-enter');s.temple(false);assert.equal(s.stage,'temple-enter');s.temple(true);assert.equal(s.stage,'riddles');assert.equal(s.answerRiddle(1,'wrong').correct,false,'wrong answers remain retryable');assert.equal(s.answerRiddle(1,'香').correct,true);assert.equal(s.answerRiddle(1,'香').already,true,'solved riddles cannot count twice');for(const r of [2,3,4,5])assert.equal(s.answerRiddle(r,RIDDLES[r-1].answers[0]).correct,true);assert.equal(s.riddleSolved,5);assert.equal(s.stage,'riddles','five solved riddles do not force an exit');assert.equal(s.answerRiddle(6,'灯').correct,true,'extra riddles remain available');
s.data.pose={x:1,y:11.86,z:-27,yaw:.5};s.persist();const restored=new StoryState(storage);assert.equal(restored.stage,'riddles');assert.equal(restored.data.inside,true);assert.deepEqual(restored.data.pose,s.data.pose);
restored.temple(false);assert.equal(restored.stage,'return');restored.advance('RETURN_DONE');assert.equal(restored.advance('CRAFT_DONE','invalid'),false);restored.advance('CRAFT_DONE','preview');restored.advance('ARRIVAL_DONE');assert.equal(restored.advance('HANG_DONE',false),false);assert.equal(restored.data.hung,false);restored.advance('HANG_DONE',true);assert.equal(new StoryState(storage).data.hung,true);restored.advance('ENDING_DONE');assert.equal(restored.stage,'complete');assert.equal(saved.get('scene-lighting'),'keep');
assert.equal(canObserve({distance:4,facing:1,visible:true,onShore:true,water:true,maxDistance:5.3}),true);
for(const patch of [{distance:8},{facing:-1},{visible:false},{onShore:false}])assert.equal(canObserve({distance:4,facing:1,visible:true,onShore:true,water:true,maxDistance:5.3,...patch}),false);
saved.set(SAVE_SLOTS_KEY,JSON.stringify({version:1,activeId:'slot-1',slots:[{id:'slot-1',data:{version:99}}]}));assert.ok(new StoryState(storage).warning);const noStorage=new StoryState({getItem(){throw Error();},setItem(){throw Error();}});noStorage.reset();assert.ok(noStorage.warning);
const legacyRaw=JSON.stringify({version:2,started:true,stage:'observe',observed:[]});const legacyStorage=new Map([[SAVE_KEY,legacyRaw],['scene-settings','untouched']]);const legacyState=new StoryState({getItem:k=>legacyStorage.get(k),setItem:(k,v)=>legacyStorage.set(k,v)});assert.equal(legacyState.stage,'observe');legacyState.beginNew('slot-2');legacyState.beginNew('slot-3');assert.equal(listSaveSlots({getItem:k=>legacyStorage.get(k)}).length,3);assert.equal(MAX_SAVE_SLOTS,3);assert.equal(legacyStorage.get(SAVE_KEY),legacyRaw,'legacy save is retained as migration source');assert.equal(legacyStorage.get('scene-settings'),'untouched','scene settings remain separate');
let loads=0,landed=null;const portal=createTempleVisit({load:async()=>loads++,teleport:v=>landed=v,stop(){}});await portal.restore(true);assert.equal(loads,1);assert.equal(landed,true);assert.equal(portal.snapshot().inside,true);portal.update({ ...TEMPLE_PORTAL.inside,y:TEMPLE_PORTAL.ground},true);assert.ok(await portal.activate());assert.equal(portal.snapshot().inside,false);
console.log('PASS story: ordered lamp progression, ten riddles, five-answer threshold, independent saves, temple restore, shore/facing/LOS');
