"""Strip the document wrapper from each mockup so it can be published as an artifact.

usage: python -I to_artifact.py <mockups_dir> <out_dir>
The host wraps the page in its own doctype/head/body with charset + viewport,
so those go; <title> must come first.
"""
import re
import sys
from pathlib import Path

src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
for f in sorted(src.glob("[0-9][0-9]-*.html")):
    s = f.read_text(encoding="utf-8")
    for pat in [r"<!doctype html>\s*", r"<html[^>]*>\s*", r"</html>\s*", r"<head>\s*", r"</head>\s*",
                r"<body[^>]*>\s*", r"</body>\s*", r'<meta charset="utf-8">\s*', r'<meta name="viewport"[^>]*>\s*']:
        s, n = re.subn(pat, "", s, count=1, flags=re.I)
    assert s.lstrip().lower().startswith("<title>"), f"{f.name}: title is not first"
    assert not re.search(r"<(body|head)[\s>]", s, re.I), f.name
    (out / f.name).write_text(s, encoding="utf-8")
    print("ok", f.name, len(s))
