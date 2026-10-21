"""Place pendants only on audited waterfront Matou soffits; verify body/rod clearance."""
from pathlib import Path
import json,sys
import numpy as np
from import_glb_utils import read_glb,local_matrix,accessor
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/red-lantern';OUT.mkdir(exist_ok=True)
base=ROOT/'assets/qinhuai-modern-import/night/matou-ma61'
manifest=json.loads((base/'manifest.json').read_text());units=.53/1.65
cache={};placements=[];audit=[]
# Conservative horizontal bands follow the real pendant silhouette. A single
# full-width box at its tiny top ring would incorrectly reject thick soffits.
d,b,_=read_glb(OUT/'red-lantern-pendant.glb');parents={c:i for i,n in enumerate(d['nodes']) for c in n.get('children',[])}
def model_world(i):return (model_world(parents[i]) if i in parents else np.eye(4))@local_matrix(d['nodes'][i])
body=[]
for i,n in enumerate(d['nodes']):
 if 'mesh' not in n:continue
 for p in d['meshes'][n['mesh']]['primitives']:
  if d['materials'][p['material']].get('name')!='RedLanternFabric':continue
  v=accessor(d,b,p['attributes']['POSITION']);v=(np.c_[v,np.ones(len(v))]@model_world(i).T)[:,:3];body.append(v[accessor(d,b,p['indices']).reshape(-1,3)])
body=np.concatenate(body);body_boxes=[]
limits=np.linspace(body[:,:,1].min(),body[:,:,1].max(),33)
for lower,upper in zip(limits[:-1],limits[1:]):
 t=body[(body[:,:,1].min(1)<=upper)&(body[:,:,1].max(1)>=lower)];vertices=t.reshape(-1,3);points=[vertices[(vertices[:,1]>=lower)&(vertices[:,1]<=upper)]]
 for edge in [(0,1),(1,2),(2,0)]:
  a=t[:,edge[0]];b=t[:,edge[1]]
  for level in [lower,upper]:
   ok=(np.minimum(a[:,1],b[:,1])<=level)&(np.maximum(a[:,1],b[:,1])>=level)&(np.abs(a[:,1]-b[:,1])>1e-9)
   ratio=(level-a[ok,1])/(b[ok,1]-a[ok,1]);points.append(a[ok]+ratio[:,None]*(b[ok]-a[ok]))
 pts=np.concatenate(points)
 if len(pts):
  radius=np.max(np.abs(pts[:,[0,2]]),axis=0)+.003
  body_boxes.append((np.array([-radius[0],lower,-radius[1]])*units,np.array([radius[0],upper,radius[1]])*units))
def mesh_triangles(tile):
 if tile in cache:return cache[tile]
 d,b,h=read_glb(ROOT/f'assets/qinhuai-modern-import/tiles/tile-{tile:02}.glb');parents={c:i for i,n in enumerate(d['nodes']) for c in n.get('children',[])};worlds={};out={}
 def world(i):
  if i not in worlds:worlds[i]=(world(parents[i]) if i in parents else np.eye(4))@local_matrix(d['nodes'][i])
  return worlds[i]
 for i,n in enumerate(d['nodes']):
  if 'mesh' not in n:continue
  arr=[]
  for p in d['meshes'][n['mesh']]['primitives']:
   v=accessor(d,b,p['attributes']['POSITION']);v=(np.c_[v,np.ones(len(v))]@world(i).T)[:,:3];idx=accessor(d,b,p['indices']).reshape(-1,3);arr.append(v[idx])
  out[n.get('name','')]=np.concatenate(arr)
 cache[tile]=out;return out
def intersects_box(triangles,lo,hi):
 if not len(triangles):return False
 center=(lo+hi)/2;half=(hi-lo)/2;t=triangles-center
 edges=np.stack([t[:,1]-t[:,0],t[:,2]-t[:,1],t[:,0]-t[:,2]],axis=1)
 axes=[np.cross(edges[:,0],edges[:,1])]
 for e in range(3):
  for unit in np.eye(3):axes.append(np.cross(edges[:,e],unit))
 overlap=np.ones(len(t),dtype=bool)
 for axis in axes:
  projection=np.einsum('nvc,nc->nv',t,axis);radius=np.abs(axis)@half
  overlap&=(projection.min(1)<=radius+1e-10)&(projection.max(1)>=-radius-1e-10)
 return bool(overlap.any())
for group in manifest['groups']:
 geometry=mesh_triangles(group['tile']);roofnames={r['node'] for r in group['rules'] if r['role']=='roof'}
 roofs=np.concatenate([geometry[n] for n in roofnames]);selected=np.concatenate([geometry[n] for n in group['nodes']]);tri=np.concatenate(list(geometry.values()))
 low=tri.min(1);high=tri.max(1);rl=roofs[:,:,[0,2]].min(1);rh=roofs[:,:,[0,2]].max(1)
 def roofhits(xz):
  t=roofs[((rl<=xz)&(rh>=xz)).all(1)]
  if not len(t):return np.array([])
  a,b,c=t[:,0],t[:,1],t[:,2];v0=b[:,[0,2]]-a[:,[0,2]];v1=c[:,[0,2]]-a[:,[0,2]];v2=xz-a[:,[0,2]]
  det=v0[:,0]*v1[:,1]-v0[:,1]*v1[:,0];ok=np.abs(det)>1e-9;a=a[ok];b=b[ok];c=c[ok];v0=v0[ok];v1=v1[ok];v2=v2[ok];det=det[ok]
  u=(v2[:,0]*v1[:,1]-v2[:,1]*v1[:,0])/det;v=(v0[:,0]*v2[:,1]-v0[:,1]*v2[:,0])/det
  y=a[:,1]+u*(b[:,1]-a[:,1])+v*(c[:,1]-a[:,1]);return y[(u>=-1e-5)&(v>=-1e-5)&(u+v<=1.00001)]
 def visible_from_river(point,front):
  mask=(low[:,0]<=point[0])&(high[:,0]>=point[0])&(low[:,1]<=point[1])&(high[:,1]>=point[1])&(high[:,2]>=point[2]-.6)&(low[:,2]<=point[2]+.6)
  t=tri[mask]
  if not len(t):return True
  a,b,c=t[:,0],t[:,1],t[:,2];v0=b[:,:2]-a[:,:2];v1=c[:,:2]-a[:,:2];v2=point[:2]-a[:,:2]
  det=v0[:,0]*v1[:,1]-v0[:,1]*v1[:,0];ok=np.abs(det)>1e-9;a=a[ok];b=b[ok];c=c[ok];v0=v0[ok];v1=v1[ok];v2=v2[ok];det=det[ok]
  u=(v2[:,0]*v1[:,1]-v2[:,1]*v1[:,0])/det;v=(v0[:,0]*v2[:,1]-v0[:,1]*v2[:,0])/det
  z=a[:,2]+u*(b[:,2]-a[:,2])+v*(c[:,2]-a[:,2]);distance=(z-point[2])*front
  return not bool(((u>=0)&(v>=0)&(u+v<=1)&(distance>.002)&(distance<.6)).any())
 north=group['id'].startswith('north');front=1 if north else -1
 paths=np.array(json.loads((base/group['id']/'eave-path-audit.json').read_text())['accepted'])
 # The selected second-floor river-facing lip is absent from the legacy
 # decorative-light paths. Survey the actual roof above its upper windows.
 if group['id']=='north-west':
  paths=list(paths)+[np.array([[-43.4502,14.33,-2.83],[-38.4322,14.33,-2.67]])]
 # Long horizontal frontage paths only; keep an end margin and a regular row pitch.
 paths=sorted(paths,key=lambda s:front*(s[0,2]+s[1,2]),reverse=True)
 accepted=[];rejected=0
 for seg in paths:
  p,q=seg;delta=q-p;length=np.linalg.norm(delta[[0,2]])
  if length<.85 or abs(delta[0])<length*.92 or abs(delta[1])>.08:continue
  count=max(1,int((length-.36)/.96)+1)
  for t in (np.linspace(.24/length,1-.24/length,count) if count>1 else [.5]):
   pos=p+delta*t
   if group['minX'] is not None and pos[0]<group['minX']+.15:continue
   upper_frontage=(group['id']=='north-west' and -43.6<pos[0]<-38.2 and 14.32<pos[1]<14.34 and -2.9<pos[2]<-2.5)
   # Reject inland/inner eaves: the river-facing probe must leave this roof footprint.
   forward=roofhits(pos[[0,2]]+[0,front*.4])
   if len(forward) and np.any(forward>pos[1]-.5):continue
   placed=False
   for inset in np.arange(-.4,.176,.0025 if upper_frontage else .0125):
    mount=pos.copy();mount[2]-=front*inset
    hits=roofhits(mount[[0,2]]);hits=hits[(hits>pos[1]-.48)&(hits<pos[1]+.15)]
    if not len(hits):continue
    mount[1]=float(hits.min())+.001
    anchor=None
    if upper_frontage:
     # Shallow eaves need a short outward bronze support to clear upper windows.
     anchor=mount.copy();mount+=np.array([0,-.04,front*.12])
     start=anchor+np.array([0,-.009,0]);r=.009*units
     support_clear=True
     steps=np.linspace(start,mount,33)
     for a,b in zip(steps[:-1],steps[1:]):
      lo=np.minimum(a,b)-r;hi=np.maximum(a,b)+r
      if intersects_box(tri[((high>=lo)&(low<=hi)).all(1)],lo,hi):support_clear=False;break
     if not support_clear:continue
    # Conservative body box (contains original silhouette) plus 15mm clearance.
    radius=.235*units;bottom=mount[1]-.83*units;top=mount[1]-.18*units
    bl=mount+[-radius,-.83*units,-radius];bh=mount+[radius,-.18*units,radius]
    overlap=((high>=bl)&(low<=bh)).all(1)
    candidates=tri[overlap];clow=low[overlap];chigh=high[overlap]
    if any(intersects_box(candidates[((chigh>=mount+lo)&(clow<=mount+hi)).all(1)],mount+lo,mount+hi) for lo,hi in body_boxes):continue
    # Rod cylinder's conservative box, except the intentional 1mm roof contact.
    bl=mount+[-.009*units,-.18*units,-.009*units];bh=mount+[.009*units,-.004,.009*units]
    if intersects_box(tri[((high>=bl)&(low<=bh)).all(1)],bl,bh):continue
    if not all(visible_from_river(mount+[0,-drop*units,0],front) for drop in [.32,.48]):continue
    if any(np.linalg.norm(mount[[0,2]]-np.array(a['mount'])[[0,2]])<.7 for a in placements):continue
    item={'id':f'{group["id"]}-{len(accepted)+1:03}','group':group['id'],'tile':group['tile'],'mount':np.round(mount,6).tolist(),'rotation':0 if north else 180,'sizeMeters':.65}
    if anchor is not None:item['eaveAnchor']=np.round(anchor,6).tolist();item['tier']='upper'
    accepted.append(item);placements.append(item);placed=True;break
   if not placed:rejected+=1
 audit.append({'group':group['id'],'count':len(accepted),'clearanceRejected':rejected});print(audit[-1],flush=True)
assert placements,'No mount points passed survey'
(OUT/'layout.json').write_text(json.dumps({'version':1,'mapUnitsPerMeter':units,'scope':'Existing audited Ma61 waterfront buildings only','placements':placements,'groups':manifest['groups']},ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'placement-audit.json').write_text(json.dumps({'count':len(placements),'groups':audit,'bodyBoundingBoxClear':True,'rodBoundingBoxClear':True,'bodySilhouetteBands':len(body_boxes),'riverFacingVisibilityRaysClear':True,'mountMethod':'Upward intersection with selected roof triangles; short rod top touches underside; frontage-only; conservative body and rod boxes checked against every triangle in tile using separating-axis intersection','sourceHashes':manifest['sourceHashes']},indent=2),encoding='utf8')
print('TOTAL',len(placements))
