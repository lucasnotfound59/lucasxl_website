import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'zod';
import {metaSchema} from './lib/content-schema';

const contentRoot=process.env.PORTFOLIO_CONTENT_ROOT??'./src/content';

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
