from pathlib import Path
import json
import zipfile
from docx import Document
import pypdfium2 as pdfium
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parent
QA = ROOT / 'project-intro-format-qa'
source = ROOT / '一灯一匠——秦淮灯彩数字体验传承_作品介绍文档.docx'
target = source.with_name(source.stem + '_排版优化版.docx')
before, after = Document(source), Document(target)
def body_text(doc):
    started = False
    text = []
    for p in doc.paragraphs:
        if p.style.name == 'Heading 1' and p.text == '一、作品概述':
            started = True
        if started and p.text:
            text.append(p.text)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                text.append(cell.text)
    return text
def headings(doc):
    return [(p.style.name, p.text) for p in doc.paragraphs if p.style.name.startswith('Heading')]
with zipfile.ZipFile(source) as a, zipfile.ZipFile(target) as b:
    media = lambda z: {n: z.read(n) for n in z.namelist() if n.startswith('word/media/')}
    same_images = media(a) == media(b)
pdf = pdfium.PdfDocument(QA / 'document.pdf')
thumbs, pages = [], []
for i, page in enumerate(pdf):
    im = page.render(scale=1.5).to_pil().convert('RGB')
    im.save(QA / f'page-{i+1:02}.png')
    thumb = ImageOps.contain(im, (360, 510))
    tile = Image.new('RGB', (380, 540), '#dddddd')
    tile.paste(thumb, ((380-thumb.width)//2, 8))
    ImageDraw.Draw(tile).text((12, 522), f'Page {i+1}', fill='black')
    thumbs.append(tile)
    txt = page.get_textpage().get_text_range()
    pages.append({'page': i+1, 'text': txt})
    print('PAGE', i+1, 'CHARS', len(txt), 'START', repr(txt[:65]), 'END', repr(txt[-55:]))
for start in range(0, len(thumbs), 6):
    sheet = Image.new('RGB', (1140, 1080), 'white')
    for j, thumb in enumerate(thumbs[start:start+6]):
        sheet.paste(thumb, ((j%3)*380, (j//3)*540))
    sheet.save(QA / f'contact-{start//6+1}.jpg', quality=92)
audit = {'pages':len(pdf), 'headings':len(headings(after)),
         'headings_unchanged':headings(before)==headings(after),
         'body_and_tables_unchanged':body_text(before)==body_text(after),
         'images_unchanged':same_images, 'sections':len(after.sections)}
(QA / 'audit.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding='utf-8')
(QA / 'page-text.json').write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(audit))
