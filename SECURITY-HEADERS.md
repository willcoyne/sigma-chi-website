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
style-src 'self' 'unsafe-inline';
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

Note what is *absent* from `script-src`: no `'unsafe-inline'`, no `'unsafe-eval'`,
and no wildcard origins. `style-src` does carry `'unsafe-inline'` — see below.

## Why `style-src` needs `'unsafe-inline'`

Verified in a headless Chromium run against the dev server, not reasoned about.

An earlier version of this file argued the opposite: that Vite emits no inline
`<style>` block, that React and Motion write styles through the CSSOM
(`node.style.setProperty`), and that CSP therefore does not police them. The
first claim is true. The rest is wrong. With `style-src 'self'` the browser
logs, on every page:

```
Applying inline style violates the following Content Security Policy directive
'style-src 'self''. Either the 'unsafe-inline' keyword, a hash (...), or a
nonce (...) is required to enable inline execution. The action has been blocked.
```

React and Motion apply animation state as inline `style` attributes, and those
are blocked. The visible result is that every entrance animation, the hero
parallax and the arch dividers stop working.

The options were:

| Option | Viable here? |
|---|---|
| `'unsafe-inline'` on `style-src` | Yes — what we do |
| Per-response `nonce` via `MotionConfig` | No — needs a server to generate a nonce per response; GitHub Pages serves static files only |
| Hashes for each style | No — Motion generates style values at runtime, so the set is unbounded |
| Drop the animation library | Rejected — a real design cost for a small hardening gain |

`'unsafe-inline'` on `style-src` is a far weaker concession than on
`script-src`. It permits CSS injection (defacement, and some exfiltration of
attribute values through selectors) but not script execution. `script-src`
keeps no `'unsafe-inline'` and no `'unsafe-eval'`.

If this site ever moves to a host that can set headers per response, switch to
a nonce and drop the keyword.

## Changing the policy

The policy is duplicated in three files and nothing enforces that they agree, so:

1. Edit `index.html`, `netlify.toml`, and `vercel.json` together.
2. Remember `frame-ancestors` belongs in the two header files only.
3. Run `npm run build`, open `dist/index.html`, and confirm the meta tag is there
   and that no new inline `<script>` or `<style>` appeared in the output.
4. Load the built site and check the browser console. CSP violations are reported
   there as "Refused to load/execute ..." messages, and a blocked resource is
   otherwise silent - the page just looks subtly wrong.
