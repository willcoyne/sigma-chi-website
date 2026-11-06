"""Contact sheet for mockup 11 (time-driven): seek the intro clock, plus one real scroll trigger."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw

html = Path(sys.argv[1]).resolve()
out = Path(sys.argv[2])
out.parent.mkdir(parents=True, exist_ok=True)
D_TIMES = [0, 0.5, 0.95, 1.45, 1.88, 2.3, 2.5, 2.85, 4.0]
if "--times" in sys.argv:
    D_TIMES = [float(x) for x in sys.argv[sys.argv.index("--times") + 1].split(",")]
M_TIMES = [0, 1.88, 4.0]
ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]


def session(b, w, h, times, tag, mobile=False):
    ctx = b.new_context(viewport={"width": w, "height": h}, is_mobile=mobile, has_touch=mobile)
    page = ctx.new_page()
    logs = []
    page.on("console", lambda m: m.type in ("error", "warning") and logs.append(f"[{tag} console.{m.type}] {m.text}"))
    page.on("pageerror", lambda e: logs.append(f"[{tag} pageerror] {e}"))
    page.on("requestfailed", lambda r: logs.append(f"[{tag} requestfailed] {r.url}"))
    page.goto(html.as_uri(), wait_until="networkidle")
    page.wait_for_timeout(4000)
    frames = []
    for i, t in enumerate(times):
        page.evaluate("t => window.__seek(t)", t)
        page.wait_for_timeout(2500)
        p = out.parent / f"{out.name}-{tag}-{i:02d}.png"
        page.screenshot(path=str(p))
        frames.append((f"t={t}", p))
    for j, frac in enumerate([0.42, 0.75]):
        page.evaluate("f => window.scrollTo({top: Math.round((document.documentElement.scrollHeight - innerHeight) * f), behavior: 'instant'})", frac)
        page.wait_for_timeout(1500)
        p = out.parent / f"{out.name}-{tag}-s{j}.png"
        page.screenshot(path=str(p))
        frames.append((f"scroll {frac}", p))
        ov = page.evaluate("document.documentElement.scrollWidth - innerWidth")
        if ov > 0:
            logs.append(f"[{tag}] horizontal overflow {ov}px")
    ctx.close()
    return frames, logs


def trigger(b):
    """Real path: load, scroll 120px once, let the clock run, capture."""
    page = b.new_page(viewport={"width": 1440, "height": 900})
    page.goto(html.as_uri(), wait_until="networkidle")
    page.wait_for_timeout(4000)
    page.mouse.wheel(0, 120)
    page.wait_for_timeout(14000)
    p = out.parent / f"{out.name}-trigger.png"
    page.screenshot(path=str(p))
    state = page.evaluate("({y: scrollY, landed: document.getElementById('landed').classList.contains('on')})")
    page.close()
    return [("real wheel 120px", p)], [f"[trigger] {state}"]


with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", args=ARGS)
    d, dl = session(b, 1440, 900, D_TIMES, "d")
    m, ml = session(b, 390, 844, M_TIMES, "m", mobile=True)
    tr, tl = ([], []) if "--no-trigger" in sys.argv else trigger(b)
    b.close()
for line in dict.fromkeys(dl + ml + tl):
    print(line)

dw, dh, mw, mh, pad, cols = 480, 300, 195, 422, 14, 4
dframes = d + tr
rows = (len(dframes) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (dw + pad) + pad, pad + rows * (dh + pad + 18) + mh + 18 + pad), (230, 230, 230))
dr = ImageDraw.Draw(sheet)
for i, (lab, p) in enumerate(dframes):
    x, y = pad + (i % cols) * (dw + pad), pad + (i // cols) * (dh + pad + 18)
    sheet.paste(Image.open(p).resize((dw, dh)), (x, y + 18)); dr.text((x, y + 2), lab, fill=(0, 0, 0))
y0 = pad + rows * (dh + pad + 18)
for i, (lab, p) in enumerate(m):
    x = pad + i * (mw + pad)
    sheet.paste(Image.open(p).resize((mw, mh)), (x, y0 + 18)); dr.text((x, y0 + 2), lab, fill=(0, 0, 0))
sp = out.parent / f"{out.name}-sheet.png"
sheet.save(sp)
print("sheet:", sp)
