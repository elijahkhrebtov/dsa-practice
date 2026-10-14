import { describe, it, expect } from 'vitest';
import { sortColors } from './problem.js';
import { createRng, randomInt, randomIntArray, measure, withoutBuiltinSort } from '../../../lib/test-utils.js';

/** Expected result: the counts of 0s, 1s and 2s laid out in order. */
function expectedSorted(nums) {
  const counts = [0, 0, 0];
  for (const x of nums) counts[x]++;
  return [...Array(counts[0]).fill(0), ...Array(counts[1]).fill(1), ...Array(counts[2]).fill(2)];
}

/**
 * Sorts a copy in place with the built-in sort disabled and returns the
 * mutated copy (the function's own return value is ignored).
 */
function sortInPlace(input) {
  const nums = [...input];
  withoutBuiltinSort(() => sortColors(nums));
  return nums;
}

describe('Sort Colors', () => {
  describe('examples from the problem', () => {
    it('[2, 0, 2, 1, 1, 0] → [0, 0, 1, 1, 2, 2]', () => {
      expect(sortInPlace([2, 0, 2, 1, 1, 0])).toEqual([0, 0, 1, 1, 2, 2]);
    });

    it('[2, 0, 1] → [0, 1, 2]', () => {
      expect(sortInPlace([2, 0, 1])).toEqual([0, 1, 2]);
    });

    it('[1, 1] → [1, 1] (colors can be missing)', () => {
      expect(sortInPlace([1, 1])).toEqual([1, 1]);
    });
  });

  describe('in-place contract', () => {
    it('mutates the very array it was given (the return value is ignored)', () => {
      const nums = [2, 1, 0];
      const ref = nums;
      withoutBuiltinSort(() => sortColors(nums));
      expect(nums).toBe(ref);
      expect(nums).toEqual([0, 1, 2]);
      expect(nums).toHaveLength(3);
    });

    it('does not use the built-in sort (it throws inside these tests)', () => {
      expect(() => sortInPlace([2, 2, 1, 0, 1, 0, 2])).not.toThrow();
      expect(sortInPlace([2, 2, 1, 0, 1, 0, 2])).toEqual([0, 0, 1, 1, 2, 2, 2]);
    });
  });

  describe('edge cases', () => {
    it('a single element stays as it is: [2] → [2], [0] → [0]', () => {
      expect(sortInPlace([2])).toEqual([2]);
      expect(sortInPlace([0])).toEqual([0]);
    });

    it('two elements out of order: [2, 0] → [0, 2], [1, 0] → [0, 1], [2, 1] → [1, 2]', () => {
      expect(sortInPlace([2, 0])).toEqual([0, 2]);
      expect(sortInPlace([1, 0])).toEqual([0, 1]);
      expect(sortInPlace([2, 1])).toEqual([1, 2]);
    });

    it('reverse order: [2, 2, 1, 1, 0, 0] → [0, 0, 1, 1, 2, 2]', () => {
      expect(sortInPlace([2, 2, 1, 1, 0, 0])).toEqual([0, 0, 1, 1, 2, 2]);
    });

    it('only 2s and 0s: [2, 0, 2, 0, 2] → [0, 0, 2, 2, 2]', () => {
      expect(sortInPlace([2, 0, 2, 0, 2])).toEqual([0, 0, 2, 2, 2]);
    });

    it('only 1s and 2s: [2, 1, 2, 1] → [1, 1, 2, 2]', () => {
      expect(sortInPlace([2, 1, 2, 1])).toEqual([1, 1, 2, 2]);
    });

    it('only 0s and 1s: [1, 0, 1, 0, 0] → [0, 0, 0, 1, 1]', () => {
      expect(sortInPlace([1, 0, 1, 0, 0])).toEqual([0, 0, 0, 1, 1]);
    });
  });

  describe('tricky cases', () => {
    it('a 0 swapped in from the right must be re-examined: [1, 2, 0] → [0, 1, 2]', () => {
      // When you swap a 2 to the back, the element you get in exchange hasn't been looked at yet.
      expect(sortInPlace([1, 2, 0])).toEqual([0, 1, 2]);
    });

    it('2s at the front, 0s at the back: [2, 2, 2, 0, 0, 0] → [0, 0, 0, 2, 2, 2]', () => {
      expect(sortInPlace([2, 2, 2, 0, 0, 0])).toEqual([0, 0, 0, 2, 2, 2]);
    });

    it('swapping a 2 with another 2: [2, 1, 2] → [1, 2, 2] (don\'t advance past an unexamined element)', () => {
      expect(sortInPlace([2, 1, 2])).toEqual([1, 2, 2]);
    });

    it('alternating pattern: [0, 2, 1, 0, 2, 1, 0, 2, 1] → three 0s, three 1s, three 2s', () => {
      expect(sortInPlace([0, 2, 1, 0, 2, 1, 0, 2, 1])).toEqual([0, 0, 0, 1, 1, 1, 2, 2, 2]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('sorts 300 random arrays correctly (keeping exactly the same counts of each color)', () => {
      const rng = createRng(5);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 50);
        const nums = randomIntArray(rng, n, 0, 2);
        expect(sortInPlace(nums), `nums = [${nums}]`).toEqual(expectedSorted(nums));
      }
    });
  });

  describe('performance', () => {
    it('150,000 elements in linear time (an O(n²) insertion or bubble sort is far too slow)', () => {
      const rng = createRng(77);
      const input = randomIntArray(rng, 150_000, 0, 2);
      const nums = [...input];
      const { ms } = measure(() => withoutBuiltinSort(() => sortColors(nums)));
      expect(nums).toEqual(expectedSorted(input));
      expect(ms, `took ${ms.toFixed(0)}ms — think one pass with pointers`).toBeLessThan(500);
    });
  });
});
