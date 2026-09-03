import {z} from 'zod';

export const linkSchema=z.object({
  label:z.string().min(1),
  url:z.url({protocol:/^https$/})
});

export const metaSchema=z.object({
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
