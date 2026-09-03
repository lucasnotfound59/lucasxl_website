import {getCollection,getEntry,type CollectionEntry} from 'astro:content';
import {
  compareEntries,
  groupEntriesByYear,
  routeFor,
  type EntryMeta
} from './portfolio';

type ProjectCopy=CollectionEntry<'projectCopy'>;
type ExperienceCopy=CollectionEntry<'experienceCopy'>;

export type PortfolioEntry={
  meta:EntryMeta;
  route:string;
  en:ProjectCopy|ExperienceCopy;
  zh?:ProjectCopy|ExperienceCopy;
};

function slugFromMetaId(id:string):string {
  return id.replace(/\/meta$/,'');
}

async function loadProjects():Promise<PortfolioEntry[]> {
  const metas=await getCollection('projectMeta',entry=>entry.data.status==='published');
  return Promise.all(metas.map(async metaEntry=>{
    const slug=slugFromMetaId(metaEntry.id);
    const en=await getEntry('projectCopy',`${slug}/en`);
    const zh=await getEntry('projectCopy',`${slug}/zh`);
    if(!en){
      throw new Error(`Missing English project copy for ${slug}`);
    }
    if(metaEntry.data.slug!==slug){
      throw new Error(`Project slug mismatch: directory ${slug}, metadata ${metaEntry.data.slug}`);
    }
    const meta={...metaEntry.data,slug} as EntryMeta;
    return {meta,route:routeFor(meta),en,zh};
  }));
}

async function loadExperiences():Promise<PortfolioEntry[]> {
  const metas=await getCollection('experienceMeta',entry=>entry.data.status==='published');
  return Promise.all(metas.map(async metaEntry=>{
    const slug=slugFromMetaId(metaEntry.id);
    const en=await getEntry('experienceCopy',`${slug}/en`);
    const zh=await getEntry('experienceCopy',`${slug}/zh`);
    if(!en){
      throw new Error(`Missing English experience copy for ${slug}`);
    }
    if(metaEntry.data.slug!==slug){
      throw new Error(`Experience slug mismatch: directory ${slug}, metadata ${metaEntry.data.slug}`);
    }
    const meta={...metaEntry.data,slug} as EntryMeta;
    return {meta,route:routeFor(meta),en,zh};
  }));
}

export async function getPortfolioEntries():Promise<PortfolioEntry[]> {
  return [...await loadProjects(),...await loadExperiences()]
    .sort((a,b)=>compareEntries(a.meta,b.meta));
}

export async function getTimelineGroups() {
  const entries=await getPortfolioEntries();
  return groupEntriesByYear(entries.map(entry=>({
    ...entry.meta,
    entry
  })));
}
