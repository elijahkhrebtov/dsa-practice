/*
 * Title:      Insert Interval
 * Difficulty: Medium
 * Patterns:   Intervals
 *
 * Solution — Insert Interval
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Appending newInterval and re-running Merge Intervals works, but it
 * re-sorts data that is already sorted. Since the input is sorted and
 * disjoint, the intervals that overlap newInterval form ONE contiguous
 * block. Everything to its left ends before newInterval starts, and
 * everything to its right starts after newInterval ends. So the answer is
 * left part + (newInterval merged with the block) + right part, which one
 * left-to-right pass can build.
 *
 * Approach (three phases, one index)
 * ──────────────────────────────────
 *   [s, e] = newInterval (local copies)
 *   1. While intervals[i].end < s:   push a copy of intervals[i]; i++
 *   2. While intervals[i].start <= e:
 *        s = min(s, intervals[i].start); e = max(e, intervals[i].end); i++
 *   3. Push [s, e].
 *   4. Push copies of all remaining intervals.
 *
 *   Phase 1 uses `<` and phase 2 uses `<=`, so an interval ending exactly
 *   at s, or starting exactly at e, is merged (closed intervals).
 *
 * Walkthrough — [[1,2],[3,5],[6,7],[8,10],[12,16]], new [4,8]
 * ───────────
 *   phase 1: [1,2] ends 2 < 4  → copy        out [[1,2]]
 *            [3,5] ends 5 ≥ 4  → stop
 *   phase 2: [3,5]  3 <= 8 → [3,8]
 *            [6,7]  6 <= 8 → [3,8]
 *            [8,10] 8 <= 8 → [3,10]  (touching)
 *            [12,16] 12 > 10 → stop
 *   phase 3: push [3,10]                     out [[1,2],[3,10]]
 *   phase 4: copy [12,16]                    out [[1,2],[3,10],[12,16]]
 *
 * Complexity
 * ──────────
 *   Time:  O(n). Every interval is visited exactly once.
 *   Space: O(n) for the output (O(1) besides it).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Push newInterval and call Merge Intervals: correct, O(n log n).
 *   • Binary search for the ends of the overlapping block: finding them is
 *     O(log n), but building the output array is still O(n). It's worth it
 *     only if you can splice in place in a structure that supports it.
 *   • Forgetting phase 3 when nothing overlaps (example 3) or when the new
 *     interval belongs at the very end.
 *   • Mutating newInterval (newInterval[0] = Math.min(...)) or pushing the
 *     input's inner arrays into the result changes the caller's data.
 */

/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @returns {number[][]}
 */
export function insert(intervals, newInterval) {
  const result = [];
  let [start, end] = newInterval; // local copies — never mutate the argument
  let i = 0;
  const n = intervals.length;

  // 1. Entirely before the new interval (ends strictly before it starts).
  while (i < n && intervals[i][1] < start) {
    result.push([intervals[i][0], intervals[i][1]]);
    i++;
  }

  // 2. Overlapping or touching: absorb into [start, end].
  while (i < n && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }

  // 3. The merged interval goes here — always, even if nothing was absorbed.
  result.push([start, end]);

  // 4. Entirely after.
  while (i < n) {
    result.push([intervals[i][0], intervals[i][1]]);
    i++;
  }

  return result;
}
