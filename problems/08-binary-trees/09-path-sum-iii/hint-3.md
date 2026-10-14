# Hint 3

Do a DFS that carries the running sum, with a map that starts as `{ 0: 1 }` (the empty prefix, so paths starting at the root count). At each node:

1. Add the node's value to the running sum `S`.
2. Add `map[S - targetSum]` to the answer, **before** recording `S` itself.
3. Increment `map[S]`, recurse into both children, then **decrement** `map[S]` on the way back out.

Step 3's decrement matters: the map must describe only the current root-to-node path, or sums from one branch will pair up with nodes in another.
