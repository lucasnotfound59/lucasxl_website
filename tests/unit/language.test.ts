import {describe,expect,it} from 'vitest';
import {resolveLanguage} from '../../src/scripts/language';

describe('resolveLanguage',()=>{
  it('defaults to English',()=>{
    expect(resolveLanguage(null)).toBe('en');
  });

  it('restores Chinese',()=>{
    expect(resolveLanguage('zh')).toBe('zh');
  });

  it('rejects unknown stored values',()=>{
    expect(resolveLanguage('fr')).toBe('en');
  });
});
