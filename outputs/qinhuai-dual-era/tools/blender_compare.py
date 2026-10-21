"""Fixed Blender EEVEE asset comparisons; never opens or controls a browser."""
import bpy, sys, json, argparse, time
from pathlib import Path
from mathutils import Vector
p=argparse.ArgumentParser();p.add_argument('--root',required=True);p.add_argument('--asset',default='source');p.add_argument('--resolution',type=int,default=512);p.add_argument('--engine',default='BLENDER_EEVEE');a=p.parse_args(sys.argv[sys.argv.index('--')+1:])
r=Path(a.root)/'assets/kuixing-pilot';label=a.asset;t=time.perf_counter()
bpy.ops.wm.read_factory_settings(use_empty=True)
if label=='source':bpy.ops.wm.open_mainfile(filepath=str(r/'source/kuixing_high.blend'))
else:bpy.ops.import_scene.gltf(filepath=str(r/'export'/('kuixing_'+label+'.glb')))
scene=bpy.context.scene;scene.render.engine=a.engine
if a.engine=='CYCLES':scene.cycles.device='CPU';scene.cycles.samples=8;scene.cycles.use_denoising=True
if hasattr(scene,'eevee'):scene.eevee.taa_render_samples=16
scene.render.resolution_x=a.resolution;scene.render.resolution_y=a.resolution;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.film_transparent=True
scene.world=bpy.data.worlds.new('ComparisonWorld');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.72,.78,.85,1);scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.45
ref=json.loads((r/'reports/source-audit.json').read_text(encoding='utf8'));lo=Vector(ref['bounds_min']);hi=Vector(ref['bounds_max']);center=(lo+hi)/2;height=max(hi-lo)
for name,pos,energy,width in [('Key',(3,-4,5),900,4),('Fill',(-4,-1,3),550,5),('Rim',(1,4,4),750,4)]:
 d=bpy.data.lights.new(name,'AREA');d.energy=energy*height*height/16;d.shape='DISK';d.size=width*height/4;o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=center+Vector(pos)*height/2;o.rotation_euler=(center-o.location).to_track_quat('-Z','Y').to_euler()
d=bpy.data.cameras.new('FixedCamera');d.type='ORTHO';d.ortho_scale=height*1.22;c=bpy.data.objects.new('FixedCamera',d);scene.collection.objects.link(c);scene.camera=c
views={'front':(0,-3,.08),'left':(-3,0,.08),'right':(3,0,.08),'top':(0,-.001,3),'game_iso':(1.75,-1.35,1.8)};folder=r/'renders'/label;folder.mkdir(exist_ok=True);poses=[]
for name,dir in views.items():
 c.location=center+Vector(dir)*height;c.rotation_euler=(center-c.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(folder/(name+'.png'));print('COMPARISON '+label+' '+name,flush=True);ts=time.perf_counter();bpy.ops.render.render(write_still=True);poses.append({'view':name,'position':list(c.location),'rotation':list(c.rotation_euler),'ortho_scale':d.ortho_scale,'seconds':time.perf_counter()-ts})
(r/'reports'/(label+'-render-settings.json')).write_text(json.dumps({'engine':a.engine,'resolution':a.resolution,'view_transform':scene.view_settings.view_transform,'exposure':scene.view_settings.exposure,'poses':poses,'elapsed_seconds':time.perf_counter()-t,'scope':'Asset-only offline studio comparison. NOT in-game or browser FPS.'},indent=2),encoding='utf8')
