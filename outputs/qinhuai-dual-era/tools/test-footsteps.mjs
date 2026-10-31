import assert from 'node:assert/strict';
import {createFootsteps} from '../import-footsteps.mjs';

const flush = () => new Promise(resolve => setImmediate(resolve));
function fixture() {
  const events = new EventTarget(), visibility = new EventTarget();
  visibility.hidden = false;
  let creates = 0, plays = 0, reject = false, resolvePlay;
  const audio = {paused:true, readyState:4, currentTime:1, play() {
    plays++;
    if (reject) return Promise.reject(Error('autoplay'));
    this.paused = false;
    return new Promise(resolve => { resolvePlay = resolve; });
  }, pause() {this.paused = true;}, removeAttribute() {}, load() {}};
  const footsteps = createFootsteps({events, visibility, createAudio:() => {creates++;return audio;}});
  return {events, visibility, audio, footsteps, get creates() {return creates;}, get plays() {return plays;},
    fail(value) {reject = value;}, finish() {resolvePlay?.();}};
}
const f = fixture();
f.footsteps.setMoving(false); assert.equal(f.creates,0,'idle does not load audio');
f.footsteps.setMoving(true); await flush();
for(let i=0;i<60;i++) f.footsteps.setMoving(true);
assert.equal(f.creates,1); assert.equal(f.plays,1,'single loop, no overlapping play requests');
assert.equal(f.audio.loop,true);assert.equal(f.audio.volume,.38);
f.finish();await flush();f.footsteps.setMoving(true,{running:true});assert.equal(f.audio.playbackRate,1.35);
f.footsteps.setMoving(false);assert.equal(f.audio.paused,true);assert.equal(f.audio.currentTime,0);
f.footsteps.setMoving(true);await flush();f.events.dispatchEvent(new Event('blur'));
f.finish();await flush();assert.equal(f.audio.paused,true,'pending playback cannot survive blur');
f.footsteps.setMoving(true);await flush();assert.equal(f.plays,2,'blur blocks further frames');
f.events.dispatchEvent(new Event('focus'));f.footsteps.setMoving(true);await flush();f.finish();await flush();
f.visibility.hidden=true;f.visibility.dispatchEvent(new Event('visibilitychange'));assert.equal(f.audio.paused,true);
f.visibility.hidden=false;f.footsteps.setMoving(false);assert.equal(f.audio.paused,true);
f.footsteps.dispose();f.footsteps.dispose();f.footsteps.setMoving(true);assert.equal(f.audio.paused,true);
const blocked=fixture();blocked.fail(true);blocked.footsteps.setMoving(true);await flush();
for(let i=0;i<60;i++)blocked.footsteps.setMoving(true);
assert.equal(blocked.plays,1,'autoplay failure does not retry every frame');
blocked.fail(false);blocked.events.dispatchEvent(new Event('keydown'));await flush();
assert.equal(blocked.plays,2);blocked.finish();await flush();assert.equal(blocked.audio.paused,false);
blocked.footsteps.dispose();
console.log('PASS footsteps: lazy single loop, run speed, stop/reset, focus/visibility, async cancellation, gesture retry and disposal');
