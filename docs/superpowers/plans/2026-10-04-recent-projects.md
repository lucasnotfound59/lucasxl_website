# Recent Portfolio Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the latest SOCRATES abstract, VisitSmoothie and Action Chunking to the bilingual portfolio and verify the local result.

**Architecture:** Content-only additions use Astro's existing metadata and EN/ZH Markdown collections. Existing layout, language switching and generated routes remain unchanged. Updated project copy keeps historical figures and current evidence distinct.

**Tech Stack:** Astro 7, Zod metadata, Markdown, Vitest, Playwright.

**Completed 2026-10-04:** content commit `9961ea7`, final review fixes `35b9395`. Task review approved; final scoped review confirmed all findings addressed. Latest full unit run: 33/33. Final build: zero Astro diagnostics, 16 pages. Actual-content browser checks passed at 1440px and 390px in English and Chinese, including both new timeline links, independent detail navigation, exact authorized abstract, legacy figures, private source labels, loaded covers, event context, neutral engineering label, preserved About sunset, no overflow and no page errors. Local preview is updated; no push or production deployment performed. Existing sunset working-tree changes are preserved separately.

## Global Constraints

- Work in the current directory on a new `codex/` branch, following the owner's existing preference; preserve the dirty homepage sunset changes.
- No push, merge, production deployment or repository visibility changes.
- English default, faithful Chinese counterpart, existing card-to-independent-page navigation.
- Use only authorized sources and project-level aggregate results; no sensitive records or credentials.
- Follow `docs/superpowers/specs/2026-10-04-recent-projects-design.md` and `docs/recent-projects-sources.md` exactly for content boundaries.

### Task 1: Update the three bilingual project stories

**Files:**
- Modify `src/content/projects/socrates/en.md` and `zh.md`.
- Create `src/content/projects/visit-smoothie/{meta.json,en.md,zh.md}`.
- Create `src/content/projects/action-chunking-low-data/{meta.json,en.md,zh.md}`.
- Modify `docs/timeline-content.md` to record the two additions and source/date boundaries.

**Interfaces:** Collections consume the existing meta schema; published project metadata produces `/projects/<slug>/` detail routes and automatic timeline cards. Keep the required research/engineering headings used by `scripts/validate-content.ts`.

- [ ] Read the source note and approved scope, inspect one existing engineering/research entry and the metadata schema.
- [ ] Add SOCRATES's exact revised English abstract and faithful Chinese translation. Explain its 19 English and six Chinese configurations without pooling cohorts; explicitly label the older plots as original analysis, retaining their numerical provenance. Remove the obsolete future Stanford hackathon aspiration and link to VisitSmoothie as a completed collaborative prototype.
- [ ] Add VisitSmoothie engineering content: problem, collaborative responsibilities across modules, pre/post visit workflow, implementation, reported verification versus real-world limitations, local prototype result and lessons. Date `2026-10`, order 10, private-source note, default schematic cover.
- [ ] Add Action Chunking research content: question, relevance, research role/process, protocol and control variables, implemented work versus provisional baseline results, limitations and future work. Date `2026-09`, ongoing true, order 9, private-source note, default schematic cover. Do not use historical one-condition pilot results as completed cross-seed findings.
- [ ] Update timeline documentation; inspect changes for bilingual consistency, dates, sensitive content, false clinical/research claims and broken internal links.
- [ ] Run `npm run validate:content`, `npm test`, and `npm run build`. Expected: content valid, 33 existing unit tests passing, zero Astro diagnostics and 16 published routes. If the known spaced-directory build issue occurs, copy source with absolute-path rsync into a fresh no-space temporary directory and retain the same dependencies.
- [ ] Commit only this task's new or modified files, excluding existing sunset changes, plan/source documents, or unrelated edits. Report the commit and exact validation evidence.

### Controller verification and handoff

- [ ] Run task-scoped read-only review against the task commit; resolve important findings with the implementer.
- [ ] Use the built actual content to check both new timeline links, EN/ZH switching, abstract, images, private-repository labels and desktop/mobile overflow. Reuse existing browser selectors after reconnaissance.
- [ ] Run final read-only review of the new task changes and report local preview URLs, test evidence and unpushed status.
