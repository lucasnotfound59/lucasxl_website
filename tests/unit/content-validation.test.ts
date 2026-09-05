import {spawnSync} from 'node:child_process';
import {describe,expect,it} from 'vitest';

function validate(root:string){
  return spawnSync(process.execPath,['--import','tsx','scripts/validate-content.ts',root],{
    cwd:process.cwd(),
    encoding:'utf8'
  });
}

describe('research content heading validation',()=>{
  it('accepts the legacy research headings',()=>{
    expect(validate('tests/fixtures/validation/legacy').status).toBe(0);
  });

  it('accepts the approved editorial research headings',()=>{
    expect(validate('tests/fixtures/validation/editorial').status).toBe(0);
  });

  it('rejects a research entry with a missing required section',()=>{
    const result=validate('tests/fixtures/validation/incomplete');
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('missing heading');
  });
});
