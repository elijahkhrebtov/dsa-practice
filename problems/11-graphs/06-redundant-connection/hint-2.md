# Hint 2

You need a structure that answers "are `a` and `b` already connected?" and "connect `a` and `b`" while edges keep arriving, in near-constant time per edge. That's **union-find** (disjoint set union).

Running a fresh DFS/BFS before each edge also answers the question, but it costs O(n) per edge, which adds up to O(n²) on the big tests.
