/*
 * Title:      Koko Eating Bananas
 * Difficulty: Medium
 * Patterns:   Binary Search on Answer
 *
 * Solution — Koko Eating Bananas
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Computing the best speed directly is awkward because of the rounding in
 * ceil(p / k). But CHECKING a given speed is easy: add up ceil(p / k) over
 * all piles and compare with h — O(n).
 *
 * And the check is monotonic: eating faster never takes longer, so
 *   feasible(k) = hours(k) <= h
 * is false for every k below some threshold and true for every k from it on:
 *
 *     k:        1     2     3     4     5    …
 *     feasible: F     F     F     T     T    …   (piles [3,6,7,11], h = 8)
 *
 * Finding the first T in a F…FT…T sequence is a binary search — not over the
 * array, but over the range of possible answers. That's the "binary search
 * on the answer" pattern.
 *
 * Approach
 * ────────
 *   1. lo = 1 (slowest possible speed), hi = max(piles) (always feasible,
 *      because each pile then takes exactly one hour and h >= n).
 *   2. While lo < hi:
 *        mid = floor((lo + hi) / 2)
 *        if hours(mid) <= h → hi = mid       (mid works; maybe smaller does too)
 *        else               → lo = mid + 1   (mid is too slow; so is all below)
 *   3. Return lo.
 *
 * Walkthrough — piles = [3, 6, 7, 11], h = 8
 * ───────────
 *   lo=1  hi=11  mid=6   hours = 1+1+2+2 = 6  <= 8 → hi=6
 *   lo=1  hi=6   mid=3   hours = 1+2+3+4 = 10 >  8 → lo=4
 *   lo=4  hi=6   mid=5   hours = 1+2+2+3 = 8  <= 8 → hi=5
 *   lo=4  hi=5   mid=4   hours = 1+2+2+3 = 8  <= 8 → hi=4
 *   lo=4  hi=4   → answer 4
 *
 * Complexity
 * ──────────
 *   Time:  O(n log M), M = max(piles) — about 30 feasibility checks of O(n)
 *          each for M = 10^9.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Linear scan over k (upward from 1, or downward from max): O(n · M),
 *     up to 10^9 checks. Starting the upward scan at ceil(sum / h) helps on
 *     some inputs, but not when one huge pile dominates.
 *   • Rounding: hours for a pile is Math.ceil(p / k), NOT Math.floor(p / k)
 *     and not p / k. An integer-only version is Math.floor((p + k - 1) / k).
 *   • Off-by-one in the search: with the "first true" template use
 *     `lo < hi`, `hi = mid` on success and `lo = mid + 1` on failure. Mixing
 *     `hi = mid` with `while (lo <= hi)` loops forever.
 *   • In languages with 32-bit ints the hour total can overflow (it can reach
 *     ~10^13); JS numbers are exact up to 2^53, so that's not a concern here.
 *     Still, stopping the sum as soon as it exceeds h is a cheap early exit.
 */

/** Total hours to eat all piles at speed k, stopping early once it exceeds `limit`. */
function hoursNeeded(piles, k, limit) {
  let hours = 0;
  for (const p of piles) {
    hours += Math.ceil(p / k);
    if (hours > limit) break; // already too slow — no need to finish the sum
  }
  return hours;
}

/**
 * @param {number[]} piles
 * @param {number} h
 * @returns {number}
 */
export function minEatingSpeed(piles, h) {
  let lo = 1;
  let hi = 0;
  for (const p of piles) if (p > hi) hi = p; // the largest pile is always fast enough

  // Find the first speed for which the piles can be finished within h hours.
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hoursNeeded(piles, mid, h) <= h) hi = mid; // mid works → answer is mid or lower
    else lo = mid + 1; // mid is too slow → answer is higher
  }

  return lo;
}
