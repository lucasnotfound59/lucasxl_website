# Timeline content

The homepage starts the visual timeline at 2023. Each card links to its own project or experience page. Desktop cards alternate across a central rail; at narrower widths they use one column.

## Editing an entry

Each folder under `src/content/projects/` or `src/content/experiences/` contains:

- `meta.json`: route slug, template, category, cover, publication status, sort order, optional dates and links.
- `en.md`: English title, summary, image description, and detail text.
- `zh.md`: corresponding Chinese content.

The nine entries cover SOCRATES, EWC, BFIbs-Ensemble, dexterous-hand exploration, FTC, IOAI volunteering, AI Club, NAICT First Prize, and FTC Knowledge Bank. The first five use conservative summaries of existing project records; subsequent entries were added directly at the owner's request. The owner confirmed IOAI responsibilities: robot debugging, explaining code to contestants, and interpreting between contestants and senior technical staff. FTC team responsibilities remain to be filled in. Research raw data, participant information, and unapproved metrics are not included. AI/Coding Bootcamp was removed at the owner's request; AI Club is a separate entry, not a restoration of Bootcamp.

NAICT is a Track 4 team National First Prize dated August 2026, as supplied by the owner. The owner was team captain, responsible for data collection, training an ACT model from scratch on a server, deployment, and debugging. The task involved one robot retrieving goods from supermarket shelves and placing them in a designated area, followed by transfer using a robotic arm. ACT and training from scratch were explicitly confirmed by the owner; no dataset size or performance metrics have been supplied. FTC Knowledge Bank runs from August 2026 to the present. It serves new teammates and AI agents, with Kotlin coding and tool-use guidance; automatic enforcement and performance metrics are not claimed.

AI Club copy reflects the owner's account: co-founder of the school's first AI club, organizing the school's largest AI/CS information hub, and the first student instructor working alongside teachers and peers on introductory AI classes and workshops. No membership figures or session counts have been supplied or added.

Dates confirmed by the owner: FTC September 2025–present; AI Club October 2025–present; dexterous hand January 2026–present; SOCRATES March–August 2026; EWC April 2026; BFIbs-Ensemble June–July 2026; IOAI volunteering August 2026. Entries are sorted by start date, not completion date.

Use `YYYY-MM` for month-level dates or `YYYY-MM-DD` when a day is known. Do not invent a day to store month-only information. For ongoing projects use `ongoing: true` with a start date and no end date; this displays “Present / 至今”. An absent end date alone does not imply ongoing work. Omit `startDate` for unknown dates; these entries appear in “Dates to confirm” after dated entries.

FTC, IOAI, dexterous-hand, and BFIbs-Ensemble entries now use supplied photographs; remaining covers are schematic placeholders. BFIbs-Ensemble includes a separate CMU photo diary, not research-result evidence. About includes the owner's selected sunset photo. See `docs/photo-placement.md` for the source-to-page mapping. Keep meaningful bilingual image descriptions.

## Contact

Edit `src/data/profile.ts` to update the shared Gmail, Outlook, and GitHub links displayed on both the homepage and `/contact`. No phone number or additional social accounts are published.
