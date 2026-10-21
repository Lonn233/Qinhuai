"""Bake a shared, directional under-eave light field for the matou study only.
R: recessed continuous soffit light. G: broad, low-energy local bounce.
No source geometry, UV, material assets or main-map resources are changed.
"""
from pathlib import Path
import json, struct
import numpy as np
from scipy.spatial import cKDTree
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/building-study/matou'

def roof_triangles(manifest):
 raw=(OUT/manifest['file']).read_bytes(); length=struct.unpack_from('<I',raw,12)[0]
 doc=json.loads(raw[20:20+length]); binary=raw[28+length:]
 types={5121:'u1',5123:'<u2',5125:'<u4',5126:'<f4'}
 def read(index):
  a=doc['accessors'][index];v=doc['bufferViews'][a['bufferView']];width={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']]
  dtype=np.dtype(types[a['componentType']]);offset=v.get('byteOffset',0)+a.get('byteOffset',0)
  return np.ndarray((a['count'],width),dtype=dtype,buffer=binary,offset=offset,strides=(v.get('byteStride',width*dtype.itemsize),dtype.itemsize)).copy()
 parents={child:i for i,n in enumerate(doc['nodes']) for child in n.get('children',[])}
 def world(i):
  n=doc['nodes'][i]
  if 'matrix' in n:matrix=np.array(n['matrix']).reshape(4,4).T
  else:
   x,y,z,w=n.get('rotation',[0,0,0,1]);matrix=np.eye(4)
   matrix[:3,:3]=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])@np.diag(n.get('scale',[1,1,1]));matrix[:3,3]=n.get('translation',[0,0,0])
  return world(parents[i])@matrix if i in parents else matrix
 names={r['node'] for r in manifest['rules'] if r['role']=='roof'};triangles=[]
 for i,n in enumerate(doc['nodes']):
  if n.get('name') not in names:continue
  for p in doc['meshes'][n['mesh']]['primitives']:
   pos=read(p['attributes']['POSITION']);pos=(np.c_[pos,np.ones(len(pos))]@world(i).T)[:,:3]
   triangles.append(pos[read(p['indices']).ravel().reshape(-1,3)])
 return np.concatenate(triangles)

def bake():
 manifest=json.loads((OUT/'manifest.json').read_text(encoding='utf8'))
 layout=json.loads((ROOT/'assets/qinhuai-modern-import/night/layout.json').read_text(encoding='utf8'))
 triangles=roof_triangles(manifest)
 # Detect real ridges: a surface descends on both sides of the path.
 # Wall caps have no adjacent sloped surface and must remain eligible.
 def roof_y(xz,height):
  a,b,c=triangles[:,0],triangles[:,1],triangles[:,2]
  inside=(np.min(triangles[:,:,[0,2]],axis=1)<=xz).all(axis=1)&(np.max(triangles[:,:,[0,2]],axis=1)>=xz).all(axis=1)
  aa,bb,cc=a[inside],b[inside],c[inside]
  v0=bb[:,[0,2]]-aa[:,[0,2]];v1=cc[:,[0,2]]-aa[:,[0,2]];v2=xz-aa[:,[0,2]]
  det=v0[:,0]*v1[:,1]-v0[:,1]*v1[:,0];valid=np.abs(det)>1e-8
  aa=aa[valid];bb=bb[valid];cc=cc[valid];v0=v0[valid];v1=v1[valid];v2=v2[valid];det=det[valid]
  u=(v2[:,0]*v1[:,1]-v2[:,1]*v1[:,0])/det;v=(v0[:,0]*v2[:,1]-v0[:,1]*v2[:,0])/det
  y=aa[:,1]+u*(bb[:,1]-aa[:,1])+v*(cc[:,1]-aa[:,1])
  hits=y[(u>=-.001)&(v>=-.001)&(u+v<=1.001)&(y<height+.04)&(y>height-.7)]
  return float(hits.max()) if len(hits) else None
 paths=[];rejected=[]
 for fixture in layout['tiles']['tile-09']['fixtures']:
  if fixture['node'] not in manifest['nodes'] or fixture['kind']!='eave':continue
  for segment in np.array(fixture['segments']).reshape(-1,2,3):
   p,q=segment;length=np.linalg.norm(q-p)
   if length<.24 or abs(p[1]-q[1])>=max(.035,length*.065):continue
   tangent=(q-p)[[0,2]];tangent/=np.linalg.norm(tangent);side=np.array([-tangent[1],tangent[0]])*.30
   ridge=0
   for t in [.25,.5,.75]:
    mid=p*(1-t)+q*t;l=roof_y(mid[[0,2]]+side,mid[1]);r=roof_y(mid[[0,2]]-side,mid[1])
    if l is not None and r is not None and .065<mid[1]-l<.65 and .065<mid[1]-r<.65:ridge+=1
   if ridge>=2:rejected.append(segment.tolist());continue
   paths.append(segment)
 if not paths:raise RuntimeError('No valid under-eave paths')
 samples=np.concatenate([np.linspace(p,q,max(2,int(np.linalg.norm(q-p)/.025)+1)) for p,q in paths]);samples[:,1]-=.12
 tree=cKDTree(samples)
 lo=np.min([r['bounds']['min'] for r in manifest['rules']],axis=0)-[.8,1.2,.8]
 hi=np.max([r['bounds']['max'] for r in manifest['rules']],axis=0)+[.8,.35,.8]
 size=np.maximum(2,np.ceil((hi-lo)/.085).astype(int));step=(hi-lo)/size
 plane=np.meshgrid(lo[0]+(np.arange(size[0])+.5)*step[0],lo[1]+(np.arange(size[1])+.5)*step[1],indexing='xy')
 response=np.empty((size[2],size[1],size[0],2),dtype=np.uint8)
 for z in range(size[2]):
  queries=np.c_[plane[0].ravel(),plane[1].ravel(),np.full(plane[0].size,lo[2]+(z+.5)*step[2])]
  _,nearest=tree.query(queries,workers=2);delta=queries-samples[nearest]
  horizontal=np.linalg.norm(delta[:,[0,2]],axis=1);vertical=delta[:,1]
  core=np.exp(-.5*((horizontal/.14)**2+(vertical/np.where(vertical>0,.055,.18))**2))
  spill=np.exp(-.5*((horizontal/.50)**2+(vertical/np.where(vertical>0,.10,.60))**2))
  response[z,...,0]=np.uint8(np.clip(core.reshape(size[1],size[0]),0,1)*255)
  response[z,...,1]=np.uint8(np.clip(spill.reshape(size[1],size[0]),0,1)*255)
 filename='matou-undereave-rg8-v2.bin';(OUT/filename).write_bytes(response.tobytes())
 info={'file':filename,'size':size.tolist(),'min':lo.tolist(),'max':hi.tolist(),'bytes':response.nbytes,'channels':2,'eaveSegments':len(paths),'ridgeSegments':0}
 manifest['fields']={rule['node']:dict(info) for rule in manifest['rules']}
 manifest['lighting']={'version':'under-eave-v2','placement':'Recessed soffits and inner eave edges; no top-face emission. Broad, downward-biased local wall spill.','eaveSegments':len(paths),'excludedRidgeSegments':len(rejected),'recessBelowPath':.12,'coreWidth':.14,'softSpill':.50,'downwardSpill':.60,'sharedField':filename,'channels':['soffitCore','localBounce'],'sourceMetalnessCorrection':'Study-only cloned materials use dielectric metalness 0. Original GLB unchanged.'}
 (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
 (OUT/'eave-path-audit.json').write_text(json.dumps({'accepted':[p.tolist() for p in paths],'excludedRidges':rejected},indent=2),encoding='utf8')
 print(json.dumps({'fieldFiles':1,'bindings':len(manifest['fields']),'segments':len(paths),'excludedRidges':len(rejected),'fieldBytes':response.nbytes,'size':size.tolist()},indent=2))
if __name__=='__main__':bake()
