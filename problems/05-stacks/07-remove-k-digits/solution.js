/*
 * Title:      Remove K Digits
 * Difficulty: Medium
 * Patterns:   Monotonic Stack, Greedy
 *
 * Solution — Remove K Digits
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * After removing k digits, every candidate has the same length, n - k. Numbers
 * of equal length compare by their first differing digit, so we want the
 * leftmost digits to be as small as possible, and we care about them first.
 *
 * Greedy observation: if some digit is larger than the digit right after
 * it (a "descent"), deleting it pulls a smaller digit into its position,
 * and the number gets smaller. Deleting the FIRST descent is the best
 * single deletion. If there is no descent (non-decreasing digits),
 * deleting the last digit is best.
 *
 * Doing that k times by rescanning is O(n·k). But notice what the
 * repeated process does: digits to the left of the current position
 * always form a non-decreasing run, and a new digit "knocks out" bigger
 * digits immediately to its left. That's a monotonic stack: keep the
 * kept digits non-decreasing, popping bigger ones while we still have
 * deletions to spend.
 *
 * Approach
 * ────────
 *   1. stack = [].
 *   2. For each digit d of num:
 *        while k > 0 and stack top > d: pop, k--
 *        push d
 *   3. If k > 0 still, the stack is non-decreasing, so remove the last k
 *      digits (they're the largest ones at the least significant end).
 *   4. Skip leading zeros; if nothing is left, return "0".
 *
 * Walkthrough — num = "1432219", k = 3
 * ───────────
 *   d   action                         stack       k
 *   1   push                           1           3
 *   4   push                           14          3
 *   3   pop 4, push                    13          2
 *   2   pop 3, push                    12          1
 *   2   push (2 is not > 2)            122         1
 *   1   pop 2, push                    121         0
 *   9   push (k = 0: no more pops)     1219        0
 *   → "1219"
 *
 *   num = "10200", k = 1:  1 → [1]; 0 pops 1 (k=0) → [0]; then 2,0,0 pushed
 *   → "0200" → strip → "200".
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each digit is pushed once and popped at most once.
 *   Space: O(n) for the stack.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all subsets is exponential; "delete the first descent,
 *     repeat k times" is correct but O(n·k), with string copies on top.
 *   • Pop only while the top is STRICTLY greater. Popping equal digits wastes
 *     a deletion: with `>=`, "112", k=1 pops the first 1 for the second 1
 *     and returns "12", but dropping the trailing 2 gives "11".
 *   • Forgetting step 3: for "12345", k=2 nothing is ever popped. The
 *     removals must come off the end.
 *   • Leading zeros: "0200" must become "200", and "000" or "" must become
 *     "0". Strip once at the end, not by repeated slicing inside the loop.
 *   • Converting to Number/BigInt to compare candidates doesn't scale and
 *     isn't needed. The greedy never compares whole numbers.
 */

/**
 * @param {string} num
 * @param {number} k
 * @returns {string}
 */
export function removeKdigits(num, k) {
  const stack = []; // kept digits, non-decreasing from bottom to top

  for (const d of num) {
    // A smaller digit replaces bigger digits to its left while removals remain.
    while (k > 0 && stack.length > 0 && stack[stack.length - 1] > d) {
      stack.pop();
      k--;
    }
    stack.push(d);
  }

  // Unused removals: the stack is non-decreasing, so drop from the end.
  stack.length -= Math.min(k, stack.length);

  // Strip leading zeros in a single pass.
  let start = 0;
  while (start < stack.length && stack[start] === '0') start++;

  return start === stack.length ? '0' : stack.slice(start).join('');
}
