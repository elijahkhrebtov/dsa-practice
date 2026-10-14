/*
 * Title:      Sort Colors
 * Difficulty: Medium
 * Patterns:   Two Pointers
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array `nums` of n objects colored red, white or blue,
 * encoded as the integers 0 (red), 1 (white) and 2 (blue).
 *
 * Sort the array IN PLACE so that all 0s come first, then all 1s, then all
 * 2s.
 *
 *   • Modify `nums` itself — the tests inspect the array you were given.
 *     Whatever you return is ignored.
 *   • Do not use the built-in `Array.prototype.sort` (the tests disable it).
 *   • Don't replace the contents with a freshly built array either; rewrite
 *     the elements of `nums` directly.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [2, 0, 2, 1, 1, 0]
 *     After:  nums = [0, 0, 1, 1, 2, 2]
 *
 *   Example 2
 *     Input:  nums = [2, 0, 1]
 *     After:  nums = [0, 1, 2]
 *
 *   Example 3
 *     Input:  nums = [1, 1]
 *     After:  nums = [1, 1]
 *     Why:    Some colors may be missing entirely.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 2·10^5
 *   • nums[i] is 0, 1 or 2.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space. Counting the three colors and then
 *   overwriting the array takes two passes; aim for a SINGLE pass with
 *   constant extra space (the "Dutch national flag" problem). The
 *   performance test uses 150,000 elements, which rules out O(n²) sorts like
 *   insertion or bubble sort.
 */

// ▶ Run tests:   npm run solve sort-colors
// ⟳ Watch mode:  npm run watch sort-colors

/**
 * Sorts an array of 0s, 1s and 2s in place.
 *
 * @param {number[]} nums - Array containing only 0, 1 and 2. Modified in place.
 * @returns {void} Nothing — the result is the mutated `nums`.
 */
export function sortColors(nums) {
  // Your code here
}
