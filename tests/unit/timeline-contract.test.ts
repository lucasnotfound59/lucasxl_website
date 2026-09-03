import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {expect,it} from 'vitest';

it('uses a link for each timeline preview and contains no inline detail region',()=>{
  const file=resolve('src/components/TimelineEntry.astro');
  expect(existsSync(file)).toBe(true);
  if(!existsSync(file)){
    return;
  }
  const source=readFileSync(file,'utf8');
  expect(source).toContain('data-timeline-entry');
  expect(source).toContain('<a');
  expect(source).not.toContain('data-entry-detail');
});
