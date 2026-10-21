// Shared workbench dimensions: thin bamboo strips rather than poles.
export const BAMBOO_LENGTHS=Object.freeze([.94,.42]);
export const BAMBOO_WIDTH=.012, BAMBOO_THICKNESS=.004;
export const BAMBOO_GRIPS=Object.freeze([.18,.82]);
export const RING_MIN=.965, RING_MAX=1.025;
export class RingBend {
 constructor(){this.reset();}
 reset(){this.selected=false;this.strip=-1;this.curve=0;this.direction=0;this.wrapping=0;this.binding=false;this.finished=false;}
 select(strip){if(this.selected||!Number.isInteger(strip)||strip<0||strip>=16)return false;this.selected=true;this.strip=strip;return true;}
 hold(direction){if(this.selected&&!this.binding)this.direction=Math.sign(direction);}
 release(){this.direction=0;}
 get ready(){return this.selected&&!this.binding&&this.curve>=RING_MIN&&this.curve<=RING_MAX;}
 get issue(){return this.curve>RING_MAX?'形状不合适，请按住右键松开竹条，减小弯曲度。':this.ready?'两端已合拢，可以确认固定。':'按住左键向内弯曲；按住右键放松回弹。';}
 confirm(){if(!this.ready||this.direction)return false;this.binding=true;return true;}
 tick(dt){dt=Math.min(.05,Math.max(0,dt));if(this.binding){this.wrapping=Math.min(1,this.wrapping+dt/1.4);this.finished=this.wrapping===1;}else if(this.selected)this.curve=Math.max(0,Math.min(1.2,this.curve+this.direction*dt*.50));}
 evidence(){return {mode:'bend',quality:Math.max(0,1-Math.abs(this.curve-1)*8),curve:this.curve,oval:0,dose:0,angle:0,distance:2.3,strip:this.strip};}
}
