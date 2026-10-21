import {normalizeSurfaceSpill} from './surface-spill-profiles.mjs';
import {normalizeWindowLight} from './window-light.mjs';
// Independent, user-placed real spotlights. Positions use the study model world space.
export const MANUAL_SPILL_KEY='qinhuai.building-manual-spill.v1';
export const MAX_MANUAL_POINTS=8,MAX_MANUAL_SHADOWS=2;
export const MANUAL_PRESETS=[
 {id:'eave',name:'檐下柔金',description:'暖金色、贴近檐底的连续柔光',values:{intensity:1.1,distance:4,angle:110,penumbra:1,elevation:-65,color:'#e3a659'}},
 {id:'wide',name:'宽幅外溢',description:'光斑更宽、柔和照亮附近墙面与环境',values:{intensity:1.8,distance:8,angle:145,penumbra:1,elevation:-55,color:'#e8b976'}},
 {id:'wash',name:'向下洗墙',description:'光线朝下，形成柔和的立面明暗渐变',values:{intensity:1.5,distance:6,angle:85,penumbra:.85,elevation:-75,color:'#d99b50'}},
 {id:'ambient',name:'低亮氛围',description:'弱光大范围外溢，不抢主体花灯',values:{intensity:.45,distance:10,angle:150,penumbra:1,elevation:-50,color:'#b88754'}}
];
export const MANUAL_CONTROLS=[
 ['intensity','点位亮度',0,12,.05,'cd'],['distance','外溢照射范围',.5,30,.1,'m'],
 ['angle','光束全角',20,170,1,'°'],['penumbra','边缘柔化',0,1,.01,''],
 ['azimuth','水平偏转',-180,180,1,'°'],['elevation','上下偏转',-85,85,1,'°'],
 ['offset','离墙偏移',.03,1,.01,'m']
];
const DEFAULT_POINT={enabled:true,preset:'eave',intensity:1.1,distance:4,angle:110,penumbra:1,azimuth:0,elevation:-65,offset:.12,color:'#e3a659',shadows:false};
const finite=(n,fallback)=>typeof n==='number'&&Number.isFinite(n)?n:fallback;
function vector(value,fallback){return Array.isArray(value)&&value.length===3?value.map((n,i)=>Math.max(-100000,Math.min(100000,finite(n,fallback[i])))):[...fallback];}
export function normalizeManualPoint(value={},index=0){
 if(!value||typeof value!=='object')value={};const out={...DEFAULT_POINT};
 out.id=typeof value.id==='string'&&value.id.length?value.id.slice(0,80):'point-'+index;
 out.name=typeof value.name==='string'?value.name.slice(0,40):'外溢点 '+(index+1);
 out.position=vector(value.position,[0,0,0]);out.normal=vector(value.normal,[0,0,1]);
 const length=Math.hypot(...out.normal);out.normal=length>.00001?out.normal.map(n=>n/length):[0,0,1];
 for(const [key,,min,max] of MANUAL_CONTROLS)out[key]=Math.max(min,Math.min(max,finite(value[key],out[key])));
 for(const key of ['enabled','shadows'])if(typeof value[key]==='boolean')out[key]=value[key];
 if(/^#[0-9a-f]{6}$/i.test(value.color))out.color=value.color.toLowerCase();
 if(MANUAL_PRESETS.some(p=>p.id===value.preset))out.preset=value.preset;
 return out;
}
export function normalizeManualSpill(value){
 if(!value||typeof value!=='object')value={};const seen=new Set();
 const points=(Array.isArray(value.points)?value.points:[]).slice(0,MAX_MANUAL_POINTS).map(normalizeManualPoint).map((p,i)=>{if(seen.has(p.id))p.id='point-'+i+'-'+p.id;seen.add(p.id);return p;});
 return {enabled:value.enabled===true,preset:MANUAL_PRESETS.some(p=>p.id===value.preset)?value.preset:'eave',selectedId:points.some(p=>p.id===value.selectedId)?value.selectedId:points[0]?.id??null,points};
}
export function applyManualPreset(point,id){const preset=MANUAL_PRESETS.find(p=>p.id===id)||MANUAL_PRESETS[0];return normalizeManualPoint({...point,...preset.values,preset:preset.id});}
export function createManualPoint(position,normal,preset='eave',id='point-'+Date.now()){return applyManualPreset({id,position,normal,name:'外溢点',enabled:true},preset);}
// Keep optional linked lighting absent in legacy point-only schemes so loading
// old schemes does not reset the user's current window/exterior spill settings.
export function normalizeManualScheme(value){
 const out={key:String(value.key),label:String(value.label).slice(0,40),state:normalizeManualSpill(value.state)};
 if(value.surfaceSpill&&typeof value.surfaceSpill==='object'&&!Array.isArray(value.surfaceSpill))out.surfaceSpill=normalizeSurfaceSpill(value.surfaceSpill);
 if(value.windowLight&&typeof value.windowLight==='object'&&!Array.isArray(value.windowLight))out.windowLight=normalizeWindowLight(value.windowLight);
 return out;
}
export function readManualLibrary(building,storage){
 try{storage??=globalThis.localStorage;const data=JSON.parse(storage.getItem(MANUAL_SPILL_KEY)||'{}');return (Array.isArray(data[building])?data[building]:[]).slice(0,30).filter(s=>s&&typeof s.key==='string'&&typeof s.label==='string').map(normalizeManualScheme);}catch{return [];}
}
export function writeManualLibrary(building,items,storage){
 if(!['temple','pavilion','matou'].includes(building))return false;
 try{storage??=globalThis.localStorage;let data;try{data=JSON.parse(storage.getItem(MANUAL_SPILL_KEY)||'{}');}catch{}if(!data||typeof data!=='object'||Array.isArray(data))data={};
 data[building]=items.slice(0,30).map(normalizeManualScheme);storage.setItem(MANUAL_SPILL_KEY,JSON.stringify(data));return true;}catch{return false;}
}
