/*
 * Title:      Search in Rotated Sorted Array
 * Difficulty: Medium
 * Patterns:   Binary Search
 *
 * Solution — Search in Rotated Sorted Array
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Plain binary search relies on "everything left of mid is smaller, everything
 * right of mid is bigger". A rotation breaks that globally, but not locally:
 * the array is made of two ascending runs, and any range [lo..hi] split at
 * `mid` contains the "drop" (the rotation point) in at most ONE of its two
 * halves. The other half is an ordinary sorted range, and for a sorted range
 * we can decide in O(1) whether `target` could be inside it — just compare
 * against its two endpoints. That's enough information to throw away half of
 * the range every step, exactly like normal binary search.
 *
 * Approach
 * ────────
 *   1. lo = 0, hi = n - 1.
 *   2. While lo <= hi:
 *        a. mid = (lo + hi) >> 1. If nums[mid] === target, return mid.
 *        b. If nums[lo] <= nums[mid], the left half [lo..mid] is sorted:
 *             – if nums[lo] <= target < nums[mid] → hi = mid - 1
 *             – else                              → lo = mid + 1
 *        c. Otherwise the right half [mid..hi] is sorted:
 *             – if nums[mid] < target <= nums[hi] → lo = mid + 1
 *             – else                              → hi = mid - 1
 *   3. Return -1.
 *
 * Why `<=` in step b? When lo === mid the left "half" is one element — it is
 * trivially sorted. With `<` we'd wrongly treat the right half as sorted and
 * could discard the target (try [3, 1], target 1).
 *
 * Walkthrough — nums = [4, 5, 6, 7, 0, 1, 2], target = 0
 * ───────────
 *   lo=0 hi=6 mid=3 (7)   left [4,5,6,7] sorted; 0 not in [4,7) → lo=4
 *   lo=4 hi=6 mid=5 (1)   nums[4]=0 <= 1 → left [0,1] sorted; 0 in [0,1) → hi=4
 *   lo=4 hi=4 mid=4 (0)   found → return 4
 *
 * Complexity
 * ──────────
 *   Time:  O(log n) — the range halves on every iteration.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Linear scan / indexOf: O(n). Correct, but ignores the structure.
 *   • Two-phase: first binary-search the index of the minimum (the rotation
 *     point: compare nums[mid] with nums[hi]), then run an ordinary binary
 *     search on the one sorted run that can contain `target`. Same O(log n),
 *     a little more code, but each phase is simpler to reason about.
 *   • Getting the strictness of the range checks wrong is the classic bug.
 *     The `nums[mid] === target` case is already handled, so the range check
 *     must exclude nums[mid] on the side it compares against (`< nums[mid]`,
 *     `nums[mid] <`) and include the far endpoint (`nums[lo] <=`, `<= nums[hi]`).
 *   • This relies on DISTINCT values. With duplicates (e.g. [1, 0, 1, 1, 1])
 *     nums[lo] === nums[mid] doesn't tell you which side is sorted, and the
 *     worst case degrades to O(n) — that's a different problem.
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {number}
 */
export function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const midVal = nums[mid];
    if (midVal === target) return mid;

    const loVal = nums[lo];
    if (loVal <= midVal) {
      // Left half [lo..mid] is sorted — is target inside it?
      if (loVal <= target && target < midVal) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // Right half [mid..hi] is sorted — is target inside it?
      const hiVal = nums[hi];
      if (midVal < target && target <= hiVal) lo = mid + 1;
      else hi = mid - 1;
    }
  }

  return -1;
}
