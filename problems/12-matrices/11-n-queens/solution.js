/*
 * Title:      N-Queens
 * Difficulty: Hard
 * Patterns:   Backtracking
 *
 * Solution — N-Queens
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Two queens can never share a row, so every solution has EXACTLY one queen
 * per row. That turns the problem into: for row 0, 1, …, n-1 in turn, choose
 * a column. Choosing row by row and abandoning a partial placement the
 * moment a queen is attacked is backtracking — we never even look at the
 * huge number of boards that start with an illegal prefix.
 *
 * Checking "is (r, c) attacked?" in O(1) needs three sets of taken lines:
 *   • columns:            c
 *   • "\" diagonals:      r - c is the same for every square on one
 *   • "/" anti-diagonals: r + c is the same for every square on one
 * Rows need no set — we place exactly one queen per row by construction.
 *
 * Approach
 * ────────
 *   1. queens[r] = column of the queen in row r (for rows placed so far).
 *   2. place(r):
 *        • if r === n: every row has a queen → convert `queens` into
 *          strings and record the board.
 *        • for each column c: skip if c, r - c or r + c is taken; otherwise
 *          mark all three, set queens[r] = c, recurse into place(r + 1), then
 *          UNMARK all three (backtrack) and try the next column.
 *   3. place(0) and return the collected boards.
 *
 * Walkthrough — n = 4
 * ───────────
 *   row 0: c=0  → row 1: c=0,1 attacked; c=2 ok → row 2: all attacked ✗
 *                          c=3 ok → row 2: c=1 ok → row 3: all attacked ✗
 *          (back up: no more options under row 0 c=0)
 *   row 0: c=1  → row 1: c=3 → row 2: c=0 → row 3: c=2 ✓  [".Q..","...Q","Q...","..Q."]
 *   row 0: c=2  → row 1: c=0 → row 2: c=3 → row 3: c=1 ✓  ["..Q.","Q...","...Q",".Q.."]
 *   row 0: c=3  → dead ends only.
 *   → 2 solutions.
 *
 * Complexity
 * ──────────
 *   Time:  O(n!) upper bound — row r has at most n - r free columns — and
 *          pruning on diagonals makes it far smaller in practice. Building
 *          each solution's strings costs O(n²) per solution.
 *   Space: O(n) for the recursion, the queen positions and the three sets
 *          (not counting the output).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all C(n², n) placements, or all n^n "one per row"
 *     placements, is hopeless beyond tiny n. Permutations of columns (n!)
 *     with a diagonal check at the end works for n ≤ 9 but wastes time on
 *     prefixes that are already broken.
 *   • Checking attacks by scanning all previous queens is O(n) per check —
 *     correct, just slower than the three sets.
 *   • Forgetting the anti-diagonal (r + c), or using r - c for both, lets
 *     attacking queens through. Note r - c can be negative: fine for a Set,
 *     but offset it by n - 1 if you use an array.
 *   • Build the strings only when a full solution is found, and push a NEW
 *     array — pushing a shared mutable array would make every recorded
 *     solution change as the search continues.
 *   • Faster still: bitmasks for columns/diagonals (the classic "N-Queens
 *     II" trick), same idea with machine-word operations.
 */

/**
 * @param {number} n
 * @returns {string[][]}
 */
export function solveNQueens(n) {
  const solutions = [];
  const queens = new Array(n); // queens[r] = column of the queen in row r
  const cols = new Set();
  const diagonals = new Set(); // r - c
  const antiDiagonals = new Set(); // r + c

  function place(r) {
    if (r === n) {
      // Every row has a queen: turn the column list into a fresh board.
      solutions.push(queens.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diagonals.has(r - c) || antiDiagonals.has(r + c)) continue; // attacked

      // choose
      queens[r] = c;
      cols.add(c);
      diagonals.add(r - c);
      antiDiagonals.add(r + c);

      place(r + 1);

      // un-choose (backtrack)
      cols.delete(c);
      diagonals.delete(r - c);
      antiDiagonals.delete(r + c);
    }
  }

  place(0);
  return solutions;
}
