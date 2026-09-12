import { useEffect } from "react";

// Per-route <title>/<meta> management without a dependency (no react-helmet).
// index.html ships one static title and description for the whole SPA, which
// leaves every route sharing the same page identity — bad for screen reader
// users announcing the document title (WCAG SC 2.4.2), for browser history and
// bookmarks, and for search engines that would otherwise index six identical
// pages. This hook rewrites the handful of head tags that actually differ per
// route, reusing the existing element whenever one is already present so
// navigation never appends duplicates.
//
// Note: the tags are NOT removed on cleanup. Removing them would blank the
// title for a frame between routes; the next route simply overwrites them.

export const SITE_NAME = "Sigma Chi at Washington University in St. Louis";

// The home page keeps index.html's title verbatim rather than taking the
// "<page> | <site>" treatment, so the two never disagree.
export const HOME_DOCUMENT_TITLE =
  "Sigma Chi | Washington University in St. Louis — Beta Colony";

function upsertMeta(attribute: "name" | "property", key: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

/**
 * Sets the document title, description, canonical URL and Open Graph tags for
 * the current route. Call it once at the top of a page component's body.
 *
 * @param title Page-level title, e.g. "Our History". The site name is appended
 *   automatically; pass `HOME_DOCUMENT_TITLE` to use a title verbatim.
 * @param description Roughly 120-160 characters describing this page.
 */
export function useDocumentMeta(title: string, description?: string): void {
  useEffect(() => {
    const fullTitle = title === HOME_DOCUMENT_TITLE ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    upsertMeta("property", "og:title", fullTitle);

    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
    }

    // Canonical/og:url are absolute and query- and hash-free. Trailing slashes
    // are stripped (except at the root) so "/history" and "/history/" resolve
    // to the single URL listed in public/sitemap.xml.
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const url = `${window.location.origin}${path}`;
    upsertCanonical(url);
    upsertMeta("property", "og:url", url);
  }, [title, description]);
}
