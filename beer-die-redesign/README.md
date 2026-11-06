# Beer die home page (experiment)

Planning for the `experiment/beer-die-redesign` branch. The home page loads looking like today's site; scrolling reveals that the hero's navy background is a die table, and the crest becomes a die that gets thrown.

**Start with [`implementation-plan.pdf`](implementation-plan.pdf)** (19 pages). It covers the concepts side by side, the recommended frameworks (no framework change: React Three Fiber, drei and bloom on top of the existing Vite, React and Motion stack), the architecture, the toss timing, what each visual effect needs (section 8), accessibility, performance and CSP, rollout, and the open questions.

## Mockups

Each mockup is one self-contained HTML file in [`mockups/`](mockups). Open it in Chrome, Edge or Safari and scroll. It needs an internet connection for Google Fonts, and 04, 05, 08, 09 and 11 also load libraries from CDNs. Each one is also published as a private Claude artifact; the links open only for the account that published them until they're shared from the page's Share menu.

| # | Concept | How it's built | Artifact |
|---|---------|----------------|----------|
| **11** | **Glow Toss**: the revision after feedback, and the recommended direction (with 12). One small scroll plays the whole toss (realistic physics, bloom, glass cups, HUD); scrolling back to the top rewinds it. | three.js, bloom, time-based | [open](https://claude.ai/artifact/XMggoyrBKAkVnM4NkTXJo4) |
| **12** | **Cup Sink**: 11 with a different ending. The die drops into a cup, rattles and settles crest-up while the cup lights up; "Toss again" works round all four cups. | same as 11 | [open](https://claude.ai/artifact/FSWE8HZ4676EeAuU5umyY4) |
| **13** | **Holo Thrower**: 12 with a player. A featureless figure made of glowing blue contour lines prints itself in at the near end, lobs the die underhand into the cup and pumps a fist. | same as 11, plus a code-built figure | [open](https://claude.ai/artifact/RCcuoT3YJX1CPKiwUWz9iE) |
| **14** | **Jacked Thrower**: 13 with a heavyweight build. Pecs, a six-pack, lats, traps, delts, big arms, quads and calves, with brighter lines on the muscle borders; the camera ends on a front three-quarter view. | same as 13 | [open](https://claude.ai/artifact/LJo5irrjWZ8RqP2EMZQdqi) |
| 01 | Tilt Reveal: the hero's navy field tilts back into the table. | CSS 3D | [open](https://claude.ai/artifact/U5kAqHLp7zKvXFXJ4UGfHS) |
| 02 | Cross Fold: the White Cross lands as the unfolded die and folds up into it. | CSS 3D hinges | [open](https://claude.ai/artifact/TMHkhwYiVWxhn27RV6VaMw) |
| 03 | Overhead Toss: a top-down table where height reads through scale and shadow. | SVG, 2D transforms | [open](https://claude.ai/artifact/TamcHjkfkrUfpnfmQp8iov) |
| 04 | Altitude: a to-scale side view with an altitude ruler and a sink at the end. | GSAP ScrollTrigger | [open](https://claude.ai/artifact/2keL9HYYJoGQPF2LCzK629) |
| 05 | Six Faces: a pinned die turns a face for each chapter of the page. | Motion, CSS 3D | [open](https://claude.ai/artifact/HJ4UR41o1Y25Lmkntg3PxE) |
| 06 | Pull Back: the hero turns out to be the die's top face. | 2D zoom, CSS 3D | [open](https://claude.ai/artifact/5teZmC2iRf2zmZu96mYYvU) |
| 07 | Tablecloth Pull: the hero is a cloth yanked off the table. | CSS 3D, SVG filter | [open](https://claude.ai/artifact/VS5X7HPVEg6mpTPcqY1F24) |
| 08 | Split Stage: the page reads normally beside a sticky table panel. | Motion, CSS 3D | [open](https://claude.ai/artifact/7koArjzQ4qWYwfVagHAnd5) |
| 09 | 3D Table: the first WebGL version, scrubbed by scroll. | three.js | [open](https://claude.ai/artifact/NiMB6FTKLDLvPhN1cXmzNb) |
| 10 | Quiet Version: today's page with a small die in the nav and a table at the end. | CSS scroll-driven animations | [open](https://claude.ai/artifact/DdbvsVFuvQJrEHhnkCgWFG) |

## Other files

- `implementation-plan.html` is the source of the PDF. After editing it, run `python beer-die-redesign/render-plan.py` (needs Python Playwright and Google Chrome).
- `plan-assets/` holds the PDF cover background, and `screenshots/` the mockup frames used in the PDF.
- Mockups 11 to 14 expose `window.__seek(seconds)`, which freezes the page's clock at a given moment. That's how their frames were captured, and the production build's Playwright checks would use the same idea.

## Notes

- Nothing here is part of the site build. Vite bundles only `index.html` and `src/`.
- The imagery is deliberately dry: empty cups, no beer or cans, and no on-page copy that says "beer". Get sign-off from the colony's risk manager or expansion coordinator before any of this reaches `main`.
- The die uses the colony's own shield mark, not the official Sigma Chi coat of arms, matching the site footer's trademark note.
