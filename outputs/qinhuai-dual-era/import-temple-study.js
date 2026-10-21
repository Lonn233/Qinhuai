import * as THREE from 'three';
import manifest from './assets/building-study/temple/manifest.json' with {type:'json'};
import projectSaved from './assets/building-study/temple/saved-lighting.json' with {type:'json'};
import {createBuildingLighting} from './game/building-study/lighting.js';
import {PRESETS,STORAGE_KEY,readSaved} from './game/building-study/profiles.mjs';
export const TEMPLE_STUDY_PRESET=PRESETS[0];
export const TEMPLE_SAVED_LABEL='原景琥珀 · 自定';
const normalizeLabel=s=>s.replace(/\s+/g,'');
const findSaved=items=>items.filter(s=>normalizeLabel(s.label)===normalizeLabel(TEMPLE_SAVED_LABEL)).at(-1);
// Exact recovered favorite, not a reconstruction from its name or screenshot.
export const PROJECT_TEMPLE_STUDY=Object.freeze(findSaved(readSaved(JSON.stringify(projectSaved))));
export function resolveTempleStudy(storage,{useProjectSaved=true}={}){
 try{
  const items=readSaved(storage?.getItem(STORAGE_KEY));
  const saved=findSaved(items);
  if(saved)return {settings:{...saved},saved:true,source:'browser',label:saved.label,key:saved.key};
 }catch{}
 if(useProjectSaved&&PROJECT_TEMPLE_STUDY)return {settings:{...PROJECT_TEMPLE_STUDY},saved:true,source:'project',label:PROJECT_TEMPLE_STUDY.label+'（项目备份）',key:PROJECT_TEMPLE_STUDY.key};
 // Missing browser storage must not turn off landmarks. Keep saved zero values above.
 return {settings:{...TEMPLE_STUDY_PRESET},saved:false,source:'default',label:'原景琥珀（默认；未读取到自定方案）',key:null};
}
export function readTempleStudy(options){
 try{return resolveTempleStudy(globalThis.localStorage,options);}catch{return resolveTempleStudy(null,options);}
}
export const TEMPLE_STUDY_NODES=new Set(manifest.nodes);
// Reuse the city light fields (same source-world bounds), without loading the
// standalone GLB or changing city exposure, bloom, weather or other landmarks.
export function attachTempleStudy(mesh,fields,sourceMasks,settings){
 const masks=new Map();
 for(const name of Object.keys(manifest.masks)){
  const source=sourceMasks.get(name);if(!source)continue;
  const mask=source.clone();mask.flipY=false;mask.wrapS=mask.wrapT=THREE.RepeatWrapping;mask.needsUpdate=true;masks.set(name,mask);
 }
 const day=mesh.material;
 const lighting=createBuildingLighting(mesh,manifest,fields,masks);
 lighting.apply(settings);
 const night=mesh.material;mesh.material=day;
 return {day,night,lighting,dispose(){lighting.dispose();for(const mask of masks.values())mask.dispose();}};
}

// Explicit landmark allowlist: neighboring shop windows share materials but
// are not part of the pavilion. Never classify the entire tile by material name.
export const PAVILION_STUDY_NODES=new Set(['FuziTemple0870','FuziTemple0874','FuziTemple0876']);
export function attachPavilionStudy(mesh,rules,bounds,fields,settings){
 if(!PAVILION_STUDY_NODES.has(mesh.name))throw new Error('Not a pavilion lighting node');
 const manifest={rules:rules.map(rule=>({...rule,bounds,role:rule.role==='pavilionWood'?'templeFacade':rule.role}))};
 const day=mesh.material;
 const lighting=createBuildingLighting(mesh,manifest,fields,new Map(),{regionalPolicy:false});
 lighting.apply(settings);
 const night=mesh.material;mesh.material=day;
 return {day,night,lighting,dispose(){lighting.dispose();}};
}
