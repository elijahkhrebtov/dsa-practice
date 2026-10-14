/*
 * Title:      Sum of Two Integers
 * Difficulty: Medium
 * Patterns:   Bit Manipulation
 *
 * Solution — Sum of Two Integers
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Adding one column of bits gives:
 *
 *     a b │ sum carry
 *     0 0 │  0    0
 *     0 1 │  1    0
 *     1 0 │  1    0
 *     1 1 │  0    1
 *
 * The sum column is XOR, and the carry column is AND. Doing it for all 32
 * columns at once:
 *
 *     a ^ b          = the sum of every column, ignoring incoming carries
 *     (a & b) << 1   = the carries, shifted to the column they flow into
 *
 * and a + b = (a ^ b) + ((a & b) << 1). That's another addition, but we can
 * apply the same rule to it again, and keep going until there's nothing
 * left to carry.
 *
 * Why it terminates: the carry always has at least one more trailing zero
 * than the previous carry (it's shifted left), so after at most 32 rounds
 * it is 0. JavaScript's bitwise operators work on 32-bit two's complement
 * and `<<` drops anything that moves past bit 31, which is exactly how a
 * 32-bit adder behaves. Negative numbers need no special handling: in two's
 * complement, adding a negative number is the same bit-level addition.
 *
 * Approach
 * ────────
 *   1. While b !== 0:
 *        carry = (a & b) << 1
 *        a     = a ^ b         (partial sum)
 *        b     = carry
 *   2. Return a (already a signed 32-bit number, because ^ returns one).
 *
 * Walkthrough — a = 2 (0b010), b = 3 (0b011)
 * ───────────
 *   round 1: carry = (010 & 011) << 1 = 100,  a = 010 ^ 011 = 001,  b = 100
 *   round 2: carry = (001 & 100) << 1 = 000,  a = 001 ^ 100 = 101,  b = 000
 *   b is 0 → return 0b101 = 5
 *
 * Walkthrough — a = -1 (all 32 bits set), b = 1
 * ───────────
 *   Each round clears one more low bit of a and moves the carry one
 *   position left: after round k, a = -2^k (as 32-bit) and b = 2^k. After
 *   round 31, b = 1 << 31 and a = -2^31. Round 32: carry = (a & b) << 1 = 0
 *   (the bit shifted out of the top is lost), a = a ^ b = 0. Return 0.
 *
 * Complexity
 * ──────────
 *   Time:  O(1) — at most 32 iterations for 32-bit inputs.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursive form: getSum(a, b) = b === 0 ? a : getSum(a ^ b, (a & b) << 1).
 *   • Languages with unbounded integers (Python) loop forever on negative
 *     inputs unless you mask with 0xFFFFFFFF each round and convert back to
 *     signed at the end. JavaScript's 32-bit bitwise operators do that
 *     masking for you.
 *   • Returning `a >>> 0` gives the unsigned reading of the bits:
 *     -2 would become 4294967294.
 *   • Subtraction, if you need it, is a + (~b + 1), since -b = ~b + 1 in two's
 *     complement, and the "+ 1" can itself be done with this function.
 */

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1; // columns where both bits are 1 carry into the next column
    a ^= b; // add every column without carries
    b = carry; // now add the carries (repeat until none are left)
  }
  return a;
}
