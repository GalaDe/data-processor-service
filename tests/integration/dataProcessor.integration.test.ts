import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('CLI output matches expected file', () => {
  const exe = process.execPath;
  const entry = resolve('bin/index.js');
  const input = resolve('data/input.txt');
  const out = resolve('data/output.txt');
  const expected = resolve('data/expected_output.txt');

  execFileSync(exe, [entry, input, `--out=${out}`], { stdio: 'inherit' });

  const got = readFileSync(out, 'utf8').replace(/\r\n/g, '\n');
  const exp = readFileSync(expected, 'utf8').replace(/\r\n/g, '\n');

  expect(got).toBe(exp);
});
