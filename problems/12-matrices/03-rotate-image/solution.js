/*
 * Title:      Rotate Image
 * Difficulty: Medium
 * Patterns:   Matrix Traversal
 *
 * Solution — Rotate Image
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A clockwise rotation sends (r, c) → (c, n - 1 - r). Writing that
 * directly needs a second matrix, because every write overwrites a value
 * that hasn't been moved yet. The trick is to split the rotation into two
 * moves that can each be done with simple swaps:
 *
 *   1. Transpose (mirror across the main diagonal): (r, c) → (c, r)
 *   2. Reverse every row (mirror left ↔ right):     (c, r) → (c, n - 1 - r)
 *
 * Together: (r, c) → (c, n - 1 - r). That's exactly the rotation.
 *
 *     1 2 3     transpose    1 4 7     reverse rows    7 4 1
 *     4 5 6    ──────────►   2 5 8    ─────────────►   8 5 2
 *     7 8 9                  3 6 9                     9 6 3
 *
 * Both steps are made of pairwise swaps, so no extra matrix is needed.
 *
 * Approach
 * ────────
 *   1. For every r and every c > r (strictly above the diagonal), swap
 *      matrix[r][c] with matrix[c][r]. Starting at c = r + 1 is essential:
 *      looping over ALL (r, c) swaps every pair twice, which undoes the
 *      transpose.
 *   2. For every row, reverse it in place (`row.reverse()`, or two
 *      pointers).
 *
 * Walkthrough — the 4 × 4 example
 * ───────────
 *   original           transposed          each row reversed
 *    5  1  9 11         5  2 13 15          15 13  2  5
 *    2  4  8 10   →     1  4  3 14    →     14  3  4  1
 *   13  3  6  7         9  8  6 12          12  6  8  9
 *   15 14 12 16        11 10  7 16          16  7 10 11   ✓
 *
 * Complexity
 * ──────────
 *   Time:  O(n²) — the transpose does n(n-1)/2 swaps and the reversals do
 *          n · n/2 swaps.
 *   Space: O(1) — only a temporary variable for swapping.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Four-way cycle, layer by layer: for each ring and each offset i,
 *     rotate the four cells top → right → bottom → left → top with one
 *     temporary. It's the same O(n²) time and O(1) space, and does a
 *     single pass, but the index arithmetic is easy to get wrong.
 *   • Building a rotated copy and then `matrix[r] = copy[r]` (or
 *     `matrix.splice(0, n, ...copy)`) passes a naive "check the values"
 *     test, but it uses O(n²) extra memory and replaces the row arrays,
 *     which is not in place.
 *   • Counter-clockwise = transpose, then reverse the ORDER of the rows
 *     (or reverse each column). 180° = reverse each row and the row order.
 *   • Using destructuring for swaps (`[a[i][j], a[j][i]] = [a[j][i], a[i][j]]`)
 *     is fine but allocates a small array per swap; a temp variable is
 *     faster on big inputs.
 */

/**
 * @param {number[][]} matrix
 * @returns {void}
 */
export function rotate(matrix) {
  const n = matrix.length;

  // 1. Transpose: swap across the main diagonal (only the upper triangle,
  //    otherwise every pair would be swapped twice and nothing would change).
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) {
      const tmp = matrix[r][c];
      matrix[r][c] = matrix[c][r];
      matrix[c][r] = tmp;
    }
  }

  // 2. Mirror left ↔ right: reverse each row in place.
  for (let r = 0; r < n; r++) {
    const row = matrix[r];
    for (let lo = 0, hi = n - 1; lo < hi; lo++, hi--) {
      const tmp = row[lo];
      row[lo] = row[hi];
      row[hi] = tmp;
    }
  }
}
