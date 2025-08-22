import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseCsvLine, unquote } from './helpers/csvParser';
import { normalizeAddress, prettyAddress } from './helpers/normalize';
import type { Person } from './models/Person';

function usage() {
  console.error('Usage: node dist/processor.js <input1.txt> [<input2.txt> ...] [--out=path]');
  process.exit(2);
}

export function parseArgs(argv: string[]) {
  const inputs: string[] = [];
  let outPath: string | null = null;
  for (const a of argv.slice(2)) {
    if (a.startsWith('--out=')) outPath = a.substring('--out='.length);
    else inputs.push(a);
  }
  if (inputs.length === 0) usage();
  return { inputs, outPath };
}

export function readPeople(files: string[]): Person[] {
  const people: Person[] = [];
  for (const f of files) {
    const text = readFileSync(resolve(f), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const row = parseCsvLine(line);
      if (row.length < 6) continue;
      const first = unquote(row[0]);
      const last  = unquote(row[1]);
      const street = unquote(row[2]);
      const city   = unquote(row[3]);
      const state  = unquote(row[4]);
      const age    = parseInt(unquote(row[5]), 10);
      people.push({ firstName: first, lastName: last, streetRaw: street, cityRaw: city, stateRaw: state, age });
    }
  }
  return people;
}

export function buildReport(people: Person[]): string {
  // Group by normalized address
  const households = new Map<string, { key: ReturnType<typeof normalizeAddress>, persons: Person[] }>();

  for (const p of people) {
    const key = normalizeAddress(p.streetRaw, p.cityRaw, p.stateRaw);
    const kstr = `${key.state}|${key.city}|${key.street}`;
    if (!households.has(kstr)) households.set(kstr, { key, persons: [] });
    households.get(kstr)!.persons.push(p);
  }

  // Sort households by state, city, street
  const sortedHouseholds = Array.from(households.values()).sort((a, b) => {
    return a.key.state.localeCompare(b.key.state)
      || a.key.city.localeCompare(b.key.city)
      || a.key.street.localeCompare(b.key.street);
  });

  let report = 'Households (normalized address) and occupant counts:\n';
  for (const h of sortedHouseholds) {
    report += `- ${prettyAddress(h.key)} -> ${h.persons.length}\n`;
  }

  report += '\nAdults (> 18) sorted by Last Name, then First Name:\n';

  const adults = people
    .filter(p => p.age > 18)
    .sort((a, b) =>
      a.lastName.localeCompare(b.lastName, undefined, { sensitivity: 'base' }) ||
      a.firstName.localeCompare(b.firstName, undefined, { sensitivity: 'base' })
    );

  for (const p of adults) {
    const key = normalizeAddress(p.streetRaw, p.cityRaw, p.stateRaw);
    report += `${p.lastName}, ${p.firstName} | ${prettyAddress(key)} | Age ${p.age}\n`;
  }

  return report;
}
