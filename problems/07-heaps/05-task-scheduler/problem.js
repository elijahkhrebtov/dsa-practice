/*
 * Title:      Task Scheduler
 * Difficulty: Medium
 * Patterns:   Greedy, Heap
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A CPU has to run a list of tasks. Each task is labelled with an uppercase
 * letter 'A'–'Z', and the same letter may appear many times. Every task
 * takes exactly one time unit, and tasks can run in any order.
 *
 * There is a cooldown rule: two tasks with the SAME label must be separated
 * by at least `n` time units. In each time unit the CPU either runs one task
 * or sits idle.
 *
 * Return the minimum number of time units needed to finish all tasks,
 * counting the idle units.
 *
 * You may import `PriorityQueue` from `../../../lib/priority-queue.js` (or
 * use your own heap from problem 01).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  tasks = ['A','A','A','B','B','B'], n = 2
 *     Output: 8
 *     Why:    A B idle A B idle A B — each A is 3 units after the previous A.
 *
 *   Example 2
 *     Input:  tasks = ['A','C','A','B','D','B'], n = 1
 *     Output: 6
 *     Why:    A B C A D B — no idling needed.
 *
 *   Example 3
 *     Input:  tasks = ['A','A','A','B','B','B'], n = 3
 *     Output: 10
 *     Why:    A B idle idle A B idle idle A B
 *
 *   Example 4
 *     Input:  tasks = ['A','A','A'], n = 0
 *     Output: 3
 *     Why:    n = 0 means no cooldown at all.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= tasks.length <= 10^5
 *   • tasks[i] is an uppercase English letter.
 *   • 0 <= n <= 100
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(T) time for T tasks (the alphabet is fixed at 26 letters). A greedy
 *   simulation with a max-heap is a good first solution. Then look for the
 *   closed-form counting formula, which needs no simulation at all.
 */

// ▶ Run tests:   npm run solve task-scheduler
// ⟳ Watch mode:  npm run watch task-scheduler

/**
 * Computes the minimum number of time units to run all tasks with a cooldown.
 *
 * @param {string[]} tasks - Task labels, each an uppercase letter.
 * @param {number} n - Minimum number of units between two runs of the same label.
 * @returns {number} The minimum total time, idle units included.
 */
export function leastInterval(tasks, n) {
  // Your code here
}
