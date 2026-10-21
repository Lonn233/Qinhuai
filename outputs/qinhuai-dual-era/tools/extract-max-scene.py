import sys,json,collections,struct
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent/'vendor'/'io_scene_max'))
import import_max as m
root=Path('E:/soft/inspiration/灯会/model/秦淮现代地图/898689')
f=next(root.rglob('*.max'))
def next_chunk(self,superid,data,offset,level,number,conReader,primReader):
 typ,siz=struct.unpack_from('<Hi',data,offset);header=6
 if siz==0:siz=struct.unpack_from('<q',data,offset+6)[0];header=14
 size=siz & (m.UNKNOWN_SIZE if header==6 else m.MAXFILE_SIZE)
 if size<header or size>len(data)-offset:raise ValueError(('INVALID',typ,siz,size,offset,len(data),level,number))
 chunk=(conReader(superid,typ,level,number,size,None,primReader) if siz<0 else primReader(superid,typ,level,number,size,None))
 chunkdata=memoryview(data)[offset+header:offset+size]
 if siz<0 and conReader is m.SceneChunk and any(x in m.get_cls_name(chunk).lower() for x in ('editable','polymesh','triobject')):
  chunk.children=[];chunk.data=chunkdata
 elif siz>=0 and len(chunkdata)>16384:chunk.data=chunkdata
 else:chunk.set_data(chunkdata if siz<0 else bytes(chunkdata))
 return offset+size,chunk
m.ChunkReader.get_next_chunk=next_chunk
a=m.ImportMaxFile(str(f));m.read_directory(a,str(f));m.read_class_directory(a,str(f))
print('STREAMS',[(e.sid,e.name,e.size) for e in a.direntries if e is not None],flush=True)
for entry in a.direntries:
 if entry and ('asset' in entry.name.lower() or 'file' in entry.name.lower()):
  Path('work/model-completeness-20261019/'+entry.name+'.bin').write_bytes(a.openstream(entry.name).read())
m.SCENE_LIST=m.read_chunks(a,'Scene',m.SceneChunk)
nodes=m.SCENE_LIST[0].children
print('SCENE_NODES',len(nodes),flush=True)
classes=collections.Counter(m.get_cls_name(n) for n in nodes)
print(classes.most_common(80),flush=True)
def dump(n,depth=0):
 d={'type':hex(n.types)}
 if getattr(n,'children',[]):d['children']=[dump(c,depth+1) for c in n.children]
 else:
  x=n.data
  if isinstance(x,(bytes,memoryview)):d['length']=len(x);d['hex']=x[:300].hex();d['utf16']=bytes(x[:1400]).decode('utf-16le','ignore')
  else:d['data']=x
 return d

# FileAssetMetaData3: GUID plus three length-prefixed UTF-16 strings.
metadata=a.openstream('FileAssetMetaData3').read();assets={};cursor=0
while cursor<len(metadata):
 guid=metadata[cursor:cursor+16].hex();cursor+=16;values=[]
 for _ in range(3):
  count=struct.unpack_from('<I',metadata,cursor)[0];cursor+=4
  values.append(metadata[cursor:cursor+count*2].decode('utf-16le'));cursor+=count*2+2
 assets[guid]=dict(zip(('type','path','resolved'),values))
Path('work/model-completeness-20261019/max-assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2),'utf8')
asset_bytes={bytes.fromhex(k):v for k,v in assets.items()}
indices={id(n):i for i,n in enumerate(nodes)}
def assets_in(n):
 result=[]
 if n is None:return result
 if getattr(n,'children',[]):
  for c in n.children:result.extend(assets_in(c))
 elif isinstance(n.data,(bytes,memoryview)) and len(n.data)<4096:
  data=bytes(n.data)
  for k,v in asset_bytes.items():
   if k in data:result.append(v['path'])
 return result
cache={}
def bitmaps(n,seen=None):
 if n is None:return []
 if seen is None:seen=set()
 if id(n) in seen:return []
 seen.add(id(n));result=assets_in(n)
 for r in m.get_references(n)+list(m.get_reference(n).values()):result+=bitmaps(r,seen)
 return list(dict.fromkeys(result))
def bitmap(n):
 return next((x for x in bitmaps(n) if not x.endswith('.vrmesh')),None)
def material(n):
 if n is None:return [None]
 key=indices[id(n)]
 if key in cache:return cache[key]
 uid=m.get_guid(n);refs=m.get_references(n);ref=m.get_reference(n);cl=m.get_cls_name(n)
 if uid==0x200:
  result=[]
  # Slot 0 is a parameter block; material references start at slot 1.
  for k,r in (ref.items() if ref else enumerate(refs)):
   if k>=1:result.extend(material(r))
 elif uid==m.VTWO_MTL:
  candidates=[r for r in refs if r and 'Mtl' in m.get_cls_name(r)]
  result=material(candidates[0]) if candidates else [None]
 else:
  result=[{'id':key,'class':cl,'name':m.get_material_name(n),'textures':bitmaps(n)}]
  if uid==m.VRAY_MTL:
   parameter=ref.get(1)
   result[0].update(diffuse=bitmap(ref.get(7)),alpha=bitmap(ref.get(19)),color=m.get_color(parameter,1) if parameter else None)
  elif uid==2:
   try:
    tx=m.get_reference(refs[1]);result[0].update(diffuse=bitmap(tx.get(3)),alpha=bitmap(tx.get(13)))
   except:pass
 cache[key]=result;return result
world_cache={}
def world(n,seen=None):
 if n is None:return m.mathutils.Matrix.Identity(4)
 key=indices[id(n)]
 if key in world_cache:return world_cache[key]
 prs,*_=m.get_matrix_mesh_material(n);mat=m.create_matrix(prs)
 parent=m.get_node_parent(n)
 if parent and parent is not n:mat=world(parent)@mat
 world_cache[key]=mat;return mat
def proxy_scale(n):
 # V-Ray ParamBlock2 property 2 stores the mesh unit-conversion scale.
 for ref in m.get_references(n)+list(m.get_reference(n).values()):
  if ref is None or 'ParamBlock2' not in m.get_cls_name(ref):continue
  for chunk in getattr(ref,'children',[]):
   data=chunk.data
   if chunk.types==0x100e and isinstance(data,(bytes,memoryview)) and len(data)==19 and struct.unpack_from('<H',data)[0]==2:
    return struct.unpack_from('<f',data,15)[0]
 raise ValueError('Missing proxy scale: '+m.get_cls_name(n))
out=[];protos={}
for i,n in enumerate(nodes):
 if not n.get_first(0x962):continue
 prs,msh,mat,lyr=m.get_matrix_mesh_material(n)
 if 'VRayProxy' not in m.get_cls_name(msh):continue
 meshid=indices[id(msh)];paths=bitmaps(msh);path=next((x for x in paths if x.endswith('.vrmesh')),None)
 pivot=n.get_first(0x96a);rot=n.get_first(0x96b);scl=n.get_first(0x96c)
 q=rot.data if rot else (0,0,0,1)
 pmtx=m.mathutils.Matrix.LocRotScale(m.mathutils.Vector(pivot.data if pivot else (0,0,0)),m.mathutils.Quaternion((q[3],q[0],q[1],q[2])),m.mathutils.Vector(scl.data[:3] if scl else (1,1,1)))
 w=world(n)@pmtx
 materials=material(mat);proto=str(meshid)+'-'+str(indices.get(id(mat),0))
 if proto not in protos:protos[proto]={'path':path,'materials':materials,'name':m.get_node_name(n),'proxyScale':proxy_scale(msh)}
 out.append({'name':m.get_node_name(n),'index':i,'prototype':proto,'matrix':[list(r) for r in w]})
Path('work/model-completeness-20261019/proxy-extracted.json').write_text(json.dumps({'objects':out,'prototypes':protos},ensure_ascii=False,indent=2),encoding='utf8')
print('EXTRACTED',len(out),len(protos),flush=True)
