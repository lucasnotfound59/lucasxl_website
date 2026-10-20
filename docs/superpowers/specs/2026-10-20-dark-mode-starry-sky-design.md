# Dark Mode — Starry Sky Design

**Status:** approved 2026-10-20
**Prototype:** `output/dark-mode-preview/` (throwaway; not production)

## 1. Summary

Add a first-class dark theme to the Astro portfolio, using the approved **C 星空**
direction from the prototype: a near-black night sky, a low-contrast starfield with
slow drift / twinkle / pointer parallax / rare shooting stars, and the existing Riso
typography and geometry left intact.

Light mode remains visually unchanged. The theme preference has three modes —
**System**, **Light**, **Dark** — defaults to System, persists across routes, and is
applied before first paint.

## 2. Goals

- A visitor on a dark OS sees the site in the starry theme on first paint, with no
  white flash.
- A visitor can choose System / Light / Dark from the header; the choice persists.
- The dark theme is recognisably the same Riso site, not a generic dark skin.
- High-contrast colour and bright whites are used only where function requires:
  body copy, links, focus, primary action, hover/active feedback.
- Reduced-motion visitors get a static starfield with the same composition.
- No layout, content, route, language, or light-mode regressions.

## 3. Non-Goals

- No content changes, new pages, deployment, or Cloudflare configuration.
- No change to the light palette, typography, spacing, or artwork.
- No animated intro, no audio, no canvas recording.
- No automatic per-section theming; one theme per document.

## 4. User Experience

### 4.1 Theme control

The header gets a compact 3-button switch next to the language switch:

| Button | Accessible name | Stored value |
| --- | --- | --- |
| half-filled circle | Use system colour theme | `system` |
| sun | Use light theme | `light` |
| crescent | Use dark theme | `dark` |

- `aria-pressed` marks the **stored mode**, not the resolved theme. In System mode the
  system button stays pressed whether the resolved theme is light or dark.
- The switch is visible in both themes and uses the same border/shadow language as
  the language switch.
- On mobile the controls sit in their own row under the nav.

### 4.2 Persistence and resolution

- Storage key: `lucasxl-theme`; values `system`, `light`, `dark`; anything else is
  treated as `system`.
- Resolution: `light` → light; `dark` → dark; `system` → `prefers-color-scheme`.
- An inline `<head>` script resolves and writes `data-theme` + `color-scheme` +
  `theme-color` before the body paints. A deferred module then binds the buttons,
  re-applies the mode, and listens for OS changes while in System mode.
- The `theme-color` meta is `#F3EEE3` in light and `#060811` in dark.

## 5. Visual Design

### 5.1 Dark palette (C 星空)

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#060811` | page ground |
| `--surface` | `#0C101D` | cards, buttons, chips |
| `--paper-deep` | `#111627` | code, image matte |
| `--ink` | `#8A95BA` | primary text (6.3:1 on paper) |
| `--ink-soft` | `#7480A4` | secondary text (4.9:1 on paper) |
| `--edge` | `#39425E` | decorative borders (≈2:1) |
| `--lift` | `#182033` | hard-offset shadows |
| `--blue` | `#6C8FD6` | links, category dot, focus-adjacent accents |
| `--red` | `#A283D6` | secondary accent, hover |
| `--yellow` | `#5AAFA5` | selection/marker accent |
| `--highlight` | `#1A2338` | title highlight band |
| `--print-blue` | `#1B2945` | dark offset shadow on display type |
| `--print-red` | `#2A2140` | dark offset shadow / stamp |
| `--graphic-blue` | `#182540` | hero circle |
| `--graphic-red` | `#271F3A` | hero triangle |
| `--graphic-yellow` | `#152E2E` | hero square |
| `--ghost` | `#5A6382` | footer blind emboss (large text, 3:1+) |
| `--focus` | `#8FB4F0` | focus outline only |

Semantics:

- No white text. Body copy is mid-toned; hierarchy comes from size, weight, and
  spacing rather than luminance.
- Decorative borders, shadows, chips, timeline rails, and footer emboss stay low
  contrast. Accent colour is reserved for links, focus, hover, the primary action's
  border, the active language underline, the category dot, and selection.
- Status/type chips are neutral surfaces; a 6px accent square carries the category.
- Primary button in dark is a neutral surface with a blue border, not a filled accent
  block.
- Content images are dimmed with `filter: brightness(.8) saturate(.9)`; research
  charts keep their data and legibility.
- Footer name uses `--ghost` and remains decorative (`aria-hidden`).

### 5.2 Starfield

- A fixed `#stars` canvas replaces the halftone dot canvas in dark mode.
- 120–360 stars, three depth layers; 64% biased to a diagonal Milky Way band.
- Stars are low-alpha blue/lavender/teal; a few pale stars with cross glints.
  No pure-white field.
- Motion: slow drift, sine twinkle, pointer parallax; rare shooting stars
  (first after 5–11 s, then every 8–18 s). Capped near 30 fps; pauses when hidden.
- Two very faint radial nebula gradients sit behind the canvas (`0.16`/`0.12` alpha).
- The halftone dot canvas is hidden in dark; light mode keeps it.

## 6. Technical Architecture

| File | Responsibility |
| --- | --- |
| `src/scripts/theme.ts` | mode parsing/resolution, DOM application, persistence, OS listener |
| `src/components/ThemeSwitch.astro` | 3-button control + `initTheme()` module script |
| `src/components/SiteHeader.astro` | places language + theme controls in `.site-nav__controls` |
| `src/layouts/BaseLayout.astro` | inline no-flash boot script, `#stars` canvas, `initStars()` |
| `src/scripts/stars.ts` | starfield generation, animation, reduced-motion, theme sync |
| `src/styles/global.css` | light tokens unchanged; dark token block + scoped dark overrides; theme switch and star canvas styles |

Data attributes:

- `html[data-theme="light"|"dark"]` — resolved theme; drives CSS.
- `html[data-theme-mode="system"|"light"|"dark"]` — stored preference; for debugging
  and tests.
- Custom event `portfolio:themechange` with `{theme, mode}` — fires after every apply;
  stars use it to start/stop.

The light CSS remains the base. All dark differences live in
`html[data-theme="dark"]` blocks at the end of `global.css`, so light mode and the
existing visual-contract tests are unaffected. The first `--red` / `--paper` in the
file remain the light values.

## 7. Accessibility and Performance

- Axe WCAG 2.1 AA: zero serious/critical violations in light and dark, desktop and
  mobile, for home, about, resume, contact, and generated entry routes.
- Focus is a 3px `--focus` outline with no bright halo in dark.
- The star canvas is `aria-hidden`; it is not focusable.
- `prefers-reduced-motion: reduce` renders the same star composition statically
  (no drift, twinkle, or shooting stars).
- Animation pauses on `document.hidden`; resize is debounced by generation only on
  viewport change; DPR capped at 2.
- Theme preference is stored defensively; storage failures fall back to System.

## 8. Acceptance Criteria

1. Fresh visit with a dark OS shows the starry theme before first paint; light OS
   shows the unchanged light theme.
2. The three theme buttons set, persist, and restore the correct mode on every
   route; `aria-pressed` reflects the stored mode.
3. In System mode, changing the OS scheme updates the site live without reload.
4. Dark home, timeline, entry, about, resume, contact, and 404 pages use the star
   palette and starfield; the dot canvas is hidden; images are dimmed.
5. Reduced motion produces a static starfield.
6. Light mode screenshots and light token values are unchanged.
7. `npm test`, `npm run build`, and `npm run test:e2e` pass.

## 9. Out of Scope

- Dark-mode variants for A/B prototypes.
- Theme-aware generated cover art.
- Per-page theme overrides or a theme picker beyond three modes.
- Deployment.
