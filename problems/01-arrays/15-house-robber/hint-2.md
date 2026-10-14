# Hint 2

Let `best(i)` be the most you can rob from houses `0..i`. Hint 1 gives the recurrence:

`best(i) = max(best(i - 1), best(i - 2) + nums[i])`

Writing it as plain recursion recomputes the same `best(k)` over and over (it branches like Fibonacci). This is **dynamic programming**: compute each `best(i)` once, from left to right, and reuse it.
