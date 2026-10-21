"""Build additive night-light fixture paths from the existing GLBs (never edits them).
Run: python tools/build_import_night_layout.py
World coordinates are glTF / Three.js Y-up. Lamps follow welded roof boundaries,
not AABBs, so curved eaves, rotated boats and original building positions survive.
"""
from pathlib import Path
import json, struct, io, hashlib
import numpy as np
import cv2
from scipy.spatial import cKDTree
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/qinhuai-modern-import/night'
OUT.mkdir(parents=True, exist_ok=True)
ROOFS = {'FuziTemple0036', 'FuziTemple0058'}
WINDOWS = {'FuziTemple0078','FuziTemple0087','FuziTemple0088','FuziTemple0101','FuziTemple0109','FuziTemple0110','FuziTemple0118'}
# Measured central temple nodes only: do not relight shared city-wide materials.
TEMPLE_FACADES = {1070, 1072, 1074, 1088, 1099, 1103, 1121}
TEMPLE_TRIM = {1071, 1081, 1089, 1091, 1102, 1119}
SPECIAL_ROOFS = {'FuziTemple0340','FuziTemple0341','FuziTemple0360','FuziTemple0361'}

def read_glb(path):
    raw=path.read_bytes(); length=struct.unpack_from('<I',raw,12)[0]
    return json.loads(raw[20:20+length]),raw[28+length:],hashlib.sha256(raw).hexdigest()

def local_matrix(n):
    if 'matrix' in n:return np.array(n['matrix']).reshape(4,4).T
    x,y,z,w=n.get('rotation',[0,0,0,1])
    r=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
    m=np.eye(4);m[:3,:3]=r@np.diag(n.get('scale',[1,1,1]));m[:3,3]=n.get('translation',[0,0,0]);return m

def accessor(doc,blob,i):
    a=doc['accessors'][i];v=doc['bufferViews'][a['bufferView']]
    dtype={5120:'i1',5121:'u1',5122:'<i2',5123:'<u2',5125:'<u4',5126:'<f4'}[a['componentType']]
    count={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']]; size=np.dtype(dtype).itemsize
    return np.ndarray((a['count'],count),dtype=dtype,buffer=blob,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',count*size),size)).copy()

def roof_ridges(vertices, triangles):
    """Convex creases between upward roof slopes, not corrugated tile edges."""
    _, welded = np.unique(np.rint(vertices / .012).astype(np.int64), axis=0, return_inverse=True)
    faces = welded[triangles]
    edges = np.sort(faces[:, [[0, 1], [1, 2], [2, 0]]].reshape(-1, 2), axis=1)
    face_ids = np.repeat(np.arange(len(triangles)), 3)
    opposite = triangles[:, [2, 0, 1]].reshape(-1)
    endpoints = triangles[:, [[0, 1], [1, 2], [2, 0]]].reshape(-1, 2)
    order = np.lexsort((edges[:, 1], edges[:, 0]))
    edges, face_ids, opposite, endpoints = edges[order], face_ids[order], opposite[order], endpoints[order]
    starts = np.r_[0, np.flatnonzero(np.any(np.diff(edges, axis=0), axis=1)) + 1]
    counts = np.diff(np.r_[starts, len(edges)])
    pairs = starts[counts == 2]
    normal = np.cross(vertices[triangles[:, 1]] - vertices[triangles[:, 0]], vertices[triangles[:, 2]] - vertices[triangles[:, 0]])
    normal /= np.maximum(np.linalg.norm(normal, axis=1)[:, None], 1e-12)
    normal[normal[:, 1] < 0] *= -1
    a, b = normal[face_ids[pairs]], normal[face_ids[pairs + 1]]
    p, q = vertices[endpoints[pairs, 0]], vertices[endpoints[pairs, 1]]
    convex = np.sum(a * (vertices[opposite[pairs + 1]] - p), axis=1) < -.018
    keep = (a[:, 1] > .22) & (b[:, 1] > .22) & (np.sum(a*b, axis=1) < .86) & convex
    keep &= np.linalg.norm(q-p, axis=1) > .18
    return [(x.copy(), y.copy()) for x, y in zip(p[keep], q[keep])]

def surface_field(name, vertices, eaves, ridges):
    """Bake a small R8 3D falloff field; overlapping roof tiers stay separate."""
    lo, hi = vertices.min(0) - .9, vertices.max(0) + .9
    size = np.maximum(2, np.ceil((hi-lo)/max(.085, max(hi-lo)/280)).astype(int))
    step = (hi-lo)/size
    z, y, x = np.meshgrid(*[lo[k] + (np.arange(size[k])+.5)*step[k] for k in (2, 1, 0)], indexing='ij')
    queries = np.c_[x.ravel(), y.ravel(), z.ravel()]
    response = np.zeros(len(queries), dtype=np.float32)
    for paths, weight, core, spill in ((eaves, 1., .18, .56), (ridges, .83, .16, .44)):
        if not paths: continue
        samples = np.concatenate([np.linspace(p, q, max(2, int(np.linalg.norm(q-p)/.045)+1)) for p,q in paths])
        distance = cKDTree(samples).query(queries, workers=2)[0]
        light = weight * (.62*np.exp(-.5*(distance/core)**2) + .38*np.exp(-.5*(distance/spill)**2))
        response = np.maximum(response, light)
    file = f'{name}-wrap-r8.bin'
    data = np.uint8(np.clip(response, 0, 1)*255)
    (OUT/file).write_bytes(data.tobytes())
    return {'file': file, 'size': size.tolist(), 'min': lo.round(5).tolist(), 'max': hi.round(5).tolist(),
            'eaveSegments': len(eaves), 'ridgeSegments': len(ridges), 'bytes': len(data)}

def fixture_edges(vertices,triangles,kind,name):
    # The projected union follows real curved eaves, NOT individual roof tiles.
    lo,hi=vertices.min(0),vertices.max(0);height=max(hi[1]-lo[1],.01)
    cell=.014 if kind=='boat' else .026
    levels=[lo[1]-.001]
    if name=='FuziTemple0876':levels=[13.62,14.76,15.61] # three measured eave levels
    if kind=='boat':levels=[lo[1]+height*.66]
    normal=np.cross(vertices[triangles[:,1]]-vertices[triangles[:,0]],vertices[triangles[:,2]]-vertices[triangles[:,0]])
    normal/=np.maximum(np.linalg.norm(normal,axis=1)[:,None],1e-12)
    out=[]
    for level in levels:
        usable=(np.abs(normal[:,1])>.18)&(vertices[triangles,1].max(1)>=level)
        if not usable.any():continue
        ts=triangles[usable];v=vertices[np.unique(ts)];v=v[v[:,1]>=level-.06]
        if not len(v):continue
        origin=lo[[0,2]]-.1
        shape=np.ceil((hi[[0,2]]-origin+.1)/cell).astype(int)
        if max(shape)>2600:continue
        mask=np.zeros((int(shape[1])+1,int(shape[0])+1),np.uint8)
        for t in ts:
            points=vertices[t]
            if points[:,1].min()<level-.08:continue
            uv=np.rint((points[:,[0,2]]-origin)/cell).astype(np.int32)
            cv2.fillConvexPoly(mask,uv,255)
        mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
        contours,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        tree=cKDTree(v[:,[0,2]])
        for contour in contours:
            if cv2.contourArea(contour)*cell*cell<(.10 if kind!='boat' else .025):continue
            polygon=cv2.approxPolyDP(contour,.028/cell,True).reshape(-1,2)*cell+origin
            if len(polygon)<3:continue
            dist,idx=tree.query(polygon,k=min(4,len(v)))
            if idx.ndim==1:idx=idx[:,None]
            yy=np.min(v[idx,1],axis=1)
            points=np.c_[polygon[:,0],yy,polygon[:,1]]
            for i in range(len(points)):
                p,q=points[i],points[(i+1)%len(points)]
                if np.linalg.norm(p-q)>.035:out.append((p.copy(),q.copy()))
    return out,[]

layout={'version':2,'coordinateSystem':'Three.js Y-up; original world transforms','tiles':{},'windowMasks':{},'surfaceFields':{},'sourceHashes':{}}
seen_masks=set();total_segments=0
for path in sorted((ROOT/'assets/qinhuai-modern-import/tiles').glob('*.glb')):
    if path.stem=='tile-15':continue
    doc,blob,digest=read_glb(path);layout['sourceHashes'][path.name]=digest
    parents={c:i for i,n in enumerate(doc['nodes']) for c in n.get('children',[])};worlds={}
    def world(i):
        if i not in worlds:worlds[i]=(world(parents[i]) if i in parents else np.eye(4))@local_matrix(doc['nodes'][i])
        return worlds[i]
    tile={'fixtures':[], 'boats':[], 'materials':[], 'bounds':{}}
    dedup=set()
    def add(name,kind,segments):
        unique=[]
        for p,q in segments:
            p[1]+=.014;q[1]+=.014
            key=tuple(sorted((tuple(np.round(p/.015).astype(int)),tuple(np.round(q/.015).astype(int)))))
            if key in dedup:continue
            dedup.add(key);unique.extend(np.round(np.r_[p,q],4).tolist())
        if unique:tile['fixtures'].append({'node':name,'kind':kind,'segments':unique})
    for i,node in enumerate(doc['nodes']):
        if 'mesh' not in node:continue
        name=node.get('name','');number=int(name[10:]) if name.startswith('FuziTemple') and name[10:].isdigit() else -1
        for prim in doc['meshes'][node['mesh']]['primitives']:
            if 'POSITION' not in prim['attributes'] or prim.get('mode',4)!=4:continue
            mat=doc['materials'][prim['material']] if 'material' in prim else {};mn=mat.get('name','')
            a=doc['accessors'][prim['attributes']['POSITION']]
            corners=np.array([[x,y,z,1] for x in (a['min'][0],a['max'][0]) for y in (a['min'][1],a['max'][1]) for z in (a['min'][2],a['max'][2])])@world(i).T
            lo,hi=corners[:,:3].min(0),corners[:,:3].max(0);c=(lo+hi)/2;size=hi-lo
            if not (-60<c[0]<70 and -62<c[2]<22 and 10<c[1]<26) or max(size)>80:continue
            tile['bounds'][name]={'min':lo.round(4).tolist(),'max':hi.round(4).tolist()}
            # Graded emphasis: riverfront + temple are brighter than outer streets.
            zone='temple' if -19<c[0]<10 and -58<c[2]<-23 else 'waterfront' if -20<c[2]<8 else 'background'
            role=None
            if mn in WINDOWS:role='window'
            if mn in {'FuziTemple0040','FuziTemple0147','FuziTemple0148'}:role='sign'
            if mn in ROOFS or name in SPECIAL_ROOFS:role='roof'
            if mn=='FuziTemple0063':role='boatCabin'
            if mn in {'FuziTemple0064','FuziTemple0067'}:role='boatTrim'
            if name in {'FuziTemple0870','FuziTemple0874'}:role='pavilionWood'
            if name=='FuziTemple0336':role='gateWood'
            if zone == 'temple' and number in TEMPLE_FACADES:role='templeFacade'
            if zone == 'temple' and number in TEMPLE_TRIM:role='templeTrim'
            if role:tile['materials'].append({'node':name,'material':mn,'role':role,'zone':zone})
            is_roof=(mn in ROOFS or name in SPECIAL_ROOFS) and hi[1]>12.6 and max(size)<60
            is_boat=mn=='FuziTemple0067'
            is_quay=name in {'FuziTemple0319','FuziTemple0323'}
            if not (is_roof or is_boat or is_quay):continue
            v=accessor(doc,blob,prim['attributes']['POSITION']);v=(np.c_[v,np.ones(len(v))]@world(i).T)[:,:3]
            tri=accessor(doc,blob,prim['indices']).reshape(-1,3) if 'indices' in prim else np.arange(len(v)).reshape(-1,3)
            edges,ridges=fixture_edges(v,tri,'boat' if is_boat else 'quay' if is_quay else 'roof',name)
            kind='boat' if is_boat else 'cool' if is_quay else 'pavilion' if 870<=number<=877 else 'gate' if name in SPECIAL_ROOFS else 'temple' if zone=='temple' else 'eave' if zone=='waterfront' else 'distant'
            wrap = is_roof and (zone=='temple' or kind in {'pavilion', 'gate'}) and bool(edges)
            if wrap:
                ridges = roof_ridges(v, tri)
                layout['surfaceFields'][name] = surface_field(name, v, edges, ridges)
                # Surface lighting replaces exposed cylinders on the principal roofs.
                print('  surface wrap', name, 'eaves', len(edges), 'ridges', len(ridges))
            else:
                add(name,kind,edges);add(name,'ridge',ridges)
            if is_boat:tile['boats'].append({'node':name,'center':c.round(4).tolist()})
    for mat in doc['materials']:
        mn=mat.get('name','');tex=mat.get('pbrMetallicRoughness',{}).get('baseColorTexture')
        if mn not in WINDOWS or not tex or mn in seen_masks:continue
        im=doc['images'][doc['textures'][tex['index']]['source']];bv=doc['bufferViews'][im['bufferView']]
        image=Image.open(io.BytesIO(blob[bv.get('byteOffset',0):bv.get('byteOffset',0)+bv['byteLength']])).convert('RGB');image.thumbnail((512,512))
        rgb=np.asarray(image).astype(float)/255; r,g,b=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
        # Blue/neutral translucent panes glow; reddish wood frames stay opaque.
        brightness=np.maximum((g+b)*.5-r*.36,0)
        mask=np.clip((brightness-.19)/.42,0,1)**1.8
        mask*=np.clip((g-r+.12)/.18,0,1)
        file=f'{mn}-window.png';Image.fromarray(np.uint8(mask*255)).save(OUT/file)
        layout['windowMasks'][mn]=file;seen_masks.add(mn)
    count=sum(len(f['segments'])//6 for f in tile['fixtures']);total_segments+=count
    layout['tiles'][path.stem]=tile
    print(path.stem,'fixtures',len(tile['fixtures']),'segments',count,'material bindings',len(tile['materials']),'boats',len(tile['boats']))
# Only point/spot lamps are manually aimed: their anchors were measured on source meshes.
layout['landmarks']={
 'pavilion':{'name':'魁星阁','position':[11.27,14.3,-6.82],'tile':10},
 'gate':{'name':'天下文枢','position':[-5.24,13.6,-13.46],'tile':9},
 'temple':{'name':'大成殿与后方殿宇','position':[-5.5,14,-37],'tile':9},
 'boats':{'name':'秦淮游船','position':[-6,11.6,-6.5],'tiles':[9,10]}}
(OUT/'layout.json').write_text(json.dumps(layout,ensure_ascii=False,separators=(',',':')),encoding='utf8')
report={'fixtures':sum(len(t['fixtures']) for t in layout['tiles'].values()),'segments':total_segments,'boats':sum(len(t['boats']) for t in layout['tiles'].values()),'masks':len(seen_masks),'surfaceFields':len(layout['surfaceFields']),'surfaceBytes':sum(f['bytes'] for f in layout['surfaceFields'].values()),'sourceHashes':layout['sourceHashes'],'geometryModified':False}
(OUT/'generation-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8');print(report)
