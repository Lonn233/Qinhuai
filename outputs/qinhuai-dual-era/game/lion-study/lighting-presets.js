import * as THREE from 'three';

export const presets=[
 {name:'原色微光',description:'低亮度透光，保留最深的彩绘颜色与布面细节。',short:'最克制 · 原色优先',power:.24,tint:[1,.98,.95],shape:.08,bloom:.035,radius:.35,spill:1.0},
 {name:'均匀柔光',description:'全身透光，原色均匀亮起，保留彩绘深浅。',short:'均匀透亮 · 柔和自然',power:.53,tint:[1,.97,.92],shape:.04,bloom:.09,radius:.45,spill:1.6},
 {name:'暖纱透光',description:'微暖的内部光透过彩纱，红金色温润，暗纹依然清晰。',short:'微暖色温 · 彩纱质感',power:.48,tint:[1,.72,.52],shape:.1,bloom:.13,radius:.55,spill:1.9},
 {name:'立体漫光',description:'凸起处略亮，纹理与褶皱柔和收暗，整个灯体仍保持透光。',short:'明暗层次 · 强调造型',power:.60,tint:[1,.94,.86],shape:.85,bloom:.08,radius:.45,spill:1.5},
 {name:'柔晕夜灯',description:'原色透光外加一层轻薄光晕，远看更有夜间花灯感。',short:'轻柔外晕 · 夜景氛围',power:.65,tint:[1,.94,.86],shape:.12,bloom:.28,radius:.85,spill:2.3},
 {name:'柔彩透亮',description:'在柔晕夜灯之上适度提亮，彩绘保持温润，整个灯体透出柔和亮光。',short:'中间亮度Ⅰ · 温润透光',power:.88,tint:[1,.953,.887],shape:.10,bloom:.23,radius:.75,spill:2.6,threshold:.63},
 {name:'盈彩明灯',description:'比柔彩透亮更明亮，接近通体彩光，兼顾彩纱层次与柔和外晕。',short:'中间亮度Ⅱ · 明亮有层次',power:1.12,tint:[1,.967,.913],shape:.08,bloom:.18,radius:.65,spill:2.9,threshold:.69},
 {name:'通体彩光',description:'明显提高整个灯体的透光亮度，山体、龙头与塔身一起亮起，保留彩绘颜色。',short:'新增较亮 · 通体透亮',power:1.35,tint:[1,.98,.94],shape:.06,bloom:.14,radius:.55,spill:3.2,threshold:.75},
 {name:'盛景辉光',description:'更明亮的彩色灯体配合柔和外晕，让大型灯组在夜景中更醒目。',short:'新增更亮 · 柔晕灯山',power:1.75,tint:[1,.98,.95],shape:.10,bloom:.16,radius:.62,spill:3.8,threshold:.85}
];
presets.forEach(p=>{p.color='#'+new THREE.Color().setRGB(...p.tint).getHexString();});
