import { describe, it, expect } from 'vitest';
import { longestPalindrome } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const isPalindrome = (t) => t === [...t].reverse().join('');

/** Brute-force oracle: the maximum palindrome length, checking every substring. */
function maxPalindromeLength(s) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      if (j - i + 1 > best && isPalindrome(s.slice(i, j + 1))) best = j - i + 1;
    }
  }
  return best;
}

/**
 * Any longest palindrome is accepted, so check the properties instead of one
 * exact string: it is a substring of s, it is a palindrome, it has the maximum length.
 */
function expectLongestPalindrome(s, result, expectedLength) {
  expect(typeof result, 'should return a string').toBe('string');
  expect(result.length, `expected a palindrome of length ${expectedLength}, got "${result.slice(0, 50)}"`).toBe(
    expectedLength,
  );
  expect(s.includes(result), `"${result.slice(0, 50)}" is not a substring of the input`).toBe(true);
  expect(isPalindrome(result), `"${result.slice(0, 50)}" is not a palindrome`).toBe(true);
}

function randomString(rng, n, alphabet) {
  let s = '';
  for (let i = 0; i < n; i++) s += alphabet[randomInt(rng, 0, alphabet.length - 1)];
  return s;
}

describe('Longest Palindromic Substring', () => {
  describe('examples from the problem', () => {
    it('"babad" → "bab" or "aba" (either is accepted)', () => {
      const result = longestPalindrome('babad');
      expect(['bab', 'aba']).toContain(result);
    });

    it('"cbbd" → "bb" (even-length palindromes are centered between two characters)', () => {
      expect(longestPalindrome('cbbd')).toBe('bb');
    });

    it('"forgeeksskeegfor" → "geeksskeeg"', () => {
      expect(longestPalindrome('forgeeksskeegfor')).toBe('geeksskeeg');
    });

    it('"abc" → any single character', () => {
      expect(['a', 'b', 'c']).toContain(longestPalindrome('abc'));
    });
  });

  describe('edge cases', () => {
    it('a single character is its own answer: "x" → "x"', () => {
      expect(longestPalindrome('x')).toBe('x');
    });

    it('two equal characters: "aa" → "aa"', () => {
      expect(longestPalindrome('aa')).toBe('aa');
    });

    it('two different characters: "ab" → "a" or "b"', () => {
      expect(['a', 'b']).toContain(longestPalindrome('ab'));
    });

    it('the whole string is a palindrome (odd length): "racecar" → "racecar"', () => {
      expect(longestPalindrome('racecar')).toBe('racecar');
    });

    it('the whole string is a palindrome (even length): "abccba" → "abccba"', () => {
      expect(longestPalindrome('abccba')).toBe('abccba');
    });

    it('all the same character: "aaaa" → "aaaa"', () => {
      expect(longestPalindrome('aaaa')).toBe('aaaa');
    });
  });

  describe('tricky cases', () => {
    it('palindrome at the very start: "abacdef" → "aba"', () => {
      expect(longestPalindrome('abacdef')).toBe('aba');
    });

    it('palindrome at the very end: "defgaba" → "aba"', () => {
      expect(longestPalindrome('defgaba')).toBe('aba');
    });

    it('case-sensitive: "Aba" → a single character, not "Aba"', () => {
      expectLongestPalindrome('Aba', longestPalindrome('Aba'), 1);
    });

    it('digits count like letters: "12321x" → "12321"', () => {
      expect(longestPalindrome('12321x')).toBe('12321');
    });

    it('a longer even palindrome beats a shorter odd one: "abaxyyx" → "xyyx"', () => {
      expect(longestPalindrome('abaxyyx')).toBe('xyyx');
    });

    it('a longer odd palindrome beats a shorter even one: "xyyxabcba" → "abcba"', () => {
      expect(longestPalindrome('xyyxabcba')).toBe('abcba');
    });

    it('"abacdfgdcaba" → "aba" (the reverse shares "abacd" with it, but that is not a palindrome)', () => {
      // Classic trap: longest common substring of s and reverse(s) is NOT the answer.
      const result = longestPalindrome('abacdfgdcaba');
      expectLongestPalindrome('abacdfgdcaba', result, 3);
    });

    it('palindromes nested inside each other: "aabbaa" → "aabbaa"', () => {
      expect(longestPalindrome('aabbaa')).toBe('aabbaa');
    });

    it('runs of equal characters next to a palindrome: "aaabaaaa" → "aaabaaa"', () => {
      expect(longestPalindrome('aaabaaaa')).toBe('aaabaaa');
    });

    it('several answers of the same maximum length: "abaxcdc" → "aba" or "cdc"', () => {
      expect(['aba', 'cdc']).toContain(longestPalindrome('abaxcdc'));
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('agrees with a check-every-substring oracle on 300 random strings over "ab"', () => {
      const rng = createRng(51);
      for (let t = 0; t < 300; t++) {
        const s = randomString(rng, randomInt(rng, 1, 30), 'ab');
        expectLongestPalindrome(s, longestPalindrome(s), maxPalindromeLength(s));
      }
    });

    it('agrees with the oracle on 300 random strings over "abc" and digits', () => {
      const rng = createRng(52);
      for (let t = 0; t < 300; t++) {
        const s = randomString(rng, randomInt(rng, 1, 40), t % 2 ? 'abc' : 'aB1');
        expectLongestPalindrome(s, longestPalindrome(s), maxPalindromeLength(s));
      }
    });

    it('finds a planted palindrome inside 100 random strings', () => {
      const rng = createRng(53);
      for (let t = 0; t < 100; t++) {
        const half = randomString(rng, randomInt(rng, 5, 15), 'abcdefgh');
        const middle = rng() < 0.5 ? 'z' : '';
        const planted = half + middle + [...half].reverse().join('');
        const s = randomString(rng, randomInt(rng, 0, 20), 'xy') + planted + randomString(rng, randomInt(rng, 0, 20), 'xy');
        expectLongestPalindrome(s, longestPalindrome(s), maxPalindromeLength(s));
      }
    });
  });

  describe('performance', () => {
    it('3,000 copies of one letter → the whole string, quickly (checking every substring is O(n³), far too slow)', () => {
      const s = 'a'.repeat(3000);
      const { result, ms } = measure(() => longestPalindrome(s));
      expect(result).toBe(s);
      expect(ms, `took ${ms.toFixed(0)}ms — expand around each center, O(n²)`).toBeLessThan(1000);
    });

    it('3,000 characters of long almost-palindromes → length 1201, quickly (even a longest-first brute force is too slow)', () => {
      // "a"×1200 + "b" + "a"×600 + "c" + "a"×1199. The best palindromes are
      // "a"×600 + "b" + "a"×600 and "a"×600 + "c" + "a"×600 (length 1201).
      // Lots of long substrings match for hundreds of characters before failing.
      const s = 'a'.repeat(1200) + 'b' + 'a'.repeat(600) + 'c' + 'a'.repeat(1199);
      const { result, ms } = measure(() => longestPalindrome(s));
      expectLongestPalindrome(s, result, 1201);
      expect(ms, `took ${ms.toFixed(0)}ms — expand around each center, O(n²)`).toBeLessThan(750);
    });

    it('3,000 random characters with a planted 401-character palindrome → exactly that palindrome', () => {
      const rng = createRng(54);
      const half = randomString(rng, 200, 'abcd');
      const planted = half + 'e' + [...half].reverse().join('');
      // 'x' on the left and 'y' on the right stop the planted palindrome from growing.
      const s = randomString(rng, 1300, 'abcd') + 'x' + planted + 'y' + randomString(rng, 1297, 'abcd');
      const { result, ms } = measure(() => longestPalindrome(s));
      expect(result).toBe(planted);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });
  });
});
