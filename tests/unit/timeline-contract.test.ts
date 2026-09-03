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

it('keeps timeline card titles subordinate to year headings',()=>{
  const timelineFile=resolve('src/components/Timeline.astro');
  const entryFile=resolve('src/components/TimelineEntry.astro');
  expect(readFileSync(timelineFile,'utf8')).toContain('<h3 id={`timeline-year-${group.year}`}');
  expect(readFileSync(entryFile,'utf8')).toContain('<h4 data-lang-group>');
});
