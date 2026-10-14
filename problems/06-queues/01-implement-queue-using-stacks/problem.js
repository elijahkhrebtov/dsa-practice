/*
 * Title:      Implement Queue using Stacks
 * Difficulty: Easy
 * Patterns:   Design, Stack, Queue
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Build a first-in-first-out (FIFO) queue using nothing but stacks.
 *
 * Implement the `MyQueue` class:
 *
 *   • new MyQueue()   creates an empty queue.
 *   • push(x)         adds `x` to the back of the queue.
 *   • pop()           removes the element at the front of the queue and
 *                     returns it.
 *   • peek()          returns the element at the front without removing it.
 *   • empty()         returns `true` if the queue holds no elements,
 *                     `false` otherwise.
 *
 * The rules: your internal storage may only be used as stacks. In
 * JavaScript that means plain arrays where you only call `push()`, `pop()`,
 * read `length`, and look at the last element (`arr[arr.length - 1]`).
 * No `shift()`, `unshift()`, `splice()`, no reading from the front by
 * index, no head pointer. The tests will throw if you call `shift`,
 * `unshift` or `splice` on any array.
 *
 * `pop` and `peek` are only called when the queue is non-empty.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   const q = new MyQueue();
 *   q.push(1);     // queue: front [1] back
 *   q.push(2);     // queue: front [1, 2] back
 *   q.peek();      // 1
 *   q.pop();       // 1     queue: [2]
 *   q.empty();     // false
 *   q.pop();       // 2
 *   q.empty();     // true
 *
 *   Interleaving matters. Elements pushed later still come out later:
 *   push 1, push 2, pop → 1, push 3, pop → 2, pop → 3
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= x <= 10^9
 *   • At most 100 calls in the original problem. The performance test makes
 *     about 100,000 calls with a few thousand elements in the queue.
 *   • pop and peek are never called on an empty queue.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Amortized O(1) time per operation: any sequence of n operations takes
 *   O(n) total, even though a single pop may sometimes take longer. Pouring
 *   every element from one stack to the other and back on every pop is
 *   O(n) per call, and that is what the performance test is designed to
 *   catch.
 */

// ▶ Run tests:   npm run solve implement-queue-using-stacks
// ⟳ Watch mode:  npm run watch implement-queue-using-stacks

/**
 * A FIFO queue built only from stack operations.
 */
export class MyQueue {
  /**
   * Creates an empty queue.
   */
  constructor() {
    // Your code here
  }

  /**
   * Adds an element to the back of the queue.
   *
   * @param {number} x - The value to enqueue.
   * @returns {void}
   */
  push(x) {
    // Your code here
  }

  /**
   * Removes the element at the front of the queue and returns it. The queue is never empty when this is called.
   *
   * @returns {number} The element that was at the front.
   */
  pop() {
    // Your code here
  }

  /**
   * Returns the element at the front of the queue without removing it. The queue is never empty when this is called.
   *
   * @returns {number} The front element.
   */
  peek() {
    // Your code here
  }

  /**
   * Reports whether the queue is empty.
   *
   * @returns {boolean} `true` if the queue has no elements, otherwise `false`.
   */
  empty() {
    // Your code here
  }
}
