import { parseCsvLine, unquote } from '../../src/helpers/csvParser';

describe('csv parser', () => {
  test('parses quoted line', () => {
    const row = parseCsvLine(`"Alice","Smith","123 Main St.","Seattle","WA","45"`);
    expect(row).toHaveLength(6);
    expect(unquote(row[0])).toBe('Alice');
    expect(unquote(row[2])).toBe('123 Main St.');
  });

  test('handles commas in quotes', () => {
    const row = parseCsvLine(`"George","Brown","345 3rd Blvd., Apt. 200","Seattle","WA","18"`);
    expect(unquote(row[2])).toBe('345 3rd Blvd., Apt. 200');
  });
});
