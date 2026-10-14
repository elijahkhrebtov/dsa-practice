/*
 * Title:      Daily Temperatures
 * Difficulty: Medium
 * Patterns:   Monotonic Stack
 *
 * Solution — Daily Temperatures
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * This is the classic "next greater element" question. Instead of each day
 * looking forward for its answer, let each new day look BACK and answer
 * every earlier day that it is warmer than.
 *
 * Which earlier days are still waiting for an answer? If an older day were
 * colder than a newer one, the newer day would already have answered it.
 * So the waiting days, from oldest to newest, have temperatures that never
 * increase. That is a monotonic (non-increasing) stack, and a new day
 * can only resolve days from its top, the coldest ones, stopping at the
 * first one that is at least as warm.
 *
 * Approach
 * ────────
 *   1. answer = array of n zeros; stack = [] (indices of waiting days).
 *   2. For i = 0 … n-1:
 *        while stack not empty and temps[top] < temps[i]:
 *            j = pop(); answer[j] = i - j
 *        push(i)
 *   3. Indices left on the stack never found a warmer day; they stay 0.
 *
 * Walkthrough — [73, 74, 75, 71, 69, 72, 76, 73]
 * ───────────
 *   i  temp  pops (answer set)            stack after (temps)
 *   0  73    —                            [73]
 *   1  74    0 → ans[0]=1                 [74]
 *   2  75    1 → ans[1]=1                 [75]
 *   3  71    —                            [75, 71]
 *   4  69    —                            [75, 71, 69]
 *   5  72    4 → ans[4]=1, 3 → ans[3]=2   [75, 72]
 *   6  76    5 → ans[5]=1, 2 → ans[2]=4   [76]
 *   7  73    —                            [76, 73]
 *   → [1, 1, 4, 2, 1, 1, 0, 0]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — every index is pushed once and popped at most once, so
 *          the inner while loop runs at most n times in total.
 *   Space: O(n) — the stack can hold every index (strictly falling input).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: scan forward from every day. O(n²) on falling input.
 *   • Right-to-left with "jumps": walk from the end and, for day i, follow
 *     j = i+1, then j += answer[j], skipping days that can't be warmer.
 *     Also amortized O(n) and O(1) extra space besides the output.
 *   • If temperatures come from a tiny range (e.g. 30..100), you can scan
 *     right to left keeping "next index of each temperature", which is
 *     O(n · range).
 *   • Use STRICTLY lower (`<`) when popping. With `<=`, equal temperatures
 *     would wrongly resolve each other.
 *   • Store indices on the stack, not temperatures. You need the distance,
 *     and you can always read the temperature through the index.
 */

/**
 * @param {number[]} temperatures
 * @returns {number[]}
 */
export function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // indices of days still waiting; their temperatures never increase bottom → top

  for (let i = 0; i < n; i++) {
    const t = temperatures[i];
    // Day i answers every waiting day that is strictly colder.
    while (stack.length > 0 && temperatures[stack[stack.length - 1]] < t) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }

  return answer; // anything left on the stack keeps its 0
}
