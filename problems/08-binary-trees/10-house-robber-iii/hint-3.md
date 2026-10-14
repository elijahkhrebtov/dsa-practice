# Hint 3

Do a post-order DFS where `dfs(node)` returns a pair `[withNode, withoutNode]`, and `dfs(null)` is `[0, 0]`. After getting both children's pairs:

- `withNode` = the node's value + each child's `withoutNode`
- `withoutNode` = for each child, the larger of its two numbers, added together

The answer is the larger of the root's two numbers. Every node is visited once, so it runs in O(n).
