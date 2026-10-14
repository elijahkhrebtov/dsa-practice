/*
 * Title:      Implement Queue using Stacks
 * Difficulty: Easy
 * Patterns:   Design, Stack, Queue
 *
 * Solution — Implement Queue using Stacks
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A stack reverses order: push 1, 2, 3 and you pop 3, 2, 1. Pouring one
 * stack into another reverses it a second time, so after the pour the
 * OLDEST element sits on top. That's exactly the element a queue should
 * hand out next.
 *
 * The important insight is that once elements are in the second stack, they
 * are already in the correct dequeue order, and nothing pushed later can
 * ever need to come out before them. So never pour back. New elements pile
 * up in the first stack and wait until the second stack runs dry.
 *
 * Approach (inbox / outbox)
 * ─────────────────────────
 *   1. `inbox` receives every push. `outbox` serves every pop/peek.
 *   2. push(x): inbox.push(x).
 *   3. pop()/peek(): if outbox is empty, pour ALL of inbox into outbox
 *      (pop from inbox, push to outbox). Then pop / read outbox's top.
 *   4. empty(): both stacks are empty.
 *
 * Walkthrough — push 1, push 2, pop, push 3, pop, pop
 * ───────────
 *   push 1   inbox [1]        outbox []
 *   push 2   inbox [1, 2]     outbox []
 *   pop      outbox empty → pour: inbox []  outbox [2, 1]  → pop 1
 *   push 3   inbox [3]        outbox [2]
 *   pop      outbox non-empty → pop 2 (no pour! 3 must wait behind 2)
 *   pop      outbox empty → pour: outbox [3] → pop 3
 *
 * Complexity
 * ──────────
 *   Time:  push O(1). pop/peek are O(n) in the worst single call (a pour),
 *          but O(1) AMORTIZED. Every element is pushed to inbox once, moved
 *          to outbox once and popped from outbox once: at most 4 stack
 *          operations over its whole life. So n queue operations cost O(n)
 *          total.
 *   Space: O(n) for the elements themselves.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Pour back and forth on every pop/peek (keep everything in one stack
 *     "at rest"): correct but O(n) per operation, O(n²) overall.
 *   • Make push expensive instead (keep the main stack in queue order by
 *     pouring out, pushing, pouring back): also O(n) per push.
 *   • Pouring while the outbox is NOT empty breaks FIFO order: new elements
 *     would land on top of older ones.
 *   • empty() must check both stacks. Elements may be sitting in either one.
 *   • In a real JS program you'd use a head index or a ring buffer instead
 *     (see the topic README). This exercise is about the amortized-analysis
 *     idea, which shows up again with dynamic arrays and hash table resizing.
 */

export class MyQueue {
  constructor() {
    /** @type {number[]} newest element on top */
    this.inbox = [];
    /** @type {number[]} oldest element on top */
    this.outbox = [];
  }

  /** @param {number} x */
  push(x) {
    this.inbox.push(x);
  }

  /** @returns {number} */
  pop() {
    this.refill();
    return /** @type {number} */ (this.outbox.pop());
  }

  /** @returns {number} */
  peek() {
    this.refill();
    return this.outbox[this.outbox.length - 1];
  }

  /** @returns {boolean} */
  empty() {
    return this.inbox.length === 0 && this.outbox.length === 0;
  }

  /** Moves everything from inbox to outbox, but only when outbox has run dry. */
  refill() {
    if (this.outbox.length > 0) return;
    while (this.inbox.length > 0) {
      this.outbox.push(/** @type {number} */ (this.inbox.pop()));
    }
  }
}
