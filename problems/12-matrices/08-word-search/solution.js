/*
 * Title:      Word Search
 * Difficulty: Medium
 * Patterns:   Backtracking, Matrix Traversal
 *
 * Solution — Word Search
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Think of the search as exploring a tree: the root is "nothing matched
 * yet", each level matches one more letter of `word`, and the children of a
 * cell are its up/down/left/right neighbours. We walk this tree depth-first
 * and abandon a branch the moment its letter doesn't match. That is
 * backtracking: choose a cell, recurse, then UNDO the choice before trying
 * the next one.
 *
 * The "no cell twice" rule needs a visited marker that exists only for the
 * cells on the CURRENT path. The cheapest marker is the board itself:
 * overwrite the cell with a sentinel ('#') while it's on the path and put the
 * letter back when we return. Because every mark is undone on the way out,
 * the board is unchanged when the function returns.
 *
 * Approach
 * ────────
 *   0. (Optional pruning) Count letters on the board. If the board lacks
 *      enough copies of some letter in `word`, return false immediately. If
 *      the last letter of `word` is rarer on the board than the first,
 *      search for the reversed word instead — fewer starting points, and
 *      dead branches die sooner. (Any path read backwards is still a path.)
 *   1. For every cell, try dfs(r, c, 0).
 *   2. dfs(r, c, i):
 *        • if (r, c) is off the board or board[r][c] !== word[i] → false
 *          (this also rejects '#', so the current path is never re-entered)
 *        • if i is the last index → true
 *        • mark board[r][c] = '#'
 *        • found = dfs on the 4 neighbours with i + 1 (stop at the first true)
 *        • restore board[r][c], return found
 *
 * Walkthrough — board ABCE / SFCS / ADEE, word "ABCB"
 * ───────────
 *   start (0,0) 'A' ✓  mark → try neighbours for 'B'
 *     (0,1) 'B' ✓  mark → need 'C'
 *       (0,2) 'C' ✓  mark → need 'B': neighbours are (0,3)'E', (1,2)'C',
 *                    and (0,1) which is '#' → all fail; unmark (0,2)
 *       (1,1) 'F' ✗ ... every option fails; unmark (0,1)
 *     (1,0) 'S' ✗; unmark (0,0)
 *   no other cell holds 'A' that leads anywhere → false. Board restored.
 *
 * Complexity
 * ──────────
 *   Time:  O(m · n · 3^L) worst case for word length L: m·n start cells,
 *          4 choices for the first step, then at most 3 (we never step back
 *          onto the previous cell). In practice mismatches prune hard.
 *   Space: O(L) for the recursion stack; marking happens in place.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • A separate `visited` boolean grid (or a Set of "r,c" keys) works too,
 *     as long as you remove the cell again when backtracking. Copying the
 *     visited set at every step is correct but much slower.
 *   • Forgetting to unmark after a FAILED branch makes later paths through
 *     those cells impossible (the "ABCESEEEFS" test).
 *   • Returning `true` straight from the middle of the loop without
 *     restoring the cell leaves '#' on the board. Compute the result, then
 *     restore, then return.
 *   • Checking `i === word.length` AFTER moving to a neighbour (instead of
 *     at the last letter) is fine too, but then a 1-letter word on a 1×1
 *     board must still work — test the base case carefully.
 *   • The all-'A' board with "AAA…B" is the classic worst case. The letter
 *     count check in step 0 rejects it in O(m·n + L).
 */

/**
 * @param {string[][]} board
 * @param {string} word
 * @returns {boolean}
 */
export function exist(board, word) {
  const m = board.length;
  const n = board[0].length;
  if (word.length > m * n) return false;

  // ── Optional pruning ───────────────────────────────────────────────────
  const boardCount = new Map();
  for (const row of board) for (const ch of row) boardCount.set(ch, (boardCount.get(ch) ?? 0) + 1);
  const wordCount = new Map();
  for (const ch of word) wordCount.set(ch, (wordCount.get(ch) ?? 0) + 1);
  for (const [ch, need] of wordCount) {
    if ((boardCount.get(ch) ?? 0) < need) return false; // not enough of this letter anywhere
  }
  // Start from the rarer end of the word: fewer start cells, earlier dead ends.
  const target = (boardCount.get(word[0]) ?? 0) > (boardCount.get(word[word.length - 1]) ?? 0)
    ? [...word].reverse().join('')
    : word;

  // ── Backtracking ───────────────────────────────────────────────────────
  const last = target.length - 1;

  function dfs(r, c, i) {
    if (r < 0 || c < 0 || r >= m || c >= n) return false;
    if (board[r][c] !== target[i]) return false; // also rejects '#' (cell already on the path)
    if (i === last) return true;

    const saved = board[r][c];
    board[r][c] = '#'; // choose: put this cell on the current path
    const found =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);
    board[r][c] = saved; // un-choose: always restore, whether we found it or not
    return found;
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}
