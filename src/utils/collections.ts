/**
 * Funciones utilitarias genéricas para trabajar con arrays/colecciones.
 */

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export function sortBy<T>(
  items: T[],
  keyFn: (item: T) => number | string,
  order: "asc" | "desc" = "asc"
): T[] {
  const sorted = [...items].sort((a, b) => {
    const ka = keyFn(a);
    const kb = keyFn(b);
    if (ka < kb) return -1;
    if (ka > kb) return 1;
    return 0;
  });
  return order === "desc" ? sorted.reverse() : sorted;
}

export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) throw new Error("size debe ser mayor que 0");
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export function partition<T>(
  items: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of items) {
    (predicate(item) ? pass : fail).push(item);
  }
  return [pass, fail];
}

export function flatten<T>(items: T[][]): T[] {
  return items.reduce((acc, curr) => acc.concat(curr), [] as T[]);
}
