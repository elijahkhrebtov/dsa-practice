/*
 * Title:      Valid Palindrome
 * Difficulty: Easy
 * Patterns:   Two Pointers
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A phrase is a palindrome if, after
 *
 *   1. dropping every character that is NOT a letter (a–z, A–Z) or a digit
 *      (0–9), and
 *   2. treating uppercase and lowercase letters as equal,
 *
 * it reads the same forwards and backwards.
 *
 * Given a string `s`, return `true` if it is a palindrome under these rules
 * and `false` otherwise.
 *
 *   • Only ASCII letters and digits count as "alphanumeric". Spaces,
 *     punctuation and every other symbol are ignored.
 *   • Digits are compared as-is ("1" only matches "1").
 *   • If nothing is left after filtering (empty string, or only symbols),
 *     the answer is `true` — an empty sequence reads the same both ways.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "A man, a plan, a canal: Panama"
 *     Output: true
 *     Why:    Filtered and lowercased it becomes "amanaplanacanalpanama".
 *
 *   Example 2
 *     Input:  s = "race a car"
 *     Output: false
 *     Why:    "raceacar" reversed is "racaecar".
 *
 *   Example 3
 *     Input:  s = " "
 *     Output: true
 *     Why:    Nothing alphanumeric remains, so the empty string is compared
 *             with itself.
 *
 *   Example 4
 *     Input:  s = "0P"
 *     Output: false
 *     Why:    "0" and "p" are different characters — a digit is never equal
 *             to a letter.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= s.length <= 2 * 10^5 (the performance test uses 10^6)
 *   • `s` consists of printable ASCII characters.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. Building a cleaned-up copy and reversing it is O(n) space;
 *   try to do it in O(1) extra space by comparing characters from both ends
 *   of the original string.
 */

// ▶ Run tests:   npm run solve valid-palindrome
// ⟳ Watch mode:  npm run watch valid-palindrome

/**
 * Checks whether a string is a palindrome, ignoring case and every
 * non-alphanumeric character.
 *
 * @param {string} s - The phrase to check (printable ASCII).
 * @returns {boolean} `true` if the filtered, case-folded string reads the same in both directions.
 */
export function isPalindrome(s) {
  // Your code here
}
