/**
 * Utilities for writing tests. Not meant for use inside solutions.
 */

/**
 * Seeded pseudo-random number generator (mulberry32) so "random" tests are
 * reproducible run after run.
 *
 * @param {number} seed - Any 32-bit integer.
 * @returns {() => number} Function returning floats in [0, 1).
 */
export function createRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Random integer in [min, max] (inclusive) drawn from `rng`.
 *
 * @param {() => number} rng - Generator from `createRng`.
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (inclusive).
 * @returns {number} The integer.
 */
export function randomInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

/**
 * Array of `length` random integers in [min, max].
 *
 * @param {() => number} rng - Generator from `createRng`.
 * @param {number} length - Number of elements.
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (inclusive).
 * @returns {number[]} The array.
 */
export function randomIntArray(rng, length, min, max) {
  return Array.from({ length }, () => randomInt(rng, min, max));
}

/**
 * Shuffles an array in place (Fisher–Yates) using `rng`.
 *
 * @template T
 * @param {() => number} rng - Generator from `createRng`.
 * @param {T[]} arr - Array to shuffle.
 * @returns {T[]} The same array, shuffled.
 */
export function shuffle(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Runs `fn` and returns its result together with the elapsed milliseconds.
 *
 * @template R
 * @param {() => R} fn - Code to time.
 * @returns {{ result: R, ms: number }} Result and duration.
 */
export function measure(fn) {
  const start = performance.now();
  const result = fn();
  return { result, ms: performance.now() - start };
}

/**
 * Sorts a list of number/string arrays into a canonical order so results
 * that may come back "in any order" can be compared with `toEqual`.
 * Inner arrays are left as-is unless `sortInner` is true.
 *
 * @template T
 * @param {T[][]} lists - List of arrays.
 * @param {{ sortInner?: boolean }} [options] - Also sort each inner array.
 * @returns {T[][]} A new, canonically ordered list.
 */
export function canonical(lists, { sortInner = false } = {}) {
  const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  const copy = lists.map((l) => (sortInner ? [...l].sort(cmp) : [...l]));
  return copy.sort((a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      const c = cmp(a[i], b[i]);
      if (c !== 0) return c;
    }
    return a.length - b.length;
  });
}

/**
 * Replaces `-0` with `0` (toEqual treats them as different values).
 *
 * @param {number[]} arr - Numbers to normalize.
 * @returns {number[]} New array without negative zeros.
 */
export function normalizeZeros(arr) {
  return arr.map((x) => (Object.is(x, -0) ? 0 : x));
}

/**
 * Temporarily replaces `Array.prototype.sort` (and toSorted) with a function
 * that throws, runs `fn`, then restores the originals. Use it to check that a
 * solution doesn't lean on the built-in sort.
 *
 * @template R
 * @param {() => R} fn - Code that must not call the built-in sort.
 * @returns {R} Whatever `fn` returned.
 */
export function withoutBuiltinSort(fn) {
  const { sort, toSorted } = Array.prototype;
  const typedProto = Object.getPrototypeOf(Int32Array.prototype);
  const typedSort = typedProto.sort;
  const forbid = () => {
    throw new Error('Built-in sort is not allowed in this problem — implement the sorting yourself.');
  };
  Array.prototype.sort = forbid;
  Array.prototype.toSorted = forbid;
  typedProto.sort = forbid;
  try {
    return fn();
  } finally {
    Array.prototype.sort = sort;
    Array.prototype.toSorted = toSorted;
    typedProto.sort = typedSort;
  }
}
