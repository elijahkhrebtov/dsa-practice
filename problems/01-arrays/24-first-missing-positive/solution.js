/*
 * Title:      First Missing Positive
 * Difficulty: Hard
 * Patterns:   Cyclic Sort
 *
 * Solution — First Missing Positive
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * With n numbers you can "cover" at most the values 1 … n, so the answer is
 * always in 1 … n + 1. Anything ≤ 0 or > n is noise.
 *
 * If extra memory were allowed, we'd mark present[v] = true for every v in
 * 1 … n and return the first unmarked value. To get O(1) space we use the
 * array itself as that table: rearrange it so that the value v sits at
 * index v - 1 whenever v is present. Then index i "answers" whether i + 1
 * exists. This rearrangement is cyclic sort — every value knows exactly
 * where it belongs, so we can swap it straight there.
 *
 * Approach (cyclic sort)
 * ──────────────────────
 *   1. For i = 0 … n-1:
 *        while 1 <= nums[i] <= n and nums[nums[i] - 1] !== nums[i]:
 *            swap nums[i] with nums[nums[i] - 1]   (send it home)
 *      The second condition stops the loop when the home slot already has
 *      the right value — including the case where nums[i] is a duplicate.
 *   2. For i = 0 … n-1: if nums[i] !== i + 1, return i + 1.
 *   3. Return n + 1 (all of 1 … n are present).
 *
 * Walkthrough — nums = [3, 4, -1, 1]  (n = 4)
 * ───────────
 *   i=0: 3 → home 2: swap → [-1, 4, 3, 1];  -1 out of range, stop
 *   i=1: 4 → home 3: swap → [-1, 1, 3, 4];  1 → home 0: swap → [1, -1, 3, 4]
 *        -1 out of range, stop
 *   i=2: 3 already home.  i=3: 4 already home.
 *   scan: index 0 holds 1 ✓, index 1 holds -1 ✗ → answer 2
 *
 * Complexity
 * ──────────
 *   Time:  O(n). The inner while looks scary, but each successful swap puts
 *          a value into its final home, where it is never moved again — so
 *          there are at most n swaps over the whole run.
 *   Space: O(1) — only a few variables; the input is reused as the table.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Set of all values, then count up from 1: O(n) time but O(n) space.
 *   • Sort, then scan: O(n log n) time.
 *   • Sign marking: first replace every value outside 1 … n with n + 1, then
 *     for each |v| in 1 … n make nums[|v| - 1] negative; the first positive
 *     index i gives i + 1. Also O(n) / O(1) — a good alternative.
 *   • Infinite loop on duplicates: the condition must be
 *     nums[nums[i] - 1] !== nums[i], not nums[i] !== i + 1. With [1, 1] the
 *     second element would keep swapping with the first one forever.
 *   • Swap bug: `[nums[i], nums[nums[i] - 1]] = [nums[nums[i] - 1], nums[i]]`
 *     looks right but the left side re-reads nums[i] AFTER it was changed.
 *     Save the target index in a variable first.
 */

/**
 * @param {number[]} nums
 * @returns {number}
 */
export function firstMissingPositive(nums) {
  const n = nums.length;

  // Phase 1: send every value v in 1..n to index v - 1.
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const home = nums[i] - 1; // read the target index before swapping
      const tmp = nums[home];
      nums[home] = nums[i];
      nums[i] = tmp; // the value we pulled in gets examined by the next iteration
    }
  }

  // Phase 2: the first slot without its own value reveals the gap.
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}
