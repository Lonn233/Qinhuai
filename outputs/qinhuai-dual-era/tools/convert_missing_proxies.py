"""Convert original MAX proxy geometry to compact web prototypes in Blender.
Run from project root: blender -b --factory-startup --python tools/convert_missing_proxies.py
Uses extracted original transforms, proxy unit scales, material slots and UVs.
"""
import sys,json,hashlib,math,gc
from pathlib import Path
sys.path.insert(0,str(Path(__file__).parent))
import bpy,numpy as np
from mathutils import Matrix
from vrmesh_reader import read_proxy
ROOT=Path('E:/soft/inspiration/灯会/model/秦淮现代地图/898689')
OUT=Path('assets/qinhuai-modern-import/restored');OUT.mkdir(parents=True,exist_ok=True)
source=json.loads(Path('work/model-completeness-20261019/proxy-extracted.json').read_text('utf8'))
files={p.name.lower():p for p in ROOT.rglob('*') if p.is_file()}
manifest={'version':1,'source':'Original MAX VRayProxy instances / render meshes, optimized in Blender','prototypes':{},'instances':[],'warnings':[]}
unique={};mapping={}
for key,p in source['prototypes'].items():
 name=p['path'].split('\\')[-1];sig=name+'|'+json.dumps(p['materials'],sort_keys=True);pid=hashlib.sha1(sig.encode()).hexdigest()[:12]
 mapping[key]=pid;unique.setdefault(pid,p)
def kind(name):
 if any(v in name for v in ['AM171','AM117','树3','guanmuc1004']):return 'tree'
 if any(v in name for v in ['guanmuc','iTrees','iAlpine']):return 'plant'
 if any(v in name for v in ['646323','19273323','18005816','19979241']):return 'street-detail'
 return 'person'
def image(path):
 if not path:return None
 file=files.get(path.split('\\')[-1].lower())
 if not file:
  manifest['warnings'].append('Missing texture: '+path);return None
 try:
  img=bpy.data.images.load(str(file),check_existing=True)
  if max(img.size)>512:
   r=512/max(img.size);img.scale(max(1,round(img.size[0]*r)),max(1,round(img.size[1]*r)))
  return img
 except Exception as e:
  manifest['warnings'].append('Texture '+str(file)+': '+str(e));return None
def make_material(info,index,category):
 info=info or {};mat=bpy.data.materials.new('restored-'+str(info.get('id',index)));mat.use_nodes=True
 bs=mat.node_tree.nodes.get('Principled BSDF');bs.inputs['Roughness'].default_value=.86
 col=info.get('color') or [.36,.42,.24]
 bs.inputs['Base Color'].default_value=(*col[:3],1)
 # A V-Ray material with no diffuse map uses its color; other referenced maps may be blue normal maps.
 diffuse=info.get('diffuse') if info.get('class')=="'VRayMtl'" and 'diffuse' in info else info.get('diffuse') or next((t for t in info.get('textures',[]) if not any(k in t.lower() for k in ['bump','normal','opacity','alpha','mask'])),None)
 img=image(diffuse)
 if img:
  tex=mat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=img
  mat.node_tree.links.new(tex.outputs['Color'],bs.inputs['Base Color'])
  if img.channels==4:
   mat.node_tree.links.new(tex.outputs['Alpha'],bs.inputs['Alpha'])
   mat.surface_render_method='DITHERED';mat.alpha_threshold=.45
 alpha=image(info.get('alpha'))
 if alpha:
  tex=mat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=alpha
  mat.node_tree.links.new(tex.outputs['Color'],bs.inputs['Alpha']);mat.surface_render_method='DITHERED';mat.alpha_threshold=.45
 mat.use_backface_culling=False
 return mat
for number,(pid,p) in enumerate(unique.items()):
 name=p['path'].split('\\')[-1];category=kind(name);cache=OUT/(pid+'.json');dest=OUT/(pid+'.glb')
 if cache.exists() and dest.exists():manifest['prototypes'][pid]=json.loads(cache.read_text('utf8'));continue
 print('CONVERT',number+1,len(unique),name,flush=True)
 bpy.ops.wm.read_factory_settings(use_empty=True)
 chunks=read_proxy(files[name.lower()]);vs=[];fs=[];ids=[];uvs=[];offset=0
 for v,f,mid,uv in chunks:
  vs.append(v);fs.append(f.astype(np.int32)+offset);ids.append(mid);uvs.append(uv if uv is not None else np.zeros((len(f),3,2),dtype=np.float32));offset+=len(v)
 v=np.concatenate(vs);f=np.concatenate(fs);mids=np.concatenate(ids);uv=np.concatenate(uvs);lo=v.min(0);hi=v.max(0);center=(lo+hi)*.5;span=float((hi-lo).max());v=(v-center)/span
 mesh=bpy.data.meshes.new(pid);mesh.vertices.add(len(v));mesh.vertices.foreach_set('co',v.ravel());mesh.loops.add(f.size);mesh.loops.foreach_set('vertex_index',f.ravel());mesh.polygons.add(len(f));mesh.polygons.foreach_set('loop_start',np.arange(len(f),dtype=np.int32)*3);mesh.polygons.foreach_set('loop_total',np.full(len(f),3,dtype=np.int32));mesh.update()
 materials=p['materials'];count=max(len(materials),int(mids.max())+1)
 for k in range(count):mesh.materials.append(make_material(materials[k] if k<len(materials) else materials[-1] if materials else None,k,category))
 mesh.polygons.foreach_set('material_index',mids.astype(np.int32));mesh.polygons.foreach_set('use_smooth',np.ones(len(f),dtype=bool))
 layer=mesh.uv_layers.new();layer.data.foreach_set('uv',uv.astype(np.float32).ravel())
 obj=bpy.data.objects.new(pid,mesh);bpy.context.collection.objects.link(obj);bpy.context.view_layer.objects.active=obj;obj.select_set(True)
 target=5500 if category=='tree' else (1600 if 'iTrees' in name else 550 if 'iAlpine' in name else 1800) if category=='plant' else 1000 if category=='person' else 1800
 original=len(f)
 if original>target and category not in ('tree','plant'):
  mod=obj.modifiers.new('Web polygon budget','DECIMATE');mod.ratio=target/original;mod.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=mod.name)
 actual=len(obj.data.polygons)
 bpy.ops.export_scene.gltf(filepath=str(dest.resolve()),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_materials='EXPORT',export_image_format='AUTO',export_cameras=False,export_lights=False,export_animations=False)
 # Use alpha cutout for foliage rather than expensive transparent sorting.
 data=dest.read_bytes();import struct
 jl=struct.unpack_from('<I',data,12)[0];doc=json.loads(data[20:20+jl]);binary=data[20+jl:]
 for mat in doc.get('materials',[]):
  if mat.get('alphaMode')=='BLEND':mat['alphaMode']='MASK';mat['alphaCutoff']=.45
 js=json.dumps(doc,separators=(',',':')).encode();js+=b' '*((-len(js))%4)
 dest.write_bytes(struct.pack('<III',0x46546c67,2,20+len(js)+len(binary))+struct.pack('<II',len(js),0x4e4f534a)+js+binary)
 rec={'file':pid+'.glb','source':name,'kind':category,'originalTriangles':original,'triangles':actual,'center':center.tolist(),'span':span,'bytes':dest.stat().st_size}
 cache.write_text(json.dumps(rec,ensure_ascii=False,indent=2),'utf8');manifest['prototypes'][pid]=rec
 del chunks,vs,fs,ids,uvs,v,f,mids,uv;gc.collect()
 print('READY',name,original,'->',actual,dest.stat().st_size,flush=True)
# Blender source Z-up to Three Y-up, using the existing map normalization exactly.
scale=.0002574323453315899;origin=np.array([4371885.,4123960.75,-45986.109375])
B=np.array([[1,0,0,0],[0,0,1,0],[0,-1,0,0],[0,0,0,1]],dtype=float);N=np.eye(4);N[:3,:3]*=scale;N[:3,3]=-origin*scale
for o in source['objects']:
 p=source['prototypes'][o['prototype']];pid=mapping[o['prototype']];r=manifest['prototypes'][pid]
 local=np.eye(4);local[:3,:3]*=r['span']*p['proxyScale'];local[:3,3]=np.array(r['center'])*p['proxyScale']
 world=N@np.array(o['matrix'])@local;matrix=B@world@B.T
 x,y,z=matrix[:3,3];iy=min(3,max(0,int((-z+482.5809021)/965.1618347*4)));ix=min(3,max(0,int((x+500)/1000*4)));tile=iy*4+ix
 assert np.isfinite(matrix).all()
 manifest['instances'].append({'name':o['name'],'prototype':pid,'tile':tile,'matrix':matrix.T.ravel().tolist()})
manifest['warnings']=sorted(set(manifest['warnings']))
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')),'utf8')
print('COMPLETE',len(manifest['prototypes']),len(manifest['instances']),manifest['warnings'],flush=True)
