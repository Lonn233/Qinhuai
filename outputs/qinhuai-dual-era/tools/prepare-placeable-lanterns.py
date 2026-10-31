"""Bake separate 5% scene-editor assets without rewriting the source models."""
import bpy
import hashlib
import json
import sys
import time
from pathlib import Path
from mathutils import Vector

source_dir, output_dir = [Path(v) for v in sys.argv[sys.argv.index('--') + 1:]]
output_dir.mkdir(parents=True, exist_ok=True)
catalog = [('column', '\u67f1\u53f0\u706f'), ('rack', '\u706f\u67b6\u706f'),
           ('pink', '\u7c89\u82b1\u706f'), ('drum', '\u9f13\u706f')]
reports = []
for kind, name in catalog:
    started = time.time()
    source = source_dir / (name + '.glb')
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(source))
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']

    def triangles():
        for obj in meshes:
            obj.data.calc_loop_triangles()
        return sum(len(o.data.loop_triangles) for o in meshes)

    before = triangles()
    uv_counts = [len(o.data.uv_layers) for o in meshes]
    for obj in meshes:
        bpy.context.view_layer.objects.active = obj
        modifier = obj.modifiers.new('Five percent scene asset', 'DECIMATE')
        modifier.decimate_type = 'COLLAPSE'
        modifier.ratio = .05
        modifier.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    after = triangles()
    assert uv_counts == [len(o.data.uv_layers) for o in meshes]
    points = [o.matrix_world @ Vector(corner) for o in meshes for corner in o.bound_box]
    output = output_dir / (kind + '-five.glb')
    bpy.ops.export_scene.gltf(filepath=str(output), export_format='GLB',
                              export_yup=True, export_animations=False,
                              export_materials='EXPORT', export_normals=True,
                              export_texcoords=True)
    assert digest == hashlib.sha256(source.read_bytes()).hexdigest()
    report = dict(kind=kind, name=name, source=str(source), sourceSha256=digest,
                  before=before, after=after, ratio=after / before,
                  bytes=output.stat().st_size, uvLayers=uv_counts,
                  blenderBounds=[[min(p[i] for p in points) for i in range(3)],
                                 [max(p[i] for p in points) for i in range(3)]],
                  seconds=round(time.time() - started, 1))
    reports.append(report)
    (output_dir / 'audit.json').write_text(json.dumps(reports, ensure_ascii=False, indent=2), encoding='utf8')
    print('PLACEABLE_DONE', json.dumps(report, ensure_ascii=True), flush=True)
