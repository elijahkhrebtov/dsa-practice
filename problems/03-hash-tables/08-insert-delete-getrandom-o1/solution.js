/*
 * Title:      Insert Delete GetRandom O(1)
 * Difficulty: Medium
 * Patterns:   Design, Hash Map
 *
 * Solution — Insert Delete GetRandom O(1)
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Each operation is easy with one structure, but no single structure does
 * all three in O(1):
 *
 *   • An ARRAY gives O(1) uniform sampling (pick a random index), but
 *     finding or deleting a value inside it is O(n).
 *   • A HASH MAP / SET gives O(1) membership and deletion, but has no
 *     "give me the i-th element" operation, so sampling is O(n).
 *
 * So keep both: the values packed densely in an array, plus a Map from
 * value → its index in that array. The remaining problem is deleting from
 * the middle of the array without shifting everything (splice is O(n)).
 * The trick: the order of the array doesn't matter, so move the LAST
 * element into the hole and pop the end. Only one value changes position,
 * and we update its index in the map.
 *
 * Approach
 * ────────
 *   State: values (array), indexOf (Map value → index in values).
 *
 *   insert(val):
 *     if indexOf has val → return false
 *     indexOf[val] = values.length; values.push(val); return true
 *
 *   remove(val):
 *     if indexOf lacks val → return false
 *     i = indexOf[val]; last = values.pop()
 *     if last !== val: values[i] = last; indexOf[last] = i   (fill the hole)
 *     delete indexOf[val]; return true
 *
 *   getRandom():
 *     return values[floor(Math.random() * values.length)]
 *
 * Walkthrough
 * ───────────
 *   insert 1   values [1]        indexOf {1:0}
 *   insert 2   values [1,2]      indexOf {1:0, 2:1}
 *   insert 3   values [1,2,3]    indexOf {1:0, 2:1, 3:2}
 *   remove 1   i=0, pop 3, put 3 at 0
 *              values [3,2]      indexOf {3:0, 2:1}
 *   remove 2   i=1, pop 2 (it was last, nothing to move)
 *              values [3]        indexOf {3:0}
 *   getRandom  values[floor(r * 1)] = 3
 *
 * Complexity
 * ──────────
 *   Time:  O(1) average for all three: Map operations are O(1) average, and
 *          array push/pop/index access are O(1) (push amortized).
 *   Space: O(n): each value is stored once in the array and once in the map.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Array only (includes/indexOf + splice): O(n) insert and remove.
 *   • Set only, with getRandom via [...set] or by iterating to a random
 *     position: O(n) per getRandom.
 *   • Order of updates in remove: if `val` is itself the last element, the
 *     "move last into the hole" step must not re-register it. Either skip
 *     the move when last === val (as here), or do the move first and the
 *     delete LAST.
 *   • `if (!indexOf.get(val))` is a bug: the element at index 0 looks
 *     absent. Use `has`.
 *   • Uniformity: Math.floor(Math.random() * n) gives each index exactly
 *     probability 1/n. Math.round(Math.random() * (n - 1)) gives the two
 *     end indices only half the weight of the others.
 *   • Lazy deletion (marking holes and skipping them on getRandom) breaks
 *     the O(1) guarantee as holes accumulate, unless you compact the array
 *     periodically.
 */

export class RandomizedSet {
  constructor() {
    /** @type {number[]} the elements, packed densely so we can index randomly */
    this.values = [];
    /** @type {Map<number, number>} element → its position in `values` */
    this.indexOf = new Map();
  }

  /** @param {number} val @returns {boolean} */
  insert(val) {
    if (this.indexOf.has(val)) return false; // `has`, not truthiness: index 0 is valid
    this.indexOf.set(val, this.values.length);
    this.values.push(val);
    return true;
  }

  /** @param {number} val @returns {boolean} */
  remove(val) {
    const i = this.indexOf.get(val);
    if (i === undefined) return false;

    const last = /** @type {number} */ (this.values.pop());
    if (last !== val) {
      // Fill the hole at i with the former last element and record its new position.
      this.values[i] = last;
      this.indexOf.set(last, i);
    }
    this.indexOf.delete(val);
    return true;
  }

  /** @returns {number} */
  getRandom() {
    return this.values[Math.floor(Math.random() * this.values.length)];
  }
}
