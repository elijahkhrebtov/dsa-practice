import { describe, it, expect } from 'vitest';
import { letterCombinations } from './problem.js';
import { createRng, randomInt } from '../../../lib/test-utils.js';

const KEYPAD = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' };

/**
 * Checks the result without depending on order. If every string is a valid
 * spelling of `digits`, there are no duplicates, and the count equals the
 * product of the letter counts, then the result is exactly the full set.
 */
function expectAllCombinations(digits, result) {
  expect(Array.isArray(result), 'should return an array').toBe(true);
  const expectedCount = [...digits].reduce((acc, d) => acc * KEYPAD[d].length, 1);
  expect(result.length, `"${digits}" should produce ${expectedCount} combinations`).toBe(expectedCount);
  expect(new Set(result).size, 'every combination must appear exactly once').toBe(result.length);
  // Plain loop first (thousands of strings), then a single readable assertion.
  const bad = result.find(
    (word) =>
      typeof word !== 'string' ||
      word.length !== digits.length ||
      [...word].some((ch, i) => !KEYPAD[digits[i]].includes(ch)),
  );
  expect(bad, `${JSON.stringify(bad)} is not a valid spelling of "${digits}" (one letter per digit, in order)`).toBe(
    undefined,
  );
}

describe('Letter Combinations of a Phone Number', () => {
  describe('examples from the problem', () => {
    it('"23" → ad, ae, af, bd, be, bf, cd, ce, cf (any order)', () => {
      expect([...letterCombinations('23')].sort()).toEqual(['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']);
    });

    it('"" → [] (empty input gives an empty list, not [""])', () => {
      expect(letterCombinations('')).toEqual([]);
    });

    it('"2" → a, b, c', () => {
      expect([...letterCombinations('2')].sort()).toEqual(['a', 'b', 'c']);
    });

    it('"79" → 16 strings from pw to sz (7 and 9 have four letters each)', () => {
      const result = [...letterCombinations('79')].sort();
      expect(result).toHaveLength(16);
      expect(result[0]).toBe('pw');
      expect(result[15]).toBe('sz');
      expectAllCombinations('79', result);
    });
  });

  describe('single digits', () => {
    it('every digit 2–9 on its own maps to its letters', () => {
      for (const [digit, letters] of Object.entries(KEYPAD)) {
        expect([...letterCombinations(digit)].sort(), `digit ${digit}`).toEqual([...letters]);
      }
    });

    it('"7" → p, q, r, s (four letters, not three)', () => {
      expect([...letterCombinations('7')].sort()).toEqual(['p', 'q', 'r', 's']);
    });

    it('"9" → w, x, y, z (four letters, not three)', () => {
      expect([...letterCombinations('9')].sort()).toEqual(['w', 'x', 'y', 'z']);
    });
  });

  describe('order and duplicates', () => {
    it('the digits\' order is kept: "32" gives "da", never "ad"', () => {
      const result = letterCombinations('32');
      expect(result).toContain('da');
      expect(result).not.toContain('ad');
      expectAllCombinations('32', result);
    });

    it('a repeated digit "22" → 9 strings including "aa", "ab" and "ba" (positions are independent)', () => {
      const result = letterCombinations('22');
      expect([...result].sort()).toEqual(['aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc']);
    });

    it('"777" → 64 strings, all distinct', () => {
      expectAllCombinations('777', letterCombinations('777'));
    });
  });

  describe('longer inputs', () => {
    it('"234" → 27 strings', () => {
      expectAllCombinations('234', letterCombinations('234'));
    });

    it('"2345" → 81 strings', () => {
      expectAllCombinations('2345', letterCombinations('2345'));
    });

    it('"7979" → 256 strings (the largest 4-digit case)', () => {
      expectAllCombinations('7979', letterCombinations('7979'));
    });

    it('"999999" → 4,096 strings (6 digits, the maximum)', () => {
      expectAllCombinations('999999', letterCombinations('999999'));
    });

    it('"2" through "9" mixed: "56789" → 3·3·4·3·4 = 432 strings', () => {
      expectAllCombinations('56789', letterCombinations('56789'));
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('produces exactly the right set for 100 random digit strings of length 0–6', () => {
      const rng = createRng(61);
      for (let t = 0; t < 100; t++) {
        const n = randomInt(rng, 0, 6);
        let digits = '';
        for (let i = 0; i < n; i++) digits += String(randomInt(rng, 2, 9));
        const result = letterCombinations(digits);
        if (n === 0) expect(result, 'empty input').toEqual([]);
        else expectAllCombinations(digits, result);
      }
    });
  });
});
