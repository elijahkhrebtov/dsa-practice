# Hint 2

All weights are non-negative, which is exactly when **Dijkstra's algorithm** works: always expand the not-yet-finalized node with the smallest known distance. Once a node is the smallest, no later path can beat it, because every further edge only adds time.

"Repeatedly take the smallest" is a job for a **min-heap**. First turn `times` into an adjacency list (`adj[u]` = list of `[v, w]`).
