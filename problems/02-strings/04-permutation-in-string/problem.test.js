import { describe, it, expect } from 'vitest';
import { checkInclusion } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Brute-force oracle: sort s1, then sort every window of s2 and compare. */
function oracle(s1, s2) {
  const key = [...s1].sort().join('');
  for (let i = 0; i + s1.length <= s2.length; i++) {
    if ([...s2.slice(i, i + s1.length)].sort().join('') === key) return true;
  }
  return false;
}

function randomString(rng, n, alphabet) {
  let s = '';
  for (let i = 0; i < n; i++) s += alphabet[randomInt(rng, 0, alphabet.length - 1)];
  return s;
}

const shuffled = (rng, s) => shuffle(rng, [...s]).join('');

describe('Permutation in String', () => {
  describe('examples from the problem', () => {
    it('"ab" in "eidbaooo" → true ("ba" at indices 3–4)', () => {
      expect(checkInclusion('ab', 'eidbaooo')).toBe(true);
    });

    it('"ab" in "eidboaoo" → false (b and a are not adjacent)', () => {
      expect(checkInclusion('ab', 'eidboaoo')).toBe(false);
    });

    it('"adc" in "dcda" → true ("cda")', () => {
      expect(checkInclusion('adc', 'dcda')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('s1 longer than s2 → false: "abc" in "ab"', () => {
      expect(checkInclusion('abc', 'ab')).toBe(false);
    });

    it('single letters: "a" in "a" → true, "a" in "b" → false', () => {
      expect(checkInclusion('a', 'a')).toBe(true);
      expect(checkInclusion('a', 'b')).toBe(false);
    });

    it('identical strings → true (s1 is a permutation of itself)', () => {
      expect(checkInclusion('hello', 'hello')).toBe(true);
    });

    it('equal lengths, rearranged → true: "abc" in "cab"', () => {
      expect(checkInclusion('abc', 'cab')).toBe(true);
    });

    it('equal lengths, different letters → false: "abc" in "abd"', () => {
      expect(checkInclusion('abc', 'abd')).toBe(false);
    });

    it('the permutation is the very first window: "ab" in "baxxxx" → true', () => {
      expect(checkInclusion('ab', 'baxxxx')).toBe(true);
    });

    it('the permutation is the very last window: "ab" in "xxxxba" → true (don\'t skip the final window)', () => {
      expect(checkInclusion('ab', 'xxxxba')).toBe(true);
    });

    it('always returns a real boolean', () => {
      expect(checkInclusion('z', 'abc')).toBe(false);
      expect(checkInclusion('c', 'abc')).toBe(true);
    });
  });

  describe('tricky cases', () => {
    it('counts matter, not just the set of letters: "aab" in "abbbab" → false', () => {
      // Windows of length 3: "abb", "bbb", "bba", "bab" — never two a's.
      expect(checkInclusion('aab', 'abbbab')).toBe(false);
    });

    it('duplicates in s1 are matched exactly: "aab" in "bbaab" → true', () => {
      expect(checkInclusion('aab', 'bbaab')).toBe(true);
    });

    it('the right letters but spread out → false: "abc" in "axbxc"', () => {
      expect(checkInclusion('abc', 'axbxc')).toBe(false);
    });

    it('overlapping near-misses before the real match: "abcd" in "abcabcbdcab" → true ("bdca"/"dcab")', () => {
      expect(checkInclusion('abcd', 'abcabcbdcab')).toBe(true);
    });

    it('a character in s2 that s1 never uses blocks windows: "ab" in "azbzazb" → false', () => {
      expect(checkInclusion('ab', 'azbzazb')).toBe(false);
    });

    it('all the same letter: "aaa" in "aaaa" → true, "aaaa" in "aaa" → false', () => {
      expect(checkInclusion('aaa', 'aaaa')).toBe(true);
      expect(checkInclusion('aaaa', 'aaa')).toBe(false);
    });

    it('uses both ends of the alphabet: "az" in "yzay" → true', () => {
      expect(checkInclusion('az', 'yzay')).toBe(true);
    });

    it('s1 uses all 26 letters: found in a longer string that contains a shuffled alphabet', () => {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const s2 = 'aaa' + 'qwertyuiopasdfghjklzxcvbnm' + 'zzz';
      expect(checkInclusion(alphabet, s2)).toBe(true);
      expect(checkInclusion(alphabet, 'aaa' + 'qwertyuiopasdfghjklzxcvbn' + 'zzz')).toBe(false); // 'm' missing
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a sort-every-window oracle on 400 random pairs over a tiny alphabet', () => {
      const rng = createRng(41);
      for (let t = 0; t < 400; t++) {
        const s1 = randomString(rng, randomInt(rng, 1, 5), 'abc');
        const s2 = randomString(rng, randomInt(rng, 1, 20), 'abc');
        expect(checkInclusion(s1, s2), `s1 = "${s1}", s2 = "${s2}"`).toBe(oracle(s1, s2));
      }
    });

    it('finds a planted, shuffled copy of s1 in 200 random strings (and agrees with the oracle after breaking it)', () => {
      const rng = createRng(42);
      for (let t = 0; t < 200; t++) {
        const s1 = randomString(rng, randomInt(rng, 1, 12), 'abcdefgh');
        const before = randomString(rng, randomInt(rng, 0, 30), 'abcdefgh');
        const after = randomString(rng, randomInt(rng, 0, 30), 'abcdefgh');
        const s2 = before + shuffled(rng, s1) + after;
        expect(checkInclusion(s1, s2), `s1 = "${s1}", s2 = "${s2}"`).toBe(true);
        // Replace the planted block with a letter s1 can't use: the oracle decides.
        const broken = before + 'z'.repeat(s1.length) + after;
        expect(checkInclusion(s1, broken), `s1 = "${s1}", s2 = "${broken}"`).toBe(oracle(s1, broken));
      }
    });
  });

  describe('performance', () => {
    it('s1 of 10,000 letters, s2 of 110,000 letters, match at the very end (recounting every window is O(n·m), far too slow)', () => {
      const rng = createRng(43);
      const s1 = randomString(rng, 10_000, 'abcdefghijklmnopqrstuvwxyz');
      // s2: 100,000 random letters that can never match (s1 contains 'z'), then a
      // shuffled copy of s1 right at the end — every window must be examined.
      const prefix = randomString(rng, 100_000, 'abcdefghijklmnopqrstuvwxy'); // no 'z' — s1 surely has some
      const s2 = prefix + shuffled(rng, s1);
      const { result, ms } = measure(() => checkInclusion(s1, s2));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — update counts as the window slides, O(1) per step`).toBeLessThan(500);
    });

    it('s1 of 10,000 letters, s2 of 110,000 letters with no match → false, quickly', () => {
      const rng = createRng(44);
      const s1 = randomString(rng, 10_000, 'abcdefghijklmnopqrstuvwxyz');
      const s2 = randomString(rng, 110_000, 'abcdefghijklmnopqrstuvwxy'); // no 'z' at all
      const { result, ms } = measure(() => checkInclusion(s1, s2));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(500);
    });
  });
});
