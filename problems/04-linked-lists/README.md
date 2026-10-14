# Linked Lists

A **linked list** is a chain of nodes. Each node holds a value and a reference to the next node, and the list itself is just a reference to the first node (the **head**). The last node (the **tail**) points to `null`.

```
head
 │
 ▼
[1 | •]──▶[2 | •]──▶[3 | •]──▶ null
```

Unlike an array, the nodes are not stored next to each other in memory. You can only reach node *i* by walking *i* steps from the head. In exchange, inserting or removing a node is O(1) once you hold a reference to the right spot, because nothing has to shift.

## Singly vs doubly linked

- **Singly linked**: every node has `next`. You can only walk forwards, and to remove a node you need its **predecessor**. Almost every interview problem uses this kind.
- **Doubly linked**: every node also has `prev`. You can walk both ways, and a node can unlink itself in O(1) (`node.prev.next = node.next; node.next.prev = node.prev`). It costs one extra pointer per node. It's the backbone of LRU caches, browser history and deques.
- **Circular**: the tail points back to the head (or to some earlier node). In most problems a cycle is a bug or the thing you're asked to detect.

## Linked lists in this repo

JavaScript has no built-in linked list. The shared helpers live in [`lib/linked-list.js`](../../lib/linked-list.js):

```js
import { ListNode } from '../../../lib/linked-list.js';

const head = new ListNode(1, new ListNode(2, new ListNode(3))); // 1 → 2 → 3
head.val;        // 1
head.next.val;   // 2
head.next.next.next; // null
```

| Helper | What it does |
| --- | --- |
| `new ListNode(val = 0, next = null)` | A singly linked node with `val` and `next`. |
| `arrayToList([1, 2, 3])` | Builds `1 → 2 → 3` and returns the head (`null` for `[]`). |
| `listToArray(head)` | Walks the list and returns `[1, 2, 3]`. Throws if it walks more than a million nodes, which almost always means you created a cycle by accident. |
| `arrayToCyclicList(values, pos)` | Builds a list whose tail links back to index `pos` (`-1` = no cycle). Returns `{ head, nodes }`. |
| `RandomListNode`, `pairsToRandomList`, `randomListToPairs` | Nodes with an extra `random` pointer (Copy List with Random Pointer). |

**How tests encode lists:** problems describe lists as `1 → 2 → 3`, and tests build them with `arrayToList([1, 2, 3])` and compare results with `listToArray(result)`. An empty list is `null`, never `undefined` or an empty node. Many tests also check **node identity** (`toBe`): if a problem says "re-link the nodes", returning new nodes with the right values will fail.

## Operations and their cost

| Operation | Array | Singly linked list | Doubly linked list |
| --- | --- | --- | --- |
| Access the i-th element | O(1) | O(i) | O(i) |
| Search for a value | O(n) | O(n) | O(n) |
| Insert / remove at the front | O(n) (`unshift` / `shift`) | O(1) | O(1) |
| Insert / remove at the back | O(1) amortized (`push` / `pop`) | O(1) if you keep a `tail` pointer to insert; O(n) to remove (need the predecessor) | O(1) with a `tail` pointer |
| Insert / remove after a node you hold | O(n) (`splice` shifts the rest) | O(1) | O(1) |
| Remove a node you hold (not its predecessor) | n/a | O(n) (find the predecessor) | O(1) |
| Length | O(1) | O(n) unless you track it | O(n) unless you track it |
| Extra memory per element | none | 1 pointer | 2 pointers |

In practice JS arrays are much faster for most workloads (contiguous memory, CPU caches). Linked lists win when you need O(1) splicing at positions you already hold, which is exactly what the problems here exercise.

## Techniques you'll use again and again

### The dummy (sentinel) node

Many bugs come from the head being special: removing the head, inserting before it, or building a result list that's empty at first. Put a throwaway node in front:

```js
const dummy = new ListNode(0, head);
let tail = dummy;
// ... attach / remove nodes relative to `tail` or `prev` ...
return dummy.next; // the real head, even if it changed or the list is now empty
```

Every real node now has a predecessor, so "remove the node after `prev`" and "append after `tail`" work everywhere. LRU Cache uses two sentinels (`head` and `tail`) for the same reason.

### Fast & slow pointers

Two pointers walk the list at different speeds (usually 1 and 2 steps per iteration):

- **Middle of the list**: when `fast` reaches the end, `slow` is in the middle.
- **Cycle detection** (Floyd): if there's a cycle, `fast` eventually laps `slow` and they meet. If `fast` hits `null`, there's no cycle. A bit of arithmetic about the meeting point also gives you the start of the cycle.
- **Fixed gap**: start one pointer `n` nodes ahead, then move both together. When the leader reaches the end, the follower is `n` from the end.

Always guard the double step: `while (fast !== null && fast.next !== null)`.

### In-place reversal

The three-pointer loop that reverses a list (or a segment of it) in O(1) space:

```
prev = null, curr = head
while curr: next = curr.next; curr.next = prev; prev = curr; curr = next
return prev
```

Reversing a **segment** is the same loop with different boundaries: start `prev` at the node after the segment instead of `null`, and stop when `curr` reaches it. Reorder List and Reverse Nodes in k-Group are built from this.

### Hash map keyed by node

A `Map` (or `Set`) can use node objects as keys, compared by **identity**, not by value. This is how you remember visited nodes (cycle detection without Floyd) or map each original node to its copy (Copy List with Random Pointer).

## JavaScript gotchas

- **Recursion depth.** Recursive list code is elegant (reverse, merge, add), but each node costs a stack frame, and engines like V8 allow only around **10,000 frames** by default. On a 10^5-node list a recursive solution throws `RangeError: Maximum call stack size exceeded`. JavaScript doesn't do tail-call optimization in practice either. Several tests here use 100,000-node lists on purpose, so write the iterative version (and treat the recursive one as a follow-up).
- **Compare nodes, not values.** `a === b` on nodes checks identity. Two different nodes can hold the same `val`, and the tests include duplicate values to catch value comparisons.
- **`null` vs `undefined`.** An empty list is `null`. Return `null`, not `undefined`. `map.get(missingKey)` returns `undefined`, so handle it when you map `null` pointers.
- **Falsy values.** `if (node.val)` is false for `0`. Test `node !== null` or `node.val !== undefined` explicitly.
- **Don't lose the rest of the list.** Before overwriting `curr.next`, save it. After rearranging, make sure the new tail's `next` is `null`, or you'll create a cycle (`listToArray` will throw, which is a helpful signal).
- **Don't modify input you don't own** unless the problem says to. Some tests check that the original list is untouched afterwards.

## Patterns in this topic

- **In-place Reversal**: Reverse Linked List, Reorder List, Reverse Nodes in k-Group
- **Dummy Node**: Merge Two Sorted Lists, Remove Nth Node From End, Add Two Numbers
- **Fast & Slow Pointers**: Linked List Cycle, Linked List Cycle II, Reorder List
- **Two Pointers**: Merge Two Sorted Lists, Remove Nth Node From End
- **Hash Map**: Copy List with Random Pointer, LRU Cache
- **Simulation**: Add Two Numbers
- **Design / Doubly Linked List**: LRU Cache

## Problem order

| # | Problem | Difficulty | Patterns |
| --- | --- | --- | --- |
| 01 | Reverse Linked List | Easy | In-place Reversal |
| 02 | Merge Two Sorted Lists | Easy | Dummy Node, Two Pointers |
| 03 | Linked List Cycle | Easy | Fast & Slow Pointers |
| 04 | Linked List Cycle II | Medium | Fast & Slow Pointers |
| 05 | Remove Nth Node From End of List | Medium | Two Pointers, Dummy Node |
| 06 | Reorder List | Medium | Fast & Slow Pointers, In-place Reversal |
| 07 | Add Two Numbers | Medium | Simulation, Dummy Node |
| 08 | Copy List with Random Pointer | Medium | Hash Map |
| 09 | LRU Cache | Medium | Design, Hash Map, Doubly Linked List |
| 10 | Reverse Nodes in k-Group | Hard | In-place Reversal |

Start with 01–03: they're the building blocks (reversal, dummy node, fast/slow) that the later problems combine. Reorder List uses all three at once, and Reverse Nodes in k-Group is reversal with careful boundary handling.
