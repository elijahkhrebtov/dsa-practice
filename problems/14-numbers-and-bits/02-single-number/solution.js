/*
 * Title:      Single Number
 * Difficulty: Easy
 * Patterns:   Bit Manipulation
 *
 * Solution — Single Number
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * We need something that "remembers" every value seen an odd number of times
 * and "forgets" every value seen an even number of times, using a single
 * number of memory. XOR does exactly that, bit by bit:
 *
 *   • x ^ x = 0         (a value cancels itself)
 *   • x ^ 0 = x         (0 is the identity)
 *   • a ^ b = b ^ a and (a ^ b) ^ c = a ^ (b ^ c)
 *
 * Because order doesn't matter, XOR-ing the whole array is the same as
 * grouping each pair together: (a ^ a) ^ (b ^ b) ^ … ^ s = 0 ^ 0 ^ … ^ s = s.
 *
 * Looking at a single bit position makes it concrete: that bit is 1 in the
 * running XOR iff it's 1 in an odd number of elements. Paired values
 * contribute an even count to every bit, so only the single value's bits
 * survive.
 *
 * Approach
 * ────────
 *   1. result = 0
 *   2. For each x in nums: result ^= x
 *   3. Return result.
 *
 * Walkthrough — nums = [4, 1, 2, 1, 2]
 * ───────────
 *   result = 000
 *   ^ 4  → 100
 *   ^ 1  → 101
 *   ^ 2  → 111
 *   ^ 1  → 110
 *   ^ 2  → 100 = 4   ✓
 *
 * Negative numbers just work: JavaScript's ^ operates on 32-bit two's
 * complement and returns a signed 32-bit result, so -1 ^ 0 is -1, not
 * 4294967295. (Every input is a 32-bit integer, so nothing is truncated.)
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one pass.
 *   Space: O(1) — a single accumulator.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Map/Set of counts: O(n) time but O(n) space. A Set version: add the
 *     value if absent, delete it if present; the one left over is the answer.
 *   • Sort, then scan pairs (i, i + 1): O(n log n), and sorting in place
 *     mutates the caller's array. Also remember the default sort compares
 *     strings: [10, 9, 100].sort() → [10, 100, 9].
 *   • Math trick: 2·sum(distinct) − sum(all) = single. Still needs a Set
 *     (O(n) space), and in fixed-width languages the sums can overflow.
 *   • Nested loop counting each value: O(n²), seconds for 10^5 elements.
 *   • Returning `result >>> 0` would turn negative answers into large
 *     positive ones. Leave the signed result as is.
 */

/**
 * @param {number[]} nums
 * @returns {number}
 */
export function singleNumber(nums) {
  let result = 0;
  for (const x of nums) {
    result ^= x; // pairs cancel (x ^ x = 0); the single value is what remains
  }
  return result;
}
