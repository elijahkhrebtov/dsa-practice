/*
 * Title:      Flood Fill
 * Difficulty: Easy
 * Patterns:   Matrix Traversal, Graph DFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * An image is an m × n grid of integers, where image[r][c] is the colour
 * of the pixel in row r, column c. You're also given a starting pixel
 * (sr, sc) and a new colour `color`.
 *
 * Do what the "paint bucket" tool in a drawing program does: change the
 * colour of the starting pixel, and of every pixel connected to it through
 * pixels of the SAME ORIGINAL colour, to `color`.
 *
 *   • Two pixels are connected if they share an edge: up, down, left or
 *     right. Diagonal pixels do NOT count as connected.
 *   • Pixels of the original colour that can't be reached from (sr, sc)
 *     keep their colour.
 *   • Return the resulting image. You may (and are expected to) modify
 *     `image` in place and return it.
 *   • If `color` is already the colour of the starting pixel, nothing
 *     changes: return the image as it is.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  image = [[1, 1, 1],        sr = 1, sc = 1, color = 2
 *                      [1, 1, 0],
 *                      [1, 0, 1]]
 *     Output:         [[2, 2, 2],
 *                      [2, 2, 0],
 *                      [2, 0, 1]]
 *     Why:    The region of 1s around (1, 1) becomes 2. The 1 in the
 *             bottom-right corner only touches the region diagonally, so it
 *             stays 1.
 *
 *   Example 2
 *     Input:  image = [[0, 0, 0],        sr = 0, sc = 0, color = 0
 *                      [0, 0, 0]]
 *     Output:         [[0, 0, 0],
 *                      [0, 0, 0]]
 *     Why:    The new colour equals the old one, so there is nothing to do.
 *
 *   Example 3
 *     Input:  image = [[5, 3, 5],        sr = 0, sc = 0, color = 9
 *                      [5, 3, 5],
 *                      [5, 5, 5]]
 *     Output:         [[9, 3, 9],
 *                      [9, 3, 9],
 *                      [9, 9, 9]]
 *     Why:    The right column is reached by going around the 3s through
 *             the bottom row.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= m, n <= 500 (m = image.length, n = image[0].length)
 *   • 0 <= image[r][c], color < 2^16
 *   • 0 <= sr < m, 0 <= sc < n
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(m·n) time: each pixel is recoloured at most once. Two traps the tests
 *   check: (1) when `color` equals the original colour, a naive fill keeps
 *   "discovering" the same pixels forever; (2) a 500 × 500 image of one
 *   colour makes a recursive DFS go ~250,000 calls deep, which overflows
 *   the call stack. Use an explicit stack or queue for the large case.
 */

// ▶ Run tests:   npm run solve flood-fill
// ⟳ Watch mode:  npm run watch flood-fill

/**
 * Recolours the 4-connected region of the starting pixel's colour.
 *
 * @param {number[][]} image - The m × n grid of pixel colours (may be modified in place).
 * @param {number} sr - Row of the starting pixel.
 * @param {number} sc - Column of the starting pixel.
 * @param {number} color - The new colour for the region.
 * @returns {number[][]} The image after the fill.
 */
export function floodFill(image, sr, sc, color) {
  // Your code here
}
