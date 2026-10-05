from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/concepts/ui-redesign/ui-v1-event-choice.png"
OUTPUT = ROOT / "assets/ui/corvo"
PAPER = ROOT / "assets/ui/event-panel-mockup-v1.png"


def extract_ink(source: Image.Image, box: tuple[int, int, int, int], name: str) -> None:
    crop = source.crop(box).convert("RGBA")
    pixels = crop.load()
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b, _ = pixels[x, y]
            darkest = min(r, g, b)
            spread = max(r, g, b) - darkest
            darkness = max(0, 152 - int((r + g + b) / 3))
            colored = max(0, spread - 24)
            alpha = min(255, max(darkness * 3, colored * 4))
            if alpha < 28:
                alpha = 0
            pixels[x, y] = (r, g, b, alpha)
    bounds = crop.getbbox()
    if bounds:
        crop = crop.crop(bounds)
    crop.save(OUTPUT / name)


def make_panel(source: Image.Image) -> None:
    box = (8, 875, 845, 1836)
    original = source.crop(box).convert("RGBA")
    gray = original.convert("L")
    threshold = gray.point(lambda value: 255 if value > 78 else 0)
    mask = Image.new("L", original.size, 0)
    mask_draw = ImageDraw.Draw(mask)
    for y in range(original.height):
        row = [x for x in range(original.width) if threshold.getpixel((x, y)) > 0]
        if row:
            mask_draw.line((min(row), y, max(row), y), fill=255)
    mask = mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(0.8))

    paper_source = Image.open(PAPER).convert("RGB")
    inset = (paper_source.width // 6, paper_source.height // 6, paper_source.width * 5 // 6, paper_source.height * 5 // 6)
    paper = paper_source.crop(inset).resize(original.size, Image.Resampling.LANCZOS)
    paper = ImageEnhance.Color(paper).enhance(0.55)
    tint = Image.new("RGB", original.size, "#ead9b7")
    paper = Image.blend(paper, tint, 0.44).convert("RGBA")

    eroded = mask.filter(ImageFilter.MinFilter(31))
    edge = ImageChops.subtract(mask, eroded).filter(ImageFilter.GaussianBlur(0.5))
    panel = Image.new("RGBA", original.size, (0, 0, 0, 0))
    panel.alpha_composite(paper)
    panel.putalpha(mask)
    panel = Image.composite(original, panel, edge)
    panel.putalpha(mask)
    panel.save(OUTPUT / "event-panel.png")


def make_choice_card() -> None:
    size = (820, 142)
    paper_source = Image.open(PAPER).convert("RGB")
    inset = (paper_source.width // 6, paper_source.height // 6, paper_source.width * 5 // 6, paper_source.height * 5 // 6)
    paper = paper_source.crop(inset).resize(size, Image.Resampling.LANCZOS)
    paper = ImageEnhance.Color(paper).enhance(0.48)
    paper = Image.blend(paper, Image.new("RGB", size, "#efe1c5"), 0.52).convert("RGBA")
    alpha = Image.new("L", size, 0)
    draw = ImageDraw.Draw(alpha)
    draw.rounded_rectangle((15, 9, 804, 125), radius=13, fill=255)
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.55))
    body = paper.copy()
    body.putalpha(alpha)
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    shadow_alpha = Image.new("L", size, 0)
    ImageDraw.Draw(shadow_alpha).rounded_rectangle((20, 18, 808, 136), radius=14, fill=95)
    shadow_alpha = shadow_alpha.filter(ImageFilter.GaussianBlur(7))
    shadow.putalpha(shadow_alpha)
    result = Image.new("RGBA", size, (0, 0, 0, 0))
    result.alpha_composite(shadow)
    result.alpha_composite(body)
    result.save(OUTPUT / "choice-card.png")


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGB")
    make_panel(source)
    make_choice_card()
    crops = {
        "stat-sun.png": (45, 801, 99, 858),
        "stat-bolt.png": (225, 807, 266, 856),
        "stat-heart.png": (468, 805, 516, 855),
        "stat-boot.png": (693, 805, 742, 858),
        "choice-speak.png": (73, 1236, 145, 1314),
        "choice-scatter.png": (72, 1350, 148, 1434),
        "choice-avoid.png": (73, 1465, 148, 1548),
        "footer-notebook.png": (263, 1637, 335, 1728),
        "footer-backpack.png": (511, 1637, 588, 1728),
    }
    for name, box in crops.items():
        extract_ink(source, box, name)


if __name__ == "__main__":
    main()
