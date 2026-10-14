/*
 * Title:      Climbing Stairs
 * Difficulty: Easy
 * Patterns:   Dynamic Programming
 *
 * Solution — Climbing Stairs
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Look at the final move of any way to reach step n. It's either a 1-step
 * from step n - 1 or a 2-step from step n - 2, and those two groups don't
 * overlap. Every way to reach n - 1 extends to a way to reach n (append a
 * 1), and every way to reach n - 2 extends too (append a 2). So
 *
 *     ways(n) = ways(n - 1) + ways(n - 2),   ways(1) = 1, ways(2) = 2
 *
 * which is the Fibonacci sequence shifted by one: ways(n) = fib(n + 1).
 *
 * The recurrence is right, but evaluating it with plain recursion is
 * exponential: the call tree for ways(n) has about 2·fib(n) nodes, because
 * ways(n - 2) is computed inside ways(n - 1) AND again directly. There are
 * only n distinct subproblems, so compute each one once.
 *
 * Approach (bottom-up with two variables)
 * ───────────────────────────────────────
 *   1. If n <= 2, return n.
 *   2. Keep prev = ways(i - 2) and curr = ways(i - 1), starting at
 *      prev = 1 (step 1) and curr = 2 (step 2).
 *   3. For i = 3 … n: next = prev + curr, then shift: prev = curr,
 *      curr = next.
 *   4. Return curr.
 *
 * Walkthrough — n = 5
 * ───────────
 *   start         prev = 1 (ways 1)   curr = 2 (ways 2)
 *   i = 3  next 3 prev = 2            curr = 3
 *   i = 4  next 5 prev = 3            curr = 5
 *   i = 5  next 8 prev = 5            curr = 8   → answer 8
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one addition per step.
 *   Space: O(1) — only the last two values are kept.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Plain recursion: correct but O(φ^n) ≈ O(1.618^n). For n = 45 that's
 *     billions of calls and several seconds.
 *   • Memoized recursion (cache ways(k) in an array or Map): O(n) time and
 *     O(n) space, plus O(n) recursion depth. Perfectly fine here.
 *   • A dp array of length n + 1: same idea as the two variables, O(n) space.
 *   • Closed form (Binet's formula with √5) or 2×2 matrix exponentiation give
 *     O(log n), but Binet's formula relies on floating point and drifts for
 *     large n. Not worth it for n ≤ 45.
 *   • Off-by-one: ways(1) = 1 and ways(2) = 2. If you start from ways(0) = 1
 *     ("one way to climb nothing: do nothing"), the recurrence also works
 *     and ways(2) = ways(1) + ways(0) = 2 comes out naturally.
 */

/**
 * @param {number} n
 * @returns {number}
 */
export function climbStairs(n) {
  if (n <= 2) return n;

  let prev = 1; // ways to reach step i - 2 (starts at step 1)
  let curr = 2; // ways to reach step i - 1 (starts at step 2)

  for (let i = 3; i <= n; i++) {
    const next = prev + curr; // last move was a 2-step from i-2 or a 1-step from i-1
    prev = curr;
    curr = next;
  }

  return curr;
}
