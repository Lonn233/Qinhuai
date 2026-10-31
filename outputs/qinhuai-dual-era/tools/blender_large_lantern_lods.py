"""Map-only lantern LODs; never writes source models or user settings."""
import bpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'work/large-lantern-lods';OUT.mkdir(parents=True,exist_ok=True)
def reduce(source,target,budget):
 bpy.ops.wm.read_factory_settings(use_empty=True)
 bpy.ops.import_scene.gltf(filepath=str(source))
 meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
 before=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes)
 for obj in meshes:
  bpy.context.view_layer.objects.active=obj
  mod=obj.modifiers.new('Lantern LOD','DECIMATE');mod.ratio=min(1,budget/before);mod.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=mod.name)
  assert obj.data.uv_layers
 bpy.ops.export_scene.gltf(filepath=str(target),export_format='GLB',export_yup=True,export_animations=False,export_materials='NONE')
 print('LANTERN_LOD',target.name,sum(len(o.data.polygons) for o in meshes),flush=True)
# Generate gongming-high.glb first with prepare-gongming-lantern.cjs --high.
reduce(ROOT/'assets/gongming-lantern/gongming-high.glb',OUT/'gongming-1.glb',30000)
reduce(OUT/'gongming-1.glb',OUT/'gongming-2.glb',8000)
reduce(ROOT/'assets/qinhuai-modern-import/festival/mountain-low.glb',OUT/'mountain-2.glb',8000)
