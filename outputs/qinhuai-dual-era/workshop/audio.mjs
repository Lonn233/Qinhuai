// Close, quiet material sounds synthesized locally; no downloads or audio service.
export const AUDIO_STORAGE_KEY='qinhuai-lotus-workshop-audio-v1';
export const STAGE_SOUNDS=Object.freeze({
 bamboo_prep:'bamboo',frame_assembly:'wood',frame_binding:'binding',
 lining_upper:'lining',lining_lower:'lining',paper_cutting:'cut',paper_dye:'water',leaf_dye:'water',paper_drying:'dry_ready',
 petal_pressing:'press',leaf_pressing:'press',petal_shaping:'shape',petal_assembly:'paste',
 calyx_assembly:'paste',flower_making:'paper',top_flower_assembly:'assemble',pod_making:'paper',pod_assembly:'assemble',
 lotus_leaf_assembly:'paper',hanging_assembly:'binding',light_installation:'switch',final_inspection:'complete'
});
const tone=(hz,end,duration,gain,offset=0)=>({kind:'tone',hz,end,duration,gain,offset});
const noise=(hz,duration,gain,offset=0,q=.65)=>({kind:'noise',hz,duration,gain,offset,q});
const knock=(offset=0,gain=1)=>[tone(310,240,.10,.20*gain,offset),tone(740,670,.055,.065*gain,offset),noise(1200,.035,.10*gain,offset)];
const paper=(offset=0,gain=1)=>[noise(2200,.18,.22*gain,offset),noise(3400,.11,.15*gain,offset+.12)];
const bell=(hz,offset=0,gain=1)=>[tone(hz,hz,.65,.12*gain,offset),tone(hz*2.76,hz*2.76,.24,.025*gain,offset)];
export const SOUND_RECIPES=Object.freeze({
 bamboo:[noise(1250,.28,.21,0,2.4),tone(370,275,.19,.035,.02),...knock(.24,.65)],
 wood:knock(),binding:[noise(1800,.16,.24,0,1.4),noise(2300,.18,.17,.14,1.1),...knock(.30,.22)],
 lining:[...paper(0,.85),noise(750,.29,.25,.12)],cut:[noise(4200,.055,.28),tone(2100,1300,.035,.035),noise(3600,.065,.23,.14),...paper(.19,.4)],
 water:[noise(650,.42,.25,0,.8),tone(590,210,.095,.15,.04),tone(780,300,.075,.10,.15),tone(440,165,.11,.12,.28),noise(1800,.17,.07,.31)],
 dry_ready:[...paper(0,.4),...bell(880,.08,.5)],press:[...knock(0,.8),noise(650,.32,.24,.05,1.7),noise(1850,.24,.13,.13),...knock(.37,.55)],
 shape:[...paper(0,.8),noise(1300,.28,.19,.10,2),tone(1150,1080,.06,.025,.30)],paste:[noise(620,.12,.25),...paper(.04,.48),tone(190,130,.075,.065,.16)],
 paper:paper(),assemble:[...paper(0,.5),...knock(.13,.45)],check:[...knock(0,.40),...knock(.12,.22)],
 switch:[noise(2700,.018,.14),tone(920,450,.035,.07)],light_on:[...knock(0,.2),...bell(660,.035,.65)],light_off:[...knock(0,.25),tone(440,390,.19,.045,.025)],
 complete:[...bell(523.25,0,.8),...bell(659.25,.18,.8),...bell(783.99,.36,.8),...bell(1046.5,.57,.55)],
 phase_done:[...bell(659.25,0,.35),...bell(783.99,.14,.35)],tool:knock(0,.25),ui:knock(0,.16),undo:paper(0,.32),
 blocked:[tone(220,200,.10,.08),noise(800,.04,.07)],footstep:[noise(320,.13,.28,0,.6),tone(95,55,.09,.12),noise(1500,.075,.045,.035)],enter:[...knock(0,.35),...knock(.12,.22)]
});
const noiseCache=new WeakMap();
function noiseBuffer(context){
 if(!noiseCache.has(context)){const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*1.6),context.sampleRate),data=buffer.getChannelData(0);let seed=74123;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1;}noiseCache.set(context,buffer);}return noiseCache.get(context);
}
// Also used with OfflineAudioContext to verify the actual rendered samples.
export function synthesize(context,output,name,{start=context.currentTime,variation=1,onEnded=()=>{}}={}){
 const recipe=SOUND_RECIPES[name];if(!recipe)return null;
 const bus=context.createGain(),nodes=[bus],sources=[];bus.connect(output);let remaining=recipe.length,disposed=false;
 const dispose=()=>{if(disposed)return;disposed=true;for(const s of sources){s.onended=null;try{s.stop();}catch{}}for(const n of nodes)n.disconnect();onEnded();};
 let end=start;
 for(const part of recipe){
  const at=start+part.offset,duration=part.duration;end=Math.max(end,at+duration+.015);
  const envelope=context.createGain();nodes.push(envelope);envelope.gain.setValueAtTime(0,at);envelope.gain.linearRampToValueAtTime(part.gain,at+Math.min(.012,duration*.18));envelope.gain.exponentialRampToValueAtTime(.0001,at+duration);envelope.gain.linearRampToValueAtTime(0,at+duration+.01);envelope.connect(bus);
  let source;
  if(part.kind==='tone'){source=context.createOscillator();source.type='sine';source.frequency.setValueAtTime(part.hz*variation,at);source.frequency.exponentialRampToValueAtTime((part.end||part.hz)*variation,at+duration);source.connect(envelope);}
  else{source=context.createBufferSource();source.buffer=noiseBuffer(context);const filter=context.createBiquadFilter();filter.type='bandpass';filter.frequency.value=part.hz*variation;filter.Q.value=part.q;nodes.push(filter);source.connect(filter);filter.connect(envelope);}
  sources.push(source);nodes.push(source);source.onended=()=>{if(--remaining===0)dispose();};source.start(at);source.stop(at+duration+.012);
 }
 return {end,dispose};
}
export function createWorkshopAudio({storage,contextFactory,onChange=()=>{}}={}){
 let enabled=true,volume=.45,context=null,master=null,epoch=0,available=true,paused=false,pending=0,lastSound=null,played=0,stepDistance=0;
 const voices=new Set(),lastPlayed=new Map();
 try{const saved=JSON.parse(storage?.getItem(AUDIO_STORAGE_KEY)||'null');if(saved&&typeof saved.enabled==='boolean'&&Number.isFinite(saved.volume)){enabled=saved.enabled;volume=Math.max(0,Math.min(1,saved.volume));}}catch{}
 const snapshot=()=>({enabled,volume,available,paused,state:context?.state||'idle',activeVoices:voices.size,pending,lastSound,played});
 const notify=()=>onChange(snapshot());
 function persist(){try{storage?.setItem(AUDIO_STORAGE_KEY,JSON.stringify({enabled,volume}));}catch{}notify();}
 function silence(){epoch++;stepDistance=0;for(const voice of voices)voice.dispose();voices.clear();}
 function ensure(){
  if(!available)return false;
  if(!context)try{
   context=contextFactory?contextFactory():new (globalThis.AudioContext||globalThis.webkitAudioContext)();
   master=context.createGain();master.gain.value=volume*.8;
   const lowCut=context.createBiquadFilter();lowCut.type='highpass';lowCut.frequency.value=55;
   const compressor=context.createDynamicsCompressor();compressor.threshold.value=-16;compressor.knee.value=15;compressor.ratio.value=5;compressor.attack.value=.003;compressor.release.value=.12;
   master.connect(lowCut);lowCut.connect(compressor);compressor.connect(context.destination);
  }catch{available=false;silence();notify();return false;}
  return true;
 }
 function schedule(name){
  if(!enabled||!volume||paused||context.state!=='running'||voices.size>=8)return false;
  const now=context.currentTime,limit=name==='blocked'?.55:name==='footstep'?.23:.055;
  if(now-(lastPlayed.get(name)??-Infinity)<limit)return false;
  lastPlayed.set(name,now);let voice;
  voice=synthesize(context,master,name,{start:now+.006,variation:['complete','phase_done','light_on','dry_ready'].includes(name)?1:.96+Math.random()*.08,onEnded:()=>voices.delete(voice)});
  if(!voice)return false;voices.add(voice);lastSound=name;played++;return true;
 }
 function play(event){
  const name=STAGE_SOUNDS[event]||event;if(!SOUND_RECIPES[name]||!enabled||!volume||paused)return false;
  if(!ensure())return false;
  if(context.state==='running')return schedule(name);
  // Never replay an old gesture after mute, tab switching, or a blocked resume.
  if(pending)return false;const token=epoch;pending++;
  try{Promise.resolve(context.resume()).then(()=>{if(token===epoch)schedule(name);},()=>{}).finally(()=>{pending--;notify();});}catch{pending--;}
  return false;
 }
 return {
  play,snapshot,
  setEnabled(value){enabled=!!value;if(!enabled)silence();persist();},
  setVolume(value){if(!Number.isFinite(value))return;volume=Math.max(0,Math.min(1,value));if(!volume)silence();if(master){master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(volume*.8,context.currentTime,.025);}persist();},
  pause(){paused=true;silence();notify();},resume(){paused=false;notify();},
  walk(distance){if(!enabled||!volume||paused||!context||context.state!=='running')return;stepDistance+=Math.max(0,distance);if(stepDistance>=.70){stepDistance%=.70;play('footstep');}},
  async dispose(){silence();if(context&&context.state!=='closed')await context.close();},
 };
}
