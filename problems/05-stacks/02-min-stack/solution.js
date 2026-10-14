/*
 * Title:      Min Stack
 * Difficulty: Medium
 * Patterns:   Stack, Design
 *
 * Solution — Min Stack
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Keeping a single `min` variable fails on pop: if we pop the minimum, we
 * have no idea what the next smallest element is without scanning (O(n)).
 *
 * The key observation: a stack only changes at its top, so the minimum of
 * the first k elements never changes while those k elements stay in the
 * stack. If we record "the minimum so far" next to every element at the
 * moment it's pushed, then whatever is on top always knows the minimum of
 * the whole stack beneath it. Popping simply exposes the previous record.
 *
 * Approach (stack of [value, minSoFar] pairs)
 * ────────────────────────────────────────────
 *   push(val):  minSoFar = empty ? val : min(val, current top's minSoFar)
 *               push [val, minSoFar]
 *   pop():      pop the top pair
 *   top():      top pair's value
 *   getMin():   top pair's minSoFar
 *
 * Walkthrough — push -2, push 0, push -3, getMin, pop, top, getMin
 * ───────────
 *   push -2  → [[-2,-2]]
 *   push 0   → [[-2,-2], [0,-2]]
 *   push -3  → [[-2,-2], [0,-2], [-3,-3]]
 *   getMin   → -3   (top's minSoFar)
 *   pop      → [[-2,-2], [0,-2]]
 *   top      → 0
 *   getMin   → -2   ← restored for free
 *
 * Duplicate minimums (push 0, push 0, pop) are handled automatically:
 * each 0 carries its own record.
 *
 * Complexity
 * ──────────
 *   Time:  O(1) for every operation (array push/pop at the end is O(1)
 *          amortized in JavaScript).
 *   Space: O(n) — one extra number per element.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Two stacks: a main stack plus a "min stack" that only gets a push when
 *     val <= current min (note the `<=` — using `<` breaks on duplicate
 *     minimums). Pop from the min stack only when the popped value equals its
 *     top. Same complexity, sometimes less memory.
 *   • Storing differences (val - min) gets O(1) extra space, but it is
 *     fiddly and overflows in languages with fixed-width integers.
 *   • Don't use `stack.shift()` / `unshift()` — those are O(n) in JS. Always
 *     work at the END of the array.
 */

export class MinStack {
  constructor() {
    /** @type {Array<[number, number]>} each entry is [value, minimum of the stack up to here] */
    this.stack = [];
  }

  /** @param {number} val */
  push(val) {
    const minSoFar = this.stack.length === 0 ? val : Math.min(val, this.stack[this.stack.length - 1][1]);
    this.stack.push([val, minSoFar]);
  }

  pop() {
    this.stack.pop();
  }

  /** @returns {number} */
  top() {
    return this.stack[this.stack.length - 1][0];
  }

  /** @returns {number} */
  getMin() {
    return this.stack[this.stack.length - 1][1];
  }
}
