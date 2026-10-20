# Dark Mode — Starry Sky Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved C 星空 dark theme (near-black paper, low-contrast starfield, System/Light/Dark toggle) on the production Astro site without changing light mode.

**Architecture:** A tiny inline head script resolves the stored mode before paint. A deferred `src/scripts/theme.ts` module owns persistence, `data-theme`, meta colour, and the OS listener. A second `src/scripts/stars.ts` module draws the starfield on a fixed `#stars` canvas and starts/stops from `portfolio:themechange`. Light CSS stays the base; dark differences live in `html[data-theme="dark"]` blocks at the end of `src/styles/global.css`.

**Tech Stack:** Astro 7, TypeScript (strict + `noUncheckedIndexedAccess`), Vitest, Playwright + `@axe-core/playwright`, no new dependencies.

## Global Constraints

- Light mode visual output and the first `--red`/`--paper` declarations in `global.css` must not change.
- Dark tokens are exactly the values in `docs/superpowers/specs/2026-10-20-dark-mode-starry-sky-design.md` §5.1.
- Theme storage key is `lucasxl-theme`; valid values `system`, `light`, `dark`; default `system`.
- No white text in dark; focus ring uses `#8FB4F0`; content images use `brightness(.8) saturate(.9)`.
- The star canvas is `aria-hidden`, non-interactive, pauses when `document.hidden`, and is static under `prefers-reduced-motion: reduce`.
- Do not touch the uncommitted About/photo work or content files.
- Do not commit or deploy without explicit approval.

---

### Task 1: Theme preference module + unit tests

**Files:**
- Create: `src/scripts/theme.ts`
- Test: `tests/unit/theme.test.ts`

**Interfaces:**
- Produces: `type ThemeMode = 'system'|'light'|'dark'`, `type Theme = 'light'|'dark'`, `THEME_STORAGE_KEY`, `THEME_COLORS`, `parseThemeMode(value: string | null): ThemeMode`, `resolveTheme(mode: ThemeMode, systemDark: boolean): Theme`, `applyTheme(mode: ThemeMode, root?: Document): Theme`, `initTheme(root?: Document): void`.
- Consumes: browser `matchMedia`, `localStorage`, `CustomEvent`.

- [ ] **Step 1: Write the failing test**

```ts
import {describe,expect,it} from 'vitest';
import {parseThemeMode,resolveTheme} from '../../src/scripts/theme';

describe('parseThemeMode',()=>{
  it('accepts the three stored modes',()=>{
    expect(parseThemeMode('system')).toBe('system');
    expect(parseThemeMode('light')).toBe('light');
    expect(parseThemeMode('dark')).toBe('dark');
  });
  it('falls back to system for null or unknown values',()=>{
    expect(parseThemeMode(null)).toBe('system');
    expect(parseThemeMode('sepia')).toBe('system');
  });
});

describe('resolveTheme',()=>{
  it('honours explicit light and dark',()=>{
    expect(resolveTheme('light',true)).toBe('light');
    expect(resolveTheme('dark',false)).toBe('dark');
  });
  it('follows the OS in system mode',()=>{
    expect(resolveTheme('system',true)).toBe('dark');
    expect(resolveTheme('system',false)).toBe('light');
  });
});
```

- [ ] **Step 2: Run it and verify it fails**

Run: `npx vitest run tests/unit/theme.test.ts`
Expected: FAIL — cannot resolve `src/scripts/theme`.

- [ ] **Step 3: Implement the module**

```ts
export type ThemeMode='system'|'light'|'dark';
export type Theme='light'|'dark';

export const THEME_STORAGE_KEY='lucasxl-theme';
export const THEME_COLORS:{light:string;dark:string}={light:'#F3EEE3',dark:'#060811'};

export function parseThemeMode(value:string|null):ThemeMode {
  return value==='light'||value==='dark'||value==='system'?value:'system';
}

export function resolveTheme(mode:ThemeMode,systemDark:boolean):Theme {
  if(mode==='system') return systemDark?'dark':'light';
  return mode;
}

export function applyTheme(mode:ThemeMode,root:Document=document):Theme {
  const view=root.defaultView;
  const systemDark=view?.matchMedia('(prefers-color-scheme: dark)').matches??false;
  const theme=resolveTheme(mode,systemDark);
  const html=root.documentElement;
  html.dataset.theme=theme;
  html.dataset.themeMode=mode;
  html.style.colorScheme=theme;
  root.querySelector('meta[name="theme-color"]')?.setAttribute('content',THEME_COLORS[theme]);
  root.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach(button=>{
    button.setAttribute('aria-pressed',String(button.dataset.themeChoice===mode));
  });
  view?.dispatchEvent(new CustomEvent('portfolio:themechange',{detail:{theme,mode}}));
  return theme;
}

export function initTheme(root:Document=document):void {
  const view=root.defaultView;
  if(!view) return;
  const media=view.matchMedia('(prefers-color-scheme: dark)');
  let mode=parseThemeMode(view.localStorage.getItem(THEME_STORAGE_KEY));
  const render=()=>applyTheme(mode,root);
  media.addEventListener('change',()=>{ if(mode==='system') render(); });
  root.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach(button=>{
    button.addEventListener('click',()=>{
      mode=parseThemeMode(button.dataset.themeChoice??null);
      try{view.localStorage.setItem(THEME_STORAGE_KEY,mode);}catch{}
      render();
    });
  });
  render();
}
```

- [ ] **Step 4: Run the unit test**

Run: `npx vitest run tests/unit/theme.test.ts`
Expected: PASS (4 tests).

---

### Task 2: Header theme switch, no-flash boot, and control CSS

**Files:**
- Create: `src/components/ThemeSwitch.astro`
- Modify: `src/components/SiteHeader.astro` (import + wrap controls)
- Modify: `src/layouts/BaseLayout.astro` (meta `theme-color`, inline boot script)
- Modify: `src/styles/global.css` (theme-switch control styles + mobile row)

**Interfaces:**
- Consumes: `initTheme` from Task 1.
- Produces: header markup with `[data-theme-choice]` buttons; `html[data-theme]` set before paint.

- [ ] **Step 1: Add `ThemeSwitch.astro`**

Markup: a `.theme-switch` group with three buttons, inline 16×16 SVGs (half circle / sun / crescent), `aria-label` values `Use system colour theme`, `Use light theme`, `Use dark theme`, and `aria-pressed="false"`. Add:

```astro
<script>
  import {initTheme} from '../scripts/theme';
  initTheme();
</script>
```

- [ ] **Step 2: Put it in the header**

In `SiteHeader.astro`, import `ThemeSwitch` and replace the bare `<LanguageSwitch />` with:

```astro
<div class="site-nav__controls">
  <LanguageSwitch />
  <ThemeSwitch />
</div>
```

- [ ] **Step 3: Add the no-flash boot script**

In `BaseLayout.astro` `<head>`, keep `theme-color` `#F3EEE3`, then add:

```html
<script is:inline>
  (function () {
    try {
      var mode = localStorage.getItem('lucasxl-theme');
      if (mode !== 'light' && mode !== 'dark' && mode !== 'system') mode = 'system';
      var dark = mode === 'dark' ||
        (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var theme = dark ? 'dark' : 'light';
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.themeMode = mode;
      document.documentElement.style.colorScheme = theme;
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', theme === 'dark' ? '#060811' : '#F3EEE3');
    } catch (e) {}
  })();
</script>
```

- [ ] **Step 4: Style the control**

Extend the language-switch rules to `.theme-switch button` (same border, background, hover, pressed). Add `.site-nav__controls { display:flex; align-items:center; gap:1rem; }`. Theme buttons are 32×30px, icon-only, `display:inline-flex; align-items:center; justify-content:center; padding:0;`. Add `.site-nav__controls { align-self:flex-start; }` inside the `max-width: 720px` block and remove the now-redundant `.language-switch { align-self:flex-start; }`.

- [ ] **Step 5: Verify**

Run: `npm run dev -- --host 127.0.0.1` and open `/`. Expected: three icon buttons beside EN/中; clicking Dark sets `html[data-theme="dark"]` immediately; reload keeps it; no white flash on reload with DevTools throttling.

---

### Task 3: Dark tokens and scoped dark overrides

**Files:**
- Modify: `src/styles/global.css` (append after the reduced-motion block)

**Interfaces:**
- Produces: `html[data-theme="dark"]` tokens plus all dark visual rules; `#stars` canvas CSS.
- Consumes: tokens from spec §5.1.

- [ ] **Step 1: Add the dark token block**

```css
html[data-theme="dark"] {
  color-scheme: dark;
  --paper:#060811;
  --surface:#0C101D;
  --paper-deep:#111627;
  --ink:#8A95BA;
  --ink-soft:#7480A4;
  --edge:#39425E;
  --shadow:#03040A;
  --blue:#6C8FD6;
  --red:#A283D6;
  --yellow:#5AAFA5;
  --accent-ink:#060811;
  --highlight:#1A2338;
  --print-blue:#1B2945;
  --print-red:#2A2140;
  --graphic-blue:#182540;
  --graphic-red:#271F3A;
  --graphic-yellow:#152E2E;
  --button-fill:#141A2B;
  --button-hover:#182033;
  --lift:#182033;
  --ghost:#5A6382;
  --focus:#8FB4F0;
}
```

- [ ] **Step 2: Add the scoped dark override block**

Port the approved prototype rules from `output/dark-mode-preview/preview.css` sections "C 深夜" and "C 星空", replacing `html[data-preview-theme="dark"][data-preview-variant="C"][data-preview-depth="deep"]` with `html[data-theme="dark"]` and dropping `data-preview-*` conditions. Cover, at minimum:

- borders: header/footer/sections/navigation/cards/buttons/chips/inputs/images → `var(--edge)`;
- surfaces: cards, buttons, language/theme buttons, chips, timeline labels → `var(--surface)`;
- title shadows → `--print-red`/`--print-blue`; remove glows; page-title highlight → `--highlight`;
- hero circle/triangle/square/stamp → `--graphic-*` / `--print-red`, edges + lift shadows, no glow;
- buttons/contact/entry links/nav cards → neutral surface, `--ink-soft`, edge border, `--lift` offset; hover → `--button-hover`, `--ink`, blue border, larger lift; primary → neutral surface with blue border;
- language + theme buttons: inactive transparent/ink-soft, pressed surface/ink/blue bottom border;
- type/status chips: neutral surface, edge border, 6px `--accent` square via `.entry-type::before`; status transparent;
- timeline: rail/connectors mixed with paper, labels surface, start/end surface, cards `--lift` shadow, hover `--lift` + blue-mixed border, dot no glow;
- content: code/pre/blockquote/hr borders/backgrounds; links blue; preuses surface/ink;
- images: `filter:brightness(.8) saturate(.9)`, edge borders, matte `--paper-deep`, lift shadows; research figure matte `--paper-deep`;
- footer name `--ghost`;
- focus-visible `3px solid var(--focus)`, no halo; selection blue + accent-ink;
- `#bg { display:none; }`, `#stars { display:block; }` + final canvas CSS.

- [ ] **Step 3: Add star canvas base CSS**

```css
#stars {
  position:fixed;
  inset:0;
  z-index:0;
  width:100%;
  height:100%;
  pointer-events:none;
  display:none;
}
html[data-theme="dark"] #stars {
  display:block;
  background:
    radial-gradient(58% 44% at 68% 14%, rgba(53,72,124,.20), transparent 62%),
    radial-gradient(44% 38% at 20% 78%, rgba(78,58,116,.16), transparent 66%),
    linear-gradient(112deg, transparent 33%, rgba(40,55,96,.10) 48%, transparent 63%);
}
```

- [ ] **Step 4: Verify light mode is unchanged**

Run: `npx vitest run tests/unit/visual-contract.test.ts`
Expected: PASS; first `--red`/`--paper` still resolve to the light values.

---

### Task 4: Starfield module + canvas integration

**Files:**
- Create: `src/scripts/stars.ts`
- Modify: `src/layouts/BaseLayout.astro` (add `<canvas id="stars" aria-hidden="true"></canvas>` after `#bg`, add `<script>` importing `initStars`)

**Interfaces:**
- Consumes: `document.documentElement.dataset.theme`, `portfolio:themechange`.
- Produces: `initStars(): void`.

- [ ] **Step 1: Port the starfield**

Port the C 星空 starfield IIFE from `output/dark-mode-preview/preview.js` into `src/scripts/stars.ts`, replacing the preview scene check with `document.documentElement.dataset.theme === 'dark'` and the preview canvas lookup with `document.querySelector<HTMLCanvasElement>('#stars')`. Keep:

- 120–360 stars, three layers, 64% Milky Way bias, palette `#9DB1DC`, `#8FA8D8`, `#A9B7E0`, `#A58ACB`, `#75B3AA`, a few `#C2CBE6` glints;
- slow drift, sine twinkle, pointer parallax, shooting stars (5–11 s first, 8–18 s after);
- 30 fps cap, `document.hidden` pause, DPR cap 2;
- static rendering under reduced motion;
- `sync()` started by `initStars`, `portfolio:themechange`, `matchMedia` change, resize, and visibility;
- no inline `display` toggling — CSS owns visibility; the module only draws while dark.

- [ ] **Step 2: Wire it into `BaseLayout.astro`**

After `#bg`, add `<canvas id="stars" aria-hidden="true"></canvas>`, and at the end of the body:

```html
<script>
  import {initStars} from '../scripts/stars';
  initStars();
</script>
```

Keep the existing dot-canvas script untouched so `visual-contract` still sees `if (maxV < 0.01) {`.

- [ ] **Step 3: Verify**

Run dev, toggle dark. Expected: `#bg` hidden, `#stars` visible with moving stars; light restores dots. Emulate reduced motion → static starfield. Hide the tab for a minute, return → animation resumes.

---

### Task 5: E2E coverage

**Files:**
- Create: `tests/e2e/theme.spec.ts`

**Interfaces:**
- Consumes: accessible names `Use system colour theme`, `Use light theme`, `Use dark theme`.
- Produces: persistence, system-change, axe, and reduced-motion regression coverage.

- [ ] **Step 1: Write the tests**

```ts
import AxeBuilder from '@axe-core/playwright';
import {expect,test} from '@playwright/test';

test('system default follows the OS and dark persists',async({page})=>{
  await page.emulateMedia({colorScheme:'light'});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.getByRole('button',{name:'Use dark theme'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('#stars')).toBeVisible();
  await expect(page.locator('#bg')).toBeHidden();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.getByRole('button',{name:'Use dark theme'})).toHaveAttribute('aria-pressed','true');
});

test('system mode follows OS changes without reload',async({page})=>{
  await page.emulateMedia({colorScheme:'light'});
  await page.goto('/');
  await page.getByRole('button',{name:'Use system colour theme'}).click();
  await page.emulateMedia({colorScheme:'dark'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.emulateMedia({colorScheme:'light'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

test('dark home and entry pages have no serious axe violations',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Use dark theme'}).click();
  for(const path of ['/','/projects/engineering-entry','/about','/contact']){
    await page.goto(path);
    const results=await new AxeBuilder({page}).analyze();
    const serious=results.violations.filter(v=>v.impact==='serious'||v.impact==='critical');
    expect(serious).toEqual([]);
  }
});

test('reduced motion renders a static starfield',async({page})=>{
  await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
  await page.goto('/');
  await page.getByRole('button',{name:'Use dark theme'}).click();
  const first=await page.locator('#stars').evaluate((el:HTMLCanvasElement)=>el.toDataURL());
  await page.waitForTimeout(600);
  const second=await page.locator('#stars').evaluate((el:HTMLCanvasElement)=>el.toDataURL());
  expect(second).toBe(first);
});
```

- [ ] **Step 2: Run the new tests**

Run: `npx playwright test tests/e2e/theme.spec.ts`
Expected: PASS (4 tests, both projects where applicable).

- [ ] **Step 3: Run the complete release gate**

Run: `git diff --check && npm run validate:content && npm test && npm run build && npm run test:e2e`
Expected: all pass.

---

### Task 6: Documentation and final visual check

**Files:**
- Modify: `README.md` (short "Colour theme" section)
- Screenshots (manual): home/entry in light and dark, desktop/mobile, plus a dark mobile header check.

- [ ] **Step 1: Document behaviour**

Add: default System, storage key, three modes, starfield only in dark, reduced-motion static, `theme-color` values, light mode unchanged.

- [ ] **Step 2: Screenshot and compare**

Using Playwright against the dev server, capture `/`, `/projects/socrates`, `/about` at 1440×1000 and 390×844 in light and dark. Confirm:

- no white flash on reload;
- header controls fit on mobile;
- starfield is visible but does not reduce text readability;
- images are dimmed, charts remain legible;
- light screenshots match the pre-change baseline.

- [ ] **Step 3: Report**

Summarise changed files, test commands, and any remaining risks. Do not commit or deploy without approval.

---

## Self-Review

- Spec coverage: theme modes/persistence (§4), palette and starfield (§5), architecture (§6), accessibility/perf (§7), acceptance (§8) all map to Tasks 1–6.
- Placeholder scan: no TBD/TODO; CSS task enumerates concrete selectors and token values; starfield task points to the working prototype code that is being ported.
- Type consistency: `ThemeMode`/`Theme`, `parseThemeMode`, `resolveTheme`, `applyTheme`, `initTheme`, `initStars` used consistently in Tasks 1–5.
