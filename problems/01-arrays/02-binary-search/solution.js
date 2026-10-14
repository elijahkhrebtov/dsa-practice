/*
 * Title:      Binary Search
 * Difficulty: Easy
 * Patterns:   Binary Search
 *
 * Solution — Binary Search
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Because the array is sorted, one comparison with the middle element tells
 * us which half the target must be in (if it's anywhere): everything left
 * of a too-small middle is also too small, everything right of a too-big
 * middle is also too big. Discarding half the candidates per step means
 * at most ⌈log₂(n+1)⌉ steps — about 20 for a million elements.
 *
 * Approach (closed interval [lo, hi])
 * ──────────────────────────────────
 *   1. lo = 0, hi = n − 1. Invariant: if target is in nums, its index is in [lo, hi].
 *   2. While lo <= hi (the interval is non-empty):
 *        mid = lo + ((hi − lo) >> 1)
 *        • nums[mid] === target → return mid
 *        • nums[mid] <  target  → lo = mid + 1   (target can only be to the right)
 *        • nums[mid] >  target  → hi = mid − 1   (target can only be to the left)
 *   3. The interval is empty → return −1.
 *
 * Walkthrough — nums = [-1, 0, 3, 5, 9, 12], target = 9
 * ───────────
 *   lo=0 hi=5  mid=2  nums[2]=3  < 9  → lo=3
 *   lo=3 hi=5  mid=4  nums[4]=9  = 9  → return 4
 *
 *   target = 2:
 *   lo=0 hi=5  mid=2  nums[2]=3  > 2  → hi=1
 *   lo=0 hi=1  mid=0  nums[0]=-1 < 2  → lo=1
 *   lo=1 hi=1  mid=1  nums[1]=0  < 2  → lo=2
 *   lo=2 > hi=1 → return -1
 *
 * Complexity
 * ──────────
 *   Time:  O(log n) — the interval halves every iteration.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Linear scan / indexOf: O(n). Fine once, too slow for many searches on
 *     big arrays.
 *   • Half-open interval [lo, hi) with `while (lo < hi)` and `hi = mid` also
 *     works — just never mix the two conventions. Mixing them is how you get
 *     an infinite loop (lo = mid with lo < hi) or skip the last element
 *     (`while (lo < hi)` with a closed interval).
 *   • `(lo + hi) >> 1` is fine in JS for array indices, but `>> 1` breaks
 *     above 2^31; `Math.floor((lo + hi) / 2)` or `lo + ((hi - lo) >> 1)` are
 *     the safe habits (in C/Java `lo + hi` itself can overflow).
 *   • Recursive versions work too but use O(log n) stack space.
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {number}
 */
export function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1; // closed interval [lo, hi]; empty array → hi = -1, loop never runs

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1; // everything up to mid is too small
    else hi = mid - 1; // everything from mid on is too big
  }

  return -1;
}
