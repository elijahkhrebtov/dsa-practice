/*
 * Title:      Product of Array Except Self
 * Difficulty: Medium
 * Patterns:   Prefix Sum
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an integer array `nums`, return a NEW array `answer` of the same
 * length where `answer[i]` is the product of every element of `nums`
 * except `nums[i]`.
 *
 *   • You may NOT use the division operator. ("Multiply everything, then
 *     divide by nums[i]" is off the table — and it breaks on zeros anyway.)
 *   • The order of `answer` matches `nums`: answer[i] belongs to index i.
 *   • Do not modify `nums`.
 *   • Zeros are allowed. With one zero, only the zero's position gets a
 *     non-zero product; with two or more zeros, every product is 0.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 2, 3, 4]
 *     Output: [24, 12, 8, 6]
 *     Why:    answer[0] = 2·3·4, answer[1] = 1·3·4, answer[2] = 1·2·4,
 *             answer[3] = 1·2·3.
 *
 *   Example 2
 *     Input:  nums = [-1, 1, 0, -3, 3]
 *     Output: [0, 0, 9, 0, 0]
 *     Why:    Every product except the one skipping the 0 includes the 0.
 *             answer[2] = (-1)·1·(-3)·3 = 9.
 *
 *   Example 3
 *     Input:  nums = [2, 3]
 *     Output: [3, 2]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 2 <= nums.length <= 10^5
 *   • -30 <= nums[i] <= 30
 *   • The product of any prefix or suffix of nums fits in a 32-bit signed
 *     integer.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time, no division. Recomputing each product from scratch is O(n²)
 *   and the tests include 40,000 numbers.
 *
 *   Follow-up: use only O(1) extra space besides the output array (the
 *   returned array doesn't count).
 */

// ▶ Run tests:   npm run solve product-of-array-except-self
// ⟳ Watch mode:  npm run watch product-of-array-except-self

/**
 * For every index, computes the product of all the other elements, without using division.
 *
 * @param {number[]} nums - Integer array (length >= 2), not modified.
 * @returns {number[]} A new array where element i is the product of all nums[j] with j !== i.
 */
export function productExceptSelf(nums) {
  // Your code here
}
