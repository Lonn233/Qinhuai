import {STAGES,PHASES} from './config.mjs';

const stations={bamboo:'扎架台',assembly:'河灯台',dye:'染纸台',press:'压瓣台'};
const materials={
 bamboo_prep:'62cm 长条、适当长度长条、棉花纸捻',frame_assembly:'3 根 40cm 长条、棉花纸捻、大圈',frame_short_binding:'小圈、铁丝、棉花纸捻',
 lining_lower:'浆糊、半圆形无纺布、剪刀',lining_upper:'浆糊、裱布、剪刀',paper_dye:'花瓣纸、粉红色染料',paper_drying:'染好的花瓣纸、阴干架',petal_pressing:'阴干花瓣纸、白线、压模器、小锤子',petal_shaping:'两张压模花瓣纸、铜丝',petal_assembly:'粉色花瓣、浆糊、裱糊灯体',calyx_assembly:'成品绿色叶片、浆糊、灯体',top_flower_assembly:'成品花头、花茎、铁丝支架',candle_installation:'蜡烛',final_inspection:'完成的荷花灯'
};
const guides={
 bamboo_prep:['将 62cm 长条双手弯成大圈，首尾留约 1cm 搭接。','用棉花纸捻缠绕搭接处，再弯制并捆扎小圈。','准备三根 40cm 长条，进入骨架固定。'],
 frame_assembly:['将每根 40cm 长条弯成弧形。','把大圈固定在三根弧形长条靠上的位置。','分别将每根弧形长条的两端用棉花纸捻捆扎。'],
 frame_short_binding:['将小圈固定在三根弧形长条顶端。','用棉花纸捻扎紧所有连接处。','用铁丝制作并固定五个花头的安装支架。'],
 lining_lower:['在骨架覆盖位置均匀涂浆糊。','按骨架形状分片贴半圆形无纺布。','修剪边缘多余布料，让灯体轮廓整齐。'],
 lining_upper:['继续为上层骨架涂浆糊。','贴上裱布，保证灯体表面平整完整。','检查边缘贴合并修整。'],
 paper_dye:['将花瓣纸浸入粉红色染料。','通常浸泡 2 至 3 分钟，根据颜色深浅调整。','取出纸张，准备放到阴凉处阴干。'],
 paper_drying:['将染好的花瓣纸放在阴凉通风处。','不直接暴晒，等待纸张完全干透。','干透后进入压模工序。'],
 petal_pressing:['把干纸贴在压模器轴上，用白线沿轴一圈圈缠绕。','将压模器竖直摆放，用小锤敲上方平台压缩轴和纸张。','向上拉起平台，解开白线并取出压好纹理的纸。'],
 petal_shaping:['取两张压模后的花瓣纸叠在一起。','轻捏纸张的一角形成花瓣根部。','用铜丝将这一角捆扎固定。'],
 petal_assembly:['最上层用浆糊贴 6 片粉色花瓣。','下层从上层两片花瓣之间偏下的位置交错贴。','共完成 4 层粉色花瓣。'],
 calyx_assembly:['使用直接备好的成品绿色叶片。','在灯体下部用浆糊贴两层绿叶。','最底层绿叶反向粘贴，收拢底部。'],
 top_flower_assembly:['将花茎根部插入第一步的铁丝支架。','固定五个成品花头。','按上三、下二布置并调整花头、花瓣和叶片。'],
 candle_installation:['将蜡烛放入灯体内部。','调整位置，确保蜡烛固定稳妥。','准备整理成品并试灯。'],
 final_inspection:['检查花头、花瓣和叶片是否分布均匀。','整理灯体整体造型。','进行试灯观察。']
};
export const BOOK_CHAPTERS=STAGES.map((stage,index)=>({...stage,number:index+1,location:stations[stage.station],materials:materials[stage.id],steps:guides[stage.id],note:stage.hint}));
export function createCraftBook({getStage,onOpen}){
 const button=document.createElement('button');button.id='craft-book-open';button.innerHTML='<span class="book-mini">灯</span><span>做灯书<small>B · 随时翻阅</small></span>';document.body.append(button);
 const book=document.createElement('dialog');book.id='craft-book';book.innerHTML=`<header class="book-head"><div><span class="book-imprint">秦淮灯坊 · 手作拾要</span><h2>一册做灯书</h2></div><button id="book-close">合卷 ×</button></header><div class="book-spread"><aside class="book-index"><div class="book-index-head"><span>目录</span><button id="book-current">定位当前工序</button></div><nav>${BOOK_CHAPTERS.map((chapter,index)=>`${index===0||chapter.phase!==BOOK_CHAPTERS[index-1].phase?`<h3>${PHASES[chapter.phase]}</h3>`:''}<button data-chapter="${index}"><span>${String(index+1).padStart(2,'0')}</span>${chapter.name}<i></i></button>`).join('')}</nav></aside><article class="book-leaf"><span id="book-chapter-kicker"></span><h3 id="book-chapter-title"></h3><div class="book-material"><b>本步骤材料</b><p id="book-materials"></p></div><ol id="book-steps"></ol><aside class="book-margin-note"><b>制作要点</b><p id="book-note"></p></aside></article></div><footer class="book-foot"><button id="book-prev">← 前一工序</button><span id="book-page"></span><button id="book-next">后一工序 →</button></footer>`;document.body.append(book);
 let page=0;const $=id=>document.getElementById(id);function render(){const chapter=BOOK_CHAPTERS[page],current=getStage();$('book-chapter-kicker').textContent=`第 ${String(chapter.number).padStart(2,'0')} 章 ／ ${chapter.location}${current===page?' · 正在制作':''}`;$('book-chapter-title').textContent=chapter.name;$('book-materials').textContent=chapter.materials;$('book-steps').innerHTML=chapter.steps.map(step=>`<li>${step}</li>`).join('');$('book-note').textContent=chapter.note;$('book-page').textContent=`${chapter.number} / ${BOOK_CHAPTERS.length}`;$('book-prev').disabled=page===0;$('book-next').disabled=page===BOOK_CHAPTERS.length-1;for(const item of book.querySelectorAll('[data-chapter]'))item.toggleAttribute('aria-current',+item.dataset.chapter===page);}
 function open(){if(book.open)return;page=getStage();onOpen();render();book.showModal();}function turn(next){page=Math.max(0,Math.min(BOOK_CHAPTERS.length-1,next));render();}
 button.onclick=open;$('book-close').onclick=()=>book.close();$('book-current').onclick=()=>turn(getStage());$('book-prev').onclick=()=>turn(page-1);$('book-next').onclick=()=>turn(page+1);for(const item of book.querySelectorAll('[data-chapter]'))item.onclick=()=>turn(+item.dataset.chapter);window.addEventListener('keydown',event=>{if(event.code==='KeyB'&&!event.repeat&&!['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)){event.preventDefault();book.open?book.close():open();}if(book.open&&['ArrowLeft','ArrowRight'].includes(event.code)){event.preventDefault();turn(page+(event.code==='ArrowLeft'?-1:1));}});return {open};
}
