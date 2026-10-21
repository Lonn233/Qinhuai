import {Workflow,restoreState,validateState,currentStage} from './workflow.mjs';
const cases=[{version:2},{version:2,counts:{}}];
for(const c of cases){console.log('case',c,'restore',restoreState(c));console.log('workflow',new Workflow(c).state);}
let w=new Workflow();for(let i=0;i<3;i++)w.act('bamboo');while(currentStage(w.state).id!=='lining_upper')w.skipStage(10000);console.log('modern line upper',w.state.stage,currentStage(w.state).id,w.state.counts.frame_short_binding);
const legacy=structuredClone(w.state);delete legacy.frameItems;console.log('legacy validate',validateState(legacy),'restore stage',restoreState(legacy)?.stage,restoreState(legacy)&&currentStage(restoreState(legacy)).id);
const old=structuredClone(w.state);delete old.craftRevision;delete old.lining;old.stage=2;old.counts.frame_binding=5;old.counts.frame_inspection=0;console.log('pre old',old.stage,old.counts, 'restore',restoreState(old));
