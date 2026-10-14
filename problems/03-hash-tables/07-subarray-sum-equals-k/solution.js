/*
 * Title:      Subarray Sum Equals K
 * Difficulty: Medium
 * Patterns:   Prefix Sum, Hash Map
 *
 * Solution — Subarray Sum Equals K
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Let prefix[j] be the sum of the first j elements (prefix[0] = 0). Then
 * the sum of the subarray nums[i..j-1] is prefix[j] − prefix[i]. So
 *
 *     sum(nums[i..j-1]) = k   ⇔   prefix[i] = prefix[j] − k
 *
 * For each end position j, the number of subarrays ending there with sum k
 * equals the number of EARLIER prefixes whose value is prefix[j] − k. That's
 * the Two Sum idea again ("have I seen the complement?"), except we need
 * HOW MANY times we've seen it, so the hash map stores counts:
 * prefix value → number of times it occurred.
 *
 * Why not a sliding window? Sliding windows rely on "growing the window
 * never decreases the sum", which only holds for non-negative numbers.
 * With negatives, a window that overshoots k can come back to k later.
 *
 * Approach
 * ────────
 *   1. seen = Map { 0 → 1 }. That's the empty prefix before index 0, which
 *      lets subarrays starting at index 0 be counted.
 *   2. sum = 0, count = 0.
 *   3. For each x in nums:
 *        sum += x
 *        count += seen.get(sum − k) ?? 0    (subarrays ending here)
 *        seen[sum] += 1                     (AFTER the lookup)
 *   4. Return count.
 *
 * Updating AFTER the lookup matters: for k = 0, adding the current prefix
 * first would match it with itself, which corresponds to the empty subarray.
 *
 * Walkthrough — nums = [1, -1, 0], k = 0
 * ───────────
 *   start                  seen {0:1}            count 0
 *   x=1   sum=1  need 1 → 0  seen {0:1, 1:1}     count 0
 *   x=-1  sum=0  need 0 → 1  seen {0:2, 1:1}     count 1   ([1,-1])
 *   x=0   sum=0  need 0 → 2  seen {0:3, 1:1}     count 3   ([0], [1,-1,0])
 *
 * Complexity
 * ──────────
 *   Time:  O(n): one pass, O(1) average per Map operation.
 *   Space: O(n): up to n + 1 distinct prefix sums in the map.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: for every start, extend the end while keeping a running
 *     sum. O(n²) time, O(1) space.
 *   • A prefix-sum array plus two loops is still O(n²). The map is what
 *     removes the inner loop.
 *   • Forgetting the initial {0: 1}: misses every subarray that starts at
 *     index 0.
 *   • Storing a Set (seen / not seen) instead of counts: misses repeats,
 *     e.g. [0, 0, 5, 0, 0], k = 5 has 9 answers.
 *   • Sliding window / two pointers: only valid when all numbers are
 *     non-negative.
 *   • The count can exceed 2^32 (all zeros, n = 10^5 → ~5·10^9). That's
 *     fine in JS, where numbers are exact integers up to 2^53.
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @returns {number}
 */
export function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]); // prefix sum → how many times it has occurred; the empty prefix is 0
  let sum = 0;
  let count = 0;

  for (const x of nums) {
    sum += x;
    // Every earlier prefix equal to sum − k starts a subarray that ends here and sums to k.
    count += seen.get(sum - k) ?? 0;
    seen.set(sum, (seen.get(sum) ?? 0) + 1); // record AFTER looking up (no empty subarray)
  }

  return count;
}
