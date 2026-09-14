// Verified factual content for the site. Everything here is sourced from
// research (Sigma Chi national materials, Wikipedia, WashU Campus Life,
// Student Life reporting, and the colony's public Instagram). Do not add
// invented officer titles, dates, or events — mark gaps explicitly instead.

export const founders = [
  "Thomas Cowan Bell",
  "James Parks Caldwell",
  "Daniel William Cooper",
  "Isaac M. Jordan",
  "William Lewis Lockwood",
  "Benjamin Piatt Runkle",
  "Franklin Howard Scobey",
];

export interface GreatAim {
  key: string;
  title: string;
  body: string;
}

export const threeGreatAims: GreatAim[] = [
  {
    key: "friendship",
    title: "Friendship",
    body:
      "A bond built on genuine loyalty rather than convenience — the belief that brothers are stronger, and better men, together than alone.",
  },
  {
    key: "justice",
    title: "Justice",
    body:
      "A commitment to fairness and integrity in how members treat one another and the wider community — doing right even when no one is watching.",
  },
  {
    key: "learning",
    title: "Learning",
    body:
      "A dedication to scholarship and growth, in and out of the classroom, as a lifelong pursuit rather than a college requirement.",
  },
];

export const nationalFacts = {
  founded: "June 28, 1855",
  foundedLocation: "Miami University, Oxford, Ohio",
  motto: "In Hoc Signo Vinces",
  mottoTranslation: "In this sign you will conquer",
  chapterCount: "roughly 240 undergraduate chapters and about 10 colonies",
  livingAlumni: "approximately 250,000 living alumni",
  philanthropyPartner: "Huntsman Cancer Foundation",
  philanthropySince: "December 2012",
  philanthropyPledged: "more than $31 million pledged nationally as of 2025",
  sweetheartSong: {
    title: "The Sweetheart of Sigma Chi",
    year: "1911",
    authors: "Byron D. Stokes and F. Dudleigh Vernor",
  },
};

// The timeline is authored as plain markdown files (one per entry) under
// src/content/timeline/, so the colony can add or edit history entries
// without touching any component code. See CONTENT-GUIDE.md at the project
// root for instructions aimed at non-developers.
//
// Each file has a small hand-rolled frontmatter block:
//   ---
//   year: 1855
//   heading: Sigma Chi is founded
//   ---
//   Body paragraph text goes here.
//
// Files are sorted by filename, so the numeric prefix (01-, 02-, ...)
// controls chronological order.
const timelineModules = import.meta.glob("/src/content/timeline/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface TimelineEntry {
  year: string;
  heading: string;
  body: string;
}

function parseTimelineEntry(raw: string): TimelineEntry {
  const trimmed = raw.replace(/^﻿/, "").trimStart();
  const delimiter = "---";
  if (!trimmed.startsWith(delimiter)) {
    throw new Error("Timeline markdown file is missing its frontmatter block");
  }

  const afterOpen = trimmed.slice(delimiter.length);
  const closeIndex = afterOpen.indexOf(delimiter);
  if (closeIndex === -1) {
    throw new Error("Timeline markdown file is missing a closing frontmatter delimiter");
  }

  const frontmatterBlock = afterOpen.slice(0, closeIndex);
  const body = afterOpen.slice(closeIndex + delimiter.length).trim();

  const fields: Record<string, string> = {};
  for (const line of frontmatterBlock.split("\n")) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    const colonIndex = trimmedLine.indexOf(":");
    if (colonIndex === -1) continue;
    const key = trimmedLine.slice(0, colonIndex).trim();
    const value = trimmedLine.slice(colonIndex + 1).trim();
    fields[key] = value;
  }

  return {
    year: fields.year ?? "",
    heading: fields.heading ?? "",
    body,
  };
}

export const timeline: TimelineEntry[] = Object.keys(timelineModules)
  .sort()
  .map((path) => parseTimelineEntry(timelineModules[path]));

export const colony = {
  status: "Colony (pre-charter)",
  ifcStatus: "Good Standing with WashU's Interfraternity Council",
  grandPraetor: "Robert Westrich",
  expansionCoordinator: "Ethan Ortiz-Ulibarri",
  coordinatorQuote:
    "Community service, focus more on academics, and more on philanthropy — the entire goal is to make it better.",
  instagram: "@sigmachiwashu",
  instagramBio: "Men join fraternities, leaders of men join Sigma Chi. Est. 1855.",
  note:
    "This is a newly forming colony, not a revival of the former Tau Tau chapter. No previous Tau Tau alumni are part of this founding class, and no chapter size or event calendar is public yet — the colony is still being built.",
};

// Colony officers, supplied directly by the colony (not from public sources).
// Sigma Chi uses Latin officer titles, so each carries a plain-English gloss —
// "Consul" means nothing to a prospective member or their parents.
export interface Officer {
  name: string;
  title: string;
  gloss: string;
  body: string;
}

export const officers: Officer[] = [
  {
    name: "Ben Duke",
    title: "Consul",
    gloss: "President",
    body:
      "Consul is Sigma Chi's title for the chapter president. Ben Duke leads the founding class and is the colony's senior officer as it works toward a charter.",
  },
  {
    name: "Marco Repoulis",
    title: "Pro Consul",
    gloss: "Vice President",
    body:
      "Pro Consul is the vice president, supporting the Consul and standing in when needed. Marco Repoulis holds the role for the founding class.",
  },
  {
    name: "Will Kamp",
    title: "Recruitment Chair",
    gloss: "Recruitment",
    body:
      "Will Kamp runs recruitment for the founding class — the first person most prospective members hear from after getting in touch.",
  },
];

export const university = {
  name: "Washington University in St. Louis",
  campus: "Danforth Campus",
  architectureNote:
    "The Danforth Campus's Collegiate Gothic architecture — designed by Cope & Stewardson beginning in 1899 and inspired by Oxford and Cambridge — sets the visual tone for this site's arches and stonework motifs.",
};
