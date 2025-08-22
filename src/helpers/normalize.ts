function collapseSpaces(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function normalizeStreet(s: string): string {
  let x = (s ?? '').toLowerCase().trim();
  x = x.replace(/\./g, '');
  x = x.replace(/,/g, ' ');
  x = collapseSpaces(x);
  return x;
}

export function normalizeCity(s: string): string {
  return collapseSpaces((s ?? '').toLowerCase());
}

export function normalizeState(s: string): string {
  return (s ?? '').trim().toUpperCase();
}

export function normalizeAddress(street: string, city: string, state: string) {
  return {
    street: normalizeStreet(street),
    city: normalizeCity(city),
    state: normalizeState(state)
  };
}

export function prettyAddress(key: {street: string; city: string; state: string}): string {
  const city = key.city ? key.city[0].toUpperCase() + key.city.slice(1) : '';
  return `${key.street}, ${city}, ${key.state}`;
}
