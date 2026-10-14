/*
 * Title:      Container With Most Water
 * Difficulty: Medium
 * Patterns:   Two Pointers, Greedy
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array `height` of n non-negative integers. Picture n
 * vertical lines on the x-axis: line i stands at x = i and is height[i]
 * tall.
 *
 * Choose two different lines. Together with the x-axis they form a
 * container; the water it holds is
 *
 *     area = min(height[i], height[j]) × (j − i)
 *
 * (the shorter line decides the water level, the distance decides the
 * width). Return the largest area any pair of lines can hold.
 *
 *   • The lines in between do NOT block anything — only the two chosen
 *     lines matter. (That's a different problem: Trapping Rain Water.)
 *   • You can't tilt the container.
 *   • Return only the area.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
 *     Output: 49
 *     Why:    Lines at x = 1 (height 8) and x = 8 (height 7):
 *             min(8, 7) × (8 − 1) = 7 × 7 = 49.
 *
 *   Example 2
 *     Input:  height = [1, 1]
 *     Output: 1
 *
 *   Example 3
 *     Input:  height = [4, 3, 2, 1, 4]
 *     Output: 16
 *     Why:    The two outer 4s: min(4, 4) × 4 = 16.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 2 <= height.length <= 10^5
 *   • 0 <= height[i] <= 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time, O(1) extra space. Checking all pairs is O(n²), and the tests
 *   include 100,000 lines.
 */

// ▶ Run tests:   npm run solve container-with-most-water
// ⟳ Watch mode:  npm run watch container-with-most-water

/**
 * Finds the maximum amount of water a container formed by two of the lines can hold.
 *
 * @param {number[]} height - Line heights; line i stands at x = i.
 * @returns {number} The largest value of min(height[i], height[j]) × (j − i) over all i < j.
 */
export function maxArea(height) {
  // Your code here
}
