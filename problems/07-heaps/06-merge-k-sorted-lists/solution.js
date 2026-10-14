/*
 * Title:      Merge k Sorted Lists
 * Difficulty: Hard
 * Patterns:   Heap, K-way Merge
 *
 * Solution — Merge k Sorted Lists
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Merging two sorted lists is easy: compare the two heads, take the smaller
 * one, and repeat. With k lists, the next node of the output is still always
 * one of the k current heads, namely the smallest of them. Scanning k heads
 * for every output node costs O(k) each, O(N·k) overall. But "repeatedly
 * give me the smallest of a changing set" is exactly what a min-heap does in
 * O(log k).
 *
 * Approach (k-way merge with a min-heap)
 * ──────────────────────────────────────
 *   1. Push the head of every non-empty list into a min-heap keyed by
 *      node.val.
 *   2. Use a dummy node and a `tail` pointer to build the output.
 *   3. While the heap isn't empty:
 *        a. pop the smallest node and append it: tail.next = node, tail = node
 *        b. if node.next exists, push it. That list's next candidate takes
 *           its place.
 *   4. Terminate the output (tail.next = null) and return dummy.next.
 *
 * The heap never holds more than one node per list, so its size is <= k.
 *
 * Walkthrough — [1→4→5, 1→3→4, 2→6]
 * ───────────
 *   heap {1a, 1b, 2}
 *   pop 1a → out 1        push 4a   heap {1b, 2, 4a}
 *   pop 1b → out 1 1      push 3    heap {2, 3, 4a}
 *   pop 2  → out 1 1 2    push 6    heap {3, 4a, 6}
 *   pop 3  → … 3          push 4b   heap {4a, 4b, 6}
 *   pop 4a → … 4          push 5    heap {4b, 5, 6}
 *   pop 4b → … 4          (end)     heap {5, 6}
 *   pop 5, pop 6          → 1 1 2 3 4 4 5 6
 *
 * Complexity
 * ──────────
 *   Time:  O(N log k) — every one of the N nodes is pushed and popped once
 *          on a heap of size <= k.
 *   Space: O(k) for the heap. The output reuses the input nodes.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Sequential merging (result = merge(result, list_i)) re-walks the
 *     growing result every time: O(k · N). With 5,000 lists that's ~100×
 *     slower.
 *   • Divide & conquer: merge lists in pairs (0+1, 2+3, …), then pairs of
 *     the results, and so on. There are log k rounds of O(N) work each, so
 *     it's also O(N log k), with O(1) extra space if done iteratively.
 *     Excellent if you don't have a heap handy.
 *   • Collect all values, sort, and rebuild: O(N log N). It's simple, but it
 *     ignores the fact that the lists are already sorted.
 *   • Push the NODE (not just its value) into the heap, so you know where
 *     to continue. Pushing all N nodes up front also works, but it uses O(N)
 *     heap memory and O(N log N) time.
 *   • Don't push null heads, and remember to set tail.next = null at the
 *     end. The last node popped already has next === null here, but that
 *     habit prevents cycles in variants.
 */
import { ListNode } from '../../../lib/linked-list.js';
import { PriorityQueue } from '../../../lib/priority-queue.js';

/**
 * @param {Array<ListNode | null>} lists
 * @returns {ListNode | null}
 */
export function mergeKLists(lists) {
  /** @type {PriorityQueue<ListNode>} min-heap of the current head of each list */
  const heap = new PriorityQueue((a, b) => a.val - b.val);
  for (const head of lists) if (head) heap.push(head);

  const dummy = new ListNode();
  let tail = dummy;
  while (!heap.isEmpty()) {
    const node = /** @type {ListNode} */ (heap.pop()); // smallest of all current heads
    tail.next = node;
    tail = node;
    if (node.next) heap.push(node.next); // that list's next node becomes a candidate
  }
  tail.next = null;
  return dummy.next;
}
