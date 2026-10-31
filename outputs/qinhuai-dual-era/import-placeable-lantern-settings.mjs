import {normalizeLantern,readLanternRecord,saveLantern} from './import-lantern-settings.mjs';

export const PLACED_LANTERN_KEY='qinhuai.scene-lantern-placements.v1';
export const PLACEABLE_LANTERNS=[
 {id:'column',name:'柱台灯',url:'./assets/placeable-lanterns/column-five.glb'},
 {id:'rack',name:'灯架灯',url:'./assets/placeable-lanterns/rack-five.glb'},
 {id:'pink',name:'粉花灯',url:'./assets/placeable-lanterns/pink-five.glb'},
 {id:'drum',name:'鼓灯',url:'./assets/placeable-lanterns/drum-five.glb'},
 ...[
  ['lion','狮子灯','lion','xz',2.5*.3212121212121212],
  ['mountain','鳖山灯','mountain','xz',13*.3212121212121212],
  ['lotus-main','水中荷花灯 · 主灯','lotus-main','xz',.6*.3212121212121212],
  ['lotus-one','水中荷花灯 · 小灯','lotus-one','xz',.6*.3212121212121212],
  ['chrysanthemum','菊水灯','chrysanthemum','xz',.65*.3212121212121212],
  ['fish','金鱼灯','fish','xz',2.8*.3212121212121212],
  ['gongming','功名灯','gongming','x',9*.3212121212121212],
  ['tengma','腾马灯','tengma','y',2.2*.3212121212121212],
  ['woman','女灯','woman','y',9*.3212121212121212],
  ['rack-green','灯架绿灯','green','y',.55],['rack-blue','灯架蓝灯','blue','y',.55],
  ['rack-gold','灯架金灯笼','gold','y',.55],['rack-red','灯架红灯笼','red','y',.55],
  ['tree','树上金灯笼','gold','y',.62*.3212121212121212],
  ['courtyard','庭院金灯笼','gold','y',.62*.3212121212121212],
  ['red','檐下红灯笼','red','y',.55],['street','灯笼路灯','streetlamp','y',1.24],
  ['hanging','吊灯','hanging','y',.55],['crane','仙鹤灯','crane','y',.8]
 ].map(([id,name,asset,axis,size])=>({id,name,axis,size,url:id==='chrysanthemum'?'./assets/chrysanthemum-four-faces/five.glb':`./assets/lantern-quality/five/${asset}.glb`}))
];
export const MAX_PLACED_LANTERNS=500;
const number=(v,fallback,min,max)=>typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(min,v)):fallback;
export function normalizePlacedLanterns(value){
 const instances=[],ids=new Set();
 if(value?.version!==1||!Array.isArray(value.instances))return {version:1,instances};
 for(const item of value.instances){
  if(!item||!PLACEABLE_LANTERNS.some(k=>k.id===item.kind)||typeof item.id!=='string'||!item.id||item.id.length>100||ids.has(item.id))continue;
  ids.add(item.id);
  const record={id:item.id,kind:item.kind};
  for(const axis of ['x','y','z'])record[axis]=number(item[axis],0,-10000,10000);
  for(const axis of ['rx','ry','rz'])record[axis]=number(item[axis],0,-36000,36000);
  record.scale=number(item.scale,1,.05,20);
  if(item.lighting&&typeof item.lighting==='object')record.lighting=normalizeLantern(item.lighting);
  instances.push(record);if(instances.length===MAX_PLACED_LANTERNS)break;
 }
 return {version:1,instances};
}
export function readPlacedLanterns(storage){
 try{return normalizePlacedLanterns(JSON.parse(storage?.getItem(PLACED_LANTERN_KEY)||'null'));}
 catch{return normalizePlacedLanterns(null);}
}
export function savePlacedLanterns(storage,record){
 try{if(!storage)return false;storage.setItem(PLACED_LANTERN_KEY,JSON.stringify(normalizePlacedLanterns(record)));return true;}
 catch{return false;}
}
// Preserve legacy per-instance choices without overwriting an existing shared group.
export function migratePlacedLanternLighting(storage){
 const record=readLanternRecord(storage);
 for(const item of readPlacedLanterns(storage).instances){
  if(!item.lighting||Object.hasOwn(record.groups,item.kind))continue;
  record.groups[item.kind]=normalizeLantern(item.lighting);
  saveLantern(storage,item.kind,record.groups[item.kind]);
 }
 return record;
}
