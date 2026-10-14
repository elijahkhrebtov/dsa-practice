import { describe, it, expect } from 'vitest';
import { isPalindrome } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Brute-force oracle: filter, lowercase, compare with the reverse. */
function oracle(s) {
  const clean = s.replace(/[^a-z0-9]/gi, '').toLowerCase();
  return clean === [...clean].reverse().join('');
}

const PRINTABLE = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');

describe('Valid Palindrome', () => {
  describe('examples from the problem', () => {
    it('"A man, a plan, a canal: Panama" → true', () => {
      expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
    });

    it('"race a car" → false', () => {
      expect(isPalindrome('race a car')).toBe(false);
    });

    it('" " → true (nothing alphanumeric left: the empty string is a palindrome)', () => {
      expect(isPalindrome(' ')).toBe(true);
    });

    it('"0P" → false (a digit never equals a letter)', () => {
      expect(isPalindrome('0P')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('"" → true (empty input)', () => {
      expect(isPalindrome('')).toBe(true);
    });

    it('a single letter is a palindrome: "x" → true', () => {
      expect(isPalindrome('x')).toBe(true);
    });

    it('only symbols and spaces → true: ".,;:!? -_()[]{}"', () => {
      expect(isPalindrome('.,;:!? -_()[]{}')).toBe(true);
    });

    it('a single alphanumeric surrounded by symbols → true: "!!!a???"', () => {
      expect(isPalindrome('!!!a???')).toBe(true);
    });

    it('two different letters → false: "ab"', () => {
      expect(isPalindrome('ab')).toBe(false);
    });

    it('always returns a real boolean, not a truthy/falsy value', () => {
      expect(isPalindrome('abba')).toBe(true);
      expect(isPalindrome('abca')).toBe(false);
      expect(isPalindrome('')).toBe(true);
    });
  });

  describe('case and character classes', () => {
    it('case-insensitive: "AbBa" → true', () => {
      expect(isPalindrome('AbBa')).toBe(true);
    });

    it('digits count: "12321" → true, "12312" → false', () => {
      expect(isPalindrome('12321')).toBe(true);
      expect(isPalindrome('12312')).toBe(false);
    });

    it('mixed letters and digits: "1a2_2A1" → true', () => {
      expect(isPalindrome('1a2_2A1')).toBe(true);
    });

    it('symbols are ignored even when they break the symmetry: "a,b.:B/A" → true', () => {
      expect(isPalindrome('a,b.:B/A')).toBe(true);
    });

    it('characters just outside the alphanumeric ranges are ignored: "@a[`b{B`[A@"', () => {
      // '@' (64) is right before 'A', '[' (91) right after 'Z',
      // '`' (96) right before 'a', '{' (123) right after 'z'.
      expect(isPalindrome('@a[`b{B`[A@')).toBe(true);
      expect(isPalindrome('/a:')).toBe(true); // '/' and ':' surround the digits
    });

    it('"/" and ":" are not digits, so "1/:2" → false (only "12" remains)', () => {
      expect(isPalindrome('1/:2')).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('even-length palindrome: "abccba" → true', () => {
      expect(isPalindrome('abccba')).toBe(true);
    });

    it('odd-length palindrome: "abcba" → true', () => {
      expect(isPalindrome('abcba')).toBe(true);
    });

    it('mismatch only in the very middle pair: "abcdba" → false', () => {
      expect(isPalindrome('abcdba')).toBe(false);
    });

    it('mismatch only at the ends: "xbcba" → false', () => {
      expect(isPalindrome('xbcba')).toBe(false);
    });

    it('lots of symbols on one side only: "a!!!!!!!!!!!!b,b a" → true', () => {
      // Pointers must skip a long run of junk without crossing each other incorrectly.
      expect(isPalindrome('a!!!!!!!!!!!!b,b a')).toBe(true);
    });

    it('"No \'x\' in Nixon" → true (apostrophes and spaces are ignored)', () => {
      expect(isPalindrome("No 'x' in Nixon")).toBe(true);
    });

    it('"Was it a car or a cat I saw?" → true', () => {
      expect(isPalindrome('Was it a car or a cat I saw?')).toBe(true);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a filter-and-reverse oracle on 300 random strings', () => {
      const rng = createRng(101);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 0, 30);
        let s = '';
        for (let i = 0; i < n; i++) s += PRINTABLE[randomInt(rng, 0, PRINTABLE.length - 1)];
        expect(isPalindrome(s), JSON.stringify(s)).toBe(oracle(s));
      }
    });

    it('recognizes 300 random palindromes padded with random symbols and random case', () => {
      const rng = createRng(202);
      const alnum = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const junk = ' .,;:!?-_\'"@#$%^&*()[]{}<>/\\|`~+=';
      for (let t = 0; t < 300; t++) {
        const half = Array.from({ length: randomInt(rng, 0, 10) }, () => alnum[randomInt(rng, 0, alnum.length - 1)]);
        const mid = rng() < 0.5 ? [alnum[randomInt(rng, 0, alnum.length - 1)]] : [];
        const core = [...half, ...mid, ...[...half].reverse()];
        let s = '';
        for (const ch of core) {
          while (rng() < 0.3) s += junk[randomInt(rng, 0, junk.length - 1)];
          s += rng() < 0.5 ? ch.toUpperCase() : ch;
        }
        expect(isPalindrome(s), JSON.stringify(s)).toBe(true);
        // Break the symmetry: changing one alphanumeric to a different one must give false.
        if (core.length >= 2) {
          const idx = s.search(/[a-z0-9]/i);
          const replacement = s[idx].toLowerCase() === 'q' ? 'z' : 'q';
          const broken = s.slice(0, idx) + replacement + s.slice(idx + 1);
          expect(isPalindrome(broken), JSON.stringify(broken)).toBe(oracle(broken));
        }
      }
    });
  });

  describe('performance', () => {
    it('handles a 1,000,000-character palindrome quickly (stay O(n); no repeated slicing)', () => {
      const half = Array.from({ length: 250_000 }, (_, i) => 'aB3, '[i % 5]).join('');
      const s = half + [...half].reverse().join('');
      const { result, ms } = measure(() => isPalindrome(s));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — one pass from both ends is enough`).toBeLessThan(500);
    });

    it('handles a 1,000,000-character non-palindrome that differs only in the middle', () => {
      const half = 'x'.repeat(500_000);
      const s = half.slice(1) + 'ab' + half.slice(1);
      const { result, ms } = measure(() => isPalindrome(s));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(500);
    });
  });
});
