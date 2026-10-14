/*
 * Title:      Longest Common Subsequence
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * Solution — Longest Common Subsequence
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Compare the strings from the front, one character of each at a time.
 * Let L(i, j) be the LCS length of the prefixes text1[0..i) and text2[0..j).
 * Look at the last characters of those prefixes:
 *
 *   • If text1[i-1] === text2[j-1], it is always safe to match them with
 *     each other: L(i, j) = L(i-1, j-1) + 1.
 *   • Otherwise at least one of them is not part of the LCS, so drop one
 *     or the other and keep the better result:
 *     L(i, j) = max(L(i-1, j), L(i, j-1)).
 *
 * Plain recursion on that rule branches in two on every mismatch and
 * reaches the same (i, j) pairs over and over again. There are only
 * (m+1)·(n+1) distinct pairs, so filling a table of them, each from its
 * three neighbours, gets the job done in O(m·n).
 *
 * Approach (bottom-up table, kept to two rows)
 * ────────────────────────────────────────────
 *   1. Row 0 and column 0 are all zeros: an empty prefix has an empty LCS.
 *   2. Fill row by row (i = 1..m), left to right (j = 1..n), with the rule
 *      above. Each cell depends only on the cell to its left (same row), the
 *      cell above, and the cell up-left (previous row).
 *   3. So keep just two rows, `prev` and `cur`, and swap them after each
 *      row. Make the shorter string the column string to get O(min(m, n))
 *      space.
 *   4. The answer is the last cell, L(m, n).
 *
 * Walkthrough — text1 = "abcde", text2 = "ace"
 * ───────────
 *            ""   a   c   e
 *       ""    0   0   0   0
 *       a     0   1   1   1      a = a → diagonal + 1
 *       b     0   1   1   1      b matches nothing → copy max(up, left)
 *       c     0   1   2   2      c = c → diagonal (1) + 1 = 2
 *       d     0   1   2   2
 *       e     0   1   2   3      e = e → diagonal (2) + 1 = 3
 *
 *   Answer: bottom-right cell = 3 ("ace").
 *
 * Complexity
 * ──────────
 *   Time:  O(m · n) — one constant-time cell per pair of prefixes.
 *   Space: O(min(m, n)) — two rows of the table (O(m·n) for the full table,
 *          which you'd keep if you also wanted to rebuild the subsequence by
 *          walking back from the bottom-right corner).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: enumerate the 2^m subsequences of text1 and test each
 *     against text2 — hopeless beyond ~25 letters.
 *   • Top-down recursion with a memo (an (m+1)×(n+1) array, or a Map keyed by
 *     i * (n + 1) + j) is just as good asymptotically. String keys like
 *     `${i},${j}` work but are much slower for 10^6 cells.
 *   • Off-by-one: using L(i, j) for PREFIX LENGTHS (so row/column 0 are the
 *     empty prefixes) avoids special-casing the first row and column. The
 *     characters compared at cell (i, j) are text1[i-1] and text2[j-1].
 *   • With the single-row (1D) variant, remember to save the old dp[j-1]
 *     (the "diagonal") before overwriting it.
 *   • Greedy matching ("match each character of text1 at its first
 *     occurrence in text2") is wrong: "aebcd" vs "bcdae" gives 2 instead of 3.
 */

/**
 * @param {string} text1
 * @param {string} text2
 * @returns {number}
 */
export function longestCommonSubsequence(text1, text2) {
  // Use the shorter string for the columns so the rows are as small as possible.
  if (text2.length > text1.length) [text1, text2] = [text2, text1];
  const m = text1.length;
  const n = text2.length;

  let prev = new Array(n + 1).fill(0); // row i-1 of the table
  let cur = new Array(n + 1).fill(0); // row i, being filled

  for (let i = 1; i <= m; i++) {
    const c = text1[i - 1];
    for (let j = 1; j <= n; j++) {
      if (c === text2[j - 1]) {
        cur[j] = prev[j - 1] + 1; // match both last characters
      } else {
        cur[j] = Math.max(prev[j], cur[j - 1]); // drop one of them
      }
    }
    [prev, cur] = [cur, prev]; // cur[0] stays 0, the rest is overwritten next row
  }

  return prev[n];
}
