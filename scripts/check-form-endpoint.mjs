// Build guard: the contact form only posts anywhere if
// VITE_FORMSPREE_ENDPOINT was set when Vite ran. When it is missing, Vite
// tree-shakes the whole fetch branch out and the form shows a success message
// while discarding the submission — a failure that is invisible in the UI and
// was live on the production site for weeks.
//
// Assert against the built bundle rather than the source, because the source
// is identical either way. The bundle is the only place the difference shows.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(root, "dist", "assets");

const bundles = readdirSync(assets).filter((f) => f.endsWith(".js"));
const combined = bundles.map((f) => readFileSync(join(assets, f), "utf8")).join("");

if (!/https:\/\/formspree\.io\/f\/\w+/.test(combined)) {
  throw new Error(
    "Contact form has no delivery endpoint in the built bundle.\n" +
      "  VITE_FORMSPREE_ENDPOINT was unset or empty when Vite ran, so the form\n" +
      "  would show a success message and silently discard every submission.\n" +
      "  Set it in .env.production. Note that an empty environment variable\n" +
      "  overrides that file, so make sure nothing exports it as empty.",
  );
}

console.log("  contact form endpoint present in bundle");
