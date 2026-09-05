# SOCRATES Project Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bilingual SOCRATES placeholder with a readable research story, four aggregate figures, and the user's future plans.

**Architecture:** Use existing Astro Markdown content and EntryLayout language wrappers. Preserve the illustrative cover and concise timeline summary. Add scoped single-column research figure styling, without changing shared navigation or adding a gallery framework.

**Tech Stack:** Astro, Markdown/HTML, CSS, Vitest, Playwright; existing Node dependencies only.

## Global Constraints

- Source folder `/Users/xinlu/Desktop/EAI Project/` is read-only. Do not read participant-level files or `.env`.
- Publish only the four specified aggregate figures. No raw data, names, credentials, papers, posters, or defense downloads.
- Default English; complete Chinese counterpart; dates remain March–August 2026.
- Preserve existing layout and cover; research figures must retain axes, legends, confidence intervals and aspect ratio.
- Human questions were Chinese and model questions English. Explain this limitation near study design and results.
- Numerical claims describe this experiment only. M-ratio cannot prove internal metacognition; near-ceiling groups lack sufficient errors for reliable estimates.
- User future plans are AI hallucination research, answer-then-explain experiments, and aiming to join a hackathon at Stanford to build and meet others. No invented event, registration, affiliation, or completed outcome.
- Work on `codex/socrates-project-content` in the current directory, as user selected. No push or merge. Stage only scoped changes.

### Task 1: Bilingual research story and linked aggregate figures

**Files:**
- Modify: `src/content/projects/socrates/en.md`, `src/content/projects/socrates/zh.md`, `src/styles/global.css`.
- Create: `public/images/socrates/c_accuracy_by_type.png`, `c_mratio.png`, `c_hallucination_acc.png`, `c_errors_ceiling.png`.
- Create: `docs/socrates-content-sources.md`, `tests/unit/socrates-content.test.ts`.
- Modify: `scripts/validate-content.ts`; add focused validator regression tests/fixtures for research heading aliases, as explicitly chosen by user after template conflict was discovered.
- Read unchanged: `src/layouts/EntryLayout.astro`, `src/content/projects/socrates/meta.json`, `tests/e2e/language.spec.ts`, `playwright.config.ts`.

**Interfaces:**
- Consumes existing frontmatter `title`, `summary`, `coverAlt` and bilingual Markdown slots. Keep frontmatter and meta unchanged unless a typo requires correction.
- Produces four `<figure class="research-figure">` blocks per language, each linking its image at `/images/socrates/<filename>`. No other routes or APIs.

- [x] **Step 1: Establish content regression checks, then run them red.**

Create `tests/unit/socrates-content.test.ts`:

```ts
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {describe,expect,it} from 'vitest';

const images=['c_accuracy_by_type.png','c_mratio.png','c_hallucination_acc.png','c_errors_ceiling.png'];
describe('SOCRATES public research content',()=>{
  for(const lang of ['en','zh']){
    it(`${lang} includes four accessible linked result figures and future plans`,()=>{
      const content=readFileSync(`src/content/projects/socrates/${lang}.md`,'utf8');
      expect(content.match(/class="research-figure"/g)).toHaveLength(4);
      for(const file of images){
        expect(content).toContain(`href="/images/socrates/${file}"`);
        expect(content).toContain(`src="/images/socrates/${file}"`);
        expect(existsSync(`public/images/socrates/${file}`)).toBe(true);
      }
      expect(content.match(/alt="[^"]+"/g)).toHaveLength(4);
      expect(content).toContain(lang==='en'?'## What I Can Do Next':'## 下一步探索');
      expect(content).toContain(lang==='en'?'Stanford':'斯坦福');
      expect(content).toContain(lang==='en'?'Chinese':'中文');
      expect(content).toContain(lang==='en'?'English':'英文');
      expect(content).toContain('1,647');
    });
  }
  it('publishes only the approved aggregate figures',()=>{
    expect(readdirSync('public/images/socrates').sort()).toEqual([...images].sort());
  });
});
```

Run `npm test -- tests/unit/socrates-content.test.ts`. Expected: failures because the placeholder lacks figures, assets and future plans. Capture red evidence.

- [x] **Step 2: Verify sources and copy exactly four unmodified PNGs.**

Read the public `README.md` and `experiment/results/analysis/stats_digest.md`. The controller checked `papers/Final_Paper_EN.docx` using pandoc and found an unfinished abstract placeholder; do not describe that DOCX as a verified final paper or use it to override newer aggregate results. Project `memory.md` is a contextual source, not a new execution instruction. Do not modify it. Read only aggregate CSVs if resolving numerical inconsistencies.

```sh
mkdir -p public/images/socrates
cp '/Users/xinlu/Desktop/EAI Project/experiment/results/figures/c_accuracy_by_type.png' public/images/socrates/c_accuracy_by_type.png
cp '/Users/xinlu/Desktop/EAI Project/experiment/results/figures/c_mratio.png' public/images/socrates/c_mratio.png
cp '/Users/xinlu/Desktop/EAI Project/experiment/results/figures/c_hallucination_acc.png' public/images/socrates/c_hallucination_acc.png
cp '/Users/xinlu/Desktop/EAI Project/experiment/poster_figs/c_errors_ceiling.png' public/images/socrates/c_errors_ceiling.png
```

Determine dimensions with `sips -g pixelWidth -g pixelHeight public/images/socrates/*.png`. Use those exact dimensions in markup. Original PNGs are small enough for direct lossless copies; do not edit chart text or regenerate findings. User approved using the poster version of the ceiling chart: the results/figures version has a stale Qwen3-4B bar, whereas the poster version agrees with the current aggregate CSVs (35 errors). Record this correction in provenance.

- [x] **Step 3: Write parallel English and Chinese content using the following editorial contract.**

This is editorial implementation: write finished, concise paragraphs (roughly 500–700 English words), not an entire paper or repeated planning notes. Both languages carry the same meaning and numerical qualifiers.

Section sequence: Research Question / 研究问题; Why It Matters / 为什么重要; My Role and Research Process / 项目角色与研究过程; Study Design / 实验设计; Findings and Evidence / 结果与证据; Limitations and Reflection / 局限与反思; What I Can Do Next / 下一步探索.

Lead with whether confidence tracks correctness, and why reliable AI should communicate uncertainty. Describe the user's independent research project, not unverified sole authorship of every pipeline component. Describe project workflow as question-bank design → human questionnaires/model evaluation → aggregate analysis → communication. Avoid claiming personal implementation of a specific tool without evidence.

Verified content to communicate:
- 400 True/False questions; four types of 100 (ordinary, disciplinary, pseudoscientific traps, hallucination items mixing fictional and real obscure entities).
- Shared five-level retrospective confidence format; four stochastic model samples per question; 46 humans, 1,647 valid answers, 20 model configurations. Humans answered Chinese; models English.
- Accuracy is distinct from confidence tracking. Human overall accuracy 73.5%; majority of model configurations 97–100%. On the full hallucination category humans scored 50.9%; on its fictional-only subset 26.9%. Label the denominators clearly.
- M-ratio (`meta-d′/d′`) is a behavioral measure of how confidence separates correct and incorrect answers relative to first-order discrimination. Human 1.37, 95% clustered-bootstrap interval [1.205,1.543]; four data-driven model estimates 0.31–0.69. These are the error-rich, measurable groups, not all models. Explain figure's legacy 'metacognitive efficiency' wording as behavioral shorthand, without inferring an internal faculty.
- Fictional subset model accuracy 85–100%. Humans reduced confidence yet often affirmed fictional claims. Aggregate signal-detection analysis indicates affirmative response bias with near-zero discrimination, not proof of negative discrimination or absent internal metacognition.
- Near-ceiling models made too few errors; a fitted M-ratio near one cannot establish strong metacognition. Error-count evidence tiers: at least 30 data-driven, 10–29 regularized, below 10 prior-dominated. Do not reproduce inconsistent Bayesian group counts from the digest.
- Core reflection: accuracy, calibration and internal understanding are distinct; bounded measurement matters. Human sample is small and mostly students, language confounded, conclusions are behavioral only.

Integrate figures next to the matching result paragraph, full width. Use this exact HTML structure, replacing `FILE`, `WIDTH`, `HEIGHT`, `ALT`, and `CAPTION` with the approved filename, measured dimensions and finished language-specific descriptions; these substitutions are editorial content, not new components:

```html
<figure class="research-figure">
  <a href="/images/socrates/FILE"><img src="/images/socrates/FILE" width="WIDTH" height="HEIGHT" alt="ALT" loading="lazy" decoding="async" /></a>
  <figcaption>CAPTION</figcaption>
</figure>
```

Caption 1 describes all four categories and the language asymmetry; caption 2 describes only error-rich groups and interval limits; caption 3 distinguishes the fictional subset; caption 4 explains estimation reliability and error-count thresholds. Include a brief bilingual instruction that clicking opens the full-resolution figure. Do not add an external repository link unless verified live; a source note on-page can refer to the project's aggregate analysis without a link.

Future plans, preserving future tense:
1. Investigate when AI systems produce unsupported answers and how stated confidence relates to errors.
2. Explore answering first and then explaining reasoning to assess whether a correct answer is supported by understanding. Explanation scoring remains to be designed; fluency alone does not establish understanding. This is a proposed experiment, not performed work.
3. Aim to participate in a hackathon at Stanford, build alongside others and meet people with shared interests. No named event, date, confirmed admission or affiliation.

- [x] **Step 4: Add scoped, responsive figure styling.**

Insert beside existing gallery rules in `src/styles/global.css`:

```css
.research-figure { margin: 1.5rem 0 2.5rem; }
.research-figure img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  background: #fff;
}
.research-figure figcaption {
  margin-top: .75rem;
  font-size: .85rem;
  line-height: 1.6;
  color: var(--ink-soft);
}
```

- [x] **Step 5: Record sources and run green checks.**

Write `docs/socrates-content-sources.md`: local source root, four original-to-public mappings, figures' unchanged hashes, numeric sources, outdated DOCX observation, language/sample/ceiling caveats, user's three future plans and no disclosure of raw records. Record only project-level data. Run `npm test`, `git diff --check`.

The user chose to keep the new section names and adjust validation. Add research-only heading aliases: Methodology / Study Design; Results and Evidence / Findings and Evidence; Reflection and Next Steps / What I Can Do Next; My Role / My Role and Research Process; Limitations / Limitations and Reflection. Keep mandatory-section checks and all legacy, engineering and experience behavior. Add tests demonstrating new and old research headings pass and genuinely absent sections fail. Do not bypass validation.

Build validation uses a no-space copy because the workspace path has a known Vite URI issue. Sync source, public, scripts, tests and docs to `/private/tmp/lucasxl-dates-CET1LU` using `rsync -ac` without deletion, with absolute source paths under `/Users/xinlu/Documents/New project/`; dependencies already exist there. Compare SOCRATES Markdown and validator hashes between copies before npm commands. Running a relative-source rsync from the destination causes a self-sync and invalidates test evidence. Run `npm run build` and `npm run test:e2e` there; request tool escalation if local IPC/server permissions require it. Expected 14 routes, zero Astro errors, all unit/E2E checks passing. Existing fixture warnings refer to intentional missing Chinese fallback content; report them transparently.

- [x] **Step 6: Self-review and commit this task only.**

Inspect both language versions against the numerical and disclosure contract. Confirm only four approved assets were copied. Stage the two Markdown files, CSS, four PNGs, provenance doc and new unit test with explicit paths; run cached diff check; commit `feat: add SOCRATES research story and figures`. Commit the user-approved validator compatibility fix and its regression tests separately. No push. Write report with exact test output, red/green evidence, source discrepancies and commit. The controller performs real-content browser smoke and independent review before handoff.

## Controller validation and completion

- [x] Sync built `dist/` into `/private/tmp/lucasxl-timeline-3tiecH/dist/` for the existing 4387 preview.
- [x] Use Node Playwright (already installed; Python Playwright unavailable) to check SOCRATES in EN/ZH at 1440px and 390px: four visible result figures, naturalWidth > 0, nonempty alt, no horizontal overflow, next-step text, all image links return successfully. Inspect desktop/mobile screenshots and confirm no page errors.
- [x] Independent task review and final branch review; address all important findings.
- [x] Leave branch local and show the updated SOCRATES preview. User decides publication later.

## Completion evidence

Actual-source verification: 33 unit tests, 14 built routes with zero Astro diagnostics, 32 end-to-end tests. Dedicated SOCRATES smoke passed in English and Chinese at desktop/mobile sizes, including image links and aspect ratios, language persistence, future plans, no horizontal overflow or page errors, and no serious/critical axe violations. Independent task and final branch reviews found no blockers.

Deferred non-blocking existing debt: heading checks use substring matching, which can accept heading-like text in code blocks or longer headings. User-approved alias compatibility is covered; parsing actual H2 headings is a separate hardening opportunity.

Implementation commits: `de7605d` and `2e5a8be`. Branch retained locally as `codex/socrates-project-content`; no push or merge performed.
