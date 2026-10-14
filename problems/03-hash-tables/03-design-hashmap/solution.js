/*
 * Title:      Design HashMap
 * Difficulty: Medium
 * Patterns:   Design, Hash Map
 *
 * Solution — Design HashMap
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Arrays give O(1) access by index, but our keys range over a million
 * values and we only store a few of them. A hash table bridges the gap: a
 * hash function squeezes every key into a small index range [0, capacity),
 * and that index selects a BUCKET in an ordinary array.
 *
 * Different keys can land in the same bucket (a collision), so each bucket
 * holds a short list of [key, value] entries: separate chaining. As long
 * as the entries are spread evenly and the table isn't overfull, every
 * bucket holds O(1) entries on average, so put/get/remove only scan a tiny
 * list.
 *
 * "Not overfull" is the load factor α = size / capacity. When α passes a
 * threshold (0.75 here) we double the capacity and re-insert every entry.
 * Bucket indices depend on the capacity, so the entries can't just be
 * copied over. A resize costs O(n), but after doubling it can't happen again
 * until n more inserts, so the cost spreads out to O(1) amortized per put.
 *
 * Approach
 * ────────
 *   State: buckets (array of arrays of [key, value]), size, capacity.
 *
 *   hash(key): mix the bits of the key, then take it modulo the capacity.
 *     Plain `key % capacity` with a power-of-two capacity uses only the
 *     low bits, so keys like 0, 1024, 2048, … would all collide. Multiplying
 *     by a large odd constant (Knuth's multiplicative hashing) and keeping
 *     the HIGH bits spreads them out.
 *
 *   put(key, value):
 *     1. Find the bucket. If the key is already there, overwrite its value.
 *     2. Otherwise append [key, value], size++, and resize if
 *        size / capacity > 0.75.
 *
 *   get(key):    scan the bucket; return the value, or -1 if not found.
 *
 *   remove(key): scan the bucket; if found, swap the entry with the last
 *                one in the bucket and pop (order inside a bucket doesn't
 *                matter), size--.
 *
 * Walkthrough (capacity 4, hash = key % 4 for readability)
 * ───────────
 *   put(1,1)   bucket 1: [[1,1]]                size 1
 *   put(5,9)   bucket 1: [[1,1],[5,9]]          size 2   ← collision, chained
 *   put(2,2)   bucket 2: [[2,2]]                size 3   α = 0.75, OK
 *   put(6,6)   bucket 2: [[2,2],[6,6]]          size 4   α = 1 > 0.75 → resize
 *     capacity 8: 1→b1, 5→b5, 2→b2, 6→b6       (chains split up)
 *   get(5)     bucket 5 → 9
 *   remove(1)  bucket 1 → []                    size 3
 *   get(1)     bucket 1 empty → -1
 *
 * Complexity
 * ──────────
 *   Time:  O(1) average for get/remove; O(1) amortized for put (resizing
 *          is O(n) but rare). The worst case is O(n), if every key collides.
 *   Space: O(n + capacity) = O(n), since the capacity stays within a
 *          constant factor of n.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • One flat list of pairs: correct but O(n) per operation.
 *   • Fixed number of buckets (say 1000) with no resizing: fine for small
 *     inputs, but with 10^5 keys each chain holds ~100 entries. Resizing
 *     keeps chains short no matter how many keys arrive.
 *   • Direct addressing (an array of 10^6 + 1 slots): O(1) and simple, but
 *     only because the key range is tiny. It doesn't teach hashing and
 *     doesn't work for big or non-integer keys.
 *   • Open addressing (linear probing) is the other classic design: store
 *     entries directly in the array and step to the next slot on a
 *     collision. Removal then needs "tombstones", otherwise later probes stop
 *     too early.
 *   • Bugs to avoid: appending a duplicate entry on put instead of
 *     overwriting; `if (value)` checks that treat a stored 0 as missing;
 *     forgetting to re-hash (not just copy) entries when resizing; sharing
 *     storage between instances (e.g. a static field).
 */

const INITIAL_CAPACITY = 16; // a power of two
const MAX_LOAD_FACTOR = 0.75;
const KNUTH = 2654435761; // ≈ 2^32 / golden ratio, an odd multiplier that scrambles bits well

export class MyHashMap {
  constructor() {
    /** @type {number} number of buckets, always a power of two */
    this.capacity = INITIAL_CAPACITY;
    /** @type {number} log2(capacity), used by the hash */
    this.bits = Math.log2(INITIAL_CAPACITY);
    /** @type {number} number of stored entries */
    this.size = 0;
    /** @type {Array<Array<[number, number]>>} buckets of [key, value] entries */
    this.buckets = Array.from({ length: this.capacity }, () => []);
  }

  /**
   * Multiplicative hashing: multiply by an odd constant modulo 2^32 and
   * keep the top `bits` bits, which depend on ALL bits of the key.
   * @param {number} key
   * @returns {number} bucket index in [0, capacity)
   */
  hash(key) {
    return Math.imul(key, KNUTH) >>> (32 - this.bits);
  }

  /** @param {number} key @param {number} value */
  put(key, value) {
    const bucket = this.buckets[this.hash(key)];
    for (const entry of bucket) {
      if (entry[0] === key) {
        entry[1] = value; // overwrite, never store a duplicate
        return;
      }
    }
    bucket.push([key, value]);
    this.size++;
    if (this.size / this.capacity > MAX_LOAD_FACTOR) this.resize();
  }

  /** @param {number} key @returns {number} */
  get(key) {
    const bucket = this.buckets[this.hash(key)];
    for (const entry of bucket) {
      if (entry[0] === key) return entry[1];
    }
    return -1;
  }

  /** @param {number} key */
  remove(key) {
    const bucket = this.buckets[this.hash(key)];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        // Order within a bucket doesn't matter: move the last entry into
        // the hole and pop. O(1) instead of splice's O(bucket length).
        bucket[i] = bucket[bucket.length - 1];
        bucket.pop();
        this.size--;
        return;
      }
    }
  }

  /** Doubles the capacity and re-inserts every entry into its new bucket. */
  resize() {
    const old = this.buckets;
    this.capacity *= 2;
    this.bits += 1;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    for (const bucket of old) {
      for (const entry of bucket) {
        this.buckets[this.hash(entry[0])].push(entry); // index depends on the new capacity
      }
    }
  }
}
