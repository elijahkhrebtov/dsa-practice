# Hint 2

The longest path whose highest node is `node` has `height(left) + height(right)` edges (with heights counted in nodes, and an empty subtree having height 0). The diameter is the maximum of that over **all** nodes — not just the root.

Don't call a separate height function at every node (that redoes the same work over and over). Instead write one post-order DFS that **returns** the height of the subtree to its parent, and, as a side effect, updates a best-so-far variable with `leftHeight + rightHeight` at every node it visits.
