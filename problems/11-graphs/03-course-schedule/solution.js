/*
 * Title:      Course Schedule
 * Difficulty: Medium
 * Patterns:   Topological Sort, Graph DFS
 *
 * Solution — Course Schedule
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Draw an arrow b → a for every pair [a, b] ("b unlocks a"). If the arrows
 * ever loop back on themselves, the courses on that loop all wait for each
 * other forever. If they don't, you can always find SOME course whose
 * prerequisites are all done — take it, and repeat. So the question is just
 * "does this directed graph contain a cycle?", and the classic tool is a
 * topological sort.
 *
 * Kahn's algorithm turns "take a course whose prerequisites are all done"
 * into code: track each course's in-degree (number of unfinished
 * prerequisites). Courses with in-degree 0 are ready. Taking one lowers the
 * in-degree of everything it unlocks. If we manage to take all courses,
 * there's no cycle; courses on a cycle never reach in-degree 0.
 *
 * Approach (Kahn's algorithm)
 * ───────────────────────────
 *   1. Build `next[b]` = list of courses that b unlocks, and
 *      `indegree[a]` = number of pairs [a, ·] (duplicates counted, which is
 *      fine because they are also unlocked twice).
 *   2. Put every course with in-degree 0 in a queue.
 *   3. Pop a course, count it as taken, and decrement the in-degree of each
 *      course it unlocks; any that hit 0 join the queue.
 *   4. Return taken === numCourses.
 *
 * Walkthrough — 4 courses, [[1,0],[2,1],[3,2],[1,3]]
 * ───────────
 *   next: 0→[1] 1→[2] 2→[3] 3→[1]     indegree: [0, 2, 1, 1]
 *   queue [0]
 *   take 0 → indegree[1] = 1          (still waiting on 3)
 *   queue empty, taken = 1 < 4 → false. Courses 1, 2, 3 form the cycle.
 *
 * Complexity
 * ──────────
 *   Time:  O(V + E) — every course is enqueued once and every pair is
 *          processed once when its prerequisite is taken.
 *   Space: O(V + E) — the adjacency list, in-degrees and queue.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • DFS with three colours: WHITE (unvisited), GRAY (on the current DFS
 *     path), BLACK (fully explored). Meeting a GRAY vertex means you've come
 *     back to your own path → cycle. Meeting a BLACK vertex is harmless.
 *     A single boolean "visited" can't tell those apart and wrongly reports
 *     a cycle on diamonds. Tracking only "on the current path" (no BLACK)
 *     is correct but re-explores shared sub-graphs again and again, which
 *     can take exponential time.
 *   • Written recursively, the DFS recurses as deep as the longest chain
 *     (20,000 in the tests) and throws "Maximum call stack size exceeded".
 *     Use an explicit stack (push a vertex, then pop it again to colour it
 *     BLACK once its children are done) or just use Kahn's algorithm.
 *   • Starting the search only from course 0 misses cycles in other
 *     components; Kahn handles all components automatically.
 *   • Undirected cycle detection (e.g. union-find) is wrong here:
 *     [[1,0],[2,0],[2,1]] is a triangle when undirected but perfectly
 *     schedulable.
 */

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @returns {boolean}
 */
export function canFinish(numCourses, prerequisites) {
  const next = Array.from({ length: numCourses }, () => []); // b → courses it unlocks
  const indegree = new Int32Array(numCourses); // unfinished prerequisites per course
  for (const [a, b] of prerequisites) {
    next[b].push(a);
    indegree[a]++;
  }

  // Every course with nothing left to wait for is ready right now.
  const queue = [];
  for (let c = 0; c < numCourses; c++) if (indegree[c] === 0) queue.push(c);

  let taken = 0;
  for (let head = 0; head < queue.length; head++) {
    const course = queue[head];
    taken++;
    for (const unlocked of next[course]) {
      if (--indegree[unlocked] === 0) queue.push(unlocked);
    }
  }

  // Courses on (or behind) a cycle never reach in-degree 0.
  return taken === numCourses;
}
