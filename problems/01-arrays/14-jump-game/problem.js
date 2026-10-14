/*
 * Title:      Jump Game
 * Difficulty: Medium
 * Patterns:   Greedy
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You start at index 0 of an array of non-negative integers `nums`. Each
 * element is your MAXIMUM jump length from that position: standing on index
 * i, you may move to any index from i + 1 up to i + nums[i] (or stay stuck
 * if nums[i] is 0).
 *
 * Return `true` if you can reach the LAST index, and `false` otherwise.
 *
 *   • Jumping past the end is fine — reaching or passing the last index
 *     counts as reaching it.
 *   • If the array has a single element you are already at the last index.
 *   • The value at the last index never matters.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [2, 3, 1, 1, 4]
 *     Output: true
 *     Why:    jump 1 step to index 1, then 3 steps to the last index.
 *
 *   Example 2
 *     Input:  nums = [3, 2, 1, 0, 4]
 *     Output: false
 *     Why:    every route lands on index 3, whose jump length is 0.
 *
 *   Example 3
 *     Input:  nums = [0]
 *     Output: true
 *     Why:    you start on the last index.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 10^5
 *   • 0 <= nums[i] <= 10^5
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space. A DP that, for every index, marks or
 *   checks every position it can jump to is O(n²) in the worst case — the
 *   performance test uses 100,000 elements with long jumps to expose that.
 */

// ▶ Run tests:   npm run solve jump-game
// ⟳ Watch mode:  npm run watch jump-game

/**
 * Decides whether the last index is reachable from index 0.
 *
 * @param {number[]} nums - Maximum jump length at each position (non-negative).
 * @returns {boolean} `true` if the last index can be reached, otherwise `false`.
 */
export function canJump(nums) {
  // Your code here
}
