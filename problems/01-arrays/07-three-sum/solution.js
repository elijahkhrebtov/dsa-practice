/*
 * Title:      3Sum
 * Difficulty: Medium
 * Patterns:   Sorting, Two Pointers
 *
 * Solution — 3Sum
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Fix the smallest member of the triplet, nums[i]. The other two must sum
 * to −nums[i] — a Two Sum problem on the elements after i. On a SORTED
 * array Two Sum needs no hash map: put one pointer at each end of the
 * range. If the sum is too small, only moving the left pointer right can
 * increase it; if it's too big, only moving the right pointer left can
 * decrease it. Each step discards one candidate, so each Two Sum is O(n).
 *
 * Sorting also solves the duplicate problem for free: equal values become
 * neighbours, so "skip over equal neighbours" guarantees each distinct
 * triplet is produced exactly once.
 *
 * Approach
 * ────────
 *   1. Sort nums ascending (numeric comparator!).
 *   2. For i = 0 .. n−3:
 *        • If nums[i] > 0, stop: three numbers ≥ a positive number can't sum to 0.
 *        • If i > 0 and nums[i] === nums[i−1], skip (same first value as before).
 *        • lo = i + 1, hi = n − 1. While lo < hi:
 *            sum = nums[i] + nums[lo] + nums[hi]
 *            sum < 0 → lo++
 *            sum > 0 → hi--
 *            sum = 0 → record [nums[i], nums[lo], nums[hi]];
 *                      lo++ while it still equals the previous nums[lo];
 *                      hi-- while it still equals the previous nums[hi].
 *   3. Return the recorded triplets.
 *
 * Walkthrough — nums = [-1, 0, 1, 2, -1, -4] → sorted [-4, -1, -1, 0, 1, 2]
 * ───────────
 *   i=0 (-4): lo/hi sums: -4-1+2=-3 → lo++ … all sums < 0 → nothing
 *   i=1 (-1): lo=2 (-1), hi=5 (2): -1-1+2=0 → record [-1,-1,2]; lo=3, hi=4
 *             lo=3 (0),  hi=4 (1): -1+0+1=0 → record [-1,0,1];  lo=4, hi=3 → stop
 *   i=2 (-1): same as nums[1] → skip   (this is what prevents a second [-1,0,1])
 *   i=3 (0):  lo=4 (1), hi=5 (2): 3 > 0 → hi-- → stop
 *   → [[-1, -1, 2], [-1, 0, 1]]
 *
 * Complexity
 * ──────────
 *   Time:  O(n²) — O(n log n) sort + n two-pointer scans of O(n) each.
 *   Space: O(1) extra besides the output (O(log n) or so for the sort
 *          itself). Note that it reorders the input array.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all triples + a Set of keys: O(n³).
 *   • Hash-set Two Sum for each i: also O(n²), but deduplication then needs
 *     a Set of string keys like "-1,0,1" — slower and clunkier.
 *   • `nums.sort()` without a comparator sorts as STRINGS: [-1, -4, 10, 2]
 *     stays in a weird order. Always use (a, b) => a − b.
 *   • Skipping duplicates of i with `nums[i] === nums[i + 1]` (looking ahead)
 *     is wrong: it skips [-1, -1, 2], where the two -1s are both used.
 *     Compare with the PREVIOUS element instead.
 *   • Forgetting to move both pointers after a match leads to an infinite
 *     loop or duplicate triplets.
 */

/**
 * @param {number[]} nums
 * @returns {number[][]}
 */
export function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const result = [];

  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > 0) break; // smallest value positive → no more zero sums
    if (i > 0 && nums[i] === nums[i - 1]) continue; // same first value as last time

    let lo = i + 1;
    let hi = n - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (sum < 0) {
        lo++; // need a bigger total
      } else if (sum > 0) {
        hi--; // need a smaller total
      } else {
        result.push([nums[i], nums[lo], nums[hi]]);
        // Step past every copy of the values we just used.
        const loVal = nums[lo];
        const hiVal = nums[hi];
        while (lo < hi && nums[lo] === loVal) lo++;
        while (lo < hi && nums[hi] === hiVal) hi--;
      }
    }
  }

  return result;
}
