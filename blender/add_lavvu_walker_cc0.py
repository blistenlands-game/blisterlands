"""Place a professional CC0 humanoid walk cycle on the Lavvu trail."""

import math
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "vendor" / "quaternius-universal-animation-library" / "AnimationLibrary_Godot_Standard.glb"
BLEND_PATH = ROOT / "blender" / "lavvu_walker.blend"
GLB_PATH = ROOT / "assets" / "models" / "poi-t1-01-lavvu-walker-v1.glb"
PREVIEW_PATH = ROOT / "assets" / "concepts" / "poi-t1-01-lavvu-walker-preview-v1.png"


def material(name, color, roughness=.78):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = (*color, 1)
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


MAT_SKIN = material("Hiker skin", (.58, .31, .17))
MAT_JACKET = material("Hiker moss jacket", (.24, .36, .19))
MAT_TROUSERS = material("Hiker charcoal trousers", (.075, .085, .09))
MAT_BOOTS = material("Hiker leather boots", (.23, .105, .045))
MAT_PACK = material("Hiker orange backpack", (.72, .20, .045))
MAT_PACK_DARK = material("Hiker pack straps", (.075, .06, .045))
MAT_BEANIE = material("Hiker wool hat", (.20, .29, .17))


def add_ico(name, parent, location, scale, mat, subdivision=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivision, radius=1)
    obj = bpy.context.object
    obj.name = name
    obj.parent = parent
    obj.location = location
    obj.scale = scale
    obj.data.materials.append(mat)
    return obj


def add_cube(name, parent, location, scale, mat, bevel=.06):
    bpy.ops.mesh.primitive_cube_add(size=2)
    obj = bpy.context.object
    obj.name = name
    obj.parent = parent
    obj.location = location
    obj.scale = scale
    obj.data.materials.append(mat)
    mod = obj.modifiers.new("Rounded accessory", "BEVEL")
    mod.width = bevel
    mod.segments = 2
    return obj


def add_roll(name, parent, location, scale, mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=1, depth=2)
    obj = bpy.context.object
    obj.name = name
    obj.parent = parent
    obj.location = location
    obj.scale = scale
    obj.rotation_euler.y = math.radians(90)
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("Rounded roll", "BEVEL")
    bevel.width = .05
    bevel.segments = 2
    return obj


def bezier(a, b, c, d, t):
    u = 1 - t
    return a * u**3 + b * 3*u*u*t + c * 3*u*t*t + d * t**3


def recolor_character(mesh):
    mesh.data.materials.clear()
    for mat in (MAT_SKIN, MAT_JACKET, MAT_TROUSERS, MAT_BOOTS):
        mesh.data.materials.append(mat)
    verts = mesh.data.vertices
    for poly in mesh.data.polygons:
        z = sum(verts[i].co.z for i in poly.vertices) / len(poly.vertices)
        if z > 1.50:
            poly.material_index = 0
        elif z < .22:
            poly.material_index = 3
        elif z < .86:
            poly.material_index = 2
        else:
            poly.material_index = 1


def install_walk_cycle(rig, walk_action):
    rig.animation_data_create()
    rig.animation_data.action = None
    for track in list(rig.animation_data.nla_tracks):
        rig.animation_data.nla_tracks.remove(track)
    track = rig.animation_data.nla_tracks.new()
    track.name = "Natural walk loop"
    strip = track.strips.new("Walk_Loop", 1, walk_action)
    length = max(1.0, walk_action.frame_range[1] - walk_action.frame_range[0])
    strip.action_frame_start = walk_action.frame_range[0]
    strip.action_frame_end = walk_action.frame_range[1]
    strip.repeat = 96.0 / length
    strip.frame_end = 97


def animate_path(root):
    start = Vector((-.30, -3.82, .30))
    control_a = Vector((-.58, -2.55, .30))
    control_b = Vector((-3.52, -.45, .30))
    end = Vector((-3.24, 1.80, .30))
    for frame in range(1, 97, 3):
        t = (frame - 1) / 95.0
        root.location = bezier(start, control_a, control_b, end, t)
        s = .82 - .30*t
        root.scale = (s, s, s)
        root.keyframe_insert("location", frame=frame)
        root.keyframe_insert("scale", frame=frame)


before_objects = set(bpy.data.objects)
before_actions = set(bpy.data.actions)
bpy.ops.import_scene.gltf(filepath=str(SOURCE))
new_objects = [obj for obj in bpy.data.objects if obj not in before_objects]
new_actions = [action for action in bpy.data.actions if action not in before_actions]
rig = next(obj for obj in new_objects if obj.type == 'ARMATURE')
mesh = next(obj for obj in new_objects if obj.type == 'MESH' and obj.name.startswith("Mannequin"))
for obj in list(new_objects):
    if obj not in (rig, mesh) and obj.type in {'CAMERA', 'LIGHT'}:
        bpy.data.objects.remove(obj, do_unlink=True)

walk = next(action for action in new_actions if action.name == "Walk_Loop")
for action in list(new_actions):
    if action != walk:
        bpy.data.actions.remove(action)

root = bpy.data.objects.new("Professional hiker path root", None)
bpy.context.collection.objects.link(root)
orientation = bpy.data.objects.new("Hiker model orientation", None)
bpy.context.collection.objects.link(orientation)
orientation.parent = root
orientation.rotation_euler = (math.radians(90), 0, math.radians(180))
rig.parent = orientation
recolor_character(mesh)
install_walk_cycle(rig, walk)
animate_path(root)

# Hiking equipment is real geometry attached to the moving character root.
pack = add_ico("Hiking backpack", root, (0, 1.12, .34), (.31, .40, .20), MAT_PACK)
add_roll("Sleeping mat", root, (0, 1.50, .35), (.30, .10, .10), MAT_PACK_DARK)
add_cube("Left backpack strap", root, (-.20, 1.14, .53), (.026, .29, .018), MAT_PACK_DARK, .02)
add_cube("Right backpack strap", root, (.20, 1.14, .53), (.026, .29, .018), MAT_PACK_DARK, .02)
add_ico("Wool beanie", root, (0, 1.80, .04), (.23, .15, .22), MAT_BEANIE)
add_ico("Beanie pompom", root, (0, 1.98, .04), (.07, .07, .07), MAT_BEANIE, 1)

bpy.ops.object.light_add(type='AREA', location=(-4, -3, 7))
key = bpy.context.object
key.name = "Hiker warm key"
key.data.energy = 760
key.data.color = (1.0, .72, .44)
key.data.shape = 'DISK'
key.data.size = 4.0
bpy.ops.object.light_add(type='AREA', location=(4, 2, 6))
fill = bpy.context.object
fill.name = "Hiker cool fill"
fill.data.energy = 390
fill.data.color = (.40, .63, .90)
fill.data.size = 5.0

bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = 96
bpy.context.scene.frame_set(49)
bpy.context.scene.render.filepath = str(PREVIEW_PATH)
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
bpy.ops.export_scene.gltf(
    filepath=str(GLB_PATH), export_format='GLB', use_selection=False,
    export_apply=True, export_materials='EXPORT', export_animations=True,
)
bpy.ops.render.render(write_still=True)
print(f"BLEND={BLEND_PATH}")
print(f"GLB={GLB_PATH}")
print(f"PREVIEW={PREVIEW_PATH}")
