# Hint 1

Since every step goes to a strictly larger value, a path can never return to a cell it has already visited. So you don't need a `visited` set at all.

Let `best(cell)` be the length of the longest increasing path that **starts** at that cell. How does `best(cell)` relate to the `best` values of its larger neighbours? How many times would a plain DFS from every cell recompute the same `best(cell)`?
