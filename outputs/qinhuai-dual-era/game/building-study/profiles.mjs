export const STORAGE_KEY='qinhuai.building-light-studies.v1';
export const PRESETS=Object.freeze([
 {id:'reference',name:'原景琥珀',short:'对照现有夜景',description:'复用原景檐口光场，琥珀色沿瓦面渐隐，墙柱收暗。',brightness:1,color:'#e09a45',eave:1.26,roof:.084,facade:.13,window:.55,width:1.4,bloom:.12},
 {id:'eaves',name:'金檐暗瓦',short:'亮檐口 · 暗屋面',description:'金色集中于飞檐、屋脊和转角，瓦面中部保持暗色，檐底不通体发亮。',brightness:1,color:'#ffb52e',eave:2.5,roof:.025,facade:.10,window:.65,width:2.6,bloom:.15},
 {id:'wash',name:'金光渐染',short:'柔光铺瓦 · 纹理可见',description:'较宽的金色柔光由檐口铺向上侧瓦面，保留瓦缝和屋面明暗。',brightness:1,color:'#ffbb48',eave:2.05,roof:.14,facade:.17,window:.7,width:1.1,bloom:.16},
 {id:'amber',name:'沉金层次',short:'浓金色 · 深瓦缝',description:'偏深的琥珀金勾出重檐，压低墙面与屋顶中部，突出层叠关系。',brightness:1,color:'#ff9b26',eave:2.8,roof:.06,facade:.12,window:.65,width:1.9,bloom:.12},
 {id:'festival',name:'盛典金辉',short:'主体更亮 · 庭院克制',description:'增加主体檐口和窗格亮度，屋顶渐亮但不整体泛黄，适合远景比较。',brightness:1,color:'#ffbc51',eave:3.4,roof:.18,facade:.21,window:1.05,width:1.35,bloom:.20},
 {id:'quiet',name:'静夜暖檐',short:'低照度 · 古建质感',description:'暖光轻扫檐口，压低墙柱与窗光，保留自然夜间的暗部。',brightness:1,color:'#dfa05a',eave:.95,roof:.035,facade:.07,window:.38,width:2.0,bloom:.07}
].map(p=>({...p,...extraDefaults(p)})));

// Extended defaults reproduce the original six presets; old saves migrate here.
export function extraDefaults(p={}){
 return {ridgeGain:1,underside:0,transition:0,textureContrast:.85,textureRetention:1,
  roofColor:p.color??'#e09a45',sign:(p.window??.55)*.55,facadeColor:p.color??'#e09a45',windowColor:p.color??'#e09a45',trimColor:p.windowColor??p.color??'#e09a45',
  bloomRadius:.48,bloomThreshold:.8,exposure:.86,ambient:.36,moon:.48};
}
export const CONTROL_GROUPS=[
 {title:'01 / 亮度分区',open:true,help:'整体倍率保留各区域比例；匾额现在可独立于窗格调整。',controls:[
  ['brightness','建筑整体亮度',0,2.5,.01,'%'],['eave','檐口轮廓亮度',0,5,.01],
  ['roof','屋面中部柔光',0,.5,.005],['facade','墙柱辅光',0,.5,.005],
  ['window','窗格透光',0,2,.01],['sign','匾额亮度',0,2,.01]]},
 {title:'02 / 光线分布与瓦面',open:false,help:'上部加强按每个屋顶的实际高度渐变分区，并非单独识别每条屋脊。檐底默认不发光。',controls:[
  ['ridgeGain','屋顶上部轮廓倍率',0,3,.01],['width','檐光收束（越大越窄）',.1,4,.05],
  ['transition','边缘柔化',0,1,.01,'%'],['underside','檐底微光',0,.25,.005],
  ['textureContrast','瓦缝明暗对比',.25,2,.01],['textureRetention','原瓦面颜色保留',0,1,.01,'%']]},
 {title:'03 / 光晕与过曝控制',open:false,help:'阈值越高，越只有明亮部位产生光晕；半径改变光晕扩散，不改变灯光分布。',controls:[
  ['bloom','光晕强度',0,.4,.01],['bloomRadius','光晕扩散半径',0,1,.01],['bloomThreshold','光晕起亮阈值',0,3,.01]]},
 {title:'04 / 查看环境',open:false,help:'仅影响本试灯页。曝光会改变整幅画面；补光用于观察暗部，与建筑发光分别控制。',controls:[
  ['exposure','画面曝光',.25,2,.01],['ambient','环境补光',0,1.5,.01],['moon','月光强度',0,2,.01]]}
];
export const COLOR_CONTROLS=[['color','檐口轮廓光色'],['roofColor','屋面柔光颜色'],['facadeColor','墙柱光色'],['windowColor','窗格 / 匾额光色'],['trimColor','墙顶压边光色']];
export const NUMERIC_CONTROLS=CONTROL_GROUPS.flatMap(g=>g.controls);
export function normalizeSettings(s){
 if(!s||typeof s!=='object')return s;
 const defaults={brightness:1,...extraDefaults(s)},out={...s};
 for(const [key,value] of Object.entries(defaults))if(out[key]===undefined)out[key]=value;
 return out;
}
export function validSettings(s){
 return !!s&&COLOR_CONTROLS.every(([key])=>/^#[0-9a-f]{6}$/i.test(s[key]))
  &&NUMERIC_CONTROLS.every(([key,,min,max])=>Number.isFinite(s[key])&&s[key]>=min&&s[key]<=max)
  &&PRESETS.some(p=>p.id===s.id);
}
export function readSaved(raw){
 try{
  const d=JSON.parse(raw);if(d?.version!==1||!Array.isArray(d.items))return [];
  const ids=new Set();return d.items.map(normalizeSettings).filter(s=>{
   if(!s||typeof s.key!=='string'||ids.has(s.key)||typeof s.label!=='string'||!s.label.trim()||s.label.length>40||!validSettings(s))return false;
   ids.add(s.key);return true;
  }).slice(0,50);
 }catch{return [];}
}
