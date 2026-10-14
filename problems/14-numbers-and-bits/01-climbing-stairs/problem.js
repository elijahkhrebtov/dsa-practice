/*
 * Title:      Climbing Stairs
 * Difficulty: Easy
 * Patterns:   Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A staircase has `n` steps. You start at the bottom (step 0) and want to
 * stand on the top (step n). Each move climbs either 1 step or 2 steps.
 *
 * Return the number of distinct ways to reach the top. Two ways are
 * different if their sequences of moves differ: 1 + 2 and 2 + 1 count
 * as two separate ways.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  n = 2
 *     Output: 2
 *     Why:    1 + 1, or 2.
 *
 *   Example 2
 *     Input:  n = 3
 *     Output: 3
 *     Why:    1 + 1 + 1, 1 + 2, 2 + 1.
 *
 *   Example 3
 *     Input:  n = 5
 *     Output: 8
 *     Why:    Your last move lands on step 5 from either step 4 or step 3,
 *             so ways(5) = ways(4) + ways(3) = 5 + 3.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= n <= 45
 *   • The answer for n = 45 is 1,836,311,903, which fits comfortably in a
 *     JavaScript number (no BigInt needed).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. O(1) extra space is easy to reach once you see which earlier
 *   values you actually need.
 *
 *   The recurrence is easy to spot, and coding it as plain recursion is
 *   correct, but that version takes exponential time: for n = 45 it makes
 *   billions of calls. The tests time n = 45.
 */

// ▶ Run tests:   npm run solve climbing-stairs
// ⟳ Watch mode:  npm run watch climbing-stairs

/**
 * Counts the distinct ways to climb `n` steps taking 1 or 2 steps at a time.
 *
 * @param {number} n - Number of steps (1 ≤ n ≤ 45).
 * @returns {number} How many different move sequences reach exactly step n.
 */
export function climbStairs(n) {
  // Your code here
}
