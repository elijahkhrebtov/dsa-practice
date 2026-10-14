# Hint 2

Use a single **post-order DFS** where each call returns a node instead of a boolean:

- `null` if neither `p` nor `q` is in this subtree,
- `p` or `q` if it found one of them,
- the LCA itself once it has been found.

Avoid calling a separate "is `p` in this subtree?" search at every node — that re-scans the same nodes over and over (O(n·h)).
