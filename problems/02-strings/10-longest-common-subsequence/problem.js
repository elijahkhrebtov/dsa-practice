/*
 * Title:      Longest Common Subsequence
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given two strings `text1` and `text2`, return the length of their longest
 * common subsequence, or 0 if they have no character in common.
 *
 * A subsequence is what's left of a string after deleting any number of
 * characters (possibly none) WITHOUT changing the order of the remaining
 * ones. "ace" is a subsequence of "abcde"; "aec" is not. Unlike a
 * substring, a subsequence doesn't have to be contiguous.
 *
 * A common subsequence is a string that is a subsequence of both inputs.
 * Return only its length, not the subsequence itself.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  text1 = "abcde", text2 = "ace"
 *     Output: 3
 *     Why:    "ace" is a subsequence of both.
 *
 *   Example 2
 *     Input:  text1 = "abc", text2 = "abc"
 *     Output: 3
 *
 *   Example 3
 *     Input:  text1 = "abc", text2 = "def"
 *     Output: 0
 *     Why:    No character appears in both strings.
 *
 *   Example 4
 *     Input:  text1 = "abc", text2 = "bca"
 *     Output: 2
 *     Why:    "bc". Matching the 'a's first ("a" at the end of text2) would
 *             leave nothing to match after it.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= text1.length, text2.length <= 1000
 *   • Both strings consist of lowercase English letters only.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Trying every subsequence, or recursing "skip a character of text1 or of
 *   text2" without remembering results, is exponential: two strings of
 *   fewer than 20 letters that barely overlap keep plain recursion busy
 *   for seconds, and the tests include such a pair. Aim for O(m · n) time;
 *   O(min(m, n)) extra space is a nice follow-up.
 */

// ▶ Run tests:   npm run solve longest-common-subsequence
// ⟳ Watch mode:  npm run watch longest-common-subsequence

/**
 * Computes the length of the longest common subsequence of two strings.
 *
 * @param {string} text1 - The first string (lowercase letters).
 * @param {string} text2 - The second string (lowercase letters).
 * @returns {number} The length of the longest string that is a subsequence of both inputs.
 */
export function longestCommonSubsequence(text1, text2) {
  // Your code here
}
