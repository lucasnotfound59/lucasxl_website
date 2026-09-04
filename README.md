# Lucas Xin Portfolio

An Astro portfolio with bilingual project and experience entries. The public site only renders entries whose metadata has `"status": "published"`.

## Prerequisites

- Node.js 22.16.0
- npm

## Local development

```sh
npm install
npm run dev
npm run validate:content
npm test
npm run build
npm run test:e2e
```

`npm run build` also runs content validation and Astro type checks. Browser tests cover desktop and mobile projects, including accessibility checks.

## Author content

Each entry has its own directory. Keep the directory name, the `slug` in `meta.json`, and the route identifier identical.

```text
src/content/
  projects/
    <project-slug>/
      meta.json
      en.md
      zh.md                 # optional; English is used when absent
  experiences/
    <experience-slug>/
      meta.json
      en.md
      zh.md                 # optional; English is used when absent
src/content-templates/
  research/
  engineering/
  experience/
```

`meta.json` must identify the entry kind, template, dates, category, status, cover image, order, and optional links. English copy is required. Chinese copy is optional: when a visitor selects Chinese and an entry has no `zh.md`, the site renders its English copy rather than hiding the entry or changing the URL.

Choose one author template for every entry:

- `research` for projects: Research Question; Why It Matters; My Role; Methodology; Results and Evidence; Limitations; Reflection and Next Steps.
- `engineering` for projects: Problem and Constraints; My Responsibilities; System Overview; Implementation Process; Testing and Iterations; Results; Failures and Lessons.
- `experience` for competitions or educational experiences: Context; Participation; My Contribution; Selected Work; Learning and Reflection.

Copy the corresponding files from `src/content-templates/<template>/`, replace all example values with verified material, and set `status` deliberately:

- `draft` entries are available to authors but are excluded from public routes and the timeline.
- `published` entries are eligible for public routes and the timeline. They must have the template's required English headings, an existing cover under `public/images/`, and valid metadata.

The `author-example` directories are deliberately draft-only examples. Do not publish placeholder, confidential, unpublished, or mentor-restricted material.

## Content privacy checklist

Before setting an entry to `published`, confirm that:

- every claim, metric, result, role, and link is verified and approved for public release;
- no private datasets, participant information, credentials, API keys, internal documents, unreleased code, or sensitive location/contact details are included;
- collaborators, organizations, mentors, and publications are named only with permission;
- images, diagrams, and third-party assets have permission and appropriate attribution;
- the English copy is publication-ready, and Chinese copy is accurate if supplied;
- the public email and GitHub values in `src/data/profile.ts` are approved before they are configured.

## Cloudflare Pages deployment

The deployment target is the existing public GitHub repository [`lucasxl_website`](https://github.com/lucasnotfound59/lucasxl_website). Cloudflare Pages is connected to this exact repository.

Create a Pages application through **Workers & Pages → Create application → Pages → Connect to Git**. Authorize the Cloudflare Workers and Pages GitHub App for **Only select repositories**, and select only `lucasxl_website` (the existing GitHub repository at `https://github.com/lucasnotfound59/lucasxl_website.git`). Configure:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |

After the first successful deployment, Cloudflare provides a `pages.dev` URL for structural review. Pushes or pull requests on non-production branches should create preview deployments. `main` is production and each push to it triggers the Pages deployment for `lucasxl.com`.

## Production release and future-content gate

The blank portfolio shell is approved for production at `lucasxl.com` now. The current custom-domain state is `lucasxl.com` bound with active HTTPS/TLS. `www.lucasxl.com` is not configured yet; it can be added later under Cloudflare **Custom domains** and redirected to the apex domain.

Before each release, run the complete local release gate:

```sh
git diff --check
npm run validate:content
npm test
npm run build
npm run test:e2e
```

Biography copy, project and experience entries, the public email address, and the public GitHub URL remain gated until they have been verified and approved for publication. For a future content release:

1. Replace the draft author examples with verified project and experience directories, and mark only approved entries as `published`.
2. Add verified English and Chinese profile content.
3. Configure the approved public email and GitHub values.
4. Rerun the complete local release gate above before pushing the approved content to `main`.
5. If `www.lucasxl.com` is added, redirect it to canonical `lucasxl.com` and verify HTTPS/TLS before announcing that hostname.
