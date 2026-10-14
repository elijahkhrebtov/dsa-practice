/*
 * Title:      Decode Ways
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A message made of capital letters is encoded into digits with the mapping
 *
 *     'A' → "1",  'B' → "2",  …,  'Z' → "26"
 *
 * and the codes are written one after another without separators. Given
 * the encoded string `s`, return the NUMBER of different letter messages
 * that could have produced it.
 *
 * Decoding means cutting `s` into consecutive pieces where every piece is
 * one of the 26 codes "1" … "26":
 *
 *   • A piece is one digit "1"–"9", or two digits "10"–"26".
 *   • "0" on its own is not a code, and a code never has a leading zero,
 *     so "06" is NOT the same as "6" — it can't be decoded at all.
 *   • If no valid cutting exists, return 0.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "12"
 *     Output: 2
 *     Why:    "AB" (1 2) or "L" (12).
 *
 *   Example 2
 *     Input:  s = "226"
 *     Output: 3
 *     Why:    "BZ" (2 26), "VF" (22 6), "BBF" (2 2 6).
 *
 *   Example 3
 *     Input:  s = "06"
 *     Output: 0
 *     Why:    "0" is not a letter and "06" is not a valid code.
 *
 *   Example 4
 *     Input:  s = "100"
 *     Output: 0
 *     Why:    The first zero must pair up as "10", leaving a lone "0".
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= s.length <= 100
 *   • `s` contains only digits '0'–'9' (it may start with or contain zeros).
 *   • The answer is guaranteed to fit in a 32-bit signed integer
 *     (at most 2^31 − 1), so a regular JS number is exact.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   The count grows like the Fibonacci numbers, so listing decodings one by
 *   one is hopeless: a 40-digit string of 1s and 2s already has over 165
 *   million of them, and the tests include it. Aim for O(n) time; O(1)
 *   extra space is a nice follow-up.
 */

// ▶ Run tests:   npm run solve decode-ways
// ⟳ Watch mode:  npm run watch decode-ways

/**
 * Counts the ways a digit string can be decoded into letters ('1' → A … '26' → Z).
 *
 * @param {string} s - The encoded message, digits only.
 * @returns {number} The number of distinct decodings (0 if none exist).
 */
export function numDecodings(s) {
  // Your code here
}
