# Hint 2

Every subproblem is "LCS of the first `i` letters of `text1` and the first `j` letters of `text2`". There are only `(m+1)·(n+1)` of them, so this is a classic 2D **dynamic programming** table.

The recursion without a table branches in two on every mismatch and solves the same `(i, j)` pairs again and again. That's why it is exponential.
