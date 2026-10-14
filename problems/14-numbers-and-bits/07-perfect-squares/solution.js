/*
 * Title:      Perfect Squares
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Graph BFS, Math
 *
 * Solution — Perfect Squares
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Greedy doesn't work (12 → 9 + 1 + 1 + 1 instead of 4 + 4 + 4), so we have
 * to consider every option. Any optimal decomposition of n has a "first"
 * square s, and the rest must be an optimal decomposition of n − s
 * (otherwise we could swap in a better one). That gives the recurrence
 *
 *     best(0) = 0
 *     best(i) = 1 + min { best(i − j²) : 1 ≤ j, j² ≤ i }
 *
 * It's an unbounded knapsack / coin change where the "coins" are the
 * squares and we minimize the number of coins. Plain recursion re-solves
 * the same remainders exponentially often, but there are only n + 1
 * distinct subproblems, so fill a table from 0 up.
 *
 * Approach (bottom-up DP)
 * ───────────────────────
 *   1. dp = array of length n + 1. dp[0] = 0, and every other entry starts
 *      at Infinity.
 *   2. For i = 1 … n:
 *        for j = 1, 2, … while j·j ≤ i:
 *          dp[i] = min(dp[i], dp[i − j·j] + 1)
 *   3. Return dp[n].
 *
 * Walkthrough — n = 12
 * ───────────
 *   i:   0  1  2  3  4  5  6  7  8  9 10 11 12
 *   dp:  0  1  2  3  1  2  3  4  2  1  2  3  3
 *
 *   dp[12] = 1 + min(dp[11], dp[8], dp[3]) = 1 + min(3, 2, 3) = 3
 *            (subtracting 1, 4 and 9 respectively) → 4 + 4 + 4
 *
 * Complexity
 * ──────────
 *   Time:  O(n√n) — for each i we try up to √i squares. ~10^6 steps for
 *          n = 10^4.
 *   Space: O(n) for the table.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Memoized recursion (top-down) is the same idea. It recurses up to n
 *     levels deep, which is fine for 10^4.
 *   • BFS: nodes are the remainders 0 … n, and an edge subtracts one
 *     square. The answer is the BFS level at which 0 is first reached.
 *     Mark remainders as visited when you enqueue them, or the queue
 *     explodes. Same worst-case bound, often faster in practice because
 *     the answer is at most 4 levels deep.
 *   • Math aside: Lagrange's four-square theorem says every positive integer
 *     is a sum of at most 4 squares, and Legendre's three-square theorem
 *     says exactly 4 are needed iff n = 4^a · (8b + 7). So: return 1 if n
 *     is a square; 4 if, after dividing out all factors of 4, n % 8 === 7;
 *     2 if n − a² is a square for some a; otherwise 3. That's O(√n), but it
 *     depends on knowing the theorems, so interviews usually expect the DP.
 *   • Greedy (largest square first) is wrong, as 12, 18, 32 and 43 show.
 *   • Comparing Math.sqrt(k) to an integer directly can bite with floats.
 *     Round first, then check r * r === k.
 */

/**
 * @param {number} n
 * @returns {number}
 */
export function numSquares(n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0; // zero squares sum to 0

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j * j <= i; j++) {
      // use j² as one of the squares; the rest is the best way to make i - j²
      const candidate = dp[i - j * j] + 1;
      if (candidate < dp[i]) dp[i] = candidate;
    }
  }

  return dp[n];
}
