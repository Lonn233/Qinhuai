import json,struct,copy,hashlib,shutil,argparse
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/qinhuai-modern-import'
parser=argparse.ArgumentParser()
parser.add_argument('--building',choices=['temple','pavilion','matou'],default='temple')
building=parser.parse_args().building
MATOU_ROLES={
 'FuziTemple0698':'roof','FuziTemple0699':'roof','FuziTemple0700':'roof',
 'FuziTemple0701':'facade','FuziTemple0704':'facade','FuziTemple0705':'trim',
 'FuziTemple0706':'window','FuziTemple0707':'window','FuziTemple0708':'roof',
}

OUT=ROOT/'assets/building-study'/building
OUT.mkdir(parents=True,exist_ok=True)
layout=json.loads((SRC/'night/layout.json').read_text(encoding='utf8'))
dst={'asset':{'version':'2.0','generator':'Qinhuai temple subset; original vertex buffers, UVs and materials'},'scene':0,'scenes':[{'nodes':[]}],'nodes':[],'meshes':[],'materials':[],'textures':[],'images':[],'samplers':[],'accessors':[],'bufferViews':[],'buffers':[]}
binary=bytearray(); image_cache={}; report={'nodes':[],'triangles':0,'vertices':0,'rules':[],'fields':{},'masks':{}}
def add_view(data,extras=None):
 while len(binary)%4:binary.append(0)
 v={'buffer':0,'byteOffset':len(binary),'byteLength':len(data),**(extras or {})};binary.extend(data);dst['bufferViews'].append(v);return len(dst['bufferViews'])-1
def matrix(n):
 if 'matrix' in n:return np.array(n['matrix']).reshape(4,4).T
 x,y,z,w=n.get('rotation',[0,0,0,1]);m=np.eye(4)
 m[:3,:3]=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])@np.diag(n.get('scale',[1,1,1]));m[:3,3]=n.get('translation',[0,0,0]);return m
for tile in (['tile-10'] if building=='pavilion' else ['tile-09'] if building=='matou' else ['tile-09','tile-10']):
 raw=(SRC/f'tiles/{tile}.glb').read_bytes();n=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+n]);blob=raw[28+n:]
 parents={c:i for i,node in enumerate(doc['nodes']) for c in node.get('children',[])}
 def world(i):return (world(parents[i]) if i in parents else np.eye(4))@matrix(doc['nodes'][i])
 views={};accessors={};materials={};textures={};samplers={}
 def view(i):
  if i not in views:
   v=doc['bufferViews'][i];start=v.get('byteOffset',0);views[i]=add_view(blob[start:start+v['byteLength']],{k:v[k] for k in ['target','byteStride'] if k in v})
  return views[i]
 def accessor(i):
  if i not in accessors:
   a=copy.deepcopy(doc['accessors'][i]);assert 'sparse' not in a;a['bufferView']=view(a['bufferView']);accessors[i]=len(dst['accessors']);dst['accessors'].append(a)
  return accessors[i]
 def texture(i):
  if i not in textures:
   t=copy.deepcopy(doc['textures'][i]);im=copy.deepcopy(doc['images'][t['source']]);v=doc['bufferViews'][im['bufferView']];start=v.get('byteOffset',0);data=blob[start:start+v['byteLength']];h=hashlib.sha256(data).hexdigest()
   if h not in image_cache:
    im['bufferView']=add_view(data);image_cache[h]=len(dst['images']);dst['images'].append(im)
   t['source']=image_cache[h]
   if 'sampler' in t:
    si=t['sampler']
    if si not in samplers:samplers[si]=len(dst['samplers']);dst['samplers'].append(doc['samplers'][si])
    t['sampler']=samplers[si]
   textures[i]=len(dst['textures']);dst['textures'].append(t)
  return textures[i]
 def material(i):
  if i not in materials:
   m=copy.deepcopy(doc['materials'][i])
   def visit(d):
    for k,v in d.items():
     if isinstance(v,dict):
      if 'Texture' in k and 'index' in v:v['index']=texture(v['index'])
      else:visit(v)
   visit(m);materials[i]=len(dst['materials']);dst['materials'].append(m)
  return materials[i]
 for i,node in enumerate(doc['nodes']):
  name=node.get('name','')
  if 'mesh' not in node or not name.startswith('FuziTemple'):continue
  selected=(name in MATOU_ROLES) if building=='matou' else (870<=int(name[10:])<=878) if building=='pavilion' else (1070<=int(name[10:])<=1124)
  if not selected:continue
  mesh=copy.deepcopy(doc['meshes'][node['mesh']]);tris=verts=0
  for p in mesh['primitives']:
   tris+=doc['accessors'][p['indices']]['count']//3;verts+=doc['accessors'][p['attributes']['POSITION']]['count']
   p['attributes']={k:accessor(v) for k,v in p['attributes'].items()};p['indices']=accessor(p['indices']);
   if 'material' in p:p['material']=material(p['material'])
  ni={'name':name,'matrix':world(i).T.flatten().tolist(),'mesh':len(dst['meshes'])};dst['meshes'].append(mesh);dst['scenes'][0]['nodes'].append(len(dst['nodes']));dst['nodes'].append(ni)
  report['nodes'].append(name);report['triangles']+=tris;report['vertices']+=verts
  if building=='matou':
   # Resolve the primitive's real material name, never an assumed shared name.
   for primitive in doc['meshes'][node['mesh']]['primitives']:
    if 'material' in primitive:
     report['rules'].append({'node':name,'material':doc['materials'][primitive['material']]['name'],'role':MATOU_ROLES[name],'bounds':layout['tiles'][tile]['bounds'][name]})
  else:
   report['rules'] += [{**r,'bounds':layout['tiles'][tile]['bounds'][name]} for r in layout['tiles'][tile]['materials'] if r['node']==name]
  if name in layout['surfaceFields']:
   field=copy.deepcopy(layout['surfaceFields'][name]);file=Path(field['file']).name;shutil.copyfile(SRC/'night'/field['file'],OUT/file);field['file']=file;report['fields'][name]=field
if building=='pavilion':
 for rule in report['rules']:
  if rule['role']=='pavilionWood':rule['role']='templeFacade'
for mat,file in layout['windowMasks'].items():
 if any(r['material']==mat and r['role']=='window' for r in report['rules']):
  target=Path(file).name;shutil.copyfile(SRC/'night'/file,OUT/target);report['masks'][mat]=target
for ext in ['extensionsUsed','extensionsRequired']:
 if ext in doc:dst[ext]=doc[ext]
while len(binary)%4:binary.append(0)
dst['buffers']=[{'byteLength':len(binary)}]
j=json.dumps(dst,separators=(',',':')).encode();j+=b' '*((-len(j))%4)
glb=struct.pack('<III',0x46546c67,2,28+len(j)+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary
(OUT/(building+'.glb')).write_bytes(glb);report.update({'file':building+'.glb','bytes':len(glb),'images':len(dst['images']),'meshes':len(dst['meshes']),'source':('tile-10.glb; FuziTemple0870–0878' if building=='pavilion' else 'tile-09.glb; FuziTemple0698–0701,0704–0708' if building=='matou' else 'tile-09.glb + tile-10.glb; FuziTemple1070–1124'),'preserved':'Original geometry, UVs, textures, normals and world transforms; no decimation.'})
(OUT/'manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:report[k] for k in ['meshes','triangles','vertices','bytes','images']},indent=2))
if building=='matou':
 import runpy
 runpy.run_path(str(ROOT/'tools/bake-matou-study.py'),run_name='__main__')

