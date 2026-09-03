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
