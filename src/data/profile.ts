export type LocalizedProfile={
  name:string;
  identity:string;
  introduction:string;
  about:string[];
};

export type ContactConfig={
  email?:string;
  github?:string;
};

export const profile:Record<'en'|'zh',LocalizedProfile>={
  en:{
    name:'Lucas Xin',
    identity:'',
    introduction:'',
    about:[]
  },
  zh:{
    name:'Lucas Xin',
    identity:'',
    introduction:'',
    about:[]
  }
};

export const contact:ContactConfig={};
