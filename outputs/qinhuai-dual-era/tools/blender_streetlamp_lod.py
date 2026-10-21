"""Build a textured, low-poly roadside asset from the repaired Blender source."""
import bpy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/qinhuai-modern-import/streetlamps'
bpy.ops.wm.open_mainfile(filepath=str(OUT / 'streetlamp-straight.blend'))
objects = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
audit = []
for obj in objects:
    bpy.context.view_layer.objects.active = obj
    before = sum(len(face.vertices) - 2 for face in obj.data.polygons)
    modifier = obj.modifiers.new('Roadside silhouette LOD', 'DECIMATE')
    modifier.decimate_type = 'COLLAPSE'
    modifier.ratio = .065
    modifier.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    after = sum(len(face.vertices) - 2 for face in obj.data.polygons)
    assert obj.data.uv_layers, 'Retain painted lantern UVs'
    assert after <= 12000, 'Roadside geometry budget'
    audit.append({'object': obj.name, 'beforeTriangles': before,
                  'afterTriangles': after, 'vertices': len(obj.data.vertices)})

bpy.ops.object.select_all(action='DESELECT')
for obj in objects:
    obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT / 'streetlamp-low.glb'),
                          export_format='GLB', use_selection=True,
                          export_yup=True, export_animations=False)
bpy.context.preferences.filepaths.save_version = 0
bpy.context.scene.cycles.use_denoising = False
bpy.context.scene.cycles.samples = 8
bpy.context.scene.render.threads_mode = 'FIXED'
bpy.context.scene.render.threads = 4
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'streetlamp-low.blend'))
bpy.context.scene.render.filepath = str(OUT / 'low-front.png')
bpy.ops.render.render(write_still=True)
report = {'source': 'streetlamp-straight.blend', 'output': 'streetlamp-low.glb',
          'method': 'Blender collapse decimation; original material, textures and UVs retained',
          'ratio': .065, 'meshes': audit,
          'beforeBytes': (OUT / 'streetlamp-straight.glb').stat().st_size,
          'afterBytes': (OUT / 'streetlamp-low.glb').stat().st_size}
(OUT / 'lod-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print('LAMP_LOD', json.dumps(report), flush=True)
