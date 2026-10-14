import { describe, it, expect } from 'vitest';
import { isValid } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Brute-force oracle: keep deleting adjacent matching pairs; valid iff nothing is left. */
function bruteIsValid(s) {
  let prev;
  while (prev !== s) {
    prev = s;
    s = s.replaceAll('()', '').replaceAll('[]', '').replaceAll('{}', '');
  }
  return s === '';
}

/** Builds a random balanced bracket string with `pairs` pairs. */
function randomBalanced(rng, pairs) {
  const opens = '([{';
  const closeOf = { '(': ')', '[': ']', '{': '}' };
  const out = [];
  const stack = [];
  let remaining = pairs;
  while (remaining > 0 || stack.length > 0) {
    const canOpen = remaining > 0;
    const canClose = stack.length > 0;
    if (canOpen && (!canClose || rng() < 0.5)) {
      const ch = opens[randomInt(rng, 0, 2)];
      out.push(ch);
      stack.push(ch);
      remaining--;
    } else {
      out.push(closeOf[stack.pop()]);
    }
  }
  return out.join('');
}

describe('Valid Parentheses', () => {
  describe('examples from the problem', () => {
    it('"()[]{}" → true (three pairs side by side)', () => {
      expect(isValid('()[]{}')).toBe(true);
    });

    it('"{[()]}" → true (fully nested)', () => {
      expect(isValid('{[()]}')).toBe(true);
    });

    it('"(]" → false (closed by a bracket of a different type)', () => {
      expect(isValid('(]')).toBe(false);
    });

    it('"([)]" → false (right counts, wrong order — pairs must not cross)', () => {
      expect(isValid('([)]')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('a single opening bracket "(" → false (never closed)', () => {
      expect(isValid('(')).toBe(false);
    });

    it('a single closing bracket "]" → false (nothing to match — don\'t pop from an empty stack blindly)', () => {
      expect(isValid(']')).toBe(false);
    });

    it('the smallest valid input of each type: "()", "[]", "{}" → true', () => {
      expect(isValid('()')).toBe(true);
      expect(isValid('[]')).toBe(true);
      expect(isValid('{}')).toBe(true);
    });

    it('any odd-length string is invalid: "([]" → false', () => {
      expect(isValid('([]')).toBe(false);
    });

    it('only opening brackets "(((" → false (the stack is not empty at the end)', () => {
      expect(isValid('(((')).toBe(false);
    });

    it('only closing brackets ")))" → false', () => {
      expect(isValid(')))')).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('")(" → false (balanced counts, but the closer comes first)', () => {
      expect(isValid(')(')).toBe(false);
    });

    it('"(()" vs "())" → both false (one extra opener, one extra closer)', () => {
      expect(isValid('(()')).toBe(false);
      expect(isValid('())')).toBe(false);
    });

    it('"(())((()))" → true (nesting resumes after the stack empties)', () => {
      expect(isValid('(())((()))')).toBe(true);
    });

    it('"((]]" → false (equal numbers of openers and closers is not enough)', () => {
      expect(isValid('((]]')).toBe(false);
    });

    it('"{[]}([{}])" → true (mixed types nested and concatenated)', () => {
      expect(isValid('{[]}([{}])')).toBe(true);
    });

    it('"[({})](]" → false (a valid prefix followed by a mismatch)', () => {
      expect(isValid('[({})](]')).toBe(false);
    });

    it('"()]" → false (a stray closer after the stack becomes empty)', () => {
      expect(isValid('()]')).toBe(false);
    });

    it('"[(])" → false (crossing pairs of different types)', () => {
      expect(isValid('[(])')).toBe(false);
    });

    it('does not just count each type separately: "{(})" → false', () => {
      expect(isValid('{(})')).toBe(false);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('random balanced strings are always valid', () => {
      const rng = createRng(101);
      for (let t = 0; t < 300; t++) {
        const s = randomBalanced(rng, randomInt(rng, 1, 30));
        expect(isValid(s), s).toBe(true);
      }
    });

    it('matches a brute-force "delete matching pairs" oracle on 2,000 random strings', () => {
      const rng = createRng(2024);
      const chars = '()[]{}';
      for (let t = 0; t < 2000; t++) {
        let s;
        if (rng() < 0.5) {
          // Fully random strings: almost always invalid.
          const n = randomInt(rng, 1, 12);
          s = Array.from({ length: n }, () => chars[randomInt(rng, 0, 5)]).join('');
        } else {
          // A balanced string with one character replaced: often subtly invalid.
          const arr = randomBalanced(rng, randomInt(rng, 1, 10)).split('');
          arr[randomInt(rng, 0, arr.length - 1)] = chars[randomInt(rng, 0, 5)];
          s = arr.join('');
        }
        expect(isValid(s), s).toBe(bruteIsValid(s));
      }
    });
  });

  describe('performance', () => {
    it('60,000 deeply nested brackets in one pass (repeatedly deleting "()" pairs is O(n²) and far too slow)', () => {
      const depth = 10_000;
      const s = '('.repeat(depth) + '['.repeat(depth) + '{'.repeat(depth) + '}'.repeat(depth) + ']'.repeat(depth) + ')'.repeat(depth);
      const { result, ms } = measure(() => isValid(s));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });

    it('a 60,000-character string that fails only at the very last character', () => {
      const s = '{[('.repeat(10_000) + ')]}'.repeat(9_999) + ')]]';
      const { result, ms } = measure(() => isValid(s));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });
  });
});
