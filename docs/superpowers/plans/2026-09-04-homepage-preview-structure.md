# Homepage Preview Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a four-section homepage (`welcome → about → timeline → contact`) whose About and Contact previews lead to retained standalone pages while Timeline events continue to open dedicated detail pages.

**Architecture:** Keep the existing Astro static-site and Markdown content-collection architecture. Split homepage previews into focused Astro components, centralize their bilingual labels in `ui.ts`, and use stable section IDs for navigation. Preserve the existing publication filters, specialized detail layouts, language persistence, and Cloudflare Pages deployment flow.

**Tech Stack:** Astro 7, TypeScript, CSS, Vitest, Playwright, `@axe-core/playwright`, Cloudflare Pages

## Global Constraints

- Homepage order is exactly `welcome`, `about`, `timeline`, `contact`, then the shared footer.
- Header destinations are `/#welcome`, `/#about`, `/#timeline`, `/resume`, and `/#contact`.
- About and Contact remain standalone pages reached through explicit homepage preview buttons.
- Timeline cards navigate to `/projects/[slug]` or `/experiences/[slug]`; they never expand inline.
- English is the default language, and the selected language persists across anchors and routes.
- Do not author or publish new biography, resume, contact, or project claims.
- When `profile.about` is empty, render the About heading and link but no biography paragraph.
- When no entries are published, render the Timeline heading but no fake cards.
- Reuse the existing Riso visual system and current content-validation rules.

---

## File Map

- Create `src/components/AboutPreview.astro`: render the bilingual homepage About preview and `/about` link.
- Create `src/components/ContactPreview.astro`: render the bilingual homepage Contact preview and `/contact` link.
- Modify `src/components/IntroHero.astro`: identify the Welcoming section and keep hero links within the homepage flow.
- Modify `src/components/SiteHeader.astro`: point navigation at the four homepage anchors plus `/resume`.
- Modify `src/i18n/ui.ts`: define bilingual preview labels and contact invitation copy.
- Modify `src/pages/index.astro`: compose the four homepage sections in the confirmed order.
- Modify `src/styles/global.css`: style preview sections with existing tokens and offset anchored sections below the sticky header.
- Modify `tests/e2e/navigation.spec.ts`: test section order, preview routes, header targets, and blank-content safety.
- Modify `tests/e2e/language.spec.ts`: test language persistence through an anchor and then a standalone preview route.
- Modify `tests/unit/visual-contract.test.ts`: protect the sticky-header anchor offset contract.

---

### Task 1: Compose the Homepage Preview Sections

**Files:**
- Create: `src/components/AboutPreview.astro`
- Create: `src/components/ContactPreview.astro`
- Modify: `src/components/IntroHero.astro:9-31`
- Modify: `src/i18n/ui.ts:3-44`
- Modify: `src/pages/index.astro:1-26`
- Modify: `tests/e2e/navigation.spec.ts:20-34,57-64`

**Interfaces:**
- Consumes: `profile:Record<'en'|'zh',LocalizedProfile>` from `src/data/profile.ts`.
- Consumes: `ui:Record<Language,UiLabels>` from `src/i18n/ui.ts`.
- Produces: homepage sections with stable IDs `welcome`, `about`, `timeline`, and `contact`.
- Produces: `ui.en|zh.readMore`, `ui.en|zh.contactMe`, and `ui.en|zh.contactInvitation` strings.

- [ ] **Step 1: Replace the existing homepage-contact test with a failing composition test**

In `tests/e2e/navigation.spec.ts`, replace the test beginning `home ends with a localized contact call to action` with:

```ts
test('home composes previews in the confirmed order',async({page})=>{
  await page.goto('/');
  const sectionIds=await page.locator('main#main-content>section').evaluateAll(elements=>
    elements.map(element=>element.id)
  );
  expect(sectionIds).toEqual(['welcome','about','timeline','contact']);

  const about=page.locator('#about');
  await expect(about.getByRole('heading',{name:'About',level:2})).toBeVisible();
  await expect(about.getByRole('link',{name:'Read more'})).toHaveAttribute('href','/about');

  const contact=page.locator('#contact');
  await expect(contact.getByRole('heading',{name:'Contact',level:2})).toBeVisible();
  await expect(contact.getByRole('link',{name:'Contact me'})).toHaveAttribute('href','/contact');
});
```

In the blank-shell test, add the following assertion after the two unverified-copy assertions:

```ts
await expect(page.locator('#about [data-about-preview-copy]')).toHaveCount(0);
```

- [ ] **Step 2: Run the focused test and verify the new structure is missing**

Run:

```bash
npx playwright test tests/e2e/navigation.spec.ts --project=chromium --grep "home composes previews|blank shell"
```

Expected: FAIL because `#welcome`, `#about`, and `#contact` do not yet form the required four-section structure, and the About preview link is absent.

- [ ] **Step 3: Add the bilingual preview labels**

In `src/i18n/ui.ts`, extend `UiLabels` with:

```ts
readMore:string;
contactMe:string;
contactInvitation:string;
```

Add these values to `ui.en`:

```ts
readMore:'Read more',
contactMe:'Contact me',
contactInvitation:'Interested in connecting or collaborating?',
```

Add these values to `ui.zh`:

```ts
readMore:'了解更多',
contactMe:'联系我',
contactInvitation:'如果你希望交流或合作，欢迎联系我。',
```

- [ ] **Step 4: Create `AboutPreview.astro`**

Create `src/components/AboutPreview.astro` with:

```astro
---
import {profile} from '../data/profile';
import {ui} from '../i18n/ui';

const englishPreview=profile.en.about[0]?.trim()??'';
const chinesePreview=profile.zh.about[0]?.trim()||englishPreview;
const hasAboutPreview=englishPreview.length>0;
---

<section id="about" class="home-preview page-section" aria-labelledby="about-preview-heading">
  <h2 id="about-preview-heading" class="page-title" data-lang-group>
    <span data-lang="en">{ui.en.about}</span>
    <span data-lang="zh" hidden>{ui.zh.about}</span>
  </h2>
  {hasAboutPreview&&(
    <p class="home-preview__copy" data-about-preview-copy data-lang-group>
      <span data-lang="en">{englishPreview}</span>
      <span data-lang="zh" hidden>{chinesePreview}</span>
    </p>
  )}
  <a class="btn" href="/about">
    <span data-lang-group>
      <span data-lang="en">{ui.en.readMore}</span>
      <span data-lang="zh" hidden>{ui.zh.readMore}</span>
    </span>
  </a>
</section>
```

- [ ] **Step 5: Create `ContactPreview.astro`**

Create `src/components/ContactPreview.astro` with:

```astro
---
import {ui} from '../i18n/ui';
---

<section id="contact" class="home-preview page-section" aria-labelledby="contact-preview-heading">
  <h2 id="contact-preview-heading" class="page-title" data-lang-group>
    <span data-lang="en">{ui.en.contact}</span>
    <span data-lang="zh" hidden>{ui.zh.contact}</span>
  </h2>
  <p class="home-preview__copy" data-lang-group>
    <span data-lang="en">{ui.en.contactInvitation}</span>
    <span data-lang="zh" hidden>{ui.zh.contactInvitation}</span>
  </p>
  <a class="btn btn--primary" href="/contact">
    <span data-lang-group>
      <span data-lang="en">{ui.en.contactMe}</span>
      <span data-lang="zh" hidden>{ui.zh.contactMe}</span>
    </span>
  </a>
</section>
```

- [ ] **Step 6: Identify the Welcoming section and keep hero actions inside the homepage flow**

In `src/components/IntroHero.astro`, change the opening section and three hero links to:

```astro
<section id="welcome" class="intro-hero" aria-labelledby="intro-name">
```

```astro
<nav class="intro-hero__links" aria-label="Introduction links">
  <a class="btn btn--primary" href="#timeline"><span data-lang-group><span data-lang="en">{ui.en.timeline}</span><span data-lang="zh" hidden>{ui.zh.timeline}</span></span></a>
  <a class="btn" href="#about"><span data-lang-group><span data-lang="en">{ui.en.about}</span><span data-lang="zh" hidden>{ui.zh.about}</span></span></a>
  <a class="btn" href="#contact"><span data-lang-group><span data-lang="en">{ui.en.contact}</span><span data-lang="zh" hidden>{ui.zh.contact}</span></span></a>
</nav>
```

- [ ] **Step 7: Compose the homepage in the approved order**

Replace `src/pages/index.astro` with:

```astro
---
import AboutPreview from '../components/AboutPreview.astro';
import ContactPreview from '../components/ContactPreview.astro';
import IntroHero from '../components/IntroHero.astro';
import Timeline from '../components/Timeline.astro';
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Lucas Xin" description="Personal portfolio of Lucas Xin.">
  <IntroHero />
  <AboutPreview />
  <Timeline />
  <ContactPreview />
</BaseLayout>
```

- [ ] **Step 8: Run the focused tests and verify the composition passes**

Run:

```bash
npx playwright test tests/e2e/navigation.spec.ts --project=chromium --grep "home composes previews|blank shell"
```

Expected: 2 passed.

- [ ] **Step 9: Commit the homepage composition**

```bash
git add src/components/AboutPreview.astro src/components/ContactPreview.astro src/components/IntroHero.astro src/i18n/ui.ts src/pages/index.astro tests/e2e/navigation.spec.ts
git commit -m "feat: add homepage about and contact previews"
```

---

### Task 2: Point Navigation to Stable Homepage Anchors

**Files:**
- Modify: `src/components/SiteHeader.astro:11-20`
- Modify: `src/styles/global.css:200-205,338-342,508-527`
- Modify: `tests/e2e/navigation.spec.ts:1-64`
- Modify: `tests/e2e/language.spec.ts:3-12`
- Modify: `tests/unit/visual-contract.test.ts:1-30`

**Interfaces:**
- Consumes: the `welcome`, `about`, `timeline`, and `contact` IDs produced by Task 1.
- Produces: header hrefs `/#welcome`, `/#about`, `/#timeline`, `/resume`, and `/#contact` in that order.
- Produces: a CSS anchor-offset contract covering all four homepage section IDs.

- [ ] **Step 1: Add failing tests for header destinations and anchor offsets**

Add this test to `tests/e2e/navigation.spec.ts`:

```ts
test('header routes visitors through homepage previews',async({page})=>{
  await page.goto('/');
  const hrefs=await page.locator('.site-nav__links>a').evaluateAll(links=>
    links.map(link=>link.getAttribute('href'))
  );
  expect(hrefs).toEqual(['/#welcome','/#about','/#timeline','/resume','/#contact']);
});
```

Add this test to `tests/unit/visual-contract.test.ts`:

```ts
it('offsets every homepage anchor below the sticky header',()=>{
  const css=readFileSync(resolve('src/styles/global.css'),'utf8');
  expect(css).toMatch(/#welcome,\s*#about,\s*#timeline,\s*#contact\s*\{[^}]*scroll-margin-top:/s);
});
```

- [ ] **Step 2: Run both focused tests and verify they fail**

Run:

```bash
npx playwright test tests/e2e/navigation.spec.ts --project=chromium --grep "header routes"
npm test -- --run tests/unit/visual-contract.test.ts
```

Expected: the Playwright test reports the old `/`, `/about`, and `/contact` hrefs; the Vitest file fails because no four-anchor offset rule exists.

- [ ] **Step 3: Update shared-header destinations**

In `src/components/SiteHeader.astro`, keep the brand link as `/` and replace `.site-nav__links` with:

```astro
<div class="site-nav__links">
  <a href="/#welcome"><span data-lang-group><span data-lang="en">{ui.en.home}</span><span data-lang="zh" hidden>{ui.zh.home}</span></span></a>
  <a href="/#about"><span data-lang-group><span data-lang="en">{ui.en.about}</span><span data-lang="zh" hidden>{ui.zh.about}</span></span></a>
  <a href="/#timeline"><span data-lang-group><span data-lang="en">{ui.en.timeline}</span><span data-lang="zh" hidden>{ui.zh.timeline}</span></span></a>
  <a href="/resume"><span data-lang-group><span data-lang="en">{ui.en.resume}</span><span data-lang="zh" hidden>{ui.zh.resume}</span></span></a>
  <a href="/#contact"><span data-lang-group><span data-lang="en">{ui.en.contact}</span><span data-lang="zh" hidden>{ui.zh.contact}</span></span></a>
</div>
```

- [ ] **Step 4: Add sticky-header-safe anchor offsets and preview spacing**

Add this rule near the homepage section styles in `src/styles/global.css`:

```css
#welcome,
#about,
#timeline,
#contact {
  scroll-margin-top: 6rem;
}

.home-preview__copy {
  max-width: 46rem;
}

.home-preview .btn {
  margin-top: 1.25rem;
}
```

- [ ] **Step 5: Verify language persists through an anchor and preview route**

Replace the test in `tests/e2e/language.spec.ts` with:

```ts
test('English defaults and Chinese persists through anchors and routes',async({page})=>{
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang','en');

  await page.getByRole('button',{name:'中'}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');

  await page.locator('.site-nav__links').getByRole('link',{name:'关于'}).click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');

  await page.locator('#about').getByRole('link',{name:'了解更多'}).click();
  await expect(page).toHaveURL('/about');
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
});
```

- [ ] **Step 6: Run the focused navigation, language, and visual-contract tests**

Run:

```bash
npx playwright test tests/e2e/navigation.spec.ts tests/e2e/language.spec.ts --project=chromium
npm test -- --run tests/unit/visual-contract.test.ts
```

Expected: all selected Playwright tests pass; all visual-contract tests pass.

- [ ] **Step 7: Commit navigation and anchor behavior**

```bash
git add src/components/SiteHeader.astro src/styles/global.css tests/e2e/navigation.spec.ts tests/e2e/language.spec.ts tests/unit/visual-contract.test.ts
git commit -m "feat: route navigation through homepage previews"
```

---

### Task 3: Run the Production Gate and Inspect the Result

**Files:**
- Verify: all files changed in Tasks 1-2
- Verify: `tests/e2e/accessibility.spec.ts`
- Verify: generated `dist/`

**Interfaces:**
- Consumes: the completed homepage preview and navigation contracts from Tasks 1-2.
- Produces: a build and test result suitable for pull-request review and Cloudflare Pages deployment.

- [ ] **Step 1: Run formatting and content validation**

Run:

```bash
git diff --check origin/main...HEAD
npm run validate:content
```

Expected: no whitespace errors; output includes `Content validation passed`.

- [ ] **Step 2: Run all unit tests**

Run:

```bash
npm test
```

Expected: all Vitest files and tests pass, including the contrast, canvas-sleep, and anchor-offset contracts.

- [ ] **Step 3: Build the production site**

Run:

```bash
npm run build
```

Expected: content validation passes; Astro reports 0 errors, 0 warnings, and 0 hints; the static routes are generated in `dist/`.

- [ ] **Step 4: Run the complete browser suite**

Run:

```bash
npm run test:e2e
```

Expected: all Chromium and mobile tests pass, including navigation, language, blank-content safety, generated detail routes, keyboard navigation, and serious-accessibility checks.

- [ ] **Step 5: Inspect desktop and mobile output**

Start the built site:

```bash
python -m http.server 4321 --bind 127.0.0.1 --directory dist
```

Inspect `/` at 1440×1000 and 390×844. Confirm:

- section order is Welcoming, About, Timeline, Contact;
- no section heading is hidden under the sticky header after using nav links;
- About and Contact preview actions are visually obvious;
- no unapproved profile or entry copy appears;
- Timeline cards remain usable on mobile;
- the Riso visual system remains intact.

- [ ] **Step 6: Request code review before deployment**

Review the diff from `origin/main` to `HEAD`. Deployment is allowed only when the reviewer reports no Critical or Important findings.

- [ ] **Step 7: Push, open a PR, and verify Cloudflare Pages**

Run:

```bash
git push -u origin feature/homepage-preview-structure
gh pr create --base main --head feature/homepage-preview-structure --title "Add homepage About and Contact previews" --body "Implements the approved homepage preview structure while preserving standalone pages, bilingual behavior, detail routes, and blank-content safeguards."
```

After approval, merge the PR:

```bash
gh pr merge --merge
```

Read the merge commit's Cloudflare Pages check until it reports `completed/success`:

```bash
merge_sha="$(gh pr view --json mergeCommit --jq '.mergeCommit.oid')"
gh api "repos/lucasnotfound59/lucasxl_website/commits/${merge_sha}/check-runs" --jq '.check_runs[] | [.name,.status,.conclusion] | @tsv'
```

Then verify both URLs return the same updated homepage:

```bash
curl -fsSL -H 'Cache-Control: no-cache' https://lucasxl.com/
curl -fsSL -H 'Cache-Control: no-cache' https://lucasxl-website.pages.dev/
```

Expected: both return HTTP-successful HTML containing `id="welcome"`, `id="about"`, `id="timeline"`, and `id="contact"`.
