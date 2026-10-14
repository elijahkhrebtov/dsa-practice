/*
 * Title:      Two Sum
 * Difficulty: Easy
 * Patterns:   Hash Map
 *
 * Solution — Two Sum
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The brute force checks every pair (i, j): O(n²). Most of that work is
 * wasted, because for a fixed `nums[j]` there is exactly ONE value that can
 * complete it: `complement = target - nums[j]`. So instead of searching for
 * a partner, we just need to *remember* the numbers we've seen and look the
 * complement up instantly. "Look up a value and get its index" is exactly
 * what a hash map does in O(1) on average.
 *
 * Approach (one pass)
 * ───────────────────
 *   1. Create an empty Map: value → index.
 *   2. For each index j from left to right:
 *        a. complement = target - nums[j]
 *        b. If the map has `complement`, we found the pair:
 *           return [map.get(complement), j].
 *        c. Otherwise store nums[j] → j and continue.
 *
 * Why check before inserting? If we inserted first, then for target = 6 and
 * nums[j] = 3 we'd find "3" in the map — ourselves — and return [j, j].
 * Checking first also means the stored index is always < j, so the result is
 * already in ascending order.
 *
 * Duplicates such as [3, 3] work naturally: when we reach the second 3, the
 * first one is already in the map under index 0.
 *
 * Walkthrough — nums = [2, 7, 11, 15], target = 9
 * ───────────
 *   j=0  nums[j]=2   need 7   map {}          → not found, store 2→0
 *   j=1  nums[j]=7   need 2   map {2:0}       → found! return [0, 1]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each element is visited once; Map get/set are O(1) average.
 *   Space: O(n) — in the worst case the map holds every element.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force, two nested loops: O(n²) time, O(1) space. Fine for tiny
 *     inputs, ~5·10^9 pair checks for n = 10^5.
 *   • Sort + two pointers: O(n log n), but sorting destroys the original
 *     indices — you'd need to sort [value, index] pairs instead.
 *   • Using a plain object `{}` as the map works, but keys become strings and
 *     you must use `in` / `hasOwnProperty` carefully. `Map` is cleaner and
 *     handles negative numbers and 0 without surprises. Watch out for
 *     `if (map.get(x))` — index 0 is falsy! Use `map.has(x)`.
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {number[]}
 */
export function twoSum(nums, target) {
  const seen = new Map(); // value → index where we saw it

  for (let j = 0; j < nums.length; j++) {
    const complement = target - nums[j];
    if (seen.has(complement)) {
      return [seen.get(complement), j]; // stored index is always < j
    }
    seen.set(nums[j], j); // insert AFTER checking so we never pair j with itself
  }

  return []; // unreachable: the problem guarantees an answer
}
