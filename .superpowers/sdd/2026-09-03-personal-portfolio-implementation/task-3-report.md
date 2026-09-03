# Task 3: Content Query Service

## Delivered

- Added `src/lib/content.ts`, which loads published project and experience metadata with their English and optional Chinese copies, validates slug-to-directory alignment, and exposes `PortfolioEntry`, `getPortfolioEntries()`, and `getTimelineGroups()`.
- Added `neighborsFor()` to `src/lib/portfolio.ts`; it consistently orders entries before returning chronological neighbors.
- Added unit coverage for chronological neighbors and single-entry edges.

## TDD evidence

- Red: `npm test -- tests/unit/portfolio.test.ts` failed with `TypeError: neighborsFor is not a function` after the new neighbor tests were added.
- Green: the same focused suite passed after the minimal `neighborsFor()` implementation.

## Verification

- `npm test -- tests/unit/portfolio.test.ts` — 5 passing tests.
- `npm test` — 5 passing tests.
- `npm run build` — completed successfully; draft collection examples were excluded and no missing-English-copy error occurred. Astro Check reported 20 existing Zod deprecation hints in `src/content.config.ts`, with zero errors.
