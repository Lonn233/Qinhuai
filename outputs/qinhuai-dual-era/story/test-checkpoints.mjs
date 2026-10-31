import {LANTERNS,INTRO,RIDDLE_OPENING,RETURN,HANG} from './content.mjs';
import {RIDDLES} from './state.mjs';

const speech=(group,stage,lines)=>lines.map(line=>({id:line.id,label:line.speaker+' · '+line.text.slice(0,19)+'…',group,stage,kind:'dialogue',line}));
export const TEST_CHECKPOINTS=[
 ...speech('第一幕 · 初入灯坊','intro',INTRO),
 ...LANTERNS.map((lamp,index)=>({id:'observe-'+lamp.id,label:'赏灯 '+(index+1)+' · '+lamp.name,group:'第二幕 · 赏灯',stage:'observe',kind:'observe',lamp:lamp.id,index})),
 {id:'temple-enter',label:'前往夫子庙入口',group:'第二幕 · 猜灯谜',stage:'temple-enter',kind:'travel'},
 ...speech('第二幕 · 灯谜开场','riddles',RIDDLE_OPENING),
 ...RIDDLES.map((r,index)=>({id:'riddle-'+r.id,label:'灯谜 '+String(r.id).padStart(2,'0')+' · '+r.text.slice(0,18),group:'第二幕 · 十道灯谜',stage:'riddles',kind:'riddle',riddle:r.id,index})),
 {id:'temple-exit',label:'离开夫子庙 · 十题已完成',group:'第二幕 · 归来',stage:'riddles',kind:'travel'},
 ...speech('第二幕 · 重访师傅','return',RETURN),
 {id:'craft',label:'制作荷花灯 · 场景待接入',group:'第三幕 · 制灯',stage:'craft',kind:'craft'},
 ...speech('第四幕 · 制灯归来','hang-travel',HANG.slice(0,2)),
 {id:'hang-travel',label:'前往街边挂灯位',group:'第四幕 · 挂灯',stage:'hang-travel',kind:'travel'},
 ...speech('第四幕 · 挂灯','hang-travel',HANG.slice(2,3)),
 {id:'hang-ready',label:'挂上荷花灯',group:'第四幕 · 挂灯',stage:'hang-ready',kind:'hang'},
 ...speech('第四幕 · 结尾','ending',HANG.slice(3)),
 {id:'complete',label:'剧情完成 · 自由赏灯',group:'尾声',stage:'complete',kind:'complete'},
];

export function checkpointData(point){
 const late=['hang-travel','hang-ready','ending','complete'].includes(point.stage);
 const afterRiddles=['return','craft'].includes(point.stage)||late;
 const solved=afterRiddles||point.id==='temple-exit'?RIDDLES.length:point.kind==='riddle'?point.index:0;
 return {version:2,started:true,stage:point.stage,
  observed:point.stage==='intro'?[]:LANTERNS.slice(0,point.stage==='observe'?point.index:LANTERNS.length).map(l=>l.id),
  inside:point.stage==='riddles',craftSource:late?'preview':null,hung:['ending','complete'].includes(point.stage),
  solvedRiddles:RIDDLES.slice(0,solved).map(r=>r.id),riddleCorrectCursor:solved,riddleWrongCursor:0,
  riddleIntroPlayed:point.stage==='riddles'||afterRiddles,riddleIntroVersion:point.stage==='riddles'||afterRiddles?1:0,
  riddleCompletePlayed:solved>=5};
}

export function checkpointIndex(state,dialogueId){
 const voice=TEST_CHECKPOINTS.findIndex(p=>p.id===dialogueId);if(voice>=0)return voice;
 const id=state.currentLantern?'observe-'+state.currentLantern.id:state.stage==='riddles'?(state.currentRiddle?'riddle-'+state.currentRiddle.id:'temple-exit'):state.stage;
 const exact=TEST_CHECKPOINTS.findIndex(p=>p.id===id);
 return exact>=0?exact:Math.max(0,TEST_CHECKPOINTS.findIndex(p=>p.stage===state.stage));
}

export function memoryStorage(){
 const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
}

