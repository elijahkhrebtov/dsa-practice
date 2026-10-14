/*
 * Title:      Course Schedule
 * Difficulty: Medium
 * Patterns:   Topological Sort, Graph DFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You have to take `numCourses` courses, labelled 0 … numCourses - 1. Some
 * courses have prerequisites: `prerequisites[i] = [a, b]` means you must
 * finish course `b` BEFORE you can start course `a`.
 *
 * Return `true` if it is possible to finish every course, and `false`
 * otherwise.
 *
 * Think of each course as a vertex and each pair [a, b] as a directed edge
 * b → a. All courses can be finished exactly when this directed graph has
 * NO CYCLE.
 *
 *   • A course listed as its own prerequisite ([a, a]) can never be taken.
 *   • The same pair may appear more than once.
 *   • Courses that appear in no pair have no prerequisites at all.
 *   • The graph may consist of several unconnected parts; every one of them
 *     must be cycle-free.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  numCourses = 2, prerequisites = [[1, 0]]
 *     Output: true
 *     Why:    Take 0, then 1.
 *
 *   Example 2
 *     Input:  numCourses = 2, prerequisites = [[1, 0], [0, 1]]
 *     Output: false
 *     Why:    0 needs 1 and 1 needs 0 — neither can ever be started.
 *
 *   Example 3
 *     Input:  numCourses = 4, prerequisites = [[1, 0], [2, 1], [3, 2], [1, 3]]
 *     Output: false
 *
 *         0 ──► 1 ──► 2
 *               ▲     │
 *               │     ▼
 *               └──── 3
 *
 *     Why:    0 is fine, but 1 → 2 → 3 → 1 is a cycle.
 *
 *   Example 4
 *     Input:  numCourses = 4, prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]
 *     Output: true
 *
 *               ┌──► 1 ──┐
 *         0 ────┤        ├──► 3
 *               └──► 2 ──┘
 *
 *     Why:    Course 3 is reachable along two routes, but that is not a
 *             cycle. One valid order: 0, 1, 2, 3.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= numCourses <= 10^5
 *   • 0 <= prerequisites.length <= 2 * 10^5
 *   • prerequisites[i].length === 2
 *   • 0 <= a, b < numCourses (a === b is allowed and means "impossible")
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(V + E) time and space. The tests include a chain of 20,000 courses,
 *   so a recursive DFS will overflow the call stack — use Kahn's algorithm
 *   (BFS on in-degrees) or a DFS with an explicit stack.
 */

// ▶ Run tests:   npm run solve course-schedule
// ⟳ Watch mode:  npm run watch course-schedule

/**
 * Decides whether every course can be completed given the prerequisite pairs.
 *
 * @param {number} numCourses - Number of courses, labelled 0 … numCourses - 1.
 * @param {number[][]} prerequisites - Pairs `[a, b]`: course `b` must be taken before course `a`.
 * @returns {boolean} `true` if there is an order that finishes all courses (no cycle).
 */
export function canFinish(numCourses, prerequisites) {
  // Your code here
}
