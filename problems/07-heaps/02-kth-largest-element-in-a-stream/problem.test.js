import { describe, it, expect } from 'vitest';
import { KthLargest } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Feeds `vals` into the stream and collects every add() result. */
function feed(stream, vals) {
  return vals.map((v) => stream.add(v));
}

/** Brute force: keep everything, sort descending, read index k-1. */
function bruteKth(all, k) {
  return [...all].sort((a, b) => b - a)[k - 1];
}

describe('Kth Largest Element in a Stream', () => {
  describe('examples from the problem', () => {
    it('k=3, [4, 5, 8, 2]; add 3, 5, 10, 9, 4 → 4, 5, 5, 8, 8', () => {
      expect(feed(new KthLargest(3, [4, 5, 8, 2]), [3, 5, 10, 9, 4])).toEqual([4, 5, 5, 8, 8]);
    });

    it('k=1, []; add -3, -5, 7 → -3, -3, 7 (k = 1 is the running maximum)', () => {
      expect(feed(new KthLargest(1, []), [-3, -5, 7])).toEqual([-3, -3, 7]);
    });

    it('k=2, [0]; add -1, 1, -2 → -1, 0, 0 (the stream starts with fewer than k numbers)', () => {
      expect(feed(new KthLargest(2, [0]), [-1, 1, -2])).toEqual([-1, 0, 0]);
    });
  });

  describe('edge cases', () => {
    it('k=1 with an empty start: the first add returns the value itself', () => {
      expect(new KthLargest(1, []).add(42)).toBe(42);
    });

    it('k equals the final stream size: the answer is the overall minimum', () => {
      expect(feed(new KthLargest(4, [10, 20, 30]), [5])).toEqual([5]);
    });

    it('starting with exactly k-1 numbers: the first add makes the stream exactly k long', () => {
      expect(feed(new KthLargest(3, [7, 1]), [4, 0, 9])).toEqual([1, 1, 4]);
    });

    it('starting with many more than k numbers: extra small values must not matter', () => {
      expect(feed(new KthLargest(2, [1, 2, 3, 4, 5, 6, 7, 8, 9]), [0, 10, 8])).toEqual([8, 9, 9]);
    });

    it('handles the value bounds -10^4 and 10^4', () => {
      expect(feed(new KthLargest(2, [-10000]), [10000, -10000, 10000])).toEqual([-10000, -10000, 10000]);
    });

    it('does not modify the nums array passed to the constructor', () => {
      const nums = [5, 1, 4, 2, 3];
      const s = new KthLargest(2, nums);
      s.add(6);
      expect(nums).toEqual([5, 1, 4, 2, 3]);
    });

    it('instances are independent of each other', () => {
      const a = new KthLargest(1, [1]);
      const b = new KthLargest(1, [100]);
      expect(a.add(2)).toBe(2);
      expect(b.add(50)).toBe(100);
    });
  });

  describe('tricky cases', () => {
    it('duplicates count separately: k=2, [5, 5] → add 1 gives 5 (not the 2nd distinct value)', () => {
      expect(new KthLargest(2, [5, 5]).add(1)).toBe(5);
    });

    it('all values equal: the answer never changes', () => {
      expect(feed(new KthLargest(3, [7, 7, 7, 7]), [7, 7, 7])).toEqual([7, 7, 7]);
    });

    it('values smaller than the current k-th largest change nothing', () => {
      expect(feed(new KthLargest(2, [100, 90]), [1, 2, 3, 89])).toEqual([90, 90, 90, 90]);
    });

    it('increasing stream: the k-th largest climbs with every add', () => {
      expect(feed(new KthLargest(3, [1, 2, 3]), [4, 5, 6, 7])).toEqual([2, 3, 4, 5]);
    });

    it('decreasing stream: once k numbers are in, the answer is frozen', () => {
      expect(feed(new KthLargest(3, [9, 8]), [7, 6, 5, 4])).toEqual([7, 7, 7, 7]);
    });

    it('negatives and zero mixed: k=2, [-1, -2]; add 0, -3, 0 → -1, -1, 0', () => {
      expect(feed(new KthLargest(2, [-1, -2]), [0, -3, 0])).toEqual([-1, -1, 0]);
    });
  });

  describe('randomized (seeded) against a brute-force sort', () => {
    it('300 random streams (various k, start sizes and lots of duplicates)', () => {
      const rng = createRng(17);
      for (let t = 0; t < 300; t++) {
        const k = randomInt(rng, 1, 8);
        const start = randomIntArray(rng, randomInt(rng, Math.max(0, k - 1), 12), -10, 10);
        const adds = randomIntArray(rng, randomInt(rng, 1, 15), -10, 10);
        const s = new KthLargest(k, start);
        const all = [...start];
        for (const v of adds) {
          all.push(v);
          expect(s.add(v), `k=${k}, start=${JSON.stringify(start)}, after adding ${v}`).toBe(bruteKth(all, k));
        }
      }
    });
  });

  describe('performance', () => {
    it('k=5,000, 10,000 starting numbers and 10,000 adds (re-sorting the stream on every add is far too slow)', () => {
      const rng = createRng(123);
      const nums = randomIntArray(rng, 10_000, -10_000, 10_000);
      const adds = randomIntArray(rng, 10_000, -10_000, 10_000);
      const { result, ms } = measure(() => {
        const s = new KthLargest(5000, nums);
        let last = 0;
        let sum = 0;
        for (const v of adds) {
          last = s.add(v);
          sum += last;
        }
        return [last, sum];
      });
      // Reference: one descending array kept sorted by binary-search insertion.
      const sorted = [...nums].sort((a, b) => b - a);
      let last = 0;
      let sum = 0;
      for (const v of adds) {
        let lo = 0;
        let hi = sorted.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (sorted[mid] > v) lo = mid + 1;
          else hi = mid;
        }
        sorted.splice(lo, 0, v);
        last = sorted[4999];
        sum += last;
      }
      expect(result).toEqual([last, sum]);
      expect(ms, `took ${ms.toFixed(0)}ms — keep only the k largest in a min-heap`).toBeLessThan(500);
    });

    it('k=1 with 100,000 starting numbers and 100,000 adds stays fast (each add must be O(log k))', () => {
      const rng = createRng(321);
      const nums = randomIntArray(rng, 100_000, -10_000, 10_000);
      const adds = randomIntArray(rng, 100_000, -10_000, 10_000);
      let expectedMax = -Infinity;
      for (const v of nums) if (v > expectedMax) expectedMax = v;
      const { result, ms } = measure(() => {
        const s = new KthLargest(1, nums);
        let last = 0;
        for (const v of adds) last = s.add(v);
        return last;
      });
      for (const v of adds) if (v > expectedMax) expectedMax = v;
      expect(result).toBe(expectedMax);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(500);
    });
  });
});
