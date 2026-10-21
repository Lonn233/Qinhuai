import { CONFIG, STAGES, PAPER_IDS, LEAF_IDS } from './config.mjs';

const statuses=['raw','wet','dry','pressed','formed','installed'];
const LINING_IDS=['lining_lower','lining_upper'];
const clone=value=>JSON.parse(JSON.stringify(value));
const records=ids=>ids.map(id=>({id,status:'raw',readyAt:0}));
const emptyLining=()=>Object.fromEntries(LINING_IDS.map(id=>[id,{glued:[],installed:[]}]));

export function createState(){
  return {version:3,processRevision:3,dyeWaste:0,stage:0,counts:Object.fromEntries(STAGES.map(s=>[s.id,0])),papers:records(PAPER_IDS),leaves:records(LEAF_IDS),lining:emptyLining(),complete:false,lit:false,actions:0,frameItems:{placedRings:[],usedStrips:[],madeRings:[],collectedStrips:[16,17,18],shortStrips:[],shortBinding:0}};
}
export function cloneState(state){return clone(state);}
export function currentStage(state){return STAGES[Math.min(Math.max(0,state.stage||0),STAGES.length-1)];}
export function craftedRings(state){return state.frameItems?.madeRings??[];}
function completeStage(state){
  state.stage++;
  if(state.stage>=STAGES.length){state.stage=STAGES.length-1;state.complete=true;state.lit=true;}
}
function consume(items,from,to,count,now=0){
  const selected=items.filter(item=>item.status===from).slice(0,count);
  if(selected.length!==count)return false;
  selected.forEach(item=>{item.status=to;if(to==='wet')item.readyAt=now+CONFIG.dryDuration;});
  return true;
}
export function updateDrying(state,now=Date.now()){
  let changed=false;
  for(const paper of state.papers)if(paper.status==='wet'&&now>=paper.readyAt){paper.status='dry';changed=true;}
  if(!state.complete&&currentStage(state).id==='paper_drying'&&state.papers.every(p=>p.status==='dry')){state.counts.paper_drying=1;completeStage(state);changed=true;}
  return changed;
}
export function applyAction(state,tool,now=Date.now(),evidence=null){
  updateDrying(state,now);
  if(state.complete)return {ok:false,message:'这盏灯已完成。'};
  const stage=currentStage(state),counts=state.counts;
  if(stage.id==='paper_drying')return {ok:false,message:'花瓣纸仍在阴干，请等待完全干透。'};
  if(tool!==stage.tool)return {ok:false,message:'请使用当前工序指定的工具。'};
  if(LINING_IDS.includes(stage.id)){
    const panel=evidence?.panel;
    if(!Number.isInteger(panel)||panel<0||panel>=stage.total||!state.lining[stage.id].glued.includes(panel))return {ok:false,message:'请先在该位置涂抹浆糊。'};
    if(state.lining[stage.id].installed.includes(panel))return {ok:false,message:'这片材料已经贴好。'};
    state.lining[stage.id].installed.push(panel);
  }
  if(stage.id==='bamboo_prep'){
    const ringType=evidence?.ringType??counts.bamboo_prep;
    if(![0,1].includes(ringType)||state.frameItems.madeRings.includes(ringType))return {ok:false,message:'请分别完成一只大圈和一只小圈。'};
    state.frameItems.madeRings.push(ringType);
  }
  if(stage.id==='frame_assembly'&&!state.frameItems.placedRings.includes(0))return {ok:false,message:'先把大圈固定在弧形长条靠上的位置。'};
  if(stage.id==='frame_short_binding'&&!state.frameItems.placedRings.includes(1))return {ok:false,message:'先把小圈固定在三根弧形长条顶端。'};
  if(stage.id==='paper_dye'&&!consume(state.papers,'raw','wet',CONFIG.petals.perLayer,now))return {ok:false,message:'没有可染的花瓣纸。'};
  if(stage.id==='petal_pressing'&&!consume(state.papers,'dry','pressed',CONFIG.petals.perLayer))return {ok:false,message:'花瓣纸必须完全阴干后才能压模。'};
  if(stage.id==='petal_shaping'&&!consume(state.papers,'pressed','formed',CONFIG.petals.perLayer))return {ok:false,message:'请先完成花瓣纸压模。'};
  if(stage.id==='petal_assembly'&&!consume(state.papers,'formed','installed',1))return {ok:false,message:'请先折扎好下一片粉色花瓣。'};
  if(stage.id==='calyx_assembly'&&!consume(state.leaves,'raw','installed',1))return {ok:false,message:'成品绿色叶片不足。'};
  counts[stage.id]++;
  state.actions++;
  if(counts[stage.id]>=stage.total)completeStage(state);
  return {ok:true,stage:stage.id,message:counts[stage.id]>=stage.total?'本工序完成。':'已完成 '+counts[stage.id]+' / '+stage.total};
}
export function applyGlue(state,id,panel){
  if(!LINING_IDS.includes(id)||currentStage(state).id!==id||!Number.isInteger(panel)||panel<0||panel>=currentStage(state).total)return false;
  const panels=state.lining[id];if(panels.installed.includes(panel)||panels.glued.includes(panel))return false;panels.glued.push(panel);state.actions++;return true;
}
export function applyRingPlacement(state,index){
  const stage=currentStage(state);
  if(!state.frameItems||!craftedRings(state).includes(index)||state.frameItems.placedRings.includes(index))return false;
  if(!(stage.id==='frame_assembly'&&index===0||stage.id==='frame_short_binding'&&index===1))return false;
  state.frameItems.placedRings.push(index);state.actions++;return true;
}
export function collectStrip(state,index){
  if(!Number.isInteger(index)||index<16||index>18||state.frameItems.collectedStrips.includes(index))return false;
  state.frameItems.collectedStrips.push(index);state.actions++;return true;
}
export function finishPreparation(state){return currentStage(state).id==='bamboo_prep'&&state.counts.bamboo_prep===2;}
export function inventory(state,kind='papers'){return Object.fromEntries(statuses.map(status=>[status,state[kind].filter(item=>item.status===status).length]));}
export function dyedPaperStock(state){return {petal:state.papers.filter(p=>['wet','dry','pressed','formed'].includes(p.status)).length,leaf:0};}
export function backpackInventory(state){return {bigRing:craftedRings(state).includes(0)?1:0,smallRing:craftedRings(state).includes(1)?1:0,arcStrip:Math.max(0,3-state.counts.frame_assembly),flowerHead:Math.max(0,CONFIG.flowerCount-state.counts.top_flower_assembly),candle:Math.max(0,1-state.counts.candle_installation)};}
export function progress(state){return Math.round(STAGES.reduce((sum,stage)=>sum+state.counts[stage.id]/stage.total,0)/STAGES.length*100);}
export function validateState(state){
  if(!state||state.version!==3||!Number.isInteger(state.stage)||state.stage<0||state.stage>=STAGES.length||!state.counts||!Array.isArray(state.papers)||state.papers.length!==PAPER_IDS.length||!Array.isArray(state.leaves)||state.leaves.length!==LEAF_IDS.length)return false;
  if(!STAGES.every(stage=>Number.isInteger(state.counts[stage.id])&&state.counts[stage.id]>=0&&state.counts[stage.id]<=stage.total))return false;
  if(!state.papers.every((p,i)=>p&&p.id===PAPER_IDS[i]&&statuses.includes(p.status)))return false;
  if(!state.leaves.every((p,i)=>p&&p.id===LEAF_IDS[i]&&statuses.includes(p.status)))return false;
  return true;
}
export function migrateLegacyState(){return null;}
export function restoreState(saved){return validateState(saved)?cloneState(saved):createState();}
export function makeFinishedState(){const workflow=new Workflow();while(!workflow.state.complete)workflow.skipStage(Date.now()+CONFIG.dryDuration);workflow.state.lit=false;return workflow.state;}
export class Workflow {
  constructor(state=createState()){this.state=validateState(state)?cloneState(state):createState();this.history=[];this.future=[];}
  act(tool,now=Date.now(),evidence=null){const before=cloneState(this.state),result=applyAction(this.state,tool,now,evidence);if(result.ok){this.history.push(before);this.future=[];}return result;}
  glue(id,panel){const before=cloneState(this.state);if(!applyGlue(this.state,id,panel))return false;this.history.push(before);this.future=[];return true;}
  installRing(index){const before=cloneState(this.state);if(!applyRingPlacement(this.state,index))return false;this.history.push(before);this.future=[];return true;}
  collectStrip(index){const before=cloneState(this.state);if(!collectStrip(this.state,index))return false;this.history.push(before);this.future=[];return true;}
  finishPreparation(){return finishPreparation(this.state);}
  discardDye(){return false;}
  skipStage(now=Date.now()){
    if(this.state.complete)return {ok:false,message:'这盏灯已经完成。'};
    const before=cloneState(this.state),stage=currentStage(this.state);
    if(stage.id==='paper_drying'){this.state.papers.forEach(p=>{if(p.status==='wet'){p.status='dry';p.readyAt=now;}});updateDrying(this.state,now);}
    else {
      if(stage.id==='frame_assembly')applyRingPlacement(this.state,0);
      if(stage.id==='frame_short_binding')applyRingPlacement(this.state,1);
      let guard=0;
      while(!this.state.complete&&currentStage(this.state).id===stage.id&&guard++<=stage.total){
        let evidence=null;
        if(LINING_IDS.includes(stage.id)){const panel=Array.from({length:stage.total},(_,i)=>i).find(i=>!this.state.lining[stage.id].installed.includes(i));applyGlue(this.state,stage.id,panel);evidence={panel};}
        if(stage.id==='bamboo_prep')evidence={ringType:this.state.counts.bamboo_prep};
        const result=applyAction(this.state,stage.tool,now,evidence);if(!result.ok){this.state=before;return result;}
      }
    }
    this.history.push(before);this.future=[];return {ok:true,stage:stage.id,message:'已跳过：'+stage.name};
  }
  previousStage(){if(this.state.stage===0)return {ok:false,message:'已经是第一道工序。'};const before=cloneState(this.state),target=this.state.complete?STAGES.length-1:this.state.stage-1,replay=new Workflow();while(replay.state.stage<target&&!replay.state.complete)replay.skipStage();this.state=replay.state;this.history.push(before);this.future=[];return {ok:true,stage:currentStage(this.state).id,message:'已返回上一道工序。'};}
  undo(){if(!this.history.length)return false;this.future.push(cloneState(this.state));this.state=this.history.pop();return true;}
  redo(){if(!this.future.length)return false;this.history.push(cloneState(this.state));this.state=this.future.pop();return true;}
  resetStage(){const stage=this.state.stage,index=this.history.findIndex(item=>item.stage===stage);if(index<0)return false;this.future=[];this.state=cloneState(this.history[index]);this.history=this.history.slice(0,index);return true;}
  reset(){this.state=createState();this.history=[];this.future=[];}
}
