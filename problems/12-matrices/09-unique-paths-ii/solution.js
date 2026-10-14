/*
 * Title:      Unique Paths II
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * Solution — Unique Paths II
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The robot can only arrive at cell (r, c) from the cell above it or from
 * the cell to its left — its very last move was either DOWN or RIGHT. Those
 * two groups of paths don't overlap, so
 *
 *     ways(r, c) = ways(r-1, c) + ways(r, c-1)      if (r, c) is free
 *     ways(r, c) = 0                                if (r, c) is an obstacle
 *
 * with ways(0, 0) = 1 when the start is free. Walking every path is
 * exponential, but there are only m·n distinct sub-questions "how many ways
 * reach (r, c)?", each answered in O(1) from two earlier answers. That is
 * dynamic programming.
 *
 * Approach (one rolling row)
 * ──────────────────────────
 * Row r only needs row r-1, so keep a single array `dp` of length n, where
 * dp[c] = ways to reach (current row, c).
 *   1. dp = [1, 0, 0, …] if the start is free; if it's blocked, return 0.
 *   2. For each row r, for each column c from left to right:
 *        • if obstacleGrid[r][c] is 1 → dp[c] = 0
 *        • else if c > 0           → dp[c] += dp[c - 1]
 *      Before the update, dp[c] still holds the value from the row ABOVE;
 *      dp[c - 1] was already updated and holds the cell to the LEFT.
 *   3. Return dp[n - 1].
 *
 * The obstacle rule handles the first row and column for free: once a 0 is
 * written there, it propagates to everything right of it / below it.
 *
 * Walkthrough — [[0,0,0],[0,1,0],[0,0,0]]
 * ───────────
 *   start:  dp = [1, 0, 0]
 *   row 0:  [1, 1, 1]        (each cell gets the one to its left)
 *   row 1:  [1, 0, 1]        (centre is an obstacle → 0; right = 1 + 0)
 *   row 2:  [1, 1, 2]        (1 + 0 = 1, then 1 + 1 = 2)
 *   answer: dp[2] = 2
 *
 * Complexity
 * ──────────
 *   Time:  O(m·n) — every cell is processed once in O(1).
 *   Space: O(n) — one row of counts (the input is not modified).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Plain recursion walk(r, c) = walk(r+1, c) + walk(r, c+1) is correct
 *     but explores every path: ~155 million leaves for an empty 16 × 16.
 *     Adding a memo turns it into the same O(m·n) algorithm (top-down DP).
 *   • A full m × n dp table is fine too (O(m·n) space). Some solutions
 *     write the counts into `obstacleGrid` itself for O(1) extra space, but
 *     that destroys the caller's data — not allowed here.
 *   • Classic bug: initialising the whole first row/column with 1s. An
 *     obstacle there must zero out everything after it.
 *   • Don't forget the start cell itself can be blocked (answer 0), and a
 *     1 × 1 free grid has exactly 1 path.
 *   • Without obstacles the answer is C(m+n-2, m-1) — a handy sanity check.
 */

/**
 * @param {number[][]} obstacleGrid
 * @returns {number}
 */
export function uniquePathsWithObstacles(obstacleGrid) {
  const m = obstacleGrid.length;
  const n = obstacleGrid[0].length;
  if (obstacleGrid[0][0] === 1) return 0;

  // dp[c] = number of ways to reach column c of the row being processed.
  const dp = new Array(n).fill(0);
  dp[0] = 1;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (obstacleGrid[r][c] === 1) {
        dp[c] = 0; // nobody can stand here, so nobody passes through
      } else if (c > 0) {
        dp[c] += dp[c - 1]; // from above (old dp[c]) + from the left (new dp[c-1])
      }
    }
  }

  return dp[n - 1];
}
