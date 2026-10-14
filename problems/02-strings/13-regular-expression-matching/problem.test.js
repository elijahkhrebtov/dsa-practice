import { describe, it, expect } from 'vitest';
import { isMatch } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Oracle for the randomized tests: JavaScript's own regex engine, anchored
 * at both ends. Our patterns only use letters, '.' and '*', which mean the
 * same thing there. (Your solution must not do this, of course.)
 */
function oracle(s, p) {
  return new RegExp(`^(?:${p})$`).test(s);
}

/** Random valid pattern: tokens like "a", "b", ".", optionally followed by '*'. */
function randomPattern(rng, maxTokens) {
  let p = '';
  const tokens = randomInt(rng, 0, maxTokens);
  for (let i = 0; i < tokens; i++) {
    p += 'ab.'[randomInt(rng, 0, 2)];
    if (rng() < 0.45) p += '*';
  }
  return p;
}

/** A string that matches `p`, built by expanding each token at random. */
function stringMatching(rng, p) {
  let s = '';
  for (let i = 0; i < p.length; i++) {
    const star = p[i + 1] === '*';
    const reps = star ? randomInt(rng, 0, 3) : 1;
    for (let r = 0; r < reps; r++) s += p[i] === '.' ? 'ab'[randomInt(rng, 0, 1)] : p[i];
    if (star) i++;
  }
  return s;
}

describe('Regular Expression Matching', () => {
  describe('examples from the problem', () => {
    it('"aa", "a" → false (the whole string must match, not a prefix)', () => {
      expect(isMatch('aa', 'a')).toBe(false);
    });

    it('"aa", "a*" → true (star repeats the a twice)', () => {
      expect(isMatch('aa', 'a*')).toBe(true);
    });

    it('"ab", ".*" → true (".*" matches anything)', () => {
      expect(isMatch('ab', '.*')).toBe(true);
    });

    it('"aab", "c*a*b" → true ("c*" matches zero c\'s)', () => {
      expect(isMatch('aab', 'c*a*b')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('empty string, empty pattern → true', () => {
      expect(isMatch('', '')).toBe(true);
    });

    it('empty string, "a*" → true and ".*.*" → true (stars can match nothing)', () => {
      expect(isMatch('', 'a*')).toBe(true);
      expect(isMatch('', '.*.*')).toBe(true);
    });

    it('empty string, "a" → false and "." → false (a dot needs exactly one character)', () => {
      expect(isMatch('', 'a')).toBe(false);
      expect(isMatch('', '.')).toBe(false);
    });

    it('non-empty string, empty pattern → false', () => {
      expect(isMatch('a', '')).toBe(false);
    });

    it('"a", "." → true and "ab", "." → false (a dot matches one character, not more)', () => {
      expect(isMatch('a', '.')).toBe(true);
      expect(isMatch('ab', '.')).toBe(false);
    });

    it('"abc", "abc" → true and "abc", "abd" → false (plain letters)', () => {
      expect(isMatch('abc', 'abc')).toBe(true);
      expect(isMatch('abc', 'abd')).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('"mississippi", "mis*is*p*." → false', () => {
      expect(isMatch('mississippi', 'mis*is*p*.')).toBe(false);
    });

    it('"mississippi", "mis*is*ip*." → true', () => {
      expect(isMatch('mississippi', 'mis*is*ip*.')).toBe(true);
    });

    it('"abc", "b" → false (this is whole-string matching, not substring search)', () => {
      expect(isMatch('abc', 'b')).toBe(false);
    });

    it('"abc", "a*" → false ("*" repeats the previous letter; it is not a wildcard)', () => {
      expect(isMatch('abc', 'a*')).toBe(false);
    });

    it('"ab", ".*c" → false (".*" can\'t produce the required c)', () => {
      expect(isMatch('ab', '.*c')).toBe(false);
    });

    it('"aaa", "a*a" → true (the star must leave one a for the final letter — greedy fails)', () => {
      expect(isMatch('aaa', 'a*a')).toBe(true);
    });

    it('"aaa", "ab*a*c*a" → true (several optional groups in a row)', () => {
      expect(isMatch('aaa', 'ab*a*c*a')).toBe(true);
    });

    it('"a", "ab*" → true (a trailing "x*" can vanish)', () => {
      expect(isMatch('a', 'ab*')).toBe(true);
    });

    it('"bbbba", ".*a*a" → true (".*" must stop before the last a)', () => {
      expect(isMatch('bbbba', '.*a*a')).toBe(true);
    });

    it('"a", ".*..a*" → false (two dots need at least two characters)', () => {
      expect(isMatch('a', '.*..a*')).toBe(false);
    });

    it('"aaa", "aaaa" → false (one letter short)', () => {
      expect(isMatch('aaa', 'aaaa')).toBe(false);
    });

    it('"", "c*c*" → true and "ccc", "c*c*" → true', () => {
      expect(isMatch('', 'c*c*')).toBe(true);
      expect(isMatch('ccc', 'c*c*')).toBe(true);
    });

    it('"aasdfasdfasdfasdfas", "aasdf.*asdf.*asdf.*asdf.*s" → true', () => {
      expect(isMatch('aasdfasdfasdfasdfas', 'aasdf.*asdf.*asdf.*asdf.*s')).toBe(true);
    });

    it('"ab", "a.*b.*" → true and "ba", "a.*b.*" → false (order still matters)', () => {
      expect(isMatch('ab', 'a.*b.*')).toBe(true);
      expect(isMatch('ba', 'a.*b.*')).toBe(false);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('agrees with an anchored built-in regex on 600 random (string, pattern) pairs', () => {
      const rng = createRng(1337);
      let trues = 0;
      let falses = 0;
      for (let t = 0; t < 600; t++) {
        const p = randomPattern(rng, 6);
        let s;
        if (rng() < 0.5) {
          s = stringMatching(rng, p);
          // Sometimes corrupt it so it (probably) no longer matches.
          if (s.length > 0 && rng() < 0.4) {
            const i = randomInt(rng, 0, s.length - 1);
            s = s.slice(0, i) + (s[i] === 'a' ? 'b' : 'a') + s.slice(i + 1);
          }
        } else {
          s = '';
          const len = randomInt(rng, 0, 8);
          for (let i = 0; i < len; i++) s += 'ab'[randomInt(rng, 0, 1)];
        }
        const expected = oracle(s, p);
        if (expected) trues++;
        else falses++;
        expect(isMatch(s, p), `s="${s}", p="${p}"`).toBe(expected);
      }
      expect(trues).toBeGreaterThan(100);
      expect(falses).toBeGreaterThan(100);
    });
  });

  describe('performance', () => {
    // The maximum-size test at the end only runs once both traps have passed:
    // on plain backtracking it would never finish, and synchronous code can't
    // be interrupted by a test timeout.
    let trapsPassed = 0;

    it('26 a\'s + "b" vs "a*" ×9 + "c" → false quickly (backtracking tries every way to split the a\'s between the stars)', () => {
      const s = 'a'.repeat(26) + 'b';
      const p = 'a*'.repeat(9) + 'c';
      const { result, ms } = measure(() => isMatch(s, p));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms — the same (i, j) states are being revisited; memoize them`).toBeLessThan(500);
      trapsPassed++;
    });

    it('26 a\'s vs "a*" ×9 + "b" → false quickly (the b at the end of the pattern never matches)', () => {
      const s = 'a'.repeat(26);
      const p = 'a*'.repeat(9) + 'b';
      const { result, ms } = measure(() => isMatch(s, p));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms — the same (i, j) states are being revisited; memoize them`).toBeLessThan(500);
      trapsPassed++;
    });

    it('maximum size: 50 characters against 50-character ".*.*…" patterns (skipped until both traps pass)', (ctx) => {
      if (trapsPassed < 2) ctx.skip();
      const s = 'ab'.repeat(25);
      const { result: yes, ms: ms1 } = measure(() => isMatch(s, '.*'.repeat(24) + 'ab'));
      const { result: no, ms: ms2 } = measure(() => isMatch(s, '.*'.repeat(24) + 'ba'));
      expect(yes).toBe(true);
      expect(no).toBe(false);
      expect(ms1 + ms2, `took ${(ms1 + ms2).toFixed(0)}ms`).toBeLessThan(500);
    });
  });
});
