import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {expect,it} from 'vitest';

function luminance(hex:string):number {
  const channels=hex.match(/[0-9a-f]{2}/gi)?.map(value=>parseInt(value,16)/255)??[];
  const linear=channels.map(value=>value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4);
  return 0.2126*(linear[0]??0)+0.7152*(linear[1]??0)+0.0722*(linear[2]??0);
}

function contrast(first:string,second:string):number {
  const firstLuminance=luminance(first);
  const secondLuminance=luminance(second);
  return (Math.max(firstLuminance,secondLuminance)+0.05)/(Math.min(firstLuminance,secondLuminance)+0.05);
}

it('keeps small red and paper text at WCAG AA contrast',()=>{
  const css=readFileSync(resolve('src/styles/global.css'),'utf8');
  const red=css.match(/--red:\s*#([0-9a-f]{6})/i)?.[1];
  const paper=css.match(/--paper:\s*#([0-9a-f]{6})/i)?.[1];
  expect(red).toBeDefined();
  expect(paper).toBeDefined();
  expect(contrast(red??'',paper??'')).toBeGreaterThanOrEqual(4.5);
});

it('lets the canvas animation sleep after movement settles',()=>{
  const layout=readFileSync(resolve('src/layouts/BaseLayout.astro'),'utf8');
  expect(layout).toMatch(/if \(maxV < 0\.01\) \{/);
  expect(layout).not.toContain('maxV < 0.01 && !mouse.active');
});
