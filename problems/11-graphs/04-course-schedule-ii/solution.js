/*
 * Title:      Course Schedule II
 * Difficulty: Medium
 * Patterns:   Topological Sort, Graph BFS
 *
 * Solution — Course Schedule II
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * An order that respects every "b before a" arrow is a TOPOLOGICAL ORDER
 * of the directed graph b → a. It exists exactly when the graph has no
 * cycle (that was Course Schedule I). Kahn's algorithm doesn't just answer
 * yes/no — the sequence in which it takes courses IS a valid order: a course
 * is only taken once all of its prerequisites have been taken.
 *
 * Approach (Kahn's algorithm, BFS on in-degrees)
 * ──────────────────────────────────────────────
 *   1. Build `next[b]` (courses b unlocks) and `indegree[a]` (number of
 *      prerequisite pairs for a, duplicates included).
 *   2. Queue every course with in-degree 0 — they can be taken right away.
 *   3. Repeatedly dequeue a course and append it to the order; decrement
 *      the in-degree of each course it unlocks and enqueue those that hit 0.
 *   4. If the order contains all numCourses courses, return it. Otherwise
 *      some courses were stuck on a cycle → return [].
 *
 * Neat trick: the queue array itself, read from index 0 to the end, is the
 * order. With a head index nothing is ever removed from it, so it can be
 * returned directly.
 *
 * Walkthrough — 4 courses, [[1,0],[2,0],[3,1],[3,2]]
 * ───────────
 *   next: 0→[1,2] 1→[3] 2→[3]     indegree [0,1,1,2]
 *   queue [0]
 *   take 0 → indeg 1:0 ✓, 2:0 ✓     queue [0,1,2]
 *   take 1 → indeg 3:1
 *   take 2 → indeg 3:0 ✓            queue [0,1,2,3]
 *   take 3
 *   4 courses taken → [0, 1, 2, 3]
 *
 * Complexity
 * ──────────
 *   Time:  O(V + E) — each course is queued once, each pair processed once.
 *   Space: O(V + E) — adjacency list, in-degrees, queue/order.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • DFS post-order: run a three-colour DFS (white / gray / black) from
 *     every unvisited course over the edges b → a; append a course when it
 *     turns black (all courses it unlocks are done), then REVERSE the list.
 *     Meeting a gray vertex means a cycle → return []. Recursion depth equals
 *     the longest chain, so use an explicit stack for big inputs.
 *   • Returning the partial order when a cycle exists is wrong — the
 *     problem asks for [] in that case. Compare the order length with
 *     numCourses.
 *   • Direction mix-ups are the #1 bug: [a, b] means b → a (b first). Get
 *     it backwards and you produce a perfectly reversed, invalid order.
 *   • Duplicate pairs must be handled consistently: count them in the
 *     in-degree AND store them in the adjacency list (or dedupe both).
 */

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @returns {number[]}
 */
export function findOrder(numCourses, prerequisites) {
  const next = Array.from({ length: numCourses }, () => []); // b → courses it unlocks
  const indegree = new Int32Array(numCourses);
  for (const [a, b] of prerequisites) {
    next[b].push(a);
    indegree[a]++;
  }

  // `order` doubles as the BFS queue: everything before `head` has been taken.
  const order = [];
  for (let c = 0; c < numCourses; c++) if (indegree[c] === 0) order.push(c);

  for (let head = 0; head < order.length; head++) {
    for (const unlocked of next[order[head]]) {
      if (--indegree[unlocked] === 0) order.push(unlocked);
    }
  }

  // If any course never reached in-degree 0, it is stuck behind a cycle.
  return order.length === numCourses ? order : [];
}
