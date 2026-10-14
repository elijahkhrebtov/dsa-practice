# Hint 2

You need to answer "are `u` and `v` already in the same group?" and "merge their groups" quickly. That is exactly what **union-find** (disjoint set union) does.

Alternatively, count how many times you have to *start* a new BFS/DFS from an unvisited vertex. Either way, keep it iterative: one test is a single path through 200,000 vertices.
