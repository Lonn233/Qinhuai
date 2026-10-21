# Sample actual triangle elevations under each land lantern's circular footprint.
from pathlib import Path
import ast,json,struct,hashlib
import numpy as np
ROOT=Path.cwd();OUT=ROOT/'assets/qinhuai-modern-import/festival'
from import_glb_utils import read_glb,local_matrix,accessor
layout=json.loads((OUT/'layout.json').read_text(encoding='utf8'));plans=[p for p in layout['placements'] if p['kind'] in ['lion','mountain']]
queries=[];owners=[]
for p in plans:
 radius=(15*layout['mapUnitsPerMeter']*.60 if p['kind']=='mountain' else p['sizeMeters']*layout['mapUnitsPerMeter']*.60)
 for x in np.linspace(-radius,radius,9):
  for z in np.linspace(-radius,radius,9):
   if x*x+z*z<=radius*radius:queries.append([p['x']+x,p['z']+z]);owners.append(p['id'])
q=np.array(queries);highest=np.zeros(len(q));names=['']*len(q)
for tile in [5,9,10]:
 doc,blob,_=read_glb(ROOT/f'assets/qinhuai-modern-import/tiles/tile-{tile:02d}.glb')
 def visit(i,parent):
  n=doc['nodes'][i];m=parent@local_matrix(n)
  if 'mesh' in n:
   for p in doc['meshes'][n['mesh']]['primitives']:
    v=accessor(doc,blob,p['attributes']['POSITION']);v=v@m[:3,:3].T+m[:3,3]
    lo,hi=v.min(0),v.max(0)
    indices=np.flatnonzero((q[:,0]>=lo[0])&(q[:,0]<=hi[0])&(q[:,1]>=lo[2])&(q[:,1]<=hi[2]))
    if not len(indices):continue
    t=accessor(doc,blob,p['indices']).reshape(-1,3) if 'indices' in p else np.arange(len(v)).reshape(-1,3)
    faces=v[t];a,b,c=faces[:,0],faces[:,1],faces[:,2];den=(b[:,2]-c[:,2])*(a[:,0]-c[:,0])+(c[:,0]-b[:,0])*(a[:,2]-c[:,2]);valid=np.abs(den)>1e-10
    a,b,c,den=a[valid],b[valid],c[valid],den[valid]
    for k in indices:
     x,z=q[k];u=((b[:,2]-c[:,2])*(x-c[:,0])+(c[:,0]-b[:,0])*(z-c[:,2]))/den
     w=((c[:,2]-a[:,2])*(x-c[:,0])+(a[:,0]-c[:,0])*(z-c[:,2]))/den
     ok=(u>=0)&(w>=0)&(u+w<=1)
     if not ok.any():continue
     h=(u*a[:,1]+w*b[:,1]+(1-u-w)*c[:,1])[ok].max()
     if h>highest[k]:highest[k]=h;names[k]=n.get('name','')
  for j in n.get('children',[]):visit(j,m)
 for node in doc['scenes'][doc.get('scene',0)]['nodes']:visit(node,np.eye(4))
report=[]
for p in plans:
 inds=[i for i,n in enumerate(owners) if n==p['id']];report.append({'id':p['id'],'checkedRadius':(15 if p['kind']=='mountain' else p['sizeMeters'])*layout['mapUnitsPerMeter']*.60,'ground':p['y'],'maxHeight':float(highest[inds].max()),'hits':sorted(set(names[i] for i in inds if highest[i]>p['y']+.12))})
print(json.dumps(report,indent=2));(OUT/'collision-survey.json').write_text(json.dumps(report,indent=2))
