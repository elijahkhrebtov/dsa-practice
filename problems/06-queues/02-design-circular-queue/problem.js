/*
 * Title:      Design Circular Queue
 * Difficulty: Medium
 * Patterns:   Design, Queue
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Design a fixed-capacity FIFO queue backed by a circular buffer ("ring
 * buffer"). Once the last slot of the underlying storage is used, the next
 * element wraps around to the first slot, provided it has been freed by an
 * earlier dequeue. Freed space is reused without ever moving the elements
 * that are still in the queue.
 *
 * Implement the `MyCircularQueue` class:
 *
 *   • new MyCircularQueue(k)  creates an empty queue that can hold at most
 *                             `k` elements.
 *   • enQueue(value)          adds `value` at the rear. Returns `true` on
 *                             success, or `false` (changing nothing) if the
 *                             queue is full.
 *   • deQueue()               removes the front element. Returns `true` on
 *                             success, or `false` if the queue is empty.
 *   • Front()                 returns the front element, or -1 if empty.
 *   • Rear()                  returns the rear (most recently added)
 *                             element, or -1 if empty.
 *   • isEmpty()               `true` if the queue holds no elements.
 *   • isFull()                `true` if the queue holds exactly k elements.
 *
 * Rules: don't use a built-in queue, and don't shift elements around. The
 * tests make `Array.prototype.shift`, `unshift` and `splice` throw while
 * your methods run. Index arithmetic is the whole point.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   const q = new MyCircularQueue(3);
 *   q.enQueue(1);   // true    [1]
 *   q.enQueue(2);   // true    [1, 2]
 *   q.enQueue(3);   // true    [1, 2, 3]
 *   q.enQueue(4);   // false   full, nothing changes
 *   q.Rear();       // 3
 *   q.isFull();     // true
 *   q.deQueue();    // true    [2, 3]
 *   q.enQueue(4);   // true    [2, 3, 4]  ← 4 reuses the slot freed by 1
 *   q.Rear();       // 4
 *   q.Front();      // 2
 *
 *   const e = new MyCircularQueue(2);
 *   e.Front();      // -1      empty
 *   e.deQueue();    // false   nothing to remove
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= k <= 1000
 *   • 0 <= value <= 1000   (so -1 can never be a real element, but 0 can!)
 *   • At most 3000 calls in the original problem.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(1) time for every operation and O(k) space. Allocate storage once in
 *   the constructor, and let indices wrap around with the modulo operator.
 */

// ▶ Run tests:   npm run solve design-circular-queue
// ⟳ Watch mode:  npm run watch design-circular-queue

/**
 * A fixed-capacity FIFO queue implemented as a ring buffer.
 */
export class MyCircularQueue {
  /**
   * Creates an empty queue with room for `k` elements.
   *
   * @param {number} k - The capacity of the queue (k >= 1).
   */
  constructor(k) {
    // Your code here
  }

  /**
   * Inserts a value at the rear of the queue.
   *
   * @param {number} value - The value to insert.
   * @returns {boolean} `true` if inserted, `false` if the queue was full.
   */
  enQueue(value) {
    // Your code here
  }

  /**
   * Removes the element at the front of the queue.
   *
   * @returns {boolean} `true` if an element was removed, `false` if the queue was empty.
   */
  deQueue() {
    // Your code here
  }

  /**
   * Returns the front element without removing it.
   *
   * @returns {number} The front element, or -1 if the queue is empty.
   */
  Front() {
    // Your code here
  }

  /**
   * Returns the rear (most recently inserted) element without removing it.
   *
   * @returns {number} The rear element, or -1 if the queue is empty.
   */
  Rear() {
    // Your code here
  }

  /**
   * Reports whether the queue is empty.
   *
   * @returns {boolean} `true` if the queue has no elements.
   */
  isEmpty() {
    // Your code here
  }

  /**
   * Reports whether the queue is full.
   *
   * @returns {boolean} `true` if the queue holds `k` elements.
   */
  isFull() {
    // Your code here
  }
}
