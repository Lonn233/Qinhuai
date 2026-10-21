"""Non-destructive shaft correction and orthographic QA for the supplied lamp."""
import bpy
import json
import hashlib
import numpy as np
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('E:/soft/inspiration/灯会/model/普通灯/路灯1.glb')
OUT = ROOT / 'assets/qinhuai-modern-import/streetlamps'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(SOURCE))
objects = [o for o in bpy.context.scene.objects if o.type == 'MESH']
for obj in objects:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 12
scene.cycles.use_denoising = True
scene.render.resolution_x = 520
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.world = bpy.data.worlds.new('Neutral QA world')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.32, .36, .40, 1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .6
scene.view_settings.view_transform = 'AgX'
for name, loc, energy, size in [('Key', (2, -4, 3), 350, 4), ('Fill', (-2, 1, 2), 180, 3)]:
    data = bpy.data.lights.new(name, 'AREA')
    data.energy, data.shape, data.size = energy, 'DISK', size
    lamp = bpy.data.objects.new(name, data)
    scene.collection.objects.link(lamp)
    lamp.location = loc
    lamp.rotation_euler = (-lamp.location).to_track_quat('-Z', 'Y').to_euler()
data = bpy.data.cameras.new('QA camera')
camera = bpy.data.objects.new('QA camera', data)
scene.collection.objects.link(camera)
camera.location = (0, -4, .05)
camera.rotation_euler = (Vector((0, 0, 0)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
data.type, data.ortho_scale = 'ORTHO', 2.12
scene.camera = camera
if not (OUT / 'original-front.png').exists():
    scene.render.filepath = str(OUT / 'original-front.png')
    bpy.ops.render.render(write_still=True)

audit = []
for obj in objects:
    mesh = obj.data
    original = np.array([v.co[:] for v in mesh.vertices])
    heights = np.linspace(-.60, .95, 156)
    centers = []
    for height in heights:
        section = original[(np.abs(original[:, 2] - height) < .022) & (original[:, 0] < -.09)]
        centers.append(float(section[:, 0].min() + .0195) if len(section) else float('nan'))
    centers = np.array(centers)
    good = np.isfinite(centers)
    centers = np.interp(heights, heights[good], centers[good])
    centers = np.convolve(np.pad(centers, (3, 3), mode='edge'), np.ones(7)/7, mode='valid')
    heights = np.r_[-.66, -.63, heights]
    centers = np.r_[-.0995, -.1017, centers]
    z = original[:, 2]
    x = original[:, 0]
    # Keep the sleeve, lanterns and bracket tips fixed; feather only the roots.
    blend = np.clip((-.055 - x)/.035, 0, 1)
    blend = blend * blend * (3 - 2 * blend)
    delta = (-.0995 - np.interp(z, heights, centers)) * blend
    delta[z < -.66] = 0
    for vertex, dx in zip(mesh.vertices, delta):
        vertex.co.x += float(dx)
    mesh.update()
    mesh.validate()
    unchanged = (x >= -.055) | (z < -.66)
    assert np.max(np.abs(delta[unchanged])) == 0
    audit.append({'object': obj.name, 'vertices': len(mesh.vertices),
                  'movedVertices': int(np.count_nonzero(np.abs(delta) > 1e-7)),
                  'maxHorizontalCorrection': float(np.max(np.abs(delta))),
                  'lanternAndBaseDisplacement': 0, 'uvAndTopology': 'unchanged'})

bpy.ops.object.select_all(action='DESELECT')
for obj in objects:
    obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT / 'streetlamp-straight.glb'),
                          export_format='GLB', use_selection=True,
                          export_yup=True, export_animations=False)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'streetlamp-straight.blend'))
scene.render.filepath = str(OUT / 'straight-front.png')
bpy.ops.render.render(write_still=True)
report = {'source': str(SOURCE), 'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
          'method': 'Blender mesh centerline correction; original UV, lanterns and sleeve retained',
          'meshes': audit}
(OUT / 'repair-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print('LAMP_AUDIT', json.dumps(report), flush=True)
