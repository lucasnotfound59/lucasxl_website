export type Language='en'|'zh';

export function resolveLanguage(value:string|null):Language {
  return value==='zh'?'zh':'en';
}

const storageKey='lucasxl-language';

/**
 * A data-lang-group owns direct data-lang children. If Chinese is unavailable
 * within that group, its English child remains the visible same-URL fallback.
 */
function applyLanguageGroup(group:HTMLElement,language:Language):HTMLElement[] {
  const elements=Array.from(group.querySelectorAll<HTMLElement>(':scope > [data-lang]'));
  const visibleLanguage=language==='zh'&&!elements.some(element=>element.dataset.lang==='zh')?'en':language;
  elements.forEach(element=>{
    element.hidden=element.dataset.lang!==visibleLanguage;
  });
  return elements;
}

export function applyLanguage(language:Language,root:Document=document):void {
  root.documentElement.lang=language==='zh'?'zh-CN':'en';
  const groupedElements=new Set(
    Array.from(root.querySelectorAll<HTMLElement>('[data-lang-group]')).flatMap(group=>applyLanguageGroup(group,language))
  );
  root.querySelectorAll<HTMLElement>('[data-lang]').forEach(element=>{
    if(!groupedElements.has(element)){
      element.hidden=element.dataset.lang!==language;
    }
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
