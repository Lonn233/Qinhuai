from pathlib import Path
import json
import re
import zipfile
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.enum.section import WD_SECTION_START
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(r'E:\soft\project\codex-Qinhuai')
OUT = ROOT / 'outputs'
PROJECT = OUT / 'qinhuai-dual-era'
QA = OUT / 'project-intro-qa'
QA.mkdir(exist_ok=True)
FINAL = OUT / '一灯一匠——秦淮灯彩数字体验传承_作品介绍文档.docx'
DOC_TITLE = '一灯一匠——秦淮灯彩数字体验传承'
doc = Document()
BLACK = RGBColor(0, 0, 0)
headings = []
figures = []


def set_font(font, size=11, bold=False, east='宋体'):
    font.name = 'Times New Roman'
    font.size = Pt(size)
    font.bold = bold
    font.color.rgb = BLACK
    rpr = font._element.get_or_add_rPr()
    rf = rpr.find(qn('w:rFonts'))
    if rf is None:
        rf = OxmlElement('w:rFonts')
        rpr.insert(0, rf)
    for key, value in [('ascii', 'Times New Roman'), ('hAnsi', 'Times New Roman'), ('eastAsia', east), ('cs', 'Times New Roman')]:
        rf.set(qn('w:' + key), value)
    for attr in ['asciiTheme', 'hAnsiTheme', 'eastAsiaTheme', 'cstheme']:
        rf.attrib.pop(qn('w:' + attr), None)


def style(name, size, bold=False, east='宋体', before=0, after=4, line=1.3):
    s = doc.styles[name] if name in doc.styles else doc.styles.add_style(name, WD_STYLE_TYPE.PARAGRAPH)
    set_font(s.font, size, bold, east)
    pf = s.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    pf.line_spacing = line
    pf.widow_control = True
    return s


style('Normal', 10.5, after=4, line=1.3)
style('Title', 26, True, '黑体', after=8, line=1.2)
style('Subtitle', 17, False, '黑体', after=8, line=1.2)
style('Heading 1', 16, True, '黑体', before=0, after=7, line=1.05)
style('Heading 2', 13.5, True, '黑体', before=6, after=4, line=1.05)
style('Heading 3', 12, True, '黑体', before=4, after=3, line=1.05)
style('Caption', 9.5, after=7, line=1.15)
style('Header', 9, after=0, line=1)
style('Footer', 9, after=0, line=1)
style('Small Note', 9.5, after=4, line=1.2)
style('Table Text', 10, after=2, line=1.15)
style('TOC Heading', 16, True, '黑体', after=8, line=1.1)
for level, size, leading, indent in [(1, 10.5, 12.5, 0), (2, 9.5, 10.8, 0.35), (3, 9, 10.0, 0.7)]:
    s = style(f'TOC {level}', size, level == 1, '宋体', before=2 if level == 1 else 0, after=0, line=1)
    s.paragraph_format.line_spacing_rule = WD_LINE_SPACING.EXACTLY
    s.paragraph_format.line_spacing = Pt(leading)
    s.paragraph_format.left_indent = Cm(indent)
    s.paragraph_format.keep_with_next = False
for name in ['Hyperlink', 'FollowedHyperlink']:
    s = doc.styles[name] if name in doc.styles else doc.styles.add_style(name, WD_STYLE_TYPE.CHARACTER)
    set_font(s.font, 9)
    s.font.underline = False

for name in ['Title', 'Subtitle']:
    s = doc.styles[name]
    s.font.italic = False
    for border in s._element.findall('.//' + qn('w:pBdr')):
        border.getparent().remove(border)

pending_page = False

for s in doc.styles:
    if s.type in [WD_STYLE_TYPE.PARAGRAPH, WD_STYLE_TYPE.CHARACTER]:
        s.font.color.rgb = BLACK
        if s._element.rPr is not None:
            color = s._element.rPr.find(qn('w:color'))
            if color is not None:
                for key in ['themeColor', 'themeTint', 'themeShade']:
                    color.attrib.pop(qn('w:' + key), None)


def setup_section(sec):
    sec.page_width = Cm(21)
    sec.page_height = Cm(29.7)
    sec.top_margin = Cm(2.5)
    sec.bottom_margin = Cm(2.5)
    sec.left_margin = Cm(2.5)
    sec.right_margin = Cm(2.5)
    sec.header_distance = Cm(1.25)
    sec.footer_distance = Cm(1.25)
    grid = sec._sectPr.find(qn('w:docGrid'))
    if grid is not None:
        sec._sectPr.remove(grid)


setup_section(doc.sections[0])


def p(text='', note=False, center=False, keep=False):
    para = doc.add_paragraph(style='Small Note' if note else 'Normal')
    para.paragraph_format.keep_with_next = keep
    if center:
        para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif not note:
        para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        para.paragraph_format.first_line_indent = Cm(0.74)
    para.add_run(text)
    return para


def h(text, level):
    global pending_page
    para = doc.add_paragraph(text, style=f'Heading {level}')
    if pending_page:
        para.paragraph_format.page_break_before = True
        pending_page = False
    para.paragraph_format.keep_with_next = True
    para.paragraph_format.keep_together = True
    headings.append((level, text))
    return para


def page():
    global pending_page
    pending_page = True


def borders(table, color='000000', size='4', visible=True):
    pr = table._tbl.tblPr
    old = pr.find(qn('w:tblBorders'))
    if old is not None:
        pr.remove(old)
    b = OxmlElement('w:tblBorders')
    for edge in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
        el = OxmlElement('w:' + edge)
        el.set(qn('w:val'), 'single' if visible else 'nil')
        el.set(qn('w:sz'), size)
        el.set(qn('w:color'), color)
        b.append(el)
    pr.append(b)


def table(headers, rows, widths):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    for col, width in zip(t.columns, widths):
        col.width = Cm(width)
    for i, value in enumerate(headers):
        t.rows[0].cells[i].text = value
        shade = OxmlElement('w:shd')
        shade.set(qn('w:fill'), 'F2F2F2')
        t.rows[0].cells[i]._tc.get_or_add_tcPr().append(shade)
    repeat = OxmlElement('w:tblHeader')
    t.rows[0]._tr.get_or_add_trPr().append(repeat)
    for row in rows:
        cells = t.add_row().cells
        for i, text in enumerate(row):
            cells[i].text = text
    for ri, row in enumerate(t.rows):
        no_split = OxmlElement('w:cantSplit')
        row._tr.get_or_add_trPr().append(no_split)
        for ci, cell in enumerate(row.cells):
            cell.width = Cm(widths[ci])
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            pr = cell._tc.get_or_add_tcPr()
            margins = OxmlElement('w:tcMar')
            for edge in ['top', 'left', 'bottom', 'right']:
                mar = OxmlElement('w:' + edge)
                mar.set(qn('w:w'), '65' if edge in ['top', 'bottom'] else '85')
                mar.set(qn('w:type'), 'dxa')
                margins.append(mar)
            pr.append(margins)
            for para in cell.paragraphs:
                para.style = doc.styles['Table Text']
                para.paragraph_format.keep_with_next = ri == 0
                for run in para.runs:
                    set_font(run.font, 10, ri == 0, '黑体' if ri == 0 else '宋体')
    borders(t)
    p('', note=True).paragraph_format.space_after = Pt(0)
    return t


def image(rel, caption, width=15.7):
    path = PROJECT / rel
    assert path.is_file(), path
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    para.paragraph_format.space_after = Pt(3)
    para.paragraph_format.line_spacing = 1
    para.paragraph_format.keep_with_next = True
    shape = para.add_run().add_picture(str(path), width=Cm(width))
    shape._inline.docPr.set('descr', caption)
    cap = doc.add_paragraph(caption, style='Caption')
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    figures.append((str(path), caption))


def image_pair(items):
    t = doc.add_table(rows=1, cols=2)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    borders(t, visible=False)
    for col in t.columns:
        col.width = Cm(8)
    for cell, (rel, caption) in zip(t.rows[0].cells, items):
        cell.width = Cm(8)
        para = cell.paragraphs[0]
        para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        para.paragraph_format.keep_with_next = True
        para.paragraph_format.space_after = Pt(3)
        para.paragraph_format.line_spacing = 1
        path = PROJECT / rel
        assert path.is_file(), path
        shape = para.add_run().add_picture(str(path), width=Cm(7.65))
        shape._inline.docPr.set('descr', caption)
        cap = cell.add_paragraph(caption, style='Caption')
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        figures.append((str(path), caption))
    no_split = OxmlElement('w:cantSplit')
    t.rows[0]._tr.get_or_add_trPr().append(no_split)


def placeholder(text, caption):
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    t.columns[0].width = Cm(15.7)
    t.rows[0].height = Cm(1.35)
    cell = t.cell(0, 0)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    para = cell.paragraphs[0]
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    para.paragraph_format.space_after = Pt(0)
    set_font(para.add_run(text).font, 10)
    borders(t, color='000000', size='4')
    no_split = OxmlElement('w:cantSplit')
    t.rows[0]._tr.get_or_add_trPr().append(no_split)
    cap = doc.add_paragraph(caption, style='Caption')
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER


def field(paragraph, instruction, placeholder_text=''):
    run = paragraph.add_run()
    begin = OxmlElement('w:fldChar')
    begin.set(qn('w:fldCharType'), 'begin')
    run._r.append(begin)
    code = OxmlElement('w:instrText')
    code.set(qn('xml:space'), 'preserve')
    code.text = instruction
    paragraph.add_run()._r.append(code)
    sep = OxmlElement('w:fldChar')
    sep.set(qn('w:fldCharType'), 'separate')
    paragraph.add_run()._r.append(sep)
    if placeholder_text:
        paragraph.add_run(placeholder_text)
    end = OxmlElement('w:fldChar')
    end.set(qn('w:fldCharType'), 'end')
    paragraph.add_run()._r.append(end)


# Cover uses the project's own night preview, without claiming a play-mode capture.
p('数字文化与交互体验作品', note=True, center=True)
spacer = p('')
spacer.paragraph_format.space_after = Pt(22)
title = doc.add_paragraph(style='Title')
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
title.add_run('一灯一匠——\n秦淮灯彩数字体验传承')
sub = doc.add_paragraph('作品介绍文档', style='Subtitle')
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
p('', note=True)
image('work/courtyard-lanterns-20261020/courtyard-front-night.png', '秦淮灯会主场景夜景预览', 15.7)
p('', note=True)
for label in ['学校或参赛单位', '团队名称', '指导教师', '完成日期']:
    para = p(f'{label}： 【待补充】', center=True)
    para.paragraph_format.space_after = Pt(11)
p('文档内容核对日期：2026 年 10 月 22 日', note=True, center=True)

sec = doc.add_section(WD_SECTION_START.NEW_PAGE)
setup_section(sec)
sec.header.is_linked_to_previous = False
sec.footer.is_linked_to_previous = False
page_num = OxmlElement('w:pgNumType')
page_num.set(qn('w:start'), '1')
sec._sectPr.append(page_num)
hp = sec.header.paragraphs[0]
hp.style = doc.styles['Header']
hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
hp.add_run(DOC_TITLE)
fp = sec.footer.paragraphs[0]
fp.style = doc.styles['Footer']
fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
field(fp, ' PAGE ', '1')

toc_title = doc.add_paragraph('目录', style='TOC Heading')
toc_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
field(doc.add_paragraph(), ' TOC \\o "1-3" \\h \\z \\u ', '目录正在更新')

page()
h('一、作品概述', 1)
h('1.1 项目背景与创意来源', 2)
h('秦淮灯会的历史文化背景', 3)
p('秦淮灯会承载着南京地域文化与节令生活的共同记忆。沿河建筑、街巷、桥梁与各式花灯共同构成可游览、可停留的夜间公共空间；灯彩既是观赏对象，也与民俗寓意、手工技艺和人们对美好生活的愿望相联系。作品选取夫子庙、贡院周边及秦淮河岸的灯会意象，将赏灯活动置于具体的空间与人物关系中。')
p('场景设计强调地域氛围与游览体验，不将当前三维地图表述为某一历史年份的精确复原。建筑、花灯与剧情内容分别承担环境识别、文化观察和任务引导的作用，使玩家能够从一盏灯的造型进入对秦淮灯彩的理解。')
h('传统灯彩技艺的数字化传承需求', 3)
p('仅展示成品图片，较难说明竹篾为何弯成特定结构、捆扎位置如何固定，以及各类材料怎样依次参与成灯。项目因此把数字化表达的重点从成品观看延伸到制作过程，将可操作的材料、结构变化与工序顺序组织成体验内容。数字体验用于辅助理解，不替代真实工艺实践与工匠指导。')
h('1.2 作品定位与简介', 2)
h('作品主题、类型与目标', 3)
p('《一灯一匠——秦淮灯彩数字体验传承》是一款以秦淮灯彩为主题的浏览器端三维文化体验游戏。作品面向对传统文化、手工制作和数字文旅感兴趣的体验者，通过灯会探索与做灯工坊两个空间，连接花灯外观、文化叙事与基础制作知识。当前成果为可运行的阶段性原型。')
h('游戏故事背景与核心玩法', 3)
p('玩家以学艺者身份与师父相遇，依次观察七类花灯、确认讲解内容并解锁花灯图鉴，再沿任务线回到师父处。主场景已具备探索、对话、观灯与图鉴积累；新工坊已实现荷花灯扎框子的交互。灯谜仍为占位环节，后续四道制作工序和主场景成灯回流尚未完成，不能视为完整闭环。')
image('work/courtyard-lanterns-20261020/courtyard-elevated-night.png', '图 1-1 夫子庙片区灯会夜景预览：建筑、庭院与灯组的空间关系', 11.5)

page()
h('二、作品内容与设计', 1)
h('2.1 游戏场景设计', 2)
h('秦淮灯会场景与做灯工坊场景', 3)
p('秦淮灯会主场景围绕河道、桥梁、沿街建筑和夫子庙片区展开。河岸与街巷提供移动路径，灯组及地标形成视线目标，师父与观察点承担叙事入口。布局既考虑远处灯彩的识别，也考虑近距离观察与人物可达性；水中荷花灯的观察交互放在可抵达的岸边，避免玩家为推进任务进入不可行走区域。')
p('场景分为预览与游玩两种用途：预览便于查看夜景、调整灯光和检视模型；游玩模式叠加角色、任务、地图与交互判定。两者共享场景与已保存的光效配置，但可见对象并不完全一致，例如游玩模式会隐藏船只。因此，本文夜景预览图用于说明环境表现，不用来证明游玩模式下的全部对象与功能。')
p('做灯工坊采用木构室内空间与多个工作台的布局，将材料拾取、竹篾加工、合成操作和指导书阅读放在同一空间中。靠近工作台后切换至便于操作的视角，使空间探索与局部工艺动作互不干扰。物品栏保留已取得材料及已制成的竹圈，支持在操作前确认当前持有物。')
image_pair([
    ('work/golden-tree-lanterns-20261020/gate-night.png', '图 2-1 秦淮河岸与建筑夜景预览'),
    ('hehua-workshop/preview/32-workshop-nobrand.png', '图 2-2 做灯工坊与工作台布局'),
])
h('彩灯的造型设计、色彩搭配与视觉呈现', 3)
p('花灯设计保留不同题材的主要识别特征：狮子灯以形体与装饰建立节庆感，贡院题名灯对应求学与题名叙事，马灯强调动态姿态，鳖山灯、菊水灯及水中荷花灯通过轮廓、尺度和安放位置形成差异。七个观灯节点采用固定顺序，不以重复模型代替文化内容的区别。')
p('视觉表现以建筑暖色光、局部彩灯色与水岸暗部形成对照。马头墙建筑的窗内透光、建筑构件颜色、灯光外溢以及各类水面反射可以分别调节，避免所有表面被同一种高亮覆盖。河面效果采用与场景美术相配合的可调反射与光晕表达，不宣称已经实现物理精确的全局光照。')
p('荷花灯的结构依据制作资料与参考图反复调整：竹篾呈较细的圆杆形态，三根短主骨架弯成 U 形，大圈位于弧形长条靠上位置，小圈位于顶部；捆扎需同时束住相接构件。顶部以金丝和红线组成三点汇聚的吊挂结构，避免脱离参考的不规则自由造型。')

page()
h('2.2 游戏剧情与交互玩法', 2)
h('拜师学艺与灯会探索', 3)
p('剧情以拜师开场，将灯会游览转化为带有学习目的的探索。玩家与师父对话后，按狮子灯、贡院题名灯、马灯、鳖山灯、菊水灯、水中荷花灯主灯、水中荷花灯小灯的顺序完成观察。各节点既是行走目标，也是讲解内容的承载物，完成后再进入下一节点。台词以项目中更新后的贡院题名灯版剧本为依据。')
h('NPC 互动、猜灯谜与花灯收集', 3)
p('普通对话由玩家手动继续，观察状态则暂时限制移动、保留自由查看，并允许取消；仅靠近或误触不直接算作学完。确认完整讲解或满足已核验音频条件后才解锁图鉴。“收集”指文化条目与模型阅览权限的积累，不是将场景中的大型花灯直接拿走。')
p('灯谜目前通过庙内进入、退出及任务恢复的占位流程预留位置，尚无完整题库、作答判定与奖励结果。回到师父处后，现有主线可以明确跳过制作并走向挂灯目标，但成灯资源及工坊结果回流尚未接通。首幕三段配音已接入，后续录音仍需逐段核验。')
placeholder('【待补充：完整灯谜系统实现后的真实作答界面截图】', '图 2-3 灯谜交互素材预留位（当前为占位流程，非已完成界面）')
h('传统荷花灯制作体验', 3)
p('工艺以《做荷花灯》资料为准，划分为扎框子、裱糊、制作花瓣、粘贴花瓣、装花头与蜡烛五步。新工坊当前完成第一步：取得竹篾，分别弯圈并用棉花纸捻捆扎，制成大圈和小圈后先收入物品栏，再从大圈开始组装三根 U 形骨架。大小圈、骨架接点与顶部吊挂均有对应的结构表现。')
p('后续设计为：用浆糊完成无纺布及裱布的裱糊；纸张以粉红色染料染色、阴干后绕压模轴，用白线逐圈缠绕并敲压成褶；花瓣用铜丝整理固定，粉色花瓣分层错位粘贴，再安装成品绿叶、花头、花茎和蜡烛。铁丝用于花头支撑，与花瓣使用的铜丝区分。上述四步目前属于规范化流程，不能作为已实现的操作展示。')
image('hehua-workshop/preview/70-u-verified-frame.png', '图 2-4 新工坊扎框子阶段：U 形竹骨、竹圈与三点吊挂', 10.5)

page()
h('2.3 游戏界面设计', 2)
h('整体界面风格与布局', 3)
p('主场景界面采用克制的文字层级与书册式阅读呈现，让河岸、建筑和花灯仍是主要视觉内容。任务信息在探索时提供方向，NPC 字幕与当前交互保持关联；图鉴、地图等需要集中阅读的内容进入独立界面，减少多个面板同时遮挡场景的情况。')
p('界面区分“当前目标”“可执行动作”和“已积累内容”。任务推进依靠完成条件而不是装饰性提示；对话和观灯状态采用不同控制规则，防止角色误走动打断阅读。主场景的灯光控制台用于开发与展示调试，不将其描述为正式游玩必须操作的内容。')
p('工坊中，阶段清单、工作台视角、物品栏和指导书共同组织操作。玩家先看材料，再取得材料，最后在对应台面处理。物品切换使用 change 提示音，中等步骤完成使用 chime，指导书点击与翻页使用 flip；翻书音量按当前版本提高至原来的两倍，为翻页动作提供更清晰的听觉反馈。')
h('游戏操作界面与花灯图鉴', 3)
p('主场景支持 WASD 移动、鼠标左键拖动观察、靠近目标后按 E 交互。地图可由小地图展开为大地图，选择目的地后计算路线。观察过程中保留对花灯的查看，并可按 E 取消；任务与图鉴不会因为未确认的讲解而提前解锁。')
p('花灯图鉴采用双页书册，内容页同时展示三维模型与对应说明。已解锁条目可旋转、缩放查看，未解锁条目保持限制；模型按需加载，关闭阅读后释放独立渲染器、几何与复制材质等资源。这种形式让玩家能在游览后回看造型细节，而非只记录一个收集数量。')
image('work/story-book-lion.png', '图 2-5 花灯图鉴中的狮子灯三维模型与文字说明', 14.0)
p('图示为项目实际图鉴页面。条目解锁、模型查看与任务进度相联动；书册内容的形成以完整观察为前提。手机竖屏已有界面验证截图，但仍需扩展设备测试，不能据此认定所有移动设备均已适配。', note=True)

page()
h('三、作品创新特色', 1)
h('3.1 非遗文化与游戏体验融合', 2)
h('从传统文化展示转向沉浸式互动', 3)
p('作品将文化信息置于可行走的灯会空间。玩家先在远处识别灯组，再靠近观察、聆听或阅读，并将已理解的内容保存到图鉴。环境、动作和知识呈现由同一目标串联，避免把文化介绍完全放在与游戏分离的说明页面。其价值体现在信息获取方式的转变，而非对学习效果作未经验证的量化承诺。')
h('将灯彩制作技艺融入游戏操作', 3)
p('制作系统选择能直接看见结构变化的动作作为交互重点。弯竹圈、收圈入栏、弯出 U 形竹骨、校准连接位置和捆扎固定，使工序不仅是按钮列表。棉花纸捻的动画需要跨束相接的两组骨架；大小圈先制作后收集，再开始组装，保留真实操作中“准备构件—组合结构”的关系。')
h('3.2 历史场景与文化内容融合', 2)
h('秦淮灯会场景的数字化呈现', 3)
p('沿河建筑与灯组相互组织游览节奏。夫子庙片区形成相对集中的视觉目标，河道和桥梁提供方向线索，灯彩在街巷与水面形成不同的观看距离。建筑窗光、环境辐射、灯光颜色与水面效果分别调整，让夜景既呈现节庆亮点，也保留建筑与通行区域的可辨识性。')
h('将花灯文化、灯谜与剧情探索相结合', 3)
p('师父提出学习目标，七类花灯逐步展开不同内容，图鉴积累形成可回看的学习记录；灯谜被安排为理解与回顾之间的设计环节。当前证据支撑的是观灯、对话和图鉴的联系，灯谜仍需补齐题目、答案解释和状态反馈。创新表述因此落在已有交互关系和可延续的设计结构上，而不是把预留环节写成成品。')
h('3.3 游戏化非遗传承模式', 2)
h('构建“赏灯—猜灯—制灯”的完整体验过程', 3)
p('“赏灯—猜灯—制灯”是作品的总体体验框架：赏灯建立对题材与外观的认识，猜灯促使玩家回顾文化线索，制灯将观察转为对材料和结构的操作。已完成的赏灯主线与扎框子体验分别验证了两端的可行性；中间灯谜和后续成灯工序仍需接续，当前整体为阶段性贯通。')
table(['体验环节', '设计作用', '当前状态'], [
    ['赏灯', '场景观察、讲解确认、图鉴积累', '主场景已实现七灯顺序体验'],
    ['猜灯', '结合文化线索作答与回顾', '占位流程，完整系统待实现'],
    ['制灯', '理解材料、结构与成灯工序', '扎框子可操作，后续四步待实现'],
], [2, 7.1, 6.9])
p('体验的完整性不仅取决于环节数量，还取决于任务状态、物料名称和作品结果是否一致。项目已通过工艺文档修订统一浆糊、棉花纸捻、粉色花瓣和蜡烛等设定，后续将在同一规范下完成工坊与主场景联动。')

page()
h('四、技术实现与作品成果', 1)
h('4.1 主要开发技术', 2)
h('Three.js、WebGL 三维渲染', 3)
p('项目以 Three.js 构建浏览器端三维场景，通过 WebGL 完成建筑、人物、花灯和工坊道具的渲染。现有依赖记录包含 Three.js 0.180.0 与 esbuild 0.25.10。场景逻辑、交互界面与资源加载在网页中协同运行，适合本地展示和后续浏览器发布，不依赖桌面游戏引擎安装。')
p('新工坊使用色调映射、sRGB 输出和柔和阴影配置，配合木质场景、竹篾与纸捻材质表现结构。主场景将不同灯组的颜色、光晕、地面辐射和水面效果拆分为参数，支持局部调试与保存。此类效果服务于可控的夜景表达，不等同于实时路径追踪或严格物理仿真。')
h('Meshy 三维模型制作、Blender 模型微调', 3)
p('资源清单记录了部分来自 Meshy 的模型来源，包括狮子灯、灯笼和魁星阁等，说明项目采用 AI 辅助生成与后续人工整合的混合流程。Blender 用于模型检查、局部修整、结构或比例调整，以及面向浏览器展示的减面与层级优化实验；导出资源再进入网页场景配置。')
p('模型生成不能代替工艺准确性判断。荷花灯骨架依据参考图调整 U 形弯曲、竹圈比例、接点捆扎和顶部红线，形成与制作说明相符的结构。AI 生成资产、外部基础模型与团队手工制作须在提交时分别列明；操作人员、提示词记录及素材授权仍需补充，不将全部模型表述为纯手工原创。')
h('游戏交互逻辑与功能实现', 3)
p('主线以状态管理记录当前灯序、讲解确认、图鉴解锁与庙内流程，剧情存档与场景光效配置分别保存。大地图寻路将路径计算交给 Web Worker，并检查障碍与桥面通行。工坊以材料状态、制作阶段和工作台动作驱动骨架变化，避免仅靠展示动画推进流程。')
image('work/lantern-controls-desktop.png', '图 4-1 主场景夜景预览及灯光参数控制界面', 11.5)
p('技术依据：主场景 story 模块、新工坊 hehua-workshop、资源 manifest 清单与模型优化工作记录。图示控制台属于调试环境。', note=True)

page()
h('4.2 核心功能实现', 2)
h('三维场景探索', 3)
p('玩家在可通行区域内移动与转向，利用小地图或大地图确定目标。导航将目的地、障碍绕行与桥梁高度关系纳入路径检查，并在偏离路线时重新计算；水中目标使用可达岸点作为交互位置。已通过相关逻辑测试，但尚不能据此代替对全地图每条路线的人工走查。')
h('NPC 交互与任务系统', 3)
p('任务按固定顺序推进七次观灯，靠近、朝向、视线和当前状态共同决定能否交互。讲解在完整确认后记为已学，取消观察不误解锁，已保存进度可恢复；庙内进入退出也需恢复到正确阶段。角色对话、观察和图鉴阅读各自具有清晰的进入、继续与退出条件。')
h('花灯图鉴、灯谜及制作系统', 3)
p('图鉴已实现七类花灯的解锁管理及独立三维查看，并处理加载、失败重试与关闭清理。灯谜仅保留任务接口，未提供完整谜题玩法。当前主线存在跳过制作的分支，挂灯目标不代表已生成并挂上玩家完成的荷花灯；成灯资源和跨场景结果传递仍待补齐。')
p('新工坊已实现竹篾收集、弯圈、纸捻捆扎、大小圈收集与骨架搭建。材料收集完成和骨架完成分别触发步骤音效，物品切换与指导书翻页有独立反馈。制作进度目前止于“骨架已成，静候裱糊”，染纸、压模及后续工序的入口仍提示后续开放。')
image_pair([
    ('hehua-workshop/preview/72-hoops-collected.png', '图 4-2 大小竹圈制成后先收集到物品栏'),
    ('hehua-workshop/preview/70-u-verified-frame.png', '图 4-3 装配完成的骨架及连接关系'),
])
table(['功能对象', '已落实的交互约束', '后续工作'], [
    ['图鉴', '确认后解锁；可旋转、缩放模型', '补充内容校核与更多设备验证'],
    ['灯谜', '保留进入、退出与任务恢复位置', '题库、判定、解释与奖励反馈'],
    ['荷花灯制作', '先制圈、收圈，再搭建 U 形骨架', '裱糊至装花头、蜡烛及成灯回流'],
], [2.5, 6.7, 6.8])
p('功能完成情况以当前可运行版本为界，不将工艺文档、模型结构验证图或预留按钮单独作为系统已完成的证据。', note=True)

page()
h('4.3 作品成果与运行情况', 2)
h('已完成的功能及展示效果', 3)
p('目前已形成秦淮灯会三维环境、分类型花灯配置、夜景调试与保存、师父对话、七灯观察、花灯图鉴及地图导航等主场景成果；新工坊具备室内环境、工作台、材料拾取与第一阶段骨架制作。灯谜、后续四阶段及成灯回流不列入已完成功能。')
h('游戏实际运行环境', 3)
p('项目开发与检查在 Windows 本地环境进行，通过 HTTP 服务访问网页。主场景入口为 qinhuai-modern-import.html，新工坊入口为 hehua-workshop。浏览器需支持 WebGL，资源加载依赖本地服务与模型文件完整。已有桌面与手机竖屏截图，但显卡、内存、具体浏览器版本及兼容设备清单仍为【待补充：实际测试配置】。')
h('作品截图与测试情况', 3)
p('文中图片均选自项目已有真实截图，分别标注预览、游玩、图鉴和工坊用途；灯谜图保留待实现占位。本次于 2026 年 10 月 22 日执行两组逻辑回归，结果如下。测试证明对应规则按预期运行，不代表全部视觉质量、音频内容及设备性能均已验收。')
table(['本次执行项目', '覆盖内容', '结果'], [
    ['主线逻辑回归\ntest-story.mjs', '七灯顺序、确认解锁、独立存档、庙内恢复、资源缺失保护、岸点及视线判定', '通过'],
    ['导航逻辑回归\ntest-story-navigation.mjs', '绕墙、碰撞边采样、抬高桥面、偏离重算、不可达处理、地图坐标往返', '通过'],
], [4.4, 9.8, 1.8])
image_pair([
    ('work/story-navigation-map.png', '图 4-4 主场景大地图与目标定位界面'),
    ('work/story-ui-gold-dialogue.png', '图 4-5 游玩模式中的师父与对话字幕'),
])
p('尚需补充：完整人工通关记录、统一硬件条件下的加载时间与帧率、移动设备触控可用性、后续配音核验及真实用户体验记录。当前没有足够证据报告平均帧率、完成率、用户数量或教学提升幅度。', note=True)

page()
h('五、学生贡献与项目分工', 1)
h('5.1 团队成员分工', 2)
h('策划、设计、建模、程序开发等具体职责', 3)
p('现有资料能够对应项目工作内容，但未提供可核验的成员名单、承担比例与指导记录。本节先列出需由参赛团队确认的职责及成果，不将文件作者、设备账号或 AI 工具记录推定为学生个人贡献。提交前应据任务记录、版本历史和原始素材补齐署名。')
table(['工作方向', '需确认的具体职责与成果', '负责人'], [
    ['策划与文化调研', '灯会主题、七灯内容、贡院题名灯版台词、荷花灯工艺规范与流程修订', '【待补充：姓名】'],
    ['视觉与界面设计', '场景构图、灯会布置、花灯色彩、任务界面、地图及书册式图鉴', '【待补充：姓名】'],
    ['模型与资源整合', '花灯、人物、工具资源制作或生成；Blender 调整、减面及场景适配', '【待补充：姓名】'],
    ['程序与交互开发', '场景控制、剧情状态、图鉴、导航、工坊制作逻辑及音效接入', '【待补充：姓名】'],
    ['测试与优化', '工艺对照、模型比例校验、回归测试、资源加载及页面适配检查', '【待补充：姓名】'],
], [3, 9.7, 3.3])
h('5.2 团队原创工作', 2)
h('文化资料调研与剧情设计', 3)
p('项目工作包括围绕秦淮灯会选择主题与灯种、组织拜师和观灯叙事，并将更新后的台词与任务节点对应。荷花灯资料修订进一步统一了浆糊、棉花纸捻、粉红色染纸、成品绿叶、蜡烛等设定，以及大小圈和 U 形骨架的连接顺序。资料来源、采访或考察记录、编写者与审核者为【待补充：调研与创作凭证】。')
h('三维场景的灯会布置、光效调整，以及花灯、人物、工具的模型制作', 3)
p('现有场景与修改记录体现了灯组位置、建筑分类灯效、水面反射、环境外溢和荷花灯骨架结构等持续调整。可归入团队工作的部分，应据实际记录确认其设计决策、制作过程及整合成果；Meshy 生成、外部模型、音效与基础素材须单列来源及授权。人物和工具的具体制作归属为【待补充：资源与贡献清单】。')
h('游戏交互开发、界面设计与测试优化', 3)
p('可对应到成果的工作包括观灯确认与图鉴解锁、任务存档、导航判定、模型按需加载与释放，以及工坊中的拾取、制圈、收圈、捆扎动画和步骤反馈。AI 辅助生成代码或资产的参与范围、人工修改与测试责任须如实披露；本文件不据此直接认定全部代码或模型为学生独立原创。')

page()
h('六、应用价值与总结', 1)
h('6.1 文化传承价值', 2)
h('促进秦淮灯彩非遗文化的数字化传播', 3)
p('作品以可探索的灯会环境和可回看的花灯图鉴，将灯彩题材、形态与相关叙事放在同一体验中；以制作工坊补充骨架和材料知识，使成品不再只是一个视觉符号。浏览器形式为课堂演示、展陈辅助和公众体验提供了较易访问的载体，但实际传播范围仍需以后续部署与使用记录为依据。')
p('文化内容的准确性比增加信息数量更重要。后续应邀请熟悉秦淮灯彩的从业者或研究者核对造型、名称、寓意与工序，清楚区分数字交互的必要简化和传统工艺本身，避免把为操作便利作出的设计误当作工艺事实。')
h('6.2 教育与推广价值', 2)
h('提供趣味化、交互式的传统文化学习体验', 3)
p('拜师任务为学习提供情境，观灯确认与图鉴回看帮助组织信息，工坊动作则把结构与顺序转化为可观察的变化。其潜在教育价值在于促进主动观察和过程理解，而非已经证实知识掌握或技能迁移。后续可通过体验观察、操作错误记录与访谈，检验玩家是否真正理解材料用途及工序关系。')
h('探索数字文旅与文化创意应用场景', 3)
p('在内容核验、性能优化和素材授权完善后，作品可探索学校传统文化课程、灯会展陈、文旅导览与线上主题体验等应用。不同场景需要不同的操作长度和引导方式：展陈适合短时体验，教学可结合真实制作，线上版本则需更明确的加载与设备提示。当前尚无实际落地合作与推广数据。')
h('6.3 总结与展望', 2)
h('作品核心特色与成果总结', 3)
p('项目已把灯会空间、顺序观灯、文化图鉴与荷花灯骨架制作组织为相互关联的体验原型。其具体特色是让玩家在空间中辨认花灯，在确认中积累内容，再通过弯圈、收圈和捆扎理解结构；技术与视觉调整围绕这一体验服务，而不是以技术名称替代作品内容。')
h('后续优化及拓展方向', 3)
p('下一阶段优先补齐灯谜的题库、判定与答案解释，完成裱糊、制作花瓣、粘贴花瓣及装花头与蜡烛四道工序，并实现工坊成灯结果返回主场景及挂灯展示。随后继续核验配音和文化文本，完善设备适配、模型与加载性能，补充完整通关与真实用户体验记录。')
p('参赛提交前需补齐学校、团队、指导教师、成员分工、资源授权及实际测试配置，替换灯谜占位图，并据最终版本重新核对完成状态。文档使用的依据为项目工艺与交互资料、主场景剧情说明、现有代码、资源清单和真实截图；当前结论均以 2026 年 10 月 22 日核对的阶段成果为限。')

# Force all authored text, including fields and inherited text styles, to pure black.
for color in doc.styles.element.iter(qn('w:color')):
    color.attrib.clear()
    color.set(qn('w:val'), '000000')
for part in [doc.part, *[r.target_part for r in doc.part.rels.values() if not r.is_external and ('header' in r.reltype or 'footer' in r.reltype)]]:
    for run in part.element.iter(qn('w:r')):
        rpr = run.find(qn('w:rPr'))
        if rpr is None:
            rpr = OxmlElement('w:rPr')
            run.insert(0, rpr)
        color = rpr.find(qn('w:color'))
        if color is None:
            color = OxmlElement('w:color')
            rpr.append(color)
        color.attrib.clear()
        color.set(qn('w:val'), '000000')

settings = doc.settings.element
update = OxmlElement('w:updateFields')
update.set(qn('w:val'), 'true')
settings.append(update)
doc.core_properties.title = DOC_TITLE
doc.core_properties.subject = '参赛作品介绍文档'
doc.core_properties.author = ''
doc.core_properties.keywords = '秦淮灯彩, 三维交互, 传统文化, 荷花灯'
doc.core_properties.comments = ''
doc.save(FINAL)
(QA / 'expected-headings.json').write_text(json.dumps(headings, ensure_ascii=False, indent=2), encoding='utf-8')
(QA / 'figures.json').write_text(json.dumps(figures, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'output': str(FINAL), 'headings': len(headings), 'figures': len(figures), 'characters': sum(len(x.text) for x in doc.paragraphs)}, ensure_ascii=False))
