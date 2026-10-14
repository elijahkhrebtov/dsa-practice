/*
 * Title:      Sort Colors
 * Difficulty: Medium
 * Patterns:   Two Pointers
 *
 * Solution — Sort Colors
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * With only three distinct values we don't need a general sort. Every 0
 * belongs at the front and every 2 at the back, and the 1s fill whatever is
 * left in the middle. So keep a boundary for the "0 zone" growing from the
 * left, a boundary for the "2 zone" growing from the right, and scan the
 * unknown part between them, throwing each element into its zone. This is
 * Dijkstra's "Dutch national flag" partition.
 *
 * Approach (three pointers, one pass)
 * ───────────────────────────────────
 * Invariant:
 *   nums[0 .. low−1]     are 0
 *   nums[low .. mid−1]   are 1
 *   nums[mid .. high]    are not examined yet
 *   nums[high+1 .. n−1]  are 2
 *
 *   1. low = 0, mid = 0, high = n − 1.
 *   2. While mid <= high:
 *        • nums[mid] = 0 → swap(low, mid); low++; mid++
 *          (the element that comes back from `low` is a 1 — or the same 0
 *          when low === mid — so it's already examined.)
 *        • nums[mid] = 1 → mid++
 *        • nums[mid] = 2 → swap(mid, high); high--
 *          (do NOT move mid: the element swapped in from `high` is unknown.)
 *
 * Walkthrough — nums = [2, 0, 2, 1, 1, 0]
 * ───────────
 *   low mid high  nums                 action
 *   0   0   5     [2, 0, 2, 1, 1, 0]   2 → swap(0,5), high=4
 *   0   0   4     [0, 0, 2, 1, 1, 2]   0 → swap(0,0), low=1, mid=1
 *   1   1   4     [0, 0, 2, 1, 1, 2]   0 → swap(1,1), low=2, mid=2
 *   2   2   4     [0, 0, 2, 1, 1, 2]   2 → swap(2,4), high=3
 *   2   2   3     [0, 0, 1, 1, 2, 2]   1 → mid=3
 *   2   3   3     [0, 0, 1, 1, 2, 2]   1 → mid=4 > high → stop
 *   → [0, 0, 1, 1, 2, 2]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — every step either advances mid or shrinks high, so the
 *          unknown region loses one element per iteration.
 *   Space: O(1) — three indices.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Counting sort: count the 0s, 1s and 2s, then overwrite. O(n), O(1),
 *     but two passes. Perfectly good in practice.
 *   • A general O(n log n) sort works but misses the point; O(n²) sorts
 *     (bubble, insertion) are too slow for large inputs.
 *   • Bug: advancing `mid` after swapping with `high`. The incoming element
 *     might be a 0 or a 2 and would be left in the wrong zone ([1, 2, 0]).
 *   • Bug: using `mid < high` as the loop condition skips the last unknown
 *     element.
 *   • `nums = [...]` inside the function only rebinds the local name — the
 *     caller's array is unchanged. Write into nums[i] instead.
 */

/**
 * @param {number[]} nums
 * @returns {void}
 */
export function sortColors(nums) {
  let low = 0; // next slot for a 0
  let mid = 0; // current element under inspection
  let high = nums.length - 1; // next slot for a 2

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--; // mid stays: the swapped-in element hasn't been examined
    }
  }
}
