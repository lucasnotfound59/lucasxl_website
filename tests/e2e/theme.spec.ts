import AxeBuilder from '@axe-core/playwright';
import {expect,test} from '@playwright/test';

test('system default follows the OS and dark persists',async({page})=>{
  await page.emulateMedia({colorScheme:'light'});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.getByRole('button',{name:'Use system colour theme'})).toHaveAttribute('aria-pressed','true');

  await page.getByRole('button',{name:'Use dark theme'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content','#060811');
  await expect(page.locator('#stars')).toBeVisible();
  await expect(page.locator('#bg')).toBeHidden();
  await expect(page.getByRole('button',{name:'Use dark theme'})).toHaveAttribute('aria-pressed','true');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('#stars')).toBeVisible();
});

test('system mode follows OS changes without reload',async({page})=>{
  await page.emulateMedia({colorScheme:'light'});
  await page.goto('/');
  await page.getByRole('button',{name:'Use system colour theme'}).click();

  await page.emulateMedia({colorScheme:'dark'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('#stars')).toBeVisible();

  await page.emulateMedia({colorScheme:'light'});
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.locator('#bg')).toBeVisible();
});

test('dark home and entry pages have no serious axe violations',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Use dark theme'}).click();

  for(const path of ['/','/projects/engineering-entry','/about','/contact']){
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
    const results=await new AxeBuilder({page}).analyze();
    const serious=results.violations.filter(
      violation=>violation.impact==='serious'||violation.impact==='critical'
    );
    expect(serious).toEqual([]);
  }
});

test('reduced motion renders a static starfield',async({page})=>{
  await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
  await page.goto('/');
  await page.getByRole('button',{name:'Use dark theme'}).click();
  await expect(page.locator('#stars')).toBeVisible();
  await page.waitForTimeout(400);

  const first=await page.locator('#stars').evaluate((element:HTMLCanvasElement)=>element.toDataURL());
  await page.waitForTimeout(600);
  const second=await page.locator('#stars').evaluate((element:HTMLCanvasElement)=>element.toDataURL());
  expect(second).toBe(first);
});
