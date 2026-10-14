/*
 * Title:      Daily Temperatures
 * Difficulty: Medium
 * Patterns:   Monotonic Stack
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array `temperatures`, where `temperatures[i]` is the
 * temperature on day i. Return a new array `answer` of the same length in
 * which `answer[i]` is the number of days you have to wait after day i to
 * get a STRICTLY warmer temperature.
 *
 *   • If no later day is warmer, `answer[i]` is 0.
 *   • A day with the same temperature does not count as warmer.
 *   • Do not modify the input array.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
 *     Output: [1, 1, 4, 2, 1, 1, 0, 0]
 *     Why:    From 75 (day 2) the next warmer day is 76 on day 6: wait 4.
 *             76 and the final 73 never see a warmer day.
 *
 *   Example 2
 *     Input:  temperatures = [30, 40, 50, 60]
 *     Output: [1, 1, 1, 0]
 *
 *   Example 3
 *     Input:  temperatures = [60, 50, 40]
 *     Output: [0, 0, 0]
 *
 *   Example 4
 *     Input:  temperatures = [70, 70, 71]
 *     Output: [2, 1, 0]
 *     Why:    The second 70 is not warmer than the first one.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= temperatures.length <= 10^5
 *   • 0 <= temperatures[i] <= 10^5 (integers)
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time, O(n) extra space. For each day, scanning forward until a
 *   warmer day appears is O(n²) in the worst case, and the performance test
 *   (100,000 strictly falling temperatures followed by one hot day) is built
 *   to catch exactly that.
 */

// ▶ Run tests:   npm run solve daily-temperatures
// ⟳ Watch mode:  npm run watch daily-temperatures

/**
 * For each day, computes how many days you must wait for a strictly warmer temperature.
 *
 * @param {number[]} temperatures - Daily temperatures, in order.
 * @returns {number[]} `answer[i]` = days from day i until the next strictly warmer day, or 0 if there is none.
 */
export function dailyTemperatures(temperatures) {
  // Your code here
}
