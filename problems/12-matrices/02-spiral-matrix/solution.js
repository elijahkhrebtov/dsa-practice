/*
 * Title:      Spiral Matrix
 * Difficulty: Medium
 * Patterns:   Matrix Traversal, Simulation
 *
 * Solution — Spiral Matrix
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The spiral is a sequence of rings. Keep four boundaries for the part of
 * the matrix that hasn't been visited yet: `top`, `bottom`, `left`,
 * `right`. Walking one side of the ring uses up a whole row or column, so
 * after each side we move the matching boundary inward by one:
 *
 *      left        right
 *       ↓            ↓
 *   top → 1  2  3  4        walk top row          → top++
 *         5  6  7  8        walk right column     → right--
 *  bottom→9 10 11 12        walk bottom row       → bottom--
 *                           walk left column      → left++
 *
 * The only tricky part is the end. When what's left is a single row or a
 * single column, walking "right" and then "left" (or "down" and then "up")
 * would visit the same cells twice. So we check that the region is still
 * non-empty before walking the bottom row and the left column.
 *
 * Approach
 * ────────
 *   1. top = 0, bottom = m - 1, left = 0, right = n - 1, result = [].
 *   2. While top <= bottom and left <= right:
 *        a. Top row, left → right: (top, left..right).        top++
 *        b. Right column, top → bottom: (top..bottom, right). right--
 *        c. If top <= bottom: bottom row, right → left.        bottom--
 *        d. If left <= right: left column, bottom → top.       left++
 *   3. Return result.
 *
 * Walkthrough — the 3 × 4 example
 * ───────────
 *   ring 1: top row 1 2 3 4 (top=1) · right col 8 12 (right=2)
 *           bottom row 11 10 9 (bottom=1) · left col 5 (left=1)
 *   ring 2: top row (row 1, cols 1..2) 6 7 (top=2)
 *           right col: rows 2..1 → empty (right=1)
 *           c: top=2 > bottom=1 → skip
 *           d: left=1 <= right=1, but r runs from bottom=1 up to top=2 → empty
 *   loop ends (top > bottom). Result: 1 2 3 4 8 12 11 10 9 5 6 7 ✓
 *   Without the check in step c, the leftover row would be walked back:
 *   …6 7 7 6 ✗.
 *
 * Complexity
 * ──────────
 *   Time:  O(m·n) — every cell is appended exactly once.
 *   Space: O(1) extra besides the output array.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Direction simulation: keep a direction index into
 *     [[0,1],[1,0],[0,-1],[-1,0]] and a visited grid, and turn right when
 *     the next cell is out of bounds or already visited. It's also O(m·n),
 *     but it needs O(m·n) extra space (or overwriting the input with a
 *     sentinel, which this problem forbids).
 *   • "Shift off the first row, then rotate the rest counter-clockwise"
 *     is a cute one-liner, but every rotation copies the remaining matrix:
 *     O(m·n·min(m, n)) time. It also destroys the input.
 *   • The bugs to watch for: forgetting the "still non-empty?" checks
 *     (duplicates on non-square inputs), and mixing up m and n.
 */

/**
 * @param {number[][]} matrix
 * @returns {number[]}
 */
export function spiralOrder(matrix) {
  const result = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // Top row, left → right.
    for (let c = left; c <= right; c++) result.push(matrix[top][c]);
    top++;

    // Right column, top → bottom.
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]);
    right--;

    // Bottom row, right → left — only if a row is still left to walk.
    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]);
      bottom--;
    }

    // Left column, bottom → top — only if a column is still left to walk.
    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);
      left++;
    }
  }

  return result;
}
