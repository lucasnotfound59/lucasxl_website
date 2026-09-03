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
