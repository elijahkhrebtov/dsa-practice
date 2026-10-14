/*
 * Title:      LRU Cache
 * Difficulty: Medium
 * Patterns:   Design, Hash Map, Doubly Linked List
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Design a fixed-size key → value cache with a Least Recently Used (LRU)
 * eviction policy: when the cache is full and a new key must be added, the
 * entry that was USED longest ago is thrown out.
 *
 * Implement the `LRUCache` class:
 *
 *   • new LRUCache(capacity)  creates an empty cache that holds at most
 *                             `capacity` entries (capacity >= 1).
 *   • get(key)                returns the value stored for `key`, or -1 if
 *                             the key isn't in the cache. A successful get
 *                             counts as a USE of that key.
 *   • put(key, value)         stores `value` under `key`:
 *                               – if the key already exists, overwrite its
 *                                 value (the size doesn't change);
 *                               – otherwise insert it, first evicting the
 *                                 least recently used entry if the cache is
 *                                 already at capacity.
 *                             Either way, put counts as a USE of `key`.
 *
 * "Used" means touched by a successful `get` or by any `put`. A `get` for a
 * missing key changes nothing.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   const cache = new LRUCache(2);
 *   cache.put(1, 1);   // cache: {1=1}
 *   cache.put(2, 2);   // cache: {1=1, 2=2}
 *   cache.get(1);      // 1        (1 is now the most recently used)
 *   cache.put(3, 3);   // full → evicts key 2, the least recently used
 *                      // cache: {1=1, 3=3}
 *   cache.get(2);      // -1       (evicted)
 *   cache.put(4, 4);   // full → evicts key 1   cache: {3=3, 4=4}
 *   cache.get(1);      // -1
 *   cache.get(3);      // 3
 *   cache.get(4);      // 4
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= capacity <= 10^5
 *   • 0 <= key <= 10^6, keys are integers
 *   • 0 <= value <= 10^5 (so -1 can never be a real value)
 *   • Up to 2.5 * 10^5 calls to get and put in total.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Both get and put in O(1) time (average). The performance test runs
 *   250,000 operations on a cache of 50,000 entries, so keeping the
 *   recency order in an array (indexOf/splice per operation, O(capacity))
 *   is far too slow.
 *
 *   JavaScript's `Map` remembers insertion order, which allows a short
 *   shortcut. Try the classic structure first: a hash map whose values are
 *   nodes of a doubly linked list ordered by recency. It works in any
 *   language, and interviewers usually expect it.
 */

// ▶ Run tests:   npm run solve lru-cache
// ⟳ Watch mode:  npm run watch lru-cache

/**
 * A fixed-capacity key-value cache that evicts the least recently used entry.
 */
export class LRUCache {
  /**
   * Creates an empty cache.
   *
   * @param {number} capacity - Maximum number of entries the cache may hold (>= 1).
   */
  constructor(capacity) {
    // Your code here
  }

  /**
   * Looks up a key and marks it as most recently used if present.
   *
   * @param {number} key - The key to look up.
   * @returns {number} The stored value, or -1 if the key is not in the cache.
   */
  get(key) {
    // Your code here
  }

  /**
   * Inserts or updates a key, marking it as most recently used. If inserting
   * a new key into a full cache, evicts the least recently used entry first.
   *
   * @param {number} key - The key to store.
   * @param {number} value - The value to store under `key`.
   * @returns {void}
   */
  put(key, value) {
    // Your code here
  }
}
