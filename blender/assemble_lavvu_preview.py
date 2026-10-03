"""Assemble Blender review frames into a compact animated WebP."""

from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
frames_dir = root / "blender" / ".preview_frames"
output = root / "assets" / "concepts" / "poi-t1-01-lavvu-motion-preview-v1.webp"
paths = sorted(frames_dir.glob("frame_*.png"))
if not paths:
    raise SystemExit("No rendered preview frames found")
frames = [Image.open(path).convert("RGB") for path in paths]
frames[0].save(
    output,
    save_all=True,
    append_images=frames[1:],
    duration=83,
    loop=0,
    quality=86,
    method=6,
)
print(output)
