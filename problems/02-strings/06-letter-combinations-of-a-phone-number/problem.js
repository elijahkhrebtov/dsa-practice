/*
 * Title:      Letter Combinations of a Phone Number
 * Difficulty: Medium
 * Patterns:   Backtracking
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * On an old phone keypad, each digit from 2 to 9 is mapped to letters:
 *
 *     2 → abc     3 → def     4 → ghi     5 → jkl
 *     6 → mno     7 → pqrs    8 → tuv     9 → wxyz
 *
 * Given a string `digits` made of the characters '2'–'9', return every
 * string that the digit sequence could spell: pick one letter for each
 * digit, keeping the digits' order.
 *
 *   • The result may be returned in ANY order (the tests sort it).
 *   • Each combination must appear exactly once.
 *   • If `digits` is empty, return an empty array `[]` (not `[""]`).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  digits = "23"
 *     Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
 *     Why:    3 choices for '2' × 3 choices for '3' = 9 strings.
 *
 *   Example 2
 *     Input:  digits = ""
 *     Output: []
 *
 *   Example 3
 *     Input:  digits = "2"
 *     Output: ["a","b","c"]
 *
 *   Example 4
 *     Input:  digits = "79"
 *     Output: 16 strings, "pw", "px", "py", "pz", "qw", … , "sz"
 *     Why:    '7' and '9' each have four letters.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= digits.length <= 6 (LeetCode stops at 4; the tests go up to 6,
 *     which can produce 4^6 = 4,096 strings)
 *   • Every character of `digits` is in '2'–'9'.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   The output itself has up to 4^n strings of length n, so O(4^n · n) time
 *   is optimal. Focus on a clean backtracking (or iterative) construction.
 */

// ▶ Run tests:   npm run solve letter-combinations-of-a-phone-number
// ⟳ Watch mode:  npm run watch letter-combinations-of-a-phone-number

/**
 * Lists every letter string that a sequence of phone digits can spell.
 *
 * @param {string} digits - Digits '2'–'9' (may be empty).
 * @returns {string[]} All combinations, one letter per digit, in any order; `[]` for empty input.
 */
export function letterCombinations(digits) {
  // Your code here
}
