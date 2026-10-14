/*
 * Title:      Pow(x, n)
 * Difficulty: Medium
 * Patterns:   Divide & Conquer, Math
 *
 * Solution — Pow(x, n)
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * x^n with n multiplications is O(n): about 2 billion multiplications for
 * n = 2^31 − 1. But powers combine nicely:
 *
 *     x^n = (x^(n/2))^2            if n is even
 *     x^n = x · (x^((n−1)/2))^2    if n is odd
 *
 * so one squaring halves the remaining exponent. That's O(log n) steps.
 *
 * The iterative form reads the binary digits of n. With n = 13 = 0b1101:
 *
 *     x^13 = x^8 · x^4 · x^1        (the powers x^(2^k) for every 1 bit)
 *
 * Keep squaring `base` (x, x^2, x^4, x^8, …) and multiply it into the result
 * whenever the current lowest bit of the exponent is 1.
 *
 * Negative exponents: x^n = (1/x)^|n|. Taking 1/x up front keeps a single
 * loop (computing x^|n| and dividing at the end works too).
 *
 * Approach (iterative exponentiation by squaring)
 * ───────────────────────────────────────────────
 *   1. If n < 0: base = 1/x and e = −n. Otherwise base = x and e = n.
 *   2. result = 1.
 *   3. While e > 0:
 *        a. If e is odd: result *= base.
 *        b. base *= base.
 *        c. e = Math.floor(e / 2).
 *   4. Return result.
 *
 * Walkthrough — x = 3, n = 13 (0b1101)
 * ───────────
 *   e = 13 (odd)  result = 1·3     = 3        base → 9        e → 6
 *   e = 6  (even)                              base → 81       e → 3
 *   e = 3  (odd)  result = 3·81    = 243      base → 6561     e → 1
 *   e = 1  (odd)  result = 243·6561 = 1594323 base → …        e → 0
 *   → 1594323 = 3^13 ✓
 *
 * Complexity
 * ──────────
 *   Time:  O(log |n|) — at most 32 iterations for a 32-bit n.
 *   Space: O(1) for the loop (the recursive version uses O(log |n|) stack).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Linear loop: O(|n|), seconds for |n| ≈ 2^31.
 *   • Recursive: half = myPow(x, n / 2 rounded down); return n even ?
 *     half · half : half · half · x. Compute `half` ONCE. Writing
 *     myPow(x, n/2) * myPow(x, n/2) makes two calls per level, which brings
 *     back O(n) time.
 *   • n = −2^31: in JS, −n = 2^31 is a perfectly good number, but it doesn't
 *     fit in a signed 32-bit integer. `e >> 1` turns 2^31 into −2^30, so the
 *     loop exits early with a wrong answer. Use Math.floor(e / 2) or
 *     `e >>> 1` (in C/Java, negating −2^31 overflows, so you'd widen to a
 *     64-bit long first).
 *   • `e % 2 === 1` is safe here because e ≥ 0. For negative values,
 *     % returns −1, so check `e % 2 !== 0` or use (e & 1) when in range.
 *   • Precision: each squaring rounds a little, and for n ≈ 2^31 the relative
 *     error can reach ~1e-8. That's the nature of floating point, not a bug.
 *     Math.pow is a bit more accurate because it uses exp/log internally.
 */

/**
 * @param {number} x
 * @param {number} n
 * @returns {number}
 */
export function myPow(x, n) {
  // Handle a negative exponent by inverting the base: x^-k = (1/x)^k.
  let base = n < 0 ? 1 / x : x;
  let e = Math.abs(n); // up to 2^31, fine as a JS number (but NOT as an int32)

  let result = 1;
  while (e > 0) {
    if (e % 2 === 1) result *= base; // this bit of the exponent is set
    base *= base; // x^(2^k) → x^(2^(k+1))
    e = Math.floor(e / 2); // drop the lowest bit (safe for e = 2^31, unlike e >> 1)
  }
  return result;
}
