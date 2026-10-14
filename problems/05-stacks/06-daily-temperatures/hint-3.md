# Hint 3

Fill `answer` with zeros. For each day `i`:

1. While the stack isn't empty and the temperature at the index on top is **strictly lower** than `temperatures[i]`, pop that index `j` and set `answer[j] = i - j`.
2. Push `i`. It is now waiting too.

Whatever is still on the stack at the end never found a warmer day, so it keeps its 0. Each index is pushed once and popped at most once, so the total work is O(n) even though there's a loop inside a loop.
