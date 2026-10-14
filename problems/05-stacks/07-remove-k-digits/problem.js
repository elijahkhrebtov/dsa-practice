/*
 * Title:      Remove K Digits
 * Difficulty: Medium
 * Patterns:   Monotonic Stack, Greedy
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given a non-negative integer as a string of decimal digits,
 * `num`, and an integer `k`. Remove exactly `k` digits from `num` so that
 * the number made of the remaining digits (kept in their original order)
 * is as SMALL as possible. Return that number as a string.
 *
 *   • You may not reorder digits — only delete them.
 *   • The returned string must not have leading zeros: "0200" → "200".
 *   • If nothing is left, or only zeros are left, return "0".
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  num = "1432219", k = 3
 *     Output: "1219"
 *     Why:    Remove 4, 3 and the first 2. Every other choice of three
 *             digits gives a bigger number.
 *
 *   Example 2
 *     Input:  num = "10200", k = 1
 *     Output: "200"
 *     Why:    Removing the leading 1 leaves "0200", which is written "200".
 *
 *   Example 3
 *     Input:  num = "10", k = 2
 *     Output: "0"
 *     Why:    Every digit is removed; the empty result is "0".
 *
 *   Example 4
 *     Input:  num = "12345", k = 2
 *     Output: "123"
 *     Why:    The digits already increase, so the best you can do is drop
 *             the two LAST digits.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= num.length <= 10^5
 *   • 0 <= k <= num.length
 *   • num consists only of digits and has no leading zeros, except when
 *     num is exactly "0".
 *   • The input is far too long for Number or BigInt arithmetic tricks to
 *     help: think in terms of digits.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(n) space. Repeating "find the best single digit to
 *   delete, delete it" k times is O(n·k), which is far too slow for the
 *   100,000-digit performance test.
 */

// ▶ Run tests:   npm run solve remove-k-digits
// ⟳ Watch mode:  npm run watch remove-k-digits

/**
 * Removes exactly `k` digits from `num` to make the smallest possible number.
 *
 * @param {string} num - A non-negative integer written as a string of digits, without leading zeros.
 * @param {number} k - How many digits to remove (0 <= k <= num.length).
 * @returns {string} The smallest possible remaining number, without leading zeros ("0" if nothing remains).
 */
export function removeKdigits(num, k) {
  // Your code here
}
