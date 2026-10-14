import { describe, it, expect } from 'vitest';
import { subsets } from './problem.js';
import { createRng, randomInt, shuffle, measure, canonical } from '../../../lib/test-utils.js';

/**
 * Validates `result` as the full power set of `nums` without needing an
 * oracle: 2^n pairwise-different subsets of an n-element set must be all of them.
 */
function expectPowerSet(nums, result) {
  expect(Array.isArray(result), 'should return an array of arrays').toBe(true);
  expect(result, `expected 2^${nums.length} subsets`).toHaveLength(2 ** nums.length);
  const allowed = new Set(nums);
  const seen = new Set();
  const problemWith = (sub) => {
    if (!Array.isArray(sub)) return `every subset must be an array, got ${JSON.stringify(sub)}`;
    if (new Set(sub).size !== sub.length) return `subset [${sub}] repeats an element`;
    const stranger = sub.find((x) => !allowed.has(x));
    if (stranger !== undefined) return `subset [${sub}] contains ${stranger}, which is not in nums`;
    const key = [...sub].sort((a, b) => a - b).join(',');
    if (seen.has(key)) return `subset [${sub}] appears twice (order inside a subset doesn't matter)`;
    seen.add(key);
    return null;
  };
  // Plain checks in the loop (one expect per subset would be slow for 65,536 subsets).
  let error = null;
  for (const sub of result) if ((error = problemWith(sub))) break;
  expect(error, error ?? '').toBeNull();
}

describe('Subsets', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 3] → all 8 subsets, in any order', () => {
      const expected = [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]];
      expect(canonical(subsets([1, 2, 3]), { sortInner: true })).toEqual(canonical(expected, { sortInner: true }));
    });

    it('[0] → [[], [0]] (0 is a real element, not "nothing")', () => {
      expect(canonical(subsets([0]), { sortInner: true })).toEqual([[], [0]]);
    });

    it('[] → [[]] (the empty set has exactly one subset: itself)', () => {
      expect(subsets([])).toEqual([[]]);
    });
  });

  describe('edge cases', () => {
    it('a single negative number: [-7] → [[], [-7]]', () => {
      expect(canonical(subsets([-7]), { sortInner: true })).toEqual([[], [-7]]);
    });

    it('two elements: [5, -5] → [[], [5], [-5], [-5, 5]]', () => {
      const expected = [[], [5], [-5], [-5, 5]];
      expect(canonical(subsets([5, -5]), { sortInner: true })).toEqual(canonical(expected, { sortInner: true }));
    });

    it('the result contains both the empty subset and the full set', () => {
      const nums = [4, 8, 15, 16];
      const result = subsets(nums);
      expect(result.some((s) => s.length === 0)).toBe(true);
      expect(result.some((s) => s.length === nums.length)).toBe(true);
    });

    it('does not modify the input array', () => {
      const nums = [3, 1, 2];
      subsets(nums);
      expect(nums).toEqual([3, 1, 2]);
    });
  });

  describe('tricky cases', () => {
    it('subsets are independent arrays (pushing the same "path" array by reference is a classic bug)', () => {
      const result = subsets([1, 2, 3]);
      // If the same array object was stored repeatedly, it would be empty (or full) everywhere.
      expect(new Set(result.map((s) => s.length))).toEqual(new Set([0, 1, 2, 3]));
      const firstNonEmpty = result.find((s) => s.length > 0);
      firstNonEmpty.push(999);
      expect(result.filter((s) => s.includes(999))).toHaveLength(1);
    });

    it('never lists the same subset twice in a different order ([1, 2] and [2, 1] are one subset)', () => {
      expectPowerSet([1, 2, 3, 4], subsets([1, 2, 3, 4]));
    });

    it('size k subsets come in C(n, k) of each: [1..5] → 1, 5, 10, 10, 5, 1', () => {
      const result = subsets([1, 2, 3, 4, 5]);
      const bySize = [0, 0, 0, 0, 0, 0];
      for (const s of result) bySize[s.length]++;
      expect(bySize).toEqual([1, 5, 10, 10, 5, 1]);
    });

    it('works with unsorted input containing negatives and zero: [3, -1, 0, -10, 10]', () => {
      expectPowerSet([3, -1, 0, -10, 10], subsets([3, -1, 0, -10, 10]));
    });
  });

  describe('randomized (seeded)', () => {
    it('returns the full power set for 60 random sets of 0–10 distinct values', () => {
      const rng = createRng(21);
      const pool = Array.from({ length: 21 }, (_, i) => i - 10); // -10..10
      for (let t = 0; t < 60; t++) {
        const n = randomInt(rng, 0, 10);
        const nums = shuffle(rng, [...pool]).slice(0, n);
        expectPowerSet(nums, subsets(nums));
      }
    });
  });

  describe('performance', () => {
    it('16 elements → all 65,536 subsets quickly (O(n · 2^n); generating duplicates and filtering is wasteful)', () => {
      const nums = [-10, 7, -3, 0, 5, -8, 2, 9, -1, 4, -6, 10, -2, 6, 1, -9];
      const { result, ms } = measure(() => subsets(nums));
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n · 2^n)`).toBeLessThan(1000);
      expectPowerSet(nums, result);
    });
  });
});
