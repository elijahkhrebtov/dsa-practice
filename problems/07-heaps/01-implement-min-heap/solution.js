/*
 * Title:      Implement a Min Heap
 * Difficulty: Medium
 * Patterns:   Heap, Design
 *
 * Solution — Implement a Min Heap
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * We want the minimum quickly, but keeping everything fully sorted is too
 * expensive: every insert would shift O(n) elements. A heap asks for less.
 * Each parent only has to be <= its children. That weaker rule is enough to
 * put the minimum at the root, and it's cheap to restore after a change,
 * because a change only disturbs ONE root-to-leaf path. A complete binary
 * tree has height log n, so that path is short.
 *
 * A complete tree fits in an array with no gaps:
 *   parent(i) = (i - 1) >> 1,  left(i) = 2i + 1,  right(i) = 2i + 2
 *
 * Approach
 * ────────
 *   push(val):  append at the end (keeps the tree complete), then SIFT UP:
 *               while val < parent, swap with the parent.
 *   pop():      remember the root. Move the LAST element into the root slot
 *               and shrink the array, then SIFT DOWN: while the element is
 *               bigger than its smaller child, swap with that smaller child.
 *               Return the remembered root.
 *   peek():     heap[0] (undefined when empty — arrays do that for free).
 *   size():     heap.length.
 *   constructor (heapify):
 *               copy the input, then sift down every non-leaf from the last
 *               one, index (n >> 1) - 1, back to index 0. When we sift down
 *               node i, both of its subtrees are already valid heaps, so
 *               after the sift the subtree rooted at i is one too.
 *
 * Walkthrough — new MinHeap([9, 4, 7, 1, 8]), then pop()
 * ───────────
 *   heapify, n = 5, non-leaves are indices 1 and 0:
 *     i=1 (4): children 1, 8 → 1 is smaller and < 4 → swap  [9, 1, 7, 4, 8]
 *              index 3 is a leaf, stop.
 *     i=0 (9): children 1, 7 → swap with 1                  [1, 9, 7, 4, 8]
 *              i=1 (9): children 4, 8 → swap with 4          [1, 4, 7, 9, 8]
 *   pop(): take 1, move the last element (8) to the root     [8, 4, 7, 9]
 *     children 4, 7 → swap with 4                            [4, 8, 7, 9]
 *     index 1 (8): child 9 → 8 <= 9, stop.                   returns 1
 *
 * Complexity
 * ──────────
 *   push / pop:   O(log n) — one walk along a single root-to-leaf path.
 *   peek / size:  O(1).
 *   constructor:  O(n). About half the nodes are leaves and do nothing, a
 *                 quarter sink at most 1 level, an eighth at most 2, … and
 *                 Σ k / 2^(k+1) converges to a constant.
 *   Space:        O(n) for the array (O(1) extra per operation).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Unsorted array + scan in pop: O(1) push, O(n) pop → O(n²) for n pops.
 *     Sorted array: O(1) pop but O(n) push (splice shifts elements).
 *   • Building with n pushes is O(n log n). It's correct, just slower than
 *     bottom-up heapify.
 *   • Swap with the SMALLER child in sift-down. Picking the left child by
 *     default breaks the heap property.
 *   • The right child may not exist (2i + 2 >= length). Compare indices with
 *     the length rather than relying on `undefined < x` being false.
 *   • pop() on a 1-element heap: if you move "the last element" into the
 *     root before shrinking, you'll write the old root back in. Pop the last
 *     element first, and only put it at the root if anything is left.
 *   • `if (!heap.peek())` treats 0 as empty. Check `size() === 0` instead.
 *   • Don't keep a reference to the caller's array: copy it (`[...values]`)
 *     or you'll reorder their data and get confused by later mutations.
 *   • Generalizing: replace `a < b` with `compare(a, b) < 0` and you have a
 *     priority queue for any ordering (see lib/priority-queue.js).
 */

export class MinHeap {
  /** @param {number[]} [values=[]] */
  constructor(values = []) {
    /** @type {number[]} heap[0] is the minimum; children of i live at 2i+1 and 2i+2 */
    this.heap = [...values]; // copy so the caller's array is never reordered
    // Bottom-up heapify: sift down every non-leaf, deepest first.
    for (let i = (this.heap.length >> 1) - 1; i >= 0; i--) this.siftDown(i);
  }

  /** @param {number} val */
  push(val) {
    this.heap.push(val);
    this.siftUp(this.heap.length - 1);
  }

  /** @returns {number | undefined} */
  pop() {
    const heap = this.heap;
    if (heap.length === 0) return undefined;
    const top = heap[0];
    const last = /** @type {number} */ (heap.pop()); // shrink first…
    if (heap.length > 0) {
      heap[0] = last; // …then move the old last element to the root and let it sink
      this.siftDown(0);
    }
    return top;
  }

  /** @returns {number | undefined} */
  peek() {
    return this.heap[0];
  }

  /** @returns {number} */
  size() {
    return this.heap.length;
  }

  /**
   * Moves heap[i] up while it is smaller than its parent.
   * @param {number} i
   */
  siftUp(i) {
    const heap = this.heap;
    const val = heap[i];
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent] <= val) break;
      heap[i] = heap[parent]; // pull the parent down instead of swapping each time
      i = parent;
    }
    heap[i] = val;
  }

  /**
   * Moves heap[i] down while it is bigger than its smaller child.
   * @param {number} i
   */
  siftDown(i) {
    const heap = this.heap;
    const n = heap.length;
    const val = heap[i];
    for (;;) {
      const left = 2 * i + 1;
      if (left >= n) break; // leaf
      const right = left + 1;
      const child = right < n && heap[right] < heap[left] ? right : left; // the smaller child
      if (heap[child] >= val) break;
      heap[i] = heap[child]; // pull the child up
      i = child;
    }
    heap[i] = val;
  }
}
