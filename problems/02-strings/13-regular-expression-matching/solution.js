/*
 * Title:      Regular Expression Matching
 * Difficulty: Hard
 * Patterns:   Dynamic Programming, Memoization
 *
 * Solution — Regular Expression Matching
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Read the pattern as a list of TOKENS: a single element (letter or '.'),
 * optionally followed by '*'. Match from the front, and ask
 *   M(i, j) = "does the suffix s[i..] match the pattern suffix p[j..]?"
 *
 * Let first = (i < s.length) && (p[j] === s[i] || p[j] === '.').
 *   • If p[j+1] is NOT '*', the token must consume exactly one character:
 *       M(i, j) = first && M(i+1, j+1).
 *   • If p[j+1] IS '*', the token "x*" can be used zero times (skip it) or
 *     consume one more character and stay available for more:
 *       M(i, j) = M(i, j+2)  ||  (first && M(i+1, j)).
 *   • Base: an empty pattern matches only the empty string:
 *       M(i, n) = (i === m).
 *
 * Backtracking on this recurrence is exponential: with "a*a*a*…" there are
 * a huge number of ways to share the a's among the stars, and when the end
 * can never match (a 'c' in the pattern, a 'b' in the string) it tries
 * them ALL. But every call is determined by just (i, j), and there are only
 * (m+1)·(n+1) such pairs. Remember each answer and the work becomes
 * O(m · n).
 *
 * Approach (bottom-up table over suffixes)
 * ────────────────────────────────────────
 *   1. dp[i][j] for 0 ≤ i ≤ m, 0 ≤ j ≤ n. dp[m][n] = true; the rest of
 *      column n is false.
 *   2. Fill i from m down to 0 (note: i = m, the empty suffix of s, matters
 *      because "a*b*" can still match it), and j from n-1 down to 0, using
 *      the two rules above. Both only look at larger i or larger j, which are
 *      already filled.
 *   3. Return dp[0][0].
 *   (Top-down recursion + a memo over (i, j) is the same algorithm. Many
 *   people find it easier to write first.)
 *
 * Walkthrough — s = "aab", p = "c*a*b"
 * ───────────
 * Tokens start at j = 0 ("c*"), 2 ("a*"), 4 ("b"); j = 5 is the end. The
 * columns at the '*' positions (j = 1, 3) are never read and are left out.
 *
 *                 j=0 "c*"   j=2 "a*"   j=4 "b"   j=5 end
 *   i=3 ""           F          F          F         T
 *   i=2 "b"          T          T          T         F
 *   i=1 "ab"         T          T          F         F
 *   i=0 "aab"        T          T          F         F
 *
 *   dp[2][4]: 'b' = 'b' and dp[3][5] = T                → T
 *   dp[1][2]: skip "a*" → dp[1][4] = F; or 'a' matches and dp[2][2] = T → T
 *   dp[0][0]: skip "c*" → dp[0][2] = T                  → T
 *   Answer dp[0][0] = true.
 *
 * Complexity
 * ──────────
 *   Time:  O(m · n) — each cell takes O(1).
 *   Space: O(m · n) for the table (two rows suffice, O(n), since row i only
 *          reads rows i and i+1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Plain recursion with s.slice/p.slice is correct but exponential on
 *     "a*a*a*…c"-style inputs, and slicing allocates a new string per call.
 *     Use indices.
 *   • Look ahead, not back: decide what to do at p[j] by checking p[j+1]
 *     for a '*'. Treating '*' as a token of its own leads to messy special
 *     cases.
 *   • The empty string is not a dead end. "", "a*b*c*" is true, so the row
 *     i = m must be computed with the star rule, not just set to false.
 *   • "x*" can match zero characters even when s[i] !== x. Always try the
 *     "skip the token" branch first; it doesn't need `first`.
 *   • Greedy matching (let each star eat as much as it can) fails on
 *     "aaa" vs "a*a".
 *   • Converting to a JS RegExp would pass the tests, but defeats the point.
 *     Real regex engines either backtrack (and can blow up exactly like
 *     the naive approach) or build an automaton (NFA/DFA) to stay linear.
 */

/**
 * @param {string} s
 * @param {string} p
 * @returns {boolean}
 */
export function isMatch(s, p) {
  const m = s.length;
  const n = p.length;

  // dp[i][j] — does the suffix s[i..] match the pattern suffix p[j..]?
  const dp = Array.from({ length: m + 1 }, () => new Uint8Array(n + 1));
  dp[m][n] = 1; // empty pattern matches the empty string

  for (let i = m; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (p[j] === '*') continue; // only token starts are meaningful states
      const first = i < m && (p[j] === s[i] || p[j] === '.');

      if (p[j + 1] === '*') {
        // "x*": use it zero times, or consume one character and keep the star.
        dp[i][j] = dp[i][j + 2] || (first && dp[i + 1][j]) ? 1 : 0;
      } else {
        // Plain letter or '.': must consume exactly one character.
        dp[i][j] = first && dp[i + 1][j + 1] ? 1 : 0;
      }
    }
  }

  return dp[0][0] === 1;
}
