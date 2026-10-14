/*
 * Title:      Best Time to Buy and Sell Stock
 * Difficulty: Easy
 * Patterns:   Greedy
 *
 * Solution — Best Time to Buy and Sell Stock
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Any trade is a pair (buy day i, sell day j) with i < j. If we fix the sell
 * day j, the best buy day is obviously the cheapest price among days 0..j-1.
 * So the answer is
 *
 *     max over j of ( prices[j] − min(prices[0..j-1]) )
 *
 * and "the minimum of everything before j" can be maintained in O(1) per step
 * as we scan left to right. That greedy choice — always remember the cheapest
 * buy so far — is all we need.
 *
 * Approach (one pass)
 * ───────────────────
 *   1. minPrice = +Infinity, best = 0.
 *   2. For each price p, in order:
 *        a. best = max(best, p − minPrice)   ← sell today, bought at the cheapest earlier day
 *        b. minPrice = min(minPrice, p)      ← today might be the cheapest buy for the future
 *   3. Return best.
 *
 * The order of (a) and (b) doesn't actually matter here: if p becomes the
 * new minimum first, then p − minPrice = 0, which never beats best ≥ 0.
 * Starting best at 0 handles "never trade" automatically.
 *
 * Walkthrough — prices = [7, 1, 5, 3, 6, 4]
 * ───────────
 *   p=7  best=max(0, 7−∞)=0    minPrice=7
 *   p=1  best=max(0, 1−7)=0    minPrice=1
 *   p=5  best=max(0, 5−1)=4    minPrice=1
 *   p=3  best=max(4, 3−1)=4    minPrice=1
 *   p=6  best=max(4, 6−1)=5    minPrice=1
 *   p=4  best=max(5, 4−1)=5    minPrice=1
 *   → 5
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one pass over the prices.
 *   Space: O(1) — two numbers.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all pairs: O(n²). Correct but ~5·10^9 steps at n = 10^5.
 *   • "max(prices) − min(prices)" is WRONG: the maximum may come before the
 *     minimum ([9, 1, 2] → 1, not 8).
 *   • Kadane view: the profit of buying on i and selling on j equals the sum
 *     of daily differences prices[k+1] − prices[k] for k in [i, j). So the
 *     answer is the maximum subarray sum of the difference array (clamped at
 *     0). Same O(n), nice link to the Maximum Subarray problem.
 *   • Don't return a negative number when prices only fall — the answer is 0.
 */

/**
 * @param {number[]} prices
 * @returns {number}
 */
export function maxProfit(prices) {
  let minPrice = Infinity; // cheapest buy price seen so far
  let best = 0; // best profit so far; 0 = "don't trade"

  for (const price of prices) {
    // Option 1: sell today, having bought at the cheapest earlier price.
    if (price - minPrice > best) best = price - minPrice;
    // Option 2: today becomes the new cheapest day to buy.
    if (price < minPrice) minPrice = price;
  }

  return best;
}
