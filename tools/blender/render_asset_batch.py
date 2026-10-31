import bpy
import json
import os
import sys
from mathutils import Vector

ROOT = sys.argv[-2]
OUT_DIR = sys.argv[-1]

ASSETS = [
    # Core lantern set used by the project.
    ('lantern-lion', '瑞狮灯', 'assets/lantern-quality/five/lion.glb'),
    ('lantern-mountain', '鳖山灯', 'assets/lantern-quality/five/mountain.glb'),
    ('lantern-lotus-main', '荷花灯-主灯', 'assets/lantern-quality/five/lotus-main.glb'),
    ('lantern-lotus-one', '荷花灯-单朵', 'assets/lantern-quality/five/lotus-one.glb'),
    ('lantern-chrysanthemum', '菊水灯', 'assets/lantern-quality/five/chrysanthemum.glb'),
    ('lantern-streetlamp', '路灯', 'assets/lantern-quality/five/streetlamp.glb'),
    ('lantern-hanging', '吊灯', 'assets/lantern-quality/five/hanging.glb'),
    ('lantern-crane', '仙鹤灯', 'assets/lantern-quality/five/crane.glb'),
    ('lantern-fish', '金鱼灯', 'assets/lantern-quality/five/fish.glb'),
    ('lantern-woman', '女灯', 'assets/lantern-quality/five/woman.glb'),
    ('lantern-gongming', '功名灯', 'assets/lantern-quality/five/gongming.glb'),
    ('lantern-tengma', '腾马灯', 'assets/lantern-quality/five/tengma.glb'),
    ('lantern-green', '绿灯', 'assets/lantern-quality/five/green.glb'),
    ('lantern-blue', '蓝灯', 'assets/lantern-quality/five/blue.glb'),
    ('lantern-gold', '金灯笼', 'assets/lantern-quality/five/gold.glb'),
    ('lantern-red', '红灯笼', 'assets/lantern-quality/five/red.glb'),
    # Additional project-specific lantern variants.
    ('rack-blue', '庭院灯架-蓝', 'assets/courtyard-rack-lanterns/blue-low.glb'),
    ('rack-gold', '庭院灯架-金', 'assets/courtyard-rack-lanterns/gold-low.glb'),
    ('rack-green', '庭院灯架-绿', 'assets/courtyard-rack-lanterns/green-low.glb'),
    ('rack-red', '庭院灯架-红', 'assets/courtyard-rack-lanterns/red-low.glb'),
    ('placeable-column', '可放置灯-柱灯', 'assets/placeable-lanterns/column-five.glb'),
    ('placeable-drum', '可放置灯-鼓灯', 'assets/placeable-lanterns/drum-five.glb'),
    ('placeable-pink', '可放置灯-粉灯', 'assets/placeable-lanterns/pink-five.glb'),
    ('placeable-rack', '可放置灯-灯架', 'assets/placeable-lanterns/rack-five.glb'),
    ('feature-fish', '特色鱼灯', 'assets/feature-lanterns/fish-low.glb'),
    ('feature-woman', '特色女灯', 'assets/feature-lanterns/woman-low.glb'),
    ('golden-tree', '金色树灯', 'assets/golden-tree-lanterns/golden-lantern-lod.glb'),
    # Character models.
    ('character-student', '学生主角', 'assets/player/student.glb'),
    ('character-master', '先生', 'story/assets/master.glb'),
    ('character-riddle-host', '猜灯主持人', 'story/assets/riddle-host.glb'),
    ('character-kuixing', '魁星', 'assets/kuixing-pilot/export/kuixing_LOD1.glb'),
]

os.makedirs(OUT_DIR, exist_ok=True)

def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()

def add_area(name, location, energy, size, color, target):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    look_at(obj, target)

def bounds(objects):
    corners = [obj.matrix_world @ Vector(c) for obj in objects if obj.type == 'MESH' for c in obj.bound_box]
    if not corners:
        raise RuntimeError('No mesh geometry after import')
    bmin = Vector((min(v[i] for v in corners) for i in range(3)))
    bmax = Vector((max(v[i] for v in corners) for i in range(3)))
    return bmin, bmax

def render_one(slug, label, rel_path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    path = os.path.join(ROOT, rel_path)
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    bpy.ops.import_scene.gltf(filepath=path)

    # GLB exports from the project contain a small Icosphere helper used for previews.
    for obj in list(bpy.context.scene.objects):
        if obj.type == 'MESH' and (obj.name.lower().startswith('icosphere') or obj.name.lower() in {'sphere', 'helper'}):
            bpy.data.objects.remove(obj, do_unlink=True)

    meshes = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    bmin, bmax = bounds(meshes)
    center = (bmin + bmax) * 0.5
    size = bmax - bmin
    height = max(size.z, 0.1)
    width = max(size.x, 0.1)
    depth = max(size.y, 0.1)
    target = Vector((center.x, center.y, center.z))

    world = bpy.data.worlds.new('AssetPreviewWorld')
    bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.006, 0.009, 0.014, 1.0)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.06

    # A restrained studio setup matching the student preview.
    add_area('Key', (2.8, -3.4, max(2.2, center.z + height * 0.95)), 260, 3.0, (1.0, 0.88, 0.75), target)
    add_area('Fill', (-2.8, -2.6, max(1.4, center.z + height * 0.45)), 150, 3.2, (0.65, 0.78, 1.0), target)
    add_area('Rim', (0.0, 2.2, max(2.0, center.z + height * 0.8)), 320, 2.4, (0.55, 0.70, 1.0), target)

    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 640
    scene.render.resolution_y = 800
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = False
    scene.view_settings.look = 'AgX - Medium Low Contrast'
    scene.view_settings.exposure = -0.45
    scene.view_settings.gamma = 1.0

    camera_data = bpy.data.cameras.new('AssetFrontCamera')
    camera = bpy.data.objects.new('AssetFrontCamera', camera_data)
    scene.collection.objects.link(camera)
    scene.camera = camera
    camera_data.type = 'ORTHO'
    camera_data.ortho_scale = max(height * 1.18, width * 1.55, depth * 1.55)
    camera.location = (center.x, center.y - max(4.0, depth * 5.0), center.z)
    look_at(camera, target)

    output_path = os.path.join(OUT_DIR, f'{slug}.png')
    scene.render.filepath = output_path
    bpy.ops.render.render(write_still=True)
    return {
        'slug': slug,
        'label': label,
        'source': rel_path,
        'output': output_path,
        'bounds': {'min': list(bmin), 'max': list(bmax)},
    }

results = []
errors = []
for slug, label, rel_path in ASSETS:
    try:
        print(f'RENDER {slug} | {label} | {rel_path}', flush=True)
        results.append(render_one(slug, label, rel_path))
    except Exception as exc:
        print(f'ERROR {slug}: {exc}', flush=True)
        errors.append({'slug': slug, 'label': label, 'source': rel_path, 'error': repr(exc)})

with open(os.path.join(OUT_DIR, 'manifest.json'), 'w', encoding='utf-8') as fp:
    json.dump({'results': results, 'errors': errors}, fp, ensure_ascii=False, indent=2)
print(f'COMPLETE {len(results)} rendered, {len(errors)} errors')

