# Hint 3

The iterative in-order walk makes stopping early easy:

- Keep a stack and a pointer `node = root`.
- Loop: push `node` and move to `node.left` until `node` is null (go as far left as possible).
- Pop a node from the stack. That's the next value in sorted order. Decrement `k`, and if it hits 0, return this value.
- Continue from the popped node's right child.

Recursive version: keep a counter outside the recursion and return as soon as the answer is found, without exploring the remaining subtrees.
