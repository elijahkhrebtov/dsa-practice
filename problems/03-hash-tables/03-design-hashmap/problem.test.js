import { describe, it, expect } from 'vitest';
import { MyHashMap } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** `count` distinct keys in [0, 10^6], deterministic and spread out. */
function distinctKeys(rng, count) {
  const keys = Array.from({ length: 1_000_001 }, (_, k) => k);
  shuffle(rng, keys);
  return keys.slice(0, count);
}

describe('Design HashMap', () => {
  describe('example from the problem', () => {
    it('put 1→1, 2→2; get 1 → 1; get 3 → -1; put 2→1; get 2 → 1; remove 2; get 2 → -1', () => {
      const m = new MyHashMap();
      m.put(1, 1);
      m.put(2, 2);
      expect(m.get(1)).toBe(1);
      expect(m.get(3)).toBe(-1);
      m.put(2, 1);
      expect(m.get(2)).toBe(1);
      m.remove(2);
      expect(m.get(2)).toBe(-1);
    });

    it('put 0→0; get 0 → 0 (a stored 0 must not be mistaken for "missing")', () => {
      const m = new MyHashMap();
      m.put(0, 0);
      expect(m.get(0)).toBe(0);
    });
  });

  describe('basic behaviour', () => {
    it('get on an empty map → -1', () => {
      const m = new MyHashMap();
      expect(m.get(0)).toBe(-1);
      expect(m.get(42)).toBe(-1);
      expect(m.get(1_000_000)).toBe(-1);
    });

    it('handles the smallest and largest keys and values (0 and 10^6)', () => {
      const m = new MyHashMap();
      m.put(0, 1_000_000);
      m.put(1_000_000, 0);
      expect(m.get(0)).toBe(1_000_000);
      expect(m.get(1_000_000)).toBe(0);
    });

    it('overwriting keeps a single entry: put 5→1, put 5→2, remove 5 → get 5 is -1', () => {
      // If put appends a second entry instead of updating, remove only deletes
      // one of them and the stale value comes back.
      const m = new MyHashMap();
      m.put(5, 1);
      m.put(5, 2);
      expect(m.get(5)).toBe(2);
      m.remove(5);
      expect(m.get(5)).toBe(-1);
    });

    it('overwriting with the same value or with 0 works', () => {
      const m = new MyHashMap();
      m.put(7, 3);
      m.put(7, 3);
      expect(m.get(7)).toBe(3);
      m.put(7, 0);
      expect(m.get(7)).toBe(0);
    });

    it('removing a key that was never inserted does nothing (and does not throw)', () => {
      const m = new MyHashMap();
      m.put(1, 10);
      expect(() => m.remove(2)).not.toThrow();
      expect(() => new MyHashMap().remove(0)).not.toThrow();
      expect(m.get(1)).toBe(10);
    });

    it('removing the same key twice is harmless', () => {
      const m = new MyHashMap();
      m.put(3, 30);
      m.remove(3);
      m.remove(3);
      expect(m.get(3)).toBe(-1);
    });

    it('a key can be inserted again after being removed', () => {
      const m = new MyHashMap();
      m.put(9, 1);
      m.remove(9);
      m.put(9, 2);
      expect(m.get(9)).toBe(2);
    });

    it('removing one key leaves the others untouched', () => {
      const m = new MyHashMap();
      for (let k = 0; k < 10; k++) m.put(k, k * 100);
      m.remove(4);
      for (let k = 0; k < 10; k++) expect(m.get(k)).toBe(k === 4 ? -1 : k * 100);
    });

    it('instances are independent of each other (no shared/static storage)', () => {
      const a = new MyHashMap();
      const b = new MyHashMap();
      a.put(1, 111);
      expect(b.get(1)).toBe(-1);
      b.put(1, 222);
      expect(a.get(1)).toBe(111);
      expect(b.get(1)).toBe(222);
    });
  });

  describe('collisions and resizing', () => {
    it('keys that are all multiples of 1024 (they collide for many power-of-two capacities) are all kept apart', () => {
      const m = new MyHashMap();
      for (let i = 0; i <= 976; i++) m.put(i * 1024, i);
      for (let i = 0; i <= 976; i++) expect(m.get(i * 1024)).toBe(i);
      expect(m.get(1023)).toBe(-1);
      expect(m.get(1025)).toBe(-1);
    });

    it('keys that are multiples of 1000 and 997 coexist, and removing from the middle of a chain keeps the rest', () => {
      const m = new MyHashMap();
      const keys = [];
      for (let i = 0; i < 500; i++) keys.push(i * 1000, i * 997 + 1);
      keys.forEach((k, idx) => m.put(k, idx));
      // Remove every third key, then check everything.
      keys.forEach((k, idx) => idx % 3 === 0 && m.remove(k));
      keys.forEach((k, idx) => expect(m.get(k)).toBe(idx % 3 === 0 ? -1 : idx));
    });

    it('keeps every entry across many resizes: insert keys 0..19,999 then read them all back', () => {
      const m = new MyHashMap();
      for (let k = 0; k < 20_000; k++) m.put(k, 20_000 - k);
      for (let k = 0; k < 20_000; k++) expect(m.get(k)).toBe(20_000 - k);
      expect(m.get(20_000)).toBe(-1);
    });

    it('removals, overwrites and lookups still work after the table has grown', () => {
      const m = new MyHashMap();
      for (let k = 0; k < 5_000; k++) m.put(k * 37, k);
      for (let k = 0; k < 5_000; k += 2) m.remove(k * 37);
      for (let k = 1; k < 5_000; k += 4) m.put(k * 37, 7); // overwrite some survivors with 7
      for (let k = 0; k < 5_000; k++) {
        const expected = k % 2 === 0 ? -1 : (k - 1) % 4 === 0 ? 7 : k;
        expect(m.get(k * 37)).toBe(expected);
      }
    });

    it('can be filled, emptied completely and filled again', () => {
      const m = new MyHashMap();
      for (let round = 0; round < 3; round++) {
        for (let k = 0; k < 3_000; k++) m.put(k * 11, k + round);
        for (let k = 0; k < 3_000; k++) expect(m.get(k * 11)).toBe(k + round);
        for (let k = 0; k < 3_000; k++) m.remove(k * 11);
        for (let k = 0; k < 3_000; k += 97) expect(m.get(k * 11)).toBe(-1);
      }
    });
  });

  describe('randomized against a Map model (seeded)', () => {
    it('matches a built-in Map over 20,000 random operations on a small key space (lots of overwrites)', () => {
      const rng = createRng(11);
      const m = new MyHashMap();
      const model = new Map();
      for (let step = 0; step < 20_000; step++) {
        const op = randomInt(rng, 0, 2);
        const key = randomInt(rng, 0, 60);
        if (op === 0) {
          const value = randomInt(rng, 0, 1_000_000);
          m.put(key, value);
          model.set(key, value);
        } else if (op === 1) {
          m.remove(key);
          model.delete(key);
        } else {
          expect(m.get(key), `get(${key}) at step ${step}`).toBe(model.get(key) ?? -1);
        }
      }
    });

    it('matches a built-in Map over 30,000 random operations on keys spread over [0, 10^6]', () => {
      const rng = createRng(12);
      const m = new MyHashMap();
      const model = new Map();
      const pool = distinctKeys(rng, 4_000);
      for (let step = 0; step < 30_000; step++) {
        const op = randomInt(rng, 0, 9);
        const key = pool[randomInt(rng, 0, pool.length - 1)];
        if (op < 5) {
          const value = randomInt(rng, 0, 1_000_000);
          m.put(key, value);
          model.set(key, value);
        } else if (op < 7) {
          m.remove(key);
          model.delete(key);
        } else {
          expect(m.get(key), `get(${key}) at step ${step}`).toBe(model.get(key) ?? -1);
        }
      }
      for (const key of pool) expect(m.get(key)).toBe(model.get(key) ?? -1);
    });
  });

  describe('rules of the exercise', () => {
    it('does not use the built-in Map or Set inside MyHashMap (build the table yourself)', () => {
      const source = MyHashMap.toString();
      const used = source.match(/\bnew\s+(Map|Set|WeakMap|WeakSet)\s*\(/);
      expect(
        used,
        `Found "${used?.[0]}" in MyHashMap. The point is to implement the hashing yourself: ` +
          'an array of buckets, a hash function, chaining and resizing.',
      ).toBeNull();
    });
  });

  describe('performance', () => {
    it('~250,000 operations on 70,000 spread-out keys stay fast (a single flat list is O(n) per call, far too slow)', () => {
      const rng = createRng(2025);
      const n = 70_000;
      const keys = distinctKeys(rng, n);
      const m = new MyHashMap();
      let checksum = 0;
      const { ms } = measure(() => {
        for (let i = 0; i < n; i++) m.put(keys[i], i);
        for (let i = 0; i < n; i++) checksum += m.get(keys[(i * 7) % n]);
        for (let i = 0; i < n; i += 2) m.remove(keys[i]);
        for (let i = 0; i < n; i++) checksum += m.get(keys[i]);
      });
      // Second phase: removed keys give -1, the others give their index.
      let expected = 0;
      for (let i = 0; i < n; i++) expected += (i * 7) % n;
      for (let i = 0; i < n; i++) expected += i % 2 === 0 ? -1 : i;
      expect(checksum).toBe(expected);
      expect(ms, `took ${ms.toFixed(0)}ms. Each call should touch only one short bucket`).toBeLessThan(500);
    });
  });
});
