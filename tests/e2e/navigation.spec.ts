import {expect,test} from '@playwright/test';

test('header routes visitors through homepage previews',async({page})=>{
  await page.goto('/');
  const hrefs=await page.locator('.site-nav__links>a').evaluateAll(links=>
    links.map(link=>link.getAttribute('href'))
  );
  expect(hrefs).toEqual(['/#welcome','/#about','/#timeline','/resume','/#contact']);
});

test('timeline cards navigate instead of expanding inline',async({page})=>{
  await page.goto('/');
  const timeline=page.locator('#timeline');
  await expect(timeline).toBeVisible();
  await expect(timeline.locator('[data-entry-detail]')).toHaveCount(0);
  const cards=timeline.locator('[data-timeline-entry]');
  await expect(cards).toHaveCount(3);
  expect(await cards.evaluateAll(elements=>elements.map(element=>element.getAttribute('href')))).toEqual([
    '/projects/shared-entry',
    '/experiences/shared-entry',
    '/projects/engineering-entry'
  ]);
  await cards.first().click();
  await expect(page).toHaveURL('/projects/shared-entry');
  await expect(page.locator('article.research-project')).toBeVisible();
});

test('home composes previews and footer in the confirmed order',async({page})=>{
  await page.goto('/');
  const compositionIds=await page.locator('main#main-content>section,.site-footer').evaluateAll(elements=>
    elements.map(element=>element.id||element.className)
  );
  expect(compositionIds).toEqual(['welcome','about','timeline','contact','site-footer']);

  const about=page.locator('#about');
  await expect(about.getByRole('heading',{name:'About',level:2})).toBeVisible();
  await expect(about.getByRole('link',{name:'Read more'})).toHaveAttribute('href','/about');

  const contact=page.locator('#contact');
  await expect(contact.getByRole('heading',{name:'Contact',level:2})).toBeVisible();
  await expect(contact.getByRole('link',{name:'Contact me'})).toHaveAttribute('href','/contact');
});

test('generated templates preserve cross-kind navigation and Chinese fallback',async({page})=>{
  await page.goto('/experiences/shared-entry');
  await expect(page.locator('article.experience-entry')).toBeVisible();
  await expect(page.locator('a[rel="prev"]')).toHaveAttribute('href','/projects/shared-entry');
  await expect(page.locator('a[rel="next"]')).toHaveAttribute('href','/projects/engineering-entry');

  await page.getByRole('button',{name:'中'}).click();
  const fallback=page.locator('.entry-content > [data-lang="zh"]');
  await expect(fallback).toBeVisible();
  await expect(fallback).toContainText('English fallback body.');

  await page.goto('/projects/engineering-entry');
  await expect(page.locator('article.engineering-project')).toBeVisible();
});

test('resume contains a heading and no download link',async({page})=>{
  await page.goto('/resume');
  await expect(page.getByRole('heading',{level:1})).toContainText('Resume');
  await expect(page.getByRole('link',{name:/download/i})).toHaveCount(0);
});

test('blank shell does not publish unverified biography',async({page})=>{
  await page.goto('/');
  await expect(page.getByText('Student researcher and builder')).toHaveCount(0);
  await expect(page.getByText('Exploring artificial intelligence, robotics, and computational research.')).toHaveCount(0);
  await expect(page.locator('#about [data-about-preview-copy]')).toHaveCount(0);
  await expect(page.locator('.intro-hero__copy>p')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Lucas Xin',level:1})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Timeline',level:2})).toBeVisible();
});
