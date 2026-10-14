/*
 * Title:      Spiral Matrix
 * Difficulty: Medium
 * Patterns:   Matrix Traversal, Simulation
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an m × n matrix, return all of its elements in spiral order:
 * start at the top-left corner and walk clockwise around the outer ring
 * (right along the top row, down the right column, left along the bottom
 * row, up the left column), then continue with the next ring inside, and
 * so on until every element has been visited exactly once.
 *
 *   • Return a new array of length m·n. The order matters.
 *   • The matrix does not have to be square.
 *   • Do NOT modify `matrix`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  matrix = [[1, 2, 3],
 *                       [4, 5, 6],
 *                       [7, 8, 9]]
 *     Output: [1, 2, 3, 6, 9, 8, 7, 4, 5]
 *
 *             → → ↓
 *             ↑ → ↓        1 2 3 → 6 9 → 8 7 → 4 → 5
 *             ↑ ← ←
 *
 *   Example 2
 *     Input:  matrix = [[1,  2,  3,  4],
 *                       [5,  6,  7,  8],
 *                       [9, 10, 11, 12]]
 *     Output: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
 *     Why:    After the outer ring, only the middle row segment [6, 7] is
 *             left. It is walked once, left to right, and must not be
 *             walked back again right to left.
 *
 *   Example 3
 *     Input:  matrix = [[1], [2], [3]]
 *     Output: [1, 2, 3]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= m, n <= 1000 (m = matrix.length, n = matrix[0].length)
 *   • -1000 <= matrix[r][c] <= 1000
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(m·n) time and O(1) extra space besides the output. The tests include a
 *   1000 × 1000 matrix: tricks like "take the first row, then rotate what's
 *   left of the matrix" copy the matrix over and over and are too slow.
 */

// ▶ Run tests:   npm run solve spiral-matrix
// ⟳ Watch mode:  npm run watch spiral-matrix

/**
 * Lists the elements of a matrix in clockwise spiral order.
 *
 * @param {number[][]} matrix - An m × n matrix (not modified).
 * @returns {number[]} All m·n elements in spiral order, starting at the top-left corner.
 */
export function spiralOrder(matrix) {
  // Your code here
}
