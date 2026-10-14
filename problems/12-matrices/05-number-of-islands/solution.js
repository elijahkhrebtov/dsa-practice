/*
 * Title:      Number of Islands
 * Difficulty: Medium
 * Patterns:   Graph DFS, Graph BFS, Matrix Traversal
 *
 * Solution — Number of Islands
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The grid is a graph: land cells are nodes, and two land cells that share
 * an edge are connected. An island is a connected component, so the
 * question is "how many connected components does this graph have?"
 *
 * The standard way to count components: scan every cell. When you find
 * land that no earlier traversal has reached, it belongs to a NEW island.
 * Count it, then run a traversal (DFS or BFS) from it that marks its
 * entire island, so none of its other cells get counted again.
 *
 * Since we may modify the grid, "marking" can simply mean sinking the land:
 * '1' → '0'. That way we don't need a separate visited array.
 *
 * Approach
 * ────────
 *   1. count = 0.
 *   2. For every cell (r, c) in row-major order:
 *        if grid[r][c] === '1':
 *          count++
 *          sink it ('0') and push it on a stack
 *          while the stack isn't empty: pop a cell; for each of its 4
 *          neighbours that is in bounds and still '1', sink it and push it.
 *   3. Return count.
 *
 * Sinking a cell at the moment it's PUSHED (not when it's popped) means no
 * cell can be pushed twice.
 *
 * Walkthrough — Example 2
 * ───────────
 *   (0,0) is '1' → count 1; the traversal sinks (0,0) (0,1) (1,0) (1,1).
 *   (0,1) … (2,1) are now '0' or water.
 *   (2,2) is '1' → count 2; its 4 neighbours are all water, so only (2,2)
 *         sinks. (1,1) and (3,3) touch it diagonally, which doesn't count.
 *   (3,3) is '1' → count 3; the traversal sinks (3,3) and (3,4).
 *   Result: 3.
 *
 * Complexity
 * ──────────
 *   Time:  O(m·n) — the scan visits each cell once, and each land cell is
 *          pushed/popped at most once and checks 4 neighbours.
 *   Space: O(m·n) in the worst case for the explicit stack (e.g. a grid
 *          that is all land). The grid is reused as the visited marker.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursive DFS is the shortest code, but a long winding island makes
 *     the recursion as deep as the island is long. On the 1000 × 1000 snake
 *     test that is ~500,000 frames, and Node throws "Maximum call stack size
 *     exceeded" after ~10,000.
 *   • BFS with a queue is equally good. Use a head index, not `shift()`.
 *   • Union-Find: union every land cell with its land neighbours to the
 *     right and below, then count the roots. O(m·n·α) and handy when land
 *     arrives incrementally ("Number of Islands II").
 *   • If modifying the input weren't allowed, use a `visited` grid (or a
 *     flat Uint8Array indexed by r·n + c).
 *   • Comparing with the number 1 (`grid[r][c] === 1`) never matches: the
 *     cells are strings.
 *   • Including diagonal neighbours merges islands that should be separate.
 */

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

/**
 * @param {string[][]} grid
 * @returns {number}
 */
export function numIslands(grid) {
  const m = grid.length;
  const n = grid[0].length;
  let count = 0;

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== '1') continue;

      // Unvisited land: a brand-new island. Sink all of it iteratively.
      count++;
      grid[r][c] = '0';
      const stack = [r * n + c]; // flat indices: cheaper than [r, c] pairs

      while (stack.length > 0) {
        const cell = stack.pop();
        const cr = Math.floor(cell / n);
        const cc = cell % n;
        for (const [dr, dc] of DIRS) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
          if (grid[nr][nc] !== '1') continue;
          grid[nr][nc] = '0'; // sink on push → never pushed twice
          stack.push(nr * n + nc);
        }
      }
    }
  }

  return count;
}
