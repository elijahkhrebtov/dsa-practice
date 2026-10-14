/*
 * Title:      Insert Delete GetRandom O(1)
 * Difficulty: Medium
 * Patterns:   Design, Hash Map
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Design a set of integers that supports inserting, removing, and picking
 * a uniformly random element, each in O(1) average time.
 *
 * Implement the `RandomizedSet` class:
 *
 *   • new RandomizedSet()   creates an empty set.
 *   • insert(val)           adds `val` if it isn't already present.
 *                           Returns true if it was added, false if it was
 *                           already there.
 *   • remove(val)           removes `val` if present. Returns true if it
 *                           was removed, false if it wasn't in the set.
 *   • getRandom()           returns a random element of the set. Every
 *                           element currently in the set must be returned
 *                           with the SAME probability.
 *
 * `getRandom` is only called when the set holds at least one element. Use
 * `Math.random()` as your source of randomness (the tests seed it to make
 * the statistical checks reproducible).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   const s = new RandomizedSet();
 *   s.insert(1);     // true    set: {1}
 *   s.remove(2);     // false   2 isn't in the set
 *   s.insert(2);     // true    set: {1, 2}
 *   s.getRandom();   // 1 or 2, each with probability 1/2
 *   s.remove(1);     // true    set: {2}
 *   s.insert(2);     // false   already present
 *   s.getRandom();   // 2       (the only element)
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • -2^31 <= val <= 2^31 - 1
 *   • Up to 2 * 10^5 calls in total (the performance test makes ~215,000).
 *   • getRandom is never called on an empty set.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   insert, remove and getRandom all in O(1) average time.
 *   A plain array makes the membership check and removal O(n). A `Set`
 *   alone has no O(1) way to pick its i-th element, so getRandom becomes
 *   O(n). You need to combine two structures.
 */

// ▶ Run tests:   npm run solve insert-delete-getrandom-o1
// ⟳ Watch mode:  npm run watch insert-delete-getrandom-o1

/**
 * A set of integers with O(1) insert, remove and uniform random sampling.
 */
export class RandomizedSet {
  /**
   * Creates an empty set.
   */
  constructor() {
    // Your code here
  }

  /**
   * Adds a value if it is not already present.
   *
   * @param {number} val - The integer to add.
   * @returns {boolean} True if the value was added, false if it was already in the set.
   */
  insert(val) {
    // Your code here
  }

  /**
   * Removes a value if it is present.
   *
   * @param {number} val - The integer to remove.
   * @returns {boolean} True if the value was removed, false if it was not in the set.
   */
  remove(val) {
    // Your code here
  }

  /**
   * Returns a uniformly random element. Only called on a non-empty set.
   *
   * @returns {number} One of the current elements, each with equal probability.
   */
  getRandom() {
    // Your code here
  }
}
