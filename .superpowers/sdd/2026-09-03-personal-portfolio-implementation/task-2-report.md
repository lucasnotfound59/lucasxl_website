# Task 2 Report: Content Types, Schemas, and Author Templates

## Outcome

Implemented the validated content contract for portfolio projects and experiences.

## Delivered

- Added `EntryMeta`, `EntryKind`, `TemplateKind`, `PublicationStatus`, `EntryLink`, and `TimelineGroup` types.
- Added pure `compareEntries()`, `groupEntriesByYear()`, and `routeFor()` utilities.
- Added four Astro content collections for project/experience metadata and localized Markdown copy.
- Enforced metadata formats, links, image-cover paths, chronological dates, and valid kind/template combinations.
- Added build-valid draft examples under `src/content`, plus research, engineering, and experience authoring templates outside the public content directory.
- Replaced the scaffold smoke test with coverage of ordering, chronological grouping, and routes.

## Validation

- `npm test -- tests/unit/portfolio.test.ts`: 3 passing tests.
- `npm run build`: passed; Astro validated all collections and generated only `dist/index.html` as the page route.
- `npm test`: 3 passing tests.
- `git diff --check`: passed.

## Concerns

`astro check` reports 20 Zod deprecation hints for the prescribed `z` schema API, but no errors or warnings. The implementation intentionally preserves the exact schema imports and API required by the task brief.
