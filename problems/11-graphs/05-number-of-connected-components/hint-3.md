# Hint 3

Union-find:

- `parent[i] = i` for everyone, and `components = n`.
- `find(x)`: walk up the parent pointers to the root. On the way back, point each visited vertex straight at the root (**path compression**).
- For each edge, find both roots. If they are equal, skip the edge. Otherwise hang the root of the smaller tree under the root of the larger one (**union by size/rank**) and decrement `components`.

Link the roots, never the raw endpoints. Without at least one of the two optimisations, a star whose edges are all `[0, i]` turns into a tall chain, and every `find` becomes O(n).
