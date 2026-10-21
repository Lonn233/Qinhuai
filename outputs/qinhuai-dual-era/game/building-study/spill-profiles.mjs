// Independent additive layer; complete saved studies include its settings as a separate snapshot.
export const SPILL_DEFAULTS={preset:'gentle',intensity:.42,horizontal:.58,down:.72,up:.13,falloff:1,color:'#e6ad65',surface:'both',region:'all',centerX:50,centerZ:50,width:100,depth:100,minHeight:0,maxHeight:100,edge:8};
export const SPILL_PRESETS=[
 {id:'gentle',name:'近檐柔光',description:'接近原外溢效果，柔和、克制',values:{}},
 {id:'narrow',name:'收束檐下',description:'窄范围照亮檐底，不铺满墙面',values:{horizontal:.28,down:.40,up:.06,intensity:.40,falloff:1.25}},
 {id:'broad',name:'宽幅漫射',description:'扩大檐角与墙面的柔光过渡',values:{horizontal:1.05,down:1.25,up:.15,intensity:.50,falloff:.85}},
 {id:'wall',name:'向下洗墙',description:'更多柔光沿立面向下延伸',values:{horizontal:.70,down:1.70,up:.08,intensity:.52,surface:'walls'}},
 {id:'background',name:'低亮背景',description:'低亮度、宽范围的背景建筑氛围',values:{horizontal:.85,down:1.10,up:.10,intensity:.22,falloff:.9}},
 {id:'local',name:'局部柔照',description:'只照中央区域，可继续修改位置与大小',values:{horizontal:.75,down:1,up:.10,intensity:.48,region:'custom',width:45,depth:65}}
];
export const SPILL_CONTROLS=[
 ['intensity','外溢亮度',0,1.5,.01,'倍','只控制新增柔光，不改变原有建筑亮度。'],
 ['horizontal','横向扩散半径',.15,1.5,.01,'场景单位','檐口向两侧扩散的距离；不是硬切光圈。'],
 ['down','向下照射距离',.15,2.2,.01,'场景单位','增加后照亮更多檐下墙面。'],
 ['up','向上溢光距离',.03,.25,.01,'场景单位','保持较低以避免屋顶顶面发亮。'],
 ['falloff','边缘衰减',.5,2,.05,'','越大越集中；越小过渡越宽柔。'],
 ['edge','区域边缘柔化',1,25,1,'%','仅作用于区域限制的过渡边缘。']
];
export const SPILL_REGION_CONTROLS=[
 ['centerX','区域横向中心',0,100,1,'%'],['centerZ','区域纵向中心',0,100,1,'%'],
 ['width','区域宽度',5,100,1,'%'],['depth','区域深度',5,100,1,'%'],
 ['minHeight','最低作用高度',0,100,1,'%'],['maxHeight','最高作用高度',0,100,1,'%']
];
export const SPILL_STORAGE='qinhuai-building-soft-spill-v2';
export function normalizeSpill(value={}){
 const s={...SPILL_DEFAULTS,...value};
 for(const [key,,min,max] of [...SPILL_CONTROLS,...SPILL_REGION_CONTROLS]){const n=Number(s[key]);s[key]=Number.isFinite(n)?Math.max(min,Math.min(max,n)):SPILL_DEFAULTS[key];}
 if(s.minHeight>s.maxHeight)[s.minHeight,s.maxHeight]=[s.maxHeight,s.minHeight];
 if(!['all','front','back','left','right','custom'].includes(s.region))s.region='all';
 if(!['both','eaves','walls'].includes(s.surface))s.surface='both';
 if(!/^#[0-9a-f]{6}$/i.test(s.color))s.color=SPILL_DEFAULTS.color;
 if(!SPILL_PRESETS.some(p=>p.id===s.preset))s.preset='gentle';
 return s;
}
export function spillPreset(id){const p=SPILL_PRESETS.find(p=>p.id===id)||SPILL_PRESETS[0];return normalizeSpill({...SPILL_DEFAULTS,...p.values,preset:p.id});}
