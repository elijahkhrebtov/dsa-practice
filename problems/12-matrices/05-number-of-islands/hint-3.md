# Hint 3

Make the traversal iterative, because the 1000 × 1000 snake island would overflow a recursive one:

1. On finding a `'1'` at `(r, c)`: `count++`, set it to `'0'` and push it on a stack.
2. While the stack isn't empty, pop a cell. For each of its 4 neighbours (no diagonals) that is inside the grid and still `'1'`, set it to `'0'` **right away** and push it.

Sinking on push guarantees no cell enters the stack twice. Remember that the cells are the strings `'1'` and `'0'`.
