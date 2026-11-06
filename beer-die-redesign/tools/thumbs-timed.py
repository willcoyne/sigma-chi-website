import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
html, out = Path(sys.argv[1]).resolve(), Path(sys.argv[2])
nn = sys.argv[3]
times = [float(x) for x in sys.argv[4].split(",")]   # a (signature), b, c
errs = []
with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    page = b.new_page(viewport={"width": 1440, "height": 900})
    page.on("pageerror", lambda e: errs.append(str(e)))
    page.on("console", lambda m: m.type == "error" and errs.append(m.text))
    page.goto(html.as_uri(), wait_until="networkidle")
    page.wait_for_timeout(4000)
    for c, t in zip("abc", times):
        page.evaluate("t => window.__seek(t)", t)
        page.wait_for_timeout(3000)
        page.screenshot(path=str(out / "_tmp.png"))
        Image.open(out / "_tmp.png").convert("RGB").resize((960, 600), Image.LANCZOS).save(out / f"{nn}-{c}.jpg", quality=82, optimize=True, progressive=True)
    (out / "_tmp.png").unlink()
    b.close()
print("errors:", errs)
w = Image.new("RGB", (1940, 400)); [w.paste(Image.open(out / f"{nn}-{c}.jpg").resize((640, 400)), (i * 650, 0)) for i, c in enumerate("abc")]
Path("shots").mkdir(exist_ok=True)
w.save(Path("shots") / f"{nn}-thumbs.png")
