# Hint 3

1. Make an array `dp` of length `amount + 1` filled with `Infinity` (meaning "impossible so far"), and set `dp[0] = 0`.
2. For `a` from 1 to `amount`, for each coin `c` with `c <= a`: `dp[a] = min(dp[a], dp[a - c] + 1)`. (`Infinity + 1` is still `Infinity`, so impossible amounts stay impossible.)
3. Return `dp[amount] === Infinity ? -1 : dp[amount]`.

Bottom-up avoids recursion entirely, so there's no risk of overflowing the call stack for large amounts.
