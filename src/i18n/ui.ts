import type {Language} from '../scripts/language';

type UiLabels={
  home:string;
  timeline:string;
  about:string;
  resume:string;
  contact:string;
  viewProject:string;
  viewExperience:string;
  backToTimeline:string;
  previous:string;
  next:string;
  externalLinks:string;
};

export const ui:Record<Language,UiLabels>={
  en:{
    home:'Home',
    timeline:'Timeline',
    about:'About',
    resume:'Resume',
    contact:'Contact',
    viewProject:'View Project',
    viewExperience:'View Experience',
    backToTimeline:'Back to Timeline',
    previous:'Previous',
    next:'Next',
    externalLinks:'External Links'
  },
  zh:{
    home:'首页',
    timeline:'时间线',
    about:'关于',
    resume:'简历',
    contact:'联系',
    viewProject:'查看项目',
    viewExperience:'查看经历',
    backToTimeline:'返回时间线',
    previous:'上一篇',
    next:'下一篇',
    externalLinks:'外部链接'
  }
};
