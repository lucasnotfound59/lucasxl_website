import {describe,expect,it} from 'vitest';
import {applyLanguage,initLanguage,resolveLanguage} from '../../src/scripts/language';

type TestElement={
  dataset:Record<string,string|undefined>;
  hidden:boolean;
  attributes:Record<string,string>;
  setAttribute:(name:string,value:string)=>void;
  addEventListener:(type:string,listener:()=>void)=>void;
  click:()=>void;
};

function createElement(language?:'en'|'zh',languageChoice?:'en'|'zh'):TestElement {
  const listeners:(()=>void)[]=[];
  const dataset:Record<string,string|undefined>={};
  if(language){
    dataset.lang=language;
  }
  if(languageChoice){
    dataset.languageChoice=languageChoice;
  }
  return {
    dataset,
    hidden:false,
    attributes:{},
    setAttribute(name,value){
      this.attributes[name]=value;
    },
    addEventListener(_type,listener){
      listeners.push(listener);
    },
    click(){
      listeners.forEach(listener=>listener());
    }
  };
}

function createDocument(groups:TestElement[][],storedLanguage:string|null=null){
  const languageElements=groups.flat();
  const englishButton=createElement(undefined,'en');
  const chineseButton=createElement(undefined,'zh');
  const events:CustomEvent[]=[];
  let savedLanguage=storedLanguage;
  const root={
    documentElement:{lang:'en'},
    defaultView:{
      localStorage:{
        getItem:()=>savedLanguage,
        setItem:(_key:string,value:string)=>{
          savedLanguage=value;
        }
      },
      dispatchEvent:(event:CustomEvent)=>{
        events.push(event);
        return true;
      }
    },
    querySelectorAll:(selector:string)=>{
      if(selector==='[data-lang]'){
        return languageElements;
      }
      if(selector==='[data-lang-group]'){
        return groups.map(elements=>({
          querySelectorAll:()=>elements
        }));
      }
      if(selector==='[data-language-choice]'){
        return [englishButton,chineseButton];
      }
      return [];
    }
  } as unknown as Document;
  return {root,englishButton,chineseButton,events,getSavedLanguage:()=>savedLanguage};
}

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

describe('language binding',()=>{
  it('keeps English visible for a grouped entry with no Chinese copy',()=>{
    const pairedEnglish=createElement('en');
    const pairedChinese=createElement('zh');
    const englishOnly=createElement('en');
    const {root}=createDocument([[pairedEnglish,pairedChinese],[englishOnly]]);

    applyLanguage('zh',root);

    expect(pairedEnglish.hidden).toBe(true);
    expect(pairedChinese.hidden).toBe(false);
    expect(englishOnly.hidden).toBe(false);
  });

  it('persists a selection and updates state, visibility, and events',()=>{
    const english=createElement('en');
    const chinese=createElement('zh');
    const {root,englishButton,chineseButton,events,getSavedLanguage}=createDocument([[english,chinese]],'zh');

    initLanguage(root);

    expect(root.documentElement.lang).toBe('zh-CN');
    expect(english.hidden).toBe(true);
    expect(chinese.hidden).toBe(false);
    expect(englishButton.attributes['aria-pressed']).toBe('false');
    expect(chineseButton.attributes['aria-pressed']).toBe('true');
    expect(events[0]?.detail).toEqual({language:'zh'});

    englishButton.click();

    expect(getSavedLanguage()).toBe('en');
    expect(root.documentElement.lang).toBe('en');
    expect(english.hidden).toBe(false);
    expect(chinese.hidden).toBe(true);
    expect(englishButton.attributes['aria-pressed']).toBe('true');
    expect(chineseButton.attributes['aria-pressed']).toBe('false');
    expect(events[1]?.detail).toEqual({language:'en'});
  });
});
