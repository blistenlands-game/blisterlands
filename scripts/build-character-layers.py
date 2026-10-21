from collections import deque
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageOps

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
    "pants": "wear-pants-master-v2.png",
    "gaiters": "wear-gaiters-v1.png",
    "poles": "wear-poles-v1.png",
}
BRAND_SHEETS = {
    "pack-classic": "wear-pack-classic-brands-v1.png",
    "pack-ul": "wear-pack-ul-brands-v1.png",
    "shoe-trail": "wear-shoe-trail-brands-v1.png",
    "shoe-low": "wear-shoe-low-brands-v1.png",
    "shoe-boot": "wear-shoe-boot-brands-v1.png",
    "shell": "wear-shell-brands-v1.png",
    "pile": "wear-pile-brands-v1.png",
    "pants": "wear-pants-brands-v1.png",
    "gaiters": "wear-gaiters-brands-v1.png",
    "poles": "wear-poles-brands-v1.png",
}
GEAR_NAMES = {
    "pack-classic": "zainoClassico", "pack-ul": "zainoUL",
    "shoe-trail": "trail", "shoe-low": "basse", "shoe-boot": "scarponi",
    "shell": "guscio", "pile": "pile", "pants": "pantaloni", "gaiters": "ghette",
    "poles": "bastoncini",
}
CATALOG_BASES = [
    "zainoClassico", "zainoUL", "saccoPiuma", "saccoSint", "quiltPiuma", "quiltSint",
    "matGonfiabile", "matSchiuma", "trail", "scarponi", "basse", "guscio", "pile",
    "pantaloni", "ghette", "bastoncini", "sandali", "rete", "cappello", "cappelloLana",
    "guanti", "filtro", "mappa", "orologio", "faro", "kit", "fornello", "tenda", "carte",
]
BRAND_PALETTES = {
    "A": ((38, 44, 29), (132, 143, 83), (154, 111, 61, 210)),
    "S": ((24, 35, 53), (65, 103, 145), (190, 66, 48, 220)),
    "Sh": ((48, 44, 42), (224, 123, 36), (34, 34, 36, 220)),
    "D": ((78, 48, 35), (219, 202, 157), (177, 68, 43, 220)),
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
        if kind == "shell":
            # Il cappuccio abbassato resta dietro al collo: il guscio deve
            # partire piu in alto del pile, senza scivolare sul bacino.
            box = (max(0, torso[0] - 8), 168, min(cell_width, torso[2] + 8), 513)
        elif kind == "pile":
            box = (max(0, torso[0] - 4), 205, min(cell_width, torso[2] + 4), 505)
        elif kind.startswith("pack-"):
            # Sul fronte si vedono solo gli spallacci: devono seguire il torace,
            # non coprire maniche e guanti come una seconda giacca.
            box = (max(0, torso[0] + 58), 205, min(cell_width, torso[2] - 58), 478)
        elif kind.startswith("shoe-"):
            box = (max(0, feet[0] - 8), 580, min(cell_width, feet[2] + 8), 710)
        elif kind == "pants":
            center = cell_width // 2
            box = (center - 108, 342, center + 108, 642)
        elif kind == "gaiters":
            center = cell_width // 2
            box = (center - 110, 482, center + 110, 618)
        elif kind == "gloves":
            center = cell_width // 2
            box = (center - 210, 335, center + 210, 485)
        elif kind == "hat-sun":
            box = (max(0, head[0] - 18), max(0, head[1] - 28), min(cell_width, head[2] + 18), min(170, head[1] + 130))
        elif kind == "hat-wool":
            box = (max(0, head[0] - 5), max(0, head[1] - 8), min(cell_width, head[2] + 5), min(185, head[1] + 150))
        elif kind == "head-net":
            box = (max(0, head[0] - 8), max(0, head[1] - 8), min(cell_width, head[2] + 8), 315)
        else:  # poles
            center = cell_width // 2
            box = (center - 185, 315, center + 185, 676)
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


def fit_gloves(image: Image.Image) -> Image.Image:
    """Register each glove independently on the two hands."""
    sheet = Image.new("RGBA", SIZE)
    cell_width = SIZE[0] // 4
    for index in range(4):
        cell = image.crop((index * cell_width, 0, (index + 1) * cell_width, SIZE[1]))
        for side, offset in ((0, -154), (1, 154)):
            half = cell.crop((side * cell_width // 2, 0, (side + 1) * cell_width // 2, SIZE[1]))
            source = visible_bbox(half)
            if not source:
                continue
            content = half.crop(source)
            content.thumbnail((94, 126), Image.Resampling.LANCZOS)
            center = index * cell_width + cell_width // 2 + offset
            sheet.alpha_composite(content, (center - content.width // 2, 396))
    return sheet


def fit_pair(image: Image.Image, top: int, bottom: int, offset: int, max_width: int) -> Image.Image:
    """Fit left/right pieces independently, preserving their proportions."""
    sheet = Image.new("RGBA", SIZE)
    cell_width = SIZE[0] // 4
    for index in range(4):
        cell = image.crop((index * cell_width, 0, (index + 1) * cell_width, SIZE[1]))
        for side, direction in ((0, -1), (1, 1)):
            half = cell.crop((side * cell_width // 2, 0, (side + 1) * cell_width // 2, SIZE[1]))
            source = visible_bbox(half)
            if not source:
                continue
            content = half.crop(source)
            content.thumbnail((max_width, bottom - top), Image.Resampling.LANCZOS)
            center = index * cell_width + cell_width // 2 + direction * offset
            sheet.alpha_composite(content, (center - content.width // 2, top))
    return sheet


def keep_largest_components(image: Image.Image, limit: int = 2) -> Image.Image:
    """Remove neighboring-cell fragments while preserving paired equipment."""
    alpha = image.getchannel("A")
    binary = alpha.point(lambda value: 255 if value >= 32 else 0)
    pixels = binary.load()
    width, height = binary.size
    seen = bytearray(width * height)
    components = []
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if seen[index] or not pixels[x, y]:
                continue
            seen[index] = 1
            queue = deque([(x, y)])
            points = []
            while queue:
                px, py = queue.popleft()
                points.append((px, py))
                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        neighbor = ny * width + nx
                        if not seen[neighbor] and pixels[nx, ny]:
                            seen[neighbor] = 1
                            queue.append((nx, ny))
            components.append(points)
    keep = sorted(components, key=len, reverse=True)[:limit]
    mask = Image.new("L", image.size)
    draw = ImageDraw.Draw(mask)
    for points in keep:
        draw.point(points, fill=255)
    result = image.copy()
    result.putalpha(ImageChops.multiply(alpha, mask))
    return result


def fit_brand_cell(image: Image.Image, brand_index: int, boxes, parts: int = 1) -> Image.Image:
    """Reuse one brand design across the four registered character cells."""
    sheet = Image.new("RGBA", SIZE)
    cell_width = SIZE[0] // 4
    cell = keep_largest_components(image.crop((brand_index * cell_width, 0, (brand_index + 1) * cell_width, SIZE[1])), parts)
    source = visible_bbox(cell)
    if not source:
        return sheet
    content = cell.crop(source)
    for index, target in enumerate(boxes):
        fitted = content.resize((target[2] - target[0], target[3] - target[1]), Image.Resampling.LANCZOS)
        sheet.alpha_composite(fitted, (index * cell_width + target[0], target[1]))
    return sheet


def tint(image: Image.Image, brand: str) -> Image.Image:
    dark, pale, _ = BRAND_PALETTES[brand]
    gray = ImageOps.grayscale(image)
    colored = ImageOps.colorize(gray, black=dark, white=pale).convert("RGBA")
    colored.putalpha(image.getchannel("A"))
    return colored


def brandize_catalog_icon(image: Image.Image, brand: str) -> Image.Image:
    """Color the complete original product art without adding arbitrary marks."""
    image = image.convert("RGBA")
    box = visible_bbox(image)
    image = image.crop(box) if box else image
    image.thumbnail((158, 158), Image.Resampling.LANCZOS)
    dark, light, _ = BRAND_PALETTES[brand]
    gray = ImageOps.grayscale(image)
    colored = ImageOps.colorize(gray, black=dark, white=light).convert("RGBA")
    colored.putalpha(image.getchannel("A"))
    icon = Image.new("RGBA", (192, 192))
    icon.alpha_composite(colored, ((192 - colored.width) // 2, (192 - colored.height) // 2))
    return icon


def catalog_from_brand_sheet(image: Image.Image, brand_index: int, parts: int = 1) -> Image.Image:
    """Make a padded shop icon from the complete product illustration."""
    cell_width = SIZE[0] // 4
    cell = image.crop((brand_index * cell_width, 0, (brand_index + 1) * cell_width, SIZE[1]))
    cell = keep_largest_components(cell, parts)
    box = visible_bbox(cell)
    if not box:
        return Image.new("RGBA", (192, 192))
    content = cell.crop(box)
    content.thumbnail((158, 158), Image.Resampling.LANCZOS)
    icon = Image.new("RGBA", (192, 192))
    icon.alpha_composite(content, ((192 - content.width) // 2, (192 - content.height) // 2))
    return icon


def clear_outerwear_face(image: Image.Image) -> Image.Image:
    """Punch a real alpha window through collars and the folded hood."""
    result = image.copy()
    mask = result.getchannel("A")
    draw = ImageDraw.Draw(mask)
    cell_width = SIZE[0] // 4
    for index in range(4):
        center = index * cell_width + cell_width // 2
        draw.ellipse((center - 76, 142, center + 76, 226), fill=0)
    result.putalpha(mask)
    return result


def save_gear_icon(image: Image.Image, name: str):
    cell_width = SIZE[0] // 4
    cell = image.crop((0, 0, cell_width, SIZE[1]))
    source = visible_bbox(cell)
    if not source:
        return
    content = cell.crop(source)
    content.thumbnail((176, 176), Image.Resampling.LANCZOS)
    icon = Image.new("RGBA", (192, 192))
    icon.alpha_composite(content, ((192 - content.width) // 2, (192 - content.height) // 2))
    folder = ROOT / "assets" / "sprites" / "gear"
    folder.mkdir(parents=True, exist_ok=True)
    icon.save(folder / f"{name}.png", optimize=True)


base = center_base(normalized(ART / "character-front-swimsuit-v3.png"))
base.save(ART / "character-front-swimsuit-v3.png", optimize=True)

gear_folder = ROOT / "assets" / "sprites" / "gear"
for gear_name in CATALOG_BASES:
    source = Image.open(gear_folder / f"{gear_name}.png").convert("RGBA")
    for brand in BRANDS:
        brandize_catalog_icon(source, brand).save(gear_folder / f"{gear_name}-{brand}.png", optimize=True)

# When a complete brand illustration exists, use it in the shop rather than a
# clipped generic thumbnail. Packs and shoes retain their dedicated shop view.
for kind in ("shell", "pile", "pants", "gaiters", "poles"):
    sheet = normalized(ART / BRAND_SHEETS[kind])
    gear_name = GEAR_NAMES[kind]
    for brand_index, brand in enumerate(BRANDS):
        parts = 2 if kind in {"gaiters", "poles"} else 1
        catalog_from_brand_sheet(sheet, brand_index, parts).save(
            gear_folder / f"{gear_name}-{brand}.png", optimize=True
        )

for kind, filename in MASTERS.items():
    boxes = targets(base, kind)
    master = fit_cells(normalized(ART / filename), boxes)
    brand_sheet = normalized(ART / BRAND_SHEETS[kind]) if kind in BRAND_SHEETS else None
    for brand_index, (brand, color) in enumerate(BRANDS.items()):
        if brand_sheet:
            parts = 2 if kind.startswith("shoe-") or kind in {"gaiters", "poles"} else 1
            if kind in {"gaiters", "poles"}:
                if kind == "gaiters":
                    paired = fit_pair(brand_sheet, 482, 618, 72, 78)
                else:
                    paired = fit_pair(brand_sheet, 382, 698, 154, 68)
                rendered = Image.new("RGBA", SIZE)
                source_cell = paired.crop((brand_index * SIZE[0] // 4, 0, (brand_index + 1) * SIZE[0] // 4, SIZE[1]))
                for character in range(4):
                    rendered.alpha_composite(source_cell, (character * SIZE[0] // 4, 0))
            else:
                rendered = fit_brand_cell(brand_sheet, brand_index, boxes, parts)
        else:
            rendered = tint(master, brand)
        if kind in {"shell", "pile"}:
            rendered = clear_outerwear_face(rendered)
        rendered.save(ART / f"wear-{kind}-{brand}-v2.png", optimize=True)
    if kind == "pants":
        save_gear_icon(master, "pantaloni")

for source, target in {
    "wear-gloves-v1.png": "wear-gloves-v2.png",
    "wear-hat-sun-v1.png": "wear-hat-sun-v2.png",
    "wear-hat-wool-master-v3.png": "wear-hat-wool-v2.png",
    "wear-head-net-v1.png": "wear-head-net-v2.png",
}.items():
    kind = target.removeprefix("wear-").removesuffix("-v2.png")
    source_image = normalized(ART / source)
    aligned = fit_gloves(source_image) if kind == "gloves" else fit_cells(source_image, targets(base, kind))
    aligned.save(ART / target, optimize=True)
    for brand in BRANDS:
        tint(aligned, brand).save(ART / f"wear-{kind}-{brand}-v2.png", optimize=True)

print(f"Paper-doll: {(len(MASTERS) + 4) * len(BRANDS)} livelli di marchio esportati a {SIZE[0]}x{SIZE[1]}")
