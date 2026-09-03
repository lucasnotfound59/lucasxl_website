export type EntryKind='project'|'experience';
export type TemplateKind='research'|'engineering'|'experience';
export type PublicationStatus='draft'|'published';
export type EntryLink={label:string;url:string};

export type EntryMeta={
  slug:string;
  kind:EntryKind;
  template:TemplateKind;
  startDate:string;
  endDate?:string;
  category:string;
  status:PublicationStatus;
  cover:string;
  order:number;
  links:EntryLink[];
};

export type TimelineGroup<T extends EntryMeta=EntryMeta>={
  year:number;
  entries:T[];
};

export function compareEntries(a:EntryMeta,b:EntryMeta):number {
  return a.startDate.localeCompare(b.startDate)
    || a.order-b.order
    || a.slug.localeCompare(b.slug);
}

export function groupEntriesByYear<T extends EntryMeta>(entries:T[]):TimelineGroup<T>[] {
  const groups=new Map<number,T[]>();
  for(const entry of [...entries].sort(compareEntries)){
    const year=Number(entry.startDate.slice(0,4));
    groups.set(year,[...(groups.get(year)??[]),entry]);
  }
  return [...groups].map(([year,groupedEntries])=>({year,entries:groupedEntries}));
}

export function routeFor(entry:EntryMeta):string {
  const prefix=entry.kind==='project'?'projects':'experiences';
  return `/${prefix}/${entry.slug}`;
}
