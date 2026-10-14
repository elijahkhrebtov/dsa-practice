# Hint 2

This is **subset sum**, a 0/1 knapsack: each number is either in the subset or not, and each can be used at most once.

The sums involved are small (at most 200 × 100 / 2 = 10,000). Instead of tracking which subsets you've tried, track which **sums** are reachable: after processing the first `i` numbers, which values `s` in `[0, target]` can be formed? How does that set change when you consider one more number?
