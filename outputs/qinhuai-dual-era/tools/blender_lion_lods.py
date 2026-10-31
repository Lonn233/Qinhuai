"""Lion-only LOD derivatives, preserving UV interpolation and painted fabric."""
import bpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'game/assets/lion.glb'
OUT=ROOT/'work/lion-lods';OUT.mkdir(parents=True,exist_ok=True)
for level,budget in [(1,9000),(2,1500)]:
 bpy.ops.wm.read_factory_settings(use_empty=True)
 source=SOURCE if level==1 else ROOT/'assets/qinhuai-modern-import/festival/lion-low.glb'
 bpy.ops.import_scene.gltf(filepath=str(source))
 meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
 before=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes)
 for obj in meshes:
  bpy.context.view_layer.objects.active=obj
  mod=obj.modifiers.new('Lion UV-preserving LOD','DECIMATE');mod.ratio=budget/before;mod.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=mod.name)
  assert obj.data.uv_layers
 bpy.ops.export_scene.gltf(filepath=str(OUT/f'lion-lod{level}.glb'),export_format='GLB',export_yup=True,export_animations=False,export_materials='NONE')
 print('LION_LOD',level,sum(len(o.data.polygons) for o in meshes),flush=True)
