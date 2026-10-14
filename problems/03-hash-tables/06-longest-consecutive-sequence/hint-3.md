# Hint 3

A value `x` starts a run exactly when `x - 1` is **not** in the set. Only from those values, walk upwards while the next value is present and record the length. Every run is walked once, so the total work is O(n).

Loop over the **set**, not over `nums`. If the first value of a long run appears thousands of times in `nums`, you'd otherwise walk that run thousands of times.
