# Hint 3

Keep a boolean array `dp` of length `n + 1` where `dp[i]` means "the first `i` characters can be split". The empty prefix works: `dp[0] = true`.

For each `i` from 1 to `n`, try every candidate last word `s[j..i)`: if `dp[j]` is true **and** that substring is in the set, then `dp[i]` is true. You only need to look back as far as the longest dictionary word. The answer is `dp[n]`.
