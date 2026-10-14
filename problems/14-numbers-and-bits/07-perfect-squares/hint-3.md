# Hint 3

Make an array `dp` of length n + 1, with `dp[0] = 0`. For each `i` from 1 to n, try every `j` with `j * j ≤ i` and set `dp[i]` to the smallest `dp[i − j*j] + 1`. Return `dp[n]`. That's O(n√n).

Another view: it's the shortest path from `n` to `0` where each step subtracts a square. BFS level by level (with a visited set) finds it, and the level where you first reach 0 is the answer.
