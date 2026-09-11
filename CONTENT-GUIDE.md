# Editing Site Content Without Touching Code

This guide is for colony members who want to update the "How We Got Here" history
timeline on the History page without needing to know React or JavaScript.

## Where the timeline lives

Each entry in the timeline is its own plain-text file in this folder:

```
src/content/timeline/
```

Right now there are five files:

```
01-founding.md
02-tau-tau-chartered.md
03-charter-surrendered.md
04-return-approved.md
05-founding-fathers-begin.md
```

The website automatically reads every `.md` file in that folder and builds the
timeline from them, in filename order. You never need to edit `src/data/content.js`
or any `.jsx` file to change the timeline — just add, edit, or reorder the
markdown files described below.

## Editing an existing entry

1. Open the `.md` file for the entry you want to change (for example,
   `05-founding-fathers-begin.md`) in any plain-text editor.
2. Each file looks like this:

   ```
   ---
   year: 2026
   heading: Founding fathers begin the colony
   ---
   In spring 2026, Sigma Chi begins recruiting its first class of founding
   fathers at WashU — a new colony with no connection to previous Tau Tau
   alumni, building its own culture from the ground up.
   ```

3. Change the text after `year:` or `heading:` to update those fields. Change the
   paragraph below the second `---` line to update the body text.
4. Save the file. That's it — no other files need to change.

## Adding a new entry

1. In `src/content/timeline/`, create a new file named with the next number in
   the sequence, a dash, and a short descriptive name, e.g. `06-first-charter-renewal.md`.
   The number prefix controls where the entry appears in the timeline (entries
   are shown in filename order, so `06-...` will appear after `05-...`).
2. Fill in the file using this exact pattern — a `---` line, then `year:` and
   `heading:` fields, then another `---` line, then the paragraph of body text:

   ```
   ---
   year: 2027
   heading: A short headline for this entry
   ---
   The paragraph of body text describing this milestone goes here. Write it as
   plain text — no special formatting is required.
   ```

3. Save the file. The new entry will automatically show up on the History page
   the next time the site is built/deployed — no code changes needed.

## Removing an entry

Delete the corresponding `.md` file from `src/content/timeline/`. The timeline
will automatically have one fewer entry.

## A few rules to keep things working

- Always start the file with `---` on its own line, followed by `year:` and
  `heading:`, then another `---` on its own line, then the body text below it.
- Keep `year:` and `heading:` each on a single line.
- Don't put a colon (`:`) inside the `year:` or `heading:` value itself — a
  colon is used to separate the field name from its value. A colon inside the
  body paragraph is fine.
- If you're unsure, copy an existing file and edit its contents rather than
  creating one from scratch.

If you make a mistake, the site's build process will simply show a build error
rather than silently displaying broken content, so it's safe to experiment —
just ask a developer to double-check the next build/deploy if you're not sure.
