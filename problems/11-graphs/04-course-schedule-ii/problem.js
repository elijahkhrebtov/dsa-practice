/*
 * Title:      Course Schedule II
 * Difficulty: Medium
 * Patterns:   Topological Sort, Graph BFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You have to take `numCourses` courses, labelled 0 … numCourses - 1.
 * `prerequisites[i] = [a, b]` means course `b` must be finished BEFORE you
 * can start course `a`.
 *
 * Return an ORDER in which you can take all the courses: an array that
 * contains every course exactly once, where for every pair [a, b] course
 * `b` appears before course `a`.
 *
 *   • If several orders are valid, return any one of them.
 *   • If it is impossible to finish all courses (the prerequisites contain a
 *     cycle), return an empty array `[]` — not a partial order.
 *   • A course listed as its own prerequisite ([a, a]) makes the whole
 *     schedule impossible.
 *   • The same pair may appear more than once.
 *   • Courses that appear in no pair can go anywhere in the order, but they
 *     must still appear.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  numCourses = 2, prerequisites = [[1, 0]]
 *     Output: [0, 1]
 *     Why:    The only valid order.
 *
 *   Example 2
 *     Input:  numCourses = 4, prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]
 *     Output: [0, 1, 2, 3]   (or [0, 2, 1, 3])
 *
 *               ┌──► 1 ──┐
 *         0 ────┤        ├──► 3
 *               └──► 2 ──┘
 *
 *   Example 3
 *     Input:  numCourses = 3, prerequisites = [[1, 0], [2, 1], [0, 2]]
 *     Output: []
 *     Why:    0 → 1 → 2 → 0 is a cycle.
 *
 *   Example 4
 *     Input:  numCourses = 1, prerequisites = []
 *     Output: [0]
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
 *   O(V + E) time and space. The tests include a chain of 20,000 courses
 *   (too deep for a recursive DFS) and a dense graph with 100,000 pairs.
 */

// ▶ Run tests:   npm run solve course-schedule-ii
// ⟳ Watch mode:  npm run watch course-schedule-ii

/**
 * Finds an order in which all courses can be taken, respecting every prerequisite.
 *
 * @param {number} numCourses - Number of courses, labelled 0 … numCourses - 1.
 * @param {number[][]} prerequisites - Pairs `[a, b]`: course `b` must be taken before course `a`.
 * @returns {number[]} A valid order containing every course once, or `[]` if no order exists.
 */
export function findOrder(numCourses, prerequisites) {
  // Your code here
}
