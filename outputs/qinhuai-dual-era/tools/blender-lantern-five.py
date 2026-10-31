"""Single isolated Blender job, source -> 5%, with original UVs and normals."""
import bpy, sys, json, time
from pathlib import Path
source, output = [Path(v) for v in sys.argv[sys.argv.index('--')+1:]]
started = time.time()
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(source))
objects = list(bpy.context.scene.objects)
meshes = [o for o in objects if o.type == 'MESH']
def triangles():
    for o in meshes: o.data.calc_loop_triangles()
    return sum(len(o.data.loop_triangles) for o in meshes)
before = triangles()
uvs = [len(o.data.uv_layers) for o in meshes]
for obj in meshes:
    bpy.context.view_layer.objects.active = obj
    modifier = obj.modifiers.new('Retain original 5 percent', 'DECIMATE')
    modifier.decimate_type = 'COLLAPSE'
    modifier.ratio = .05
    modifier.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=modifier.name)
assert [len(o.data.uv_layers) for o in meshes] == uvs
after = triangles()
bpy.ops.object.select_all(action='DESELECT')
for obj in objects: obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(output), export_format='GLB', use_selection=True,
    export_yup=True, export_animations=False, export_materials='NONE', export_normals=True, export_texcoords=True)
output.with_suffix('.json').write_text(json.dumps({'before':before, 'after':after, 'ratio':after/before,
    'blender':bpy.app.version_string, 'seconds':round(time.time()-started,1)}, indent=2), encoding='utf8')
print('FIVE_PERCENT_DONE', before, after, flush=True)
