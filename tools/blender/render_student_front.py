import bpy
import sys
from mathutils import Vector

MODEL = sys.argv[-2]
OUT = sys.argv[-1]

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=MODEL)

character = next((o for o in bpy.context.scene.objects if o.type == 'MESH' and len(o.data.vertices) > 1000), None)
if character is None:
    raise RuntimeError('No character mesh found')

for obj in list(bpy.context.scene.objects):
    if obj != character:
        bpy.data.objects.remove(obj, do_unlink=True)

# Use a dark neutral studio floor only for contact shadow; it stays outside the main silhouette.
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0.8, 0))
floor = bpy.context.object
floor.name = 'StudioFloor'
mat_floor = bpy.data.materials.new('StudioFloorMaterial')
mat_floor.diffuse_color = (0.018, 0.022, 0.03, 1.0)
mat_floor.roughness = 0.82
floor.data.materials.append(mat_floor)

world = bpy.data.worlds.new('StudentStudioWorld')
bpy.context.scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.006, 0.009, 0.014, 1.0)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.06

def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()

def area(name, location, energy, size, color):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    look_at(obj, (0.0, 0.0, 0.82))

# Subdued studio lighting to keep the character readable without the clipped whites from the first pass.
area('Key', (2.8, -3.4, 3.0), 260, 3.0, (1.0, 0.88, 0.75))
area('Fill', (-2.8, -2.6, 1.8), 150, 3.2, (0.65, 0.78, 1.0))
area('Rim', (0.0, 2.2, 2.6), 320, 2.4, (0.55, 0.70, 1.0))

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 800
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.film_transparent = False
scene.view_settings.look = 'AgX - Medium Low Contrast'
scene.view_settings.exposure = -0.45
scene.view_settings.gamma = 1.0

corners = [character.matrix_world @ Vector(c) for c in character.bound_box]
bmin = Vector((min(v[i] for v in corners) for i in range(3)))
bmax = Vector((max(v[i] for v in corners) for i in range(3)))
center = (bmin + bmax) * 0.5
height = max(bmax.z - bmin.z, 0.1)

cam_data = bpy.data.cameras.new('StudentFrontCamera')
cam = bpy.data.objects.new('StudentFrontCamera', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
cam_data.type = 'ORTHO'
cam_data.ortho_scale = height * 1.18
cam.location = (0.0, -5.0, center.z)
look_at(cam, (center.x, 0.0, center.z))
floor.location.z = bmin.z - 0.01

scene.render.filepath = OUT
bpy.ops.render.render(write_still=True)

