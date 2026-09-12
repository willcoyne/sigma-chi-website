// Single source of truth for the site's legal pages (/privacy, /terms,
// /accessibility). Every factual claim below is checked against the code that
// actually ships:
//
//   - src/components/ContactForm.tsx posts to Formspree. The endpoint is set in
//     the committed .env.production, so form delivery is LIVE.
//   - src/lib/analytics.ts loads Plausible only when VITE_PLAUSIBLE_DOMAIN is
//     set. It is not set, so no analytics request is made.
//   - src/components/InstagramEmbed.tsx renders a third-party <iframe> only when
//     VITE_INSTAGRAM_EMBED_URL is set. It is not set, so a plain link renders.
//
// The site sets no cookies and writes nothing to localStorage or sessionStorage.
// If any of the above changes, update this file first — the legal pages read
// from it and nowhere else. Do not add invented names, addresses, or dates.

export const LEGAL_LAST_UPDATED = "September 12, 2026";

// Direct contact address for privacy, accessibility and general legal enquiries.
// This is the colony's shared organisational mailbox, not an individual's — keep
// it that way, since publishing a personal address exposes one member to
// scraping and leaves the route dead when they graduate. Every legal page reads
// this through legalContactRoute(), so changing it here changes all of them.
export const LEGAL_CONTACT_EMAIL: string = "washusigmachichapter@gmail.com";

/**
 * A third party that can receive visitor data from this site, either today or
 * only once the matching environment variable is configured.
 */
export interface DataRecipient {
  /** Display name of the service. */
  name: string;
  /** One-line description of what it does for this site. */
  role: string;
  /** The service's public homepage. */
  url: string;
  /** The service's own privacy policy. */
  privacyUrl: string;
  /** True when the service receives data on the site as it ships today. */
  active: boolean;
  /** Plain-language detail for the privacy page: what it does or would do. */
  detail: string;
}

export const DATA_RECIPIENTS: DataRecipient[] = [
  {
    name: "Formspree",
    role: "Delivers contact form submissions to the colony",
    url: "https://formspree.io",
    privacyUrl: "https://formspree.io/legal/privacy-policy",
    active: true,
    detail:
      "When you submit the contact form, your answers are sent to Formspree, a form-handling service based in the United States. Formspree receives every submission, emails it to the colony's inbox, and keeps a copy in its own account dashboard. This is the only place form data goes, and it is the only third party that receives data from this site today.",
  },
  {
    name: "Plausible Analytics",
    role: "Privacy-focused site analytics — not currently enabled",
    url: "https://plausible.io",
    privacyUrl: "https://plausible.io/privacy",
    active: false,
    detail:
      "This site includes the option to use Plausible, but it is not switched on: no analytics script is loaded and no request is made to Plausible when you visit. If the colony turns it on later, Plausible measures page views without cookies, without collecting personal data, and without tracking visitors across other websites.",
  },
  {
    name: "Instagram feed embed",
    role: "Embedded Instagram feed — not currently enabled",
    url: "https://www.instagram.com",
    privacyUrl: "https://privacycenter.instagram.com/policy",
    active: false,
    detail:
      "The colony's Instagram is linked as an ordinary link, which sends nothing to Meta until you choose to click it. An embedded Instagram feed is supported but is not switched on, so no frame loads today. If it is enabled later it would be served by a third-party embed provider (the setup notes in src/components/InstagramEmbed.tsx point at behold.so or snapwidget.com rather than Meta's own API), and loading that frame would let the provider — and any service it pulls from — set cookies and see your IP address and the page you were on. Because the provider is not chosen yet, this entry must be rewritten with the real one before the embed is switched on.",
  },
];

/** A single field on the contact form in src/components/ContactForm.tsx. */
export interface FormFieldCollected {
  /** The field's `name` attribute as submitted. */
  field: "name" | "email" | "year" | "major" | "heardAbout" | "message";
  /** Label shown next to the field on the form. */
  label: string;
  /** Whether the form refuses to submit without it. */
  required: boolean;
  /** Why the colony asks for it. */
  purpose: string;
}

export const FORM_FIELDS_COLLECTED: FormFieldCollected[] = [
  {
    field: "name",
    label: "Name",
    required: true,
    purpose: "So the member who replies knows who they are writing back to.",
  },
  {
    field: "email",
    label: "Email",
    required: true,
    purpose: "The only way the colony can reply to you.",
  },
  {
    field: "year",
    label: "Year",
    required: true,
    purpose:
      "To know where you are in school, since recruitment information differs by year.",
  },
  {
    field: "major",
    label: "Major",
    required: false,
    purpose:
      "Optional context that helps connect you with members studying something similar.",
  },
  {
    field: "heardAbout",
    label: "How did you hear about us?",
    required: false,
    purpose:
      "Optional feedback that tells the colony which of its outreach efforts are working.",
  },
  {
    field: "message",
    label: "Message",
    required: true,
    purpose: "Whatever you want to ask or tell the colony.",
  },
];

/** How a legal page should point a reader at the colony. */
export interface LegalContactRoute {
  kind: "email" | "form";
  /** A mailto-able address when `kind` is "email", otherwise a site route. */
  value: string;
}

/**
 * Returns the contact route the legal pages should link to, so no page has to
 * hardcode a contact method. Falls back to the site's own contact form while
 * LEGAL_CONTACT_EMAIL is empty.
 */
export function legalContactRoute(): LegalContactRoute {
  if (LEGAL_CONTACT_EMAIL.trim() !== "") {
    return { kind: "email", value: LEGAL_CONTACT_EMAIL };
  }
  return { kind: "form", value: "/contact" };
}
