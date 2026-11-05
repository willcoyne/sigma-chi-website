"""Render implementation-plan.html to implementation-plan.pdf with headless Chrome.

usage (from anywhere):  python beer-die-redesign/render-plan.py
needs: pip install playwright, plus Google Chrome installed (or run
`playwright install chromium` and drop channel="chrome" below).
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

here = Path(__file__).resolve().parent
src = here / "implementation-plan.html"
out = here / "implementation-plan.pdf"

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="chrome")
    page = browser.new_page()
    page.goto(src.as_uri(), wait_until="load", timeout=90000)
    page.evaluate("document.fonts.ready.then(() => true)")
    page.wait_for_timeout(500)
    page.pdf(path=str(out), prefer_css_page_size=True, print_background=True)
    browser.close()

print(f"wrote {out}")
