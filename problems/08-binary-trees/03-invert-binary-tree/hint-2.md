# Hint 2

Visit every node once (any order works: pre-order, post-order, or BFS) and **swap its two child pointers**. Swapping at a node moves whole subtrees, and since every node gets its own swap, every level ends up mirrored.

Recursively: invert the left subtree, invert the right subtree, then attach the inverted left as the new right and the inverted right as the new left. Save one of the children in a temporary variable (or use destructuring) so you don't overwrite it before you use it. Return the node.
