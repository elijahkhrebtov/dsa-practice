/*
 * Title:      Product of Array Except Self
 * Difficulty: Medium
 * Patterns:   Prefix Sum
 *
 * Solution — Product of Array Except Self
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The elements "except i" are exactly the elements to the left of i plus
 * the elements to the right of i. So
 *
 *     answer[i] = left[i] · right[i]
 *     left[i]  = nums[0] · … · nums[i−1]     (1 for i = 0)
 *     right[i] = nums[i+1] · … · nums[n−1]   (1 for i = n−1)
 *
 * Both are running products — the multiplicative cousin of prefix sums —
 * and each can be filled in one sweep. No division, so zeros are harmless.
 *
 * Approach (O(1) extra space)
 * ───────────────────────────
 *   1. answer = new array of length n.
 *   2. Left sweep: prefix = 1. For i = 0 .. n−1:
 *        answer[i] = prefix        (product of everything left of i)
 *        prefix   *= nums[i]
 *   3. Right sweep: suffix = 1. For i = n−1 .. 0:
 *        answer[i] *= suffix       (now times everything right of i)
 *        suffix    *= nums[i]
 *   4. Return answer.
 *
 * Walkthrough — nums = [1, 2, 3, 4]
 * ───────────
 *   Left sweep:   answer = [1, 1, 2, 6]        (prefix ends at 24)
 *   Right sweep:
 *     i=3  answer[3] = 6·1  = 6    suffix = 4
 *     i=2  answer[2] = 2·4  = 8    suffix = 12
 *     i=1  answer[1] = 1·12 = 12   suffix = 24
 *     i=0  answer[0] = 1·24 = 24   suffix = 24
 *   → [24, 12, 8, 6]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — two passes.
 *   Space: O(1) extra — just two numbers besides the output array.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: for each i multiply all other elements, O(n²).
 *   • Separate left[] and right[] arrays: same idea, O(n) extra space. Fine,
 *     and a good first step before folding them into `answer`.
 *   • Division ("total / nums[i]") is forbidden, and naive division is wrong
 *     anyway with zeros: one zero makes total = 0, two zeros make every
 *     answer 0, and x / 0 gives Infinity or NaN.
 *   • JavaScript quirk: 0 · (−1) is −0. That's numerically equal to 0
 *     (−0 === 0 is true), but Vitest's toEqual distinguishes them. The tests
 *     normalize it, so you don't have to.
 */

/**
 * @param {number[]} nums
 * @returns {number[]}
 */
export function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n);

  // Pass 1: answer[i] = product of everything strictly left of i.
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix;
    prefix *= nums[i];
  }

  // Pass 2: multiply in the product of everything strictly right of i.
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;
    suffix *= nums[i];
  }

  return answer;
}
