"""Contact sheet for a scroll-driven mockup.

usage: python -I shoot.py <mockup.html> <out_prefix> [--desk 0,.1,...] [--mob 0,.5,1]

Scrolls the page to each fraction of its max scroll, waits for smoothing to
settle, and screenshots. Desktop 1440x900 and phone 390x844. Writes
<out_prefix>-d-NN.png / -m-NN.png frames and <out_prefix>-sheet.png, and
prints console errors, page errors, failed requests and horizontal overflow.
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw

args = sys.argv[1:]
html = Path(args[0]).resolve()
out = Path(args[1])
desk = [0, .1, .2, .3, .4, .5, .6, .7, .8, .9]
mob = [0, .25, .5, .75]
if "--desk" in args:
    desk = [float(x) for x in args[args.index("--desk") + 1].split(",")]
if "--mob" in args:
    mob = [float(x) for x in args[args.index("--mob") + 1].split(",")]
settle = 1100
if "--settle" in args:
    settle = int(args[args.index("--settle") + 1])

out.parent.mkdir(parents=True, exist_ok=True)


def run(browser, w, h, fracs, tag, mobile=False):
    ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=1,
                              is_mobile=mobile, has_touch=mobile)
    page = ctx.new_page()
    logs = []
    page.on("console", lambda m: m.type in ("error", "warning") and logs.append(f"[{tag} console.{m.type}] {m.text}"))
    page.on("pageerror", lambda e: logs.append(f"[{tag} pageerror] {e}"))
    page.on("requestfailed", lambda r: logs.append(f"[{tag} requestfailed] {r.url} {r.failure}"))
    page.goto(html.as_uri(), wait_until="networkidle")
    page.wait_for_timeout(1500)
    frames = []
    for i, f in enumerate(fracs):
        y = page.evaluate("f => Math.round((document.documentElement.scrollHeight - innerHeight) * f)", f)
        page.evaluate("y => window.scrollTo({top: y, behavior: 'instant'})", y)
        page.wait_for_timeout(settle)
        p = out.parent / f"{out.name}-{tag}-{i:02d}.png"
        page.screenshot(path=str(p))
        frames.append((f, p))
        ov = page.evaluate("document.documentElement.scrollWidth - innerWidth")
        if ov > 0:
            logs.append(f"[{tag}] horizontal overflow {ov}px at {f}")
    ctx.close()
    return frames, logs


with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    dframes, dlogs = run(b, 1440, 900, desk, "d")
    mframes, mlogs = run(b, 390, 844, mob, "m", mobile=True)
    b.close()

for line in dict.fromkeys(dlogs + mlogs):
    print(line)

# Sheet: desktop frames 4 per row at 1/3 scale, then phone frames in a row.
dw, dh = 480, 300
mw, mh = 195, 422
cols = 4
drows = (len(dframes) + cols - 1) // cols
pad = 14
sheet_w = cols * (dw + pad) + pad
sheet_h = pad + drows * (dh + pad + 18) + mh + 18 + pad
sheet = Image.new("RGB", (sheet_w, sheet_h), (230, 230, 230))
draw = ImageDraw.Draw(sheet)
for i, (f, p) in enumerate(dframes):
    x = pad + (i % cols) * (dw + pad)
    y = pad + (i // cols) * (dh + pad + 18)
    sheet.paste(Image.open(p).resize((dw, dh)), (x, y + 18))
    draw.text((x, y + 2), f"desktop {f:.2f}", fill=(0, 0, 0))
y0 = pad + drows * (dh + pad + 18)
for i, (f, p) in enumerate(mframes):
    x = pad + i * (mw + pad)
    sheet.paste(Image.open(p).resize((mw, mh)), (x, y0 + 18))
    draw.text((x, y0 + 2), f"phone {f:.2f}", fill=(0, 0, 0))
sp = out.parent / f"{out.name}-sheet.png"
sheet.save(sp)
print("sheet:", sp)
