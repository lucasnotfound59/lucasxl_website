import {describe,expect,it} from 'vitest';
import {metaSchema} from '../../src/lib/content-schema';

function publishedEntryWith(url:string){
  return {
    slug:'safe-links',
    kind:'project',
    template:'research',
    startDate:'2026-09-03',
    category:'Research',
    status:'published',
    cover:'/images/default-cover.svg',
    order:0,
    links:[{label:'Project site',url}]
  };
}

describe('published entry external links',()=>{
  it('accepts HTTPS links',()=>{
    expect(metaSchema.safeParse(publishedEntryWith('https://example.com/project')).success)
      .toBe(true);
  });

  it.each(['javascript:alert(1)','data:text/html,unsafe','ftp://example.com/file'])(
    'rejects the unsafe scheme in %s',
    url=>{
      expect(metaSchema.safeParse(publishedEntryWith(url)).success).toBe(false);
    }
  );
});
