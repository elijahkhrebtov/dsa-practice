import { describe, it, expect } from 'vitest';
import { lengthOfLongestSubstring } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Brute-force oracle: from every start, extend until the first repeat. */
function oracle(s) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set();
    let j = i;
    while (j < s.length && !seen.has(s[j])) seen.add(s[j++]);
    best = Math.max(best, j - i);
  }
  return best;
}

function randomString(rng, n, alphabet) {
  let s = '';
  for (let i = 0; i < n; i++) s += alphabet[randomInt(rng, 0, alphabet.length - 1)];
  return s;
}

const PRINTABLE = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');

describe('Longest Substring Without Repeating Characters', () => {
  describe('examples from the problem', () => {
    it('"abcabcbb" → 3 ("abc")', () => {
      expect(lengthOfLongestSubstring('abcabcbb')).toBe(3);
    });

    it('"bbbbb" → 1 (all the same character)', () => {
      expect(lengthOfLongestSubstring('bbbbb')).toBe(1);
    });

    it('"pwwkew" → 3 ("wke" — "pwke" is a subsequence, not a substring)', () => {
      expect(lengthOfLongestSubstring('pwwkew')).toBe(3);
    });

    it('"abba" → 2 (the left edge must never move backwards)', () => {
      // When the last 'a' arrives, the first 'a' (index 0) is already outside
      // the window "b". Jumping left to index 1 would wrongly count "bba".
      expect(lengthOfLongestSubstring('abba')).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('"" → 0 (empty string)', () => {
      expect(lengthOfLongestSubstring('')).toBe(0);
    });

    it('a single character → 1', () => {
      expect(lengthOfLongestSubstring('z')).toBe(1);
    });

    it('a single space → 1 (spaces are characters too)', () => {
      expect(lengthOfLongestSubstring(' ')).toBe(1);
    });

    it('two equal characters → 1, two different → 2', () => {
      expect(lengthOfLongestSubstring('aa')).toBe(1);
      expect(lengthOfLongestSubstring('ab')).toBe(2);
    });

    it('all characters distinct → the whole length: "abcdef" → 6', () => {
      expect(lengthOfLongestSubstring('abcdef')).toBe(6);
    });

    it('all 95 printable ASCII characters once each → 95', () => {
      expect(lengthOfLongestSubstring(PRINTABLE)).toBe(95);
    });
  });

  describe('tricky cases', () => {
    it('"dvdf" → 3 ("vdf": after the repeat, restart just past the first d, not at the repeat)', () => {
      expect(lengthOfLongestSubstring('dvdf')).toBe(3);
    });

    it('"tmmzuxt" → 5 ("mzuxt": the old t is outside the window by the time the second t arrives)', () => {
      expect(lengthOfLongestSubstring('tmmzuxt')).toBe(5);
    });

    it('the best window is at the very end: "aaaaabcde" → 5', () => {
      expect(lengthOfLongestSubstring('aaaaabcde')).toBe(5);
    });

    it('the best window is at the very start: "abcdeeeee" → 5', () => {
      expect(lengthOfLongestSubstring('abcdeeeee')).toBe(5);
    });

    it('case-sensitive: "aAbBa" → 4 ("aAbB" / "AbBa")', () => {
      expect(lengthOfLongestSubstring('aAbBa')).toBe(4);
    });

    it('spaces inside: "a b c a" → 3 (any 4 consecutive characters contain two spaces)', () => {
      expect(lengthOfLongestSubstring('a b c a')).toBe(3);
    });

    it('digits and symbols: "12!@1!" → 4 ("12!@" / "2!@1")', () => {
      expect(lengthOfLongestSubstring('12!@1!')).toBe(4);
    });

    it('the repeat is far back in the window: "abcdefga" → 7', () => {
      expect(lengthOfLongestSubstring('abcdefga')).toBe(7);
    });

    it('"__proto__" → 5 ("_prot"; if you use a plain object as the map, make sure keys like "_" behave)', () => {
      expect(lengthOfLongestSubstring('__proto__')).toBe(5);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force oracle on 300 strings over a tiny alphabet "abc"', () => {
      const rng = createRng(11);
      for (let t = 0; t < 300; t++) {
        const s = randomString(rng, randomInt(rng, 0, 20), 'abc');
        expect(lengthOfLongestSubstring(s), JSON.stringify(s)).toBe(oracle(s));
      }
    });

    it('matches a brute-force oracle on 300 strings over all printable ASCII', () => {
      const rng = createRng(12);
      for (let t = 0; t < 300; t++) {
        const s = randomString(rng, randomInt(rng, 0, 150), PRINTABLE);
        expect(lengthOfLongestSubstring(s), JSON.stringify(s)).toBe(oracle(s));
      }
    });
  });

  describe('performance', () => {
    it('200,000 characters cycling through all 95 printable chars → 95, quickly (re-checking every substring is far too slow)', () => {
      const s = PRINTABLE.repeat(Math.ceil(200_000 / 95)).slice(0, 200_000);
      const { result, ms } = measure(() => lengthOfLongestSubstring(s));
      expect(result).toBe(95);
      expect(ms, `took ${ms.toFixed(0)}ms — each character should enter and leave the window once`).toBeLessThan(500);
    });

    it('200,000 random characters match the expected answer quickly', () => {
      const rng = createRng(13);
      const s = randomString(rng, 200_000, 'abcdefghijklmnopqrstuvwxyz');
      const expected = oracle(s); // computed outside the timed section
      const { result, ms } = measure(() => lengthOfLongestSubstring(s));
      expect(result).toBe(expected);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(500);
    });
  });
});
