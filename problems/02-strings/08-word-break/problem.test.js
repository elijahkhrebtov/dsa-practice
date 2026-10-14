import { describe, it, expect } from 'vitest';
import { wordBreak } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: a regular expression "one or more dictionary words,
 * then the end of the string". Fine for the tiny random inputs below.
 */
function oracle(s, wordDict) {
  return new RegExp(`^(?:${wordDict.join('|')})+$`).test(s);
}

function randomWord(rng, alphabet, maxLen) {
  let w = '';
  const len = randomInt(rng, 1, maxLen);
  for (let i = 0; i < len; i++) w += alphabet[randomInt(rng, 0, alphabet.length - 1)];
  return w;
}

describe('Word Break', () => {
  describe('examples from the problem', () => {
    it('"leetcode", ["leet", "code"] → true', () => {
      expect(wordBreak('leetcode', ['leet', 'code'])).toBe(true);
    });

    it('"applepenapple", ["apple", "pen"] → true (a word may be reused)', () => {
      expect(wordBreak('applepenapple', ['apple', 'pen'])).toBe(true);
    });

    it('"catsandog", ["cats", "dog", "sand", "and", "cat"] → false (the leftover "og" is not a word)', () => {
      expect(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('a single character that is a word → true', () => {
      expect(wordBreak('a', ['a'])).toBe(true);
    });

    it('a single character that is not a word → false', () => {
      expect(wordBreak('a', ['b'])).toBe(false);
    });

    it('s is exactly one dictionary word → true', () => {
      expect(wordBreak('dictionary', ['dict', 'dictionary', 'ion'])).toBe(true);
    });

    it('every word is longer than s → false (don\'t read past the end of s)', () => {
      expect(wordBreak('ab', ['abc', 'abcd'])).toBe(false);
    });

    it('one word repeated many times: "abababab", ["ab"] → true', () => {
      expect(wordBreak('abababab', ['ab'])).toBe(true);
    });

    it('a prefix matches but the last character is left over: "abcabcx", ["abc"] → false', () => {
      expect(wordBreak('abcabcx', ['abc'])).toBe(false);
    });

    it('words that occur in s but not at a usable position: "xyz", ["y"] → false', () => {
      expect(wordBreak('xyz', ['y'])).toBe(false);
    });

    it('duplicates in the dictionary change nothing', () => {
      expect(wordBreak('catdog', ['cat', 'cat', 'dog', 'dog'])).toBe(true);
    });
  });

  describe('tricky cases (greedy choices fail)', () => {
    it('"goalspecial", ["go", "goal", "goals", "special"] → true (longest-first takes "goals" and is stuck with "pecial")', () => {
      expect(wordBreak('goalspecial', ['go', 'goal', 'goals', 'special'])).toBe(true);
    });

    it('"catsdog", ["cat", "cats", "dog"] → true (shortest-first takes "cat" and is stuck with "sdog")', () => {
      expect(wordBreak('catsdog', ['cat', 'cats', 'dog'])).toBe(true);
    });

    it('"aaaaaaa", ["aaaa", "aaa"] → true (7 = 4 + 3, but taking "aaaa" twice overshoots)', () => {
      expect(wordBreak('aaaaaaa', ['aaaa', 'aaa'])).toBe(true);
    });

    it('"aaaaa", ["aa", "aaaa"] → false (only even lengths can be built)', () => {
      expect(wordBreak('aaaaa', ['aa', 'aaaa'])).toBe(false);
    });

    it('"cars", ["car", "ca", "rs"] → true (the obvious first word "car" is a dead end)', () => {
      expect(wordBreak('cars', ['car', 'ca', 'rs'])).toBe(true);
    });

    it('"bb", ["a", "b", "bbb", "bbbb"] → true (unused words don\'t matter)', () => {
      expect(wordBreak('bb', ['a', 'b', 'bbb', 'bbbb'])).toBe(true);
    });

    it('"abcd", ["a", "abc", "b", "cd"] → true (a + b + cd, not abc + d)', () => {
      expect(wordBreak('abcd', ['a', 'abc', 'b', 'cd'])).toBe(true);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force regex oracle on 400 small random inputs', () => {
      const rng = createRng(2024);
      let trues = 0;
      let falses = 0;
      for (let t = 0; t < 400; t++) {
        const dict = Array.from({ length: randomInt(rng, 1, 5) }, () => randomWord(rng, 'ab', 4));
        let s;
        if (rng() < 0.5) {
          // Glue dictionary words together, then sometimes corrupt one character.
          s = '';
          const pieces = randomInt(rng, 1, 6);
          for (let k = 0; k < pieces; k++) s += dict[randomInt(rng, 0, dict.length - 1)];
          if (rng() < 0.4) {
            const i = randomInt(rng, 0, s.length - 1);
            s = s.slice(0, i) + (s[i] === 'a' ? 'b' : 'a') + s.slice(i + 1);
          }
        } else {
          s = randomWord(rng, 'ab', 14);
        }
        const expected = oracle(s, dict);
        if (expected) trues++;
        else falses++;
        expect(wordBreak(s, dict), `s="${s}", wordDict=${JSON.stringify(dict)}`).toBe(expected);
      }
      // Sanity check that the generator produced a healthy mix of both answers.
      expect(trues).toBeGreaterThan(50);
      expect(falses).toBeGreaterThan(50);
    });
  });

  describe('performance', () => {
    it('"aaa…ab" (27 a\'s) with words "a" … "aaaaaaaaaa" (+ "ba") → false fast (plain recursion tries tens of millions of cuts)', () => {
      const s = 'a'.repeat(27) + 'b';
      // "ba" makes sure every letter of s appears in the dictionary, so a
      // "does every character occur in some word?" pre-check can't short-circuit.
      const dict = [...Array.from({ length: 10 }, (_, k) => 'a'.repeat(k + 1)), 'ba'];
      const { result, ms } = measure(() => wordBreak(s, dict));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms — remember which start positions already failed`).toBeLessThan(500);
    });

    it('a 2,000-character string built from a 1,000-word dictionary → true quickly', () => {
      const rng = createRng(99);
      const dictSet = new Set();
      while (dictSet.size < 1000) dictSet.add(randomWord(rng, 'abcdefgh', 20));
      const dict = [...dictSet];
      let s = '';
      for (;;) {
        const w = dict[randomInt(rng, 0, dict.length - 1)];
        if (s.length + w.length > 2000) break;
        s += w;
      }
      const { result, ms } = measure(() => wordBreak(s, dict));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });
  });
});
