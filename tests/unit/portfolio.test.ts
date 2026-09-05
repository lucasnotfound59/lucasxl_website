import {describe,expect,it} from 'vitest';
import {compareEntries,groupEntriesByYear,neighborsFor,routeFor,type EntryMeta} from '../../src/lib/portfolio';

const project:EntryMeta={
  slug:'early-project',
  kind:'project',
  template:'research',
  startDate:'2024-06-01',
  category:'Research',
  status:'published',
  cover:'/images/default-cover.svg',
  order:1,
  links:[]
};

const experience:EntryMeta={
  slug:'later-program',
  kind:'experience',
  template:'experience',
  startDate:'2025-07-01',
  category:'Summer Program',
  status:'published',
  cover:'/images/default-cover.svg',
  order:1,
  links:[]
};

describe('portfolio metadata',()=>{
  it('keeps undated entries after chronology in a separate group',()=>{
    const undated={...project,slug:'undated',startDate:undefined};
    expect([undated,experience,project].sort(compareEntries).map(entry=>entry.slug))
      .toEqual(['early-project','later-program','undated']);
    expect(groupEntriesByYear([undated,project]).map(group=>group.year))
      .toEqual([2024,null]);
  });
  it('orders entries from earliest to newest',()=>{
    expect([experience,project].sort(compareEntries).map(entry=>entry.slug))
      .toEqual(['early-project','later-program']);
  });

  it('groups ordered entries by start year',()=>{
    expect(groupEntriesByYear([experience,project]).map(group=>group.year))
      .toEqual([2024,2025]);
  });

  it('creates child routes by entry kind',()=>{
    expect(routeFor(project)).toBe('/projects/early-project');
    expect(routeFor(experience)).toBe('/experiences/later-program');
  });

  it('returns chronological previous and next entries',()=>{
    const entries=[
      project,
      {...project,slug:'middle-project',startDate:'2025-01-01'},
      experience
    ].sort(compareEntries);
    expect(neighborsFor(entries,{kind:'project',slug:'middle-project'})).toEqual({
      previous:project,
      next:experience
    });
  });

  it('returns empty edge neighbors',()=>{
    expect(neighborsFor([project],project)).toEqual({
      previous:undefined,
      next:undefined
    });
  });

  it('distinguishes identical slugs across project and experience routes',()=>{
    const sharedExperience={
      ...experience,
      slug:project.slug
    };
    expect(neighborsFor(
      [project,sharedExperience],
      {kind:'experience',slug:project.slug}
    )).toEqual({
      previous:project,
      next:undefined
    });
  });
});
