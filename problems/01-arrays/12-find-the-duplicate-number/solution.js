/*
 * Title:      Find the Duplicate Number
 * Difficulty: Medium
 * Patterns:   Fast & Slow Pointers, Binary Search
 *
 * Solution — Find the Duplicate Number
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The usual tools (sort, Set, mark-as-negative) are all banned by the
 * constraints, so we have to exploit the structure: n + 1 slots, values in
 * [1, n]. Every value is a valid index. Read the array as a function
 * f(i) = nums[i] and follow it from index 0:
 *
 *     0 → nums[0] → nums[nums[0]] → …
 *
 * This is a linked list hidden in the array. The sequence lives in a finite
 * set of indices, so it must eventually repeat — it has a cycle. And the
 * node where the cycle starts is a node with TWO incoming arrows: one from
 * the "tail" leading in, one from the end of the loop. Two indices i ≠ j with
 * nums[i] = nums[j] = d means two arrows into d — so the cycle entrance is
 * exactly the duplicate value. (Index 0 has no incoming arrow because no
 * value is 0, so it's always on the tail, never inside the loop.)
 *
 * Finding a cycle's entrance in O(1) memory is Floyd's tortoise and hare.
 *
 * Approach
 * ────────
 *   1. slow = fast = 0.
 *   2. Phase 1: repeat slow = nums[slow], fast = nums[nums[fast]] until
 *      slow === fast. They now meet somewhere inside the cycle.
 *   3. Phase 2: move one pointer back to 0. Advance both one step at a time
 *      until they meet. The meeting index is the cycle entrance = answer.
 *
 * Why phase 2 works: let T be the tail length (0 → entrance) and C the cycle
 * length. When they meet, slow walked T + a steps and fast walked twice that,
 * so the extra T + a steps are a whole number of cycles: T + a ≡ 0 (mod C).
 * Therefore walking T more steps from the meeting point (which is a steps
 * into the cycle) lands on the entrance — and so does walking T steps from 0.
 *
 * Walkthrough — nums = [1, 3, 4, 2, 2]
 * ───────────
 *   Arrows: 0→1, 1→3, 2→4, 3→2, 4→2.  Path from 0: 0 → 1 → 3 → 2 → 4 → 2 → …
 *   The loop is 2 → 4 → 2; the entrance is 2.
 *
 *   Phase 1 (slow moves 1 step, fast moves 2):
 *     step 1  slow = 1           fast = nums[nums[0]] = nums[1] = 3
 *     step 2  slow = 3           fast = nums[nums[3]] = nums[2] = 4
 *     step 3  slow = 2           fast = nums[nums[4]] = nums[2] = 4
 *     step 4  slow = 4           fast = nums[nums[4]] = 4      → meet at 4
 *   Phase 2:  a = 0, b = 4
 *     a = 1, b = 2;  a = 3, b = 4;  a = 2, b = 2  → meet at 2. Answer 2.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — both phases take at most a few laps over n + 1 nodes.
 *   Space: O(1) — two indices. The array is only read.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Pair search (two nested loops): O(n²) time — too slow for n = 150,000.
 *   • Set / counting array: O(n) time but O(n) space — breaks the space rule.
 *   • Sorting (in place) modifies the input; sorting a copy uses O(n) space.
 *   • Mark visited by negating nums[abs(v)]: O(1) extra space but modifies
 *     the input (and the frozen test arrays will throw).
 *   • Binary search on the value: for a candidate m, count entries <= m. If
 *     the count is > m, the duplicate is in [1, m], otherwise in [m+1, n].
 *     O(n log n) time, O(1) space, no mutation — a perfectly good answer
 *     (and arguably easier to come up with).
 *   • Sum or XOR tricks only work if the duplicate appears exactly twice and
 *     nothing is missing. Here it can repeat many times, so they fail.
 *   • Starting Floyd's at nums[0] instead of index 0 is fine as long as BOTH
 *     phases use the same starting point consistently; mixing them is a
 *     classic off-by-one-step bug.
 */

/**
 * @param {number[]} nums
 * @returns {number}
 */
export function findDuplicate(nums) {
  // Phase 1: find a meeting point inside the cycle.
  let slow = 0;
  let fast = 0;
  do {
    slow = nums[slow]; // one step
    fast = nums[nums[fast]]; // two steps
  } while (slow !== fast);

  // Phase 2: a pointer from the start and one from the meeting point,
  // both moving one step at a time, meet at the cycle's entrance.
  let a = 0;
  let b = slow;
  while (a !== b) {
    a = nums[a];
    b = nums[b];
  }
  return a;
}
