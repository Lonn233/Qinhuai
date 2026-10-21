"""Preserve painted red lantern; create a map LOD + short rod, origin at mount."""
import bpy,json,hashlib
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/red-lantern';OUT.mkdir(parents=True,exist_ok=True)
src=Path('E:/soft/inspiration/灯会/model/红灯笼.glb')
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(src))
objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
pts=[o.matrix_world@Vector(p) for o in objects for p in o.bound_box]
lo=Vector(tuple(min(v[k] for v in pts) for k in range(3)));hi=Vector(tuple(max(v[k] for v in pts) for k in range(3)))
before=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
scale=.65/(hi.z-lo.z);center=(lo+hi)/2
# Blender Z-up: body top is 18 cm below origin; glTF Y-up mount remains (0,0,0).
for o in objects:
 world=o.matrix_world.copy()
 for v in o.data.vertices:
  p=world@v.co;p.x=(p.x-center.x)*scale;p.y=(p.y-center.y)*scale;p.z=(p.z-hi.z)*scale-.18;v.co=p
 o.matrix_world.identity();bpy.context.view_layer.objects.active=o
 mod=o.modifiers.new('Painted silhouette LOD','DECIMATE');mod.ratio=min(1,4500/before);mod.use_collapse_triangulate=True
 bpy.ops.object.modifier_apply(modifier=mod.name)
 o.name='RedLanternBody'
 for m in o.data.materials:
  if m:m.name='RedLanternFabric'
for image in bpy.data.images:
 w,h=image.size
 if max(w,h)>1024:
  ratio=1024/max(w,h);image.scale(round(w*ratio),round(h*ratio));image.pack()
bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=.009,depth=.184,location=(0,0,-.09))
rod=bpy.context.object;rod.name='HangingRod'
mat=bpy.data.materials.new('DarkBronzeRod');mat.diffuse_color=(.11,.055,.023,1);mat.use_nodes=True
bsdf=mat.node_tree.nodes.get('Principled BSDF');bsdf.inputs['Base Color'].default_value=mat.diffuse_color;bsdf.inputs['Metallic'].default_value=.65;bsdf.inputs['Roughness'].default_value=.55;rod.data.materials.append(mat)
# One joined mesh, with separate fabric/rod material slots for independent emission.
bpy.ops.object.select_all(action='DESELECT')
for o in objects+[rod]:o.select_set(True)
bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();assembly=bpy.context.object;assembly.name='RedLanternPendant'
bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
mount=bpy.data.objects.new('MountPoint',None);bpy.context.collection.objects.link(mount);mount.location=(0,0,0);assembly.parent=mount
mount['mount_axis']='+Y glTF / +Z Blender';mount['body_height_m']=.65;mount['rod_length_m']=.18
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'red-lantern-pendant.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'red-lantern-pendant.glb'),export_format='GLB',export_yup=True,export_animations=False,export_extras=True)
after=sum(len(p.vertices)-2 for p in assembly.data.polygons)
(OUT/'model-report.json').write_text(json.dumps({'source':str(src),'sourceHash':hashlib.sha256(src.read_bytes()).hexdigest(),'beforeTriangles':before,'afterTriangles':after,'bodyHeightMeters':.65,'rodLengthMeters':.18,'mountPoint':[0,0,0],'bodyWidthMeters':(hi.x-lo.x)*scale,'bodyDepthMeters':(hi.y-lo.y)*scale,'textureMax':1024},ensure_ascii=False,indent=2),encoding='utf8')
print('RED_LANTERN_READY',before,after,flush=True)
