import { describe, it, expect } from 'vitest';
import { combinationSum } from './problem.js';
import { createRng, randomInt, shuffle, measure, canonical } from '../../../lib/test-utils.js';

/**
 * Oracle built bottom-up, unlike backtracking: the combinations for sum s are
 * "a combination for s - x, plus x", stored sorted and de-duplicated by key.
 */
function oracle(candidates, target) {
  const bySum = Array.from({ length: target + 1 }, () => new Map());
  bySum[0].set('', []);
  for (let s = 1; s <= target; s++) {
    for (const x of candidates) {
      if (x > s) continue;
      for (const combo of bySum[s - x].values()) {
        const next = [...combo, x].sort((a, b) => a - b);
        bySum[s].set(next.join(','), next);
      }
    }
  }
  return [...bySum[target].values()];
}

/** Number of combinations, via the classic "coin change ways" count. */
function countWays(candidates, target) {
  const ways = new Array(target + 1).fill(0);
  ways[0] = 1;
  for (const x of candidates) for (let s = x; s <= target; s++) ways[s] += ways[s - x];
  return ways[target];
}

/** Checks the rules for every combination: right sum, only candidates, no duplicates. */
function expectValidCombinations(candidates, target, result) {
  expect(Array.isArray(result), 'should return an array of arrays').toBe(true);
  const allowed = new Set(candidates);
  const seen = new Set();
  let error = null;
  for (const combo of result) {
    const key = [...combo].sort((a, b) => a - b).join(',');
    const sum = combo.reduce((a, b) => a + b, 0);
    if (combo.length === 0) error = 'an empty combination is never valid (target >= 1)';
    else if (sum !== target) error = `[${combo}] sums to ${sum}, not ${target}`;
    else if (combo.some((x) => !allowed.has(x))) error = `[${combo}] uses a value that is not a candidate`;
    else if (seen.has(key)) error = `[${combo}] appears twice (order inside a combination doesn't matter)`;
    if (error) break;
    seen.add(key);
  }
  expect(error, error ?? '').toBeNull();
}

const sorted = (result) => canonical(result, { sortInner: true });

describe('Combination Sum', () => {
  describe('examples from the problem', () => {
    it('[2, 3, 6, 7], target 7 → [[2, 2, 3], [7]] (2 is reused)', () => {
      expect(sorted(combinationSum([2, 3, 6, 7], 7))).toEqual([[2, 2, 3], [7]]);
    });

    it('[2, 3, 5], target 8 → [[2, 2, 2, 2], [2, 3, 3], [3, 5]]', () => {
      expect(sorted(combinationSum([2, 3, 5], 8))).toEqual([
        [2, 2, 2, 2],
        [2, 3, 3],
        [3, 5],
      ]);
    });

    it('[2], target 1 → [] (every candidate is too big)', () => {
      expect(combinationSum([2], 1)).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('a candidate equal to the target: [5], target 5 → [[5]]', () => {
      expect(sorted(combinationSum([5], 5))).toEqual([[5]]);
    });

    it('one candidate used many times: [3], target 9 → [[3, 3, 3]]', () => {
      expect(sorted(combinationSum([3], 9))).toEqual([[3, 3, 3]]);
    });

    it('unreachable target: [2], target 3 → [] (only even sums are possible)', () => {
      expect(combinationSum([2], 3)).toEqual([]);
    });

    it('unreachable target with several candidates: [4, 6], target 9 → []', () => {
      expect(combinationSum([4, 6], 9)).toEqual([]);
    });

    it('a candidate reused 20 times: [2], target 40 → [[2 × 20]]', () => {
      expect(combinationSum([2], 40)).toEqual([new Array(20).fill(2)]);
    });
  });

  describe('tricky cases', () => {
    it('[2, 3], target 5 → only [[2, 3]] ([3, 2] is the same combination)', () => {
      expect(sorted(combinationSum([2, 3], 5))).toEqual([[2, 3]]);
    });

    it('unsorted candidates: [7, 3, 2, 6], target 7 → [[2, 2, 3], [7]]', () => {
      expect(sorted(combinationSum([7, 3, 2, 6], 7))).toEqual([[2, 2, 3], [7]]);
    });

    it('candidates larger than the target are simply never used: [10, 20, 2], target 4 → [[2, 2]]', () => {
      expect(sorted(combinationSum([10, 20, 2], 4))).toEqual([[2, 2]]);
    });

    it('[8, 7, 4, 3], target 11 → [[3, 4, 4], [3, 8], [4, 7]]', () => {
      expect(sorted(combinationSum([8, 7, 4, 3], 11))).toEqual([
        [3, 4, 4],
        [3, 8],
        [4, 7],
      ]);
    });

    it('[4, 6, 9], target 13 → [[4, 9]] (starting greedily with the smallest value leads nowhere)', () => {
      expect(sorted(combinationSum([4, 6, 9], 13))).toEqual([[4, 9]]);
    });

    it('[3, 5, 7], target 16 → [[3, 3, 3, 7], [3, 3, 5, 5]]', () => {
      expect(sorted(combinationSum([3, 5, 7], 16))).toEqual([
        [3, 3, 3, 7],
        [3, 3, 5, 5],
      ]);
    });

    it('[2, 3], target 40 → 7 combinations (from twenty 2s down to two 2s and twelve 3s)', () => {
      const result = combinationSum([2, 3], 40);
      expectValidCombinations([2, 3], 40, result);
      expect(sorted(result)).toEqual(sorted(oracle([2, 3], 40)));
    });
  });

  describe('randomized (seeded) against a bottom-up oracle', () => {
    it('matches on 200 random candidate sets and targets', () => {
      const rng = createRng(23);
      const pool = Array.from({ length: 39 }, (_, i) => i + 2); // 2..40
      for (let t = 0; t < 200; t++) {
        const k = randomInt(rng, 1, 8);
        const candidates = shuffle(rng, [...pool]).slice(0, k);
        const target = randomInt(rng, 1, 40);
        const label = `candidates = [${candidates}], target = ${target}`;
        const result = combinationSum([...candidates], target);
        expectValidCombinations(candidates, target, result);
        expect(sorted(result), label).toEqual(sorted(oracle(candidates, target)));
      }
    });
  });

  describe('performance', () => {
    it('all 39 values 2..40, target 34 → 2,167 combinations quickly (building ordered sequences and de-duplicating explores millions)', () => {
      const rng = createRng(2323);
      const candidates = shuffle(rng, Array.from({ length: 39 }, (_, i) => i + 2));
      const original = [...candidates];
      const { result, ms } = measure(() => combinationSum(candidates, 34));
      expect(ms, `took ${ms.toFixed(0)}ms — generate each combination once, in non-decreasing order`).toBeLessThan(500);
      expect(result).toHaveLength(countWays(original, 34)); // 2,167
      expectValidCombinations(original, 34, result);
    });
  });
});
