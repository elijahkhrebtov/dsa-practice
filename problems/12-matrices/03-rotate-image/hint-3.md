# Hint 3

- Transpose: for each `r`, loop `c` from `r + 1` to `n - 1` and swap `matrix[r][c]` with `matrix[c][r]`. If `c` started at 0, every pair would be swapped twice and the matrix would end up unchanged.
- Then reverse each row in place (two pointers moving toward each other, or `row.reverse()`, which reverses the same array object).

Don't assign new arrays to `matrix[r]` or to `matrix` itself. The caller is holding on to the original objects.
