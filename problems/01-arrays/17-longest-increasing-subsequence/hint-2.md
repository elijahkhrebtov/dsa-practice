# Hint 2

**Baseline DP (O(n²)).** Let `dp[i]` = length of the longest increasing subsequence ending at `i`. It's `1` (just `nums[i]`) or `dp[j] + 1` for any earlier `j` with `nums[j] < nums[i]` — take the best. The answer is the maximum over all `dp[i]` (not necessarily `dp[n - 1]`).

**Follow-up idea (O(n log n)).** Instead of "best length ending here", track, for every length `L`, the **smallest possible last value** of an increasing subsequence of length `L`. A smaller tail is always at least as easy to extend. Those tails form a sorted array — what can you do quickly on a sorted array?
