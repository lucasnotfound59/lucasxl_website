# Blank-Shell Content State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unverified generic biography copy from the live portfolio while preserving its completed structure and deployment workflow.

**Architecture:** The existing profile data remains the single source of identity copy. Empty English identity and introduction strings suppress their corresponding home-page blocks, while the name, navigation, section headings, empty timeline, and static pages remain available.

**Tech Stack:** Astro 7.2.10, TypeScript, Vitest, Playwright, Cloudflare Pages.

## Global Constraints

- Keep the name `Lucas Xin` visible.
- Keep global navigation, the language switch, page titles, timeline heading, contact call to action, and footer.
- Do not publish identity, introduction, About copy, project entries, experience entries, email, or GitHub contact values until verified content is supplied.
- Do not render empty identity or introduction paragraphs.
- English remains the default language and Chinese remains on the same URL.
- The existing Pages project and `lucasxl.com` deployment configuration remain unchanged.

---

### Task 1: Publish the Blank-Shell Profile State

**Files:**
- Modify: `src/data/profile.ts`
- Modify: `src/components/IntroHero.astro`
- Modify: `tests/e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: `profile.en.identity`, `profile.zh.identity`, `profile.en.introduction`, and `profile.zh.introduction`
- Produces: a home page that omits absent identity and introduction blocks without changing routes or the language controller

- [ ] **Step 1: Add a failing browser regression**

Append this test to `tests/e2e/navigation.spec.ts`:

```ts
test('blank shell does not publish unverified biography',async({page})=>{
  await page.goto('/');
  await expect(page.getByText('Student researcher and builder')).toHaveCount(0);
  await expect(page.getByText('Exploring artificial intelligence, robotics, and computational research.')).toHaveCount(0);
  await expect(page.locator('.intro-hero>p')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Lucas Xin',level:1})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Timeline',level:2})).toBeVisible();
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
npx playwright test tests/e2e/navigation.spec.ts --project=chromium --grep "blank shell"
```

Expected: FAIL because the generic identity and introduction are still rendered.

- [ ] **Step 3: Clear the unverified profile copy**

In `src/data/profile.ts`, keep both names and replace the identity and introduction values with empty strings:

```ts
export const profile:Record<'en'|'zh',LocalizedProfile>={
  en:{
    name:'Lucas Xin',
    identity:'',
    introduction:'',
    about:[]
  },
  zh:{
    name:'Lucas Xin',
    identity:'',
    introduction:'',
    about:[]
  }
};
```

Keep `contact` unchanged as an empty object.

- [ ] **Step 4: Suppress absent hero blocks**

In the frontmatter of `src/components/IntroHero.astro`, add:

```ts
const hasIdentity=profile.en.identity.trim().length>0;
const hasIntroduction=profile.en.introduction.trim().length>0;
```

Render the existing bilingual identity paragraph only inside `{hasIdentity&&(...)}` and the existing bilingual introduction paragraph only inside `{hasIntroduction&&(...)}`. Keep the heading and navigation unchanged.

- [ ] **Step 5: Verify the focused behavior**

Run:

```bash
npx playwright test tests/e2e/navigation.spec.ts --project=chromium --grep "blank shell"
```

Expected: one passing test; the name and timeline remain visible and no hero paragraphs render.

- [ ] **Step 6: Run the complete release gate**

Run:

```bash
git diff --check
npm run validate:content
npm test
npm run build
npm run test:e2e
```

Expected: content validation passes, 17 unit tests pass, the static build succeeds, and all desktop/mobile browser tests pass with the new regression included.

- [ ] **Step 7: Commit and deploy**

Run:

```bash
git add src/data/profile.ts src/components/IntroHero.astro tests/e2e/navigation.spec.ts
git commit -m "content: publish blank portfolio shell"
git push origin main
```

Expected: Cloudflare Pages automatically deploys the new `main` commit to `lucasxl.com`.
