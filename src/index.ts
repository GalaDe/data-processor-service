import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { parseArgs, readPeople, buildReport } from './processor';

function main() {
  const { inputs, outPath } = parseArgs(process.argv);
  const people = readPeople(inputs);
  const out = buildReport(people);
  if (outPath) writeFileSync(resolve(outPath), out, 'utf8');
  else process.stdout.write(out);
}

if (require.main === module) {
  main();
}