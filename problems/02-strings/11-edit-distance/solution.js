/*
 * Title:      Edit Distance
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * Solution — Edit Distance
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Let D(i, j) be the edit distance between the prefixes word1[0..i) and
 * word2[0..j). Think about what happens to the LAST character of each
 * prefix in an optimal edit script:
 *
 *   • If word1[i-1] === word2[j-1], leave both alone:
 *       D(i, j) = D(i-1, j-1).
 *   • Otherwise one of three things finishes the job:
 *       replace word1[i-1] with word2[j-1]  → 1 + D(i-1, j-1)
 *       delete  word1[i-1]                  → 1 + D(i-1, j)
 *       insert  word2[j-1] at the end       → 1 + D(i, j-1)
 *     and we take the cheapest.
 *
 * Base cases: turning a prefix of length i into "" takes i deletions,
 * D(i, 0) = i, and building a prefix of length j from "" takes j
 * insertions, D(0, j) = j.
 *
 * Recursing on this directly branches three ways per mismatch and
 * re-solves the same (i, j) pairs exponentially often. There are only
 * (m+1)·(n+1) pairs, so fill them into a table instead.
 *
 * Approach (bottom-up table, kept to two rows)
 * ────────────────────────────────────────────
 *   1. Row 0 is 0, 1, 2, …, n (insertions from the empty prefix).
 *   2. For each i = 1..m: the row starts with D(i, 0) = i, then each cell
 *      j = 1..n uses the rule above. It needs the cell above (delete), the
 *      cell to the left (insert) and the cell up-left (keep or replace).
 *   3. Keep only the previous row and the current one.
 *   4. The answer is D(m, n).
 *
 * Walkthrough — word1 = "horse", word2 = "ros"
 * ───────────
 *            ""   r   o   s
 *       ""    0   1   2   3
 *       h     1   1   2   3      h≠r: replace → 1 + D("", "") = 1
 *       o     2   2   1   2      o=o: diagonal D("h","r") = 1
 *       r     3   2   2   2      r=r: diagonal D("ho","") = 2
 *       s     4   3   3   2      s=s: diagonal D("hor","ro") = 2
 *       e     5   4   4   3      e≠s: delete e → 1 + D("hors","ros") = 3
 *
 *   Answer: bottom-right cell = 3.
 *
 * Complexity
 * ──────────
 *   Time:  O(m · n) — one constant-time cell per pair of prefixes.
 *   Space: O(n) for two rows (swap the arguments first to get O(min(m, n));
 *          the distance is symmetric). The full table is only needed if you
 *          want to recover the actual sequence of edits.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Plain recursion is ~3^(m+n). Top-down recursion with an
 *     (m+1)×(n+1) memo array is fine and asymptotically equal.
 *   • Don't forget the base row/column: D(i, 0) = i, not 0. Starting each
 *     row with cur[0] = i is the most common thing to forget in the
 *     two-row version.
 *   • When the characters match, D(i-1, j-1) alone is correct. Taking
 *     min(D(i-1, j-1), 1 + D(i-1, j), 1 + D(i, j-1)) also works, but adding 1
 *     to the diagonal on a match is a bug.
 *   • This is not LCS: "replace" lets two different characters line up for a
 *     cost of 1. The formula m + n − 2·LCS counts only insertions and
 *     deletions, so it overestimates ("abc" → "abd" is 1, not 2).
 */

/**
 * @param {string} word1
 * @param {string} word2
 * @returns {number}
 */
export function minDistance(word1, word2) {
  // The distance is symmetric, so put the shorter word on the columns.
  if (word2.length > word1.length) [word1, word2] = [word2, word1];
  const m = word1.length;
  const n = word2.length;

  // prev[j] = D(i-1, j); row 0 is "insert j characters".
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let cur = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    cur[0] = i; // turning i characters into "" takes i deletions
    const c = word1[i - 1];
    for (let j = 1; j <= n; j++) {
      if (c === word2[j - 1]) {
        cur[j] = prev[j - 1]; // last characters already match: no cost
      } else {
        cur[j] =
          1 +
          Math.min(
            prev[j - 1], // replace word1[i-1] with word2[j-1]
            prev[j], // delete word1[i-1]
            cur[j - 1], // insert word2[j-1]
          );
      }
    }
    [prev, cur] = [cur, prev];
  }

  return prev[n];
}
