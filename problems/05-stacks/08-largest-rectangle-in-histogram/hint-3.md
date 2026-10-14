# Hint 3

For `i` from `0` to `n`, treat `heights[n]` as `0`. That imaginary zero bar at the end flushes everything that is still on the stack.

- While the stack is non-empty and `heights[top] >= current height`: pop `top`. Its rectangle has height `heights[top]`. The width runs from just after the new top of the stack (or from index 0 if the stack is now empty) up to `i - 1`. So the width is `i - newTop - 1`, or `i` when the stack is empty. Update the best area.
- Push `i`.

Each index is pushed and popped once, so this is O(n). Check your width formula on `[2, 1, 2]` (answer 3) and `[1, 2, 3]` (answer 4).
