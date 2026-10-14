/*
 * Title:      Two Sum
 * Difficulty: Easy
 * Patterns:   Hash Map
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of integers `nums` and an integer `target`.
 * Return the indices of the two numbers that add up to `target`.
 *
 *   • Every input has exactly one valid answer.
 *   • You may not use the same element twice (but two different elements
 *     may hold the same value).
 *   • Return the two indices in ascending order: [i, j] with i < j.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [2, 7, 11, 15], target = 9
 *     Output: [0, 1]
 *     Why:    nums[0] + nums[1] = 2 + 7 = 9
 *
 *   Example 2
 *     Input:  nums = [3, 2, 4], target = 6
 *     Output: [1, 2]
 *     Why:    2 + 4 = 6. Note that index 0 can't be paired with itself
 *             even though 3 + 3 = 6.
 *
 *   Example 3
 *     Input:  nums = [3, 3], target = 6
 *     Output: [0, 1]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 2 <= nums.length <= 10^5
 *   • -10^9 <= nums[i] <= 10^9
 *   • -10^9 <= target <= 10^9
 *   • Exactly one valid answer exists.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   The obvious O(n²) "try every pair" works, but the tests include an input
 *   of 100,000 numbers. Aim for O(n) time.
 */

// ▶ Run tests:   npm run solve two-sum
// ⟳ Watch mode:  npm run watch two-sum

/**
 * Finds the two indices whose values add up to `target`.
 *
 * @param {number[]} nums - Array of integers (not necessarily sorted).
 * @param {number} target - The sum to look for.
 * @returns {number[]} The pair of indices `[i, j]` with `i < j` and `nums[i] + nums[j] === target`.
 */
export function twoSum(nums, target) {
  // Your code here
}
