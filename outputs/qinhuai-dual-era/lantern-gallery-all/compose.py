from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, zipfile
root=Path(r'E:\soft\project\codex-Qinhuai\outputs\qinhuai-dual-era\lantern-gallery-all')
files=sorted(p for p in root.glob('??-*.png') if '展示卡' not in p.stem)
assert len(files)==27, len(files)
font_path=r'C:\Windows\Fonts\msyhbd.ttc'
font=ImageFont.truetype(font_path, 42, index=0)
small_font=ImageFont.truetype(font_path, 34, index=0)
bg=(9,11,14); card_bg=(18,22,26); white=(255,255,255)
def make_card(src, size=(800,850), font=font):
    label=src.stem.split('-',1)[1]
    img=Image.open(src).convert('RGB')
    side=min(760,size[0]-32,size[1]-116)
    img=img.resize((side,side),Image.Resampling.LANCZOS)
    card=Image.new('RGB',size,bg)
    card.paste(img,((size[0]-side)//2,12))
    d=ImageDraw.Draw(card)
    y=12+side+16
    d.rectangle((0,y-10,size[0],size[1]),fill=card_bg)
    box=d.textbbox((0,0),label,font=font)
    x=(size[0]-(box[2]-box[0]))//2
    d.text((x,y+9),label,font=font,fill=white,stroke_width=0)
    return card
# Individual model cards with centered white names below each render.
for src in files:
    label=src.stem.split('-',1)[1]
    card=make_card(src)
    card.save(root/(src.stem+'-展示卡.png'),quality=95)
# Contact sheet: all 27 lantern models, labels remain centered and white below each image.
thumb_w,thumb_h=520,570
cols=4; rows=(len(files)+cols-1)//cols; gap=18; margin=28; header=90
sheet=Image.new('RGB',(margin*2+cols*thumb_w+(cols-1)*gap,header+margin*2+rows*thumb_h+(rows-1)*gap),bg)
d=ImageDraw.Draw(sheet)
title_font=ImageFont.truetype(font_path,44,index=0)
title='秦淮灯彩 · 全部灯具模型'
tb=d.textbbox((0,0),title,font=title_font)
d.text(((sheet.width-(tb[2]-tb[0]))//2,20),title,font=title_font,fill=white)
for idx,src in enumerate(files):
    card=make_card(src,(thumb_w,thumb_h),small_font)
    x=margin+(idx%cols)*(thumb_w+gap)
    y=header+margin+(idx//cols)*(thumb_h+gap)
    sheet.paste(card,(x,y))
sheet.save(root/'全部灯具名称与模型总览.png')
# Detail pages by gallery order, 9 per sheet.
for page in range(3):
    sub=files[page*9:(page+1)*9]
    cols2=3; rows2=3; tw,th=640,690; gap2=20; margin2=28; hdr=82
    out=Image.new('RGB',(margin2*2+cols2*tw+gap2*2,hdr+margin2*2+rows2*th+gap2*2),bg)
    dr=ImageDraw.Draw(out)
    heading=ImageFont.truetype(font_path,40,index=0)
    label=f'秦淮灯彩 · 灯具模型 {page*9+1:02d}–{page*9+len(sub):02d}'
    bb=dr.textbbox((0,0),label,font=heading)
    dr.text(((out.width-(bb[2]-bb[0]))//2,16),label,font=heading,fill=white)
    for i,src in enumerate(sub):
        card=make_card(src,(tw,th),small_font)
        out.paste(card,(margin2+(i%3)*(tw+gap2),hdr+margin2+(i//3)*(th+gap2)))
    out.save(root/f'灯具总览-{page+1}.png')
readme='''秦淮灯彩全部灯具模型展示图\n\n共 27 款，含单灯高清图、展示卡片及总览图。每张卡片均将灯名以白色居中文字放在模型图下方。\n模型图由原始 GLB 文件直接加载渲染，使用其内嵌模型、材质和贴图，辅以棚拍灯光；未从项目降面 GLB 渲染。\n说明：同一模型的颜色/场景变体（如庭院灯架系列、金色树灯）按目录名称分别列出。\n'''
(root/'说明.txt').write_text(readme,encoding='utf-8')
zip_path=root.parent/'秦淮灯彩全部灯具展示图.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in sorted(root.iterdir()):
        if p.is_file() and p.suffix.lower()=='.png': z.write(p,p.name)
    z.write(root/'说明.txt','说明.txt')
print('files',len(files),'cards',len(list(root.glob('??-*-展示卡.png'))),'zip',zip_path,zip_path.stat().st_size,'overview', (root/'全部灯具名称与模型总览.png').stat().st_size)
