/*
 * Title:      Unique Paths II
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A robot stands in the top-left cell of an m × n grid `obstacleGrid` and
 * wants to reach the bottom-right cell. At every step it may move only one
 * cell RIGHT or one cell DOWN.
 *
 * Each cell is either free (0) or an obstacle (1). The robot can never
 * enter an obstacle cell.
 *
 * Return the number of distinct paths from the top-left corner to the
 * bottom-right corner.
 *
 *   • If the start or the end cell is an obstacle, the answer is 0.
 *   • A 1 × 1 grid holding 0 has exactly 1 path (the robot is already there).
 *   • Do not modify `obstacleGrid`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  obstacleGrid = [[0, 0, 0],      S . .
 *                             [0, 1, 0],      . # .
 *                             [0, 0, 0]]      . . E
 *     Output: 2
 *     Why:    right → right → down → down, or down → down → right → right.
 *             Every other route would pass through the centre obstacle.
 *
 *   Example 2
 *     Input:  obstacleGrid = [[0, 1],         S #
 *                             [0, 0]]         . E
 *     Output: 1
 *
 *   Example 3
 *     Input:  obstacleGrid = [[0, 0, 0, 0],   S . . .
 *                             [0, 0, 0, 0]]   . . . E
 *     Output: 4
 *     Why:    the single DOWN move can happen in any of the 4 columns.
 *
 *   Example 4
 *     Input:  obstacleGrid = [[1, 0]]
 *     Output: 0
 *     Why:    the robot starts on an obstacle.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • m == obstacleGrid.length, n == obstacleGrid[i].length
 *   • 1 <= m, n <= 100
 *   • obstacleGrid[i][j] is 0 or 1
 *   • The answer is at most 2 · 10^9 (so a plain JS number holds it exactly).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(m · n) time. Trying every path recursively is exponential: an empty
 *   16 × 16 grid already has 155,117,520 paths, and the tests include it.
 *   Aim for O(n) extra space (one row of counts).
 */

// ▶ Run tests:   npm run solve unique-paths-ii
// ⟳ Watch mode:  npm run watch unique-paths-ii

/**
 * Counts the right/down paths from the top-left to the bottom-right cell that avoid every obstacle.
 *
 * @param {number[][]} obstacleGrid - m × n grid where 0 is a free cell and 1 is an obstacle; must not be modified.
 * @returns {number} The number of distinct obstacle-free paths (0 if the start or the end is blocked).
 */
export function uniquePathsWithObstacles(obstacleGrid) {
  // Your code here
}
