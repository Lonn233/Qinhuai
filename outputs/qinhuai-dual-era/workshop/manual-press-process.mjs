import {clamp} from './paper-process.mjs';

// Each workstation visit owns one unfinished blank; only extraction commits it.
export class ManualPressProcess {
 constructor(){this.phase='idle';this.elapsed=0;this.winding=0;this.adherence=0;this.hits=0;this.compression=0;this.strike=0;this.progress=0;}
 begin(phase){this.phase=phase;this.elapsed=0;}
 place(){if(this.phase!=='idle')return false;this.begin('loading');return true;}
 fit(){if(this.phase!=='loaded')return false;this.begin('fitting');return true;}
 wind(amount){if(this.phase!=='winding'||!Number.isFinite(amount)||amount<=0)return false;this.winding=clamp(this.winding+amount);if(this.winding===1)this.begin('wrapped');return true;}
 stand(){if(this.phase!=='wrapped')return false;this.begin('standing');return true;}
 hammer(){if(this.phase!=='hammering'||this.strike>0)return false;this.strike=.52;return true;}
 restore(){if(this.phase!=='compressed')return false;this.begin('restoring');return true;}
 unthread(){if(this.phase!=='restored')return false;this.begin('unthreading');return true;}
 removePaper(){if(this.phase!=='unthreaded')return false;this.begin('extracting');return true;}
 extract(){if(this.phase!=='done')return false;this.begin('collected');return true;}
 tick(dt){
  dt=clamp(dt,0,.05);this.elapsed+=dt;
  const transitions={loading:[.85,'loaded'],fitting:[1.1,'winding'],standing:[1.05,'hammering'],restoring:[1,'restored'],unthreading:[1.1,'unthreaded'],extracting:[1.1,'done']};
  if(this.phase==='fitting')this.adherence=clamp(this.elapsed/1.1);
  const next=transitions[this.phase];if(next&&this.elapsed>=next[0])this.begin(next[1]);
  if(this.strike>0){const old=this.strike;this.strike=Math.max(0,this.strike-dt);if(old>.24&&this.strike<=.24){this.hits++;this.compression=this.hits/8;}if(this.strike===0&&this.hits>=8)this.begin('compressed');}
  const rank={idle:0,loading:.03,loaded:.05,fitting:.07,winding:.12,wrapped:.30,standing:.35,hammering:.42,compressed:.75,restoring:.77,restored:.81,unthreading:.84,unthreaded:.89,extracting:.93,done:1,collected:1};
  this.progress=(rank[this.phase]??0)+(this.phase==='winding'?this.winding*.18:this.phase==='hammering'?this.compression*.3:0);
 }
}
