/*
 * Title:      Longest Palindromic Substring
 * Difficulty: Medium
 * Patterns:   Expand Around Center, Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given a string `s`, return the longest substring of `s` that is a
 * palindrome (reads the same forwards and backwards).
 *
 *   • A substring is contiguous. Characters are compared exactly — case
 *     matters and nothing is skipped (unlike "Valid Palindrome").
 *   • If several different substrings share the maximum length, return any
 *     one of them. The tests accept every correct answer.
 *   • Every single character is a palindrome, so for a non-empty `s` the
 *     answer has length at least 1.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "babad"
 *     Output: "bab"   ("aba" is also accepted)
 *
 *   Example 2
 *     Input:  s = "cbbd"
 *     Output: "bb"
 *     Why:    Palindromes can have even length — their center is BETWEEN
 *             two characters.
 *
 *   Example 3
 *     Input:  s = "forgeeksskeegfor"
 *     Output: "geeksskeeg"
 *
 *   Example 4
 *     Input:  s = "abc"
 *     Output: "a"   ("b" or "c" are also accepted)
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= s.length <= 1000 (the performance tests use 3,000)
 *   • `s` consists of English letters and digits.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n²) time and O(1) extra space (expand around each center). An O(n²)
 *   DP table also passes. Checking every substring separately is O(n³) and
 *   the performance tests will reject it.
 *
 *   Follow-up: Manacher's algorithm solves this in O(n).
 */

// ▶ Run tests:   npm run solve longest-palindromic-substring
// ⟳ Watch mode:  npm run watch longest-palindromic-substring

/**
 * Finds a longest palindromic substring.
 *
 * @param {string} s - The input string (non-empty, letters and digits).
 * @returns {string} A substring of `s` that is a palindrome and has the maximum possible length.
 */
export function longestPalindrome(s) {
  // Your code here
}
