import { describe, it, expect } from 'vitest';
import { trap } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/**
 * Oracle that fills the map one horizontal layer at a time: on layer L, every
 * cell lower than L that lies between the first and last bar reaching L holds
 * one unit of water. Fine for small heights.
 */
function layeredOracle(height) {
  const maxH = Math.max(0, ...height);
  let water = 0;
  for (let level = 1; level <= maxH; level++) {
    const first = height.findIndex((h) => h >= level);
    const last = height.findLastIndex((h) => h >= level);
    for (let i = first + 1; i < last; i++) if (height[i] < level) water++;
  }
  return water;
}

describe('Trapping Rain Water', () => {
  describe('examples from the problem', () => {
    it('[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] → 6', () => {
      expect(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])).toBe(6);
    });

    it('[4, 2, 0, 3, 2, 5] → 9 (the level is set by the lower outer wall, 4)', () => {
      expect(trap([4, 2, 0, 3, 2, 5])).toBe(9);
    });

    it('[1, 2, 3, 2, 1] → 0 (a single peak traps nothing)', () => {
      expect(trap([1, 2, 3, 2, 1])).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('a single bar: [5] → 0', () => {
      expect(trap([5])).toBe(0);
    });

    it('two bars: [2, 4] → 0 (no room between them)', () => {
      expect(trap([2, 4])).toBe(0);
    });

    it('all zeros → 0', () => {
      expect(trap([0, 0, 0, 0])).toBe(0);
    });

    it('a flat plateau: [3, 3, 3] → 0', () => {
      expect(trap([3, 3, 3])).toBe(0);
    });

    it('strictly increasing → 0 (water runs off the left end)', () => {
      expect(trap([0, 1, 2, 3, 4])).toBe(0);
    });

    it('strictly decreasing → 0 (water runs off the right end)', () => {
      expect(trap([4, 3, 2, 1, 0])).toBe(0);
    });

    it('a dip at the very edge holds nothing: [0, 3, 0] → 0', () => {
      expect(trap([0, 3, 0])).toBe(0);
    });

    it('maximum heights: [100000, 0, 100000] → 100000', () => {
      expect(trap([100_000, 0, 100_000])).toBe(100_000);
    });
  });

  describe('tricky cases', () => {
    it('a simple basin: [3, 0, 0, 0, 3] → 9', () => {
      expect(trap([3, 0, 0, 0, 3])).toBe(9);
    });

    it('unequal walls: [5, 0, 3] → 3 (the lower wall decides the level)', () => {
      expect(trap([5, 0, 3])).toBe(3);
    });

    it('a bump inside a basin is submerged: [5, 1, 3, 1, 5] → 10', () => {
      expect(trap([5, 1, 3, 1, 5])).toBe(10);
    });

    it('a tall wall in the middle splits two pools: [3, 0, 10, 0, 2] → 5', () => {
      expect(trap([3, 0, 10, 0, 2])).toBe(5);
    });

    it('repeated equal maxima: [2, 0, 2, 0, 2] → 4', () => {
      expect(trap([2, 0, 2, 0, 2])).toBe(4);
    });

    it('the global maximum at one end: [9, 1, 2, 1, 3, 0, 4] → 13 (levels rise step by step toward 4)', () => {
      expect(trap([9, 1, 2, 1, 3, 0, 4])).toBe(13);
    });

    it('a long flat pool: [4, then 1,000 zeros, 4] → 4000', () => {
      expect(trap([4, ...new Array(1000).fill(0), 4])).toBe(4000);
    });

    it('a 40,000-bar pyramid between two taller walls is fully submerged (exactly known, large total)', () => {
      // Walls of height 20,001 at both ends, a pyramid peaking at 19,999 between them.
      // Every bar except the walls is submerged to level 20,001.
      const n = 40_000;
      const height = Array.from({ length: n }, (_, i) => Math.min(i, n - 1 - i));
      height[0] = height[n - 1] = 20_001;
      let expected = 0;
      for (let i = 1; i < n - 1; i++) expected += 20_001 - height[i];
      expect(trap(height)).toBe(expected); // ≈ 4 · 10^8 units — still exact in a JS number
    });

    it('does not modify the input array', () => {
      const height = [4, 2, 0, 3, 2, 5];
      trap(height);
      expect(height).toEqual([4, 2, 0, 3, 2, 5]);
    });
  });

  describe('randomized (seeded) against a layer-by-layer oracle', () => {
    it('matches on 600 random small maps', () => {
      const rng = createRng(25);
      for (let t = 0; t < 600; t++) {
        const n = randomInt(rng, 1, 30);
        const height = randomIntArray(rng, n, 0, 8);
        expect(trap(height), `height = [${height}]`).toBe(layeredOracle(height));
      }
    });
  });

  describe('performance', () => {
    it('20 maps of 40,000 bars stay fast (recomputing left/right maxima for every bar is O(n²))', () => {
      const rng = createRng(2525);
      const inputs = Array.from({ length: 20 }, () => randomIntArray(rng, 40_000, 0, 100_000));
      const budget = 500;
      let total = 0;
      let done = 0;
      for (const height of inputs) {
        const { result, ms } = measure(() => trap(height));
        total += ms;
        expect(result).toBeGreaterThan(0);
        done++;
        if (total > budget) break; // stop early so a slow solution fails fast
      }
      expect(done, `the ${budget}ms budget ran out after ${done} of 20 maps (${total.toFixed(0)}ms) — aim for O(n)`).toBe(20);
      expect(total, `took ${total.toFixed(0)}ms — aim for O(n)`).toBeLessThan(budget);
    });
  });
});
