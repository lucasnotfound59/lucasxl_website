export type Language='en'|'zh';

export function resolveLanguage(value:string|null):Language {
  return value==='zh'?'zh':'en';
}

const storageKey='lucasxl-language';

export function applyLanguage(language:Language,root:Document=document):void {
  root.documentElement.lang=language==='zh'?'zh-CN':'en';
  root.querySelectorAll<HTMLElement>('[data-lang]').forEach(element=>{
    element.hidden=element.dataset.lang!==language;
  });
  root.querySelectorAll<HTMLButtonElement>('[data-language-choice]').forEach(button=>{
    const active=button.dataset.languageChoice===language;
    button.setAttribute('aria-pressed',String(active));
  });
  root.defaultView?.dispatchEvent(new CustomEvent('portfolio:languagechange',{
    detail:{language}
  }));
}

export function initLanguage(root:Document=document):void {
  const view=root.defaultView;
  if(!view){
    return;
  }
  const initial=resolveLanguage(view.localStorage.getItem(storageKey));
  applyLanguage(initial,root);
  root.querySelectorAll<HTMLButtonElement>('[data-language-choice]').forEach(button=>{
    button.addEventListener('click',()=>{
      const language=resolveLanguage(button.dataset.languageChoice??null);
      view.localStorage.setItem(storageKey,language);
      applyLanguage(language,root);
    });
  });
}
