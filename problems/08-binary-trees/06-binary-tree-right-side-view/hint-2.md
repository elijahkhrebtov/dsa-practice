# Hint 2

Do a level-by-level BFS, exactly like Binary Tree Level Order Traversal: at the start of each round the queue holds one whole level. While processing a level, the **last** node you dequeue in that round is the visible one — record its value. You don't even need to store the whole level.

(A DFS works too: if you visit right children before left children and carry the depth along, the first node you reach at each new depth is the visible one.)
