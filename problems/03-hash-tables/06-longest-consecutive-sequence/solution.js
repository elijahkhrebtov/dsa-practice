/*
 * Title:      Longest Consecutive Sequence
 * Difficulty: Medium
 * Patterns:   Hash Set
 *
 * Solution — Longest Consecutive Sequence
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Sorting would line the runs up, but costs O(n log n). Without sorting we
 * need O(1) answers to "is value v present?", which is a hash set.
 *
 * With a set we could start at every value x and count upwards while
 * x+1, x+2, … are present. Starting at EVERY value is wasteful, though: in
 * the run 1..m we'd walk m steps from 1, m−1 steps from 2, … which is O(m²).
 * The fix: only start counting at the BEGINNING of a run, a value x
 * such that x − 1 is NOT in the set. Every run has exactly one beginning,
 * so each run is walked exactly once, and every value is visited O(1)
 * times overall.
 *
 * Approach
 * ────────
 *   1. set = new Set(nums)   (this also removes duplicates)
 *   2. For each value x in the SET (not in nums, see pitfalls):
 *        if set has x − 1: skip, since x is in the middle of a run.
 *        else: count y = x, x+1, … while set has y. The run length is y − x.
 *   3. Return the maximum run length (0 if nums is empty).
 *
 * Walkthrough — nums = [100, 4, 200, 1, 3, 2]
 * ───────────
 *   set = {100, 4, 200, 1, 3, 2}
 *   100: 99 absent → start. 101 absent → length 1
 *   4:   3 present → skip
 *   200: 199 absent → start → length 1
 *   1:   0 absent → start. 2, 3, 4 present, 5 absent → length 4
 *   3, 2: predecessors present → skip
 *   answer: 4
 *
 * Complexity
 * ──────────
 *   Time:  O(n). Building the set is O(n). Each value passes the "x − 1
 *          present?" check once, and each value is stepped over by the
 *          inner while loop at most once (only during its own run's walk).
 *   Space: O(n) for the set.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Sort, then scan for step-by-1 stretches (skipping equal neighbours):
 *     O(n log n) time, simple and fine in practice, just not O(n).
 *   • Walking up from every element, without the "x − 1 absent" check:
 *     O(n²) on a long run.
 *   • Looping over `nums` instead of the set is a subtle bug: if the start
 *     of a long run appears many times, you walk the same run once per copy
 *     (still O(n²)). Iterating the set visits each distinct value once.
 *   • Union-Find over neighbouring values also works in near-O(n), but is
 *     much more code.
 *   • Duplicates must not extend a run. A set handles that for free. With
 *     sorting you must explicitly skip equal neighbours.
 */

/**
 * @param {number[]} nums
 * @returns {number}
 */
export function longestConsecutive(nums) {
  const values = new Set(nums);
  let best = 0;

  for (const x of values) {
    if (values.has(x - 1)) continue; // not the start of a run: its start will count it

    let end = x;
    while (values.has(end)) end++; // walk to the first missing value
    best = Math.max(best, end - x);
  }

  return best;
}
