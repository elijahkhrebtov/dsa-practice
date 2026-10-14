import { describe, it, expect } from 'vitest';
import { RandomizedSet } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Temporarily replaces Math.random with a seeded generator so the
 * statistical tests are reproducible, then restores the original.
 */
function withSeededRandom(seed, fn) {
  const original = Math.random;
  Math.random = createRng(seed);
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

/** Calls getRandom `draws` times and returns a Map value → how often it came back. */
function sample(set, draws) {
  const counts = new Map();
  for (let i = 0; i < draws; i++) {
    const v = set.getRandom();
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return counts;
}

/** Asserts that the sampled values are exactly `members`, each close to draws / members.length. */
function expectUniform(counts, members, draws, tolerance = 0.2) {
  const expected = draws / members.length;
  expect([...counts.keys()].sort((a, b) => a - b), 'getRandom returned something that is not a member').toEqual(
    [...members].sort((a, b) => a - b),
  );
  for (const m of members) {
    const got = counts.get(m) ?? 0;
    expect(
      Math.abs(got - expected) <= tolerance * expected,
      `value ${m} came back ${got} times out of ${draws}, expected about ${Math.round(expected)}. Is every element equally likely?`,
    ).toBe(true);
  }
}

describe('Insert Delete GetRandom O(1)', () => {
  describe('example from the problem', () => {
    it('insert 1 → true; remove 2 → false; insert 2 → true; remove 1 → true; insert 2 → false; getRandom → 2', () => {
      const s = new RandomizedSet();
      expect(s.insert(1)).toBe(true);
      expect(s.remove(2)).toBe(false);
      expect(s.insert(2)).toBe(true);
      expect([1, 2]).toContain(s.getRandom());
      expect(s.remove(1)).toBe(true);
      expect(s.insert(2)).toBe(false);
      expect(s.getRandom()).toBe(2);
    });
  });

  describe('return values', () => {
    it('insert returns true for a new value and false for a duplicate', () => {
      const s = new RandomizedSet();
      expect(s.insert(10)).toBe(true);
      expect(s.insert(10)).toBe(false);
      expect(s.insert(11)).toBe(true);
    });

    it('remove on an empty set → false', () => {
      expect(new RandomizedSet().remove(0)).toBe(false);
    });

    it('remove returns true once, then false for the same value', () => {
      const s = new RandomizedSet();
      s.insert(4);
      expect(s.remove(4)).toBe(true);
      expect(s.remove(4)).toBe(false);
    });

    it('a value can be re-inserted after removal (insert → true again)', () => {
      const s = new RandomizedSet();
      s.insert(7);
      s.remove(7);
      expect(s.insert(7)).toBe(true);
      expect(s.getRandom()).toBe(7);
    });

    it('handles 0, negatives and the 32-bit extremes as values', () => {
      const s = new RandomizedSet();
      for (const v of [0, -1, -(2 ** 31), 2 ** 31 - 1]) expect(s.insert(v)).toBe(true);
      for (const v of [0, -1, -(2 ** 31), 2 ** 31 - 1]) expect(s.insert(v)).toBe(false);
      for (const v of [0, -1, -(2 ** 31), 2 ** 31 - 1]) expect(s.remove(v)).toBe(true);
    });

    it('instances are independent of each other', () => {
      const a = new RandomizedSet();
      const b = new RandomizedSet();
      a.insert(1);
      expect(b.insert(1)).toBe(true);
      expect(b.remove(1)).toBe(true);
      expect(a.getRandom()).toBe(1);
    });
  });

  describe('tricky cases', () => {
    it('the element stored at position 0 is still "present" (beware `if (!map.get(val))`)', () => {
      // If you store indices in a Map, the first element has index 0, which is falsy.
      const s = new RandomizedSet();
      expect(s.insert(5)).toBe(true);
      expect(s.insert(5)).toBe(false);
      expect(s.remove(5)).toBe(true);
      expect(s.remove(5)).toBe(false);
    });

    it('after removing from the middle, the element moved into the gap is still tracked correctly', () => {
      // insert 1, 2, 3; remove 1 → with swap-with-last, 3 moves to the front.
      // Its stored position must be updated, or removing 3 next goes wrong.
      const s = new RandomizedSet();
      [1, 2, 3].forEach((v) => s.insert(v));
      expect(s.remove(1)).toBe(true);
      expect(s.remove(3)).toBe(true);
      expect(s.remove(3)).toBe(false);
      expect(s.getRandom()).toBe(2);
      expect(s.insert(3)).toBe(true);
      expect(s.insert(1)).toBe(true);
      expect(s.insert(2)).toBe(false);
    });

    it('removing the LAST stored element works (swapping it with itself must not resurrect it)', () => {
      const s = new RandomizedSet();
      s.insert(1);
      s.insert(2);
      expect(s.remove(2)).toBe(true);
      expect(s.insert(2)).toBe(true); // would be false if 2 was accidentally re-registered
      expect(s.remove(2)).toBe(true);
      expect(s.getRandom()).toBe(1);
    });

    it('removing the only element, then inserting again', () => {
      const s = new RandomizedSet();
      s.insert(42);
      expect(s.remove(42)).toBe(true);
      expect(s.remove(42)).toBe(false);
      expect(s.insert(-42)).toBe(true);
      expect(s.getRandom()).toBe(-42);
    });

    it('failed inserts and removes do not change the set', () => {
      const s = new RandomizedSet();
      s.insert(1);
      s.insert(1);
      s.remove(99);
      s.remove(99);
      expect(s.getRandom()).toBe(1);
      expect(s.remove(1)).toBe(true);
      expect(s.remove(1)).toBe(false);
    });
  });

  describe('getRandom distribution (Math.random seeded for reproducibility)', () => {
    it('10 elements, 20,000 draws: every element comes back about 2,000 times (±20%)', () => {
      withSeededRandom(1, () => {
        const s = new RandomizedSet();
        const members = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        members.forEach((v) => s.insert(v));
        // Math.round(Math.random() * (n - 1)) would give the end values half the weight. This catches it.
        expectUniform(sample(s, 20_000), members, 20_000);
      });
    });

    it('still uniform over the REMAINING elements after removals from the front, middle and end', () => {
      withSeededRandom(2, () => {
        const s = new RandomizedSet();
        for (let v = 10; v <= 80; v += 10) s.insert(v);
        s.remove(10);
        s.remove(40);
        s.remove(80);
        expectUniform(sample(s, 20_000), [20, 30, 50, 60, 70], 20_000);
      });
    });

    it('two elements: each comes back about half the time', () => {
      withSeededRandom(3, () => {
        const s = new RandomizedSet();
        s.insert(-5);
        s.insert(5);
        expectUniform(sample(s, 10_000), [-5, 5], 10_000, 0.1);
      });
    });

    it('stays uniform after heavy churn (many inserts and removes)', () => {
      withSeededRandom(4, () => {
        const s = new RandomizedSet();
        for (let v = 0; v < 1000; v++) s.insert(v);
        for (let v = 0; v < 1000; v++) if (v % 100 !== 7) s.remove(v);
        // Remaining: 7, 107, 207, …, 907.
        const members = Array.from({ length: 10 }, (_, i) => i * 100 + 7);
        expectUniform(sample(s, 20_000), members, 20_000);
      });
    });
  });

  describe('randomized against a Set model (seeded)', () => {
    it('matches a built-in Set over 20,000 random operations; getRandom always returns a member', () => {
      withSeededRandom(5, () => {
        const rng = createRng(6);
        const s = new RandomizedSet();
        const model = new Set();
        for (let step = 0; step < 20_000; step++) {
          const op = randomInt(rng, 0, 2);
          const v = randomInt(rng, -30, 30);
          if (op === 0) {
            expect(s.insert(v), `insert(${v}) at step ${step}`).toBe(!model.has(v));
            model.add(v);
          } else if (op === 1) {
            expect(s.remove(v), `remove(${v}) at step ${step}`).toBe(model.has(v));
            model.delete(v);
          } else if (model.size > 0) {
            const r = s.getRandom();
            expect(model.has(r), `getRandom() returned ${r}, which is not in the set`).toBe(true);
          }
        }
      });
    });
  });

  describe('performance', () => {
    it('~215,000 operations on up to 60,000 elements stay fast (array search/splice or copying a Set on getRandom is O(n))', () => {
      withSeededRandom(7, () => {
        const s = new RandomizedSet();
        const n = 60_000;
        const rounds = 25_000;
        const { ms } = measure(() => {
          for (let i = 0; i < n; i++) s.insert(i * 7);
          let next = n;
          for (let r = 0; r < rounds; r++) {
            const x = s.getRandom();
            s.remove(x);
            s.insert(next++ * 7);
            s.insert(x);
            s.remove(x);
          }
          for (let i = 0; i < n; i += 2) s.remove(i * 7);
        });
        // Every remaining value must still be a valid member.
        const r = s.getRandom();
        expect(r % 7).toBe(0);
        expect(s.insert(r)).toBe(false);
        expect(ms, `took ${ms.toFixed(0)}ms. Every operation should be O(1)`).toBeLessThan(500);
      });
    });
  });
});
