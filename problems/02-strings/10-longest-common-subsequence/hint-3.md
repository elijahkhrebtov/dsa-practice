# Hint 3

Let `dp[i][j]` be the answer for the prefixes of length `i` and `j`. Row 0 and column 0 are 0, because an empty prefix has nothing in common with anything.

- If `text1[i-1] === text2[j-1]`: `dp[i][j] = dp[i-1][j-1] + 1`.
- Otherwise: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.

Fill the table row by row and return `dp[m][n]`. Each row only reads the row above it, so two rows are enough.
