# Original photos

Full-resolution originals live here. They are **not** committed and **not**
served — `.gitignore` excludes the image files in this folder, and only this
README is tracked.

What the site actually loads are the web-sized copies in `src/assets/`, which
Vite fingerprints and bundles. Keeping the two apart means a 2 MB photo off a
phone never reaches a visitor on campus wifi.

## Adding a photo

Drop the original in here, then generate the two sizes the site uses. This
needs Python with Pillow (`pip install Pillow`):

```bash
python -c "
from PIL import Image, ImageOps
src = ImageOps.exif_transpose(Image.open('assets-src/YOUR-PHOTO.jpg')).convert('RGB')
for w, name in [(1800, 'NAME.jpg'), (900, 'NAME-900.jpg')]:
    h = round(src.height * w / src.width)
    src.resize((w, h), Image.LANCZOS).save(
        'src/assets/' + name, 'JPEG', quality=82, optimize=True, progressive=True)
"
```

Two things that matter and are easy to miss:

- **`exif_transpose` first.** Phone photos record their rotation in EXIF
  rather than in the pixels. Skip this and portrait shots ship sideways.
- **No `exif=` on save, so the metadata is dropped.** Originals can carry GPS
  coordinates, and these are photos of students.

Then reference both sizes together so phones fetch the small one:

```jsx
<PhotoBand src={wide} srcSet={`${narrow} 900w, ${wide} 1800w`} width={1800} height={1012} alt="..." />
```
