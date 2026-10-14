/*
 * Title:      Perfect Squares
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Graph BFS, Math
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given a positive integer `n`, return the **smallest number of perfect
 * squares** that add up to exactly n.
 *
 * A perfect square is the square of a positive integer: 1, 4, 9, 16, 25, …
 * The same square may be used any number of times. Only the count is
 * returned, not the squares themselves.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  n = 12
 *     Output: 3
 *     Why:    12 = 4 + 4 + 4. Grabbing the largest square first gives
 *             9 + 1 + 1 + 1, which is 4 squares: greedy is wrong.
 *
 *   Example 2
 *     Input:  n = 13
 *     Output: 2
 *     Why:    13 = 4 + 9.
 *
 *   Example 3
 *     Input:  n = 1
 *     Output: 1
 *     Why:    1 = 1² is already a perfect square.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= n <= 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n√n) time and O(n) space (dynamic programming or BFS). A per-call
 *   solution for n = 10^4 should take a few milliseconds.
 *
 *   Trying every square recursively without remembering results is
 *   exponential: it already takes seconds around n ≈ 55. The tests time a
 *   sweep over n = 1 … 300 first and skip the larger inputs if that sweep
 *   is too slow, so an exponential solution fails quickly instead of hanging.
 *
 *   Follow-up (math): there is an O(√n) solution based on a classic theorem
 *   about sums of four squares. Try it after the DP.
 */

// ▶ Run tests:   npm run solve perfect-squares
// ⟳ Watch mode:  npm run watch perfect-squares

/**
 * Finds the least number of perfect squares that sum to `n`.
 *
 * @param {number} n - A positive integer (1 ≤ n ≤ 10^4).
 * @returns {number} The minimum count of perfect squares (1, 4, 9, …) whose sum is n.
 */
export function numSquares(n) {
  // Your code here
}
