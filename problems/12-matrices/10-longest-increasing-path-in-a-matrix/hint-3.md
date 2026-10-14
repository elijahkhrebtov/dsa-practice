# Hint 3

Peel the matrix like an onion (Kahn's topological sort, run from the top down):

1. For every cell count its **out-degree** = number of neighbours with a strictly larger value.
2. Cells with out-degree 0 are local peaks — every increasing path ends at one. They form layer 1.
3. Process a whole layer at a time: for each cell in it, every **smaller** neighbour loses one out-degree; neighbours that drop to 0 go into the next layer.
4. Count the layers until nothing is left. That count is the answer — a cell lands in layer k exactly when the longest path starting from it has k cells.

(Alternatively: memoized DFS with an explicit stack instead of recursion.)
