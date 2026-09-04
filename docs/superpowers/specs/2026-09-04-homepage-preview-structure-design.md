# Homepage Preview Structure Design

**Date:** 2026-09-04

## Purpose

Restructure the portfolio so the homepage tells a complete, concise story while retaining dedicated pages for longer About and Contact content. The homepage should guide a visitor through Lucas's introduction, background preview, chronological work, and contact preview without publishing unverified personal or project claims.

## Confirmed Information Architecture

```text
/
├── #welcome
├── #about
├── #timeline
└── #contact

/about
/resume
/contact
/projects/[slug]
└── /experiences/[slug]
```

The homepage is a continuous page with four sections in this order:

1. **Welcoming** introduces the site and provides the primary first impression.
2. **About preview** contains a short bilingual introduction and a clear `Read more` link to `/about`.
3. **Timeline** lists published project and experience events in chronological order. Each event opens its own detail page.
4. **Contact preview** contains a short bilingual invitation and a clear `Contact me` link to `/contact`.

`/about`, `/contact`, and `/resume` remain valid standalone pages. `/resume` remains intentionally title-only until resume content is supplied.

## Navigation Behavior

The shared header uses these destinations:

| Navigation item | Destination |
| --- | --- |
| Home | `/#welcome` |
| About | `/#about` |
| Timeline | `/#timeline` |
| Resume | `/resume` |
| Contact | `/#contact` |

About and Contact therefore lead visitors to the homepage previews first. The preview buttons are the explicit entrances to the longer standalone pages. This avoids duplicating full content on the homepage while still making the whole story visible in one scroll.

Anchor navigation must account for the sticky header so section headings are not hidden after scrolling. The current language selection must persist when navigating between anchors and routes.

## Component Responsibilities

### `IntroHero`

`IntroHero` owns only the Welcoming section. Its root section receives `id="welcome"`. It retains the current Riso visual treatment and does not absorb About copy.

### `AboutPreview`

A new component renders the homepage About preview at `id="about"`. It contains:

- a bilingual section heading;
- a short bilingual preview sourced from the verified profile data;
- a bilingual `Read more` link to `/about`.

If no approved preview copy exists, the component keeps its heading and link but does not invent or expose biography text.

### `Timeline`

The existing Timeline remains at `id="timeline"` and continues to read published entries from the content collection. It preserves the semantic heading hierarchy:

- `h2` for Timeline;
- `h3` for year groups;
- `h4` for individual entries.

Each timeline card is navigational, not expandable. Project entries route to `/projects/[slug]`; experience entries route to `/experiences/[slug]`. If there are no published entries, the section displays only its heading and no fake cards.

### `ContactPreview`

A new component renders the homepage Contact preview at `id="contact"`. It contains:

- a bilingual section heading;
- a short bilingual invitation;
- a bilingual `Contact me` link to `/contact`.

The preview does not publish an email address or social account unless that information is explicitly approved for public disclosure.

### Standalone pages

- `/about` contains the longer bilingual About content.
- `/contact` contains approved contact methods and fuller contact context.
- `/resume` continues to display its heading without a resume file or download link.
- Project and experience detail routes continue to use their existing specialized layouts and content templates.

## Content and Data Flow

Homepage profile previews come from the centralized bilingual profile data rather than being duplicated directly in page markup. The About preview uses the first approved paragraph from `profile.about`; when the array is empty, no biography paragraph is rendered. The Contact preview invitation remains localized interface copy, while actual contact methods come only from the separate contact configuration. Project and experience entries remain Markdown-driven:

```text
profile data → Welcoming / About preview
localized interface copy → Contact preview
approved contact configuration → standalone Contact page
content entries → Timeline → project or experience detail route
```

Only entries that pass the existing publication and content-validation rules appear on the homepage or generate public detail pages. Missing Chinese entry content continues to fall back to English according to the existing site behavior.

## Language Behavior

English remains the default language. The existing language switch updates all four homepage sections and persists the chosen language across standalone and detail pages. Anchor navigation must not reset the selected language.

## Visual and Interaction Constraints

The restructuring reuses the current Riso visual system. This change concerns hierarchy, navigation, and component boundaries rather than a new visual direction. Preview sections must remain readable on desktop and mobile, expose obvious text links or buttons, and support keyboard navigation and reduced-motion preferences.

## Validation

Automated coverage will verify:

1. homepage section order is `welcome`, `about`, `timeline`, `contact`, then footer;
2. header links point to the intended homepage anchors or standalone route;
3. About and Contact preview buttons point to `/about` and `/contact`;
4. Timeline cards still open their corresponding detail routes rather than expanding inline;
5. English defaults and Chinese persists across anchors and routes;
6. unpublished biography and draft entries remain absent;
7. `/resume` remains title-only;
8. all homepage, standalone, and generated detail routes have no serious accessibility violations in desktop and mobile test projects;
9. the production build completes without Astro diagnostics.

## Non-goals

This change does not add resume content, author new biography or contact details, publish draft projects, redesign the Riso visual system, introduce a CMS, or change the existing Cloudflare Pages deployment workflow.
