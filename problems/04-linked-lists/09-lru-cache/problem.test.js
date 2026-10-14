import { describe, it, expect } from 'vitest';
import { LRUCache } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force model: an array of [key, value] ordered from least to most
 * recently used. O(capacity) per operation, which is fine for small tests.
 */
class ModelLRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.entries = [];
  }

  get(key) {
    const i = this.entries.findIndex(([k]) => k === key);
    if (i === -1) return -1;
    const [entry] = this.entries.splice(i, 1);
    this.entries.push(entry);
    return entry[1];
  }

  put(key, value) {
    const i = this.entries.findIndex(([k]) => k === key);
    if (i !== -1) this.entries.splice(i, 1);
    else if (this.entries.length === this.capacity) this.entries.shift();
    this.entries.push([key, value]);
  }
}

describe('LRU Cache', () => {
  describe('example from the problem', () => {
    it('capacity 2: put 1, put 2, get 1 → 1, put 3 evicts 2, put 4 evicts 1', () => {
      const cache = new LRUCache(2);
      cache.put(1, 1);
      cache.put(2, 2);
      expect(cache.get(1)).toBe(1);
      cache.put(3, 3); // evicts key 2
      expect(cache.get(2)).toBe(-1);
      cache.put(4, 4); // evicts key 1
      expect(cache.get(1)).toBe(-1);
      expect(cache.get(3)).toBe(3);
      expect(cache.get(4)).toBe(4);
    });
  });

  describe('basic behaviour', () => {
    it('get on an empty cache returns -1', () => {
      const cache = new LRUCache(3);
      expect(cache.get(1)).toBe(-1);
    });

    it('stores and returns values while under capacity (nothing is evicted early)', () => {
      const cache = new LRUCache(3);
      cache.put(1, 10);
      cache.put(2, 20);
      cache.put(3, 30);
      expect(cache.get(1)).toBe(10);
      expect(cache.get(2)).toBe(20);
      expect(cache.get(3)).toBe(30);
    });

    it('value 0 is a real value: get returns 0, not -1 (watch out for falsy checks)', () => {
      const cache = new LRUCache(2);
      cache.put(5, 0);
      expect(cache.get(5)).toBe(0);
    });

    it('key 0 works like any other key', () => {
      const cache = new LRUCache(2);
      cache.put(0, 7);
      expect(cache.get(0)).toBe(7);
    });

    it('instances are independent of each other', () => {
      const a = new LRUCache(1);
      const b = new LRUCache(1);
      a.put(1, 1);
      b.put(1, 100);
      expect(a.get(1)).toBe(1);
      expect(b.get(1)).toBe(100);
    });
  });

  describe('capacity and eviction', () => {
    it('capacity 1: every new key evicts the previous one', () => {
      const cache = new LRUCache(1);
      cache.put(1, 1);
      cache.put(2, 2);
      expect(cache.get(1)).toBe(-1);
      expect(cache.get(2)).toBe(2);
      cache.put(3, 3);
      expect(cache.get(2)).toBe(-1);
      expect(cache.get(3)).toBe(3);
    });

    it('capacity 1: updating the only key does not evict it', () => {
      const cache = new LRUCache(1);
      cache.put(1, 1);
      cache.put(1, 2);
      expect(cache.get(1)).toBe(2);
    });

    it('without any gets, eviction follows insertion order (oldest first)', () => {
      const cache = new LRUCache(3);
      [1, 2, 3, 4, 5].forEach((k) => cache.put(k, k * 10));
      expect(cache.get(1)).toBe(-1);
      expect(cache.get(2)).toBe(-1);
      expect(cache.get(3)).toBe(30);
      expect(cache.get(4)).toBe(40);
      expect(cache.get(5)).toBe(50);
    });

    it('a successful get makes the key most recently used, so it survives the next eviction', () => {
      const cache = new LRUCache(3);
      cache.put(1, 1);
      cache.put(2, 2);
      cache.put(3, 3);
      cache.get(1); // order (LRU → MRU): 2, 3, 1
      cache.put(4, 4); // evicts 2
      expect(cache.get(2)).toBe(-1);
      expect(cache.get(1)).toBe(1);
      expect(cache.get(3)).toBe(3);
      expect(cache.get(4)).toBe(4);
    });

    it('a missed get changes nothing (and does not insert the key)', () => {
      const cache = new LRUCache(2);
      cache.put(1, 1);
      cache.put(2, 2);
      expect(cache.get(99)).toBe(-1);
      cache.put(3, 3); // still evicts 1 — the miss didn't touch anything
      expect(cache.get(1)).toBe(-1);
      expect(cache.get(2)).toBe(2);
      expect(cache.get(99)).toBe(-1);
    });
  });

  describe('updating existing keys', () => {
    it('put on an existing key overwrites the value without growing the cache', () => {
      const cache = new LRUCache(2);
      cache.put(1, 1);
      cache.put(2, 2);
      cache.put(1, 10); // update, not insert: nothing should be evicted
      expect(cache.get(1)).toBe(10);
      expect(cache.get(2)).toBe(2);
    });

    it('put on an existing key also makes it most recently used', () => {
      const cache = new LRUCache(2);
      cache.put(1, 1);
      cache.put(2, 2);
      cache.put(1, 10); // order: 2, 1
      cache.put(3, 3); // evicts 2, not 1
      expect(cache.get(2)).toBe(-1);
      expect(cache.get(1)).toBe(10);
      expect(cache.get(3)).toBe(3);
    });

    it('many updates of the same key count as one entry', () => {
      const cache = new LRUCache(2);
      for (let v = 0; v < 10; v++) cache.put(1, v);
      cache.put(2, 2);
      expect(cache.get(1)).toBe(9);
      expect(cache.get(2)).toBe(2);
    });

    it('an evicted key can be inserted again later as a fresh entry', () => {
      const cache = new LRUCache(2);
      cache.put(1, 1);
      cache.put(2, 2);
      cache.put(3, 3); // evicts 1
      cache.put(1, 100); // evicts 2
      expect(cache.get(1)).toBe(100);
      expect(cache.get(2)).toBe(-1);
      expect(cache.get(3)).toBe(3);
    });
  });

  describe('randomized against a simple model (seeded)', () => {
    for (const [seed, capacity, keyRange] of [
      [1, 1, 4],
      [2, 3, 8],
      [3, 10, 25],
      [4, 50, 120],
    ]) {
      it(`capacity ${capacity}, keys 0..${keyRange}: 4,000 random get/put operations match the model`, () => {
        const rng = createRng(seed);
        const cache = new LRUCache(capacity);
        const model = new ModelLRU(capacity);
        for (let step = 0; step < 4000; step++) {
          const key = randomInt(rng, 0, keyRange);
          if (rng() < 0.5) {
            const value = randomInt(rng, 0, 100_000);
            cache.put(key, value);
            model.put(key, value);
          } else {
            expect(cache.get(key), `step ${step}: get(${key})`).toBe(model.get(key));
          }
        }
      });
    }
  });

  describe('performance', () => {
    it('250,000 operations on a full 50,000-entry cache stay fast (array-based recency with indexOf/splice is O(capacity) per op — far too slow)', () => {
      const capacity = 50_000;
      const ops = 250_000;
      const valueOf = (key) => key % 100_001;
      // Every 10th operation inserts a new key (evicting the LRU entry); the others get one of
      // the 1,000 newest keys. Older keys are never touched again, so they are the ones that
      // get evicted, and every get is a hit, which makes the expected sum easy to compute.
      const keyToGet = (next, i) => next - 1 - ((i * 7919) % 1000);
      let expectedSum = 0;
      for (let i = 0, next = capacity; i < ops; i++) {
        if (i % 10 === 0) next++;
        else expectedSum += valueOf(keyToGet(next, i));
      }

      const cache = new LRUCache(capacity);
      const { result, ms } = measure(() => {
        for (let k = 0; k < capacity; k++) cache.put(k, valueOf(k));
        let next = capacity;
        let sum = 0;
        for (let i = 0; i < ops; i++) {
          if (i % 10 === 0) {
            cache.put(next, valueOf(next)); // new key → evicts the LRU entry
            next++;
          } else {
            sum += cache.get(keyToGet(next, i));
          }
        }
        return sum;
      });
      expect(result, 'sum of all get() results (every get should hit)').toBe(expectedSum);
      expect(cache.get(0), 'key 0 was evicted long ago').toBe(-1);
      expect(ms, `took ${ms.toFixed(0)}ms — get and put must be O(1)`).toBeLessThan(600);
    });
  });
});
