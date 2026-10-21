// Content is deliberately local and original; no unverified historical dates.
export const LANTERNS = [
 {id:'mountain',name:'鳖山灯',category:'灯山 · 集景灯彩',modelPath:'./game/assets/mountain.glb',description:'层层灯彩叠成一座小山，远看轮廓，近看细节。这盏灯沿用你提供的模型名称，让它成为河前灯市的第一处风景。',historicalNote:'本原型是灯会意境演绎，不作为特定年代灯会形制的考据。',height:3.9,width:4.4,rotation:Math.PI},
 {id:'lion',name:'瑞狮灯',category:'动物灯 · 瑞狮',modelPath:'./game/assets/lion.glb',description:'卷鬃、圆眼与舒展的鬃毛构成瑞狮的神态。金色灯面映着朱红谜签，把舞狮的热闹留在静静的一盏灯里。',height:2.6,width:3.4,rotation:Math.PI},
 {id:'fish',name:'金鱼灯',category:'动物灯 · 金鱼',modelPath:'./game/assets/fish.glb',description:'鱼尾舒展，金鳞映光。把鱼的轮廓做成灯，像将水里的游动带到了岸上；“鱼”与“余”同音，也寄托着丰足的心愿。',height:2.5,width:3.4,rotation:Math.PI},
 {id:'crane',name:'仙鹤纹灯',category:'纹样灯 · 仙鹤',modelPath:'./game/assets/crane.glb',description:'金色灯罩上，仙鹤纹样舒展双翼。暖光照亮细密的羽纹，让这盏仙鹤纹灯与河上的灯影相望。',height:3.0,width:3.5,rotation:Math.PI},
 {id:'lotus',name:'荷花灯',category:'花卉灯 · 荷花',modelPath:'./game/assets/lotus-main.glb',description:'层叠花瓣向外舒展，一点灯火落在花心。这里使用你原有的荷花灯模型；河面上还漂着另一款荷花灯，与岸上的展灯相呼应。',height:1.8,width:3.1,rotation:0},
];
export const RIDDLES = [
 {id:'riddle-mountain',title:'叠灯成山',riddle:'三竖一横紧相连，\n中间一竖高两边。',answerType:'打一汉字',acceptedAnswers:['山'],hint:'想一想高低起伏的山峰，再看看这个字的笔画。',explanation:'“山”字由三竖一横构成，中间一竖较高，像并立的山峰。',locationId:'quay-mountain',unlockLanternId:'mountain'},
 {id:'riddle-lion',title:'瑞兽迎春',riddle:'脖子围着大围巾，\n不是老虎也威风。\n草原之上张口吼，\n雄兽鬃毛最分明。',answerType:'打一动物',acceptedAnswers:['狮子','狮','雄狮','獅子','獅'],hint:'雄性长着一圈浓密的鬃毛，民间也用它的形象表演舞狮。',explanation:'雄狮颈部有浓密鬃毛，像一条围巾；谜底是狮子。',locationId:'quay-lion',unlockLanternId:'lion'},
 {id:'riddle-fish',title:'一尾流金',riddle:'身披金衣水里游，\n鼓着眼睛摆尾鳍。\n不在大海争风浪，\n常在缸中伴人居。',answerType:'打一观赏鱼',acceptedAnswers:['金鱼','金魚'],hint:'名字有两个字，第一个字也是一种贵金属。',explanation:'金鱼是常见的观赏鱼，金色鳞片、鼓眼和舒展的尾鳍正是谜面线索。',locationId:'quay-fish',unlockLanternId:'fish'},
 {id:'riddle-crane',title:'云间来客',riddle:'头顶一抹红，\n白羽映长空。\n细腿立浅水，\n长颈舞清风。',answerType:'打一鸟类',acceptedAnswers:['丹顶鹤','丹頂鶴','仙鹤','仙鶴','鹤','鶴'],hint:'它的头顶有红色的皮肤，所以名字里有“丹顶”。',explanation:'红色头顶、白羽、长颈和长腿指向丹顶鹤，也常被称为仙鹤。',locationId:'quay-crane',unlockLanternId:'crane'},
 {id:'riddle-lotus',title:'一瓣清光',riddle:'根在泥中藏，\n花在水上香。\n圆叶撑绿伞，\n莲蓬结中央。',answerType:'打一花卉',acceptedAnswers:['荷花','莲花','蓮花','荷','莲','蓮'],hint:'它开在池塘里，花谢后会结出莲蓬。',explanation:'圆圆的荷叶、莲蓬与水上开放的花，都是荷花的特征。',locationId:'quay-lotus',unlockLanternId:'lotus'},
];
const EXHIBIT_LAYOUT = {
 // Movement colliders cover the physical podium body only. The front-facing
 // riddle sign and the open paving around each exhibit must remain walkable.
 'riddle-mountain':{x:-15.2,z:-.15,podiumWidth:6.35,podiumDepth:4.05,collisionWidth:5.7,collisionDepth:3.1,collisionOffsetZ:.04},
 'riddle-lion':{x:-5.7,z:-1.15,podiumWidth:5.1,podiumDepth:3.55,collisionWidth:4.45,collisionDepth:2.65,collisionOffsetZ:.04},
 'riddle-fish':{x:2.45,z:.15,podiumWidth:4.55,podiumDepth:3.2,collisionWidth:3.9,collisionDepth:2.35,collisionOffsetZ:.04},
 'riddle-crane':{x:11.65,z:-.85,podiumWidth:5,podiumDepth:3.55,collisionWidth:4.35,collisionDepth:2.65,collisionOffsetZ:.04},
 'riddle-lotus':{x:5.7,z:-5.25,podiumWidth:4.55,podiumDepth:3.2,collisionWidth:3.8,collisionDepth:2.45,collisionOffsetZ:.04},
};
export const LOCATIONS = RIDDLES.map((r,i)=>({id:r.locationId,riddleId:r.id,lanternId:r.unlockLanternId,number:i+1,...EXHIBIT_LAYOUT[r.id]}));
export const PLAY_AREA = {minX:-21.5,maxX:18,minZ:-10.4,maxZ:2.35,ground:0.85,eyeHeight:1.7,radius:0.3};
export const SPAWN = {x:-11,z:-7.1,lookX:-9,lookY:2.2,lookZ:-.2};
