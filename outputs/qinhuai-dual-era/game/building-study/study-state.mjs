import {normalizeManualSpill} from './manual-spill-profiles.mjs';
import {normalizeSurfaceSpill} from './surface-spill-profiles.mjs';
import {normalizeWindowLight} from './window-light.mjs';
import {normalizeSettings,validSettings} from './profiles.mjs';
import {normalizeSpill} from './spill-profiles.mjs';
export const CURRENT_STUDIES_KEY='qinhuai.building-light-current.v1';
const buildings=new Set(['temple','pavilion','matou']);
// Named schemes and per-building drafts use the same complete snapshot.
export function captureStudy(settings,spillSettings,softSpillEnabled,enabled,building,windowLight,surfaceSpill,manualSpill){
 return {...normalizeSettings(settings),manualSpill:normalizeManualSpill(manualSpill),windowLight:normalizeWindowLight(windowLight),surfaceSpill:normalizeSurfaceSpill(surfaceSpill),building,lightEnabled:enabled!==false,softSpill:{enabled:softSpillEnabled===true,settings:normalizeSpill(spillSettings)}};
}
export function hasSavedSpill(snapshot){return !!snapshot?.softSpill&&typeof snapshot.softSpill.settings==='object'&&snapshot.softSpill.settings!==null&&!Array.isArray(snapshot.softSpill.settings);}
export function restoreStudy(snapshot,current){
 const {softSpill,lightEnabled,building,windowLight,surfaceSpill,manualSpill,...base}=snapshot;
 return {manualSpill:normalizeManualSpill(current.building&&building&&current.building!==building?current.manualSpill:(manualSpill??current.manualSpill)),surfaceSpill:normalizeSurfaceSpill(surfaceSpill),windowLight:normalizeWindowLight(windowLight),settings:normalizeSettings(base),spillSettings:hasSavedSpill(snapshot)?normalizeSpill(softSpill.settings):{...current.spillSettings},softSpillEnabled:hasSavedSpill(snapshot)?softSpill.enabled===true:current.softSpillEnabled,enabled:typeof lightEnabled==='boolean'?lightEnabled:current.enabled};
}
export function readStudyDraft(building,storage){
 try{const data=JSON.parse((storage??globalThis.localStorage).getItem(CURRENT_STUDIES_KEY));const snapshot=data?.version===1?data.buildings?.[building]:null;return buildings.has(building)&&snapshot&&validSettings(normalizeSettings(snapshot))&&hasSavedSpill(snapshot)?snapshot:null;}catch{return null;}
}
export function saveStudyDraft(building,snapshot,storage){
 try{if(!buildings.has(building))return false;storage??=globalThis.localStorage;const raw=storage.getItem(CURRENT_STUDIES_KEY);let data;try{data=JSON.parse(raw);}catch{}if(data?.version!==1||!data.buildings||typeof data.buildings!=='object'||Array.isArray(data.buildings))data={version:1,buildings:{}};data.buildings[building]=snapshot;const next=JSON.stringify(data);if(next!==raw)storage.setItem(CURRENT_STUDIES_KEY,next);return true;}catch{return false;}
}
