"""Reduce one front sector before rotation so all four sides remain identical."""
import bpy
import sys

source, output, ratio = sys.argv[sys.argv.index('--')+1:]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=source)
for obj in bpy.context.scene.objects:
    if obj.type != 'MESH':
        continue
    bpy.context.view_layer.objects.active = obj
    modifier = obj.modifiers.new('Front sector quality', 'DECIMATE')
    modifier.ratio = float(ratio)
    modifier.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=modifier.name)
bpy.ops.export_scene.gltf(filepath=output, export_format='GLB', export_yup=True,
    export_animations=False, export_materials='NONE', export_normals=True, export_texcoords=True)
