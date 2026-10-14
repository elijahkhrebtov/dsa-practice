import { describe, it, expect } from 'vitest';
import { numDecodings } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: try every subset of the n-1 gaps between digits as
 * "cut here" and count the cuttings whose pieces are all valid codes.
 * O(2^n · n) — only for short strings.
 */
function oracle(s) {
  const n = s.length;
  let count = 0;
  for (let mask = 0; mask < 1 << (n - 1); mask++) {
    let ok = true;
    let start = 0;
    for (let i = 1; i <= n && ok; i++) {
      if (i === n || mask & (1 << (i - 1))) {
        const piece = s.slice(start, i);
        const v = Number(piece);
        ok = piece[0] !== '0' && piece.length <= 2 && v >= 1 && v <= 26;
        start = i;
      }
    }
    if (ok) count++;
  }
  return count;
}

describe('Decode Ways', () => {
  describe('examples from the problem', () => {
    it('"12" → 2 (1 2 or 12)', () => {
      expect(numDecodings('12')).toBe(2);
    });

    it('"226" → 3 (2 26, 22 6, 2 2 6)', () => {
      expect(numDecodings('226')).toBe(3);
    });

    it('"06" → 0 (a leading zero makes the whole string undecodable)', () => {
      expect(numDecodings('06')).toBe(0);
    });

    it('"100" → 0 (the first 0 takes the 1 as "10", the second 0 is left alone)', () => {
      expect(numDecodings('100')).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('"0" → 0 (zero alone is not a letter)', () => {
      expect(numDecodings('0')).toBe(0);
    });

    it('"1" → 1 and "9" → 1 (single non-zero digits)', () => {
      expect(numDecodings('1')).toBe(1);
      expect(numDecodings('9')).toBe(1);
    });

    it('"10" → 1 and "20" → 1 (the zero must attach to the digit before it)', () => {
      expect(numDecodings('10')).toBe(1);
      expect(numDecodings('20')).toBe(1);
    });

    it('"30" → 0 ("30" is too big and "0" is invalid)', () => {
      expect(numDecodings('30')).toBe(0);
    });

    it('"26" → 2 but "27" → 1 (26 is the largest two-digit code)', () => {
      expect(numDecodings('26')).toBe(2);
      expect(numDecodings('27')).toBe(1);
    });

    it('"00" → 0 and "0123" → 0 (leading zeros)', () => {
      expect(numDecodings('00')).toBe(0);
      expect(numDecodings('0123')).toBe(0);
    });

    it('"9999" → 1 (no pair of digits forms a code)', () => {
      expect(numDecodings('9999')).toBe(1);
    });
  });

  describe('tricky zeros', () => {
    it('"101" → 1 (10 1 — "1 01" is not allowed)', () => {
      expect(numDecodings('101')).toBe(1);
    });

    it('"110" → 1 (1 10 — taking "11" first would strand the 0)', () => {
      expect(numDecodings('110')).toBe(1);
    });

    it('"1001" → 0 (two zeros in a row can never be decoded)', () => {
      expect(numDecodings('1001')).toBe(0);
    });

    it('"2101" → 1 (2 10 1)', () => {
      expect(numDecodings('2101')).toBe(1);
    });

    it('"301" → 0 and "230" → 0 (a zero after a digit ≥ 3 is a dead end)', () => {
      expect(numDecodings('301')).toBe(0);
      expect(numDecodings('230')).toBe(0);
    });

    it('"11106" → 2 (1 1 10 6 or 11 10 6)', () => {
      expect(numDecodings('11106')).toBe(2);
    });

    it('"12120" → 3 (the final "20" is forced, leaving 3 ways for "121")', () => {
      expect(numDecodings('12120')).toBe(3);
    });
  });

  describe('more counting', () => {
    it('"1111" → 5 (runs of 1s count like Fibonacci numbers)', () => {
      expect(numDecodings('1111')).toBe(5);
    });

    it('"227" → 2 (2 2 7 or 22 7 — "27" is not a code)', () => {
      expect(numDecodings('227')).toBe(2);
    });

    it('"123123" → 9 (3 ways for each half; "31" can\'t join them)', () => {
      expect(numDecodings('123123')).toBe(9);
    });

    it('"2611055971756562" → 4', () => {
      expect(numDecodings('2611055971756562')).toBe(4);
    });

    it('a 100-digit string → 4,084,101 (independent blocks multiply: 21^5)', () => {
      // "1111111103": the 0 forces "10", the seven 1s before it decode in
      // Fib(8) = 21 ways, and "3" followed by "1" can't pair up, so the five
      // blocks are independent. "27" never pairs (27 > 26, and "72" > 26).
      const s = '1111111103'.repeat(5) + '27'.repeat(25);
      expect(s).toHaveLength(100);
      expect(numDecodings(s)).toBe(21 ** 5);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force oracle on 500 random digit strings', () => {
      const rng = createRng(1234);
      // Skewed toward 0, 1 and 2, which create the interesting cases.
      const digits = '0011122223456789';
      for (let t = 0; t < 500; t++) {
        const n = randomInt(rng, 1, 14);
        let s = '';
        for (let i = 0; i < n; i++) s += digits[randomInt(rng, 0, digits.length - 1)];
        expect(numDecodings(s), `s="${s}"`).toBe(oracle(s));
      }
    });
  });

  describe('performance', () => {
    it('"1212…12" (40 digits) → 165,580,141 quickly (listing every decoding would take seconds)', () => {
      const s = '12'.repeat(20);
      const { result, ms } = measure(() => numDecodings(s));
      expect(result).toBe(165_580_141); // Fib(41)
      expect(ms, `took ${ms.toFixed(0)}ms — count, don't enumerate`).toBeLessThan(500);
    });

    it('39 ones followed by "00" → 0 quickly (plain recursion explores ~10^8 dead ends before failing)', () => {
      const s = '1'.repeat(39) + '00';
      const { result, ms } = measure(() => numDecodings(s));
      expect(result).toBe(0);
      expect(ms, `took ${ms.toFixed(0)}ms — the same suffix is being solved again and again`).toBeLessThan(500);
    });
  });
});
