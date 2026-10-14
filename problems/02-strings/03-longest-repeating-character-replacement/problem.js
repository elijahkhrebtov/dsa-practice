/*
 * Title:      Longest Repeating Character Replacement
 * Difficulty: Medium
 * Patterns:   Sliding Window, Frequency Counting
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given a string `s` of uppercase English letters and an integer
 * `k`. You may perform at most `k` operations; each operation picks one
 * position of the string and changes its letter to any other uppercase
 * letter.
 *
 * Return the length of the longest substring that consists of a single
 * repeated letter that you can obtain after performing those operations.
 *
 *   • You don't have to use all `k` operations.
 *   • Only the length is returned, not the substring or the operations.
 *   • For the empty string, return 0.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "ABAB", k = 2
 *     Output: 4
 *     Why:    Change both 'A's to 'B' (or both 'B's to 'A') → "BBBB".
 *
 *   Example 2
 *     Input:  s = "AABABBA", k = 1
 *     Output: 4
 *     Why:    Change the 'A' at index 3 → "AABBBBA" contains "BBBB".
 *             Other choices can also give 4, but none gives 5.
 *
 *   Example 3
 *     Input:  s = "ABCDE", k = 0
 *     Output: 1
 *     Why:    With no changes allowed, the best run is any single letter.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= s.length <= 10^5
 *   • `s` consists only of uppercase English letters 'A'–'Z'.
 *   • 0 <= k <= s.length
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time (O(26·n) is fine) and O(1) extra space. Checking every
 *   substring is O(n²) and the performance test will reject it.
 */

// ▶ Run tests:   npm run solve longest-repeating-character-replacement
// ⟳ Watch mode:  npm run watch longest-repeating-character-replacement

/**
 * Finds the longest single-letter run achievable by changing at most `k` letters.
 *
 * @param {string} s - String of uppercase English letters (may be empty).
 * @param {number} k - Maximum number of letters you may change.
 * @returns {number} Length of the longest substring that can be made of one repeated letter.
 */
export function characterReplacement(s, k) {
  // Your code here
}
