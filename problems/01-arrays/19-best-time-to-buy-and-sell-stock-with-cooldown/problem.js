/*
 * Title:      Best Time to Buy and Sell Stock with Cooldown
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * `prices[i]` is the price of a stock on day `i`. Find the maximum total
 * profit you can make by trading under these rules:
 *
 *   • You may complete as many transactions (buy one share, later sell it)
 *     as you like.
 *   • You can hold at most one share at a time — you must sell before you
 *     buy again.
 *   • After you sell, you must sit out the NEXT day (a one-day cooldown):
 *     if you sell on day i, the earliest you can buy again is day i + 2.
 *   • Buying and selling on the same day is not allowed.
 *
 * Return the maximum profit. If no trade makes money, return 0 (you are
 * never forced to trade). Any share still held at the end is simply worth
 * nothing to the answer — only completed sales count.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  prices = [1, 2, 3, 0, 2]
 *     Output: 3
 *     Why:    buy (1), sell (2), cooldown (3), buy (0), sell (2)
 *             → (2 - 1) + (2 - 0) = 3.
 *
 *   Example 2
 *     Input:  prices = [1]
 *     Output: 0
 *     Why:    a single day leaves no time to sell.
 *
 *   Example 3
 *     Input:  prices = [1, 4, 2, 7]
 *     Output: 6
 *     Why:    without a cooldown you'd do (4 - 1) + (7 - 2) = 8, but after
 *             selling on day 1 you can't buy on day 2. The best is a single
 *             trade 1 → 7.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= prices.length <= 5000 (the performance test uses 30,000)
 *   • 0 <= prices[i] <= 1000
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space. An O(n²) DP ("for every sell day, try
 *   every buy day") is correct but too slow for the performance test.
 */

// ▶ Run tests:   npm run solve best-time-to-buy-and-sell-stock-with-cooldown
// ⟳ Watch mode:  npm run watch best-time-to-buy-and-sell-stock-with-cooldown

/**
 * Computes the best total profit with unlimited transactions and a one-day cooldown after each sale.
 *
 * @param {number[]} prices - Stock price on each day, in chronological order.
 * @returns {number} The maximum achievable profit (0 if no trade is profitable).
 */
export function maxProfit(prices) {
  // Your code here
}
