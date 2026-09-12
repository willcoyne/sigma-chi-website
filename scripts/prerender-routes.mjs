// Post-build step: GitHub Pages has no SPA rewrite rule. Without this, every
// route except "/" gets served through 404.html and therefore answers with an
// HTTP 404 status — the page still renders once the client router boots, but
// crawlers, link previews, uptime checks and security proxies all read the
// status line and treat the URL as dead. Writing a real index.html at each
// known route makes them answer 200.
//
// Routes are cross-checked against public/sitemap.xml so the two can't drift:
// a route in the router but not the sitemap (or vice versa) fails the build.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const indexPath = join(dist, "index.html");

if (!existsSync(indexPath)) {
  throw new Error(`Expected ${indexPath} to exist — run 'vite build' first.`);
}

const shell = readFileSync(indexPath, "utf8");

const sitemap = readFileSync(join(root, "public", "sitemap.xml"), "utf8");
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/",
);

const app = readFileSync(join(root, "src", "App.tsx"), "utf8");
const routerPaths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((p) => p !== "*");

const missingFromSitemap = routerPaths.filter((p) => !sitemapPaths.includes(p));
const missingFromRouter = sitemapPaths.filter((p) => !routerPaths.includes(p));
if (missingFromSitemap.length > 0 || missingFromRouter.length > 0) {
  throw new Error(
    "Route drift between src/App.tsx and public/sitemap.xml:\n" +
      (missingFromSitemap.length > 0
        ? `  in router but not sitemap: ${missingFromSitemap.join(", ")}\n`
        : "") +
      (missingFromRouter.length > 0
        ? `  in sitemap but not router: ${missingFromRouter.join(", ")}\n`
        : ""),
  );
}

for (const route of routerPaths) {
  if (route === "/") continue;
  mkdirSync(join(dist, route), { recursive: true });
  writeFileSync(join(dist, route, "index.html"), shell);
  console.log(`  prerendered ${route}/index.html -> 200`);
}

// Genuinely unknown paths still fall through to the client router here, and
// this one correctly keeps its 404 status.
writeFileSync(join(dist, "404.html"), shell);
console.log("  wrote 404.html (unknown paths, stays 404)");
