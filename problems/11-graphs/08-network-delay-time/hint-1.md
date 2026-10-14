# Hint 1

The answer is just "the largest shortest-path distance from `k`", so the real job is computing the shortest distance from `k` to **every** node.

Plain BFS gives shortest paths when every edge costs the same. Here edges have different weights — why does BFS's "first time I reach a node is the best" break? (Look at Example 4.)
