import * as THREE from 'three';
import manifest from './assets/qinhuai-modern-import/night/matou-ma61/manifest.json' with {type:'json'};
import projectSaved from './assets/building-study/matou/ma61-lighting.json' with {type:'json'};
import {STORAGE_KEY,readSaved} from './game/building-study/profiles.mjs';
import {createBuildingLighting} from './game/building-study/lighting.js';
import {createSoftSpill,loadSoftSpill} from './game/building-study/soft-spill.js';

export const MATOU_SAVED_LABEL='马61';
export const MATOU_GROUPS=manifest.groups;
export const MATOU_STUDY_NODES=new Set(MATOU_GROUPS.flatMap(group=>group.nodes));
const byNode=new Map(MATOU_GROUPS.flatMap(group=>group.nodes.map(name=>[name,group])));
const findSaved=items=>items.filter(item=>item.building==='matou'&&item.label.trim()===MATOU_SAVED_LABEL).at(-1);
export const PROJECT_MATOU_STUDY=Object.freeze(findSaved(readSaved(JSON.stringify(projectSaved))));
export function resolveMatouStudy(storage){
 try{const saved=findSaved(readSaved(storage?.getItem(STORAGE_KEY)));if(saved)return {settings:structuredClone(saved),label:MATOU_SAVED_LABEL,source:'browser',key:saved.key};}catch{}
 // This is the actual recovered named save, never the current draft or an
 // approximation from screenshots. Never write to the user's study library.
 return {settings:structuredClone(PROJECT_MATOU_STUDY),label:MATOU_SAVED_LABEL,source:'project',key:PROJECT_MATOU_STUDY.key};
}
export function readMatouStudy(){try{return resolveMatouStudy(globalThis.localStorage);}catch{return resolveMatouStudy(null);}}
export function matouGroupForNode(name){return byNode.get(name);}
export function loadMatouField(group){return loadSoftSpill(new URL(`./assets/qinhuai-modern-import/night/matou-ma61/${group.id}/`,import.meta.url));}

// Keep old fixtures on the non-Matou portion of a merged source mesh. Crossing
// segments are cut at the boundary; no modification to the source layout file.
export function retainedMatouFixtureSegments(fixture){
 const group=byNode.get(fixture.node);if(!group)return fixture.segments;
 if(group.minX===null)return [];
 const out=[];
 for(let i=0;i<fixture.segments.length;i+=6){
  let a=fixture.segments.slice(i,i+3),b=fixture.segments.slice(i+3,i+6);
  if(a[0]>=group.minX&&b[0]>=group.minX)continue;
  if(a[0]>=group.minX||b[0]>=group.minX){
   const t=(group.minX-a[0])/(b[0]-a[0]),cut=a.map((v,k)=>v+(b[k]-v)*t);
   if(a[0]>=group.minX)a=cut;else b=cut;
  }
  out.push(...a,...b);
 }
 return out;
}

// Material assignment only: preserve every original vertex, UV, normal and
// triangle. The daytime geometry object is restored verbatim on day/dispose.
// The mixed northeast object contains an ordinary gallery next to the horse
// walls, so a node-wide material override there would violate the scope.
export function partitionMatouGeometry(mesh,group,materialCount){
 if(group.minX===null)return null;
 mesh.updateWorldMatrix(true,false);
 const source=mesh.geometry,pos=source.getAttribute('position'),index=source.index;
 const vertexSelected=new Uint8Array(pos.count),point=new THREE.Vector3();
 for(let i=0;i<pos.count;i++)vertexSelected[i]=point.fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld).x>=group.minX-1e-6?1:0;
 const count=index?index.count:pos.count;
 const groups=materialCount>1&&source.groups.length?source.groups:[{start:0,count,materialIndex:0}];
 const parts=Array.from({length:materialCount*2},()=>[]);let selected=0,outside=0;
 for(const part of groups){
  for(let i=part.start;i<Math.min(count,part.start+part.count);i+=3){
   const a=index?index.getX(i):i,b=index?index.getX(i+1):i+1,c=index?index.getX(i+2):i+2;
   const inside=vertexSelected[a]&&vertexSelected[b]&&vertexSelected[c];
   parts[part.materialIndex+(inside?materialCount:0)].push(a,b,c);if(inside)selected++;else outside++;
  }
 }
 if(!outside)return null;
 if(!selected)throw new Error('Empty audited Matou selection: '+mesh.name);
 const geometry=source.clone();geometry.clearGroups();
 const reordered=new Uint32Array(count);let offset=0;
 for(let materialIndex=0;materialIndex<parts.length;materialIndex++){
  const part=parts[materialIndex];if(!part.length)continue;
  reordered.set(part,offset);geometry.addGroup(offset,part.length,materialIndex);offset+=part.length;
 }
 if(offset!==count){geometry.dispose();throw new Error('Incomplete Matou triangle partition: '+mesh.name);}
 geometry.setIndex(new THREE.BufferAttribute(reordered,1));
 geometry.userData.matouPartition={selectedTriangles:selected,preservedTriangles:outside};
 return geometry;
}

export function attachMatouStudy(mesh,sourceMasks,field,settings,{fallbackMaterial=mesh.material}={}){
 const group=byNode.get(mesh.name);if(!group)throw new Error('Not an audited riverside Matou node: '+mesh.name);
 if(!field)throw new Error('Missing local Matou soft-spill field: '+group.id);
 const masks=new Map();
 for(const rule of group.rules.filter(rule=>rule.node===mesh.name&&rule.role==='window')){
  const source=sourceMasks.get(rule.material);if(!source)throw new Error('Missing Matou window mask: '+rule.material);
  const mask=source.clone();mask.flipY=false;mask.wrapS=mask.wrapT=THREE.RepeatWrapping;mask.needsUpdate=true;masks.set(rule.material,mask);
 }
 const day=mesh.material,dayGeometry=mesh.geometry;
 const lighting=createBuildingLighting(mesh,group,new Map(),masks,{regionalPolicy:false,mode:'matou'});
 const spill=createSoftSpill(mesh,group,field,{regionalPolicy:false,disposeField:false});
 const converted=Array.isArray(mesh.material)?mesh.material:[mesh.material];
 const fallback=Array.isArray(fallbackMaterial)?fallbackMaterial:[fallbackMaterial];
 const partition=partitionMatouGeometry(mesh,group,converted.length);
 const night=partition?[...fallback,...converted]:mesh.material;
 mesh.material=day;
 function apply(snapshot){lighting.apply(snapshot,snapshot.lightEnabled!==false);spill.configure(snapshot.softSpill?.settings);spill.apply(snapshot.softSpill?.enabled===true,snapshot.lightEnabled!==false);}
 apply(settings);
 return {group:group.id,node:mesh.name,day,night,dayGeometry,nightGeometry:partition||dayGeometry,lighting,spill,apply,
  dispose(){spill.dispose();lighting.dispose();for(const mask of masks.values())mask.dispose();partition?.dispose();mesh.material=day;mesh.geometry=dayGeometry;}};
}
