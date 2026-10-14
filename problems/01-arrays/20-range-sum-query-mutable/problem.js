/*
 * Title:      Range Sum Query - Mutable
 * Difficulty: Medium
 * Patterns:   Segment Tree, Design
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Design a structure over an integer array that supports two operations,
 * interleaved in any order:
 *
 *   • update — overwrite one element with a new value;
 *   • range sum — return the sum of a contiguous slice.
 *
 * Implement the `NumArray` class:
 *
 *   • new NumArray(nums)       builds the structure from the array `nums`.
 *   • update(index, val)       SETS nums[index] = val (it does not add `val`).
 *   • sumRange(left, right)    returns nums[left] + nums[left + 1] + … +
 *                              nums[right] — both ends inclusive — using
 *                              the current values.
 *
 * All indices are valid: 0 <= index < n and 0 <= left <= right < n.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   const a = new NumArray([1, 3, 5]);
 *   a.sumRange(0, 2);   // 9    (1 + 3 + 5)
 *   a.update(1, 2);     // array is now [1, 2, 5]
 *   a.sumRange(0, 2);   // 8
 *   a.sumRange(1, 1);   // 2    (a single element)
 *
 *   const b = new NumArray([-2, 0, 3, -5, 2, -1]);
 *   b.sumRange(2, 5);   // -1   (3 - 5 + 2 - 1)
 *   b.update(3, 5);     // [-2, 0, 3, 5, 2, -1]
 *   b.sumRange(2, 5);   // 9
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 3 * 10^4 (the performance test uses 2 * 10^5)
 *   • -100 <= nums[i], val <= 100
 *   • Up to 3 * 10^4 calls to update and sumRange (the performance test
 *     makes 100,000).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(log n) for both update and sumRange (O(n) or O(n log n) to build).
 *   Two easy approaches each make ONE of the operations O(n): looping over
 *   the slice in sumRange, or keeping a prefix-sum array that must be
 *   rebuilt on every update. Both are too slow for the performance test.
 */

// ▶ Run tests:   npm run solve range-sum-query-mutable
// ⟳ Watch mode:  npm run watch range-sum-query-mutable

/**
 * An integer array that supports point updates and inclusive range-sum queries.
 */
export class NumArray {
  /**
   * Builds the structure from the initial values.
   *
   * @param {number[]} nums - Initial values (length >= 1).
   */
  constructor(nums) {
    // Your code here
  }

  /**
   * Overwrites the element at `index` with `val`.
   *
   * @param {number} index - Position to change (0-based).
   * @param {number} val - The new value for that position.
   * @returns {void}
   */
  update(index, val) {
    // Your code here
  }

  /**
   * Returns the sum of the elements from `left` to `right`, both inclusive.
   *
   * @param {number} left - First index of the range (0-based).
   * @param {number} right - Last index of the range, `left <= right`.
   * @returns {number} The sum of nums[left..right] with all updates applied.
   */
  sumRange(left, right) {
    // Your code here
  }
}
