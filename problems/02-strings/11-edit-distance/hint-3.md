# Hint 3

With `dp[i][0] = i` and `dp[0][j] = j`:

- If `word1[i-1] === word2[j-1]`: `dp[i][j] = dp[i-1][j-1]`.
- Otherwise: `dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])`. The three terms are replace, delete from `word1`, and insert into `word1`.

Fill the table row by row and return `dp[m][n]`. Each row only reads the previous row and the cell to its left, so two rows are enough. Remember that each row starts with `i`.
