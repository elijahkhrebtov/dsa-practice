/*
 * Title:      Permutation in String
 * Difficulty: Medium
 * Patterns:   Sliding Window, Frequency Counting
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given two strings `s1` and `s2`, return `true` if `s2` contains some
 * permutation (rearrangement) of `s1` as a contiguous substring, and
 * `false` otherwise.
 *
 * In other words: is there a window of `s2` with length `s1.length` that
 * uses exactly the same letters as `s1`, each the same number of times?
 *
 *   • `s1` itself counts as one of its own permutations.
 *   • If `s1` is longer than `s2`, the answer is `false`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s1 = "ab", s2 = "eidbaooo"
 *     Output: true
 *     Why:    s2 contains "ba" (indices 3–4), a permutation of "ab".
 *
 *   Example 2
 *     Input:  s1 = "ab", s2 = "eidboaoo"
 *     Output: false
 *     Why:    The 'b' and the 'a' are separated by an 'o' — no window of
 *             length 2 is {a, b}.
 *
 *   Example 3
 *     Input:  s1 = "adc", s2 = "dcda"
 *     Output: true
 *     Why:    "cda" (indices 1–3) is a rearrangement of "adc".
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= s1.length, s2.length <= 10^5 (the performance test uses 1.1 * 10^5)
 *   • Both strings consist only of lowercase English letters 'a'–'z'.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n + m) time (n = s2.length, m = s1.length) — or O(26·n) — and O(1)
 *   extra space. Rebuilding or sorting every window of s2 costs O(n·m) or
 *   worse, which the performance test will reject.
 */

// ▶ Run tests:   npm run solve permutation-in-string
// ⟳ Watch mode:  npm run watch permutation-in-string

/**
 * Checks whether some permutation of `s1` appears as a substring of `s2`.
 *
 * @param {string} s1 - The string whose rearrangements we look for (lowercase letters).
 * @param {string} s2 - The string to search in (lowercase letters).
 * @returns {boolean} `true` if a window of `s2` is an anagram of `s1`.
 */
export function checkInclusion(s1, s2) {
  // Your code here
}
