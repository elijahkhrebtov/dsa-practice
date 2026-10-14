import { describe, it, expect } from 'vitest';
import { isAnagram } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

/** Brute-force oracle: two strings are anagrams iff their sorted letters match. */
function oracle(s, t) {
  return [...s].sort().join('') === [...t].sort().join('');
}

/** Random lowercase string of the given length over the first `letters` letters. */
function randomWord(rng, length, letters = 26) {
  let out = '';
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(rng, 0, letters - 1)];
  return out;
}

describe('Valid Anagram', () => {
  describe('examples from the problem', () => {
    it('"anagram" vs "nagaram" → true', () => {
      expect(isAnagram('anagram', 'nagaram')).toBe(true);
    });

    it('"rat" vs "car" → false (different letters)', () => {
      expect(isAnagram('rat', 'car')).toBe(false);
    });

    it('"aab" vs "abb" → false (same letters, same length, different counts)', () => {
      expect(isAnagram('aab', 'abb')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('two empty strings are anagrams → true', () => {
      expect(isAnagram('', '')).toBe(true);
    });

    it('empty vs non-empty → false', () => {
      expect(isAnagram('', 'a')).toBe(false);
      expect(isAnagram('a', '')).toBe(false);
    });

    it('single equal letters → true, single different letters → false', () => {
      expect(isAnagram('z', 'z')).toBe(true);
      expect(isAnagram('a', 'b')).toBe(false);
    });

    it('a string is an anagram of itself', () => {
      expect(isAnagram('listen', 'listen')).toBe(true);
    });

    it('returns a real boolean, not a truthy/falsy value', () => {
      expect(isAnagram('ab', 'ba')).toBe(true);
      expect(isAnagram('ab', 'bb')).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('different lengths are never anagrams: "ab" vs "abb" → false (t is a superset of s)', () => {
      expect(isAnagram('ab', 'abb')).toBe(false);
    });

    it('different lengths, the other way round: "abb" vs "ab" → false', () => {
      expect(isAnagram('abb', 'ab')).toBe(false);
    });

    it('"ab" vs "aa" → false (every letter of t occurs in s, but that is not enough)', () => {
      // Checking only "is every char of t somewhere in s?" says true here.
      expect(isAnagram('ab', 'aa')).toBe(false);
      expect(isAnagram('aa', 'ab')).toBe(false);
    });

    it('"ad" vs "bc" → false (equal sums of char codes do not make an anagram)', () => {
      // 'a' + 'd' = 97 + 100 = 98 + 99 = 'b' + 'c'
      expect(isAnagram('ad', 'bc')).toBe(false);
    });

    it('"aabb" vs "ccdd" → false (XOR of all chars is 0 for both, which proves nothing)', () => {
      expect(isAnagram('aabb', 'ccdd')).toBe(false);
    });

    it('a reversed string is an anagram: "stressed" vs "desserts" → true', () => {
      expect(isAnagram('stressed', 'desserts')).toBe(true);
    });

    it('repeated letters must match exactly: "aaaaab" vs "aaaabb" → false', () => {
      expect(isAnagram('aaaaab', 'aaaabb')).toBe(false);
    });

    it('uses all 26 letters: the alphabet vs its reverse → true', () => {
      expect(isAnagram(ALPHABET, [...ALPHABET].reverse().join(''))).toBe(true);
    });

    it('a mismatch on the very last letter is still caught: "abcdefghiz" vs "abcdefghiy" → false', () => {
      expect(isAnagram('abcdefghiz', 'abcdefghiy')).toBe(false);
    });

    it('long near-miss: 20,000 shuffled letters with only the last letter replaced → false', () => {
      const rng = createRng(3);
      const s = randomWord(rng, 20_000);
      const t = shuffle(rng, [...s]);
      t[t.length - 1] = t[t.length - 1] === 'a' ? 'b' : 'a';
      expect(isAnagram(s, t.join(''))).toBe(false);
    });

    it('does not modify its inputs and gives the same answer when called twice', () => {
      const s = 'listen';
      const t = 'silent';
      expect(isAnagram(s, t)).toBe(true);
      expect(isAnagram(s, t)).toBe(true);
      expect(isAnagram(t, s)).toBe(true);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('true for 200 random strings paired with a shuffled copy', () => {
      const rng = createRng(2024);
      for (let k = 0; k < 200; k++) {
        const s = randomWord(rng, randomInt(rng, 0, 60));
        const t = shuffle(rng, [...s]).join('');
        expect(isAnagram(s, t), `s="${s}", t="${t}"`).toBe(true);
      }
    });

    it('matches a sort-based oracle on 300 near-miss pairs (one letter changed)', () => {
      const rng = createRng(77);
      for (let k = 0; k < 300; k++) {
        // Small alphabets make accidental anagrams and close calls common.
        const letters = randomInt(rng, 2, 5);
        const s = randomWord(rng, randomInt(rng, 1, 30), letters);
        const chars = shuffle(rng, [...s]);
        chars[randomInt(rng, 0, chars.length - 1)] = ALPHABET[randomInt(rng, 0, letters - 1)];
        const t = chars.join('');
        expect(isAnagram(s, t), `s="${s}", t="${t}"`).toBe(oracle(s, t));
      }
    });

    it('matches the oracle on 300 pairs of independent random strings, sometimes of different lengths', () => {
      const rng = createRng(5);
      for (let k = 0; k < 300; k++) {
        const s = randomWord(rng, randomInt(rng, 0, 6), 3);
        const t = randomWord(rng, randomInt(rng, 0, 6), 3);
        expect(isAnagram(s, t), `s="${s}", t="${t}"`).toBe(oracle(s, t));
      }
    });
  });

  describe('performance', () => {
    it('a pair of 200,000-letter anagrams (find-and-delete per letter is O(n²), far too slow)', () => {
      const rng = createRng(99);
      const n = 200_000;
      const s = randomWord(rng, n);
      const t = shuffle(rng, [...s]).join('');
      const { result, ms } = measure(() => isAnagram(s, t));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms. Count the letters in one pass (O(n))`).toBeLessThan(500);
    });
  });
});
