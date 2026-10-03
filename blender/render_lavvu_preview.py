"""Render lightweight PNG frames for the animated WebP review."""

from pathlib import Path
import bpy

root = Path(bpy.data.filepath).resolve().parents[1]
output = root / "blender" / ".preview_frames"
output.mkdir(parents=True, exist_ok=True)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 512
scene.render.resolution_y = 512
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.frame_start = 1
scene.frame_end = 96
for frame in range(1, 97, 2):
    scene.frame_set(frame)
    scene.render.filepath = str(output / f"frame_{frame:03d}.png")
    bpy.ops.render.render(write_still=True)
print(f"PREVIEW_FRAMES={output}")
