/*
 * Title:      Asteroid Collision
 * Difficulty: Medium
 * Patterns:   Stack, Simulation
 *
 * Solution — Asteroid Collision
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Sweep left to right and keep the asteroids that have survived so far.
 * Among those survivors, nothing is about to collide any more (otherwise
 * we would already have resolved it), so they always look like
 *
 *     [ some left-movers … , some right-movers … ]
 *
 * A new right-mover can't hit anything to its left; it just joins the end.
 * A new left-mover flies into the survivors from the right, so the first
 * thing it meets is the LAST survivor, then the one before that, and so
 * on. Only the right end of the survivor list ever changes, which makes it
 * a stack.
 *
 * Approach
 * ────────
 *   For each asteroid `a`:
 *     1. If a > 0, push it.
 *     2. If a < 0, let it fight while the top of the stack is a right-mover:
 *          • top < |a|  → the top explodes: pop and keep fighting.
 *          • top === |a| → both explode: pop, and `a` is gone too.
 *          • top > |a|  → `a` explodes; stop.
 *        If `a` is still alive afterwards (the stack is empty or its top is a
 *        left-mover), push it.
 *   The stack, bottom to top, is the answer in left-to-right order.
 *
 * Walkthrough — [10, 2, -5, -12, 3]
 * ───────────
 *   10   push                                   stack: [10]
 *   2    push                                   stack: [10, 2]
 *   -5   vs 2: 2 < 5, pop 2                     stack: [10]
 *        vs 10: 10 > 5, -5 explodes             stack: [10]
 *   -12  vs 10: 10 < 12, pop 10                 stack: []
 *        stack empty → -12 survives, push       stack: [-12]
 *   3    push                                   stack: [-12, 3]
 *   → [-12, 3]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each asteroid is pushed at most once and popped at most
 *          once, so the inner while loop does O(n) work in total across
 *          the whole run, even though one step can pop many asteroids.
 *   Space: O(n) for the stack (it's also the output).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • "Find the first colliding neighbour pair, resolve it, rescan from the
 *     start" is a faithful simulation but O(n²) (plus O(n) splices).
 *   • The tie case is the usual bug: after popping an equal-size top, the
 *     incoming asteroid must NOT be pushed and must NOT keep fighting.
 *   • Only fight while the top is POSITIVE. A left-mover meeting a
 *     left-mover (or an empty stack) means no collision — just push.
 *   • A positive top followed by a positive newcomer never collide — don't
 *     compare sizes there.
 *   • Use push/pop at the end of the array, never shift/unshift.
 */

/**
 * @param {number[]} asteroids
 * @returns {number[]}
 */
export function asteroidCollision(asteroids) {
  const stack = []; // survivors so far, left to right

  for (const a of asteroids) {
    let alive = true;

    // Only a left-mover can hit something, and only while the top moves right.
    while (alive && a < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -a) {
        stack.pop(); // the top explodes; `a` keeps flying left
      } else if (top === -a) {
        stack.pop(); // both explode
        alive = false;
      } else {
        alive = false; // `a` explodes against a bigger right-mover
      }
    }

    if (alive) stack.push(a);
  }

  return stack;
}
