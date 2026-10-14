/*
 * Title:      N-Queens
 * Difficulty: Hard
 * Patterns:   Backtracking
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Place n chess queens on an n × n board so that no two queens attack each
 * other. A queen attacks every square in its row, its column, and both of
 * its diagonals — so no two queens may share a row, a column or a diagonal.
 *
 * Return ALL distinct solutions for the given n.
 *
 *   • Each solution is an array of n strings, one per row (top to bottom).
 *     Each string has length n: 'Q' marks a queen and '.' an empty square.
 *   • The solutions may be returned in any order.
 *   • If no placement exists, return an empty array.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  n = 4
 *     Output: [[".Q..",        [["..Q.",
 *               "...Q",          "Q...",
 *               "Q...",          "...Q",
 *               "..Q."],         ".Q.."]]
 *     Why:    these two boards (mirror images of each other) are the only
 *             ways to place 4 non-attacking queens.
 *
 *   Example 2
 *     Input:  n = 1
 *     Output: [["Q"]]
 *
 *   Example 3
 *     Input:  n = 3
 *     Output: []
 *     Why:    for n = 2 and n = 3 every placement has two queens attacking
 *             each other.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= n <= 9
 *   • Number of solutions for n = 1..9: 1, 0, 0, 2, 10, 4, 40, 92, 352.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Backtracking, one queen per row, with O(1) attack checks (keep track of
 *   which columns and diagonals are taken). Roughly O(n!) time in the worst
 *   case and O(n) extra space besides the output. n = 9 should take a few
 *   milliseconds.
 */

// ▶ Run tests:   npm run solve n-queens
// ⟳ Watch mode:  npm run watch n-queens

/**
 * Finds every way to place n non-attacking queens on an n × n board.
 *
 * @param {number} n - Board size and number of queens.
 * @returns {string[][]} All solutions in any order; each is n strings of length n using 'Q' and '.'.
 */
export function solveNQueens(n) {
  // Your code here
}
