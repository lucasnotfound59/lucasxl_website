import {describe,expect,it} from 'vitest';
import {formatPeriod} from '../../src/lib/portfolio';
import {metaSchema} from '../../src/lib/content-schema';

describe('project date precision',()=>{
  it('formats confirmed months without inventing days',()=>{
    const dates={startDate:'2026-03',endDate:'2026-08'};
    expect(formatPeriod(dates,'en')).toBe('Mar 2026 – Aug 2026');
    expect(formatPeriod(dates,'zh')).toBe('2026年3月 – 2026年8月');
    expect(formatPeriod({startDate:'2026-04',endDate:'2026-04'},'en')).toBe('Apr 2026');
  });
  it('distinguishes ongoing work from unknown end dates',()=>{
    expect(formatPeriod({startDate:'2025-09',ongoing:true},'zh')).toBe('2025年9月 – 至今');
    expect(formatPeriod({startDate:'2026-01',ongoing:true},'en')).toBe('Jan 2026 – Present');
    expect(formatPeriod({startDate:'2026-01'},'en')).toBe('Jan 2026');
    expect(formatPeriod({},'zh')).toBe('日期待确认');
  });
  it('preserves existing precise dates',()=>{
    expect(formatPeriod({startDate:'2024-06-01',endDate:'2024-07-01'},'en'))
      .toBe('2024-06-01 – 2024-07-01');
  });
  it('validates month dates and rejects contradictory ongoing periods',()=>{
    const base={slug:'test',kind:'project',template:'research',category:'Research',status:'published',cover:'/images/default-cover.svg',order:0,startDate:'2026-03'};
    expect(metaSchema.safeParse({...base,endDate:'2026-08'}).success).toBe(true);
    expect(metaSchema.safeParse({...base,ongoing:true}).success).toBe(true);
    expect(metaSchema.safeParse({...base,endDate:'2026-08',ongoing:true}).success).toBe(false);
    expect(metaSchema.safeParse({...base,startDate:undefined,ongoing:true}).success).toBe(false);
    expect(metaSchema.safeParse({...base,startDate:'2026-13'}).success).toBe(false);
  });
});
