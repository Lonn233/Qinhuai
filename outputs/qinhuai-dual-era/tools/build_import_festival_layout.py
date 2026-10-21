"""Deterministic lamp plan based on actual GLB river triangles, not a river AABB."""
from pathlib import Path
import json,random,math
import numpy as np
from PIL import Image,ImageDraw
from shapely.geometry import Polygon,Point,box
from shapely.ops import unary_union
from import_glb_utils import read_glb, local_matrix, accessor
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/qinhuai-modern-import/festival'
OUT.mkdir(parents=True,exist_ok=True)
doc,blob,sourceHash=read_glb(ROOT/'assets/qinhuai-modern-import/tiles/tile-06.glb')
waterTriangles=[];waterHeight=[]
def visit(index,parent):
 node=doc['nodes'][index];matrix=parent@local_matrix(node)
 if node.get('name')=='FuziTemple0038':
  for primitive in doc['meshes'][node['mesh']]['primitives']:
   vertices=accessor(doc,blob,primitive['attributes']['POSITION'])
   vertices=vertices@matrix[:3,:3].T+matrix[:3,3]
   waterHeight.extend(vertices[:,1].tolist())
   for face in vertices[accessor(doc,blob,primitive['indices']).reshape(-1,3)]:
    if face[:,0].max()>-21 and face[:,0].min()<42 and face[:,2].max()>-12 and face[:,2].min()<7:
     triangle=face[:,[0,2]].round(6).tolist()
     if Polygon(triangle).area>1e-8:waterTriangles.append(triangle)
 for child in node.get('children',[]):visit(child,matrix)
for node in doc['scenes'][doc.get('scene',0)]['nodes']:visit(node,np.eye(4))
assert waterHeight and max(waterHeight)-min(waterHeight)<1e-6,'Expected measured planar river'
w={'tile':6,'node':'FuziTemple0038','sourceHash':sourceHash,'height':float(np.mean(waterHeight)),'triangles':waterTriangles}
(OUT/'water-footprint.json').write_text(json.dumps(w,indent=2),encoding='utf8')
water=unary_union([Polygon(t) for t in w['triangles'] if Polygon(t).area>1e-8])
# Stay below moored boats, away from embankments/bridges and off the pavilion's curved quay.
domains=[(box(-17.6,-3.6,6.5,3.5),24),(box(13,-1.6,38,.65),8)]
rng=random.Random(20261019);points=[]
for domain,count in domains:
 area=water.buffer(-.7).intersection(domain);xmin,zmin,xmax,zmax=area.bounds;group=[]
 for attempt in range(10000):
  x,z=rng.uniform(xmin,xmax),rng.uniform(zmin,zmax)
  if area.contains(Point(x,z)) and all(math.hypot(x-a,z-b)>1.65 for a,b in points):
   points.append((x,z));group.append((x,z))
  if len(group)==count:break
 assert len(group)==count
lamps=[]
for i,(x,z) in enumerate(points):
 kind='chrysanthemum' if i in [4,13,21,29] else ('lotus-main' if i%2 else 'lotus-one')
 lamps.append({'id':f'water-{i+1:02d}','kind':kind,'tile':6,'x':round(x,4),'y':w['height']+.012,'z':round(z,4),'rotation':round(rng.uniform(-math.pi,math.pi),4),'sizeMeters':.6 if kind!='chrysanthemum' else .65})
# Three spacious pairs flank the lane between the gate and temple threshold.
for i,z in enumerate([-17.3,-19.6,-22.9]):
 for side,x in [('left',-8.7),('right',-1.8)]:
  zz=z+(0.22 if side=='right' else 0)
  # Source lion's head points +Z. Rotate it towards the lane with a slight approach-facing angle.
  dx,dz=-5.24-x,.65
  lamps.append({'id':f'lion-{side}-{i+1}','kind':'lion','tile':9,'x':x,'y':11.86148106083,'z':zz,'rotation':round(math.atan2(dx,dz),6),'sizeMeters':2.5,'target':[-5.24,zz+.65]})
lamps.append({'id':'mountain-preview','kind':'mountain','tile':9,'x':-21,'y':11.864055383674,'z':-33.2,'rotation':math.pi,'sizeMeters':13,'provisional':True})
plan={'version':1,'mapUnitsPerMeter':.53/1.65,'scaleBasis':'Calibrated from existing map walker .53 and studio eye height 1.65 m; normalized map has no meter unit.','water':w,'mountainPlot':{'minX':-24.2,'maxX':-17.8,'minZ':-37.4,'maxZ':-28.8},'placements':lamps}
(OUT/'layout.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2),encoding='utf8')
# Exact source-water mask clips projected lantern reflections away from the banks.
bounds=[-21,-12,42,7];W,H=1024,320;im=Image.new('L',(W,H));d=ImageDraw.Draw(im)
for tri in w['triangles']:d.polygon([((x-bounds[0])/(bounds[2]-bounds[0])*W,(1-(z-bounds[1])/(bounds[3]-bounds[1]))*H) for x,z in tri],fill=255)
im.save(OUT/'water-mask.png')
(OUT/'water-mask-bounds.json').write_text(json.dumps(bounds),encoding='utf8')
print('Placements:',len(lamps),'water:',len(points),'kinds:',{k:sum(p['kind']==k for p in lamps) for k in sorted(set(p['kind'] for p in lamps))})
