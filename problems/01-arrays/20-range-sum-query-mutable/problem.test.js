import { describe, it, expect } from 'vitest';
import { NumArray } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Straightforward O(n) range sum over a plain array — the test oracle. */
function naiveSum(arr, left, right) {
  let s = 0;
  for (let i = left; i <= right; i++) s += arr[i];
  return s;
}

/** Checks every (left, right) pair of `obj` against the plain array `model`. */
function expectAllRanges(obj, model) {
  for (let l = 0; l < model.length; l++) {
    for (let r = l; r < model.length; r++) {
      expect(obj.sumRange(l, r), `sumRange(${l}, ${r}) of [${model}]`).toBe(naiveSum(model, l, r));
    }
  }
}

describe('Range Sum Query - Mutable', () => {
  describe('examples from the problem', () => {
    it('[1, 3, 5]: sumRange(0, 2) = 9; update(1, 2); sumRange(0, 2) = 8; sumRange(1, 1) = 2', () => {
      const a = new NumArray([1, 3, 5]);
      expect(a.sumRange(0, 2)).toBe(9);
      a.update(1, 2);
      expect(a.sumRange(0, 2)).toBe(8);
      expect(a.sumRange(1, 1)).toBe(2);
    });

    it('[-2, 0, 3, -5, 2, -1]: sumRange(2, 5) = -1; update(3, 5); sumRange(2, 5) = 9', () => {
      const b = new NumArray([-2, 0, 3, -5, 2, -1]);
      expect(b.sumRange(2, 5)).toBe(-1);
      b.update(3, 5);
      expect(b.sumRange(2, 5)).toBe(9);
    });
  });

  describe('basic behaviour', () => {
    it('a single-element array: sumRange(0, 0) follows every update', () => {
      const a = new NumArray([7]);
      expect(a.sumRange(0, 0)).toBe(7);
      a.update(0, -3);
      expect(a.sumRange(0, 0)).toBe(-3);
    });

    it('sumRange(i, i) returns exactly nums[i] for every i (both ends are inclusive)', () => {
      const nums = [4, -1, 0, 9, 2];
      const a = new NumArray(nums);
      nums.forEach((v, i) => expect(a.sumRange(i, i)).toBe(v));
    });

    it('update SETS the value: updating index 1 to 2 twice leaves it at 2, not 4', () => {
      // Fenwick-tree pitfall: the tree stores sums, so you must add the DIFFERENCE.
      const a = new NumArray([1, 3, 5]);
      a.update(1, 2);
      a.update(1, 2);
      expect(a.sumRange(1, 1)).toBe(2);
      expect(a.sumRange(0, 2)).toBe(8);
    });

    it('updating to the same value changes nothing', () => {
      const a = new NumArray([1, 2, 3]);
      a.update(2, 3);
      expect(a.sumRange(0, 2)).toBe(6);
    });

    it('the last of several updates to one index wins', () => {
      const a = new NumArray([0, 0, 0, 0]);
      a.update(2, 10);
      a.update(2, -4);
      a.update(2, 6);
      expect(a.sumRange(0, 3)).toBe(6);
    });

    it('two instances do not share state', () => {
      const a = new NumArray([1, 1, 1]);
      const b = new NumArray([2, 2, 2]);
      a.update(0, 100);
      expect(a.sumRange(0, 2)).toBe(102);
      expect(b.sumRange(0, 2)).toBe(6);
    });
  });

  describe('edge cases', () => {
    it('ranges starting at index 0 (no "prefix(left - 1)" off-by-one)', () => {
      const a = new NumArray([5, 6, 7, 8]);
      expect(a.sumRange(0, 0)).toBe(5);
      expect(a.sumRange(0, 1)).toBe(11);
      expect(a.sumRange(0, 3)).toBe(26);
    });

    it('updates at the first and last index are reflected', () => {
      const a = new NumArray([1, 2, 3, 4, 5]);
      a.update(0, 10);
      a.update(4, 50);
      expect(a.sumRange(0, 4)).toBe(10 + 2 + 3 + 4 + 50);
      expect(a.sumRange(4, 4)).toBe(50);
      expect(a.sumRange(0, 0)).toBe(10);
    });

    it('negative values and zeros: a range can sum to 0 or below', () => {
      const a = new NumArray([-100, 100, 0, -1, -100]);
      expect(a.sumRange(0, 1)).toBe(0);
      expect(a.sumRange(0, 4)).toBe(-101);
      a.update(2, -100);
      expect(a.sumRange(2, 4)).toBe(-201);
    });

    it('all elements zero, then one update', () => {
      const a = new NumArray(new Array(10).fill(0));
      expect(a.sumRange(0, 9)).toBe(0);
      a.update(6, 1);
      expect(a.sumRange(0, 5)).toBe(0);
      expect(a.sumRange(6, 9)).toBe(1);
    });
  });

  describe('tricky cases', () => {
    it('every range is correct for every size from 1 to 17 (powers of two and odd sizes alike)', () => {
      // Segment trees often break on sizes that aren't powers of two.
      const rng = createRng(20);
      for (let n = 1; n <= 17; n++) {
        const model = randomIntArray(rng, n, -100, 100);
        const a = new NumArray([...model]);
        expectAllRanges(a, model);
        for (let k = 0; k < 3; k++) {
          const i = randomInt(rng, 0, n - 1);
          const v = randomInt(rng, -100, 100);
          a.update(i, v);
          model[i] = v;
        }
        expectAllRanges(a, model);
      }
    });

    it('updating every index once, in reverse order, keeps all ranges right', () => {
      const model = [3, 1, 4, 1, 5, 9, 2, 6];
      const a = new NumArray([...model]);
      for (let i = model.length - 1; i >= 0; i--) {
        model[i] = -model[i] * 2;
        a.update(i, model[i]);
        expectAllRanges(a, model);
      }
    });
  });

  describe('randomized (seeded) against a plain array', () => {
    it('matches a brute-force model over 5,000 mixed operations on arrays of several sizes', () => {
      const rng = createRng(2020);
      for (const n of [1, 2, 3, 10, 31, 64, 100, 257]) {
        const model = randomIntArray(rng, n, -100, 100);
        const a = new NumArray([...model]);
        for (let step = 0; step < 5000 / 8; step++) {
          if (rng() < 0.5) {
            const i = randomInt(rng, 0, n - 1);
            const v = randomInt(rng, -100, 100);
            a.update(i, v);
            model[i] = v;
          } else {
            const l = randomInt(rng, 0, n - 1);
            const r = randomInt(rng, l, n - 1);
            expect(a.sumRange(l, r), `n=${n}, sumRange(${l}, ${r})`).toBe(naiveSum(model, l, r));
          }
        }
      }
    });
  });

  describe('performance', () => {
    it('100,000 mixed updates and wide range sums on 200,000 elements stay fast (an O(n) loop or prefix rebuild per call is far too slow)', () => {
      const rng = createRng(777);
      const n = 200_000;
      const nums = randomIntArray(rng, n, -100, 100);
      const ops = [];
      for (let k = 0; k < 100_000; k++) {
        if (k % 2 === 0) ops.push([0, randomInt(rng, 0, n / 10), randomInt(rng, -100, 100)]); // early indices
        else ops.push([1, randomInt(rng, 0, n / 4), randomInt(rng, (3 * n) / 4, n - 1)]); // wide ranges
      }

      const budget = 500;
      const answers = [];
      const { result: a, ms: buildMs } = measure(() => new NumArray([...nums]));
      let total = buildMs;
      let done = 0;
      while (done < ops.length && total <= budget) {
        // Run in chunks and stop as soon as the budget is gone, so a slow solution fails fast.
        const end = Math.min(done + 1000, ops.length);
        const { ms } = measure(() => {
          for (let k = done; k < end; k++) {
            const [type, x, y] = ops[k];
            if (type === 0) a.update(x, y);
            else answers.push(a.sumRange(x, y));
          }
        });
        total += ms;
        done = end;
      }
      expect(done, `the ${budget}ms budget ran out after ${done} of ${ops.length} operations — aim for O(log n) per call`).toBe(ops.length);
      expect(total, `took ${total.toFixed(0)}ms — aim for O(log n) per call`).toBeLessThan(budget);

      // Replay with a plain array and spot-check every 500th answer.
      const model = [...nums];
      let q = 0;
      for (const [type, x, y] of ops) {
        if (type === 0) model[x] = y;
        else {
          if (q % 500 === 0) expect(answers[q], `query #${q}: sumRange(${x}, ${y})`).toBe(naiveSum(model, x, y));
          q++;
        }
      }
    });
  });
});
