from pathlib import Path
import json
import re
import zipfile
import xml.etree.ElementTree as ET
import pypdfium2 as pdfium
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(r'E:\soft\project\codex-Qinhuai\outputs')
QA = ROOT / 'project-intro-qa'
pdf = pdfium.PdfDocument(QA / 'document.pdf')
thumbs = []
pages = []
for i in range(len(pdf)):
    page = pdf[i]
    bitmap = page.render(scale=1.5)
    im = bitmap.to_pil().convert('RGB')
    im.save(QA / f'page-{i+1:02}.png')
    thumb = ImageOps.contain(im, (360, 510))
    tile = Image.new('RGB', (380, 540), '#dddddd')
    tile.paste(thumb, ((380-thumb.width)//2, 8))
    ImageDraw.Draw(tile).text((12, 522), f'Page {i+1}', fill='black')
    thumbs.append(tile)
    txt = page.get_textpage().get_text_range()
    pages.append({'page': i+1, 'text': txt})
for start in range(0, len(thumbs), 6):
    sheet = Image.new('RGB', (1140, 1080), 'white')
    for j, thumb in enumerate(thumbs[start:start+6]):
        sheet.paste(thumb, ((j%3)*380, (j//3)*540))
    sheet.save(QA / f'contact-{start//6+1}.jpg', quality=92)
(QA / 'page-text.json').write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding='utf-8')
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
with zipfile.ZipFile(ROOT / '一灯一匠——秦淮灯彩数字体验传承_作品介绍文档.docx') as z:
    xml = ET.fromstring(z.read('word/document.xml'))
    styles = ET.fromstring(z.read('word/styles.xml'))
    levels = {}
    for s in styles.findall('w:style', ns):
        outline = s.find('./w:pPr/w:outlineLvl', ns)
        name = s.find('w:name', ns)
        if outline is not None and name is not None and re.match(r'heading [123]$', name.get('{'+ns['w']+'}val', ''), re.I):
            levels[s.get('{'+ns['w']+'}styleId')] = int(outline.get('{'+ns['w']+'}val')) + 1
    actual = []
    for p in xml.findall('.//w:body/w:p', ns):
        s = p.find('./w:pPr/w:pStyle', ns)
        if s is not None and s.get('{'+ns['w']+'}val') in levels:
            actual.append([levels[s.get('{'+ns['w']+'}val')], ''.join(t.text or '' for t in p.findall('.//w:t', ns))])
    source = Path(r'C:\Users\Lonn\.codex\attachments\182181b7-7cdd-4953-8cee-f107f60efa33\已粘贴的文本.txt').read_text(encoding='utf-8')
    outline_text = source.split('## 三、文档大纲', 1)[1].split('## 四、图片、截图与图表要求', 1)[0]
    expected = []
    for line in outline_text.splitlines():
        if line.startswith('## '):
            expected.append([1, line[3:].strip()])
        elif line.startswith('**') and line.endswith('**'):
            expected.append([2, line[2:-2].strip()])
        elif line.startswith('- '):
            expected.append([3, line[2:].strip()])
    bad_colors = []
    for name in z.namelist():
        if name.startswith('word/') and name.endswith('.xml'):
            tree = ET.fromstring(z.read(name))
            for c in tree.findall('.//w:color', ns):
                if c.get('{'+ns['w']+'}val') not in ['000000', 'auto']:
                    bad_colors.append((name, c.attrib))
    audit = {'pages': len(pdf), 'heading_count':len(actual), 'source_heading_count':len(expected), 'headings_match': actual == expected, 'bad_colors':bad_colors, 'embedded_images':len([n for n in z.namelist() if n.startswith('word/media/')])}
    (QA / 'audit.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(audit, ensure_ascii=False))
for page in pages:
    print('PAGE', page['page'], 'CHARS', len(page['text']), 'START', repr(page['text'][:100]), 'END', repr(page['text'][-100:]))
