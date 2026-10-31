import {LANTERNS} from './content.mjs';
export const SAVE_KEY='qinhuai.main-story.v1';
export const SAVE_SLOTS_KEY='qinhuai.main-story.slots.v1';
export const MAX_SAVE_SLOTS=3;
export const STAGES=['intro','observe','temple-enter','riddles','temple-exit','return','craft','hang-travel','hang-ready','ending','complete'];
export const RIDDLES=[
 {id:1,text:'半部春秋，半部论语。（打一字）',answers:['香']},
 {id:2,text:'一人一口酥。（打一字）',answers:['合','拿']},
 {id:3,text:'山上还有山。（打一字）',answers:['出']},
 {id:4,text:'需要一半，留下一半。（打一字）',answers:['雷']},
 {id:5,text:'一口咬掉牛尾巴。（打一字）',answers:['告']},
 {id:6,text:'一间小竹房，有门没有窗；若要它好看，里面点烛光。（打一物）',answers:['灯笼','灯']},
 {id:7,text:'白糖梅子真稀奇，落在水里滚三滚，捞起装在白碗里，吃到嘴里甜心里。（打一节令食品）',answers:['元宵','汤圆']},
 {id:8,text:'生在山中青又青，死在世上管万民；皇王面前它先到，满朝文武它有情。（打一文房四宝）',answers:['毛笔']},
 {id:9,text:'池里一只碗，大雨落不满；小雨纷纷下，珍珠滚滚转。（打一植物）',answers:['荷叶','荷花']},
 {id:10,text:'正月十五打牙祭。（打一成语）',answers:['大快朵颐']},
];
const blank=()=>({version:2,started:false,stage:'intro',observed:[],inside:false,craftSource:null,hung:false,solvedRiddles:[],riddleCorrectCursor:0,riddleWrongCursor:0,riddleIntroPlayed:false,riddleIntroVersion:0,riddleCompletePlayed:false});
const normalizeAnswer=value=>String(value||'').trim().replace(/[\s\u3000]/g,'').replace(/[，。！？、,.!?]/g,'').toLowerCase();
const slotId=index=>`slot-${index+1}`;
function readSlots(storage){
 let value;try{value=JSON.parse(storage?.getItem(SAVE_SLOTS_KEY)||'null');}catch{}
 if(value?.version===1&&Array.isArray(value.slots))return {version:1,activeId:value.activeId,slots:value.slots.filter(s=>/^slot-[1-3]$/.test(s.id)).slice(0,MAX_SAVE_SLOTS)};
 let legacy=null;try{legacy=JSON.parse(storage?.getItem(SAVE_KEY)||'null');}catch{}
 const slots=legacy?.version&&STAGES.includes(legacy.stage)?[{id:slotId(0),name:'旧存档',updatedAt:0,data:legacy}]:[];
 return {version:1,activeId:slots[0]?.id||slotId(0),slots};
}
export function listSaveSlots(storage=globalThis.localStorage){return readSlots(storage).slots.map(slot=>({id:slot.id,name:slot.name||'旅程存档',updatedAt:slot.updatedAt||0,data:slot.data}));}
export function saveSlotSummary(slot){const data=slot.data||{},observed=Array.isArray(data.observed)?data.observed.length:0,solved=Array.isArray(data.solvedRiddles)?data.solvedRiddles.length:0;const title=({'intro':'初入灯坊','observe':`沿街赏灯 ${observed}/7`,'temple-enter':'前往夫子庙','riddles':`夫子庙猜灯谜 ${solved}/10`,'temple-exit':'离开夫子庙','return':'返回扎灯师傅处','craft':'继续制灯','hang-travel':'前往挂灯处','hang-ready':'准备挂灯','ending':'欣赏长街灯火','complete':'灯入长街 · 自由游玩'})[data.stage]||'尚未开始';return {title,progress:data.stage==='riddles'?`${solved}/10 道灯谜`:`${observed}/7 盏花灯`,date:slot.updatedAt?new Date(slot.updatedAt).toLocaleString('zh-CN',{hour12:false}):'尚无游玩记录',started:data.started===true};}
function normalizeData(s){
 if(![1,2].includes(s?.version)||!STAGES.includes(s.stage)||!Array.isArray(s.observed))throw Error('不兼容的剧情存档');
 const observed=[];for(const l of LANTERNS){if(s.observed.includes(l.id))observed.push(l.id);else break;}
 let stage=s.stage;if(stage==='intro')observed.length=0;if(STAGES.indexOf(stage)>=2&&observed.length!==7)stage='observe';if(stage==='observe'&&observed.length===7)stage='temple-enter';if(stage==='temple-exit')stage='riddles';
 const craftSource=['preview','workshop'].includes(s.craftSource)?s.craftSource:null;if(STAGES.indexOf(stage)>=6&&!craftSource)stage='craft';if(['ending','complete'].includes(stage)&&s.hung!==true)stage='hang-ready';
 const solved=[...(Array.isArray(s.solvedRiddles)?s.solvedRiddles:[])].filter(id=>RIDDLES.some(r=>r.id===id)).sort((a,b)=>a-b);
 const data={version:2,started:s.started===true,stage,observed,inside:s.inside===true,craftSource,hung:['ending','complete'].includes(stage)&&s.hung===true,solvedRiddles:[...new Set(solved)],riddleCorrectCursor:Number.isInteger(s.riddleCorrectCursor)?s.riddleCorrectCursor:0,riddleWrongCursor:Number.isInteger(s.riddleWrongCursor)?s.riddleWrongCursor:0,riddleIntroPlayed:s.riddleIntroPlayed===true,riddleIntroVersion:Number.isInteger(s.riddleIntroVersion)?s.riddleIntroVersion:0,riddleCompletePlayed:s.riddleCompletePlayed===true};
 if(s.pose&&['x','y','z','yaw'].every(k=>Number.isFinite(s.pose[k])))data.pose={x:s.pose.x,y:s.pose.y,z:s.pose.z,yaw:s.pose.yaw};if(stage==='riddles')data.inside=true;return data;
}
export class StoryState {
 constructor(storage){this.storage=storage;this.warning='';this.slots=readSlots(storage);this.slotId=this.slots.activeId||slotId(0);this.data=blank();this.load();}
 load(){try{const slot=this.slots.slots.find(item=>item.id===this.slotId);if(slot?.data)this.data=normalizeData(slot.data);}catch{this.warning='剧情存档无法读取，可重新开始；场景设置不受影响。';}}
 persist(){try{if(!this.storage)throw Error();const existing=this.slots.slots.find(item=>item.id===this.slotId);const entry={id:this.slotId,name:existing?.name||'旅程存档',updatedAt:Date.now(),data:this.data};this.slots.slots=[...this.slots.slots.filter(item=>item.id!==this.slotId),entry].sort((a,b)=>Number(a.id.slice(-1))-Number(b.id.slice(-1)));this.slots.activeId=this.slotId;this.storage.setItem(SAVE_SLOTS_KEY,JSON.stringify(this.slots));this.warning='';}catch{this.warning='无法保存剧情；本次仍可游玩，刷新可能丢失进度。';}}
 selectSlot(id){if(!/^slot-[1-3]$/.test(id))throw Error('存档位置无效');this.slots=readSlots(this.storage);this.slotId=id;this.data=blank();this.load();this.slots.activeId=id;try{this.storage?.setItem(SAVE_SLOTS_KEY,JSON.stringify(this.slots));}catch{}}
 beginNew(id){this.selectSlot(id);this.data=blank();this.persist();}
 get stage(){return this.data.stage;}
 get currentLantern(){return this.stage==='observe'?LANTERNS[this.data.observed.length]:null;}
 reset(){this.data=blank();this.data.started=true;this.persist();}
 advance(event,id){const d=this.data;let accepted=false;
  if(event==='INTRO_DONE'&&d.stage==='intro'){d.stage='observe';accepted=true;}
  if(event==='OBSERVATION_DONE'&&d.stage==='observe'&&this.currentLantern?.id===id){d.observed.push(id);if(d.observed.length===7)d.stage='temple-enter';accepted=true;}
  if(event==='RETURN_DONE'&&d.stage==='return'){d.stage='craft';accepted=true;}
  if(event==='CRAFT_DONE'&&d.stage==='craft'&&['preview','workshop'].includes(id)){d.craftSource=id;d.stage='hang-travel';accepted=true;}
  if(event==='ARRIVAL_DONE'&&d.stage==='hang-travel'){d.stage='hang-ready';accepted=true;}
  if(event==='HANG_DONE'&&d.stage==='hang-ready'&&id===true){d.hung=true;d.stage='ending';accepted=true;}
  if(event==='ENDING_DONE'&&d.stage==='ending'){d.stage='complete';accepted=true;}
  if(accepted)this.persist();return accepted;
 }
 answerRiddle(id,answer){if(this.stage!=='riddles'||!this.data.inside)return {accepted:false,correct:false,reason:'not-ready'};const r=RIDDLES.find(item=>item.id===id);if(!r)return {accepted:false,correct:false,reason:'unknown'};if(this.data.solvedRiddles.includes(id))return {accepted:false,correct:true,already:true};const correct=r.answers.some(expected=>normalizeAnswer(expected)===normalizeAnswer(answer));if(correct){this.data.solvedRiddles.push(id);this.data.solvedRiddles.sort((a,b)=>a-b);this.persist();return {accepted:true,correct:true,solved:this.data.solvedRiddles.length,complete:this.data.solvedRiddles.length>=5};}return {accepted:true,correct:false,solved:this.data.solvedRiddles.length,complete:false};}
 temple(inside){this.data.inside=!!inside;if(this.stage==='temple-enter'&&inside)this.data.stage='riddles';else if(this.stage==='riddles'&&!inside&&this.data.solvedRiddles.length>=5)this.data.stage='return';this.persist();}
 get currentRiddle(){return RIDDLES.find(r=>!this.data.solvedRiddles.includes(r.id))||null;}
 get riddleSolved(){return this.data.solvedRiddles.length;}
 get objective(){const l=this.currentLantern;return ({intro:'到 751 工坊拜访扎灯师傅',observe:l?'欣赏'+l.name:'继续赏灯','temple-enter':'进入夫子庙 · 参加猜灯谜','riddles':this.riddleSolved>=5?'猜灯谜已完成 · 可以离开夫子庙返回师傅':'猜对灯谜 '+this.riddleSolved+'/5 · 靠近灯笼按 E','temple-exit':'完成五道灯谜后离开夫子庙','return':'回到 751 工坊，与师傅交谈',craft:'与师傅交谈，继续体验第四幕','hang-travel':'到夫子庙门外的街边挂灯位','hang-ready':'按 E 挂上自己的荷花灯',ending:'欣赏长街灯火',complete:'灯入长街 · 自由赏灯'})[this.stage];}
 get act(){return this.stage==='intro'?'第一幕 · 初入灯坊':['observe','temple-enter','riddles','temple-exit','return'].includes(this.stage)?'第二幕 · 猜灯谜':this.stage==='craft'?'第三幕 · 制灯待接入':'第四幕 · 灯入长街';}
}
export function canObserve({distance,facing,visible,onShore,water,maxDistance}){return distance<=maxDistance&&facing>=.25&&visible&&(!water||onShore);}
export {normalizeAnswer};
