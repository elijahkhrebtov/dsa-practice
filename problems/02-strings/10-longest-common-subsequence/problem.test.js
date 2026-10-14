import { describe, it, expect } from 'vitest';
import { longestCommonSubsequence as lcs } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** True if `sub` is a subsequence of `s` (greedy two-pointer scan). */
function isSubsequence(sub, s) {
  let i = 0;
  for (let j = 0; j < s.length && i < sub.length; j++) if (s[j] === sub[i]) i++;
  return i === sub.length;
}

/**
 * Brute-force oracle: try every subsequence of `a` (2^|a| of them) and keep
 * the longest one that is also a subsequence of `b`.
 */
function oracle(a, b) {
  let best = 0;
  for (let mask = 0; mask < 1 << a.length; mask++) {
    let sub = '';
    for (let i = 0; i < a.length; i++) if (mask & (1 << i)) sub += a[i];
    if (sub.length > best && isSubsequence(sub, b)) best = sub.length;
  }
  return best;
}

function randomString(rng, alphabet, minLen, maxLen) {
  let s = '';
  const len = randomInt(rng, minLen, maxLen);
  for (let i = 0; i < len; i++) s += alphabet[randomInt(rng, 0, alphabet.length - 1)];
  return s;
}

describe('Longest Common Subsequence', () => {
  describe('examples from the problem', () => {
    it('"abcde", "ace" → 3 (the subsequence "ace" skips b and d)', () => {
      expect(lcs('abcde', 'ace')).toBe(3);
    });

    it('"abc", "abc" → 3 (identical strings)', () => {
      expect(lcs('abc', 'abc')).toBe(3);
    });

    it('"abc", "def" → 0 (nothing in common)', () => {
      expect(lcs('abc', 'def')).toBe(0);
    });

    it('"abc", "bca" → 2 ("bc" — matching the a\'s first is a trap)', () => {
      expect(lcs('abc', 'bca')).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('single equal characters: "a", "a" → 1', () => {
      expect(lcs('a', 'a')).toBe(1);
    });

    it('single different characters: "a", "b" → 0', () => {
      expect(lcs('a', 'b')).toBe(0);
    });

    it('one string is a subsequence of the other: "abcdef", "acf" → 3 (gaps are fine)', () => {
      expect(lcs('abcdef', 'acf')).toBe(3);
    });

    it('a character can be matched only once: "a", "aaaa" → 1', () => {
      expect(lcs('a', 'aaaa')).toBe(1);
    });

    it('repeated characters: "aaaa", "aa" → 2', () => {
      expect(lcs('aaaa', 'aa')).toBe(2);
    });

    it('a common character at the very end only: "xyzq", "abcq" → 1', () => {
      expect(lcs('xyzq', 'abcq')).toBe(1);
    });
  });

  describe('tricky cases', () => {
    it('order matters: "abc", "cba" → 1 (the same letters reversed share only one)', () => {
      expect(lcs('abc', 'cba')).toBe(1);
    });

    it('the result is symmetric: lcs(a, b) === lcs(b, a)', () => {
      expect(lcs('ezupkr', 'ubmrapg')).toBe(2);
      expect(lcs('ubmrapg', 'ezupkr')).toBe(2);
    });

    it('"oxcpqrsvwf", "shmtulqrypy" → 2 ("qr")', () => {
      expect(lcs('oxcpqrsvwf', 'shmtulqrypy')).toBe(2);
    });

    it('greedy "match each letter as early as possible" fails: "aebcd", "bcdae" → 3', () => {
      // Greedily matching 'a' and then 'e' gets "ae" (2). Skipping them gives "bcd".
      expect(lcs('aebcd', 'bcdae')).toBe(3);
    });

    it('interleaved letters: "abcabcabc", "aaabbbccc" → 5', () => {
      // e.g. "aabcc" or "abbcc"
      expect(lcs('abcabcabc', 'aaabbbccc')).toBe(5);
    });

    it('a long subsequence hidden in noise: "xaxbxcxdxex", "abcde" → 5', () => {
      expect(lcs('xaxbxcxdxex', 'abcde')).toBe(5);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force oracle on 300 small random pairs', () => {
      const rng = createRng(77);
      for (let t = 0; t < 300; t++) {
        const alphabet = rng() < 0.5 ? 'ab' : 'abcd';
        const a = randomString(rng, alphabet, 1, 10);
        const b = randomString(rng, alphabet, 1, 12);
        expect(lcs(a, b), `text1="${a}", text2="${b}"`).toBe(oracle(a, b));
      }
    });
  });

  describe('large inputs', () => {
    it('a 1,000-letter string against itself → 1000', () => {
      const s = randomString(createRng(5), 'abcdefghij', 1000, 1000);
      expect(lcs(s, s)).toBe(1000);
    });

    it('two 1,000-letter strings that differ only in the last letter → 999', () => {
      const base = randomString(createRng(6), 'abcdefghij', 999, 999);
      expect(lcs(base + 'y', base + 'z')).toBe(999);
    });

    it('1,000 letters vs a single letter that appears once in it → 1', () => {
      const s = 'b'.repeat(500) + 'a' + 'b'.repeat(499);
      expect(lcs(s, 'a')).toBe(1);
      expect(lcs('a', s)).toBe(1);
    });
  });

  describe('performance', () => {
    // The big random test below only runs once this small trap has proven the
    // solution isn't exponential: on plain recursion it would never finish, and
    // synchronous code can't be interrupted by a test timeout.
    let notExponential = false;

    it('two 16-letter strings that share only the first and last letter → 2 quickly (plain recursion explores tens of millions of paths)', () => {
      const text1 = 'q' + 'ab'.repeat(7) + 'z';
      const text2 = 'q' + 'cd'.repeat(7) + 'z';
      const { result, ms } = measure(() => lcs(text1, text2));
      expect(result).toBe(2);
      expect(ms, `took ${ms.toFixed(0)}ms — the same (i, j) pairs are being solved over and over`).toBeLessThan(500);
      notExponential = true;
    });

    it('two 1,000-letter strings hiding a common 300-letter subsequence → 300 (10^6 table cells; skipped until the test above passes)', (ctx) => {
      if (!notExponential) ctx.skip();
      // `common` uses only 'a'/'b'. text1 weaves it with fillers from c–g,
      // text2 with fillers from h–l, and the paddings differ too, so no filler
      // letter can ever match: the LCS is exactly `common`.
      const rng = createRng(8);
      const common = randomString(rng, 'ab', 300, 300);
      const weave = (fillers, pad) => {
        let s = '';
        for (const ch of common) {
          s += ch;
          for (let k = 0; k < 2; k++) s += fillers[randomInt(rng, 0, fillers.length - 1)];
        }
        return s.padEnd(1000, pad);
      };
      const text1 = weave('cdefg', 'x');
      const text2 = weave('hijkl', 'y');
      const { result, ms } = measure(() => lcs(text1, text2));
      expect(result).toBe(300);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(m·n)`).toBeLessThan(1500);
    });
  });
});
