/*
 * Title:      Valid Anagram
 * Difficulty: Easy
 * Patterns:   Frequency Counting, Hash Map
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`,
 * and `false` otherwise.
 *
 * An anagram uses exactly the same letters as the original, each exactly
 * as many times, just possibly in a different order. In other words, `s`
 * and `t` are anagrams when every character occurs the same number of
 * times in both.
 *
 *   • Both strings contain only lowercase English letters 'a'–'z'.
 *   • A string is an anagram of itself, and two empty strings are anagrams
 *     of each other.
 *   • Strings of different lengths can never be anagrams.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "anagram", t = "nagaram"
 *     Output: true
 *     Why:    both have a×3, n×1, g×1, r×1, m×1.
 *
 *   Example 2
 *     Input:  s = "rat", t = "car"
 *     Output: false
 *     Why:    s has a 't' that t doesn't, and t has a 'c' that s doesn't.
 *
 *   Example 3
 *     Input:  s = "aab", t = "abb"
 *     Output: false
 *     Why:    same set of letters {a, b} and same length, but different
 *             counts (a×2 vs a×1).
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= s.length, t.length <= 2 * 10^5
 *   • s and t consist of lowercase English letters only.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space (the alphabet is a fixed 26 letters).
 *   Sorting both strings works in O(n log n). Repeatedly searching for and
 *   deleting characters is O(n²), and the performance test (200,000
 *   characters) will flag it.
 *
 *   Follow-up: what if the input could contain any Unicode characters
 *   (accents, emoji, other scripts)? A fixed array of 26 counters no longer
 *   works, so what do you use instead? Also be careful: `s[i]` and
 *   `s.length` work on UTF-16 code units, not characters. An emoji such as
 *   "😀" is TWO code units. Iterating with `for (const ch of s)` walks
 *   whole code points.
 */

// ▶ Run tests:   npm run solve valid-anagram
// ⟳ Watch mode:  npm run watch valid-anagram

/**
 * Checks whether `t` is an anagram of `s`, i.e. both strings contain the
 * same characters with the same multiplicities.
 *
 * @param {string} s - First string (lowercase English letters).
 * @param {string} t - Second string (lowercase English letters).
 * @returns {boolean} True if `t` is a rearrangement of `s`, false otherwise.
 */
export function isAnagram(s, t) {
  // Your code here
}
