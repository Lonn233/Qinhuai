export const PAPER_STAGES=['paper_dye','petal_pressing'];
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function cutOutline(kind='square'){
 if(kind==='square'){
  const corners=[[-.31,.31],[.31,.31],[.31,-.31],[-.31,-.31],[-.31,.31]],points=[];
  for(let i=0;i<4;i++)for(let j=0;j<16;j++)points.push({x:corners[i][0]+(corners[i+1][0]-corners[i][0])*j/16,y:corners[i][1]+(corners[i+1][1]-corners[i][1])*j/16});
  return [...points,{...points[0]}];
 }
 return Array.from({length:81},(_,i)=>{const t=i<=40?i/40:(80-i)/40,side=i<=40?1:-1;return {x:side*.245*Math.sin(Math.PI*t)*(kind==='leaf'?.92:1.15-.35*t),y:.32-.64*t};});
}
// Forgiving local-space cutting corridor, shared by square, petal and leaf cuts.
export const CUT_TOLERANCE=Object.freeze({start:.12,edge:.11,checkpoint:.10,maxStep:.35,sampleStep:.02});
export class CutProcess {
 constructor(kind){this.points=cutOutline(kind);this.reset();}
 reset(){this.next=0;this.dragging=false;this.failed=false;this.ready=false;this.last=null;this.onTrack=false;}
 down(p){
  if(this.ready||distance(p,this.points[Math.min(this.next,this.points.length-1)])>CUT_TOLERANCE.start)return false;
  this.dragging=true;this.last={...p};this.move(p);return true;
 }
 // Leaving the path or releasing the button pauses, never destroys completed cuts.
 move(p){
  if(!this.dragging)return false;
  // Do not spend any progress on an event whose endpoint is outside the contour.
  const onContour=this.points.some((a,i)=>{const b=this.points[i+1]||a,dx=b.x-a.x,dy=b.y-a.y,u=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1));return distance(p,{x:a.x+u*dx,y:a.y+u*dy})<=(this.next<=1?CUT_TOLERANCE.start:CUT_TOLERANCE.edge);});
  if(!onContour){this.onTrack=false;this.last=null;return false;}
  const previous=this.last,length=previous?distance(p,previous):0;
  if(!previous||length>CUT_TOLERANCE.maxStep){this.last=null;return this.advance(p);}
  const count=Math.max(1,Math.ceil(length/CUT_TOLERANCE.sampleStep));
  for(let i=1;i<=count&&this.dragging;i++){
   const q={x:previous.x+(p.x-previous.x)*i/count,y:previous.y+(p.y-previous.y)*i/count};
   if(!this.advance(q)){this.last=null;return false;}
  }
  this.last={...p};return this.onTrack;
 }
 advance(q){
  const a=this.points[Math.max(0,this.next-1)],b=this.points[this.next];if(!b)return false;
  const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy,u=clamp(((q.x-a.x)*dx+(q.y-a.y)*dy)/(l||1));
  this.onTrack=distance(q,{x:a.x+u*dx,y:a.y+u*dy})<=(this.next<=1?CUT_TOLERANCE.start:CUT_TOLERANCE.edge);
  if(!this.onTrack)return false;
  while(this.next<this.points.length&&distance(q,this.points[this.next])<=CUT_TOLERANCE.checkpoint)this.next++;
  if(this.next>=this.points.length){this.ready=true;this.dragging=false;}
  this.last={...q};return true;
 }
 up(){this.dragging=false;this.onTrack=false;this.last=null;}
}
export const DYE_TIME_SCALE=20;
export class DyeProcess {
 constructor(){this.reset();}
 reset(){this.phase='stock';this.dose=0;this.depth=0;this.targetDepth=0;this.maxDepth=0;this.lift=0;this.seconds=0;}
 take(){if(this.phase!=='stock')return false;this.phase='held';return true;}
 immerse(depth=.8){if(!['held','review'].includes(this.phase)||depth<=0)return false;this.targetDepth=clamp(depth,0,.92);this.phase='dipping';return true;}
 // Releasing a pointer is NOT a craft action. Only explicit interaction lifts paper.
 release(){}
 liftOut(){if(this.phase!=='dipping')return false;this.phase='lifting';this.lift=0;return true;}
 tick(dt){dt=clamp(dt,0,.05);if(this.phase==='dipping'){this.seconds+=dt;this.depth+=Math.sign(this.targetDepth-this.depth)*Math.min(Math.abs(this.targetDepth-this.depth),dt*1.2);this.maxDepth=Math.max(this.maxDepth,this.depth);this.dose=clamp(this.simulatedSeconds/120,0,1.8);}if(this.phase==='lifting'){this.lift=clamp(this.lift+dt/1.05);if(this.lift===1)this.phase='review';}}
 get simulatedSeconds(){return this.seconds*DYE_TIME_SCALE;}
 get ready(){return this.phase==='review'&&this.simulatedSeconds>=60&&this.simulatedSeconds<=120;}
}
export class PressProcess {
 constructor(){this.phase='idle';this.progress=0;this.rotation=0;}
 start(){if(this.phase!=='idle')return false;this.phase='running';return true;}
 tick(dt){if(this.phase!=='running')return;dt=clamp(dt,0,.05);this.progress=clamp(this.progress+dt/5.5);this.rotation=this.progress*Math.PI*12;if(this.progress===1)this.phase='done';}
}
