from pathlib import Path
import ast, json, struct, hashlib
import numpy as np
from PIL import Image, ImageDraw
ROOT=Path.cwd(); OUT=ROOT/'assets/qinhuai-modern-import/festival';OUT.mkdir(exist_ok=True)
from import_glb_utils import read_glb,local_matrix,accessor
shapes=[]; rows=[];waters=[]
for tile in [5,6,9,10]:
 doc,blob,_=read_glb(ROOT/f'assets/qinhuai-modern-import/tiles/tile-{tile:02d}.glb')
 def visit(i,parent):
  n=doc['nodes'][i];m=parent@local_matrix(n)
  if 'mesh' in n:
   for p in doc['meshes'][n['mesh']]['primitives']:
    v=accessor(doc,blob,p['attributes']['POSITION']);v=v@m[:3,:3].T+m[:3,3]
    lo=v.min(0);hi=v.max(0);mat=doc['materials'][p['material']] if 'material' in p else {};name=n.get('name',''); mn=mat.get('name','')
    tri=accessor(doc,blob,p['indices']).reshape(-1,3) if 'indices' in p else np.arange(len(v)).reshape(-1,3)
    water=(tile==6 and name=='FuziTemple0038') or any(w in (name+' '+mn).lower() for w in ['water','river','lake','surface','河','水面','水体'])
    row={'tile':tile,'name':name,'material':mn,'min':lo.tolist(),'max':hi.tolist(),'triangles':len(tri)}
    if hi[0]>-24 and lo[0]<52 and hi[2]>-52 and lo[2]<15:
     rows.append(row)
     shapes.append((v,tri,water))
    if water:
     print('WATER',row);waters.append((v,tri,row))
  for child in n.get('children',[]):visit(child,m)
 for node in doc['scenes'][doc.get('scene',0)]['nodes']:visit(node,np.eye(4))
(OUT/'survey-meshes.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf8')
# Height-coded top view. White outlines elevated buildings; ground dark; water cyan.
S=18; X=-25; Z=-55;im=Image.new('RGB',(int(80*S),int(75*S)),(10,16,24));d=ImageDraw.Draw(im)
polys=[]
for v,t,water in shapes:
 for tri in t:
  vv=v[tri];h=vv[:,1].mean()
  if vv[:,0].max()<X or vv[:,0].min()>X+80 or vv[:,2].max()<Z or vv[:,2].min()>Z+75:continue
  pts=[((x-X)*S,(z-Z)*S) for x,y,z in vv]
  c=(30,100,130) if water else ((int(min(210,45+(h-11.8)*28)),)*3 if h>=11.5 else (25,40,52))
  polys.append((h,pts,c))
for h,pts,c in sorted(polys,key=lambda a:a[0]):d.polygon(pts,fill=c)
for x in range(-20,55,5):
 d.line(((x-X)*S,0,(x-X)*S,75*S),fill=(40,60,65));d.text(((x-X)*S+3,3),str(x),fill='yellow')
for z in range(-50,20,5):
 d.line((0,(z-Z)*S,80*S,(z-Z)*S),fill=(40,60,65));d.text((3,(z-Z)*S+3),str(z),fill='yellow')
im.save(OUT/'survey-top.png')
print('MESHES',len(rows),'water',len(waters))
np.savez_compressed(OUT/'survey-water.npz',**{f'v{i}':v for i,(v,t,r) in enumerate(waters)},**{f't{i}':t for i,(v,t,r) in enumerate(waters)})
(OUT/'survey-water.json').write_text(json.dumps([r for v,t,r in waters],ensure_ascii=False,indent=2),encoding='utf8')

