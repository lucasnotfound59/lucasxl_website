import {existsSync,readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {z} from 'zod';

const requiredHeadings={
  research:[
    ['Research Question'],
    ['Why It Matters'],
    ['My Role','My Role and Research Process'],
    ['Methodology','Study Design'],
    ['Results and Evidence','Findings and Evidence'],
    ['Limitations','Limitations and Reflection'],
    ['Reflection and Next Steps','What I Can Do Next']
  ],
  engineering:[
    ['Problem and Constraints'],
    ['My Responsibilities'],
    ['System Overview'],
    ['Implementation Process'],
    ['Testing and Iterations'],
    ['Results'],
    ['Failures and Lessons']
  ],
  experience:[
    ['Context'],
    ['Participation'],
    ['My Contribution'],
    ['Selected Work'],
    ['Learning and Reflection']
  ]
} as const;

const metaSchema=z.object({
  slug:z.string(),
  template:z.enum(['research','engineering','experience']),
  status:z.enum(['draft','published']),
  cover:z.string()
});

const requestedRoots=process.argv.slice(2);
const roots=requestedRoots.length>0
  ?requestedRoots
  :['src/content/projects','src/content/experiences'];
const errors:string[]=[];

for(const root of roots){
  if(!existsSync(root)){
    continue;
  }
  for(const directory of readdirSync(root,{withFileTypes:true}).filter(entry=>entry.isDirectory())){
    const base=join(root,directory.name);
    const metaPath=join(base,'meta.json');
    const enPath=join(base,'en.md');
    if(!existsSync(metaPath)||!existsSync(enPath)){
      errors.push(`${base}: meta.json and en.md are required`);
      continue;
    }
    const meta=metaSchema.parse(JSON.parse(readFileSync(metaPath,'utf8')));
    if(meta.status==='draft'){
      continue;
    }
    const markdown=readFileSync(enPath,'utf8');
    for(const aliases of requiredHeadings[meta.template]){
      if(!aliases.some(heading=>markdown.includes(`## ${heading}`))){
        errors.push(`${enPath}: missing heading ${aliases.map(heading=>`"## ${heading}"`).join(' or ')}`);
      }
    }
    const coverPath=join('public',meta.cover.replace(/^\//,''));
    if(!existsSync(coverPath)){
      errors.push(`${metaPath}: cover does not exist at ${coverPath}`);
    }
  }
}

if(errors.length>0){
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Content validation passed');
