import { describe, it, expect } from 'vitest';
import { threeSum } from './problem.js';
import { createRng, randomInt, randomIntArray, shuffle, measure, canonical } from '../../../lib/test-utils.js';

/** Brute force: every triple of positions, deduplicated by sorted values. */
function bruteForce(nums) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          seen.set(triplet.join(','), triplet);
        }
      }
    }
  }
  return [...seen.values()];
}

/**
 * Runs threeSum on a copy, checks the shape and the "no duplicates" rule,
 * and returns the triplets in canonical order (each sorted, then the list sorted).
 */
function run(input) {
  const result = threeSum([...input]);
  expect(Array.isArray(result), 'should return an array of triplets').toBe(true);
  for (const t of result) {
    expect(Array.isArray(t) && t.length === 3, `each triplet must be an array of 3 numbers, got ${JSON.stringify(t)}`).toBe(true);
    expect(t[0] + t[1] + t[2], `triplet [${t}] must sum to 0`).toBe(0);
  }
  const keys = canonical(result, { sortInner: true }).map((t) => t.join(','));
  expect(new Set(keys).size, `duplicate triplets found: ${keys.join(' | ')}`).toBe(keys.length);
  return canonical(result, { sortInner: true });
}

const sorted = (triplets) => canonical(triplets, { sortInner: true });

describe('3Sum', () => {
  describe('examples from the problem', () => {
    it('[-1, 0, 1, 2, -1, -4] → [[-1, -1, 2], [-1, 0, 1]] (the two -1s must not produce [-1, 0, 1] twice)', () => {
      expect(run([-1, 0, 1, 2, -1, -4])).toEqual(sorted([[-1, -1, 2], [-1, 0, 1]]));
    });

    it('[0, 1, 1] → [] (no triplet sums to 0)', () => {
      expect(run([0, 1, 1])).toEqual([]);
    });

    it('[0, 0, 0, 0] → [[0, 0, 0]] (reported once, even with four zeros)', () => {
      expect(run([0, 0, 0, 0])).toEqual([[0, 0, 0]]);
    });
  });

  describe('edge cases', () => {
    it('empty array → []', () => {
      expect(run([])).toEqual([]);
    });

    it('fewer than 3 elements → [] even if they sum to 0: [0, 0] and [-1, 1]', () => {
      expect(run([0, 0])).toEqual([]);
      expect(run([-1, 1])).toEqual([]);
    });

    it('exactly 3 elements that work: [3, -1, -2] → [[-2, -1, 3]]', () => {
      expect(run([3, -1, -2])).toEqual([[-2, -1, 3]]);
    });

    it('exactly 3 elements that don\'t: [1, 2, -4] → []', () => {
      expect(run([1, 2, -4])).toEqual([]);
    });

    it('all positive → [] (three positives can\'t sum to 0)', () => {
      expect(run([1, 2, 3, 4, 5])).toEqual([]);
    });

    it('all negative → []', () => {
      expect(run([-5, -4, -3, -2, -1])).toEqual([]);
    });

    it('two zeros are not enough for [0, 0, 0]: [0, 0, 1, -1] → [[-1, 0, 1]]', () => {
      expect(run([0, 0, 1, -1])).toEqual([[-1, 0, 1]]);
    });

    it('constraint extremes: [100000, -100000, 0, -50000, -50000] → two triplets', () => {
      expect(run([100000, -100000, 0, -50000, -50000])).toEqual(
        sorted([[-100000, 0, 100000], [-50000, -50000, 100000]]),
      );
    });
  });

  describe('tricky cases (duplicates)', () => {
    it('a value can be used only as often as it occurs: [-2, 1, 1] → [[-2, 1, 1]], but [-2, 1, 3] → [] (only one 1)', () => {
      expect(run([-2, 1, 1])).toEqual([[-2, 1, 1]]);
      expect(run([-2, 1, 3])).toEqual([]);
    });

    it('many copies of every value produce each triplet once: [-2..2] × 4 → 5 triplets', () => {
      const nums = [];
      for (let copy = 0; copy < 4; copy++) nums.push(-2, -1, 0, 1, 2);
      expect(run(nums)).toEqual(sorted([[-2, 0, 2], [-2, 1, 1], [-1, -1, 2], [-1, 0, 1], [0, 0, 0]]));
    });

    it('300 values drawn from {-2, …, 2} still give exactly those 5 triplets', () => {
      const rng = createRng(3);
      const nums = shuffle(rng, Array.from({ length: 300 }, (_, i) => (i % 5) - 2));
      expect(run(nums)).toEqual(sorted([[-2, 0, 2], [-2, 1, 1], [-1, -1, 2], [-1, 0, 1], [0, 0, 0]]));
    });

    it('[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6] → 6 triplets (skip duplicates on all three positions)', () => {
      expect(run([-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6])).toEqual(
        sorted([[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]]),
      );
    });

    it('[-1, -1, -1, 2, 2] → [[-1, -1, 2]] once', () => {
      expect(run([-1, -1, -1, 2, 2])).toEqual([[-1, -1, 2]]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches an O(n³) brute force on 200 random arrays with many duplicates', () => {
      const rng = createRng(777);
      for (let t = 0; t < 200; t++) {
        const n = randomInt(rng, 0, 30);
        const nums = randomIntArray(rng, n, -10, 10);
        expect(run(nums), `nums = [${nums}]`).toEqual(sorted(bruteForce(nums)));
      }
    });

    it('matches the brute force on 100 random arrays with a wide value range', () => {
      const rng = createRng(778);
      for (let t = 0; t < 100; t++) {
        const n = randomInt(rng, 0, 40);
        const nums = randomIntArray(rng, n, -60, 60);
        expect(run(nums), `nums = [${nums}]`).toEqual(sorted(bruteForce(nums)));
      }
    });
  });

  describe('performance', () => {
    it('2,500 numbers in O(n²) (checking every triple is O(n³) — billions of triples)', () => {
      const rng = createRng(2500);
      // Bulk values are all ≡ 1 (mod 8), so any three of them sum to ≡ 3 (mod 8) — never 0.
      // Planted values are multiples of 8, so a bulk value can't team up with them either.
      // Therefore the only zero-sum triplets are the ones among the planted values.
      const planted = [-24, -16, -8, 0, 0, 0, 8, 16, 24, 40, -40, 8];
      const bulk = Array.from({ length: 2500 - planted.length }, () => 1 + 8 * randomInt(rng, -12_499, 12_499));
      const nums = shuffle(rng, [...bulk, ...planted]);
      const expected = sorted(bruteForce(planted));
      const { result, ms } = measure(() => run(nums));
      expect(result).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — think sort + two pointers`).toBeLessThan(1000);
    });
  });
});
