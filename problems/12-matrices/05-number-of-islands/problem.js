/*
 * Title:      Number of Islands
 * Difficulty: Medium
 * Patterns:   Graph DFS, Graph BFS, Matrix Traversal
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an m × n map `grid` where every cell is the string '1'
 * (land) or '0' (water). Count the islands.
 *
 *   • An island is a maximal group of land cells connected horizontally or
 *     vertically. Diagonal contact does NOT connect two cells.
 *   • Everything outside the grid is water.
 *   • The cells are STRINGS: '1' and '0', not numbers.
 *   • You may modify `grid` (e.g. sink the land you've already counted);
 *     the tests always pass a fresh grid.
 *   • A grid with no land has 0 islands.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  grid = [['1','1','1','1','0'],
 *                     ['1','1','0','1','0'],
 *                     ['1','1','0','0','0'],
 *                     ['0','0','0','0','0']]
 *     Output: 1
 *
 *   Example 2
 *     Input:  grid = [['1','1','0','0','0'],
 *                     ['1','1','0','0','0'],
 *                     ['0','0','1','0','0'],
 *                     ['0','0','0','1','1']]
 *     Output: 3
 *     Why:    The 2×2 block, the single cell in the middle and the pair at
 *             the bottom right. The middle cell touches its neighbours only
 *             at the corners, which doesn't count.
 *
 *   Example 3
 *     Input:  grid = [['1','1','1'],
 *                     ['1','0','1'],
 *                     ['1','1','1']]
 *     Output: 1
 *     Why:    A ring of land around a lake is still one island.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= m, n <= 1000 (m = grid.length, n = grid[0].length)
 *   • grid[r][c] is '0' or '1'
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(m·n) time: every cell is visited a constant number of times. The
 *   tests include 1000 × 1000 grids, among them one winding snake-shaped
 *   island of ~500,000 cells. A recursive DFS on it goes far deeper than
 *   the call stack allows (~10,000 frames), so use an explicit stack or a
 *   queue (BFS).
 */

// ▶ Run tests:   npm run solve number-of-islands
// ⟳ Watch mode:  npm run watch number-of-islands

/**
 * Counts the 4-connected groups of land cells in a grid.
 *
 * @param {string[][]} grid - The m × n map of '1' (land) and '0' (water); may be modified.
 * @returns {number} The number of islands.
 */
export function numIslands(grid) {
  // Your code here
}
