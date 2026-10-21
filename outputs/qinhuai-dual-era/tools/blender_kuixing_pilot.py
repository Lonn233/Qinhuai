"""Single-building, reversible pilot. Never writes the source GLB.
Run Blender --background --factory-startup --python this.py -- --mode audit|lod --root ...
"""
import bpy, sys, os, json, math, time, hashlib, argparse, gc
import numpy as np
from pathlib import Path
from mathutils import Vector
from mathutils.kdtree import KDTree
p=argparse.ArgumentParser()
p.add_argument('--root',required=True);p.add_argument('--mode',choices=['audit','lod'],default='audit')
p.add_argument('--level',choices=['LOD0','LOD1','LOD2'],default='LOD0');p.add_argument('--target',type=int,default=900000)
p.add_argument('--output-dir',type=Path,help='Separate run directory; never point at the source directory')
p.add_argument('--resolution',type=int,default=640);p.add_argument('--skip-render',action='store_true');p.add_argument('--render',action='store_true',help='Explicitly opt into memory-intensive Blender rendering')
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);root=Path(a.root);base=root/'assets'/'kuixing-pilot';out=base if a.mode=='audit' else base/'blender-decimate-experiment'
if a.target <= 0: p.error('--target must be positive')
if a.output_dir:
 out=a.output_dir.resolve()
 if out == root.resolve() or out == base.resolve(): p.error('Use a dedicated output directory')
for sub in ['source','optimized','export','renders','reports']: (out/sub).mkdir(parents=True,exist_ok=True)
source=root/'Meshy_AI_kuixingge_1016044736_texture.glb'
def log(s): print('PILOT '+s,flush=True)
def write_json(file,data): file.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
def sha(file):
 h=hashlib.sha256()
 with file.open('rb') as f:
  for block in iter(lambda:f.read(1024*1024),b''): h.update(block)
 return h.hexdigest()
start=time.perf_counter();bpy.ops.wm.read_factory_settings(use_empty=True)
log('Importing original GLB; untouched source '+str(source))
bpy.ops.import_scene.gltf(filepath=str(source))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
if len(meshes)!=1: raise RuntimeError('Pilot expects this specific single-mesh pavilion; manual review required')
obj=meshes[0];obj.name='Kuixing_Source_High';mesh=obj.data
points=[obj.matrix_world@Vector(c) for c in obj.bound_box]
lo=Vector(tuple(min(v[k] for v in points) for k in range(3)));hi=Vector(tuple(max(v[k] for v in points) for k in range(3)))
center=(lo+hi)/2;size=hi-lo;height=max(size);original_triangles=sum(len(poly.vertices)-2 for poly in mesh.polygons)
images=[{'name':im.name,'size':list(im.size),'colorspace':im.colorspace_settings.name,'packed':bool(im.packed_file)} for im in bpy.data.images if im.size[0]]
audit={'blender':bpy.app.version_string,'source':str(source),'source_sha256':sha(source),'source_bytes':source.stat().st_size,'meshes':len(meshes),'vertices':len(mesh.vertices),'triangles':original_triangles,'edges':len(mesh.edges),'materials':len(mesh.materials),'uv_layers':[u.name for u in mesh.uv_layers],'bounds_min':list(lo),'bounds_max':list(hi),'images':images,'has_custom_normals':mesh.has_custom_normals,'import_seconds':time.perf_counter()-start,'semantic_structure':'Single unlabelled scanned/AI mesh. Roof/eave proximity is a heuristic, not semantic recognition. No internal geometry removed.','manual_review':['Eaves and ridge silhouette','Columns/windows/ornaments','UV seams and baked normals','Interior visibility in first person']}
if a.mode=='audit':
 write_json(out/'reports'/'source-audit.json',audit)
 bpy.ops.wm.save_as_mainfile(filepath=str(out/'source'/'kuixing_high.blend'),compress=True)
 log('Saved non-destructive original Blender source')
else:
 # Proximity protection uses existing measured source-coordinate eave profiles.
 # glTF Y-up -> Blender Z-up: (x,y,z) -> (x,-z,y).
 paths=json.loads((base/'eaves.json').read_text(encoding='utf8'));samples=[]
 for path in paths:
  for u,v in zip(path,path[1:]+path[:1]):
   va=Vector((u[0],-u[2],u[1]));vb=Vector((v[0],-v[2],v[1]));steps=max(1,math.ceil((vb-va).length/(height*.004)))
   samples.extend(va.lerp(vb,k/steps) for k in range(steps))
 tree=KDTree(len(samples))
 for i,v in enumerate(samples):tree.insert(v,i)
 tree.balance();coords=np.empty(len(mesh.vertices)*3,dtype=np.float32);mesh.vertices.foreach_get('co',coords);coords=coords.reshape((-1,3))
 # High weights make flat, interior regions more eligible for collapse. Low
 # weights protect measured eaves, top ridge, base and extreme silhouette.
 group=obj.vertex_groups.new(name='Simplification_Eligibility_EaveProtected');buckets=[[] for _ in range(12)]
 band=height*.018
 for i,co in enumerate(coords):
  distance=tree.find(Vector(co))[2];weight=min(1.0,max(.015,(distance/band)**2))
  if co[2]>hi.z-height*.045:weight=min(weight,.025)
  if abs(co[0]-lo.x)<height*.006 or abs(co[0]-hi.x)<height*.006 or abs(co[1]-lo.y)<height*.006 or abs(co[1]-hi.y)<height*.006:weight=min(weight,.04)
  bucket=min(11,round(weight*11));buckets[bucket].append(i)
 for bucket,indices in enumerate(buckets):
  weight=max(.015,bucket/11)
  for j in range(0,len(indices),50000):group.add(indices[j:j+50000],weight,'REPLACE')
 protected=sum(len(b) for b in buckets[:3]);del buckets,coords,tree,samples;gc.collect()
 modifier=obj.modifiers.new('NonDestructive_Protected_'+a.level,'DECIMATE');modifier.decimate_type='COLLAPSE';modifier.ratio=min(1,a.target/original_triangles);modifier.use_collapse_triangulate=True;modifier.vertex_group=group.name;modifier.vertex_group_factor=80
 obj.name='Kuixing_'+a.level+'_Candidate'
 log('Evaluating protected decimation '+a.level+' target='+str(a.target))
 bpy.context.view_layer.objects.active=obj;obj.select_set(True)
 evaluation_start=time.perf_counter();evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get());optimized=bpy.data.meshes.new_from_object(evaluated,preserve_all_data_layers=True,depsgraph=bpy.context.evaluated_depsgraph_get())
 actual=sum(len(poly.vertices)-2 for poly in optimized.polygons)
 # Save source mesh plus unapplied modifier. Rendering/export below use a
 # separate evaluated mesh, so repeatable presets never overwrite the high mesh.
 bpy.ops.wm.save_as_mainfile(filepath=str(out/'optimized'/('kuixing_'+a.level+'.blend')),compress=True)
 obj.modifiers.clear();obj.data=optimized
 bpy.data.meshes.remove(mesh);gc.collect()
 report={**audit,'level':a.level,'requested_triangles':a.target,'actual_triangles':actual,'actual_vertices':len(optimized.vertices),'reduction_fraction':1-actual/original_triangles,'protected_vertex_count':protected,'modifier':{'type':'DECIMATE','ratio':a.target/original_triangles,'vertex_group_factor':80,'spatially_weighted':True},'evaluation_seconds':time.perf_counter()-evaluation_start,'approval':'candidate_not_approved','new_normal_bake':'not_performed; existing source normal map retained, requires visual verification','texture_policy':'Original 2K maps/UV retained. No resizing or GPU compression without comparison.'}
 bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
 export=out/'export'/('kuixing_'+a.level+'.glb')
 bpy.ops.export_scene.gltf(filepath=str(export),export_format='GLB',use_selection=True,export_apply=False,export_yup=True,export_normals=True,export_tangents=False,export_materials='EXPORT')
 report['glb_bytes']=export.stat().st_size;report['glb_sha256']=sha(export)
 write_json(out/'reports'/(a.level+'.json'),report);log('Exported '+str(export)+' triangles='+str(actual))
if a.render and not a.skip_render:
 scene=bpy.context.scene
 engines=[item.identifier for item in scene.render.bl_rna.properties['engine'].enum_items]
 scene.render.engine=next((v for v in ['CYCLES','BLENDER_EEVEE','BLENDER_EEVEE_NEXT'] if v in engines),'CYCLES')
 if scene.render.engine=='CYCLES':scene.cycles.device='CPU';scene.cycles.samples=12;scene.cycles.use_denoising=True;scene.cycles.max_bounces=4
 scene.render.threads_mode='FIXED';scene.render.threads=4;scene.render.resolution_x=a.resolution;scene.render.resolution_y=a.resolution;scene.render.resolution_percentage=100
 scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.film_transparent=True
 scene.world=bpy.data.worlds.new('Comparison_World');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.72,.78,.85,1);scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.45
 for name,position,energy,width in [('Key',(3,-4,5),900,4),('Fill',(-4,-1,3),550,5),('Rim',(1,4,4),750,4)]:
  data=bpy.data.lights.new(name,'AREA');data.energy=energy*height*height/16;data.shape='DISK';data.size=width*height/4;light=bpy.data.objects.new(name,data);scene.collection.objects.link(light);light.location=center+Vector(position)*height/2;light.rotation_euler=(center-light.location).to_track_quat('-Z','Y').to_euler()
 camera_data=bpy.data.cameras.new('Fixed_Comparison_Camera');camera_data.type='ORTHO';camera_data.ortho_scale=height*1.22
 camera=bpy.data.objects.new('Fixed_Comparison_Camera',camera_data);scene.collection.objects.link(camera);scene.camera=camera
 views={'front':(0,-3,.08),'left':(-3,0,.08),'right':(3,0,.08),'top':(0,-.001,3),'game_iso':(1.75,-1.35,1.8)}
 label='source' if a.mode=='audit' else a.level;folder=out/'renders'/label;folder.mkdir(exist_ok=True)
 poses=[]
 for name,direction in views.items():
  camera.location=center+Vector(direction)*height;camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(folder/(name+'.png'))
  log('Rendering '+label+' '+name);bpy.ops.render.render(write_still=True)
  poses.append({'name':name,'camera_position':list(camera.location),'camera_rotation':list(camera.rotation_euler),'ortho_scale':camera_data.ortho_scale})
 write_json(out/'reports'/(label+'-render-settings.json'),{'engine':scene.render.engine,'samples':scene.cycles.samples if scene.render.engine=='CYCLES' else None,'resolution':a.resolution,'poses':poses,'comparison':'Asset-only fixed studio lighting, not in-game browser screenshots. Original normal map and material retained.'})
log('Completed '+a.mode+' in '+str(round(time.perf_counter()-start,2))+' seconds')
