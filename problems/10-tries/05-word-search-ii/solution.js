/*
 * Title:      Word Search II
 * Difficulty: Hard
 * Patterns:   Trie, Backtracking, Matrix Traversal
 *
 * Solution — Word Search II
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Searching for one word is a classic backtracking DFS: start at every cell
 * whose letter matches the word's first letter, step to unvisited
 * neighbours that match the next letter, and undo the "visited" mark on the
 * way back. Doing that separately for each of thousands of words repeats
 * the same exploration over and over. Every word starting with "aaaa"
 * re-walks every "aaaa" path on the board.
 *
 * A trie of all the words removes the repetition. Walk the board ONCE per
 * start cell and move through the trie at the same time. A board path
 * survives only while its letters spell a prefix of SOME word (the trie
 * child exists), and when the trie node marks the end of a word, we've
 * found it. All words sharing a prefix share the exploration of that
 * prefix.
 *
 * Approach
 * ────────
 *   1. Build a trie of the words. At the node where a word ends, store the
 *      word itself (node.word = word) so we don't need to rebuild it from
 *      the path.
 *   2. For every cell (r, c), call dfs(r, c, root):
 *        a. ch = board[r][c]. If ch is the visited marker '#' or the trie
 *           node has no child ch, return.
 *        b. node = child. If node.word is set, record it and clear it, so
 *           the same word isn't reported twice.
 *        c. Mark the cell visited (board[r][c] = '#'), recurse into the 4
 *           neighbours inside the grid, then restore board[r][c] = ch.
 *        d. Pruning: if the child now has no children and no word left,
 *           delete it from its parent. Branches whose words have all been
 *           found are never explored again.
 *   3. Return the recorded words.
 *
 * Walkthrough — board  o a a n      words: oath, pea, eat, rain
 *                      e t a e
 *                      i h k r
 *                      i f l v
 * ───────────
 *   Trie roots: o, p, e, r.
 *   (0,0) 'o' → trie o → neighbours: (0,1) 'a' → trie oa → (1,1) 't' →
 *   trie oat → (2,1) 'h' → trie oath has word → record "oath".
 *   (1,0) 'e' → trie e → (1,1) 't'? trie e has only child 'a' → stop
 *   …(1,3) 'e' → (0,3)? 'n' no … (1,2) 'a' → trie ea → (1,1) 't' → "eat".
 *   "pea" dies at once (no 'p' on the board). For "rain", (2,3) 'r' needs
 *   an 'a' neighbour, and there is none. Result: ["oath", "eat"].
 *
 * Complexity
 * ──────────
 *   Let m×n be the board, L the maximum word length (≤ 10), W the total
 *   characters in all words.
 *   Time:  O(W) to build the trie. The search starts from each of the m·n
 *          cells, and each DFS step has at most 3 new directions (it can't
 *          go back), so the worst case is O(m·n · 4 · 3^(L−1)). The trie
 *          cuts this short in practice, and shared prefixes are explored
 *          once instead of once per word.
 *   Space: O(W) for the trie, O(L) recursion depth. The visited marks live
 *          in the board itself.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Run the Word Search I DFS separately for each word: simple, but it
 *     repeats shared-prefix work once per word. With thousands of words
 *     that share prefixes it's orders of magnitude slower.
 *   • Not clearing node.word after finding it reports a word once per path
 *     that spells it (duplicates in the output).
 *   • Forgetting to restore the cell after the recursion corrupts the board
 *     for later searches, and leaves the caller's board modified. A separate
 *     `visited` matrix works too, at the cost of extra memory.
 *   • The visited marker must be a character that never appears in any
 *     word ('#'). Then "is there a trie child for this cell?" also rejects
 *     visited cells, so no separate check is needed.
 *   • Pruning exhausted trie branches is optional for correctness but
 *     helps a lot when many words get found early.
 */

/**
 * @param {string[][]} board
 * @param {string[]} words
 * @returns {string[]}
 */
export function findWords(board, words) {
  // 1. Build the trie; the end node of each word stores the word itself.
  const root = { children: new Map(), word: null };
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      let next = node.children.get(ch);
      if (!next) {
        next = { children: new Map(), word: null };
        node.children.set(ch, next);
      }
      node = next;
    }
    node.word = w;
  }

  const rows = board.length;
  const cols = rows ? board[0].length : 0;
  const found = [];

  /**
   * Explores paths starting at (r, c), where `parent` is the trie node for the letters so far.
   * @param {number} r
   * @param {number} c
   * @param {{ children: Map<string, any>, word: string | null }} parent
   */
  function dfs(r, c, parent) {
    const ch = board[r][c];
    const node = parent.children.get(ch); // '#' (visited) never has a child, so it stops here too
    if (!node) return;

    if (node.word !== null) {
      found.push(node.word);
      node.word = null; // report each word once
    }

    board[r][c] = '#'; // mark visited for the current path
    if (r > 0) dfs(r - 1, c, node);
    if (r < rows - 1) dfs(r + 1, c, node);
    if (c > 0) dfs(r, c - 1, node);
    if (c < cols - 1) dfs(r, c + 1, node);
    board[r][c] = ch; // backtrack: restore the letter

    // Prune: a branch with no words left below it is useless from now on.
    if (node.children.size === 0 && node.word === null) parent.children.delete(ch);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (root.children.size === 0) return found; // every word already found
      dfs(r, c, root);
    }
  }
  return found;
}
