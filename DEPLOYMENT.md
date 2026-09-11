# Deployment Guide

This document walks through three ways to deploy this site: **Vercel**,
**Netlify**, and **GitHub Pages**. The config files for all three already
exist in this repo (`vercel.json`, `netlify.toml`,
`.github/workflows/deploy-gh-pages.yml`), so most of the work below is
account/dashboard setup rather than code changes.

## Before you start (prerequisites you must do yourself)

None of this can be automated by an assistant working in this checkout —
each step below requires your own accounts/credentials and, in the case of
GitHub Pages, control of the actual repository:

1. **This project is not yet a git repository.** There is no `.git`
   directory here. Before any of the three deployment options will work,
   you need to:
   - Run `git init` in the project root.
   - Create a new (empty) repository on GitHub (or another host).
   - Add it as a remote (`git remote add origin <url>`) and push your
     initial commit (`git push -u origin main`).
2. **Connecting Vercel or Netlify to your repo requires signing into that
   provider's dashboard with your own account.** There is no CLI or config
   file that can create the account/link the repo for you — you'll click
   "Import Project" (Vercel) or "Add new site" (Netlify) and authorize
   access to your GitHub account interactively in the browser.
3. **A custom domain is configured in the provider's dashboard**, under
   that project's Domains/DNS settings (Vercel: Project → Settings →
   Domains; Netlify: Site configuration → Domain management; GitHub Pages:
   repo Settings → Pages → Custom domain). This always happens on the
   provider's site, using your own DNS registrar, and can't be scripted
   from this repo.

Once the repo exists on GitHub, pick one of the options below.

---

## Option A: Vercel

Config file: [`vercel.json`](./vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The `rewrites` rule is required because this app uses React Router's
`BrowserRouter` for client-side routing (`/history`, `/values`, `/colony`,
`/philanthropy`, `/contact`, etc.). Without it, a hard refresh or a direct
link to one of those routes would 404, since no actual `/history/index.html`
file exists in the build output — Vercel needs to always serve
`/index.html` and let React Router handle the route on the client.

Steps:

1. Push this repo to GitHub (see prerequisites above).
2. Go to https://vercel.com and sign in (or create an account) with GitHub.
3. Click **Add New… → Project** and select this repository.
4. Vercel should auto-detect the Vite framework preset. Confirm the build
   settings match `vercel.json` (build command `npm run build`, output
   directory `dist`) — they're read from this file automatically, so you
   normally don't need to change anything.
5. Click **Deploy**. Vercel will build and host the site at a generated
   `*.vercel.app` URL.
6. (Optional) Add a custom domain under **Project → Settings → Domains**
   and follow Vercel's DNS instructions for your registrar.
7. Every subsequent `git push` to the connected branch triggers a new
   deployment automatically.

---

## Option B: Netlify

Config file: [`netlify.toml`](./netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The `[[redirects]]` block is the Netlify equivalent of the Vercel rewrite
above — it's the SPA fallback that keeps client-side routes from 404ing on
a hard refresh.

Steps:

1. Push this repo to GitHub (see prerequisites above).
2. Go to https://app.netlify.com and sign in (or create an account) with
   GitHub.
3. Click **Add new site → Import an existing project** and select this
   repository.
4. Netlify reads the build command and publish directory from
   `netlify.toml` automatically — confirm they show `npm run build` and
   `dist` and click **Deploy site**.
5. Netlify will build and host the site at a generated `*.netlify.app`
   URL.
6. (Optional) Add a custom domain under **Site configuration → Domain
   management** and follow Netlify's DNS instructions for your registrar.
7. Every subsequent `git push` to the connected branch triggers a new
   deployment automatically.

---

## Option C: GitHub Pages

Workflow file:
[`.github/workflows/deploy-gh-pages.yml`](./.github/workflows/deploy-gh-pages.yml)

This workflow builds the site with `npm run build` on every push to `main`
and publishes the resulting `dist/` folder to GitHub Pages using the
standard `actions/upload-pages-artifact` + `actions/deploy-pages` actions
(no third-party account needed — it uses GitHub's own Pages product).

Steps:

1. Push this repo to GitHub (see prerequisites above) with the default
   branch named `main` (the workflow triggers on pushes to `main`; edit
   the `branches:` list in the workflow file if your default branch is
   named something else).
2. In the GitHub repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**
   (not "Deploy from a branch"). This lets the workflow file drive the
   deployment.
4. Push (or re-push) to `main`. The **Deploy to GitHub Pages** workflow
   will run automatically under the **Actions** tab, build the app, and
   deploy it.
5. Once the workflow finishes, the site URL will be shown both in the
   workflow's summary and under **Settings → Pages**. It typically looks
   like `https://<your-username>.github.io/<repo-name>/`.
6. (Optional) Add a custom domain under **Settings → Pages → Custom
   domain** and follow GitHub's DNS instructions for your registrar.

### Important GitHub Pages caveat: the `base` path

Unlike Vercel/Netlify (which serve the site from the domain root), a
GitHub Pages *project* site is served from a subpath —
`https://<username>.github.io/<repo-name>/` — unless you've configured a
custom domain or an org/user page (`<username>.github.io` repo). Vite
builds asset URLs assuming the site is served from `/` by default, so if
you deploy to a project subpath you will likely need to set the `base`
option in `vite.config.js` to match, e.g.:

```js
export default defineConfig({
  plugins: [react()],
  base: '/sigma-chi-website/', // match your actual repo name
})
```

This repo's `vite.config.js` does not currently set `base`, since that is
a source-file change outside the scope of this deployment-config task —
add it yourself (matching your repository name) if you choose the GitHub
Pages option and see broken asset paths (blank page, 404s for `/assets/*`
in the browser console) after deploying to a project subpath. This isn't
needed for Vercel or Netlify, and isn't needed for GitHub Pages either if
you're using a custom domain or a `<username>.github.io` root-level repo.

React Router's `BrowserRouter` also needs to know about that same subpath
so that in-app links resolve correctly; if you add `base` above, also pass
a matching `basename` prop to `BrowserRouter` in `src/App.jsx`.

### SPA routing on GitHub Pages

GitHub Pages has no built-in rewrite rule like Vercel/Netlify, so
client-side routes (`/history`, `/values`, etc.) would 404 on a hard
refresh by default. If you go with this option and run into that, the
common fix is the "404.html trick" — add a `public/404.html` that
redirects back into `index.html` with the intended path encoded in a query
string, decoded by a small script in `index.html`. That extra file isn't
included here since it's a source/public-folder change outside this task's
scope.

---

## Summary comparison

| | Vercel | Netlify | GitHub Pages |
|---|---|---|---|
| Config file | `vercel.json` | `netlify.toml` | `.github/workflows/deploy-gh-pages.yml` |
| SPA fallback | `rewrites` | `[[redirects]]` | Requires manual 404.html trick |
| Account needed | Vercel | Netlify | None (uses GitHub itself) |
| Subpath issues | None | None | Needs `base`/`basename` for project pages |
| Auto-deploy on push | Yes | Yes | Yes (via the included workflow) |
