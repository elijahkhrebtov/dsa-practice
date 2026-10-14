# Queues and Deques

A **queue** is a First-In-First-Out (FIFO) collection: items leave in the same order they arrived, like people waiting in line. You add at the **back** (enqueue) and remove from the **front** (dequeue).

A **deque** ("double-ended queue", pronounced *deck*) lets you add and remove at **both** ends. A deque can act as a stack, as a queue, or as both at once, and that flexibility is what makes the *monotonic deque* pattern possible.

```
enqueue →  [ back … … … front ]  → dequeue          (queue)

push/pop ⇄ [ back … … … front ] ⇄ push/pop           (deque)
```

## Queues in JavaScript

JavaScript has no built-in queue. The obvious choice is an array with `push` (enqueue) and `shift` (dequeue):

```js
const q = [];
q.push(1); q.push(2); q.push(3);
q.shift(); // 1
```

That is fine for small inputs, but **`Array.prototype.shift()` is O(n)**. Removing the first element means every other element moves one slot to the left. (V8 has some tricks for small arrays, but you can't count on them once arrays get large.) A BFS or simulation that calls `shift()` n times can quietly turn into O(n²).

### Alternative 1: a head index

Leave the array alone and track where the front is:

```js
const q = [];
let head = 0;
q.push(x);              // enqueue: O(1)
const front = q[head++]; // dequeue: O(1)
const size = q.length - head;
```

Dequeued slots are never reused, so memory grows with the total number of enqueues. That's usually fine for a single BFS. If the queue lives for a long time, you can compact it occasionally (`q = q.slice(head); head = 0` once `head` passes half the length), which is still O(1) amortized.

### Alternative 2: a ring buffer (circular array)

Use a fixed-capacity array and let the indices wrap around with `% capacity`:

```
capacity 5, head = 3, size = 4

index:   0   1   2   3   4
        [ c | d |   | a | b ]
                      ↑ head      → order is a, b, c, d
tail = (head + size) % capacity = 2
```

Enqueue writes at `tail` and dequeue reads at `head`. Both are O(1), and memory is bounded. This is how real queues, network buffers and audio buffers are built. Problem 02 asks you to build one.

### Alternative 3: two stacks

A stack reverses order, so two reversals give you the original order back. Push onto an `in` stack. To dequeue, pop from an `out` stack, first refilling it from `in` whenever it's empty. Each element moves at most twice, so every operation is **amortized** O(1). Problem 01 covers this.

### Deques in JS

You can get a deque from an array if you only ever remove from the front through a head index (`push`/`pop` at the back, `head++` at the front). That is exactly what the monotonic-deque problems need. A full deque that also *adds* at the front is a ring buffer with a movable head, or a doubly linked list.

## Complexity

| Operation | `push` + `shift` array | Head-index array | Ring buffer | Two stacks |
| --- | --- | --- | --- | --- |
| Enqueue (back) | O(1) amortized | O(1) amortized | O(1) | O(1) |
| Dequeue (front) | **O(n)** | O(1) | O(1) | O(1) amortized |
| Peek front | O(1) | O(1) | O(1) | O(1) amortized |
| Size / isEmpty | O(1) | O(1) | O(1) | O(1) |
| Memory | O(size) | O(total enqueued) | O(capacity) | O(size) |

## Pattern: monotonic deque

**Problem:** for every window of an array, report the window's maximum (or minimum), in O(n) total.

**Idea:** keep a deque of *indices* whose values are **decreasing** from front to back. Then:

- The front is always the index of the maximum of the current window.
- Before pushing index `i` at the back, pop every index whose value is `<= nums[i]`. Those elements can never be the maximum again, because `nums[i]` is at least as big and will stay in the window longer.
- Pop from the front when the front index has slid out of the window.

Every index is pushed once and popped at most once, so the whole scan is **O(n)**, no matter how big the window is.

Trace for `nums = [1, 3, -1, -3, 5, 3]`, window `k = 3` (the deque shows values, but it really stores indices):

```
i  nums[i]  pop back (<= nums[i])  pop front (out of window)  deque     window max
0     1         —                       —                     [1]          —
1     3         1                       —                     [3]          —
2    -1         —                       —                     [3, -1]      3
3    -3         —                       —                     [3, -1, -3]  3
4     5        -3, -1, 3                —                     [5]          5
5     3         —                       —                     [5, 3]       5
```

Variations: keep an *increasing* deque for the minimum, or keep one of each to know both the max and the min of a window (problem 04). The monotonic deque is the sliding-window cousin of the monotonic stack from the previous topic.

## Connection to BFS

Breadth-first search **is** a queue: you visit nodes in the order you discovered them, which means level by level and nearest first. Every "shortest path in an unweighted graph/grid" and every "level-order traversal" in the trees and graphs topics relies on a FIFO queue. Use a head index rather than `shift()` there too.

## Patterns in this topic

- **Queue**: FIFO processing, round-based simulation, BFS.
- **Design**: building a data structure with a fixed API and complexity guarantees.
- **Monotonic Deque**: sliding-window max/min in O(n).
- **Sliding Window**: the window framework the deque plugs into.
- **Greedy** / **Simulation**: process events in arrival order and make the locally best move.

## Problem order

1. **Implement Queue using Stacks** (Easy): two-stack queue, amortized analysis.
2. **Design Circular Queue** (Medium): fixed-size ring buffer with wrap-around indices.
3. **Dota2 Senate** (Medium): round-robin simulation with two queues.
4. **Longest Subarray With Absolute Diff Limit** (Medium): two monotonic deques inside a variable-size window.
5. **Sliding Window Maximum** (Hard): the canonical monotonic-deque problem.
