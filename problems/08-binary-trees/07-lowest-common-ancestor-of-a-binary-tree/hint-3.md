# Hint 3

The recursive function:

1. If the node is `null`, `p` or `q`, return the node right away — no need to look deeper. If the other target is underneath, this node is the LCA anyway.
2. Recurse into the left and right children.
3. If **both** calls returned something non-null, the targets are split across this node: return this node.
4. Otherwise return whichever side was non-null (or `null` if neither was).

The value returned at the root is the answer.
