/*
 * Title:      3Sum
 * Difficulty: Medium
 * Patterns:   Sorting, Two Pointers
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an integer array `nums`, return every triplet of values
 * [a, b, c] such that a + b + c === 0, where a, b and c come from three
 * DIFFERENT positions of the array.
 *
 *   • No duplicate triplets: two triplets that contain the same three
 *     values (in any order) count as the same triplet, so report it once.
 *     For example [-1, 0, 1] and [0, 1, -1] are duplicates.
 *   • A value may appear in a triplet as many times as it occurs in `nums`:
 *     [0, 0, 0] is valid only if nums contains at least three zeros.
 *   • Order doesn't matter — neither the order of the triplets in the
 *     result nor the order of the numbers inside each triplet.
 *   • Return [] if there are no such triplets (including when nums has
 *     fewer than 3 elements).
 *   • You may reorder `nums` (e.g. sort it) if that helps.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [-1, 0, 1, 2, -1, -4]
 *     Output: [[-1, -1, 2], [-1, 0, 1]]
 *     Why:    (-1) + (-1) + 2 = 0 and (-1) + 0 + 1 = 0. The second -1 gives
 *             another way to form [-1, 0, 1], but it's the same triplet of
 *             values, so it's listed once.
 *
 *   Example 2
 *     Input:  nums = [0, 1, 1]
 *     Output: []
 *
 *   Example 3
 *     Input:  nums = [0, 0, 0, 0]
 *     Output: [[0, 0, 0]]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= nums.length <= 3000
 *   • -10^5 <= nums[i] <= 10^5
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n²) time. Checking every triple of positions is O(n³), and the
 *   performance test uses 2,500 numbers (≈ 2.6·10^9 triples).
 *   O(1) extra space besides the output (sorting in place is fine).
 */

// ▶ Run tests:   npm run solve three-sum
// ⟳ Watch mode:  npm run watch three-sum

/**
 * Finds all unique triplets of values that sum to zero.
 *
 * @param {number[]} nums - Integer array (may be reordered).
 * @returns {number[][]} Every distinct triplet [a, b, c] with a + b + c === 0, in any order.
 */
export function threeSum(nums) {
  // Your code here
}
