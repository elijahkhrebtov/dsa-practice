# Hint 2

That's a **dynamic programming** recurrence: `ways(r, c) = ways(r-1, c) + ways(r, c-1)` for a free cell, and `0` for an obstacle, with `ways(0, 0) = 1` if the start is free.

Fill the counts row by row, left to right, so both inputs are ready when you need them. Since each row only depends on the row above, a single array of length `n` that you update in place is enough: before you update `dp[c]` it still holds the value from the row above, and `dp[c - 1]` already holds the new value to the left.

Careful with the first row and column — an obstacle there blocks everything after it.
