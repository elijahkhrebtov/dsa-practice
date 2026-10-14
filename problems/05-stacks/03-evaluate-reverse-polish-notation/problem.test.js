import { describe, it, expect } from 'vitest';
import { evalRPN } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** -0 and 0 are treated as the same answer (the problem accepts -0 as 0). */
const noNegZero = (x) => (Object.is(x, -0) ? 0 : x);
const ev = (tokens) => noNegZero(evalRPN(tokens));

const INT_MAX = 2 ** 31 - 1;
const INT_MIN = -(2 ** 31);
const apply = (op, a, b) => {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  return Math.trunc(a / b);
};

/**
 * Builds a random expression TREE and returns both its postfix tokens and its
 * value (computed recursively from the tree, not by parsing the tokens).
 * Operators are swapped out when they would divide by zero or overflow 32 bits.
 */
function randomExpression(rng, depth) {
  if (depth === 0 || rng() < 0.25) {
    const v = randomInt(rng, -200, 200);
    return { tokens: [String(v)], value: v };
  }
  const left = randomExpression(rng, depth - 1);
  const right = randomExpression(rng, depth - 1);
  const first = '+-*/'[randomInt(rng, 0, 3)];
  for (const op of [first, '-', '+', '/']) {
    if (op === '/' && right.value === 0) continue;
    const value = apply(op, left.value, right.value);
    if (value < INT_MIN || value > INT_MAX) continue;
    return { tokens: [...left.tokens, ...right.tokens, op], value };
  }
  throw new Error('unreachable: "-" with right = 0, or "/" with right ≠ 0, always fits');
}

describe('Evaluate Reverse Polish Notation', () => {
  describe('examples from the problem', () => {
    it('["2","1","+","3","*"] → 9, i.e. (2 + 1) * 3', () => {
      expect(ev(['2', '1', '+', '3', '*'])).toBe(9);
    });

    it('["4","13","5","/","+"] → 6, i.e. 4 + (13 / 5) with 2.6 truncated to 2', () => {
      expect(ev(['4', '13', '5', '/', '+'])).toBe(6);
    });

    it('the long example with a negative operand → 22', () => {
      expect(ev(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'])).toBe(22);
    });
  });

  describe('edge cases', () => {
    it('a single number is its own value: ["42"] → 42', () => {
      expect(ev(['42'])).toBe(42);
    });

    it('a single negative number: ["-7"] → -7 (returns a number, not the string)', () => {
      expect(ev(['-7'])).toBe(-7);
    });

    it('a single zero: ["0"] → 0', () => {
      expect(ev(['0'])).toBe(0);
    });

    it('leaves the input array unchanged', () => {
      const tokens = ['3', '4', '+', '2', '*'];
      const copy = [...tokens];
      expect(ev(tokens)).toBe(14);
      expect(tokens).toEqual(copy);
    });
  });

  describe('operand order (the earlier operand is the left-hand side)', () => {
    it('["5","2","-"] → 3 and ["2","5","-"] → -3', () => {
      expect(ev(['5', '2', '-'])).toBe(3);
      expect(ev(['2', '5', '-'])).toBe(-3);
    });

    it('["6","3","/"] → 2 and ["3","6","/"] → 0 (popping in the wrong order swaps them)', () => {
      expect(ev(['6', '3', '/'])).toBe(2);
      expect(ev(['3', '6', '/'])).toBe(0);
    });

    it('nested subtraction: ["10","3","2","-","-"] → 9, i.e. 10 - (3 - 2)', () => {
      expect(ev(['10', '3', '2', '-', '-'])).toBe(9);
    });
  });

  describe('division truncates toward zero', () => {
    it('7 / 2 → 3', () => {
      expect(ev(['7', '2', '/'])).toBe(3);
    });

    it('-7 / 2 → -3 (Math.floor would give -4 — wrong for negatives)', () => {
      expect(ev(['-7', '2', '/'])).toBe(-3);
    });

    it('7 / -2 → -3 and -7 / -2 → 3', () => {
      expect(ev(['7', '-2', '/'])).toBe(-3);
      expect(ev(['-7', '-2', '/'])).toBe(3);
    });

    it('-1 / 2 → 0 (truncation can produce -0, which is accepted as 0)', () => {
      expect(ev(['-1', '2', '/'])).toBe(0);
    });

    it('exact division stays exact: -200 / 8 → -25', () => {
      expect(ev(['-200', '8', '/'])).toBe(-25);
    });

    it('the result of a division is an integer that feeds later operations: ["7","2","/","2","*"] → 6, not 7', () => {
      expect(ev(['7', '2', '/', '2', '*'])).toBe(6);
    });
  });

  describe('tricky cases', () => {
    it('"-4" is a number, "-" is an operator: ["3","-4","-"] → 7', () => {
      expect(ev(['3', '-4', '-'])).toBe(7);
    });

    it('two negative operands: ["-11","-3","*"] → 33', () => {
      expect(ev(['-11', '-3', '*'])).toBe(33);
    });

    it('all operators bunched at the end: ["1","2","3","4","+","+","+"] → 10', () => {
      expect(ev(['1', '2', '3', '4', '+', '+', '+'])).toBe(10);
    });

    it('multi-digit operands are parsed as whole numbers: ["200","-200","+"] → 0', () => {
      expect(ev(['200', '-200', '+'])).toBe(0);
    });

    it('large intermediate values near the 32-bit limit: 200^4 → 1,600,000,000', () => {
      expect(ev(['200', '200', '*', '200', '*', '200', '*'])).toBe(1_600_000_000);
    });

    it('a large value divided by a negative product: 200^4 / (-200 * 200) → -40,000', () => {
      expect(ev(['200', '200', '*', '200', '*', '200', '*', '-200', '200', '*', '/'])).toBe(-40_000);
    });

    it('operands are numbers, not strings: ["1","2","+"] → 3, not "12"', () => {
      expect(ev(['1', '2', '+'])).toBe(3);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches the value of 500 random expression trees', () => {
      const rng = createRng(99);
      for (let t = 0; t < 500; t++) {
        const { tokens, value } = randomExpression(rng, randomInt(rng, 1, 7));
        expect(ev(tokens), tokens.join(' ')).toBe(noNegZero(value));
      }
    });
  });

  describe('performance', () => {
    it('60,001 tokens with every operator at the end (re-scanning the token list for the next operator is O(n²))', () => {
      const n = 30_000;
      const tokens = [...Array(n + 1).fill('1'), ...Array(n).fill('+')];
      const { result, ms } = measure(() => evalRPN(tokens));
      expect(result).toBe(n + 1);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n) with a stack`).toBeLessThan(500);
    });

    it('60,001 alternating tokens "1 2 - 3 + 4 - …" stay fast', () => {
      const tokens = ['0'];
      let expected = 0;
      for (let i = 1; i <= 30_000; i++) {
        const v = (i % 200) + 1;
        const op = i % 2 === 0 ? '+' : '-';
        tokens.push(String(v), op);
        expected = op === '+' ? expected + v : expected - v;
      }
      const { result, ms } = measure(() => ev(tokens));
      expect(result).toBe(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n) with a stack`).toBeLessThan(500);
    });
  });
});
