/*
 * Title:      Coin Change
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Knapsack
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array `coins` of DISTINCT positive coin denominations
 * and a target `amount`. You have an unlimited supply of every coin.
 *
 * Return the FEWEST number of coins whose values add up to exactly
 * `amount`. If no combination of coins can make that amount, return -1.
 *
 *   • amount = 0 needs zero coins, so the answer is 0.
 *   • Coins may be given in any order.
 *   • You only need the count, not which coins are used.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  coins = [1, 2, 5], amount = 11
 *     Output: 3
 *     Why:    5 + 5 + 1 = 11.
 *
 *   Example 2
 *     Input:  coins = [2], amount = 3
 *     Output: -1
 *     Why:    only even amounts can be made from 2s.
 *
 *   Example 3
 *     Input:  coins = [1], amount = 0
 *     Output: 0
 *
 *   Example 4
 *     Input:  coins = [1, 3, 4], amount = 6
 *     Output: 2
 *     Why:    3 + 3. Greedily grabbing the largest coin first gives
 *             4 + 1 + 1 = 3 coins, which is not optimal.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= coins.length <= 12
 *   • 1 <= coins[i] <= 2^31 - 1, all distinct
 *   • 0 <= amount <= 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(amount · coins.length) time and O(amount) space. Plain recursion that
 *   tries every coin at every step without remembering results is
 *   exponential — the performance test uses an amount of only 37, and that
 *   is already too much for it.
 */

// ▶ Run tests:   npm run solve coin-change
// ⟳ Watch mode:  npm run watch coin-change

/**
 * Finds the minimum number of coins that sum to `amount`.
 *
 * @param {number[]} coins - Distinct positive coin values (unlimited supply of each).
 * @param {number} amount - The target sum (non-negative).
 * @returns {number} The fewest coins needed to make exactly `amount`, or -1 if it cannot be made.
 */
export function coinChange(coins, amount) {
  // Your code here
}
