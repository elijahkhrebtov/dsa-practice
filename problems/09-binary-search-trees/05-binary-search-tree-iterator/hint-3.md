# Hint 3

- **constructor**: push the root and its whole left spine (go left until null, pushing each node).
- **next()**: pop the top node, which is the answer. Before returning its value, push the left spine of its **right** child: the right child, then its left child, and so on. Those values come right after it in sorted order.

One `next()` may push many nodes, but each node is pushed and popped exactly once over the whole iteration, so the cost averages to O(1) per call. The stack never holds more than one root-to-leaf path: O(h).
