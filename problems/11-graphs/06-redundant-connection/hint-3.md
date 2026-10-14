# Hint 3

Set `parent[v] = v` for `v` in 1 … n. Then walk the edges in order:

- Find the root of each endpoint.
- If the roots are the same, the endpoints were already connected, so return this edge exactly as given.
- Otherwise merge the two sets by attaching one root under the other.

Make `find` compress paths (point every vertex you pass straight at the root) and merge by rank or size. Without either optimisation, a star whose edges are all `[1, i]` turns into a tall chain and the whole thing becomes quadratic.
