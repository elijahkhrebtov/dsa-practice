/*
 * Title:      Search a 2D Matrix
 * Difficulty: Medium
 * Patterns:   Binary Search
 *
 * Solution — Search a 2D Matrix
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Because each row starts after the previous one ends, the matrix is just a
 * sorted array of length m·n that has been cut into rows of n:
 *
 *    [ 1,  3,  5,  7]
 *    [10, 11, 16, 20]   ≡   [1, 3, 5, 7, 10, 11, 16, 20, 23, 30, 34, 60]
 *    [23, 30, 34, 60]        0  1  2  3   4   5   6   7   8   9  10  11
 *
 * So we can binary search over the virtual indices 0 … m·n − 1 without
 * building the flat array. We only need to convert a flat index to a
 * cell:
 *
 *    row = Math.floor(i / n),   col = i % n      (n = number of COLUMNS)
 *
 * Approach
 * ────────
 *   1. lo = 0, hi = m·n − 1.
 *   2. While lo <= hi:
 *        mid = (lo + hi) >>> 1;  value = matrix[floor(mid / n)][mid % n]
 *        value === target → return true
 *        value <  target  → lo = mid + 1
 *        value >  target  → hi = mid − 1
 *   3. Return false.
 *
 * Walkthrough — the example matrix (n = 4), target = 16
 * ───────────
 *   lo=0  hi=11  mid=5  → (1,1)=11 < 16  → lo=6
 *   lo=6  hi=11  mid=8  → (2,0)=23 > 16  → hi=7
 *   lo=6  hi=7   mid=6  → (1,2)=16 ✓ → true
 *
 *   target = 8: mid=5 (11) → hi=4; mid=2 (5) → lo=3; mid=3 (7) → lo=4;
 *   mid=4 (10) → hi=3; lo > hi → false.
 *
 * Complexity
 * ──────────
 *   Time:  O(log(m·n)) — one binary search over m·n virtual positions.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Two binary searches: first find the last row whose first element is
 *     <= target, then search inside that row. O(log m + log n) =
 *     O(log(m·n)), same thing, a bit more code.
 *   • Staircase search from the top-right corner (move left if too big, down
 *     if too small): O(m + n). That's the right tool for "Search a 2D
 *     Matrix II", where rows and columns are sorted separately, but here it
 *     ignores the stronger guarantee.
 *   • `matrix.flat().includes(target)` or nested loops: O(m·n) per call.
 *   • The classic bug: dividing by m (rows) instead of n (columns) to get the
 *     row. It works on square matrices and fails on 3 × 4 ones.
 *   • `(lo + hi) >>> 1` avoids the float you'd get from `(lo + hi) / 2`. A
 *     non-integer index silently reads `undefined`.
 */

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @returns {boolean}
 */
export function searchMatrix(matrix, target) {
  const m = matrix.length;
  const n = matrix[0].length;
  let lo = 0;
  let hi = m * n - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const value = matrix[Math.floor(mid / n)][mid % n]; // flat index → (row, col)
    if (value === target) return true;
    if (value < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return false;
}
