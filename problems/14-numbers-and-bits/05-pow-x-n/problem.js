/*
 * Title:      Pow(x, n)
 * Difficulty: Medium
 * Patterns:   Divide & Conquer, Math
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Implement `myPow(x, n)`, which returns x raised to the power n (x^n).
 *
 *   • x is a floating-point number, n is an integer (possibly negative).
 *   • x^0 = 1 for any non-zero x.
 *   • A negative exponent means a reciprocal: x^-n = 1 / x^n.
 *   • Do not use Math.pow or the ** operator (the tests block Math.pow;
 *     ** can't be detected, so that part is on the honor system).
 *
 * The result is compared with a small relative tolerance, so tiny
 * floating-point rounding differences are fine.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  x = 2, n = 10
 *     Output: 1024
 *
 *   Example 2
 *     Input:  x = 2.1, n = 3
 *     Output: 9.261 (approximately)
 *
 *   Example 3
 *     Input:  x = 2, n = -2
 *     Output: 0.25
 *     Why:    2^-2 = 1 / 2^2 = 1 / 4.
 *
 *   Example 4
 *     Input:  x = 1.0000000001, n = 2147483647
 *     Output: 1.23954996520... (approximately)
 *     Why:    n is huge, so multiplying x by itself n times takes billions
 *             of steps.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • -100 < x < 100
 *   • -2^31 <= n <= 2^31 - 1 (n can be the most negative 32-bit integer)
 *   • x !== 0 or n > 0 (no 0^0, no division by zero)
 *   • The exact value of x^n is at most 10^4 in absolute value. Results too
 *     small to represent (e.g. 2^(-2^31)) underflow to 0, and 0 is the
 *     expected answer for them.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(log |n|) multiplications and O(1) extra space (or O(log |n|) for a
 *   recursive version). A loop of |n| multiplications is O(n) and takes
 *   seconds for n near 2^31. The performance tests check exactly that.
 */

// ▶ Run tests:   npm run solve pow-x-n
// ⟳ Watch mode:  npm run watch pow-x-n

/**
 * Computes x raised to the integer power n without Math.pow or `**`.
 *
 * @param {number} x - The base (-100 < x < 100).
 * @param {number} n - The integer exponent, possibly negative (32-bit range).
 * @returns {number} x^n as a floating-point number.
 */
export function myPow(x, n) {
  // Your code here
}
