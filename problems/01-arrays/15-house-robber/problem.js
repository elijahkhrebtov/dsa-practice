/*
 * Title:      House Robber
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A row of houses holds `nums[i]` money in house i. You want to take as much
 * money as possible, but each pair of ADJACENT houses shares an alarm:
 * robbing two neighbouring houses (i and i + 1) on the same night triggers
 * it. Houses that are further apart are fine.
 *
 * Return the maximum total amount you can rob without robbing two adjacent
 * houses.
 *
 *   • You may skip any number of houses, including several in a row.
 *   • The houses are in a straight line (the first and last are NOT
 *     neighbours unless the array has length 2).
 *   • All amounts are non-negative, so robbing nothing (total 0) is always
 *     possible.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 2, 3, 1]
 *     Output: 4
 *     Why:    rob houses 0 and 2: 1 + 3 = 4.
 *
 *   Example 2
 *     Input:  nums = [2, 7, 9, 3, 1]
 *     Output: 12
 *     Why:    rob houses 0, 2 and 4: 2 + 9 + 1 = 12.
 *
 *   Example 3
 *     Input:  nums = [2, 1, 1, 2]
 *     Output: 4
 *     Why:    rob houses 0 and 3, skipping TWO houses in between. Taking
 *             "every other house" (2 + 1 or 1 + 2) only gives 3.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 100
 *   • 0 <= nums[i] <= 400
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space. Trying every rob/skip combination
 *   recursively is exponential (about 1.6^n calls) — the performance test
 *   uses only 41 houses, and that's already far too many for it.
 */

// ▶ Run tests:   npm run solve house-robber
// ⟳ Watch mode:  npm run watch house-robber

/**
 * Computes the most money that can be robbed without robbing two adjacent houses.
 *
 * @param {number[]} nums - Amount of money in each house, in street order (non-negative).
 * @returns {number} The maximum total amount.
 */
export function rob(nums) {
  // Your code here
}
