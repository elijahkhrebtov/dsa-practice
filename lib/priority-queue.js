/**
 * A ready-to-use binary-heap priority queue.
 *
 * JavaScript has no built-in heap. Once you've implemented one yourself
 * (see problems/07-heaps/01-implement-min-heap), feel free to import this
 * one in any problem that needs a heap:
 *
 *   import { PriorityQueue } from '../../../lib/priority-queue.js';
 *
 *   const minQ = new PriorityQueue();                      // smallest first
 *   const maxQ = new PriorityQueue((a, b) => b - a);       // largest first
 *   const byDist = new PriorityQueue((a, b) => a[0] - b[0]); // tuples by key
 *
 * push / pop: O(log n) · peek / size: O(1)
 *
 * @template T
 */
export class PriorityQueue {
  /**
   * @param {(a: T, b: T) => number} [compare] - Negative when `a` should come out before `b`.
   *   Defaults to ascending numeric order (a min-heap).
   */
  constructor(compare = /** @type {(a: any, b: any) => number} */ ((a, b) => a - b)) {
    /** @private @type {T[]} */
    this.heap = [];
    /** @private */
    this.compare = compare;
  }

  /** @returns {number} Number of items in the queue. */
  get size() {
    return this.heap.length;
  }

  /** @returns {boolean} True when the queue is empty. */
  isEmpty() {
    return this.heap.length === 0;
  }

  /** @returns {T | undefined} The highest-priority item without removing it. */
  peek() {
    return this.heap[0];
  }

  /**
   * Adds an item.
   * @param {T} value - Item to add.
   * @returns {void}
   */
  push(value) {
    const heap = this.heap;
    heap.push(value);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(heap[i], heap[parent]) >= 0) break;
      [heap[i], heap[parent]] = [heap[parent], heap[i]];
      i = parent;
    }
  }

  /**
   * Removes and returns the highest-priority item.
   * @returns {T | undefined} The item, or undefined when empty.
   */
  pop() {
    const heap = this.heap;
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = /** @type {T} */ (heap.pop());
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let best = i;
        if (l < heap.length && this.compare(heap[l], heap[best]) < 0) best = l;
        if (r < heap.length && this.compare(heap[r], heap[best]) < 0) best = r;
        if (best === i) break;
        [heap[i], heap[best]] = [heap[best], heap[i]];
        i = best;
      }
    }
    return top;
  }
}
