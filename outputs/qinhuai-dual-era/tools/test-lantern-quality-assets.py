"""Audit every original/5% model: exact source geometry, ratios, UVs, hashes, finite data."""
from pathlib import Path
import json,struct,hashlib,numpy as np
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'assets/lantern-quality'
m=json.loads((BASE/'manifest.json').read_text(encoding='utf8'))
assert len(m['models'])==16

def glb(path):
 b=path.read_bytes(); n=struct.unpack_from('<I',b,12)[0]
 assert struct.unpack_from('<I',b,8)[0]==len(b)
 return b,json.loads(b[20:20+n]),b[n+28:]

def attribute_bytes(g,b,a):
 v=g['bufferViews'][a['bufferView']]; start=v.get('byteOffset',0)+a.get('byteOffset',0)
 size={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']]*{5120:1,5121:1,5122:2,5123:2,5125:4,5126:4}[a['componentType']]
 stride=v.get('byteStride',size)
 if stride==size:return b[start:start+a['count']*size]
 return b''.join(b[start+i*stride:start+i*stride+size] for i in range(a['count']))

results=[]
for kind,item in m['models'].items():
 src,sg,sb=glb(Path(item['source']));assert hashlib.sha256(src).hexdigest()==item['sourceSHA256']
 original=None
 for mode in ['original','five']:
  b,g,bb=glb(BASE/mode/(kind+'.glb'));p=g['meshes'][0]['primitives'][0]
  assert not g.get('images') and not g.get('materials')
  assert len(g['meshes'])==1 and len(g['meshes'][0]['primitives'])==1
  assert {'POSITION','NORMAL','TEXCOORD_0'}<=p['attributes'].keys()
  assert g['accessors'][p['indices']]['count']//3==item[mode]['triangles']
  assert hashlib.sha256(b).hexdigest()==item[mode]['geometrySHA256']
  for name in ['POSITION','NORMAL','TEXCOORD_0']:
   a=g['accessors'][p['attributes'][name]]
   assert a['componentType']==5126
   assert np.isfinite(np.frombuffer(attribute_bytes(g,bb,a),dtype='<f4')).all(),(kind,mode,name)
  if mode=='original':
   sp=sg['meshes'][0]['primitives'][0]
   for name,idx in p['attributes'].items():
    assert attribute_bytes(g,bb,g['accessors'][idx])==attribute_bytes(sg,sb,sg['accessors'][sp['attributes'][name]]),(kind,name)
   assert attribute_bytes(g,bb,g['accessors'][p['indices']])==attribute_bytes(sg,sb,sg['accessors'][sp['indices']])
   assert g['nodes']==sg['nodes'],'original transforms must match source'
 assert .049<=item['five']['triangles']/item['original']['triangles']<=.051
 results.append({'kind':kind,'sourceUnchanged':True,'originalGeometryExact':True,'uvNormalsFinite':True,'original':item['original']['triangles'],'five':item['five']['triangles'],'placed':item['placed']})
out=ROOT/'work/lantern-quality-five/asset-verification.json'
out.write_text(json.dumps({'passed':True,'models':results},indent=2),encoding='utf8')
print('PASS: 16 source assets unchanged; original geometry byte-exact; all 5% counts and hashes verified; UV/normals finite.')
for r in results:print(r['kind'],r['original'],'->',r['five'])
