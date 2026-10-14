/*
 * Title:      Counting Bits
 * Difficulty: Easy
 * Patterns:   Bit Manipulation, Dynamic Programming
 *
 * Solution — Counting Bits
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Counting the bits of every number from scratch costs O(log i) each. But
 * the binary form of i is just the binary form of i >> 1 (i with its last
 * bit dropped) with one more bit appended at the end:
 *
 *     i = 13 = 0b1101      i >> 1 = 6 = 0b110      last bit = i & 1 = 1
 *
 * So popcount(i) = popcount(i >> 1) + (i & 1). Since i >> 1 < i, its
 * answer is already in the table when we fill entries in increasing order.
 * That turns the problem into a DP where every entry costs O(1).
 *
 * Approach
 * ────────
 *   1. ans = array of n + 1 zeros (ans[0] = 0: zero has no set bits).
 *   2. For i = 1 … n: ans[i] = ans[i >> 1] + (i & 1).
 *   3. Return ans.
 *
 * Walkthrough — n = 5
 * ───────────
 *   i=1  0b1    ans[0] + 1 = 1
 *   i=2  0b10   ans[1] + 0 = 1
 *   i=3  0b11   ans[1] + 1 = 2
 *   i=4  0b100  ans[2] + 0 = 1
 *   i=5  0b101  ans[2] + 1 = 2      → [0, 1, 1, 2, 1, 2]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one shift, one AND and one lookup per entry.
 *   Space: O(1) besides the O(n) output array.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • ans[i] = ans[i & (i - 1)] + 1: i & (i - 1) clears the lowest set bit,
 *     so it's i with exactly one fewer 1. Also O(n).
 *   • "Most significant bit" DP: ans[i] = 1 + ans[i - highestPowerOfTwo(i)],
 *     tracking the current power of two as you go.
 *   • Per-number popcount: `while (x) { x &= x - 1; c++; }` costs one
 *     iteration per set bit. O(n log n) worst case, and still fast for 10^6.
 *   • i.toString(2) and counting '1' characters works, but allocates a
 *     string per number and is the slowest option.
 *   • Precedence trap: `ans[i >> 1] + i & 1` parses as
 *     `(ans[i >> 1] + i) & 1`. Parenthesize (i & 1).
 */

/**
 * @param {number} n
 * @returns {number[]}
 */
export function countBits(n) {
  const ans = new Array(n + 1).fill(0); // ans[0] = 0
  for (let i = 1; i <= n; i++) {
    // i is (i >> 1) with the bit (i & 1) appended on the right
    ans[i] = ans[i >> 1] + (i & 1);
  }
  return ans;
}
