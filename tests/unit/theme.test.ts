import {describe,expect,it} from 'vitest';
import {parseThemeMode,resolveTheme} from '../../src/scripts/theme';

describe('parseThemeMode',()=>{
  it('accepts the three stored modes',()=>{
    expect(parseThemeMode('system')).toBe('system');
    expect(parseThemeMode('light')).toBe('light');
    expect(parseThemeMode('dark')).toBe('dark');
  });

  it('falls back to system for null or unknown values',()=>{
    expect(parseThemeMode(null)).toBe('system');
    expect(parseThemeMode('sepia')).toBe('system');
  });
});

describe('resolveTheme',()=>{
  it('honours explicit light and dark',()=>{
    expect(resolveTheme('light',true)).toBe('light');
    expect(resolveTheme('dark',false)).toBe('dark');
  });

  it('follows the OS in system mode',()=>{
    expect(resolveTheme('system',true)).toBe('dark');
    expect(resolveTheme('system',false)).toBe('light');
  });
});
