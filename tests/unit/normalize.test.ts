import { describe, test, expect } from '@jest/globals';
import {
  normalizeStreet,
  normalizeCity,
  normalizeState,
  prettyAddress,
  normalizeAddress,
} from '../../src/helpers/normalize';

describe('normalize helpers', () => {
  test('street punctuation/case/spacing', () => {
    expect(normalizeStreet(' 123 Main St. ')).toBe('123 main st');
    expect(normalizeStreet('345  3rd Blvd.,  Apt. 200')).toBe('345 3rd blvd apt 200');
  });

  test('city lower + space collapse', () => {
    expect(normalizeCity('  Seattle  ')).toBe('seattle');
  });

  test('state uppercase', () => {
    expect(normalizeState('wa')).toBe('WA');
    expect(normalizeState(' Wa ')).toBe('WA');
  });

  test('prettyAddress formats key', () => {
    const address = normalizeAddress('123 Main St.', 'Seattle', 'wa');
    expect(prettyAddress(address)).toBe('123 main st, Seattle, WA');
  });
});
