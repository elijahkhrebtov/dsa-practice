import { describe, it, expect } from 'vitest';
import { largestRectangleArea } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute-force oracle: every range [l, r], tracking the running minimum. O(n²). */
function bruteLargest(h) {
  let best = 0;
  for (let l = 0; l < h.length; l++) {
    let min = Infinity;
    for (let r = l; r < h.length; r++) {
      min = Math.min(min, h[r]);
      best = Math.max(best, min * (r - l + 1));
    }
  }
  return best;
}

/**
 * Exact answer for a UNIMODAL histogram (rises, then falls): for every height
 * level, the bars at least that tall form one contiguous block, so the best
 * rectangle of that height spans the whole block.
 */
function unimodalAnswer(h, maxHeight) {
  const countAtLeast = new Array(maxHeight + 2).fill(0);
  for (const x of h) countAtLeast[x]++;
  for (let v = maxHeight - 1; v >= 0; v--) countAtLeast[v] += countAtLeast[v + 1];
  let best = 0;
  for (let v = 1; v <= maxHeight; v++) best = Math.max(best, v * countAtLeast[v]);
  return best;
}

describe('Largest Rectangle in Histogram', () => {
  describe('examples from the problem', () => {
    it('[2, 1, 5, 6, 2, 3] → 10 (height 5 across the bars 5 and 6)', () => {
      expect(largestRectangleArea([2, 1, 5, 6, 2, 3])).toBe(10);
    });

    it('[2, 4] → 4 (a tie between the tall bar alone and the low bar across both)', () => {
      expect(largestRectangleArea([2, 4])).toBe(4);
    });

    it('[6, 2, 5, 4, 5, 1, 6] → 12 (height 4 across three bars)', () => {
      expect(largestRectangleArea([6, 2, 5, 4, 5, 1, 6])).toBe(12);
    });
  });

  describe('edge cases', () => {
    it('a single bar: [5] → 5', () => {
      expect(largestRectangleArea([5])).toBe(5);
    });

    it('a single zero-height bar: [0] → 0', () => {
      expect(largestRectangleArea([0])).toBe(0);
    });

    it('all zeros → 0', () => {
      expect(largestRectangleArea([0, 0, 0, 0])).toBe(0);
    });

    it('a lone bar between zeros: [0, 3, 0] → 3', () => {
      expect(largestRectangleArea([0, 3, 0])).toBe(3);
    });

    it('two equal bars: [1, 1] → 2', () => {
      expect(largestRectangleArea([1, 1])).toBe(2);
    });

    it('maximum heights: 1,000 bars of 10,000 → 10,000,000', () => {
      expect(largestRectangleArea(new Array(1000).fill(10_000))).toBe(10_000_000);
    });
  });

  describe('tricky cases', () => {
    it('increasing [1, 2, 3, 4, 5] → 9 (bars still on the stack at the end must be processed)', () => {
      expect(largestRectangleArea([1, 2, 3, 4, 5])).toBe(9);
    });

    it('decreasing [5, 4, 3, 2, 1] → 9 (a rectangle may extend to the LEFT of its shortest bar)', () => {
      expect(largestRectangleArea([5, 4, 3, 2, 1])).toBe(9);
    });

    it('all equal [3, 3, 3, 3] → 12 (equal heights must be merged into one wide rectangle)', () => {
      expect(largestRectangleArea([3, 3, 3, 3])).toBe(12);
    });

    it('a deep valley: [5, 1, 5] → 5 (the full-width rectangle is only 1 × 3)', () => {
      expect(largestRectangleArea([5, 1, 5])).toBe(5);
    });

    it('a shallow valley: [2, 1, 2] → 3 (here the full-width rectangle wins)', () => {
      expect(largestRectangleArea([2, 1, 2])).toBe(3);
    });

    it('a wide low rectangle beats a tall narrow bar: twenty 1s and a 10 → 21', () => {
      expect(largestRectangleArea([...new Array(20).fill(1), 10])).toBe(21);
    });

    it('a zero splits the histogram: [2, 3, 0, 4, 4] → 8', () => {
      expect(largestRectangleArea([2, 3, 0, 4, 4])).toBe(8);
    });

    it('plateaus around a dip: [2, 2, 1, 2, 2] → 5', () => {
      expect(largestRectangleArea([2, 2, 1, 2, 2])).toBe(5);
    });

    it('[3, 6, 5, 7, 4, 8, 1, 0] → 20 (height 4 across five bars)', () => {
      expect(largestRectangleArea([3, 6, 5, 7, 4, 8, 1, 0])).toBe(20);
    });

    it('[4, 2, 0, 3, 2, 5] → 6', () => {
      expect(largestRectangleArea([4, 2, 0, 3, 2, 5])).toBe(6);
    });

    it('equal heights separated by a taller bar: [2, 4, 2] → 6 (the left 2 extends past the 4)', () => {
      expect(largestRectangleArea([2, 4, 2])).toBe(6);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force "every range" search on 800 random histograms', () => {
      const rng = createRng(8080);
      for (let t = 0; t < 800; t++) {
        const n = randomInt(rng, 1, 60);
        const hi = randomInt(rng, 0, rng() < 0.5 ? 5 : 10_000); // small ranges → lots of ties and zeros
        const heights = randomIntArray(rng, n, 0, hi);
        expect(largestRectangleArea(heights), JSON.stringify(heights)).toBe(bruteLargest(heights));
      }
    });
  });

  describe('performance', () => {
    const n = 70_000;

    it('70,000 non-decreasing bars (checking every range, or expanding right from every bar, is O(n²))', () => {
      const heights = Array.from({ length: n }, (_, i) => Math.floor((i * 10_000) / n));
      // For a non-decreasing histogram the best rectangle of height heights[i] runs from i to the end.
      let expected = 0;
      for (let i = 0; i < n; i++) expected = Math.max(expected, heights[i] * (n - i));
      const { result, ms } = measure(() => largestRectangleArea(heights));
      expect(result).toBe(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n): each bar is pushed and popped once`).toBeLessThan(500);
    });

    it('70,000 bars of the same height (expanding both ways from every bar is O(n²))', () => {
      const heights = new Array(n).fill(10_000);
      const { result, ms } = measure(() => largestRectangleArea(heights));
      expect(result).toBe(n * 10_000);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });

    it('70,000 bars shaped like a capped pyramid', () => {
      const cap = 10_000;
      const heights = Array.from({ length: n }, (_, i) => Math.min(i, n - 1 - i, cap));
      const { result, ms } = measure(() => largestRectangleArea(heights));
      expect(result).toBe(unimodalAnswer(heights, cap));
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });
  });
});
