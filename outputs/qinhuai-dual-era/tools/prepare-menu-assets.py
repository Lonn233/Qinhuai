from pathlib import Path
from PIL import Image
import shutil

root = Path(__file__).resolve().parents[1] / 'menu-assets'
root.mkdir(exist_ok=True)
shutil.copy2(Path('E:/soft/inspiration/灯会/图片/菜单/bg1.png'), root / 'background.png')
atlas = Image.open('F:/download/预览_UI透明资源总览.png').convert('RGBA')
boxes = {
    'seal': (140, 366, 167, 414),
    'chevron': (743, 379, 758, 402),
    'diamond': (443, 492, 457, 507),
    'double-diamond': (136, 595, 163, 625),
    'music': (439, 594, 463, 625),
    'active-border': (627, 694, 872, 748),
    'music-border': (54, 808, 244, 853),
    'equalizer': (740, 595, 758, 619),
}
for name, box in boxes.items():
    image = atlas.crop(box)
    pixels = []
    for r, g, b, a in image.getdata():
        if name == 'seal':
            alpha = min(255, max(0, round((r - max(g, b)) * 2.5)))
            pixels.append((173, 52, 42, alpha))
        else:
            alpha = min(255, max(0, round(max((r - b) * 5.4, (min(r, g, b) - 88) * 2.1))))
            pixels.append((245, 227, 187, alpha))
    image.putdata(pixels)
    image.save(root / (name + '.png'))
# Extract brush lettering at native resolution instead of enlarging the atlas preview.
title = Image.open('E:/soft/inspiration/灯会/图片/菜单/1.png').convert('RGB').crop((140, 155, 505, 395))
artwork = Image.new('RGBA', title.size)
artwork.putdata([
    (245, 235, 211, min(255, max(0, round((b - 115) * 3.4))))
    if r - b < 75 and g - b < 50 else (245, 235, 211, 0)
    for r, g, b in title.getdata()
])
artwork.save(root / 'title.png')
audio = Path('F:/Program Files/Image-Line/FL Studio 2025/Data/Templates/My/qinhuai')
for name in ['chime1.mp3', 'change.mp3', 'clap-click.mp3', 'flip.mp3']:
    shutil.copy2(audio / name, root / name)
print('Prepared menu artwork and four supplied sounds:', root)
