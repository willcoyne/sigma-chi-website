# Security headers

This site's security headers are split across three files, because the host we
actually deploy to can only deliver some of them. If you are wondering "is this
site protected against X?", the honest answer depends on which host you are asking
about. This page spells that out.

## The one thing to know

**GitHub Pages cannot set custom HTTP response headers.** There is no setting, no
config file, and no `.htaccess`-style escape hatch. It serves static files with a
fixed set of headers and that is that. So on our primary host, any protection that
*must* arrive as a response header simply is not there, and no file we add to this
repository can change it.

What we do instead:

1. **`index.html`** carries the subset a `<meta>` tag can deliver. This works
   everywhere, including GitHub Pages.
2. **`netlify.toml`** and **`vercel.json`** carry the complete set as real response
   headers. These take effect only if the site is deployed to Netlify or Vercel.
3. This document records the gap between the two, so nobody assumes we have
   protection we do not have.

## Where we deploy today

| Host | Status | Headers in force |
| --- | --- | --- |
| GitHub Pages (`washusigmachi.org`) | **primary, live** | meta-tag subset only |
| Netlify | config present, not deployed | full set |
| Vercel | config present, not deployed | full set |

## Header-by-header

"Meta tag works?" means: does a browser actually honour this policy when it is
delivered as a `<meta http-equiv>` tag in the HTML, rather than as an HTTP header?

| Header | GitHub Pages can send it? | Meta tag works? | On GitHub Pages today | Netlify / Vercel configs |
| --- | --- | --- | --- | --- |
| `Content-Security-Policy` | No | **Yes**, except `frame-ancestors` and `report-uri` | Active via meta tag in `index.html` | Same policy as a real header, **plus** `frame-ancestors 'self'` |
| CSP `frame-ancestors` | No | **No** — spec says ignore it in meta | **Not protected.** See below. | `frame-ancestors 'self'` |
| `Strict-Transport-Security` | Not from this repo | **No** | Comes from the repo's **Settings -> Pages -> "Enforce HTTPS"** checkbox, not from any file here | `max-age=31536000; includeSubDomains; preload` |
| `X-Frame-Options` | No | **No** — a meta tag does nothing at all | **Not protected.** | `SAMEORIGIN` |
| `X-Content-Type-Options` | No | **No** (header-only; no meta form exists) | Not set | `nosniff` |
| `Referrer-Policy` | No | **Yes** | Active via `<meta name="referrer">` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | No | **No** (header-only; no meta form exists) | Not set | `geolocation=(), microphone=(), camera=()` |

### Two gaps worth repeating

**HSTS on GitHub Pages is a checkbox, not a file.** Go to the repository's
Settings -> Pages and make sure **Enforce HTTPS** is ticked. That is what makes
GitHub serve the redirect and the HSTS header for `washusigmachi.org`. Nothing in
this repository can turn it on, and nothing in this repository will warn you if it
is off.

**Clickjacking protection is unavailable on GitHub Pages.** Both mechanisms that
stop another website from loading our pages inside a hidden `<iframe>` -
`X-Frame-Options` and CSP's `frame-ancestors` - are ignored when delivered by meta
tag. Adding `<meta http-equiv="X-Frame-Options">` to `index.html` would accomplish
exactly nothing; it is deliberately not there, so that nobody reads it and assumes
the problem is handled. For a public, read-only recruitment site with no login and
no authenticated actions, the practical risk is low: there is no session for a
framing attack to hijack and no button whose click means anything. If that ever
changes - if we add a login, a member portal, or anything that acts on a logged-in
person's behalf - move the site to a host that can set real headers.

## The policy itself

Identical in all three files except for one directive:

```
default-src 'self';
script-src 'self' https://plausible.io;
style-src 'self';
font-src 'self';
img-src 'self' data:;
connect-src 'self' https://plausible.io https://formspree.io;
form-action 'self' https://formspree.io;
frame-src 'self' https://behold.so https://*.behold.so https://snapwidget.com https://*.snapwidget.com;
frame-ancestors 'self';      <-- header versions only; omitted from the meta tag
base-uri 'self';
object-src 'none'
```

Why each third-party origin is allowed:

- **`plausible.io`** - `src/lib/analytics.ts` loads Plausible's script and it beacons
  events back. This only happens if `VITE_PLAUSIBLE_DOMAIN` is set, which it is not
  today, so zero requests currently go there. The allowance is pre-staged so that
  switching analytics on is an environment-variable change, not a CSP change.
- **`formspree.io`** - `src/components/ContactForm.tsx` submits the recruitment
  interest form there. This one is live.
- **`behold.so` / `snapwidget.com`** - the two Instagram-embed services named in
  `src/components/InstagramEmbed.tsx`, allowed in `frame-src` so the embed works if
  `VITE_INSTAGRAM_EMBED_URL` is ever set. No iframe renders today.

Note what is *absent*: no `'unsafe-inline'`, no `'unsafe-eval'`, and no wildcard
origins.

## Why `style-src` does not need `'unsafe-inline'`

This is the directive most likely to be "fixed" by someone in a hurry, so here is
the reasoning, verified against a real `vite build` rather than assumed:

- Vite extracts every co-located `.css` file into one external stylesheet and emits
  **no** inline `<style>` block and **no** inline `<script>` in `dist/index.html`.
  The prerender step copies that same shell to each route, so it holds everywhere.
- React and framer-motion do produce inline *style attributes* (`style={{ ... }}`,
  and the transforms framer-motion animates). CSP checks a `style` attribute when it
  is parsed from markup or written with `setAttribute("style", ...)` / `cssText`.
  React and framer-motion instead write through the CSSOM
  (`node.style.setProperty(...)`), which CSP does not police. The built bundle
  contains no `setAttribute("style")` and no `cssText`.
- One dormant exception: framer-motion's `<AnimatePresence mode="popLayout">` builds
  a `<style>` element and calls `sheet.insertRule`. This site uses `mode="wait"`, so
  that code path never executes. If someone switches a transition to `popLayout` and
  layout animations break, that is the cause - the fix is to pass a nonce through
  `MotionConfig`, **not** to add `'unsafe-inline'`.

## Changing the policy

The policy is duplicated in three files and nothing enforces that they agree, so:

1. Edit `index.html`, `netlify.toml`, and `vercel.json` together.
2. Remember `frame-ancestors` belongs in the two header files only.
3. Run `npm run build`, open `dist/index.html`, and confirm the meta tag is there
   and that no new inline `<script>` or `<style>` appeared in the output.
4. Load the built site and check the browser console. CSP violations are reported
   there as "Refused to load/execute ..." messages, and a blocked resource is
   otherwise silent - the page just looks subtly wrong.
