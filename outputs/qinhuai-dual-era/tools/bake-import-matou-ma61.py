"""Bake isolated Ma61 fields for audited first-row horse-head-wall buildings.
Original city GLBs, layout, study presets and other building types are read-only.
"""
from pathlib import Path
import ast, json, hashlib
import numpy as np
from scipy.spatial import cKDTree
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/qinhuai-modern-import/night/matou-ma61'
# Deliberately omit city baker's top-level writes.
source=ROOT/'tools/build_import_night_layout.py'
tree=ast.parse(source.read_text(encoding='utf8'))
module=ast.Module(body=[n for n in tree.body if isinstance(n,(ast.Import,ast.ImportFrom)) or isinstance(n,ast.FunctionDef) and n.name in {'read_glb','local_matrix','accessor'}],type_ignores=[])
h={};exec(compile(module,str(source),'exec'),h)
# Explicit source-object allowlist, not a material-wide/waterfront-zone override.
# The northeast source meshes also contain a non-Matou riverside gallery to the
# west of x=13. All its triangles and original fixtures are retained unchanged.
GROUPS=[
 ('north-west',9,[698,699,700,701,704,705,706,707,708],None),
 ('north-east',10,[841,842,843,844,847,855,856,858,859,865,866,867,868],13.0),
 ('north-east-end',10,[895,896,897,898,899,900],None),
 ('south-west',5,[902,903,904,905,910,913,915,917],None),
 ('south-center',6,[934,938,939,940,941,943,944,945,946],None),
 ('south-east',6,[948,949,951,952,954,955],None),
 ('south-east-shop',6,[959,963,966,967,968,969,970],None),
 ('south-east-pair',6,[972,975,976,977,978,980],None),
 ('south-east-end',6,[983,984,985,986,987],None),
]
ROLES={35:'roof',36:'roof',58:'roof',49:'facade',54:'facade',108:'trim',109:'window',110:'window',118:'window',101:'window',78:'window',87:'window',88:'window'}

def build():
 OUT.mkdir(parents=True,exist_ok=True)
 layout=json.loads((ROOT/'assets/qinhuai-modern-import/night/layout.json').read_text(encoding='utf8'))
 result={'version':1,'label':'马61','scope':'First row adjoining the main river only; explicitly audited horse-head-wall architecture. Excludes pavilion, ordinary riverside shops, temple and inland blocks.','groups':[],'sourceHashes':{}}
 docs={}
 for ident,tile,numbers,min_x in GROUPS:
  tilekey=f'tile-{tile:02d}'
  if tile not in docs:docs[tile]=h['read_glb'](ROOT/f'assets/qinhuai-modern-import/tiles/{tilekey}.glb')
  doc,blob,digest=docs[tile];result['sourceHashes'][tilekey]=digest
  names={f'FuziTemple{n:04d}' for n in numbers};rules=[];triangles=[];positions=[]
  parents={c:i for i,n in enumerate(doc['nodes']) for c in n.get('children',[])};worlds={}
  def world(i):
   if i not in worlds:worlds[i]=(world(parents[i]) if i in parents else np.eye(4))@h['local_matrix'](doc['nodes'][i])
   return worlds[i]
  for i,n in enumerate(doc['nodes']):
   if n.get('name') not in names:continue
   for prim in doc['meshes'][n['mesh']]['primitives']:
    material=doc['materials'][prim['material']]['name'];role=ROLES[int(material.replace('FuziTemple',''))]
    vertices=h['accessor'](doc,blob,prim['attributes']['POSITION']);vertices=(np.c_[vertices,np.ones(len(vertices))]@world(i).T)[:,:3]
    index=h['accessor'](doc,blob,prim['indices']).ravel().reshape(-1,3) if 'indices'in prim else np.arange(len(vertices)).reshape(-1,3)
    tris=vertices[index]
    if min_x is not None:tris=tris[(tris[:,:,0]>=min_x-1e-6).all(axis=1)]
    if not len(tris):continue
    positions.append(tris.reshape(-1,3))
    if role=='roof':triangles.append(tris)
    rules.append({'node':n['name'],'material':material,'role':role,'bounds':layout['tiles'][tilekey]['bounds'][n['name']]})
  assert {r['node'] for r in rules}==names,(ident,names-{r['node'] for r in rules})
  triangles=np.concatenate(triangles);low=triangles[:,:,[0,2]].min(1);high=triangles[:,:,[0,2]].max(1)
  def roof_y(xz,height):
   t=triangles[((low<=xz)&(high>=xz)).all(1)];a,b,c=t[:,0],t[:,1],t[:,2]
   v0=b[:,[0,2]]-a[:,[0,2]];v1=c[:,[0,2]]-a[:,[0,2]];v2=xz-a[:,[0,2]]
   det=v0[:,0]*v1[:,1]-v0[:,1]*v1[:,0];ok=np.abs(det)>1e-8
   a=a[ok];b=b[ok];c=c[ok];v0=v0[ok];v1=v1[ok];v2=v2[ok];det=det[ok]
   u=(v2[:,0]*v1[:,1]-v2[:,1]*v1[:,0])/det;v=(v0[:,0]*v2[:,1]-v0[:,1]*v2[:,0])/det
   y=a[:,1]+u*(b[:,1]-a[:,1])+v*(c[:,1]-a[:,1]);hits=y[(u>=-.001)&(v>=-.001)&(u+v<=1.001)&(y<height+.04)&(y>height-.7)]
   return float(hits.max()) if len(hits) else None
  paths=[];rejected=[]
  for fixture in layout['tiles'][tilekey]['fixtures']:
   if fixture['node'] not in names or fixture['kind']!='eave':continue
   for seg in np.array(fixture['segments']).reshape(-1,2,3):
    seg=seg.copy();p,q=seg
    if min_x is not None:
     if max(p[0],q[0])<min_x:continue
     if min(p[0],q[0])<min_x:
      cut=p+(q-p)*(min_x-p[0])/(q[0]-p[0])
      if p[0]<min_x:seg[0]=cut
      else:seg[1]=cut
      p,q=seg
    length=np.linalg.norm(q-p)
    if length<.24 or abs(p[1]-q[1])>=max(.035,length*.065):continue
    tangent=(q-p)[[0,2]];tangent/=np.linalg.norm(tangent);side=np.array([-tangent[1],tangent[0]])*.30
    ridge=0
    for t in [.25,.5,.75]:
     mid=p*(1-t)+q*t;l=roof_y(mid[[0,2]]+side,mid[1]);r=roof_y(mid[[0,2]]-side,mid[1])
     if l is not None and r is not None and .065<mid[1]-l<.65 and .065<mid[1]-r<.65:ridge+=1
    if ridge>=2:rejected.append(seg.tolist());continue
    paths.append(seg)
  assert len(paths),ident
  samples=np.concatenate([np.linspace(p,q,max(2,int(np.linalg.norm(q-p)/.045)+1)) for p,q in paths]);samples[:,1]-=.12
  pos=np.concatenate(positions);lo=pos.min(0)-[.75,.8,.75];hi=pos.max(0)+[.75,.3,.75];size=np.maximum(2,np.ceil((hi-lo)/.14).astype(int));step=(hi-lo)/size
  plane=np.meshgrid(lo[0]+(np.arange(size[0])+.5)*step[0],lo[1]+(np.arange(size[1])+.5)*step[1],indexing='xy')
  field=np.empty((size[2],size[1],size[0],4),dtype='<f2');lookup=cKDTree(samples)
  for z in range(size[2]):
   queries=np.c_[plane[0].ravel(),plane[1].ravel(),np.full(plane[0].size,lo[2]+(z+.5)*step[2])]
   _,ids=lookup.query(queries,k=min(8,len(samples)),workers=2);delta=queries[:,None,:]-samples[ids]
   horizontal=np.linalg.norm(delta[:,:,[0,2]],axis=2);vertical=delta[:,:,1]
   score=(horizontal/.8)**2+(vertical/np.where(vertical>0,.17,1.2))**2
   field[z,:,:,:3]=delta[np.arange(len(queries)),np.argmin(score,axis=1)].reshape(size[1],size[0],3);field[z,:,:,3]=1
  base=OUT/ident;base.mkdir(exist_ok=True);filename='soft-spill-offset-rgba16f-v2.bin';(base/filename).write_bytes(field.tobytes())
  info={'version':2,'encoding':'offset-rgba16f','file':filename,'size':size.tolist(),'min':lo.tolist(),'max':hi.tolist(),'modelMin':pos.min(0).tolist(),'modelMax':pos.max(0).tolist(),'bytes':field.nbytes,'sourceSha256':digest,'eaveSegments':len(paths),'placement':'Measured recessed eaves only; no ridge sources','method':'Same nearest-emitter offset bake as Matou study; field local to this building group','recess':.12}
  (base/'soft-spill-v2.json').write_text(json.dumps(info,indent=2),encoding='utf8')
  (base/'eave-path-audit.json').write_text(json.dumps({'accepted':np.asarray(paths).tolist(),'excludedRidges':rejected}),encoding='utf8')
  result['groups'].append({'id':ident,'tile':tile,'nodes':sorted(names),'rules':rules,'minX':min_x,'softSpill':f'{ident}/soft-spill-v2.json'})
  print(json.dumps({'group':ident,'nodes':len(names),'segments':len(paths),'bytes':field.nbytes}),flush=True)
 (OUT/'manifest.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
if __name__=='__main__':build()
