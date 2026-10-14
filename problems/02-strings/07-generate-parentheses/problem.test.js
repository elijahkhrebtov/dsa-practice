import { describe, it, expect } from 'vitest';
import { generateParenthesis } from './problem.js';

/** Catalan numbers C(0)..C(10): how many well-formed strings exist for each n. */
const CATALAN = [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796];

/** True if `t` is a balanced bracket string. */
function isWellFormed(t) {
  let depth = 0;
  for (const ch of t) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else return false;
    if (depth < 0) return false;
  }
  return depth === 0;
}

/** Brute-force oracle: try all 2^(2n) bracket strings and keep the well-formed ones. */
function oracle(n) {
  const out = [];
  for (let mask = 0; mask < 1 << (2 * n); mask++) {
    let t = '';
    for (let i = 2 * n - 1; i >= 0; i--) t += mask & (1 << i) ? ')' : '(';
    if (isWellFormed(t)) out.push(t);
  }
  return out.sort();
}

/** Order-independent check: right count, all distinct, all length 2n and well-formed. */
function expectAllBalanced(n, result) {
  expect(Array.isArray(result), 'should return an array').toBe(true);
  expect(result.length, `n = ${n} has exactly ${CATALAN[n]} well-formed strings (Catalan number)`).toBe(CATALAN[n]);
  expect(new Set(result).size, 'every string must appear exactly once').toBe(result.length);
  const bad = result.find((t) => typeof t !== 'string' || t.length !== 2 * n || !isWellFormed(t));
  expect(bad, `${JSON.stringify(bad)} is not a well-formed string of ${n} pairs`).toBe(undefined);
}

describe('Generate Parentheses', () => {
  describe('examples from the problem', () => {
    it('n = 3 → ((())), (()()), (())(), ()(()), ()()() (any order)', () => {
      expect([...generateParenthesis(3)].sort()).toEqual(['((()))', '(()())', '(())()', '()(())', '()()()']);
    });

    it('n = 1 → ["()"]', () => {
      expect(generateParenthesis(1)).toEqual(['()']);
    });

    it('n = 2 → (()), ()() — ")(()" has the right counts but closes before opening', () => {
      expect([...generateParenthesis(2)].sort()).toEqual(['(())', '()()']);
    });
  });

  describe('structure of the answer', () => {
    it('every string has length 2n and only contains "(" and ")"', () => {
      for (const t of generateParenthesis(4)) expect(t).toMatch(/^[()]{8}$/);
    });

    it('never returns a string that closes an unopened bracket, like "())(()"', () => {
      const result = generateParenthesis(3);
      expect(result).not.toContain('())(()');
      expect(result).not.toContain(')()()(');
      for (const t of result) expect(isWellFormed(t), t).toBe(true);
    });

    it('never leaves brackets open at the end, like "((()()" — exactly n of each bracket', () => {
      const result = generateParenthesis(3);
      expect(result).not.toContain('((()()');
      for (const t of result) {
        expect(t.split('(').length - 1, `"${t}" should have 3 "("`).toBe(3);
        expect(t.split(')').length - 1, `"${t}" should have 3 ")"`).toBe(3);
      }
    });

    it('includes both extremes for n = 5: fully nested "((((()))))" and fully flat "()()()()()"', () => {
      const result = generateParenthesis(5);
      expect(result).toContain('((((()))))');
      expect(result).toContain('()()()()()');
    });

    it('no duplicates for n = 4 (14 distinct strings)', () => {
      const result = generateParenthesis(4);
      expect(new Set(result).size).toBe(result.length);
      expect(result).toHaveLength(14);
    });
  });

  describe('counts follow the Catalan numbers', () => {
    for (let n = 1; n <= 8; n++) {
      it(`n = ${n} → ${CATALAN[n]} strings, all distinct and well-formed`, () => {
        expectAllBalanced(n, generateParenthesis(n));
      });
    }
  });

  describe('compared with a brute-force oracle (all 2^(2n) strings, filtered)', () => {
    for (let n = 1; n <= 7; n++) {
      it(`n = ${n} matches the oracle exactly`, () => {
        expect([...generateParenthesis(n)].sort()).toEqual(oracle(n));
      });
    }
  });

  describe('largest inputs', () => {
    it('n = 9 → 4,862 well-formed strings', () => {
      expectAllBalanced(9, generateParenthesis(9));
    });

    it('n = 10 → 16,796 well-formed strings (only build prefixes that can still succeed)', () => {
      expectAllBalanced(10, generateParenthesis(10));
    });
  });
});
