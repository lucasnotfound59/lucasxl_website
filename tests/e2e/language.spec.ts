import {expect,test} from '@playwright/test';

test('English defaults and Chinese persists through anchors and routes',async({page})=>{
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang','en');

  await page.getByRole('button',{name:'中'}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');

  await page.locator('.site-nav__links').getByRole('link',{name:'关于'}).click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');

  await page.locator('#about').getByRole('link',{name:'了解更多'}).click();
  await expect(page).toHaveURL('/about');
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
});
