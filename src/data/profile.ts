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
    identity:'Student researcher and builder',
    introduction:'Exploring artificial intelligence, robotics, and computational research.',
    about:[]
  },
  zh:{
    name:'Lucas Xin',
    identity:'学生研究者与创作者',
    introduction:'探索人工智能、机器人与计算研究。',
    about:[]
  }
};

export const contact:ContactConfig={};
