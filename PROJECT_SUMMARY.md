# Sigma Chi at WashU — Project Summary

A React 19 + Vite site for the Sigma Chi Beta Colony at Washington University in St. Louis, built end-to-end: research, design, and implementation.

## How it was built

Work was split across specialized agents, matching the requested research → design → build pipeline:

1. **Research (2 parallel agents)** — one dug into Sigma Chi's national history, symbols, values, and brand colors; the other researched Sigma Chi specifically at WashU (the historical Tau Tau chapter, its 2022 closure, and the real spring‑2026 recolonization effort). All facts used on the site trace back to this research and live in [`src/data/content.js`](src/data/content.js) as the single source of truth. Where public information was incomplete (e.g., no confirmed officer roster or event calendar for the new colony), the copy is written honestly and generally rather than inventing specifics.
2. **Design (1 agent)** — produced a concrete design spec: final color palette, typography pairing, an original SVG shield/cross motif (not the trademarked Sigma Chi crest), a Collegiate-Gothic arch motif echoing WashU's Danforth Campus architecture, animation/interaction rules, and a 6-page site map.
3. **Build** — scaffolded the Vite + React project, theme, router, and full reusable component library directly; a build agent then wrote the five inner pages against that component library and content file; a QA/polish agent did a full accuracy, consistency, accessibility, and build/lint pass and fixed several real bugs it found.
4. **Manual verification** — the dev server was actually launched and driven with Playwright (screenshots at desktop 1440px and mobile 390px widths, console-error checks) across all 6 pages, since a passing build doesn't prove the UI actually renders correctly. This caught and fixed one real bug: large stat numbers (e.g. "250000+") weren't comma-formatted.

## What's on the site

- **Home** — hero, Three Great Aims teaser, stat strip, colony status banner, philanthropy teaser.
- **Our History** — national founding (1855), the seven founders, a full timeline from 1855 through the 1903 Tau Tau charter, its 2022 surrender, and the 2023–2026 return, plus an explicit "new colony, not a revival" callout.
- **Values & Creed** — the Three Great Aims (Friendship, Justice, Learning), the "In Hoc Signo Vinces" motto explained, and the Norman Shield / White Cross / Sweetheart of Sigma Chi symbols.
- **The Colony Today** — colony-vs-chartered-chapter explainer, IFC good-standing status, a quote from the real expansion coordinator, and the one confirmed founding father named in public reporting.
- **Philanthropy** — Sigma Chi's national partnership with the Huntsman Cancer Foundation.
- **Contact / Join Us** — a founding-fathers recruitment pitch and a working (front-end only) contact form.

## Design system

- **Colors:** Sigma Chi Navy `#0B2545` + Old Gold `#C9A227` as the primary brand, cream/ink neutrals for readability, and WashU Green/Red used only as a restrained accent hairline (never as a competing brand color).
- **Type:** Cormorant Garamond/Cormorant SC for display headings, Source Sans 3 for body/UI.
- **Motifs:** an original SVG shield-and-cross mark and a repeating Gothic-arch divider — deliberately not a reproduction of either organization's actual trademarked logos.
- **Motion:** Framer Motion scroll-reveals, an animated shield draw-in on the hero, a count-up stat component, and a scroll-aware nav bar — all wrapped in `MotionConfig reducedMotion="user"` plus a CSS `prefers-reduced-motion` fallback.

## Running it

```
npm install
npm run dev      # local dev server
npm run build    # production build
npm run lint     # oxlint
```

## Legal note

No official Sigma Chi or Washington University in St. Louis logo files are used anywhere on the site — all crests/marks are original. The footer carries an explicit "unofficial colony site" disclaimer, since this was built independently and is not a publication of either organization.

## Round 2 - Improvements Implemented

A second batch of agents picked up items from `IMPROVEMENTS.md` and extended the site. Verified against the actual repository state:

- **Self-hosted fonts.** Cormorant Garamond, Cormorant SC, and Source Sans 3 are now bundled via `@fontsource/*` packages (imported per-weight in `src/main.tsx`) instead of loaded from the Google Fonts CDN. The `<link>`/preconnect tags for Google Fonts were removed from `index.html`.
- **SEO basics.** `index.html` now has Open Graph and Twitter Card meta tags, and `public/robots.txt` / `public/sitemap.xml` list all six routes. These currently use a placeholder domain (`https://sigmachiwashu.example.com/`) with `og:image`/`twitter:image` intentionally omitted, since no production domain or licensed image exists yet — both are flagged inline as follow-ups.
- **Automated tests.** The project now has a real Vitest + React Testing Library suite (`vitest.config.ts`, `src/test/setup.ts`, `src/App.test.tsx`, `src/components/ContactForm.test.tsx`), run via `npm run test`. It currently passes in full.
- **Markdown content pipeline for the History timeline.** The five timeline entries live as individual Markdown files under `src/content/timeline/*.md` (frontmatter + body), loaded at build time in `src/data/content.ts` via `import.meta.glob`. See `CONTENT-GUIDE.md` for non-developer instructions on editing/adding/removing timeline entries.
- **Page-transition animations.** Route changes now animate via a `PageTransition` wrapper (`src/components/PageTransition.tsx`) and `AnimatePresence` in `src/App.tsx`, consistent with the site's existing Framer Motion motion language and the `MotionConfig reducedMotion="user"` setting.
- **Upgraded contact form.** `src/components/ContactForm.tsx` now collects recruitment-relevant fields (Year, Major, "How did you hear about us?") in addition to Name/Email/Message, and will actually submit to a real Formspree endpoint when `VITE_FORMSPREE_ENDPOINT` is set — otherwise it keeps working exactly as before in local-only demo mode.
- **Instagram embed scaffold.** A new `InstagramEmbed` component (`src/components/InstagramEmbed.tsx`) centralizes the Colony page's "Follow Along" section. It renders a live embedded feed when `VITE_INSTAGRAM_EMBED_URL` is set, and otherwise falls back to the original static bio + follow-link markup.
- **Analytics scaffold.** `src/lib/analytics.ts`, wired up in `src/main.tsx`, optionally loads Plausible Analytics when `VITE_PLAUSIBLE_DOMAIN` is set. With no value set (the default), it is a true no-op — no script tag and no network request.
- **Deployment configuration.** `vercel.json`, `netlify.toml`, and `.github/workflows/deploy-gh-pages.yml` were added along with `DEPLOYMENT.md` walking through all three hosting options. None of these have been used to actually deploy the site yet (see `IMPROVEMENTS.md`).
- **TypeScript migration.** The entire `src/` tree (and `vite.config.js`/`vitest.config.js`) has been converted from `.jsx`/`.js` to `.tsx`/`.ts`, with `tsconfig.json` / `tsconfig.node.json` added under `strict: true`. `npm run build` now runs `npm run typecheck` (project-wide `tsc --noEmit`) before `vite build`. This is confirmed by the current repository state — there are no `.jsx`/`.js` files left under `src/`.
- **Consolidated environment variables.** A `.env.example` at the project root documents all three environment variables actually referenced in code (`VITE_FORMSPREE_ENDPOINT`, `VITE_PLAUSIBLE_DOMAIN`, `VITE_INSTAGRAM_EMBED_URL`), each with a comment on what it does and where to get a real value. No `.env` file exists in the repo; all three features run in their safe fallback/no-op mode by default.

As of this pass, `npm run build` (typecheck + Vite build), `npm run lint` (oxlint), and `npm run test` (Vitest) all complete with no errors.
