/*
 * Title:      Minimum Window Substring
 * Difficulty: Hard
 * Patterns:   Sliding Window, Frequency Counting
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given two strings `s` and `t`, return the shortest contiguous substring
 * (window) of `s` that contains every character of `t`, INCLUDING
 * duplicates: if `t` has two 'a's, the window must contain at least two
 * 'a's. The window may contain other characters too, and the order of the
 * characters doesn't matter.
 *
 *   • Matching is case-sensitive: 'a' and 'A' are different characters.
 *   • If no window of `s` contains all of `t`, return "" (empty string).
 *   • The inputs are chosen so that the shortest window, when one exists,
 *     is unique. There is never a tie to break.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "ADOBECODEBANC", t = "ABC"
 *     Output: "BANC"
 *     Why:    "ADOBEC" and "CODEBA" also contain A, B and C, but "BANC"
 *             is the shortest.
 *
 *   Example 2
 *     Input:  s = "a", t = "a"
 *     Output: "a"
 *
 *   Example 3
 *     Input:  s = "a", t = "aa"
 *     Output: ""
 *     Why:    `t` needs two 'a's but `s` has only one.
 *
 *   Example 4
 *     Input:  s = "acbbaca", t = "aba"
 *     Output: "baca"
 *     Why:    The window needs two 'a's and one 'b'.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= s.length, t.length <= 10^5
 *   • `s` and `t` consist of uppercase and lowercase English letters.
 *   • If a minimum window exists, it is unique.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Checking every start position and extending to the right is O(m²) and
 *   takes seconds on the 50,000-character input in the tests. Aim for
 *   O(m + n) time, where m = s.length and n = t.length, with O(1) extra
 *   space (the alphabet is fixed at 52 letters).
 */

// ▶ Run tests:   npm run solve minimum-window-substring
// ⟳ Watch mode:  npm run watch minimum-window-substring

/**
 * Finds the shortest substring of `s` that contains every character of `t` (with multiplicity).
 *
 * @param {string} s - The string to search in (English letters, case-sensitive).
 * @param {string} t - The characters the window must contain, duplicates included.
 * @returns {string} The minimum window, or "" if no window contains all of `t`.
 */
export function minWindow(s, t) {
  // Your code here
}
