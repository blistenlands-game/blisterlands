"""Build the Lavvu waterfall POI as a production 2.5D Blender scene.

The approved illustration remains the art-direction source. Depth and motion are
added as camera-facing layers so the fixed game camera keeps the exact composition.
"""

import random
from pathlib import Path

import bpy

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "concepts" / "poi-t1-01-lavvu-diorama-styleframe-v1.png"
BLEND_PATH = ROOT / "blender" / "lavvu_diorama.blend"
PREVIEW_PATH = ROOT / "assets" / "concepts" / "poi-t1-01-lavvu-blender-preview-v1.png"
GLB_PATH = ROOT / "assets" / "models" / "poi-t1-01-lavvu-diorama-v1.glb"

random.seed(14061976)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def image_material():
    mat = bpy.data.materials.new("Approved Lavvu artwork")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    for node in list(nodes):
        nodes.remove(node)
    out = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(str(SOURCE), check_existing=True)
    shader.inputs["Roughness"].default_value = 1.0
    shader.inputs["Specular IOR Level"].default_value = 0.0
    # Full emission preserves the approved colour grade without requiring scene
    # lights; foreground effect layers remain independently controllable.
    shader.inputs["Emission Strength"].default_value = 1.0
    links.new(tex.outputs["Color"], shader.inputs["Base Color"])
    links.new(tex.outputs["Color"], shader.inputs["Emission Color"])
    links.new(shader.outputs["BSDF"], out.inputs["Surface"])
    return mat


def transparent_material(name, color, alpha, emission=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = .32
    bsdf.inputs["Alpha"].default_value = alpha
    if "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = (*color, 1)
        bsdf.inputs["Emission Strength"].default_value = emission
    mat.surface_render_method = 'DITHERED'
    return mat


MAT_GLINT = transparent_material("Cold water glints", (.72, .94, 1.0), .52, .28)
MAT_MIST = transparent_material("Waterfall mist", (.80, .92, .94), .14, .06)
MAT_DUST = transparent_material("Warm pollen", (1.0, .69, .24), .62, .75)


def add_plane(name, location, scale, mat):
    bpy.ops.mesh.primitive_plane_add(size=2, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    return obj


def add_glint(name, x, y, width, angle, phase):
    obj = add_plane(name, (x, y, .06), (width, .013, 1), MAT_GLINT)
    obj.rotation_euler.z = angle
    start = 1 + phase
    obj.scale.x *= .65
    obj.keyframe_insert(data_path="scale", frame=start)
    obj.location.x += .10
    obj.scale.x /= .65
    obj.keyframe_insert(data_path="location", frame=start + 18)
    obj.keyframe_insert(data_path="scale", frame=start + 18)
    obj.location.x -= .10
    obj.scale.x *= .65
    obj.keyframe_insert(data_path="location", frame=start + 38)
    obj.keyframe_insert(data_path="scale", frame=start + 38)


def add_mist(name, x, y, sx, sy, phase):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1, location=(x, y, .09))
    obj = bpy.context.object
    obj.name = name
    obj.scale = (sx, sy, .018)
    obj.data.materials.append(MAT_MIST)
    f0 = 1 + phase
    obj.keyframe_insert(data_path="location", frame=f0)
    obj.keyframe_insert(data_path="scale", frame=f0)
    obj.location.y += .18
    obj.location.x += .08
    obj.scale = (sx * 1.22, sy * 1.12, .018)
    obj.keyframe_insert(data_path="location", frame=f0 + 44)
    obj.keyframe_insert(data_path="scale", frame=f0 + 44)
    obj.location.y -= .18
    obj.location.x -= .08
    obj.scale = (sx, sy, .018)
    obj.keyframe_insert(data_path="location", frame=f0 + 88)
    obj.keyframe_insert(data_path="scale", frame=f0 + 88)


def add_pollen(name, x, y, phase):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=.018, location=(x, y, .12))
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(MAT_DUST)
    f0 = 1 + phase
    obj.keyframe_insert(data_path="location", frame=f0)
    obj.location.x += random.uniform(.12, .28)
    obj.location.y += random.uniform(.18, .42)
    obj.keyframe_insert(data_path="location", frame=f0 + 64)


def build_layers():
    add_plane("Approved illustration backplate", (0, 0, 0), (5, 5, 1), image_material())
    waterfall_glints = [
        (-1.34, 1.68, .30, -.18), (-1.18, 1.36, .34, -.20),
        (-.98, 1.02, .39, -.22), (-.78, .67, .31, -.25),
        (-.56, .38, .26, -.18),
    ]
    lake_glints = [
        (-.15, .12, .36, .02), (.50, .00, .48, .01), (1.28, -.12, .54, -.02),
        (2.05, -.32, .44, -.03), (2.62, -.55, .34, -.06), (.22, -.55, .30, .03),
        (1.02, -.74, .42, .00), (1.88, -.93, .38, -.02),
    ]
    for i, (x, y, w, a) in enumerate(waterfall_glints + lake_glints):
        add_glint(f"Animated water glint {i:02d}", x, y, w, a, (i * 7) % 42)
    for i, args in enumerate([
        (-.91, .72, .32, .075, 0), (-.57, .34, .42, .09, 15),
        (-.18, .05, .50, .11, 30), (.58, -.08, .55, .10, 48),
    ]):
        add_mist(f"Animated cascade mist {i:02d}", *args)
    for i in range(22):
        add_pollen(
            f"Animated pollen {i:02d}",
            random.uniform(-3.8, 3.9),
            random.uniform(-2.7, 2.7),
            random.randint(0, 42),
        )


def setup_camera_and_render():
    bpy.ops.object.camera_add(location=(0, 0, 10))
    camera = bpy.context.object
    camera.name = "Fixed POI camera"
    camera.data.type = 'ORTHO'
    camera.data.ortho_scale = 10.18
    camera.rotation_euler = (0, 0, 0)
    bpy.context.scene.camera = camera
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 1024
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.filepath = str(PREVIEW_PATH)
    scene.render.film_transparent = False
    scene.view_settings.look = 'AgX - Medium High Contrast'
    scene.frame_start = 1
    scene.frame_end = 96
    scene.frame_set(28)
    world = scene.world or bpy.data.worlds.new("Diorama surround")
    scene.world = world
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (.013, .028, .032, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = .18


def export_scene():
    BLEND_PATH.parent.mkdir(parents=True, exist_ok=True)
    PREVIEW_PATH.parent.mkdir(parents=True, exist_ok=True)
    GLB_PATH.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    bpy.ops.export_scene.gltf(
        filepath=str(GLB_PATH), export_format='GLB', use_selection=False,
        export_apply=True, export_materials='EXPORT', export_animations=True,
    )
    bpy.context.scene.render.filepath = str(PREVIEW_PATH)
    bpy.ops.render.render(write_still=True)


clear_scene()
build_layers()
setup_camera_and_render()
export_scene()
print(f"BLEND={BLEND_PATH}")
print(f"GLB={GLB_PATH}")
print(f"PREVIEW={PREVIEW_PATH}")
