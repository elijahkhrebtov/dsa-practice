/*
 * Title:      Pacific Atlantic Water Flow
 * Difficulty: Medium
 * Patterns:   Graph DFS, Matrix Traversal
 *
 * Solution — Pacific Atlantic Water Flow
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Asking "where can water from THIS cell go?" for every cell repeats the
 * same exploration over and over: O((m·n)²). Flip the question around:
 * "which cells can send water INTO the Pacific?" Start at the ocean and walk
 * the flow backwards — uphill. Water flows from a cell to a neighbour that
 * is lower or equal, so in reverse we may step from a cell to any neighbour
 * that is HIGHER OR EQUAL. Everything we can reach climbing from the Pacific
 * shore drains into the Pacific.
 *
 * Do the same from the Atlantic shore. A cell qualifies exactly when it was
 * reached by both floods.
 *
 * Approach (two reverse floods)
 * ─────────────────────────────
 *   1. pacific = flood starting from every cell in row 0 and column 0.
 *      atlantic = flood starting from every cell in row m-1 and column n-1.
 *   2. Each flood is a multi-source graph search (DFS with an explicit
 *      stack): pop a cell, look at its 4 neighbours, and push any unvisited
 *      neighbour whose height is >= the current cell's height.
 *   3. Return every cell marked in both floods.
 *
 * Walkthrough — heights = [[1, 2],
 *                          [3, 0]]
 * ───────────
 *   Pacific seeds: (0,0)=1, (0,1)=2, (1,0)=3. From (0,0) we could climb to
 *   (0,1) and (1,0) — already seeded. (1,1)=0 is lower than everything
 *   around it, so it is never reached.   pacific = {(0,0), (0,1), (1,0)}
 *   Atlantic seeds: (1,1)=0, (0,1)=2, (1,0)=3. From (0,1)=2 we cannot climb
 *   to (0,0)=1; from (1,0)=3 neither.   atlantic = {(1,1), (0,1), (1,0)}
 *   Both: (0,1) and (1,0).
 *
 * Complexity
 * ──────────
 *   Time:  O(m·n) — each flood visits every cell at most once and looks at
 *          4 neighbours per cell.
 *   Space: O(m·n) — two visited arrays and the stack.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Per-cell search (from each cell, explore downhill and check whether
 *     both oceans are touched): correct but O((m·n)²) — on 200 × 200 that is
 *     up to 1.6·10^9 steps.
 *   • BFS with a queue works just as well as DFS; the order doesn't matter,
 *     only reachability does. (Use a head index instead of `shift()`.)
 *   • Recursive DFS is the textbook version, but in JavaScript a large flat
 *     plateau makes the recursion as deep as the number of cells — 40,000
 *     frames overflow Node's stack. An explicit stack avoids that.
 *   • Direction bug: in the reverse search the condition is
 *     neighbour >= current (climbing). Writing <= floods downhill and gives
 *     nonsense.
 *   • Equal heights must be allowed (>=, not >) — water flows across flat
 *     ground.
 */

/**
 * @param {number[][]} heights
 * @returns {number[][]}
 */
export function pacificAtlantic(heights) {
  const m = heights.length;
  const n = heights[0].length;
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  /**
   * Marks every cell that can be reached by climbing (>=) from the seeds.
   * Cells are encoded as r * n + c so a flat typed array can be the visited set.
   */
  function flood(seeds) {
    const visited = new Uint8Array(m * n);
    const stack = [];
    for (const [r, c] of seeds) {
      const id = r * n + c;
      if (!visited[id]) {
        visited[id] = 1;
        stack.push(id);
      }
    }
    while (stack.length > 0) {
      const id = stack.pop();
      const r = Math.floor(id / n);
      const c = id % n;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
        const nid = nr * n + nc;
        // Reverse flow: water could come DOWN from the neighbour to us.
        if (visited[nid] || heights[nr][nc] < heights[r][c]) continue;
        visited[nid] = 1;
        stack.push(nid);
      }
    }
    return visited;
  }

  const pacificSeeds = [];
  const atlanticSeeds = [];
  for (let r = 0; r < m; r++) {
    pacificSeeds.push([r, 0]); // left edge
    atlanticSeeds.push([r, n - 1]); // right edge
  }
  for (let c = 0; c < n; c++) {
    pacificSeeds.push([0, c]); // top edge
    atlanticSeeds.push([m - 1, c]); // bottom edge
  }

  const pacific = flood(pacificSeeds);
  const atlantic = flood(atlanticSeeds);

  const result = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (pacific[r * n + c] && atlantic[r * n + c]) result.push([r, c]);
    }
  }
  return result;
}
