import bpy
import math
from pathlib import Path
from mathutils import Vector

ROOT = Path(r'E:/soft/project/codex-Qinhuai/outputs/qinhuai-dual-era')
GLB = ROOT / 'assets/qinhuai-modern-import/tiles/tile-10.glb'
OUT = ROOT / 'assets/qinhuai-modern-import/reference-renders/day-reference-cycles-tile10.png'
OUT.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(GLB))

# Keep the reference render close to the normalized Three.js scene scale.
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 4
scene.cycles.max_bounces = 2
scene.cycles.use_denoising = False
scene.render.resolution_x = 480
scene.render.resolution_y = 320
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = str(OUT)
scene.render.film_transparent = False

# Physically readable daylight: medium-high sun, blue sky fill, slightly warm direct light.
elevation = math.radians(38.0)
azimuth = math.radians(145.0)
world = bpy.data.worlds.new('Qinhuai Daylight World') if not bpy.data.worlds else bpy.data.worlds[0]
scene.world = world
world.use_nodes = True
nodes = world.node_tree.nodes
links = world.node_tree.links
nodes.clear()
tex = nodes.new('ShaderNodeTexSky')
tex.sky_type = 'HOSEK_WILKIE'
tex.sun_elevation = elevation
tex.sun_rotation = azimuth
tex.altitude = 0.25
tex.air_density = 1.0
bg = nodes.new('ShaderNodeBackground')
bg.inputs['Strength'].default_value = 0.32
out = nodes.new('ShaderNodeOutputWorld')
links.new(tex.outputs['Color'], bg.inputs['Color'])
links.new(bg.outputs['Background'], out.inputs['Surface'])

# Match Three.js coordinates: x/z horizontal, y vertical.
light_data = bpy.data.lights.new('Sun - Qinhuai', type='SUN')
sun = bpy.data.objects.new('Sun - Qinhuai', light_data)
scene.collection.objects.link(sun)
sun.rotation_euler = (math.pi / 2 - elevation, 0.0, -azimuth)
light_data.energy = 3.2
light_data.angle = math.radians(0.45)

# Soft contact lift for shaded street faces without flattening the sun shadows.
fill_data = bpy.data.lights.new('Sky Fill', type='AREA')
fill = bpy.data.objects.new('Sky Fill', fill_data)
scene.collection.objects.link(fill)
fill.location = (0.0, 120.0, 0.0)
fill.rotation_euler = (0.0, 0.0, 0.0)
fill_data.energy = 450.0
fill_data.shape = 'DISK'
fill_data.size = 500.0

# Frame the imported center tile using the same normalized-space perspective as the page.
model_objects = [o for o in scene.objects if o.type == 'MESH']
box_min = Vector((1e30, 1e30, 1e30))
box_max = Vector((-1e30, -1e30, -1e30))
for obj in model_objects:
    corners = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
    for p in corners:
        box_min.x = min(box_min.x, p.x); box_min.y = min(box_min.y, p.y); box_min.z = min(box_min.z, p.z)
        box_max.x = max(box_max.x, p.x); box_max.y = max(box_max.y, p.y); box_max.z = max(box_max.z, p.z)
center = (box_min + box_max) * 0.5
size = box_max - box_min
radius = max(size.length * 0.52, 8.0)
cam_data = bpy.data.cameras.new('Reference Camera')
cam = bpy.data.objects.new('Reference Camera', cam_data)
scene.collection.objects.link(cam)
cam.location = center + Vector((radius * 0.92, radius * 0.68, radius * 0.90))
cam_data.lens = 46.0
cam_data.sensor_width = 36.0

def look_at(obj, target):
    obj.rotation_euler = (target - obj.location).to_track_quat('-Z', 'Y').to_euler()
look_at(cam, center)
scene.camera = cam

# Conservative shadow settings for the reference.
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = 0.0
scene.render.resolution_percentage = 100

for obj in model_objects:
    obj.select_set(False)
    obj.hide_render = False
    obj.visible_shadow = True

bpy.ops.wm.save_as_mainfile(filepath=str(OUT.with_suffix('.blend')))
bpy.ops.render.render(write_still=True)
print('REFERENCE_RENDER', OUT)
print('BOUNDS', list(box_min), list(box_max), 'CENTER', list(center), 'RADIUS', radius)
