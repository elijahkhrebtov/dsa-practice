/*
 * Title:      Design Circular Queue
 * Difficulty: Medium
 * Patterns:   Design, Queue
 *
 * Solution — Design Circular Queue
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A queue only ever touches two places: the front (to remove) and the rear
 * (to add). If we keep the elements in a fixed array and remember where the
 * front is, we never need to move anything. Dequeuing just advances the
 * front index. When an index walks off the end of the array, it wraps
 * around to 0 (`% k`) and reuses slots that earlier dequeues freed up.
 *
 * The one subtle point is telling "empty" from "full". If you track only a
 * head and a tail pointer, both states have head === tail. Tracking the
 * element COUNT (instead of a tail pointer) removes the ambiguity, and the
 * tail can be computed from it.
 *
 * Approach
 * ────────
 *   State: data = new Array(k), head = 0, count = 0.
 *   1. enQueue(v): if count === k return false.
 *      data[(head + count) % k] = v; count++; return true.
 *   2. deQueue(): if count === 0 return false.
 *      head = (head + 1) % k; count--; return true.
 *   3. Front(): count === 0 ? -1 : data[head].
 *   4. Rear():  count === 0 ? -1 : data[(head + count - 1) % k].
 *   5. isEmpty(): count === 0.   isFull(): count === k.
 *
 * Walkthrough — k = 3
 * ───────────
 *   op           data          head count  result
 *   enQueue(1)   [1, _, _]     0    1      true
 *   enQueue(2)   [1, 2, _]     0    2      true
 *   enQueue(3)   [1, 2, 3]     0    3      true
 *   enQueue(4)   [1, 2, 3]     0    3      false (full)
 *   Rear()                                 data[(0+3-1)%3] = data[2] = 3
 *   deQueue()    [1, 2, 3]     1    2      true  (1 is "gone": just ignored)
 *   enQueue(4)   [4, 2, 3]     1    3      true  slot (1+2)%3 = 0 reused
 *   Rear()                                 data[(1+3-1)%3] = data[0] = 4
 *   Front()                                data[1] = 2
 *
 * Complexity
 * ──────────
 *   Time:  O(1) for every operation, just a little arithmetic.
 *   Space: O(k), allocated once.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • head + tail pointers with an array of size k + 1 (one slot always
 *     left empty) is the classic way to avoid a count variable: full means
 *     (tail + 1) % (k + 1) === head. It works, but it's easier to get wrong.
 *   • A singly linked list with head/tail pointers and a size counter is
 *     also O(1) per operation. It allocates a node per element, though.
 *   • `push` + `shift` on a plain array is O(n) per dequeue and misses the
 *     point of the exercise.
 *   • Rear = data[tail - 1] breaks when tail has wrapped to 0. Always wrap:
 *     (head + count - 1) % k.
 *   • Don't use truthiness to detect emptiness. 0 is a valid element.
 */

export class MyCircularQueue {
  /** @param {number} k */
  constructor(k) {
    this.capacity = k;
    /** @type {number[]} fixed storage; slots outside [head, head+count) are garbage */
    this.data = new Array(k);
    this.head = 0; // index of the front element
    this.count = 0; // number of stored elements
  }

  /** @param {number} value @returns {boolean} */
  enQueue(value) {
    if (this.count === this.capacity) return false;
    this.data[(this.head + this.count) % this.capacity] = value;
    this.count++;
    return true;
  }

  /** @returns {boolean} */
  deQueue() {
    if (this.count === 0) return false;
    this.head = (this.head + 1) % this.capacity; // the old front is simply forgotten
    this.count--;
    return true;
  }

  /** @returns {number} */
  Front() {
    return this.count === 0 ? -1 : this.data[this.head];
  }

  /** @returns {number} */
  Rear() {
    return this.count === 0 ? -1 : this.data[(this.head + this.count - 1) % this.capacity];
  }

  /** @returns {boolean} */
  isEmpty() {
    return this.count === 0;
  }

  /** @returns {boolean} */
  isFull() {
    return this.count === this.capacity;
  }
}
