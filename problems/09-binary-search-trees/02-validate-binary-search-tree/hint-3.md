# Hint 3

Write a DFS `check(node, low, high)`:

- An empty node is valid.
- If `node.val <= low` or `node.val >= high`, return false.
- Otherwise the node is valid if `check(node.left, low, node.val)` and `check(node.right, node.val, high)` are both valid.

Start with `check(root, -Infinity, Infinity)`. Don't use `-2^31` / `2^31 - 1` as the starting bounds, because those values are legal node values.

Alternative: walk the tree **in order** and make sure each value is strictly greater than the previous one. Store "no previous value yet" as `null` and compare with `!== null`, because a previous value of `0` is falsy.
