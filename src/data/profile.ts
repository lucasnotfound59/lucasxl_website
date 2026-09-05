export type LocalizedProfile={
  name:string;
  identity:string;
  introduction:string;
  about:string[];
};

export type ContactConfig={
  emails:{label:string;address:string}[];
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

export const contact:ContactConfig={
  emails:[
    {label:'Gmail',address:'lucasnotfound59@gmail.com'},
    {label:'Outlook',address:'lucasxinlu@outlook.com'}
  ],
  github:'https://github.com/lucasnotfound59'
};
