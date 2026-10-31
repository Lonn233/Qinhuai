import bpy
import json
import sys
from mathutils import Vector

path = sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=path)

objects = []
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH':
        corners = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
        objects.append({
            'name': obj.name,
            'verts': len(obj.data.vertices),
            'min': [min(v[i] for v in corners) for i in range(3)],
            'max': [max(v[i] for v in corners) for i in range(3)],
        })

all_corners = [obj.matrix_world @ Vector(c) for obj in bpy.context.scene.objects if obj.type == 'MESH' for c in obj.bound_box]
if all_corners:
    bmin = [min(v[i] for v in all_corners) for i in range(3)]
    bmax = [max(v[i] for v in all_corners) for i in range(3)]
else:
    bmin = bmax = [0, 0, 0]

print(json.dumps({'objects': objects, 'bounds': {'min': bmin, 'max': bmax}}, ensure_ascii=False))
