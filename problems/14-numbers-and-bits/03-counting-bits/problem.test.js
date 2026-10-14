import { describe, it, expect } from 'vitest';
import { countBits } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Oracle: count the '1' characters of the binary string. */
function popcount(i) {
  let c = 0;
  for (const ch of i.toString(2)) if (ch === '1') c++;
  return c;
}

describe('Counting Bits', () => {
  describe('examples from the problem', () => {
    it('n = 2 → [0, 1, 1]', () => {
      expect(countBits(2)).toEqual([0, 1, 1]);
    });

    it('n = 5 → [0, 1, 1, 2, 1, 2]', () => {
      expect(countBits(5)).toEqual([0, 1, 1, 2, 1, 2]);
    });

    it('n = 0 → [0] (the array always has n + 1 entries, including 0)', () => {
      expect(countBits(0)).toEqual([0]);
    });
  });

  describe('edge cases', () => {
    it('n = 1 → [0, 1]', () => {
      expect(countBits(1)).toEqual([0, 1]);
    });

    it('returns a real array of length n + 1', () => {
      const ans = countBits(10);
      expect(Array.isArray(ans), 'return a plain array (Array.from(typedArray) if you used one)').toBe(true);
      expect(ans).toHaveLength(11);
    });

    it('n = 16 → powers of two have exactly one bit; the entry before each has all bits set', () => {
      expect(countBits(16)).toEqual([0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1]);
    });
  });

  describe('tricky cases', () => {
    it('every power of two 2^k (k ≤ 19) has popcount 1, and 2^k − 1 has popcount k', () => {
      const ans = countBits(2 ** 19);
      for (let k = 0; k <= 19; k++) {
        expect(ans[2 ** k], `ans[2^${k}]`).toBe(1);
        expect(ans[2 ** k - 1], `ans[2^${k} - 1]`).toBe(k);
      }
    });

    it('even numbers have the same count as their half (i and i >> 1 differ only by a trailing 0)', () => {
      const ans = countBits(1000);
      for (let i = 2; i <= 1000; i += 2) expect(ans[i], `i = ${i}`).toBe(ans[i / 2]);
    });

    it('odd numbers have one more bit than the even number before them', () => {
      const ans = countBits(1000);
      for (let i = 1; i <= 1000; i += 2) expect(ans[i], `i = ${i}`).toBe(ans[i - 1] + 1);
    });

    it('n = 10^6: the last entries are right (999999 = 0b11110100001000111111 has 12 bits)', () => {
      const ans = countBits(1_000_000);
      expect(ans).toHaveLength(1_000_001);
      expect(ans[999_999]).toBe(12);
      expect(ans[1_000_000]).toBe(7); // 0b11110100001001000000
      expect(ans[2 ** 19 + 2 ** 18 + 1]).toBe(3);
    });

    it('separate calls return independent arrays (no shared cache that can be mutated)', () => {
      const a = countBits(4);
      a[1] = 99;
      expect(countBits(4)).toEqual([0, 1, 1, 2, 1]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a string-based popcount for every i ≤ n on 50 random n up to 5000', () => {
      const rng = createRng(31337);
      for (let t = 0; t < 50; t++) {
        const n = randomInt(rng, 0, 5000);
        const expected = Array.from({ length: n + 1 }, (_, i) => popcount(i));
        expect(countBits(n), `n = ${n}`).toEqual(expected);
      }
    });

    it('spot-checks 2,000 random indices of countBits(10^6)', () => {
      const rng = createRng(99);
      const ans = countBits(1_000_000);
      for (let t = 0; t < 2000; t++) {
        const i = randomInt(rng, 0, 1_000_000);
        expect(ans[i], `i = ${i}`).toBe(popcount(i));
      }
    });
  });

  describe('performance', () => {
    it('n = 10^6 finishes well under a second (O(n) or a tight O(n log n) loop)', () => {
      const { result, ms } = measure(() => countBits(1_000_000));
      expect(result).toHaveLength(1_000_001);
      expect(result[786_431]).toBe(popcount(786_431));
      expect(ms, `took ${ms.toFixed(0)}ms — derive each count from a smaller one`).toBeLessThan(1000);
    });
  });
});
