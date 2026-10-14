/*
 * Title:      Word Search II
 * Difficulty: Hard
 * Patterns:   Trie, Backtracking, Matrix Traversal
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an m × n grid of lowercase letters `board` and a list of
 * distinct words `words`. Return every word from `words` that can be
 * spelled on the board.
 *
 * A word is spelled by a path of cells:
 *
 *   • the path starts at any cell and moves step by step to a
 *     horizontally or vertically adjacent cell (no diagonals, no wrapping
 *     around the edges);
 *   • the letters along the path, in order, spell the word;
 *   • a single cell may be used at most once within the same word. Different
 *     words may reuse the same cells.
 *
 * Each found word appears in the result exactly once, even if it can be
 * spelled along several paths. The result may be in any order (the tests
 * sort it before comparing). The board must be unchanged when your
 * function returns. You may modify it temporarily while searching, as long
 * as you restore it.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  board = [["o","a","a","n"],
 *                      ["e","t","a","e"],
 *                      ["i","h","k","r"],
 *                      ["i","f","l","v"]],
 *             words = ["oath", "pea", "eat", "rain"]
 *     Output: ["eat", "oath"]   (in any order)
 *     Why:    "oath" = o(0,0) → a(0,1) → t(1,1) → h(2,1).
 *             "eat" = e(1,3) → a(1,2) → t(1,1).
 *             There is no 'p', and the only 'r' has no 'a' next to it.
 *
 *   Example 2
 *     Input:  board = [["a","b"],
 *                      ["c","d"]],
 *             words = ["abcb"]
 *     Output: []
 *     Why:    Spelling "abcb" would need the single 'b' twice.
 *
 *   Example 3
 *     Input:  board = [["a","b"],
 *                      ["c","d"]],
 *             words = ["ab", "abdc", "ad", "ba", "x"]
 *     Output: ["ab", "abdc", "ba"]   (in any order)
 *     Why:    "ad" would need a diagonal step, and there's no 'x'.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= m, n <= 12
 *   • board[i][j] is a lowercase English letter.
 *   • 0 <= words.length <= 3 * 10^4, all words distinct
 *   • 1 <= words[i].length <= 10, lowercase English letters
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Explore each board path once for ALL words together, instead of
 *   running a separate search per word. Words sharing a prefix should share
 *   the work of exploring that prefix, and a path should be abandoned as
 *   soon as its letters aren't a prefix of any remaining word. The
 *   performance test uses a 12×12 board and ~4,400 words that all start
 *   with a long common prefix, where a per-word DFS takes seconds.
 */

// ▶ Run tests:   npm run solve word-search-ii
// ⟳ Watch mode:  npm run watch word-search-ii

/**
 * Finds all words from the list that can be traced on the board through adjacent cells.
 *
 * @param {string[][]} board - Grid of single lowercase letters (must be unchanged on return).
 * @param {string[]} words - Distinct candidate words.
 * @returns {string[]} The words that can be spelled on the board, each once, in any order.
 */
export function findWords(board, words) {
  // Your code here
}
