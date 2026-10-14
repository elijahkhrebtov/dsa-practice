/*
 * Title:      Largest Rectangle in Histogram
 * Difficulty: Hard
 * Patterns:   Monotonic Stack
 *
 * Solution — Largest Rectangle in Histogram
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Every rectangle is limited by its shortest bar. So the best rectangle is,
 * for SOME bar i, the widest rectangle of height exactly heights[i]. That
 * rectangle stretches left and right until it meets a bar strictly shorter
 * than heights[i]:
 *
 *     area(i) = heights[i] × (rightSmaller(i) - leftSmaller(i) - 1)
 *
 * where leftSmaller / rightSmaller are the indices of the nearest shorter
 * bars (or -1 / n if there are none). Nearest smaller elements are exactly
 * what a monotonic stack computes, and we can even get both boundaries in
 * a single pass.
 *
 * Keep a stack of indices with increasing heights. When bar i is shorter
 * than (or equal to) the top bar, the top can't extend any further right:
 * i is its right boundary. Its left boundary is the element just below it
 * on the stack. Every bar between that element and the top was popped
 * earlier because it was at least as tall, so the top's rectangle can
 * extend over all of them.
 *
 * Approach
 * ────────
 *   1. best = 0, stack = [].
 *   2. For i = 0 … n (use height 0 at i = n, a sentinel that flushes the stack):
 *        h = (i === n) ? 0 : heights[i]
 *        while stack not empty and heights[top] >= h:
 *            top = pop()
 *            left = stack empty ? -1 : stack top
 *            width = i - left - 1
 *            best = max(best, heights[top] × width)
 *        push i
 *   3. Return best.
 *
 * Why ">=" is fine: when an equal bar pops its twin, the twin's area is
 * underestimated, but the bar that stays on the stack ends up with the
 * full width when it's popped later. So the maximum is still found.
 *
 * Walkthrough — [2, 1, 5, 6, 2, 3]
 * ───────────
 *   i  h   pops (height × width)                        stack (indices)
 *   0  2   —                                            [0]
 *   1  1   pop 0: 2 × (1 - (-1) - 1) = 2 × 1 = 2        [1]
 *   2  5   —                                            [1, 2]
 *   3  6   —                                            [1, 2, 3]
 *   4  2   pop 3: 6 × (4 - 2 - 1) = 6
 *          pop 2: 5 × (4 - 1 - 1) = 10  ← best          [1, 4]
 *   5  3   —                                            [1, 4, 5]
 *   6  0   pop 5: 3 × (6 - 4 - 1) = 3
 *          pop 4: 2 × (6 - 1 - 1) = 8
 *          pop 1: 1 × (6 - (-1) - 1) = 6                [6]
 *   → 10
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each index is pushed once and popped at most once.
 *   Space: O(n) — the stack holds up to n indices (non-decreasing input).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all ranges with a running minimum: O(n²).
 *   • Expand left/right from every bar: O(n²) on sorted or flat input.
 *   • Two passes computing leftSmaller[] and rightSmaller[] with a
 *     monotonic stack each: same O(n), a bit easier to reason about.
 *   • Divide & conquer around the minimum bar: O(n log n) on average but
 *     O(n²) on sorted input, and the recursion can be 10^5 levels deep
 *     (a call stack overflow in JS). A segment tree for range-min fixes the
 *     time, not the elegance.
 *   • Forgetting the final flush: without the 0 sentinel at i = n, bars that
 *     are still on the stack (e.g. the whole of [1, 2, 3]) are never measured.
 *   • Wrong width when the stack becomes empty after a pop: the rectangle
 *     then reaches all the way to index 0, so the width is i, not i - top.
 */

/**
 * @param {number[]} heights
 * @returns {number}
 */
export function largestRectangleArea(heights) {
  const n = heights.length;
  const stack = []; // indices; heights strictly increase from bottom to top
  let best = 0;

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i]; // sentinel 0 flushes the stack at the end

    // Bar i is the right boundary for every taller-or-equal bar on top.
    while (stack.length > 0 && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      const left = stack.length === 0 ? -1 : stack[stack.length - 1]; // nearest shorter bar on the left
      const width = i - left - 1;
      if (height * width > best) best = height * width;
    }

    stack.push(i);
  }

  return best;
}
