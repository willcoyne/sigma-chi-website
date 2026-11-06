# Beer die redesign: handoff

Paused on 6 November 2026 at the user's request, partway through mockup 15. This file says where things stand, what is left to do, and how to do it. Read it before touching anything in `beer-die-redesign/`.

## Where things stand

- **Branch:** `experiment/beer-die-redesign`, pushed to GitHub. Nothing from this work is on `main` or the live site.
- **Mockups 01–14:** finished and published as private claude.ai artifacts. Links are in `README.md`.
- **Mockup 15, "Studio"** (`mockups/15-studio.html`): first version built, working end to end, **not published and not in the README yet**. It is 14's throw (the figure lobs the die into the far-right cup) with the glow taken out. Sharp, realistic rendering, a marble statue for the thrower, and live-site editorial sections after the scene. The user asked for it to be "modern, sleek, sharp, more professional", instead of the "glowy vibecoded" look of 11–14.
- **Review of 15:** a five-lens review (art direction, realism, behavior, laptop performance, brand) was running and was **stopped** by the user. Two lenses finished (art, brand); their findings are saved but were **not verified**. Three lenses were cut off midway. Everything that was salvaged is in `review-15/` (see task 1).
- **Implementation plan:** `implementation-plan.html` (the source) already has the text for 15: a concept entry, a comparison row, the recommendation changed to "build 15", and the rollout step and question updated. **The PDF has not been re-rendered.** The 15 thumbnails it references (`screenshots/15-a.jpg`, `-b`, `-c`) don't exist yet, so rendering now would show broken images. The committed `implementation-plan.pdf` still describes 1–14.
- **Live site copy fix:** commit `7324487` on this branch changes the site's own copy to say the colony becomes the Tau Tau chapter again once rechartered. It touches `Home.tsx`, `History.tsx`, `content.ts`, the 2026 timeline entry, `CONTENT-GUIDE.md` and `PROJECT_SUMMARY.md`. It is **not on `main`**. Applying it there redeploys the live site, so it needs the user's go-ahead.

## To do, in order

### 1. Finish mockup 15

**Triage the saved findings.** They are unverified, so check each one against the current file before applying it.

| Id | Severity | Problem | Proposed fix (full text in `review-15/*-review.json`) |
|---|---|---|---|
| art-1, brand-4 | critical / major | After the camera crane, most of the frame turns slate grey instead of brand navy. | Background and fog `0x071931`; navy floor (`0x0b2545`, roughness ~0.85, low env intensity). Keep AgX: ACES was tested and crushes the near table. |
| art-2 | major | The "marble statue" reads as a white jointed posing mannequin. | Reviewer suggests a bronze/brass statue instead (`MeshPhysicalMaterial` color `0x9a7a3a`, metalness 1, roughness 0.34). **Decision for the user:** marble or bronze. |
| art-3, brand-1 | major | On phones the table is small and far away, and the closing card covers the landing. | New phone camera (`P1N` (3.5, 11, 14.5), `T1N` (-0.3, 0.6, 1.0)); card pinned to the top on phones. |
| art-4, brand-3 | major | At scroll 0 the hero shows a grey haze and streaky grain; the live hero is a clean navy field. | Fade the key light in with the crane (`key.intensity = 2.1 * c`), much fainter table grain, pinstripes weighted to the left like the live hero. |
| art-5 | major | The "fist pump" reads as a raised hand; the end pose looks like a mannequin display. | Pump with both arms up in a V; add a relaxed rest pose. |
| brand-2 | major | On phones the cup holding the die turns milky and reads as a filled glass. | Drop transmission on phones (or rework the glass). |
| brand-5, art-7 | major / minor | The scrolled nav is a neutral grey bar that smears the gold CTA. | `.nav--solid` background `rgba(11, 37, 69, .82)` like the live site. |
| brand-6 | major | The aims section is still 14's card grid, and JetBrains Mono is still loaded and visible. | Use the live site's editorial index rows; remove the mono font. |
| art-6 | minor | The painted ΣΧ on the table lies sideways from the desktop camera. | Rotate the decal per camera. |
| brand-7 | minor | Glow leftovers in the chrome at scroll 0, an undefined `--ink`, and the chip covering copy on phones. | See JSON. |
| brand-8 | minor | The colony section, CTAs, card eyebrow and footer drift from the live copy. | See JSON. Keep the Tau Tau wording. |

**Notes from the three unfinished lenses.** These were read from their transcripts before they stopped, and are not verified.
- **Performance:** while the figure is in view, about 110 draw calls and 192k triangles; GPU 14–20 ms per frame at 2880×1800 on the dev machine. **Two shader-compile stalls of 0.67 s and 0.87 s** the first time the figure and the glass come into view (intro clock ≈ 0.57 s and ≈ 0.98 s). Fix: pre-compile (`renderer.compile(scene, camera)`) right after the scene is built. In one run the slow-frame fallback kicked in and dropped the pixel ratio from 2 to 1.25. The raw data is in `review-15/perf/`.
- **Behavior:** just moving the pointer over the hero triggered about 38 renders, because the "busy" check counts pointer smoothing even before the intro. Fix: only smooth the pointer once the intro has started. A partial fix is in `review-15/candidates/behavior-in-progress.html`. Still to check: keyboard scrolling, rewind and replay, reduced motion, a real wheel trigger.
- **Realism:** was testing a neutral bounce light and other tone-mapping settings to lift a dark band without tinting it amber. A partial result is in `review-15/candidates/realism-in-progress.html`.

**Reference copies** in `review-15/candidates/` show each reviewer's fixes applied to a copy of 15. Diff them against `mockups/15-studio.html`; don't copy them over wholesale, since they diverge from each other.
- `art-all-fixes.html` (reviewer) and `art-verifier-all-fixes.html` (verifier, unfinished)
- `brand-all-fixes.html`
- `realism-in-progress.html`, `behavior-in-progress.html`, `perf-instrumented.html` (adds timing hooks)

**Then:**
1. Re-check with `tools/shoot-timed.py`, desktop and phone.
2. Capture `screenshots/15-a/b/c.jpg` with `tools/thumbs-timed.py`. The suggested times are 2.25, 1.6 and 3.2.
3. Read `window.__figureStats` for the plan.

Optionally, re-run the review (see the end of this file) on the fixed version.

### 2. Publish 15 and add it to the README

- `python -I tools/to-artifact.py mockups <out_dir>`, then publish `<out_dir>/15-studio.html` as a new private artifact (title "Beer Die Studio").
- Add a row for 15 to the table in `README.md`, with the link.

### 3. Finish the plan PDF

- Section 8 ("What each effect needs"): add a third table, **The studio render (15)**:
  - native multisampling at up to 2× density and no post-processing (sharpness)
  - AgX tone mapping (present in three 0.160)
  - generated studio environment, a `RectAreaLight` softbox and soft shadows from a 2048 map
  - satin navy floor fogged into the backdrop
  - die with colour, metalness, roughness and bump maps
  - clear-glass cups (transmission)
  - the statue: fine tessellation, capped ends, normals matched across the seam, ball joints
  - render only while something moves, plus a one-time pixel-ratio drop
  - shader pre-compile
  - what 15 removes compared with 14: bloom, HUD, code rain, pad, trail, sparks
  - use measured numbers
- Section 9 performance budget: add a row for 15.
- Render with `python beer-die-redesign/render-plan.py`, then check the page layout (see Tools); avoid near-empty pages. Sections marked `class="section flow"` flow on from the previous page instead of forcing a new one.

### 4. The live site copy fix

Cherry-pick `7324487` onto `main` **only with the user's OK**. A push to `main` deploys the live site through the GitHub Pages workflow.

### 5. Commit and push

The branch is the record. Each step so far was committed with a descriptive message and pushed.

## Decisions waiting on the user

- **Direction.** The plan's draft recommends 15. Alternatives: the glowing 11–14, a crest-up table landing (11) instead of the cup, and whether to keep the thrower at all.
- **The statue:** marble or bronze (finding art-2).
- **Theme sign-off.** Beer die is a drinking game and the home page is the colony's recruitment page. Someone like the risk manager or expansion coordinator should approve it before anything reaches `main`.
- **The colony note's alumni sentence.** `7324487` removed "No previous Tau Tau alumni are part of this founding class". Restore it if wanted.
- **More notes.** The user said "a few notes to include on the redesign", and only the Tau Tau one has arrived so far.

## Rules for any copy or design here

- **Tau Tau:** once rechartered, the colony becomes the Tau Tau chapter again. Never describe the colony as unconnected to Tau Tau, "not a revival", "a clean start" or "a new chapter".
- **Dry imagery:** cups stay empty; no beer or cans; the word "beer" never appears in page copy.
- **Scroll 0 looks like today's live hero:** navy field, pinstripes, headline, crest watermark. Everything else is revealed by scrolling.
- **Palette** from `src/styles/theme.css`: navy `#0b2545`, navy-dark `#071931`, gold `#c9a227`, gold-dark `#8a6d1b`, cream `#faf7f0`. **Type:** Cormorant Garamond, Cormorant SC and Source Sans 3. The crest is the colony's own shield mark, not the official coat of arms.
- **Artifact constraints:** scripts only from cdnjs, jsDelivr or unpkg; no fetched images, models or HDRs; fonts only from Google Fonts. three.js is 0.160.0 through an inline importmap. Mockup files keep a full `<!doctype html>` document for local viewing; `tools/to-artifact.py` strips the wrapper for publishing.
- **Mockups 11–15** expose `window.__seek(seconds)`, which freezes the intro clock. The toss starts at 1.3 s.
- Don't run the GitHub Pages workflow from this branch. It has `workflow_dispatch`, and a manual run would replace the live site.

## Tools (`beer-die-redesign/tools/`)

All of these need Python with Playwright and Google Chrome installed (`channel="chrome"`). WebGL runs through SwiftShader in headless mode, which is slow (seconds per frame) but faithful. Run them from the `tools/` folder.

- `shoot-timed.py <html> <out_prefix> --times 0,0.95,1.6,2.25,3.2,5 [--no-trigger]`: frames at intro-clock times for 11–15, at 1440×900 and 390×844, plus a contact sheet. Without `--no-trigger` it also does one real wheel-scroll trigger.
- `shoot-scroll.py <html> <out_prefix> --desk 0,.1,... --mob 0,.5`: frames at scroll fractions for the scrubbed mockups 01–10.
- `thumbs-scroll.py <mockups_dir> <screenshots_dir> [01 02 ...]`: the plan's three thumbnails for 01–10.
- `thumbs-timed.py <html> <screenshots_dir> <NN> <a,b,c times>`: the same for 11–15.
- `to-artifact.py <mockups_dir> <out_dir>`: strips the document wrapper so a mockup can be published as an artifact.
- `pdfview.html`: renders a PDF's pages with pdf.js so the page layout can be checked without a PDF rasterizer. Open `pdfview.html?f=<file:// URL of the PDF>` in Playwright's Chrome launched with `--allow-file-access-from-files`, wait for `body[data-done='1']`, then take a full-page screenshot.
- `make12.py` … `make15.py`: the generators that built 12–15 from their predecessor. They're historical; edit `15-studio.html` directly from now on.

## Re-running the review

The review was a Claude Code workflow. Five reviewers (art direction, realism and rendering, behavior, laptop performance, brand and copy) each rendered frames and returned findings with exact fixes, and a skeptic per lens tried to refute every finding before anything was applied. Each reviewer got the brief and constraints above, the file paths, and the `shoot-timed.py` usage. The script was saved under the Claude Code session folder on the dev machine; the description here is enough to rebuild it. Allow about two hours, since the software renderer is slow.
