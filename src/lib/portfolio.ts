export type EntryKind='project'|'experience';
export type TemplateKind='research'|'engineering'|'experience';
export type PublicationStatus='draft'|'published';
export type EntryLink={label:string;url:string};
export type EntryIdentity=Pick<EntryMeta,'kind'|'slug'>;

export type EntryMeta={
  slug:string;
  kind:EntryKind;
  template:TemplateKind;
  startDate?:string;
  endDate?:string;
  ongoing?:boolean;
  category:string;
  status:PublicationStatus;
  cover:string;
  order:number;
  links:EntryLink[];
};

export type TimelineGroup<T extends EntryMeta=EntryMeta>={
  year:number|null;
  entries:T[];
};

export function formatPeriod(entry:Pick<EntryMeta,'startDate'|'endDate'|'ongoing'>,language:'en'|'zh'):string {
  if(!entry.startDate)return language==='en'?'Date to confirm':'日期待确认';
  const format=(value:string)=>{
    if(value.length!==7)return value;
    const [year,month]=value.split('-');
    const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return language==='en'?`${months[Number(month)-1]} ${year}`:`${year}年${Number(month)}月`;
  };
  const start=format(entry.startDate);
  if(entry.ongoing)return `${start} – ${language==='en'?'Present':'至今'}`;
  return entry.endDate&&entry.endDate!==entry.startDate?`${start} – ${format(entry.endDate)}`:start;
}

export function compareEntries(a:EntryMeta,b:EntryMeta):number {
  return (a.startDate??'9999').localeCompare(b.startDate??'9999')
    || a.order-b.order
    || a.slug.localeCompare(b.slug);
}

export function groupEntriesByYear<T extends EntryMeta>(entries:T[]):TimelineGroup<T>[] {
  const groups=new Map<number|null,T[]>();
  for(const entry of [...entries].sort(compareEntries)){
    const year=entry.startDate?Number(entry.startDate.slice(0,4)):null;
    groups.set(year,[...(groups.get(year)??[]),entry]);
  }
  return [...groups].map(([year,groupedEntries])=>({year,entries:groupedEntries}));
}

export function routeFor(entry:EntryMeta):string {
  const prefix=entry.kind==='project'?'projects':'experiences';
  return `/${prefix}/${entry.slug}`;
}

export function neighborsFor<T extends EntryMeta>(
  entries:T[],
  identity:EntryIdentity
):{
  previous:T|undefined;
  next:T|undefined;
} {
  const ordered=[...entries].sort(compareEntries);
  const index=ordered.findIndex(entry=>
    entry.kind===identity.kind&&entry.slug===identity.slug
  );
  if(index<0){
    return {previous:undefined,next:undefined};
  }
  return {
    previous:ordered[index-1],
    next:ordered[index+1]
  };
}
