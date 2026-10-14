# Hint 3

Let `first = i < s.length && (p[j] === s[i] || p[j] === '.')`.

- Base case: `j === p.length` → match only if `i === s.length`.
- If `p[j + 1] === '*'`: `match(i, j) = match(i, j + 2) || (first && match(i + 1, j))`.
- Otherwise: `match(i, j) = first && match(i + 1, j + 1)`.

Bottom-up, fill `dp[i][j]` for `i` from `s.length` **down to 0**. Include `i = s.length`, because patterns like `"a*b*"` still match the empty remainder. Go `j` from `p.length - 1` down to 0. The answer is `dp[0][0]`.
