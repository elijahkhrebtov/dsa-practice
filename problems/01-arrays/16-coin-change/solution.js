/*
 * Title:      Coin Change
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Knapsack
 *
 * Solution — Coin Change
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Greedy (largest coin first) is only correct for special coin systems like
 * real-world currency; [1, 3, 4] with amount 6 already breaks it. We need to
 * consider every option, but cleverly.
 *
 * Look at the last coin of an optimal solution. It's some coin c, and the
 * rest of the coins form an optimal way to make amount - c (otherwise we
 * could swap in a better one and improve the total). That's optimal
 * substructure:
 *
 *     dp[a] = 1 + min over coins c <= a of dp[a - c]
 *     dp[0] = 0
 *
 * The sub-problems overlap heavily (amount 10 with [1, 2, 5] reaches
 * sub-amount 5 along many paths), so we compute each dp[a] once, from small
 * amounts to large. This is the "unbounded knapsack" shape: each item (coin)
 * may be used any number of times.
 *
 * Approach
 * ────────
 *   1. dp = array of length amount + 1, filled with Infinity; dp[0] = 0.
 *   2. For a = 1 … amount:
 *        for each coin c <= a: dp[a] = min(dp[a], dp[a - c] + 1)
 *   3. Return dp[amount] if finite, else -1.
 *
 * Walkthrough — coins = [1, 3, 4], amount = 6
 * ───────────
 *   a=0  0
 *   a=1  dp[0]+1 = 1                                  → 1
 *   a=2  dp[1]+1 = 2                                  → 2
 *   a=3  dp[2]+1 = 3,  dp[0]+1 = 1                    → 1
 *   a=4  dp[3]+1 = 2,  dp[1]+1 = 2,  dp[0]+1 = 1      → 1
 *   a=5  dp[4]+1 = 2,  dp[2]+1 = 3,  dp[1]+1 = 2      → 2
 *   a=6  dp[5]+1 = 3,  dp[3]+1 = 2,  dp[2]+1 = 3      → 2   (3 + 3)
 *
 * Complexity
 * ──────────
 *   Time:  O(amount · k), k = number of coins — at most 10^4 · 12 steps.
 *   Space: O(amount) for the dp array.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Plain recursion over "which coin next" without memoization:
 *     exponential (~10^8 calls for [1, 2, 5] and amount 37).
 *   • Top-down recursion + memo: same O(amount · k), but the recursion can
 *     be `amount` levels deep (coin 1, amount 10^4), which overflows the
 *     JavaScript call stack. Bottom-up has no such problem.
 *   • BFS over amounts (each edge = one coin) also finds the minimum count;
 *     the first time you reach `amount` is optimal.
 *   • Using -1 inside the table as "impossible" makes the min() logic messy
 *     (−1 + 1 = 0 looks like a great answer!). Use Infinity (or amount + 1)
 *     as the sentinel and convert to -1 only at the end.
 *   • Forgetting amount = 0 → 0.
 *   • Related: "Coin Change II" counts the number of combinations instead —
 *     there the loop order (coins outer, amounts inner) matters.
 */

/**
 * @param {number[]} coins
 * @param {number} amount
 * @returns {number}
 */
export function coinChange(coins, amount) {
  // dp[a] = fewest coins to make amount a (Infinity = impossible)
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) {
        dp[a] = dp[a - c] + 1; // use coin c last
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}
