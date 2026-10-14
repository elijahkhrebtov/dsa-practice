# Hint 3

Keep three sets — taken **columns**, taken **`r - c`** values and taken **`r + c`** values — plus an array `queens[r]` = the column of the queen in row r.

In `place(r)`: for each column `c`, skip it if `c`, `r - c` or `r + c` is taken; otherwise add all three, set `queens[r] = c`, call `place(r + 1)`, then delete all three again.

When `r === n`, build a **new** board from `queens` (row r is `c` dots, a `Q`, then `n - c - 1` dots) and add it to the results.
