# Timeline content

The homepage starts the visual timeline at 2023. Each card links to its own project or experience page. Desktop cards alternate across a central rail; at narrower widths they use one column.

## Editing an entry

Each folder under `src/content/projects/` or `src/content/experiences/` contains:

- `meta.json`: route slug, template, category, cover, publication status, sort order, optional dates and links.
- `en.md`: English title, summary, image description, and detail text.
- `zh.md`: corresponding Chinese content.

The first six entries are conservative summaries of existing project records: SOCRATES, EWC, BFIbs-Ensemble, dexterous-hand exploration, FTC, and AI/Coding Bootcamp preparation. They are not assertions of current completion or new results. Bootcamp delivery and FTC responsibilities remain unconfirmed. Research raw data, participant information, and unapproved metrics are not included.

Project start dates were not established by these records. Omit `startDate` until a real date is known; the entry appears in “Dates to confirm” after dated entries. Do not use a document creation date or a planning deadline as the project date. Add a confirmed `startDate` in `YYYY-MM-DD` format to move an entry into chronological year grouping. `endDate` is optional and requires a start date.

The six covers are schematic SVG illustrations, not project photographs. Replace them with approved photographs or figures when available. Keep meaningful bilingual image descriptions.

## Contact

Edit `src/data/profile.ts` to update the shared Gmail, Outlook, and GitHub links displayed on both the homepage and `/contact`. No phone number or additional social accounts are published.
