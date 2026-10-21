import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createState, currentStage, applyAction as rawAction, applyGlue, applyRingPlacement, updateDrying, makeFinishedState } from '../workflow.mjs';
import { CONFIG, STAGES } from '../config.mjs';
function applyAction(s,tool,now){const stage=currentStage(s);if(stage.id==='frame_assembly')for(let i=0;i<3;i++)applyRingPlacement(s,i);const lining=stage.id.startsWith('lining_'),panel=s.counts[stage.id];if(lining)applyGlue(s,stage.id,panel);const r=rawAction(s,tool,now,lining?{panel}:null);assert.ok(r.ok,r.message);return r;}
const require=createRequire(import.meta.url);
const {buildSync}=require('esbuild');
const compiled=buildSync({entryPoints:[fileURLToPath(new URL('../lantern.js',import.meta.url))],bundle:true,platform:'node',format:'cjs',external:['three'],write:false}).outputFiles[0].text;
const mod={exports:{}};new Function('require','module','exports',compiled)(require,mod,mod.exports);
const {createLantern}=mod.exports;
test('every stage synchronizes and ghost clones contain serializable metadata',()=>{
 const lantern=createLantern(),state=createState();let now=10000,steps=0;
 while(!state.complete){lantern.sync(state);assert.doesNotThrow(()=>lantern.root.clone(true));
  if(currentStage(state).id==='paper_drying'){now+=CONFIG.dryDuration;updateDrying(state,now);}else assert.ok(applyAction(state,currentStage(state).tool,now).ok);
  assert.ok(++steps<=STAGES.reduce((n,s)=>n+s.total,0));
 }
 lantern.sync(state);assert.equal(lantern.groups.DebugMarkers.children.length,0);assert.equal(lantern.registry.size,127);assert.equal(lantern.sockets.size,127);assert.equal(lantern.petals.filter(p=>p.visible).length,36);
 lantern.dispose();
});
test('explosion, frame-only and per-part visibility restore exact transforms',()=>{
 const l=createLantern();l.sync(makeFinishedState());const positions=new Map([...l.registry].map(([id,m])=>[id,m.position.clone()]));
 for(let n=0;n<12;n++){l.setExploded(true);l.setFrame(true);assert.ok(l.petals.every(p=>!p.visible));l.setFrame(false);l.setLayer(1);assert.equal(l.petals.filter(p=>p.visible).length,36-CONFIG.petals.perLayer);l.setPartVisibility('big-ring',false);assert.equal(l.registry.get('big-ring').visible,false);l.restore();}
 for(const [id,m]of l.registry){assert.ok(m.position.equals(positions.get(id)),id);assert.equal(m.visible,true,id);}
 l.dispose();
});
test('all geometry stays finite and body petals cover the large ring radius',()=>{
 const l=createLantern();l.root.traverse(o=>{if(o.geometry){for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));}});
 assert.equal(l.registry.get('big-ring').userData.radius,CONFIG.frame.bigRingRadius);
 const petals=l.petals.filter(m=>m.userData.layer===2);const m=petals[0],p=m.geometry.attributes.position;let nearest=null;
 for(let i=0;i<p.count;i++){const y=p.getY(i)+m.position.y,x=p.getX(i);if(Math.abs(x)<1e-5&&(!nearest||Math.abs(y-CONFIG.frame.bigRingHeight)<nearest.delta))nearest={delta:Math.abs(y-CONFIG.frame.bigRingHeight),radius:p.getZ(i)+m.position.z};}
 assert.ok(nearest.radius>CONFIG.frame.bigRingRadius+.02);l.dispose();
});

test('lining, six flower heads, decorations and LED follow their individual steps',()=>{
 const l=createLantern(),s=createState();let now=10000;
 while(!s.complete){
  l.sync(s);const count=stage=>[...l.registry.values()].filter(m=>m.userData.workflowStage===stage&&m.visible).length;
  for(const id of ['lining_upper','lining_lower','top_flower_assembly','pod_assembly','lotus_leaf_assembly','light_installation'])assert.equal(count(id),s.counts[id],id);
  assert.equal(l.light.intensity,0,'LED must not light before final test');
  if(currentStage(s).id==='paper_drying'){now+=CONFIG.dryDuration;updateDrying(s,now);}else applyAction(s,currentStage(s).tool,now);
 }
 l.sync(s);assert.ok(l.light.intensity>0);
 const flowers=[...l.registry.values()].filter(m=>m.userData.partType==='flower');assert.equal(flowers.filter(m=>m.userData.tier==='upper').length,4);assert.equal(flowers.filter(m=>m.userData.tier==='lower').length,2);
 l.setFrame(true);for(const m of l.registry.values())if(['lining','flower','pod','lotus-leaf'].includes(m.userData.partType))assert.equal(m.visible,false,m.name);
 l.dispose();
});
