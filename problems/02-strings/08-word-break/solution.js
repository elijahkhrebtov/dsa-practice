/*
 * Title:      Word Break
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Hash Set
 *
 * Solution — Word Break
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Think about the LAST word of a valid split. If s[0..i) can be segmented,
 * then the last word is some dictionary word w with s[i-|w|..i) === w, and
 * everything before it, s[0..i-|w|), must itself be segmentable. So whether
 * a prefix works depends only on whether certain SHORTER prefixes work.
 *
 * Plain recursion ("try every first word, recurse on the rest") asks the
 * same question about the same suffix over and over: in "aaaa…ab" the
 * suffix starting at index 10 is reached via 1+9, 2+8, 3+7, 1+1+8, … There
 * are only n+1 distinct positions, so remembering the answer per position
 * collapses the exponential tree into a linear table.
 *
 * Approach (bottom-up DP over prefix lengths)
 * ────────────────────────────────────────────
 *   1. Put the words in a Set for O(1)-average lookups and note the longest
 *      word length L (no word can be longer, so no need to look further back).
 *   2. dp[i] = "the first i characters can be segmented". dp[0] = true —
 *      the empty prefix needs zero words.
 *   3. For i = 1..n, try each possible last-word length len = 1..min(L, i):
 *        if dp[i - len] is true and s.slice(i - len, i) is in the Set,
 *        set dp[i] = true and stop trying other lengths.
 *   4. Return dp[n].
 *
 * Walkthrough — s = "catsandog", words = {cats, dog, sand, and, cat}
 * ───────────
 *   index:   0  1  2  3  4  5  6  7  8  9
 *   char:       c  a  t  s  a  n  d  o  g
 *   dp:      T  F  F  T  T  F  F  T  F  F
 *
 *   dp[3]: "cat" ends here and dp[0] = T            → T
 *   dp[4]: "cats" ends here and dp[0] = T           → T
 *   dp[7]: "sand" (from 3, dp[3]=T) or "and" (from 4, dp[4]=T) → T
 *   dp[9]: candidates ending here are "g", "og", "dog" (from 6), …
 *          "dog" is a word but dp[6] = F; nothing else is a word → F
 *   Answer dp[9] = false.
 *
 * Complexity
 * ──────────
 *   Time:  O(n · L²) — n positions, up to L candidate lengths each, and each
 *          slice + hash costs O(L). With L ≤ 20 this is effectively linear.
 *          (Without the L bound it is O(n³) in the worst case, still fine
 *          for these limits.) Building the Set costs O(total dictionary size).
 *   Space: O(n) for dp plus the Set.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Plain recursion / backtracking without memo is exponential — ~2^n on
 *     "aaa…ab". Top-down recursion WITH a memo (index → boolean, remembering
 *     failures too!) is equally correct and fast; forgetting to memoize the
 *     `false` results is the classic bug that keeps it exponential.
 *   • BFS over start indices with a `visited` set is the same idea in
 *     another shape.
 *   • Greedy (always take the longest, or shortest, matching word) is wrong:
 *     "goalspecial" with {go, goal, goals, special} needs "goal", not "goals".
 *   • Iterating over the dictionary instead of over lengths (for each word,
 *     check s.startsWith(word, i)) is O(n · |dict| · L) — fine here, but the
 *     Set + max-length version scales better with big dictionaries.
 *   • A Trie of the words lets you walk forward from each reachable index
 *     and stop as soon as no word continues — a nice optimization when L is
 *     large.
 */

/**
 * @param {string} s
 * @param {string[]} wordDict
 * @returns {boolean}
 */
export function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  let maxLen = 0;
  for (const w of words) maxLen = Math.max(maxLen, w.length);

  const n = s.length;
  // dp[i] — can the prefix s[0..i) be split into dictionary words?
  const dp = new Array(n + 1).fill(false);
  dp[0] = true; // the empty prefix is trivially "segmented"

  for (let i = 1; i <= n; i++) {
    // Try every possible length of the LAST word of the prefix s[0..i).
    for (let len = 1; len <= maxLen && len <= i; len++) {
      if (dp[i - len] && words.has(s.slice(i - len, i))) {
        dp[i] = true;
        break; // one way is enough
      }
    }
  }

  return dp[n];
}
