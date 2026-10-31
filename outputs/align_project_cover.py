from pathlib import Path
from zipfile import ZipFile
import json

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt
from lxml import etree


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / '一灯一匠——秦淮灯彩数字体验传承_作品介绍文档_排版优化版.docx'
TARGET = ROOT / '一灯一匠——秦淮灯彩数字体验传承_作品介绍文档_封面对齐版.docx'
QA = ROOT / 'project-intro-cover-qa'
QA.mkdir(exist_ok=True)
doc = Document(SOURCE)
cover = []
for paragraph in doc.paragraphs:
    cover.append(paragraph)
    if paragraph._p.xpath('./w:pPr/w:sectPr'):
        break
assert len(cover) == 14, 'Unexpected cover boundary; inspect input before editing.'
metadata = [p for p in cover if '：【待补充】' in p.text.replace(' ', '')]
assert len(metadata) == 4
section = doc.sections[0]
width = (section.page_width - section.left_margin - section.right_margin) / 12700
for paragraph in cover:
    pf = paragraph.paragraph_format
    pf.left_indent = Pt(0)
    pf.right_indent = Pt(0)
    pf.first_line_indent = Pt(0)
    ind = paragraph._p.get_or_add_pPr().find(qn('w:ind'))
    for name in ('leftChars', 'rightChars', 'hangingChars', 'hanging'):
        ind.attrib.pop(qn('w:' + name), None)
    ind.set(qn('w:firstLineChars'), '0')
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
for paragraph in metadata:
    label, value = paragraph.text.split('：', 1)
    old_rpr = paragraph.runs[0]._r.rPr
    paragraph.clear()
    run = paragraph.add_run('\t' + label.strip() + '：\t' + value.strip())
    if old_rpr is not None:
        from copy import deepcopy
        run._r.insert(0, deepcopy(old_rpr))
    run.font.size = Pt(12)
    paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
    tabs = paragraph.paragraph_format.tab_stops
    tabs.clear_all()
    tabs.add_tab_stop(Pt(width / 2 + 12), WD_TAB_ALIGNMENT.RIGHT)
    tabs.add_tab_stop(Pt(width / 2 + 24), WD_TAB_ALIGNMENT.LEFT)

new_xml = etree.tostring(doc._element, encoding='UTF-8', xml_declaration=True, standalone=True)
with ZipFile(SOURCE) as source, ZipFile(TARGET, 'w') as target:
    for entry in source.infolist():
        target.writestr(entry, new_xml if entry.filename == 'word/document.xml' else source.read(entry.filename))

def body_blocks(xml):
    root = etree.fromstring(xml)
    body = root.find(qn('w:body'))
    after_cover = False
    result = []
    for block in body:
        if after_cover:
            result.append(etree.tostring(block))
        if block.find('./' + qn('w:pPr') + '/' + qn('w:sectPr')) is not None:
            after_cover = True
    return result

with ZipFile(SOURCE) as source, ZipFile(TARGET) as target:
    assert body_blocks(source.read('word/document.xml')) == body_blocks(target.read('word/document.xml'))
    changed = [name for name in source.namelist() if source.read(name) != target.read(name)]
    assert changed == ['word/document.xml'], changed
audit = {'cover_metadata_rows': len(metadata), 'body_xml_unchanged': True, 'other_package_parts_unchanged': True}
(QA / 'audit.json').write_text(json.dumps(audit, indent=2), encoding='utf-8')
print(json.dumps(audit))
print(TARGET)
