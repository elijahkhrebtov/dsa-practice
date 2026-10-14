/*
 * Title:      Koko Eating Bananas
 * Difficulty: Medium
 * Patterns:   Binary Search on Answer
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Koko has `piles` of bananas: `piles[i]` is the number of bananas in pile i.
 * The guards will be back in `h` hours. Koko picks an integer eating speed
 * `k` (bananas per hour) and then, every hour, chooses one pile and eats `k`
 * bananas from it. If the pile has fewer than `k` bananas left she finishes
 * it and does nothing else for the rest of that hour — she never moves on to
 * another pile within the same hour.
 *
 * So a pile of `p` bananas takes ceil(p / k) hours, and the total time is the
 * sum of that over all piles.
 *
 * Return the MINIMUM integer `k` such that she can eat every banana within
 * `h` hours (total time <= h).
 *
 *   • `h >= piles.length`, so an answer always exists (at worst k = the
 *     largest pile, which takes exactly one hour per pile).
 *   • `k` is at least 1.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  piles = [3, 6, 7, 11], h = 8
 *     Output: 4
 *     Why:    at k = 4 the piles take 1 + 2 + 2 + 3 = 8 hours. At k = 3 they
 *             take 1 + 2 + 3 + 4 = 10 hours, which is too slow.
 *
 *   Example 2
 *     Input:  piles = [30, 11, 23, 4, 20], h = 5
 *     Output: 30
 *     Why:    5 piles in 5 hours means one pile per hour, so k must cover
 *             the biggest pile.
 *
 *   Example 3
 *     Input:  piles = [30, 11, 23, 4, 20], h = 6
 *     Output: 23
 *     Why:    at k = 23 only the 30-pile needs two hours: 2 + 1 + 1 + 1 + 1 = 6.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= piles.length <= 10^4
 *   • piles.length <= h <= 10^9
 *   • 1 <= piles[i] <= 10^9
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n log M) time, where M is the largest pile, and O(1) extra space.
 *   Trying speeds one by one (1, 2, 3, … or downward from the largest pile)
 *   needs up to 10^9 tries — the performance tests are built to make that
 *   take seconds.
 */

// ▶ Run tests:   npm run solve koko-eating-bananas
// ⟳ Watch mode:  npm run watch koko-eating-bananas

/**
 * Finds the slowest integer eating speed that finishes all piles within `h` hours.
 *
 * @param {number[]} piles - Banana count of each pile (all positive).
 * @param {number} h - Hours available; at least `piles.length`.
 * @returns {number} The minimum speed `k` (bananas per hour) such that the sum of `ceil(pile / k)` is at most `h`.
 */
export function minEatingSpeed(piles, h) {
  // Your code here
}
