/*
 * Title:      Best Time to Buy and Sell Stock with Cooldown
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * Solution — Best Time to Buy and Sell Stock with Cooldown
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Without the cooldown, the greedy "take every rise" works. The cooldown
 * breaks that: selling today has a hidden cost (you lose tomorrow as a buy
 * day), so local decisions can be wrong — see [1, 4, 2, 7].
 *
 * What we need is to remember, at the end of each day, the best profit for
 * each *situation* we could be in. There are only three:
 *
 *            buy (rest → hold)
 *     ┌──────┐ ─────────────────▶ ┌──────┐
 *     │ rest │                    │ hold │ ◀─┐ wait
 *     └──────┘ ◀──┐               └──────┘ ──┘
 *        ▲  │     │ cooldown          │
 *   wait └──┘     │ passes            │ sell
 *                 │                   ▼
 *                 └────────────── ┌──────┐
 *                                 │ sold │
 *                                 └──────┘
 *
 *   • hold — I own a share at the end of the day.
 *   • sold — I sold a share TODAY, so tomorrow I'm in cooldown.
 *   • rest — I own nothing and did not sell today; I'm free to buy.
 *
 * The cooldown is encoded simply by the missing arrow sold → hold: after a
 * sale you must pass through `rest` (one day) before you can buy.
 *
 * Approach (state-machine DP, rolling variables)
 * ───────────────────────────────────────────────
 *   1. hold = -Infinity (impossible before day 0), sold = 0, rest = 0.
 *   2. For each price p, using yesterday's values:
 *        newHold = max(hold, rest - p)   // keep the share, or buy today
 *        newSold = hold + p              // sell the share we held
 *        newRest = max(rest, sold)       // keep waiting, or cooldown ends
 *   3. Answer = max(sold, rest) — ending while holding is never better,
 *      because the share's purchase price was paid and nothing came back.
 *
 * Walkthrough — prices = [1, 2, 3, 0, 2]
 * ───────────
 *   start        hold=-∞  sold=0   rest=0
 *   p=1          hold=-1  sold=-∞  rest=0    (buy at 1)
 *   p=2          hold=-1  sold=1   rest=0    (selling here would give 1)
 *   p=3          hold=-1  sold=2   rest=1    (rest picks up yesterday's sale)
 *   p=0          hold=1   sold=-1  rest=2    (buy at 0 from rest=1 → 1)
 *   p=2          hold=1   sold=3   rest=2
 *   answer = max(3, 2) = 3
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — constant work per day.
 *   Space: O(1) — three numbers (plus temporaries).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force recursion (buy / sell / wait each day) is exponential.
 *     Memoizing it on (day, holding) gives an O(n) top-down solution with
 *     O(n) space — same idea, different packaging.
 *   • O(n²) DP: best[i] = max(best[i-1], max over j < i of
 *     prices[i] - prices[j] + best[j-2]). Correct, but quadratic.
 *   • Updating the variables in place in the wrong order mixes today's and
 *     yesterday's values (e.g. computing sold from the NEW hold lets you buy
 *     and sell on the same day). Use temporaries.
 *   • Buying from `sold` instead of `rest` silently removes the cooldown.
 *   • Initializing hold = 0 pretends you got a share for free on day -1.
 */

/**
 * @param {number[]} prices
 * @returns {number}
 */
export function maxProfit(prices) {
  let hold = -Infinity; // best profit while owning a share
  let sold = 0; // best profit having sold exactly today (cooldown tomorrow)
  let rest = 0; // best profit owning nothing and free to buy

  for (const p of prices) {
    const prevHold = hold;
    hold = Math.max(hold, rest - p); // keep holding, or buy (only from rest!)
    rest = Math.max(rest, sold); // keep waiting, or yesterday's cooldown ends
    sold = prevHold + p; // sell what we held yesterday
  }

  return Math.max(sold, rest);
}
