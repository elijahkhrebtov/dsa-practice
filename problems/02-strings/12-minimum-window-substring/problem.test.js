import { describe, it, expect } from 'vitest';
import { minWindow } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: for every start, grow the window until it covers `t`.
 * Returns the start indices of all shortest windows plus their length.
 * O(m² · alphabet). Only for small strings.
 */
function allMinimumWindows(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  const covers = (have) => [...need].every(([c, k]) => (have.get(c) ?? 0) >= k);
  let best = Infinity;
  let starts = [];
  for (let i = 0; i < s.length; i++) {
    const have = new Map();
    for (let j = i; j < s.length; j++) {
      have.set(s[j], (have.get(s[j]) ?? 0) + 1);
      if (covers(have)) {
        const len = j - i + 1;
        if (len < best) {
          best = len;
          starts = [i];
        } else if (len === best) {
          starts.push(i);
        }
        break;
      }
    }
  }
  return { starts, len: best };
}

function randomString(rng, alphabet, minLen, maxLen) {
  let s = '';
  const len = randomInt(rng, minLen, maxLen);
  for (let i = 0; i < len; i++) s += alphabet[randomInt(rng, 0, alphabet.length - 1)];
  return s;
}

describe('Minimum Window Substring', () => {
  describe('examples from the problem', () => {
    it('"ADOBECODEBANC", "ABC" → "BANC"', () => {
      expect(minWindow('ADOBECODEBANC', 'ABC')).toBe('BANC');
    });

    it('"a", "a" → "a"', () => {
      expect(minWindow('a', 'a')).toBe('a');
    });

    it('"a", "aa" → "" (t needs two a\'s, s has only one)', () => {
      expect(minWindow('a', 'aa')).toBe('');
    });

    it('"acbbaca", "aba" → "baca" (duplicates in t must be matched with multiplicity)', () => {
      expect(minWindow('acbbaca', 'aba')).toBe('baca');
    });
  });

  describe('edge cases', () => {
    it('t longer than s → ""', () => {
      expect(minWindow('ab', 'abc')).toBe('');
    });

    it('s equals t → the whole string', () => {
      expect(minWindow('xyz', 'xyz')).toBe('xyz');
    });

    it('s is a permutation of t → the whole string', () => {
      expect(minWindow('cba', 'abc')).toBe('cba');
    });

    it('a single-character t that occurs once: "ab", "b" → "b"', () => {
      expect(minWindow('ab', 'b')).toBe('b');
    });

    it('a character of t is missing from s entirely → ""', () => {
      expect(minWindow('abcdef', 'az')).toBe('');
    });

    it('matching is case-sensitive: "abc", "C" → ""', () => {
      expect(minWindow('abc', 'C')).toBe('');
    });

    it('the window can be at the very start: "abcxxxxxxx", "cab" → "abc"', () => {
      expect(minWindow('abcxxxxxxx', 'cab')).toBe('abc');
    });

    it('the window can be at the very end: "xxxxxxxcab", "abc" → "cab"', () => {
      expect(minWindow('xxxxxxxcab', 'abc')).toBe('cab');
    });
  });

  describe('tricky cases', () => {
    it('"xyzAbCaBcxyz", "ABC" → "AbCaB" (lowercase b and c don\'t count)', () => {
      expect(minWindow('xyzAbCaBcxyz', 'ABC')).toBe('AbCaB');
    });

    it('"bdab", "ab" → "ab" (the first valid window "bda" is not the shortest)', () => {
      expect(minWindow('bdab', 'ab')).toBe('ab');
    });

    it('"aaflslflsldkalskaaa", "aaa" → "aaa" (three a\'s needed, not one)', () => {
      expect(minWindow('aaflslflsldkalskaaa', 'aaa')).toBe('aaa');
    });

    it('"abcab", "aaa" → "" (enough distinct letters but not enough copies)', () => {
      expect(minWindow('abcab', 'aaa')).toBe('');
    });

    it('"ADOBECODEBANC", "AABC" → "ADOBECODEBA" (needing a second A changes the answer completely)', () => {
      expect(minWindow('ADOBECODEBANC', 'AABC')).toBe('ADOBECODEBA');
    });

    it('"aaaaaaaaaaaabbbbbcdd", "abcdd" → "abbbbbcdd" (shrink the left side past the surplus a\'s)', () => {
      expect(minWindow('aaaaaaaaaaaabbbbbcdd', 'abcdd')).toBe('abbbbbcdd');
    });

    it('"cabwefgewcwaefgcf", "cae" → "cwae" (the best window appears late)', () => {
      expect(minWindow('cabwefgewcwaefgcf', 'cae')).toBe('cwae');
    });

    it('extra copies inside the window are fine: "bba", "ab" → "ba"', () => {
      expect(minWindow('bba', 'ab')).toBe('ba');
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force oracle on 400 random inputs that have a unique answer (or none)', () => {
      const rng = createRng(4242);
      let checked = 0;
      let empty = 0;
      while (checked < 400) {
        const alphabet = rng() < 0.5 ? 'abcAB' : 'abcdef';
        const s = randomString(rng, alphabet, 1, 25);
        const t = randomString(rng, alphabet, 1, 5);
        const { starts, len } = allMinimumWindows(s, t);
        if (starts.length > 1) continue; // ties are excluded by the constraints
        const expected = starts.length === 0 ? '' : s.slice(starts[0], starts[0] + len);
        if (expected === '') empty++;
        expect(minWindow(s, t), `s="${s}", t="${t}"`).toBe(expected);
        checked++;
      }
      expect(empty, 'the generator should also produce "no window" cases').toBeGreaterThan(20);
    });
  });

  describe('performance', () => {
    // The bigger tests below only run once this one has passed: on an O(m²)
    // solution they could take minutes, and synchronous code can't be
    // interrupted by a test timeout.
    let linearEnough = false;

    it('"abab…ab" (50,000 chars) + "c", t = "abc" → "abc" quickly (restarting the scan at every start is O(m²))', () => {
      const s = 'ab'.repeat(25_000) + 'c';
      const { result, ms } = measure(() => minWindow(s, 'abc'));
      expect(result).toBe('abc');
      expect(ms, `took ${ms.toFixed(0)}ms — move the left edge forward instead of restarting`).toBeLessThan(500);
      linearEnough = true;
    });

    it('100,000 chars with a 1,000-char t hidden as one shuffled block (skipped until the test above passes)', (ctx) => {
      if (!linearEnough) ctx.skip();
      const rng = createRng(2025);
      // t: uppercase only. Filler: lowercase only, so it never counts toward t.
      const t = randomString(rng, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 1000, 1000);
      const block = shuffle(rng, [...t]).join('');
      // A decoy: all of t except one letter, far away from the real block.
      const decoy = shuffle(rng, [...t.slice(1)]).join('');
      const filler = (n) => randomString(rng, 'abcdefghijklm', n, n);
      const s = filler(10_000) + decoy + filler(40_000) + block + filler(100_000 - 10_000 - 999 - 40_000 - 1000);
      expect(s).toHaveLength(100_000);
      const { result, ms } = measure(() => minWindow(s, t));
      expect(result).toBe(block);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(m + n)`).toBeLessThan(1000);
    });

    it('t is 100,000 chars and s is a permutation of it → the whole of s (skipped until the first test passes)', (ctx) => {
      if (!linearEnough) ctx.skip();
      const rng = createRng(7);
      const t = randomString(rng, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 100_000, 100_000);
      const s = shuffle(rng, [...t]).join('');
      const { result, ms } = measure(() => minWindow(s, t));
      expect(result).toBe(s);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(m + n)`).toBeLessThan(1000);
    });
  });
});
