/*
 * Title:      Combination Sum
 * Difficulty: Medium
 * Patterns:   Backtracking
 *
 * Solution — Combination Sum
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A combination is a multiset, so give every multiset ONE canonical
 * spelling: its values in non-decreasing order. If we only ever extend a
 * partial combination with a candidate that is >= the last one we used
 * (i.e. at the same index or later in the sorted list), each multiset can
 * be produced in exactly one way — no duplicates, nothing to filter.
 *
 * Sorting also gives free pruning: once a candidate exceeds the remaining
 * amount, every candidate after it does too, so the loop can stop.
 *
 * Approach (backtracking with a start index)
 * ──────────────────────────────────────────
 *   1. Sort candidates ascending.
 *   2. dfs(start, remaining):
 *        a. If remaining === 0 → record a copy of path.
 *        b. For i = start … end:
 *             if candidates[i] > remaining → break (pruning)
 *             push candidates[i]
 *             dfs(i, remaining - candidates[i])    ← i, not i + 1: reuse allowed
 *             pop
 *   3. dfs(0, target); return result.
 *
 * Walkthrough — candidates = [2, 3, 6, 7], target = 7
 * ───────────
 *   dfs(0, 7)
 *     2 → dfs(0, 5)
 *           2 → dfs(0, 3)
 *                 2 → dfs(0, 1): 2 > 1 break
 *                 3 → dfs(1, 0): record [2, 2, 3] ✓
 *                 6 > 3 break
 *           3 → dfs(1, 2): 3 > 2 break
 *           6 > 5 break
 *     3 → dfs(1, 4)
 *           3 → dfs(1, 1): 3 > 1 break
 *           6 > 4 break
 *     6 → dfs(2, 1): 6 > 1 break
 *     7 → dfs(3, 0): record [7] ✓
 *   Note that [3, 2, 2] can never be built: after picking 3 (index 1), the
 *   loop never returns to 2 (index 0).
 *
 * Complexity
 * ──────────
 *   Time:  exponential in the worst case — roughly O(k · S) where S is the
 *          number of nodes in the search tree and k ≤ target / min(candidates)
 *          is the maximum depth (each recorded combination is copied in
 *          O(k)). With sorting + break, almost every explored branch leads
 *          toward an answer, so S stays close to the output size.
 *          Sorting adds O(n log n).
 *   Space: O(k) for the path and recursion stack, besides the output.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Include/exclude recursion: at index i either use candidates[i] again
 *     (stay at i) or move on to i + 1. Equivalent search tree.
 *   • Bottom-up DP over sums (lists of combinations for every s ≤ target)
 *     works, but stores many intermediate lists and still needs care to
 *     avoid duplicates (e.g. iterate candidates in the OUTER loop).
 *   • Looping from 0 instead of `start` builds every ordering of every
 *     combination; de-duplicating afterwards (sort + Set of keys) is correct
 *     but explores millions of sequences for moderately large targets.
 *   • Recursing with i + 1 forbids reuse — that's a different problem
 *     (Combination Sum II).
 *   • Without sorting, you can't `break`; you'd `continue` instead, which is
 *     still correct but explores more.
 */

/**
 * @param {number[]} candidates
 * @param {number} target
 * @returns {number[][]}
 */
export function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b); // allowed by the statement; enables the break below
  const result = [];
  const path = [];

  const dfs = (start, remaining) => {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      const c = candidates[i];
      if (c > remaining) break; // sorted: all later candidates are too big too
      path.push(c);
      dfs(i, remaining - c); // stay at i — the same value may be used again
      path.pop();
    }
  };

  dfs(0, target);
  return result;
}
