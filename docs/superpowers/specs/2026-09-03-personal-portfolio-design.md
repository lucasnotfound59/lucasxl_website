# Lucas XL Personal Portfolio — Design Specification

Date: 2026-09-03
Status: Approved for implementation planning

## 1. Purpose

Build a bilingual personal portfolio for a high-school researcher and builder. The site serves two audiences equally:

- university admissions and summer-program reviewers;
- mentors, research collaborators, and competition reviewers.

A first-time visitor should understand the person and current interests quickly, then follow a chronological record of projects, research, competitions, and educational experiences. Detailed evidence belongs on child pages, never inline on the home-page timeline.

The existing HTML preview in the workspace is the visual reference. This specification defines information architecture, content behavior, and implementation boundaries. It does not redesign the visual style.

## 2. Product Principles

1. **Personal introduction first.** A concise introduction appears before project content.
2. **Growth through chronology.** The timeline runs from the earliest entry to the newest entry.
3. **Preview on the home page, evidence on child pages.** Timeline entries remain concise and never expand inline.
4. **Personal contribution is explicit.** Team outcomes and individual responsibilities are presented separately.
5. **Claims remain verifiable.** Status, results, awards, and metrics are published only when supported by evidence.
6. **Privacy is conservative.** Public contact information is limited to email and GitHub. The site does not publish a phone number, home address, detailed school identity, private human-subject data, API keys, or local file paths.
7. **English is the default.** Chinese is available through an instant language switch on the same URL.

## 3. Information Architecture

### 3.1 Routes

    /
    /about
    /resume
    /contact
    /projects/[slug]
    /experiences/[slug]

- The home page contains the brief introduction and chronological timeline.
- The About page contains the extended personal profile, interests, skills, and direction.
- The Resume page intentionally contains only the page title in this release.
- The Contact page displays public email and GitHub links.
- Project child pages contain research, engineering, robotics, and other project details.
- Experience child pages contain competition, summer-program, and other experience details.
- There is no standalone project-index page. The timeline is the canonical index.

### 3.2 Global Navigation

The global navigation contains:

- Home, linking to the home-page introduction;
- Timeline, linking to the timeline section on the home page;
- About;
- Resume;
- Contact;
- EN / 中 language switch.

On a child page, Timeline links back to the timeline anchor on the home page. Navigation remains identical across all routes.

## 4. Home Page

### 4.1 Introduction

The first content block contains:

- name;
- one-sentence identity statement;
- a short paragraph describing current interests and direction;
- links that move the visitor to the timeline, About page, and Contact page.

The introduction is deliberately concise. Detailed biography, skills, and personal interests belong on the About page.

### 4.2 Timeline

The timeline contains four kinds of entries:

- projects;
- research;
- competitions;
- summer programs and other important experiences.

Entries are grouped by year and ordered from earliest to newest within the page. Every entry displays:

- date or date range;
- category label;
- title;
- cover image;
- one- or two-sentence summary;
- optional status label;
- an explicit View Project or View Experience affordance.

The entire timeline card is clickable. It navigates to a child page. It never opens an accordion, modal, drawer, or expanded detail block below the timeline.

### 4.3 Home-Page Ending

After the final timeline entry, the home page contains:

- a concise contact call to action;
- email and GitHub links;
- the site footer.

## 5. Child-Page Templates

### 5.1 Research Project

A research page uses this order:

1. project title, period, status, and one-sentence summary;
2. representative image or result;
3. research question;
4. why the question matters;
5. personal role;
6. methodology;
7. results and evidence;
8. limitations;
9. reflection and next steps;
10. paper, poster, code, and related links when public.

Results and limitations are separate sections. Behavioral findings cannot be presented as proof of unmeasured internal states. Human-subject information is limited to approved aggregate results.

### 5.2 Engineering or Robotics Project

An engineering page uses this order:

1. project title, period, status, and summary;
2. problem and constraints;
3. personal responsibilities;
4. system or design overview;
5. implementation process;
6. testing and iterations;
7. results;
8. failures and lessons;
9. code, demonstration, and documentation links when public.

Team outcomes and personal contribution must use separate fields.

### 5.3 Competition, Summer Program, or Other Experience

An experience page uses this order:

1. title and period;
2. context;
3. participation;
4. personal contribution;
5. selected work;
6. learning and reflection;
7. related projects and public links.

### 5.4 Shared Child-Page Behavior

Every child page includes:

- Back to Timeline;
- previous and next chronological entries;
- the global language switch;
- image captions and alternative text;
- a clearly labeled external-links section.

Project details are loaded only on the child page. The home page uses the entry cover and summary only.

## 6. About, Resume, and Contact

### 6.1 About

The About page may contain:

- a longer personal introduction;
- current academic and technical interests;
- skills and tools;
- selected personal interests;
- future areas of exploration.

The About page complements the chronological evidence rather than repeating every timeline entry.

### 6.2 Resume

The Resume route is present and linked in navigation. In this release it renders the Resume title only. It contains no download button, empty card, explanatory message, or fabricated resume content.

### 6.3 Contact

The Contact page exposes:

- one public email address;
- one public GitHub profile.

The exact values are content configuration and are not defined by this architecture specification. No phone number, home address, or detailed school identity is displayed.

## 7. Bilingual Behavior

English and Chinese share the same URL. English is the initial language for a visitor with no saved preference.

The language switch:

- replaces navigation, introduction, timeline summaries, page headings, and full detail content without changing the URL;
- saves the visitor choice in local browser storage;
- preserves that choice while navigating between routes;
- updates the document language attribute for accessibility;
- keeps all controls keyboard accessible;
- falls back to English when a Chinese content file is absent.

English remains the primary metadata and search-engine version. The page must remain usable when client-side JavaScript is disabled, with English content shown by default.

## 8. Content Architecture

The implementation uses Astro and file-based content.

Each project has:

    src/content/projects/[slug]/meta.json
    src/content/projects/[slug]/en.md
    src/content/projects/[slug]/zh.md

Each experience has:

    src/content/experiences/[slug]/meta.json
    src/content/experiences/[slug]/en.md
    src/content/experiences/[slug]/zh.md

Images are stored under:

    public/images/projects/[slug]/
    public/images/experiences/[slug]/

The English file is required. The Chinese file is optional so unfinished translations fall back to English.

### 8.1 Shared Metadata

Each metadata file contains:

- slug;
- content type;
- template type;
- start date;
- optional end date;
- category;
- publication status;
- cover-image path;
- chronological order;
- public external links.

Each language file contains:

- localized title;
- localized short summary;
- localized cover-image alternative text;
- the sections required by its selected template.

Astro validates metadata and generates timeline entries and child routes automatically. Adding a new item requires copying one content directory, editing metadata, writing the English content, optionally writing the Chinese content, and adding media.

## 9. Component Boundaries

The implementation is divided into focused components:

- SiteHeader: global navigation and language switch;
- IntroHero: concise home-page identity;
- Timeline: groups entries by year and orders them;
- TimelineEntry: preview and child-page link;
- ProjectLayout: shared shell for project templates;
- ExperienceLayout: shared shell for experience pages;
- LanguageProvider: saved preference and content visibility;
- MediaFigure: responsive image, caption, and alternative text;
- EntryNavigation: back, previous, and next links;
- ContactLinks: validated email and GitHub links;
- SiteFooter: site-level closing content.

Content components receive structured data and do not read files directly. Content loading and validation remain in the Astro content layer.

## 10. Data and Navigation Flow

1. The author edits a metadata file and one or two Markdown language files.
2. Astro validates the content schema during the build.
3. The build creates the home timeline and all child routes.
4. Cloudflare receives the generated static output.
5. The browser loads English by default or restores a saved language preference.
6. Clicking a timeline card navigates to its child page.
7. Returning to Timeline restores the home-page timeline position through its anchor.

## 11. Failure Handling

- An unknown child-page slug renders a custom 404 page with links to Home and Timeline.
- A missing Chinese file uses English content.
- A missing required English file or invalid metadata fails the build before deployment.
- A failed new build does not replace the last successful Cloudflare deployment.
- A missing cover image uses one consistent site-default cover asset.
- A media item without alternative text fails content validation.
- Broken internal links are detected during verification before release.
- External links open safely and are labeled as external.

## 12. Deployment Architecture

The repository is a new public GitHub repository named lucasxl-website.

Deployment flow:

    local Astro project
    → public GitHub repository
    → Cloudflare Git integration
    → automatic production build from main
    → Cloudflare-hosted site
    → lucasxl.com

Cloudflare connects through the Cloudflare Workers and Pages GitHub App. Access is restricted to the lucasxl-website repository. Cloudflare does not own the GitHub account or repository.

Every push to main triggers a production build. Other branches produce preview deployments. The production build command is npm run build, and the generated output directory is dist.

## 13. Verification

Before the first public release, verification covers:

- desktop and mobile layouts;
- earliest-to-newest timeline ordering;
- every timeline card linking to the correct child page;
- no child details expanding on the home page;
- all three detail templates;
- same-URL English and Chinese switching;
- saved language preference across routes;
- English fallback for missing Chinese content;
- keyboard navigation and visible focus;
- semantic heading order;
- image alternative text;
- internal and external links;
- custom 404 behavior;
- Astro production build;
- Cloudflare preview deployment;
- lucasxl.com and its TLS certificate.

## 14. Out of Scope

This release excludes:

- a blog or notes system;
- user accounts;
- comments;
- a database;
- an administration dashboard;
- analytics beyond Cloudflare defaults;
- a completed resume;
- contact forms;
- inline expansion of timeline details;
- a separate project-index page;
- redesign of the existing visual reference.

## 15. Acceptance Criteria

The design is complete when:

1. the home page introduces the person before presenting content;
2. the timeline includes projects, research, competitions, and significant experiences in earliest-to-newest order;
3. every timeline card opens a child page and no details expand inline;
4. multiple detail templates render the approved section structures;
5. English is default and Chinese switches on the same URL;
6. content is maintained through separate English and Chinese Markdown files;
7. About, title-only Resume, and Email-plus-GitHub Contact routes exist;
8. a push to the public GitHub repository automatically deploys through Cloudflare;
9. privacy and evidence boundaries are enforced by content structure and review.
