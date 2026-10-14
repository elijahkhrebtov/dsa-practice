import { describe, it, expect } from 'vitest';
import { getSum } from './problem.js';
import { createRng, randomInt } from '../../../lib/test-utils.js';

const MAX = 2 ** 31 - 1;
const MIN = -(2 ** 31);

describe('Sum of Two Integers', () => {
  describe('examples from the problem', () => {
    it('1 + 2 → 3', () => {
      expect(getSum(1, 2)).toBe(3);
    });

    it('2 + 3 → 5 (needs one round of carries)', () => {
      expect(getSum(2, 3)).toBe(5);
    });

    it('-2 + 3 → 1 (two\'s complement makes negatives work the same way)', () => {
      expect(getSum(-2, 3)).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('0 + 0 → 0', () => {
      expect(getSum(0, 0)).toBe(0);
    });

    it('x + 0 → x and 0 + x → x (no carries at all)', () => {
      expect(getSum(12345, 0)).toBe(12345);
      expect(getSum(0, -777)).toBe(-777);
    });

    it('-1 + 1 → 0 (the carry ripples through all 32 bits and falls off the top)', () => {
      expect(getSum(-1, 1)).toBe(0);
    });

    it('-1 + -1 → -2 (two negatives)', () => {
      expect(getSum(-1, -1)).toBe(-2);
    });

    it('-3 + 1 → -2, a signed result (not 4294967294: don\'t convert with >>> 0)', () => {
      expect(getSum(-3, 1)).toBe(-2);
    });

    it('2^31 − 1 + (−2^31) → −1 (the two 32-bit extremes)', () => {
      expect(getSum(MAX, MIN)).toBe(-1);
    });

    it('2^30 + (2^30 − 1) → 2^31 − 1 (largest possible sum)', () => {
      expect(getSum(2 ** 30, 2 ** 30 - 1)).toBe(MAX);
    });

    it('−2^30 + (−2^30) → −2^31 (smallest possible sum: the carry lands exactly in the sign bit)', () => {
      expect(getSum(-(2 ** 30), -(2 ** 30))).toBe(MIN);
    });

    it('2^31 − 1 + 0 and −2^31 + 0 come back unchanged', () => {
      expect(getSum(MAX, 0)).toBe(MAX);
      expect(getSum(MIN, 0)).toBe(MIN);
    });
  });

  describe('tricky cases', () => {
    it('(2^30 − 1) + 1 → 2^30 (a carry that ripples across 30 bits, one position per round)', () => {
      expect(getSum(2 ** 30 - 1, 1)).toBe(2 ** 30);
    });

    it('x + (−x) → 0 for several x (the carries cancel every bit)', () => {
      for (const x of [1, 7, 1000, 123456789, MAX]) {
        expect(getSum(x, -x), `x = ${x}`).toBe(0);
      }
    });

    it('order of the arguments does not matter: getSum(a, b) === getSum(b, a)', () => {
      const pairs = [[5, -9], [MIN, 17], [-1000, 1000], [MAX, -2]];
      for (const [a, b] of pairs) {
        expect(getSum(a, b), `${a} + ${b}`).toBe(a + b);
        expect(getSum(b, a), `${b} + ${a}`).toBe(a + b);
      }
    });

    it('two large negatives: −1,500,000,000 + −600,000,000 → −2,100,000,000', () => {
      expect(getSum(-1_500_000_000, -600_000_000)).toBe(-2_100_000_000);
    });

    it('two large positives: 1,000,000,000 + 1,147,483,647 → 2^31 − 1', () => {
      expect(getSum(1_000_000_000, 1_147_483_647)).toBe(MAX);
    });

    it('the result is a plain number, never -0', () => {
      const r = getSum(-5, 5);
      expect(typeof r).toBe('number');
      expect(Object.is(r, -0), 'got -0').toBe(false);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches ordinary addition on 2,000 small pairs in [−1000, 1000]', () => {
      const rng = createRng(11);
      for (let t = 0; t < 2000; t++) {
        const a = randomInt(rng, -1000, 1000);
        const b = randomInt(rng, -1000, 1000);
        expect(getSum(a, b), `${a} + ${b}`).toBe(a + b);
      }
    });

    it('matches ordinary addition on 2,000 full-range 32-bit pairs whose sum fits in 32 bits', () => {
      const rng = createRng(12);
      let checked = 0;
      while (checked < 2000) {
        const a = randomInt(rng, MIN, MAX);
        const b = randomInt(rng, MIN, MAX);
        if (a + b < MIN || a + b > MAX) continue; // outside the constraints
        expect(getSum(a, b), `${a} + ${b}`).toBe(a + b);
        checked++;
      }
    });
  });
});
