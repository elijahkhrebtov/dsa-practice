import { describe, it, expect } from 'vitest';
import { maxArea } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute force: try every pair of lines. */
function bruteForce(height) {
  let best = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      best = Math.max(best, Math.min(height[i], height[j]) * (j - i));
    }
  }
  return best;
}

describe('Container With Most Water', () => {
  describe('examples from the problem', () => {
    it('[1, 8, 6, 2, 5, 4, 8, 3, 7] → 49 (lines at x=1 and x=8: 7 × 7)', () => {
      expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toBe(49);
    });

    it('[1, 1] → 1', () => {
      expect(maxArea([1, 1])).toBe(1);
    });

    it('[4, 3, 2, 1, 4] → 16 (the two outer lines; inner lines don\'t block)', () => {
      expect(maxArea([4, 3, 2, 1, 4])).toBe(16);
    });
  });

  describe('edge cases', () => {
    it('two lines of different heights: [3, 9] → 3 (the shorter line sets the level)', () => {
      expect(maxArea([3, 9])).toBe(3);
    });

    it('a zero-height line holds nothing: [0, 5] → 0', () => {
      expect(maxArea([0, 5])).toBe(0);
    });

    it('all zeros: [0, 0, 0, 0] → 0', () => {
      expect(maxArea([0, 0, 0, 0])).toBe(0);
    });

    it('all equal heights: [5, 5, 5, 5, 5] → 20 (the widest pair wins)', () => {
      expect(maxArea([5, 5, 5, 5, 5])).toBe(20);
    });

    it('constraint extremes: [10000, 0, 10000] → 20000', () => {
      expect(maxArea([10000, 0, 10000])).toBe(20000);
    });
  });

  describe('tricky cases', () => {
    it('the widest pair is not the best: [1, 100, 100, 1] → 100', () => {
      expect(maxArea([1, 100, 100, 1])).toBe(100);
    });

    it('the two tallest lines are not the best: [5, 1, 10, 10, 1, 5] → 25 (the 5s are much farther apart)', () => {
      expect(maxArea([5, 1, 10, 10, 1, 5])).toBe(25);
    });

    it('strictly increasing: [1, 2, 3, 4, 5] → 6 (2 × 3 or 3 × 2)', () => {
      expect(maxArea([1, 2, 3, 4, 5])).toBe(6);
    });

    it('strictly decreasing: [5, 4, 3, 2, 1] → 6', () => {
      expect(maxArea([5, 4, 3, 2, 1])).toBe(6);
    });

    it('the best pair is strictly inside: [2, 3, 10, 5, 7, 8, 9] → 36 (10 at x=2 with 9 at x=6)', () => {
      // Lines at x=2 (10) and x=6 (9): min 9 × 4 = 36.
      expect(maxArea([2, 3, 10, 5, 7, 8, 9])).toBe(36);
    });

    it('a tall, narrow pair beats every wide, short one: [1, 3, 2, 5, 25, 24, 5] → 24', () => {
      // Lines at x=4 (25) and x=5 (24): 24 × 1 = 24.
      expect(maxArea([1, 3, 2, 5, 25, 24, 5])).toBe(24);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches an O(n²) brute force on 300 random arrays', () => {
      const rng = createRng(606);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 2, 60);
        const height = randomIntArray(rng, n, 0, randomInt(rng, 1, 50));
        expect(maxArea([...height]), `height = [${height}]`).toBe(bruteForce(height));
      }
    });

    it('does not modify the input array', () => {
      const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
      maxArea(height);
      expect(height).toEqual([1, 8, 6, 2, 5, 4, 8, 3, 7]);
    });
  });

  describe('performance', () => {
    it('100,000 lines in one pass (checking every pair is O(n²) and far too slow)', () => {
      const n = 100_000;
      const rng = createRng(8);
      const height = randomIntArray(rng, n, 0, 100);
      // Two very tall lines far apart dominate every other pair:
      // 10,000 × (n − 21) ≈ 10^9, while any pair using a short line holds at most 100 × n = 10^7.
      height[10] = 10_000;
      height[n - 11] = 10_000;
      const { result, ms } = measure(() => maxArea(height));
      expect(result).toBe(10_000 * (n - 21));
      expect(ms, `took ${ms.toFixed(0)}ms — think two pointers`).toBeLessThan(500);
    });

    it('100,000 equal lines → 10,000 × 99,999 (the widest pair; still must be O(n))', () => {
      const n = 100_000;
      const height = new Array(n).fill(10_000);
      const { result, ms } = measure(() => maxArea(height));
      expect(result).toBe(10_000 * (n - 1));
      expect(ms, `took ${ms.toFixed(0)}ms — think two pointers`).toBeLessThan(500);
    });
  });
});
