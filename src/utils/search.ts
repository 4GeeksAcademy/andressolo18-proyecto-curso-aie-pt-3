/**
 * Búsquedas lineal y binaria sobre colecciones.
 */

/** Búsqueda lineal: O(n). Sirve para arrays sin ordenar. */
export function linearSearch<T>(
  items: T[],
  predicate: (item: T) => boolean
): T | undefined {
  for (const item of items) {
    if (predicate(item)) return item;
  }
  return undefined;
}

export function linearSearchIndex<T>(
  items: T[],
  predicate: (item: T) => boolean
): number {
  for (let i = 0; i < items.length; i++) {
    if (predicate(items[i])) return i;
  }
  return -1;
}

/** Búsqueda binaria: O(log n). El array debe estar ordenado ascendentemente por keyFn. */
export function binarySearch<T>(
  sortedItems: T[],
  target: number | string,
  keyFn: (item: T) => number | string
): T | undefined {
  let low = 0;
  let high = sortedItems.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const key = keyFn(sortedItems[mid]);

    if (key === target) return sortedItems[mid];
    if (key < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return undefined;
}
