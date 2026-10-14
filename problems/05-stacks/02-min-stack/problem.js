/*
 * Title:      Min Stack
 * Difficulty: Medium
 * Patterns:   Stack, Design
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Design a stack that, in addition to the usual operations, can report the
 * minimum element it currently holds — and every operation, including
 * `getMin`, must run in O(1) time.
 *
 * Implement the `MinStack` class:
 *
 *   • new MinStack()   creates an empty stack.
 *   • push(val)        pushes `val` onto the stack.
 *   • pop()            removes the element on top of the stack.
 *   • top()            returns the element on top of the stack.
 *   • getMin()         returns the minimum element in the stack.
 *
 * `pop`, `top` and `getMin` are only called on a non-empty stack.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   const s = new MinStack();
 *   s.push(-2);
 *   s.push(0);
 *   s.push(-3);
 *   s.getMin();  // -3
 *   s.pop();     // removes -3
 *   s.top();     // 0
 *   s.getMin();  // -2   ← the minimum "comes back" after popping -3
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • -2^31 <= val <= 2^31 - 1
 *   • Up to 3 * 10^4 calls in total (the performance test does 300,000).
 *   • pop, top and getMin are never called on an empty stack.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Every method in O(1) time. Scanning the stack inside getMin (O(n)) is the
 *   thing to avoid.
 */

// ▶ Run tests:   npm run solve min-stack
// ⟳ Watch mode:  npm run watch min-stack

/**
 * A stack that supports retrieving its minimum element in constant time.
 */
export class MinStack {
  /**
   * Creates an empty stack.
   */
  constructor() {
    // Your code here
  }

  /**
   * Pushes a value onto the top of the stack.
   *
   * @param {number} val - The value to push.
   * @returns {void}
   */
  push(val) {
    // Your code here
  }

  /**
   * Removes the element on top of the stack. The stack is never empty when this is called.
   *
   * @returns {void}
   */
  pop() {
    // Your code here
  }

  /**
   * Returns the element on top of the stack without removing it.
   *
   * @returns {number} The top element.
   */
  top() {
    // Your code here
  }

  /**
   * Returns the smallest element currently in the stack.
   *
   * @returns {number} The minimum element.
   */
  getMin() {
    // Your code here
  }
}
