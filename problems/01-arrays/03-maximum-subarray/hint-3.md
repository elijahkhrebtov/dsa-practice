# Hint 3

For each `x` in `nums`:

1. `current = max(x, current + x)` — either start a new subarray at `x` or extend the previous one.
2. `best = max(best, current)`.

Initialize both with the **first element** (not with 0), and start the loop at index 1. Initializing with 0 silently breaks the all-negative case.
