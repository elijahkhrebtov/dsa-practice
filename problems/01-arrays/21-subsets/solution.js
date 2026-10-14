/*
 * Title:      Subsets
 * Difficulty: Medium
 * Patterns:   Backtracking
 *
 * Solution — Subsets
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A subset is defined by an in/out choice for each element, so there are
 * exactly 2^n of them. To list each exactly once, build subsets in a
 * canonical way: always add elements in increasing INDEX order. Then
 * {1, 2} can only ever be produced as [1, 2], never as [2, 1].
 *
 * Picture a tree whose root is [] and where a node's children extend it by
 * one element that comes later in `nums` than its last element. Every node
 * of this tree is a different subset, and every subset is a node — so a DFS
 * that records every node it visits produces the power set.
 *
 * Approach (backtracking over a start index)
 * ──────────────────────────────────────────
 *   1. result = [], path = [].
 *   2. dfs(start):
 *        a. Record a COPY of path (it is a valid subset right now).
 *        b. For i = start … n-1:
 *             push nums[i]; dfs(i + 1); pop        ← choose, explore, un-choose
 *   3. Call dfs(0) and return result.
 *
 * Walkthrough — nums = [1, 2, 3]
 * ───────────
 *   dfs(0)  path []        record []
 *     +1 → dfs(1)  [1]     record [1]
 *       +2 → dfs(2)  [1,2]   record [1,2]
 *         +3 → dfs(3)  [1,2,3] record [1,2,3]
 *       +3 → dfs(3)  [1,3]   record [1,3]
 *     +2 → dfs(2)  [2]     record [2]
 *       +3 → dfs(3)  [2,3]   record [2,3]
 *     +3 → dfs(3)  [3]     record [3]
 *   → 8 subsets, each exactly once.
 *
 * Complexity
 * ──────────
 *   Time:  O(n · 2^n) — 2^n subsets, each copied in O(n).
 *   Space: O(n) recursion depth and path, besides the O(n · 2^n) output.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Include/exclude recursion: dfs(i) branches into "skip nums[i]" and
 *     "take nums[i]", recording at i === n. Same complexity.
 *   • Iterative doubling: start with [[]]; for each x, append a copy of every
 *     existing subset with x added. Short and elegant.
 *   • Bitmasks: for mask in 0 … 2^n - 1, bit j says whether nums[j] is in.
 *     Neat, but limited to n < 31 with 32-bit bit operators.
 *   • Pushing `path` itself instead of `[...path]` stores the SAME array
 *     2^n times; after backtracking it's empty, so you'd return [[], [], …].
 *   • Looping from 0 instead of `start` generates permutations of subsets
 *     (duplicates) — and then filtering them out costs far more time.
 */

/**
 * @param {number[]} nums
 * @returns {number[][]}
 */
export function subsets(nums) {
  const result = [];
  const path = [];

  const dfs = (start) => {
    result.push([...path]); // every node of the recursion tree is a subset
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]); // choose
      dfs(i + 1); // explore: only later elements, so no reordered duplicates
      path.pop(); // un-choose
    }
  };

  dfs(0);
  return result;
}
