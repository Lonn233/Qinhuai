export const CONFIG = Object.freeze({
  // 仅用于统一游戏内模型比例，不替代实物尺寸。
  frame: { bigRingRadius: .84, mouthRingRadius: .38, bigRingHeight: .56, mouthRingHeight: 1.08, verticalRibCount: 3 },
  petals: { layers: 4, perLayer: 6, count: 24 },
  leafCount: 12, flowerCount: 5, dryDuration: 3500,
  colors: { petalBase: '#D98FAC', petalMid: '#EEB0C5', petalTip: '#C97193', petalUndyed: '#F5E9ED', calyx: '#3D6A43', bamboo: '#A9A477', binding: '#E4DCCB', innerLining: '#8B293E' }
});
export const TOOLS = [
  {id:'bamboo',name:'竹篾',key:'1',symbol:'竹'}, {id:'string',name:'纸捻 / 铜丝',key:'2',symbol:'结'},
  {id:'dye',name:'染纸',key:'3',symbol:'染'}, {id:'press',name:'压模',key:'4',symbol:'模'},
  {id:'paste',name:'浆糊粘贴',key:'5',symbol:'合'}, {id:'light',name:'放蜡烛',key:'6',symbol:'灯'}
];
export const PHASES = ['扎框子','裱糊','制作花瓣','粘贴花瓣','装花头与蜡烛'];
export const STAGES = [
  {id:'bamboo_prep',phase:0,name:'制作大圈和小圈',short:'弯制大小圈',tool:'bamboo',total:2,station:'bamboo',action:'弯制并用棉花纸捻捆扎一只竹圈',unit:'只',hint:'用 62 厘米长条弯制大圈，再用适当长度的长条弯制小圈。首尾预留约 1 厘米搭接，并用棉花纸捻捆扎。另备齐三根 40 厘米长条。'},
  {id:'frame_assembly',phase:0,name:'固定三根弧形骨架',short:'固定弧形骨架',tool:'bamboo',total:3,station:'assembly',action:'弯好并捆扎一根 40 厘米弧形骨架',unit:'根',hint:'将三根 40 厘米长条分别弯成弧形；每根两端均用棉花纸捻捆扎。大圈固定在弧形长条靠上的位置。'},
  {id:'frame_short_binding',phase:0,name:'固定小圈和花头支架',short:'固定小圈与支架',tool:'string',total:2,station:'assembly',action:'固定小圈或铁丝花头支架',unit:'项',hint:'将小圈固定在三根弧形长条的顶端；再用铁丝制作并固定后续安装成品花头的支架。'},
  {id:'lining_lower',phase:1,name:'贴半圆形无纺布',short:'贴无纺布',tool:'paste',total:6,station:'assembly',action:'用浆糊贴合一片半圆形无纺布',unit:'片',hint:'先均匀涂浆糊，再按骨架形状分片贴半圆形无纺布。布片需要顺着骨架调整方向，不能只向同一方向粘贴。'},
  {id:'lining_upper',phase:1,name:'贴裱布并修边',short:'贴裱布',tool:'paste',total:6,station:'assembly',action:'用浆糊贴合一片裱布',unit:'片',hint:'无纺布贴牢并修剪多余边缘后，继续贴上层裱布，使灯体覆盖平整完整。'},
  {id:'paper_dye',phase:2,name:'染花瓣纸',short:'染花瓣纸',tool:'dye',total:4,station:'dye',action:'将一批花瓣纸染成粉红色',unit:'批',hint:'将花瓣纸浸入粉红色染料，通常浸泡 2 至 3 分钟；本原型将等待时间缩短为数秒。'},
  {id:'paper_drying',phase:2,name:'阴干花瓣纸',short:'阴干',tool:null,total:1,station:'dye',action:'等待花瓣纸完全阴干',unit:'次',hint:'把染好的花瓣纸放在阴凉通风处自然阴干，不直接暴晒。完全干透后才能压模。'},
  {id:'petal_pressing',phase:2,name:'压模花瓣纸',short:'压模',tool:'press',total:4,station:'press',action:'用压模器压出一批花瓣纹理',unit:'批',hint:'纸贴合在压模器轴上，用白线沿轴一圈圈缠绕。竖直摆放后用小锤敲击上方平台压缩，再向上拉起平台，解线取出纸张。'},
  {id:'petal_shaping',phase:2,name:'折扎成花瓣',short:'折扎花瓣',tool:'string',total:4,station:'press',action:'将两张压模纸叠放并用铜丝折扎成花瓣',unit:'批',hint:'每片花瓣由两张压模后的花瓣纸叠在一起，捏住一角后用铜丝捆扎固定。绿色叶片直接使用成品。'},
  {id:'petal_assembly',phase:3,name:'粘贴四层粉色花瓣',short:'贴粉色花瓣',tool:'paste',total:24,station:'assembly',action:'用浆糊粘贴下一片粉色花瓣',unit:'片',hint:'第一层贴 6 片；随后从上层两片花瓣之间偏下的位置错开粘贴。共四层，每层六片。'},
  {id:'calyx_assembly',phase:3,name:'粘贴两层成品绿叶',short:'贴成品绿叶',tool:'paste',total:12,station:'assembly',action:'用浆糊粘贴一片成品绿色叶片',unit:'片',hint:'将成品绿色叶片粘贴在花灯下部，共两层；最底层反向粘贴，使底部自然收拢。'},
  {id:'top_flower_assembly',phase:4,name:'安装五个成品花头',short:'装成品花头',tool:'paste',total:5,station:'assembly',action:'将一组花茎和成品花头固定到铁丝支架',unit:'组',hint:'将花茎根部插入预留铁丝支架，再固定成品花头。按上三、下二布置五个花头，并整理花头、花瓣与叶片。'},
  {id:'candle_installation',phase:4,name:'放入并固定蜡烛',short:'放蜡烛',tool:'light',total:1,station:'assembly',action:'将蜡烛放入花灯内部',unit:'支',hint:'将蜡烛放入灯体内部并固定，完成荷花灯。游戏内试灯仅作视觉演示。'},
  {id:'final_inspection',phase:4,name:'整理并试灯',short:'整理试灯',tool:'light',total:1,station:'assembly',action:'检查花灯形态并试灯',unit:'次',hint:'检查花头、花瓣与绿色叶片的位置，调整整体造型后试灯。'}
];
export const PAPER_IDS=Array.from({length:CONFIG.petals.count},(_,i)=>`petal-layer-${String(Math.floor(i/CONFIG.petals.perLayer)+1).padStart(2,'0')}-${String(i%CONFIG.petals.perLayer+1).padStart(2,'0')}`);
export const LEAF_IDS=Array.from({length:CONFIG.leafCount},(_,i)=>`finished-leaf-${i+1}`);
export const LEGACY_STORAGE_KEY='qinhuai-lotus-workshop-v1';
export const STORAGE_KEY='qinhuai-lotus-workshop-v3';
