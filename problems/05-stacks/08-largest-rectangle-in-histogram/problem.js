/*
 * Title:      Largest Rectangle in Histogram
 * Difficulty: Hard
 * Patterns:   Monotonic Stack
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of non-negative integers `heights` describing a
 * histogram: bar i has width 1 and height `heights[i]`, and the bars stand
 * side by side with no gaps.
 *
 * Return the area of the largest axis-aligned rectangle that fits entirely
 * inside the histogram. Such a rectangle covers a contiguous range of bars
 * [l, r], and its height can be at most the SHORTEST bar in that range, so
 * its area is
 *
 *     min(heights[l..r]) × (r - l + 1)
 *
 * Return 0 if every bar has height 0.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  heights = [2, 1, 5, 6, 2, 3]
 *     Output: 10
 *     Why:    Bars 2..3 (heights 5 and 6) support a rectangle of height 5
 *             and width 2.
 *
 *                 █
 *               ▓ ▓
 *               ▓ ▓
 *               ▓ ▓   █
 *           █   ▓ ▓ █ █
 *           █ █ ▓ ▓ █ █
 *           2 1 5 6 2 3      (▓ = the area-10 rectangle)
 *
 *   Example 2
 *     Input:  heights = [2, 4]
 *     Output: 4
 *     Why:    Either the single bar of height 4, or height 2 across both.
 *
 *   Example 3
 *     Input:  heights = [6, 2, 5, 4, 5, 1, 6]
 *     Output: 12
 *     Why:    Bars 2..4 (heights 5, 4, 5) give height 4 × width 3.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= heights.length <= 10^5
 *   • 0 <= heights[i] <= 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(n) extra space. Trying every range (O(n²)), or
 *   expanding left and right from every bar (also O(n²) on sorted or flat
 *   input), will not survive the 70,000-bar performance tests.
 */

// ▶ Run tests:   npm run solve largest-rectangle-in-histogram
// ⟳ Watch mode:  npm run watch largest-rectangle-in-histogram

/**
 * Finds the area of the largest rectangle that fits inside a histogram.
 *
 * @param {number[]} heights - Bar heights (each bar has width 1), left to right.
 * @returns {number} The maximum rectangle area.
 */
export function largestRectangleArea(heights) {
  // Your code here
}
