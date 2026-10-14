/*
 * Title:      Sum of Two Integers
 * Difficulty: Medium
 * Patterns:   Bit Manipulation
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given two integers `a` and `b`, return their sum, **without using the
 * operators `+` or `-`** (that includes `+=`, `-=`, `++`, `--` and unary
 * minus on a variable). You also may not sidestep the rule with library
 * helpers that add for you (`Array.prototype.reduce` with `+`, `Math`
 * tricks such as logarithms, `eval`, string concatenation of digit
 * counts, …).
 *
 * Bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`), comparisons
 * and loops are all allowed. Using `+` in a loop counter is fine only if it
 * doesn't do the actual addition. Better yet, avoid it.
 *
 * The tests can't reliably detect which operators your code uses, so this
 * rule is on the honor system. The point is to understand how hardware
 * adds two's-complement integers.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  a = 1, b = 2
 *     Output: 3
 *
 *   Example 2
 *     Input:  a = 2, b = 3
 *     Output: 5
 *     Why:    0b010 + 0b011: the bits without carries give 0b001, the
 *             carries are 0b010 shifted left = 0b100; 0b001 + 0b100 = 0b101.
 *
 *   Example 3
 *     Input:  a = -2, b = 3
 *     Output: 1
 *     Why:    Negative numbers are stored in two's complement, so the same
 *             bit-level addition works for them too.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • a and b are 32-bit signed integers: -2^31 <= a, b <= 2^31 - 1
 *   • The true sum a + b is also within -2^31 … 2^31 - 1 (no overflow).
 *   • Return a normal signed JavaScript number: getSum(-3, 1) must be -2,
 *     not 4294967294.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(1) time: at most 32 rounds of carry propagation, regardless of the
 *   values. O(1) space.
 */

// ▶ Run tests:   npm run solve sum-of-two-integers
// ⟳ Watch mode:  npm run watch sum-of-two-integers

/**
 * Adds two 32-bit signed integers using only bitwise operations.
 *
 * @param {number} a - First addend (32-bit signed integer).
 * @param {number} b - Second addend (32-bit signed integer).
 * @returns {number} a + b as a signed 32-bit integer.
 */
export function getSum(a, b) {
  // Your code here
}
