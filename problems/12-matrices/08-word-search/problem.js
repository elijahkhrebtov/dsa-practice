/*
 * Title:      Word Search
 * Difficulty: Medium
 * Patterns:   Backtracking, Matrix Traversal
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an m × n grid of characters `board` and a string `word`.
 * Return `true` if `word` can be spelled by a path through the grid, and
 * `false` otherwise.
 *
 *   • The path starts at any cell and moves one step at a time to a
 *     horizontally or vertically adjacent cell (no diagonals, no wrapping
 *     around the edges).
 *   • The letters along the path, in order, must spell `word` exactly.
 *   • The same cell may NOT be used more than once in a single path.
 *   • Letters are case-sensitive: 'a' and 'A' are different.
 *   • When the function returns, `board` must be exactly as it was. (It's
 *     fine to modify it temporarily while searching, as long as you put
 *     everything back.)
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   For all three examples:
 *
 *     board =  A B C E
 *              S F C S
 *              A D E E
 *
 *   Example 1
 *     Input:  word = "ABCCED"
 *     Output: true
 *     Why:    A(0,0) → B(0,1) → C(0,2) → C(1,2) → E(2,2) → D(2,1)
 *
 *   Example 2
 *     Input:  word = "SEE"
 *     Output: true
 *     Why:    S(1,3) → E(2,3) → E(2,2)
 *
 *   Example 3
 *     Input:  word = "ABCB"
 *     Output: false
 *     Why:    after A → B → C the only B nearby is the one already used.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • m == board.length, n == board[i].length
 *   • 1 <= m, n <= 6
 *   • 1 <= word.length <= 15
 *   • board and word consist of English letters (upper- and lowercase).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Backtracking: in the worst case O(m · n · 3^L) for a word of length L
 *   (4 directions for the first step, then at most 3, since you can't step
 *   back onto the cell you came from), with O(L) extra space for the
 *   recursion. The tests include a nasty all-'A' board; a plain, correct
 *   backtracking search handles it in well under a second.
 *
 *   Follow-up: can you prune the search so that the all-'A' board with a
 *   word that ends in a letter the board doesn't even contain is rejected
 *   instantly?
 */

// ▶ Run tests:   npm run solve word-search
// ⟳ Watch mode:  npm run watch word-search

/**
 * Decides whether `word` can be traced through adjacent, non-repeating cells of `board`.
 *
 * @param {string[][]} board - m × n grid of single characters; must be unchanged when the function returns.
 * @param {string} word - The word to look for (case-sensitive).
 * @returns {boolean} `true` if some path of distinct, 4-directionally adjacent cells spells `word`.
 */
export function exist(board, word) {
  // Your code here
}
