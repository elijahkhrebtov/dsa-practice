/*
 * Title:      Implement a Min Heap
 * Difficulty: Medium
 * Patterns:   Heap, Design
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * JavaScript has no built-in heap, so build one. Implement a binary
 * **min-heap** of numbers: a structure that always hands you its smallest
 * value next.
 *
 * Implement the `MinHeap` class:
 *
 *   • new MinHeap(values = [])   creates a heap holding every number in
 *                                `values` (possibly empty, possibly with
 *                                duplicates). Build it in O(n) with
 *                                "heapify", not with n separate pushes.
 *                                Do NOT modify the array you are given.
 *   • push(val)                  adds the number `val`.
 *   • pop()                      removes and returns the smallest value.
 *                                Returns `undefined` if the heap is empty.
 *   • peek()                     returns the smallest value without
 *                                removing it, or `undefined` if empty.
 *   • size()                     returns how many values the heap holds
 *                                (a method, so call it as `heap.size()`).
 *
 * Duplicates are kept: pushing 4 twice means pop() returns 4 twice.
 *
 * You may NOT use `Array.prototype.sort` (the tests switch it off). The
 * point is to implement sift-up / sift-down on an array yourself.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     const h = new MinHeap();
 *     h.push(5); h.push(1); h.push(3);
 *     h.peek();   // 1
 *     h.pop();    // 1
 *     h.pop();    // 3
 *     h.size();   // 1
 *
 *   Example 2
 *     const h = new MinHeap([9, 4, 7, 1, 8]);
 *     h.pop();    // 1
 *     h.pop();    // 4
 *     h.push(2);
 *     h.pop();    // 2
 *     h.pop();    // 7
 *
 *   Example 3
 *     const h = new MinHeap();
 *     h.pop();    // undefined   (empty heap — no error)
 *     h.peek();   // undefined
 *     h.size();   // 0
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • Values are finite numbers (integers, possibly negative, or floats).
 *   • 0 <= values.length <= 10^6
 *   • Up to 10^5 push/pop calls in a row in the performance tests.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   push and pop in O(log n), peek and size in O(1), and the constructor in
 *   O(n) (bottom-up heapify). Scanning the array for the minimum on every pop
 *   is O(n) per call and fails the performance tests.
 *
 *   Follow-up: generalize your heap to take a comparator `(a, b) => number`
 *   so the same code works as a max-heap or for tuples. That's what
 *   lib/priority-queue.js does, and you may use it in the rest of this topic.
 */

// ▶ Run tests:   npm run solve implement-min-heap
// ⟳ Watch mode:  npm run watch implement-min-heap

/**
 * A binary min-heap of numbers stored in a plain array.
 */
export class MinHeap {
  /**
   * Creates a heap containing all the given values, built in O(n) time.
   *
   * @param {number[]} [values=[]] - Initial values (not modified).
   */
  constructor(values = []) {
    // Your code here
  }

  /**
   * Adds a value to the heap.
   *
   * @param {number} val - The value to add.
   * @returns {void}
   */
  push(val) {
    // Your code here
  }

  /**
   * Removes and returns the smallest value.
   *
   * @returns {number | undefined} The smallest value, or undefined if the heap is empty.
   */
  pop() {
    // Your code here
  }

  /**
   * Returns the smallest value without removing it.
   *
   * @returns {number | undefined} The smallest value, or undefined if the heap is empty.
   */
  peek() {
    // Your code here
  }

  /**
   * Returns the number of values in the heap.
   *
   * @returns {number} How many values the heap currently holds.
   */
  size() {
    // Your code here
  }
}
