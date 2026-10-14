/*
 * Title:      Longest Increasing Path in a Matrix
 * Difficulty: Hard
 * Patterns:   Memoization, Graph DFS, Topological Sort
 *
 * Solution — Longest Increasing Path in a Matrix
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Draw an arrow from every cell to each neighbour holding a STRICTLY larger
 * value. Because values strictly increase along every arrow, you can never
 * come back to where you started: the arrows form a DAG (directed acyclic
 * graph). The problem becomes "longest path in a DAG", which is easy once
 * the cells are processed in a sensible order.
 *
 * Two classic ways to get that order:
 *
 *   (a) Memoized DFS: best(cell) = 1 + max(best(bigger neighbour)), cached.
 *       Each cell is solved once → O(m·n). The catch in JavaScript: the
 *       recursion can be as deep as the longest path (20,000+ calls), which
 *       overflows the call stack.
 *
 *   (b) Topological sort by peeling (Kahn's algorithm), used below. It is
 *       iterative by nature. Cells with NO larger neighbour are local peaks —
 *       every increasing path ends at one. Remove all peaks: that's layer 1.
 *       Now some cells have lost their last larger neighbour; they are the
 *       peaks of what remains: layer 2. Keep peeling. The number of layers
 *       equals the length of the longest increasing path.
 *
 * Why does the layer count equal the answer? A cell is peeled in layer k
 * exactly when the longest increasing path STARTING at it has k cells: it
 * can only go once all its larger neighbours are gone, and the last of them
 * left in layer k-1. So the final layer holds the starts of the longest
 * paths.
 *
 * Approach
 * ────────
 *   1. For every cell, outDegree = number of neighbours with a larger value.
 *   2. Queue every cell with outDegree 0 (the peaks).
 *   3. layers = 0. While the queue is non-empty:
 *        • layers++
 *        • for every cell in the current layer, look at each neighbour with a
 *          SMALLER value (it had an arrow into this cell): decrement its
 *          outDegree; if that hits 0, it belongs to the next layer.
 *   4. Return layers.
 *
 * Walkthrough — [[9,9,4],[6,6,8],[2,1,1]]
 * ───────────
 *   values:   9 9 4      out-degrees:  0 0 2
 *             6 6 8                    1 2 0
 *             2 1 1                    1 2 1
 *
 *   layer 1 (peaks): 9 (0,0), 9 (0,1), 8 (1,2)
 *     peeling them: 6 (1,0) → 0 ✓, 4 (0,2) → 0 ✓, 6 (1,1) → 0 ✓,
 *     1 (2,2) → 0 ✓
 *   layer 2: 6 (1,0), 4 (0,2), 6 (1,1), 1 (2,2)
 *     peeling them: 2 (2,0) → 0 ✓, 1 (2,1) → 1 (still waits for the 2)
 *   layer 3: 2 (2,0)
 *     peeling it:   1 (2,1) → 0 ✓
 *   layer 4: 1 (2,1)
 *   4 layers → answer 4  (the path 1 → 2 → 6 → 9 starts at (2,1))
 *
 * Complexity
 * ──────────
 *   Time:  O(m·n) — every cell enters the queue once and looks at 4
 *          neighbours twice (once to count, once to peel).
 *   Space: O(m·n) — out-degree array and the layer queues.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • DFS from every cell WITHOUT a memo re-explores the same paths again
 *     and again: exponential. A 200 × 200 grid of value r + c has more
 *     increasing paths than atoms in the universe.
 *   • Memoized recursive DFS is the most common answer and is correct; just
 *     convert it to an explicit stack (push a cell, push its unsolved larger
 *     neighbours, finalize a cell once all its neighbours are solved) when
 *     the path can be very long, as in JavaScript.
 *   • You don't need a `visited` set: strict increase already rules out
 *     cycles. Using `>=` instead of `>` creates cycles between equal
 *     neighbours and breaks everything.
 *   • Sorting all cells by value (descending) and doing the DP in that order
 *     also works: O(m·n·log(m·n)).
 */

/**
 * @param {number[][]} matrix
 * @returns {number}
 */
export function longestIncreasingPath(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // outDegree[id] = how many neighbours of cell id hold a strictly larger value.
  const outDegree = new Int32Array(m * n);
  let layer = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      let count = 0;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < m && nc < n && matrix[nr][nc] > matrix[r][c]) count++;
      }
      outDegree[r * n + c] = count;
      if (count === 0) layer.push(r * n + c); // a local peak: every path can end here
    }
  }

  let layers = 0;
  while (layer.length > 0) {
    layers++;
    const next = [];
    for (const id of layer) {
      const r = Math.floor(id / n);
      const c = id % n;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        // A smaller neighbour had an arrow into this cell; that arrow is now gone.
        if (nr >= 0 && nc >= 0 && nr < m && nc < n && matrix[nr][nc] < matrix[r][c]) {
          const nid = nr * n + nc;
          outDegree[nid]--;
          if (outDegree[nid] === 0) next.push(nid); // all its larger neighbours are peeled
        }
      }
    }
    layer = next;
  }

  return layers;
}
