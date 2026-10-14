/*
 * Title:      Maximum XOR of Two Numbers in an Array
 * Difficulty: Medium
 * Patterns:   Trie, Bit Manipulation
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array of non-negative integers `nums`, return the maximum value
 * of `nums[i] XOR nums[j]` over all pairs of indices with 0 <= i <= j < n.
 *
 *   • XOR (`^` in JavaScript) sets a bit to 1 where the two numbers' bits
 *     differ, and to 0 where they agree.
 *   • i may equal j, and x XOR x = 0, so the answer is never negative. For a
 *     single-element array it is 0.
 *   • Return the value itself (a non-negative number), not the indices.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [3, 10, 5, 25, 2, 8]
 *     Output: 28
 *     Why:    5 XOR 25 = 00101 XOR 11001 = 11100 = 28.
 *
 *   Example 2
 *     Input:  nums = [14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]
 *     Output: 127
 *
 *   Example 3
 *     Input:  nums = [8]
 *     Output: 0
 *
 *   Example 4
 *     Input:  nums = [0, 2147483647]
 *     Output: 2147483647   (2^31 - 1: all 31 low bits differ)
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 2 * 10^5
 *   • 0 <= nums[i] <= 2^31 - 1, so every number fits in 31 bits.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n · 31) time: process each number bit by bit, a constant number of
 *   times. Trying every pair is O(n²), and the performance test (120,000
 *   numbers, about 7 · 10^9 pairs) makes that take several seconds.
 *
 *   JavaScript note: bitwise operators work on signed 32-bit integers.
 *   Bits 0–30 are safe with `(x >> b) & 1` and `1 << b`. If you ever touch
 *   bit 31, `1 << 31` is negative, and `>>> 0` converts back to unsigned.
 */

// ▶ Run tests:   npm run solve maximum-xor-of-two-numbers
// ⟳ Watch mode:  npm run watch maximum-xor-of-two-numbers

/**
 * Finds the largest XOR of any two elements (an element may pair with itself, giving 0).
 *
 * @param {number[]} nums - Non-negative integers below 2^31.
 * @returns {number} The maximum of `nums[i] ^ nums[j]` over all pairs.
 */
export function findMaximumXOR(nums) {
  // Your code here
}
