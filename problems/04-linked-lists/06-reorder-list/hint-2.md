# Hint 2

The problem breaks down into three classic building blocks, all O(n) time and O(1) space:

1. **Find the middle** with fast & slow pointers.
2. **Reverse** the second half in place (Reverse Linked List).
3. **Interleave** the two halves: one node from the first, one from the second, and so on.

Don't forget to **cut** the first half off from the second (set the `next` of the end of the first half to `null`), or you'll create a cycle.
