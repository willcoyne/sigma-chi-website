"""Three key frames per mockup for the PDF and README, plus one review sheet.

usage: python -I thumbs.py <mockups_dir> <out_dir> [only_nn ...]
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw

FRAMES = {  # signature frame first, then two supporting frames (fractions of max scroll)
    "01": [.30, .10, .40],
    "02": [.19, .33, .60],
    "03": [.40, .07, .37],
    "04": [.16, .26, .54],
    "05": [.33, .12, .91],
    "06": [.09, .30, .49],
    "07": [.28, .10, .45],
    "08": [.40, .12, .85],
    "09": [.30, .10, .46],
    "10": [1.0, .50, .06],
}
src, out = Path(sys.argv[1]), Path(sys.argv[2])
only = set(sys.argv[3:])
out.mkdir(parents=True, exist_ok=True)
made = []
with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    for f in sorted(src.glob("[0-9][0-9]-*.html")):
        nn = f.name[:2]
        if only and nn not in only:
            continue
        settle = 4000 if nn == "09" else 1300
        page = b.new_page(viewport={"width": 1440, "height": 900})
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.goto(f.as_uri(), wait_until="networkidle")
        page.wait_for_timeout(1500)
        for i, frac in enumerate(FRAMES[nn]):
            y = page.evaluate("f => Math.round((document.documentElement.scrollHeight - innerHeight) * f)", frac)
            page.evaluate("y => window.scrollTo({top: y, behavior: 'instant'})", y)
            page.wait_for_timeout(settle)
            tmp = out / f"_tmp.png"
            page.screenshot(path=str(tmp))
            im = Image.open(tmp).convert("RGB").resize((960, 600), Image.LANCZOS)
            dst = out / f"{nn}-{'abc'[i]}.jpg"
            im.save(dst, quality=82, optimize=True, progressive=True)
            made.append(dst)
        tmp.unlink()
        page.close()
        for e in errs:
            print(nn, "pageerror:", e)
    b.close()

# review sheet: one row per mockup, 3 frames at 320x200
rows = sorted({p.name[:2] for p in made})
sheet = Image.new("RGB", (3 * 330 + 50, len(rows) * 210 + 10), (230, 230, 230))
d = ImageDraw.Draw(sheet)
for r, nn in enumerate(rows):
    d.text((8, r * 210 + 100), nn, fill=(0, 0, 0))
    for i, c in enumerate("abc"):
        sheet.paste(Image.open(out / f"{nn}-{c}.jpg").resize((320, 200)), (40 + i * 330, r * 210 + 10))
(Path(sys.argv[0]).parent / "shots").mkdir(exist_ok=True)
sheet.save(Path(sys.argv[0]).parent / "shots" / "thumbs-sheet.png")
print("made", len(made))
