// Additive per-group settings. Absence of a record leaves the current scene intact.
export const LANTERN_LIGHT_KEY='qinhuai.main-lantern-lights.v1';
export const LANTERN_GROUPS=[
 ['boat','秦淮游船灯','boats'],['mountain','鳖山灯','festivalMountain'],['lion','瑞狮灯','festivalLions'],
 ['lotus-main','荷花灯 · 主灯','festivalWater'],['lotus-one','荷花灯 · 小灯','festivalWater'],['chrysanthemum','菊水灯','festivalWater'],
 ['fish','金鱼灯 · 殿宇正面','temple'],['woman','女灯 · 龙墙临水','dragonWall'],['gongming','贡院题名灯','gate'],['tengma','腾马灯 · 贡院题名灯前','gate'],
 ['rack-green','庭院灯架 · 绿灯','courtyard'],['rack-blue','庭院灯架 · 蓝灯','courtyard'],['rack-gold','庭院灯架 · 金灯笼','courtyard'],['rack-red','庭院灯架 · 红灯笼','courtyard'],
 ['tree','树上金灯笼','gate'],['courtyard','庭院树阵与吊网金灯笼','courtyard'],['red','檐下红灯笼','redLanterns'],['street','沿街灯笼路灯','streetlamps'],
 ['column','柱台灯',null],['rack','灯架灯',null],['pink','粉花灯',null],['drum','鼓灯',null],['hanging','吊灯',null],['crane','仙鹤灯',null]
];
export const LANTERN_POSITIONED_LIGHTS=Object.freeze([
 {id:'tengma-left',label:'腾马灯 · 左侧',kind:'tengma',instance:0,defaults:{x:-7.2,y:11.8644,z:-13.7,yaw:-90}},
 {id:'tengma-right',label:'腾马灯 · 右侧',kind:'tengma',instance:1,defaults:{x:-3.4,y:11.8644,z:-13.7,yaw:90}},
]);
const object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
const number=(v,d,min,max)=>typeof v==='number'&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):d;
const color=(v,d)=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v)?v.toLowerCase():d;
export function normalizeLanternTransforms(value={}){
 const transforms=object(value);
 return Object.fromEntries(LANTERN_POSITIONED_LIGHTS.map(def=>{
  const p=object(transforms[def.id]),d=def.defaults;
  return [def.id,{x:number(p.x,d.x,-100,100),y:number(p.y,d.y,0,100),z:number(p.z,d.z,-100,100),yaw:number(p.yaw,d.yaw,-360,360)}];
 }));
}
export function normalizeLantern(value={}){
 const v=object(value),s=object(v.spill);
 return {...v,modelVisible:v.modelVisible!==false,enabled:typeof v.enabled==='boolean'?v.enabled:true,brightness:number(v.brightness,1,0,8),
  inheritColor:v.inheritColor!==false,color:color(v.color,'#fff0dc'),halo:number(v.halo,1,0,3),
  spill:{...s,enabled:s.enabled===true,inheritColor:s.inheritColor!==false,color:color(s.color,'#ffcf87'),
   intensity:number(s.intensity,.4,0,3),distance:number(s.distance,4,0,20),decayDistance:number(s.decayDistance,2,0,15),feather:number(s.feather,.7,0,1)}};
}
export function readLanternRecord(storage){
 try{const r=JSON.parse(storage?.getItem(LANTERN_LIGHT_KEY)||'null');if(r?.version===1)return {...r,groups:object(r.groups),presets:Array.isArray(r.presets)?r.presets:[],transforms:normalizeLanternTransforms(r.transforms)};}catch{}
 return {version:1,groups:{},presets:[],transforms:normalizeLanternTransforms()};
}
export function saveLantern(storage,id,value,preset){
 if(!storage)return false;
 try{const r=readLanternRecord(storage),old=object(r.groups[id]),s=normalizeLantern(value);
  r.groups[id]={...old,...s,spill:{...object(old.spill),...s.spill}};
  if(preset)r.presets.push({...preset,group:id,settings:r.groups[id]});
  storage.setItem(LANTERN_LIGHT_KEY,JSON.stringify(r));return true;
 }catch{return false;}
}
export function saveLanternTransforms(storage,transforms){
 if(!storage)return false;
 try{const r=readLanternRecord(storage);r.transforms=normalizeLanternTransforms(transforms);storage.setItem(LANTERN_LIGHT_KEY,JSON.stringify(r));return true;}catch{return false;}
}
// The multiplier is intentionally one by default, rather than a guessed replacement power.
export function lampSetting(layer,id){return layer.lightControls?.[id]||normalizeLantern();}
export function lampGain(p){return p.enabled&&p.modelVisible!==false?p.brightness:0;}
export function applyClothLight(layer,id,entry,active){
 const p=lampSetting(layer,id);entry.uniforms.uClothPower.value=active?entry.tuning.power*lampGain(p):0;
 entry.uniforms.uClothTint.value.set(p.inheritColor?entry.tuning.color:p.color);
}
