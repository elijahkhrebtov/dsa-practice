# Hint 3

Reverse the group with the usual `prev`/`curr` loop, but start `prev` at `groupNext` instead of `null`, and stop when `curr === groupNext`. The group's old first node then automatically points at the rest of the list.

Then stitch: `first = groupPrev.next` (the old first node, now the group's tail), `groupPrev.next = kth` (the new first node), and `groupPrev = first`. Repeat until a group comes up short.

Each node is touched about twice (once by the `k`-step check, once by the reversal), so the whole thing is O(n) time with O(1) extra space.
