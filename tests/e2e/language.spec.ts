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
