import { describe, it, expect } from 'vitest';
import { findMaximumXOR } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

const MAX = 2 ** 31 - 1;

/** O(n²) oracle. `>>> 0` keeps the XOR unsigned (all inputs are < 2^31 anyway). */
function brute(nums) {
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) best = Math.max(best, (nums[i] ^ nums[j]) >>> 0);
  }
  return best;
}

describe('Maximum XOR of Two Numbers in an Array', () => {
  describe('examples from the problem', () => {
    it('[3, 10, 5, 25, 2, 8] → 28 (5 XOR 25)', () => {
      expect(findMaximumXOR([3, 10, 5, 25, 2, 8])).toBe(28);
    });

    it('[14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70] → 127', () => {
      expect(findMaximumXOR([14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70])).toBe(127);
    });

    it('[8] → 0 (a single element can only pair with itself)', () => {
      expect(findMaximumXOR([8])).toBe(0);
    });

    it('[0, 2147483647] → 2147483647 (all 31 bits differ)', () => {
      expect(findMaximumXOR([0, MAX])).toBe(MAX);
    });
  });

  describe('edge cases', () => {
    it('[0] → 0', () => {
      expect(findMaximumXOR([0])).toBe(0);
    });

    it('all equal values → 0: [7, 7, 7]', () => {
      expect(findMaximumXOR([7, 7, 7])).toBe(0);
    });

    it('all zeros → 0', () => {
      expect(findMaximumXOR([0, 0, 0, 0])).toBe(0);
    });

    it('two numbers → just their XOR: [6, 9] → 15', () => {
      expect(findMaximumXOR([6, 9])).toBe(15);
    });

    it('[2^30, 2^30 - 1] → 2^31 - 1 (bit 30 matters — do not stop at bit 29)', () => {
      expect(findMaximumXOR([2 ** 30, 2 ** 30 - 1])).toBe(MAX);
    });

    it('[2^31 - 1, 2^30] → 2^30 - 1 (the result must not come out negative)', () => {
      const r = findMaximumXOR([MAX, 2 ** 30]);
      expect(r).toBe(2 ** 30 - 1);
    });

    it('[2^31 - 1, 2^31 - 1, 0] → 2^31 - 1 (duplicates of the extreme value)', () => {
      expect(findMaximumXOR([MAX, MAX, 0])).toBe(MAX);
    });
  });

  describe('tricky cases', () => {
    it('[8, 7] → 15 (the high bit decides: 1000 XOR 0111)', () => {
      expect(findMaximumXOR([8, 7])).toBe(15);
    });

    it('[1, 2, 4, 8, 16] → 24 (powers of two: the two largest)', () => {
      expect(findMaximumXOR([1, 2, 4, 8, 16])).toBe(24);
    });

    it('[12, 15, 3] → 15 (the largest number is NOT part of the best pair: 12 XOR 3)', () => {
      expect(findMaximumXOR([12, 15, 3])).toBe(15);
    });

    it('[16, 17, 18, 19] → 3 (a shared high bit cancels out; only the low bits can differ)', () => {
      expect(findMaximumXOR([16, 17, 18, 19])).toBe(3);
    });

    it('greedy must look ahead bit by bit, not just at the top bit: [26, 21, 10, 5] → 31', () => {
      // 26 = 11010, 21 = 10101, 10 = 01010, 5 = 00101 → 26 ^ 5 = 31, 21 ^ 10 = 31, 26 ^ 21 = 15
      expect(findMaximumXOR([26, 21, 10, 5])).toBe(31);
    });

    it('order does not matter: the same values shuffled give the same answer', () => {
      const nums = [3, 10, 5, 25, 2, 8];
      expect(findMaximumXOR([...nums].reverse())).toBe(28);
      expect(findMaximumXOR([25, 8, 2, 10, 3, 5])).toBe(28);
    });

    it('does not modify the input array', () => {
      const nums = [3, 10, 5, 25, 2, 8];
      const copy = [...nums];
      findMaximumXOR(nums);
      expect(nums).toEqual(copy);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches an O(n²) brute force on 300 small arrays with small values', () => {
      const rng = createRng(17);
      for (let t = 0; t < 300; t++) {
        const nums = Array.from({ length: randomInt(rng, 1, 30) }, () => randomInt(rng, 0, 255));
        expect(findMaximumXOR(nums), JSON.stringify(nums)).toBe(brute(nums));
      }
    });

    it('matches an O(n²) brute force on 200 arrays with full 31-bit values', () => {
      const rng = createRng(18);
      for (let t = 0; t < 200; t++) {
        const nums = Array.from({ length: randomInt(rng, 1, 60) }, () => randomInt(rng, 0, MAX));
        expect(findMaximumXOR(nums), JSON.stringify(nums)).toBe(brute(nums));
      }
    });

    it('matches the brute force when all numbers share their top 20 bits', () => {
      const rng = createRng(19);
      for (let t = 0; t < 100; t++) {
        const high = randomInt(rng, 0, 2 ** 20 - 1) * 2 ** 11;
        const nums = Array.from({ length: randomInt(rng, 2, 50) }, () => high + randomInt(rng, 0, 2 ** 11 - 1));
        expect(findMaximumXOR(nums), JSON.stringify(nums)).toBe(brute(nums));
      }
    });
  });

  describe('performance', () => {
    it('120,000 numbers (an O(n²) pair search does ~7 billion XORs and is far too slow)', () => {
      const rng = createRng(9);
      const n = 120_000;
      // Every number = 2^30 + (16-bit value << 4): bit 30 is shared and bits 0–3 are always 0,
      // so no pair can beat 0xFFFF0. A planted pair (x, ~x) reaches exactly that.
      const nums = Array.from({ length: n - 2 }, () => 2 ** 30 + (randomInt(rng, 0, 0xffff) << 4));
      const x = 0x5a3c;
      nums.push(2 ** 30 + (x << 4), 2 ** 30 + ((~x & 0xffff) << 4));
      shuffle(rng, nums);
      const { result, ms } = measure(() => findMaximumXOR(nums));
      expect(result).toBe(0xffff0);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(31 · n)`).toBeLessThan(1500);
    });
  });
});
