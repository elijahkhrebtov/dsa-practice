# Heaps and Priority Queues

A **priority queue** is a collection where you can always take out the "most important" item next: the smallest number, the closest point, the earliest deadline. A **binary heap** is the classic way to build one. It gives you the top item in O(1) and lets you add or remove items in O(log n).

A **min-heap** keeps the smallest element on top, and a **max-heap** keeps the largest. Below the top, a heap is only *partially* ordered. That is exactly why it's cheaper than keeping everything sorted.

## The heap property and the array layout

A binary heap is a **complete binary tree**: every level is full except possibly the last, and the last level is filled from left to right. It also satisfies the **heap property**:

> In a min-heap, every node is `<=` its children. So the root is the minimum.

Siblings are in no particular order, and a node's left child can be bigger or smaller than its right child.

Because the tree is complete, you don't need node objects or pointers. Store it **level by level in a plain array**:

```
            1                index:  0  1  2  3  4  5  6
          /   \                     [1, 3, 2, 7, 4, 9, 5]
         3     2
        / \   / \            parent(i) = (i - 1) >> 1     (Math.floor((i - 1) / 2))
       7   4 9   5           left(i)   = 2 * i + 1
                             right(i)  = 2 * i + 2
```

There are no gaps, so the last element is always at `heap.length - 1` and the height is `⌊log₂ n⌋`. Every walk from a leaf to the root (or back down) is O(log n).

## The two core moves

**Sift up** (also called bubble up), used by `push`: append the new value at the end, which keeps the tree complete. Then, while it is smaller than its parent, swap it with the parent.

```
push 0 into [1, 3, 2, 7, 4, 9, 5]
  append:          [1, 3, 2, 7, 4, 9, 5, 0]     0 is at index 7, parent index 3 (7)
  swap with 7:     [1, 3, 2, 0, 4, 9, 5, 7]     parent index 1 (3)
  swap with 3:     [1, 0, 2, 3, 4, 9, 5, 7]     parent index 0 (1)
  swap with 1:     [0, 1, 2, 3, 4, 9, 5, 7]     reached the root, so stop
```

**Sift down** (also called bubble down or heapify-down), used by `pop`: save the root and move the **last** element into the root slot, which keeps the tree complete. Then, while that element is bigger than its smaller child, swap it with **the smaller child**. Swapping with the smaller child is what guarantees the new parent is `<=` both children.

```
pop from [1, 3, 2, 7, 4, 9, 5]
  take 1, move 5 to the root:  [5, 3, 2, 7, 4, 9]
  children 3 and 2 → swap with 2:  [2, 3, 5, 7, 4, 9]
  children of index 2: 9 only → 5 <= 9, so stop.     returns 1
```

## Building a heap in O(n): heapify

Pushing n values one by one costs O(n log n). Starting from an arbitrary array, you can do better. **Sift down every non-leaf, from the last one (`(n >> 1) - 1`) back to the root.** Half the nodes are leaves and need no work, a quarter can move down at most one level, an eighth at most two, and so on. The total work is about `n · Σ k/2^(k+1) = O(n)`. This is Floyd's heap construction. Problem 01 asks you to use it in the constructor.

## Min vs max: it's just the comparator

The algorithms are identical. Only the question "which one should be on top?" changes. Write the heap once around a comparator `compare(a, b)`, which returns a negative number when `a` should come out first:

```js
(a, b) => a - b                  // min-heap of numbers
(a, b) => b - a                  // max-heap of numbers
(a, b) => a[0] - b[0]            // tuples, ordered by their first field
(a, b) => a.dist - b.dist || a.id - b.id   // tie-breaking on a second key
```

A max-heap of numbers can also be faked by pushing `-x` into a min-heap and negating on the way out.

## Heaps in JavaScript

**JavaScript has no built-in heap or priority queue.** (Python has `heapq` and Java has `PriorityQueue`.) The usual tempting workarounds are both slow:

- `arr.push(x); arr.sort(…)` on every insert costs O(n log n) per operation.
- Scanning the array for the minimum on every pop costs O(n) per operation.

So in **problem 01 you implement a min-heap yourself.** After that, you're free to import the ready-made one from `lib/` in any problem (or keep using your own):

```js
import { PriorityQueue } from '../../../lib/priority-queue.js';

const minQ = new PriorityQueue();                         // smallest number first
const maxQ = new PriorityQueue((a, b) => b - a);          // largest number first
const byDist = new PriorityQueue((a, b) => a[0] - b[0]);  // [distance, payload] tuples

minQ.push(5);
minQ.push(1);
minQ.push(3);
minQ.peek();     // 1    (doesn't remove)
minQ.pop();      // 1
minQ.size;       // 2    ← a getter, not a method
minQ.isEmpty();  // false
minQ.pop();      // 3
minQ.pop();      // 5
minQ.pop();      // undefined when empty
```

Gotchas:

- Comparators must return a **number**, not a boolean. `(a, b) => a < b` silently breaks the heap.
- `a - b` overflows only far beyond the safe-integer range, so it's fine for normal inputs. For strings, use `a < b ? -1 : a > b ? 1 : 0` or `a.localeCompare(b)`.
- A heap is **not** sorted. Iterating over its internal array does not give you sorted order. Only repeated `pop()` does.
- You can't efficiently search a heap or remove an arbitrary element from it (that's O(n)). If you need to "delete" an item, the usual trick is **lazy deletion**: remember it in a set and skip it when it reaches the top.

## Complexity

| Operation | Binary heap | Sorted array | Unsorted array |
| --- | --- | --- | --- |
| Peek min | O(1) | O(1) | O(n) |
| Push | O(log n) | O(n) (shift elements) | O(1) |
| Pop min | O(log n) | O(1) (pop from the right end) | O(n) |
| Build from n items | **O(n)** (heapify) | O(n log n) | O(1) |
| Search / delete arbitrary item | O(n) | O(log n) search, O(n) delete | O(n) |
| Heap sort (n pops) | O(n log n) | | |

## Patterns in this topic

**Top-K (heap of size k).** To find the k largest items, keep a **min**-heap of size k. Its root is the smallest of your current top k, so it's the "bouncer": any new item bigger than the root replaces it. That costs O(n log k) time and O(k) memory, which is great for streams. To find the k smallest, flip it and use a max-heap of size k. (Kth Largest in a Stream, Kth Largest in an Array, K Closest Points.)

**Quickselect.** If you have the whole array up front, partition around a pivot like quicksort but recurse into **one** side only. That's O(n) on average. Use a random pivot and a 3-way partition so sorted input and duplicates don't make it degrade to O(n²). (Kth Largest in an Array.)

**Two heaps.** Split a stream into a "lower half" max-heap and an "upper half" min-heap, keeping their sizes within one of each other. The median is then on top of one or both heaps. (Find Median from Data Stream.)

**K-way merge.** To merge k sorted sequences, put the head of each one into a min-heap. Repeatedly pop the smallest and push that sequence's next element. That's O(N log k) for N total elements. (Merge k Sorted Lists.)

**Greedy with a heap.** "Always process the most urgent / most frequent thing next" is a max-heap keyed by urgency, often combined with a cooldown queue. (Task Scheduler.)

## Problem order

1. **Implement a Min Heap** (Medium): sift up, sift down and O(n) heapify. Everything else builds on this.
2. **Kth Largest Element in a Stream** (Easy): a size-k min-heap as a running "top k".
3. **Kth Largest Element in an Array** (Medium): heap vs. quickselect, plus duplicate-proof partitioning.
4. **K Closest Points to Origin** (Medium): top-k with a custom key (a max-heap of the k best).
5. **Task Scheduler** (Medium): greedy simulation with a max-heap, then the counting formula.
6. **Merge k Sorted Lists** (Hard): the canonical k-way merge.
7. **Find Median from Data Stream** (Hard): two balanced heaps.
