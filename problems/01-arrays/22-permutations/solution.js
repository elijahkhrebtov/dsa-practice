/*
 * Title:      Permutations
 * Difficulty: Medium
 * Patterns:   Backtracking
 *
 * Solution — Permutations
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Build a permutation one position at a time. At each step, any element not
 * yet placed may go next. That defines a decision tree of depth n whose
 * leaves are exactly the n! permutations: n choices at the first level,
 * n - 1 at the second, … Depth-first search over this tree, with a way to
 * "un-place" an element when we go back up, visits every leaf once.
 *
 * Approach (backtracking with a `used` array)
 * ────────────────────────────────────────────
 *   1. result = [], path = [], used = n × false.
 *   2. dfs():
 *        a. If path.length === n, record a COPY of path and return.
 *        b. For every index i with !used[i]:
 *             used[i] = true; path.push(nums[i]);   ← choose
 *             dfs();                                  ← explore
 *             path.pop(); used[i] = false;            ← un-choose
 *   3. Call dfs() and return result.
 *
 * Walkthrough — nums = [1, 2, 3]
 * ───────────
 *   []
 *   ├─ [1] ─┬─ [1,2] ── [1,2,3] ✓
 *   │       └─ [1,3] ── [1,3,2] ✓
 *   ├─ [2] ─┬─ [2,1] ── [2,1,3] ✓
 *   │       └─ [2,3] ── [2,3,1] ✓
 *   └─ [3] ─┬─ [3,1] ── [3,1,2] ✓
 *           └─ [3,2] ── [3,2,1] ✓
 *
 * For n = 0 the very first call already has path.length === n, so the
 * result is [[]] without any special case.
 *
 * Complexity
 * ──────────
 *   Time:  O(n · n!) — n! leaves, each copied in O(n); the internal nodes
 *          of the tree add only a constant factor (about e·n! of them).
 *   Space: O(n) for path, used and the recursion stack, besides the
 *          O(n · n!) output.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Swap-based backtracking: for position k, swap each nums[i] (i >= k)
 *     into position k, recurse on k + 1, swap back. No `used` array, but it
 *     reorders the caller's array while running — you must swap back (or
 *     work on a copy) so `nums` is unchanged at the end.
 *   • Checking `path.includes(nums[i])` instead of a `used` array works for
 *     distinct values but costs O(n) per check.
 *   • Iterative insertion: for each new element, insert it into every gap of
 *     every permutation built so far.
 *   • Generating all n^n sequences and keeping the valid ones is hugely
 *     wasteful (16.7 million sequences for n = 8 vs 40,320 permutations).
 *   • Recording `path` itself instead of `[...path]` stores one shared array.
 */

/**
 * @param {number[]} nums
 * @returns {number[][]}
 */
export function permute(nums) {
  const result = [];
  const path = [];
  const used = new Array(nums.length).fill(false);

  const dfs = () => {
    if (path.length === nums.length) {
      result.push([...path]); // a complete ordering — store a snapshot
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue; // already placed earlier in this path
      used[i] = true;
      path.push(nums[i]);
      dfs();
      path.pop(); // undo the choice before trying the next element
      used[i] = false;
    }
  };

  dfs();
  return result;
}
