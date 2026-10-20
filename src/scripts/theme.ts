export type ThemeMode='system'|'light'|'dark';
export type Theme='light'|'dark';

export const THEME_STORAGE_KEY='lucasxl-theme';
export const THEME_COLORS:{light:string;dark:string}={light:'#F3EEE3',dark:'#060811'};

export function parseThemeMode(value:string|null):ThemeMode {
  return value==='light'||value==='dark'||value==='system'?value:'system';
}

export function resolveTheme(mode:ThemeMode,systemDark:boolean):Theme {
  if(mode==='system'){
    return systemDark?'dark':'light';
  }
  return mode;
}

export function applyTheme(mode:ThemeMode,root:Document=document):Theme {
  const view=root.defaultView;
  const systemDark=view?.matchMedia('(prefers-color-scheme: dark)').matches??false;
  const theme=resolveTheme(mode,systemDark);
  const html=root.documentElement;
  html.dataset.theme=theme;
  html.dataset.themeMode=mode;
  html.style.colorScheme=theme;
  root.querySelector('meta[name="theme-color"]')?.setAttribute('content',THEME_COLORS[theme]);
  root.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach(button=>{
    button.setAttribute('aria-pressed',String(button.dataset.themeChoice===mode));
  });
  view?.dispatchEvent(new CustomEvent('portfolio:themechange',{detail:{theme,mode}}));
  return theme;
}

export function initTheme(root:Document=document):void {
  const view=root.defaultView;
  if(!view){
    return;
  }
  if(root.documentElement.dataset.themeBound==='true'){
    return;
  }
  root.documentElement.dataset.themeBound='true';
  const media=view.matchMedia('(prefers-color-scheme: dark)');
  let mode:ThemeMode='system';
  try{
    mode=parseThemeMode(view.localStorage.getItem(THEME_STORAGE_KEY));
  }catch{}
  const render=()=>applyTheme(mode,root);
  media.addEventListener('change',()=>{
    if(mode==='system'){
      render();
    }
  });
  root.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach(button=>{
    button.addEventListener('click',()=>{
      mode=parseThemeMode(button.dataset.themeChoice??null);
      try{
        view.localStorage.setItem(THEME_STORAGE_KEY,mode);
      }catch{}
      render();
    });
  });
  render();
}
