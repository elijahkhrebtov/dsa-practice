/*
 * Title:      Find if Path Exists in Graph
 * Difficulty: Easy
 * Patterns:   Graph BFS, Graph DFS, Union-Find
 *
 * Solution — Find if Path Exists in Graph
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * "Can I get from A to B?" is the most basic graph question there is. Start
 * at `source`, repeatedly step to neighbours you haven't seen yet, and stop
 * as soon as you touch `destination`. If you run out of new vertices first,
 * `destination` lives in a different connected component.
 *
 * Two practical details make or break it:
 *   • An edge list is useless for "who are my neighbours?" (you'd scan all
 *     edges every time). Convert it to an adjacency list first.
 *   • The graph has cycles, so you must mark vertices as visited — otherwise
 *     you walk around a cycle forever.
 *
 * Approach (BFS with a head-index queue)
 * ──────────────────────────────────────
 *   1. If source === destination, return true.
 *   2. Build `adj = Array.from({ length: n }, () => [])` and, for every edge
 *      [u, v], push v into adj[u] AND u into adj[v] (undirected).
 *   3. Mark source as visited and put it in a queue.
 *   4. While the queue is non-empty: take the front vertex; for every
 *      unvisited neighbour, return true if it is the destination, otherwise
 *      mark it visited and enqueue it.
 *   5. The queue emptied without meeting destination → return false.
 *
 * Mark vertices visited when you ENQUEUE them, not when you dequeue them —
 * otherwise the same vertex can sit in the queue many times.
 *
 * Walkthrough — n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], 0 → 5
 * ───────────
 *   adj: 0:[1,2] 1:[0] 2:[0] 3:[5,4] 4:[5,3] 5:[3,4]
 *   queue [0]       visited {0}
 *   pop 0 → enqueue 1, 2          visited {0,1,2}
 *   pop 1 → neighbour 0 already visited
 *   pop 2 → neighbour 0 already visited
 *   queue empty, 5 never seen → false
 *
 * Complexity
 * ──────────
 *   Time:  O(n + E) — building the adjacency list touches each edge twice;
 *          the BFS dequeues each vertex at most once and scans each
 *          adjacency entry at most once.
 *   Space: O(n + E) — adjacency list, visited array and queue.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursive DFS is the shortest code, but its recursion depth equals the
 *     length of the path it is exploring. Node's default stack fits roughly
 *     ten thousand frames, so a 200,000-vertex path throws
 *     "RangeError: Maximum call stack size exceeded". An explicit stack
 *     (`const stack = [source]; while (stack.length) …`) is a drop-in fix.
 *   • Union-find: union the endpoints of every edge, then answer
 *     find(source) === find(destination). Near O(E · α(n)) and needs no
 *     adjacency list — but use path compression (and ideally union by rank),
 *     or `find` can degrade to O(n) per call.
 *   • `queue.shift()` is O(n) per call in the worst case; a head index keeps
 *     dequeue O(1).
 *   • Forgetting the reverse edge (adj[v].push(u)) makes the graph directed
 *     and silently breaks half the queries.
 */

/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} source
 * @param {number} destination
 * @returns {boolean}
 */
export function validPath(n, edges, source, destination) {
  if (source === destination) return true;

  // Edge list → adjacency list (both directions: the graph is undirected).
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const visited = new Uint8Array(n);
  const queue = [source];
  visited[source] = 1;

  // Head index instead of shift(): dequeue stays O(1).
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    for (const next of adj[node]) {
      if (visited[next]) continue;
      if (next === destination) return true;
      visited[next] = 1; // mark on enqueue so nothing is queued twice
      queue.push(next);
    }
  }

  return false;
}
