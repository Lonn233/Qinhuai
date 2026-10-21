"""Read-only GLB inventory; no source assets are rewritten."""
from pathlib import Path
import json,struct,hashlib,mmap,io
from PIL import Image
root=Path(__file__).resolve().parents[1];out=root/'performance/2026-10-17'
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
def audit(p):
 with p.open('rb') as f,mmap.mmap(f.fileno(),0,access=mmap.ACCESS_READ) as b:
  assert b[:4]==b'glTF' and struct.unpack_from('<I',b,4)[0]==2
  jl=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+jl]);base=28+jl
  primitives=[];views=set()
  for mesh in j.get('meshes',[]):
   for pr in mesh['primitives']:
    pos=j['accessors'][pr['attributes']['POSITION']];n=j['accessors'][pr['indices']]['count'] if 'indices' in pr else pos['count'];mode=pr.get('mode',4)
    for ai in list(pr['attributes'].values())+([pr['indices']] if 'indices' in pr else []):views.add(j['accessors'][ai]['bufferView'])
    primitives.append({'vertices':pos['count'],'triangles':n//3 if mode==4 else n-2 if mode in [5,6] else 0,'mode':mode,'attributes':list(pr['attributes']),'material':pr.get('material'),'bounds':{k:pos.get(k) for k in ['min','max']}})
  images=[]
  for im in j.get('images',[]):
   if 'bufferView' not in im:images.append({'uri':im.get('uri'),'external':True});continue
   v=j['bufferViews'][im['bufferView']];start=base+v.get('byteOffset',0);data=b[start:start+v['byteLength']]
   with Image.open(io.BytesIO(data)) as image:size=list(image.size)
   images.append({'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'mime':im.get('mimeType'),'size':size})
  return {'file':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p),'meshes':len(j.get('meshes',[])),'primitives':primitives,'vertices':sum(x['vertices'] for x in primitives),'triangles':sum(x['triangles'] for x in primitives),'geometryBufferBytes':sum(j['bufferViews'][v]['byteLength'] for v in views),'materials':len(j.get('materials',[])),'doubleSidedMaterials':sum(bool(x.get('doubleSided')) for x in j.get('materials',[])),'images':images,'sceneNodeCount':len(j.get('nodes',[])),'note':'Unique file primitives, NOT per-frame submitted triangles or browser VRAM.'}
files=[root/x for x in ['Meshy_AI_kuixingge_1016044736_texture.glb','qiao.glb','hehua_1.glb','hehua-main.glb']]+sorted((root/'assets/kuixing-pilot/export').glob('*.glb'))
reports=[audit(p) for p in files];assert reports[0]['sha256']=='f6ac2f7eecb4e667bc301d2d1a41d39e5b9a8a25e9ceda34add0d4f46e091c4d'
source_maps=[x['sha256'] for x in reports[0]['images']]
for r in reports[4:]:
 if '_tex' not in r['file']:assert [x['sha256'] for x in r['images']]==source_maps
out.mkdir(exist_ok=True,parents=True);(out/'asset-inventory.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf8')
for r in reports: print(json.dumps({k:r[k] for k in ['file','bytes','triangles','vertices','geometryBufferBytes']},ensure_ascii=False))
