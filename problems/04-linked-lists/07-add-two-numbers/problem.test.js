import { describe, it, expect } from 'vitest';
import { addTwoNumbers } from './problem.js';
import { arrayToList, listToArray } from '../../../lib/linked-list.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Collects the node objects of a (finite) list, in order. */
function nodesOf(head) {
  const nodes = [];
  for (let node = head; node; node = node.next) {
    if (nodes.length > 1_000_000) throw new Error('list too long — does it contain a cycle?');
    nodes.push(node);
  }
  return nodes;
}

/** Adds two reversed digit arrays via the function under test; checks inputs are untouched. */
function add(a, b) {
  const l1 = arrayToList(a);
  const l2 = arrayToList(b);
  const inputNodes = new Set([...nodesOf(l1), ...nodesOf(l2)]);
  const result = addTwoNumbers(l1, l2);
  expect(listToArray(l1), 'l1 must not be modified').toEqual(a);
  expect(listToArray(l2), 'l2 must not be modified').toEqual(b);
  for (const node of nodesOf(result)) {
    expect(inputNodes.has(node), 'the result must be a new list, not reuse input nodes').toBe(false);
  }
  return listToArray(result);
}

/** "342" → [2, 4, 3] (reversed digits). */
const digitsOf = (str) => [...str].reverse().map(Number);

/** Oracle using BigInt: reversed digits → BigInt → sum → reversed digits. */
function oracle(a, b) {
  const toBig = (digits) => BigInt([...digits].reverse().join(''));
  return digitsOf((toBig(a) + toBig(b)).toString());
}

/** A random number with exactly `len` digits (no leading zero unless len === 1), as reversed digits. */
function randomDigits(rng, len) {
  const digits = Array.from({ length: len }, () => randomInt(rng, 0, 9));
  if (len > 1 && digits[len - 1] === 0) digits[len - 1] = randomInt(rng, 1, 9);
  return digits;
}

describe('Add Two Numbers', () => {
  describe('examples from the problem', () => {
    it('2 → 4 → 3 plus 5 → 6 → 4 gives 7 → 0 → 8 (342 + 465 = 807)', () => {
      expect(add([2, 4, 3], [5, 6, 4])).toEqual([7, 0, 8]);
    });

    it('0 plus 0 gives 0 (a single 0 node, not an empty list)', () => {
      expect(add([0], [0])).toEqual([0]);
    });

    it('9999999 + 9999 = 10009998 (the final carry creates an extra node)', () => {
      expect(add([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9])).toEqual([8, 9, 9, 9, 0, 0, 0, 1]);
    });
  });

  describe('edge cases', () => {
    it('single digits without a carry: 1 + 2 = 3', () => {
      expect(add([1], [2])).toEqual([3]);
    });

    it('single digits with a carry: 5 + 5 = 10 → 0 → 1', () => {
      expect(add([5], [5])).toEqual([0, 1]);
    });

    it('adding zero leaves the other number unchanged: 0 + 321 = 321', () => {
      expect(add([0], [1, 2, 3])).toEqual([1, 2, 3]);
      expect(add([1, 2, 3], [0])).toEqual([1, 2, 3]);
    });

    it('9 + 1 = 10: the carry outlives both lists', () => {
      expect(add([9], [1])).toEqual([0, 1]);
    });
  });

  describe('tricky cases', () => {
    it('lists of different lengths: 1 + 99 = 100 (keep going after the shorter list ends)', () => {
      expect(add([1], [9, 9])).toEqual([0, 0, 1]);
    });

    it('the longer list can be either argument: 99 + 1 = 100', () => {
      expect(add([9, 9], [1])).toEqual([0, 0, 1]);
    });

    it('a carry ripples through 50 nines: (10^50 - 1) + 1 = 10^50', () => {
      const nines = new Array(50).fill(9);
      expect(add(nines, [1])).toEqual([...new Array(50).fill(0), 1]);
    });

    it('no trailing zero node when there is no final carry: 18 + 1 = 19', () => {
      expect(add([8, 1], [1])).toEqual([9, 1]);
    });

    it('120-digit numbers: converting to Number loses precision (2^53 limit), so add digit by digit', () => {
      const a = '9'.repeat(60) + '1'.repeat(60);
      const b = '8'.repeat(120);
      const expected = digitsOf((BigInt(a) + BigInt(b)).toString());
      expect(add(digitsOf(a), digitsOf(b))).toEqual(expected);
      // Sanity: the Number shortcut really is wrong here.
      expect(digitsOf(String(Number(a) + Number(b)))).not.toEqual(expected);
    });

    it('returns a brand-new list and leaves both inputs unchanged (checked in every test)', () => {
      const l1 = arrayToList([9, 9]);
      const l2 = arrayToList([1]);
      const result = addTwoNumbers(l1, l2);
      expect(listToArray(result)).toEqual([0, 0, 1]);
      expect(listToArray(l1)).toEqual([9, 9]);
      expect(listToArray(l2)).toEqual([1]);
      expect(result).not.toBe(l1);
      expect(result).not.toBe(l2);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches BigInt addition for 300 random pairs of up to 40 digits', () => {
      const rng = createRng(1729);
      for (let t = 0; t < 300; t++) {
        const a = randomDigits(rng, randomInt(rng, 1, 40));
        const b = randomDigits(rng, randomInt(rng, 1, 40));
        expect(add(a, b), `${[...a].reverse().join('')} + ${[...b].reverse().join('')}`).toEqual(oracle(a, b));
      }
    });
  });

  describe('performance & stack depth', () => {
    it('adds two 100,000-digit numbers quickly (way beyond Number; recursion would overflow the stack)', () => {
      const n = 100_000;
      // 999…9 (n digits) + 1 followed by n-1 zeros: every position produces a carry.
      const a = new Array(n).fill(9);
      const b = [1, ...new Array(n - 1).fill(0)];
      const l1 = arrayToList(a);
      const l2 = arrayToList(b);
      const { result, ms } = measure(() => addTwoNumbers(l1, l2));
      const digits = listToArray(result);
      expect(digits).toHaveLength(n + 1);
      expect(digits[n]).toBe(1);
      expect(digits.slice(0, n).every((d) => d === 0)).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — one linear pass should take a few ms`).toBeLessThan(500);
    });
  });
});
