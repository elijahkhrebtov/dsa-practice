# Hint 1

Checking `node.left.val < node.val < node.right.val` at every node is **not** enough. Look at example 3: the 3 is fine compared with its parent 6, but not with its grandparent 5.

When you're standing at some node deep in the tree, what do its ancestors tell you about the values it may hold?
