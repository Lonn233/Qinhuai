from copy import deepcopy
from pathlib import Path
from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / '一灯一匠——秦淮灯彩数字体验传承_作品介绍文档.docx'
TARGET = SOURCE.with_name(SOURCE.stem + '_排版优化版.docx')
doc = Document(SOURCE)
SPECS = {
    'Normal': (12, '宋体', False, 0, 8),
    'Title': (22, '黑体', True, 0, 14),
    'Subtitle': (16, '黑体', False, 0, 12),
    'Heading 1': (16, '黑体', False, 0, 16),
    'Heading 2': (14, '黑体', False, 14, 8),
    'Heading 3': (12, '黑体', False, 10, 6),
    'Caption': (10.5, '宋体', False, 5, 12),
    'Small Note': (10.5, '宋体', False, 0, 8),
    'Table Text': (10.5, '宋体', False, 3, 3),
    'Header': (9, '宋体', False, 0, 0),
    'Footer': (9, '宋体', False, 0, 0),
    'TOC Heading': (16, '黑体', False, 0, 16),
    'toc 1': (12, '宋体', True, 5, 3),
    'toc 2': (10.5, '宋体', False, 3, 2),
    'toc 3': (10.5, '宋体', False, 0, 2),
}

def font_set(font, element, size, east, bold=None):
    font.name = 'Times New Roman'
    font.size = Pt(size)
    font.color.rgb = RGBColor(0, 0, 0)
    if bold is not None:
        font.bold = bold
    rpr = element.get_or_add_rPr()
    fonts = rpr.find(qn('w:rFonts'))
    if fonts is None:
        fonts = OxmlElement('w:rFonts')
        rpr.insert(0, fonts)
    for key in list(fonts.attrib):
        if 'Theme' in key:
            del fonts.attrib[key]
    for key in ('ascii', 'hAnsi', 'cs'):
        fonts.set(qn('w:' + key), 'Times New Roman')
    fonts.set(qn('w:eastAsia'), east)

def paragraph_set(pf, before, after, indent=False, line=1.5):
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    pf.line_spacing = line
    pf.first_line_indent = Pt(24 if indent else 0)
    pr = pf._element.get_or_add_pPr()
    ind = pr.find(qn('w:ind'))
    if ind is not None:
        for key in ('firstLineChars', 'hangingChars', 'hanging'):
            ind.attrib.pop(qn('w:' + key), None)
        ind.set(qn('w:firstLineChars'), '200' if indent else '0')
    grid = pr.find(qn('w:snapToGrid'))
    if grid is None:
        grid = OxmlElement('w:snapToGrid')
        pr.append(grid)
    grid.set(qn('w:val'), '0')
    pf.widow_control = True

for name, (size, east, bold, before, after) in SPECS.items():
    if name not in doc.styles:
        doc.styles.add_style(name, WD_STYLE_TYPE.PARAGRAPH)
    style = doc.styles[name]
    font_set(style.font, style.element, size, east, bold)
    paragraph_set(style.paragraph_format, before, after, name == 'Normal')
    if name.startswith('Heading') or name == 'TOC Heading':
        style.paragraph_format.keep_with_next = True
        style.paragraph_format.keep_together = True

body_started = False
first_body = None
for p in doc.paragraphs:
    name = p.style.name
    if name == 'Heading 1' and p.text == '一、作品概述':
        body_started = True
        first_body = p
    size, east, bold, before, after = SPECS.get(name, SPECS['Normal'])
    is_toc = name.lower().startswith('toc ')
    paragraph_set(p.paragraph_format, before, after, body_started and name == 'Normal')
    if name.startswith('Heading'):
        p.paragraph_format.keep_with_next = True
        p.paragraph_format.keep_together = True
        p.paragraph_format.page_break_before = name == 'Heading 1' and p is not first_body
    elif is_toc:
        p.paragraph_format.keep_with_next = name != 'toc 3'
        p.paragraph_format.keep_together = True
    elif body_started and name == 'Normal':
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if name == 'Caption':
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in p.runs:
        font_set(run.font, run._r, size, east, bold if name != 'Normal' else None)
    has_image = bool(p._p.xpath('.//w:drawing'))
    if has_image and not p.text.strip():
        paragraph_set(p.paragraph_format, 8, 3, line=1)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.keep_with_next = True
    elif body_started and not p.text.strip():
        paragraph_set(p.paragraph_format, 0, 0, line=1)
        for run in p.runs:
            run.font.size = Pt(2)
    elif not body_started and not p.text.strip():
        paragraph_set(p.paragraph_format, 0, 0, line=1)
        p.paragraph_format.line_spacing = Pt(6)
        for run in p.runs:
            run.font.size = Pt(6)

for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for p in cell.paragraphs:
                picture = bool(p._p.xpath('.//w:drawing'))
                caption = p.style.name == 'Caption'
                paragraph_set(p.paragraph_format, 3 if not picture else 5,
                              10 if caption else 3, line=1 if picture else 1.5)
                if picture or caption:
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.keep_with_next = picture
                for run in p.runs:
                    font_set(run.font, run._r, 10.5, '宋体')

# Separate unnumbered front matter from the body without changing its content.
assert first_body is not None
toc_section = deepcopy(doc.sections[-1]._sectPr)
for name in ('footerReference', 'pgNumType'):
    for node in list(toc_section.findall(qn('w:' + name))):
        toc_section.remove(node)
section_type = toc_section.find(qn('w:type'))
if section_type is None:
    section_type = OxmlElement('w:type')
    toc_section.insert(0, section_type)
section_type.set(qn('w:val'), 'nextPage')
boundary = OxmlElement('w:p')
properties = OxmlElement('w:pPr')
properties.append(toc_section)
boundary.append(properties)
first_body._p.addprevious(boundary)
for section in doc.sections:
    for part in (section.header, section.footer):
        for p in part.paragraphs:
            paragraph_set(p.paragraph_format, 0, 0, line=1)
            for run in p.runs:
                font_set(run.font, run._r, 9, '宋体')

doc.save(TARGET)
print(TARGET)
