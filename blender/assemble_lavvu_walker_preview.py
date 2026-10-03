"""Assemble walker review frames into an animated WebP."""

from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
frames_dir = root / "blender" / ".walker_frames"
output = root / "assets" / "concepts" / "poi-t1-01-lavvu-walker-motion-v1.webp"
paths = sorted(frames_dir.glob("frame_*.png"))
if not paths:
    raise SystemExit("No walker frames found")
frames = [Image.open(path).convert("RGB") for path in paths]
frames[0].save(
    output, save_all=True, append_images=frames[1:], duration=83,
    loop=0, quality=88, method=6,
)
print(output)
