/*
 * Title:      Best Time to Buy and Sell Stock
 * Difficulty: Easy
 * Patterns:   Greedy
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array `prices` where `prices[i]` is the price of a stock
 * on day `i`.
 *
 * You may complete at most ONE transaction: pick one day to buy a single
 * share and a strictly later day to sell it. Return the largest profit you
 * can make (sell price − buy price).
 *
 *   • You must buy before you sell — buying and selling on the same day
 *     gives a profit of 0, and you cannot sell on a day before you buy.
 *   • If no transaction makes money (e.g. prices only go down, or there is
 *     only one day), return 0 — you simply don't trade.
 *   • Return only the profit, not the days.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  prices = [7, 1, 5, 3, 6, 4]
 *     Output: 5
 *     Why:    Buy on day 1 (price 1), sell on day 4 (price 6): 6 − 1 = 5.
 *             Selling at 7 isn't possible — day 0 comes before the purchase.
 *
 *   Example 2
 *     Input:  prices = [7, 6, 4, 3, 1]
 *     Output: 0
 *     Why:    Prices only fall, so the best move is not to trade at all.
 *
 *   Example 3
 *     Input:  prices = [2, 4, 1]
 *     Output: 2
 *     Why:    The global minimum (1) comes last, so it is useless as a buy
 *             day. Buying at 2 and selling at 4 is best.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= prices.length <= 10^5
 *   • 0 <= prices[i] <= 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Checking every (buy, sell) pair is O(n²) — the tests include 100,000
 *   prices, which is ~5·10^9 pairs. Aim for a single pass: O(n) time, O(1)
 *   extra space.
 */

// ▶ Run tests:   npm run solve best-time-to-buy-and-sell-stock
// ⟳ Watch mode:  npm run watch best-time-to-buy-and-sell-stock

/**
 * Computes the maximum profit from one buy followed by one later sell.
 *
 * @param {number[]} prices - Stock price on each day, in chronological order.
 * @returns {number} The best achievable profit, or 0 if no profitable trade exists.
 */
export function maxProfit(prices) {
  // Your code here
}
