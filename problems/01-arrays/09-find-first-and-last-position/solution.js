/*
 * Title:      Find First and Last Position of Element in Sorted Array
 * Difficulty: Medium
 * Patterns:   Binary Search
 *
 * Solution — Find First and Last Position of Element in Sorted Array
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * In a sorted array, all copies of `target` form one contiguous run. We
 * want both ends of that run. Searching for "an occurrence" and then
 * walking outward is O(length of the run) — O(n) when the run is huge.
 *
 * Instead, search for each boundary directly. For the FIRST occurrence:
 * when nums[mid] === target, mid is a candidate, but there may be another
 * copy further left, so record it and keep searching the left half. The
 * last candidate recorded is the leftmost copy. The LAST occurrence is the
 * mirror image. Two binary searches, O(log n) each, whatever the run length.
 *
 * Approach (one helper, called twice)
 * ───────────────────────────────────
 *   findBound(nums, target, leftmost):
 *     lo = 0, hi = n − 1, found = −1
 *     while lo <= hi:
 *       mid = lo + ((hi − lo) >> 1)
 *       if nums[mid] < target:  lo = mid + 1
 *       elif nums[mid] > target: hi = mid − 1
 *       else:                    found = mid
 *                                leftmost ? hi = mid − 1 : lo = mid + 1
 *     return found
 *
 *   first = findBound(…, true); if first is −1 → [−1, −1]
 *   last  = findBound(…, false)
 *
 * Walkthrough — nums = [5, 7, 7, 8, 8, 10], target = 8
 * ───────────
 *   First occurrence:
 *     lo=0 hi=5 mid=2 (7)  < 8 → lo=3
 *     lo=3 hi=5 mid=4 (8)  = 8 → found=4, hi=3
 *     lo=3 hi=3 mid=3 (8)  = 8 → found=3, hi=2 → stop → first = 3
 *   Last occurrence:
 *     lo=0 hi=5 mid=2 (7)  < 8 → lo=3
 *     lo=3 hi=5 mid=4 (8)  = 8 → found=4, lo=5
 *     lo=5 hi=5 mid=5 (10) > 8 → hi=4 → stop → last = 4
 *   → [3, 4]
 *
 * Complexity
 * ──────────
 *   Time:  O(log n) — two binary searches.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • indexOf + lastIndexOf: O(n). Fine for small arrays, slow for many
 *     queries on big ones.
 *   • Binary search once, then expand left/right: O(log n + run length),
 *     which is O(n) for an array that's mostly the target.
 *   • Lower bound formulation: first = lowerBound(target) (first index with
 *     value >= target), last = lowerBound(target + 1) − 1. Elegant, but the
 *     "+ 1" trick only works for integers. Then check that first < n and
 *     nums[first] === target.
 *   • Classic bug: returning as soon as nums[mid] === target in the boundary
 *     searches — that's just "some occurrence" again.
 *   • Classic bug: an infinite loop from `lo = mid` / `hi = mid` with a
 *     closed interval. Always move past mid when you use `lo <= hi`.
 */

/**
 * Binary search for the leftmost or rightmost index holding `target`.
 *
 * @param {number[]} nums - Sorted array.
 * @param {number} target - Value to find.
 * @param {boolean} leftmost - true → first occurrence, false → last occurrence.
 * @returns {number} The index, or -1 if absent.
 */
function findBound(nums, target, leftmost) {
  let lo = 0;
  let hi = nums.length - 1;
  let found = -1;

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] < target) {
      lo = mid + 1;
    } else if (nums[mid] > target) {
      hi = mid - 1;
    } else {
      found = mid; // a candidate — but keep looking toward the boundary
      if (leftmost) hi = mid - 1;
      else lo = mid + 1;
    }
  }

  return found;
}

/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {number[]}
 */
export function searchRange(nums, target) {
  const first = findBound(nums, target, true);
  if (first === -1) return [-1, -1]; // absent — no need for the second search
  return [first, findBound(nums, target, false)];
}
