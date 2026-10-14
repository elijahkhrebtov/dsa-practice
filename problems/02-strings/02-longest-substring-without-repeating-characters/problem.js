/*
 * Title:      Longest Substring Without Repeating Characters
 * Difficulty: Medium
 * Patterns:   Sliding Window, Hash Map
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given a string `s`, return the LENGTH of the longest substring of `s` in
 * which no character appears more than once.
 *
 *   • A substring is a contiguous run of characters. "pwke" is a
 *     subsequence of "pwwkew" but not a substring.
 *   • Characters are compared exactly: 'a' and 'A' are different, and the
 *     space ' ' is a character like any other.
 *   • For the empty string, return 0.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "abcabcbb"
 *     Output: 3
 *     Why:    "abc" (also "bca", "cab") — every window of 4 repeats a letter.
 *
 *   Example 2
 *     Input:  s = "bbbbb"
 *     Output: 1
 *     Why:    Any two characters would be "bb".
 *
 *   Example 3
 *     Input:  s = "pwwkew"
 *     Output: 3
 *     Why:    "wke". Note "pwke" doesn't count — it isn't contiguous.
 *
 *   Example 4
 *     Input:  s = "abba"
 *     Output: 2
 *     Why:    "ab" or "ba". A tempting bug reports 3 here (see the tests).
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= s.length <= 5 * 10^4 (the performance test uses 2 * 10^5)
 *   • `s` consists of printable ASCII characters (codes 32–126): letters,
 *     digits, symbols and spaces.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time: every character should enter and leave your "current
 *   substring" at most once. O(min(n, alphabet)) extra space.
 */

// ▶ Run tests:   npm run solve longest-substring-without-repeating-characters
// ⟳ Watch mode:  npm run watch longest-substring-without-repeating-characters

/**
 * Finds the length of the longest substring that contains no repeated character.
 *
 * @param {string} s - The input string (printable ASCII, may be empty).
 * @returns {number} The maximum length of a substring whose characters are all distinct.
 */
export function lengthOfLongestSubstring(s) {
  // Your code here
}
