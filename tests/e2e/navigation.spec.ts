import {expect,test} from '@playwright/test';

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

test('home ends with a localized contact call to action before the shared footer',async({page})=>{
  await page.goto('/');
  const sections=await page.locator('body').evaluate(body=>
    [...body.querySelectorAll('.intro-hero,#timeline,.home-contact,.site-footer')]
      .map(element=>element.classList.contains('intro-hero')
        ?'intro'
        :element.id||element.classList.item(0))
  );
  expect(sections).toEqual(['intro','timeline','home-contact','site-footer']);

  const contactCta=page.locator('.home-contact');
  await expect(contactCta.getByRole('link',{name:'Contact'})).toHaveAttribute('href','/contact');
  await page.getByRole('button',{name:'中'}).click();
  await expect(contactCta.getByRole('link',{name:'联系'})).toBeVisible();
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
  await expect(page.locator('.intro-hero__copy>p')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Lucas Xin',level:1})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Timeline',level:2})).toBeVisible();
});
