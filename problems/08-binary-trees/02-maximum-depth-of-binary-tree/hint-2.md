# Hint 2

**DFS (post-order, "return info up"):** `depth(node) = 1 + max(depth(left), depth(right))`, with `depth(null) = 0`. That's the whole recursion.

**BFS alternative:** process the tree one level at a time with a queue — at the start of each round, the queue holds exactly one level, so handle that many nodes (enqueueing their children) and add 1 to a counter. The counter after the queue empties is the depth.
