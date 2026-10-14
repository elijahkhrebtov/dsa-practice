/*
 * Title:      Trapping Rain Water
 * Difficulty: Hard
 * Patterns:   Two Pointers, Prefix Sum
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * `height` describes an elevation map: bar i is `height[i]` units tall and
 * exactly 1 unit wide, and the bars stand side by side with no gaps. After
 * a heavy rain, water collects in the dips between bars. Water spills off
 * both ends of the map (there are no walls beyond the first and last bars).
 *
 * Return the total number of unit squares of water that stay trapped.
 * Do not modify `height`.
 *
 *   Example 1, drawn (█ = bar, ~ = water):
 *
 *                  █
 *          █ ~ ~ ~ █ █ ~ █
 *      █ ~ █ █ ~ █ █ █ █ █ █
 *     ─────────────────────────
 *      0 1 0 2 1 0 1 3 2 1 2 1
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
 *     Output: 6
 *
 *   Example 2
 *     Input:  height = [4, 2, 0, 3, 2, 5]
 *     Output: 9
 *     Why:    the columns hold 2, 4, 1, 2 units (the water level is 4,
 *             limited by the left wall).
 *
 *   Example 3
 *     Input:  height = [1, 2, 3, 2, 1]
 *     Output: 0
 *     Why:    a single peak — water runs off both sides.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= height.length <= 2 * 10^4 (the performance test uses 4 * 10^4)
 *   • 0 <= height[i] <= 10^5
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. Recomputing the tallest bar to the left and right of every
 *   position (O(n²)) is too slow for the performance test. Bonus: O(1) extra
 *   space.
 */

// ▶ Run tests:   npm run solve trapping-rain-water
// ⟳ Watch mode:  npm run watch trapping-rain-water

/**
 * Computes how much rain water an elevation map traps.
 *
 * @param {number[]} height - Non-negative bar heights, each bar 1 unit wide (not modified).
 * @returns {number} Total trapped water, in unit squares.
 */
export function trap(height) {
  // Your code here
}
