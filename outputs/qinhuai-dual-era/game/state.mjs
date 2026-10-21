import {LANTERNS,RIDDLES,LOCATIONS,PLAY_AREA} from './data.mjs';
export const SAVE_KEY='qinhuai.lantern-riddles.v1';
export const STATES=Object.freeze({EXPLORING:'exploring',RIDDLE:'riddleOpen',CATALOG:'lanternCatalogOpen',FEEDBACK:'answerFeedback'});
export const normalizeAnswer=value=>String(value??'').normalize('NFKC').trim().replace(/\s+/gu,'').toLocaleLowerCase('zh-CN');
export class GameState {
 constructor(storage){this.storage=storage;this.mode=STATES.EXPLORING;this.activeRiddle=null;this.solved=new Set();this.unlocked=new Set();this.storageWarning=!storage;this.load();}
 load(){try{const save=JSON.parse(this.storage?.getItem(SAVE_KEY)||'null');if(save?.version!==1||!Array.isArray(save.solved))return;for(const id of save.solved){const r=RIDDLES.find(x=>x.id===id);if(r){this.solved.add(id);this.unlocked.add(r.unlockLanternId);}}}catch{this.storageWarning=true;}}
 save(){try{this.storage?.setItem(SAVE_KEY,JSON.stringify({version:1,solved:[...this.solved]}));}catch{this.storageWarning=true;}}
 openRiddle(id){const r=RIDDLES.find(x=>x.id===id);if(!r)return false;this.activeRiddle=r;this.mode=this.solved.has(id)?STATES.FEEDBACK:STATES.RIDDLE;return true;}
 answer(value){if(this.mode!==STATES.RIDDLE||!this.activeRiddle)return {ok:false,reason:'inactive'};const normalized=normalizeAnswer(value);if(!normalized)return {ok:false,reason:'empty'};const correct=this.activeRiddle.acceptedAnswers.some(a=>normalizeAnswer(a)===normalized);if(!correct)return {ok:false,reason:'incorrect'};const first=!this.solved.has(this.activeRiddle.id);this.solved.add(this.activeRiddle.id);this.unlocked.add(this.activeRiddle.unlockLanternId);this.mode=STATES.FEEDBACK;this.save();return {ok:true,first,lantern:LANTERNS.find(x=>x.id===this.activeRiddle.unlockLanternId)};}
 openCatalog(){this.activeRiddle=null;this.mode=STATES.CATALOG;}
 close(){this.activeRiddle=null;this.mode=STATES.EXPLORING;}
}
export function isWalkable(x,z){
 const a=PLAY_AREA,r=a.radius;
 if(!Number.isFinite(x)||!Number.isFinite(z)||x<a.minX+r||x>a.maxX-r||z<a.minZ+r||z>a.maxZ-r)return false;
 // Only the physical podium body blocks movement. The riddle sign sits in
 // open space in front of it and is intentionally excluded from this collider.
 return !LOCATIONS.some(p=>{
  const width=p.collisionWidth??p.podiumWidth;
  const depth=p.collisionDepth??p.podiumDepth;
  const centerZ=p.z+(p.collisionOffsetZ??0);
  const halfWidth=width/2+r,halfDepth=depth/2+r;
  return x>p.x-halfWidth&&x<p.x+halfWidth&&z>centerZ-halfDepth&&z<centerZ+halfDepth;
 });
}
export function resolveMovement(from,dx,dz){
 const p={x:from.x,z:from.z};const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/0.12));
 // Short substeps prevent tunnelling; independent axes slide along obstacles.
 for(let i=0;i<steps;i++){if(isWalkable(p.x+dx/steps,p.z))p.x+=dx/steps;if(isWalkable(p.x,p.z+dz/steps))p.z+=dz/steps;}return p;
}
