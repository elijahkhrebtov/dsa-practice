/*
 * Title:      Longest Increasing Path in a Matrix
 * Difficulty: Hard
 * Patterns:   Memoization, Graph DFS, Topological Sort
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an m × n grid of integers `matrix`, return the length of the
 * longest strictly increasing path in it.
 *
 *   • From a cell you may move to any of its 4 neighbours (up, down, left,
 *     right). No diagonal moves, no wrapping around the edges.
 *   • Every step must go to a STRICTLY larger value (equal values don't
 *     count as increasing).
 *   • The length of a path is the number of cells on it, so a single cell
 *     is a path of length 1 and the answer is always at least 1.
 *   • Do not modify `matrix`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  matrix = [[9, 9, 4],         9  9  4
 *                       [6, 6, 8],         6  6  8
 *                       [2, 1, 1]]        (2)(1) 1
 *     Output: 4
 *     Why:    1 → 2 → 6 → 9, i.e. (2,1) → (2,0) → (1,0) → (0,0).
 *
 *   Example 2
 *     Input:  matrix = [[3, 4, 5],        (3)(4)(5)
 *                       [3, 2, 6],         3  2 (6)
 *                       [2, 2, 1]]         2  2  1
 *     Output: 4
 *     Why:    3 → 4 → 5 → 6. Moving 3 → 3 is not allowed (not strictly
 *             larger).
 *
 *   Example 3
 *     Input:  matrix = [[7]]
 *     Output: 1
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • m == matrix.length, n == matrix[i].length
 *   • 1 <= m, n <= 200
 *   • 0 <= matrix[i][j] <= 2^31 - 1
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(m · n) time and space. Exploring every path from every cell is
 *   exponential — the tests include a 200 × 200 grid where that takes
 *   seconds (and real inputs can take hours).
 *
 *   JavaScript gotcha: the longest path can snake through ~20,000 cells.
 *   A recursive DFS then needs a call stack that deep, which overflows
 *   Node's stack (roughly 10,000 frames). The tests include such a snake,
 *   so make your solution iterative — an explicit stack, or process cells
 *   layer by layer.
 */

// ▶ Run tests:   npm run solve longest-increasing-path-in-a-matrix
// ⟳ Watch mode:  npm run watch longest-increasing-path-in-a-matrix

/**
 * Finds the length of the longest path of strictly increasing values moving up/down/left/right.
 *
 * @param {number[][]} matrix - m × n grid of non-negative integers; must not be modified.
 * @returns {number} The number of cells on the longest strictly increasing path (at least 1).
 */
export function longestIncreasingPath(matrix) {
  // Your code here
}
