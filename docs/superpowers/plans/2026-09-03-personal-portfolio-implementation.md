# Lucas XL Personal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build the approved bilingual Astro portfolio structure, content system, chronological timeline, child detail pages, and a Cloudflare preview deployment without inventing personal project content.

**Architecture:** Astro generates a fully static site from validated file-based content. Shared metadata lives in one JSON file per entry, while English and Chinese copy live in separate Markdown files and render on the same URL. The home page is the canonical chronological index; every timeline card navigates to a generated project or experience child page.

**Tech Stack:** Node.js 22.16.0, npm, Astro static output, TypeScript strict mode, Astro Content Collections, Zod schemas, Vitest, Playwright, axe-core, GitHub, Cloudflare Pages.

## Global Constraints

- The home page introduces Lucas before presenting the timeline.
- The timeline contains projects, research, competitions, summer programs, and significant experiences.
- Timeline order is earliest to newest and entries are grouped by year.
- Timeline cards navigate to child pages; no detail content expands inline.
- Project routes use /projects/[slug]; experience routes use /experiences/[slug].
- Research, engineering or robotics, and experience entries use distinct detail templates.
- English is the default language.
- Chinese switches on the same URL and the preference persists across routes.
- English copy is required; missing Chinese copy falls back to English.
- Resume renders its page title only.
- Contact supports only one public email address and one public GitHub profile.
- Team outcomes and personal contributions remain separate.
- Human-subject information is restricted to approved aggregate results.
- The implementation must not invent roles, outcomes, awards, metrics, or contact values.
- The existing workspace HTML preview is the visual reference; this plan does not create a new visual direction.
- Static builds use npm run build and output to dist.
- Cloudflare Git access is limited to the lucasxl-website repository.

---

## Planned File Structure

    .gitignore
    .node-version
    astro.config.mjs
    package.json
    package-lock.json
    playwright.config.ts
    tsconfig.json
    vitest.config.ts
    public/
      favicon.svg
      images/
        default-cover.svg
        projects/
        experiences/
    scripts/
      validate-content.ts
    src/
      components/
        ContactLinks.astro
        EntryNavigation.astro
        IntroHero.astro
        LanguageSwitch.astro
        MediaFigure.astro
        SiteFooter.astro
        SiteHeader.astro
        Timeline.astro
        TimelineEntry.astro
      content/
        experiences/
          author-example/
            en.md
            meta.json
        projects/
          author-example/
            en.md
            meta.json
      content-templates/
        engineering/
          en.md
          meta.json
          zh.md
        experience/
          en.md
          meta.json
          zh.md
        research/
          en.md
          meta.json
          zh.md
      content.config.ts
      data/
        profile.ts
      i18n/
        ui.ts
      layouts/
        BaseLayout.astro
        EngineeringLayout.astro
        EntryLayout.astro
        ExperienceLayout.astro
        ResearchLayout.astro
      lib/
        content.ts
        portfolio.ts
      pages/
        404.astro
        about.astro
        contact.astro
        experiences/
          [slug].astro
        index.astro
        projects/
          [slug].astro
        resume.astro
      scripts/
        language.ts
      styles/
        global.css
    tests/
      e2e/
        accessibility.spec.ts
        language.spec.ts
        navigation.spec.ts
      unit/
        language.test.ts
        portfolio.test.ts

The author-example entries remain draft content and are excluded from generated public routes. They provide a build-valid structure that the user can copy and replace with verified content.

---

### Task 1: Establish the Astro Project and Quality Gates

**Files:**
- Create: .gitignore
- Create: .node-version
- Create: package.json
- Create: package-lock.json
- Create: astro.config.mjs
- Create: tsconfig.json
- Create: vitest.config.ts
- Create: playwright.config.ts
- Create: src/pages/index.astro
- Create: src/styles/global.css
- Create: public/favicon.svg
- Create: public/images/default-cover.svg
- Create: tests/unit/smoke.test.ts

**Interfaces:**
- Consumes: approved design specification at docs/superpowers/specs/2026-09-03-personal-portfolio-design.md
- Produces: npm run dev, npm run build, npm test, and npm run test:e2e commands used by every later task

- [ ] **Step 1: Record the precondition**

Run:

    test ! -f package.json

Expected: exit code 0, confirming that no existing application will be overwritten.

- [ ] **Step 2: Create package metadata and install exact tool categories**

Create package.json:

    {
      "name": "lucasxl-website",
      "version": "0.1.0",
      "private": true,
      "type": "module",
      "scripts": {
        "dev": "astro dev",
        "build": "astro check && astro build",
        "preview": "astro preview",
        "test": "vitest run",
        "test:watch": "vitest",
        "test:e2e": "playwright test"
      }
    }

Run:

    npm install astro@latest zod@latest

Run:

    npm install --save-dev @astrojs/check@latest typescript@latest tsx@latest vitest@latest @playwright/test@latest @axe-core/playwright@latest

Expected: package-lock.json is generated and npm reports no installation failure.

- [ ] **Step 3: Pin the Cloudflare build runtime**

Create .node-version:

    22.16.0

Create .gitignore:

    node_modules/
    dist/
    .astro/
    .superpowers/
    coverage/
    playwright-report/
    test-results/
    .DS_Store

Expected: the local brainstorming preview remains on disk but no longer appears in git status.

- [ ] **Step 4: Configure Astro and TypeScript**

Create astro.config.mjs:

    import {defineConfig} from 'astro/config';

    export default defineConfig({
      site:'https://lucasxl.com',
      output:'static',
      trailingSlash:'never'
    });

Create tsconfig.json:

    {
      "extends": "astro/tsconfigs/strict",
      "compilerOptions": {
        "noUncheckedIndexedAccess": true
      }
    }

Create vitest.config.ts:

    import {defineConfig} from 'vitest/config';

    export default defineConfig({
      test:{
        include:['tests/unit/**/*.test.ts'],
        coverage:{reporter:['text','html']}
      }
    });

Create playwright.config.ts:

    import {defineConfig,devices} from '@playwright/test';

    export default defineConfig({
      testDir:'tests/e2e',
      use:{
        baseURL:'http://127.0.0.1:4321',
        trace:'retain-on-failure'
      },
      webServer:{
        command:'npm run dev -- --host 127.0.0.1',
        port:4321,
        reuseExistingServer:true
      },
      projects:[
        {name:'chromium',use:{...devices['Desktop Chrome']}},
        {name:'mobile',use:{...devices['iPhone 13']}}
      ]
    });

- [ ] **Step 5: Create a minimal static shell**

Create src/styles/global.css:

    :root {
      color-scheme:light;
      font-family:system-ui,sans-serif;
    }

    * {
      box-sizing:border-box;
    }

    html {
      scroll-behavior:smooth;
    }

    body {
      margin:0;
    }

    [hidden] {
      display:none !important;
    }

    :focus-visible {
      outline:3px solid currentColor;
      outline-offset:3px;
    }

    .visually-hidden {
      position:absolute;
      width:1px;
      height:1px;
      padding:0;
      margin:-1px;
      overflow:hidden;
      clip:rect(0,0,0,0);
      white-space:nowrap;
      border:0;
    }

Create src/pages/index.astro:

    ---
    import '../styles/global.css';
    ---
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Lucas XL</title>
      </head>
      <body>
        <main>
          <h1>Lucas XL</h1>
        </main>
      </body>
    </html>

Create a simple geometric favicon at public/favicon.svg and a neutral, non-project-specific cover at public/images/default-cover.svg. Do not place personal claims in either asset.

- [ ] **Step 6: Verify the foundation**

Create tests/unit/smoke.test.ts:

    import {expect,it} from 'vitest';

    it('runs the unit-test harness',()=>{
      expect(true).toBe(true);
    });

Run:

    npm test

Expected: one passing test.

Run:

    npm run build

Expected: Astro reports one generated page and writes dist/index.html.

- [ ] **Step 7: Commit the foundation**

Run:

    git add .gitignore .node-version package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts src/pages/index.astro src/styles/global.css public/favicon.svg public/images/default-cover.svg tests/unit/smoke.test.ts
    git commit -m "build: scaffold Astro portfolio"

---

### Task 2: Define Content Types, Schemas, and Author Templates

**Files:**
- Create: src/content.config.ts
- Create: src/lib/portfolio.ts
- Create: tests/unit/portfolio.test.ts
- Create: src/content/projects/author-example/meta.json
- Create: src/content/projects/author-example/en.md
- Create: src/content/experiences/author-example/meta.json
- Create: src/content/experiences/author-example/en.md
- Create: src/content-templates/research/meta.json
- Create: src/content-templates/research/en.md
- Create: src/content-templates/research/zh.md
- Create: src/content-templates/engineering/meta.json
- Create: src/content-templates/engineering/en.md
- Create: src/content-templates/engineering/zh.md
- Create: src/content-templates/experience/meta.json
- Create: src/content-templates/experience/en.md
- Create: src/content-templates/experience/zh.md
- Delete: tests/unit/smoke.test.ts

**Interfaces:**
- Consumes: Astro project from Task 1
- Produces: EntryMeta, EntryKind, TemplateKind, routeFor(), compareEntries(), groupEntriesByYear(), and four validated Astro collections

- [ ] **Step 1: Write failing chronology and routing tests**

Create tests/unit/portfolio.test.ts:

    import {describe,expect,it} from 'vitest';
    import {compareEntries,groupEntriesByYear,routeFor,type EntryMeta} from '../../src/lib/portfolio';

    const project:EntryMeta={
      slug:'early-project',
      kind:'project',
      template:'research',
      startDate:'2024-06-01',
      category:'Research',
      status:'published',
      cover:'/images/default-cover.svg',
      order:1,
      links:[]
    };

    const experience:EntryMeta={
      slug:'later-program',
      kind:'experience',
      template:'experience',
      startDate:'2025-07-01',
      category:'Summer Program',
      status:'published',
      cover:'/images/default-cover.svg',
      order:1,
      links:[]
    };

    describe('portfolio metadata',()=>{
      it('orders entries from earliest to newest',()=>{
        expect([experience,project].sort(compareEntries).map(entry=>entry.slug))
          .toEqual(['early-project','later-program']);
      });

      it('groups ordered entries by start year',()=>{
        expect(groupEntriesByYear([experience,project]).map(group=>group.year))
          .toEqual([2024,2025]);
      });

      it('creates child routes by entry kind',()=>{
        expect(routeFor(project)).toBe('/projects/early-project');
        expect(routeFor(experience)).toBe('/experiences/later-program');
      });
    });

- [ ] **Step 2: Run the tests and observe the missing module**

Run:

    npm test -- tests/unit/portfolio.test.ts

Expected: FAIL because src/lib/portfolio.ts does not exist.

- [ ] **Step 3: Implement the shared portfolio types and pure functions**

Create src/lib/portfolio.ts:

    export type EntryKind='project'|'experience';
    export type TemplateKind='research'|'engineering'|'experience';
    export type PublicationStatus='draft'|'published';
    export type EntryLink={label:string;url:string};

    export type EntryMeta={
      slug:string;
      kind:EntryKind;
      template:TemplateKind;
      startDate:string;
      endDate?:string;
      category:string;
      status:PublicationStatus;
      cover:string;
      order:number;
      links:EntryLink[];
    };

    export type TimelineGroup<T extends EntryMeta=EntryMeta>={
      year:number;
      entries:T[];
    };

    export function compareEntries(a:EntryMeta,b:EntryMeta):number {
      return a.startDate.localeCompare(b.startDate)
        || a.order-b.order
        || a.slug.localeCompare(b.slug);
    }

    export function groupEntriesByYear<T extends EntryMeta>(entries:T[]):TimelineGroup<T>[] {
      const groups=new Map<number,T[]>();
      for(const entry of [...entries].sort(compareEntries)){
        const year=Number(entry.startDate.slice(0,4));
        groups.set(year,[...(groups.get(year)??[]),entry]);
      }
      return [...groups].map(([year,groupedEntries])=>({year,entries:groupedEntries}));
    }

    export function routeFor(entry:EntryMeta):string {
      const prefix=entry.kind==='project'?'projects':'experiences';
      return `/${prefix}/${entry.slug}`;
    }

- [ ] **Step 4: Define Astro Content Collection schemas**

Create src/content.config.ts:

    import {defineCollection,z} from 'astro:content';
    import {glob} from 'astro/loaders';

    const linkSchema=z.object({
      label:z.string().min(1),
      url:z.string().url()
    });

    const metaSchema=z.object({
      slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      kind:z.enum(['project','experience']),
      template:z.enum(['research','engineering','experience']),
      startDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      category:z.string().min(1),
      status:z.enum(['draft','published']),
      cover:z.string().startsWith('/images/'),
      order:z.number().int().nonnegative(),
      links:z.array(linkSchema).default([])
    }).superRefine((value,context)=>{
      if(value.kind==='experience'&&value.template!=='experience'){
        context.addIssue({code:'custom',message:'Experience entries require the experience template'});
      }
      if(value.kind==='project'&&value.template==='experience'){
        context.addIssue({code:'custom',message:'Project entries require the research or engineering template'});
      }
      if(value.endDate&&value.endDate<value.startDate){
        context.addIssue({code:'custom',message:'endDate cannot precede startDate'});
      }
    });

    const localizedSchema=z.object({
      title:z.string().min(1),
      summary:z.string().min(1).max(320),
      coverAlt:z.string().min(1)
    });

    export const collections={
      projectMeta:defineCollection({
        loader:glob({pattern:'**/meta.json',base:'./src/content/projects'}),
        schema:metaSchema
      }),
      projectCopy:defineCollection({
        loader:glob({pattern:'**/*.md',base:'./src/content/projects'}),
        schema:localizedSchema
      }),
      experienceMeta:defineCollection({
        loader:glob({pattern:'**/meta.json',base:'./src/content/experiences'}),
        schema:metaSchema
      }),
      experienceCopy:defineCollection({
        loader:glob({pattern:'**/*.md',base:'./src/content/experiences'}),
        schema:localizedSchema
      })
    };

- [ ] **Step 5: Add build-valid draft examples and author templates**

Create src/content/projects/author-example/meta.json:

    {
      "slug": "author-example",
      "kind": "project",
      "template": "research",
      "startDate": "2000-01-01",
      "category": "Research",
      "status": "draft",
      "cover": "/images/default-cover.svg",
      "order": 0,
      "links": []
    }

Create src/content/projects/author-example/en.md:

    ---
    title: Author Example
    summary: Draft project structure used for local validation.
    coverAlt: Neutral geometric cover
    ---
    ## Research Question
    ## Why It Matters
    ## My Role
    ## Methodology
    ## Results and Evidence
    ## Limitations
    ## Reflection and Next Steps

Create src/content/experiences/author-example/meta.json:

    {
      "slug": "author-example",
      "kind": "experience",
      "template": "experience",
      "startDate": "2000-01-01",
      "category": "Experience",
      "status": "draft",
      "cover": "/images/default-cover.svg",
      "order": 0,
      "links": []
    }

Create src/content/experiences/author-example/en.md:

    ---
    title: Author Example
    summary: Draft experience structure used for local validation.
    coverAlt: Neutral geometric cover
    ---
    ## Context
    ## Participation
    ## My Contribution
    ## Selected Work
    ## Learning and Reflection

Create src/content-templates/research/meta.json with slug research-template, kind project, template research, date 2000-01-01, category Research, status draft, the default cover, order 0, and no links. Create en.md using title Research Project Template, summary Authoring structure for a research project, neutral cover alternative text, and the seven research headings shown in the project author example. Create zh.md with equivalent frontmatter and these headings:

    ## 研究问题
    ## 研究意义
    ## 我的角色
    ## 研究方法
    ## 结果与证据
    ## 局限
    ## 反思与下一步

Create src/content-templates/engineering/meta.json with slug engineering-template, kind project, template engineering, date 2000-01-01, category Engineering, status draft, the default cover, order 0, and no links. Create en.md with title Engineering Project Template, summary Authoring structure for an engineering project, neutral cover alternative text, and:

    ## Problem and Constraints
    ## My Responsibilities
    ## System Overview
    ## Implementation Process
    ## Testing and Iterations
    ## Results
    ## Failures and Lessons

Create zh.md with equivalent frontmatter and:

    ## 问题与约束
    ## 我的职责
    ## 系统概览
    ## 实现过程
    ## 测试与迭代
    ## 结果
    ## 失败与经验

Create src/content-templates/experience/meta.json with slug experience-template, kind experience, template experience, date 2000-01-01, category Experience, status draft, the default cover, order 0, and no links. Create en.md with title Experience Template, summary Authoring structure for a competition or educational experience, neutral cover alternative text, and:

    ## Context
    ## Participation
    ## My Contribution
    ## Selected Work
    ## Learning and Reflection

Create zh.md with equivalent frontmatter and:

    ## 背景
    ## 参与内容
    ## 我的贡献
    ## 代表性工作
    ## 学习与反思

Keep all three template directories outside src/content so none can become a public route accidentally.

- [ ] **Step 6: Verify schemas and pure behavior**

Run:

    npm test -- tests/unit/portfolio.test.ts

Expected: three passing tests.

Run:

    npm run build

Expected: Astro validates all four collections and generates the home page without a public author-example route.

- [ ] **Step 7: Commit the content foundation**

Run:

    git add src/content.config.ts src/lib/portfolio.ts src/content src/content-templates tests/unit/portfolio.test.ts tests/unit/smoke.test.ts
    git commit -m "feat: define portfolio content model"

---

### Task 3: Build the Content Query Service

**Files:**
- Create: src/lib/content.ts
- Modify: src/lib/portfolio.ts
- Modify: tests/unit/portfolio.test.ts

**Interfaces:**
- Consumes: projectMeta, projectCopy, experienceMeta, and experienceCopy collections from Task 2
- Produces: PortfolioEntry, getPortfolioEntries(), neighborsFor(), and getTimelineGroups()

- [ ] **Step 1: Add failing neighbor tests**

Append to tests/unit/portfolio.test.ts:

    import {neighborsFor} from '../../src/lib/portfolio';

    it('returns chronological previous and next entries',()=>{
      const entries=[
        project,
        {...project,slug:'middle-project',startDate:'2025-01-01'},
        experience
      ].sort(compareEntries);
      expect(neighborsFor(entries,'middle-project')).toEqual({
        previous:project,
        next:experience
      });
    });

    it('returns empty edge neighbors',()=>{
      expect(neighborsFor([project],project.slug)).toEqual({
        previous:undefined,
        next:undefined
      });
    });

- [ ] **Step 2: Run the focused tests**

Run:

    npm test -- tests/unit/portfolio.test.ts

Expected: FAIL because neighborsFor is not exported.

- [ ] **Step 3: Implement neighbor selection**

Append to src/lib/portfolio.ts:

    export function neighborsFor<T extends EntryMeta>(
      entries:T[],
      slug:string
    ):{
      previous:T|undefined;
      next:T|undefined;
    } {
      const ordered=[...entries].sort(compareEntries);
      const index=ordered.findIndex(entry=>entry.slug===slug);
      if(index<0){
        return {previous:undefined,next:undefined};
      }
      return {
        previous:ordered[index-1],
        next:ordered[index+1]
      };
    }

- [ ] **Step 4: Implement collection loading**

Create src/lib/content.ts:

    import {getCollection,getEntry,type CollectionEntry} from 'astro:content';
    import {
      compareEntries,
      groupEntriesByYear,
      routeFor,
      type EntryMeta
    } from './portfolio';

    type ProjectCopy=CollectionEntry<'projectCopy'>;
    type ExperienceCopy=CollectionEntry<'experienceCopy'>;

    export type PortfolioEntry={
      meta:EntryMeta;
      route:string;
      en:ProjectCopy|ExperienceCopy;
      zh?:ProjectCopy|ExperienceCopy;
    };

    function slugFromMetaId(id:string):string {
      return id.replace(/\/meta$/,'');
    }

    async function loadProjects():Promise<PortfolioEntry[]> {
      const metas=await getCollection('projectMeta',entry=>entry.data.status==='published');
      return Promise.all(metas.map(async metaEntry=>{
        const slug=slugFromMetaId(metaEntry.id);
        const en=await getEntry('projectCopy',`${slug}/en`);
        const zh=await getEntry('projectCopy',`${slug}/zh`);
        if(!en){
          throw new Error(`Missing English project copy for ${slug}`);
        }
        if(metaEntry.data.slug!==slug){
          throw new Error(`Project slug mismatch: directory ${slug}, metadata ${metaEntry.data.slug}`);
        }
        const meta={...metaEntry.data,slug} as EntryMeta;
        return {meta,route:routeFor(meta),en,zh};
      }));
    }

    async function loadExperiences():Promise<PortfolioEntry[]> {
      const metas=await getCollection('experienceMeta',entry=>entry.data.status==='published');
      return Promise.all(metas.map(async metaEntry=>{
        const slug=slugFromMetaId(metaEntry.id);
        const en=await getEntry('experienceCopy',`${slug}/en`);
        const zh=await getEntry('experienceCopy',`${slug}/zh`);
        if(!en){
          throw new Error(`Missing English experience copy for ${slug}`);
        }
        if(metaEntry.data.slug!==slug){
          throw new Error(`Experience slug mismatch: directory ${slug}, metadata ${metaEntry.data.slug}`);
        }
        const meta={...metaEntry.data,slug} as EntryMeta;
        return {meta,route:routeFor(meta),en,zh};
      }));
    }

    export async function getPortfolioEntries():Promise<PortfolioEntry[]> {
      return [...await loadProjects(),...await loadExperiences()]
        .sort((a,b)=>compareEntries(a.meta,b.meta));
    }

    export async function getTimelineGroups() {
      const entries=await getPortfolioEntries();
      return groupEntriesByYear(entries.map(entry=>({
        ...entry.meta,
        entry
      })));
    }

- [ ] **Step 5: Verify tests and build-time collection lookup**

Run:

    npm test -- tests/unit/portfolio.test.ts

Expected: five passing tests.

Run:

    npm run build

Expected: the draft examples are ignored and no missing-English error occurs.

- [ ] **Step 6: Commit the query service**

Run:

    git add src/lib/content.ts src/lib/portfolio.ts tests/unit/portfolio.test.ts
    git commit -m "feat: load and order portfolio entries"

---

### Task 4: Implement Same-URL English and Chinese Switching

**Files:**
- Create: src/scripts/language.ts
- Create: src/components/LanguageSwitch.astro
- Create: src/i18n/ui.ts
- Create: tests/unit/language.test.ts

**Interfaces:**
- Consumes: elements marked with data-lang="en" or data-lang="zh"
- Produces: Language type, resolveLanguage(), applyLanguage(), initLanguage(), and the portfolio:languagechange browser event

- [ ] **Step 1: Write failing language tests**

Create tests/unit/language.test.ts:

    import {describe,expect,it} from 'vitest';
    import {resolveLanguage} from '../../src/scripts/language';

    describe('resolveLanguage',()=>{
      it('defaults to English',()=>{
        expect(resolveLanguage(null)).toBe('en');
      });

      it('restores Chinese',()=>{
        expect(resolveLanguage('zh')).toBe('zh');
      });

      it('rejects unknown stored values',()=>{
        expect(resolveLanguage('fr')).toBe('en');
      });
    });

- [ ] **Step 2: Run the unit test**

Run:

    npm test -- tests/unit/language.test.ts

Expected: FAIL because src/scripts/language.ts does not exist.

- [ ] **Step 3: Implement the language controller**

Create src/scripts/language.ts:

    export type Language='en'|'zh';

    const storageKey='lucasxl-language';

    export function resolveLanguage(value:string|null):Language {
      return value==='zh'?'zh':'en';
    }

    export function applyLanguage(language:Language,root:Document=document):void {
      root.documentElement.lang=language==='zh'?'zh-CN':'en';
      root.querySelectorAll<HTMLElement>('[data-lang]').forEach(element=>{
        element.hidden=element.dataset.lang!==language;
      });
      root.querySelectorAll<HTMLButtonElement>('[data-language-choice]').forEach(button=>{
        const active=button.dataset.languageChoice===language;
        button.setAttribute('aria-pressed',String(active));
      });
      root.defaultView?.dispatchEvent(new CustomEvent('portfolio:languagechange',{
        detail:{language}
      }));
    }

    export function initLanguage(root:Document=document):void {
      const view=root.defaultView;
      if(!view){
        return;
      }
      const initial=resolveLanguage(view.localStorage.getItem(storageKey));
      applyLanguage(initial,root);
      root.querySelectorAll<HTMLButtonElement>('[data-language-choice]').forEach(button=>{
        button.addEventListener('click',()=>{
          const language=resolveLanguage(button.dataset.languageChoice??null);
          view.localStorage.setItem(storageKey,language);
          applyLanguage(language,root);
        });
      });
    }

- [ ] **Step 4: Create the switch and bilingual UI dictionary**

Create src/components/LanguageSwitch.astro:

    <div class="language-switch" aria-label="Language">
      <button type="button" data-language-choice="en" aria-pressed="true">EN</button>
      <span aria-hidden="true">/</span>
      <button type="button" data-language-choice="zh" aria-pressed="false">中</button>
    </div>

    <script>
      import {initLanguage} from '../scripts/language';
      initLanguage();
    </script>

Create src/i18n/ui.ts with typed English and Chinese values for Home, Timeline, About, Resume, Contact, View Project, View Experience, Back to Timeline, Previous, Next, and External Links. Export one ui object with en and zh keys; do not place project claims in this file.

- [ ] **Step 5: Verify the pure language behavior**

Run:

    npm test -- tests/unit/language.test.ts

Expected: three passing tests.

- [ ] **Step 6: Commit the language foundation**

Run:

    git add src/scripts/language.ts src/components/LanguageSwitch.astro src/i18n/ui.ts tests/unit/language.test.ts
    git commit -m "feat: add persistent bilingual switching"

---

### Task 5: Build the Shared Shell and Static Routes

**Files:**
- Create: src/data/profile.ts
- Create: src/layouts/BaseLayout.astro
- Create: src/components/SiteHeader.astro
- Create: src/components/SiteFooter.astro
- Create: src/components/IntroHero.astro
- Create: src/components/ContactLinks.astro
- Modify: src/pages/index.astro
- Create: src/pages/about.astro
- Create: src/pages/resume.astro
- Create: src/pages/contact.astro
- Create: src/pages/404.astro
- Create: tests/e2e/language.spec.ts

**Interfaces:**
- Consumes: LanguageSwitch and ui dictionary from Task 4
- Produces: one shared HTML shell, semantic global navigation, profile copy contract, title-only Resume route, and custom 404 route

- [ ] **Step 1: Define the content contract without inventing claims**

Create src/data/profile.ts:

    export type LocalizedProfile={
      name:string;
      identity:string;
      introduction:string;
      about:string[];
    };

    export type ContactConfig={
      email?:string;
      github?:string;
    };

    export const profile:Record<'en'|'zh',LocalizedProfile>={
      en:{
        name:'Lucas Xin',
        identity:'Student researcher and builder',
        introduction:'Exploring artificial intelligence, robotics, and computational research.',
        about:[]
      },
      zh:{
        name:'Lucas Xin',
        identity:'学生研究者与创作者',
        introduction:'探索人工智能、机器人与计算研究。',
        about:[]
      }
    };

    export const contact:ContactConfig={};

The empty about arrays and absent contact values are deliberate unpublished content states. Components must omit absent paragraphs and links. Before binding lucasxl.com, the user supplies verified About, email, and GitHub values and reruns all checks.

- [ ] **Step 2: Implement the shared shell**

Create SiteHeader.astro with a skip link, Home, Timeline, About, Resume, Contact, and LanguageSwitch. Render English and Chinese link labels as paired data-lang elements.

Create SiteFooter.astro with only the name, current year, and bilingual Back to top label.

Create BaseLayout.astro with:

- doctype and html lang="en";
- UTF-8 and viewport metadata;
- title and description props;
- canonical URL derived from Astro.url and Astro.site;
- favicon;
- SiteHeader before main content;
- one main slot with id="main-content";
- SiteFooter after the main slot;
- src/styles/global.css import.

BaseLayout props must be:

    type Props={
      title:string;
      description:string;
    };

- [ ] **Step 3: Implement safe contact rendering**

Create src/components/ContactLinks.astro:

    ---
    import {contact} from '../data/profile';
    const emailValid=contact.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
    const githubValid=contact.github&&/^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(contact.github);
    ---
    <ul class="contact-links">
      {emailValid&&<li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>}
      {githubValid&&<li><a href={contact.github} rel="me noreferrer">GitHub</a></li>}
    </ul>

Invalid or absent values do not render.

- [ ] **Step 4: Implement the introduction and static pages**

Create IntroHero.astro to render paired English and Chinese name, identity, and introduction content plus links to #timeline, /about, and /contact.

Update index.astro to use BaseLayout and IntroHero. Keep a temporary empty section with id="timeline"; Task 6 replaces it with the Timeline component.

Create about.astro using BaseLayout. Render paired About headings and map only existing profile.about paragraphs.

Create resume.astro using BaseLayout. Render only paired Resume headings. Do not render explanation, download controls, or content containers.

Create contact.astro using BaseLayout. Render paired Contact headings and ContactLinks.

Create 404.astro using BaseLayout. Render a plain bilingual not-found heading plus Home and Timeline links.

- [ ] **Step 5: Verify the language integration and static build**

Create tests/e2e/language.spec.ts:

    import {expect,test} from '@playwright/test';

    test('English defaults and Chinese persists on the same URL',async({page})=>{
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('lang','en');
      const originalUrl=page.url();
      await page.getByRole('button',{name:'中'}).click();
      await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
      expect(page.url()).toBe(originalUrl);
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
    });

Run:

    npm run build

Expected: /, /about, /resume, /contact, and /404.html build successfully.

Run:

    npx playwright install chromium

Run:

    npm run test:e2e -- tests/e2e/language.spec.ts --project=chromium

Expected: the same-URL language test passes.

- [ ] **Step 6: Commit the shared pages**

Run:

    git add src/data/profile.ts src/layouts/BaseLayout.astro src/components/SiteHeader.astro src/components/SiteFooter.astro src/components/IntroHero.astro src/components/ContactLinks.astro src/pages tests/e2e/language.spec.ts
    git commit -m "feat: add portfolio shell and static pages"

---

### Task 6: Build the Timeline and Generated Child Pages

**Files:**
- Create: src/components/Timeline.astro
- Create: src/components/TimelineEntry.astro
- Create: src/components/MediaFigure.astro
- Create: src/components/EntryNavigation.astro
- Create: src/layouts/EntryLayout.astro
- Create: src/layouts/ResearchLayout.astro
- Create: src/layouts/EngineeringLayout.astro
- Create: src/layouts/ExperienceLayout.astro
- Create: src/pages/projects/[slug].astro
- Create: src/pages/experiences/[slug].astro
- Modify: src/pages/index.astro
- Create: tests/unit/timeline-contract.test.ts
- Create: tests/e2e/navigation.spec.ts

**Interfaces:**
- Consumes: getPortfolioEntries(), getTimelineGroups(), PortfolioEntry, routeFor(), and neighborsFor()
- Produces: earliest-to-newest timeline, project routes, experience routes, three templates, and child-page navigation

- [ ] **Step 1: Write the failing timeline contract test**

Create tests/unit/timeline-contract.test.ts:

    import {existsSync,readFileSync} from 'node:fs';
    import {resolve} from 'node:path';
    import {expect,it} from 'vitest';

    it('uses a link for each timeline preview and contains no inline detail region',()=>{
      const file=resolve('src/components/TimelineEntry.astro');
      expect(existsSync(file)).toBe(true);
      if(!existsSync(file)){
        return;
      }
      const source=readFileSync(file,'utf8');
      expect(source).toContain('data-timeline-entry');
      expect(source).toContain('<a');
      expect(source).not.toContain('data-entry-detail');
    });

- [ ] **Step 2: Run the contract test before implementation**

Run:

    npm test -- tests/unit/timeline-contract.test.ts

Expected: FAIL because src/components/TimelineEntry.astro does not exist.

- [ ] **Step 3: Write the browser navigation test**

Create tests/e2e/navigation.spec.ts:

    import {expect,test} from '@playwright/test';

    test('timeline cards navigate instead of expanding inline',async({page})=>{
      await page.goto('/');
      const timeline=page.locator('#timeline');
      await expect(timeline).toBeVisible();
      await expect(timeline.locator('[data-entry-detail]')).toHaveCount(0);
      const cards=timeline.locator('[data-timeline-entry]');
      if(await cards.count()>0){
        const href=await cards.first().getAttribute('href');
        expect(href).toMatch(/^\/(projects|experiences)\/[a-z0-9-]+$/);
      }
    });

    test('resume contains a heading and no download link',async({page})=>{
      await page.goto('/resume');
      await expect(page.getByRole('heading',{level:1})).toContainText('Resume');
      await expect(page.getByRole('link',{name:/download/i})).toHaveCount(0);
    });

- [ ] **Step 4: Implement timeline previews**

TimelineEntry.astro accepts:

    type Props={
      entry:PortfolioEntry;
    };

It renders one anchor with data-timeline-entry, entry.route, the cover image, date, category, optional status, paired localized title and summary, and paired View Project or View Experience labels. It never renders Markdown body content.

Timeline.astro loads getTimelineGroups(), renders section id="timeline", renders each year as a heading, and renders TimelineEntry for every grouped entry. If there are no published entries, it renders the Timeline heading and no fabricated cards or empty-state marketing copy.

Replace the temporary timeline section in index.astro with Timeline.

- [ ] **Step 5: Implement shared entry media and navigation**

MediaFigure.astro accepts src, enAlt, zhAlt, optional enCaption, and optional zhCaption. It renders paired images so alternative text matches the visible language. If src is absent, use /images/default-cover.svg.

EntryNavigation.astro accepts previous and next PortfolioEntry values. It always renders Back to Timeline and conditionally renders chronological Previous and Next links.

EntryLayout.astro accepts entry, previous, and next. It renders:

- BaseLayout;
- title, period, status, and summary;
- cover MediaFigure;
- one English content slot marked data-lang="en";
- one Chinese content slot marked data-lang="zh" and hidden initially;
- external links with target="_blank" and rel="noreferrer";
- EntryNavigation.

- [ ] **Step 6: Create three distinct semantic templates**

ResearchLayout.astro wraps EntryLayout with article class research-project and labels its article type as Research.

EngineeringLayout.astro wraps EntryLayout with article class engineering-project and labels its article type as Engineering / Robotics.

ExperienceLayout.astro wraps EntryLayout with article class experience-entry and labels its article type as Experience.

The Markdown author templates from Task 2 provide each template's required section order. Layouts provide shared framing and distinct semantic class hooks without inventing project copy.

- [ ] **Step 7: Generate project routes**

Create src/pages/projects/[slug].astro. getStaticPaths loads published entries, filters kind project, and returns slug plus entry, previous, and next props. Render both localized Markdown entries with Astro render(). Select ResearchLayout when entry.meta.template is research and EngineeringLayout when it is engineering.

The page must follow this control shape:

    const allEntries=await getPortfolioEntries();
    const projectEntries=allEntries.filter(entry=>entry.meta.kind==='project');
    const paths=projectEntries.map(entry=>{
      const {previous,next}=neighborsFor(allEntries.map(item=>item.meta),entry.meta.slug);
      return {
        params:{slug:entry.meta.slug},
        props:{entry,previousSlug:previous?.slug,nextSlug:next?.slug}
      };
    });

Resolve previous and next full entries by slug before passing them to EntryNavigation.

- [ ] **Step 8: Generate experience routes**

Create src/pages/experiences/[slug].astro using the same static-path process, filtering kind experience and always using ExperienceLayout. Render English Markdown and Chinese Markdown when present; render the English Markdown inside the Chinese language container when Chinese is absent.

- [ ] **Step 9: Verify navigation and generated pages**

Run:

    npm test

Expected: all unit tests pass.

Run:

    npm run build

Expected: draft author-example entries create no public route, and all configured published entries create exactly one child page each.

Run:

    npm run test:e2e -- tests/e2e/navigation.spec.ts --project=chromium

Expected: both navigation tests pass.

- [ ] **Step 10: Commit the timeline and child routes**

Run:

    git add src/components/Timeline.astro src/components/TimelineEntry.astro src/components/MediaFigure.astro src/components/EntryNavigation.astro src/layouts src/pages tests/unit/timeline-contract.test.ts tests/e2e/navigation.spec.ts
    git commit -m "feat: add timeline and portfolio detail routes"

---

### Task 7: Add Content Validation and Accessibility Verification

**Files:**
- Create: scripts/validate-content.ts
- Create: tests/e2e/accessibility.spec.ts
- Create: tests/fixtures/content/invalid-research/meta.json
- Create: tests/fixtures/content/invalid-research/en.md
- Modify: src/styles/global.css
- Modify: package.json
- Modify: package-lock.json

**Interfaces:**
- Consumes: metadata and Markdown files under src/content
- Produces: deterministic pre-build validation, keyboard-visible structure, mobile checks, and automated accessibility checks

- [ ] **Step 1: Define exact Markdown heading requirements**

Update package.json scripts so build and validate:content are exactly:

    {
      "build": "npm run validate:content && astro check && astro build",
      "validate:content": "tsx scripts/validate-content.ts"
    }

Keep every other existing script unchanged.

Create scripts/validate-content.ts with:

    import {existsSync,readdirSync,readFileSync} from 'node:fs';
    import {join} from 'node:path';
    import {z} from 'zod';

    const requiredHeadings={
      research:[
        'Research Question',
        'Why It Matters',
        'My Role',
        'Methodology',
        'Results and Evidence',
        'Limitations',
        'Reflection and Next Steps'
      ],
      engineering:[
        'Problem and Constraints',
        'My Responsibilities',
        'System Overview',
        'Implementation Process',
        'Testing and Iterations',
        'Results',
        'Failures and Lessons'
      ],
      experience:[
        'Context',
        'Participation',
        'My Contribution',
        'Selected Work',
        'Learning and Reflection'
      ]
    } as const;

    const metaSchema=z.object({
      slug:z.string(),
      template:z.enum(['research','engineering','experience']),
      status:z.enum(['draft','published']),
      cover:z.string()
    });

    const requestedRoots=process.argv.slice(2);
    const roots=requestedRoots.length>0
      ?requestedRoots
      :['src/content/projects','src/content/experiences'];
    const errors:string[]=[];

    for(const root of roots){
      if(!existsSync(root)){
        continue;
      }
      for(const directory of readdirSync(root,{withFileTypes:true}).filter(entry=>entry.isDirectory())){
        const base=join(root,directory.name);
        const metaPath=join(base,'meta.json');
        const enPath=join(base,'en.md');
        if(!existsSync(metaPath)||!existsSync(enPath)){
          errors.push(`${base}: meta.json and en.md are required`);
          continue;
        }
        const meta=metaSchema.parse(JSON.parse(readFileSync(metaPath,'utf8')));
        if(meta.status==='draft'){
          continue;
        }
        const markdown=readFileSync(enPath,'utf8');
        for(const heading of requiredHeadings[meta.template]){
          if(!markdown.includes(`## ${heading}`)){
            errors.push(`${enPath}: missing heading "## ${heading}"`);
          }
        }
        const coverPath=join('public',meta.cover.replace(/^\//,''));
        if(!existsSync(coverPath)){
          errors.push(`${metaPath}: cover does not exist at ${coverPath}`);
        }
      }
    }

    if(errors.length>0){
      console.error(errors.join('\n'));
      process.exit(1);
    }

    console.log('Content validation passed');

- [ ] **Step 2: Prove validation rejects an incomplete published entry**

Create tests/fixtures/content/invalid-research/meta.json:

    {
      "slug": "invalid-research",
      "template": "research",
      "status": "published",
      "cover": "/images/default-cover.svg"
    }

Create tests/fixtures/content/invalid-research/en.md:

    ---
    title: Validation Fixture
    summary: A deliberately incomplete research entry used to test the validator.
    coverAlt: Neutral geometric test cover
    ---
    ## Research Question
    ## Why It Matters
    ## My Role
    ## Methodology
    ## Results and Evidence
    ## Reflection and Next Steps

The negative fixture intentionally omits the Limitations heading.

Run:

    npx tsx scripts/validate-content.ts tests/fixtures/content

Expected: exit code 1 with missing heading "## Limitations".

- [ ] **Step 3: Verify valid draft content**

Run:

    npm run validate:content

Expected: Content validation passed.

- [ ] **Step 4: Add accessibility and mobile tests**

Create tests/e2e/accessibility.spec.ts:

    import AxeBuilder from '@axe-core/playwright';
    import {expect,test} from '@playwright/test';

    for(const path of ['/','/about','/resume','/contact']){
      test(`${path} has no serious accessibility violations`,async({page})=>{
        await page.goto(path);
        const results=await new AxeBuilder({page}).analyze();
        const serious=results.violations.filter(
          violation=>violation.impact==='serious'||violation.impact==='critical'
        );
        expect(serious).toEqual([]);
      });
    }

    test('global navigation is keyboard reachable',async({page})=>{
      await page.goto('/');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link',{name:/skip/i})).toBeFocused();
    });

- [ ] **Step 5: Add structural responsive rules only**

Extend src/styles/global.css with these structural rules:

    main,
    .site-header__inner,
    .site-footer__inner {
      width:min(calc(100% - 2rem),72rem);
      margin-inline:auto;
    }

    .site-nav {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:1rem;
    }

    .site-nav__links {
      display:flex;
      flex-wrap:wrap;
      gap:1rem;
    }

    .timeline {
      display:grid;
      gap:2rem;
    }

    .timeline-year {
      display:grid;
      gap:1rem;
    }

    .timeline-entry {
      display:grid;
      grid-template-columns:minmax(12rem,2fr) minmax(0,3fr);
      gap:1.5rem;
    }

    .entry-content {
      max-width:70ch;
    }

    img {
      display:block;
      max-width:100%;
      height:auto;
    }

    @media (max-width:720px) {
      .site-nav,
      .timeline-entry {
        grid-template-columns:1fr;
      }

      .site-nav {
        align-items:flex-start;
        flex-direction:column;
      }
    }

    @media (prefers-reduced-motion:reduce) {
      html {
        scroll-behavior:auto;
      }

      *,
      *::before,
      *::after {
        animation-duration:.01ms !important;
        animation-iteration-count:1 !important;
        transition-duration:.01ms !important;
      }
    }

These rules define layout and accessibility only. Preserve semantic class hooks so the separate visual-reference work can supply typography, color, spacing, borders, and decoration without changing page structure.

- [ ] **Step 6: Run the full local gate**

Run:

    npm run validate:content

Expected: Content validation passed.

Run:

    npm test

Expected: all unit tests pass.

Run:

    npm run build

Expected: Astro check and static build pass and dist contains every approved route.

Run:

    npm run test:e2e

Expected: Chromium desktop and iPhone 13 projects pass language, navigation, and accessibility tests.

- [ ] **Step 7: Commit the validation gate**

Run:

    git add scripts/validate-content.ts tests/fixtures/content tests/e2e/accessibility.spec.ts src/styles/global.css package.json package-lock.json
    git commit -m "test: validate portfolio content and accessibility"

---

### Task 8: Document the Workflow and Create a Cloudflare Preview Deployment

**Files:**
- Create: README.md

**Interfaces:**
- Consumes: tested structural site from Tasks 1–7, intended GitHub account access, and the active Cloudflare account
- Produces: public lucasxl-website GitHub repository, automatic Cloudflare preview deployment, and an exact content-release gate

- [ ] **Step 1: Document authoring and deployment**

Create README.md with:

- prerequisites: Node.js 22.16.0 and npm;
- local commands: npm install, npm run dev, npm test, npm run build, npm run test:e2e;
- exact directory structure for projects and experiences;
- the three author-template choices;
- draft versus published behavior;
- bilingual fallback behavior;
- content privacy checklist;
- Cloudflare settings: production branch main, build command npm run build, output directory dist.
- release gate: do not bind lucasxl.com until verified profile copy, at least one published timeline entry, the public email address, and the public GitHub URL are present and the full test gate passes.

- [ ] **Step 2: Run the structural pre-deployment gate**

Run:

    git diff --check

Expected: no output.

Run:

    npm run validate:content

Expected: Content validation passed.

Run:

    npm test

Expected: all unit tests pass.

Run:

    npm run build

Expected: successful static build.

Run:

    npm run test:e2e

Expected: both desktop and mobile projects pass.

- [ ] **Step 3: Commit the workflow documentation**

Run:

    git add README.md
    git commit -m "docs: explain portfolio authoring and deployment"

- [ ] **Step 4: Create the public GitHub repository**

Confirm the authenticated GitHub account is the intended owner, then run:

    gh repo create lucasxl-website --public --source=. --remote=origin --push

Expected: GitHub returns the new public repository URL, origin points to that URL, and origin/main matches local main.

- [ ] **Step 5: Connect Cloudflare Git deployment**

In Cloudflare:

1. open Workers & Pages;
2. create a Pages application and choose Connect to Git;
3. install Cloudflare Workers and Pages on the intended GitHub account;
4. choose Only select repositories;
5. authorize only lucasxl-website;
6. select lucasxl-website;
7. set production branch to main;
8. set build command to npm run build;
9. set build output directory to dist;
10. save and deploy.

Expected: the first deployment succeeds and produces a pages.dev URL. A test branch or pull request produces a preview deployment without changing production.

- [ ] **Step 6: Verify automatic preview updates**

Create a non-content README correction on a branch, push it, and confirm a preview deployment appears. Merge it to main and confirm Cloudflare automatically creates a successful production deployment.

Run:

    git status --short --branch

Expected: clean main branch synchronized with origin/main.

- [ ] **Step 7: Record the content-release handoff**

Record in README that the custom-domain release is a separate follow-up after the user supplies publication-approved content. That follow-up must:

1. replace the draft author examples with verified project and experience directories;
2. add verified English and Chinese profile content;
3. configure the public email and GitHub values;
4. rerun content validation, unit tests, production build, browser tests, mobile tests, and accessibility tests;
5. add lucasxl.com and www.lucasxl.com in Cloudflare Custom domains;
6. make lucasxl.com canonical and redirect www.lucasxl.com to it;
7. verify active TLS and HTTPS before announcing publication.

Expected: the preview deployment is available for structural review, while lucasxl.com remains unbound until the content-release gate is satisfied.

---

## Final Review Checklist

- [ ] The implementation matches every route in the approved specification.
- [ ] The home page contains introduction, timeline, contact call to action, and footer in that order.
- [ ] Timeline entries are earliest to newest and grouped by year.
- [ ] No timeline interaction reveals detail content on the home page.
- [ ] Project and experience routes are separate child pages.
- [ ] Research, engineering, and experience templates are structurally distinct.
- [ ] English defaults and Chinese switches without URL changes.
- [ ] Language preference persists and missing Chinese content falls back to English.
- [ ] Resume contains its title only.
- [ ] Contact renders no unverified value; the release gate requires approved email and GitHub links.
- [ ] Draft author examples do not appear on public routes.
- [ ] Automated schema, unit, build, browser, mobile, and accessibility gates pass.
- [ ] GitHub repository visibility is public.
- [ ] Cloudflare GitHub App access is limited to lucasxl-website.
- [ ] main deploys automatically and preview branches do not replace production.
- [ ] The Cloudflare preview URL is live; lucasxl.com remains behind the documented content-release gate.

## Primary References

- Design specification: docs/superpowers/specs/2026-09-03-personal-portfolio-design.md
- Cloudflare Astro guide: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Cloudflare Git integration: https://developers.cloudflare.com/pages/get-started/git-integration/
- Cloudflare custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
