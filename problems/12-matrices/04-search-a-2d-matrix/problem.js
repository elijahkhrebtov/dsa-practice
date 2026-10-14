/*
 * Title:      Search a 2D Matrix
 * Difficulty: Medium
 * Patterns:   Binary Search
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an m × n integer matrix with two properties:
 *
 *   1. Each row is sorted in non-decreasing order (left to right).
 *   2. The first integer of each row is greater than the last integer of
 *      the previous row.
 *
 * Together they mean that reading the matrix row by row gives one long
 * sorted list. Given an integer `target`, return `true` if it appears in
 * the matrix and `false` otherwise. Do not modify `matrix`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   matrix = [[ 1,  3,  5,  7],
 *             [10, 11, 16, 20],
 *             [23, 30, 34, 60]]
 *
 *   Example 1
 *     Input:  matrix above, target = 3
 *     Output: true
 *
 *   Example 2
 *     Input:  matrix above, target = 13
 *     Output: false
 *     Why:    13 would sit between 11 and 16 in the second row, but it
 *             isn't there.
 *
 *   Example 3
 *     Input:  matrix above, target = 8
 *     Output: false
 *     Why:    8 falls in the gap between the end of row 0 (7) and the
 *             start of row 1 (10).
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= m, n <= 1000 (m = matrix.length, n = matrix[0].length)
 *   • -10^7 <= matrix[r][c], target <= 10^7
 *   • The matrix satisfies properties 1 and 2 above.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(log(m·n)) time per call, O(1) extra space. The performance test runs
 *   10,000+ searches on a 1000 × 1000 matrix: scanning the cells (O(m·n)
 *   each) is far too slow, and so is flattening the matrix on every call.
 */

// ▶ Run tests:   npm run solve search-a-2d-matrix
// ⟳ Watch mode:  npm run watch search-a-2d-matrix

/**
 * Reports whether `target` occurs in a row-wise sorted matrix whose rows continue one another.
 *
 * @param {number[][]} matrix - An m × n matrix; read row by row, it is sorted in non-decreasing order.
 * @param {number} target - The value to look for.
 * @returns {boolean} `true` if `target` is in the matrix, `false` otherwise.
 */
export function searchMatrix(matrix, target) {
  // Your code here
}
