import { buildReport } from '../../src/processor';
import type { Person } from '../../src/models/Person';

describe('buildReport', () => {
  test('groups households, lists adults > 18 sorted by Last, First', () => {
    const people: Person[] = [
      { firstName: 'Alice', lastName: 'Smith', streetRaw: '123 Main St.', cityRaw: 'Seattle', stateRaw: 'WA', age: 45 },
      { firstName: 'Dave',  lastName: 'Smith', streetRaw: '123 main st ', cityRaw: 'seattle', stateRaw: 'wa', age: 43 },
      { firstName: 'Jane',  lastName: 'Smith', streetRaw: '123 Main St.', cityRaw: 'Seattle', stateRaw: 'WA', age: 13 },
      { firstName: 'Bob',   lastName: 'Williams', streetRaw: '234 2nd Ave.', cityRaw: 'Tacoma', stateRaw: 'WA', age: 26 },
    ];
    const report = buildReport(people);

    expect(report).toContain('- 123 main st, Seattle, WA -> 3');
    expect(report).toContain('- 234 2nd ave, Tacoma, WA -> 1');

    const lines = report.split('\n').filter(l => /\| Age \d+$/.test(l));
    expect(lines).toEqual([
      'Smith, Alice | 123 main st, Seattle, WA | Age 45',
      'Smith, Dave | 123 main st, Seattle, WA | Age 43',
      'Williams, Bob | 234 2nd ave, Tacoma, WA | Age 26',
    ]);
  });

  test('excludes exactly 18-year-olds', () => {
    const people: Person[] = [
      { firstName: 'Ian', lastName: 'Smith', streetRaw: '123 main st', cityRaw: 'Seattle', stateRaw: 'WA', age: 18 },
      { firstName: 'Eve', lastName: 'Smith', streetRaw: '234 2nd Ave.', cityRaw: 'Tacoma', stateRaw: 'WA', age: 25 }
    ];
    const report = buildReport(people);
    expect(report).not.toContain('Ian');
    expect(report).toContain('Eve');
  });
});
