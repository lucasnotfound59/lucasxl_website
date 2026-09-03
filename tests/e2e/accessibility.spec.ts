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
