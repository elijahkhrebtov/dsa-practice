import { describe, it, expect } from 'vitest';
import { permute } from './problem.js';
import { createRng, randomInt, shuffle, measure, canonical } from '../../../lib/test-utils.js';

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

/**
 * Validates `result` as the complete list of permutations of `nums`:
 * n! pairwise-different orderings of all n elements must be all of them.
 */
function expectAllPermutations(nums, result) {
  expect(Array.isArray(result), 'should return an array of arrays').toBe(true);
  expect(result, `expected ${nums.length}! = ${factorial(nums.length)} permutations`).toHaveLength(factorial(nums.length));
  const sortedNums = [...nums].sort((a, b) => a - b).join(',');
  const seen = new Set();
  const problemWith = (perm) => {
    if (!Array.isArray(perm)) return `every permutation must be an array, got ${JSON.stringify(perm)}`;
    if ([...perm].sort((a, b) => a - b).join(',') !== sortedNums) {
      return `[${perm}] is not an ordering of [${nums}] (every element exactly once)`;
    }
    const key = perm.join(',');
    if (seen.has(key)) return `[${perm}] appears twice`;
    seen.add(key);
    return null;
  };
  // Plain checks in the loop (one expect per permutation would be slow for 40,320 of them).
  let error = null;
  for (const perm of result) if ((error = problemWith(perm))) break;
  expect(error, error ?? '').toBeNull();
}

describe('Permutations', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 3] → all 6 orderings, in any order', () => {
      const expected = [
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1],
      ];
      expect(canonical(permute([1, 2, 3]))).toEqual(expected);
    });

    it('[0, 1] → [[0, 1], [1, 0]]', () => {
      expect(canonical(permute([0, 1]))).toEqual([
        [0, 1],
        [1, 0],
      ]);
    });

    it('[1] → [[1]]', () => {
      expect(permute([1])).toEqual([[1]]);
    });
  });

  describe('edge cases', () => {
    it('[] → [[]] (one way to order nothing: 0! = 1)', () => {
      expect(permute([])).toEqual([[]]);
    });

    it('negative numbers: [-1, -10] → [[-10, -1], [-1, -10]]', () => {
      expect(canonical(permute([-1, -10]))).toEqual([
        [-10, -1],
        [-1, -10],
      ]);
    });

    it('nums is unchanged afterwards (in-place swapping must be undone)', () => {
      const nums = [3, 1, 2, 0];
      permute(nums);
      expect(nums).toEqual([3, 1, 2, 0]);
    });

    it('the input order itself is one of the permutations', () => {
      const nums = [5, -2, 9];
      expect(permute(nums).map((p) => p.join(','))).toContain('5,-2,9');
    });
  });

  describe('tricky cases', () => {
    it('permutations are independent arrays (pushing the same "path" by reference is a classic bug)', () => {
      const result = permute([1, 2, 3]);
      expect(result.every((p) => p.length === 3)).toBe(true);
      result[0][0] = 999;
      expect(result.filter((p) => p.includes(999))).toHaveLength(1);
    });

    it('0 is an element like any other: [0, 1, 2] → 6 permutations', () => {
      expectAllPermutations([0, 1, 2], permute([0, 1, 2]));
    });

    it('each element appears in each position exactly (n-1)! times: [1, 2, 3, 4]', () => {
      const result = permute([1, 2, 3, 4]);
      expectAllPermutations([1, 2, 3, 4], result);
      for (let pos = 0; pos < 4; pos++) {
        for (const x of [1, 2, 3, 4]) {
          expect(result.filter((p) => p[pos] === x), `${x} at position ${pos}`).toHaveLength(6);
        }
      }
    });

    it('6 elements (the constraint maximum) → 720 distinct permutations', () => {
      const nums = [10, -10, 0, 3, -7, 6];
      expectAllPermutations(nums, permute(nums));
    });
  });

  describe('randomized (seeded)', () => {
    it('returns every permutation for 60 random sets of 0–6 distinct values', () => {
      const rng = createRng(22);
      const pool = Array.from({ length: 21 }, (_, i) => i - 10); // -10..10
      for (let t = 0; t < 60; t++) {
        const n = randomInt(rng, 0, 6);
        const nums = shuffle(rng, [...pool]).slice(0, n);
        const copy = [...nums];
        expectAllPermutations(nums, permute(nums));
        expect(nums).toEqual(copy);
      }
    });
  });

  describe('performance', () => {
    it('8 elements → all 40,320 permutations quickly (build them directly — trying all 8^8 sequences and filtering is wasteful)', () => {
      const nums = [4, -3, 8, 0, -9, 1, 7, -5];
      const { result, ms } = measure(() => permute(nums));
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n · n!)`).toBeLessThan(1000);
      expectAllPermutations(nums, result);
    });
  });
});
