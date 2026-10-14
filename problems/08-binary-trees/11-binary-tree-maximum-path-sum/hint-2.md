# Hint 2

Write a post-order DFS that **returns one thing and records another**:

- It **returns** the best downward path starting at this node. That uses at most one child, because the parent is going to extend it upward and a path can't fork.
- It **records**, in a variable outside the recursion, the best path that turns at this node. That one may use both children.

A child whose best downward sum is negative only hurts, so treat it as 0 (don't take that branch).
