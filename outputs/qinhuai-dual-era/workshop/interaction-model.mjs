// Gesture rules use work-surface coordinates, independent of frame rate and screen size.
export const INTERACTIONS = Object.freeze({
 bamboo_prep:'bend', frame_assembly:'place', frame_short_binding:'bind', lining_upper:'trace', lining_lower:'trace',
 paper_dye:'dye', petal_pressing:'press', petal_shaping:'shape', petal_assembly:'place', calyx_assembly:'place',
 top_flower_assembly:'place', candle_installation:'place', final_inspection:'inspect'
});
export const RELEASE_PLACEMENT_STAGES=['top_flower_assembly','candle_installation'];
export const RELEASE_SHAPING_STAGES=[];
export const completesOnRelease=stage=>RELEASE_PLACEMENT_STAGES.includes(stage)||RELEASE_SHAPING_STAGES.includes(stage);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const SOURCE={x:-1.75,y:-.35}, TARGET={x:.65,y:.2}, PIN={x:-.9,y:-.85};
export function tracePoints(mode){
 if(mode==='bind')return Array.from({length:49},(_,i)=>({x:Math.sin(i/48*Math.PI*4)*.64,y:Math.cos(i/48*Math.PI*4)*.64}));
 if(mode==='inspect')return [{x:-.8,y:.65},{x:.75,y:.6},{x:.85,y:-.55},{x:-.8,y:-.55}];
 return Array.from({length:25},(_,i)=>({x:-1.35+i/24*2.7,y:.38*Math.sin(i/24*Math.PI*2)}));
}
export class Handwork {
 constructor(stage){this.stage=stage;this.mode=INTERACTIONS[stage];if(!this.mode)throw new Error('No handwork for '+stage);this.reset();}
 reset(){this.position={...SOURCE};this.angle=-.4;this.curve=0;this.oval=0;this.pinned=false;this.dragging=false;this.distance=0;this.contact=0;this.dose=0;this.placed=false;this.ready=false;this.visited=new Set();this.previous=null;this.next=0;this.issue='';this.points=tracePoints(this.mode);this.fixed=false;this.formed=false;this.edgePinched=false;this.wireFixed=false;this.pendingShape=false;this.inspectIndex=-1;}
 get shapePhase(){return !this.formed?'form':!this.edgePinched?'pinch':!this.wireFixed?'wire':'complete';}
 get grip(){return this.mode==='bend'?{x:2.2-3.1*this.curve,y:-.85+this.oval*2}:this.mode==='shape'?{x:.15+this.curve*1.5,y:.55}:this.position;}
 down(p){this.issue='';
  if(this.mode==='bend'&&!this.pinned){if(distance(p,PIN)<.28){this.pinned=true;return true;}this.issue='先按住竹篾左端，把它固定在木钉旁。';return false;}
  const manipulation=['bend','shape','place','dye','press'].includes(this.mode);
  if(manipulation){const point=this.placed?TARGET:this.grip;if(distance(p,point)>(this.mode==='shape'?.45:.38)){this.issue=this.placed?'请按住材料与工具接触处。':'请抓住材料上的小圆点。';return false;}}
  this.dragging=true;this.previous={...p};this.pendingShape=false;this.gestureDistance=0;return true;
 }
 move(p,dt=.016){if(!this.dragging)return false;const moved=distance(p,this.previous);const speed=moved/Math.max(.008,dt);this.previous={...p};
  if(moved>.6&&!RELEASE_PLACEMENT_STAGES.includes(this.stage)){this.issue='动作太急，慢一点，让工具贴着材料走。';return false;}
  this.distance+=moved;this.gestureDistance+=moved;
  if(this.mode==='bend'){this.curve=clamp((2.2-p.x)/3.1,0,1.18);this.oval=clamp((p.y+.85)/2,-.5,.5);this.ready=this.curve>=.96&&this.curve<=1.04&&Math.abs(this.oval)<.09&&this.distance>2.5;this.issue=this.curve>1.04?'弯过头了，稍微放松右端。':Math.abs(this.oval)>.09?'两端高度不齐，上下调整到木钉处。':'';}
  else if(this.mode==='shape'){
   if(this.stage!=='petal_shaping'||!this.formed){this.curve=clamp((p.x-.15)/1.5,0,1.2);const shaped=this.curve>.48&&this.curve<.74&&this.distance>.6;this.ready=this.stage!=='petal_shaping'&&shaped;this.pendingShape=shaped;this.issue=this.curve>=.74?'卷得太紧，向左回退一点。':shaped?'弧度合适，松手完成成形。':'';}
   else if(!this.edgePinched){this.pendingShape=this.gestureDistance>.18&&p.x>.95&&p.y<.35&&p.y>-.1;this.issue=this.pendingShape?'松手完成捏边，再固定铜丝。':'抓住边缘圆点，向下捏出折边。';}
   else if(!this.wireFixed){this.pendingShape=this.gestureDistance>.35&&p.x>.55&&p.x<1.1&&p.y<-.15;this.issue=this.pendingShape?'松手固定铜丝。':'抓住边缘圆点，将铜丝向下收拢固定。';}
  }
  else if(['place','press','dye'].includes(this.mode)&&!this.placed){this.position={...p};}
  else if(['trace','bind'].includes(this.mode)){
   const target=this.points[this.next];if(target&&distance(p,target)<.24&&speed<14){this.visited.add(this.next);this.next++;this.ready=this.next>=this.points.length;return moved>.002;}
   this.issue=speed>=14?'移动太快，放慢工具。':'沿浅色引线继续，偏离的部分不会加工。';return false;
  }else if(this.mode==='inspect')return false;
  return moved>.002;
 }
 tick(dt,p){if(!this.dragging||!p)return false;dt=Math.min(dt,.05);
  if(this.mode==='dye'&&!this.placed){const depth=clamp((this.position.x+.35)/1.2);const contact=Math.abs(this.position.y-.2)<.62&&this.position.x>-.35&&this.position.x<1.45;
   if(contact){this.dose+=dt*depth*.75;this.ready=false;this.issue=this.dose>1.15?'颜色过深，请换纸重做这一批。':'';return true;}}
  if(this.mode==='press'||this.mode==='place'){
   if(this.placed&&distance(p,TARGET)<.3){this.contact+=dt;const required=this.mode==='press'?1.05:.55;this.ready=this.contact>=required;return true;}}
  if(this.mode==='inspect'){
   const i=this.points.findIndex((q,j)=>!this.visited.has(j)&&distance(p,q)<.28);
   if(i>=0){if(this.inspectIndex!==i){this.inspectIndex=i;this.contact=0;}this.contact+=dt;if(this.contact>=.23){this.visited.add(i);this.contact=0;}this.ready=this.visited.size===this.points.length;return true;}}
  return false;
 }
 rotate(delta){if(!this.placed&&['place','press'].includes(this.mode))this.angle+=delta;}
 up(){if(!this.dragging)return;this.dragging=false;this.previous=null;
  if(this.stage==='petal_shaping'){
   if(this.pendingShape){if(!this.formed)this.formed=true;else if(!this.edgePinched)this.edgePinched=true;else this.wireFixed=true;}
   this.pendingShape=false;this.ready=this.formed&&this.edgePinched&&this.wireFixed;
   this.issue=this.ready?'成形、捏边和铜丝固定已完成。':!this.formed?this.issue:!this.edgePinched?'成形完成；抓住边缘圆点向下捏边。':'捏边完成；抓住圆点向下收拢铜丝固定。';return;
  }
  // Decorative attachments snap to the socket on release, without a second hold.
  if(RELEASE_PLACEMENT_STAGES.includes(this.stage)&&!this.placed){
   if(distance(this.position,TARGET)<.34&&this.distance>.9){this.position={...TARGET};this.angle=0;this.placed=true;this.ready=true;this.issue='已对齐，松手贴合。';}
   else this.issue='尚未到达高亮位置，请继续拖动材料对齐后松手。';
   return;
  }
  if(['place','press'].includes(this.mode)&&!this.placed){const gap=distance(this.position,TARGET),angle=Math.abs(Math.atan2(Math.sin(this.angle),Math.cos(this.angle)));if(gap<.2&&angle<.15&&this.distance>.9){this.placed=true;this.position={...TARGET};this.issue='已对齐，再按住接触处固定。';}else this.issue=gap>=.2?'位置还没贴合，继续抓取调整。':'方向偏斜，用滚轮或旋转按钮对齐。';}
  if(this.mode==='dye'){const racked=this.position.x<-.85&&this.position.y>.5;this.ready=racked&&this.dose>=.55&&this.dose<=1.15;this.issue=this.ready?'颜色适中，已放到阴干架。':this.dose>1.15?'浸染过深，请换纸重做。':this.dose<.55?'颜色偏浅，可再次浸入染液。':'移到左上方阴干架，再松手。';}
 }
 cancelGesture(){this.dragging=false;this.previous=null;this.pendingShape=false;}
 evidence(){if(!this.ready||this.dragging)return null;return {mode:this.mode,quality:clamp(this.mode==='bend'?1-Math.abs(this.curve-1)-Math.abs(this.oval):this.mode==='shape'?1-Math.abs(this.curve-.61):this.mode==='dye'?1-Math.abs(this.dose-.8):1),curve:this.curve,oval:this.oval,dose:this.dose,angle:this.angle,distance:this.distance,formed:this.formed,edgePinched:this.edgePinched,wireFixed:this.wireFixed};}
}
