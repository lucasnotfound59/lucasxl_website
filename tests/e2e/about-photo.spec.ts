import {expect,test} from '@playwright/test';

test('sunset belongs to the homepage About, not the detail page',async({page})=>{
  await page.goto('/#about');
  const figure=page.locator('#about .about-preview__sunset');
  for(const language of ['EN','中']){
    await page.getByRole('button',{name:language,exact:true}).click();
    await expect(figure.locator('figcaption')).toHaveText('a nice sunset at BNDS');
    const img=figure.locator('img');
    await img.scrollIntoViewIfNeeded();
    await expect.poll(()=>img.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const textBox=await page.locator('.about-preview__text').boundingBox();
    const photoBox=await figure.boundingBox();
    expect(textBox).not.toBeNull();
    expect(photoBox).not.toBeNull();
    if(page.viewportSize()!.width>700){
      expect(photoBox!.x).toBeGreaterThanOrEqual(textBox!.x+textBox!.width);
    }else{
      expect(photoBox!.y).toBeGreaterThanOrEqual(textBox!.y+textBox!.height);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.goto('/about');
  await expect(page.locator('img[src="/images/photos/about-sunset.webp"]')).toHaveCount(0);
});
