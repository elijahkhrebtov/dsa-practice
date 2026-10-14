import { describe, it, expect } from 'vitest';
import { kClosest } from './problem.js';
import { createRng, randomInt, measure, canonical } from '../../../lib/test-utils.js';

const dist2 = ([x, y]) => x * x + y * y;

/** Brute force: sort a copy by squared distance and take the first k. */
const bruteClosest = (points, k) => [...points].sort((a, b) => dist2(a) - dist2(b)).slice(0, k);

/** Order doesn't matter: compare canonical (sorted) forms. */
function expectSamePoints(actual, expected) {
  expect(Array.isArray(actual), 'should return an array of points').toBe(true);
  expect(actual).toHaveLength(expected.length);
  expect(canonical(actual)).toEqual(canonical(expected));
}

/** Random points plus a k whose cutoff is strict (unique answer). */
function randomCase(rng, n, range) {
  const points = Array.from({ length: n }, () => [randomInt(rng, -range, range), randomInt(rng, -range, range)]);
  const d = points.map(dist2).sort((a, b) => a - b);
  const valid = [];
  for (let k = 1; k <= n; k++) if (k === n || d[k - 1] < d[k]) valid.push(k);
  const k = valid[randomInt(rng, 0, valid.length - 1)];
  return { points, k };
}

describe('K Closest Points to Origin', () => {
  describe('examples from the problem', () => {
    it('[[1, 3], [-2, 2]], k=1 → [[-2, 2]] (squared distances 10 vs 8)', () => {
      expectSamePoints(kClosest([[1, 3], [-2, 2]], 1), [[-2, 2]]);
    });

    it('[[3, 3], [5, -1], [-2, 4]], k=2 → [[3, 3], [-2, 4]] in any order', () => {
      expectSamePoints(kClosest([[3, 3], [5, -1], [-2, 4]], 2), [[3, 3], [-2, 4]]);
    });

    it('[[0, 1], [1, 0], [2, 2]], k=2 → [[0, 1], [1, 0]] (a tie inside the answer is fine)', () => {
      expectSamePoints(kClosest([[0, 1], [1, 0], [2, 2]], 2), [[0, 1], [1, 0]]);
    });
  });

  describe('edge cases', () => {
    it('a single point, k=1 → that point', () => {
      expectSamePoints(kClosest([[7, -7]], 1), [[7, -7]]);
    });

    it('k = n returns every point', () => {
      const pts = [[1, 2], [-3, 4], [0, 0], [10, -10]];
      expectSamePoints(kClosest(pts, 4), pts);
    });

    it('the origin itself is the closest possible point: [[5, 5], [0, 0], [1, 1]], k=1 → [[0, 0]]', () => {
      expectSamePoints(kClosest([[5, 5], [0, 0], [1, 1]], 1), [[0, 0]]);
    });

    it('points on the axes and in all four quadrants: negative coordinates count by magnitude', () => {
      const pts = [[-1, 0], [0, -2], [3, 0], [0, 4], [-5, -5], [2, -2]];
      expectSamePoints(kClosest(pts, 3), [[-1, 0], [0, -2], [2, -2]]);
    });

    it('extreme coordinates ±10^4 (squared distance 2·10^8 is still exact)', () => {
      const pts = [[10000, 10000], [-10000, -9999], [9999, -10000], [-10000, 10000]];
      expectSamePoints(kClosest(pts, 2), [[-10000, -9999], [9999, -10000]]);
    });

    it('does not modify the input array', () => {
      const pts = [[3, 3], [1, 1], [2, 2]];
      kClosest(pts, 2);
      expect(pts).toEqual([[3, 3], [1, 1], [2, 2]]);
    });

    it('each returned point is an [x, y] pair with the original coordinates', () => {
      const result = kClosest([[2, -1], [4, 4]], 1);
      expect(result).toEqual([[2, -1]]);
    });
  });

  describe('tricky cases', () => {
    it('duplicate points are separate points: [[1, 1], [1, 1], [5, 5]], k=2 → both [1, 1]', () => {
      expectSamePoints(kClosest([[1, 1], [1, 1], [5, 5]], 2), [[1, 1], [1, 1]]);
    });

    it('compare x² + y², not |x| + |y|: [3, 3] (18) is closer than [0, 5] (25) despite 6 > 5', () => {
      expectSamePoints(kClosest([[0, 5], [3, 3]], 1), [[3, 3]]);
    });

    it('compare x² + y², not max(|x|, |y|): [4, 0] (16) is farther than [3, 2] (13)', () => {
      expectSamePoints(kClosest([[4, 0], [3, 2]], 1), [[3, 2]]);
    });

    it('many points at the same distance inside the answer: the 4 unit points, then farther ones', () => {
      const pts = [[2, 2], [0, 1], [3, 0], [-1, 0], [0, -1], [1, 0]];
      expectSamePoints(kClosest(pts, 4), [[0, 1], [-1, 0], [0, -1], [1, 0]]);
    });

    it('closest points sitting at the END of the input (the heap must evict earlier, farther ones)', () => {
      const pts = [[9, 9], [8, 8], [7, 7], [6, 6], [1, 1], [0, 1]];
      expectSamePoints(kClosest(pts, 2), [[1, 1], [0, 1]]);
    });
  });

  describe('randomized (seeded) against a brute-force sort', () => {
    it('400 random point sets with a unique answer', () => {
      const rng = createRng(4242);
      for (let t = 0; t < 400; t++) {
        const { points, k } = randomCase(rng, randomInt(rng, 1, 40), randomInt(rng, 0, 1) ? 5 : 1000);
        expectSamePoints(kClosest(points, k), bruteClosest(points, k));
      }
    });
  });

  describe('performance', () => {
    it('50,000 points with k ≈ 25,000 (picking the nearest point k times by scanning is O(n·k))', () => {
      const rng = createRng(9);
      const n = 50_000;
      const points = [];
      for (let i = 0; i < n; i++) points.push([randomInt(rng, -10_000, 10_000), randomInt(rng, -10_000, 10_000)]);
      // Pick the k closest to 25,000 whose cutoff is strict, so the answer is unique.
      const d = points.map(dist2).sort((a, b) => a - b);
      let k = 25_000;
      while (d[k - 1] === d[k]) k++;
      const expected = bruteClosest(points, k);
      const { result, ms } = measure(() => kClosest(points, k));
      expectSamePoints(result, expected);
      expect(ms, `took ${ms.toFixed(0)}ms — keep a max-heap of the k best (or quickselect)`).toBeLessThan(500);
    });
  });
});
