import { describe, it, expect } from 'vitest';
import { removeKdigits } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Strips leading zeros; an empty result becomes "0". */
const normalize = (s) => s.replace(/^0+/, '') || '0';

/** Compares two normalized digit strings as numbers. */
const smaller = (a, b) => a.length < b.length || (a.length === b.length && a < b);

/**
 * Brute-force oracle: try every way of keeping (n - k) digits (all bitmasks),
 * and return the smallest result. Only feasible for short inputs.
 */
function bruteRemove(num, k) {
  const n = num.length;
  const keep = n - k;
  let best = null;
  for (let mask = 0; mask < 1 << n; mask++) {
    let bits = 0;
    for (let m = mask; m; m &= m - 1) bits++;
    if (bits !== keep) continue;
    let s = '';
    for (let i = 0; i < n; i++) if (mask & (1 << i)) s += num[i];
    const candidate = normalize(s);
    if (best === null || smaller(candidate, best)) best = candidate;
  }
  return best;
}

describe('Remove K Digits', () => {
  describe('examples from the problem', () => {
    it('"1432219", k 3 → "1219"', () => {
      expect(removeKdigits('1432219', 3)).toBe('1219');
    });

    it('"10200", k 1 → "200" (leading zeros are stripped)', () => {
      expect(removeKdigits('10200', 1)).toBe('200');
    });

    it('"10", k 2 → "0" (removing everything leaves "0", not "")', () => {
      expect(removeKdigits('10', 2)).toBe('0');
    });

    it('"12345", k 2 → "123" (increasing digits: drop from the end)', () => {
      expect(removeKdigits('12345', 2)).toBe('123');
    });
  });

  describe('edge cases', () => {
    it('k 0 → the number is unchanged: "4321", k 0 → "4321"', () => {
      expect(removeKdigits('4321', 0)).toBe('4321');
    });

    it('a single digit with k 1 → "0"', () => {
      expect(removeKdigits('9', 1)).toBe('0');
    });

    it('"0" with k 0 → "0"', () => {
      expect(removeKdigits('0', 0)).toBe('0');
    });

    it('k equal to the length always gives "0": "987654", k 6 → "0"', () => {
      expect(removeKdigits('987654', 6)).toBe('0');
    });

    it('decreasing digits: drop from the front: "4321", k 2 → "21"', () => {
      expect(removeKdigits('4321', 2)).toBe('21');
    });

    it('all digits equal: "1111", k 2 → "11" (equal digits are not worth popping)', () => {
      expect(removeKdigits('1111', 2)).toBe('11');
    });
  });

  describe('tricky cases', () => {
    it('only zeros remain: "100", k 1 → "0" (not "00")', () => {
      expect(removeKdigits('100', 1)).toBe('0');
    });

    it('a long zero run after the first digit: "10001", k 1 → "1"', () => {
      expect(removeKdigits('10001', 1)).toBe('1');
    });

    it('zeros pull the number down: "10200", k 2 → "0" ("1" and "2" go, "000" → "0")', () => {
      expect(removeKdigits('10200', 2)).toBe('0');
    });

    it('a descent at the end: "123450", k 1 → "12340" (the 5 goes, not the 0)', () => {
      expect(removeKdigits('123450', 1)).toBe('12340');
    });

    it('greedy left to right: "5337", k 2 → "33"', () => {
      expect(removeKdigits('5337', 2)).toBe('33');
    });

    it('leftover k after the scan comes off the end: "112", k 1 → "11"', () => {
      expect(removeKdigits('112', 1)).toBe('11');
    });

    it('one digit can trigger several removals: "1234560", k 3 → "1230"', () => {
      expect(removeKdigits('1234560', 3)).toBe('1230');
    });

    it('remaining removals are used after popping stops: "9119", k 2 → "11"', () => {
      expect(removeKdigits('9119', 2)).toBe('11');
    });

    it('does not reorder digits: "321", k 1 → "21" (not "12")', () => {
      expect(removeKdigits('321', 1)).toBe('21');
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches an exhaustive search over every choice of digits on 600 random inputs', () => {
      const rng = createRng(1234);
      for (let t = 0; t < 600; t++) {
        const n = randomInt(rng, 1, 12);
        const maxDigit = randomInt(rng, 1, 9); // small alphabets → many ties and zeros
        let num = String(randomInt(rng, 1, Math.max(1, maxDigit)));
        for (let i = 1; i < n; i++) num += String(randomInt(rng, 0, maxDigit));
        const k = randomInt(rng, 0, n);
        expect(removeKdigits(num, k), `num="${num}", k=${k}`).toBe(bruteRemove(num, k));
      }
    });
  });

  describe('performance', () => {
    it('100,000 non-decreasing digits with k 20,000 (re-scanning for each deletion is O(n·k), far too slow)', () => {
      const n = 100_000;
      let num = '';
      for (let i = 0; i < n; i++) num += String(1 + Math.floor((i * 9) / n));
      const { result, ms } = measure(() => removeKdigits(num, 20_000));
      expect(result).toBe(num.slice(0, n - 20_000));
      expect(ms, `took ${ms.toFixed(0)}ms — each digit should be pushed and popped at most once`).toBeLessThan(1000);
    });

    it('100,000 digits "9876543210" repeated with k 50,000', () => {
      const num = '9876543210'.repeat(10_000);
      const { result, ms } = measure(() => removeKdigits(num, 50_000));
      // Each of the first 5,555 blocks spends 9 removals and keeps only its 0
      // (49,995 removals). The last 5 removals turn the next block into
      // "43210". Then the 5,555 leading zeros are stripped.
      expect(result).toBe('43210' + '9876543210'.repeat(4_444));
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(1000);
    });

    it('a 100,000-digit "1000…0", k 1 → "0" (leading-zero stripping on a long string)', () => {
      const num = '1' + '0'.repeat(99_999);
      const { result, ms } = measure(() => removeKdigits(num, 1));
      expect(result).toBe('0');
      expect(ms, `took ${ms.toFixed(0)}ms — strip leading zeros in one pass`).toBeLessThan(1000);
    });
  });
});
