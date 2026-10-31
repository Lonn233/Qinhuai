import * as THREE from 'three';
import {LANTERN_GROUPS,normalizeLantern,lampGain} from './import-lantern-settings.mjs';
import {lightingFor} from './import-festival-lanterns.js';
import {RACK_COLORS} from './courtyard-rack-layout.mjs';
import {STREETLAMP_PLACEMENTS,STREETLAMP_HEIGHT} from './import-streetlamps.js';

export function meshLanternEmitters(meshes){
 const found=new Map(),matrix=new THREE.Matrix4(),world=new THREE.Matrix4(),box=new THREE.Box3(),center=new THREE.Vector3(),size=new THREE.Vector3();
 for(const mesh of meshes){
  mesh.updateWorldMatrix(true,false);if(!mesh.geometry.boundingBox)mesh.geometry.computeBoundingBox();
  const stable=mesh.userData.lanternEmitterMatrices;const count=stable?stable.length:mesh.isInstancedMesh?mesh.count:1;
  for(let i=0;i<count;i++){
   if(stable)matrix.copy(stable[i]);else if(mesh.isInstancedMesh)mesh.getMatrixAt(i,matrix);else matrix.identity();
   world.multiplyMatrices(mesh.matrixWorld,matrix);box.copy(mesh.userData.lanternEmitterBounds||mesh.geometry.boundingBox).applyMatrix4(world);box.getCenter(center);box.getSize(size);
   const e={x:center.x,y:center.y,z:center.z,nx:0,nz:0,halfWidth:0,omni:true,radius:Math.min(2.5,Math.max(size.x,size.y,size.z)*.25)};
   found.set([e.x,e.y,e.z].map(n=>n.toFixed(2)).join(','),e);
  }
 }
 return [...found.values()];
}
const collect=(root,name)=>{const meshes=[];root.traverse(o=>{if(o.isMesh&&o.name===name)meshes.push(o);});return meshes;};
export class LanternLighting {
 constructor({festival,feature,tree,courtyard,racks,red,street,boats,placed,environment}){
  Object.assign(this,{festival,feature,tree,courtyard,racks,red,street,boats,placed,environment});this.saved={};this.stamp='';this.nextScan=0;this.version=0;this.disposed=false;
 }
 getSettings(id){return normalizeLantern(this.saved[id]);}
 loadSettings(groups){this.saved=Object.fromEntries(Object.entries(groups||{}).map(([id,p])=>[id,normalizeLantern(p)]));this.apply();}
 setSettings(id,value){if(!LANTERN_GROUPS.some(g=>g[0]===id))return;this.saved[id]=normalizeLantern(value);this.apply();}
 invalidate(){this.version++;this.nextScan=0;this.stamp='';}
 apply(){for(const layer of [this.festival,this.feature,this.tree,this.courtyard,this.racks,this.red,this.street,this.boats].filter(Boolean)){layer.lightControls=this.saved;layer.setState();}if(this.placed){this.placed.lightControls=this.saved;this.placed.setState(this.environment.active);}this.version++;this.nextScan=0;this.deferUntil=performance.now()+120;}
 baseColor(id){
  if(id==='boat')return '#ffaa30';
  if(this.racks?.entries.has(id))return this.racks.entries.get(id).color;
  if(this.festival.entries.has(id))return this.festival.entries.get(id).tuning.color;
  if(this.feature.entries.has(id))return this.feature.entries.get(id).tuning.color;
  if(['tree','courtyard'].includes(id))return '#ffe0a1';
  if(id==='red')return '#ff7950';if(id==='street')return '#fff8e9';
  if(['woman','gongming','tengma','column','rack','drum','hanging','crane'].includes(id))return '#fff0dc';
  if(id==='pink')return '#ffb5cb';
  // Controls initialize before asynchronous GLBs populate the layer entries.
  if(id.startsWith('rack-')&&RACK_COLORS[id.slice(5)])return RACK_COLORS[id.slice(5)];
  return lightingFor(id).color;
 }
 zoneVisible(id){return this.templeInside===undefined||id==='courtyard'||(this.racks?.entries.has(id)||id.startsWith('rack-')?this.templeInside:!this.templeInside);}
 setTempleInside(value){this.templeInside=!!value;this.placed?.setTempleInside(this.templeInside);this.invalidate();this.deferUntil=0;this.update();}
 sources(id){
  if(!this.zoneVisible(id))return [];

  if(id==='boat'&&this.boats?.playHidden)return [];
  if(id==='boat')return meshLanternEmitters(this.boats?.hulls||[]);
  if(this.racks?.entries.has(id))return meshLanternEmitters(this.racks.entries.get(id).meshes);
  if(this.festival.entries.has(id))return meshLanternEmitters(this.festival.entries.get(id).batches.filter(b=>!b.mesh.userData.festivalSpill&&!b.mesh.userData.festivalReflection&&!(b.mesh.userData.festivalLod>0)).map(b=>b.mesh));
  if(this.feature.entries.has(id))return meshLanternEmitters(this.feature.entries.get(id).meshes.filter(m=>m.userData.featureLantern));
  if(id==='tree')return meshLanternEmitters(collect(this.tree.root,'GoldenLanternBodies'));
  if(id==='courtyard')return meshLanternEmitters(collect(this.courtyard.root,'CourtyardGoldenLanterns'));
  if(id==='red')return this.red.groups.filter(g=>this.red.buildingSettings?.[g.buildingId]!==false).flatMap(g=>g.uniforms.lamps.value.map(p=>({x:p.x,y:p.y,z:p.z,nx:0,nz:0,halfWidth:0,radius:.12,omni:true})));
  if(id==='street')return STREETLAMP_PLACEMENTS.filter(p=>this.street.tiles.has(p.tile)).map(p=>({...p,y:p.y+STREETLAMP_HEIGHT*.8,nx:0,nz:0,halfWidth:0,radius:.18,omni:true}));
  return [];
 }
 update(now=performance.now()){
  if(this.disposed||now<this.nextScan||now<(this.deferUntil||0))return;this.nextScan=now+200;
  const stamp=JSON.stringify([this.version,this.boats?.playHidden,this.boats?.meshes.size,[...this.festival.entries.values()].map(e=>e.batches.length),this.festival.mountain,this.feature.entries.size,this.tree.tiles.size,this.courtyard.ready,this.racks?.ready,this.red.groups.length,this.red.settings,this.red.buildingSettings,this.street.tiles.size,this.festival.waterVisible,this.feature.waterVisible,this.environment.active]);
  const combinedStamp=stamp+'|'+(this.placed?.version||0);if(combinedStamp===this.stamp)return;this.stamp=combinedStamp;
  // Late-loading meshes must inherit their group's saved settings as well.
  for(const layer of [this.festival,this.feature,this.tree,this.courtyard,this.racks,this.red,this.street,this.boats].filter(Boolean))layer.setState();
  this.placed?.setState(this.environment.active);
  const channels=[];this.counts={};
  for(const [id] of LANTERN_GROUPS){
   const s=this.getSettings(id),emitters=this.sources(id);this.counts[id]=emitters.length+(this.placed?.record.instances.filter(item=>item.kind===id&&this.placed.objects.has(item.id)).length||0);
   if(!this.zoneVisible(id)||id==='boat'&&(this.boats?.playHidden||this.boats?.templeHidden))continue;
   if(!this.environment.active||!s.modelVisible||!s.enabled||!s.spill.enabled||!s.brightness)continue;
   if(['lotus-main','lotus-one','chrysanthemum'].includes(id)&&!this.festival.waterVisible||id==='woman'&&!this.feature.waterVisible)continue;
   if(id==='red'&&!this.red.settings.enabled)continue;
   const color=new THREE.Color(s.spill.inheritColor?(s.inheritColor?this.baseColor(id):s.color):s.spill.color);
   const energy=lampGain(s)*(this.festival.entries.get(id)?.tuning.power??this.feature.entries.get(id)?.tuning.power??(id==='red'?this.red.settings.brightness*.85:.85));
   channels.push({p:s.spill,color,energy,emitters,cacheKey:'lantern|'+id});
  }
  if(this.environment.active)channels.push(...(this.placed?.spillChannels(id=>this.baseColor(id))||[]));
  this.environment.setLanternChannels(channels);this.onUpdate?.();
 }
 dispose(){this.disposed=true;this.environment.setLanternChannels([]);this.onUpdate=null;}
}
