/*
 * Title:      Single Number
 * Difficulty: Easy
 * Patterns:   Bit Manipulation
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given a non-empty array of integers `nums`. Every value appears
 * exactly twice, except for one value that appears exactly once.
 *
 * Return the value that appears once.
 *
 *   • The two copies of a paired value can be anywhere in the array; they
 *     are not necessarily next to each other.
 *   • Do not rely on the array being sorted. You may leave `nums` unchanged
 *     (the tests check that you do not reorder it).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [2, 2, 1]
 *     Output: 1
 *
 *   Example 2
 *     Input:  nums = [4, 1, 2, 1, 2]
 *     Output: 4
 *     Why:    1 and 2 each appear twice; 4 appears once.
 *
 *   Example 3
 *     Input:  nums = [1]
 *     Output: 1
 *
 *   Example 4
 *     Input:  nums = [-3, 7, 7]
 *     Output: -3
 *     Why:    Negative numbers are allowed and can be the answer.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 2 * 10^5, and nums.length is odd
 *   • -2^31 <= nums[i] <= 2^31 - 1 (every value is a 32-bit signed integer)
 *   • Exactly one value appears once; every other value appears exactly twice.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space: no Map, no Set, no sorted copy.
 *
 *   The tests can only enforce the time part (an input of 100,001 numbers
 *   where counting each value with a nested loop takes seconds). A hash map
 *   will pass the tests, but the point of the problem is to solve it with
 *   constant extra memory.
 */

// ▶ Run tests:   npm run solve single-number
// ⟳ Watch mode:  npm run watch single-number

/**
 * Finds the only value that appears once in an array where every other value appears twice.
 *
 * @param {number[]} nums - 32-bit integers; all but one value occur exactly twice.
 * @returns {number} The value that occurs exactly once.
 */
export function singleNumber(nums) {
  // Your code here
}
