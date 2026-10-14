import { describe, it, expect } from 'vitest';
import { minDistance } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: breadth-first search over strings, one edit per step.
 * Only letters that occur in either word are ever useful, and doing all
 * deletions before insertions keeps every intermediate string no longer
 * than the longer word, so the search space stays tiny for short inputs.
 */
function oracle(a, b) {
  const alphabet = [...new Set(a + b)];
  const maxLen = Math.max(a.length, b.length);
  const dist = new Map([[a, 0]]);
  let frontier = [a];
  while (frontier.length > 0) {
    const next = [];
    for (const s of frontier) {
      const d = dist.get(s);
      if (s === b) return d;
      const neighbours = [];
      for (let i = 0; i < s.length; i++) neighbours.push(s.slice(0, i) + s.slice(i + 1)); // delete
      for (let i = 0; i < s.length; i++) {
        for (const c of alphabet) if (c !== s[i]) neighbours.push(s.slice(0, i) + c + s.slice(i + 1)); // replace
      }
      if (s.length < maxLen) {
        for (let i = 0; i <= s.length; i++) for (const c of alphabet) neighbours.push(s.slice(0, i) + c + s.slice(i)); // insert
      }
      for (const t of neighbours) {
        if (!dist.has(t)) {
          dist.set(t, d + 1);
          next.push(t);
        }
      }
    }
    frontier = next;
  }
  throw new Error('unreachable');
}

function randomString(rng, alphabet, minLen, maxLen) {
  let s = '';
  const len = randomInt(rng, minLen, maxLen);
  for (let i = 0; i < len; i++) s += alphabet[randomInt(rng, 0, alphabet.length - 1)];
  return s;
}

describe('Edit Distance', () => {
  describe('examples from the problem', () => {
    it('"horse" → "ros" = 3 (replace h, delete r, delete e)', () => {
      expect(minDistance('horse', 'ros')).toBe(3);
    });

    it('"intention" → "execution" = 5', () => {
      expect(minDistance('intention', 'execution')).toBe(5);
    });

    it('"" → "abc" = 3 (insert everything)', () => {
      expect(minDistance('', 'abc')).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('two empty strings → 0', () => {
      expect(minDistance('', '')).toBe(0);
    });

    it('"abc" → "" = 3 (delete everything)', () => {
      expect(minDistance('abc', '')).toBe(3);
    });

    it('identical strings → 0', () => {
      expect(minDistance('dynamic', 'dynamic')).toBe(0);
    });

    it('single different characters: "a" → "b" = 1 (one replace)', () => {
      expect(minDistance('a', 'b')).toBe(1);
    });

    it('"abc" → "abd" = 1 (one replace, not a delete plus an insert)', () => {
      expect(minDistance('abc', 'abd')).toBe(1);
    });

    it('"a" → "aaaa" = 3 (keep the a, insert three)', () => {
      expect(minDistance('a', 'aaaa')).toBe(3);
    });
  });

  describe('tricky cases', () => {
    it('"ab" → "ba" = 2 (there is no swap operation)', () => {
      expect(minDistance('ab', 'ba')).toBe(2);
    });

    it('"kitten" → "sitting" = 3 (k→s, e→i, insert g)', () => {
      expect(minDistance('kitten', 'sitting')).toBe(3);
    });

    it('"sunday" → "saturday" = 3 (insert a, insert t, n→r)', () => {
      expect(minDistance('sunday', 'saturday')).toBe(3);
    });

    it('"flaw" → "lawn" = 2 (delete f at the front, insert n at the back — not 4 replaces)', () => {
      expect(minDistance('flaw', 'lawn')).toBe(2);
    });

    it('"abcdef" → "azced" = 3 (b→z, delete d, f→d)', () => {
      expect(minDistance('abcdef', 'azced')).toBe(3);
    });

    it('the distance is symmetric: d(a, b) === d(b, a)', () => {
      expect(minDistance('execution', 'intention')).toBe(5);
      expect(minDistance('ros', 'horse')).toBe(3);
    });

    it('completely different words of equal length need one replace per letter: "abc" → "xyz" = 3', () => {
      expect(minDistance('abc', 'xyz')).toBe(3);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force BFS oracle on 250 small random pairs', () => {
      const rng = createRng(31);
      for (let t = 0; t < 250; t++) {
        const alphabet = rng() < 0.5 ? 'ab' : 'abc';
        const a = randomString(rng, alphabet, 0, 5);
        const b = randomString(rng, alphabet, 0, 5);
        expect(minDistance(a, b), `word1="${a}", word2="${b}"`).toBe(oracle(a, b));
      }
    });

    it('respects the obvious bounds on 200 random pairs: |m − n| ≤ d ≤ max(m, n), and d(a, b) = d(b, a)', () => {
      const rng = createRng(32);
      for (let t = 0; t < 200; t++) {
        const a = randomString(rng, 'abcd', 0, 8);
        const b = randomString(rng, 'abcd', 0, 8);
        const d = minDistance(a, b);
        expect(d, `word1="${a}", word2="${b}"`).toBeGreaterThanOrEqual(Math.abs(a.length - b.length));
        expect(d, `word1="${a}", word2="${b}"`).toBeLessThanOrEqual(Math.max(a.length, b.length));
        expect(minDistance(b, a), `swapped: word1="${b}", word2="${a}"`).toBe(d);
      }
    });
  });

  describe('large inputs', () => {
    it('a 1,000-letter word against itself → 0', () => {
      const s = randomString(createRng(1), 'abcdefghij', 1000, 1000);
      expect(minDistance(s, s)).toBe(0);
    });

    it('two 1,000-letter words that differ only in the last letter → 1', () => {
      const base = randomString(createRng(2), 'abcdefghij', 999, 999);
      expect(minDistance(base + 'y', base + 'z')).toBe(1);
    });

    it('1,000 letters vs the same letters plus "xyz" at the end → 3', () => {
      const base = randomString(createRng(3), 'abcdefghij', 1000, 1000);
      expect(minDistance(base, base + 'xyz')).toBe(3);
    });

    it('"" vs 1,000 letters → 1000', () => {
      expect(minDistance('', 'q'.repeat(1000))).toBe(1000);
      expect(minDistance('q'.repeat(1000), '')).toBe(1000);
    });
  });

  describe('performance', () => {
    // The big test below only runs once this small trap has proven the
    // solution isn't exponential: on plain recursion it would never finish, and
    // synchronous code can't be interrupted by a test timeout.
    let notExponential = false;

    it('12 vs 13 letters with nothing in common → 13 quickly (plain recursion branches 3 ways on every mismatch)', () => {
      const word1 = 'abc'.repeat(4);
      const word2 = 'xyz'.repeat(4) + 'x';
      const { result, ms } = measure(() => minDistance(word1, word2));
      expect(result).toBe(13); // 12 replaces + 1 insert
      expect(ms, `took ${ms.toFixed(0)}ms — the same (i, j) pairs are being solved over and over`).toBeLessThan(500);
      notExponential = true;
    });

    it('two 1,000-letter words with disjoint alphabets → 1000 (10^6 table cells; skipped until the test above passes)', (ctx) => {
      if (!notExponential) ctx.skip();
      const rng = createRng(4);
      const word1 = randomString(rng, 'abcde', 1000, 1000);
      const word2 = randomString(rng, 'vwxyz', 1000, 1000);
      const { result, ms } = measure(() => minDistance(word1, word2));
      expect(result).toBe(1000); // nothing matches: replace every letter
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(m·n)`).toBeLessThan(1500);
    });

    it('1,000 letters vs the same word with every 10th letter removed → 100 (skipped until the trap above passes)', (ctx) => {
      if (!notExponential) ctx.skip();
      // word2 is a subsequence of word1 that is 100 letters shorter, so at
      // least 100 edits are needed and 100 deletions suffice.
      const word1 = randomString(createRng(5), 'abcdefghij', 1000, 1000);
      let word2 = '';
      for (let i = 0; i < word1.length; i++) if (i % 10 !== 9) word2 += word1[i];
      const { result, ms } = measure(() => minDistance(word1, word2));
      expect(result).toBe(100);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(m·n)`).toBeLessThan(1500);
    });
  });
});
