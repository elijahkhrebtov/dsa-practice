# Hint 2

Keep the current k candidates in a **max-heap** keyed by squared distance, so the farthest candidate is on top.

Push `[dist², point]` tuples with a comparator such as `(a, b) => b[0] - a[0]`.
