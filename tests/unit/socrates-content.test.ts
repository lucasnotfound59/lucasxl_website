import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {describe,expect,it} from 'vitest';

const images=['c_accuracy_by_type.png','c_mratio.png','c_hallucination_acc.png','c_errors_ceiling.png'];
describe('SOCRATES public research content',()=>{
  for(const lang of ['en','zh']){
    it(`${lang} includes four accessible linked result figures and future plans`,()=>{
      const content=readFileSync(`src/content/projects/socrates/${lang}.md`,'utf8');
      expect(content.match(/class="research-figure"/g)).toHaveLength(4);
      for(const file of images){
        expect(content).toContain(`href="/images/socrates/${file}"`);
        expect(content).toContain(`src="/images/socrates/${file}"`);
        expect(existsSync(`public/images/socrates/${file}`)).toBe(true);
      }
      expect(content.match(/alt="[^"]+"/g)).toHaveLength(4);
      expect(content).toContain(lang==='en'?'## What I Can Do Next':'## 下一步探索');
      expect(content).toContain(lang==='en'?'Stanford':'斯坦福');
      expect(content).toContain(lang==='en'?'Chinese':'中文');
      expect(content).toContain(lang==='en'?'English':'英文');
      expect(content).toContain('1,647');
    });
  }
  it('publishes only the approved aggregate figures',()=>{
    expect(readdirSync('public/images/socrates').sort()).toEqual([...images].sort());
  });
});
