/*
 * Title:      Counting Bits
 * Difficulty: Easy
 * Patterns:   Bit Manipulation, Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given a non-negative integer `n`, return an array `ans` of length n + 1
 * where `ans[i]` is the number of 1 bits in the binary representation of i,
 * for every i from 0 to n (inclusive). That count is often called the
 * "popcount" or "Hamming weight" of i.
 *
 * Return a plain array of numbers, in order of i.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  n = 2
 *     Output: [0, 1, 1]
 *     Why:    0 = 0b0, 1 = 0b1, 2 = 0b10.
 *
 *   Example 2
 *     Input:  n = 5
 *     Output: [0, 1, 1, 2, 1, 2]
 *     Why:    3 = 0b11 (two 1s), 4 = 0b100 (one), 5 = 0b101 (two).
 *
 *   Example 3
 *     Input:  n = 0
 *     Output: [0]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= n <= 10^6
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Counting the bits of each number separately is O(n log n) and passes the
 *   tests (the performance test uses n = 10^6 with a generous limit).
 *
 *   Follow-up: compute the whole array in O(n) time, a constant amount of
 *   work per entry, without any built-in popcount or string conversion.
 *   Each answer can be derived from an answer you've already computed.
 */

// ▶ Run tests:   npm run solve counting-bits
// ⟳ Watch mode:  npm run watch counting-bits

/**
 * Returns the number of set bits of every integer from 0 to n.
 *
 * @param {number} n - Largest integer to include (0 ≤ n ≤ 10^6).
 * @returns {number[]} Array of length n + 1 where element i is the popcount of i.
 */
export function countBits(n) {
  // Your code here
}
