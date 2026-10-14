# Hint 2

`best(n) = 1 + min over every square s ≤ n of best(n − s)`, with `best(0) = 0`.

The same remainders come up again and again (for example `n − 1 − 4` and `n − 4 − 1`), so plain recursion is exponential. Use **dynamic programming**: compute `best` for 0, 1, 2, … up to n in a table, so each value is computed once.
