import bpy
import sys
from mathutils import Vector

MODEL = sys.argv[-2]
OUT_DIR = sys.argv[-1]

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=MODEL)

# Keep the character mesh and remove imported helper geometry from the presentation.
for obj in list(bpy.context.scene.objects):
    if obj.type == 'MESH' and obj.name != 'output_unwrapped':
        bpy.data.objects.remove(obj, do_unlink=True)

character = bpy.data.objects.get('output_unwrapped')
if character is None:
    raise RuntimeError('Expected imported character mesh output_unwrapped')

# Neutral studio floor/background.
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0.8, 0))
floor = bpy.context.object
floor.name = 'StudioFloor'
mat_floor = bpy.data.materials.new('StudioFloorMaterial')
mat_floor.diffuse_color = (0.035, 0.045, 0.06, 1.0)
mat_floor.roughness = 0.65
floor.data.materials.append(mat_floor)

world = bpy.context.scene.world or bpy.data.worlds.new('World')
bpy.context.scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.012, 0.018, 0.028, 1.0)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.18

def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()

def add_area(name, location, energy, size, color):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    look_at(obj, (0, 0, 0.82))
    return obj

add_area('Key', (2.6, -3.2, 3.2), 950, 3.2, (1.0, 0.84, 0.68))
add_area('Fill', (-2.4, -2.3, 1.7), 650, 3.0, (0.56, 0.72, 1.0))
add_area('Rim', (0.0, 1.8, 2.8), 1200, 2.2, (0.52, 0.68, 1.0))
add_area('Top', (0.0, -0.4, 4.4), 700, 2.0, (1.0, 0.92, 0.8))

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 800
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.film_transparent = False
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.look = 'AgX - Medium High Contrast'

# Use an orthographic camera for a clean character-sheet-like frontal presentation.
corners = [character.matrix_world @ Vector(c) for c in character.bound_box]
bmin = Vector((min(v[i] for v in corners) for i in range(3)))
bmax = Vector((max(v[i] for v in corners) for i in range(3)))
center = (bmin + bmax) * 0.5
height = max(bmax.z - bmin.z, 0.1)

cam_data = bpy.data.cameras.new('FrontCamera')
cam = bpy.data.objects.new('FrontCamera', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam_data.type = 'ORTHO'
cam_data.ortho_scale = height * 1.22
cam.location = (0, -5.0, center.z + height * 0.02)
look_at(cam, (center.x, 0, center.z + height * 0.02))

# Slightly lift the floor for a grounded contact shadow without cutting off the model.
floor.location.z = bmin.z - 0.008

for direction, y in [('front', -5.0), ('back', 5.0)]:
    cam.location = (0, y, center.z + height * 0.02)
    look_at(cam, (center.x, 0, center.z + height * 0.02))
    scene.render.filepath = f'{OUT_DIR}/master-{direction}-front.png'
    bpy.ops.render.render(write_still=True)

