/*
 * Title:      Design HashMap
 * Difficulty: Medium
 * Patterns:   Design, Hash Map
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Build your own hash map from scratch, without using any built-in hash
 * table.
 *
 * Implement the `MyHashMap` class:
 *
 *   • new MyHashMap()     creates an empty map.
 *   • put(key, value)     stores key → value. If the key is already in the
 *                         map, overwrite its value.
 *   • get(key)            returns the value stored for `key`, or -1 if the
 *                         map has no entry for that key.
 *   • remove(key)         deletes the entry for `key` if there is one.
 *                         Removing a missing key does nothing.
 *
 * Rules (the point of the exercise):
 *
 *   • Don't use `Map`, `Set`, `WeakMap`, or a plain object used as a
 *     dictionary (`obj[key] = value`). The tests reject `new Map(` and
 *     `new Set(` in your class.
 *   • Don't allocate one slot per possible key (a 1,000,001-element array).
 *     That's direct addressing, not hashing, and it breaks down as soon as
 *     the key space is large.
 *   • Instead, implement a real hash table: an array of buckets, a hash
 *     function that maps a key to a bucket index, separate chaining (each
 *     bucket holds the entries that hash to it), and resizing: when
 *     size / capacity exceeds a load factor (e.g. 0.75), double the
 *     capacity and rehash every entry.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   const m = new MyHashMap();
 *   m.put(1, 1);
 *   m.put(2, 2);
 *   m.get(1);      // 1
 *   m.get(3);      // -1   ← never inserted
 *   m.put(2, 1);   // overwrite the value for key 2
 *   m.get(2);      // 1
 *   m.remove(2);
 *   m.get(2);      // -1   ← removed
 *
 *   const z = new MyHashMap();
 *   z.put(0, 0);
 *   z.get(0);      // 0    ← a stored 0 is not the same as "missing"
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= key, value <= 10^6 (integers)
 *   • Up to 10^4 calls in normal use. The performance test makes about
 *     250,000 calls on 70,000 distinct keys.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   put, get and remove in O(1) average time. Storing everything in one
 *   flat list makes each call O(n), which the performance test will catch.
 *   A table that never grows also degrades as the chains get longer, which
 *   is why it needs to resize.
 */

// ▶ Run tests:   npm run solve design-hashmap
// ⟳ Watch mode:  npm run watch design-hashmap

/**
 * A hash map from integer keys to integer values, built on separate
 * chaining with dynamic resizing (no built-in Map/Set).
 */
export class MyHashMap {
  /**
   * Creates an empty map.
   */
  constructor() {
    // Your code here
  }

  /**
   * Inserts the pair key → value, overwriting the value if the key exists.
   *
   * @param {number} key - Integer key in [0, 10^6].
   * @param {number} value - Integer value in [0, 10^6].
   * @returns {void}
   */
  put(key, value) {
    // Your code here
  }

  /**
   * Looks up the value stored for a key.
   *
   * @param {number} key - Integer key in [0, 10^6].
   * @returns {number} The stored value, or -1 if the key is not in the map.
   */
  get(key) {
    // Your code here
  }

  /**
   * Removes the entry for a key, if present. Does nothing otherwise.
   *
   * @param {number} key - Integer key in [0, 10^6].
   * @returns {void}
   */
  remove(key) {
    // Your code here
  }
}
