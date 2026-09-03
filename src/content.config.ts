import {defineCollection,z} from 'astro:content';
import {glob} from 'astro/loaders';

const contentRoot=process.env.PORTFOLIO_CONTENT_ROOT??'./src/content';

const linkSchema=z.object({
  label:z.string().min(1),
  url:z.string().url()
});

const metaSchema=z.object({
  slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind:z.enum(['project','experience']),
  template:z.enum(['research','engineering','experience']),
  startDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category:z.string().min(1),
  status:z.enum(['draft','published']),
  cover:z.string().startsWith('/images/'),
  order:z.number().int().nonnegative(),
  links:z.array(linkSchema).default([])
}).superRefine((value,context)=>{
  if(value.kind==='experience'&&value.template!=='experience'){
    context.addIssue({code:'custom',message:'Experience entries require the experience template'});
  }
  if(value.kind==='project'&&value.template==='experience'){
    context.addIssue({code:'custom',message:'Project entries require the research or engineering template'});
  }
  if(value.endDate&&value.endDate<value.startDate){
    context.addIssue({code:'custom',message:'endDate cannot precede startDate'});
  }
});

const localizedSchema=z.object({
  title:z.string().min(1),
  summary:z.string().min(1).max(320),
  coverAlt:z.string().min(1)
});

export const collections={
  projectMeta:defineCollection({
    loader:glob({pattern:'**/meta.json',base:`${contentRoot}/projects`}),
    schema:metaSchema
  }),
  projectCopy:defineCollection({
    loader:glob({pattern:'**/*.md',base:`${contentRoot}/projects`}),
    schema:localizedSchema
  }),
  experienceMeta:defineCollection({
    loader:glob({pattern:'**/meta.json',base:`${contentRoot}/experiences`}),
    schema:metaSchema
  }),
  experienceCopy:defineCollection({
    loader:glob({pattern:'**/*.md',base:`${contentRoot}/experiences`}),
    schema:localizedSchema
  })
};
