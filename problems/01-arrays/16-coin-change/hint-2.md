# Hint 2

Let `dp[a]` = fewest coins to make amount `a`. Then

`dp[a] = 1 + min(dp[a - c])` over every coin `c <= a` whose `dp[a - c]` is achievable, with `dp[0] = 0`.

Recursing on this directly recomputes the same sub-amounts exponentially many times. This is an unbounded-knapsack style **dynamic programming** problem: fill a table for every amount from `0` up to `amount`, so each sub-answer is computed once.
