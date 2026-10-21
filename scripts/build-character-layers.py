from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "assets" / "art"
SIZE = (2172, 724)
BRANDS = {
    "A": "#4F6B4A",
    "S": "#2F6DB5",
    "Sh": "#E07B24",
    "D": "#CDB892",
}
MASTERS = {
    "pack-classic": "wear-pack-classic-master-v3.png",
    "pack-ul": "wear-pack-ul-master-v2.png",
    "shoe-trail": "wear-shoe-trail-master-v2.png",
    "shoe-low": "wear-shoe-low-master-v2.png",
    "shoe-boot": "wear-shoe-boot-master-v2.png",
    "shell": "wear-shell-master-v2.png",
    "pile": "wear-pile-master-v2.png",
    "gaiters": "wear-gaiters-v1.png",
    "poles": "wear-poles-v1.png",
}


def normalized(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    if image.size != SIZE:
        image = image.resize(SIZE, Image.Resampling.LANCZOS)
    return image


def visible_bbox(image: Image.Image):
    """Ignore near-transparent fringe pixels when deriving anatomical anchors."""
    alpha = image.getchannel("A")
    visible = alpha.point(lambda value: 255 if value >= 96 else 0)
    return visible.getbbox()


def center_base(image: Image.Image) -> Image.Image:
    sheet = Image.new("RGBA", SIZE)
    cell_width = SIZE[0] // 4
    for index in range(4):
        cell = image.crop((index * cell_width, 0, (index + 1) * cell_width, SIZE[1]))
        box = visible_bbox(cell)
        if not box:
            continue
        shift_x = round(cell_width / 2 - (box[0] + box[2]) / 2)
        shift_y = 708 - box[3]
        sheet.alpha_composite(cell, (index * cell_width + shift_x, shift_y))
    return sheet


def region_box(cell: Image.Image, top: int, bottom: int):
    alpha = cell.getchannel("A").crop((0, top, cell.width, bottom))
    box = alpha.point(lambda value: 255 if value >= 96 else 0).getbbox()
    return (box[0], box[1] + top, box[2], box[3] + top)


def targets(base: Image.Image, kind: str):
    cell_width = SIZE[0] // 4
    result = []
    for index in range(4):
        cell = base.crop((index * cell_width, 0, (index + 1) * cell_width, SIZE[1]))
        head = region_box(cell, 0, 230)
        torso = region_box(cell, 180, 530)
        feet = region_box(cell, 590, 724)
        legs = region_box(cell, 455, 724)
        if kind in {"shell", "pile"}:
            box = (max(0, torso[0] - 8), 190, min(cell_width, torso[2] + 8), 535)
        elif kind.startswith("pack-"):
            box = (max(0, torso[0] + 22), 185, min(cell_width, torso[2] - 22), 520)
        elif kind.startswith("shoe-"):
            box = (max(0, feet[0] - 8), 580, min(cell_width, feet[2] + 8), 710)
        elif kind == "gaiters":
            box = (max(0, legs[0] - 5), 455, min(cell_width, legs[2] + 5), 700)
        elif kind == "gloves":
            box = (max(0, torso[0] - 6), 345, min(cell_width, torso[2] + 6), 525)
        elif kind == "hat-sun":
            box = (max(0, head[0] - 18), max(0, head[1] - 28), min(cell_width, head[2] + 18), min(170, head[1] + 130))
        elif kind == "hat-wool":
            box = (max(0, head[0] - 5), max(0, head[1] - 8), min(cell_width, head[2] + 5), min(185, head[1] + 150))
        elif kind == "head-net":
            box = (max(0, head[0] - 8), max(0, head[1] - 8), min(cell_width, head[2] + 8), 315)
        else:  # poles
            box = (max(0, torso[0] - 28), 245, min(cell_width, torso[2] + 28), 710)
        result.append(box)
    return result


def fit_cells(image: Image.Image, boxes) -> Image.Image:
    sheet = Image.new("RGBA", SIZE)
    cell_width = SIZE[0] // 4
    for index, target in enumerate(boxes):
        cell = image.crop((index * cell_width, 0, (index + 1) * cell_width, SIZE[1]))
        source = visible_bbox(cell)
        if not source:
            continue
        content = cell.crop(source).resize((target[2] - target[0], target[3] - target[1]), Image.Resampling.LANCZOS)
        sheet.alpha_composite(content, (index * cell_width + target[0], target[1]))
    return sheet


def tint(image: Image.Image, color: str) -> Image.Image:
    red, green, blue = tuple(bytes.fromhex(color.removeprefix("#")))
    pale = tuple(min(255, round(channel * 1.55 + 48)) for channel in (red, green, blue))
    gray = ImageOps.grayscale(image)
    colored = ImageOps.colorize(gray, black=(18, 17, 16), white=pale).convert("RGBA")
    colored.putalpha(image.getchannel("A"))
    return colored


base = center_base(normalized(ART / "character-front-swimsuit-v3.png"))
base.save(ART / "character-front-swimsuit-v3.png", optimize=True)

for kind, filename in MASTERS.items():
    master = fit_cells(normalized(ART / filename), targets(base, kind))
    for brand, color in BRANDS.items():
        tint(master, color).save(ART / f"wear-{kind}-{brand}-v2.png", optimize=True)

for source, target in {
    "wear-gloves-v1.png": "wear-gloves-v2.png",
    "wear-hat-sun-v1.png": "wear-hat-sun-v2.png",
    "wear-hat-wool-master-v3.png": "wear-hat-wool-v2.png",
    "wear-head-net-v1.png": "wear-head-net-v2.png",
}.items():
    kind = target.removeprefix("wear-").removesuffix("-v2.png")
    fit_cells(normalized(ART / source), targets(base, kind)).save(ART / target, optimize=True)

print(f"Paper-doll: {len(MASTERS) * len(BRANDS) + 4} livelli esportati a {SIZE[0]}x{SIZE[1]}")
