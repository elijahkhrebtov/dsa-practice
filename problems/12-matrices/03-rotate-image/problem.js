/*
 * Title:      Rotate Image
 * Difficulty: Medium
 * Patterns:   Matrix Traversal
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an n × n matrix that represents an image. Rotate the image
 * by 90 degrees clockwise.
 *
 *   • Rotate IN PLACE: change the values inside the given `matrix`. Don't
 *     allocate another n × n matrix, and don't replace the row arrays
 *     with new ones. The tests check the matrix object you passed in, and
 *     check that its row arrays are the same objects as before (their order
 *     may change).
 *   • The function returns nothing (`undefined`).
 *
 * After a clockwise rotation, the old top row becomes the new right column,
 * the old left column becomes the new top row, and so on. Formally, the
 * value at (r, c) moves to (c, n - 1 - r).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  matrix = [[1, 2, 3],          After: [[7, 4, 1],
 *                       [4, 5, 6],                  [8, 5, 2],
 *                       [7, 8, 9]]                  [9, 6, 3]]
 *     Why:    The top row 1 2 3 is now the right column, read top to
 *             bottom. The centre 5 stays where it is.
 *
 *   Example 2
 *     Input:  matrix = [[ 5,  1,  9, 11],   After: [[15, 13,  2,  5],
 *                       [ 2,  4,  8, 10],           [14,  3,  4,  1],
 *                       [13,  3,  6,  7],           [12,  6,  8,  9],
 *                       [15, 14, 12, 16]]           [16,  7, 10, 11]]
 *
 *   Example 3
 *     Input:  matrix = [[1]]                After: [[1]]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • n == matrix.length == matrix[r].length
 *   • 1 <= n <= 1000
 *   • -1000 <= matrix[r][c] <= 1000
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n²) time and O(1) extra space. Every cell has to move, so O(n²) is
 *   optimal. The real challenge is moving them without a scratch copy.
 *
 *   Follow-up: how would you rotate counter-clockwise, or by 180°?
 */

// ▶ Run tests:   npm run solve rotate-image
// ⟳ Watch mode:  npm run watch rotate-image

/**
 * Rotates a square matrix 90° clockwise, in place.
 *
 * @param {number[][]} matrix - The n × n matrix to rotate (modified in place).
 * @returns {void} Nothing; `matrix` itself holds the rotated image afterwards.
 */
export function rotate(matrix) {
  // Your code here
}
